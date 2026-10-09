/**
 * SEAL projectstate — gedeeld datamodel voor de tuin/schutting/bestrating-configurator.
 * Schema per docs/SEAL_BUILD_BRIEF.md hoofdstuk 18. Eén staat is leidend: alle
 * afgeleide waarden (lengtes, oppervlaktes, materiaalindicaties) worden berekend
 * uit deze staat, nooit apart opgeslagen. Alles in mm/eurocenten, JSON-serialiseerbaar
 * (geen Three.js-objecten, DOM-nodes, File of Blob in de state zelf).
 *
 * ES module; gebruikt door de configurator (2D/SVG en 3D). Bevat geen UI-code.
 */

export const SCHEMA_VERSION = 1;

/** @returns {string} RFC4122-achtige id, voldoende voor lokale projectstate. */
export function generateId(prefix) {
  const rnd = () => Math.random().toString(16).slice(2, 10);
  return (prefix ? prefix + "-" : "") + Date.now().toString(36) + "-" + rnd();
}

/**
 * Nieuw leeg project. projectType volgt automatisch uit services[] via deriveProjectType().
 */
export function createEmptyProject() {
  return {
    schemaVersion: SCHEMA_VERSION,
    projectId: generateId("proj"),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectType: "single",
    services: [],
    sourceCaseId: null,
    garden: {
      shape: "rect",
      widthMm: null,
      depthMm: null,
      areaKnown: false,
      geometryKnown: false,
      areaM2Reported: null,
      polygon: null,
      lCut: null,
      houseSide: "north"
    },
    fence: null,
    paving: null,
    existingObjects: [],
    removal: {
      existingFence: false,
      removeFence: false,
      existingPaving: false,
      removePaving: false,
      items: [],
      disposal: "unknown"
    },
    options: { materialSupply: "advice-needed", route: null },
    access: { surface: "unknown", rearPassageWidthMm: null, obstacles: "" },
    location: { postalCode: null, city: null },
    schedule: { preferredPeriod: null, flexible: true },
    photos: [],
    notes: "",
    customer: { name: null, email: null, phone: null, preferredChannel: null },
    variants: []
  };
}

/* ---------------------------------------------------------------------- */
/* Maatconversie                                                          */
/* ---------------------------------------------------------------------- */

/**
 * Parseert een meterinvoer ("8,40", "8.40", "8") naar gehele millimeters.
 * @returns {number|null} null bij ongeldige invoer (laat laatst geldige waarde ongemoeid).
 */
export function parseMetersToMm(input) {
  if (input === null || input === undefined) return null;
  const text = String(input).trim().replace(",", ".");
  if (text === "") return null;
  if (!/^\d+(\.\d{1,3})?$/.test(text)) return null;
  const meters = parseFloat(text);
  if (!isFinite(meters) || meters < 0) return null;
  return Math.round(meters * 1000);
}

export function mmToMeters(mm) {
  if (mm === null || mm === undefined) return null;
  return Math.round(mm) / 1000;
}

export function formatMeters(mm, decimals) {
  const m = mmToMeters(mm);
  if (m === null) return "—";
  return m.toLocaleString("nl-NL", { minimumFractionDigits: decimals ?? 2, maximumFractionDigits: decimals ?? 2 }) + " m";
}

export function formatM2(m2, decimals) {
  if (m2 === null || m2 === undefined) return "—";
  return m2.toLocaleString("nl-NL", { minimumFractionDigits: decimals ?? 1, maximumFractionDigits: decimals ?? 1 }) + " m²";
}

/* ---------------------------------------------------------------------- */
/* Projecttype afleiden                                                   */
/* ---------------------------------------------------------------------- */

export function deriveProjectType(project) {
  const n = (project.services || []).length;
  if (n >= 2) return "combined";
  if (n === 1) return "single";
  return "undetermined";
}

/* ---------------------------------------------------------------------- */
/* Schutting — geometrie                                                  */
/* ---------------------------------------------------------------------- */

/**
 * Totale lijnlengte (alle secties) en gesloten lengte (lijnlengte minus vrije
 * poortopeningen) in mm. Zie ch.13: lijnlengte, palen en vrije poortopening
 * zijn apart; de preview mag geen onbedoelde extra meters toevoegen.
 */
export function deriveFenceLengths(fence) {
  if (!fence || !Array.isArray(fence.sections)) {
    return { totalLineLengthMm: 0, closedLengthMm: 0, gateOpeningsMm: 0 };
  }
  const totalLineLengthMm = fence.sections.reduce((sum, s) => sum + (s.lengthMm || 0), 0);
  const gateOpeningsMm = (fence.gates || []).reduce((sum, g) => sum + (g.clearWidthMm || 0), 0);
  return {
    totalLineLengthMm,
    closedLengthMm: Math.max(0, totalLineLengthMm - gateOpeningsMm),
    gateOpeningsMm
  };
}

/**
 * Valideert dat elke poort binnen haar sectie past en poorten elkaar niet overlappen.
 * Retourneert een lijst leesbare foutmeldingen (leeg = geldig). Verandert de state niet;
 * de aanroeper behoudt het laatste geldige model bij een fout (ch.13).
 */
export function validateFenceGates(fence) {
  const errors = [];
  if (!fence) return errors;
  const sectionsById = new Map((fence.sections || []).map((s) => [s.id, s]));

  const bySection = new Map();
  for (const gate of fence.gates || []) {
    if (!bySection.has(gate.sectionId)) bySection.set(gate.sectionId, []);
    bySection.get(gate.sectionId).push(gate);
  }

  for (const [sectionId, gates] of bySection) {
    const section = sectionsById.get(sectionId);
    if (!section) {
      errors.push(`Poort verwijst naar onbekende zijde "${sectionId}".`);
      continue;
    }
    const sorted = [...gates].sort((a, b) => a.offsetMm - b.offsetMm);
    let cursor = 0;
    for (const gate of sorted) {
      const start = gate.offsetMm;
      const end = gate.offsetMm + gate.clearWidthMm;
      if (start < 0 || end > section.lengthMm) {
        errors.push(`Poort op zijde ${sectionId} past niet binnen de lengte van die zijde.`);
        continue;
      }
      if (start < cursor) {
        errors.push(`Twee poorten op zijde ${sectionId} overlappen elkaar.`);
        continue;
      }
      cursor = end;
    }
  }
  return errors;
}

/* ---------------------------------------------------------------------- */
/* Bestrating — oppervlakte en overlap                                    */
/* ---------------------------------------------------------------------- */

export function deriveAreaM2(area) {
  return Math.round(((area.lengthMm || 0) * (area.widthMm || 0)) / 1_000_000 * 100) / 100;
}

export function derivePavingTotals(paving) {
  if (!paving || !Array.isArray(paving.areas)) return { totalM2: 0, perArea: [] };
  const perArea = paving.areas.map((a) => ({ id: a.id, m2: deriveAreaM2(a) }));
  const totalM2 = Math.round(perArea.reduce((sum, a) => sum + a.m2, 0) * 100) / 100;
  return { totalM2, perArea };
}

/**
 * Eenvoudige axis-aligned bounding-box overlapcontrole tussen rechthoekige vlakken.
 * Ch.14: "Kies eerst een robuuste regel vlakken mogen elkaar niet overlappen";
 * een echte polygon-union volgt pas wanneer die apart is getest.
 * @returns {Array<{a:string,b:string}>} paren overlappende vlak-ids.
 */
export function findPavingOverlaps(paving) {
  const overlaps = [];
  const areas = (paving && paving.areas) || [];
  for (let i = 0; i < areas.length; i++) {
    for (let j = i + 1; j < areas.length; j++) {
      if (rectsOverlap(areas[i], areas[j])) {
        overlaps.push({ a: areas[i].id, b: areas[j].id });
      }
    }
  }
  return overlaps;
}

function rectsOverlap(a, b) {
  if (a.rotationDeg || b.rotationDeg) {
    // Draaiing wordt in de 2D/3D-weergave ondersteund maar de overlapcontrole
    // werkt hier bewust alleen op de niet-gedraaide gevallen; gedraaide vlakken
    // worden conservatief als "mogelijk overlappend" behandeld totdat een
    // echte rotated-rect-test is toegevoegd en getest.
    return true;
  }
  const ax1 = a.position.xMm, ax2 = a.position.xMm + a.lengthMm;
  const az1 = a.position.zMm, az2 = a.position.zMm + a.widthMm;
  const bx1 = b.position.xMm, bx2 = b.position.xMm + b.lengthMm;
  const bz1 = b.position.zMm, bz2 = b.position.zMm + b.widthMm;
  return ax1 < bx2 && ax2 > bx1 && az1 < bz2 && az2 > bz1;
}

/**
 * Tegelaantal inclusief expliciete snijreserve, afgerond naar boven.
 * Ch.20 rekenvoorbeeld: 24 m² x 1.05 / 0.36 m² per tegel = 70 tegels.
 */
export function deriveTileCount(totalM2, tileLengthMm, tileWidthMm, wasteFraction) {
  const tileM2 = (tileLengthMm / 1000) * (tileWidthMm / 1000);
  if (!tileM2) return null;
  const waste = wasteFraction ?? 0.05;
  // Rond op 6 decimalen vóór ceil: voorkomt dat drijvendekommaruis (bv. 70,00000000000001
  // door 24 * 1.05) een exacte grens naar een extra tegel duwt.
  const raw = (totalM2 * (1 + waste)) / tileM2;
  const rounded = Math.round(raw * 1e6) / 1e6;
  return Math.ceil(rounded);
}

/* ---------------------------------------------------------------------- */
/* Serialisatie                                                           */
/* ---------------------------------------------------------------------- */

/** Stringify/parse-roundtrip-check: gooit als project niet veilig serialiseerbaar is. */
export function assertSerializable(project) {
  const roundtripped = JSON.parse(JSON.stringify(project));
  if (typeof roundtripped !== "object") throw new Error("Project state is niet serialiseerbaar.");
  return roundtripped;
}

export function cloneProjectAsVariant(project, newId) {
  const copy = assertSerializable(project);
  copy.projectId = newId || generateId("proj");
  copy.customer = { name: null, email: null, phone: null, preferredChannel: null };
  copy.photos = [];
  copy.createdAt = new Date().toISOString();
  copy.updatedAt = copy.createdAt;
  return copy;
}
