/* Meetbare UX-checks per pagina op mobiel (390 px): tikdoelen < 44 px (exclusief inline tekstlinks in lopende tekst),
   afbeeldingen zonder width/height, horizontale overflow, formuliervelden zonder autocomplete/label.
   Gebruik: PLAYWRIGHT=… CHROMIUM=… BASE=http://127.0.0.1:8941 node tools/ux-metrics.mjs */
import { readFileSync } from "node:fs";
const { chromium } = await import(process.env.PLAYWRIGHT || "playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8941";
const pages = ["/", ...readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8").match(/<loc>[^<]+<\/loc>/g).map((l) => new URL(l.slice(5, -6)).pathname).filter((p) => p !== "/")];
const W = Number(process.env.WIDTH || 390);
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const pg = await (await b.newContext({ viewport: { width: W, height: 844 } })).newPage();
const totals = { small: 0, noDim: 0, overflow: 0, fields: 0 };
const detail = {};
for (const p of pages) {
  await pg.goto(BASE + p, { waitUntil: "load" });
  const r = await pg.evaluate((W) => {
    const vis = (e) => { const s = getComputedStyle(e); const r = e.getBoundingClientRect(); return s.visibility !== "hidden" && s.display !== "none" && r.width > 0 && r.height > 0; };
    const inline = (a) => a.tagName === "A" && getComputedStyle(a).display === "inline" && /^(P|LI|TD|DD|SPAN|SMALL|LABEL)$/.test(a.parentElement.tagName) && a.parentElement.innerText.trim().length > a.innerText.trim().length + 20;
    const small = [...document.querySelectorAll("a[href],button,input:not([type=hidden]),select,summary,[role=button]")].filter((e) => vis(e) && !inline(e) && !e.closest("[aria-hidden=true]") && !e.closest(".configurator-canvas,svg")).filter((e) => { const r = e.getBoundingClientRect(); const t = ["checkbox", "radio"].includes(e.type) ? e.closest("label") || e : e; const rr = t.getBoundingClientRect(); return Math.min(rr.width, rr.height) < 44 && Math.min(r.width, r.height) < 44; }).map((e) => `${e.tagName.toLowerCase()}${e.className ? "." + String(e.className).split(" ")[0] : ""}:"${(e.innerText || e.getAttribute("aria-label") || e.name || "").trim().slice(0, 24)}"`);
    const noDim = [...document.images].filter((i) => !i.getAttribute("width") || !i.getAttribute("height")).map((i) => i.getAttribute("src"));
    const fields = [...document.querySelectorAll("input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=file]),select,textarea")].filter((e) => !e.labels?.length && !e.getAttribute("aria-label")).length;
    return { small, noDim, overflow: document.documentElement.scrollWidth > W, fields };
  }, W);
  totals.small += r.small.length; totals.noDim += r.noDim.length; totals.overflow += r.overflow ? 1 : 0; totals.fields += r.fields;
  detail[p] = r;
}
await b.close();
const freq = {};
for (const r of Object.values(detail)) for (const s of r.small) freq[s] = (freq[s] || 0) + 1;
console.log(JSON.stringify({ pages: pages.length, totals, topSmall: Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 25), noDimPages: Object.entries(detail).filter(([, r]) => r.noDim.length).map(([p, r]) => [p, r.noDim.length]), overflow: Object.entries(detail).filter(([, r]) => r.overflow).map(([p]) => p) }, null, 1));
