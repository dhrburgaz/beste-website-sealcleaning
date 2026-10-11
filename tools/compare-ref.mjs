/* Visuele vergelijking: referentie (crop uit docs/design-ref) naast onze pagina + 50%-overlay van het bovenste deel.
   LS="sleutel=json" zet eerst een localStorage-waarde (bijv. een stap in de ontwerper). Gebruik: PLAYWRIGHT=… CHROMIUM=… node tools/compare-ref.mjs <naam> <ref.png> <x,y,w,h> <url> <uitmap> [viewportbreedte=1440] */
import { readFileSync, writeFileSync } from "node:fs";
const pw = await import(process.env.PLAYWRIGHT || "playwright"); const chromium = pw.chromium || pw.default.chromium;
const [, , name, refPath, crop, url, outDir, vw = "1440"] = process.argv;
const [cx, cy, cw, ch] = crop.split(",").map(Number);
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined, args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pg = await (await b.newContext({ viewport: { width: +vw, height: 900 } })).newPage();
if (process.env.LS) { const [k, v] = process.env.LS.split(/=(.*)/s); await pg.addInitScript(([k, v]) => localStorage.setItem(k, v), [k, v]); }
await pg.goto(url); await pg.waitForTimeout(800);
await pg.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 70)); } scrollTo(0, 0); });
await pg.waitForTimeout(1500);
const ours = await pg.screenshot({ fullPage: true }); writeFileSync(`${outDir}/${name}-${vw}-ours.png`, ours);
const W = 560, ref = readFileSync(refPath).toString("base64"), o = ours.toString("base64");
const out = await pg.evaluate(async ({ ref, o, cx, cy, cw, ch, W }) => {
  const load = (s) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = "data:image/png;base64," + s; });
  const [ri, oi] = [await load(ref), await load(o)];
  const rh = Math.round(ch * W / cw), oh = Math.round(oi.height * W / oi.width), H = Math.max(rh, oh) + 40, topH = Math.min(rh, oh);
  const c = document.createElement("canvas"); c.width = W * 3 + 40; c.height = H; const x = c.getContext("2d");
  x.fillStyle = "#222"; x.fillRect(0, 0, c.width, H); x.fillStyle = "#fff"; x.font = "16px sans-serif";
  x.fillText("Referentie", 10, 24); x.fillText("Website", W + 20, 24); x.fillText("Overlay 50% (bovenste deel)", 2 * W + 30, 24);
  x.drawImage(ri, cx, cy, cw, ch, 0, 40, W, rh); x.drawImage(oi, 0, 0, oi.width, oi.height, W + 20, 40, W, oh);
  x.drawImage(ri, cx, cy, cw, ch * topH / rh, 2 * W + 40, 40, W, topH); x.globalAlpha = .5;
  x.drawImage(oi, 0, 0, oi.width, oi.height * topH / oh, 2 * W + 40, 40, W, topH);
  return c.toDataURL("image/png").split(",")[1];
}, { ref, o, cx, cy, cw, ch, W });
writeFileSync(`${outDir}/${name}-${vw}-vergelijking.png`, Buffer.from(out, "base64"));
await b.close(); console.log("ok", name, vw);
