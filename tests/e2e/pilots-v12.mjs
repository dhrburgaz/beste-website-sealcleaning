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
  assert.equal((await pg.locator("h1").innerText()).trim(), "Groenonderhoud en tuinaanleg in Dordrecht");
  const text = await pg.locator("main").innerText();
  assert.doesNotMatch(text, FAKE, "geen verzonnen claims"); assert.doesNotMatch(text, /Elephant|€\s?\d|uurtarief|marktbenchmark|gratis/i, "geen prijzen of onbevestigde claims op home");
  assert.equal(await pg.locator(".v-project").count(), 3);
  assert.doesNotMatch(text, /afrekenen|in winkelmand|Technische melding/i, "geen checkout- of technische taal");
  const imgs = await pg.evaluate(() => [...document.images].filter((i) => !i.alt && !i.closest("[aria-hidden]")).length); assert.equal(imgs, 0, "alle afbeeldingen hebben alt");
  const over = await pg.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); assert.ok(over <= 1, `overflow ${over}px bij ${w}`);
  assert.deepEqual(errs, [], `fouten bij ${w}: ${errs}`);
  await ctx.close(); out.push(`homepage ${w}px: wie/wat/waar, echte projecten, geen verzonnen claims of prijzen, geen overflow`);
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
