/**
 * Domeinlogica: offertes (server-side calculatie), facturen, betalingen,
 * agenda (ICS), bestanden, bewaartermijnen en back-ups.
 * Interne calculatiegegevens (kostprijs, opslag, marge, inkoop) blijven in
 * quotes.internal_json en gaan nooit naar klant-API's.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createHash, randomBytes, createCipheriv, createDecipheriv } from "node:crypto";
import { takeoff } from "../../js/calc/quantities.js";
import { calculate, customerLines } from "../../js/calc/engine.js";
import { now, newId, getSetting, nextCounter, audit } from "./db.js";
import { HttpError } from "./http.js";

export const PROJECT_STATUSES = ["Aanvraag", "Opname gepland", "Offerte in voorbereiding", "Offerte verstuurd", "Akkoord", "Ingepland", "In uitvoering", "Opgeleverd", "Gefactureerd", "Betaald", "Afgesloten", "Vervallen"];
export const PRICE_TYPES = {
  vast: ["Vaste prijs", "De genoemde prijs is vast voor de omschreven scope. Meer- of minderwerk alleen na overleg en akkoord."],
  richtprijs: ["Richtprijs", "Indicatie op basis van de huidige informatie; de definitieve prijs volgt na opname/controle."],
  regie: ["Regie (nacalculatie)", "Uren tegen € 60,00 excl. btw per medewerker per uur en materiaal tegen werkelijk verbruik; genoemde bedragen zijn een raming."],
  stelpost: ["Met stelposten", "Posten met 'stelpost' worden verrekend op basis van werkelijke kosten."]
};
export const DEFAULT_EXCLUDED = "Vergunningen en leges; elektra-aansluiting door een installateur; verwijderen van onvoorziene obstakels in de grond; werk aan kabels en leidingen; herstel van schade door verborgen gebreken.";
export const DEFAULT_COMPANY = { offerValidityDays: null, paymentTermDays: null, iban: "", quotePrefix: "OFF", invoicePrefix: "F" };

export function stableStringify(v) {
  if (Array.isArray(v)) return "[" + v.map(stableStringify).join(",") + "]";
  if (v && typeof v === "object") return "{" + Object.keys(v).sort().map((k) => JSON.stringify(k) + ":" + stableStringify(v[k])).join(",") + "}";
  return JSON.stringify(v);
}
const sha = (s) => createHash("sha256").update(s).digest("hex");

/** Openbare bedrijfsgegevens uit js/config.js (één bron met de website). */
export function readCompanyPublic(siteRoot) {
  const src = readFileSync(join(siteRoot, "js/config.js"), "utf8");
  const pick = (k) => (new RegExp(`${k}:\\s*"([^"]*)"`).exec(src) || [])[1] || "";
  return { businessName: pick("businessName"), addressLine1: pick("addressLine1"), addressLine2: pick("addressLine2"), kvk: pick("kvk"), btw: pick("btw"), email: pick("email"), phoneDisplay: pick("phoneDisplay") };
}

let priceCache = null;
export function priceSources(siteRoot) {
  if (!priceCache) priceCache = JSON.parse(readFileSync(join(siteRoot, "data/price-sources.json"), "utf8"));
  return priceCache;
}

export function purchaseMap(db) {
  const out = {};
  for (const r of db.all("SELECT p.*, s.name AS supplier_name FROM purchase_prices p LEFT JOIN suppliers s ON s.id = p.supplier_id")) {
    out[r.key] = { amountExclCents: r.amount_excl, supplier: r.supplier_name || undefined, sku: r.sku || undefined, observedAt: r.observed_at };
  }
  return out;
}

export function runCalculation(db, cfg, design) {
  const takeoffRows = takeoff(design);
  const result = calculate({ takeoffRows, settings: getSetting(db, "calc", {}), priceSources: priceSources(cfg.siteRoot), purchasePrices: purchaseMap(db) });
  return { takeoffRows, result };
}

function cleanManualLines(lines) {
  if (!Array.isArray(lines) || lines.length > 50) throw new HttpError(400, "Ongeldige handmatige regels.");
  return lines.map((l) => {
    const qty = Number(l.qty), price = Number(l.unitSaleExclCents);
    if (!String(l.label || "").trim() || !Number.isFinite(qty) || qty <= 0 || qty > 100000 || !Number.isInteger(price) || Math.abs(price) > 1e9) throw new HttpError(400, "Ongeldige handmatige regel.");
    return { label: String(l.label).trim().slice(0, 160), qty, unit: String(l.unit || "post").slice(0, 12), unitSaleExclCents: price };
  });
}

function buildQuoteParts(db, cfg, project, { manualLines, priceType, excluded, customerWork, poRef, number, version, createdAt }) {
  if (!project.design_json) throw new HttpError(400, "Dit project heeft nog geen ontwerp.");
  const design = JSON.parse(project.design_json);
  const { takeoffRows, result } = runCalculation(db, cfg, design);
  const ml = cleanManualLines(manualLines || []);
  const cust = customerLines(result, ml);
  const vatRate = result.settingsUsed.vatRate;
  const vat = Math.round(cust.totalExclCents * vatRate / 100);
  const company = getSetting(db, "company", DEFAULT_COMPANY);
  const pt = PRICE_TYPES[priceType] ? priceType : "richtprijs";
  const validUntil = company.offerValidityDays ? new Date(Date.parse(createdAt) + company.offerValidityDays * 86400e3).toISOString().slice(0, 10) : null;
  const snapshot = {
    number, version, date: createdAt.slice(0, 10), projectRef: project.ref, projectTitle: project.title,
    priceType: pt, priceTypeLabel: PRICE_TYPES[pt][0], priceTypeText: PRICE_TYPES[pt][1],
    lines: cust.lines, onRequest: cust.onRequest,
    assumptions: takeoffRows.filter((t) => t.assumption).map((t) => `${t.label}: ${t.assumption}`),
    totals: { excl: cust.totalExclCents, vatRate, vat, incl: cust.totalExclCents + vat },
    excluded: excluded ?? DEFAULT_EXCLUDED, customerWork: customerWork || "", poRef: poRef || "",
    validUntil, termsVersion: cfg.termsVersion, readiness: result.readiness,
    company: readCompanyPublic(cfg.siteRoot)
  };
  return { snapshot, internal: { result, takeoffRows, manualLines: ml }, manual: ml, hash: sha(stableStringify(snapshot)) };
}

export function createQuote(db, cfg, projectId, opts, actor) {
  const project = db.get("SELECT * FROM projects WHERE id = ?", projectId);
  if (!project) throw new HttpError(404, "Project niet gevonden.");
  const company = getSetting(db, "company", DEFAULT_COMPANY);
  return db.tx(() => {
    let number, version = 1, parentId = null;
    if (opts.parentId) {
      const parent = db.get("SELECT * FROM quotes WHERE id = ? AND project_id = ?", opts.parentId, projectId);
      if (!parent) throw new HttpError(404, "Oorspronkelijke offerte niet gevonden.");
      const base = parent.number.replace(/-v\d+$/, "");
      version = db.get("SELECT COUNT(*) AS n FROM quotes WHERE number = ? OR number LIKE ?", base, `${base}-v%`).n + 1;
      number = `${base}-v${version}`;
      parentId = parent.id;
      if (opts.manualLines === undefined) opts.manualLines = JSON.parse(parent.manual_lines_json);
      for (const k of ["priceType", "excluded", "customerWork", "poRef"]) if (opts[k] === undefined) opts[k] = { priceType: parent.price_type, excluded: parent.excluded, customerWork: parent.customer_work, poRef: parent.po_ref }[k];
    } else {
      const year = new Date().getFullYear();
      number = `${company.quotePrefix || "OFF"}-${year}-${String(nextCounter(db, `quote-${year}`)).padStart(3, "0")}`;
    }
    const createdAt = now();
    const parts = buildQuoteParts(db, cfg, project, { ...opts, number, version, createdAt });
    const id = newId("q");
    db.run(`INSERT INTO quotes (id, project_id, number, version, parent_id, status, price_type, excluded, customer_work, po_ref, valid_until, manual_lines_json, snapshot_json, internal_json, snapshot_hash, created_at, created_by)
            VALUES (?,?,?,?,?,'concept',?,?,?,?,?,?,?,?,?,?,?)`,
      id, projectId, number, version, parentId, parts.snapshot.priceType, parts.snapshot.excluded, parts.snapshot.customerWork, parts.snapshot.poRef, parts.snapshot.validUntil,
      JSON.stringify(parts.manual), JSON.stringify(parts.snapshot), JSON.stringify(parts.internal), parts.hash, createdAt, actor);
    setProjectStatus(db, projectId, "Offerte in voorbereiding", actor);
    audit(db, actor, "offerte aangemaakt", number);
    return id;
  });
}

/** Alleen concepten zijn te herberekenen; verstuurde/geaccepteerde versies zijn onveranderlijk. */
export function updateQuote(db, cfg, quoteId, opts, actor) {
  const q = db.get("SELECT * FROM quotes WHERE id = ?", quoteId);
  if (!q) throw new HttpError(404, "Offerte niet gevonden.");
  if (q.status !== "concept") throw new HttpError(409, "Een verstuurde of geaccepteerde offerte wordt niet gewijzigd. Maak een nieuwe versie.");
  const project = db.get("SELECT * FROM projects WHERE id = ?", q.project_id);
  const merged = {
    manualLines: opts.manualLines ?? JSON.parse(q.manual_lines_json), priceType: opts.priceType ?? q.price_type,
    excluded: opts.excluded ?? q.excluded, customerWork: opts.customerWork ?? q.customer_work, poRef: opts.poRef ?? q.po_ref
  };
  const parts = buildQuoteParts(db, cfg, project, { ...merged, number: q.number, version: q.version, createdAt: q.created_at });
  db.run(`UPDATE quotes SET price_type=?, excluded=?, customer_work=?, po_ref=?, valid_until=?, manual_lines_json=?, snapshot_json=?, internal_json=?, snapshot_hash=? WHERE id=?`,
    parts.snapshot.priceType, parts.snapshot.excluded, parts.snapshot.customerWork, parts.snapshot.poRef, parts.snapshot.validUntil,
    JSON.stringify(parts.manual), JSON.stringify(parts.snapshot), JSON.stringify(parts.internal), parts.hash, quoteId);
  audit(db, actor, "offerte bijgewerkt", q.number);
}

export function sendQuote(db, quoteId, actor) {
  const q = db.get("SELECT * FROM quotes WHERE id = ?", quoteId);
  if (!q) throw new HttpError(404, "Offerte niet gevonden.");
  if (q.status !== "concept") throw new HttpError(409, "Deze offerte is al verstuurd.");
  const snap = JSON.parse(q.snapshot_json);
  if (snap.onRequest.length && q.price_type === "vast") throw new HttpError(409, "Een vaste prijs kan niet worden verstuurd zolang er posten op aanvraag zijn.");
  db.run("UPDATE quotes SET status = 'verstuurd', sent_at = ? WHERE id = ?", now(), quoteId);
  setProjectStatus(db, q.project_id, "Offerte verstuurd", actor);
  audit(db, actor, "offerte verstuurd", q.number);
  return q;
}

export function setProjectStatus(db, projectId, status, actor, customerVisible = true) {
  const p = db.get("SELECT status FROM projects WHERE id = ?", projectId);
  if (!p || p.status === status) return;
  if (!PROJECT_STATUSES.includes(status)) throw new HttpError(400, "Onbekende status.");
  db.run("UPDATE projects SET status = ?, updated_at = ? WHERE id = ?", status, now(), projectId);
  db.run("INSERT INTO project_events (project_id, at, kind, data_json, actor, customer_visible) VALUES (?,?,?,?,?,?)", projectId, now(), "status", JSON.stringify({ status }), actor, customerVisible ? 1 : 0);
}

/* ---------- facturen ---------- */
export function createInvoiceFromQuote(db, quoteId, actor, { part } = {}) {
  const q = db.get("SELECT q.*, p.customer_id FROM quotes q JOIN projects p ON p.id = q.project_id WHERE q.id = ?", quoteId);
  if (!q) throw new HttpError(404, "Offerte niet gevonden.");
  if (q.status !== "akkoord") throw new HttpError(409, "Factureren kan pas na akkoord.");
  const snap = JSON.parse(q.snapshot_json);
  let lines = snap.lines, excl = snap.totals.excl;
  if (part) { // termijnfactuur: percentage van de offerte
    const pct = Number(part.pct);
    if (!(pct > 0 && pct <= 100)) throw new HttpError(400, "Ongeldig termijnpercentage.");
    excl = Math.round(snap.totals.excl * pct / 100);
    lines = [{ label: `${String(part.label || "Termijn").slice(0, 80)} (${pct}% van offerte ${snap.number})`, qty: 1, unit: "post", unitSaleExclCents: excl, saleExclCents: excl }];
  }
  const vat = Math.round(excl * snap.totals.vatRate / 100);
  const id = newId("inv");
  db.run(`INSERT INTO invoices (id, kind, quote_id, project_id, customer_id, status, lines_json, total_excl, vat_rate, vat, total_incl, po_ref, created_at)
          VALUES (?, 'invoice', ?, ?, ?, 'concept', ?, ?, ?, ?, ?, ?, ?)`, id, q.id, q.project_id, q.customer_id, JSON.stringify(lines), excl, snap.totals.vatRate, vat, excl + vat, q.po_ref, now());
  audit(db, actor, "factuurconcept aangemaakt", q.number);
  return id;
}

export function createCredit(db, invoiceId, { amountExclCents, reason }, actor) {
  const inv = db.get("SELECT * FROM invoices WHERE id = ?", invoiceId);
  if (!inv || inv.kind !== "invoice" || !inv.number) throw new HttpError(409, "Alleen een uitgegeven factuur kan worden gecrediteerd.");
  const amt = Number(amountExclCents);
  if (!Number.isInteger(amt) || amt <= 0 || amt > inv.total_excl) throw new HttpError(400, "Ongeldig creditbedrag.");
  if (!String(reason || "").trim()) throw new HttpError(400, "Reden is verplicht.");
  const vat = -Math.round(amt * inv.vat_rate / 100);
  const id = newId("inv");
  db.run(`INSERT INTO invoices (id, kind, quote_id, project_id, customer_id, ref_invoice_id, status, lines_json, total_excl, vat_rate, vat, total_incl, reason, created_at)
          VALUES (?, 'credit', ?, ?, ?, ?, 'concept', ?, ?, ?, ?, ?, ?, ?)`, id, inv.quote_id, inv.project_id, inv.customer_id, inv.id,
    JSON.stringify([{ label: `Creditering factuur ${inv.number}: ${String(reason).trim().slice(0, 200)}`, qty: 1, unit: "post", unitSaleExclCents: -amt, saleExclCents: -amt }]),
    -amt, inv.vat_rate, vat, -amt + vat, String(reason).trim().slice(0, 300), now());
  audit(db, actor, "creditnota-concept aangemaakt", inv.number);
  return id;
}

/** Uitgifte: nummer pas nu toegekend, in één transactie → doorlopende reeks zonder gaten. */
export function issueInvoice(db, invoiceId, { deliveryDate } = {}, actor) {
  const company = getSetting(db, "company", DEFAULT_COMPANY);
  if (!company.paymentTermDays || !company.iban) throw new HttpError(409, "Stel eerst betaaltermijn en IBAN in (Instellingen → Documentgegevens).");
  return db.tx(() => {
    const inv = db.get("SELECT * FROM invoices WHERE id = ?", invoiceId);
    if (!inv) throw new HttpError(404, "Factuur niet gevonden.");
    if (inv.status !== "concept") throw new HttpError(409, "Deze factuur is al uitgegeven.");
    const year = new Date().getFullYear();
    const seq = (db.get("SELECT MAX(seq) AS m FROM invoices WHERE year = ?", year).m || 0) + 1;
    const number = `${company.invoicePrefix || "F"}${year}${String(seq).padStart(4, "0")}`;
    const issue = now().slice(0, 10);
    const due = new Date(Date.now() + company.paymentTermDays * 86400e3).toISOString().slice(0, 10);
    const dd = /^\d{4}-\d{2}-\d{2}$/.test(deliveryDate || "") ? deliveryDate : issue;
    db.run("UPDATE invoices SET number=?, year=?, seq=?, issue_date=?, due_date=?, delivery_date=?, status='verstuurd', issued_at=? WHERE id=?", number, year, seq, issue, inv.kind === "credit" ? null : due, dd, now(), inv.id);
    if (inv.kind === "invoice" && inv.project_id) setProjectStatus(db, inv.project_id, "Gefactureerd", actor);
    if (inv.kind === "credit") {
      const ref = db.get("SELECT * FROM invoices WHERE id = ?", inv.ref_invoice_id);
      const credited = -db.get("SELECT COALESCE(SUM(total_excl),0) AS s FROM invoices WHERE ref_invoice_id = ? AND status != 'concept'", ref.id).s;
      if (credited >= ref.total_excl) db.run("UPDATE invoices SET status = 'gecrediteerd' WHERE id = ?", ref.id);
    }
    audit(db, actor, inv.kind === "credit" ? "creditnota uitgegeven" : "factuur uitgegeven", number);
    return number;
  });
}

export function invoicePaid(db, invoiceId) {
  return db.get("SELECT COALESCE(SUM(amount),0) AS s FROM payments WHERE invoice_id = ? AND status = 'paid'", invoiceId).s;
}

export function registerPayment(db, invoiceId, { amount, method, receivedAt, providerId }, actor) {
  return db.tx(() => {
    const inv = db.get("SELECT * FROM invoices WHERE id = ?", invoiceId);
    if (!inv || inv.kind !== "invoice" || !inv.number) throw new HttpError(409, "Betalingen alleen op een uitgegeven factuur.");
    if (!Number.isInteger(amount) || amount <= 0 || amount > 1e10) throw new HttpError(400, "Ongeldig bedrag.");
    if (providerId) {
      const ex = db.get("SELECT * FROM payments WHERE provider_id = ?", providerId);
      if (ex && ex.status === "paid") return ex.id; // idempotent bij herhaalde webhook
      if (ex) { db.run("UPDATE payments SET status='paid', amount=?, received_at=? WHERE id=?", amount, receivedAt || now(), ex.id); }
      else db.run("INSERT INTO payments (id, invoice_id, amount, method, provider_id, status, received_at, created_at, created_by) VALUES (?,?,?,?,?,'paid',?,?,?)", newId("pay"), invoiceId, amount, method, providerId, receivedAt || now(), now(), actor);
    } else {
      db.run("INSERT INTO payments (id, invoice_id, amount, method, status, received_at, created_at, created_by) VALUES (?,?,?,?,'paid',?,?,?)", newId("pay"), invoiceId, amount, method, receivedAt || now(), now(), actor);
    }
    const paid = invoicePaid(db, invoiceId);
    if (paid >= inv.total_incl && inv.status === "verstuurd") {
      db.run("UPDATE invoices SET status = 'betaald' WHERE id = ?", invoiceId);
      if (inv.project_id) setProjectStatus(db, inv.project_id, "Betaald", actor);
    }
    audit(db, actor, "betaling geregistreerd", `${inv.number} ${amount}`);
  });
}

/* ---------- Mollie (alleen met MOLLIE_API_KEY) ---------- */
const euro = (c) => (c / 100).toFixed(2);
export async function createMolliePayment(db, cfg, invoiceId, fetchImpl = fetch) {
  if (!cfg.mollieKey) throw new HttpError(503, "Online betalen is nog niet operationeel: er is geen betaalprovider gekoppeld.");
  const inv = db.get("SELECT * FROM invoices WHERE id = ?", invoiceId);
  if (!inv || inv.kind !== "invoice" || inv.status !== "verstuurd") throw new HttpError(409, "Deze factuur staat niet open.");
  const open = inv.total_incl - invoicePaid(db, invoiceId);
  if (open <= 0) throw new HttpError(409, "Deze factuur is al betaald.");
  const existing = db.get("SELECT * FROM payments WHERE invoice_id = ? AND method = 'mollie' AND status = 'open' AND amount = ? ORDER BY created_at DESC", invoiceId, open);
  if (existing?.checkout_url) return existing.checkout_url;
  const r = await fetchImpl("https://api.mollie.com/v2/payments", {
    method: "POST", headers: { Authorization: `Bearer ${cfg.mollieKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: { currency: "EUR", value: euro(open) }, description: `Factuur ${inv.number}`,
      redirectUrl: `${cfg.publicBaseUrl}/portaal/?betaling=${encodeURIComponent(inv.number)}`, webhookUrl: `${cfg.publicBaseUrl}/api/payments/mollie/webhook`, metadata: { invoiceId } })
  });
  if (!r.ok) throw new HttpError(502, "De betaalprovider gaf een fout. Probeer het later opnieuw.");
  const p = await r.json();
  db.run("INSERT INTO payments (id, invoice_id, amount, method, provider_id, status, checkout_url, created_at, created_by) VALUES (?,?,?,'mollie',?,'open',?,?,'klant')", newId("pay"), invoiceId, open, p.id, p._links?.checkout?.href || null, now());
  return p._links?.checkout?.href;
}

/** Webhook: nooit de inhoud vertrouwen; status altijd opnieuw bij Mollie ophalen. */
export async function handleMollieWebhook(db, cfg, paymentId, fetchImpl = fetch) {
  if (!cfg.mollieKey || !/^tr_[A-Za-z0-9]+$/.test(paymentId || "")) return;
  const row = db.get("SELECT * FROM payments WHERE provider_id = ?", paymentId);
  if (!row) return;
  const r = await fetchImpl(`https://api.mollie.com/v2/payments/${paymentId}`, { headers: { Authorization: `Bearer ${cfg.mollieKey}` } });
  if (!r.ok) throw new HttpError(502, "Kon betaling niet verifiëren.");
  const p = await r.json();
  if (p.metadata?.invoiceId !== row.invoice_id) return;
  if (p.status === "paid") {
    registerPayment(db, row.invoice_id, { amount: Math.round(Number(p.amount.value) * 100), method: "mollie", receivedAt: p.paidAt, providerId: p.id }, "mollie");
  } else if (["canceled", "expired", "failed"].includes(p.status)) {
    db.run("UPDATE payments SET status = ? WHERE id = ?", p.status, row.id);
  }
}

/* ---------- agenda (ICS) ---------- */
const icsEsc = (s) => String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const icsDate = (iso) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
export function buildIcs(appointments, calName) {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Sealcleaning//Planning//NL", "CALSCALE:GREGORIAN", `X-WR-CALNAME:${icsEsc(calName)}`];
  for (const a of appointments) {
    lines.push("BEGIN:VEVENT", `UID:${a.id}@sealcleaning.nl`, `DTSTAMP:${icsDate(new Date().toISOString())}`, `DTSTART:${icsDate(a.starts_at)}`, `DTEND:${icsDate(a.ends_at)}`,
      `SUMMARY:${icsEsc(a.summary)}`, a.location ? `LOCATION:${icsEsc(a.location)}` : null, a.note ? `DESCRIPTION:${icsEsc(a.note)}` : null,
      `STATUS:${a.status === "geannuleerd" ? "CANCELLED" : "CONFIRMED"}`, "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.filter(Boolean).map((l) => l.length > 74 ? l.match(/.{1,74}/g).join("\r\n ") : l).join("\r\n") + "\r\n";
}

/* ---------- bestanden ---------- */
export function saveAttachment(db, cfg, { ownerType, ownerId, file, customerVisible = false }) {
  mkdirSync(cfg.filesDir, { recursive: true, mode: 0o700 });
  const stored = `${randomBytes(18).toString("base64url")}.${file.ext}`;
  const path = join(cfg.filesDir, stored);
  writeFileSync(path, file.data, { mode: 0o600 });
  const id = newId("att");
  db.run("INSERT INTO attachments (id, owner_type, owner_id, filename, mime, size, stored_name, sha256, customer_visible, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
    id, ownerType, ownerId, file.filename, file.mime, file.data.length, stored, sha(file.data), customerVisible ? 1 : 0, now());
  return id;
}
export function deleteAttachmentsOf(db, cfg, ownerType, ownerId) {
  for (const a of db.all("SELECT * FROM attachments WHERE owner_type = ? AND owner_id = ?", ownerType, ownerId)) {
    rmSync(join(cfg.filesDir, a.stored_name), { force: true });
  }
  db.run("DELETE FROM attachments WHERE owner_type = ? AND owner_id = ?", ownerType, ownerId);
}

/* ---------- bewaartermijnen (N07) ---------- */
export function runRetention(db, cfg) {
  const r = getSetting(db, "retention", { leadDays: null, applicationDays: null });
  const t = now();
  db.run("DELETE FROM sessions WHERE expires_at < ?", t);
  db.run("DELETE FROM portal_tokens WHERE expires_at < ?", new Date(Date.now() - 86400e3).toISOString());
  let removed = 0;
  const purge = (where, days) => {
    if (!days) return;
    const cutoff = new Date(Date.now() - days * 86400e3).toISOString();
    for (const l of db.all(`SELECT id, ref FROM leads WHERE ${where} AND project_id IS NULL AND created_at < ?`, cutoff)) {
      deleteAttachmentsOf(db, cfg, "lead", l.id);
      db.run("DELETE FROM leads WHERE id = ?", l.id);
      audit(db, "systeem", "aanvraag verwijderd (bewaartermijn)", l.ref);
      removed++;
    }
  };
  purge("kind = 'werken'", r.applicationDays);
  purge("kind != 'werken'", r.leadDays);
  return removed;
}

/* ---------- back-up (AES-256-GCM) ---------- */
function backupKey(cfg) {
  const k = Buffer.from(cfg.backupKey || "", "base64");
  if (k.length !== 32) throw new Error("BACKUP_KEY ontbreekt of is geen 32-byte base64-sleutel (genereer: node server/cli.js gen-key).");
  return k;
}
function encFile(key, src, dst) {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key, iv);
  const body = Buffer.concat([c.update(readFileSync(src)), c.final()]);
  writeFileSync(dst, Buffer.concat([Buffer.from("SEALBK1"), iv, c.getAuthTag(), body]), { mode: 0o600 });
}
function decFile(key, src, dst) {
  const b = readFileSync(src);
  if (b.slice(0, 7).toString() !== "SEALBK1") throw new Error("Geen Sealcleaning-back-up.");
  const d = createDecipheriv("aes-256-gcm", key, b.slice(7, 19));
  d.setAuthTag(b.slice(19, 35));
  writeFileSync(dst, Buffer.concat([d.update(b.slice(35)), d.final()]), { mode: 0o600 });
}
export function createBackup(db, cfg) {
  const key = backupKey(cfg);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const dir = join(cfg.backupDir, stamp);
  mkdirSync(join(dir, "files"), { recursive: true, mode: 0o700 });
  const tmp = join(dir, "db.tmp");
  db.raw.exec(`VACUUM INTO '${tmp.replace(/'/g, "''")}'`);
  encFile(key, tmp, join(dir, "db.sqlite.enc"));
  rmSync(tmp);
  if (existsSync(cfg.filesDir)) for (const f of readdirSync(cfg.filesDir)) encFile(key, join(cfg.filesDir, f), join(dir, "files", f + ".enc"));
  writeFileSync(join(dir, "manifest.json"), JSON.stringify({ createdAt: now(), files: existsSync(cfg.filesDir) ? readdirSync(cfg.filesDir).length : 0 }));
  const all = readdirSync(cfg.backupDir).filter((d) => /^\d{4}-/.test(d)).sort();
  for (const old of all.slice(0, Math.max(0, all.length - cfg.backupKeep))) rmSync(join(cfg.backupDir, old), { recursive: true, force: true });
  audit(db, "systeem", "back-up gemaakt", stamp);
  return dir;
}
export function restoreBackup(cfg, backupPath, targetDataDir) {
  const key = backupKey(cfg);
  mkdirSync(join(targetDataDir, "files"), { recursive: true, mode: 0o700 });
  decFile(key, join(backupPath, "db.sqlite.enc"), join(targetDataDir, "seal.sqlite"));
  const fdir = join(backupPath, "files");
  if (existsSync(fdir)) for (const f of readdirSync(fdir)) decFile(key, join(fdir, f), join(targetDataDir, "files", f.replace(/\.enc$/, "")));
  return targetDataDir;
}
