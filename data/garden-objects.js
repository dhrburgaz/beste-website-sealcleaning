/**
 * Objecten in de tuintekening (C01/C04/C05/C06/D07/D08). Bestaande objecten
 * zijn een schematische referentie, geen verkoopartikel; alleen objecten
 * met status "new" horen bij de nieuwe scope. Hoeveelheden volgen de eenheid
 * van het object (haag in strekkende meter, border/gazon in m²).
 */

export const OBJECT_STATUSES = {
  "existing-keep": "Bestaand — behouden",
  "existing-remove": "Bestaand — verwijderen",
  new: "Nieuw aanleggen"
};

export const OBJECT_TYPES = [
  { id: "house-wall", label: "Huiswand / gevel", statuses: ["existing-keep"], lengthMm: 6000, widthMm: 300, heightMm: 2700, unit: null },
  { id: "shed", label: "Schuur / berging", statuses: ["existing-keep", "existing-remove"], lengthMm: 2500, widthMm: 2000, heightMm: 2300, unit: null },
  { id: "tree", label: "Boom", statuses: ["existing-keep", "existing-remove"], lengthMm: 3000, widthMm: 3000, heightMm: 5000, unit: null, protect: true },
  { id: "hedge", label: "Haag", statuses: ["existing-keep", "existing-remove", "new"], lengthMm: 4000, widthMm: 600, heightMm: 1500, unit: "m", protect: true },
  { id: "border", label: "Border / beplantingsvak", statuses: ["existing-keep", "existing-remove", "new"], lengthMm: 3000, widthMm: 1000, heightMm: 500, unit: "m2", protect: true },
  { id: "lawn", label: "Gazon", statuses: ["existing-keep", "existing-remove", "new"], lengthMm: 4000, widthMm: 3000, heightMm: 0, unit: "m2" },
  { id: "gate-existing", label: "Bestaande poort", statuses: ["existing-keep", "existing-remove"], lengthMm: 1000, widthMm: 100, heightMm: 1800, unit: null }
];

export function getObjectType(typeId) {
  return OBJECT_TYPES.find((t) => t.id === typeId) || null;
}

/** Hoeveelheid in de juiste eenheid, of null voor objecten zonder hoeveelheid. */
export function objectQuantity(obj) {
  const type = getObjectType(obj.type);
  if (!type || !type.unit || !obj.footprint) return null;
  const { lengthMm, widthMm } = obj.footprint;
  if (type.unit === "m") return { value: Math.round(Math.max(lengthMm, widthMm) / 10) / 100, unit: "m" };
  return { value: Math.round((lengthMm * widthMm) / 10000) / 100, unit: "m²" };
}
