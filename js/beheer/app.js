/**
 * Sealcleaning beheeromgeving (lokaal, versleuteld). Interne calculatie,
 * klanten, projecten met status, leveranciers/inkoop, uren en documenten
 * (offerte, werkbon, factuurconcept). Alle data staat versleuteld in deze
 * browser (zie vault.js); er is geen server. Documenten zijn concepten die
 * een mens controleert vóór verzending — er wordt niets automatisch verstuurd.
 */
import { createVault, unlockVault, vaultExists, wipeVault, restoreBackup, readRawVault } from "./vault.js";
import { takeoff } from "../calc/quantities.js";
import { calculate, markupToMarginPct, customerLines } from "../calc/engine.js";
import { DEFAULT_SETTINGS, DEFAULT_NORMS, MATERIAL_LINKS } from "../../data/calc-defaults.js";
import { decodeShare, sanitizeDesign } from "../configurator/design-io.js";
import { withDefaults } from "../project-state.js";
import { applyChoices } from "../configurator/variants.js";

const app = document.querySelector("[data-app]");
const tabsEl = document.querySelector("[data-tabs]");
const lockBtn = document.querySelector("[data-lock]");
const printRoot = document.getElementById("print-root");
const COMPANY = window.SEAL_CONFIG || {};

const STATUSES = ["Aanvraag", "Opname gepland", "Offerte in voorbereiding", "Offerte verstuurd", "Akkoord", "Ingepland", "In uitvoering", "Opgeleverd", "Gefactureerd", "Betaald", "Afgesloten", "Vervallen"];
const TABS = [["calc", "Calculatie"], ["quotes", "Offertes & documenten"], ["projects", "Projecten"], ["customers", "Klanten"], ["suppliers", "Leveranciers & inkoop"], ["settings", "Instellingen"], ["backup", "Back-up"]];
const KEY_LABELS = {
  "paving.tiles": "Tegels", "paving.edging": "Opsluitband", "paving.sand": "Straatzand (m³)", "fence.panels": "Schuttingscherm",
  "fence.fits": "Passtuk schutting", "fence.posts": "Paal", "fence.baseplates": "Onderplaat", "fence.gates": "Poort",
  "green.hedge": "Haagplanten (per m)", "green.border": "Borderbeplanting (per m²)", "green.lawn": "Graszoden (m²)", "green.plant": "Solitair/heester",
  "hard.gravel.volume": "Grind (m³)", "hard.deck": "Vlonder (per m²)", "hard.planter": "Plantenbak (per m)", "light.point": "Lichtpunt (armatuur)",
  "machine.plate": "Trilplaat (dag)", "waste.rubble": "Container puin", "waste.soil": "Container grond", "waste.green": "Container groen", "waste.mixed": "Container bouw/sloop"
};

let vault = null;
let db = null;
let tab = "calc";
let priceSources = null;
let calcState = null; // { design, source, manualLines, result, takeoffRows }

/* ---------- helpers ---------- */
function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (k === "text") el.textContent = v;
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat()) if (c != null && c !== false) el.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
  return el;
}
const euro = (c) => (c == null ? "op aanvraag" : (c / 100).toLocaleString("nl-NL", { style: "currency", currency: "EUR" }));
const nl = (n, d = 2) => Number(n).toLocaleString("nl-NL", { maximumFractionDigits: d });
const uid = (p) => `${p}-${Date.now().toString(36)}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;
const today = () => new Date().toISOString().slice(0, 10);
function field(label, input, hint) {
  const id = uid("f");
  input.id = id;
  return h("div", { class: "configurator-field" }, h("label", { for: id, text: label }), input, hint ? h("p", { class: "field-hint", text: hint }) : null);
}
function textInput(value, onChange, type = "text", extra = {}) {
  const i = h("input", { type, value: value ?? "", ...extra });
  i.addEventListener("change", () => onChange(i.value.trim()));
  return i;
}
function select(options, value, onChange) {
  const s = h("select", {}, options.map(([v, l]) => { const o = h("option", { value: v, text: l }); if (String(v) === String(value ?? "")) o.selected = true; return o; }));
  s.addEventListener("change", () => onChange(s.value));
  return s;
}
const parseEuroCents = (v) => { const n = parseFloat(String(v).replace(/\./g, "").replace(",", ".")); return Number.isFinite(n) ? Math.round(n * 100) : null; };
const parsePct = (v) => { if (String(v).trim() === "") return null; const n = parseFloat(String(v).replace(",", ".")); return Number.isFinite(n) && n >= 0 && n < 1000 ? n : null; };
const centsToInput = (c) => (c == null ? "" : (c / 100).toFixed(2).replace(".", ","));
function status(text, error) { return h("p", { class: error ? "field-error" : "field-hint", role: error ? "alert" : "status", text }); }

async function persist() { await vault.save(db); }

function emptyDb() {
  return { version: 1, settings: {}, company: { offerValidityDays: null, paymentTermDays: null, iban: "", quotePrefix: "OFF", invoicePrefix: "F" },
    purchasePrices: {}, suppliers: [], customers: [], projects: [], quotes: [], invoices: [], counters: {} };
}

async function loadPriceSources() {
  if (!priceSources) priceSources = await (await fetch("../data/price-sources.json")).json();
  return priceSources;
}

/* ---------- vergrendelen / ontgrendelen ---------- */
function renderLock(message) {
  tabsEl.hidden = true; lockBtn.hidden = true;
  app.innerHTML = "";
  const exists = vaultExists();
  const pw = h("input", { type: "password", autocomplete: exists ? "current-password" : "new-password", minlength: "10", required: true });
  const pw2 = exists ? null : h("input", { type: "password", autocomplete: "new-password", minlength: "10", required: true });
  const msg = h("div");
  if (message) msg.appendChild(status(message, true));
  const form = h("form", { class: "beheer-lock", onsubmit: async (e) => {
    e.preventDefault();
    msg.innerHTML = "";
    try {
      if (exists) vault = await unlockVault(pw.value);
      else {
        if (pw.value !== pw2.value) throw new Error("De wachtwoorden zijn niet gelijk.");
        vault = await createVault(pw.value, emptyDb());
      }
      db = { ...emptyDb(), ...vault.data };
      startApp();
    } catch (err) { msg.appendChild(status(err.message, true)); }
  } },
    h("h1", { text: exists ? "Beheer ontgrendelen" : "Beheerkluis aanmaken" }),
    h("p", { class: "lede", text: exists
      ? "Voer het wachtwoord van de beheerkluis op dit apparaat in."
      : "Deze omgeving bewaart klanten, inkoop, marges en offertes versleuteld op dít apparaat. Er gaat niets naar een server. Zonder wachtwoord is de inhoud niet te herstellen — maak na het invullen een back-up." }),
    field("Wachtwoord (min. 10 tekens)", pw),
    pw2 ? field("Herhaal wachtwoord", pw2) : null,
    h("button", { type: "submit", class: "btn btn-primary", text: exists ? "Ontgrendelen" : "Kluis aanmaken" }),
    msg,
    exists ? h("details", { class: "beheer-danger" }, h("summary", { text: "Wachtwoord kwijt?" }),
      h("p", { class: "field-hint", text: "Zonder wachtwoord is de kluis niet te openen. U kunt een back-up terugzetten (tab Back-up na aanmaken) of de kluis op dit apparaat wissen." }),
      h("button", { type: "button", class: "btn btn-secondary btn-sm", text: "Kluis op dit apparaat wissen", onclick: () => {
        if (confirm("Alle beheergegevens op dit apparaat definitief wissen?")) { wipeVault(); renderLock(); }
      } })) : null,
    !exists ? h("p", { class: "field-hint", text: "Al een back-up? Maak eerst een kluis aan en zet daarna de back-up terug via Back-up." }) : null
  );
  app.appendChild(form);
  pw.focus();
}

function startApp() {
  tabsEl.hidden = false; lockBtn.hidden = false;
  renderTabs();
  render();
}

lockBtn.addEventListener("click", () => { vault = null; db = null; calcState = null; renderLock(); });

function renderTabs() {
  tabsEl.innerHTML = "";
  for (const [id, label] of TABS) {
    tabsEl.appendChild(h("button", { type: "button", "aria-current": tab === id ? "page" : "false", text: label, onclick: () => { tab = id; renderTabs(); render(); } }));
  }
}

function render() {
  app.innerHTML = "";
  ({ calc: renderCalc, quotes: renderQuotes, projects: renderProjects, customers: renderCustomers, suppliers: renderSuppliers, settings: renderSettings, backup: renderBackup })[tab]();
}

/* ---------- calculatie ---------- */
function loadDesign(project, source) {
  const design = withDefaults(project);
  calcState = { design, source, manualLines: [], result: null, takeoffRows: takeoff(design) };
  recalc();
  render();
}

function recalc() {
  if (!calcState || !priceSources) return;
  const purchase = {};
  for (const [k, v] of Object.entries(db.purchasePrices)) {
    const sup = db.suppliers.find((s) => s.id === v.supplierId);
    purchase[k] = { ...v, supplier: sup?.name };
  }
  calcState.result = calculate({ takeoffRows: calcState.takeoffRows, settings: db.settings, priceSources, purchasePrices: purchase });
}

function manualTotal() {
  return (calcState?.manualLines || []).reduce((s, l) => s + Math.round(l.qty * l.unitSaleExclCents), 0);
}

function renderCalc() {
  app.appendChild(h("h1", { text: "Calculatie" }));
  app.appendChild(h("p", { class: "field-hint", text: "Laad een ontwerp uit de configurator. De motor rekent arbeid (€ 60/uur excl. btw), materiaal, machines, afvoer, transport, opslag en btw per regel. De uitkomst is een voorstel: controleer elke regel voordat u een offerte verstuurt." }));
  const msg = h("div");
  const linkInput = h("input", { type: "url", placeholder: "Plak een deellink (…/project-samenstellen/#ontwerp=…)" });
  const file = h("input", { type: "file", accept: ".json,application/json" });
  file.addEventListener("change", async () => {
    msg.innerHTML = "";
    try { const f = file.files[0]; if (f.size > 200000) throw new Error("Bestand te groot."); loadDesign(sanitizeDesign(JSON.parse(await f.text())), `bestand ${f.name}`); }
    catch (e) { msg.appendChild(status(e instanceof SyntaxError ? "Geen geldig ontwerpbestand." : e.message, true)); }
  });
  const loaders = h("div", { class: "beheer-card" },
    h("h2", { text: "Ontwerp laden" }),
    h("div", { class: "beheer-row" }, field("Deellink", linkInput),
      h("button", { type: "button", class: "btn btn-secondary btn-sm", text: "Laden", onclick: () => {
        msg.innerHTML = "";
        try { const m = /#ontwerp=([A-Za-z0-9_-]+)/.exec(linkInput.value); if (!m) throw new Error("Geen deellink herkend."); loadDesign(decodeShare(m[1]), "deellink"); }
        catch (e) { msg.appendChild(status(e.message, true)); }
      } })),
    field("Of ontwerpbestand (.json)", file),
    h("button", { type: "button", class: "btn btn-secondary btn-sm", text: "Laatst bewaard ontwerp in deze browser", onclick: () => {
      msg.innerHTML = "";
      try {
        const raw = JSON.parse(localStorage.getItem("sealConfiguratorProject") || "null");
        if (!raw?.project) throw new Error("Er is in deze browser geen ontwerp bewaard (configurator → 'Bewaar ontwerp op dit apparaat').");
        loadDesign(sanitizeDesign({ format: "sealcleaning-ontwerp", schemaVersion: 1, design: raw.project }), "deze browser");
      } catch (e) { msg.appendChild(status(e.message, true)); }
    } }),
    msg);
  app.appendChild(loaders);
  if (!calcState) return;
  if (!calcState.result) { loadPriceSources().then(() => { recalc(); render(); }); app.appendChild(status("Prijsbronnen laden…")); return; }

  const r = calcState.result;
  const d = calcState.design;
  app.appendChild(h("div", { class: "beheer-card" },
    h("h2", { text: "Ontwerp" }),
    h("p", { text: `Bron: ${calcState.source}. Diensten: ${d.services.join(", ") || "—"}. Route: ${d.options.route || "—"}.` }),
    takeoffTable(calcState.takeoffRows)));

  const readinessClass = { incompleet: "badge-block", concept: "badge-warn", "gereed voor controle": "badge-ok" }[r.readiness];
  app.appendChild(h("div", { class: "beheer-card" },
    h("h2", {}, "Calculatie ", h("span", { class: `badge ${readinessClass}`, text: r.readiness })),
    linesTable(r.lines, true),
    manualLinesEditor(),
    totalsBlock(r, true),
    flagsList(r.flags)));

  if (d.variants?.length) app.appendChild(variantScenarios(d));
  app.appendChild(saveQuoteBlock());
}

/** Scenario's: iedere configurator-variant op dezelfde geometrie doorgerekend (ch.39). */
function variantScenarios(design) {
  const purchase = Object.fromEntries(Object.entries(db.purchasePrices).map(([k, v]) => [k, { ...v }]));
  const rows = design.variants.map((v) => {
    const copy = JSON.parse(JSON.stringify(design));
    applyChoices(copy, v.choices);
    const r = calculate({ takeoffRows: takeoff(copy), settings: db.settings, priceSources, purchasePrices: purchase });
    return { v, r };
  });
  const base = rows[0].r.totals.saleExclCents;
  return h("div", { class: "beheer-card" }, h("h2", { text: "Scenario's (varianten uit de configurator)" }),
    h("div", { class: "price-table-wrap" }, h("table", { class: "price-table beheer-table" },
      h("thead", {}, h("tr", {}, ["Variant", "Verkoop excl.", "Verschil t.o.v. A", "Uren", "Ontbrekend", "Brutomarge", "Status"].map((t) => h("th", { scope: "col", text: t })))),
      h("tbody", {}, rows.map(({ v, r }, i) => h("tr", {},
        h("td", { text: `Variant ${v.label}` }), h("td", { class: "num", text: euro(r.totals.saleExclCents) }),
        h("td", { class: "num", text: i === 0 ? "—" : (r.totals.missingLines || rows[0].r.totals.missingLines ? "niet vergelijkbaar (ontbrekende prijzen)" : euro(r.totals.saleExclCents - base)) }),
        h("td", { class: "num", text: nl(r.totals.laborHours) }), h("td", { class: "num", text: String(r.totals.missingLines) }),
        h("td", { text: r.totals.grossMarginPct == null ? "onbekend" : `${nl(r.totals.grossMarginPct, 1)}%` }),
        h("td", {}, h("span", { class: "badge", text: r.readiness }))))))),
    h("p", { class: "field-hint", text: "Verschillen zijn alleen betrouwbaar als beide varianten volledig geprijsd zijn." }));
}

function takeoffTable(rows) {
  return h("div", { class: "price-table-wrap" }, h("table", { class: "price-table beheer-table" },
    h("thead", {}, h("tr", {}, ["Hoeveelheid", "Aantal", "Eenheid", "Aanname"].map((t) => h("th", { scope: "col", text: t })))),
    h("tbody", {}, rows.map((t) => h("tr", {}, h("td", { text: `${t.group} — ${t.label}` }), h("td", { class: "num", text: nl(t.qty) }), h("td", { text: t.unit }), h("td", { text: t.assumption || "" }))))));
}

const BASIS = { purchase: ["eigen inkoop", "badge-ok"], market: ["marktprijs (benadering)", "badge-warn"], confirmed: ["bevestigd", "badge-ok"], example: ["voorbeeldnorm", "badge-warn"], missing: ["ontbreekt", "badge-block"] };
function linesTable(lines, internal) {
  const head = internal ? ["Regel", "Aantal", "Kostprijs/eenh.", "Verkoop/eenh.", "Verkoop excl.", "Basis", "Toelichting / bron"] : ["Omschrijving", "Aantal", "Prijs/eenh. excl.", "Totaal excl."];
  return h("div", { class: "price-table-wrap" }, h("table", { class: "price-table beheer-table" },
    h("thead", {}, h("tr", {}, head.map((t) => h("th", { scope: "col", text: t })))),
    h("tbody", {}, lines.map((l) => internal
      ? h("tr", {}, h("td", { text: l.label }), h("td", { class: "num", text: `${nl(l.qty)} ${l.unit}` }), h("td", { class: "num", text: l.unitCostExclCents != null ? euro(l.unitCostExclCents) : "—" }),
          h("td", { class: "num", text: l.unitSaleExclCents != null ? euro(l.unitSaleExclCents) : "—" }), h("td", { class: "num", text: euro(l.saleExclCents) }),
          h("td", {}, h("span", { class: `badge ${BASIS[l.basis]?.[1] || ""}`, text: BASIS[l.basis]?.[0] || l.basis })), h("td", { class: "small", text: [l.note, l.source].filter(Boolean).join(" — ") }))
      : h("tr", {}, h("td", { text: l.label }), h("td", { class: "num", text: `${nl(l.qty)} ${l.unit}` }), h("td", { class: "num", text: euro(l.unitSaleExclCents) }), h("td", { class: "num", text: euro(l.saleExclCents) }))))));
}

function manualLinesEditor() {
  const wrap = h("div", { class: "beheer-manual" }, h("h3", { text: "Handmatige regels (meerwerk, posten na opname)" }));
  calcState.manualLines.forEach((l, i) => wrap.appendChild(h("div", { class: "beheer-row" },
    h("span", { text: `${l.label}: ${nl(l.qty)} ${l.unit} × ${euro(l.unitSaleExclCents)}` }),
    h("button", { type: "button", class: "link-btn", text: "Verwijderen", onclick: () => { calcState.manualLines.splice(i, 1); render(); } }))));
  const label = h("input", { type: "text", placeholder: "Omschrijving" });
  const qty = h("input", { type: "text", inputmode: "decimal", placeholder: "Aantal", value: "1" });
  const unit = h("input", { type: "text", placeholder: "Eenheid", value: "post" });
  const price = h("input", { type: "text", inputmode: "decimal", placeholder: "Prijs excl. (€)" });
  wrap.appendChild(h("div", { class: "beheer-row" }, label, qty, unit, price, h("button", { type: "button", class: "btn btn-secondary btn-sm", text: "Toevoegen", onclick: () => {
    const q = parseFloat(qty.value.replace(",", ".")); const c = parseEuroCents(price.value);
    if (!label.value.trim() || !Number.isFinite(q) || c == null) return;
    calcState.manualLines.push({ label: label.value.trim().slice(0, 120), qty: q, unit: unit.value.trim().slice(0, 12) || "post", unitSaleExclCents: c });
    render();
  } })));
  return wrap;
}

function quoteTotals(result, manualLines, settings) {
  const vatRate = result.settingsUsed.vatRate;
  const extra = (manualLines || []).reduce((s, l) => s + Math.round(l.qty * l.unitSaleExclCents), 0);
  const saleExcl = result.totals.saleExclCents + extra;
  const vat = Math.round(saleExcl * vatRate / 100);
  return { saleExcl, vat, incl: saleExcl + vat, vatRate };
}

function totalsBlock(r, internal) {
  const t = quoteTotals(r, calcState?.manualLines);
  const rows = [
    ["Arbeid", `${nl(r.totals.laborHours)} uur, ca. ${r.totals.days} werkdag(en) bij ploeg van ${r.settingsUsed.crewSize}`],
    ...r.extras.map((e) => [e.label, euro(e.cents)]),
    ["Totaal excl. btw", euro(t.saleExcl)], [`Btw ${t.vatRate}%`, euro(t.vat)], ["Totaal incl. btw", euro(t.incl)]
  ];
  if (internal) {
    rows.push(["Werkelijke kostprijs", r.totals.costExclCents == null ? "onbekend — vul eigen inkoopprijzen en arbeidskostprijs in" : euro(r.totals.costExclCents)]);
    if (r.totals.costApproxExclCents != null) rows.push(["Benaderde kostprijs", `${euro(r.totals.costApproxExclCents)} (bevat openbare marktprijzen — geen marge op baseren)`]);
    rows.push(["Brutomarge", r.totals.grossMarginPct == null ? "onbekend (kostprijs niet volledig bekend)" : `${euro(r.totals.grossMarginCents)} (${nl(r.totals.grossMarginPct, 1)}% van verkoop, excl. handmatige regels)`]);
    if (r.totals.missingLines) rows.push(["Ontbrekend", `${r.totals.missingLines} regel(s) zonder prijs — totaal is NIET volledig`]);
  }
  return h("dl", { class: "beheer-totals" }, rows.flatMap(([k, v]) => [h("dt", { text: k }), h("dd", { text: v })]));
}

function flagsList(flags) {
  if (!flags.length) return h("p", { class: "field-hint", text: "Geen aandachtspunten." });
  const order = { block: 0, warn: 1, info: 2 };
  return h("ul", { class: "beheer-flags" }, [...flags].sort((a, b) => order[a.level] - order[b.level]).map((f) => h("li", { class: `flag-${f.level}`, text: f.text })));
}

function saveQuoteBlock() {
  const msg = h("div");
  let projectId = db.projects[0]?.id || "new";
  const title = h("input", { type: "text", placeholder: "Projectnaam (bijv. Terras Jansen)" });
  const custSel = select([["", "— geen / later koppelen —"], ...db.customers.map((c) => [c.id, c.name])], "", () => {});
  const projSel = select([["new", "Nieuw project"], ...db.projects.map((p) => [p.id, p.title])], projectId, (v) => { projectId = v; });
  return h("div", { class: "beheer-card" }, h("h2", { text: "Opslaan als offerteconcept" }),
    field("Project", projSel), field("Naam nieuw project", title), field("Klant (voor nieuw project)", custSel),
    h("button", { type: "button", class: "btn btn-primary", text: "Offerteconcept opslaan", onclick: async () => {
      msg.innerHTML = "";
      let project = db.projects.find((p) => p.id === projectId);
      if (!project) {
        if (!title.value.trim()) { msg.appendChild(status("Geef het nieuwe project een naam.", true)); return; }
        project = { id: uid("prj"), title: title.value.trim().slice(0, 120), customerId: custSel.value || null, status: "Offerte in voorbereiding", history: [{ status: "Offerte in voorbereiding", at: new Date().toISOString() }], design: null, hours: [], notes: "", createdAt: new Date().toISOString() };
        db.projects.unshift(project);
      }
      project.design = calcState.design;
      const year = new Date().getFullYear();
      const n = (db.counters[`q${year}`] || 0) + 1;
      db.counters[`q${year}`] = n;
      const quote = { id: uid("q"), number: `${db.company.quotePrefix || "OFF"}-${year}-${String(n).padStart(3, "0")}`, projectId: project.id, createdAt: new Date().toISOString(), status: "concept",
        result: calcState.result, manualLines: calcState.manualLines, takeoffRows: calcState.takeoffRows };
      db.quotes.unshift(quote);
      await persist();
      tab = "quotes"; renderTabs(); render();
    } }), msg);
}

/* ---------- offertes & documenten ---------- */
function renderQuotes() {
  app.appendChild(h("h1", { text: "Offertes & documenten" }));
  app.appendChild(h("p", { class: "field-hint", text: "Offerte, werkbon en factuurconcept worden als printbare pagina opgebouwd (print of 'Opslaan als PDF'). Interne kostprijs en marge staan nooit op klantdocumenten. Er wordt niets automatisch verzonden." }));
  if (!db.quotes.length) { app.appendChild(h("p", { text: "Nog geen offerteconcepten. Maak er een via Calculatie." })); return; }
  for (const q of db.quotes) {
    const p = db.projects.find((x) => x.id === q.projectId);
    const c = db.customers.find((x) => x.id === p?.customerId);
    const t = quoteTotals(q.result, q.manualLines);
    const inv = db.invoices.find((i) => i.quoteId === q.id);
    app.appendChild(h("div", { class: "beheer-card" },
      h("h2", {}, `${q.number} — ${p?.title || "?"} `, h("span", { class: `badge ${q.result.readiness === "gereed voor controle" ? "badge-ok" : q.result.readiness === "concept" ? "badge-warn" : "badge-block"}`, text: q.result.readiness })),
      h("p", { text: `Klant: ${c?.name || "nog niet gekoppeld"} · ${euro(t.saleExcl)} excl. btw · ${euro(t.incl)} incl. · status: ${q.status}` }),
      field("Status offerte", select([["concept", "Concept"], ["verstuurd", "Verstuurd"], ["akkoord", "Akkoord"], ["afgewezen", "Afgewezen"], ["vervallen", "Vervallen"]], q.status, async (v) => {
        q.status = v;
        if (p && v === "verstuurd") setProjectStatus(p, "Offerte verstuurd");
        if (p && v === "akkoord") setProjectStatus(p, "Akkoord");
        await persist(); render();
      })),
      h("div", { class: "btn-row" },
        h("button", { type: "button", class: "btn btn-secondary btn-sm", text: "Offerte printen / PDF", onclick: () => printDoc("offerte", q) }),
        h("button", { type: "button", class: "btn btn-secondary btn-sm", text: "Werkbon printen", onclick: () => printDoc("werkbon", q) }),
        inv ? h("button", { type: "button", class: "btn btn-secondary btn-sm", text: `Factuurconcept ${inv.number} printen`, onclick: () => printDoc("factuur", q, inv) })
          : h("button", { type: "button", class: "btn btn-secondary btn-sm", text: "Factuurconcept maken", disabled: q.status !== "akkoord" ? true : null, title: q.status !== "akkoord" ? "Pas na akkoord" : null, onclick: async () => {
            const year = new Date().getFullYear();
            const n = (db.counters[`f${year}`] || 0) + 1; db.counters[`f${year}`] = n;
            db.invoices.unshift({ id: uid("inv"), quoteId: q.id, number: `${db.company.invoicePrefix || "F"}${year}${String(n).padStart(4, "0")}`, date: today(), status: "concept" });
            await persist(); render();
          } }),
        h("button", { type: "button", class: "link-btn", text: "Verwijderen", onclick: async () => {
          if (!confirm(`Offerte ${q.number} verwijderen?`)) return;
          db.quotes = db.quotes.filter((x) => x.id !== q.id); db.invoices = db.invoices.filter((i) => i.quoteId !== q.id); await persist(); render();
        } })),
      inv ? field("Status factuur", select([["concept", "Concept"], ["verstuurd", "Verstuurd"], ["betaald", "Betaald"]], inv.status, async (v) => {
        inv.status = v; if (p && v === "verstuurd") setProjectStatus(p, "Gefactureerd"); if (p && v === "betaald") setProjectStatus(p, "Betaald"); await persist(); render();
      }), "Factuurnummers worden per apparaat doorgenummerd. Gebruik deze reeks op één apparaat en controleer tegen uw boekhouding.") : null
    ));
  }
}

function companyBlock() {
  return h("div", { class: "doc-company" },
    h("img", { src: "../images/branding/logo.webp", alt: "", width: "64", height: "64" }),
    h("div", {}, h("strong", { text: COMPANY.businessName || "Sealcleaning" }), h("br"),
      `${COMPANY.addressLine1 || ""}, ${COMPANY.addressLine2 || ""}`, h("br"),
      `${COMPANY.phoneDisplay || ""} · ${COMPANY.email || ""}`, h("br"),
      `KvK ${COMPANY.kvk || "—"} · btw ${COMPANY.btw || "—"}`));
}

function customerBlock(c) {
  return h("div", { class: "doc-customer" }, h("strong", { text: "Aan:" }), h("br"), c ? [c.name, h("br"), c.address || "", h("br"), c.email || ""] : "nog geen klant gekoppeld");
}

function printDoc(kind, q, inv) {
  const p = db.projects.find((x) => x.id === q.projectId);
  const c = db.customers.find((x) => x.id === p?.customerId);
  const t = quoteTotals(q.result, q.manualLines);
  const isConcept = kind === "factuur" ? inv.status === "concept" : q.status === "concept" || q.result.readiness !== "gereed voor controle";
  printRoot.innerHTML = "";
  const doc = h("article", { class: "doc" });
  if (isConcept) doc.appendChild(h("p", { class: "doc-watermark", text: "CONCEPT — niet verzenden zonder controle" }));
  doc.appendChild(companyBlock());
  const title = { offerte: `Offerte ${q.number}`, werkbon: `Werkbon bij ${q.number}`, factuur: `Factuur ${inv?.number}` }[kind];
  doc.appendChild(h("h1", { text: title }));
  doc.appendChild(h("p", { text: `Project: ${p?.title || "—"} · Datum: ${kind === "factuur" ? inv.date : q.createdAt.slice(0, 10)}` }));
  doc.appendChild(customerBlock(c));

  const cust = customerLines(q.result, q.manualLines);
  const missing = q.result.lines.filter((l) => l.saleExclCents == null);

  if (kind === "werkbon") {
    doc.appendChild(h("h2", { text: "Werkzaamheden en geplande uren" }));
    doc.appendChild(h("ul", {}, q.result.lines.filter((l) => l.kind === "labor").map((l) => h("li", { text: `${l.label.replace("Arbeid: ", "")} — ${nl(l.qty)} uur` }))));
    doc.appendChild(h("h2", { text: "Materiaal en hoeveelheden" }));
    doc.appendChild(h("ul", {}, q.takeoffRows.map((t2) => h("li", { text: `${t2.label}: ${nl(t2.qty)} ${t2.unit}${t2.assumption ? ` (${t2.assumption})` : ""}` }))));
    const d = p?.design;
    if (d) {
      doc.appendChild(h("h2", { text: "Situatie" }));
      doc.appendChild(h("p", { text: `Ondergrond: ${d.access.surface}; achterom: ${d.access.rearAccess}; doorgang: ${d.access.rearPassageWidthMm ? nl(d.access.rearPassageWidthMm / 1000) + " m" : "—"}; parkeren: ${d.access.parking}; kabels/leidingen: ${d.site.utilities}${d.site.utilitiesNote ? " (" + d.site.utilitiesNote + ")" : ""}.` }));
      const protect = (d.existingObjects || []).filter((o) => o.status === "existing-keep" && ["tree", "hedge", "border"].includes(o.type));
      if (protect.length) doc.appendChild(h("p", { text: `Beschermen tijdens het werk: ${protect.map((o) => o.type).join(", ")}.` }));
    }
    doc.appendChild(h("h2", { text: "Afmelding" }));
    doc.appendChild(h("p", { text: "Werkelijke uren: ________   Bijzonderheden / meerwerk: ______________________________" }));
    doc.appendChild(h("p", { text: "Paraaf uitvoerder: ________   Datum: ________" }));
  } else {
    doc.appendChild(linesTableCustomer(cust.lines));
    doc.appendChild(h("dl", { class: "beheer-totals" },
      h("dt", { text: "Totaal excl. btw" }), h("dd", { text: euro(t.saleExcl) }),
      h("dt", { text: `Btw ${t.vatRate}%` }), h("dd", { text: euro(t.vat) }),
      h("dt", { text: "Totaal incl. btw" }), h("dd", { text: euro(t.incl) })));
    if (missing.length) doc.appendChild(h("p", { class: "doc-note", text: `Nog niet in dit bedrag (op aanvraag na opname): ${missing.map((l) => l.label).join(", ")}.` }));
    const assumptions = q.takeoffRows.filter((x) => x.assumption).map((x) => `${x.label}: ${x.assumption}`);
    if (kind === "offerte") {
      if (assumptions.length) { doc.appendChild(h("h2", { text: "Uitgangspunten" })); doc.appendChild(h("ul", {}, assumptions.map((a) => h("li", { text: a })))); }
      doc.appendChild(h("p", { class: "doc-note", text: `Geldigheid: ${db.company.offerValidityDays ? db.company.offerValidityDays + " dagen na dagtekening" : "[geldigheid nog in te stellen]"}. Op deze offerte zijn de algemene voorwaarden van Sealcleaning van toepassing (sealcleaning.nl/voorwaarden). Meerwerk alleen na overleg.` }));
      doc.appendChild(h("p", { text: "Akkoord opdrachtgever: ______________________   Datum: __________" }));
    } else {
      doc.appendChild(h("p", { class: "doc-note", text: `Betaling binnen ${db.company.paymentTermDays ? db.company.paymentTermDays + " dagen" : "[betaaltermijn nog in te stellen]"} op ${db.company.iban || "[IBAN nog in te stellen]"} t.n.v. ${COMPANY.businessName || "Sealcleaning"}, o.v.v. ${inv.number}.` }));
    }
  }
  printRoot.appendChild(doc);
  document.body.classList.add("printing");
  const done = () => { document.body.classList.remove("printing"); window.removeEventListener("afterprint", done); };
  window.addEventListener("afterprint", done);
  window.print();
}

function linesTableCustomer(lines) {
  return h("table", { class: "price-table doc-table" },
    h("thead", {}, h("tr", {}, ["Omschrijving", "Aantal", "Prijs/eenh. excl.", "Totaal excl."].map((t) => h("th", { scope: "col", text: t })))),
    h("tbody", {}, lines.map((l) => h("tr", {}, h("td", { text: l.label }), h("td", { class: "num", text: `${nl(l.qty)} ${l.unit}` }), h("td", { class: "num", text: euro(l.unitSaleExclCents) }), h("td", { class: "num", text: euro(l.saleExclCents) })))));
}

/* ---------- projecten ---------- */
function setProjectStatus(p, s) {
  if (p.status === s) return;
  p.status = s;
  p.history = [...(p.history || []), { status: s, at: new Date().toISOString() }];
}

function renderProjects() {
  app.appendChild(h("h1", { text: "Projecten" }));
  const title = h("input", { type: "text", placeholder: "Projectnaam" });
  const cust = select([["", "— klant —"], ...db.customers.map((c) => [c.id, c.name])], "", () => {});
  app.appendChild(h("div", { class: "beheer-card beheer-row" }, title, cust, h("button", { type: "button", class: "btn btn-primary btn-sm", text: "Project toevoegen", onclick: async () => {
    if (!title.value.trim()) return;
    db.projects.unshift({ id: uid("prj"), title: title.value.trim().slice(0, 120), customerId: cust.value || null, status: "Aanvraag", history: [{ status: "Aanvraag", at: new Date().toISOString() }], design: null, hours: [], notes: "", createdAt: new Date().toISOString() });
    await persist(); render();
  } })));
  const counts = STATUSES.map((s) => [s, db.projects.filter((p) => p.status === s).length]).filter(([, n]) => n);
  if (counts.length) app.appendChild(h("p", { class: "beheer-pipeline", text: counts.map(([s, n]) => `${s}: ${n}`).join(" · ") }));
  for (const p of db.projects) {
    const c = db.customers.find((x) => x.id === p.customerId);
    const planned = db.quotes.filter((q) => q.projectId === p.id).map((q) => q.result.totals.laborHours)[0] || null;
    const spent = (p.hours || []).reduce((s, x) => s + x.hours, 0);
    const date = h("input", { type: "date", value: today() });
    const worker = h("input", { type: "text", placeholder: "Medewerker" });
    const hrs = h("input", { type: "text", inputmode: "decimal", placeholder: "Uren" });
    const note = h("input", { type: "text", placeholder: "Werkzaamheden" });
    app.appendChild(h("details", { class: "beheer-card" },
      h("summary", {}, h("strong", { text: p.title }), ` — ${c?.name || "geen klant"} · `, h("span", { class: "badge", text: p.status })),
      field("Status", select(STATUSES.map((s) => [s, s]), p.status, async (v) => { setProjectStatus(p, v); await persist(); render(); })),
      field("Klant", select([["", "—"], ...db.customers.map((x) => [x.id, x.name])], p.customerId || "", async (v) => { p.customerId = v || null; await persist(); render(); })),
      field("Notities", (() => { const t = h("textarea", { rows: "3" }); t.value = p.notes || ""; t.addEventListener("change", async () => { p.notes = t.value; await persist(); }); return t; })()),
      h("h3", { text: `Uren: ${nl(spent)} geboekt${planned ? ` van ${nl(planned)} gecalculeerd` : ""}` }),
      planned && spent > planned ? status(`Let op: ${nl(spent - planned)} uur boven calculatie — meerwerk bespreken of nacalculatie.`, true) : null,
      h("ul", {}, (p.hours || []).map((x) => h("li", { text: `${x.date} · ${x.worker} · ${nl(x.hours)} u · ${x.note}` }))),
      h("div", { class: "beheer-row" }, date, worker, hrs, note, h("button", { type: "button", class: "btn btn-secondary btn-sm", text: "Uren boeken", onclick: async () => {
        const n = parseFloat(hrs.value.replace(",", ".")); if (!Number.isFinite(n) || n <= 0 || n > 24) return;
        p.hours = [...(p.hours || []), { id: uid("h"), date: date.value, worker: worker.value.trim().slice(0, 60), hours: n, note: note.value.trim().slice(0, 200) }];
        await persist(); render();
      } })),
      h("p", { class: "field-hint", text: `Statushistorie: ${(p.history || []).map((x) => `${x.status} (${x.at.slice(0, 10)})`).join(" → ")}` }),
      p.design ? h("button", { type: "button", class: "btn btn-secondary btn-sm", text: "Ontwerp openen in calculatie", onclick: () => { tab = "calc"; renderTabs(); loadDesign(p.design, `project ${p.title}`); } }) : null,
      h("button", { type: "button", class: "link-btn", text: "Project verwijderen", onclick: async () => {
        if (!confirm(`Project "${p.title}" met uren verwijderen? Offertes blijven bestaan.`)) return;
        db.projects = db.projects.filter((x) => x.id !== p.id); await persist(); render();
      } })));
  }
}

/* ---------- klanten ---------- */
function renderCustomers() {
  app.appendChild(h("h1", { text: "Klanten" }));
  app.appendChild(h("p", { class: "field-hint", text: "Leg alleen vast wat nodig is voor aanvraag, offerte en uitvoering (AVG: dataminimalisatie). Verwijderen wist de klant uit deze kluis; facturen in uw boekhouding vallen onder de wettelijke bewaarplicht." }));
  const f = { name: h("input", { type: "text", placeholder: "Naam" }), email: h("input", { type: "email", placeholder: "E-mail" }), phone: h("input", { type: "tel", placeholder: "Telefoon" }), address: h("input", { type: "text", placeholder: "Adres (straat, postcode, plaats)" }) };
  const type = select([["particulier", "Particulier"], ["zakelijk", "Zakelijk"]], "particulier", () => {});
  app.appendChild(h("div", { class: "beheer-card beheer-row" }, f.name, f.email, f.phone, f.address, type, h("button", { type: "button", class: "btn btn-primary btn-sm", text: "Klant toevoegen", onclick: async () => {
    if (!f.name.value.trim()) return;
    db.customers.unshift({ id: uid("c"), name: f.name.value.trim().slice(0, 120), email: f.email.value.trim().slice(0, 120), phone: f.phone.value.trim().slice(0, 40), address: f.address.value.trim().slice(0, 200), type: type.value, createdAt: new Date().toISOString() });
    await persist(); render();
  } })));
  for (const c of db.customers) {
    const projects = db.projects.filter((p) => p.customerId === c.id);
    app.appendChild(h("div", { class: "beheer-card" },
      h("strong", { text: c.name }), ` (${c.type}) · ${c.email || "—"} · ${c.phone || "—"} · ${c.address || "—"}`,
      h("p", { class: "field-hint", text: `Projecten: ${projects.map((p) => `${p.title} [${p.status}]`).join(", ") || "geen"}` }),
      h("button", { type: "button", class: "link-btn", text: "Klant verwijderen (AVG)", onclick: async () => {
        if (!confirm(`Klant "${c.name}" verwijderen? Gekoppelde projecten blijven zonder klant bestaan.`)) return;
        db.customers = db.customers.filter((x) => x.id !== c.id);
        db.projects.forEach((p) => { if (p.customerId === c.id) p.customerId = null; });
        await persist(); render();
      } })));
  }
}

/* ---------- leveranciers & inkoop ---------- */
function renderSuppliers() {
  app.appendChild(h("h1", { text: "Leveranciers & inkoop" }));
  const name = h("input", { type: "text", placeholder: "Leverancier" });
  const contact = h("input", { type: "text", placeholder: "Contact / klantnummer" });
  app.appendChild(h("div", { class: "beheer-card beheer-row" }, name, contact, h("button", { type: "button", class: "btn btn-primary btn-sm", text: "Leverancier toevoegen", onclick: async () => {
    if (!name.value.trim()) return;
    db.suppliers.push({ id: uid("s"), name: name.value.trim().slice(0, 120), contact: contact.value.trim().slice(0, 200) });
    await persist(); render();
  } })));
  if (db.suppliers.length) app.appendChild(h("ul", {}, db.suppliers.map((s) => h("li", {}, `${s.name} — ${s.contact || ""} `, h("button", { type: "button", class: "link-btn", text: "Verwijderen", onclick: async () => {
    db.suppliers = db.suppliers.filter((x) => x.id !== s.id); await persist(); render();
  } })))));

  app.appendChild(h("h2", { text: "Inkoopprijzen (gaan vóór openbare marktprijzen)" }));
  app.appendChild(h("p", { class: "field-hint", text: "Bedragen excl. btw per eenheid zoals de calculatie die telt. Prijzen ouder dan 30 dagen worden in de calculatie gemarkeerd." }));
  const rows = Object.keys(MATERIAL_LINKS).map((key) => {
    const cur = db.purchasePrices[key] || {};
    const price = h("input", { type: "text", inputmode: "decimal", value: centsToInput(cur.amountExclCents), placeholder: "€ excl." });
    const sku = h("input", { type: "text", value: cur.sku || "", placeholder: "SKU" });
    const date = h("input", { type: "date", value: cur.observedAt || today() });
    const sup = select([["", "—"], ...db.suppliers.map((s) => [s.id, s.name])], cur.supplierId || "", () => {});
    const old = cur.observedAt && (Date.now() - Date.parse(cur.observedAt)) / 86400000 > 30;
    return h("tr", {}, h("td", { text: KEY_LABELS[key] || key }), h("td", {}, price), h("td", {}, sup), h("td", {}, sku), h("td", {}, date),
      h("td", {}, old ? h("span", { class: "badge badge-warn", text: "> 30 dagen" }) : null,
        h("button", { type: "button", class: "btn btn-secondary btn-sm", text: "Opslaan", onclick: async () => {
          const c = parseEuroCents(price.value);
          if (c == null) delete db.purchasePrices[key];
          else db.purchasePrices[key] = { amountExclCents: c, supplierId: sup.value || null, sku: sku.value.trim().slice(0, 60), observedAt: date.value || today() };
          await persist(); if (calcState) recalc(); render();
        } })));
  });
  app.appendChild(h("div", { class: "price-table-wrap" }, h("table", { class: "price-table beheer-table" },
    h("thead", {}, h("tr", {}, ["Artikel", "Prijs excl.", "Leverancier", "SKU", "Prijsdatum", ""].map((t) => h("th", { scope: "col", text: t })))), h("tbody", {}, rows))));
}

/* ---------- instellingen ---------- */
function renderSettings() {
  const s = { ...DEFAULT_SETTINGS, ...db.settings };
  const save = async (patch) => { db.settings = { ...db.settings, ...patch }; await persist(); if (calcState) recalc(); render(); };
  app.appendChild(h("h1", { text: "Instellingen" }));
  app.appendChild(h("p", { class: "field-hint", text: "Leeg = niet ingesteld. De calculatie markeert ontbrekende instellingen; er wordt nooit stil een waarde verzonnen. Opslag is op kostprijs; de bijbehorende brutomarge staat erbij." }));
  const pct = (label, key, hint) => {
    const i = textInput(s[key] ?? "", (v) => save({ [key]: parsePct(v) }), "text", { inputmode: "decimal" });
    return field(label, i, s[key] != null ? `${hint ? hint + " " : ""}= ${nl(markupToMarginPct(s[key]), 1)}% brutomarge op verkoopprijs` : hint);
  };
  const money = (label, key, hint) => field(label, textInput(centsToInput(s[key]), (v) => save({ [key]: v === "" ? null : parseEuroCents(v) }), "text", { inputmode: "decimal" }), hint);
  app.appendChild(h("div", { class: "beheer-card beheer-grid" },
    field("Verkoopuurtarief excl. btw", textInput(centsToInput(s.laborRateExclCents), () => {}, "text", { disabled: true }), "Bevestigd 9-10-2026 (€ 60,00 / € 72,60 incl.) — wijzigen in data/calc-defaults.js na nieuw besluit"),
    money("Interne kostprijs arbeid per uur", "laborCostRateCents", "Nodig voor brutomarge"),
    pct("Opslag materiaal (%)", "materialMarkupPct"), pct("Opslag machines (%)", "machineMarkupPct"), pct("Opslag afvoer (%)", "wasteMarkupPct"),
    pct("Algemene kosten (%)", "overheadPct", "Over subtotaal."), pct("Risico/onvoorzien (%)", "riskPct", "Over subtotaal."),
    money("Transport/voorrijden per werkdag", "transportPerDayCents"), money("Minimumorder excl. btw", "minimumOrderExclCents"),
    field("Ploeggrootte", textInput(s.crewSize, (v) => { const n = parseInt(v, 10); if (n >= 1 && n <= 10) save({ crewSize: n }); }, "number", { min: "1", max: "10" })),
    field("Btw-tarief (%)", select([[21, "21%"], [9, "9%"]], s.vatRate, (v) => save({ vatRate: Number(v) })), "9% alleen bij zelfstandige levering van planten/graszoden — laat dit per geval toetsen.")));

  app.appendChild(h("h2", { text: "Productiviteitsnormen (persoonsuren per eenheid)" }));
  const normRows = Object.entries(DEFAULT_NORMS).map(([key, def]) => {
    const own = s.norms?.[key];
    const i = h("input", { type: "text", inputmode: "decimal", value: nl(own?.hoursPerUnit ?? def.hoursPerUnit, 3) });
    return h("tr", {}, h("td", { text: key }), h("td", {}, i), h("td", {}, h("span", { class: `badge ${own ? "badge-ok" : "badge-warn"}`, text: own ? "bevestigd" : "voorbeeld" })), h("td", { class: "small", text: def.note || "" }),
      h("td", {}, h("button", { type: "button", class: "btn btn-secondary btn-sm", text: own ? "Bijwerken" : "Bevestigen", onclick: () => {
        const n = parseFloat(i.value.replace(",", ".")); if (!Number.isFinite(n) || n < 0 || n > 100) return;
        save({ norms: { ...(db.settings.norms || {}), [key]: { hoursPerUnit: n } } });
      } }), own ? h("button", { type: "button", class: "link-btn", text: "Terug naar voorbeeld", onclick: () => { const n = { ...(db.settings.norms || {}) }; delete n[key]; save({ norms: n }); } }) : null));
  });
  app.appendChild(h("div", { class: "price-table-wrap" }, h("table", { class: "price-table beheer-table" },
    h("thead", {}, h("tr", {}, ["Werk", "Uren/eenh.", "Status", "Toelichting", ""].map((t) => h("th", { scope: "col", text: t })))), h("tbody", {}, normRows))));

  const co = db.company;
  const saveCo = async (patch) => { db.company = { ...co, ...patch }; await persist(); render(); };
  app.appendChild(h("h2", { text: "Documentgegevens" }));
  app.appendChild(h("div", { class: "beheer-card beheer-grid" },
    field("Geldigheid offerte (dagen)", textInput(co.offerValidityDays ?? "", (v) => saveCo({ offerValidityDays: parseInt(v, 10) || null }), "number")),
    field("Betaaltermijn factuur (dagen)", textInput(co.paymentTermDays ?? "", (v) => saveCo({ paymentTermDays: parseInt(v, 10) || null }), "number")),
    field("IBAN", textInput(co.iban, (v) => saveCo({ iban: v.replace(/\s+/g, " ").toUpperCase().slice(0, 40) }))),
    field("Voorvoegsel offertenummer", textInput(co.quotePrefix, (v) => saveCo({ quotePrefix: v.slice(0, 8) }))),
    field("Voorvoegsel factuurnummer", textInput(co.invoicePrefix, (v) => saveCo({ invoicePrefix: v.slice(0, 8) })))));
}

/* ---------- back-up ---------- */
function renderBackup() {
  app.appendChild(h("h1", { text: "Back-up" }));
  app.appendChild(h("p", { class: "field-hint", text: "De back-up is net zo versleuteld als de kluis en alleen te openen met hetzelfde wachtwoord. Bewaar hem op een veilige plek (bijv. versleutelde schijf). Wissen van browsergegevens wist ook de kluis." }));
  const msg = h("div");
  const file = h("input", { type: "file", accept: ".json,application/json" });
  const pw = h("input", { type: "password", autocomplete: "current-password", placeholder: "Wachtwoord van de back-up" });
  app.appendChild(h("div", { class: "beheer-card" },
    h("button", { type: "button", class: "btn btn-primary", text: "Versleutelde back-up downloaden", onclick: async () => {
      const blob = await vault.exportBlob();
      const url = URL.createObjectURL(new Blob([JSON.stringify(blob)], { type: "application/json" }));
      const a = h("a", { href: url, download: `sealcleaning-beheer-backup-${today()}.json` }); a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } }),
    h("h2", { text: "Back-up terugzetten" }), field("Back-upbestand", file), field("Wachtwoord", pw),
    h("button", { type: "button", class: "btn btn-secondary", text: "Terugzetten (vervangt huidige kluis)", onclick: async () => {
      msg.innerHTML = "";
      try {
        const blob = JSON.parse(await file.files[0].text());
        if (!confirm("De huidige kluis op dit apparaat wordt vervangen. Doorgaan?")) return;
        vault = await restoreBackup(blob, pw.value);
        db = { ...emptyDb(), ...vault.data };
        msg.appendChild(status("Back-up teruggezet."));
        render();
      } catch (e) { msg.appendChild(status(e.message || "Terugzetten mislukt.", true)); }
    } }), msg,
    h("details", { class: "beheer-danger" }, h("summary", { text: "Alles wissen op dit apparaat" }),
      h("button", { type: "button", class: "btn btn-secondary btn-sm", text: "Kluis definitief wissen", onclick: () => {
        if (confirm("Alle beheergegevens op dit apparaat definitief wissen? Maak eerst een back-up.")) { wipeVault(); vault = null; db = null; renderLock(); }
      } }))));
  const raw = readRawVault();
  if (raw) app.appendChild(h("p", { class: "field-hint", text: `Laatst opgeslagen: ${new Date(raw.savedAt).toLocaleString("nl-NL")} · ${db.customers.length} klanten · ${db.projects.length} projecten · ${db.quotes.length} offertes.` }));
}

if (!window.crypto?.subtle) {
  app.appendChild(h("p", { class: "field-error", text: "Deze browser ondersteunt de benodigde versleuteling niet (vereist HTTPS en een moderne browser)." }));
} else {
  renderLock();
  loadPriceSources().catch(() => {});
}
