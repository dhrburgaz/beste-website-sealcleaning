/* E2E beginnersroute schutting (v12): scenario's uit docs/v12/acceptatie_v12.json (UX001-UX012).
   Gebruik: PLAYWRIGHT=/pad/playwright/index.mjs CHROMIUM=/pad/chromium BASE=http://127.0.0.1:8941/ node tests/e2e/beginner.mjs */
import assert from "node:assert/strict";
const { chromium } = await import(process.env.PLAYWRIGHT || "playwright");
const BASE = (process.env.BASE || "http://127.0.0.1:8941/").replace(/\/?$/, "/");
const URL_ = BASE + "schutting-ontwerpen/";
const GL = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"];
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: GL });
const results = [];
const ok = (name) => { results.push(name); };

async function open(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: opts.w || 1280, height: opts.h || 900 } });
  const pg = await ctx.newPage();
  const errs = [];
  pg.on("pageerror", (e) => errs.push(e.message));
  if (opts.noWebGL) await pg.addInitScript(() => { const o = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (t, ...a) { return /webgl/.test(t) ? null : o.call(this, t, ...a); }; });
  if (opts.apiBase) await pg.addInitScript((b) => { window.__apiBase = b; }, opts.apiBase);
  await pg.goto(URL_); await pg.evaluate(() => localStorage.clear()); await pg.reload();
  if (opts.apiBase) await pg.evaluate((b) => { window.SEAL_CONFIG = window.SEAL_CONFIG || {}; window.SEAL_CONFIG.apiBase = b; }, opts.apiBase);
  await pg.waitForSelector("[data-beginner][data-ready]");
  return { ctx, pg, errs };
}
const pick = async (pg, text) => { const l = pg.locator("label", { hasText: text }).first(); await l.evaluate((e) => e.scrollIntoView({ block: "center", behavior: "instant" })); await l.click({ force: true }); };
const next = (pg) => pg.locator(".b-nav .btn-primary").click();
const title = (pg) => pg.locator(".b-title").innerText();
const bodyText = (pg) => pg.locator("[data-beginner]").innerText();

/* UX001: rechte houten schutting 6 m, 180 cm */
{
  const { ctx, pg, errs } = await open();
  await pick(pg, "Een nieuwe schutting"); await next(pg);
  await pick(pg, "Hout"); await next(pg);
  await pick(pg, "Recht"); await next(pg);
  assert.match(await title(pg), /Hoe lang is de achterkant/i);
  await pick(pg, "Ik weet de maten"); await pg.fill("#len-0", "6");
  assert.match(await pg.locator(".b-echo").innerText(), /6 meter\./);
  await next(pg);
  assert.match(await title(pg), /Hoe hoog/);
  await pick(pg, "180 cm"); await next(pg);
  await pick(pg, "Nee"); await next(pg);
  await pick(pg, "Materialen én plaatsing"); await next(pg);
  assert.match(await title(pg), /Bekijk jouw idee/);
  const txt = await bodyText(pg);
  assert.match(txt, /6 m/); assert.match(txt, /180 cm/); assert.match(txt, /precies/);
  assert.ok(await pg.locator("[data-b-overlay] text").count() >= 2, "maatlabels in de 3D-weergave");
  assert.match(await pg.locator("[data-b-overlay]").innerHTML(), /Lengte: 6 m/);
  assert.match(txt, /Wordt berekend na controle/); assert.doesNotMatch(txt, /€\s?\d/, "geen verzonnen bedragen");
  assert.match(txt, /Echt voorbeeld/); assert.match(txt, /Voorbeeld in 3D/);
  assert.deepEqual(errs, []); await ctx.close(); ok("UX001 rechte schutting 6 m / 180 cm, maten in 3D, geen bedragen");
}

/* UX002: onbekende maten kunnen toch een aanvraag doen */
{
  const { ctx, pg } = await open();
  await pick(pg, "Een nieuwe schutting"); await next(pg); await pick(pg, "Composiet"); await next(pg); await pick(pg, "Weet ik niet"); await next(pg);
  await pick(pg, "Ik kan niet meten");
  assert.match(await bodyText(pg), /Geen probleem/);
  await next(pg); await next(pg); await pick(pg, "Weet ik nog niet"); await next(pg); await pick(pg, "Alleen de materialen"); await next(pg);
  const t = await bodyText(pg); assert.match(t, /onbekend/); assert.doesNotMatch(t, /€\s?\d/);
  await next(pg);
  const om = await pg.locator("#omschrijving").inputValue();
  assert.match(om, /lengte onbekend/); assert.match(om, /Maatstatus: onbekend/);
  assert.equal(await pg.locator("input[name=maatstatus]").inputValue(), "onbekend");
  await ctx.close(); ok("UX002 onbekende maten: aanvraag mogelijk, status onbekend");
}

/* UX003: L-vorm, twee zijden, geen X/Z in de beginnersroute */
{
  const { ctx, pg } = await open();
  await pick(pg, "Een nieuwe schutting"); await next(pg); await pick(pg, "Hout met beton"); await next(pg); await pick(pg, "Met een hoek"); await next(pg);
  assert.match(await title(pg), /achterkant/i); await pick(pg, "Ik weet de maten"); await pg.fill("#len-0", "8"); await next(pg);
  assert.match(await title(pg), /zijkant/i); await pick(pg, "Ik weet het ongeveer"); await pg.fill("#len-1", "4,5"); await next(pg);
  const all = await pg.locator("main").innerText();
  assert.doesNotMatch(all, /\b[XZ]\b|coördinaat|vertices|polygon|offset/i);
  assert.match(await pg.locator("[data-b-facts]").innerText(), /Achterkant: 8 m[\s\S]*Zijkant: 4,5 m \(geschat\)/);
  await ctx.close(); ok("UX003 L-vorm: twee zijden, geen X/Z of vaktermen");
}

/* Foute invoer (UX009 uit register): duidelijke melding, ruimte om te herstellen */
{
  const { ctx, pg } = await open();
  await pick(pg, "Een nieuwe schutting"); await next(pg); await pick(pg, "Hout"); await next(pg); await pick(pg, "Recht"); await next(pg);
  await pick(pg, "Ik weet de maten");
  for (const bad of ["abc", "0", "-3", "100", ""]) {
    await pg.fill("#len-0", bad);
    const disabled = await pg.locator(".b-nav .btn-primary").isDisabled();
    assert.ok(disabled, `volgende uit bij "${bad}"`);
    if (bad && bad !== "") assert.ok((await pg.locator(".b-echo").innerText()).length > 10, `melding bij "${bad}"`);
  }
  for (const good of ["6,5", "6.5"]) { await pg.fill("#len-0", good); assert.match(await pg.locator(".b-echo").innerText(), /6 meter en 50 centimeter/); assert.ok(await pg.locator(".b-nav .btn-primary").isEnabled()); }
  await ctx.close(); ok("foute invoer 'abc/0/-3/100/leeg' geblokkeerd met melding; 6,5 en 6.5 gelijk");
}

/* UX004: poort, te breed op korte zijde */
{
  const { ctx, pg } = await open();
  await pick(pg, "Een nieuwe schutting"); await next(pg); await pick(pg, "Hout"); await next(pg); await pick(pg, "Recht"); await next(pg);
  await pick(pg, "Ik weet de maten"); await pg.fill("#len-0", "1"); await next(pg); await next(pg);
  await pick(pg, "Ja"); await next(pg); await pick(pg, "120 cm");
  assert.match(await pg.locator(".b-echo.is-error").innerText(), /poort te breed/i);
  assert.ok(await pg.locator(".b-nav .btn-primary").isDisabled());
  await pick(pg, "80 cm");
  assert.equal(await pg.locator(".b-echo.is-error").count(), 0);
  await ctx.close(); ok("UX004 poort die niet past geeft oplossingsgerichte melding");
}

/* V12-01: repareren in plaats van vervangen */
{
  const { ctx, pg } = await open();
  await pick(pg, "Mijn schutting repareren"); await next(pg);
  assert.match(await title(pg), /Wat is er stuk/);
  await pick(pg, "Een paal staat scheef");
  assert.match(await bodyText(pg), /geen diagnose|eerst kijken/i);
  await next(pg);
  const om = await pg.locator("#omschrijving").inputValue();
  assert.match(om, /repareren/i); assert.match(om, /scheef/); assert.doesNotMatch(om, /nieuwe schutting/i);
  assert.equal(await pg.locator(".b-preview").isVisible(), false, "geen 3D bij reparatie");
  await ctx.close(); ok("V12-01 repareren: inspectie-/herstelvraag zonder nieuwe schutting");
}

/* UX008: geen WebGL -> 2D-terugval met dezelfde keuzes */
{
  const { ctx, pg, errs } = await open({ noWebGL: true });
  await pick(pg, "Een nieuwe schutting"); await next(pg); await pick(pg, "Hout"); await next(pg); await pick(pg, "Recht"); await next(pg);
  await pick(pg, "Ik weet de maten"); await pg.fill("#len-0", "6"); await next(pg);
  await pg.waitForSelector(".b-flat", { timeout: 8000 });
  assert.match(await pg.locator("[data-b-status]").innerText(), /werkt op dit apparaat niet/);
  await next(pg); await pick(pg, "Nee"); await next(pg); await pick(pg, "Alleen de materialen"); await next(pg); await next(pg);
  assert.match(await title(pg), /Vraag een voorstel/);
  assert.deepEqual(errs, []); await ctx.close(); ok("UX008 zonder WebGL: 2D-tekening en volledige route");
}

/* Persistentie + uitleg + toetsenbord */
{
  const { ctx, pg } = await open();
  await pick(pg, "Een nieuwe schutting"); await next(pg);
  await pg.locator("#materiaal-composiet").focus(); await pg.keyboard.press("Space");
  assert.ok(await pg.locator("#materiaal-composiet").isChecked(), "keuze met toetsenbord");
  await pg.locator(".b-info").click();
  const help = pg.locator(".b-help:not([hidden])");
  assert.equal(await help.count(), 1);
  const h = await help.innerText(); for (const k of ["Wat bedoelen we?", "Zo doe je dat", "Waarom vragen we dit?", "Voorbeeld", "Ik weet het niet"]) assert.ok(h.toLowerCase().includes(k.toLowerCase()), k);
  assert.equal(await pg.locator(".b-info").getAttribute("aria-expanded"), "true");
  await pg.reload(); await pg.waitForSelector("[data-beginner][data-ready]");
  assert.match(await pg.locator("[data-b-status]").innerText(), /terug/);
  assert.ok(await pg.locator("#materiaal-composiet").isChecked(), "keuze bewaard na verversen");
  await ctx.close(); ok("uitleg met 5 blokken, toetsenbord, keuzes bewaard na verversen");
}

/* Formulier: verzenden naar de API en netwerkfout (UX011) */
{
  const { ctx, pg } = await open({ apiBase: "https://api.example.test" });
  let posted = null;
  await pg.route("https://api.example.test/**", async (route) => {
    const req = route.request();
    if (req.method() === "OPTIONS") return route.fulfill({ status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "*" } });
    posted = req.postData() || "";
    return route.fulfill({ status: 201, headers: { "access-control-allow-origin": "*" }, contentType: "application/json", body: JSON.stringify({ ref: "A-TEST-0001" }) });
  });
  await pick(pg, "Een nieuwe schutting"); await next(pg); await pick(pg, "Hout met beton"); await next(pg); await pick(pg, "Recht"); await next(pg);
  await pick(pg, "Ik weet het ongeveer"); await pg.fill("#len-0", "7"); await next(pg); await next(pg); await pick(pg, "Nee"); await next(pg);
  await pick(pg, "Materialen én plaatsing"); await next(pg); await next(pg);
  await pg.fill("#naam", "Test Persoon"); await pg.fill("#telefoon", "0612345678"); await pg.fill("#email", "t@example.test"); await pg.fill("#postcode", "3312 KP"); await pg.fill("#woonplaats", "Dordrecht");
  await pg.selectOption("#contactvoorkeur", "WhatsApp"); await pg.locator("#privacy").check();
  await pg.locator("form.b-form button[type=submit]").click();
  await pg.waitForFunction(() => /A-TEST-0001/.test(document.querySelector("[data-form-status]").textContent), null, { timeout: 8000 });
  assert.ok(posted.includes("contactvoorkeur") && posted.includes("WhatsApp"));
  assert.ok(posted.includes("maatstatus") && posted.includes("ongeveer"));
  assert.ok(/#ontwerp=[A-Za-z0-9_-]+/.test(decodeURIComponent(posted)) || /ontwerp/.test(posted), "ontwerp meegestuurd");
  assert.ok(posted.includes("kind") && posted.includes("configurator"));
  await ctx.close(); ok("aanvraag: contactvoorkeur, maatstatus, ontwerp en referentie");
}
{
  const { ctx, pg } = await open({ apiBase: "https://api.example.test" });
  await pg.route("https://api.example.test/**", (route) => route.abort("failed"));
  await pick(pg, "Mijn schutting repareren"); await next(pg); await next(pg);
  await pg.fill("#naam", "Test"); await pg.fill("#telefoon", "0612345678"); await pg.fill("#email", "t@example.test"); await pg.fill("#postcode", "3312KP"); await pg.fill("#woonplaats", "Dordrecht"); await pg.locator("#privacy").check();
  await pg.locator("form.b-form button[type=submit]").click();
  await pg.waitForSelector("[data-mailto-fallback]:not([hidden])", { timeout: 8000 });
  const status = await pg.locator("[data-form-status]").innerText();
  assert.doesNotMatch(status, /Bedankt|ontvangen/i, "geen succesmelding bij netwerkfout");
  assert.equal(await pg.locator("#naam").inputValue(), "Test", "invoer behouden");
  await ctx.close(); ok("UX011 netwerkfout: invoer behouden, terugvalroute, geen onterechte succestekst");
}

/* UX012: geen horizontale overflow op 320 px bij elke stap */
{
  const { ctx, pg } = await open({ w: 320, h: 700 });
  const over = async (n) => { const d = await pg.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); assert.ok(d <= 1, `overflow ${d}px bij ${n}`); };
  await over("doel"); await pick(pg, "Een nieuwe schutting"); await next(pg); await over("materiaal");
  await pick(pg, "Hout"); await next(pg); await over("vorm"); await pick(pg, "Langs drie kanten"); await next(pg);
  for (let i = 0; i < 3; i++) { await over("lengte" + i); await pick(pg, "Ik weet het ongeveer"); await pg.fill(`#len-${i}`, "5"); await next(pg); }
  await over("hoogte"); await next(pg); await over("poort"); await pick(pg, "Ja"); await next(pg); await over("poortdetails"); await next(pg);
  await over("werk"); await pick(pg, "Materialen én plaatsing"); await pick(pg, "weghalen"); await over("werk-extra"); await next(pg);
  await over("bekijk"); await next(pg); await over("aanvraag");
  await ctx.close(); ok("UX012 320 px: geen horizontale scroll bij alle stappen");
}

await browser.close();
console.log(results.map((r) => "ok  " + r).join("\n"));
console.log("beginner: OK");
