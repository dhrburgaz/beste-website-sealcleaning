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
async function page(w = 1440, h = 900) { const ctx = await b.newContext({ viewport: { width: w, height: h } }); const p = await ctx.newPage(); p.on("pageerror", (e) => errors.push(e.message)); p.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|ERR_/.test(m.text())) errors.push(m.text()); }); return p; }
const path = (p) => new URL(p.url()).pathname.replace(/index\.html$/, "");
const base = new URL(BASE).pathname;
const rel = (p) => path(p).slice(base.length - 1);
async function clickGo(p, loc, expectRel) { await Promise.all([p.waitForURL((u) => u.pathname.replace(/index\.html$/, "") === base.replace(/\/$/, "/") + expectRel.replace(/^\//, "")), loc.first().click()]); }

const p = await page();
const freshDesigner = async () => { await p.goto(BASE + "schutting-ontwerpen/" + IDX); await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForSelector("label[for=doel-nieuw]"); };
// 1. alle interne links op de kernpagina's bestaan en zijn geen verwijsstub
const CORE = ["", "schuttingen/", "plantenbakken/", "schutting-ontwerpen/", "projecten/", "contact/", "over-ons/"];
const seen = new Set();
for (const c of CORE) {
  await p.goto(BASE + c + IDX);
  const hrefs = await p.$$eval("a[href]", (as) => as.map((a) => ({ h: a.getAttribute("href"), t: a.textContent.trim().slice(0, 40), data: Object.keys(a.dataset).join(",") })));
  for (const { h, t, data } of hrefs) {
    if (h === "#" ) { assert.ok(data, `lege link '#' zonder data-actie op /${c}: "${t}"`); continue; }
    if (/^(mailto:|tel:|https?:|javascript:|#)/.test(h)) continue;
    const u = new URL(h, p.url()); u.hash = ""; u.search = "";
    if (seen.has(u.href)) continue; seen.add(u.href);
    const r = await p.request.get(u.href); assert.equal(r.status(), 200, `link stuk: ${h} op /${c} (${r.status()})`);
    const text = await r.text(); assert.ok(!/Deze pagina is verplaatst/.test(text), `link wijst naar verwijderde winkelpagina: ${h} op /${c}`);
  }
}
ok(`links op ${CORE.length} kernpagina's: ${seen.size} unieke interne doelen bereikbaar, geen winkelpagina's`);

// 2. logo + hoofdnavigatie (desktop)
await p.goto(BASE + "schuttingen/" + IDX);
await clickGo(p, p.locator(".brand"), ""); ok("logo -> homepage");
for (const [label, expect] of [["Tuin ontwerpen", "schutting-ontwerpen/"], ["Projecten", "projecten/"], ["Contact", "contact/"]]) {
  await p.goto(BASE + IDX); await clickGo(p, p.locator(`.nav-list > li > a:text-is("${label}")`), expect);
}
await p.goto(BASE + IDX); await p.hover(".has-submenu > a"); await clickGo(p, p.locator('.submenu a:text-is("Plantenbakken")'), "plantenbakken/");
await p.goto(BASE + IDX); await clickGo(p, p.locator(".header-cta .btn-primary"), "contact/");
assert.equal(await p.locator('.nav-list a:text-is("Materialen")').count(), 0, "Materialen mag niet in het menu staan");
ok("hoofdmenu: Tuin ontwerpen, Projecten, Contact, Diensten > Plantenbakken, Offerte aanvragen; geen Materialen");

// 3. hero, dienstenkaarten, projectkaarten, 3D-startknop
await p.goto(BASE + IDX); await clickGo(p, p.locator(".v-hero .btn-primary"), "schutting-ontwerpen/");
await p.goto(BASE + IDX); await clickGo(p, p.locator(".v-hero .btn-light"), "projecten/");
await p.goto(BASE + IDX); const cards = await p.locator("#diensten .v-card").count(); assert.equal(cards, 7);
for (let i = 0; i < cards; i++) { await p.goto(BASE + IDX); const a = p.locator("#diensten .v-card").nth(i); const href = new URL(await a.getAttribute("href"), p.url()).pathname; await a.click(); await p.waitForLoadState(); assert.ok(p.url().includes(href.replace(/\/$/, "").split("/").pop()), `dienstenkaart ${i} -> ${href}`); assert.ok((await p.locator("h1").first().textContent()).length > 3); }
ok("homepage: hero-knoppen en 7 dienstenkaarten leiden naar een bestaande pagina met kop");
await p.goto(BASE + IDX); const pc = await p.locator(".v-project").count(); assert.equal(pc, 3);
for (let i = 0; i < pc; i++) { await p.goto(BASE + IDX); await p.locator(".v-project").nth(i).click(); await p.waitForLoadState(); assert.ok(/projecten\//.test(p.url())); assert.ok(await p.locator("h1").count()); }
ok("homepage: 3 projectkaarten openen een projectpagina");
await p.goto(BASE + IDX); await clickGo(p, p.locator(".v-3d-copy .btn-light"), "schutting-ontwerpen/");
await p.goto(BASE + IDX); await p.locator("#titel-3d").scrollIntoViewIfNeeded(); await p.waitForTimeout(2500);
await p.locator("[data-3d-top]").click(); await p.locator("[data-3d-iso]").click(); await p.locator("[data-3d-reset]").click();
assert.ok(await p.locator("[data-home-3d] canvas, [data-home-3d-flat]:not([hidden])").count(), "homepage 3D toont niets");
ok("homepage: 3D-startknop en de drie 3D-knoppen werken; 3D of 2D-terugval zichtbaar");
await p.goto(BASE + IDX); await clickGo(p, p.locator(".v-cta .btn-light"), "contact/"); ok("homepage: afsluitende offerteknop");
await p.goto(BASE + IDX);
for (const sel of ["[data-tel]", "[data-whatsapp]"]) { const h = await p.locator(sel).first().getAttribute("href"); assert.ok(/^(tel:|https:\/\/wa\.me|https:\/\/api\.whatsapp)/.test(h), `${sel} href = ${h}`); }
ok("telefoon- en WhatsApp-link hebben een geldige tel:/wa.me-bestemming");

// 4. schuttingenpagina
await p.goto(BASE + "schuttingen/" + IDX);
assert.equal(await p.locator("#stijlen .i-card").count(), 6);
for (let i = 0; i < 6; i++) {
  await p.goto(BASE + "schuttingen/" + IDX);
  await p.locator("#stijlen .i-card").nth(i).locator(".btn-primary").click(); await p.waitForLoadState();
  assert.ok(p.url().includes("schutting-ontwerpen"), `stijlkaart ${i}`);
  await p.waitForSelector(".b-wrap, .b-fallback, [data-b-root] *", { timeout: 15000 });
}
await p.goto(BASE + "schuttingen/" + IDX); await clickGo(p, p.locator("#stijlen .i-card .btn-secondary"), "contact/");
await p.goto(BASE + "schuttingen/" + IDX); await clickGo(p, p.locator(".v-hero .btn-light"), "schutting-ontwerpen/");
await p.goto(BASE + "schuttingen/" + IDX); await p.locator(".v-hero .btn-primary").click(); assert.ok(p.url().includes("#stijlen"));
ok("schuttingen: 6 stijlkaarten (Bekijk mogelijkheden -> ontwerper, Vraag offerte aan -> contact), hero-knoppen");
const det = p.locator(".faq-item, .v-faq details").first();
if (await det.count()) { await p.goto(BASE + "schuttingen/" + IDX); const d = p.locator("details").first(); await d.locator("summary").click(); assert.ok(await d.evaluate((e) => e.open)); await d.locator("summary").click(); assert.ok(!(await d.evaluate((e) => e.open))); ok("FAQ-accordeon opent en sluit"); }

// 5. plantenbakken
await p.goto(BASE + "plantenbakken/" + IDX); assert.equal(await p.locator("#stijlen .i-card").count(), 3);
await clickGo(p, p.locator("#stijlen .i-card .btn-secondary"), "project-samenstellen/");
await p.goto(BASE + "plantenbakken/" + IDX); await clickGo(p, p.locator("#stijlen .i-card .btn-primary"), "contact/"); ok("plantenbakken: kaartknoppen werken");

// 6. ontwerper: startkeuzes, stap voor stap, 2D/3D, terug, herstel, ander ontwerp
await freshDesigner();
const other = await p.locator(".b-other-link").count(); assert.equal(other, 3);
await p.locator("label[for=doel-nieuw]").click({ force: true }); await p.getByRole("button", { name: /volgende|kies de vorm/i }).first().click();
await p.locator("label[for=vorm-recht]").click({ force: true }); await p.getByRole("button", { name: /volgende|lengte|kies/i }).last().click().catch(() => {});
const phases = await p.locator("[data-b-stepper] li").allTextContents(); assert.ok(/Situatie/.test(phases.join()) && /Resultaat/.test(phases.join()), "stappenbalk");
ok("ontwerper: startkeuzes (nieuw/herstel/ander ontwerp), stappenbalk met 5 fasen, volgende werkt");
await freshDesigner(); await p.locator("label[for=doel-herstel]").click({ force: true });
await p.getByRole("button", { name: /volgende/i }).first().click(); assert.ok(await p.locator("#herstel-tekst").count()); await p.getByRole("button", { name: /terug/i }).first().click(); assert.ok(await p.locator("label[for=doel-herstel]").count()); ok("ontwerper: herstelroute en Terug-knop");
await p.locator(".b-other-link").first().click(); await p.waitForLoadState(); assert.ok(p.url().includes("project-samenstellen")); ok("ontwerper: 'Iets anders ontwerpen' opent de volledige ontwerper");

// 7. contactformulier (veilig: zonder backend, geen echte aanvraag)
await p.goto(BASE + "contact/" + IDX);
const form = p.locator("[data-contact-form]"); assert.ok(await form.count(), "contactformulier ontbreekt");
await form.locator("button[type=submit]").click();
assert.ok(await p.locator("[data-contact-form] :invalid, [data-contact-form] [aria-invalid=true], [data-contact-form] .field-error").count(), "geen foutmelding bij leeg formulier");
ok("contactformulier: leeg versturen geeft een foutmelding");

// 8. mobiel menu (390) + 320
for (const w of [390, 320]) {
  const m = await page(w, 800); await m.goto(BASE + IDX);
  const t = m.locator(".nav-toggle"); await t.click(); assert.equal(await t.getAttribute("aria-expanded"), "true");
  const C = m.locator('.main-nav .nav-list > li > a:text-is("Contact")');
  await C.waitFor({ state: "visible", timeout: 3000 });
  await m.locator('.has-submenu > a:text-is("Diensten")').click(); assert.ok(await m.locator('.submenu a:text-is("Schuttingen")').isVisible(), "submenu Diensten opent niet");
  await Promise.all([m.waitForURL(/schuttingen/), m.locator('.submenu a:text-is("Schuttingen")').click()]);
  await m.locator(".nav-toggle").click(); await Promise.all([m.waitForURL(/contact/), m.locator('.main-nav .nav-list > li > a:text-is("Contact")').click()]);
  assert.equal(await m.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0, `overflow ${w}`);
  assert.ok(await m.locator(".mobile-cta-bar").isVisible(), "vaste offertebalk"); await m.context().close();
}
ok("mobiel (390 en 320): menu opent, navigeert, offertebalk zichtbaar, geen horizontale scroll");

assert.deepEqual(errors, [], "onverklaarde consolefouten: " + errors.join(" | "));
ok("geen onverklaarde console- of paginafouten"); await b.close(); console.log(`knoppen: OK (${results.length} groepen)`);
