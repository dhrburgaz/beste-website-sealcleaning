/**
 * /winkelmandje/: mandje → gegevens en levering → controleren en betalen (V7-10).
 * Prijzen, korting en btw komen altijd van de server; de browser bewaart alleen id's en aantallen.
 * Zonder geopende checkout: eerlijke melding en alternatieven, nooit een schijnbestelling.
 */
import { readCart, writeCart, setQty, clearCart, apiBase, shopConfig } from "./cart-store.js";

const root = document.querySelector("[data-shop-app]");
const FORM_KEY = "sealCheckoutForm"; // sessionStorage: alleen tijdens deze sessie, gewist na bestellen
const euro = (c) => (c / 100).toLocaleString("nl-NL", { style: "currency", currency: "EUR" });
const incl = (excl, rate) => Math.round(excl * (1 + rate / 100));
const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v; else if (k === "text") el.textContent = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v); else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
};

let config = null;
let step = 1;
let priced = null;
let busy = false;
const live = h("p", { class: "visually-hidden", role: "status", "aria-live": "polite" });
const say = (t) => { live.textContent = ""; setTimeout(() => { live.textContent = t; }, 30); };
const form = (() => { try { return JSON.parse(sessionStorage.getItem(FORM_KEY) || "{}"); } catch { return {}; } })();
const saveForm = () => { try { sessionStorage.setItem(FORM_KEY, JSON.stringify(form)); } catch { /* privémodus */ } };

async function api(path, body, headers = {}) {
  const r = await fetch(apiBase() + path, { method: body ? "POST" : "GET", headers: body ? { "Content-Type": "application/json", ...headers } : headers, body: body ? JSON.stringify(body) : undefined, credentials: "omit" });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(data.error || "Er ging iets mis. Probeer het opnieuw."); e.status = r.status; e.data = data; throw e; }
  return data;
}

async function reprice() {
  const cart = readCart();
  if (!cart.items.length) { priced = null; return; }
  try {
    priced = await api("/api/public/shop/price", { lines: cart.items, codes: cart.codes, delivery: form.delivery || null });
    if (priced.couponError) { cart.codes = []; writeCart(cart); priced = { ...(await api("/api/public/shop/price", { lines: cart.items, codes: [], delivery: form.delivery || null })), couponNote: priced.couponError }; }
  } catch (e) { priced = { error: e.message }; }
}

/* ---------- gesloten / leeg ---------- */
function closedView() {
  return h("div", { class: "shop-closed" },
    h("div", { class: "notice notice--not-configured" }, h("strong", { text: config.reasons?.[0] || "Online bestellen is nog niet geopend." }),
      h("span", { text: "Bij ons werkt het nu zo: wij adviseren over materiaal en hoeveelheid, u bestelt het zelf en wij verzorgen de werkzaamheden volgens een offerte die u zelf accepteert." })),
    h("div", { class: "btn-row", style: "margin-top:1.5rem" },
      h("a", { class: "btn btn-primary", href: "../contact/?materiaal=advies", text: "Vraag advies en een offerte aan" }),
      h("a", { class: "btn btn-secondary", href: "../materialen/", text: "Bekijk materialen" })));
}
function emptyView() {
  return h("div", { class: "notice notice--empty" }, h("strong", { text: "Uw winkelmandje is leeg." }),
    h("span", {}, "Kies materialen in de ", h("a", { href: "../materialen/", text: "materialencatalogus" }), "."));
}

/* ---------- stappen ---------- */
function stepper() {
  const labels = ["Winkelmandje", "Gegevens en levering", "Controleren en betalen"];
  return h("ol", { class: "stepper", "aria-label": "Stappen" }, ...labels.map((l, i) => h("li", { class: i + 1 < step ? "is-done" : null, "aria-current": i + 1 === step ? "step" : null, text: l })));
}

function qtyControl(line) {
  const set = (n) => { setQty(line.productId, n); render(true); say(n > 0 ? `${line.title}: ${n} ${line.unit}` : `${line.title} verwijderd`); };
  const inp = h("input", { type: "number", inputmode: "numeric", min: "1", max: "999", value: String(line.qty), "aria-label": `Aantal ${line.title}` });
  inp.addEventListener("change", () => { const n = Math.max(1, Math.min(999, parseInt(inp.value, 10) || 1)); set(n); });
  return h("div", { class: "qty" },
    h("button", { type: "button", "aria-label": `Eén minder ${line.title}`, disabled: line.qty <= 1, onclick: () => set(line.qty - 1), text: "−" }), inp,
    h("button", { type: "button", "aria-label": `Eén meer ${line.title}`, disabled: line.qty >= 999, onclick: () => set(line.qty + 1), text: "+" }));
}

function summary() {
  if (!priced || priced.error) return h("div", { class: "notice notice--error" }, h("strong", { text: "Prijs kon niet worden berekend." }), h("span", { text: priced?.error || "Probeer het opnieuw." }));
  const p = priced;
  const vatRate = p.vat?.[0]?.rate ?? 21;
  return h("div", { class: "card shop-summary", "aria-label": "Overzicht" },
    h("div", { class: "price-row" }, h("span", { text: "Artikelen (incl. btw)" }), h("span", { class: "price", text: euro(incl(p.subtotalExclCents, vatRate)) })),
    ...p.applied.map((a) => h("div", { class: "price-row shop-discount" }, h("span", { text: `${a.label} (${a.code})` }), h("span", { class: "price", text: `− ${euro(incl(a.amountExclCents, vatRate))}` }))),
    p.shipping ? h("div", { class: "price-row" }, h("span", { text: p.shipping.method === "afhalen" ? "Afhalen" : "Bezorgen" }), h("span", { class: "price", text: p.shipping.free ? "gratis (code)" : euro(incl(p.shipping.exclCents, vatRate)) }))
      : h("div", { class: "price-row muted" }, h("span", { text: "Bezorgen of afhalen" }), h("span", { text: "kiest u in stap 2" })),
    h("div", { class: "price-row price-row--total" }, h("span", { text: "Totaal" }), h("span", { class: "price", text: euro(p.totalInclCents) })),
    h("p", { class: "field-hint", text: `Waarvan btw ${euro(p.vatCents)}. ${p.shipping ? "" : "Exclusief bezorgkosten; die ziet u vóór het betalen."}` }));
}

function couponBox() {
  if (!config.couponsOpen) return null;
  const cart = readCart();
  const inp = h("input", { type: "text", id: "coupon", autocomplete: "off", autocapitalize: "characters", spellcheck: "false" });
  const apply = async () => {
    const code = inp.value.trim();
    if (!code) return;
    const c = readCart(); c.codes = [...new Set([...c.codes, code.toUpperCase()])].slice(0, 3); writeCart(c);
    await reprice();
    const rej = priced?.rejected?.find((x) => x.code === code.toUpperCase());
    if (rej) { const c2 = readCart(); c2.codes = c2.codes.filter((x) => x !== code.toUpperCase()); writeCart(c2); }
    render(); say(rej ? rej.reason : "Kortingscode toegepast");
  };
  const rejected = (priced?.rejected || []);
  return h("details", { class: "shop-coupon", open: cart.codes.length || rejected.length ? true : null },
    h("summary", { text: "Heeft u een kortingscode?" }),
    h("div", { class: "field" }, h("label", { for: "coupon", text: "Kortingscode" }),
      h("div", { class: "shop-coupon-row" }, inp, h("button", { type: "button", class: "btn btn-secondary btn-sm", onclick: apply, text: "Toepassen" }))),
    ...rejected.map((r) => h("p", { class: "field-error", role: "alert", text: `${r.code}: ${r.reason}` })),
    priced?.couponNote ? h("p", { class: "field-error", text: priced.couponNote }) : null,
    ...cart.codes.map((c) => h("button", { type: "button", class: "chip chip--sm", onclick: async () => { const x = readCart(); x.codes = x.codes.filter((y) => y !== c); writeCart(x); await reprice(); render(); say(`Code ${c} verwijderd, totaal bijgewerkt`); } }, `${c} `, h("span", { class: "chip-x", "aria-hidden": "true", text: "×" }), h("span", { class: "visually-hidden", text: " verwijderen" }))));
}

function viewCart() {
  const lines = priced?.lines || [];
  return h("div", { class: "shop-grid" },
    h("div", {},
      h("ul", { class: "shop-lines" }, ...lines.map((l) => h("li", { class: "shop-line" },
        h("div", {}, h("strong", { text: l.title }), h("p", { class: "field-hint", text: `${euro(incl(l.unitPriceExclCents, l.vatRate))} per ${l.unit.replace(/s$/, "")} incl. btw` })),
        qtyControl(l),
        h("span", { class: "price", text: euro(incl(l.lineExclCents, l.vatRate)) }),
        h("button", { type: "button", class: "link-btn", onclick: () => { setQty(l.productId, 0); render(true); say(`${l.title} verwijderd`); }, text: "Verwijderen" })))),
      (priced?.errors || []).map((e) => h("p", { class: "field-error", role: "alert", text: e })),
      couponBox()),
    h("aside", {}, summary(), h("button", { type: "button", class: "btn btn-primary btn-block shop-next", disabled: !priced?.ok, onclick: () => go(2), text: "Verder naar gegevens" })));
}

function field(id, label, attrs = {}, hint) {
  const inp = h("input", { id, name: id, value: form[id] || "", ...attrs });
  inp.addEventListener("input", () => { form[id] = inp.value; saveForm(); });
  return h("div", { class: "field" }, h("label", { for: id }, label, attrs.required ? null : h("span", { class: "hint", text: " (optioneel)" })), inp, hint ? h("span", { class: "hint", text: hint }) : null, h("span", { class: "error-msg", id: `${id}-err` }));
}

function viewDetails() {
  const methods = config.deliveryMethods || [];
  const needsAddress = form.delivery === "bezorgen";
  const fs = h("fieldset", {}, h("legend", { text: "Bezorgen of afhalen" }),
    ...methods.map((m) => h("label", { class: "facet-option" },
      h("input", { type: "radio", name: "delivery", value: m.id, checked: form.delivery === m.id, onchange: async () => { form.delivery = m.id; saveForm(); await reprice(); render(); } }),
      h("span", { text: `${m.label} — ${m.priceExclCents === 0 ? "geen kosten" : euro(incl(m.priceExclCents, m.vatRate))}` }))));
  const f = h("form", { class: "shop-form", novalidate: true, onsubmit: (e) => { e.preventDefault(); if (validate(f)) go(3); } },
    h("div", { class: "form-grid" },
      field("name", "Naam", { autocomplete: "name", required: true }),
      field("email", "E-mailadres", { type: "email", autocomplete: "email", inputmode: "email", required: true }, "Voor de orderbevestiging."),
      field("phone", "Telefoon", { type: "tel", autocomplete: "tel", inputmode: "tel" }, "Alleen om de levering af te stemmen.")),
    fs,
    needsAddress ? h("div", { class: "form-grid" },
      field("street", "Straat en huisnummer", { autocomplete: "street-address", required: true }),
      field("postal", "Postcode", { autocomplete: "postal-code", required: true, inputmode: "text", pattern: "\\d{4}\\s?[A-Za-z]{2}" }),
      field("city", "Plaats", { autocomplete: "address-level2", required: true })) : null,
    h("div", { class: "btn-row" }, h("button", { type: "button", class: "link-btn", onclick: () => go(1), text: "← Terug naar winkelmandje" }), h("button", { type: "submit", class: "btn btn-primary", text: "Verder naar controleren" })));
  return h("div", { class: "shop-grid" }, f, h("aside", {}, summary()));
}

function validate(f) {
  let first = null;
  const err = (id, msg) => { const el = f.querySelector(`#${id}-err`); const wrap = el?.closest(".field"); if (wrap) { wrap.classList.toggle("error", !!msg); el.textContent = msg || ""; f.querySelector(`#${id}`).setAttribute("aria-invalid", msg ? "true" : "false"); f.querySelector(`#${id}`).setAttribute("aria-describedby", `${id}-err`); } if (msg && !first) first = id; };
  err("name", (form.name || "").trim().length < 2 ? "Vul uw naam in." : "");
  err("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email || "") ? "" : "Vul een geldig e-mailadres in, bijvoorbeeld naam@voorbeeld.nl.");
  if (!form.delivery) { say("Kies bezorgen of afhalen."); first = first || "delivery"; }
  if (form.delivery === "bezorgen") {
    err("street", (form.street || "").trim() ? "" : "Vul straat en huisnummer in.");
    err("postal", /^\d{4}\s?[A-Za-z]{2}$/.test(form.postal || "") ? "" : "Vul een Nederlandse postcode in, bijvoorbeeld 3311 AA.");
    err("city", (form.city || "").trim() ? "" : "Vul de plaats in.");
  }
  if (first) { (f.querySelector(`#${first}`) || f.querySelector("input[name=delivery]"))?.focus(); return false; }
  return true;
}

function viewReview() {
  const terms = h("input", { type: "checkbox", id: "terms" });
  const out = h("div", { role: "alert" });
  const pay = h("button", { type: "button", class: "btn btn-primary btn-lg btn-block", text: `Bestellen en betalen (${euro(priced.totalInclCents)})` });
  pay.addEventListener("click", async () => {
    if (busy) return;
    if (!terms.checked) { out.replaceChildren(h("p", { class: "field-error", text: "Ga akkoord met de algemene voorwaarden om te bestellen." })); terms.focus(); return; }
    busy = true; pay.setAttribute("aria-busy", "true"); pay.disabled = true; out.replaceChildren();
    let key = sessionStorage.getItem("sealOrderKey");
    if (!key) { key = crypto.randomUUID().replace(/-/g, ""); sessionStorage.setItem("sealOrderKey", key); }
    try {
      const cart = readCart();
      const res = await api("/api/public/shop/orders", { lines: cart.items, codes: cart.codes, delivery: form.delivery, agreeTerms: true,
        customer: { name: form.name, email: form.email, phone: form.phone, street: form.street, postal: form.postal, city: form.city } }, { "Idempotency-Key": key });
      if (res.checkoutUrl) { location.assign(res.checkoutUrl); return; }
      out.replaceChildren(h("p", { class: "notice", text: `Bestelling ${res.ref}: status ${res.status}.` }));
    } catch (e) {
      sessionStorage.removeItem("sealOrderKey"); // nieuwe poging = nieuwe sleutel; er is niets afgeschreven
      const rej = e.data?.rejected;
      out.replaceChildren(h("div", { class: "notice notice--error" }, h("strong", { text: e.message }), rej ? h("span", { text: rej.map((r) => `${r.code}: ${r.reason}`).join(" ") }) : h("span", { text: "Uw winkelmandje en gegevens zijn bewaard." })));
      if (rej) { await reprice(); }
    } finally { busy = false; pay.removeAttribute("aria-busy"); pay.disabled = false; }
  });
  const d = form;
  return h("div", { class: "shop-grid" },
    h("div", {},
      h("h2", { text: "Controleer uw bestelling" }),
      h("ul", { class: "shop-lines shop-lines--review" }, ...priced.lines.map((l) => h("li", { class: "shop-line" }, h("span", { text: `${l.qty} × ${l.title}` }), h("span", { class: "price", text: euro(incl(l.lineExclCents, l.vatRate)) })))),
      h("dl", { class: "specs" }, h("dt", { text: "Naam" }), h("dd", { text: d.name }), h("dt", { text: "E-mail" }), h("dd", { text: d.email }),
        h("dt", { text: "Levering" }), h("dd", { text: d.delivery === "bezorgen" ? `Bezorgen: ${d.street}, ${d.postal} ${d.city}` : "Afhalen na afspraak" })),
      h("p", {}, h("button", { type: "button", class: "link-btn", onclick: () => go(2), text: "Gegevens wijzigen" }), " · ", h("button", { type: "button", class: "link-btn", onclick: () => go(1), text: "Winkelmandje wijzigen" })),
      h("div", { class: "notice" }, h("strong", { text: "Herroepingsrecht" }), h("span", {}, "Als consument kunt u een online aankoop in de regel binnen 14 dagen na ontvangst zonder opgave van redenen ontbinden. Lees de voorwaarden en uitzonderingen in onze ", h("a", { href: "../voorwaarden/", target: "_blank", rel: "noopener", text: "algemene voorwaarden" }), "."))),
    h("aside", {}, summary(),
      h("label", { class: "portal-consent shop-terms", for: "terms" }, terms, " Ik ga akkoord met de ", h("a", { href: "../voorwaarden/", target: "_blank", rel: "noopener", text: "algemene voorwaarden" }), " en heb de informatie over herroeping gelezen."),
      pay, h("p", { class: "field-hint", text: "U betaalt via een beveiligde betaalpagina. Uw bestelling is pas definitief als de betaling is bevestigd; u krijgt dan een bevestiging per e-mail." }), out));
}

async function go(n) {
  step = n;
  if (n >= 2) await reprice();
  render();
  root.querySelector("h2, .stepper")?.scrollIntoView({ block: "start" });
  say(["", "Stap 1: winkelmandje", "Stap 2: gegevens en levering", "Stap 3: controleren en betalen"][n]);
}

async function render(refetch) {
  if (refetch) await reprice();
  const cart = readCart();
  let body;
  if (!config.checkoutOpen) body = closedView();
  else if (!cart.items.length) body = emptyView();
  else if (step === 1 || !priced?.ok) { step = 1; body = viewCart(); }
  else if (step === 2) body = viewDetails();
  else body = viewReview();
  const total = config.checkoutOpen && priced?.ok ? h("div", { class: "shop-sticky", "aria-hidden": "true" }, h("span", {}, "Totaal ", h("strong", { text: euro(priced.totalInclCents) }))) : null;
  root.replaceChildren(config.checkoutOpen && cart.items.length ? stepper() : null, body, total, live);
}

(async () => {
  config = await shopConfig();
  if (config.checkoutOpen) await reprice();
  render();
  window.addEventListener("pageshow", (e) => { if (e.persisted) render(true); }); // terug van betaalpagina: actuele staat
})();
export { clearCart };
