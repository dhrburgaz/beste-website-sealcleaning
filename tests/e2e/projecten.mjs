/* E2E projecten: nieuwe projectpagina's laden alle foto's, lightbox en filter werken, geen overflow of fouten (NL + TR, desktop + mobiel). */
import assert from "node:assert/strict";
const pw = await import(process.env.PLAYWRIGHT || "playwright"); const chromium = pw.chromium || pw.default.chromium;
const BASE = (process.env.BASE || "http://127.0.0.1:8941/").replace(/\/?$/, "/"), IDX = process.env.FLAT === "1" ? "index.html" : "";
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined }); const errs = [];
const SLUGS = ["oprit-en-bestrating-gereinigd", "klimopheg-gesnoeid-langs-oprit"];
for (const [w, h] of [[1280, 900], [390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on("pageerror", (e) => errs.push(e.message)); p.on("response", (r) => { if (r.status() >= 400 && !/favicon/.test(r.url())) errs.push(r.status() + " " + r.url()); });
  for (const u of SLUGS.flatMap((s) => [`projecten/${s}/`, `tr/projecten/${s}/`])) {
    await p.goto(BASE + u + IDX);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } });
    await p.waitForTimeout(500);
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, "overflow " + u);
    const broken = await p.$$eval("img:not([data-lightbox-img])", (i) => i.filter((x) => x.complete && x.naturalWidth === 0).length); assert.equal(broken, 0, "kapotte afbeelding " + u);
    const alts = await p.$$eval("img:not([data-lightbox-img])", (i) => i.filter((x) => !x.alt).length); assert.equal(alts, 0, "afbeelding zonder alt " + u);
  }
  await p.goto(BASE + `projecten/${SLUGS[0]}/` + IDX); await p.locator("[data-lightbox]").nth(1).click(); assert.ok(await p.locator("[data-lightbox-root]").isVisible(), "lightbox opent niet"); await p.keyboard.press("Escape");
  await p.goto(BASE + "projecten/" + IDX); await p.click('[data-filter="hogedrukreiniging"]'); await p.waitForTimeout(300);
  assert.equal(await p.$$eval("[data-lightbox]", (e) => e.filter((x) => !x.hidden && getComputedStyle(x).display !== "none").length), 1, "filter hogedrukreiniging");
}
assert.deepEqual(errs, [], errs.join("\n")); console.log("projecten: OK"); await b.close();
