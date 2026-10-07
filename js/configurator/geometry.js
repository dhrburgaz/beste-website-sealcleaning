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
