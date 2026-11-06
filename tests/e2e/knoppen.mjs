/* E2E knoppen- en linkinventaris (V13): elke interactieve actie op de kernpagina's moet het bedoelde resultaat geven.
   Gebruik: PLAYWRIGHT=… CHROMIUM=… BASE=http://127.0.0.1:8941/ node tests/e2e/knoppen.mjs
   Past voor een preview-host: BASE=<host>/ en FLAT=1 (links eindigen dan op index.html). */
import assert from "node:assert/strict";
const pw = await import(process.env.PLAYWRIGHT || "playwright"); const chromium = pw.chromium || pw.default.chromium;
const BASE = (process.env.BASE || "http://127.0.0.1:8941/").replace(/\/?$/, "/");
const FLAT = process.env.FLAT === "1", IDX = FLAT ? "index.html" : "";
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const results = []; const ok = (n) => { results.push(n); console.log("ok ", n); };
const errors = [];
async function page(w = 1440, h = 900) { const ctx = await b.newContext({ viewport: { width: w, height: h } }); const p = await ctx.newPage(); p.on('pageerror', (e) => errors.push(e.message)); p.on('response', (r) => { if (r.status() >= 400 && !/favicon/.test(r.url())) errors.push(r.status() + ' ' + r.url()); }); return p; }
const path = (p) => new URL(p.url()).pathname.replace(/index\.html$/, '');
const base = new URL(BASE).pathname;
async function clickGo(p, loc, expectRel) { await Promise.all([p.waitForURL((u) => u.pathname.replace(/index\.html$/, '') === base + expectRel.replace(/^\//, '')), loc.first().click()]); }
const p = await page();

// 1. alle interne links op de kernpagina's bestaan
const CORE = ["", "diensten-overzicht-niet-aanwezig", "schuttingen/", "plantenbakken/", "schutting-ontwerpen/", "projecten/", "contact/", "over-ons/", "prijzen/", "werkwijze/"].filter((c) => !c.includes("niet-aanwezig"));
const seen = new Set();
for (const c of CORE) {
  await p.goto(BASE + c + IDX);
  const hrefs = await p.$$eval("a[href]", (as) => as.map((a) => ({ h: a.getAttribute("href"), t: a.textContent.trim().slice(0, 40), data: Object.keys(a.dataset).join(",") })));
  for (const { h, t, data } of hrefs) {
    if (h === "#") { assert.ok(data, `lege link '#' zonder data-actie op /${c}: "${t}"`); continue; }
    if (/^(mailto:|tel:|https?:|javascript:|#)/.test(h)) continue;
    const u = new URL(h, p.url()); u.hash = ""; u.search = "";
    if (seen.has(u.href)) continue; seen.add(u.href);
    const r = await p.request.get(u.href); assert.equal(r.status(), 200, `link stuk: ${h} op /${c} (${r.status()})`);
  }
}
ok(`links op ${CORE.length} kernpagina's: ${seen.size} unieke interne doelen bereikbaar`);

// 2. logo + hoofdnavigatie
await p.goto(BASE + "schuttingen/" + IDX);
await clickGo(p, p.locator(".brand"), ""); ok("logo -> homepage");
for (const [label, expect] of [["Projecten", "projecten/"], ["Prijzen en offertes", "prijzen/"]]) {
  await p.goto(BASE + IDX); await clickGo(p, p.locator(`.nav-list > li > a:text-is("${label}")`), expect);
}
await p.goto(BASE + IDX); await p.hover(".has-submenu > a"); await clickGo(p, p.locator('.submenu a:text-is("Plantenbakken")'), "plantenbakken/");
await p.goto(BASE + IDX); await clickGo(p, p.locator(".header-cta .btn-primary"), "contact/");
ok("hoofdmenu: Projecten, Prijzen en offertes, Diensten > Plantenbakken, Offerte aanvragen");

// 3. homepage
await p.goto(BASE + IDX); await clickGo(p, p.locator(".v-hero .btn-primary"), "contact/");
await p.goto(BASE + IDX); const pc = await p.locator(".v-project").count(); assert.ok(pc >= 1 && pc <= 3, "projectkaarten: " + pc);
for (let i = 0; i < pc; i++) { await p.goto(BASE + IDX); await p.locator(".v-project").nth(i).click(); await p.waitForLoadState(); assert.ok(/projecten\//.test(p.url())); assert.ok(await p.locator("h1").count()); }
ok(`homepage: hero-knop en ${pc} projectkaarten werken`);
await p.goto(BASE + IDX);
for (const sel of ["[data-tel]", "[data-whatsapp]"]) { const h = await p.locator(sel).first().getAttribute("href"); assert.ok(/^(tel:|https:\/\/wa\.me)/.test(h), sel + " href " + h); }
ok("telefoon- en WhatsApp-link hebben een geldige bestemming");

// 4. 3D-ontwerper start en geeft geen technische melding
await p.goto(BASE + "schutting-ontwerpen/" + IDX); await p.evaluate(() => localStorage.clear()); await p.reload();
await p.waitForSelector("label[for=doel-nieuw]");
assert.ok(!/Technische melding|beheerder/i.test(await p.locator("main").innerText()), "technische tekst zichtbaar");
ok("ontwerper: start zonder technische melding");

// 5. contactformulier
await p.goto(BASE + "contact/" + IDX);
const form = p.locator("[data-contact-form]"); assert.ok(await form.count(), "contactformulier ontbreekt");
await form.locator("button[type=submit]").click();
assert.ok(await p.locator("[data-contact-form] :invalid, [data-contact-form] [aria-invalid=true], [data-contact-form] .field-error").count(), "geen foutmelding bij leeg formulier");
ok("contactformulier: leeg versturen geeft een foutmelding");

// 6. mobiel menu (390 en 320)
for (const w of [390, 320]) {
  const m = await page(w, 800); await m.goto(BASE + IDX);
  const t = m.locator(".nav-toggle"); await t.click(); assert.equal(await t.getAttribute("aria-expanded"), "true");
  await m.locator('.has-submenu > a:text-is("Diensten")').click(); assert.ok(await m.locator('.submenu a:text-is("Schuttingen")').isVisible(), "submenu Diensten");
  await Promise.all([m.waitForURL(/schuttingen/), m.locator('.submenu a:text-is("Schuttingen")').click()]);
  assert.equal(await m.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0, `overflow ${w}`);
  await m.context().close();
}
ok("mobiel (390 en 320): menu opent, navigeert, geen horizontale scroll");

assert.deepEqual(errors, [], "onverklaarde consolefouten: " + errors.join(" | "));
ok("geen onverklaarde console- of paginafouten"); await b.close(); console.log(`knoppen: OK (${results.length} groepen)`);
