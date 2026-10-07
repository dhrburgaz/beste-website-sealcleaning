/**
 * 3D-weergave van de tuinscene (schutting + bestrating), op dezelfde
 * geometry.js-berekeningen als de 2D/SVG-weergave. Wordt alleen geladen na
 * bewuste opening (ch.16/27 — geen 3D-bundle op elke dienstpagina) en alleen
 * wanneer WebGL2 beschikbaar is (zie detectWebGL2() in app.js, vóór de
 * dynamische import van deze module).
 *
 * Three.js is lokaal gevendord (vendor/three/, MIT-licentie, versie 0.186.1,
 * zie vendor/three/NOTICE.md) en wordt via een importmap als "three"
 * opgelost — geen ongepinde CDN-import.
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { computeFenceLayout, computeTileLayout } from "./geometry.js";
import { getFenceSystem, getFenceMaterialPreset } from "../../data/fence-systems.js";
import { getPavingColorPreset } from "../../data/paving-products.js";

const MM = 0.001; // schaal: 1 wereldeenheid = 1 meter; alle state is mm.
const IDLE_STOP_MS = 600;

export function isWebGL2Supported() {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && canvas.getContext("webgl2"));
  } catch (e) {
    return false;
  }
}

/**
 * @param {HTMLElement} host container die een <canvas> krijgt
 * @param {object} project projectstate
 * @returns {{update:Function, setView:Function, resetCamera:Function, exportPng:Function, dispose:Function}}
 */
export function createThreeScene(host, project) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true"); // de scene-svg blijft de toegankelijke beschrijving (ch.27)
  host.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  const pixelRatioCap = /Mobi|Android/i.test(navigator.userAgent) ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap));
  renderer.setClearColor(0xe9dfc9, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 500);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 3;
  controls.maxDistance = 60;
  controls.maxPolarAngle = Math.PI * 0.49; // niet onder de grond kunnen kijken
  controls.target.set(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.65));
  const sun = new THREE.DirectionalLight(0xffffff, 0.9);
  sun.position.set(8, 12, 6);
  scene.add(sun);

  const dynamicGroup = new THREE.Group();
  scene.add(dynamicGroup);

  const disposables = new Set();
  function track(obj) {
    disposables.add(obj);
    return obj;
  }

  let frameRequested = false;
  let idleTimer = null;
  let running = false;

  function renderOnce() {
    const rect = host.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const w = rect.width, h = rect.height;
      if (canvas.width !== Math.round(w * renderer.getPixelRatio()) || canvas.height !== Math.round(h * renderer.getPixelRatio())) {
        renderer.setSize(w, h, true);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    }
    renderer.render(scene, camera);
  }

  function loop() {
    frameRequested = false;
    const changed = controls.update();
    renderOnce();
    if (changed) scheduleFrame();
  }

  function scheduleFrame() {
    if (!running) return;
    if (idleTimer) clearTimeout(idleTimer);
    if (!frameRequested) {
      frameRequested = true;
      requestAnimationFrame(loop);
    }
    idleTimer = setTimeout(() => {
      /* geen render meer nodig; volgende controls.update() start de lus opnieuw via 'change' */
    }, IDLE_STOP_MS);
  }

  controls.addEventListener("change", scheduleFrame);

  function onVisibilityChange() {
    running = document.visibilityState === "visible";
    if (running) scheduleFrame();
  }
  document.addEventListener("visibilitychange", onVisibilityChange);
  running = document.visibilityState === "visible";

  const resizeObserver = new ResizeObserver(() => scheduleFrame());
  resizeObserver.observe(host);

  function clearGroup(group) {
    for (const child of [...group.children]) {
      group.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        (Array.isArray(child.material) ? child.material : [child.material]).forEach((m) => m.dispose());
      }
    }
  }

  function buildFence(fence) {
    if (!fence || !Array.isArray(fence.sections) || fence.sections.length === 0) return;
    const system = getFenceSystem(fence.systemId) || { nominalPanelWidthMm: 1800, postThicknessMm: 90, hasBasePlate: false };
    const preset = getFenceMaterialPreset(fence.materialPresetId);
    const heightM = (fence.heightMm || 1800) * MM;
    const baseM = system.hasBasePlate ? (system.basePlateHeightMm || 0) * MM : 0;
    const panelColor = preset ? new THREE.Color(preset.colorHex) : new THREE.Color(0xc9a876);
    const panelMaterial = track(
      new THREE.MeshStandardMaterial({
        color: panelColor,
        roughness: 0.85,
        transparent: !!preset?.transparent,
        opacity: preset?.transparent ? 0.35 : 1
      })
    );
    const fitMaterial = track(new THREE.MeshStandardMaterial({ color: 0x8a5a3b, roughness: 0.85 }));
    const postMaterial = track(new THREE.MeshStandardMaterial({ color: 0x3a2f22, roughness: 0.9 }));

    const layout = computeFenceLayout(fence, system);
    const panelThicknessM = 0.07;

    for (const section of layout.sections) {
      for (const seg of section.segments) {
        if (seg.kind === "gate") continue; // opening blijft open; geen vast paneel
        const lengthM = seg.lengthMm * MM;
        const geom = track(new THREE.BoxGeometry(lengthM, heightM, panelThicknessM));
        const mesh = new THREE.Mesh(geom, seg.kind === "fit" ? fitMaterial : panelMaterial);
        const midX = ((seg.start.xMm + seg.end.xMm) / 2) * MM;
        const midZ = ((seg.start.zMm + seg.end.zMm) / 2) * MM;
        mesh.position.set(midX, baseM + heightM / 2, midZ);
        mesh.rotation.y = -(seg.directionDeg * Math.PI) / 180;
        dynamicGroup.add(mesh);
      }
    }

    const postSize = (system.postThicknessMm || 90) * MM;
    for (const post of layout.posts) {
      const geom = track(new THREE.BoxGeometry(postSize, heightM + baseM + 0.15, postSize));
      const mesh = new THREE.Mesh(geom, postMaterial);
      mesh.position.set(post.xMm * MM, (heightM + baseM) / 2, post.zMm * MM);
      dynamicGroup.add(mesh);
    }

    if (baseM > 0) {
      for (const section of layout.sections) {
        for (const seg of section.segments) {
          if (seg.kind === "gate") continue;
          const lengthM = seg.lengthMm * MM;
          const geom = track(new THREE.BoxGeometry(lengthM, baseM, 0.2));
          const mesh = new THREE.Mesh(geom, track(new THREE.MeshStandardMaterial({ color: 0x9a9a92, roughness: 0.95 })));
          const midX = ((seg.start.xMm + seg.end.xMm) / 2) * MM;
          const midZ = ((seg.start.zMm + seg.end.zMm) / 2) * MM;
          mesh.position.set(midX, baseM / 2, midZ);
          mesh.rotation.y = -(seg.directionDeg * Math.PI) / 180;
          dynamicGroup.add(mesh);
        }
      }
    }
  }

  function buildPaving(paving) {
    if (!paving || !Array.isArray(paving.areas) || paving.areas.length === 0) return;
    const preset = getPavingColorPreset(paving.colorPresetId);
    const color = preset ? new THREE.Color(preset.colorHex) : new THREE.Color(0xc7c6c0);
    const material = track(new THREE.MeshStandardMaterial({ color, roughness: 0.9 }));
    const thicknessM = 0.04;

    let allTiles = [];
    for (const area of paving.areas) {
      const tiles = computeTileLayout(area, paving.nominalTileLengthMm || 600, paving.nominalTileWidthMm || 600, paving.pattern || "straight");
      allTiles = allTiles.concat(tiles);
    }
    if (allTiles.length === 0) return;

    const unitGeom = track(new THREE.BoxGeometry(1, 1, 1));
    const instanced = new THREE.InstancedMesh(unitGeom, material, allTiles.length);
    const m = new THREE.Matrix4();
    allTiles.forEach((tile, i) => {
      const cx = (tile.xMm + tile.lengthMm / 2) * MM;
      const cz = (tile.zMm + tile.widthMm / 2) * MM;
      m.compose(
        new THREE.Vector3(cx, thicknessM / 2, cz),
        new THREE.Quaternion(),
        new THREE.Vector3(tile.lengthMm * MM - 0.004, thicknessM, tile.widthMm * MM - 0.004)
      );
      instanced.setMatrixAt(i, m);
    });
    instanced.instanceMatrix.needsUpdate = true;
    dynamicGroup.add(instanced);
    track(instanced.geometry);
  }

  function buildGardenGround(garden) {
    const widthM = (garden?.widthMm || 8000) * MM;
    const depthM = (garden?.depthMm || 6000) * MM;
    const geom = track(new THREE.PlaneGeometry(widthM, depthM));
    const material = track(new THREE.MeshStandardMaterial({ color: 0x9fb088, roughness: 1 }));
    const ground = new THREE.Mesh(geom, material);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(widthM / 2, -0.01, depthM / 2);
    dynamicGroup.add(ground);

    const grid = track(new THREE.GridHelper(Math.max(widthM, depthM) * 1.4, Math.round(Math.max(widthM, depthM))));
    grid.position.set(widthM / 2, 0, depthM / 2);
    dynamicGroup.add(grid);

    return { widthM, depthM };
  }

  function update(nextProject) {
    project = nextProject;
    for (const obj of disposables) {
      if (obj.dispose) obj.dispose();
    }
    disposables.clear();
    clearGroup(dynamicGroup);

    const { widthM, depthM } = buildGardenGround(project.garden);
    buildFence(project.fence);
    buildPaving(project.paving);

    if (!controls.target.lengthSq() && widthM && depthM) {
      controls.target.set(widthM / 2, 0.3, depthM / 2);
      camera.position.set(widthM / 2 + widthM * 0.7, Math.max(widthM, depthM) * 0.6, depthM / 2 + depthM * 0.9);
    }
    scheduleFrame();
  }

  function setView(viewName) {
    const target = controls.target.clone();
    const dist = Math.max(camera.position.distanceTo(target), 6);
    if (viewName === "top") {
      camera.position.set(target.x, dist * 1.3, target.z + 0.001);
    } else if (viewName === "front") {
      camera.position.set(target.x, target.y + dist * 0.25, target.z + dist * 1.1);
    } else {
      camera.position.set(target.x + dist * 0.7, dist * 0.55, target.z + dist * 0.9);
    }
    controls.update();
    scheduleFrame();
  }

  function resetCamera() {
    update(project);
  }

  /**
   * Render + lees de canvas direct binnen dezelfde taak (vóór de volgende
   * clear/swap). Dat voorkomt dat preserveDrawingBuffer permanent aan moet
   * staan (ch.16) terwijl toBlob() toch het zojuist gerenderde frame pakt.
   */
  function exportPng(brandLabel) {
    return new Promise((resolve, reject) => {
      renderOnce();
      canvas.toBlob((rawBlob) => {
        if (!rawBlob) return reject(new Error("Export mislukt."));
        compositeWithBranding(rawBlob, brandLabel).then(resolve, reject);
      }, "image/png");
    });
  }

  async function compositeWithBranding(rawBlob, brandLabel) {
    const bitmap = await createImageBitmap(rawBlob);
    const out = document.createElement("canvas");
    out.width = bitmap.width;
    out.height = bitmap.height;
    const ctx = out.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);
    const barHeight = Math.round(bitmap.height * 0.07);
    ctx.fillStyle = "rgba(27,42,30,0.88)";
    ctx.fillRect(0, bitmap.height - barHeight, bitmap.width, barHeight);
    ctx.fillStyle = "#f3ede1";
    ctx.font = `${Math.round(barHeight * 0.42)}px sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillText(
      (brandLabel || "Ontworpen met Sealcleaning · sealcleaning.nl"),
      16,
      bitmap.height - barHeight / 2
    );
    return new Promise((resolve, reject) => {
      out.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Export mislukt."))), "image/png");
    });
  }

  function dispose() {
    running = false;
    if (idleTimer) clearTimeout(idleTimer);
    controls.removeEventListener("change", scheduleFrame);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    resizeObserver.disconnect();
    controls.dispose();
    clearGroup(dynamicGroup);
    for (const obj of disposables) {
      if (obj.dispose) obj.dispose();
    }
    disposables.clear();
    renderer.dispose();
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  }

  update(project);
  setView("3d");

  return { update, setView, resetCamera, exportPng, dispose };
}
