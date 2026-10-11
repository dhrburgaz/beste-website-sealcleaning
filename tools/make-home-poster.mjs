/* Maakt images/home-3d-poster.jpg uit de echte 3D-scène (zelfde voorbeeldtuin), zodat de homepage vóór het laden van three.js al het 3D-beeld toont.
   Gebruik: PLAYWRIGHT=… CHROMIUM=… BASE=http://127.0.0.1:8941/ node tools/make-home-poster.mjs */
const pw = await import(process.env.PLAYWRIGHT || "playwright"); const chromium = pw.chromium || pw.default.chromium;
const b = await chromium.launch({ executablePath: process.env.CHROMIUM, args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const pg = await (await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.4 })).newPage();
await pg.addInitScript(() => { try { sessionStorage.setItem("seal-poster", "1"); } catch (e) {} });
await pg.goto((process.env.BASE || "http://127.0.0.1:8941/")); await pg.locator("#titel-3d").scrollIntoViewIfNeeded();
await pg.waitForSelector("[data-home-3d].is-3d", { timeout: 20000 }); await pg.waitForTimeout(2500);
await pg.evaluate(() => { const p = document.querySelector(".v-3d-poster"); if (p) p.style.display = "none"; });
const out = new URL("../images/home-3d-poster.jpg", import.meta.url).pathname;
await pg.locator("[data-home-3d]").screenshot({ path: out, type: "jpeg", quality: 82 }); await b.close(); console.log("poster", out);
