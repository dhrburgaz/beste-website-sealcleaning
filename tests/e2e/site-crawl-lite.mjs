/* Snelle crawl: alle index.html-pagina's (NL+TR) op 1280 en 390 px: status, consolefouten, kapotte afbeeldingen (na scrollen), overflow, interne links. */
import fs from "fs";
const { chromium } = await import(process.env.PLAYWRIGHT || "playwright");
const BASE = (process.env.BASE || "http://127.0.0.1:8941/").replace(/\/?$/, "/");
const ROOT = new URL("../../", import.meta.url).pathname;
const SKIP = ["vendor", "node_modules", ".git", "tests", "docs", "images", "server", "deploy", "tools", "archief", "_site", "beheer", "server-data"];
const walk = (d) => fs.readdirSync(ROOT + d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? (SKIP.includes(e.name) ? [] : walk(d + e.name + "/")) : e.name === "index.html" ? [d] : []);
const pages = walk("").concat(["404.html"]);
const b = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const rep = { status: [], console: [], images: [], overflow: [], links: new Set(), badLinks: [] };
for (const [w, h, m] of [[1280, 800, false], [390, 844, true]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: m, hasTouch: m }); const p = await ctx.newPage();
  const errs = []; p.on("pageerror", (e) => errs.push(String(e))); p.on("console", (x) => x.type() === "error" && errs.push(x.text())); p.on("response", (r) => { if (r.status() >= 400 && !/favicon/.test(r.url())) errs.push(r.status() + " " + r.url()); });
  for (const u of pages) {
    errs.length = 0;
    const r = await p.goto(BASE + u, { waitUntil: "load", timeout: 30000 }); if (u !== "404.html" && r.status() !== 200) rep.status.push(u);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); } scrollTo(0, 0); });
    await p.waitForTimeout(500);
    const bad = await p.evaluate(() => [...document.images].filter((i) => i.complete && !i.naturalWidth && i.src && !i.src.startsWith("data:")).map((i) => i.getAttribute("src")));
    if (bad.length) rep.images.push(`${u}: ${bad}`);
    const e2 = errs.filter((x) => !(u === "404.html" && /404/.test(x))); if (e2.length) rep.console.push(`${u} [${w}]: ${e2.slice(0, 2).join(" / ")}`);
    if (await p.evaluate(() => document.documentElement.scrollWidth - innerWidth) > 0) rep.overflow.push(`${u} [${w}]`);
    if (!m) for (const h2 of await p.$$eval("a[href]", (a) => a.map((x) => x.href).filter((x) => x.startsWith(location.origin)))) rep.links.add(h2.split("#")[0].split("?")[0]);
  }
  await ctx.close();
}
for (const l of rep.links) { const r = await fetch(l); if (r.status !== 200) rep.badLinks.push(`${l} ${r.status}`); }
console.log(JSON.stringify({ pages: pages.length, links: rep.links.size, status: rep.status, console: rep.console, images: rep.images, overflow: rep.overflow, badLinks: rep.badLinks }, null, 1));
await b.close();
