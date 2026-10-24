/* Browser-test van de volledige keten: aanvraag → beheer (login + 2FA) → project → offerte → klantportaal-akkoord → factuur → betaling.
   Start zelf een server met een tijdelijke database.
   Gebruik: PLAYWRIGHT=/pad/naar/playwright/index.mjs CHROMIUM=/pad/naar/chromium node --disable-warning=ExperimentalWarning tests/e2e/server-keten.mjs */
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "../../server/src/app.js";
import { createUser, totpAt } from "../../server/src/auth.js";
import { encodeShare } from "../../js/configurator/design-io.js";
import { createEmptyProject } from "../../js/project-state.js";
const { chromium } = await import(process.env.PLAYWRIGHT || "playwright");
const dir = mkdtempSync(join(tmpdir(), "seal-e2e-"));
const PORT = 8800 + Math.floor(Math.random() * 100);
const B = `http://localhost:${PORT}`;
const { server, db } = createApp({ dataDir: dir, dbPath: join(dir, "seal.sqlite"), filesDir: join(dir, "files"), backupDir: join(dir, "bk"), requireTotp: true, port: PORT, publicBaseUrl: B, siteOrigins: [B], cookieSecure: false });
await new Promise((r) => server.listen(PORT, "127.0.0.1", r));
createUser(db, { email: "eigenaar@example.test", name: "Eigenaar", password: "een-lang-wachtwoord-1", role: "owner" });
const p = createEmptyProject(); p.services = ["bestrating"]; p.access.surface = "paving";
p.paving = { areas: [{ id: "a1", lengthMm: 6000, widthMm: 4000, position: { xMm: 0, zMm: 0 }, rotationDeg: 0, application: "terras" }], productId: null, nominalTileLengthMm: 600, nominalTileWidthMm: 600, pattern: "straight", colorPresetId: "grey" };
const fd = new FormData();
for (const [k, v] of Object.entries({ kind: "configurator", naam: "Jan Tuin", email: "jan@example.test", telefoon: "0612345678", woonplaats: "Dordrecht", werkzaamheden: "Bestrating", omschrijving: "Terras 24 m2", privacy: "ja", started_at: String(Date.now() - 60000), design: `https://sealcleaning.nl/project-samenstellen/#ontwerp=${encodeShare(p)}` })) fd.append(k, v);
let r = await fetch(B + "/api/public/leads", { method: "POST", body: fd, headers: { Origin: B } });
console.log("lead", r.status, await r.text());
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const errors = [];
const watch = (pg, tag) => { pg.on("pageerror", (e) => errors.push(`${tag} pageerror ${e.message}`)); pg.on("console", (m) => m.type() === "error" && errors.push(`${tag} console ${m.text()}`)); };
const ctx = await browser.newContext(); const a = await ctx.newPage(); watch(a, "admin");
let promptAnswers = []; let lastPrompt = null;
a.on("dialog", async (dlg) => { if (dlg.type() === "prompt") { lastPrompt = dlg.defaultValue(); await dlg.accept(promptAnswers.shift() ?? dlg.defaultValue()); } else await dlg.accept(); });
await a.goto(B + "/admin/");
await a.getByLabel("E-mailadres").fill("eigenaar@example.test");
await a.getByLabel("Wachtwoord").fill("een-lang-wachtwoord-1");
await a.getByRole("button", { name: "Inloggen" }).click();
const secret = (await a.locator(".totp-secret").textContent()).replace(/\s/g, "");
await a.getByLabel("Voer de 6-cijferige code in").fill(totpAt(secret, Date.now()));
await a.getByRole("button", { name: "Bevestigen" }).click();
await a.getByRole("heading", { name: "Overzicht" }).waitFor();
console.log("dashboard ok");
// instellingen: betaaltermijn + IBAN
await a.goto(B + "/admin/#instellingen"); await a.getByRole("heading", { name: "Documentgegevens" }).waitFor();
await a.getByLabel("Betaaltermijn (dagen)").fill("14"); await a.getByLabel("IBAN").fill("NL91ABNA0417164300");
await a.getByLabel("Geldigheid offerte (dagen)").fill("30");
await a.locator(".beheer-card", { hasText: "Documentgegevens" }).getByRole("button", { name: "Opslaan" }).click();
await a.waitForTimeout(500);
await a.goto(B + "/admin/#aanvragen"); await a.getByRole("link", { name: "Openen" }).first().click();
await a.getByRole("button", { name: "Omzetten" }).click();
await a.getByRole("heading", { name: "Calculatie", exact: false }).first().waitFor({ timeout: 5000 }).catch(() => {});
await a.locator("summary", { hasText: "Calculatie" }).waitFor();
console.log("project+calc ok:", (await a.locator(".beheer-totals").textContent()).slice(0, 200));
await a.locator("summary", { hasText: "Nieuwe offerte maken" }).click();
await a.getByRole("button", { name: "Offerte (concept) aanmaken" }).click();
await a.getByRole("button", { name: "Versturen naar klant" }).waitFor();
await a.getByRole("button", { name: "Versturen naar klant" }).click();
await a.getByRole("button", { name: "Nieuwe versie" }).waitFor({ timeout: 5000 }).catch(async () => console.log("send err:", await a.locator(".field-error").allTextContents()));
const link = lastPrompt; console.log("portal link", link);
if (link) {
  const c2 = await browser.newContext(); const pp = await c2.newPage(); watch(pp, "portal");
  pp.on("dialog", (d) => d.accept());
  await pp.goto(link.replace(/^https?:\/\/[^/]+/, B));
  await pp.waitForTimeout(1000);
  await pp.locator("a,button", { hasText: /project|Bekijk|Openen/i }).first().click().catch(() => {});
  await pp.waitForTimeout(800);
    console.log("portal text:", (await pp.locator("main").textContent()).replace(/\s+/g, " ").slice(0, 600));
  const nameField = pp.getByLabel("Uw volledige naam");
  if (await nameField.count()) {
    await nameField.fill("Jan Tuin");
    for (const cb of await pp.locator(".portal-accept input[type=checkbox]").all()) await cb.check();
    await pp.getByRole("button", { name: "Akkoord geven" }).click();
    await pp.waitForTimeout(1000);
    console.log("after accept:", (await pp.locator("main").textContent()).replace(/\s+/g, " ").slice(0, 300));
  }
}
await a.reload(); await a.waitForTimeout(800);
await a.getByRole("button", { name: "Factuur (volledig)" }).click().catch((e) => console.log("no invoice btn"));
await a.waitForTimeout(800);
await a.getByRole("button", { name: /Uitgeven/ }).click().catch(() => console.log("no issue btn"));
await a.waitForTimeout(800);
console.log("invoices:", (await a.locator(".beheer-invoice").allTextContents()).join(" | ").slice(0, 300));
await a.getByRole("button", { name: "Betaling registreren" }).click().catch(() => console.log("no pay btn"));
await a.waitForTimeout(800);
console.log("invoices:", (await a.locator(".beheer-invoice").allTextContents()).join(" | ").slice(0, 300));
for (const t of ["overzicht", "klanten", "facturen", "winkel", "instellingen", "email", "audit", "account"]) { await a.goto(B + "/admin/#" + t); await a.waitForTimeout(400); const e = await a.locator("[data-app] .field-error").allTextContents(); if (e.length) console.log(t, "errors:", e); }
const inv = db.get("SELECT * FROM invoices WHERE number IS NOT NULL");
assert.equal(inv.status, "betaald");
assert.equal(db.get("SELECT status FROM quotes").status, "akkoord");
assert.ok(db.get("SELECT 1 FROM acceptances WHERE name = 'Jan Tuin'"));
const real = errors.filter((e) => !/status of 401/.test(e));
assert.deepEqual(real, []);
await browser.close(); server.close(); rmSync(dir, { recursive: true, force: true });
console.log("server-keten: OK");
