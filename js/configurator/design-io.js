/**
 * Ontwerp opslaan, openen en delen. Alleen niet-persoonlijke ontwerpstate
 * verlaat het apparaat (geen naam, contact, postcode, plaats, foto's of
 * notities). Alles wat binnenkomt (bestand of deellink) wordt veld voor veld
 * opnieuw opgebouwd uit een witte lijst: onbekende velden vallen weg, id's
 * en keuzes moeten bestaan, getallen worden begrensd. Er is geen server of
 * cloudopslag: een deellink bevat het ontwerp zelf in het #-deel van de URL,
 * dat browsers niet naar de server sturen.
 */
import { createEmptyProject, SCHEMA_VERSION } from "../project-state.js";
import { SERVICES } from "../../data/services.js";
import { FENCE_SHAPES, FENCE_HEIGHTS_MM, FENCE_SYSTEMS, FENCE_MATERIAL_PRESETS } from "../../data/fence-systems.js";
import { PAVING_APPLICATIONS, PAVING_FORMATS_MM, PAVING_PATTERNS, PAVING_COLOR_PRESETS } from "../../data/paving-products.js";
import { getPavingProduct } from "../../data/materials.js";

export const DESIGN_FORMAT = "sealcleaning-ontwerp";
export const MAX_SHARE_CHARS = 6000;
export const MAX_FILE_BYTES = 200_000;
const ROUTES = ["design-only", "material-only", "install-only", "material-and-install", "review-plan"];
const SUPPLY = ["advice-needed", "customer-supplied", "sealcleaning-supplied"];
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

/** Niet-persoonlijke deelverzameling voor export/deellink. */
export function toDesignPayload(project) {
  return {
    format: DESIGN_FORMAT,
    schemaVersion: SCHEMA_VERSION,
    design: {
      services: project.services,
      garden: project.garden,
      fence: project.fence,
      paving: project.paving,
      removal: project.removal,
      options: project.options,
      variants: project.variants || []
    }
  };
}

function num(v, min, max) {
  return typeof v === "number" && Number.isFinite(v) && v >= min && v <= max ? Math.round(v) : null;
}
function req(v, min, max, what) {
  const n = num(v, min, max);
  if (n === null) throw new Error(`Ongeldige waarde voor ${what}.`);
  return n;
}
function oneOf(v, list, fallback) {
  return list.includes(v) ? v : fallback;
}
function id(v, fallback) {
  return typeof v === "string" && ID_RE.test(v) ? v : fallback;
}
function point(p, what) {
  if (!p || typeof p !== "object") throw new Error(`Ontbrekend punt voor ${what}.`);
  return { xMm: req(p.xMm, -200000, 200000, what), zMm: req(p.zMm, -200000, 200000, what) };
}
function list(v, max, what) {
  if (!Array.isArray(v)) return [];
  if (v.length > max) throw new Error(`Te veel ${what} (maximaal ${max}).`);
  return v;
}

function sanitizeFenceChoices(f) {
  const systemId = oneOf(f.systemId, FENCE_SYSTEMS.map((s) => s.id), FENCE_SYSTEMS[1].id);
  const compatible = FENCE_MATERIAL_PRESETS.filter((p) => p.compatibleSystems.includes(systemId)).map((p) => p.id);
  return {
    systemId,
    materialPresetId: oneOf(f.materialPresetId, compatible, compatible[0]),
    heightMm: oneOf(f.heightMm, FENCE_HEIGHTS_MM, 1800)
  };
}

function sanitizePavingChoices(p) {
  const fmt = PAVING_FORMATS_MM.find((f) => f.lengthMm === p.nominalTileLengthMm && f.widthMm === p.nominalTileWidthMm) ||
    PAVING_FORMATS_MM.find((f) => f.id === "60x60");
  const product = typeof p.productId === "string" ? getPavingProduct(p.productId) : null;
  return {
    nominalTileLengthMm: fmt.lengthMm,
    nominalTileWidthMm: fmt.widthMm,
    pattern: oneOf(p.pattern, PAVING_PATTERNS.map((x) => x.id), "straight"),
    colorPresetId: oneOf(p.colorPresetId, PAVING_COLOR_PRESETS.map((x) => x.id), "light-grey"),
    productId: product && product.lengthMm === fmt.lengthMm && product.widthMm === fmt.widthMm ? product.id : null
  };
}

function sanitizeFence(f) {
  if (!f || typeof f !== "object") return null;
  const sections = list(f.sections, 6, "schuttingzijden").map((s, i) => ({
    id: "ABCDEF"[i],
    start: point(s.start, "schuttingzijde"),
    directionDeg: req(s.directionDeg, -360, 360, "richting schutting"),
    lengthMm: req(s.lengthMm, 0, 200000, "lengte schutting")
  }));
  const sectionIds = sections.map((s) => s.id);
  const gates = list(f.gates, 10, "poorten").map((g, i) => ({
    id: id(g.id, `gate-${i}`),
    sectionId: oneOf(g.sectionId, sectionIds, null),
    offsetMm: req(g.offsetMm, 0, 200000, "poortpositie"),
    clearWidthMm: req(g.clearWidthMm, 300, 6000, "poortbreedte"),
    heightMm: num(g.heightMm, 500, 2500) ?? 1800,
    hingeSide: oneOf(g.hingeSide, ["left", "right"], "left"),
    swing: oneOf(g.swing, ["inward", "outward"], "inward")
  })).filter((g) => g.sectionId);
  return {
    shape: oneOf(f.shape, FENCE_SHAPES, "I"),
    ...sanitizeFenceChoices(f),
    sections,
    gates
  };
}

function sanitizePaving(p) {
  if (!p || typeof p !== "object") return null;
  const areas = list(p.areas, 20, "bestratingsvlakken").map((a, i) => ({
    id: id(a.id, `area-${i}`),
    lengthMm: req(a.lengthMm, 100, 100000, "lengte vlak"),
    widthMm: req(a.widthMm, 100, 100000, "breedte vlak"),
    position: point(a.position, "vlakpositie"),
    rotationDeg: 0,
    application: oneOf(a.application, PAVING_APPLICATIONS, "terras")
  }));
  if (!areas.length) return null;
  return { areas, ...sanitizePavingChoices(p) };
}

function sanitizeGarden(g, base) {
  if (!g || typeof g !== "object") return base;
  const shape = oneOf(g.shape, ["rect", "L", "free"], "rect");
  const out = {
    ...base,
    shape,
    widthMm: num(g.widthMm, 500, 200000),
    depthMm: num(g.depthMm, 500, 200000),
    geometryKnown: g.geometryKnown === true,
    houseSide: oneOf(g.houseSide, ["north", "east", "south", "west"], "north"),
    polygon: null,
    lCut: null
  };
  if (shape !== "rect") {
    const pts = list(g.polygon, 40, "hoekpunten").map((p) => point(p, "hoekpunt"));
    if (pts.length < 3) throw new Error("De tuincontour heeft te weinig hoekpunten.");
    out.polygon = pts;
  }
  if (shape === "L" && g.lCut) {
    out.lCut = { widthMm: req(g.lCut.widthMm, 0, 200000, "uitsparing"), depthMm: req(g.lCut.depthMm, 0, 200000, "uitsparing") };
  } else if (shape === "L") {
    out.shape = "free"; // zonder L-parameters blijft de contour bruikbaar als vrije vorm
  }
  return out;
}

export function sanitizeVariant(v, i) {
  if (!v || typeof v !== "object" || !v.choices) throw new Error("Ongeldige variant.");
  return {
    id: id(v.id, `variant-${i}`),
    label: "ABC"[i],
    createdAt: typeof v.createdAt === "string" && !Number.isNaN(Date.parse(v.createdAt)) ? new Date(v.createdAt).toISOString() : new Date().toISOString(),
    choices: {
      fence: v.choices.fence ? sanitizeFenceChoices(v.choices.fence) : null,
      paving: v.choices.paving ? sanitizePavingChoices(v.choices.paving) : null
    }
  };
}

/**
 * Bouwt een volledig, veilig project uit onbetrouwbare invoer.
 * @throws {Error} met Nederlandse foutmelding bij ongeldige invoer.
 */
export function sanitizeDesign(raw) {
  if (!raw || typeof raw !== "object" || raw.format !== DESIGN_FORMAT || !raw.design) {
    throw new Error("Dit is geen Sealcleaning-ontwerpbestand.");
  }
  if (raw.schemaVersion !== SCHEMA_VERSION) {
    throw new Error("Dit ontwerp is gemaakt met een andere versie van de configurator en kan niet veilig worden geopend.");
  }
  const d = raw.design;
  const project = createEmptyProject();
  const serviceIds = SERVICES.map((s) => s.id);
  project.services = [...new Set(list(d.services, serviceIds.length, "diensten").filter((s) => serviceIds.includes(s)))];
  project.garden = sanitizeGarden(d.garden, project.garden);
  project.fence = project.services.includes("schutting") ? sanitizeFence(d.fence) : null;
  project.paving = project.services.includes("bestrating") ? sanitizePaving(d.paving) : null;
  if (d.removal && typeof d.removal === "object") {
    for (const k of ["existingFence", "removeFence", "existingPaving", "removePaving"]) project.removal[k] = d.removal[k] === true;
  }
  if (d.options && typeof d.options === "object") {
    project.options.route = oneOf(d.options.route, ROUTES, null);
    project.options.materialSupply = oneOf(d.options.materialSupply, SUPPLY, "advice-needed");
  }
  project.variants = list(d.variants, 3, "varianten").map(sanitizeVariant);
  return project;
}

function toBase64Url(text) {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromBase64Url(str) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

/** @returns {string|null} hash-waarde, of null als het ontwerp te groot is voor een link. */
export function encodeShare(project) {
  const encoded = toBase64Url(JSON.stringify(toDesignPayload(project)));
  return encoded.length > MAX_SHARE_CHARS ? null : encoded;
}

export function decodeShare(encoded) {
  if (typeof encoded !== "string" || encoded.length > MAX_SHARE_CHARS || !/^[A-Za-z0-9_-]+$/.test(encoded)) {
    throw new Error("Deze deellink is ongeldig of te lang.");
  }
  let raw;
  try { raw = JSON.parse(fromBase64Url(encoded)); } catch (e) { throw new Error("Deze deellink is beschadigd."); }
  return sanitizeDesign(raw);
}
