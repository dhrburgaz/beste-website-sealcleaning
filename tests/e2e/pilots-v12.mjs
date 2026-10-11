/* E2E v12-pilots: homepage (3D direct onder de hero), productpagina (V12-03/05/08), deeplinks naar de beginnersroute.
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
  // volgorde: hero, direct daarna 3D
  const order = await pg.evaluate(() => { const hero = document.querySelector(".v-hero"); return { next: hero.nextElementSibling && hero.nextElementSibling.id, h1: document.querySelector("h1").textContent.trim() }; });
  assert.equal(order.next, "ontwerp3d", "3D-sectie direct onder de hero"); assert.equal(order.h1, "Jouw droomtuin, ons vakwerk");
  await pg.locator("#ontwerp3d").scrollIntoViewIfNeeded(); await pg.waitForSelector("[data-home-3d] canvas", { timeout: 15000 });
  assert.match(await pg.locator("[data-home-3d-status]").innerText(), /Voorbeeld in 3D, geen echt project/);
  const text = await pg.locator("main").innerText();
  assert.doesNotMatch(text, FAKE, "geen verzonnen claims"); assert.doesNotMatch(text, /Elephant|€\s?\d/, "geen productprijzen op home");
  assert.equal(await pg.locator(".v-cards li").count(), 6); assert.ok(await pg.locator(".v-project").count() >= 3);
  assert.match(text, /Alleen materiaal bestellen of ook laten plaatsen/); assert.match(text, /Online bestellen is nog niet geopend/);
  const imgs = await pg.evaluate(() => [...document.images].filter((i) => !i.alt && !i.closest("[aria-hidden]")).length); assert.equal(imgs, 0, "alle afbeeldingen hebben alt");
  const over = await pg.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); assert.ok(over <= 1, `overflow ${over}px bij ${w}`);
  assert.deepEqual(errs, [], `fouten bij ${w}: ${errs}`);
  await ctx.close(); out.push(`homepage ${w}px: hero→3D, 6 keuzes, echte projecten, geen verzonnen claims, geen overflow`);
}

/* homepage zonder WebGL: 2D-voorbeeld */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const pg = await ctx.newPage();
  await pg.addInitScript(() => { const o = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { return /webgl/.test(t) ? null : o.call(this, t, ...a); }; });
  await pg.goto(BASE); await pg.locator("#ontwerp3d").scrollIntoViewIfNeeded();
  await pg.waitForFunction(() => { const s = document.querySelector("[data-home-3d-flat]"); return s && !s.hidden && s.getAttribute("viewBox") && s.querySelectorAll("*").length > 8; }, null, { timeout: 10000 });
  assert.match(await pg.locator("[data-home-3d-status]").innerText(), /2D/);
  await ctx.close(); out.push("homepage zonder WebGL: 2D-voorbeeld met eerlijke melding");
}

/* productpagina */
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const pg = await ctx.newPage(); const errs = [];
  pg.on("pageerror", (e) => errs.push(e.message));
  await pg.goto(BASE + "materialen/elephant-finch-grenen-scherm/");
  assert.equal(await pg.locator(".p-slot").count(), 3, "drie fotoplekken voor voorzijde, achterzijde en detail");
  const slots = await pg.locator(".p-slots").innerText(); assert.match(slots, /toestemming/); assert.match(slots, /Voorzijde/); assert.match(slots, /Achterzijde/); assert.match(slots, /Detail/);
  assert.match(await pg.locator(".p-main figcaption").innerText(), /niet het exacte artikel/);
  const t = await pg.locator("main").innerText(); assert.doesNotMatch(t, FAKE); assert.doesNotMatch(t, /€\s?\d/, "geen verzonnen prijs"); assert.match(t, /007237/); assert.match(t, /Alleen materiaal aanvragen/); assert.match(t, /Inclusief montage aanvragen/); assert.match(t, /Hulp bij kiezen/);
  assert.doesNotMatch(await pg.locator(".p-actions").innerHTML(), /checkout|winkelmandje|in winkelmand/i);
  // V12-05: eerlijke uitslag, geen opslag, geen blokkade
  const before = await pg.evaluate(() => Object.keys(localStorage).length + Object.keys(sessionStorage).length + document.cookie.length);
  assert.equal(await pg.locator("[data-check-result]").isHidden(), true);
  const radio = async (n, v) => { const l = pg.locator(`input[name=${n}][value=${v}]`); await l.evaluate((e) => e.scrollIntoView({ block: "center", behavior: "instant" })); await l.check({ force: true }); };
  await radio("grond", "tegels"); assert.match(await pg.locator("[data-check-result]").innerText(), /Extra controle nodig/);
  await radio("grond", "gras"); await radio("hoogte", "precies"); await radio("doel", "achtertuin"); await radio("zelf", "nee");
  const good = await pg.locator("[data-check-result]").innerText(); assert.match(good, /Past mogelijk/); assert.doesNotMatch(good, /geschikt|gegarandeerd|zeker/i);
  await radio("hoogte", "hoger"); assert.match(await pg.locator("[data-check-result]").innerText(), /180 cm hoog/);
  await radio("grond", "weet-niet"); await radio("hoogte", "weet-niet"); assert.match(await pg.locator("[data-check-result]").innerText(), /eerst advies/);
  const after = await pg.evaluate(() => Object.keys(localStorage).length + Object.keys(sessionStorage).length + document.cookie.length); assert.equal(after, before, "check slaat niets op");
  const over = await pg.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); assert.ok(over <= 1);
  assert.deepEqual(errs, []); await ctx.close(); out.push(`productpagina ${w}px: eerlijke fotoplekken, geen prijs, geschiktheidscheck zonder opslag`);
}

/* deeplinks vanaf productpagina */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const pg = await ctx.newPage();
  await pg.goto(BASE + "schutting-ontwerpen/?materiaal=hout"); await pg.evaluate(() => localStorage.clear()); await pg.goto(BASE + "schutting-ontwerpen/?materiaal=hout");
  assert.match(await pg.locator(".b-title").innerText(), /Hoe loopt de schutting/);
  await pg.evaluate(() => localStorage.clear()); await pg.goto(BASE + "schutting-ontwerpen/?doel=herstel");
  assert.match(await pg.locator(".b-title").innerText(), /Wat is er stuk/);
  await pg.evaluate(() => localStorage.clear()); await pg.goto(BASE + "contact/?materiaal=" + encodeURIComponent("Elephant Finch grenen scherm 180 × 180 cm (artikelnummer 007237)"));
  assert.match(await pg.locator("#omschrijving").inputValue(), /Elephant Finch/);
  await ctx.close(); out.push("deeplinks: ?materiaal=hout, ?doel=herstel en contactvoorinvulling");
}

await browser.close();
console.log(out.map((r) => "ok  " + r).join("\n")); console.log("pilots-v12: OK");
