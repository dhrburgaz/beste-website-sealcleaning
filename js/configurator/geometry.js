/**
 * Zuivere geometrieberekeningen voor de tuinscene. Geen DOM, geen Three.js,
 * geen canvas — dezelfde output voedt zowel de 2D/SVG-weergave als de 3D-
 * weergave, zodat beide per ch.47 "exact dezelfde geometrie" tonen. Alles in
 * millimeters, oorsprong (0,0) is de tuinhoek per project-state.garden.
 *
 * Coördinaten: directionDeg 0 = langs +x, 90 = langs +z (zoals het
 * voorbeeld in SEAL_BUILD_BRIEF.md ch.18).
 */

function dirVector(directionDeg) {
  const rad = (directionDeg * Math.PI) / 180;
  return { dx: Math.cos(rad), dz: Math.sin(rad) };
}

function worldPoint(section, offsetMm) {
  const { dx, dz } = dirVector(section.directionDeg);
  return { xMm: section.start.xMm + dx * offsetMm, zMm: section.start.zMm + dz * offsetMm };
}

function posKey(p) {
  return `${Math.round(p.xMm)},${Math.round(p.zMm)}`;
}

/**
 * Berekent per schuttingzijde de gesloten lopen (tussen poorten), splitst elke
 * loop in volle panelen plus een eventueel passtuk, en levert gededupliceerde
 * paalposities. Poortopeningen krijgen een eigen segment zonder paneel.
 *
 * @returns {{ sections: Array, posts: Array<{xMm:number,zMm:number}>, errors: string[] }}
 *  sections[i] = { id, segments: Array<{kind:'panel'|'gate'|'fit', startMm, lengthMm, start:{xMm,zMm}, end:{xMm,zMm}, gateId?}> }
 */
export function computeFenceLayout(fence, system) {
  const errors = [];
  if (!fence || !system) return { sections: [], posts: [], errors };
  const panelWidthMm = system.nominalPanelWidthMm || 1800;
  const postSet = new Map();
  const outSections = [];

  const gatesBySection = new Map();
  for (const gate of fence.gates || []) {
    if (!gatesBySection.has(gate.sectionId)) gatesBySection.set(gate.sectionId, []);
    gatesBySection.get(gate.sectionId).push(gate);
  }

  for (const section of fence.sections || []) {
    const gates = (gatesBySection.get(section.id) || []).slice().sort((a, b) => a.offsetMm - b.offsetMm);
    const segments = [];
    let cursor = 0;

    const closeRun = (runStart, runEnd) => {
      const runLength = runEnd - runStart;
      if (runLength <= 0) return;
      const panelCount = Math.floor(runLength / panelWidthMm);
      const remainder = Math.round((runLength - panelCount * panelWidthMm) * 1e6) / 1e6;
      let offset = runStart;
      for (let i = 0; i < panelCount; i++) {
        segments.push(makeSegment(section, "panel", offset, panelWidthMm));
        offset += panelWidthMm;
      }
      if (remainder > 0.5) {
        segments.push(makeSegment(section, "fit", offset, remainder));
      }
    };

    for (const gate of gates) {
      closeRun(cursor, gate.offsetMm);
      const gateEnd = gate.offsetMm + gate.clearWidthMm;
      segments.push(makeSegment(section, "gate", gate.offsetMm, gate.clearWidthMm, gate.id));
      cursor = gateEnd;
    }
    closeRun(cursor, section.lengthMm);

    // Paalposities: bij elke segmentgrens (start van elk segment + einde van het laatste).
    for (const seg of segments) {
      registerPost(postSet, seg.start);
      registerPost(postSet, seg.end);
    }

    outSections.push({ id: section.id, segments });
  }

  return { sections: outSections, posts: [...postSet.values()], errors };
}

function makeSegment(section, kind, startMm, lengthMm, gateId) {
  return {
    kind,
    startMm,
    lengthMm,
    start: worldPoint(section, startMm),
    end: worldPoint(section, startMm + lengthMm),
    directionDeg: section.directionDeg,
    gateId: gateId || null
  };
}

function registerPost(map, point) {
  const key = posKey(point);
  if (!map.has(key)) map.set(key, point);
}

/**
 * Tegelraster voor één (niet-gedraaid) bestratingsvlak, gesneden op de
 * vlakgrens. pattern 'half-brick' verspringt om en om een halve tegellengte.
 * Gedraaide vlakken (rotationDeg != 0) worden nog niet ondersteund — zie
 * docs/IMPLEMENTATION_STATUS.md.
 *
 * @returns {Array<{xMm:number,zMm:number,lengthMm:number,widthMm:number,cut:boolean}>}
 */
export function computeTileLayout(area, tileLengthMm, tileWidthMm, pattern) {
  const tiles = [];
  if (!area || !tileLengthMm || !tileWidthMm) return tiles;
  const rows = Math.ceil(area.widthMm / tileWidthMm) + 1;
  for (let row = 0; row * tileWidthMm < area.widthMm; row++) {
    const rowOffsetMm = pattern === "half-brick" && row % 2 === 1 ? -(tileLengthMm / 2) : 0;
    let x = rowOffsetMm;
    while (x < area.lengthMm) {
      const cellX1 = Math.max(0, x);
      const cellX2 = Math.min(area.lengthMm, x + tileLengthMm);
      const cellZ1 = row * tileWidthMm;
      const cellZ2 = Math.min(area.widthMm, cellZ1 + tileWidthMm);
      const w = cellX2 - cellX1;
      const d = cellZ2 - cellZ1;
      if (w > 0 && d > 0) {
        tiles.push({
          xMm: area.position.xMm + cellX1,
          zMm: area.position.zMm + cellZ1,
          lengthMm: w,
          widthMm: d,
          cut: w < tileLengthMm - 0.5 || d < tileWidthMm - 0.5
        });
      }
      x += tileLengthMm;
    }
  }
  return tiles;
}

/* ---------------------------------------------------------------------- */
/* Tuincontour (rechthoek, L-vorm, vrije polygon)                          */
/* ---------------------------------------------------------------------- */

export function rectPolygon(widthMm, depthMm) {
  return [
    { xMm: 0, zMm: 0 }, { xMm: widthMm, zMm: 0 },
    { xMm: widthMm, zMm: depthMm }, { xMm: 0, zMm: depthMm }
  ];
}

/** L-vorm: rechthoek met de hoek rechtsonder (max x, max z) uitgespaard. */
export function lPolygon(widthMm, depthMm, cutWidthMm, cutDepthMm) {
  const cw = Math.min(Math.max(cutWidthMm, 0), widthMm - 100);
  const cd = Math.min(Math.max(cutDepthMm, 0), depthMm - 100);
  return [
    { xMm: 0, zMm: 0 }, { xMm: widthMm, zMm: 0 },
    { xMm: widthMm, zMm: depthMm - cd }, { xMm: widthMm - cw, zMm: depthMm - cd },
    { xMm: widthMm - cw, zMm: depthMm }, { xMm: 0, zMm: depthMm }
  ];
}

/** Shoelace-formule; altijd positief, in mm². */
export function polygonAreaMm2(points) {
  if (!points || points.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    sum += a.xMm * b.zMm - b.xMm * a.zMm;
  }
  return Math.abs(sum) / 2;
}

export function polygonBounds(points) {
  let minX = Infinity, minZ = Infinity, maxX = -Infinity, maxZ = -Infinity;
  for (const p of points || []) {
    minX = Math.min(minX, p.xMm); minZ = Math.min(minZ, p.zMm);
    maxX = Math.max(maxX, p.xMm); maxZ = Math.max(maxZ, p.zMm);
  }
  return { minX, minZ, maxX, maxZ };
}

function orient(a, b, c) {
  const v = (b.xMm - a.xMm) * (c.zMm - a.zMm) - (b.zMm - a.zMm) * (c.xMm - a.xMm);
  return Math.abs(v) < 1e-6 ? 0 : v > 0 ? 1 : -1;
}
function onSegment(a, b, p) {
  return Math.min(a.xMm, b.xMm) <= p.xMm && p.xMm <= Math.max(a.xMm, b.xMm) &&
    Math.min(a.zMm, b.zMm) <= p.zMm && p.zMm <= Math.max(a.zMm, b.zMm);
}
function segmentsIntersect(p1, p2, q1, q2) {
  const o1 = orient(p1, p2, q1), o2 = orient(p1, p2, q2), o3 = orient(q1, q2, p1), o4 = orient(q1, q2, p2);
  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && onSegment(p1, p2, q1)) return true;
  if (o2 === 0 && onSegment(p1, p2, q2)) return true;
  if (o3 === 0 && onSegment(q1, q2, p1)) return true;
  if (o4 === 0 && onSegment(q1, q2, p2)) return true;
  return false;
}

/**
 * Controleert of een contour een geldig, gesloten vlak is.
 * @returns {string|null} Nederlandse uitleg van het probleem, of null als geldig.
 */
export function findPolygonProblem(points) {
  const n = points ? points.length : 0;
  if (n < 3) return "Een tuincontour heeft minimaal 3 hoekpunten nodig.";
  for (let i = 0; i < n; i++) {
    const a = points[i], b = points[(i + 1) % n];
    if (Math.hypot(b.xMm - a.xMm, b.zMm - a.zMm) < 10) {
      return `Hoekpunt ${i + 1} en ${((i + 1) % n) + 1} liggen op dezelfde plek. Verschuif of verwijder er één.`;
    }
  }
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const adjacent = j === i + 1 || (i === 0 && j === n - 1);
      if (adjacent) continue;
      if (segmentsIntersect(points[i], points[(i + 1) % n], points[j], points[(j + 1) % n])) {
        return `De zijden ${i + 1}–${((i + 1) % n) + 1} en ${j + 1}–${((j + 1) % n) + 1} kruisen elkaar. Een tuin kan zichzelf niet doorsnijden — verschuif een hoekpunt zodat de rand rondloopt zonder kruising.`;
      }
    }
  }
  if (polygonAreaMm2(points) < 1_000_000) return "De contour is kleiner dan 1 m². Controleer de maten.";
  return null;
}

/** Garden → contourpunten; rechthoek zonder polygon levert een rechthoekpolygon. */
export function gardenPolygon(garden) {
  if (garden && Array.isArray(garden.polygon) && garden.polygon.length >= 3) return garden.polygon;
  return rectPolygon(garden?.widthMm || 8000, garden?.depthMm || 6000);
}
