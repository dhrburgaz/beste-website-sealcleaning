/**
 * Voorbeeldtuin voor de 3D-sectie op de homepage. Dit is een gelabeld voorbeeld,
 * geen project van een klant en geen aanbod: de maten en onderdelen zijn
 * verzonnen ter illustratie en worden zo ook getoond ("Voorbeeld in 3D").
 */
import { createEmptyProject, generateId } from "../project-state.js";

export function buildDemoProject() {
  const p = createEmptyProject();
  p.services = ["schutting", "bestrating"];
  p.garden = { ...p.garden, shape: "rect", widthMm: 9000, depthMm: 6500, areaKnown: true, geometryKnown: true };
  p.fence = {
    shape: "L-right", systemId: "generic-wood-concrete", heightMm: 1800, materialPresetId: "natural-wood-grey-concrete",
    sections: [
      { id: "A", start: { xMm: 0, zMm: 0 }, directionDeg: 0, lengthMm: 9000 },
      { id: "B", start: { xMm: 9000, zMm: 0 }, directionDeg: 90, lengthMm: 6500 }
    ],
    gates: []
  };
  p.paving = {
    areas: [{ id: generateId("area"), lengthMm: 4800, widthMm: 3600, position: { xMm: 3600, zMm: 1300 }, rotationDeg: 0, application: "terras" }],
    productId: null, nominalTileLengthMm: 600, nominalTileWidthMm: 600, pattern: "straight", colorPresetId: "light-grey"
  };
  const obj = (type, x, z, l, w, status = "new") => ({ id: generateId("obj"), type, status, footprint: { xMm: x, zMm: z, lengthMm: l, widthMm: w } });
  p.existingObjects = [
    obj("lawn", 600, 1300, 2800, 3600),
    obj("border", 700, 300, 7800, 700),
    obj("border", 8200, 1100, 700, 4600),
    obj("planter", 3600, 5100, 2200, 600),
    obj("planter", 6400, 5100, 2200, 600),
    obj("hedge", 700, 5800, 2600, 500),
    obj("tree", 7600, 700, 2200, 2200),
    obj("plant", 1200, 700, 800, 800),
    obj("plant", 4400, 650, 900, 900),
    obj("plant", 8000, 5200, 700, 700),
    obj("lamp", 3300, 4900, 300, 300),
    obj("lamp", 8400, 1000, 300, 300)
  ];
  return p;
}
