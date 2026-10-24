/* E2E Nederlands/Turks: schakelaar behoudt pagina, hreflang/canonical, links, console, resterend Nederlands, 3D-ontwerper in het Turks.
   Gebruik: PLAYWRIGHT=… CHROMIUM=… BASE=http://127.0.0.1:8941/ node tests/e2e/taal.mjs */
import assert from "node:assert/strict";
import fs from "node:fs";
const pw = await import(process.env.PLAYWRIGHT || "playwright"); const chromium = pw.chromium || pw.default.chromium;
const BASE = (process.env.BASE || "http://127.0.0.1:8941/").replace(/\/?$/, "/");
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); const p = await ctx.newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(e.message)); p.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|ERR_/.test(m.text())) errors.push(m.text()); });
p.on("response", (r) => { if (r.status() >= 400 && !/favicon|\/api\//.test(r.url())) errors.push(`HTTP ${r.status()} ${r.url()}`); });
const ok = (n) => console.log("ok ", n);
const pages = fs.readdirSync(".", { recursive: true }).filter((f) => /^tr\/.*index\.html$/.test(f)).map((f) => f.slice(3).replace(/index\.html$/, ""));
assert.ok(pages.length >= 40, "te weinig TR-pagina's: " + pages.length);
const DUTCH = /\b(de|het|een|en|voor|met|wij|uw|naar|van|ons|onze|offerte|aanvragen|schutting)\b/gi;
let leftovers = [];
for (const pg of pages) {
  await p.goto(BASE + "tr/" + pg);
  assert.equal(await p.getAttribute("html", "lang"), "tr", `html lang op tr/${pg}`);
  const hl = await p.$$eval('link[rel=alternate][hreflang]', (l) => l.map((x) => x.hreflang).sort().join(","));
  assert.match(hl, /nl/, `hreflang nl ontbreekt op tr/${pg}`); assert.match(hl, /tr/, `hreflang tr ontbreekt op tr/${pg}`);
  const can = await p.getAttribute('link[rel=canonical]', "href"); assert.ok(/\/tr\//.test(can) || pg === "", `canonical tr/${pg}: ${can}`);
  await p.waitForTimeout(150);
  const txt = await p.evaluate(() => document.querySelector("main")?.innerText || document.body.innerText);
  const hits = (txt.match(DUTCH) || []).length;
  if (hits > 8 && !/privacy|voorwaarden/.test(pg)) leftovers.push(`tr/${pg}: ${hits} Nederlandse functiewoorden`);
}
ok(`${pages.length} Turkse pagina's: lang=tr, hreflang, canonical`);
if (leftovers.length) { console.log("LET OP resterend Nederlands:\n  " + leftovers.join("\n  ")); }
// schakelaar behoudt de pagina
for (const pg of ["", "schuttingen/", "contact/", "hogedrukreiniging/", "schutting-ontwerpen/"]) {
  await p.goto(BASE + pg); await Promise.all([p.waitForURL((u) => u.pathname.endsWith("/tr/" + pg) || u.pathname.endsWith("/tr/" + pg + "index.html")), p.locator(".lang-switch").first().click()]);
  assert.equal(await p.getAttribute("html", "lang"), "tr");
  await Promise.all([p.waitForURL((u) => !/\/tr\//.test(u.pathname)), p.locator(".lang-switch").first().click()]);
  assert.ok(new URL(p.url()).pathname.replace(/index\.html$/, "").endsWith("/" + pg) || pg === "", "terug naar NL behoudt pagina " + pg);
}
ok("taalschakelaar NL↔TR behoudt de huidige pagina");
// interne links op TR kernpagina's
const seen = new Set();
for (const pg of ["", "schuttingen/", "contact/", "projecten/"]) {
  await p.goto(BASE + "tr/" + pg);
  for (const h of await p.$$eval("a[href]", (a) => a.map((x) => x.getAttribute("href")))) {
    if (/^(mailto:|tel:|https?:|javascript:|#)/.test(h)) continue;
    const u = new URL(h, p.url()); u.hash = ""; u.search = ""; if (seen.has(u.href)) continue; seen.add(u.href);
    assert.equal((await p.request.get(u.href)).status(), 200, `dode link ${h} op tr/${pg}`);
  }
}
ok(`TR-links: ${seen.size} doelen bereikbaar`);
// 3D-ontwerper in het Turks
await p.goto(BASE + "tr/schutting-ontwerpen/"); await p.evaluate(() => localStorage.clear()); await p.reload();
await p.waitForTimeout(1500);
const body = await p.evaluate(() => document.body.innerText);
assert.ok(/Çit|çit|Malzeme|malzeme/.test(body), "ontwerper niet vertaald");
const dutchLeft = (body.match(DUTCH) || []).length; console.log("   ontwerper Nederlandse functiewoorden:", dutchLeft);
ok("3D-ontwerper laadt op /tr/");
// contactformulier TR
await p.goto(BASE + "tr/contact/");
const labels = await p.$$eval("label", (l) => l.map((x) => x.innerText.trim()).filter(Boolean));
console.log("   formulierlabels:", labels.slice(0, 6).join(" | "));
assert.deepEqual(errors, [], "console/paginafouten: " + errors.join("\n"));
ok("geen console- of paginafouten");
console.log("taal: OK");
await b.close();
