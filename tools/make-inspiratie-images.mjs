/* Verwerkt de aangeleverde inspiratiefoto's tot images/inspiratie/<naam>.{jpg,webp} + -640/-960 webp (Chromium-canvas).
   Gebruik: PLAYWRIGHT=… node tools/make-inspiratie-images.mjs <bronmap>   (bestanden staan in MAP-volgorde hieronder) */
import { readFileSync, writeFileSync } from "node:fs";
const pw = await import(process.env.PLAYWRIGHT || "playwright"); const chromium = pw.chromium || pw.default.chromium;
const SRC = process.argv[2], OUT = new URL("../images/inspiratie/", import.meta.url).pathname;
const MAP = JSON.parse(readFileSync(new URL("./inspiratie-map.json", import.meta.url)));
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const pg = await b.newPage(); await pg.goto("about:blank");
for (const [file, name] of Object.entries(MAP)) {
  const b64 = readFileSync(`${SRC}/${file}`).toString("base64");
  const r = await pg.evaluate(async ({ b64 }) => {
    const img = new Image(); img.src = "data:image/png;base64," + b64; await img.decode();
    const enc = async (w, type, q) => { const c = document.createElement("canvas"); c.width = Math.min(w, img.naturalWidth); c.height = Math.round(img.naturalHeight * c.width / img.naturalWidth);
      const x = c.getContext("2d"); x.imageSmoothingQuality = "high"; x.drawImage(img, 0, 0, c.width, c.height);
      const blob = await new Promise((s) => c.toBlob(s, type, q)); const u = new Uint8Array(await blob.arrayBuffer()); let s = ""; for (let i = 0; i < u.length; i += 8192) s += String.fromCharCode(...u.subarray(i, i + 8192)); return [btoa(s), c.width, c.height]; };
    return { jpg: await enc(1448, "image/jpeg", 0.82), w1: await enc(1448, "image/webp", 0.78), w960: await enc(960, "image/webp", 0.78), w640: await enc(640, "image/webp", 0.78), dim: [img.naturalWidth, img.naturalHeight] };
  }, { b64 });
  writeFileSync(`${OUT}${name}.jpg`, Buffer.from(r.jpg[0], "base64")); writeFileSync(`${OUT}${name}.webp`, Buffer.from(r.w1[0], "base64"));
  writeFileSync(`${OUT}${name}-960.webp`, Buffer.from(r.w960[0], "base64")); writeFileSync(`${OUT}${name}-640.webp`, Buffer.from(r.w640[0], "base64"));
  console.log(name, r.dim.join("x"));
}
await b.close();
