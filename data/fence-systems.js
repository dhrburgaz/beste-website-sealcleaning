/**
 * Generieke schutting-systemen en materiaalpresets voor de configurator.
 * Per docs/SEAL_BUILD_BRIEF.md hoofdstuk 13: dit zijn generieke visualisatieopties,
 * geen officiële productspecificaties, totdat een werkelijk product is gekoppeld
 * (priceRefId / sourceUrl blijven dan null). Toon ze als zodanig in de UI.
 */

export const FENCE_SHAPES = ["I", "L-left", "L-right", "U", "multi"];

export const FENCE_HEIGHTS_MM = [1000, 1200, 1500, 1800, 2000];

export const FENCE_SYSTEMS = [
  {
    id: "generic-wood",
    buildUp: "Houten palen in de grond of op poeren, houten schermen.",
    maintenance: "Periodiek beitsen/oliën om kleur en bescherming te behouden; frequentie hangt af van houtsoort en ligging.",
    label: "Volledig hout",
    description: "Houten planken op houten palen, generieke visualisatie.",
    nominalPanelWidthMm: 1800,
    postThicknessMm: 90,
    hasBasePlate: false,
    verifiedProduct: false
  },
  {
    id: "generic-wood-concrete",
    buildUp: "Betonpalen met betonnen onderplaat; houten scherm erboven (onderplaat telt mee in de totale hoogte).",
    maintenance: "Hout periodiek beitsen/oliën; beton heeft geen grondcontact-houtrot, wel af en toe reinigen.",
    label: "Hout op beton",
    description: "Houten scherm op een betonnen onderplaat; totale hoogte is schermhoogte plus onderplaat.",
    nominalPanelWidthMm: 1800,
    postThicknessMm: 90,
    hasBasePlate: true,
    basePlateHeightMm: 260,
    verifiedProduct: false
  },
  {
    id: "generic-composite",
    buildUp: "Composiet planken in aluminium of composiet profielen, vaak op een onderplaat.",
    maintenance: "Nauwelijks onderhoud; schoonmaken is doorgaans voldoende. Vervangbaarheid van losse delen is systeemafhankelijk.",
    label: "Composiet",
    description: "Composiet planken op aluminium of composiet profielen, generieke visualisatie.",
    nominalPanelWidthMm: 1800,
    postThicknessMm: 70,
    hasBasePlate: true,
    basePlateHeightMm: 200,
    verifiedProduct: false
  },
  {
    id: "generic-horizontal-lamellen",
    buildUp: "Horizontale lamellen tussen palen, met kleine tussenruimte.",
    maintenance: "Afhankelijk van materiaal: hout periodiek behandelen, composiet/aluminium doorgaans alleen reinigen.",
    label: "Horizontale lamellen",
    description: "Horizontaal gemonteerde lamellen met kleine tussenruimte.",
    nominalPanelWidthMm: 1800,
    postThicknessMm: 90,
    hasBasePlate: false,
    verifiedProduct: false
  },
  {
    id: "generic-mesh",
    buildUp: "Gaaspanelen of hekwerk tussen dunne palen, visueel open.",
    maintenance: "Weinig onderhoud; begroeiing en beschadigingen periodiek nalopen.",
    label: "Gaas / hekwerk",
    description: "Transparant gaas of hekwerk; visueel lichter dan een massief scherm.",
    nominalPanelWidthMm: 2500,
    postThicknessMm: 48,
    hasBasePlate: false,
    verifiedProduct: false
  }
];

export const FENCE_MATERIAL_PRESETS = [
  { id: "natural-wood", label: "Naturel hout", colorHex: "#c9a876", compatibleSystems: ["generic-wood", "generic-wood-concrete", "generic-horizontal-lamellen"] },
  { id: "dark-wood", label: "Donker hout", colorHex: "#5a4632", compatibleSystems: ["generic-wood", "generic-wood-concrete", "generic-horizontal-lamellen"] },
  { id: "natural-wood-grey-concrete", label: "Naturel hout / grijze onderplaat", colorHex: "#c9a876", compatibleSystems: ["generic-wood-concrete"] },
  { id: "anthracite-composite", label: "Antraciet composiet", colorHex: "#3b3d3f", compatibleSystems: ["generic-composite"] },
  { id: "grey-concrete", label: "Grijs beton", colorHex: "#9a9a92", compatibleSystems: ["generic-wood-concrete"] },
  { id: "galvanized-mesh", label: "Verzinkt gaas", colorHex: "#b7bcbf", compatibleSystems: ["generic-mesh"], transparent: true }
];

export function getFenceSystem(systemId) {
  return FENCE_SYSTEMS.find((s) => s.id === systemId) || null;
}

export function getFenceMaterialPreset(presetId) {
  return FENCE_MATERIAL_PRESETS.find((p) => p.id === presetId) || null;
}
