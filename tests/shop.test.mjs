import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "../server/src/app.js";
import { createUser, totpAt } from "../server/src/auth.js";
import { resetRateLimits } from "../server/src/http.js";

const ROOT = new URL("..", import.meta.url).pathname;
const SITE = "https://sealcleaning.nl";
let app, base, dir, staff;
const mollie = { payments: new Map(), n: 0, fail: false };
const fakeFetch = async (url, opts = {}) => {
  if (opts.method === "POST") {
    if (mollie.fail) return { ok: false, status: 500, json: async () => ({}) };
    const body = JSON.parse(opts.body);
    const id = `tr_SHOP${++mollie.n}`;
    mollie.payments.set(id, { id, status: "open", amount: body.amount, metadata: body.metadata });
    return { ok: true, json: async () => ({ id, _links: { checkout: { href: `https://www.mollie.com/checkout/${id}` } } }) };
  }
  const id = url.split("/").pop();
  return { ok: true, json: async () => ({ ...mollie.payments.get(id), paidAt: "2026-10-10T12:00:00Z" }) };
};

function client() {
  let cookie = "";
  return async (method, path, body, headers = {}) => {
    const h = { "X-SEAL-CSRF": "1", ...headers };
    if (cookie) h.Cookie = cookie;
    if (body !== undefined) h["Content-Type"] = "application/json";
    const r = await fetch(base + path, { method, headers: h, body: body !== undefined ? JSON.stringify(body) : undefined });
    const sc = r.headers.get("set-cookie"); if (sc) cookie = sc.split(";")[0];
    const t = await r.text(); let j; try { j = JSON.parse(t); } catch { j = t; }
    return { status: r.status, body: j };
  };
}
const pub = async (method, path, body, headers = {}) => {
  const r = await fetch(base + path, { method, headers: { Origin: SITE, ...(body ? { "Content-Type": "application/json" } : {}), ...headers }, body: body ? JSON.stringify(body) : undefined });
  const t = await r.text(); let j; try { j = JSON.parse(t); } catch { j = t; }
  return { status: r.status, body: j, cors: r.headers.get("access-control-allow-origin") };
};
const webhook = (id) => fetch(base + "/api/payments/mollie/webhook", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: `id=${id}` });
const customer = { name: "Jan Tuin", email: "jan@example.test", phone: "0612345678", street: "Tuinstraat 1", postal: "3311 AA", city: "Dordrecht" };

before(async () => {
  dir = mkdtempSync(join(tmpdir(), "seal-shop-"));
  app = createApp({ dataDir: dir, dbPath: join(dir, "seal.sqlite"), filesDir: join(dir, "files"), backupDir: join(dir, "bk"), cookieSecure: false, requireTotp: true,
    siteRoot: ROOT, publicBaseUrl: "http://localhost", siteOrigins: [SITE], fetchImpl: fakeFetch });
  await new Promise((r) => app.server.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${app.server.address().port}`;
  createUser(app.db, { email: "eigenaar@example.test", name: "Eigenaar", password: "een-lang-wachtwoord-1", role: "owner" });
  staff = client();
  await staff("POST", "/api/auth/login", { email: "eigenaar@example.test", password: "een-lang-wachtwoord-1" });
  const s = await staff("POST", "/api/auth/totp/setup", {});
  await staff("POST", "/api/auth/totp/verify", { code: totpAt(s.body.secret, Date.now()) });
});
after(() => { app.server.close(); app.db.close(); rmSync(dir, { recursive: true, force: true }); });

test("standaard dicht: geen producten, geen prijs, geen bestelling", async () => {
  let r = await pub("GET", "/api/public/shop/config");
  assert.equal(r.status, 200); assert.equal(r.body.checkoutOpen, false); assert.equal(r.cors, SITE);
  assert.ok(r.body.reasons.some((x) => /nog niet geopend/.test(x)));
  r = await pub("GET", "/api/public/shop/products"); assert.deepEqual(r.body.products, []);
  r = await pub("POST", "/api/public/shop/price", { lines: [] }); assert.equal(r.status, 503);
  r = await pub("POST", "/api/public/shop/orders", { lines: [] }, { "Idempotency-Key": "k".repeat(20) }); assert.equal(r.status, 503);
});

test("beheer: alleen met sessie; producten, bezorging, promotie, flags", async () => {
  assert.equal((await client()("GET", "/api/admin/shop")).status, 401);
  let r = await staff("POST", "/api/admin/shop/products", { title: "Tegel 60×60 grijs", unit: "stuks", category: "bestrating", priceExclCents: 1000, vatRate: 21, active: true, maxPerOrder: 300 });
  assert.equal(r.status, 201);
  await staff("POST", "/api/admin/shop/products", { title: "Straatzand 25 kg", unit: "zakken", category: "ondergrond", priceExclCents: 400, vatRate: 21, active: true });
  assert.equal((await staff("POST", "/api/admin/shop/products", { title: "x", unit: "st", priceExclCents: -5, vatRate: 21 })).status, 400);
  r = await staff("PUT", "/api/admin/shop/delivery", { methods: [{ id: "afhalen", priceExclCents: 0, enabled: true }, { id: "bezorgen", priceExclCents: 2500, enabled: true }] });
  assert.equal(r.status, 200);
  r = await staff("POST", "/api/admin/shop/promotions", { code: "welcome10", type: "percentage", value: 1000, scope: "categories", scopeIds: ["bestrating"], active: true, minSubtotalCents: 5000, maxDiscountCents: 10000, maxUsesTotal: 1, maxUsesPerCustomer: 1 });
  assert.equal(r.status, 201);
  r = await staff("POST", "/api/admin/shop/promotions", { code: "OUD", type: "fixed", value: 500, scope: "order", active: true, endsAt: "2026-01-01T00:00" });
  assert.equal(r.status, 201);
  // Alleen checkout aan: betalen nog niet operationeel → bestellen blijft dicht.
  await staff("PUT", "/api/admin/shop/features", { checkout_enabled: true, coupon_enabled: true });
  r = await pub("GET", "/api/public/shop/config");
  assert.equal(r.body.checkoutOpen, false); assert.ok(r.body.reasons.some((x) => /betalen/.test(x)));
  r = await staff("PUT", "/api/admin/shop/features", { payments_enabled: true });
  assert.equal(r.body.payments_enabled, true);
});

test("prijzen en codes server-side; client-prijs genegeerd", async () => {
  app.cfg.mollieKey = "test_shop";
  const products = (await pub("GET", "/api/public/shop/products")).body.products;
  const tegel = products.find((p) => p.title.startsWith("Tegel")), zand = products.find((p) => p.title.startsWith("Straatzand"));
  assert.equal(tegel.fromExclCents, null, "geen van-prijs zonder 30-dagenhistorie");
  let r = await pub("POST", "/api/public/shop/price", { lines: [{ productId: tegel.id, qty: 10, priceExclCents: 1 }, { productId: zand.id, qty: 5 }], codes: ["WELCOME10", "OUD"], delivery: "bezorgen" });
  assert.equal(r.body.subtotalExclCents, 12000, "prijs uit de database, niet uit het verzoek");
  assert.equal(r.body.applied.length, 0); assert.match(r.body.rejected[0].reason, /niet met elkaar te combineren/);
  r = await pub("POST", "/api/public/shop/price", { lines: [{ productId: tegel.id, qty: 10 }, { productId: zand.id, qty: 5 }], codes: ["welcome10"], delivery: "bezorgen" });
  assert.equal(r.body.discountExclCents, 1000);
  assert.equal(r.body.shipping.exclCents, 2500);
  assert.equal(r.body.totalInclCents, Math.round((12000 - 1000 + 2500) * 1.21));
  r = await pub("POST", "/api/public/shop/price", { lines: [{ productId: tegel.id, qty: 10 }], codes: ["OUD"] });
  assert.match(r.body.rejected[0].reason, /verlopen/);
  r = await pub("POST", "/api/public/shop/price", { lines: [{ productId: tegel.id, qty: 10 }], codes: ["ONBEKEND"] });
  assert.match(r.body.rejected[0].reason, /bestaat niet/);
});

test("bestellen: voorwaarden verplicht, idempotent, race op laatste code, webhook betaald pas na verificatie", async () => {
  resetRateLimits();
  const products = (await pub("GET", "/api/public/shop/products")).body.products;
  const tegel = products.find((p) => p.title.startsWith("Tegel"));
  const order = (key, extra = {}) => pub("POST", "/api/public/shop/orders", { lines: [{ productId: tegel.id, qty: 10 }], codes: ["WELCOME10"], delivery: "bezorgen", customer, agreeTerms: true, ...extra }, { "Idempotency-Key": key });
  let r = await order("key-no-terms-000001", { agreeTerms: false });
  assert.equal(r.status, 400); assert.match(r.body.error, /voorwaarden/);
  r = await order("key-bad-address-0001", { customer: { ...customer, postal: "123" } });
  assert.equal(r.status, 400);
  // Twee gelijktijdige bestellingen op een code met maximaal 1 gebruik.
  const [a, b] = await Promise.all([order("key-race-a-00000001", { customer: { ...customer, email: "a@example.test" } }), order("key-race-b-00000001", { customer: { ...customer, email: "b@example.test" } })]);
  const ok = [a, b].filter((x) => x.status === 201), no = [a, b].filter((x) => x.status === 409);
  assert.equal(ok.length, 1, "precies één bestelling krijgt de laatste code"); assert.equal(no.length, 1);
  assert.match(ok[0].body.checkoutUrl, /mollie\.com\/checkout/);
  // Dubbel klikken: zelfde sleutel → zelfde bestelling, geen tweede betaling.
  const again = await order(ok[0] === a ? "key-race-a-00000001" : "key-race-b-00000001");
  assert.equal(again.body.duplicate, true); assert.equal(again.body.ref, ok[0].body.ref);
  assert.equal(app.db.get("SELECT COUNT(*) n FROM orders WHERE status = 'pending_payment'").n, 1);
  const o = app.db.get("SELECT * FROM orders WHERE ref = ?", ok[0].body.ref);
  assert.equal(o.status, "pending_payment");
  // Webhook met status 'open' verandert niets; pas 'paid' van Mollie zelf maakt de bestelling betaald.
  await webhook(o.provider_id);
  assert.equal(app.db.get("SELECT status FROM orders WHERE id = ?", o.id).status, "pending_payment");
  mollie.payments.get(o.provider_id).status = "paid";
  await webhook(o.provider_id); await webhook(o.provider_id);
  assert.equal(app.db.get("SELECT status FROM orders WHERE id = ?", o.id).status, "paid");
  assert.equal(app.db.get("SELECT status FROM promotion_uses WHERE order_id = ?", o.id).status, "redeemed");
  assert.equal(app.db.get("SELECT COUNT(*) n FROM outbox WHERE kind = 'bestelling'").n, 1, "één bevestiging, pas na betaling");
  // Statuspagina alleen met geheim token.
  assert.equal((await pub("GET", `/api/public/shop/orders/${o.ref}?t=fout`)).status, 404);
});

test("mislukte betaling geeft code vrij; mislukte provider maakt geen bestelling", async () => {
  resetRateLimits();
  await staff("POST", "/api/admin/shop/promotions", { code: "EENMALIG", type: "fixed", value: 500, scope: "order", active: true, maxUsesTotal: 1 });
  const tegel = (await pub("GET", "/api/public/shop/products")).body.products[0];
  const body = { lines: [{ productId: tegel.id, qty: 2 }], codes: ["EENMALIG"], delivery: "afhalen", customer: { ...customer, email: "c@example.test" }, agreeTerms: true };
  let r = await pub("POST", "/api/public/shop/orders", body, { "Idempotency-Key": "key-fail-0000000001" });
  assert.equal(r.status, 201);
  const o = app.db.get("SELECT * FROM orders WHERE ref = ?", r.body.ref);
  mollie.payments.get(o.provider_id).status = "expired";
  await webhook(o.provider_id);
  assert.equal(app.db.get("SELECT status FROM orders WHERE id = ?", o.id).status, "expired");
  assert.equal(app.db.get("SELECT status FROM promotion_uses WHERE order_id = ?", o.id).status, "released");
  mollie.fail = true;
  r = await pub("POST", "/api/public/shop/orders", { ...body, customer: { ...customer, email: "d@example.test" } }, { "Idempotency-Key": "key-fail-0000000002" });
  assert.equal(r.status, 502); assert.match(r.body.error, /niets afgeschreven/);
  assert.equal(app.db.get("SELECT status FROM orders WHERE idempotency_key = 'key-fail-0000000002'").status, "failed");
  mollie.fail = false;
  r = await pub("POST", "/api/public/shop/price", { lines: [{ productId: tegel.id, qty: 2 }], codes: ["EENMALIG"] });
  assert.equal(r.body.applied.length, 1, "code weer beschikbaar na mislukte betaling");
});
