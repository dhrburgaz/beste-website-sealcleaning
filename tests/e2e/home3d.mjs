/* E2E premium homepage: avondhero, 3D-tuin direct zichtbaar en bedienbaar (desktop + mobiel), 2D-terugval, posterbestand, impressiebeelden.
   Gebruik: PLAYWRIGHT=… BASE=http://127.0.0.1:8941/ node tests/e2e/home3d.mjs */
import assert from "node:assert/strict";
const pw = await import(process.env.PLAYWRIGHT || "playwright"); const chromium = pw.chromium || pw.default.chromium;
const BASE = (process.env.BASE || "http://127.0.0.1:8941/").replace(/\/?$/, "/");
const GL = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"];
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: GL });
const out = []; const ok = (m) => { out.push(m); console.log("ok ", m); };
const canvasHash = async (pg) => { const buf = await pg.locator("[data-home-3d]").screenshot(); return (await import("node:crypto")).createHash("md5").update(buf).digest("hex"); };
for (const [lang, path] of [["nl", ""], ["tr", "tr/"]]) for (const [w, h] of [[1440, 900], [1280, 800], [390, 844], [375, 812], [320, 700]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500 }); const pg = await ctx.newPage(); const errs = [];
  pg.on("pageerror", (e) => errs.push(e.message)); pg.on("console", (m) => m.type() === "error" && errs.push(m.text())); pg.on("response", (r) => r.status() >= 400 && errs.push(r.status() + " " + r.url()));
  await pg.goto(BASE + path); await pg.waitForFunction(() => document.querySelector("[data-home-3d].is-3d"), null, { timeout: 25000 });
  // 3D zichtbaar in het eerste scherm
  const box = await pg.locator("[data-home-3d]").boundingBox(); assert.ok(box.y < h * 0.9 && box.y + Math.min(box.height, 200) < h + 1, `3D niet in eerste scherm bij ${w}px (y=${box.y})`);
  assert.ok(box.width > 250, "3D-vlak te smal");
  // hero-afbeelding geladen
  assert.ok(await pg.evaluate(() => { const i = document.querySelector(".v-hero-media img"); return i.complete && i.naturalWidth > 300; }), "heldenbeeld niet geladen");
  // poster-bestand bestaat
  assert.equal((await pg.request.get(BASE + "images/home-3d-poster.jpg")).status(), 200);
  if (w === 1440 || w === 390) {
    const h0 = await canvasHash(pg); assert.ok(h0, "geen canvas");
    for (const sel of ['[data-3d-mat="composiet"]', '[data-3d-mat="lamellen"]', '[data-3d-mood="evening"]', "[data-3d-top]", "[data-3d-iso]", "[data-3d-reset]"]) {
      const before = await canvasHash(pg); await pg.locator(sel).scrollIntoViewIfNeeded(); await pg.locator(sel).click(); await pg.waitForTimeout(900);
      const after = await canvasHash(pg);
      if (!sel.includes("reset")) assert.notEqual(after, before, `knop ${sel} verandert het 3D-beeld niet`);
    }
    assert.equal(await pg.locator('[data-3d-mood="evening"]').getAttribute("aria-pressed"), "true");
    ok(`${lang} ${w}px: 3D-knoppen (materiaal, dag/avond, camera) veranderen het beeld`);
  }
  assert.equal(await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0, `overflow ${lang} ${w}`);
  assert.deepEqual(errs, [], `fouten ${lang} ${w}: ${errs}`);
  await ctx.close(); ok(`${lang} ${w}px: hero + 3D in eerste scherm, geen fouten/overflow`);
}
// zonder WebGL: 2D-terugval
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } }); const pg = await ctx.newPage();
  await pg.addInitScript(() => { const o = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { return /webgl/.test(t) ? null : o.call(this, t, ...a); }; });
  await pg.goto(BASE); await pg.waitForFunction(() => { const s = document.querySelector("[data-home-3d-flat]"); return s && !s.hidden && s.querySelectorAll("*").length > 8; }, null, { timeout: 20000 });
  assert.match(await pg.locator("[data-home-3d-status]").innerText(), /2D/);
  await ctx.close(); ok("zonder WebGL: 2D-terugval met melding");
}
// impressiebeelden: gelabeld en geladen op dienstpagina's
for (const u of ["schuttingen/", "bestrating/", "tuinaanleg/", "tuinrenovatie/", "tuinonderhoud/", "hogedrukreiniging/", "kunstgras/", "plantenbakken/", "materialen/"]) {
  const pg = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await pg.goto(BASE + u); await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } }); await pg.waitForTimeout(300);
  assert.ok(await pg.locator(".v-hero--photo .v-hero-media img").count(), `${u} heeft geen fotohero`);
  assert.equal(await pg.evaluate(() => [...document.images].filter((i) => i.complete && !i.naturalWidth).length), 0, `kapotte afbeelding ${u}`);
  if (!u.startsWith("hogedruk")) assert.ok(await pg.locator(".i-tag, .i-caption").count() > 0, `impressie-label ontbreekt ${u}`);
  await pg.close();
}
ok("fotohero's en impressiebeelden geladen en gelabeld op 9 pagina's");
await b.close(); console.log("home3d: OK");
