/**
 * Materialencatalogus (V7-08) — schaalbaar productmodel.
 *
 * Status per item (nooit gokken, onzekere velden zijn null):
 *  - "verified-product": bestaand artikel van een externe leverancier, met bron en geverifieerde
 *    specificaties (naam, maat, materiaalsoort). Referentie, géén SEAL-voorraad of SEAL-verkoopprijs.
 *  - "general-option":   algemene materiaalsoort die in SEAL-projecten verwerkt kan worden; het exacte
 *    product (merk, kleur, maat) wordt per project gekozen en in de offerte vastgelegd.
 *  - "on-request":       alleen na beoordeling of overleg; niet standaard in het aanbod.
 *  - "unavailable":      wordt niet aangeboden.
 *
 * Velden: id, category, group, title, summary, status, material, formats[{label,lengthMm,widthMm,thicknessMm}],
 * colors (alleen geverifieerd), application[], maintenanceLevel ("laag"|"gemiddeld"|"hoger"|null), maintenance,
 * base (vereiste ondergrond/opbouw), unit, packaging, minQuantity, availability {status, checkedAt},
 * sku, supplier, sourceUrl, priceSourceId (→ data/price-sources.json), quantityRule, risks, image
 * {src, alt, project, verification}, synonyms[], purchasable (online bestelbaar; alleen true bij
 * bevestigde assortiment- en fulfilmentafspraken — nu overal false).
 */

export const CATALOG_CATEGORIES = [
  { id: "schutting", label: "Schuttingen en poorten" },
  { id: "bestrating", label: "Bestrating" },
  { id: "ondergrond", label: "Opsluiting en ondergrond" },
  { id: "gras", label: "Gras en gazon" },
  { id: "beplanting", label: "Beplanting" },
  { id: "buiten", label: "Verlichting, vlonders en water" },
  { id: "afvoer", label: "Afvoer" }
];

export const CATALOG_STATUSES = {
  "verified-product": { label: "Geverifieerd product", badge: "badge--verified", help: "Bestaand artikel met bron en gecontroleerde specificaties. Referentie, geen SEAL-voorraad." },
  "general-option": { label: "Materiaaloptie", badge: "badge--info", help: "Algemene materiaalsoort; het exacte product kiezen we samen en staat in de offerte." },
  "on-request": { label: "Op aanvraag", badge: "badge--on-request", help: "Alleen na beoordeling of overleg, niet standaard in ons aanbod." },
  unavailable: { label: "Niet leverbaar", badge: "badge--unavailable", help: "Wordt niet aangeboden." }
};

export const MAINTENANCE_LEVELS = ["laag", "gemiddeld", "hoger"];

const img = (src, alt, project, verification = "filename-based") => ({ src: `images/projects/${src}`, alt, project, verification });
const base = {
  colors: [], application: [], maintenanceLevel: null, maintenance: null, base: null, unit: null, packaging: null,
  minQuantity: null, availability: { status: null, checkedAt: null }, sku: null, supplier: null, sourceUrl: null,
  priceSourceId: null, quantityRule: null, risks: null, image: null, synonyms: [], formats: [], purchasable: false
};
const item = (o) => ({ ...base, ...o });

export const CATALOG = [
  /* ---------------- Schuttingen ---------------- */
  item({ id: "schutting-grenen", category: "schutting", group: "Schermen", title: "Grenen schuttingschermen", status: "general-option", material: "hout",
    summary: "Geïmpregneerd grenen: de meest gekozen, prijsbewuste houten schutting.",
    application: ["privacy", "erfafscheiding"], maintenanceLevel: "gemiddeld",
    maintenance: "Hout vergrijst; periodiek behandelen houdt kleur en bescherming. Frequentie hangt af van ligging en behandeling.",
    base: "Houten of betonnen palen; met betonnen onderplaat geen hout in de grond.", unit: "scherm (meestal 180 cm breed)",
    image: img("schutting-grenen-zwarte-voet-1.jpg", "Grenen schutting op zwarte onderplaat uit eigen werk", "grenen-schutting-zwarte-onderplaat", "visually-confirmed"),
    synonyms: ["vuren", "naaldhout", "geimpregneerd", "groen hout", "tuinscherm", "hek"] }),
  item({ id: "product-elephant-finch-grenen", category: "schutting", group: "Schermen", title: "Elephant Finch grenen scherm 180 × 180 cm", status: "verified-product", material: "hout",
    summary: "Recht grenen scherm, schermdikte 4,7 cm (referentieartikel van een externe leverancier).",
    formats: [{ label: "180 × 180 cm", lengthMm: 1800, widthMm: null, heightMm: 1800, thicknessMm: 47 }], unit: "stuk", sku: "007237", supplier: "Elephant (via HomingXL)",
    sourceUrl: "https://homingxl.nl/elephant-schutting-grenen-finch-recht-15l-rvs-groen-geimpregneerd-180x180cm-schermdikte-4-7-cm/",
    priceSourceId: "price-elephant-finch-grenen-scherm", application: ["privacy", "erfafscheiding"], maintenanceLevel: "gemiddeld",
    maintenance: "Als grenen: periodiek behandelen.", synonyms: ["finch", "elephant", "grenen scherm"] }),
  item({ id: "schutting-douglas", category: "schutting", group: "Schermen", title: "Douglas schuttingschermen", status: "general-option", material: "hout",
    summary: "Douglashout, onbehandeld of geïmpregneerd; warme kleur die naar grijs verloopt.",
    application: ["privacy", "erfafscheiding"], maintenanceLevel: "gemiddeld",
    maintenance: "Vergrijst op natuurlijke wijze; behandelen als u de kleur wilt behouden.",
    base: "Bij voorkeur op betonnen onderplaat of poeren, zonder hout in de grond.", unit: "scherm", synonyms: ["douglasie", "lariks", "naturel hout"] }),
  item({ id: "schutting-hardhout", category: "schutting", group: "Schermen", title: "Hardhouten schermen", status: "on-request", material: "hout",
    summary: "Hardhout (bijvoorbeeld als planken of lamellen) — houtsoort en herkomst per project bepalen.",
    application: ["privacy"], maintenanceLevel: "gemiddeld", maintenance: "Afhankelijk van houtsoort; vraag naar herkomst en keurmerk.",
    risks: "Herkomst en keurmerk (bijv. FSC) per leverancier controleren.", synonyms: ["bangkirai", "hardhout", "tropisch"] }),
  item({ id: "schutting-composiet", category: "schutting", group: "Schermen", title: "Composiet schuttingen", status: "general-option", material: "composiet",
    summary: "Planken van hout-kunststofcomposiet in profielen; strak en onderhoudsarm.",
    application: ["privacy", "erfafscheiding", "modern"], maintenanceLevel: "laag",
    maintenance: "Schoonmaken is doorgaans voldoende. Vervangbaarheid van losse delen verschilt per systeem.",
    base: "Systeempalen (aluminium/composiet), vaak op een onderplaat.", unit: "strekkende meter of systeemsectie",
    image: img("schutting-antraciet-composiet-hoek.jpg", "Antraciet composiet schutting uit eigen werk", null),
    synonyms: ["composite", "kunststof", "wpc", "onderhoudsarm", "antraciet"] }),
  item({ id: "schutting-hout-beton", category: "schutting", group: "Systemen", title: "Hout-betonschutting", status: "general-option", material: "hout en beton",
    summary: "Betonpalen met betonnen onderplaat en een houten scherm erboven: geen hout in de grond.",
    application: ["privacy", "erfafscheiding"], maintenanceLevel: "gemiddeld",
    maintenance: "Hout periodiek behandelen; beton af en toe reinigen.", base: "Betonpalen in de grond, onderplaat tussen de palen.", unit: "strekkende meter",
    image: img("schutting-grenen-zwarte-voet-3.jpg", "Schutting met betonnen onderplaat uit eigen werk", "grenen-schutting-zwarte-onderplaat", "visually-confirmed"),
    synonyms: ["betonschutting", "hout beton", "onderplaat", "betonpaal"] }),
  item({ id: "schutting-beton", category: "schutting", group: "Systemen", title: "Volledig betonnen schutting", status: "on-request", material: "beton",
    summary: "Betonnen platen en palen; zwaar en duurzaam, beperkte uitstraling-opties.",
    application: ["erfafscheiding", "geluid"], maintenanceLevel: "laag", maintenance: "Af en toe reinigen.",
    risks: "Zwaar materiaal: bereikbaarheid en ondergrond vooraf beoordelen.", synonyms: ["betonplaat", "betonhek"] }),
  item({ id: "schutting-kastanje", category: "schutting", group: "Schermen", title: "Kastanjehouten paaltjesscherm", status: "general-option", material: "hout",
    summary: "Gespleten kastanjepaaltjes met draad: natuurlijke, landelijke afscheiding.",
    application: ["erfafscheiding", "natuurlijk"], maintenanceLevel: "laag", maintenance: "Vergrijst natuurlijk; geen behandeling nodig.",
    unit: "rol of strekkende meter",
    image: img("schutting-kastanje-paaltjes-dordrecht-1.jpg", "Kastanjehouten paaltjesschutting uit eigen werk", "kastanjehouten-paaltjesschutting", "visually-confirmed"),
    synonyms: ["kastanje", "paaltjesscherm", "landelijk", "natuurlijk hek"] }),
  item({ id: "schutting-palen", category: "schutting", group: "Palen en fundering", title: "Palen (hout, beton of systeem)", status: "general-option", material: "diverse",
    summary: "Het type paal volgt uit het gekozen scherm; diepte en verankering bepalen we ter plaatse.", unit: "stuk",
    base: "In de grond, op poeren of verankerd in beton.", synonyms: ["paal", "betonpaal", "hekpaal", "poer"] }),
  item({ id: "schutting-onderplaat", category: "schutting", group: "Palen en fundering", title: "Betonnen onderplaten", status: "general-option", material: "beton",
    summary: "Onderplaat tussen betonpalen: houdt het scherm uit de grond. Telt mee in de totale hoogte.", unit: "stuk",
    synonyms: ["onderplaat", "betonplaat", "voet", "zwarte voet"] }),
  item({ id: "schutting-poort", category: "schutting", group: "Poorten en beslag", title: "Tuinpoorten", status: "general-option", material: "hout, composiet of metaal",
    summary: "Poort passend bij het scherm; draairichting en doorloopbreedte leggen we vast.", unit: "stuk",
    image: img("schutting-gaas-poort-zwarte-voet.jpg", "Poort in schutting uit eigen werk", null),
    synonyms: ["poort", "deur", "tuindeur", "hekwerk"] }),
  item({ id: "schutting-beslag", category: "schutting", group: "Poorten en beslag", title: "Beslag en sluitwerk", status: "general-option", material: "metaal",
    summary: "Scharnieren, sloten en grendels; RVS of thermisch verzinkt voorkomt roestplekken.", unit: "set",
    synonyms: ["scharnier", "slot", "grendel", "rvs"] }),

  /* ---------------- Bestrating ---------------- */
  item({ id: "product-excluton-terrastegel-plus-6060", category: "bestrating", group: "Tegels", title: "EXCLUTON Terrastegel Plus schelpkalk 60 × 60 × 4 cm", status: "verified-product", material: "schelpkalkbeton",
    summary: "Betontegel met schelpkalk-toplaag (referentieartikel van een externe leverancier).",
    formats: [{ label: "60 × 60 × 4 cm", lengthMm: 600, widthMm: 600, thicknessMm: 40 }], unit: "stuk", supplier: "EXCLUTON (via Hornbach)",
    sourceUrl: "https://www.hornbach.nl/c/tuin/sierbestrating/tuintegels/S4991/", priceSourceId: "price-excluton-terrastegel-plus-6060",
    application: ["terras", "pad"], maintenanceLevel: "gemiddeld", maintenance: "Periodiek reinigen en voegen bijhouden; de toplaag kan door slijtage van uiterlijk veranderen.",
    base: "Gestabiliseerd zandbed op verdichte ondergrond.", quantityRule: "tiles", synonyms: ["terrastegel", "schelpkalk", "betontegel", "60x60"] }),
  item({ id: "product-excluton-keramisch-madrid-6060", category: "bestrating", group: "Tegels", title: "EXCLUTON Keramische tuintegel Madrid 60 × 60 × 2 cm", status: "verified-product", material: "keramiek",
    summary: "Keramische tuintegel van 2 cm (referentieartikel van een externe leverancier).",
    formats: [{ label: "60 × 60 × 2 cm", lengthMm: 600, widthMm: 600, thicknessMm: 20 }], unit: "stuk", supplier: "EXCLUTON (via Hornbach)",
    sourceUrl: "https://www.hornbach.nl/c/tuin/sierbestrating/tuintegels/S4991/", priceSourceId: "price-excluton-keramisch-madrid-6060",
    application: ["terras"], maintenanceLevel: "laag", maintenance: "Neemt doorgaans weinig vuil op en is relatief eenvoudig te reinigen; voegen bijhouden.",
    base: "Dunne keramiek vraagt een vlakke, stabiele ondergrond (bijv. gestabiliseerd zand of tegeldragers).", quantityRule: "tiles",
    risks: "Keramiek van 2 cm is niet geschikt voor oprit of zwaar verkeer.", synonyms: ["keramische tegel", "keramiek", "madrid", "60x60"] }),
  item({ id: "product-flairstone-garden-moon-6060", category: "bestrating", group: "Tegels", title: "FLAIRSTONE Garden moon 60 × 60 × 2 cm", status: "verified-product", material: "keramiek",
    summary: "Keramische tuintegel van 2 cm (referentieartikel van een externe leverancier).",
    formats: [{ label: "60 × 60 × 2 cm", lengthMm: 600, widthMm: 600, thicknessMm: 20 }], unit: "stuk", supplier: "FLAIRSTONE (via Hornbach)",
    sourceUrl: "https://www.hornbach.nl/c/tuin/sierbestrating/tuintegels/S4991/", priceSourceId: "price-flairstone-garden-moon-6060",
    application: ["terras"], maintenanceLevel: "laag", maintenance: "Relatief eenvoudig te reinigen; voegen bijhouden.",
    base: "Vlakke, stabiele ondergrond.", quantityRule: "tiles", risks: "Niet geschikt voor oprit of zwaar verkeer.", synonyms: ["flairstone", "garden moon", "keramiek", "60x60"] }),
  item({ id: "bestrating-betontegels", category: "bestrating", group: "Tegels", title: "Betontegels", status: "general-option", material: "beton",
    summary: "Klassieke en moderne betontegels in vele maten en kleuren; breed verkrijgbaar.",
    formats: [{ label: "30 × 30 cm", lengthMm: 300, widthMm: 300 }, { label: "40 × 40 cm", lengthMm: 400, widthMm: 400 }, { label: "60 × 30 cm", lengthMm: 600, widthMm: 300 }, { label: "60 × 60 cm", lengthMm: 600, widthMm: 600 }],
    application: ["terras", "pad"], maintenanceLevel: "gemiddeld", maintenance: "Kan aanslag of verkleuring krijgen; periodiek reinigen en voegen bijhouden.",
    base: "Zandbed op verdichte ondergrond.", quantityRule: "tiles", synonyms: ["stoeptegel", "tuintegel", "grindtegel", "30x30", "40x40", "60x30"] }),
  item({ id: "bestrating-keramiek", category: "bestrating", group: "Tegels", title: "Keramische tegels (ook houtlook)", status: "general-option", material: "keramiek",
    summary: "Dunne, vuilafstotende tegels; ook in houtlook-planken.",
    formats: [{ label: "60 × 60 cm", lengthMm: 600, widthMm: 600 }, { label: "120 × 30 cm (houtlook)", lengthMm: 1200, widthMm: 300 }],
    application: ["terras", "pad"], maintenanceLevel: "laag", maintenance: "Neemt weinig vuil op; voegen bijhouden.", base: "Vlakke, stabiele ondergrond.", quantityRule: "tiles",
    image: img("terras-houtlook-kunstgras-pad-1.jpg", "Pad van houtlook-tegels uit eigen werk", "terras-houtlook-tegelpad", "visually-confirmed"),
    synonyms: ["keramisch", "houtlook", "ceramic", "keramiek tegel", "planktegel"] }),
  item({ id: "bestrating-natuursteen", category: "bestrating", group: "Tegels", title: "Natuursteen", status: "on-request", material: "natuursteen",
    summary: "Bijvoorbeeld hardsteen of leisteen: elk stuk uniek; soort en afwerking per project bepalen.",
    application: ["terras"], maintenanceLevel: "gemiddeld", maintenance: "Afhankelijk van steensoort; sommige soorten zijn gevoelig voor vlekken.",
    risks: "Maattolerantie en kleurverschillen per partij.", synonyms: ["hardsteen", "leisteen", "graniet", "basalt", "travertin"] }),
  item({ id: "bestrating-klinkers", category: "bestrating", group: "Klinkers", title: "Gebakken klinkers en waaltjes", status: "general-option", material: "gebakken klei",
    summary: "Robuust en kleurvast; geschikt voor paden, terrassen en opritten.",
    formats: [{ label: "Waalformaat ca. 20 × 5 cm", lengthMm: 200, widthMm: 50 }, { label: "Dikformaat ca. 20 × 6,5 cm", lengthMm: 200, widthMm: 65 }],
    application: ["pad", "terras", "oprit"], maintenanceLevel: "laag", maintenance: "Voegen en onkruid periodiek bijhouden.",
    image: img("klinkerpad-hersteld.jpg", "Hersteld klinkerpad uit eigen werk", null),
    synonyms: ["klinker", "waaltje", "waalformaat", "dikformaat", "baksteen", "keiformaat"] }),
  item({ id: "bestrating-betonklinkers", category: "bestrating", group: "Klinkers", title: "Betonklinkers", status: "general-option", material: "beton",
    summary: "Betonstenen in klinkerformaat; geschikt voor opritten en parkeerplaatsen.",
    formats: [{ label: "21 × 10,5 cm", lengthMm: 210, widthMm: 105 }], application: ["oprit", "parkeerplaats", "pad"], maintenanceLevel: "gemiddeld",
    maintenance: "Voegen bijhouden; kan aanslag krijgen.", base: "Voor opritten een dikkere, goed verdichte fundering.", synonyms: ["betonsteen", "straatsteen", "oprit"] }),

  /* ---------------- Opsluiting en ondergrond ---------------- */
  item({ id: "product-excluton-opsluitband-antraciet", category: "ondergrond", group: "Opsluitbanden", title: "EXCLUTON Opsluitband antraciet 100 × 15 × 5 cm", status: "verified-product", material: "beton",
    summary: "Betonnen opsluitband voor een strakke rand (referentieartikel van een externe leverancier).",
    formats: [{ label: "100 × 15 × 5 cm", lengthMm: 1000, widthMm: 50, heightMm: 150 }], unit: "stuk", supplier: "EXCLUTON (via Hornbach)",
    sourceUrl: "https://www.hornbach.nl/c/tuin/sierbestrating/opsluitbanden/S4993/", priceSourceId: "price-excluton-opsluitband-antraciet", quantityRule: "edging",
    synonyms: ["opsluitband", "kantopsluiting", "band", "rand", "antraciet"] }),
  item({ id: "product-excluton-opsluitband-grijs", category: "ondergrond", group: "Opsluitbanden", title: "EXCLUTON Opsluitband grijs 100 × 15 × 5 cm", status: "verified-product", material: "beton",
    summary: "Betonnen opsluitband voor een strakke rand (referentieartikel van een externe leverancier).",
    formats: [{ label: "100 × 15 × 5 cm", lengthMm: 1000, widthMm: 50, heightMm: 150 }], unit: "stuk", supplier: "EXCLUTON (via Hornbach)",
    sourceUrl: "https://www.hornbach.nl/c/tuin/sierbestrating/opsluitbanden/S4993/", priceSourceId: "price-excluton-opsluitband-grijs", quantityRule: "edging",
    synonyms: ["opsluitband", "kantopsluiting", "band", "rand", "grijs"] }),
  item({ id: "ondergrond-straatzand", category: "ondergrond", group: "Zand en fundering", title: "Straatzand en stabilisatie", status: "general-option", material: "zand",
    summary: "Zandbed onder bestrating; gestabiliseerd zand of brekerzand waar extra draagkracht nodig is.",
    unit: "m³ of ton", image: img("materiaal-levering-tuinaarde-zand.jpg", "Levering van zand en tuinaarde bij een project", null),
    synonyms: ["zand", "ophoogzand", "brekerzand", "gestabiliseerd zand", "zandbed", "fundering"] }),
  item({ id: "ondergrond-voegmiddel", category: "ondergrond", group: "Voegen", title: "Voegzand en voegmortel", status: "general-option", material: "zand / mortel",
    summary: "Invegen met voegzand, of een (onkruidwerende) voegmortel bij keramiek en natuursteen.",
    maintenanceLevel: "gemiddeld", maintenance: "Voegzand periodiek aanvullen; voegmortel vraagt minder onderhoud.", synonyms: ["voeg", "voegzand", "voegmortel", "onkruidwerend"] }),
  item({ id: "ondergrond-grind-split", category: "ondergrond", group: "Grind en split", title: "Grind en split", status: "general-option", material: "steen",
    summary: "Halfverharding voor paden, borders en boomspiegels; met worteldoek eronder.",
    application: ["pad", "border"], maintenanceLevel: "gemiddeld", maintenance: "Blad en onkruid verwijderen; af en toe aanvullen.",
    image: img("voortuin-grindpad-bankje.jpg", "Grindpad in een voortuin uit eigen werk", null),
    synonyms: ["grind", "split", "kiezel", "halfverharding", "siergrind"] }),
  item({ id: "ondergrond-worteldoek", category: "ondergrond", group: "Grind en split", title: "Worteldoek", status: "general-option", material: "geotextiel",
    summary: "Waterdoorlatend doek onder grind en split; remt onkruid, houdt lagen gescheiden.", unit: "m²",
    synonyms: ["anti worteldoek", "gronddoek", "geotextiel", "antiworteldoek"] }),

  /* ---------------- Gras ---------------- */
  item({ id: "product-graszoden-premium", category: "gras", group: "Gazon", title: "Graszoden (premium siergras)", status: "verified-product", material: "gras",
    summary: "Kant-en-klaar gazon per m² (referentieartikel van een externe leverancier).", unit: "m²", supplier: "via Hornbach",
    sourceUrl: "https://www.hornbach.nl/c/tuin/graszoden-graszaad-kunstgras/graszoden/S5199/", priceSourceId: "price-graszoden-premium-siergras",
    maintenanceLevel: "hoger", maintenance: "Eerste weken dagelijks water; daarna maaien, bemesten en beluchten.", quantityRule: "area",
    synonyms: ["graszode", "zoden", "gazon", "rolgras", "gras"] }),
  item({ id: "gras-inzaaien", category: "gras", group: "Gazon", title: "Gazon inzaaien", status: "general-option", material: "graszaad",
    summary: "Goedkoper dan zoden, maar het gazon heeft tijd nodig om dicht te groeien.", maintenanceLevel: "hoger",
    maintenance: "Vochtig houden tot kieming; pas maaien als het gras stevig staat.", synonyms: ["graszaad", "inzaaien", "zaaien"] }),
  item({ id: "product-kunstgras-nancy-30", category: "gras", group: "Kunstgras", title: "Gardenplace Nancy kunstgras 30 mm", status: "verified-product", material: "kunststof",
    summary: "Kunstgras met 30 mm poolhoogte (referentieartikel van een externe leverancier).", unit: "m²", supplier: "Gardenplace (via Hornbach)",
    sourceUrl: "https://www.hornbach.nl/c/tuin/graszoden-graszaad-kunstgras/kunstgras/S4904/", priceSourceId: "price-gardenplace-nancy-30",
    maintenanceLevel: "laag", maintenance: "Blad verwijderen, af en toe borstelen en reinigen.", base: "Verdichte fundering met waterdoorlatende opbouw.", quantityRule: "area",
    synonyms: ["kunstgras", "nep gras", "artificial grass", "nancy"] }),
  item({ id: "product-kunstgras-dela-35", category: "gras", group: "Kunstgras", title: "Gardenplace Dela kunstgras 35 mm", status: "verified-product", material: "kunststof",
    summary: "Kunstgras met 35 mm poolhoogte (referentieartikel van een externe leverancier).", unit: "m²", supplier: "Gardenplace (via Hornbach)",
    sourceUrl: "https://www.hornbach.nl/c/tuin/graszoden-graszaad-kunstgras/kunstgras/S4904/", priceSourceId: "price-gardenplace-dela-35",
    maintenanceLevel: "laag", maintenance: "Blad verwijderen, af en toe borstelen en reinigen.", base: "Verdichte fundering met waterdoorlatende opbouw.", quantityRule: "area",
    synonyms: ["kunstgras", "nep gras", "dela"] }),
  item({ id: "gras-kunstgras", category: "gras", group: "Kunstgras", title: "Kunstgras (overige soorten)", status: "general-option", material: "kunststof",
    summary: "Poolhoogte, kleur en opbouw kiezen we per tuin; een goede fundering is bepalend.",
    maintenanceLevel: "laag", maintenance: "Blad verwijderen, borstelen, af en toe reinigen.",
    image: img("terras-kunstgras-opgeleverd.jpg", "Opgeleverd kunstgras uit eigen werk", "kunstgras-achter-nieuwe-schutting"),
    risks: "Wordt warm in de zon; let op afwatering en ondergrond.", synonyms: ["kunstgras", "nep gras"] }),
  item({ id: "gras-bodemverbetering", category: "gras", group: "Grond", title: "Tuinaarde en bodemverbetering", status: "general-option", material: "grond/compost",
    summary: "Verse tuinaarde of compost voor borders en gazon; ook bij ophogen.", unit: "m³",
    image: img("materiaal-levering-tuinaarde-zand.jpg", "Levering van tuinaarde bij een project", null), synonyms: ["tuinaarde", "compost", "potgrond", "bodemverbeteraar", "grond"] }),

  /* ---------------- Beplanting ---------------- */
  item({ id: "beplanting-haag", category: "beplanting", group: "Hagen", title: "Haagplanten", status: "general-option", material: "beplanting",
    summary: "Groenblijvend of bladverliezend; soort, maat en plantafstand per situatie (gecontroleerde plantcatalogus volgt).",
    application: ["privacy", "erfafscheiding"], maintenanceLevel: "gemiddeld", maintenance: "Eén tot enkele keren per jaar knippen, afhankelijk van de soort.",
    image: img("voortuin-haag-gesnoeid.jpg", "Gesnoeide haag in een voortuin uit eigen werk", "hagen-strak-geknipt"),
    risks: "Aantallen per meter pas na bevestigde plantafstand per soort.", synonyms: ["haag", "heg", "liguster", "taxus", "beuk", "laurier", "coniferen"] }),
  item({ id: "beplanting-heesters", category: "beplanting", group: "Heesters en vaste planten", title: "Heesters", status: "general-option", material: "beplanting",
    summary: "Structuur in de border; soortkeuze op basis van licht, bodem en gewenste hoogte.", maintenanceLevel: "gemiddeld",
    maintenance: "Snoeien afhankelijk van soort en bloeitijd.", synonyms: ["struik", "heester", "struiken"] }),
  item({ id: "beplanting-vaste-planten", category: "beplanting", group: "Heesters en vaste planten", title: "Vaste planten en siergrassen", status: "general-option", material: "beplanting",
    summary: "Kleur en seizoensverloop in borders; siergrassen voor beweging.", maintenanceLevel: "gemiddeld",
    maintenance: "Uitgebloeid blad terugknippen; om de paar jaar scheuren.",
    image: img("border-gecureerd-voortuin.jpg", "Border met vaste planten uit eigen werk", "border-renovatie-materiaal"),
    synonyms: ["vaste plant", "siergras", "border", "bloemen", "perk"] }),
  item({ id: "beplanting-bomen", category: "beplanting", group: "Bomen", title: "(Sier)bomen", status: "on-request", material: "beplanting",
    summary: "Soort en maat vooraf beoordelen: ruimte, wortels, schaduw en afstand tot erfgrens.",
    risks: "Regels voor afstand tot de erfgrens en eventuele kapvergunning vooraf controleren.", synonyms: ["boom", "sierboom", "fruitboom", "leiboom"] }),
  item({ id: "beplanting-bodembedekkers", category: "beplanting", group: "Heesters en vaste planten", title: "Bodembedekkers", status: "general-option", material: "beplanting",
    summary: "Dichtgroeiende planten die onkruid onderdrukken eenmaal ingegroeid.", maintenanceLevel: "laag", synonyms: ["bodembedekker", "groenblijvend", "onderbeplanting"] }),
  item({ id: "beplanting-plantenbak", category: "beplanting", group: "Potten en bakken", title: "Plantenbakken en verhoogde borders", status: "general-option", material: "diverse",
    summary: "Verhoogde bakken voor structuur en makkelijker onderhoud.",
    image: img("terras-zwarte-plantenbakken.jpg", "Zwarte plantenbakken op een terras uit eigen werk", null), synonyms: ["plantenbak", "bak", "pot", "verhoogde border", "cortenstaal"] }),

  /* ---------------- Buiten ---------------- */
  item({ id: "buiten-verlichting", category: "buiten", group: "Verlichting", title: "Tuinverlichting (laagspanning)", status: "general-option", material: "diverse",
    summary: "Sfeer en veiligheid op paden en terras. Netaansluitingen laat u door een erkend installateur maken.",
    image: img("voorpad-bestrating-verlichting.jpg", "Voorpad met sfeerverlichting uit eigen werk", "voorpad-sfeerverlichting", "visually-confirmed"),
    risks: "Elektra-aansluiting niet inbegrepen.", synonyms: ["verlichting", "lamp", "spot", "led", "tuinlamp", "12 volt"] }),
  item({ id: "buiten-drainage", category: "buiten", group: "Water", title: "Afwatering en drainage", status: "on-request", material: "diverse",
    summary: "Bij wateroverlast eerst de oorzaak beoordelen; oplossing (afschot, drainage, infiltratie) per situatie.",
    risks: "Geen standaardoplossing; altijd na opname.", synonyms: ["drainage", "afwatering", "wateroverlast", "infiltratie", "kolk", "lijngoot"] }),
  item({ id: "buiten-vlonder", category: "buiten", group: "Vlonders", title: "Vlonders (hout of composiet)", status: "general-option", material: "hout / composiet",
    summary: "Vlonderterras op een stabiele onderconstructie.", maintenanceLevel: "gemiddeld",
    maintenance: "Hout periodiek behandelen; composiet schoonmaken.", synonyms: ["vlonder", "deck", "terrasplanken", "steiger"] }),
  item({ id: "buiten-overkapping", category: "buiten", group: "Overkappingen", title: "Pergola of overkapping", status: "on-request", material: "diverse",
    summary: "Alleen na overleg en beoordeling; vergunningsplicht vooraf controleren.",
    risks: "Kan vergunningplichtig zijn; niet standaard in ons aanbod.", synonyms: ["pergola", "overkapping", "veranda", "luifel", "carport"] }),

  /* ---------------- Afvoer ---------------- */
  item({ id: "afvoer-container", category: "afvoer", group: "Afvoer", title: "Afvoer en containers", status: "general-option", material: null,
    summary: "Groenafval, grond, puin of bouw- en sloopafval apart afvoeren; wat er afgevoerd wordt staat in de offerte.",
    unit: "container of rit", priceSourceId: "price-afval-tuin-plantsoen-6m3", synonyms: ["afval", "container", "puin", "groenafval", "grond afvoeren"] })
];

export function getCatalogItem(id) {
  return CATALOG.find((p) => p.id === id) || null;
}
