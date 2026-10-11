/* Browsertest webwinkel: catalogus → mandje → kortingscode → gegevens → betalen (nagebootste Mollie) → status.
   Start zelf backend (tijdelijke database) en statische site.
   Gebruik: PLAYWRIGHT=… CHROMIUM=… node --disable-warning=ExperimentalWarning tests/e2e/webwinkel.mjs */
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, extname, normalize } from "node:path";
import { readFileSync, existsSync, statSync } from "node:fs";
import { createApp } from "../../server/src/app.js";
import { newId, now, setSetting } from "../../server/src/db.js";
const { chromium } = await import(process.env.PLAYWRIGHT || "playwright");

const ROOT = new URL("../..", import.meta.url).pathname;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const site = createServer((req, res) => {
  let p = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  let f = join(ROOT, p); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": MIME[extname(f)] || "application/octet-stream" }); res.end(readFileSync(f));
});
await new Promise((r) => site.listen(0, "127.0.0.1", r));
const SITE = `http://127.0.0.1:${site.address().port}`;

const payments = new Map(); let n = 0;
const fakeFetch = async (url, opts = {}) => {
  if (opts.method === "POST") { const b = JSON.parse(opts.body); const id = `tr_E2E${++n}`; payments.set(id, { id, status: "open", amount: b.amount, metadata: b.metadata }); return { ok: true, json: async () => ({ id, _links: { checkout: { href: `${SITE}/bestelling/__mollie/${id}` } } }) }; }
  return { ok: true, json: async () => ({ ...payments.get(url.split("/").pop()), paidAt: new Date().toISOString() }) };
};
const dir = mkdtempSync(join(tmpdir(), "seal-shop-e2e-"));
const { server, db, cfg } = createApp({ dataDir: dir, dbPath: join(dir, "s.sqlite"), filesDir: join(dir, "f"), backupDir: join(dir, "b"), cookieSecure: false, siteRoot: ROOT, siteOrigins: [SITE], publicBaseUrl: "http://localhost", mollieKey: "test_e2e", fetchImpl: fakeFetch });
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const API = `http://127.0.0.1:${server.address().port}`; cfg.publicBaseUrl = API;
setSetting(db, "features", { checkout_enabled: true, coupon_enabled: true, payments_enabled: true });
setSetting(db, "shopDelivery", { methods: [{ id: "afhalen", label: "Afhalen na afspraak", priceExclCents: 0, vatRate: 21, enabled: true }, { id: "bezorgen", label: "Bezorgen", priceExclCents: 2500, vatRate: 21, enabled: true }] });
const tegelId = newId("sp");
db.run("INSERT INTO shop_products (id, catalog_id, title, unit, category, price_excl, vat_rate, active, max_per_order, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)", tegelId, "product-excluton-keramisch-madrid-6060", "Keramische tuintegel Madrid 60×60", "stuks", "bestrating", 1000, 21, 1, 300, now(), now());
db.run("INSERT INTO promotions (id, code, type, value, scope, scope_ids_json, active, stackable, min_subtotal, max_discount, max_uses_total, max_uses_per_customer, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", newId("pr"), "WELCOME10", "percentage", 1000, "categories", '["bestrating"]', 1, 0, 5000, 10000, 5, 1, now());

const b = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const errs = [];
for (const w of [390, 1440]) {
  if (w === 1440) { db.run("DELETE FROM orders"); db.run("DELETE FROM promotion_uses"); }
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  await ctx.addInitScript((api) => { Object.defineProperty(window, "SEAL_CONFIG", { configurable: true, set(v) { v.apiBase = api; Object.defineProperty(window, "SEAL_CONFIG", { value: v, writable: true, configurable: true }); } }); }, API);
  const pg = await ctx.newPage();
  pg.on("pageerror", (e) => errs.push(`${w} ${e.message}`)); pg.on("console", (m) => m.type() === "error" && !/Failed to load resource/.test(m.text()) && errs.push(`${w} ${m.text()}`));
  await pg.goto(`${SITE}/materialen/?product=product-excluton-keramisch-madrid-6060`, { waitUntil: "networkidle" });
  await pg.getByRole("button", { name: "In winkelmandje" }).click();
  await pg.goto(`${SITE}/winkelmandje/`, { waitUntil: "networkidle" });
  assert.match(await pg.locator(".shop-line").first().textContent(), /Madrid/);
  await pg.fill(".qty input", "10"); await pg.locator(".qty input").dispatchEvent("change"); await pg.waitForTimeout(400);
  await pg.locator("details.shop-coupon summary").click();
  await pg.fill("#coupon", "bestaatniet"); await pg.getByRole("button", { name: "Toepassen" }).click(); await pg.waitForTimeout(400);
  assert.match(await pg.locator(".field-error").first().textContent(), /bestaat niet/);
  await pg.fill("#coupon", "welcome10"); await pg.getByRole("button", { name: "Toepassen" }).click(); await pg.waitForTimeout(500);
  assert.match(await pg.locator(".shop-discount").textContent(), /10% korting/);
  await pg.getByRole("button", { name: "Verder naar gegevens" }).click();
  await pg.getByRole("button", { name: "Verder naar controleren" }).click();
  assert.ok((await pg.locator(".field.error").count()) >= 2, "validatie toont fouten bij lege velden");
  await pg.fill("#name", "Jan Tuin"); await pg.fill("#email", "jan@example.test");
  await pg.getByLabel(/Bezorgen —/).check(); await pg.waitForTimeout(500);
  await pg.fill("#street", "Tuinstraat 1"); await pg.fill("#postal", "3311 AA"); await pg.fill("#city", "Dordrecht");
  await pg.getByRole("button", { name: "Verder naar controleren" }).click();
  assert.match(await pg.locator(".price-row--total").textContent(), /€\s?139,15/, "10×10,00 − 10% + 25,00 bezorgen = 115,00 excl → 139,15 incl");
  await pg.screenshot({ path: process.env.SHOTS ? `${process.env.SHOTS}/shop-${w}-review.jpg` : "/dev/null", type: "jpeg", quality: 60 }).catch(() => {});
  await pg.getByRole("button", { name: /Bestellen en betalen/ }).click();
  assert.match(await pg.locator(".field-error").textContent(), /voorwaarden/);
  await pg.locator("#terms").check();
  await pg.getByRole("button", { name: /Bestellen en betalen/ }).dblclick();
  await pg.waitForURL(/__mollie\/tr_E2E/, { timeout: 8000 }).catch(() => {});
  assert.equal(db.get("SELECT COUNT(*) n FROM orders").n, 1, "dubbelklik maakt één bestelling");
  const o = db.get("SELECT * FROM orders");
  assert.equal(o.status, "pending_payment");
  payments.get(o.provider_id).status = "paid";
  await fetch(`${API}/api/payments/mollie/webhook`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: `id=${o.provider_id}` });
  await ctx.close();
  const ctx2 = await b.newContext({ viewport: { width: w, height: 900 } });
  await ctx2.addInitScript((api) => { Object.defineProperty(window, "SEAL_CONFIG", { configurable: true, set(v) { v.apiBase = api; Object.defineProperty(window, "SEAL_CONFIG", { value: v, writable: true, configurable: true }); } }); }, API);
  const st = await ctx2.newPage();
  const token = "x"; // token is alleen bij de aanmaak bekend; controleer ook het afwijzen van een verkeerd token
  await st.goto(`${SITE}/bestelling/?ref=${o.ref}#t=${token}`, { waitUntil: "load" }); await st.waitForFunction(() => /niet gevonden|betaald/.test(document.querySelector("[data-order-status]").textContent), null, { timeout: 8000 });
  assert.match(await st.locator("[data-order-status]").textContent(), /niet gevonden/);
  await ctx2.close();
  console.log(w, "ok");
}
assert.deepEqual(errs, []);
await b.close(); server.close(); site.close(); rmSync(dir, { recursive: true, force: true });
console.log("webwinkel: OK");
