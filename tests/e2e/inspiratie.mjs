/* E2E inspiratiefoto's: kaarten, knoppen werken, stijlkeuze in ontwerper zet materiaal, filter, geen kapotte afbeeldingen, geen overflow op 320 px.
   Gebruik: PLAYWRIGHT=… CHROMIUM=… BASE=http://127.0.0.1:8941/ node tests/e2e/inspiratie.mjs */
import assert from "node:assert/strict";
const pw = await import(process.env.PLAYWRIGHT || "playwright"); const chromium = pw.chromium || pw.default.chromium;
const BASE = (process.env.BASE || "http://127.0.0.1:8941/").replace(/\/?$/, "/");
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const ctx = await b.newContext({ viewport: { width: 320, height: 700 } }); const pg = await ctx.newPage();
const scrollAll = () => pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } });
for (const u of ["", "schuttingen/", "bestrating/", "tuinaanleg/", "tuinrenovatie/", "tuinonderhoud/", "inspiratie/"]) {
  await pg.goto(BASE + u); await scrollAll(); await pg.waitForTimeout(600);
  assert.equal(await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0, `overflow op ${u}`);
  assert.deepEqual(await pg.evaluate(() => [...document.images].filter((i) => i.complete && !i.naturalWidth).map((i) => i.src)), [], `kapotte afbeelding op ${u}`);
  assert.ok(await pg.locator(".i-caption, .i-disclaimer").count() > 0, `impressie-melding ontbreekt op ${u}`);
}
console.log("ok  7 pagina's: foto's laden, melding aanwezig, geen overflow op 320 px");
await pg.goto(BASE + "schuttingen/");
assert.equal(await pg.locator(".i-card").count(), 6);
for (const a of await pg.locator(".i-card-actions a").all()) { const href = new URL(await a.getAttribute("href"), BASE + "schuttingen/").href; assert.ok((await pg.request.get(href)).ok(), `link stuk: ${href}`); }
console.log("ok  schuttingen: 5 stijlkaarten + poortkaart, alle knoppen bereikbaar");
await pg.goto(BASE + "inspiratie/");
await pg.locator('.i-filter button[data-f="bakken"]').click();
assert.equal(await pg.locator(".i-photo:not([hidden])").count(), 2);
await pg.locator('.i-filter button[data-f="all"]').click();
assert.equal(await pg.locator(".i-photo:not([hidden])").count(), 14);
console.log("ok  inspiratiegalerij: filter werkt");
await pg.addInitScript(() => localStorage.setItem("sealBeginnerSchuttingV12", JSON.stringify({ doel: "nieuw", step: "materiaal", vorm: "recht", lengtes: {} })));
await pg.goto(BASE + "schutting-ontwerpen/"); await pg.waitForSelector("label[for=stijl-antraciet]");
await pg.locator("label[for=stijl-antraciet]").scrollIntoViewIfNeeded(); await pg.locator("label[for=stijl-antraciet]").click({ force: true });
assert.equal(await pg.locator("input[name=materiaal]:checked").getAttribute("value"), "composiet");
console.log("ok  ontwerper: uitstraling kiezen zet het bijbehorende materiaal");
await b.close(); console.log("inspiratie: OK");
