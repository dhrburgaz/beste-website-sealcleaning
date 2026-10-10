/**
 * Prijs- en kortingsmotor voor online materiaalverkoop (V7-09/V7-10). Pure functies, geen database:
 * de server is de enige bron voor prijzen en kortingen; de browser stuurt alleen product-id's, aantallen
 * en codes. Bedragen in centen (gehele getallen), btw per tarief na korting.
 *
 * Promotie: { id, code, type: "percentage"|"fixed"|"free_shipping", value (percentage: basispunten, 1000 = 10 %;
 *   fixed: centen excl. btw), scope: "order"|"products"|"categories", scopeIds: [], startsAt/endsAt: "YYYY-MM-DDTHH:mm"
 *   (Europe/Amsterdam), active, stackable, minSubtotalCents (excl., over de in aanmerking komende regels),
 *   maxDiscountCents, maxUsesTotal, maxUsesPerCustomer, usesCount (gereserveerd + verzilverd) }
 */

export const PROMO_TYPES = ["percentage", "fixed", "free_shipping"];
export const PROMO_SCOPES = ["order", "products", "categories"];
export const FEATURE_FLAGS = ["catalog_enabled", "quotes_enabled", "checkout_enabled", "coupon_enabled", "payments_enabled", "appointments_enabled"];
export const DEFAULT_FEATURES = { catalog_enabled: true, quotes_enabled: true, checkout_enabled: false, coupon_enabled: false, payments_enabled: false, appointments_enabled: true };
export const MAX_QTY = 999;
export const MAX_LINES = 50;

/** Lokale Amsterdamse tijd "YYYY-MM-DDTHH:mm" → UTC-milliseconden (houdt rekening met zomertijd). */
export function amsterdamToUtcMs(local) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(String(local || ""));
  if (!m) return null;
  const asUtc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  // Bepaal de offset van Amsterdam op dat moment (twee iteraties vangen de DST-grens op).
  let guess = asUtc;
  for (let i = 0; i < 2; i++) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Amsterdam", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
      .formatToParts(new Date(guess)).filter((p) => p.type !== "literal").map((p) => [p.type, p.value]));
    const shown = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute);
    guess = asUtc - (shown - guess);
  }
  return guess;
}

const vatOf = (exclCents, rate) => Math.round((exclCents * rate) / 100);

/** Verdeelt `amount` naar rato over `weights` (gehele centen, som exact gelijk). */
export function allocate(amount, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  if (!total || !amount) return weights.map(() => 0);
  const raw = weights.map((w) => (amount * w) / total);
  const out = raw.map(Math.floor);
  let rest = amount - out.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0]);
  for (let k = 0; rest > 0; k = (k + 1) % order.length, rest--) out[order[k][1]]++;
  return out;
}

/** Controle van één code; geeft { ok, reason } met een begrijpelijke reden. */
export function checkPromotion(p, { nowMs, eligibleSubtotal, customerUses = 0 }) {
  if (!p || !p.active) return { ok: false, reason: "Deze kortingscode bestaat niet of is niet actief." };
  const start = p.startsAt ? amsterdamToUtcMs(p.startsAt) : null;
  const end = p.endsAt ? amsterdamToUtcMs(p.endsAt) : null;
  if (start != null && nowMs < start) return { ok: false, reason: "Deze kortingscode is nog niet geldig." };
  if (end != null && nowMs >= end) return { ok: false, reason: "Deze kortingscode is verlopen." };
  if (p.maxUsesTotal != null && p.usesCount >= p.maxUsesTotal) return { ok: false, reason: "Deze kortingscode is helaas op: het maximale aantal keer gebruik is bereikt." };
  if (p.maxUsesPerCustomer != null && customerUses >= p.maxUsesPerCustomer) return { ok: false, reason: "U heeft deze kortingscode al het maximale aantal keer gebruikt." };
  if (eligibleSubtotal <= 0) return { ok: false, reason: "Deze kortingscode geldt niet voor de artikelen in uw winkelmandje." };
  if (p.minSubtotalCents && eligibleSubtotal < p.minSubtotalCents) {
    return { ok: false, reason: `Deze kortingscode geldt vanaf ${(p.minSubtotalCents / 100).toLocaleString("nl-NL", { style: "currency", currency: "EUR" })} excl. btw aan geldige artikelen.` };
  }
  return { ok: true };
}

/**
 * Prijst een winkelmandje.
 * @param {{productId, qty}[]} cartLines
 * @param {Map<string, {id, title, unit, priceExclCents, vatRate, active, maxPerOrder, category}>} products
 * @param {object[]} promotions  gevonden promoties voor de ingevoerde codes (op code, hoofdletterongevoelig)
 * @param {{ codes: string[], nowMs: number, shipping: {method, priceExclCents, vatRate}|null, customerUses?: Object<string, number> }} ctx
 */
export function priceCart(cartLines, products, promotions, ctx) {
  const errors = [];
  if (!Array.isArray(cartLines) || !cartLines.length) return { ok: false, errors: ["Uw winkelmandje is leeg."], lines: [] };
  if (cartLines.length > MAX_LINES) return { ok: false, errors: [`Maximaal ${MAX_LINES} verschillende artikelen per bestelling.`], lines: [] };
  const merged = new Map();
  for (const l of cartLines) {
    const qty = Number(l?.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) { errors.push("Ongeldig aantal in het winkelmandje."); continue; }
    merged.set(l.productId, (merged.get(l.productId) || 0) + qty);
  }
  const lines = [];
  for (const [productId, qty] of merged) {
    const p = products.get(productId);
    if (!p || !p.active) { errors.push(`Een artikel in uw winkelmandje is niet (meer) leverbaar.`); continue; }
    const max = Math.min(p.maxPerOrder || MAX_QTY, MAX_QTY);
    if (qty > max) { errors.push(`Van “${p.title}” kunt u maximaal ${max} ${p.unit || "stuks"} per bestelling bestellen.`); continue; }
    lines.push({ productId, title: p.title, unit: p.unit, category: p.category, qty, unitPriceExclCents: p.priceExclCents, vatRate: p.vatRate, lineExclCents: p.priceExclCents * qty, discountExclCents: 0 });
  }
  if (!lines.length) return { ok: false, errors: errors.length ? errors : ["Uw winkelmandje is leeg."], lines: [] };

  // Kortingscodes: alleen server-side; niet-stapelbaar betekent: geen enkele andere code ernaast.
  const codes = [...new Set((ctx.codes || []).map((c) => String(c).trim().toUpperCase()).filter(Boolean))].slice(0, 3);
  const applied = [];
  const rejected = [];
  let freeShipping = false;
  const found = codes.map((c) => ({ code: c, p: promotions.find((x) => x.code.toUpperCase() === c) }));
  if (found.length > 1 && found.some((f) => f.p && !f.p.stackable)) {
    for (const f of found) rejected.push({ code: f.code, reason: "Deze kortingscodes zijn niet met elkaar te combineren. Kies er één." });
  } else {
    for (const { code, p } of found) {
      const eligible = (l) => !p || p.scope === "order" || (p.scope === "products" && p.scopeIds.includes(l.productId)) || (p.scope === "categories" && p.scopeIds.includes(l.category));
      const eligibleLines = lines.filter(eligible);
      const eligibleSubtotal = eligibleLines.reduce((a, l) => a + l.lineExclCents - l.discountExclCents, 0);
      const chk = checkPromotion(p, { nowMs: ctx.nowMs, eligibleSubtotal, customerUses: ctx.customerUses?.[p?.id] || 0 });
      if (!chk.ok) { rejected.push({ code, reason: chk.reason }); continue; }
      if (p.type === "free_shipping") {
        if (!ctx.shipping || !ctx.shipping.priceExclCents) { rejected.push({ code, reason: "Deze code geeft gratis bezorging, maar voor uw bestelling worden geen bezorgkosten gerekend." }); continue; }
        freeShipping = true; applied.push({ code, promotionId: p.id, type: p.type, amountExclCents: ctx.shipping.priceExclCents, label: "Gratis bezorging" });
        continue;
      }
      let amount = p.type === "percentage" ? Math.round((eligibleSubtotal * p.value) / 10000) : p.value;
      if (p.maxDiscountCents != null) amount = Math.min(amount, p.maxDiscountCents);
      amount = Math.max(0, Math.min(amount, eligibleSubtotal)); // nooit negatief, nooit meer dan het bedrag
      if (!amount) { rejected.push({ code, reason: "Deze kortingscode levert voor uw winkelmandje geen korting op." }); continue; }
      const parts = allocate(amount, eligibleLines.map((l) => l.lineExclCents - l.discountExclCents));
      eligibleLines.forEach((l, i) => { l.discountExclCents += parts[i]; });
      applied.push({ code, promotionId: p.id, type: p.type, amountExclCents: amount, label: p.type === "percentage" ? `${p.value / 100}% korting` : "Korting" });
    }
  }

  // Btw per tarief over het bedrag ná korting (korting verlaagt de btw-grondslag).
  const vatByRate = {};
  for (const l of lines) {
    l.netExclCents = l.lineExclCents - l.discountExclCents;
    vatByRate[l.vatRate] = (vatByRate[l.vatRate] || 0) + l.netExclCents;
  }
  let shippingExcl = 0;
  if (ctx.shipping) {
    shippingExcl = freeShipping ? 0 : ctx.shipping.priceExclCents;
    vatByRate[ctx.shipping.vatRate] = (vatByRate[ctx.shipping.vatRate] || 0) + shippingExcl;
  }
  const vat = Object.entries(vatByRate).map(([rate, base]) => ({ rate: Number(rate), baseExclCents: base, vatCents: vatOf(base, Number(rate)) }));
  const subtotalExcl = lines.reduce((a, l) => a + l.lineExclCents, 0);
  const discountExcl = lines.reduce((a, l) => a + l.discountExclCents, 0);
  const totalExcl = subtotalExcl - discountExcl + shippingExcl;
  const vatTotal = vat.reduce((a, v) => a + v.vatCents, 0);
  return {
    ok: !errors.length, errors, lines, applied, rejected,
    shipping: ctx.shipping ? { method: ctx.shipping.method, exclCents: shippingExcl, free: freeShipping } : null,
    subtotalExclCents: subtotalExcl, discountExclCents: discountExcl, totalExclCents: totalExcl, vat, vatCents: vatTotal, totalInclCents: totalExcl + vatTotal
  };
}

/**
 * Van/voor-prijs (ACM): alleen tonen als de 'van'-prijs de laagste eigen prijs van de 30 dagen vóór de verlaging is.
 * history: [{ at: ISO, priceExclCents }] (alle prijswijzigingen, oplopend). Geeft null als er geen geldige referentie is.
 */
export function referencePrice(history, currentPriceExclCents) {
  if (!Array.isArray(history) || !history.length) return null;
  const sorted = [...history].sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  const lastChange = sorted[sorted.length - 1];
  if (lastChange.priceExclCents !== currentPriceExclCents) return null; // historie niet actueel → niets tonen
  const reductionAt = Date.parse(lastChange.at);
  const from = reductionAt - 30 * 86400e3;
  // Prijs die gold aan het begin van het venster + alle wijzigingen binnen het venster (vóór de verlaging).
  const before = sorted.filter((h) => Date.parse(h.at) < reductionAt);
  if (!before.length) return null;
  const firstKnown = Date.parse(before[0].at);
  if (firstKnown > from) return null; // product korter dan 30 dagen bekend: geen van-prijs tonen (veilige keuze)
  const inWindow = before.filter((h) => Date.parse(h.at) >= from);
  const atStart = [...before].reverse().find((h) => Date.parse(h.at) <= from);
  const candidates = [...inWindow, atStart].filter(Boolean).map((h) => h.priceExclCents);
  const lowest = Math.min(...candidates);
  return lowest > currentPriceExclCents ? { fromExclCents: lowest, sinceMs: reductionAt } : null;
}
