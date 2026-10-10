/* Maakt kleinere WebP-varianten (-640, -960) van images/projects/*.webp met Chromium (canvas), alleen waar het origineel breder is.
   Gebruik: PLAYWRIGHT=… CHROMIUM=… node tools/make-responsive-images.mjs   (idempotent) */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
const { chromium } = await import(process.env.PLAYWRIGHT || "playwright");
const DIR = new URL("../images/projects/", import.meta.url).pathname;
const WIDTHS = [640, 960];
const files = readdirSync(DIR).filter((f) => /^[a-z0-9-]+\.webp$/.test(f) && !/-(640|960)\.webp$/.test(f));
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const pg = await b.newPage();
await pg.goto("about:blank");
let made = 0;
for (const f of files) {
  const todo = WIDTHS.filter((w) => !existsSync(DIR + f.replace(".webp", `-${w}.webp`)));
  if (!todo.length) continue;
  const b64 = readFileSync(DIR + f).toString("base64");
  const out = await pg.evaluate(async ({ b64, todo }) => {
    const img = new Image(); img.src = "data:image/webp;base64," + b64; await img.decode();
    const res = {};
    for (const w of todo) {
      if (img.naturalWidth <= w * 1.05) { res[w] = null; continue; } // te smal: variant = origineel (zo bestaat elke variant)
      const c = document.createElement("canvas"); c.width = w; c.height = Math.round((img.naturalHeight * w) / img.naturalWidth);
      const x = c.getContext("2d"); x.imageSmoothingQuality = "high"; x.drawImage(img, 0, 0, c.width, c.height);
      const blob = await new Promise((r) => c.toBlob(r, "image/webp", 0.8));
      const buf = new Uint8Array(await blob.arrayBuffer()); let s = "";
      for (let i = 0; i < buf.length; i += 8192) s += String.fromCharCode(...buf.subarray(i, i + 8192));
      res[w] = btoa(s);
    }
    return res;
  }, { b64, todo });
  for (const [w, data] of Object.entries(out)) { writeFileSync(DIR + f.replace(".webp", `-${w}.webp`), data === null ? readFileSync(DIR + f) : Buffer.from(data, "base64")); made++; }
}
await b.close();
console.log(made, "varianten gemaakt");
