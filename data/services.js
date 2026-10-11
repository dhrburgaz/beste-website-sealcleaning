/**
 * Canonieke dienst-definities. Gebruikt door de configurator (stap 1,
 * "Wat wilt u laten uitvoeren?" per ch.12) en kan later de hardcoded
 * dienstenlijst in index.html/footer vervangen zonder gedragswijziging.
 */

export const SERVICES = [
  { id: "tuinaanleg", label: "Complete tuinaanleg", path: "tuinaanleg/", needsGeometryStep: true, configuratorKind: "garden" },
  { id: "tuinrenovatie", label: "Tuinrenovatie", path: "tuinrenovatie/", needsGeometryStep: true, configuratorKind: "garden" },
  { id: "bestrating", label: "Bestrating", path: "bestrating/", needsGeometryStep: true, configuratorKind: "paving" },
  { id: "schutting", label: "Schutting", path: "schuttingen/", needsGeometryStep: true, configuratorKind: "fence" },
  { id: "tuinonderhoud", label: "Tuinonderhoud", path: "tuinonderhoud/", needsGeometryStep: false, configuratorKind: "intake" },
  { id: "snoeiwerk", label: "Snoeiwerk", path: "snoeiwerk/", needsGeometryStep: false, configuratorKind: "intake" },
  { id: "kunstgras", label: "Kunstgras / gazon", path: "tuinonderhoud/", needsGeometryStep: false, configuratorKind: "intake" },
  { id: "periodiek", label: "Periodiek onderhoud", path: "periodiek-tuinonderhoud/", needsGeometryStep: false, configuratorKind: "intake" },
  { id: "anders", label: "Anders", path: null, needsGeometryStep: false, configuratorKind: "intake" }
];

export function getService(serviceId) {
  return SERVICES.find((s) => s.id === serviceId) || null;
}

/** Dienst-id's die de gecombineerde tuinscene (schutting + bestrating) gebruiken. */
export const GARDEN_SCENE_SERVICE_IDS = ["tuinaanleg", "tuinrenovatie", "bestrating", "schutting"];
