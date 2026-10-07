/**
 * 2D/SVG bovenaanzicht van de tuinscene. Volledig zelfstandig bruikbaar
 * (ch.16: zonder WebGL2 blijft de configurator volledig bruikbaar met een
 * exacte 2D/SVG preview). Tekent uit dezelfde geometry.js-output als de
 * 3D-weergave, dus identieke maten.
 */
import { computeFenceLayout, computeTileLayout } from "./geometry.js";
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

/**
 * @param {SVGSVGElement} svg leeg <svg>-element om te vullen
 * @param {object} project projectstate (zie js/project-state.js)
 * @param {{paddingMm?:number}} [opts]
 */
export function renderScene(svg, project, opts) {
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  const garden = project.garden || {};
  const widthMm = garden.widthMm || 8000;
  const depthMm = garden.depthMm || 6000;
  const padding = (opts && opts.paddingMm) ?? 800;

  const viewW = widthMm + padding * 2;
  const viewH = depthMm + padding * 2;
  svg.setAttribute("viewBox", `0 0 ${viewW} ${viewH}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.setAttribute("role", "img");
  svg.setAttribute(
    "aria-label",
    `Bovenaanzicht van de tuin, ${formatMeters(widthMm, 2)} bij ${formatMeters(depthMm, 2)}.` +
      (project.fence ? " Inclusief schutting." : "") +
      (project.paving ? " Inclusief bestrating." : "")
  );

  const toX = (xMm) => xMm + padding;
  const toY = (zMm) => zMm + padding;

  const group = el("g", { class: "scene-root" });
  svg.appendChild(group);

  // Tuingrens
  group.appendChild(
    el("rect", {
      x: toX(0), y: toY(0), width: widthMm, height: depthMm,
      class: "scene-garden-outline"
    })
  );
  group.appendChild(text(toX(widthMm / 2), toY(-80), formatMeters(widthMm, 2), { "text-anchor": "middle" }));
  group.appendChild(
    text(toX(-80), toY(depthMm / 2), formatMeters(depthMm, 2), {
      "text-anchor": "middle",
      transform: `rotate(-90 ${toX(-80)} ${toY(depthMm / 2)})`
    })
  );

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

  return svg;
}
