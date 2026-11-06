/**
 * Projectcases per docs/SEAL_BUILD_BRIEF.md hoofdstuk 8.
 *
 * Status: migratie van de huidige projecten/index.html-tegels naar het
 * datamodel, nog GEEN volledige nieuwe visuele contact-sheet audit van alle
 * ~67 bronfoto's (die stap staat open, zie docs/IMPLEMENTATION_STATUS.md).
 * Elke case hieronder is vooralsnog één foto = één case, met de titel/meta
 * die al op de site stond. `verification` geeft eerlijk aan wat gecontroleerd is:
 *  - "visually-confirmed": een mens/Claude heeft de pixels bekeken en de tekst klopt.
 *  - "filename-based": alleen bestandsnaam/bestaande caption, nog niet apart herbevestigd.
 * Vul situation/workDone/materials pas in nadat die per case kunnen worden onderbouwd;
 * laat lege velden null (ch.8: onbekende velden zijn null, geen verzonnen tekst).
 */

export const PROJECTS = [
  {
    "slug": "oprit-en-bestrating-gereinigd",
    "title": "Oprit en bestrating gereinigd met hogedruk",
    "primaryService": "hogedrukreiniging",
    "services": [
      "hogedrukreiniging",
      "bestrating"
    ],
    "location": null,
    "coverImage": "hogedrukreiniging-oprit-klinkers-aanhanger",
    "gallery": [
      {
        "image": "hogedrukreiniging-oprit-klinkers-aanhanger",
        "alt": "Klinkerbestrating van een oprit tijdens het reinigen met hogedruk, met werkslang en aanhanger",
        "role": "cover"
      },
      {
        "image": "hogedrukreiniging-klinkers-scheidslijn-voor-na",
        "alt": "Klinkerbestrating met duidelijke scheidslijn: links hogedruk gereinigd, rechts nog niet gereinigd",
        "role": "during"
      },
      {
        "image": "hogedrukreiniging-oprit-klinkers-gereinigd-deel",
        "alt": "Oprit van grijze klinkers in visgraatverband, deels gereinigd met hogedruk",
        "role": "during"
      },
      {
        "image": "hogedrukreiniging-oprit-klinkers-resultaat",
        "alt": "Oprit met gereinigde grijze klinkers naast een donkere inrit met sierbed",
        "role": "after"
      },
      {
        "image": "hogedrukreiniging-zijpad-klinkers-avondzon",
        "alt": "Gereinigd klinkerpad langs een woning en klimopheg in de avondzon",
        "role": "after"
      },
      {
        "image": "hogedrukreiniging-zijpad-klinkers-heg",
        "alt": "Lang klinkerpad met houten hekwerk en klimopheg",
        "role": "after"
      },
      {
        "image": "hogedrukreiniging-pad-glazen-overkapping",
        "alt": "Smal klinkerpad langs een overkapping met glazen panelen en een houten hekwerk",
        "role": "detail"
      }
    ],
    "summary": "Klinkerbestrating van oprit en zijpad met hogedruk gereinigd.",
    "situation": null,
    "workDone": [
      "Klinkerbestrating van de oprit en het zijpad gereinigd met een hogedrukreiniger",
      "Verkleuring en vuil van de stenen verwijderd, zodat het patroon van de bestrating weer duidelijk zichtbaar is"
    ],
    "materials": [],
    "duration": null,
    "dimensions": null,
    "tags": [
      "hogedrukreiniging",
      "bestrating"
    ],
    "featured": true,
    "verification": "visually-confirmed",
    "publishStatus": "published"
  },
  {
    "slug": "klimopheg-gesnoeid-langs-oprit",
    "title": "Klimopheg strak gesnoeid langs lange oprit",
    "primaryService": "snoeiwerk",
    "services": [
      "snoeiwerk",
      "tuinonderhoud"
    ],
    "location": null,
    "coverImage": "klimopheg-gesnoeid-oprit-lang",
    "gallery": [
      {
        "image": "klimopheg-gesnoeid-oprit-lang",
        "alt": "Lange gesnoeide klimopheg langs een klinkeroprit naast een witte woning",
        "role": "cover"
      },
      {
        "image": "klimopheg-gesnoeid-houten-hekwerk",
        "alt": "Gesnoeide klimopheg langs een klinkeroprit met bruin houten hekwerk en terras",
        "role": "detail"
      },
      {
        "image": "klimopheg-gesnoeid-zijkant-detail",
        "alt": "Zijkant van een strak gesnoeide klimopheg langs de klinkerbestrating",
        "role": "detail"
      },
      {
        "image": "klimopheg-gesnoeid-bovenkant-vlak",
        "alt": "Klimopheg met vlakke bovenkant gesnoeid, gezien vanaf het terras",
        "role": "detail"
      },
      {
        "image": "klimopheg-gesnoeid-terras-schuur",
        "alt": "Gesnoeide klimopheg achter een terras met loungestoelen en een witte schuur",
        "role": "detail"
      },
      {
        "image": "klimopheg-gesnoeid-hek-kunstgras-detail",
        "alt": "Gesnoeide klimopheg naast een zwart hekwerk en kunstgras",
        "role": "detail"
      },
      {
        "image": "kunstgras-speelveld-zwart-hekwerk-klimopheg",
        "alt": "Kunstgras speelveld met zwart hekwerk en een gesnoeide klimopheg erachter",
        "role": "detail"
      }
    ],
    "summary": "Lange klimopheg langs een oprit in model gesnoeid.",
    "situation": null,
    "workDone": [
      "Klimopheg over de volle lengte van de oprit in model gesnoeid, met rechte zijkanten en een vlakke bovenkant",
      "Ook de heg achter het kunstgras speelveld is in model gehouden"
    ],
    "materials": [],
    "duration": null,
    "dimensions": null,
    "tags": [
      "snoeiwerk",
      "tuinonderhoud"
    ],
    "featured": true,
    "verification": "visually-confirmed",
    "publishStatus": "published"
  },
  {
    slug: "tuin-aan-het-water-compleet",
    title: "Tuin aan het water, compleet ingericht",
    primaryService: "tuinaanleg",
    services: ["tuinaanleg"],
    location: { city: "Regio Drechtsteden", verified: false },
    coverImage: "waterzijde-tuin-terras-hortensia",
    gallery: [{ image: "waterzijde-tuin-terras-hortensia", alt: "Aangelegde tuin aan het water met terras en border", role: "cover" }],
    summary: "Aangelegde tuin aan het water met terras en border.",
    situation: null, workDone: null, materials: [], duration: null, dimensions: null,
    tags: ["tuinaanleg"], featured: true, verification: "visually-confirmed", publishStatus: "published"
  },
  {
    slug: "grenen-schutting-zwarte-onderplaat",
    title: "Grenen schutting op zwarte onderplaat",
    primaryService: "schutting",
    services: ["schutting"],
    location: { city: "Dordrecht", verified: false },
    coverImage: "schutting-grenen-zwarte-voet-1",
    gallery: [
      { image: "schutting-grenen-zwarte-voet-1", alt: "Nieuwe schutting in grenenhout op een zwarte onderplaat", role: "cover" },
      { image: "schutting-grenen-zwarte-voet-2", alt: "Nieuwe schutting in grenenhout op een zwarte onderplaat, detail", role: "detail" },
      { image: "schutting-grenen-zwarte-voet-3", alt: "Nieuwe schutting in grenenhout op een zwarte onderplaat, aanzicht", role: "detail" }
    ],
    summary: "Nieuwe schutting in grenenhout op een zwarte onderplaat, met border.",
    situation: "De achtertuin had een verouderde erfafscheiding en een border die opnieuw ingericht moest worden.",
    workDone: ["Oude erfafscheiding verwijderd", "Nieuwe schutting gesteld en verankerd", "Border uitgegraven en voorzien van verse tuinaarde en beplanting"],
    materials: [], duration: null, dimensions: null,
    tags: ["schutting"], featured: true, verification: "visually-confirmed", publishStatus: "published"
  },
  {
    slug: "terras-houtlook-tegelpad",
    title: "Terras met houtlook tegelpad",
    primaryService: "bestrating",
    services: ["bestrating"],
    location: { city: "Regio Drechtsteden", verified: false },
    coverImage: "terras-houtlook-kunstgras-pad-1",
    gallery: [
      { image: "terras-houtlook-kunstgras-pad-1", alt: "Terras met houtlook tegelpad tussen kunstgras", role: "cover" },
      { image: "terras-houtlook-kunstgras-pad-aanleg-1", alt: "Aanleg van het houtlook tegelpad", role: "during" },
      { image: "terras-houtlook-kunstgras-pad-aanleg-2", alt: "Aanleg van het houtlook tegelpad, vervolg", role: "during" }
    ],
    summary: "Terras met houtlook tegelpad tussen kunstgras.",
    situation: null, workDone: null, materials: [], duration: null, dimensions: null,
    tags: ["bestrating"], featured: false, verification: "filename-based", publishStatus: "published"
  },
  {
    slug: "sierboom-teruggesnoeid-voortuin",
    title: "Sierboom fors teruggesnoeid",
    primaryService: "snoeiwerk",
    services: ["snoeiwerk"],
    location: { city: "Dordrecht", verified: false },
    coverImage: "boom-gesnoeid-voortuin",
    gallery: [{ image: "boom-gesnoeid-voortuin", alt: "Sierboom fors teruggesnoeid in voortuin", role: "cover" }],
    summary: "Sierboom fors teruggesnoeid in voortuin.",
    situation: null, workDone: null, materials: [], duration: null, dimensions: null,
    tags: ["snoeiwerk"], featured: false, verification: "filename-based", publishStatus: "published"
  },
  {
    slug: "hagen-strak-geknipt",
    title: "Hagen strak in vorm geknipt",
    primaryService: "tuinonderhoud",
    services: ["tuinonderhoud"],
    location: { city: "Dordrecht e.o.", verified: false },
    coverImage: "voortuin-haag-gesnoeid",
    gallery: [{ image: "voortuin-haag-gesnoeid", alt: "Voortuin met strak gesnoeide haag", role: "cover" }],
    summary: "Voortuin met strak gesnoeide haag.",
    situation: null, workDone: null, materials: [], duration: null, dimensions: null,
    tags: ["tuinonderhoud"], featured: false, verification: "filename-based", publishStatus: "published"
  },
  {
    slug: "border-renovatie-materiaal",
    title: "Border opnieuw ingericht na renovatie",
    primaryService: "tuinrenovatie",
    services: ["tuinrenovatie"],
    location: { city: "Dordrecht", verified: false },
    coverImage: "border-materiaal-voor-renovatie",
    gallery: [
      { image: "border-materiaal-voor-renovatie", alt: "Materiaal klaargezet voor het vernieuwen van een border", role: "during" },
      { image: "border-gecureerd-voortuin", alt: "Border na renovatie in de voortuin", role: "after" }
    ],
    summary: "Materiaal klaargezet voor het vernieuwen van een border.",
    situation: null, workDone: null, materials: [], duration: null, dimensions: null,
    tags: ["renovatie"], featured: false, verification: "filename-based", publishStatus: "published"
  },
  {
    slug: "heester-fors-teruggesnoeid",
    title: "Heester fors teruggesnoeid",
    primaryService: "snoeiwerk",
    services: ["snoeiwerk"],
    location: { city: "Dordrecht e.o.", verified: false },
    coverImage: "snoeiwerk-heester-fors-teruggesnoeid",
    gallery: [{ image: "snoeiwerk-heester-fors-teruggesnoeid", alt: "Heester fors teruggesnoeid in voortuin", role: "cover" }],
    summary: "Heester fors teruggesnoeid in voortuin.",
    situation: null, workDone: null, materials: [], duration: null, dimensions: null,
    tags: ["snoeiwerk"], featured: false, verification: "visually-confirmed", publishStatus: "published",
    note: "Voorheen gepubliceerd als 'schutting-horizontaal-lamellen-zon-1' met schutting-categorie; op 2026-10-07 herlabeld na visuele inspectie (zie docs/IMPLEMENTATION_STATUS.md)."
  },
  {
    slug: "voorpad-sfeerverlichting",
    title: "Voorpad met sfeerverlichting",
    primaryService: "bestrating",
    services: ["bestrating"],
    location: { city: "Dordrecht", verified: false },
    coverImage: "voorpad-bestrating-verlichting",
    gallery: [{ image: "voorpad-bestrating-verlichting", alt: "Bestraat voorpad met sfeerverlichting", role: "cover" }],
    summary: "Bestraat voorpad met sfeerverlichting.",
    situation: null, workDone: null, materials: [], duration: null, dimensions: null,
    tags: ["bestrating"], featured: true, verification: "filename-based", publishStatus: "published"
  },
  {
    slug: "klimopheg-in-model",
    title: "Klimopheg in model gehouden",
    primaryService: "tuinonderhoud",
    services: ["tuinonderhoud"],
    location: { city: "Dordrecht e.o.", verified: false },
    coverImage: "klimop-haag-volledig",
    gallery: [
      { image: "klimop-haag-volledig", alt: "Volledig gesnoeide klimopheg", role: "cover" },
      { image: "klimop-haag-pad", alt: "Klimopheg langs het tuinpad", role: "detail" }
    ],
    summary: "Volledig gesnoeide klimopheg.",
    situation: null, workDone: null, materials: [], duration: null, dimensions: null,
    tags: ["tuinonderhoud"], featured: false, verification: "filename-based", publishStatus: "published"
  },
  {
    slug: "kunstgras-achter-nieuwe-schutting",
    title: "Kunstgras aangelegd achter nieuwe schutting",
    primaryService: "tuinaanleg",
    services: ["tuinaanleg", "schutting"],
    location: { city: "Dordrecht", verified: false },
    coverImage: "terras-kunstgras-opgeleverd",
    gallery: [{ image: "terras-kunstgras-opgeleverd", alt: "Aangelegde achtertuin met kunstgras en terras", role: "cover" }],
    summary: "Aangelegde achtertuin met kunstgras en terras.",
    situation: null, workDone: null, materials: [], duration: null, dimensions: null,
    tags: ["tuinaanleg", "schutting"], featured: false, verification: "filename-based", publishStatus: "published"
  },
  {
    slug: "vijverrand-voor-renovatie",
    title: "Vijverrand vóór renovatie",
    primaryService: "tuinrenovatie",
    services: ["tuinrenovatie"],
    location: { city: "Dordrecht", verified: false },
    coverImage: "vijverrand-voor-renovatie",
    gallery: [{ image: "vijverrand-voor-renovatie", alt: "Verouderde vijverrand voorafgaand aan renovatie", role: "before" }],
    summary: "Verouderde vijverrand voorafgaand aan renovatie.",
    situation: null, workDone: null, materials: [], duration: null, dimensions: null,
    tags: ["renovatie"], featured: false, verification: "filename-based", publishStatus: "published"
  },
  {
    slug: "kastanjehouten-paaltjesschutting",
    title: "Kastanjehouten paaltjesschutting",
    primaryService: "schutting",
    services: ["schutting"],
    location: { city: "Dordrecht", verified: false },
    coverImage: "schutting-kastanje-paaltjes-dordrecht-1",
    gallery: [
      { image: "schutting-kastanje-paaltjes-dordrecht-1", alt: "Nieuwe kastanjehouten paaltjesschutting", role: "cover" },
      { image: "schutting-kastanje-paaltjes-dordrecht-2", alt: "Nieuwe kastanjehouten paaltjesschutting, detail", role: "detail" }
    ],
    summary: "Nieuwe kastanjehouten paaltjesschutting.",
    situation: null, workDone: null, materials: [], duration: null, dimensions: null,
    tags: ["schutting"], featured: false, verification: "filename-based", publishStatus: "published"
  }
];

export function getProjectBySlug(slug) {
  return PROJECTS.find((p) => p.slug === slug) || null;
}

export function getProjectsByService(serviceId) {
  if (!serviceId || serviceId === "alle") return PROJECTS;
  return PROJECTS.filter((p) => p.services.includes(serviceId) || p.tags.includes(serviceId));
}
