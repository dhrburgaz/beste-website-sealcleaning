import { test } from "node:test";
import assert from "node:assert/strict";
import { priceCart, checkPromotion, allocate, amsterdamToUtcMs, referencePrice } from "../server/src/commerce.js";

const products = new Map([
  ["tegel", { id: "tegel", title: "Tegel 60×60", unit: "stuks", category: "bestrating", priceExclCents: 1000, vatRate: 21, active: true, maxPerOrder: 200 }],
  ["zand", { id: "zand", title: "Straatzand", unit: "zakken", category: "ondergrond", priceExclCents: 333, vatRate: 21, active: true, maxPerOrder: 50 }],
  ["oud", { id: "oud", title: "Uit assortiment", unit: "stuks", category: "bestrating", priceExclCents: 500, vatRate: 21, active: false }]
]);
const NOW = Date.parse("2026-10-10T10:00:00Z");
const promo = (o) => ({ id: "p1", code: "WELCOME10", type: "percentage", value: 1000, scope: "categories", scopeIds: ["bestrating"], startsAt: null, endsAt: null, active: true, stackable: false, minSubtotalCents: 5000, maxDiscountCents: 10000, maxUsesTotal: 100, maxUsesPerCustomer: 1, usesCount: 0, ...o });
const price = (lines, promos = [], codes = [], extra = {}) => priceCart(lines, products, promos, { codes, nowMs: NOW, shipping: null, ...extra });

test("prijzen: server rekent, btw over netto, centen exact", () => {
  const r = price([{ productId: "tegel", qty: 3 }, { productId: "zand", qty: 3 }]);
  assert.equal(r.subtotalExclCents, 3999);
  assert.equal(r.vatCents, Math.round(3999 * 0.21));
  assert.equal(r.totalInclCents, 3999 + 840);
  assert.equal(price([{ productId: "tegel", qty: 0 }]).ok, false);
  assert.equal(price([{ productId: "tegel", qty: 1.5 }]).ok, false);
  assert.match(price([{ productId: "tegel", qty: 201 }]).errors[0], /maximaal 200/);
  assert.match(price([{ productId: "oud", qty: 1 }]).errors[0], /niet \(meer\) leverbaar/);
  assert.match(price([]).errors[0], /leeg/);
});

test("korting: geldig, bereik, maximum, btw na korting", () => {
  const r = price([{ productId: "tegel", qty: 20 }, { productId: "zand", qty: 10 }], [promo()], ["welcome10"]);
  assert.equal(r.applied[0].amountExclCents, 2000); // 10 % van 20 × 10,00, zand valt buiten bereik
  assert.equal(r.discountExclCents, 2000);
  assert.equal(r.vat[0].baseExclCents, 20000 + 3330 - 2000);
  assert.equal(r.vatCents, Math.round((20000 + 3330 - 2000) * 0.21));
  const capped = price([{ productId: "tegel", qty: 200 }], [promo()], ["WELCOME10"]);
  assert.equal(capped.applied[0].amountExclCents, 10000, "maximum voordeel € 100");
});

test("korting: verlopen, nog niet geldig, minimum, op, per klant, verkeerd bereik, onbekend", () => {
  const lines = [{ productId: "tegel", qty: 10 }];
  const reason = (p, extra) => price(lines, [p], ["WELCOME10"], extra).rejected[0]?.reason || "";
  assert.match(reason(promo({ endsAt: "2026-10-01T00:00" })), /verlopen/);
  assert.match(reason(promo({ startsAt: "2026-11-01T00:00" })), /nog niet geldig/);
  assert.match(price([{ productId: "tegel", qty: 4 }], [promo()], ["WELCOME10"]).rejected[0].reason, /vanaf €\s50,00/);
  assert.match(reason(promo({ usesCount: 100 })), /op/);
  assert.match(reason(promo(), { customerUses: { p1: 1 } }), /al het maximale/);
  assert.match(price([{ productId: "zand", qty: 30 }], [promo()], ["WELCOME10"]).rejected[0].reason, /geldt niet voor de artikelen/);
  assert.match(price(lines, [], ["BESTAATNIET"]).rejected[0].reason, /bestaat niet/);
  assert.match(reason(promo({ active: false })), /niet actief/);
});

test("korting: stapelen alleen als beide stapelbaar; nooit negatief totaal", () => {
  const a = promo({ id: "a", code: "A", scope: "order", minSubtotalCents: 0, stackable: true, type: "fixed", value: 500, maxDiscountCents: null });
  const b = promo({ id: "b", code: "B", scope: "order", minSubtotalCents: 0, stackable: true, type: "fixed", value: 99999, maxDiscountCents: null });
  const r = price([{ productId: "tegel", qty: 1 }], [a, b], ["A", "B"]);
  assert.equal(r.discountExclCents, 1000, "korting begrensd tot het bedrag");
  assert.ok(r.totalInclCents >= 0);
  const ns = price([{ productId: "tegel", qty: 10 }], [promo(), a], ["WELCOME10", "A"]);
  assert.equal(ns.applied.length, 0); assert.match(ns.rejected[0].reason, /niet met elkaar te combineren/);
});

test("gratis bezorging alleen als er bezorgkosten zijn; kosten nooit stilzwijgend € 0", () => {
  const fs = promo({ code: "FREESHIP", type: "free_shipping", scope: "order", minSubtotalCents: 0 });
  const withShip = price([{ productId: "tegel", qty: 1 }], [fs], ["FREESHIP"], { shipping: { method: "bezorgen", priceExclCents: 2500, vatRate: 21 } });
  assert.equal(withShip.shipping.exclCents, 0); assert.equal(withShip.shipping.free, true);
  const pickup = price([{ productId: "tegel", qty: 1 }], [fs], ["FREESHIP"], { shipping: { method: "afhalen", priceExclCents: 0, vatRate: 21 } });
  assert.match(pickup.rejected[0].reason, /geen bezorgkosten/);
});

test("hulpfuncties: verdeling exact, Amsterdamse tijd met zomertijd", () => {
  assert.deepEqual(allocate(100, [1, 1, 1]), [34, 33, 33]);
  assert.equal(allocate(7, [3, 3, 1]).reduce((a, b) => a + b), 7);
  assert.equal(new Date(amsterdamToUtcMs("2026-07-01T00:00")).toISOString(), "2026-06-30T22:00:00.000Z");
  assert.equal(new Date(amsterdamToUtcMs("2026-12-01T00:00")).toISOString(), "2026-11-30T23:00:00.000Z");
  assert.equal(checkPromotion(null, { nowMs: NOW, eligibleSubtotal: 1 }).ok, false);
});

test("van/voor-prijs alleen met 30-dagenhistorie (ACM)", () => {
  const d = (s) => new Date(s).toISOString();
  const hist = [{ at: d("2026-08-01"), priceExclCents: 1200 }, { at: d("2026-09-20"), priceExclCents: 1500 }, { at: d("2026-10-05"), priceExclCents: 1000 }];
  assert.deepEqual(referencePrice(hist, 1000).fromExclCents, 1200, "laagste prijs in 30 dagen vóór verlaging, niet de opgeschroefde 1500");
  assert.equal(referencePrice([{ at: d("2026-09-20"), priceExclCents: 1500 }, { at: d("2026-10-05"), priceExclCents: 1000 }], 1000), null, "korter dan 30 dagen bekend");
  assert.equal(referencePrice(hist, 900), null, "historie niet actueel");
  assert.equal(referencePrice([], 1000), null);
});
