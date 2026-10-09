/**
 * 2D/SVG bovenaanzicht van de tuinscene. Volledig zelfstandig bruikbaar
 * (ch.16: zonder WebGL2 blijft de configurator volledig bruikbaar met een
 * exacte 2D/SVG preview). Tekent uit dezelfde geometry.js-output als de
 * 3D-weergave, dus identieke maten.
 */
import { computeFenceLayout, computeTileLayout, gardenPolygon, polygonBounds, polygonAreaMm2 } from "./geometry.js";
import { getFenceSystem } from "../../data/fence-systems.js";
import { formatMeters, formatM2 } from "../project-state.js";

const SVG_NS = "http://www.w3.org/2000/svg";

function el(tag, attrs, children) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs || {})) node.setAttribute(k, v);
  for (const child of children || []) node.appendChild(child);
  return node;
}

function text(x, y, content, extraAttrs) {
  const t = el("text", { x, y, class: "scene-label", ...extraAttrs });
  t.textContent = content;
  return t;
}

/** Begrenzing van alles wat getekend wordt (tuin + schutting + bestrating), in mm. */
function sceneBounds(project) {
  const b = polygonBounds(gardenPolygon(project.garden || {}));
  const grow = (x, z) => { b.minX = Math.min(b.minX, x); b.minZ = Math.min(b.minZ, z); b.maxX = Math.max(b.maxX, x); b.maxZ = Math.max(b.maxZ, z); };
  for (const s of project.fence?.sections || []) {
    const rad = (s.directionDeg * Math.PI) / 180;
    grow(s.start.xMm, s.start.zMm);
    grow(s.start.xMm + Math.cos(rad) * s.lengthMm, s.start.zMm + Math.sin(rad) * s.lengthMm);
  }
  for (const a of project.paving?.areas || []) {
    grow(a.position.xMm, a.position.zMm);
    grow(a.position.xMm + a.lengthMm, a.position.zMm + a.widthMm);
  }
  return b;
}

/**
 * @param {SVGSVGElement} svg leeg <svg>-element om te vullen
 * @param {object} project projectstate (zie js/project-state.js)
 * @param {{paddingMm?:number, gridMm?:number, selectedId?:string|null, editable?:boolean}} [opts]
 *  editable: tekent sleepbare handgrepen (data-drag) voor bestratingsvlakken en
 *  hoekpunten van een vrije contour. Het SVG-element krijgt data-origin-x/z zodat
 *  svg-coördinaten terug te rekenen zijn naar projectmillimeters.
 */
export function renderScene(svg, project, opts) {
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const garden = project.garden || {};
  const padding = (opts && opts.paddingMm) ?? 800;
  const selectedId = opts?.selectedId || null;
  const editable = !!opts?.editable;
  const polygon = gardenPolygon(garden);
  const bounds = sceneBounds(project);
  const widthMm = bounds.maxX - bounds.minX;
  const depthMm = bounds.maxZ - bounds.minZ;
  const originX = bounds.minX - padding;
  const originZ = bounds.minZ - padding;

  const viewW = widthMm + padding * 2;
  const viewH = depthMm + padding * 2;
  svg.setAttribute("viewBox", `0 0 ${viewW} ${viewH}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.setAttribute("role", "img");
  svg.dataset.originX = String(originX);
  svg.dataset.originZ = String(originZ);
  const gardenArea = polygonAreaMm2(polygon) / 1_000_000;
  svg.setAttribute(
    "aria-label",
    `Bovenaanzicht van de tuin, circa ${formatM2(Math.round(gardenArea * 10) / 10, 1)}` +
      (garden.shape === "free" ? `, vrije contour met ${polygon.length} hoekpunten` : garden.shape === "L" ? ", L-vorm" : "") +
      "." + (project.fence ? " Inclusief schutting." : "") + (project.paving ? " Inclusief bestrating." : "")
  );

  const toX = (xMm) => xMm - originX;
  const toY = (zMm) => zMm - originZ;

  const group = el("g", { class: "scene-root" });
  svg.appendChild(group);

  // Raster (alleen zichtbaar als snap aan staat)
  const gridMm = opts?.gridMm || 0;
  if (gridMm > 0) {
    const gridGroup = el("g", { class: "scene-grid", "aria-hidden": "true" });
    const startX = Math.floor(originX / gridMm) * gridMm;
    const startZ = Math.floor(originZ / gridMm) * gridMm;
    const lines = (viewW / gridMm) + (viewH / gridMm);
    if (lines < 600) {
      for (let x = startX; x <= originX + viewW; x += gridMm) {
        gridGroup.appendChild(el("line", { x1: toX(x), y1: 0, x2: toX(x), y2: viewH, class: x % 1000 === 0 ? "scene-grid-line scene-grid-major" : "scene-grid-line" }));
      }
      for (let z = startZ; z <= originZ + viewH; z += gridMm) {
        gridGroup.appendChild(el("line", { x1: 0, y1: toY(z), x2: viewW, y2: toY(z), class: z % 1000 === 0 ? "scene-grid-line scene-grid-major" : "scene-grid-line" }));
      }
    }
    group.appendChild(gridGroup);
  }

  // Tuingrens
  const pts = polygon.map((p) => `${toX(p.xMm)},${toY(p.zMm)}`).join(" ");
  group.appendChild(el("polygon", { points: pts, class: "scene-garden-fill" }));
  group.appendChild(el("polygon", { points: pts, class: "scene-garden-outline" }));
  if (garden.shape === "free" || garden.shape === "L") {
    polygon.forEach((p, i) => {
      const q = polygon[(i + 1) % polygon.length];
      const len = Math.hypot(q.xMm - p.xMm, q.zMm - p.zMm);
      if (len < 600) return;
      group.appendChild(text(toX((p.xMm + q.xMm) / 2), toY((p.zMm + q.zMm) / 2) - 90, formatMeters(len, 2), { "text-anchor": "middle", class: "scene-label scene-label-edge" }));
    });
  } else {
    const gw = garden.widthMm || 8000, gd = garden.depthMm || 6000;
    group.appendChild(text(toX(gw / 2), toY(-80), formatMeters(gw, 2), { "text-anchor": "middle" }));
    group.appendChild(
      text(toX(-80), toY(gd / 2), formatMeters(gd, 2), {
        "text-anchor": "middle",
        transform: `rotate(-90 ${toX(-80)} ${toY(gd / 2)})`
      })
    );
  }

  // Bestrating
  if (project.paving && Array.isArray(project.paving.areas)) {
    for (const area of project.paving.areas) {
      const tiles = computeTileLayout(
        area,
        project.paving.nominalTileLengthMm || 600,
        project.paving.nominalTileWidthMm || 600,
        project.paving.pattern || "straight"
      );
      const areaGroup = el("g", { class: "scene-paving-area", "data-area-id": area.id });
      for (const tile of tiles) {
        areaGroup.appendChild(
          el("rect", {
            x: toX(tile.xMm), y: toY(tile.zMm), width: tile.lengthMm, height: tile.widthMm,
            class: tile.cut ? "scene-tile scene-tile-cut" : "scene-tile"
          })
        );
      }
      group.appendChild(areaGroup);
      const hit = el("rect", {
        x: toX(area.position.xMm), y: toY(area.position.zMm), width: area.lengthMm, height: area.widthMm,
        class: area.id === selectedId ? "scene-hit scene-selected" : "scene-hit"
      });
      if (editable) { hit.dataset.drag = "area"; hit.dataset.id = area.id; }
      group.appendChild(hit);
      const labelX = toX(area.position.xMm + area.lengthMm / 2);
      const labelY = toY(area.position.zMm + area.widthMm / 2);
      const m2 = Math.round(((area.lengthMm * area.widthMm) / 1_000_000) * 100) / 100;
      group.appendChild(text(labelX, labelY, formatM2(m2, 1), { "text-anchor": "middle", class: "scene-label scene-label-area" }));
    }
  }

  // Schutting
  if (project.fence && Array.isArray(project.fence.sections)) {
    const system = getFenceSystem(project.fence.systemId) || { nominalPanelWidthMm: 1800 };
    const layout = computeFenceLayout(project.fence, system);
    const fenceGroup = el("g", { class: "scene-fence" });

    for (const section of layout.sections) {
      for (const seg of section.segments) {
        const x1 = toX(seg.start.xMm), y1 = toY(seg.start.zMm);
        const x2 = toX(seg.end.xMm), y2 = toY(seg.end.zMm);
        if (seg.kind === "gate") {
          fenceGroup.appendChild(el("line", { x1, y1, x2, y2, class: "scene-gate-opening" }));
        } else {
          fenceGroup.appendChild(
            el("line", {
              x1, y1, x2, y2,
              class: seg.kind === "fit" ? "scene-fence-segment scene-fence-fit" : "scene-fence-segment"
            })
          );
        }
      }
      const totalLengthMm = section.segments.reduce((sum, s) => sum + s.lengthMm, 0);
      const mid = section.segments[Math.floor(section.segments.length / 2)];
      if (mid) {
        const labelX = toX((mid.start.xMm + mid.end.xMm) / 2);
        const labelY = toY((mid.start.zMm + mid.end.zMm) / 2) - 120;
        fenceGroup.appendChild(
          text(labelX, labelY, `${section.id}: ${formatMeters(totalLengthMm, 2)}`, {
            "text-anchor": "middle",
            class: "scene-label scene-label-fence"
          })
        );
      }
    }

    for (const post of layout.posts) {
      fenceGroup.appendChild(el("circle", { cx: toX(post.xMm), cy: toY(post.zMm), r: 45, class: "scene-post" }));
    }

    group.appendChild(fenceGroup);
  }

  // Bestaande objecten (existing-keep / existing-remove)
  for (const obj of project.existingObjects || []) {
    if (!obj.footprint) continue;
    const { xMm, zMm, lengthMm, widthMm: wMm } = obj.footprint;
    group.appendChild(
      el("rect", {
        x: toX(xMm), y: toY(zMm), width: lengthMm, height: wMm,
        class: obj.status === "existing-remove" ? "scene-existing scene-existing-remove" : "scene-existing scene-existing-keep"
      })
    );
    group.appendChild(
      text(toX(xMm + lengthMm / 2), toY(zMm + wMm / 2), obj.label || obj.type, {
        "text-anchor": "middle",
        class: "scene-label scene-label-existing"
      })
    );
  }

  // Hoekpunt-handgrepen voor vrije contour (bovenop alles). Grootte in
  // schermpixels: een raakvlak van ±44px, ongeacht de tuinmaat (E08).
  if (editable && garden.shape === "free") {
    const rect = svg.getBoundingClientRect();
    const mmPerPx = rect.width > 0 && rect.height > 0 ? Math.max(viewW / rect.width, viewH / rect.height) : 25;
    polygon.forEach((p, i) => {
      const id = `vertex-${i}`;
      const selected = id === selectedId;
      group.appendChild(el("circle", {
        cx: toX(p.xMm), cy: toY(p.zMm), r: (selected ? 13 : 10) * mmPerPx,
        "stroke-width": 2.5 * mmPerPx,
        class: selected ? "scene-vertex scene-selected" : "scene-vertex"
      }));
      group.appendChild(text(toX(p.xMm), toY(p.zMm) + 4 * mmPerPx, String(i + 1), {
        "text-anchor": "middle", "font-size": 11 * mmPerPx, class: "scene-label scene-label-vertex"
      }));
      const hit = el("circle", { cx: toX(p.xMm), cy: toY(p.zMm), r: 22 * mmPerPx, class: "scene-vertex-hit" });
      hit.dataset.drag = "vertex";
      hit.dataset.id = id;
      hit.dataset.index = String(i);
      hit.setAttribute("aria-hidden", "true");
      group.appendChild(hit);
    });
  }

  return svg;
}
