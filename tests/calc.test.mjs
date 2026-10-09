import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createEmptyProject, deriveTileCount } from "../js/project-state.js";
import { takeoff } from "../js/calc/quantities.js";
import { calculate, markupToMarginPct, marginToMarkupPct } from "../js/calc/engine.js";

const priceSources = JSON.parse(readFileSync(new URL("../data/price-sources.json", import.meta.url)));

function pavingProject(m = { l: 6000, w: 4000 }) {
  const p = createEmptyProject();
  p.services = ["bestrating"];
  p.paving = { areas: [{ id: "a1", lengthMm: m.l, widthMm: m.w, position: { xMm: 0, zMm: 0 }, rotationDeg: 0, application: "terras" }],
    productId: null, nominalTileLengthMm: 600, nominalTileWidthMm: 600, pattern: "straight", colorPresetId: "light-grey" };
  p.access.surface = "paving";
  return p;
}

test("takeoff: 24 m² 60×60 → 70 tegels, opsluitband, zandbed, trilplaat", () => {
  const rows = takeoff(pavingProject());
  const get = (k) => rows.find((r) => r.key === k)?.qty;
  assert.equal(get("paving.tiles"), 70);
  assert.equal(get("paving.area"), 24);
  assert.equal(get("paving.edging"), 21); // omtrek 20 m × 1,05
  assert.equal(get("paving.sand"), 1.2);
  assert.equal(get("machine.plate"), 1);
  assert.equal(get("paving.excavation"), undefined); // ondergrond bestrating → geen afgraven
});

test("takeoff: ondergrond aarde voegt afgraven + grondcontainer toe", () => {
  const p = pavingProject();
  p.access.surface = "earth";
  const rows = takeoff(p);
  assert.equal(rows.find((r) => r.key === "paving.excavation").qty, 4.8);
  assert.equal(rows.find((r) => r.key === "waste.soil").qty, 1);
});

test("engine: arbeid op € 60/uur, voorbeeldnorm gemarkeerd, geen marge verzonnen", () => {
  const res = calculate({ takeoffRows: takeoff(pavingProject()), priceSources });
  const labor = res.lines.find((l) => l.key === "paving.area" && l.kind === "labor");
  assert.equal(labor.qty, 14.4); // 24 m² × 0,6
  assert.equal(labor.saleExclCents, 86400);
  assert.equal(labor.basis, "example");
  assert.ok(res.flags.some((f) => /Opslag voor materiaal is niet ingesteld/.test(f.text)));
  assert.equal(res.totals.costExclCents, null); // arbeidskostprijs onbekend → geen schijnmarge
  assert.notEqual(res.readiness, "gereed voor controle");
});

test("engine: tegel = goedkoopste 60×60 met staffel, excl. btw", () => {
  const res = calculate({ takeoffRows: takeoff(pavingProject()), priceSources });
  const tiles = res.lines.find((l) => l.key === "paving.tiles");
  assert.equal(tiles.basis, "market");
  // Terrastegel Plus: staffel ≥28 st = 840 ct incl. 21% → 694 ct excl.
  assert.equal(tiles.unitCostExclCents, 694);
  assert.equal(tiles.costExclCents, Math.round(840 / 1.21 * 70));
});

test("engine: ontbrekende prijs maakt offerte incompleet (zandbed, transport)", () => {
  const res = calculate({ takeoffRows: takeoff(pavingProject()), priceSources });
  assert.equal(res.readiness, "incompleet");
  assert.equal(res.lines.find((l) => l.key === "paving.sand").basis, "missing");
  assert.ok(res.flags.some((f) => f.level === "block" && /Transport/.test(f.text)));
});

test("engine: eigen inkoop + instellingen → volledige berekening met brutomarge", () => {
  const settings = { materialMarkupPct: 25, machineMarkupPct: 10, wasteMarkupPct: 10, overheadPct: 5, riskPct: 0, transportPerDayCents: 5000, laborCostRateCents: 3500,
    norms: {} };
  const purchase = { "paving.sand": { amountExclCents: 4500, supplier: "Testleverancier" } };
  const res = calculate({ takeoffRows: takeoff(pavingProject()), settings, priceSources, purchasePrices: purchase });
  assert.equal(res.totals.missingLines, 0);
  const sand = res.lines.find((l) => l.key === "paving.sand");
  assert.equal(sand.basis, "purchase");
  assert.equal(sand.saleExclCents, Math.round(4500 * 1.25 * 1.2));
  assert.ok(res.totals.costExclCents > 0);
  assert.ok(res.totals.grossMarginPct > 0 && res.totals.grossMarginPct < 100);
  assert.equal(res.totals.saleExclCents % 100, 0); // afgerond op hele euro's
  assert.equal(res.totals.vatCents, Math.round(res.totals.saleExclCents * 0.21));
  // margeconflict: 25% opslag op goedkoopste tegel ligt nog onder duurste marktprijs → geen conflict
  assert.ok(!res.flags.some((f) => /Margeconflict: verkoopprijs "Tegels/.test(f.text)));
});

test("engine: margeconflict als verkoopprijs boven marktband uitkomt", () => {
  const res = calculate({ takeoffRows: takeoff(pavingProject()), settings: { materialMarkupPct: 200 }, priceSources });
  assert.ok(res.flags.some((f) => /Margeconflict/.test(f.text)));
});

test("engine: schuttingscherm alleen gekoppeld bij houten systeem op 180 cm", () => {
  const p = createEmptyProject();
  p.services = ["schutting"];
  p.fence = { shape: "I", systemId: "generic-composite", heightMm: 1800, materialPresetId: "anthracite-composite", gates: [],
    sections: [{ id: "A", start: { xMm: 0, zMm: 0 }, directionDeg: 0, lengthMm: 5400 }] };
  let res = calculate({ takeoffRows: takeoff(p), priceSources });
  assert.equal(res.lines.find((l) => l.key === "fence.panels" && l.kind === "material").basis, "missing");
  p.fence.systemId = "generic-wood-concrete";
  res = calculate({ takeoffRows: takeoff(p), priceSources });
  const panel = res.lines.find((l) => l.key === "fence.panels" && l.kind === "material");
  assert.equal(panel.basis, "market");
  assert.equal(panel.qty, 3);
  assert.ok(res.flags.some((f) => /Btw-basis/.test(f.text)));
});

test("opslag ↔ marge: 25% opslag = 20% marge", () => {
  assert.equal(markupToMarginPct(25), 20);
  assert.equal(marginToMarkupPct(20), 25);
});

test("deriveTileCount: geen floating-point overtelling", () => {
  assert.equal(deriveTileCount(24, 600, 600, 0.05), 70);
});
