# IMPLEMENTATION_STATUS

Lees dit bestand, `git status` en alleen de relevante hoofdstukken van
`docs/SEAL_BUILD_BRIEF.md` bij hervatten. Begin niet opnieuw met onderzoek.

**Branch:** `claude/sealcleaning-website-overhaul-gvgtfj`, gebaseerd op de
huidige `main` (live op sealcleaning.nl). Nog niet gemerged — vraag de
eigenaar wanneer een PR/merge gewenst is.

## Afgerond — ch.48 tier 1 (Herstel waarheid)

Diensten-link, foto/categorie-mismatch, zichtbaar WhatsApp-nummer, oud
telefoonnummer. Zie `docs/SOURCE_REGISTER.md` voor bewijs per punt.

## Afgerond — ch.48 tier 2 (Datafundament)

`js/project-state.js`, `data/services.js`, `data/fence-systems.js`,
`data/paving-products.js`, `data/price-sources.json`, `data/projects.js`,
`data/reviews.js` (leeg). Geverifieerd tegen de ch.28-rekenvoorbeelden,
incl. een drijvendekommabug die de test zelf opving (zie commit e4c8480).

## Afgerond — ch.48 tier 3 (2D + 3D configurator) en deels tier 4

Nieuwe route **`/project-samenstellen/`** (gelinkt vanaf de homepage-hero als
primaire CTA, en in elke footer). Modules in `js/configurator/`:

- `geometry.js` — zuivere layoutberekening (schuttingpanelen/passtukken/
  palen met deduplicatie, bestratingsraster met randsnede), door 2D én 3D
  gedeeld. Unit-getest tegen ch.28: L-vorm 8,40+4,20m → 12,60m met 1 gedeelde
  hoekpaal; poort trekt af tot 11,60m; 24m² / 60×60cm / 5% snijverlies → 70
  tegels (exact, incl. fix van een drijvendekommafout).
- `svg-scene.js` — altijd-werkende 2D/SVG-weergave (ch.16: volledig bruikbaar
  zonder WebGL2), met maatlabels, m²-labels, gesneden tegels visueel anders,
  bestaande-object-laag.
- `three-scene.js` — echte 3D met **vendored, gepinde Three.js 0.186.1**
  (`vendor/three/`, MIT-licentie, NOTICE.md met herkomst/upgrade-instructie;
  importmap in de pagina, geen CDN). WebGL2-detectie vóór lazy-load; zonder
  support een duidelijke statusmelding + de 2D-tekening blijft volledig
  bruikbaar. InstancedMesh voor tegels (incl. niet-uniforme schaal voor
  randstukken). Render-loop stopt in rust (idle-timeout na OrbitControls-
  damping), pauzeert op `visibilitychange`, pixelratio begrensd (1,5 mobiel /
  2 desktop), volledige `dispose()` (geometry/material/renderer/listeners).
  3D/boven/voor camerastanden, camera-reset. Branded PNG-export
  (`exportPng()`, canvas.toBlob direct na render — geen permanente
  `preserveDrawingBuffer`) met Sealcleaning-merkbalk.
- `app.js` — stappen "Uw project → Maten & vorm → Materialen → Situatie →
  Overzicht" (ch.34), meervoudige dienstkeuze, schutting I/L/U met poorten
  (geometrie + validatie), bestrating met meerdere vlakken + overlapcheck,
  materiaal-/systeemkeuze, basis situatie-intake, **5
  commerciële routes (ch.35, tier 4)**, live samenvatting + prijsindicatie
  (ch.20: alleen bekende materiaalcomponent, expliciet "geen projecttotaal",
  bron+peildatum, slaat `status:"stale"`-rijen over), "bewaar op dit
  apparaat" (30 dagen, expliciet, met "opnieuw beginnen"), "download dossier"
  (tekstbestand, ch.23-fallback zonder backend) en overdracht naar het
  bestaande contactformulier via `sessionStorage` + `js/wizard-prefill.js`
  (uitgebreid, niet vervangen) — geverifieerd end-to-end: omschrijving op
  `/contact/` bevat de volledige projectsamenvatting.

**Getest (Playwright, Chromium, incl. software-WebGL):** service-selectie,
L/U-vormen met poorten, gate-validatiefout toont/verdwijnt live (bug
gevonden én gefixt tijdens deze sessie — zie "Bekende bugs gefixt"
hieronder), bestratingsoverlap-waarschuwing, 2D-render, 3D-render in alle
3 camerastanden, PNG-export + branding, mobiele viewport 390px (geen
horizontale scroll, sticky onderbalk zichtbaar), localStorage-save/reload,
volledige handoff naar `/contact/`. Geen consolefouten (behalve een
sandbox-eigen Google Fonts TLS-fout, niet-repro op een echte host).

### Bekende bugs gefixt tijdens deze sessie

- `deriveTileCount`: drijvendekommaruis (24×1.05/0.36 = 70,00000000000001)
  duwde een exacte grens naar een tegel te veel. Fix: rond op 6 decimalen
  vóór `Math.ceil`.
- `renderScenesAndSummary` riep alleen de scene-render aan, niet het
  stappaneel: een poort-validatiefout verscheen niet live bij het wijzigen
  van een zijlengte. Fix: paneel wordt nu altijd meegerenderd (velden
  gebruiken `change`, niet `input`, dus geen focusverlies).
- Vendoring miste aanvankelijk `three.core.js` (three.module.js is een dunne
  wrapper eromheen) → 404 bij 3D-load. Toegevoegd.
- Eigen regressie uit de tier-1 fix: de projecten-tegel die werd
  omgezet naar snoeiwerk had bijgewerkte `data-*`-attributen maar nog de
  oude zichtbare `<h3>`/meta-tekst ("Schutting met horizontale lamellen").
  Gefixt in dezelfde sessie vóór de tier-2-commit.

### Bewust (nog) niet gebouwd in tier 3 — expliciete scope-keuzes

- **Alleen rechthoekige tuin.** Vrije polygooncontour (ch.15: L/U/vrije vorm
  voor het tuinvlak zelf, los van de schuttingvorm) is niet geïmplementeerd.
  `garden.polygon` bestaat in het schema maar wordt nergens gevuld/gebruikt.
- **Geen drag-to-edit.** Alles gaat via getalsvelden — dat is zelf al de
  verplichte toegankelijke invoermethode (ch.16: "altijd een alternatief
  zonder drag"), dus functioneel compliant, maar de optionele drag-laag
  ontbreekt.
- **Bestaande/te-verwijderen objecten:** alleen twee checkboxen (bestaande
  schutting/bestrating weg) in plaats van de volledige catalogus uit ch.37
  (boom/stronk, kabels, obstakels, etc.) en geen `existingObjects[]`-UI
  (het datamodel en de scene-rendering ervoor bestaan al in
  `project-state.js`/`svg-scene.js`, alleen de formulier-UI ontbreekt nog).
- **Materiaalvergelijking (max. 3 varianten, ch.17)** en **ontwerp-export
  als JSON/deellink** zijn niet gebouwd.
- **Gates alleen toevoegen met vaste default-offset/breedte** — er is nog
  geen veld om een bestaande poort se offset/breedte te wijzigen (wel
  verwijderen + opnieuw toevoegen).
- Alleen Chromium met Playwright getest in deze sessie; geen Firefox/WebKit-
  engine-check, geen fysieke mobiele toestellen.

## Afgerond — ch.48 tier 5 (prijsboek/`/prijzen/`)

`prijzen/index.html` + `js/prijzen.js`: rendert de prijstabellen rechtstreeks
uit `data/price-sources.json` (gegroepeerd, bron+peildatum per regel,
zichtbare "verouderd"-badge op de 3 stale HomingXL-regels), plus uitleg van
de drie prijsniveaus en kostendrivers uit ch.20. Gelinkt in Diensten-submenu
en elke footer. `data/price-sources.json` kreeg een `group`-veld per regel
voor de indeling.

## Afgerond — ch.48 tier 6 (deels — eerlijkheid van de fallback)

Kernprobleem uit ch.23 gefixt: het contactformulier liet foto's selecteren,
maar een `mailto:`-link kan geen bijlagen meesturen — de succesmelding zei
dat niet. `js/main.js` toont nu expliciet een waarschuwing wanneer
bestanden zijn geselecteerd ("voeg ze zelf toe in uw mailprogramma"), herbruikbaar
via `data-attachment-noun`/`data-attachment-alt-channel` op elk formulier.
Zelfde fix voor de FAQ-tekst op `/contact/`. **Nog niet gebouwd:** een echt
`formEndpoint`/adapter-architectuur (ch.23) — er is geen backend/provider
gekozen; dat vereist een keuze van de eigenaar (zie onder).

## Afgerond — ch.48 tier 8 (B2B + werken met ons)

`voor-aannemers/index.html`: B2B-landingspagina (onderaanneming, schutting/
hekwerk, herstelbestrating, terreinonderhoud, opleverwerk, periodiek
onderhoud, tijdelijke capaciteit) met intakeformulier (bedrijf, optioneel
KvK, contactpersoon/rol, locatie, discipline, scope, planning, veiligheids-/
toegangseisen, bestek/tekeningen/foto's, prijsvorm) en uitleg dat
btw-verlegging per aanvraag wordt beoordeeld, nooit automatisch.
`werken-met-ons/index.html`: expliciet geframed als "open samenwerking /
interesse", nooit als vacature-belofte, met discipline/regio/beschikbaarheid/
ervaring/rijbewijs/gereedschap/KvK/VCA/tarief/motivatie en optionele
CV-upload (met dezelfde bijlage-waarschuwing). Beide herbruiken het
algemene formulierhandler-patroon uit `js/main.js` (nu met
`data-subject-prefix` voor een passend e-mailonderwerp per pagina) in
plaats van het te dupliceren. Gelinkt in elke footer + sitemap.

## Afgerond — ch.48 tier 7 (projectcases/SEO/content)

- `kennisbank/schutting-opmeten/`, `kennisbank/bestratingsoppervlak-berekenen/`,
  `kennisbank/hout-beton-vs-composiet/`: 3 echte artikelen per ch.25 (geen
  AI-vulling), met eigen SVG-tekening resp. het al-geverifieerde
  rekenvoorbeeld resp. een generieke vergelijkingstabel. `kennisbank/index.html`
  linkt ernaartoe; resterende onderwerpen blijven eerlijk "op de planning".
- **12 statische detailroutes** `/projecten/<slug>/`, gegenereerd uit
  `data/projects.js` (één bron, geen duplicatie) — rechtstreeks openbaar en
  refresh-bestendig op GitHub Pages, met CreativeWork+BreadcrumbList schema,
  gerelateerde projecten, en een CTA die alleen het diensttype doorgeeft aan
  de configurator (nooit de getoonde maten als zijnde van de bezoeker).
  `projecten/index.html`-tegels kregen `data-slug`; de lightbox heeft nu ook
  een gewone link naar de detailpagina (`js/lightbox.js`).
- **Nog niet gedaan:** `data/materials.js` (officiële productcatalogus,
  ch.21) — er zijn alleen de generieke presets in `data/fence-systems.js`/
  `paving-products.js`; een echte catalogus heeft pas nut zodra een werkelijk
  product is geverifieerd.

## Nog niet gestart

- Tier 9: document-/factuurarchitectuur (offerte/werkbon/factuurconcept,
  `docs/PRICING_OPERATIONS.md`).
- Tier 10-12: webshop/checkout (bewust niet, vereist backend+juridisch
  gereed), analytics-laag, onafhankelijke eindreview.
- Supplier/inkoop/margin-engine (ch.38-39): bewust niet gebouwd, vereist
  echte bedrijfsinterne cijfers die nog niet zijn aangeleverd.
- Configurator-scope-keuzes uit tier 3 (vrije tuincontour, drag-to-edit,
  volledige `existingObjects[]`-catalogus, materiaalvergelijking,
  ontwerp-export als JSON/deellink) staan nog open — zie vorige sectie
  in de commit-geschiedenis van dit bestand indien nodig.

## Openstaande vragen voor de eigenaar

- Formulierbackend/endpoint-voorkeur (ch.23) — zonder is "aanvraag
  versturen" altijd een bewuste actie naar het bestaande formulier, nooit
  een geclaimde ontvangst.
- Domeinmail (info@sealcleaning.nl) nog niet bevestigd.
- Leveranciers-/inkoopgegevens voor de margin-engine.

## Belangrijk voor hervatten: commit vaak

Deze sessie verloor eenmalig ongecommit werk (de eerste versie van
`/prijzen/`) doordat de container tussen beurten werd ververst zonder dat
niet-gepushte bestanden behouden bleven. Commit en push daarom na elk
afgerond, getest onderdeel — niet pas aan het einde van een tier.

## Eerstvolgende taak bij hervatten

Tier 1-8 zijn afgerond of substantieel afgerond (zie hierboven). Tier 9-12
vereisen grotendeels echte bedrijfsbeslissingen (formulierbackend,
leveranciersdata, boekhoud-/factuursysteem, betaalprovider) die niet
zonder de eigenaar kunnen worden ingevuld. Zinvolle volgende stap zonder
die input: het datamodel voor offerte/werkbon/factuurconcept (ch.40) en
`docs/PRICING_OPERATIONS.md` opzetten, als voorbereiding — geen officiële
factuurnummering genereren vanuit de browser (ch.40: dat vereist een
backend). Daarna pas tier 10 (checkout, alleen indien backend/juridisch
gereed) en tier 11-12 (analytics, eindreview).
