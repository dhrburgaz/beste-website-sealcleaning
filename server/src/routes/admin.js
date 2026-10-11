/** Beheer-API (alleen medewerkers met geldige sessie + 2FA). */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HttpError, readJson, readMultipart, rateLimit } from "../http.js";
import { now, newId, newRef, audit, getSetting, setSetting } from "../db.js";
import { guards } from "../app.js";
import { createPortalToken, createUser, token, sha256 } from "../auth.js";
import { queueMail, processOutbox } from "../mail.js";
import { integrationStatus } from "../config.js";
import { DEFAULT_SETTINGS, DEFAULT_NORMS, MATERIAL_LINKS } from "../../../data/calc-defaults.js";
import { decodeShare, sanitizeDesign } from "../../../js/configurator/design-io.js";
import {
  PROJECT_STATUSES, PRICE_TYPES, DEFAULT_COMPANY, runCalculation, createQuote, updateQuote, sendQuote, setProjectStatus,
  createInvoiceFromQuote, createCredit, issueInvoice, registerPayment, invoicePaid, saveAttachment, deleteAttachmentsOf,
  createBackup, runRetention, readCompanyPublic
} from "../services.js";

const str = (v, max = 200) => (v == null ? null : String(v).trim().slice(0, max) || null);
const cents = (v) => { const n = Number(v); if (!Number.isInteger(n) || Math.abs(n) > 1e10) throw new HttpError(400, "Ongeldig bedrag."); return n; };
const pctOrNull = (v) => (v === null || v === "" || v === undefined ? null : (Number.isFinite(Number(v)) && Number(v) >= 0 && Number(v) < 1000 ? Number(v) : (() => { throw new HttpError(400, "Ongeldig percentage."); })()));
const isoDate = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(String(v || "")) ? v : null);
const isoDateTime = (v) => { const t = Date.parse(v); if (!Number.isFinite(t)) throw new HttpError(400, "Ongeldige datum/tijd."); return new Date(t).toISOString(); };

function designFrom(input) {
  if (!input) return null;
  try {
    if (typeof input === "string") {
      const m = /#ontwerp=([A-Za-z0-9_-]+)/.exec(input);
      if (!m) throw new Error();
      return JSON.stringify(decodeShare(m[1]));
    }
    return JSON.stringify(sanitizeDesign(input.format ? input : { format: "sealcleaning-ontwerp", schemaVersion: 1, design: input }));
  } catch { throw new HttpError(400, "Ongeldig ontwerp of ongeldige deellink."); }
}

function projectFull(db, id) {
  const p = db.get("SELECT * FROM projects WHERE id = ?", id);
  if (!p) throw new HttpError(404, "Project niet gevonden.");
  const invoices = db.all("SELECT * FROM invoices WHERE project_id = ? ORDER BY created_at DESC", id).map((i) => ({ ...i, lines: JSON.parse(i.lines_json), paid: invoicePaid(db, i.id), payments: db.all("SELECT id, amount, method, status, received_at FROM payments WHERE invoice_id = ? ORDER BY created_at", i.id) }));
  return {
    ...p, design: p.design_json ? JSON.parse(p.design_json) : null,
    customer: p.customer_id ? db.get("SELECT * FROM customers WHERE id = ?", p.customer_id) : null,
    events: db.all("SELECT * FROM project_events WHERE project_id = ? ORDER BY id DESC LIMIT 200", id),
    quotes: db.all("SELECT * FROM quotes WHERE project_id = ? ORDER BY created_at DESC", id).map((q) => ({
      ...q, snapshot: JSON.parse(q.snapshot_json), internal: JSON.parse(q.internal_json), manualLines: JSON.parse(q.manual_lines_json),
      acceptance: db.get("SELECT accepted_at, name, terms_version, consents_json FROM acceptances WHERE quote_id = ?", q.id) || null
    })),
    invoices,
    appointments: db.all("SELECT * FROM appointments WHERE project_id = ? ORDER BY starts_at", id),
    messages: db.all("SELECT * FROM messages WHERE project_id = ? ORDER BY created_at", id),
    hours: db.all("SELECT * FROM hours WHERE project_id = ? ORDER BY date, created_at", id),
    files: db.all("SELECT id, filename, mime, size, customer_visible, created_at FROM attachments WHERE owner_type = 'project' AND owner_id = ? ORDER BY created_at", id)
  };
}

function csv(rows) {
  const cell = (v) => {
    const s = String(v ?? "");
    const safe = !/^-?\d+(,\d+)?$/.test(s) && /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
    return /[";\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
  };
  return "﻿" + rows.map((r) => r.map(cell).join(";")).join("\r\n");
}
const money = (c) => (c / 100).toFixed(2).replace(".", ",");

export function registerAdmin(r) {
  const S = (fn, opts) => async (ctx) => { const user = guards.staff(ctx, opts); ctx.actor = user.email; ctx.user = user; await fn(ctx); };

  r.get("/api/admin/dashboard", S((ctx) => {
    const d = ctx.db;
    ctx.json(200, {
      leadsNew: d.get("SELECT COUNT(*) n FROM leads WHERE status = 'nieuw'").n,
      projectsByStatus: d.all("SELECT status, COUNT(*) n FROM projects GROUP BY status"),
      quotesOpen: d.get("SELECT COUNT(*) n FROM quotes WHERE status = 'verstuurd'").n,
      invoicesOpen: d.all("SELECT id, number, total_incl, due_date FROM invoices WHERE kind = 'invoice' AND status = 'verstuurd'").map((i) => ({ ...i, open: i.total_incl - invoicePaid(d, i.id), overdue: i.due_date < now().slice(0, 10) })),
      outboxPending: d.get("SELECT COUNT(*) n FROM outbox WHERE status IN ('queued','failed')").n,
      upcoming: d.all("SELECT a.*, p.title FROM appointments a JOIN projects p ON p.id = a.project_id WHERE a.starts_at >= ? AND a.status != 'geannuleerd' ORDER BY a.starts_at LIMIT 10", now()),
      unreadMessages: d.get("SELECT COUNT(*) n FROM messages WHERE author_type = 'customer' AND read_at IS NULL").n,
      integrations: integrationStatus(ctx.cfg),
      statuses: PROJECT_STATUSES, priceTypes: PRICE_TYPES,
      company: readCompanyPublic(ctx.cfg.siteRoot), iban: getSetting(d, "company", DEFAULT_COMPANY).iban || null
    });
  }));

  /* ---------- aanvragen ---------- */
  r.get("/api/admin/leads", S((ctx) => {
    const st = ctx.url.searchParams.get("status");
    ctx.json(200, ctx.db.all(`SELECT id, ref, kind, status, name, email, phone, city, service, created_at, project_id, design_json IS NOT NULL AS has_design FROM leads ${st ? "WHERE status = ?" : ""} ORDER BY created_at DESC LIMIT 500`, ...(st ? [st] : [])));
  }));
  r.get("/api/admin/leads/:id", S((ctx) => {
    const l = ctx.db.get("SELECT * FROM leads WHERE id = ?", ctx.params.id);
    if (!l) throw new HttpError(404, "Aanvraag niet gevonden.");
    ctx.json(200, { ...l, design: l.design_json ? JSON.parse(l.design_json) : null, payload: JSON.parse(l.payload_json || "{}"), files: ctx.db.all("SELECT id, filename, mime, size FROM attachments WHERE owner_type = 'lead' AND owner_id = ?", l.id) });
  }));
  r.put("/api/admin/leads/:id", S(async (ctx) => {
    const { status } = await readJson(ctx.req);
    if (!["nieuw", "in behandeling", "omgezet", "gesloten"].includes(status)) throw new HttpError(400, "Onbekende status.");
    ctx.db.run("UPDATE leads SET status = ?, updated_at = ? WHERE id = ?", status, now(), ctx.params.id);
    audit(ctx.db, ctx.actor, `aanvraag ${status}`, ctx.params.id);
    ctx.json(200, { ok: true });
  }));
  r.post("/api/admin/leads/:id/convert", S(async (ctx) => {
    const b = await readJson(ctx.req);
    const l = ctx.db.get("SELECT * FROM leads WHERE id = ?", ctx.params.id);
    if (!l) throw new HttpError(404, "Aanvraag niet gevonden.");
    if (l.project_id) throw new HttpError(409, "Deze aanvraag is al omgezet.");
    const result = ctx.db.tx(() => {
      let customerId = b.customerId || null;
      if (customerId && !ctx.db.get("SELECT 1 FROM customers WHERE id = ?", customerId)) throw new HttpError(404, "Klant niet gevonden.");
      if (!customerId) {
        customerId = newId("cus");
        ctx.db.run("INSERT INTO customers (id, name, email, phone, address, type, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)",
          customerId, l.name, l.email, l.phone, [l.postal, l.city].filter(Boolean).join(" ") || null, l.kind === "b2b" ? "zakelijk" : "particulier", now(), now());
      }
      const pid = newId("prj");
      ctx.db.run("INSERT INTO projects (id, ref, customer_id, title, status, design_json, notes, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
        pid, newRef("P"), customerId, str(b.title, 120) || `${l.service || "Project"} ${l.name}`, "Aanvraag", l.design_json, l.message, now(), now());
      ctx.db.run("INSERT INTO project_events (project_id, at, kind, data_json, actor, customer_visible) VALUES (?,?,?,?,?,1)", pid, now(), "status", JSON.stringify({ status: "Aanvraag", from: l.ref }), ctx.actor);
      ctx.db.run("UPDATE attachments SET owner_type = 'project', owner_id = ? WHERE owner_type = 'lead' AND owner_id = ?", pid, l.id);
      ctx.db.run("UPDATE leads SET status = 'omgezet', customer_id = ?, project_id = ?, updated_at = ? WHERE id = ?", customerId, pid, now(), l.id);
      audit(ctx.db, ctx.actor, "aanvraag omgezet naar project", l.ref);
      return { customerId, projectId: pid };
    });
    ctx.json(201, result);
  }));
  r.del("/api/admin/leads/:id", S((ctx) => {
    const l = ctx.db.get("SELECT * FROM leads WHERE id = ?", ctx.params.id);
    if (!l) throw new HttpError(404, "Aanvraag niet gevonden.");
    deleteAttachmentsOf(ctx.db, ctx.cfg, "lead", l.id);
    ctx.db.run("DELETE FROM leads WHERE id = ?", l.id);
    audit(ctx.db, ctx.actor, "aanvraag verwijderd", l.ref);
    ctx.json(200, { ok: true });
  }));

  /* ---------- klanten ---------- */
  r.get("/api/admin/customers", S((ctx) => ctx.json(200, ctx.db.all("SELECT c.*, (SELECT COUNT(*) FROM projects p WHERE p.customer_id = c.id) AS projects FROM customers c ORDER BY c.name LIMIT 2000"))));
  r.post("/api/admin/customers", S(async (ctx) => {
    const b = await readJson(ctx.req);
    if (!str(b.name)) throw new HttpError(400, "Naam is verplicht.");
    const id = newId("cus");
    ctx.db.run("INSERT INTO customers (id, name, email, phone, address, type, notes, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
      id, str(b.name, 120), str(b.email, 160), str(b.phone, 40), str(b.address, 200), b.type === "zakelijk" ? "zakelijk" : "particulier", str(b.notes, 2000), now(), now());
    audit(ctx.db, ctx.actor, "klant aangemaakt", id);
    ctx.json(201, { id });
  }));
  r.get("/api/admin/customers/:id", S((ctx) => {
    const c = ctx.db.get("SELECT * FROM customers WHERE id = ?", ctx.params.id);
    if (!c) throw new HttpError(404, "Klant niet gevonden.");
    ctx.json(200, { ...c, projects: ctx.db.all("SELECT id, ref, title, status FROM projects WHERE customer_id = ?", c.id), consents: ctx.db.all("SELECT * FROM consents WHERE customer_id = ? ORDER BY at DESC", c.id) });
  }));
  r.put("/api/admin/customers/:id", S(async (ctx) => {
    const b = await readJson(ctx.req);
    const c = ctx.db.get("SELECT * FROM customers WHERE id = ?", ctx.params.id);
    if (!c) throw new HttpError(404, "Klant niet gevonden.");
    ctx.db.run("UPDATE customers SET name=?, email=?, phone=?, address=?, type=?, notes=?, updated_at=? WHERE id=?",
      str(b.name, 120) || c.name, str(b.email, 160), str(b.phone, 40), str(b.address, 200), b.type === "zakelijk" ? "zakelijk" : "particulier", str(b.notes, 2000), now(), c.id);
    audit(ctx.db, ctx.actor, "klant gewijzigd", c.id);
    ctx.json(200, { ok: true });
  }));
  r.del("/api/admin/customers/:id", S((ctx) => {
    const c = ctx.db.get("SELECT * FROM customers WHERE id = ?", ctx.params.id);
    if (!c) throw new HttpError(404, "Klant niet gevonden.");
    if (ctx.db.get("SELECT 1 FROM invoices WHERE customer_id = ? AND number IS NOT NULL", c.id)) {
      throw new HttpError(409, "Deze klant heeft uitgegeven facturen; die vallen onder de fiscale bewaarplicht (7 jaar). Verwijder of anonimiseer na afloop van de bewaartermijn.");
    }
    ctx.db.tx(() => {
      for (const p of ctx.db.all("SELECT id FROM projects WHERE customer_id = ?", c.id)) deleteAttachmentsOf(ctx.db, ctx.cfg, "project", p.id);
      ctx.db.run("DELETE FROM projects WHERE customer_id = ?", c.id);
      ctx.db.run("DELETE FROM consents WHERE customer_id = ?", c.id);
      ctx.db.run("DELETE FROM sessions WHERE customer_id = ?", c.id);
      ctx.db.run("UPDATE leads SET customer_id = NULL, name = '[verwijderd]', email = NULL, phone = NULL, message = NULL WHERE customer_id = ?", c.id);
      ctx.db.run("DELETE FROM customers WHERE id = ?", c.id);
    });
    audit(ctx.db, ctx.actor, "klant verwijderd (AVG)", c.id);
    ctx.json(200, { ok: true });
  }));
  r.post("/api/admin/customers/:id/portal-link", S(async (ctx) => {
    const b = await readJson(ctx.req);
    const c = ctx.db.get("SELECT * FROM customers WHERE id = ?", ctx.params.id);
    if (!c) throw new HttpError(404, "Klant niet gevonden.");
    const t = createPortalToken(ctx.db, c.id, 7 * 86400e3);
    const link = `${ctx.cfg.publicBaseUrl}/portaal/#token=${t}`;
    let queued = false;
    if (b.email && c.email) queued = !!queueMail(ctx.db, { kind: "portaal-uitnodiging", to: c.email, subject: "Uw klantportaal bij Sealcleaning", text: `Beste ${c.name},\n\nVia deze persoonlijke link bekijkt u uw project, offerte en planning (7 dagen geldig, één keer te gebruiken; daarna kunt u op het portaal een nieuwe link aanvragen):\n${link}\n\nSealcleaning Groenonderhoud en Aanleg` });
    audit(ctx.db, ctx.actor, "portaallink gemaakt", c.id);
    ctx.json(200, { link, queued, expiresInDays: 7 });
  }));

  /* ---------- projecten ---------- */
  r.get("/api/admin/projects", S((ctx) => ctx.json(200, ctx.db.all("SELECT p.id, p.ref, p.title, p.status, p.updated_at, c.name AS customer FROM projects p LEFT JOIN customers c ON c.id = p.customer_id ORDER BY p.updated_at DESC LIMIT 1000"))));
  r.post("/api/admin/projects", S(async (ctx) => {
    const b = await readJson(ctx.req);
    if (!str(b.title)) throw new HttpError(400, "Titel is verplicht.");
    const id = newId("prj");
    ctx.db.run("INSERT INTO projects (id, ref, customer_id, title, status, design_json, notes, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)",
      id, newRef("P"), b.customerId || null, str(b.title, 120), "Aanvraag", designFrom(b.design), str(b.notes, 4000), now(), now());
    audit(ctx.db, ctx.actor, "project aangemaakt", id);
    ctx.json(201, { id });
  }));
  r.get("/api/admin/projects/:id", S((ctx) => {
    const p = projectFull(ctx.db, ctx.params.id);
    ctx.db.run("UPDATE messages SET read_at = ? WHERE project_id = ? AND author_type = 'customer' AND read_at IS NULL", now(), p.id);
    ctx.json(200, p);
  }));
  r.put("/api/admin/projects/:id", S(async (ctx) => {
    const b = await readJson(ctx.req, 512 * 1024);
    const p = ctx.db.get("SELECT * FROM projects WHERE id = ?", ctx.params.id);
    if (!p) throw new HttpError(404, "Project niet gevonden.");
    if (b.status && b.status !== p.status) setProjectStatus(ctx.db, p.id, b.status, ctx.actor);
    ctx.db.run("UPDATE projects SET title = ?, notes = ?, customer_id = ?, design_json = ?, updated_at = ? WHERE id = ?",
      str(b.title, 120) || p.title, b.notes !== undefined ? str(b.notes, 4000) : p.notes, b.customerId !== undefined ? (b.customerId || null) : p.customer_id,
      b.design !== undefined ? designFrom(b.design) : p.design_json, now(), p.id);
    audit(ctx.db, ctx.actor, "project gewijzigd", p.ref);
    ctx.json(200, { ok: true });
  }));
  r.post("/api/admin/projects/:id/hours", S(async (ctx) => {
    const b = await readJson(ctx.req);
    const h = Number(b.hours);
    if (!(h > 0 && h <= 24) || !isoDate(b.date) || !str(b.worker)) throw new HttpError(400, "Vul datum, medewerker en uren (0–24) in.");
    ctx.db.run("INSERT INTO hours (id, project_id, worker, date, hours, note, created_at, created_by) VALUES (?,?,?,?,?,?,?,?)", newId("hr"), ctx.params.id, str(b.worker, 60), b.date, h, str(b.note, 300), now(), ctx.actor);
    audit(ctx.db, ctx.actor, "uren geboekt", ctx.params.id);
    ctx.json(201, { ok: true });
  }));
  r.del("/api/admin/hours/:id", S((ctx) => { ctx.db.run("DELETE FROM hours WHERE id = ?", ctx.params.id); audit(ctx.db, ctx.actor, "uren verwijderd", ctx.params.id); ctx.json(200, { ok: true }); }));
  r.post("/api/admin/projects/:id/messages", S(async (ctx) => {
    const { body } = await readJson(ctx.req);
    if (!str(body)) throw new HttpError(400, "Leeg bericht.");
    const p = ctx.db.get("SELECT p.*, c.email, c.name FROM projects p LEFT JOIN customers c ON c.id = p.customer_id WHERE p.id = ?", ctx.params.id);
    if (!p) throw new HttpError(404, "Project niet gevonden.");
    ctx.db.run("INSERT INTO messages (id, project_id, author_type, author_id, body, created_at) VALUES (?,?,?,?,?,?)", newId("msg"), p.id, "staff", ctx.user.id, str(body, 5000), now());
    if (p.email) queueMail(ctx.db, { kind: "bericht", to: p.email, subject: `Nieuw bericht over uw project ${p.ref}`, text: `Beste ${p.name},\n\nEr staat een nieuw bericht voor u klaar in uw klantportaal: ${ctx.cfg.publicBaseUrl}/portaal/\n\nSealcleaning` });
    ctx.json(201, { ok: true });
  }));
  r.post("/api/admin/projects/:id/appointments", S(async (ctx) => {
    const b = await readJson(ctx.req);
    const starts = isoDateTime(b.startsAt), ends = b.endsAt ? isoDateTime(b.endsAt) : new Date(Date.parse(starts) + 3600e3).toISOString();
    if (ends <= starts) throw new HttpError(400, "Eindtijd moet na begintijd liggen.");
    const kind = ["opname", "uitvoering", "oplevering", "overig"].includes(b.kind) ? b.kind : "overig";
    const st = b.status === "voorstel" ? "voorstel" : "bevestigd";
    ctx.db.run("INSERT INTO appointments (id, project_id, kind, starts_at, ends_at, status, location, note, proposed_by, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      newId("apt"), ctx.params.id, kind, starts, ends, st, str(b.location, 200), str(b.note, 1000), "staff", now(), now());
    if (kind === "opname" && st === "bevestigd") setProjectStatus(ctx.db, ctx.params.id, "Opname gepland", ctx.actor);
    if (kind === "uitvoering" && st === "bevestigd") setProjectStatus(ctx.db, ctx.params.id, "Ingepland", ctx.actor);
    const p = ctx.db.get("SELECT p.ref, c.email, c.name FROM projects p LEFT JOIN customers c ON c.id = p.customer_id WHERE p.id = ?", ctx.params.id);
    if (p?.email && st === "bevestigd") queueMail(ctx.db, { kind: "afspraak", to: p.email, subject: `Afspraak bevestigd: ${kind} (${p.ref})`, text: `Beste ${p.name},\n\nWe hebben een afspraak bevestigd: ${kind} op ${new Date(starts).toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" })}.\nU ziet de planning in uw klantportaal: ${ctx.cfg.publicBaseUrl}/portaal/\n\nSealcleaning` });
    audit(ctx.db, ctx.actor, "afspraak aangemaakt", ctx.params.id);
    ctx.json(201, { ok: true });
  }));
  r.put("/api/admin/appointments/:id", S(async (ctx) => {
    const b = await readJson(ctx.req);
    const a = ctx.db.get("SELECT * FROM appointments WHERE id = ?", ctx.params.id);
    if (!a) throw new HttpError(404, "Afspraak niet gevonden.");
    const st = ["voorstel", "bevestigd", "geannuleerd"].includes(b.status) ? b.status : a.status;
    ctx.db.run("UPDATE appointments SET status = ?, starts_at = ?, ends_at = ?, note = ?, updated_at = ? WHERE id = ?", st, b.startsAt ? isoDateTime(b.startsAt) : a.starts_at, b.endsAt ? isoDateTime(b.endsAt) : a.ends_at, b.note !== undefined ? str(b.note, 1000) : a.note, now(), a.id);
    audit(ctx.db, ctx.actor, `afspraak ${st}`, a.id);
    ctx.json(200, { ok: true });
  }));
  r.post("/api/admin/projects/:id/files", S(async (ctx) => {
    if (!ctx.db.get("SELECT 1 FROM projects WHERE id = ?", ctx.params.id)) throw new HttpError(404, "Project niet gevonden.");
    const { fields, files } = await readMultipart(ctx.req, { maxFiles: 10 });
    for (const f of files) saveAttachment(ctx.db, ctx.cfg, { ownerType: "project", ownerId: ctx.params.id, file: f, customerVisible: fields.customerVisible === "1" });
    audit(ctx.db, ctx.actor, "bestanden toegevoegd", ctx.params.id);
    ctx.json(201, { count: files.length });
  }));
  r.put("/api/admin/files/:id", S(async (ctx) => {
    const { customerVisible } = await readJson(ctx.req);
    ctx.db.run("UPDATE attachments SET customer_visible = ? WHERE id = ?", customerVisible ? 1 : 0, ctx.params.id);
    ctx.json(200, { ok: true });
  }));

  /* ---------- calculatie en offertes ---------- */
  r.post("/api/admin/projects/:id/calc", S((ctx) => {
    const p = ctx.db.get("SELECT * FROM projects WHERE id = ?", ctx.params.id);
    if (!p?.design_json) throw new HttpError(400, "Dit project heeft nog geen ontwerp.");
    ctx.json(200, runCalculation(ctx.db, ctx.cfg, JSON.parse(p.design_json)));
  }));
  r.post("/api/admin/projects/:id/quotes", S(async (ctx) => {
    const b = await readJson(ctx.req);
    const id = createQuote(ctx.db, ctx.cfg, ctx.params.id, { manualLines: b.manualLines, priceType: b.priceType, excluded: b.excluded, customerWork: b.customerWork, poRef: b.poRef, parentId: b.parentId }, ctx.actor);
    ctx.json(201, { id });
  }));
  r.put("/api/admin/quotes/:id", S(async (ctx) => { updateQuote(ctx.db, ctx.cfg, ctx.params.id, await readJson(ctx.req), ctx.actor); ctx.json(200, { ok: true }); }));
  r.post("/api/admin/quotes/:id/send", S(async (ctx) => {
    const q = sendQuote(ctx.db, ctx.params.id, ctx.actor);
    const c = ctx.db.get("SELECT c.* FROM projects p JOIN customers c ON c.id = p.customer_id WHERE p.id = ?", q.project_id);
    let link = null;
    if (c) {
      const t = createPortalToken(ctx.db, c.id, 7 * 86400e3);
      link = `${ctx.cfg.publicBaseUrl}/portaal/#token=${t}`;
      if (c.email) queueMail(ctx.db, { kind: "offerte", to: c.email, subject: `Uw offerte ${q.number} van Sealcleaning`, text: `Beste ${c.name},\n\nUw offerte ${q.number} staat klaar. U kunt deze bekijken, vragen stellen en digitaal akkoord geven in uw klantportaal:\n${link}\n(De link is 7 dagen geldig en één keer te gebruiken; daarna kunt u op het portaal een nieuwe inloglink aanvragen.)\n\nMet vriendelijke groet,\nSealcleaning Groenonderhoud en Aanleg` });
    }
    ctx.json(200, { ok: true, portalLink: link });
  }));
  r.post("/api/admin/quotes/:id/status", S(async (ctx) => {
    const { status } = await readJson(ctx.req);
    if (!["afgewezen", "vervallen"].includes(status)) throw new HttpError(400, "Alleen afwijzen of laten vervallen; akkoord geeft de klant zelf of registreert u via het portaalproces.");
    const q = ctx.db.get("SELECT * FROM quotes WHERE id = ?", ctx.params.id);
    if (!q || q.status === "akkoord") throw new HttpError(409, "Een geaccepteerde offerte blijft vastgelegd.");
    ctx.db.run("UPDATE quotes SET status = ? WHERE id = ?", status, q.id);
    audit(ctx.db, ctx.actor, `offerte ${status}`, q.number);
    ctx.json(200, { ok: true });
  }));
  r.post("/api/admin/quotes/:id/accept-offline", S(async (ctx) => {
    // Akkoord buiten het portaal (bijv. getekende PDF): vastleggen met verklaring van de medewerker.
    const { name, note } = await readJson(ctx.req);
    const q = ctx.db.get("SELECT * FROM quotes WHERE id = ?", ctx.params.id);
    if (!q || q.status !== "verstuurd") throw new HttpError(409, "Alleen een verstuurde offerte kan akkoord krijgen.");
    if (!str(name) || !str(note)) throw new HttpError(400, "Vul de naam van de ondertekenaar en de vorm van het akkoord in (bijv. 'getekende PDF per e-mail op …').");
    ctx.db.tx(() => {
      ctx.db.run("INSERT INTO acceptances (id, quote_id, accepted_at, name, snapshot_hash, terms_version, consents_json) VALUES (?,?,?,?,?,?,?)", newId("acc"), q.id, now(), str(name, 120), q.snapshot_hash, ctx.cfg.termsVersion, JSON.stringify({ offline: str(note, 500), registeredBy: ctx.actor }));
      ctx.db.run("UPDATE quotes SET status = 'akkoord', accepted_at = ? WHERE id = ?", now(), q.id);
      setProjectStatus(ctx.db, q.project_id, "Akkoord", ctx.actor);
    });
    audit(ctx.db, ctx.actor, "offerte-akkoord (offline) vastgelegd", q.number);
    ctx.json(200, { ok: true });
  }));

  /* ---------- facturen en betalingen ---------- */
  r.get("/api/admin/invoices", S((ctx) => ctx.json(200, ctx.db.all("SELECT i.*, c.name AS customer, p.title AS project FROM invoices i LEFT JOIN customers c ON c.id = i.customer_id LEFT JOIN projects p ON p.id = i.project_id ORDER BY i.created_at DESC LIMIT 2000").map((i) => ({ ...i, paid: invoicePaid(ctx.db, i.id) })))));
  r.post("/api/admin/quotes/:id/invoices", S(async (ctx) => { const b = await readJson(ctx.req); ctx.json(201, { id: createInvoiceFromQuote(ctx.db, ctx.params.id, ctx.actor, { part: b.part }) }); }));
  r.post("/api/admin/invoices/:id/issue", S(async (ctx) => {
    const b = await readJson(ctx.req);
    const number = issueInvoice(ctx.db, ctx.params.id, { deliveryDate: b.deliveryDate }, ctx.actor);
    const inv = ctx.db.get("SELECT i.*, c.email, c.name FROM invoices i LEFT JOIN customers c ON c.id = i.customer_id WHERE i.id = ?", ctx.params.id);
    if (inv.email) queueMail(ctx.db, { kind: "factuur", to: inv.email, subject: `${inv.kind === "credit" ? "Creditnota" : "Factuur"} ${number} van Sealcleaning`, text: `Beste ${inv.name},\n\nUw ${inv.kind === "credit" ? "creditnota" : "factuur"} ${number} staat klaar in uw klantportaal: ${ctx.cfg.publicBaseUrl}/portaal/\nTotaal: € ${money(inv.total_incl)} incl. btw.${inv.kind === "credit" ? "" : `\nBetaaltermijn: tot ${inv.due_date}.`}\n\nSealcleaning Groenonderhoud en Aanleg` });
    ctx.json(200, { number });
  }));
  r.post("/api/admin/invoices/:id/credit", S(async (ctx) => { const b = await readJson(ctx.req); ctx.json(201, { id: createCredit(ctx.db, ctx.params.id, { amountExclCents: b.amountExclCents, reason: b.reason }, ctx.actor) }); }));
  r.post("/api/admin/invoices/:id/payments", S(async (ctx) => {
    const b = await readJson(ctx.req);
    registerPayment(ctx.db, ctx.params.id, { amount: cents(b.amount), method: ["bank", "contant", "pin"].includes(b.method) ? b.method : "bank", receivedAt: isoDate(b.receivedAt) || now().slice(0, 10) }, ctx.actor);
    ctx.json(201, { ok: true });
  }));
  r.del("/api/admin/invoices/:id", S((ctx) => {
    const inv = ctx.db.get("SELECT * FROM invoices WHERE id = ?", ctx.params.id);
    if (!inv || inv.status !== "concept") throw new HttpError(409, "Alleen concepten (zonder nummer) kunnen worden verwijderd; gebruik anders een creditnota.");
    ctx.db.run("DELETE FROM invoices WHERE id = ?", inv.id);
    audit(ctx.db, ctx.actor, "factuurconcept verwijderd", inv.id);
    ctx.json(200, { ok: true });
  }));

  /* ---------- instellingen ---------- */
  r.get("/api/admin/settings", S((ctx) => ctx.json(200, {
    calc: { ...DEFAULT_SETTINGS, ...getSetting(ctx.db, "calc", {}) }, defaultNorms: DEFAULT_NORMS, materialKeys: Object.keys(MATERIAL_LINKS),
    company: { ...DEFAULT_COMPANY, ...getSetting(ctx.db, "company", {}) }, retention: getSetting(ctx.db, "retention", { leadDays: null, applicationDays: null }),
    purchasePrices: ctx.db.all("SELECT * FROM purchase_prices"), suppliers: ctx.db.all("SELECT * FROM suppliers ORDER BY name"),
    integrations: integrationStatus(ctx.cfg), termsVersion: ctx.cfg.termsVersion
  })));
  r.put("/api/admin/settings/calc", S(async (ctx) => {
    const b = await readJson(ctx.req);
    const cur = getSetting(ctx.db, "calc", {});
    const next = { ...cur };
    for (const k of ["materialMarkupPct", "machineMarkupPct", "wasteMarkupPct", "overheadPct", "riskPct"]) if (k in b) next[k] = pctOrNull(b[k]);
    for (const k of ["laborCostRateCents", "transportPerDayCents", "minimumOrderExclCents"]) if (k in b) next[k] = b[k] === null || b[k] === "" ? null : cents(b[k]);
    if ("crewSize" in b) { const n = Number(b.crewSize); if (!(Number.isInteger(n) && n >= 1 && n <= 10)) throw new HttpError(400, "Ploeggrootte 1–10."); next.crewSize = n; }
    if ("vatRate" in b) { if (![21, 9].includes(Number(b.vatRate))) throw new HttpError(400, "Btw 21 of 9."); next.vatRate = Number(b.vatRate); }
    if ("norms" in b) {
      const norms = {};
      for (const [k, v] of Object.entries(b.norms || {})) { if (!DEFAULT_NORMS[k]) continue; const h = Number(v?.hoursPerUnit); if (!(h >= 0 && h <= 100)) throw new HttpError(400, `Ongeldige norm ${k}.`); norms[k] = { hoursPerUnit: h }; }
      next.norms = norms;
    }
    setSetting(ctx.db, "calc", next);
    audit(ctx.db, ctx.actor, "calculatie-instellingen gewijzigd", Object.keys(b).join(", "));
    ctx.json(200, { ok: true });
  }, { owner: true }));
  r.put("/api/admin/settings/company", S(async (ctx) => {
    const b = await readJson(ctx.req);
    const days = (v) => (v === null || v === "" ? null : (Number.isInteger(Number(v)) && Number(v) > 0 && Number(v) < 366 ? Number(v) : (() => { throw new HttpError(400, "Ongeldig aantal dagen."); })()));
    const iban = String(b.iban || "").replace(/\s+/g, "").toUpperCase();
    if (iban && !/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(iban)) throw new HttpError(400, "Ongeldig IBAN.");
    setSetting(ctx.db, "company", { offerValidityDays: days(b.offerValidityDays), paymentTermDays: days(b.paymentTermDays), iban, quotePrefix: String(b.quotePrefix || "OFF").replace(/[^A-Z0-9]/gi, "").slice(0, 8) || "OFF", invoicePrefix: String(b.invoicePrefix || "F").replace(/[^A-Z0-9]/gi, "").slice(0, 8) || "F" });
    audit(ctx.db, ctx.actor, "documentgegevens gewijzigd");
    ctx.json(200, { ok: true });
  }, { owner: true }));
  r.put("/api/admin/settings/retention", S(async (ctx) => {
    const b = await readJson(ctx.req);
    const d = (v) => (v === null || v === "" ? null : (Number.isInteger(Number(v)) && Number(v) >= 7 && Number(v) <= 3650 ? Number(v) : (() => { throw new HttpError(400, "Bewaartermijn 7–3650 dagen."); })()));
    setSetting(ctx.db, "retention", { leadDays: d(b.leadDays), applicationDays: d(b.applicationDays) });
    audit(ctx.db, ctx.actor, "bewaartermijnen gewijzigd");
    ctx.json(200, { ok: true, removedNow: runRetention(ctx.db, ctx.cfg) });
  }, { owner: true }));
  r.put("/api/admin/purchase-prices/:key", S(async (ctx) => {
    if (!MATERIAL_LINKS[ctx.params.key]) throw new HttpError(404, "Onbekend artikel.");
    const b = await readJson(ctx.req);
    if (b.amountExcl === null) { ctx.db.run("DELETE FROM purchase_prices WHERE key = ?", ctx.params.key); }
    else ctx.db.run("INSERT INTO purchase_prices (key, amount_excl, supplier_id, sku, observed_at, updated_at, updated_by) VALUES (?,?,?,?,?,?,?) ON CONFLICT(key) DO UPDATE SET amount_excl=excluded.amount_excl, supplier_id=excluded.supplier_id, sku=excluded.sku, observed_at=excluded.observed_at, updated_at=excluded.updated_at, updated_by=excluded.updated_by",
      ctx.params.key, cents(b.amountExcl), b.supplierId || null, str(b.sku, 60), isoDate(b.observedAt) || now().slice(0, 10), now(), ctx.actor);
    audit(ctx.db, ctx.actor, "inkoopprijs gewijzigd", ctx.params.key);
    ctx.json(200, { ok: true });
  }, { owner: true }));
  r.post("/api/admin/suppliers", S(async (ctx) => {
    const b = await readJson(ctx.req);
    if (!str(b.name)) throw new HttpError(400, "Naam is verplicht.");
    ctx.db.run("INSERT INTO suppliers (id, name, contact, created_at) VALUES (?,?,?,?)", newId("sup"), str(b.name, 120), str(b.contact, 300), now());
    ctx.json(201, { ok: true });
  }, { owner: true }));
  r.del("/api/admin/suppliers/:id", S((ctx) => { ctx.db.run("UPDATE purchase_prices SET supplier_id = NULL WHERE supplier_id = ?", ctx.params.id); ctx.db.run("DELETE FROM suppliers WHERE id = ?", ctx.params.id); ctx.json(200, { ok: true }); }, { owner: true }));

  /* ---------- e-mail, audit, export, agenda, back-up, gebruikers ---------- */
  r.get("/api/admin/outbox", S((ctx) => ctx.json(200, ctx.db.all("SELECT * FROM outbox ORDER BY created_at DESC LIMIT 300"))));
  r.post("/api/admin/outbox/process", S(async (ctx) => ctx.json(200, { sent: await processOutbox(ctx.db, ctx.cfg) })));
  r.post("/api/admin/outbox/:id/manual", S((ctx) => { ctx.db.run("UPDATE outbox SET status = 'manual', sent_at = ? WHERE id = ?", now(), ctx.params.id); audit(ctx.db, ctx.actor, "e-mail handmatig verstuurd gemarkeerd", ctx.params.id); ctx.json(200, { ok: true }); }));
  r.get("/api/admin/audit", S((ctx) => ctx.json(200, ctx.db.all("SELECT id, at, actor, action, ref FROM audit ORDER BY id DESC LIMIT 500"))));
  r.get("/api/admin/export/invoices.csv", S((ctx) => {
    const rows = [["Nummer", "Soort", "Factuurdatum", "Prestatiedatum", "Vervaldatum", "Klant", "Project", "Excl. btw", "Btw %", "Btw", "Incl. btw", "Betaald", "Openstaand", "Status", "Referentie"]];
    for (const i of ctx.db.all("SELECT i.*, c.name cn, p.title pt, r.number rn FROM invoices i LEFT JOIN customers c ON c.id = i.customer_id LEFT JOIN projects p ON p.id = i.project_id LEFT JOIN invoices r ON r.id = i.ref_invoice_id WHERE i.number IS NOT NULL ORDER BY i.year, i.seq")) {
      const paid = invoicePaid(ctx.db, i.id);
      rows.push([i.number, i.kind === "credit" ? "creditnota" : "factuur", i.issue_date, i.delivery_date, i.due_date || "", i.cn || "", i.pt || "", money(i.total_excl), i.vat_rate, money(i.vat), money(i.total_incl), money(paid), money(i.total_incl - paid), i.status, i.rn || i.po_ref || ""]);
    }
    audit(ctx.db, ctx.actor, "export facturen");
    ctx.res.writeHead(200, { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="sealcleaning-facturen-${now().slice(0, 10)}.csv"`, "Cache-Control": "no-store" });
    ctx.res.end(csv(rows));
  }));
  r.get("/api/admin/export/hours.csv", S((ctx) => {
    const rows = [["Datum", "Project", "Medewerker", "Uren", "Werkzaamheden"]];
    for (const h of ctx.db.all("SELECT h.*, p.title FROM hours h JOIN projects p ON p.id = h.project_id ORDER BY h.date")) rows.push([h.date, h.title, h.worker, String(h.hours).replace(".", ","), h.note || ""]);
    ctx.res.writeHead(200, { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="sealcleaning-uren-${now().slice(0, 10)}.csv"`, "Cache-Control": "no-store" });
    ctx.res.end(csv(rows));
  }));
  r.post("/api/admin/calendar/feed", S((ctx) => {
    const t = token();
    setSetting(ctx.db, "icsFeedHash", sha256(t));
    audit(ctx.db, ctx.actor, "agendafeed vernieuwd");
    ctx.json(200, { url: `${ctx.cfg.publicBaseUrl}/api/calendar/${t}.ics`, note: "Abonneer u op deze URL in Google Agenda, Apple Agenda of Outlook. Houd hem geheim; vernieuwen maakt de oude ongeldig." });
  }, { owner: true }));
  r.post("/api/admin/backup", S((ctx) => {
    rateLimit(`backup:${ctx.user.id}`, 6, 3600e3);
    try { ctx.json(201, { path: createBackup(ctx.db, ctx.cfg) }); } catch (e) { throw new HttpError(503, e.message); }
  }, { owner: true }));
  r.get("/api/admin/users", S((ctx) => ctx.json(200, ctx.db.all("SELECT id, email, name, role, totp_enabled, disabled, created_at FROM users ORDER BY created_at")), { owner: true }));
  r.post("/api/admin/users", S(async (ctx) => {
    const b = await readJson(ctx.req);
    try { createUser(ctx.db, { email: String(b.email || ""), name: String(b.name || ""), password: b.password, role: b.role === "owner" ? "owner" : "staff" }); }
    catch (e) { throw new HttpError(400, /UNIQUE/.test(e.message) ? "Dit e-mailadres bestaat al." : e.message); }
    audit(ctx.db, ctx.actor, "gebruiker aangemaakt", b.email);
    ctx.json(201, { ok: true });
  }, { owner: true }));
  r.put("/api/admin/users/:id", S(async (ctx) => {
    const b = await readJson(ctx.req);
    if (ctx.params.id === ctx.user.id) throw new HttpError(400, "U kunt uzelf niet blokkeren.");
    ctx.db.run("UPDATE users SET disabled = ? WHERE id = ?", b.disabled ? 1 : 0, ctx.params.id);
    if (b.disabled) ctx.db.run("DELETE FROM sessions WHERE user_id = ?", ctx.params.id);
    audit(ctx.db, ctx.actor, b.disabled ? "gebruiker geblokkeerd" : "gebruiker gedeblokkeerd", ctx.params.id);
    ctx.json(200, { ok: true });
  }, { owner: true }));

  /* ---------- bestanden downloaden (medewerker) ---------- */
  r.get("/api/admin/files/:id", S((ctx) => sendFile(ctx, ctx.db.get("SELECT * FROM attachments WHERE id = ?", ctx.params.id))));

  /* ---------- publieke agendafeed (geheim token) ---------- */
  r.get("/api/calendar/:file", (ctx) => {
    const m = /^([A-Za-z0-9_-]{20,100})\.ics$/.exec(ctx.params.file);
    const stored = getSetting(ctx.db, "icsFeedHash", null);
    if (!m || !stored || sha256(m[1]) !== stored) throw new HttpError(404, "Niet gevonden.");
    const rows = ctx.db.all("SELECT a.*, p.title, p.ref, c.address FROM appointments a JOIN projects p ON p.id = a.project_id LEFT JOIN customers c ON c.id = p.customer_id WHERE a.status != 'voorstel' AND a.starts_at >= ?", new Date(Date.now() - 90 * 86400e3).toISOString());
    ctx.res.writeHead(200, { "Content-Type": "text/calendar; charset=utf-8", "Cache-Control": "no-store" });
    ctx.res.end(buildIcsFor(rows, "Sealcleaning planning", true));
  }, { webhook: true });
}

import { buildIcs } from "../services.js";
export function buildIcsFor(rows, name, staff) {
  return buildIcs(rows.map((a) => ({ ...a, summary: `${a.kind[0].toUpperCase()}${a.kind.slice(1)} – ${staff ? `${a.title} (${a.ref})` : a.title}`, location: a.location || (staff ? a.address : "") })), name);
}

export function sendFile(ctx, a) {
  if (!a) throw new HttpError(404, "Bestand niet gevonden.");
  const data = readFileSync(join(ctx.cfg.filesDir, a.stored_name));
  ctx.res.writeHead(200, { "Content-Type": a.mime, "Content-Disposition": `attachment; filename="${a.filename.replace(/"/g, "")}"`, "Cache-Control": "private, no-store", "Content-Security-Policy": "default-src 'none'; sandbox" });
  ctx.res.end(data);
}
