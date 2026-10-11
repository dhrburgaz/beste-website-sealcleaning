/* E2E: wijzigingen in type, lengte en hoogte via de snelle invoerbalk zijn zichtbaar in de 3D (beeld verandert, maatlabels kloppen)
   en komen terug in de aanvraagtekst. Gebruik: PLAYWRIGHT=… CHROMIUM=… BASE=… node tests/e2e/ontwerper-sync.mjs */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
const pw = await import(process.env.PLAYWRIGHT || "playwright"); const chromium = pw.chromium || pw.default.chromium;
const BASE = (process.env.BASE || "http://127.0.0.1:8941/").replace(/\/?$/, "/");
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const pg = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage(); const errs = [];
pg.on("pageerror", (e) => errs.push(e.message));
await pg.addInitScript(() => { if (!localStorage.getItem("sealBeginnerSchuttingV12")) localStorage.setItem("sealBeginnerSchuttingV12", JSON.stringify({ doel: "nieuw", step: "lengte:0", vorm: "recht", lengtes: { 0: { mode: "precies", text: "6" } }, materiaal: "hout", hoogteCm: 180 })); });
await pg.goto(BASE + "schutting-ontwerpen/"); await pg.waitForSelector("#q-type"); await pg.waitForTimeout(2500);
const shot = async () => { await pg.waitForTimeout(900); return createHash("sha1").update(await pg.locator(".b-preview-stage").screenshot()).digest("hex"); };
const labels = () => pg.locator("[data-b-overlay]").innerText().catch(() => "");
const h0 = await shot();
await pg.selectOption("#q-type", "composiet"); const h1 = await shot(); assert.notEqual(h0, h1, "3D verandert niet bij ander type");
await pg.selectOption("#q-hoogte", "200"); const h2 = await shot(); assert.notEqual(h1, h2, "3D verandert niet bij andere hoogte");
await pg.fill("#q-len-0", "10"); await pg.locator("#q-len-0").blur(); const h3 = await shot(); assert.notEqual(h2, h3, "3D verandert niet bij andere lengte");
const txt = await pg.locator(".b-preview").innerText(); assert.match(txt, /Lengte: 10 m/); assert.match(txt, /Hoogte: 200 cm/);
await pg.selectOption("#q-type", "hout-beton"); const h4 = await shot(); assert.notEqual(h3, h4, "3D verandert niet naar hout met beton");
await pg.fill("#q-len-0", "abc"); await pg.locator("#q-len-0").blur(); assert.equal(await pg.locator("#q-len-0").getAttribute("aria-invalid"), "true", "ongeldige lengte niet gemeld");
assert.match(await pg.locator(".b-preview").innerText(), /Lengte: 10 m/, "ongeldige invoer mag de maat niet breken");
await pg.selectOption("#q-type", "composiet");
// aanvraag
await pg.evaluate(() => { const k = "sealBeginnerSchuttingV12", s = JSON.parse(localStorage.getItem(k)); s.step = "aanvraag"; s.poort = "nee"; s.werk = "met-montage"; localStorage.setItem(k, JSON.stringify(s)); });
await pg.reload(); await pg.waitForSelector("#omschrijving");
const om = await pg.locator("#omschrijving").inputValue();
assert.match(om, /Composiet/); assert.match(om, /200 cm/); assert.match(om, /10 m/); assert.match(om, /plaatsing door SEAL/i);
assert.doesNotMatch(om, /€|euro/i, "geen prijs in de aanvraag");
assert.deepEqual(errs, [], errs.join("|"));
console.log("ok  type, lengte en hoogte via snelle balk: 3D verandert, maatlabels kloppen, ongeldige invoer wordt gemeld, aanvraagtekst volgt");
await b.close(); console.log("ontwerper-sync: OK");
