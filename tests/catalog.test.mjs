import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { CATALOG, CATALOG_CATEGORIES, CATALOG_STATUSES } from "../data/catalog.js";
import { searchCatalog, suggest, filterCatalog, facetCounts, sortCatalog, priceInfo, quantityFor, editDistance } from "../js/catalog/search.js";

const ROOT = new URL("..", import.meta.url).pathname;
const prices = JSON.parse(readFileSync(ROOT + "data/price-sources.json", "utf8"));
const ids = (r) => r.map((x) => x.item.id);

test("catalogus: unieke ids, geldige status/categorie, geen verzonnen velden", () => {
  assert.equal(new Set(CATALOG.map((i) => i.id)).size, CATALOG.length);
  for (const i of CATALOG) {
    assert.ok(CATALOG_STATUSES[i.status], i.id);
    assert.ok(CATALOG_CATEGORIES.some((c) => c.id === i.category), i.id);
    assert.equal(i.purchasable, false, `${i.id}: niet online bestelbaar zonder fulfilmentafspraken`);
    if (i.status !== "verified-product") { assert.equal(i.sku, null, `${i.id}: geen SKU bij algemene optie`); assert.equal(i.supplier, null, i.id); }
    else { assert.ok(i.sourceUrl && i.priceSourceId, `${i.id}: geverifieerd product heeft bron`); assert.ok(prices.rows.some((r) => r.id === i.priceSourceId), i.id); }
    if (i.image) assert.ok(existsSync(ROOT + i.image.src), `${i.id}: afbeelding bestaat`);
    assert.equal(i.availability.status, null, `${i.id}: beschikbaarheid niet geclaimd`);
  }
  assert.ok(CATALOG.length >= 40);
});

test("zoeken: synoniemen, tikfouten, meerdere termen", () => {
  assert.ok(ids(searchCatalog(CATALOG, "hek")).some((id) => id.startsWith("schutting")));
  assert.ok(ids(searchCatalog(CATALOG, "schuting")).includes("schutting-grenen"), "tikfout schuting");
  assert.ok(ids(searchCatalog(CATALOG, "kerammiek")).includes("bestrating-keramiek"), "tikfout kerammiek");
  assert.ok(ids(searchCatalog(CATALOG, "60x60 keramiek")).includes("product-excluton-keramisch-madrid-6060"));
  assert.ok(!ids(searchCatalog(CATALOG, "60x60 keramiek")).includes("schutting-grenen"));
  assert.equal(searchCatalog(CATALOG, "zwembadfolie").length, 0);
  assert.equal(suggest(CATALOG, "kunstgrass"), "kunstgras");
  assert.equal(editDistance("abc", "abd"), 1);
});

test("filters en facetten", () => {
  const f = filterCatalog(CATALOG, { category: ["bestrating"], maintenance: ["laag"] });
  assert.ok(f.length && f.every((i) => i.category === "bestrating" && i.maintenanceLevel === "laag"));
  const counts = facetCounts(CATALOG, { category: ["bestrating"] });
  assert.ok(counts.category.find(([v]) => v === "schutting")[1] > 0, "categoriefacet telt zonder eigen filter");
  assert.ok(counts.format.some(([v]) => v === "60 × 60 × 2 cm"));
  const sorted = sortCatalog(searchCatalog(CATALOG, ""), "status");
  assert.equal(sorted[0].item.status, "verified-product");
});

test("prijsstatus: alleen marktreferentie, verlopen referentie zonder bedrag", () => {
  const tile = CATALOG.find((i) => i.id === "product-excluton-terrastegel-plus-6060");
  const p = priceInfo(tile, prices, "2026-10-10");
  assert.equal(p.status, "reference"); assert.equal(p.amountCents, 885); assert.equal(p.domain, "hornbach.nl");
  const stale = priceInfo(tile, prices, "2027-01-01");
  assert.equal(stale.status, "stale"); assert.equal(stale.amountCents, null);
  assert.equal(priceInfo(CATALOG.find((i) => i.id === "schutting-douglas"), prices).status, "none");
});

test("hoeveelheden alleen waar valide", () => {
  const tile = CATALOG.find((i) => i.id === "product-excluton-terrastegel-plus-6060");
  assert.equal(quantityFor(tile, { m2: 24 }).qty, 70); // 24 m² × 1,05 / 0,36 = 70
  assert.equal(quantityFor(tile, { m2: 0 }), null);
  const band = CATALOG.find((i) => i.id === "product-excluton-opsluitband-grijs");
  assert.equal(quantityFor(band, { meters: 20 }).qty, 21);
  assert.equal(quantityFor(CATALOG.find((i) => i.id === "beplanting-haag"), { meters: 10 }), null, "haag: geen aantal zonder bevestigde plantafstand");
});
