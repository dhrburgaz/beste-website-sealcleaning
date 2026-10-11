/* Combinatiebeeld per pilot: referentie (desktop-crop + optioneel mobiele crop) | website 1440 | website 390.
   Gebruik: node tools/compose-pilot.mjs <naam> <ref.png> <x,y,w,h> <ours1440.png> <ours390.png> <uit.png> [mobref.png x,y,w,h] */
import { readFileSync, writeFileSync } from "node:fs";
const pw = await import(process.env.PLAYWRIGHT || "playwright"); const chromium = pw.chromium || pw.default.chromium;
const [, , name, refP, crop, d1440, d390, out, mobP, mobCrop] = process.argv;
const b = await chromium.launch({ executablePath: process.env.CHROMIUM }); const pg = await b.newPage(); await pg.goto("about:blank");
const f = (p) => readFileSync(p).toString("base64");
const png = await pg.evaluate(async ({ ref, crop, a, m, mob, mobCrop, name }) => {
  const load = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = "data:image/png;base64," + s; });
  const [R, A, M] = [await load(ref), await load(a), await load(m)], MR = mob ? await load(mob) : null;
  const [cx, cy, cw, ch] = crop.split(",").map(Number), W = 520, MW = 230;
  const rh = Math.round(ch * W / cw), ah = Math.round(A.height * W / A.width), mh = Math.round(M.height * MW / M.width);
  let mrw = 0, mrh = 0, mc; if (MR) { mc = mobCrop.split(",").map(Number); mrw = MW; mrh = Math.round(mc[3] * MW / mc[2]); }
  const H = Math.max(rh, ah, mh, mrh) + 44, Wt = W * 2 + MW * (MR ? 2 : 1) + 70;
  const c = document.createElement("canvas"); c.width = Wt; c.height = H; const x = c.getContext("2d"); x.fillStyle = "#222"; x.fillRect(0, 0, Wt, H); x.fillStyle = "#fff"; x.font = "15px sans-serif";
  let px = 10; x.fillText("Referentie (desktop)", px, 24); x.drawImage(R, cx, cy, cw, ch, px, 36, W, rh); px += W + 15;
  x.fillText("Website 1440 px", px, 24); x.drawImage(A, 0, 0, A.width, A.height, px, 36, W, ah); px += W + 15;
  if (MR) { x.fillText("Referentie (mobiel)", px, 24); x.drawImage(MR, mc[0], mc[1], mc[2], mc[3], px, 36, MW, mrh); px += MW + 15; }
  x.fillText("Website 390 px", px, 24); x.drawImage(M, 0, 0, M.width, M.height, px, 36, MW, mh);
  return c.toDataURL("image/png").split(",")[1];
}, { ref: f(refP), crop, a: f(d1440), m: f(d390), mob: mobP ? f(mobP) : null, mobCrop, name });
writeFileSync(out, Buffer.from(png, "base64")); await b.close(); console.log("ok", out);
