/**
 * Klantportaal-API. Iedere query is gebonden aan de ingelogde klant
 * (project.customer_id = sessie.customer_id). Klanten zien alleen de
 * offerte-momentopname (snapshot), nooit internal_json, inkoop of marge.
 */
import { HttpError, readJson, readMultipart, rateLimit, clearSessionCookie, parseCookies, cookieName } from "../http.js";
import { now, newId, audit } from "../db.js";
import { guards } from "../app.js";
import { destroySession } from "../auth.js";
import { queueMail } from "../mail.js";
import { setProjectStatus, invoicePaid, createMolliePayment, saveAttachment } from "../services.js";
import { buildIcsFor, sendFile } from "./admin.js";

const str = (v, max) => String(v ?? "").trim().slice(0, max);

function ownProject(ctx, projectId) {
  const cid = guards.customer(ctx);
  const p = ctx.db.get("SELECT * FROM projects WHERE id = ? AND customer_id = ?", projectId, cid);
  if (!p) throw new HttpError(404, "Project niet gevonden.");
  return p;
}
function ownQuote(ctx, quoteId) {
  const cid = guards.customer(ctx);
  const q = ctx.db.get("SELECT q.* FROM quotes q JOIN projects p ON p.id = q.project_id WHERE q.id = ? AND p.customer_id = ? AND q.status != 'concept'", quoteId, cid);
  if (!q) throw new HttpError(404, "Offerte niet gevonden.");
  return q;
}
function ownInvoice(ctx, invoiceId) {
  const cid = guards.customer(ctx);
  const i = ctx.db.get("SELECT * FROM invoices WHERE id = ? AND customer_id = ? AND number IS NOT NULL", invoiceId, cid);
  if (!i) throw new HttpError(404, "Factuur niet gevonden.");
  return i;
}
function notifyStaff(ctx, subject, text) {
  if (ctx.cfg.staffNotify) queueMail(ctx.db, { kind: "melding", to: ctx.cfg.staffNotify, subject, text: `${text}\n\n${ctx.cfg.publicBaseUrl}/admin/` });
}

export function registerPortal(r) {
  r.post("/api/portal/logout", (ctx) => {
    destroySession(ctx.db, parseCookies(ctx.req)[cookieName(ctx.cfg)]);
    clearSessionCookie(ctx.res, ctx.cfg);
    ctx.json(200, { ok: true });
  });

  r.get("/api/portal/me", (ctx) => {
    const cid = guards.customer(ctx);
    const c = ctx.db.get("SELECT name, email, phone, address, type FROM customers WHERE id = ?", cid);
    if (!c) throw new HttpError(401, "Niet ingelogd.");
    ctx.json(200, { ...c, projects: ctx.db.all("SELECT id, ref, title, status, updated_at FROM projects WHERE customer_id = ? ORDER BY updated_at DESC", cid),
      consents: ctx.db.all("SELECT kind, granted, at FROM consents WHERE customer_id = ? ORDER BY at DESC", cid) });
  });

  r.get("/api/portal/projects/:id", (ctx) => {
    const p = ownProject(ctx, ctx.params.id);
    const d = ctx.db;
    ctx.json(200, {
      id: p.id, ref: p.ref, title: p.title, status: p.status,
      timeline: d.all("SELECT at, kind, data_json FROM project_events WHERE project_id = ? AND customer_visible = 1 ORDER BY id", p.id).map((e) => ({ at: e.at, kind: e.kind, ...JSON.parse(e.data_json || "{}") })),
      quotes: d.all("SELECT id, number, version, status, snapshot_json, sent_at, accepted_at FROM quotes WHERE project_id = ? AND status != 'concept' ORDER BY created_at DESC", p.id)
        .map((q) => ({ id: q.id, number: q.number, version: q.version, status: q.status, sentAt: q.sent_at, acceptedAt: q.accepted_at, document: JSON.parse(q.snapshot_json) })),
      invoices: d.all("SELECT * FROM invoices WHERE project_id = ? AND number IS NOT NULL ORDER BY issued_at DESC", p.id)
        .map((i) => ({ id: i.id, kind: i.kind, number: i.number, issueDate: i.issue_date, deliveryDate: i.delivery_date, dueDate: i.due_date, status: i.status, lines: JSON.parse(i.lines_json), totalExcl: i.total_excl, vatRate: i.vat_rate, vat: i.vat, totalIncl: i.total_incl, paid: invoicePaid(d, i.id), reason: i.reason, poRef: i.po_ref })),
      appointments: d.all("SELECT id, kind, starts_at, ends_at, status, location, note, proposed_by FROM appointments WHERE project_id = ? AND status != 'geannuleerd' ORDER BY starts_at", p.id),
      messages: d.all("SELECT id, author_type, body, created_at FROM messages WHERE project_id = ? ORDER BY created_at", p.id),
      files: d.all("SELECT id, filename, size, created_at FROM attachments WHERE owner_type = 'project' AND owner_id = ? AND customer_visible = 1", p.id),
      payOnline: !!ctx.cfg.mollieKey
    });
  });

  /* Digitaal akkoord (K06): identiteit (ingelogde klant + naam), versie (hash), voorwaarden en toestemmingen vastgelegd. */
  r.post("/api/portal/quotes/:id/accept", async (ctx) => {
    const q = ownQuote(ctx, ctx.params.id);
    rateLimit(`accept:${ctx.ipHash}`, 10, 3600e3);
    const b = await readJson(ctx.req);
    if (q.status !== "verstuurd") throw new HttpError(409, q.status === "akkoord" ? "Deze offerte is al geaccepteerd." : "Deze offerte kan niet (meer) worden geaccepteerd.");
    if (q.valid_until && q.valid_until < now().slice(0, 10)) throw new HttpError(409, "De geldigheid van deze offerte is verlopen. Neem contact op voor een nieuwe versie.");
    if (b.snapshotHash !== q.snapshot_hash) throw new HttpError(409, "De offerte is gewijzigd sinds u hem opende. Herlaad de pagina.");
    if (b.agreeTerms !== true) throw new HttpError(400, "Bevestig dat u akkoord gaat met de offerte en de algemene voorwaarden.");
    const name = str(b.name, 120);
    if (name.length < 2) throw new HttpError(400, "Vul uw volledige naam in.");
    const consents = { terms: true, earlyStart: b.earlyStart === true, withdrawalInfoRead: b.withdrawalInfoRead === true };
    const cid = guards.customer(ctx);
    const c = ctx.db.get("SELECT * FROM customers WHERE id = ?", cid);
    ctx.db.tx(() => {
      ctx.db.run("INSERT INTO acceptances (id, quote_id, accepted_at, name, email, customer_id, ip_hash, ua, snapshot_hash, terms_version, consents_json) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        newId("acc"), q.id, now(), name, c.email, cid, ctx.ipHash, str(ctx.req.headers["user-agent"], 200), q.snapshot_hash, ctx.cfg.termsVersion, JSON.stringify(consents));
      ctx.db.run("UPDATE quotes SET status = 'akkoord', accepted_at = ? WHERE id = ?", now(), q.id);
      if (consents.earlyStart) ctx.db.run("INSERT INTO consents (id, customer_id, project_id, kind, granted, at, source, text_version) VALUES (?,?,?,?,1,?,?,?)", newId("cns"), cid, q.project_id, "vroeg-starten", now(), `offerte:${q.number}`, ctx.cfg.termsVersion);
      setProjectStatus(ctx.db, q.project_id, "Akkoord", "klant");
    });
    audit(ctx.db, "klant", "offerte digitaal geaccepteerd", q.number, ctx.ipHash);
    const snap = JSON.parse(q.snapshot_json);
    if (c.email) queueMail(ctx.db, { kind: "akkoordbevestiging", to: c.email, subject: `Bevestiging: akkoord op offerte ${q.number}`,
      text: `Beste ${c.name},\n\nWij hebben uw akkoord ontvangen op offerte ${q.number} (versie ${q.version}).\nBedrag: € ${(snap.totals.incl / 100).toFixed(2).replace(".", ",")} incl. btw (${snap.priceTypeLabel}).\nAkkoord gegeven door: ${name} op ${new Date().toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" })}.\nVoorwaarden: ${ctx.cfg.termsVersion}.\n${consents.earlyStart ? "U heeft gevraagd om binnen de bedenktijd te starten.\n" : ""}\nDe volledige offerte blijft beschikbaar in uw klantportaal: ${ctx.cfg.publicBaseUrl}/portaal/\n\nSealcleaning Groenonderhoud en Aanleg` });
    notifyStaff(ctx, `Akkoord ontvangen: ${q.number}`, `${name} heeft offerte ${q.number} digitaal geaccepteerd.`);
    ctx.json(200, { ok: true });
  });

  r.post("/api/portal/quotes/:id/decline", async (ctx) => {
    const q = ownQuote(ctx, ctx.params.id);
    const b = await readJson(ctx.req);
    if (q.status !== "verstuurd") throw new HttpError(409, "Deze offerte kan niet worden afgewezen.");
    ctx.db.run("UPDATE quotes SET status = 'afgewezen' WHERE id = ?", q.id);
    if (str(b.reason, 2000)) ctx.db.run("INSERT INTO messages (id, project_id, author_type, author_id, body, created_at) VALUES (?,?,?,?,?,?)", newId("msg"), q.project_id, "customer", guards.customer(ctx), `Offerte ${q.number} afgewezen: ${str(b.reason, 2000)}`, now());
    audit(ctx.db, "klant", "offerte afgewezen", q.number, ctx.ipHash);
    notifyStaff(ctx, `Offerte afgewezen: ${q.number}`, "De klant heeft de offerte afgewezen.");
    ctx.json(200, { ok: true });
  });

  r.post("/api/portal/projects/:id/messages", async (ctx) => {
    const p = ownProject(ctx, ctx.params.id);
    rateLimit(`msg:${ctx.ipHash}`, 30, 3600e3);
    const b = await readJson(ctx.req);
    const body = str(b.body, 5000);
    if (!body) throw new HttpError(400, "Leeg bericht.");
    const prefix = b.topic === "wijziging" ? "[Wijzigingsverzoek] " : b.quoteNumber ? `[Vraag over offerte ${str(b.quoteNumber, 30)}${b.part ? `, ${str(b.part, 120)}` : ""}] ` : "";
    ctx.db.run("INSERT INTO messages (id, project_id, author_type, author_id, body, created_at) VALUES (?,?,?,?,?,?)", newId("msg"), p.id, "customer", guards.customer(ctx), prefix + body, now());
    notifyStaff(ctx, `Nieuw bericht van klant (${p.ref})`, `Er is een nieuw bericht over project ${p.ref}.`);
    ctx.json(201, { ok: true });
  });

  /* J08: voorkeursmoment voorstellen — nooit automatisch bevestigd. */
  r.post("/api/portal/projects/:id/appointments", async (ctx) => {
    const p = ownProject(ctx, ctx.params.id);
    rateLimit(`apt:${ctx.ipHash}`, 10, 3600e3);
    const b = await readJson(ctx.req);
    const t = Date.parse(b.startsAt);
    if (!Number.isFinite(t) || t < Date.now()) throw new HttpError(400, "Kies een moment in de toekomst.");
    const starts = new Date(t).toISOString(), ends = new Date(t + 2 * 3600e3).toISOString();
    ctx.db.run("INSERT INTO appointments (id, project_id, kind, starts_at, ends_at, status, note, proposed_by, created_at, updated_at) VALUES (?,?,?,?,?,'voorstel',?,'klant',?,?)",
      newId("apt"), p.id, b.kind === "uitvoering" ? "uitvoering" : "opname", starts, ends, str(b.note, 500) || null, now(), now());
    notifyStaff(ctx, `Voorkeursmoment voorgesteld (${p.ref})`, `De klant stelt ${new Date(starts).toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" })} voor.`);
    ctx.json(201, { ok: true, status: "voorstel" });
  });

  r.post("/api/portal/projects/:id/files", async (ctx) => {
    const p = ownProject(ctx, ctx.params.id);
    rateLimit(`upload:${ctx.ipHash}`, 10, 3600e3);
    const { files } = await readMultipart(ctx.req, { maxFiles: 5 });
    for (const f of files) saveAttachment(ctx.db, ctx.cfg, { ownerType: "project", ownerId: p.id, file: f, customerVisible: true });
    audit(ctx.db, "klant", "foto's/bestanden geüpload", p.ref, ctx.ipHash);
    ctx.json(201, { count: files.length });
  });

  r.get("/api/portal/files/:id", (ctx) => {
    const cid = guards.customer(ctx);
    const a = ctx.db.get("SELECT a.* FROM attachments a JOIN projects p ON p.id = a.owner_id WHERE a.id = ? AND a.owner_type = 'project' AND a.customer_visible = 1 AND p.customer_id = ?", ctx.params.id, cid);
    sendFile(ctx, a);
  });

  r.post("/api/portal/invoices/:id/pay", async (ctx) => {
    const i = ownInvoice(ctx, ctx.params.id);
    rateLimit(`pay:${ctx.ipHash}`, 10, 3600e3);
    const url = await createMolliePayment(ctx.db, ctx.cfg, i.id);
    ctx.json(200, { checkoutUrl: url });
  });

  r.get("/api/portal/calendar.ics", (ctx) => {
    const cid = guards.customer(ctx);
    const rows = ctx.db.all("SELECT a.*, p.title, p.ref FROM appointments a JOIN projects p ON p.id = a.project_id WHERE p.customer_id = ? AND a.status = 'bevestigd'", cid);
    ctx.res.writeHead(200, { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": 'attachment; filename="sealcleaning-afspraken.ics"', "Cache-Control": "no-store" });
    ctx.res.end(buildIcsFor(rows, "Afspraken Sealcleaning", false));
  });

  /* N06: afzonderlijke, intrekbare toestemmingen. */
  r.post("/api/portal/consents", async (ctx) => {
    const cid = guards.customer(ctx);
    const b = await readJson(ctx.req);
    if (!["projectfoto-publicatie", "nieuwsbrief", "onderhoudsherinnering"].includes(b.kind)) throw new HttpError(400, "Onbekende toestemming.");
    ctx.db.run("INSERT INTO consents (id, customer_id, kind, granted, at, source, text_version) VALUES (?,?,?,?,?,'portaal','privacy-concept-2026-10-10')", newId("cns"), cid, b.kind, b.granted ? 1 : 0, now());
    audit(ctx.db, "klant", `toestemming ${b.kind}: ${b.granted ? "gegeven" : "ingetrokken"}`, cid, ctx.ipHash);
    ctx.json(200, { ok: true });
  });

  /* AVG-inzage: eigen gegevens als JSON-download. */
  r.get("/api/portal/export", (ctx) => {
    const cid = guards.customer(ctx);
    const d = ctx.db;
    const projects = d.all("SELECT id, ref, title, status, created_at FROM projects WHERE customer_id = ?", cid);
    const data = {
      exportedAt: now(), customer: d.get("SELECT name, email, phone, address, type, created_at FROM customers WHERE id = ?", cid),
      projects: projects.map((p) => ({ ...p,
        quotes: d.all("SELECT number, status, snapshot_json, accepted_at FROM quotes WHERE project_id = ? AND status != 'concept'", p.id).map((q) => ({ number: q.number, status: q.status, acceptedAt: q.accepted_at, document: JSON.parse(q.snapshot_json) })),
        messages: d.all("SELECT author_type, body, created_at FROM messages WHERE project_id = ?", p.id),
        appointments: d.all("SELECT kind, starts_at, status FROM appointments WHERE project_id = ?", p.id) })),
      invoices: d.all("SELECT number, kind, issue_date, total_incl, status FROM invoices WHERE customer_id = ? AND number IS NOT NULL", cid),
      acceptances: d.all("SELECT a.accepted_at, a.name, a.terms_version, a.consents_json FROM acceptances a WHERE a.customer_id = ?", cid),
      consents: d.all("SELECT kind, granted, at, source FROM consents WHERE customer_id = ?", cid)
    };
    audit(d, "klant", "gegevensexport (inzage)", cid, ctx.ipHash);
    ctx.res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": 'attachment; filename="mijn-gegevens-sealcleaning.json"', "Cache-Control": "no-store" });
    ctx.res.end(JSON.stringify(data, null, 2));
  });
}
