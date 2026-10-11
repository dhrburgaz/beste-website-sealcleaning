/**
 * Online materiaalverkoop (V7-09/V7-10). Alles achter feature flags (standaard uit). De server is de enige
 * bron voor prijs, korting en btw; de browser stuurt alleen product-id's, aantallen en codes.
 * Bestelling = betalingsverplichting pas na expliciete knop; "betaald" pas na geverifieerde webhook.
 */
import { createHash } from "node:crypto";
import { HttpError, readJson, rateLimit } from "../http.js";
import { now, newId, newRef, audit, getSetting, setSetting } from "../db.js";
import { guards } from "../app.js";
import { token, sha256 } from "../auth.js";
import { queueMail } from "../mail.js";
import { priceCart, referencePrice, DEFAULT_FEATURES, FEATURE_FLAGS, PROMO_TYPES, PROMO_SCOPES, MAX_QTY } from "../commerce.js";

const str = (v, max = 200) => (v == null ? null : String(v).trim().slice(0, max) || null);
const money = (c) => (c / 100).toFixed(2);

export function features(db) { return { ...DEFAULT_FEATURES, ...getSetting(db, "features", {}) }; }
function delivery(db) {
  return getSetting(db, "shopDelivery", { methods: [
    { id: "afhalen", label: "Afhalen na afspraak", priceExclCents: null, vatRate: 21, enabled: false },
    { id: "bezorgen", label: "Bezorgen", priceExclCents: null, vatRate: 21, enabled: false }
  ] }).methods;
}
/** Alleen methodes met een vastgestelde prijs zijn kiesbaar; onbekende kosten nooit als € 0. */
const usableMethods = (db) => delivery(db).filter((m) => m.enabled && Number.isInteger(m.priceExclCents) && m.priceExclCents >= 0);

function checkoutState(db, cfg) {
  const f = features(db);
  const reasons = [];
  if (!f.checkout_enabled) reasons.push("Online bestellen is nog niet geopend.");
  if (!f.payments_enabled || !cfg.mollieKey) reasons.push("Online betalen is nog niet operationeel.");
  if (!usableMethods(db).length) reasons.push("Bezorg- of afhaalkosten zijn nog niet vastgesteld.");
  return { open: !reasons.length, reasons, couponsOpen: f.coupon_enabled === true };
}

function loadProducts(db) {
  return new Map(db.all("SELECT * FROM shop_products").map((p) => [p.id, { id: p.id, title: p.title, unit: p.unit, category: p.category, catalogId: p.catalog_id, priceExclCents: p.price_excl, vatRate: p.vat_rate, active: !!p.active, maxPerOrder: p.max_per_order }]));
}
function promoFromRow(db, r) {
  const uses = db.get("SELECT COUNT(*) n FROM promotion_uses WHERE promotion_id = ? AND status IN ('reserved','redeemed')", r.id).n;
  return { id: r.id, code: r.code, type: r.type, value: r.value, scope: r.scope, scopeIds: JSON.parse(r.scope_ids_json || "[]"), startsAt: r.starts_at, endsAt: r.ends_at,
    active: !!r.active, stackable: !!r.stackable, minSubtotalCents: r.min_subtotal, maxDiscountCents: r.max_discount, maxUsesTotal: r.max_uses_total, maxUsesPerCustomer: r.max_uses_per_customer, usesCount: uses };
}
const customerHash = (cfg, email) => createHash("sha256").update(`${cfg.ipHashSecret || "seal"}|${String(email || "").trim().toLowerCase()}`).digest("base64url").slice(0, 32);

function priceRequest(db, cfg, body, { email } = {}) {
  const st = checkoutState(db, cfg);
  const codes = Array.isArray(body.codes) ? body.codes.map((c) => String(c).slice(0, 40)) : [];
  if (codes.length && !st.couponsOpen) return { result: null, couponError: "Kortingscodes zijn op dit moment niet actief." };
  const method = usableMethods(db).find((m) => m.id === body.delivery) || null;
  const placeholders = codes.map(() => "?").join(",");
  const promos = codes.length ? db.all(`SELECT * FROM promotions WHERE UPPER(code) IN (${placeholders})`, ...codes.map((c) => c.trim().toUpperCase())).map((r) => promoFromRow(db, r)) : [];
  const ch = email ? customerHash(cfg, email) : null;
  const customerUses = {};
  if (ch) for (const p of promos) customerUses[p.id] = db.get("SELECT COUNT(*) n FROM promotion_uses WHERE promotion_id = ? AND customer_hash = ? AND status IN ('reserved','redeemed')", p.id, ch).n;
  const lines = Array.isArray(body.lines) ? body.lines.slice(0, 60).map((l) => ({ productId: String(l?.productId || ""), qty: Number(l?.qty) })) : [];
  return { result: priceCart(lines, loadProducts(db), promos, { codes, nowMs: Date.now(), shipping: method ? { method: method.id, priceExclCents: method.priceExclCents, vatRate: method.vatRate } : null, customerUses }), method };
}

/** Publiek prijsoverzicht zonder interne velden. */
function publicSummary(r) {
  return { ok: r.ok, errors: r.errors, applied: r.applied.map(({ code, label, amountExclCents }) => ({ code, label, amountExclCents })), rejected: r.rejected,
    lines: r.lines.map(({ productId, title, unit, qty, unitPriceExclCents, vatRate, lineExclCents, discountExclCents }) => ({ productId, title, unit, qty, unitPriceExclCents, vatRate, lineExclCents, discountExclCents })),
    shipping: r.shipping, subtotalExclCents: r.subtotalExclCents, discountExclCents: r.discountExclCents, vat: r.vat, vatCents: r.vatCents, totalInclCents: r.totalInclCents };
}

function releaseUses(db, orderId) {
  db.run("UPDATE promotion_uses SET status = 'released', updated_at = ? WHERE order_id = ? AND status = 'reserved'", now(), orderId);
}

export function registerShop(r) {
  /* ---------- publiek ---------- */
  r.get("/api/public/shop/config", (ctx) => {
    const st = checkoutState(ctx.db, ctx.cfg);
    ctx.json(200, { checkoutOpen: st.open, reasons: st.reasons, couponsOpen: st.couponsOpen && st.open, deliveryMethods: usableMethods(ctx.db).map(({ id, label, priceExclCents, vatRate }) => ({ id, label, priceExclCents, vatRate })), termsVersion: ctx.cfg.termsVersion });
  });
  r.get("/api/public/shop/products", (ctx) => {
    const f = features(ctx.db);
    if (!f.checkout_enabled) return ctx.json(200, { products: [] });
    const rows = ctx.db.all("SELECT * FROM shop_products WHERE active = 1 ORDER BY title");
    ctx.json(200, { products: rows.map((p) => {
      const hist = ctx.db.all("SELECT price_excl priceExclCents, at FROM shop_price_history WHERE product_id = ? ORDER BY at", p.id);
      const ref = referencePrice(hist, p.price_excl);
      return { id: p.id, catalogId: p.catalog_id, title: p.title, unit: p.unit, priceExclCents: p.price_excl, vatRate: p.vat_rate, maxPerOrder: p.max_per_order, fromExclCents: ref?.fromExclCents ?? null };
    }) });
  });
  r.post("/api/public/shop/price", async (ctx) => {
    rateLimit(`shopprice:${ctx.ipHash}`, 120, 60e3);
    const st = checkoutState(ctx.db, ctx.cfg);
    if (!features(ctx.db).checkout_enabled) throw new HttpError(503, st.reasons[0]);
    const body = await readJson(ctx.req, 32 * 1024);
    const { result, couponError } = priceRequest(ctx.db, ctx.cfg, body);
    if (couponError) return ctx.json(200, { couponError });
    ctx.json(200, publicSummary(result));
  });
  r.post("/api/public/shop/orders", async (ctx) => {
    rateLimit(`shoporder:${ctx.ipHash}`, 10, 3600e3);
    const st = checkoutState(ctx.db, ctx.cfg);
    if (!st.open) throw new HttpError(503, st.reasons.join(" "));
    const key = String(ctx.req.headers["idempotency-key"] || "");
    if (!/^[A-Za-z0-9_-]{16,80}$/.test(key)) throw new HttpError(400, "Ontbrekende of ongeldige bestelsleutel. Herlaad de pagina en probeer opnieuw.");
    const existing = ctx.db.get("SELECT * FROM orders WHERE idempotency_key = ?", key);
    if (existing) return ctx.json(200, { ref: existing.ref, status: existing.status, checkoutUrl: existing.status === "pending_payment" ? existing.checkout_url : null, duplicate: true });
    const b = await readJson(ctx.req, 32 * 1024);
    const c = b.customer || {};
    const name = str(c.name, 120), email = str(c.email, 160), phone = str(c.phone, 40);
    if (!name || name.length < 2) throw new HttpError(400, "Vul uw naam in.");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, "Vul een geldig e-mailadres in.");
    const method = usableMethods(ctx.db).find((m) => m.id === b.delivery);
    if (!method) throw new HttpError(400, "Kies een bezorg- of afhaalmethode.");
    const address = method.id === "bezorgen" ? { street: str(c.street, 120), postal: str(c.postal, 10), city: str(c.city, 80) } : null;
    if (address && (!address.street || !/^\d{4}\s?[A-Za-z]{2}$/.test(address.postal || "") || !address.city)) throw new HttpError(400, "Vul een volledig Nederlands bezorgadres in (straat en huisnummer, postcode, plaats).");
    if (b.agreeTerms !== true) throw new HttpError(400, "Ga akkoord met de algemene voorwaarden om te bestellen.");

    const created = ctx.db.tx(() => {
      const { result, couponError } = priceRequest(ctx.db, ctx.cfg, b, { email });
      if (couponError) throw new HttpError(409, couponError);
      if (!result.ok) throw new HttpError(400, result.errors.join(" "));
      if (result.rejected.length) throw new HttpError(409, "Een kortingscode is niet (meer) geldig.", { rejected: result.rejected });
      if (result.totalInclCents <= 0) throw new HttpError(400, "Het totaalbedrag moet hoger zijn dan € 0.");
      const id = newId("ord"), ref = newRef("B"), statusToken = token();
      ctx.db.run(`INSERT INTO orders (id, ref, idempotency_key, status, name, email, phone, address_json, delivery_method, snapshot_json, total_incl, terms_version, consents_json, status_token_hash, ip_hash, created_at, updated_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, id, ref, key, "pending_payment", name, email, phone, address ? JSON.stringify(address) : null, method.id,
        JSON.stringify(publicSummary(result)), result.totalInclCents, ctx.cfg.termsVersion, JSON.stringify({ terms: true, withdrawalInfoShown: true, newsletter: false }), sha256(statusToken), ctx.ipHash, now(), now());
      const ch = customerHash(ctx.cfg, email);
      for (const a of result.applied) ctx.db.run("INSERT INTO promotion_uses (id, promotion_id, order_id, customer_hash, amount, status, created_at, updated_at) VALUES (?,?,?,?,?,'reserved',?,?)", newId("pu"), a.promotionId, id, ch, a.amountExclCents, now(), now());
      // Laatste controle binnen de transactie: geen overschrijding van gebruikslimieten door gelijktijdige bestellingen.
      for (const a of result.applied) {
        const p = ctx.db.get("SELECT * FROM promotions WHERE id = ?", a.promotionId);
        const n = ctx.db.get("SELECT COUNT(*) n FROM promotion_uses WHERE promotion_id = ? AND status IN ('reserved','redeemed')", p.id).n;
        if (p.max_uses_total != null && n > p.max_uses_total) throw new HttpError(409, "Deze kortingscode is helaas net op.", { rejected: [{ code: a.code, reason: "Het maximale aantal keer gebruik is bereikt." }] });
      }
      return { id, ref, statusToken, total: result.totalInclCents };
    });
    audit(ctx.db, "website", "bestelling aangemaakt (wacht op betaling)", created.ref, ctx.ipHash);

    try {
      const res = await (ctx.cfg.fetchImpl || fetch)("https://api.mollie.com/v2/payments", {
        method: "POST", headers: { Authorization: `Bearer ${ctx.cfg.mollieKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ amount: { currency: "EUR", value: money(created.total) }, description: `Bestelling ${created.ref}`,
          redirectUrl: `${ctx.cfg.siteOrigins[0]}/bestelling/?ref=${created.ref}#t=${created.statusToken}`, webhookUrl: `${ctx.cfg.publicBaseUrl}/api/payments/mollie/webhook`, metadata: { orderId: created.id } })
      });
      if (!res.ok) throw new Error(`mollie ${res.status}`);
      const p = await res.json();
      ctx.db.run("UPDATE orders SET provider_id = ?, checkout_url = ?, updated_at = ? WHERE id = ?", p.id, p._links?.checkout?.href || null, now(), created.id);
      ctx.json(201, { ref: created.ref, status: "pending_payment", checkoutUrl: p._links?.checkout?.href || null });
    } catch {
      ctx.db.tx(() => { ctx.db.run("UPDATE orders SET status = 'failed', updated_at = ? WHERE id = ?", now(), created.id); releaseUses(ctx.db, created.id); });
      throw new HttpError(502, "De betaalpagina kon niet worden geopend. Er is niets afgeschreven en uw bestelling is niet geplaatst. Probeer het later opnieuw.");
    }
  });
  r.get("/api/public/shop/orders/:ref", (ctx) => {
    rateLimit(`shopstatus:${ctx.ipHash}`, 60, 60e3);
    const o = ctx.db.get("SELECT ref, status, total_incl, status_token_hash, paid_at FROM orders WHERE ref = ?", ctx.params.ref);
    const t = ctx.url.searchParams.get("t") || "";
    if (!o || sha256(t) !== o.status_token_hash) throw new HttpError(404, "Bestelling niet gevonden.");
    ctx.json(200, { ref: o.ref, status: o.status, totalInclCents: o.total_incl, paidAt: o.paid_at });
  });

  /* ---------- beheer ---------- */
  const S = (fn, opts) => async (ctx) => { const user = guards.staff(ctx, opts); ctx.actor = user.email; ctx.user = user; await fn(ctx); };
  r.get("/api/admin/shop", S((ctx) => ctx.json(200, {
    features: features(ctx.db), flags: FEATURE_FLAGS, state: checkoutState(ctx.db, ctx.cfg), delivery: delivery(ctx.db),
    products: ctx.db.all("SELECT * FROM shop_products ORDER BY title"),
    promotions: ctx.db.all("SELECT * FROM promotions ORDER BY created_at DESC").map((r) => ({ ...promoFromRow(ctx.db, r), note: r.note })),
    orders: ctx.db.all("SELECT id, ref, status, name, email, delivery_method, total_incl, created_at, paid_at FROM orders ORDER BY created_at DESC LIMIT 300")
  })));
  r.put("/api/admin/shop/features", S(async (ctx) => {
    const b = await readJson(ctx.req);
    const next = { ...features(ctx.db) };
    for (const k of FEATURE_FLAGS) if (k in b) next[k] = b[k] === true;
    setSetting(ctx.db, "features", next);
    audit(ctx.db, ctx.actor, "feature flags gewijzigd", JSON.stringify(next));
    ctx.json(200, next);
  }, { owner: true }));
  r.put("/api/admin/shop/delivery", S(async (ctx) => {
    const b = await readJson(ctx.req);
    const methods = delivery(ctx.db).map((m) => {
      const n = (b.methods || []).find((x) => x.id === m.id) || {};
      const price = n.priceExclCents === null || n.priceExclCents === "" || n.priceExclCents === undefined ? null : Number(n.priceExclCents);
      if (price !== null && !(Number.isInteger(price) && price >= 0 && price < 1e7)) throw new HttpError(400, "Ongeldige bezorgprijs.");
      return { ...m, label: str(n.label, 60) || m.label, priceExclCents: price, enabled: n.enabled === true && price !== null };
    });
    setSetting(ctx.db, "shopDelivery", { methods });
    audit(ctx.db, ctx.actor, "bezorgmethodes gewijzigd");
    ctx.json(200, { methods });
  }, { owner: true }));
  r.post("/api/admin/shop/products", S(async (ctx) => {
    const b = await readJson(ctx.req);
    const price = Number(b.priceExclCents), vat = Number(b.vatRate);
    if (!str(b.title) || !str(b.unit)) throw new HttpError(400, "Titel en eenheid zijn verplicht.");
    if (!(Number.isInteger(price) && price > 0 && price < 1e8)) throw new HttpError(400, "Ongeldige prijs.");
    if (![21, 9, 0].includes(vat)) throw new HttpError(400, "Btw-tarief 21, 9 of 0.");
    const maxQ = b.maxPerOrder == null || b.maxPerOrder === "" ? null : Number(b.maxPerOrder);
    if (maxQ !== null && !(Number.isInteger(maxQ) && maxQ >= 1 && maxQ <= MAX_QTY)) throw new HttpError(400, "Ongeldig maximum per bestelling.");
    const id = b.id && ctx.db.get("SELECT 1 FROM shop_products WHERE id = ?", b.id) ? b.id : null;
    ctx.db.tx(() => {
      if (id) {
        const cur = ctx.db.get("SELECT * FROM shop_products WHERE id = ?", id);
        ctx.db.run("UPDATE shop_products SET catalog_id=?, title=?, unit=?, category=?, price_excl=?, vat_rate=?, active=?, max_per_order=?, updated_at=? WHERE id=?",
          str(b.catalogId, 80), str(b.title, 160), str(b.unit, 20), str(b.category, 40), price, vat, b.active === true ? 1 : 0, maxQ, now(), id);
        if (cur.price_excl !== price) ctx.db.run("INSERT INTO shop_price_history (product_id, price_excl, at) VALUES (?,?,?)", id, price, now());
      } else {
        const nid = newId("sp");
        ctx.db.run("INSERT INTO shop_products (id, catalog_id, title, unit, category, price_excl, vat_rate, active, max_per_order, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
          nid, str(b.catalogId, 80), str(b.title, 160), str(b.unit, 20), str(b.category, 40), price, vat, b.active === true ? 1 : 0, maxQ, now(), now());
        ctx.db.run("INSERT INTO shop_price_history (product_id, price_excl, at) VALUES (?,?,?)", nid, price, now());
      }
    });
    audit(ctx.db, ctx.actor, id ? "webwinkelproduct gewijzigd" : "webwinkelproduct aangemaakt", str(b.title, 80));
    ctx.json(id ? 200 : 201, { ok: true });
  }, { owner: true }));
  r.post("/api/admin/shop/promotions", S(async (ctx) => {
    const b = await readJson(ctx.req);
    const code = String(b.code || "").trim().toUpperCase();
    if (!/^[A-Z0-9-]{3,30}$/.test(code)) throw new HttpError(400, "Code: 3–30 tekens, letters, cijfers en streepje.");
    if (!PROMO_TYPES.includes(b.type) || !PROMO_SCOPES.includes(b.scope)) throw new HttpError(400, "Ongeldig type of bereik.");
    const value = Number(b.value);
    if (b.type === "percentage" && !(Number.isInteger(value) && value > 0 && value <= 10000)) throw new HttpError(400, "Percentage in basispunten (1–10000).");
    if (b.type === "fixed" && !(Number.isInteger(value) && value > 0)) throw new HttpError(400, "Vast bedrag in centen.");
    const dt = (v) => (v == null || v === "" ? null : /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v) ? v : (() => { throw new HttpError(400, "Datum/tijd als JJJJ-MM-DDTUU:MM (Amsterdamse tijd)."); })());
    const intOrNull = (v) => (v == null || v === "" ? null : Number.isInteger(Number(v)) && Number(v) >= 0 ? Number(v) : (() => { throw new HttpError(400, "Ongeldig getal."); })());
    const scopeIds = Array.isArray(b.scopeIds) ? b.scopeIds.map((x) => String(x).slice(0, 80)).slice(0, 100) : [];
    if (b.scope !== "order" && !scopeIds.length) throw new HttpError(400, "Kies minimaal één product of categorie voor het bereik.");
    const exists = ctx.db.get("SELECT id FROM promotions WHERE code = ?", code);
    const vals = [b.type, b.type === "free_shipping" ? 0 : value, b.scope, JSON.stringify(scopeIds), dt(b.startsAt), dt(b.endsAt), b.active === true ? 1 : 0, b.stackable === true ? 1 : 0,
      intOrNull(b.minSubtotalCents), intOrNull(b.maxDiscountCents), intOrNull(b.maxUsesTotal), intOrNull(b.maxUsesPerCustomer), str(b.note, 500)];
    if (exists) ctx.db.run("UPDATE promotions SET type=?, value=?, scope=?, scope_ids_json=?, starts_at=?, ends_at=?, active=?, stackable=?, min_subtotal=?, max_discount=?, max_uses_total=?, max_uses_per_customer=?, note=? WHERE id=?", ...vals, exists.id);
    else ctx.db.run("INSERT INTO promotions (id, code, type, value, scope, scope_ids_json, starts_at, ends_at, active, stackable, min_subtotal, max_discount, max_uses_total, max_uses_per_customer, note, created_at, created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", newId("pr"), code, ...vals, now(), ctx.actor);
    audit(ctx.db, ctx.actor, exists ? "promotie gewijzigd" : "promotie aangemaakt", code);
    ctx.json(exists ? 200 : 201, { ok: true });
  }, { owner: true }));
}

/** Webhook-afhandeling voor bestellingen: status altijd opnieuw bij Mollie opvragen; idempotent. */
export async function handleOrderWebhook(db, cfg, paymentId, fetchImpl = cfg.fetchImpl || fetch) {
  const o = db.get("SELECT * FROM orders WHERE provider_id = ?", paymentId);
  if (!o) return false;
  const r = await fetchImpl(`https://api.mollie.com/v2/payments/${paymentId}`, { headers: { Authorization: `Bearer ${cfg.mollieKey}` } });
  if (!r.ok) throw new HttpError(502, "Kon betaling niet verifiëren.");
  const p = await r.json();
  if (p.metadata?.orderId !== o.id) return true;
  if (p.status === "paid") {
    if (o.status === "paid") return true;
    if (Math.round(Number(p.amount?.value) * 100) !== o.total_incl) { audit(db, "mollie", "betaling met afwijkend bedrag genegeerd", o.ref); return true; }
    db.tx(() => {
      db.run("UPDATE orders SET status = 'paid', paid_at = ?, updated_at = ? WHERE id = ? AND status != 'paid'", p.paidAt || now(), now(), o.id);
      db.run("UPDATE promotion_uses SET status = 'redeemed', updated_at = ? WHERE order_id = ? AND status = 'reserved'", now(), o.id);
    });
    const snap = JSON.parse(o.snapshot_json);
    queueMail(db, { kind: "bestelling", to: o.email, subject: `Bevestiging van uw bestelling ${o.ref}`, text: `Beste ${o.name},\n\nWij hebben uw betaling ontvangen voor bestelling ${o.ref}.\n${snap.lines.map((l) => `- ${l.qty} × ${l.title}`).join("\n")}\nTotaal: € ${money(o.total_incl).replace(".", ",")} incl. btw.\n\nWij nemen contact op over ${o.delivery_method === "afhalen" ? "het afhaalmoment" : "de levering"}. Informatie over herroeping en retour vindt u in onze algemene voorwaarden.\n\nSealcleaning Groenonderhoud en Aanleg` });
    audit(db, "mollie", "bestelling betaald", o.ref);
  } else if (["canceled", "expired", "failed"].includes(p.status) && o.status === "pending_payment") {
    db.tx(() => { db.run("UPDATE orders SET status = ?, updated_at = ? WHERE id = ?", p.status, now(), o.id); releaseUses(db, o.id); });
  }
  return true;
}
