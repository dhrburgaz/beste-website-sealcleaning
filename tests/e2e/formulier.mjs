/* E2E offerteformulier: aanvraag gaat direct naar de formulierdienst (nagebootst) en toont een bevestiging. */
import assert from "node:assert/strict";
const pw = await import(process.env.PLAYWRIGHT || "playwright"); const chromium = pw.chromium || pw.default.chromium;
const BASE = (process.env.BASE || "http://127.0.0.1:8941/").replace(/\/?$/, "/");
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const p = await b.newPage(); let posted = null;
await p.route("https://formsubmit.co/**", (r) => { posted = r.request().url(); r.fulfill({ status: 200, contentType: "application/json", body: '{"success":"true"}' }); });
await p.goto(BASE + "contact/" + (process.env.FLAT === "1" ? "index.html" : ""));
for (const [n, v] of Object.entries({ naam: "Test", telefoon: "0612345678", email: "t@example.nl", postcode: "3311AA", woonplaats: "Dordrecht", omschrijving: "Nieuwe schutting 10 meter" })) { const e = p.locator(`[name=${n}]`); if (await e.count()) await e.first().fill(v); }
await p.locator("input[type=checkbox]").evaluateAll((a) => a.forEach((c) => { if (c.required) c.checked = true; }));
await p.locator("select").evaluateAll((a) => a.forEach((s) => { if (s.required && s.options[1]) s.selectedIndex = 1; }));
await p.locator("[type=submit]").first().click(); await p.waitForTimeout(800);
assert.match(posted || "", /formsubmit/); assert.match(await p.locator("[data-form-status]").innerText(), /verstuurd/);
// bij een storing: terugval op e-mail
const p2 = await b.newPage(); await p2.route("https://formsubmit.co/**", (r) => r.abort());
await p2.goto(BASE + "contact/" + (process.env.FLAT === "1" ? "index.html" : ""));
for (const [n, v] of Object.entries({ naam: "Test", telefoon: "0612345678", email: "t@example.nl", postcode: "3311AA", woonplaats: "Dordrecht", omschrijving: "x" })) { const e = p2.locator(`[name=${n}]`); if (await e.count()) await e.first().fill(v); }
await p2.locator("input[type=checkbox]").evaluateAll((a) => a.forEach((c) => { if (c.required) c.checked = true; }));
await p2.locator("select").evaluateAll((a) => a.forEach((s) => { if (s.required && s.options[1]) s.selectedIndex = 1; }));
await p2.locator("[type=submit]").first().click(); await p2.waitForTimeout(800);
assert.ok(await p2.locator("[data-mailto-fallback]").isVisible(), "mailto-terugval ontbreekt bij storing");
console.log("formulier: OK (direct versturen + terugval)"); await b.close();
