/**
 * Publieke endpoints (CORS alleen voor de eigen website-origins, zonder cookies).
 * Formulieren: contact, zakelijk, werken-met-ons en configurator-aanvragen.
 */
import { HttpError, readMultipart, readJson, rateLimit } from "../http.js";
import { now, newId, newRef, audit } from "../db.js";
import { queueMail } from "../mail.js";
import { saveAttachment, handleMollieWebhook } from "../services.js";
import { decodeShare, sanitizeDesign } from "../../../js/configurator/design-io.js";
import { readBody } from "../http.js";

const KINDS = { contact: "Aanvraag", b2b: "Zakelijke aanvraag", werken: "Samenwerking/sollicitatie", configurator: "Aanvraag via configurator" };
const s = (v, max = 200) => (v == null ? null : String(v).trim().slice(0, max) || null);

function parseDesign(raw) {
  if (!raw) return null;
  const m = /#ontwerp=([A-Za-z0-9_-]+)/.exec(raw) || (/^[A-Za-z0-9_-]{20,}$/.test(raw) ? [null, raw] : null);
  try {
    const project = m ? decodeShare(m[1]) : sanitizeDesign(JSON.parse(raw));
    return JSON.stringify(project);
  } catch { throw new HttpError(400, "Het meegestuurde ontwerp is ongeldig."); }
}

export function registerPublic(r) {
  r.get("/api/health", (ctx) => ctx.json(200, { ok: true }));

  r.post("/api/public/leads", async (ctx) => {
    rateLimit(`lead:${ctx.ipHash}`, 10, 3600e3);
    const ct = String(ctx.req.headers["content-type"] || "");
    const { fields, files } = ct.startsWith("multipart/") ? await readMultipart(ctx.req) : { fields: await readJson(ctx.req), files: [] };
    if (fields.website) throw new HttpError(400, "Aanvraag geweigerd.");            // honeypot
    const started = Number(fields.started_at);
    if (started && Date.now() - started < 2500) throw new HttpError(400, "Aanvraag te snel verstuurd.");
    const kind = KINDS[fields.kind] ? fields.kind : "contact";
    const name = s(fields.naam || fields.name || fields.contactpersoon, 120);
    const email = s(fields.email, 160);
    const phone = s(fields.telefoon || fields.phone, 40);
    if (!name) throw new HttpError(400, "Naam is verplicht.");
    if (!email && !phone) throw new HttpError(400, "Vul een e-mailadres of telefoonnummer in.");
    if (email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) throw new HttpError(400, "Ongeldig e-mailadres.");
    if (!/^(ja|true|1|on)$/i.test(String(fields.privacy || ""))) throw new HttpError(400, "Bevestig dat u de privacyverklaring hebt gelezen.");
    const design = parseDesign(s(fields.design || fields.ontwerp, 20000));
    const known = ["naam", "name", "contactpersoon", "email", "telefoon", "phone", "woonplaats", "plaats", "postcode", "werkzaamheden", "service", "omschrijving", "message", "design", "ontwerp", "privacy", "kind", "website", "started_at"];
    const extra = Object.fromEntries(Object.entries(fields).filter(([k]) => !known.includes(k)).slice(0, 30).map(([k, v]) => [k.slice(0, 40), String(v).slice(0, 2000)]));
    const id = newId("lead"), ref = newRef("A"), ts = now();
    ctx.db.tx(() => {
      ctx.db.run(`INSERT INTO leads (id, ref, kind, name, email, phone, city, postal, service, message, design_json, payload_json, ip_hash, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        id, ref, kind, name, email, phone, s(fields.woonplaats || fields.plaats, 80), s(fields.postcode, 10), s(fields.werkzaamheden || fields.service, 80),
        s(fields.omschrijving || fields.message, 8000), design, JSON.stringify(extra), ctx.ipHash, ts, ts);
      for (const f of files) saveAttachment(ctx.db, ctx.cfg, { ownerType: "lead", ownerId: id, file: f });
      ctx.db.run("INSERT INTO consents (id, kind, granted, at, source, text_version) VALUES (?, 'privacyverklaring-gelezen', 1, ?, ?, ?)", newId("cns"), ts, `lead:${ref}`, "privacy-concept-2026-10-10");
      audit(ctx.db, "website", `${KINDS[kind].toLowerCase()} ontvangen`, ref, ctx.ipHash);
    });
    if (email) queueMail(ctx.db, { kind: "lead-bevestiging", to: email, subject: `Ontvangen: uw aanvraag ${ref} bij Sealcleaning`,
      text: `Beste ${name},\n\nBedankt voor uw aanvraag. Wij hebben deze goed ontvangen onder referentie ${ref}.\nWe nemen zo snel mogelijk persoonlijk contact met u op.\n\nMet vriendelijke groet,\nSealcleaning Groenonderhoud en Aanleg\n\nDit is een automatische bevestiging. Reageren kan op dit bericht.` });
    if (ctx.cfg.staffNotify) queueMail(ctx.db, { kind: "lead-melding", to: ctx.cfg.staffNotify, subject: `Nieuwe ${KINDS[kind].toLowerCase()}: ${ref}`,
      text: `Nieuwe ${KINDS[kind].toLowerCase()} (${ref}) van ${name}. Bekijk de details in de beheeromgeving: ${ctx.cfg.publicBaseUrl}/admin/#aanvragen` });
    ctx.json(201, { ref, attachments: files.length });
  });

  // Mollie-webhook: inhoud niet vertrouwen, status wordt bij Mollie opgehaald.
  r.post("/api/payments/mollie/webhook", async (ctx) => {
    rateLimit(`mollie:${ctx.ipHash}`, 120, 60e3);
    const body = (await readBody(ctx.req, 4096)).toString("utf8");
    const id = new URLSearchParams(body).get("id");
    await handleMollieWebhook(ctx.db, ctx.cfg, id);
    ctx.res.writeHead(200); ctx.res.end("ok");
  }, { webhook: true });
}
