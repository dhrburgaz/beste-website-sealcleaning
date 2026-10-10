import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, readdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import net from "node:net";
import { createApp } from "../server/src/app.js";
import { createUser, totpAt } from "../server/src/auth.js";
import { resetRateLimits } from "../server/src/http.js";
import { processOutbox } from "../server/src/mail.js";
import { createMolliePayment, handleMollieWebhook, createBackup, restoreBackup, runRetention } from "../server/src/services.js";
import { openDb, setSetting } from "../server/src/db.js";
import { encodeShare } from "../js/configurator/design-io.js";
import { createEmptyProject } from "../js/project-state.js";

const ROOT = new URL("..", import.meta.url).pathname;
let app, base, dir;
const BACKUP_KEY = Buffer.alloc(32, 7).toString("base64");

function client() {
  let cookie = "";
  return async (method, path, body, { headers = {}, raw = false } = {}) => {
    const h = { "X-SEAL-CSRF": "1", ...headers };
    if (cookie) h.Cookie = cookie;
    let payload = body;
    if (body && !(body instanceof FormData) && typeof body !== "string") { h["Content-Type"] = "application/json"; payload = JSON.stringify(body); }
    const r = await fetch(base + path, { method, headers: h, body: payload, redirect: "manual" });
    const sc = r.headers.get("set-cookie");
    if (sc) cookie = sc.split(";")[0].endsWith("=") ? "" : sc.split(";")[0];
    if (raw) return r;
    const text = await r.text();
    let json; try { json = JSON.parse(text); } catch { json = text; }
    return { status: r.status, body: json, headers: r.headers };
  };
}

function demoDesign() {
  const p = createEmptyProject();
  p.services = ["bestrating"];
  p.access.surface = "paving";
  p.paving = { areas: [{ id: "a1", lengthMm: 6000, widthMm: 4000, position: { xMm: 0, zMm: 0 }, rotationDeg: 0, application: "terras" }], productId: null, nominalTileLengthMm: 600, nominalTileWidthMm: 600, pattern: "straight", colorPresetId: "grey" };
  return encodeShare(p);
}
const JPEG = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(200, 1)]);

before(async () => {
  dir = mkdtempSync(join(tmpdir(), "seal-test-"));
  app = createApp({ dataDir: dir, dbPath: join(dir, "seal.sqlite"), filesDir: join(dir, "files"), backupDir: join(dir, "backups"), cookieSecure: false, requireTotp: true,
    siteRoot: ROOT, publicBaseUrl: "http://localhost", siteOrigins: ["https://sealcleaning.nl"], backupKey: BACKUP_KEY, staffNotify: "team@example.test" });
  await new Promise((r) => app.server.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${app.server.address().port}`;
  app.cfg.publicBaseUrl = base;
  createUser(app.db, { email: "eigenaar@example.test", name: "Eigenaar", password: "een-lang-wachtwoord-1", role: "owner" });
});
after(() => { app.server.close(); app.db.close(); rmSync(dir, { recursive: true, force: true }); });

const S = { staff: null, totpSecret: null, leadRef: null, projectId: null, quoteId: null, invoiceId: null, customerId: null, cust: null };

test("medewerker: wachtwoord + verplichte 2FA-inrichting", async () => {
  S.staff = client();
  let r = await S.staff("POST", "/api/auth/login", { email: "eigenaar@example.test", password: "fout" });
  assert.equal(r.status, 401);
  r = await S.staff("POST", "/api/auth/login", { email: "eigenaar@example.test", password: "een-lang-wachtwoord-1" });
  assert.equal(r.status, 200); assert.equal(r.body.enrollTotp, true);
  r = await S.staff("GET", "/api/admin/dashboard");
  assert.equal(r.status, 401); assert.equal(r.body.needTotp, true);
  r = await S.staff("POST", "/api/auth/totp/setup", {});
  S.totpSecret = r.body.secret;
  assert.match(r.body.uri, /^otpauth:\/\/totp\//);
  r = await S.staff("POST", "/api/auth/totp/verify", { code: "000000" });
  assert.equal(r.status, 400);
  r = await S.staff("POST", "/api/auth/totp/verify", { code: totpAt(S.totpSecret, Date.now()) });
  assert.equal(r.status, 200);
  r = await S.staff("GET", "/api/admin/dashboard");
  assert.equal(r.status, 200);
  assert.match(r.body.integrations.payments, /niet operationeel/);
});

test("login vraagt daarna TOTP; zonder code geen sessie", async () => {
  const c = client();
  let r = await c("POST", "/api/auth/login", { email: "eigenaar@example.test", password: "een-lang-wachtwoord-1" });
  assert.equal(r.status, 401); assert.equal(r.body.needTotp, true);
  r = await c("POST", "/api/auth/login", { email: "eigenaar@example.test", password: "een-lang-wachtwoord-1", totp: totpAt(S.totpSecret, Date.now()) });
  assert.equal(r.status, 200);
});

test("CSRF: zonder header of van andere herkomst geweigerd", async () => {
  let r = await fetch(base + "/api/admin/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
  assert.equal(r.status, 403);
  r = await S.staff("POST", "/api/admin/customers", { name: "x" }, { headers: { Origin: "https://evil.example" } });
  assert.equal(r.status, 403);
});

test("publiek formulier: upload, ontwerp, CORS, antispam en bestandscontrole", async () => {
  const fd = new FormData();
  for (const [k, v] of Object.entries({ kind: "configurator", naam: "Jan Tuin", email: "jan@example.test", telefoon: "0612345678", woonplaats: "Dordrecht", werkzaamheden: "Bestrating", omschrijving: "Terras 24 m2", privacy: "ja", design: `https://sealcleaning.nl/project-samenstellen/#ontwerp=${demoDesign()}` })) fd.append(k, v);
  fd.append("fotos", new Blob([JPEG], { type: "image/jpeg" }), "tuin.jpg");
  let r = await fetch(base + "/api/public/leads", { method: "POST", body: fd, headers: { Origin: "https://sealcleaning.nl" } });
  assert.equal(r.status, 201);
  assert.equal(r.headers.get("access-control-allow-origin"), "https://sealcleaning.nl");
  const body = await r.json();
  assert.match(body.ref, /^A-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  S.leadRef = body.ref;
  // andere origin: geen CORS-header
  const fd2 = new FormData(); fd2.append("naam", "X"); fd2.append("email", "x@example.test"); fd2.append("privacy", "ja");
  r = await fetch(base + "/api/public/leads", { method: "POST", body: fd2, headers: { Origin: "https://evil.example" } });
  assert.equal(r.headers.get("access-control-allow-origin"), null);
  // honeypot
  const fd3 = new FormData(); fd3.append("naam", "Bot"); fd3.append("email", "b@example.test"); fd3.append("privacy", "ja"); fd3.append("website", "spam");
  r = await fetch(base + "/api/public/leads", { method: "POST", body: fd3 });
  assert.equal(r.status, 400);
  // vermomd bestand
  const fd4 = new FormData(); fd4.append("naam", "Y"); fd4.append("email", "y@example.test"); fd4.append("privacy", "ja");
  fd4.append("fotos", new Blob([Buffer.from("MZ\x90\x00 dit is geen foto maar een programma......")]), "foto.jpg");
  r = await fetch(base + "/api/public/leads", { method: "POST", body: fd4 });
  assert.equal(r.status, 415);
  // privacy verplicht
  r = await fetch(base + "/api/public/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ naam: "Z", email: "z@example.test" }) });
  assert.equal(r.status, 400);
  resetRateLimits();
});

test("aanvraag omzetten naar klant + project (met ontwerp en foto)", async () => {
  let r = await S.staff("GET", "/api/admin/leads");
  const lead = r.body.find((l) => l.ref === S.leadRef);
  assert.ok(lead.has_design);
  r = await S.staff("POST", `/api/admin/leads/${lead.id}/convert`, { title: "Terras Jan" });
  assert.equal(r.status, 201);
  S.projectId = r.body.projectId; S.customerId = r.body.customerId;
  r = await S.staff("GET", `/api/admin/projects/${S.projectId}`);
  assert.equal(r.body.files.length, 1);
  assert.equal(r.body.design.paving.areas[0].lengthMm, 6000);
});

test("offerte: server-side calculatie, alleen concept wijzigbaar, versturen", async () => {
  let r = await S.staff("PUT", "/api/admin/settings/company", { offerValidityDays: 30, paymentTermDays: 14, iban: "NL91 ABNA 0417 1643 00", quotePrefix: "OFF", invoicePrefix: "F" });
  assert.equal(r.status, 200);
  r = await S.staff("PUT", "/api/admin/settings/calc", { materialMarkupPct: 20, transportPerDayCents: 4500, laborCostRateCents: 3500 });
  assert.equal(r.status, 200);
  r = await S.staff("PUT", "/api/admin/purchase-prices/paving.sand", { amountExcl: 4500, sku: "ZAND-1", observedAt: "2026-10-01" });
  r = await S.staff("POST", `/api/admin/projects/${S.projectId}/calc`, {});
  assert.equal(r.status, 200);
  assert.equal(r.body.result.lines.find((l) => l.key === "paving.sand").basis, "purchase");
  r = await S.staff("POST", `/api/admin/projects/${S.projectId}/quotes`, { priceType: "richtprijs", manualLines: [{ label: "Boomstronk frezen", qty: 1, unit: "post", unitSaleExclCents: 8500 }] });
  assert.equal(r.status, 201);
  S.quoteId = r.body.id;
  r = await S.staff("PUT", `/api/admin/quotes/${S.quoteId}`, { customerWork: "Klant ruimt schuur leeg." });
  assert.equal(r.status, 200);
  r = await S.staff("POST", `/api/admin/quotes/${S.quoteId}/send`, {});
  assert.equal(r.status, 200);
  assert.match(r.body.portalLink, /\/portaal\/#token=/);
  S.portalLink = r.body.portalLink;
  r = await S.staff("PUT", `/api/admin/quotes/${S.quoteId}`, { customerWork: "anders" });
  assert.equal(r.status, 409);
});

test("klantportaal: inloggen met eenmalige link, geen interne gegevens zichtbaar", async () => {
  S.cust = client();
  const t = S.portalLink.split("#token=")[1];
  let r = await S.cust("POST", "/api/portal/login", { token: t });
  assert.equal(r.status, 200);
  r = await client()("POST", "/api/portal/login", { token: t });
  assert.equal(r.status, 401, "link is eenmalig");
  r = await S.cust("GET", "/api/portal/me");
  assert.equal(r.body.projects.length, 1);
  r = await S.cust("GET", `/api/portal/projects/${S.projectId}`);
  assert.equal(r.status, 200);
  const txt = JSON.stringify(r.body);
  for (const leak of ["costExclCents", "unitCostExclCents", "grossMargin", "internal", "ZAND-1", "markup", "laborCostRate", "purchase"]) assert.ok(!txt.includes(leak), `lek: ${leak}`);
  const doc = r.body.quotes[0].document;
  assert.equal(doc.totals.incl, doc.totals.excl + doc.totals.vat);
  assert.equal(doc.lines.reduce((s, l) => s + l.saleExclCents, 0), doc.totals.excl);
  assert.equal(doc.customerWork, "Klant ruimt schuur leeg.");
  // medewerker-API is dicht voor klanten
  r = await S.cust("GET", "/api/admin/dashboard");
  assert.equal(r.status, 401);
});

test("autorisatie: andere klant ziet project/offerte niet", async () => {
  let r = await S.staff("POST", "/api/admin/customers", { name: "Andere klant", email: "ander@example.test" });
  const other = r.body.id;
  r = await S.staff("POST", `/api/admin/customers/${other}/portal-link`, {});
  const c2 = client();
  await c2("POST", "/api/portal/login", { token: r.body.link.split("#token=")[1] });
  r = await c2("GET", `/api/portal/projects/${S.projectId}`);
  assert.equal(r.status, 404);
  r = await c2("POST", `/api/portal/quotes/${S.quoteId}/accept`, { name: "Indringer", agreeTerms: true, snapshotHash: "x" });
  assert.equal(r.status, 404);
});

test("digitaal akkoord: versie-hash, voorwaarden, naam; vastgelegd en bevestigd", async () => {
  let r = await S.cust("POST", `/api/portal/quotes/${S.quoteId}/accept`, { name: "Jan Tuin", agreeTerms: true, snapshotHash: "verkeerd" });
  assert.equal(r.status, 409);
  const hash = app.db.get("SELECT snapshot_hash FROM quotes WHERE id = ?", S.quoteId).snapshot_hash;
  r = await S.cust("POST", `/api/portal/quotes/${S.quoteId}/accept`, { name: "Jan Tuin", agreeTerms: false, snapshotHash: hash });
  assert.equal(r.status, 400);
  r = await S.cust("POST", `/api/portal/quotes/${S.quoteId}/accept`, { name: "Jan Tuin", agreeTerms: true, earlyStart: true, withdrawalInfoRead: true, snapshotHash: hash });
  assert.equal(r.status, 200);
  const acc = app.db.get("SELECT * FROM acceptances WHERE quote_id = ?", S.quoteId);
  assert.equal(acc.name, "Jan Tuin");
  assert.equal(acc.snapshot_hash, hash);
  assert.ok(acc.terms_version);
  assert.equal(JSON.parse(acc.consents_json).earlyStart, true);
  assert.ok(app.db.get("SELECT 1 FROM outbox WHERE kind = 'akkoordbevestiging' AND to_addr = 'jan@example.test'"));
  r = await S.cust("POST", `/api/portal/quotes/${S.quoteId}/accept`, { name: "Jan Tuin", agreeTerms: true, snapshotHash: hash });
  assert.equal(r.status, 409);
});

test("facturen: doorlopende nummering bij uitgifte, onwijzigbaar, creditnota, betalingen", async () => {
  let r = await S.staff("POST", `/api/admin/quotes/${S.quoteId}/invoices`, { part: { label: "Eerste termijn", pct: 40 } });
  const inv1 = r.body.id;
  r = await S.staff("POST", `/api/admin/quotes/${S.quoteId}/invoices`, {});
  const inv2 = r.body.id;
  r = await S.staff("POST", `/api/admin/quotes/${S.quoteId}/invoices`, {});
  const concept = r.body.id;
  const year = new Date().getFullYear();
  r = await S.staff("POST", `/api/admin/invoices/${inv1}/issue`, { deliveryDate: "2026-10-09" });
  assert.equal(r.body.number, `F${year}0001`);
  r = await S.staff("POST", `/api/admin/invoices/${inv2}/issue`, {});
  assert.equal(r.body.number, `F${year}0002`);
  r = await S.staff("POST", `/api/admin/invoices/${inv1}/issue`, {});
  assert.equal(r.status, 409, "geen tweede uitgifte");
  r = await S.staff("DELETE", `/api/admin/invoices/${inv1}`);
  assert.equal(r.status, 409, "uitgegeven factuur niet te verwijderen");
  r = await S.staff("DELETE", `/api/admin/invoices/${concept}`);
  assert.equal(r.status, 200, "concept zonder nummer wel");
  r = await S.staff("POST", `/api/admin/invoices/${inv2}/credit`, { amountExclCents: 10000, reason: "Korting restpunt" });
  r = await S.staff("POST", `/api/admin/invoices/${r.body.id}/issue`, {});
  assert.equal(r.body.number, `F${year}0003`);
  const i1 = app.db.get("SELECT * FROM invoices WHERE id = ?", inv1);
  r = await S.staff("POST", `/api/admin/invoices/${inv1}/payments`, { amount: 1000, method: "bank" });
  assert.equal(app.db.get("SELECT status FROM invoices WHERE id = ?", inv1).status, "verstuurd");
  r = await S.staff("POST", `/api/admin/invoices/${inv1}/payments`, { amount: i1.total_incl - 1000, method: "bank" });
  assert.equal(app.db.get("SELECT status FROM invoices WHERE id = ?", inv1).status, "betaald");
  S.invoiceId = inv2;
  // klant ziet facturen, online betalen niet operationeel zonder provider
  r = await S.cust("GET", `/api/portal/projects/${S.projectId}`);
  assert.equal(r.body.invoices.length, 3);
  assert.equal(r.body.payOnline, false);
  r = await S.cust("POST", `/api/portal/invoices/${inv2}/pay`, {});
  assert.equal(r.status, 503);
  // CSV-export
  r = await S.staff("GET", "/api/admin/export/invoices.csv", null, { raw: true });
  const csv = await r.text();
  assert.match(csv, new RegExp(`F${year}0003;creditnota`));
  // klant met uitgegeven facturen niet te verwijderen (bewaarplicht)
  r = await S.staff("DELETE", `/api/admin/customers/${S.customerId}`);
  assert.equal(r.status, 409);
});

test("Mollie-adapter: betaling aanmaken en webhook verifiëren bij de provider (idempotent)", async () => {
  const cfg = { ...app.cfg, mollieKey: "test_abc" };
  const calls = [];
  const fake = async (url, opts = {}) => {
    calls.push([url, opts.method || "GET"]);
    if (opts.method === "POST") return { ok: true, json: async () => ({ id: "tr_TEST1", _links: { checkout: { href: "https://www.mollie.com/checkout/test" } } }) };
    const open = app.db.get("SELECT amount FROM payments WHERE provider_id = 'tr_TEST1'").amount;
    return { ok: true, json: async () => ({ id: "tr_TEST1", status: "paid", paidAt: "2026-10-10T10:00:00Z", amount: { value: (open / 100).toFixed(2), currency: "EUR" }, metadata: { invoiceId: S.invoiceId } }) };
  };
  const url = await createMolliePayment(app.db, cfg, S.invoiceId, fake);
  assert.equal(url, "https://www.mollie.com/checkout/test");
  assert.equal(calls[0][1], "POST");
  await handleMollieWebhook(app.db, cfg, "tr_TEST1", fake);
  await handleMollieWebhook(app.db, cfg, "tr_TEST1", fake);
  const paid = app.db.all("SELECT * FROM payments WHERE provider_id = 'tr_TEST1'");
  assert.equal(paid.length, 1); assert.equal(paid[0].status, "paid");
  assert.equal(app.db.get("SELECT status FROM invoices WHERE id = ?", S.invoiceId).status, "betaald");
  await handleMollieWebhook(app.db, cfg, "tr_ONBEKEND", fake); // onbekende id: genegeerd
});

test("agenda: afspraken, ICS-feed met geheim token, klantvoorstel blijft voorstel", async () => {
  let r = await S.staff("POST", `/api/admin/projects/${S.projectId}/appointments`, { kind: "uitvoering", startsAt: "2026-11-02T07:30:00Z", endsAt: "2026-11-02T15:30:00Z", location: "Dordrecht" });
  assert.equal(r.status, 201);
  r = await S.cust("POST", `/api/portal/projects/${S.projectId}/appointments`, { startsAt: "2026-12-01T09:00:00Z", note: "liefst ochtend" });
  assert.equal(r.body.status, "voorstel");
  r = await S.staff("POST", "/api/admin/calendar/feed", {});
  const feed = await fetch(r.body.url.replace("http://localhost", base).replace(/^http:\/\/127\.0\.0\.1:\d+/, base));
  const ics = await feed.text();
  assert.match(ics, /BEGIN:VCALENDAR/); assert.match(ics, /Uitvoering – Terras Jan/);
  assert.ok(!ics.includes("liefst ochtend"), "voorstel staat niet in de bevestigde planning");
  r = await fetch(base + "/api/calendar/verkeerdtokenverkeerdtoken12345.ics");
  assert.equal(r.status, 404);
  r = await S.cust("GET", "/api/portal/calendar.ics", null, { raw: true });
  assert.match(await r.text(), /BEGIN:VEVENT/);
});

test("berichten, toestemmingen en AVG-export voor klant", async () => {
  let r = await S.cust("POST", `/api/portal/projects/${S.projectId}/messages`, { body: "Kan de poort breder?", topic: "wijziging" });
  assert.equal(r.status, 201);
  r = await S.cust("POST", "/api/portal/consents", { kind: "projectfoto-publicatie", granted: false });
  assert.equal(r.status, 200);
  r = await S.cust("GET", "/api/portal/export", null, { raw: true });
  const data = JSON.parse(await r.text());
  assert.equal(data.customer.email, "jan@example.test");
  assert.ok(data.projects[0].messages.some((m) => m.body.startsWith("[Wijzigingsverzoek]")));
  assert.ok(!JSON.stringify(data).includes("costExclCents"));
});

test("e-mail via SMTP vanuit de wachtrij", async () => {
  const received = [];
  const smtp = net.createServer((s) => {
    let data = false, buf = "";
    s.write("220 test\r\n");
    s.on("data", (d) => {
      buf += d.toString();
      let i;
      while ((i = buf.indexOf("\r\n")) >= 0) {
        const line = buf.slice(0, i); buf = buf.slice(i + 2);
        if (data) { if (line === ".") { data = false; s.write("250 ok\r\n"); } else received.push(line); continue; }
        if (/^EHLO/.test(line)) s.write("250-test\r\n250 AUTH LOGIN\r\n");
        else if (line === "AUTH LOGIN") s.write("334 VXNlcm5hbWU6\r\n");
        else if (/^[A-Za-z0-9+/=]+$/.test(line) && !s.authed) { s.step = (s.step || 0) + 1; s.write(s.step === 1 ? "334 UGFzc3dvcmQ6\r\n" : "235 ok\r\n"); if (s.step === 2) s.authed = true; }
        else if (/^MAIL FROM|^RCPT TO/.test(line)) s.write("250 ok\r\n");
        else if (line === "DATA") { data = true; s.write("354 go\r\n"); }
        else if (line === "QUIT") { s.write("221 bye\r\n"); s.end(); }
      }
    });
  });
  await new Promise((r) => smtp.listen(0, "127.0.0.1", r));
  const cfg = { ...app.cfg, smtp: { host: "127.0.0.1", port: smtp.address().port, secure: "none", user: "u", pass: "p", from: "Sealcleaning <info@sealcleaning.nl>" } };
  const sent = await processOutbox(app.db, cfg);
  smtp.close();
  assert.ok(sent >= 3, `verzonden: ${sent}`);
  assert.ok(received.some((l) => l.startsWith("Subject: ")));
  assert.equal(app.db.get("SELECT COUNT(*) n FROM outbox WHERE status = 'queued'").n, 0);
});

test("back-up versleuteld en herstelbaar; bewaartermijn verwijdert oude sollicitatie", async () => {
  const dirB = createBackup(app.db, app.cfg);
  assert.ok(existsSync(join(dirB, "db.sqlite.enc")));
  assert.equal(readdirSync(join(dirB, "files")).length, 1);
  const target = join(dir, "restored");
  restoreBackup(app.cfg, dirB, target);
  const rdb = openDb(join(target, "seal.sqlite"));
  assert.ok(rdb.get("SELECT 1 FROM quotes WHERE id = ?", S.quoteId));
  rdb.close();
  assert.throws(() => restoreBackup({ ...app.cfg, backupKey: Buffer.alloc(32, 9).toString("base64") }, dirB, join(dir, "x")));
  app.db.run("INSERT INTO leads (id, ref, kind, name, created_at, updated_at) VALUES ('l_old', 'A-OLD0-0000', 'werken', 'Oud', '2020-01-01T00:00:00Z', '2020-01-01T00:00:00Z')");
  setSetting(app.db, "retention", { leadDays: null, applicationDays: 30 });
  assert.equal(runRetention(app.db, app.cfg), 1);
  assert.equal(app.db.get("SELECT 1 FROM leads WHERE id = 'l_old'"), undefined);
});

test("rate limiting op inloggen", async () => {
  resetRateLimits();
  const c = client();
  let last;
  for (let i = 0; i < 10; i++) last = await c("POST", "/api/auth/login", { email: "x@example.test", password: "y" });
  assert.equal(last.status, 429);
  resetRateLimits();
});

test("statische admin/portaal-pagina's met strikte headers", async () => {
  const r = await fetch(base + "/admin/");
  assert.equal(r.status, 200);
  assert.match(r.headers.get("content-security-policy"), /frame-ancestors 'none'/);
  assert.equal(r.headers.get("x-robots-tag"), "noindex, nofollow");
  const t = await fetch(base + "/../server/src/config.js");
  assert.equal(t.status, 404);
  const d = await fetch(base + "/docs/SEAL_MASTER_BRIEF.md");
  assert.equal(d.status, 404);
});
