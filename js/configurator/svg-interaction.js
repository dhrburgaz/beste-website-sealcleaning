/**
 * Selecteren en slepen in de 2D-tekening. Werkt op elementen met data-drag
 * (zie svg-scene.js). Muis/pen: direct selecteren en slepen. Aanraking: een
 * eerste tik selecteert alleen; pas een geselecteerd object is versleepbaar.
 * Zo veroorzaakt scrollen over de tekening op een telefoon nooit een
 * onbedoelde verplaatsing (E08).
 */

function svgPointToMm(svg, clientX, clientY) {
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const pt = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
  return {
    xMm: pt.x + parseFloat(svg.dataset.originX || "0"),
    zMm: pt.y + parseFloat(svg.dataset.originZ || "0")
  };
}

/**
 * @param {SVGSVGElement} svg
 * @param {{
 *   getSelectedId: () => string|null,
 *   onSelect: (id: string|null) => void,
 *   onDragMove: (target: {kind:string,id:string,index:number|null}, deltaMm: {dxMm:number,dzMm:number}) => void,
 *   onDragEnd: (moved: boolean) => void
 * }} handlers
 */
export function attachSvgInteraction(svg, handlers) {
  let drag = null;

  svg.addEventListener("pointerdown", (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const handle = e.target.closest && e.target.closest("[data-drag]");
    if (!handle) {
      if (handlers.getSelectedId()) handlers.onSelect(null);
      return;
    }
    const id = handle.dataset.id;
    const alreadySelected = handlers.getSelectedId() === id;
    if (!alreadySelected) handlers.onSelect(id);
    if (e.pointerType === "touch" && !alreadySelected) return;
    const start = svgPointToMm(svg, e.clientX, e.clientY);
    if (!start) return;
    drag = {
      pointerId: e.pointerId,
      start,
      moved: false,
      target: { kind: handle.dataset.drag, id, index: handle.dataset.index != null ? Number(handle.dataset.index) : null }
    };
    svg.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  svg.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const now = svgPointToMm(svg, e.clientX, e.clientY);
    if (!now) return;
    const dxMm = now.xMm - drag.start.xMm;
    const dzMm = now.zMm - drag.start.zMm;
    if (!drag.moved && Math.hypot(dxMm, dzMm) < 40) return;
    drag.moved = true;
    handlers.onDragMove(drag.target, { dxMm, dzMm });
  });

  const finish = (e) => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    const moved = drag.moved;
    drag = null;
    try { svg.releasePointerCapture(e.pointerId); } catch (err) { /* al vrijgegeven */ }
    handlers.onDragEnd(moved);
  };
  svg.addEventListener("pointerup", finish);
  svg.addEventListener("pointercancel", finish);
}

export function snapMm(valueMm, stepMm) {
  if (!stepMm) return Math.round(valueMm);
  return Math.round(valueMm / stepMm) * stepMm;
}
