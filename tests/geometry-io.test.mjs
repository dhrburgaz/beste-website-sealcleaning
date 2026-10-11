import { test } from "node:test";
import assert from "node:assert/strict";
import { lPolygon, polygonAreaMm2, findPolygonProblem, computeGateSwing } from "../js/configurator/geometry.js";
import { sanitizeDesign, toDesignPayload, encodeShare, decodeShare } from "../js/configurator/design-io.js";
import { createEmptyProject } from "../js/project-state.js";
import { estimateWaste } from "../js/configurator/waste.js";

test("L-vorm: oppervlak = rechthoek minus uitsparing", () => {
  assert.equal(polygonAreaMm2(lPolygon(8000, 6000, 2000, 2000)) / 1e6, 44);
});

test("zelfdoorsnijdende contour wordt geweigerd", () => {
  const bow = [{ xMm: 0, zMm: 0 }, { xMm: 4000, zMm: 4000 }, { xMm: 4000, zMm: 0 }, { xMm: 0, zMm: 4000 }];
  assert.match(findPolygonProblem(bow), /kruisen/);
  assert.equal(findPolygonProblem(lPolygon(8000, 6000, 2000, 2000)), null);
});

test("poortdraaicirkel: binnen = +z bij zijde langs +x", () => {
  const fence = { sections: [{ id: "A", start: { xMm: 0, zMm: 0 }, directionDeg: 0, lengthMm: 5000 }] };
  const sw = computeGateSwing(fence, { sectionId: "A", offsetMm: 1000, clearWidthMm: 1000, hingeSide: "left", swing: "inward" });
  assert.deepEqual([Math.round(sw.openTip.xMm), Math.round(sw.openTip.zMm)], [1000, 1000]);
});

test("ontwerp-roundtrip via deellink behoudt geometrie, zonder persoonsgegevens", () => {
  const p = createEmptyProject();
  p.services = ["bestrating"];
  p.customer.name = "Jan";
  p.location.postalCode = "3311AA";
  p.paving = { areas: [{ id: "a1", lengthMm: 3000, widthMm: 2000, position: { xMm: 0, zMm: 0 }, rotationDeg: 0, application: "terras" }],
    productId: null, nominalTileLengthMm: 600, nominalTileWidthMm: 600, pattern: "straight", colorPresetId: "grey" };
  const out = decodeShare(encodeShare(p));
  assert.equal(out.paving.areas[0].lengthMm, 3000);
  assert.equal(out.customer.name, null);
  assert.equal(out.location.postalCode, null);
  assert.ok(!JSON.stringify(toDesignPayload(p)).includes("3311AA"));
});

test("sanitizer weigert onbekend formaat, begrenst getallen, filtert onbekende diensten", () => {
  assert.throws(() => sanitizeDesign({ format: "iets" }), /geen Sealcleaning/);
  const raw = { format: "sealcleaning-ontwerp", schemaVersion: 1, design: { services: ["bestrating", "<script>"], paving: { areas: [{ lengthMm: 1e12, widthMm: 100, position: { xMm: 0, zMm: 0 } }] } } };
  assert.throws(() => sanitizeDesign(raw), /lengte vlak/);
  raw.design.paving.areas[0].lengthMm = 2000;
  const ok = sanitizeDesign(raw);
  assert.deepEqual(ok.services, ["bestrating"]);
});

test("afvalindicatie geeft bandbreedte, geen gewicht", () => {
  const p = createEmptyProject();
  p.removal.existingPaving = true;
  const w = estimateWaste(p, 20);
  assert.deepEqual(w[0].m3, [0.8, 1.6]);
});

test("deellink: wensen en plantprofiel (H01) gaan mee, alleen toegestane waarden", async () => {
  const { createEmptyProject } = await import("../js/project-state.js");
  const io = await import("../js/configurator/design-io.js");
  const p = createEmptyProject();
  p.wishes = { scope: "complete", uses: ["privacy", "<script>"], maintenance: "low", light: "sun", soil: "evil" };
  const r = io.decodeShare(io.encodeShare(p));
  assert.deepEqual(r.wishes, { scope: "complete", uses: ["privacy"], maintenance: "low", light: "sun", soil: null });
});
