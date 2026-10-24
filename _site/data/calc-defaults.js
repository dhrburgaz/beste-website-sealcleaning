/**
 * Standaardinstellingen voor de interne calculatiemotor (js/calc/engine.js).
 *
 * BELANGRIJK — dit bestand is openbaar (GitHub Pages). Het bevat daarom:
 *  - alleen het bevestigde verkoopuurtarief (€ 60 excl. btw, 9-10-2026);
 *  - productiviteitsnormen als VOORBEELDWAARDE (status "example"): bedoeld
 *    als startpunt, niet als SEAL-beleid. Een offerte die er één gebruikt
 *    blijft "concept" tot de eigenaar de norm bevestigt of wijzigt;
 *  - GEEN marges, opslagpercentages, kostprijzen of inkoopafspraken. Die
 *    vult de eigenaar in de versleutelde beheeromgeving in; ze verlaten het
 *    apparaat niet.
 * Materiaalkoppelingen verwijzen naar openbaar onderzochte marktprijzen in
 * data/price-sources.json (consumentenprijzen — geen bewezen inkoopprijs).
 */

export const DEFAULT_SETTINGS = {
  version: 1,
  laborRateExclCents: 6000,
  laborRateStatus: "confirmed",
  laborCostRateCents: null,       // interne kostprijs per uur — eigenaar
  vatRate: 21,
  crewSize: 2,
  hoursPerDay: 8,
  materialMarkupPct: null,        // opslag op kostprijs — eigenaar
  machineMarkupPct: null,
  wasteMarkupPct: null,
  overheadPct: null,              // algemene kosten op totaal — eigenaar
  riskPct: null,
  transportPerDayCents: null,     // vervoer/voorrijkosten per werkdag — eigenaar
  minimumOrderExclCents: null,
  roundToCents: 100,              // verkoopprijs afronden op hele euro's
  norms: {}                       // overschrijvingen per sleutel: { hoursPerUnit, status }
};

/** Arbeid per eenheid (persoonsuren). status "example" = voorbeeld, niet bevestigd. */
export const DEFAULT_NORMS = {
  "paving.area": { hoursPerUnit: 0.6, status: "example", note: "leggen incl. zandbed, trillen, invegen" },
  "paving.edging": { hoursPerUnit: 0.15, status: "example" },
  "paving.excavation": { hoursPerUnit: 1.0, status: "example", note: "handmatig; met minigraver lager" },
  "fence.panels": { hoursPerUnit: 0.5, status: "example" },
  "fence.fits": { hoursPerUnit: 0.75, status: "example" },
  "fence.posts": { hoursPerUnit: 0.5, status: "example", note: "graven, stellen, aanstampen/beton" },
  "fence.baseplates": { hoursPerUnit: 0.2, status: "example" },
  "fence.gates": { hoursPerUnit: 2, status: "example" },
  "green.hedge": { hoursPerUnit: 0.5, status: "example" },
  "green.border": { hoursPerUnit: 0.8, status: "example" },
  "green.lawn": { hoursPerUnit: 0.2, status: "example" },
  "green.plant": { hoursPerUnit: 0.5, status: "example" },
  "hard.gravel": { hoursPerUnit: 0.4, status: "example" },
  "hard.deck": { hoursPerUnit: 2.0, status: "example" },
  "hard.planter": { hoursPerUnit: 1.5, status: "example" },
  "light.point": { hoursPerUnit: 1.5, status: "example", note: "excl. elektra-aansluiting door installateur" },
  "remove.paving": { hoursPerUnit: 0.4, status: "example" },
  "remove.fence": { hoursPerUnit: 0.6, status: "example" },
  "remove.area": { hoursPerUnit: 0.5, status: "example" },
  "remove.linear": { hoursPerUnit: 0.8, status: "example" },
  "remove.item.shed": { hoursPerUnit: 8, status: "example" },
  "remove.item.plant": { hoursPerUnit: 0.5, status: "example" },
  "remove.item.lamp": { hoursPerUnit: 0.5, status: "example" },
  "remove.item.gate-existing": { hoursPerUnit: 1, status: "example" }
  // remove.item.tree, fence.repair: bewust geen norm — op aanvraag na beoordeling
};

/**
 * Materiaal/machine/afval per sleutel. `source`:
 *  - "tile": tegelregel bij gekozen product of goedkoopste voor het formaat
 *  - "price": vaste regel uit price-sources.json
 *  - "fence-panel": Elephant Finch-scherm alleen bij houten systeem op 180 cm
 * Ontbreekt een koppeling, dan is de regel "op aanvraag" tot de eigenaar een
 * inkoopprijs invoert.
 */
export const MATERIAL_LINKS = {
  "paving.tiles": { kind: "material", source: "tile" },
  "paving.edging": { kind: "material", source: "price", priceSourceId: "price-excluton-opsluitband-grijs" },
  "paving.sand": { kind: "material" },
  "fence.panels": { kind: "material", source: "fence-panel", priceSourceId: "price-elephant-finch-grenen-scherm" },
  "fence.fits": { kind: "material" },
  "fence.posts": { kind: "material" },
  "fence.baseplates": { kind: "material" },
  "fence.gates": { kind: "material" },
  "green.hedge": { kind: "material" },
  "green.border": { kind: "material" },
  "green.lawn": { kind: "material", source: "price", priceSourceId: "price-graszoden-premium-siergras" },
  "green.plant": { kind: "material" },
  "hard.gravel.volume": { kind: "material" },
  "hard.deck": { kind: "material" },
  "hard.planter": { kind: "material" },
  "light.point": { kind: "material" },
  "machine.plate": { kind: "machine", source: "price", priceSourceId: "price-boels-trilplaat-licht" },
  "waste.rubble": { kind: "waste", source: "price", priceSourceId: "price-afval-schoon-puin-6m3" },
  "waste.soil": { kind: "waste", source: "price", priceSourceId: "price-afval-schone-grond-6m3" },
  "waste.green": { kind: "waste", source: "price", priceSourceId: "price-afval-tuin-plantsoen-6m3" },
  "waste.mixed": { kind: "waste", source: "price", priceSourceId: "price-afval-bouw-sloop-6m3" }
};
