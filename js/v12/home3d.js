/**
 * Homepage 3D-voorbeeld: laadt de bestaande three-scene pas wanneer de sectie in beeld komt
 * en alleen met WebGL2. Zonder WebGL of bij een fout blijft een tweedimensionaal voorbeeld
 * (zelfde brongegevens) zichtbaar. Dit is een voorbeeldtuin, geen klantontwerp.
 */
import { buildDemoProject } from "./demo-project.js";

const host = document.querySelector("[data-home-3d]");
if (host) {
  const status = document.querySelector("[data-home-3d-status]");
  const project = buildDemoProject();
  const note = (t) => { if (status) status.textContent = t; };

  const showFlat = async () => {
    try {
      const { renderScene } = await import("../configurator/svg-scene.js");
      const svg = host.querySelector("[data-home-3d-flat]");
      if (svg) { renderScene(svg, project, { showDimensions: false }); svg.hidden = false; }
    } catch (e) { /* de poster blijft staan */ }
  };

  const start = async () => {
    try {
      const mod = await import("../configurator/three-scene.js");
      if (!mod.isWebGL2Supported()) { note("Voorbeeld in 2D: 3D wordt op dit apparaat niet ondersteund."); return showFlat(); }
      const scene = mod.createThreeScene(host.querySelector("[data-home-3d-canvas]"), project, { scenic: true });
      scene.update(project);
      
      host.classList.add("is-3d");
      note("Voorbeeld in 3D, geen echt project. Sleep om rond te kijken.");
      const btn = (sel, fn) => { const b = document.querySelector(sel); if (b) b.addEventListener("click", fn); };
      btn("[data-3d-top]", () => scene.setView("top"));
      btn("[data-3d-iso]", () => scene.setView("iso"));
      btn("[data-3d-reset]", () => scene.resetCamera());
    } catch (e) {
      note("Voorbeeld in 2D: het 3D-voorbeeld kon niet laden.");
      showFlat();
    }
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); start(); }
    }, { rootMargin: "200px" });
    io.observe(host);
  } else start();
}
