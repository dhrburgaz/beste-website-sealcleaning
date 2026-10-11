/* E2E v12-pilots: homepage (V13: referentievolgorde, geen webshop), deeplinks naar de beginnersroute.
   Gebruik: PLAYWRIGHT=… CHROMIUM=… BASE=http://127.0.0.1:8941/ node tests/e2e/pilots-v12.mjs */
import assert from "node:assert/strict";
const { chromium } = await import(process.env.PLAYWRIGHT || "playwright");
const BASE = (process.env.BASE || "http://127.0.0.1:8941/").replace(/\/?$/, "/");
const GL = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"];
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: GL });
const out = [];
const FAKE = /\b500\+|4[.,]9\s*\/\s*5|10\+?\s*jaar garantie|100%\s*(tevreden|klantentevredenheid)|sterren|beoordeling/i;

for (const [w, h] of [[1440, 900], [390, 844], [320, 700]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const pg = await ctx.newPage(); const errs = [];
  pg.on("pageerror", (e) => errs.push(e.message)); pg.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await pg.goto(BASE);
  const order = await pg.evaluate(() => ({ seq: [...document.querySelectorAll("main > section, main > div")].map((e) => e.className.split(" ")[0] + (e.id ? "#" + e.id : "")), h1: document.querySelector("h1").textContent.trim() }));
  assert.deepEqual(order.seq.slice(0, 4), ["v-hero", "v-usp", "v-section#diensten", "v-section"], "volgorde: hero, voordelenbalk, diensten, 3D"); assert.equal(order.h1, "Jouw droomtuin, ons vakwerk");
  await pg.locator("#titel-3d").scrollIntoViewIfNeeded(); await pg.waitForSelector("[data-home-3d] canvas", { timeout: 15000 });
  assert.match(await pg.locator("[data-home-3d-status]").innerText(), /Voorbeeld in 3D, geen echt project/);
  const text = await pg.locator("main").innerText();
  assert.doesNotMatch(text, FAKE, "geen verzonnen claims"); assert.doesNotMatch(text, /Elephant|€\s?\d/, "geen productprijzen op home");
  assert.equal(await pg.locator("#diensten .v-cards li").count(), 7); assert.equal(await pg.locator(".v-project").count(), 3);
  assert.doesNotMatch(text, /winkelmand|webshop|online bestellen|afrekenen/i, "geen webshop-taal");
  const imgs = await pg.evaluate(() => [...document.images].filter((i) => !i.alt && !i.closest("[aria-hidden]")).length); assert.equal(imgs, 0, "alle afbeeldingen hebben alt");
  const over = await pg.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); assert.ok(over <= 1, `overflow ${over}px bij ${w}`);
  assert.deepEqual(errs, [], `fouten bij ${w}: ${errs}`);
  await ctx.close(); out.push(`homepage ${w}px: hero→3D, 7 diensten, echte projecten, geen verzonnen claims, geen overflow`);
}

/* homepage zonder WebGL: 2D-voorbeeld */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const pg = await ctx.newPage();
  await pg.addInitScript(() => { const o = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { return /webgl/.test(t) ? null : o.call(this, t, ...a); }; });
  await pg.goto(BASE); await pg.locator("#titel-3d").scrollIntoViewIfNeeded();
  await pg.waitForFunction(() => { const s = document.querySelector("[data-home-3d-flat]"); return s && !s.hidden && s.getAttribute("viewBox") && s.querySelectorAll("*").length > 8; }, null, { timeout: 10000 });
  assert.match(await pg.locator("[data-home-3d-status]").innerText(), /2D/);
  await ctx.close(); out.push("homepage zonder WebGL: 2D-voorbeeld met eerlijke melding");
}

/* deeplinks naar de ontwerper */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const pg = await ctx.newPage();
  await pg.goto(BASE + "schutting-ontwerpen/?materiaal=hout"); await pg.evaluate(() => localStorage.clear()); await pg.goto(BASE + "schutting-ontwerpen/?materiaal=hout");
  assert.match(await pg.locator(".b-title").innerText(), /Hoe loopt de schutting/);
  await pg.evaluate(() => localStorage.clear()); await pg.goto(BASE + "schutting-ontwerpen/?doel=herstel");
  assert.match(await pg.locator(".b-title").innerText(), /Wat is er stuk/);
  await ctx.close(); out.push("deeplinks: ?materiaal=hout en ?doel=herstel");
}

await browser.close();
console.log(out.map((r) => "ok  " + r).join("\n")); console.log("pilots-v12: OK");
