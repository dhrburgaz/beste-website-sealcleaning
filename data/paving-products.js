/**
 * Generieke bestratingsformaten, legpatronen en kleurpresets.
 * Per docs/SEAL_BUILD_BRIEF.md hoofdstuk 14. Generieke visualisatiematen,
 * geen officiële productspecificaties totdat een echt product is gekoppeld.
 */

export const PAVING_APPLICATIONS = ["terras", "pad", "oprit", "parkeerplaats", "anders"];

export const PAVING_FORMATS_MM = [
  { id: "20x30", lengthMm: 300, widthMm: 200, label: "20 × 30 cm" },
  { id: "30x30", lengthMm: 300, widthMm: 300, label: "30 × 30 cm" },
  { id: "40x40", lengthMm: 400, widthMm: 400, label: "40 × 40 cm" },
  { id: "60x30", lengthMm: 600, widthMm: 300, label: "60 × 30 cm" },
  { id: "60x60", lengthMm: 600, widthMm: 600, label: "60 × 60 cm" },
  { id: "80x80", lengthMm: 800, widthMm: 800, label: "80 × 80 cm" }
];

export const PAVING_PATTERNS = [
  { id: "straight", label: "Recht verband" },
  { id: "half-brick", label: "Halfsteens verband" }
  // Wildverband en visgraat: bewust nog niet toegevoegd (ch.14 — geen nepoptie
  // tonen voordat geometrie, compatibiliteit en hoeveelheden zijn geïmplementeerd).
];

export const PAVING_COLOR_PRESETS = [
  { id: "light-grey", label: "Lichtgrijs", colorHex: "#c7c6c0", material: "beton" },
  { id: "grey", label: "Grijs", colorHex: "#9b9a93", material: "beton" },
  { id: "anthracite", label: "Antraciet", colorHex: "#43433f", material: "beton" },
  { id: "beige", label: "Beige", colorHex: "#d6c6a3", material: "keramiek" },
  { id: "brown", label: "Bruin", colorHex: "#6e4f34", material: "keramiek" },
  { id: "red-brown", label: "Roodbruin", colorHex: "#7a4030", material: "klinker" }
];

export const EDGING_PRODUCTS = [
  { id: "edging-anthracite", label: "Opsluitband antraciet 100 × 15 × 5 cm", lengthMm: 1000 },
  { id: "edging-grey", label: "Opsluitband grijs 100 × 15 × 5 cm", lengthMm: 1000 }
];

export function getPavingFormat(formatId) {
  return PAVING_FORMATS_MM.find((f) => f.id === formatId) || null;
}

export function getPavingColorPreset(presetId) {
  return PAVING_COLOR_PRESETS.find((p) => p.id === presetId) || null;
}
