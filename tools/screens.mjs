/* Maakt auditscreenshots van kernpagina's. Gebruik:
   PLAYWRIGHT=… CHROMIUM=… BASE=http://127.0.0.1:8941 OUT=map node tools/screens.mjs [label] */
const { chromium } = await import(process.env.PLAYWRIGHT || "playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8941";
const OUT = process.env.OUT || "screens";
const label = process.argv[2] || "now";
const pages = (process.env.PAGES || "/,/schuttingen/,/bestrating/,/projecten/,/projecten/tuin-aan-het-water-compleet/,/prijzen/,/project-samenstellen/,/contact/,/over-ons/,/inspiratie/").split(",");
const widths = (process.env.WIDTHS || "390,1440").split(",").map(Number);
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
for (const w of widths) {
  const ctx = await b.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const pg = await ctx.newPage();
  for (const p of pages) {
    await pg.goto(BASE + p, { waitUntil: "networkidle" }).catch(() => {});
    for (const f of (process.env.CSS || "").split(",").filter(Boolean)) await pg.addStyleTag({ path: f });
    await pg.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-visible")));
    await pg.evaluate(async () => { document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager")); for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } window.scrollTo(0, 0); });
    await pg.waitForLoadState("networkidle").catch(() => {});
    await pg.evaluate(() => document.fonts.ready);
    await pg.waitForTimeout(300);
    const name = `${label}-${w}-${p.replace(/\//g, "_").replace(/^_|_$/g, "") || "home"}`;
    await pg.screenshot({ path: `${OUT}/${name}.jpg`, type: "jpeg", quality: 60, fullPage: process.env.FULL !== "0" });
    if (process.env.SEG) {
      const H = await pg.evaluate(() => document.documentElement.scrollHeight);
      const vh = pg.viewportSize().height * Number(process.env.SEG);
      for (let y = 0, i = 0; y < H; y += vh, i++) await pg.screenshot({ path: `${OUT}/${name}-s${i}.jpg`, type: "jpeg", quality: 60, fullPage: true, clip: { x: 0, y, width: w, height: Math.min(vh, H - y) } });
    }
    if (process.env.FOLD) await pg.screenshot({ path: `${OUT}/${name}-fold.jpg`, type: "jpeg", quality: 70 });
  }
  await ctx.close();
}
await b.close();
console.log("klaar");
