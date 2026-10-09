# REQUIREMENTS_INDEX — 160-item register (A–P), per docs/SEAL_MASTER_BRIEF.md v6.0

Status values per v6.0 V6-08: `gebouwd`, `getest`, `nog te bouwen`,
`extern geblokkeerd`, `wacht op goedkeuring`, `definitief besloten`,
`historisch/verouderd`. `getest` means verified in this session via a real
browser (Playwright/Chromium) or a Node unit check, not just code review.
This is an honest self-assessment, not an external audit. Where a row says
"gebouwd" without "getest", it was implemented but not separately verified
in a browser this session.

## A — Oriëntatie en snel de juiste route

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| A01 | nog te bouwen | Geen expliciete 4-doelenkiezer op de homepage; service-index bestaat wel |
| A02 | nog te bouwen | Particulier/zakelijk routes bestaan apart (`/voor-aannemers/`), geen state-behoudende switcher |
| A03 | nog te bouwen | Geen zoekfunctie over diensten/materialen/kennisbank |
| A04 | nog te bouwen | Geen expliciete "kleine klus vs. complete tuin"-keuze buiten de configurator-stappen |
| A05 | nog te bouwen | Geen stijlquiz |
| A06 | nog te bouwen | Tuingebruik (zitten/spelen/privacy) niet als projectveld |
| A07 | nog te bouwen | Onderhoudswens niet als expliciet veld |
| A08 | gebouwd, getest | Contactformulier met foto-upload + eerlijke mailto-fallback |
| A09 | nog te bouwen | `/werkgebied/` toont gebied, geen automatische postcodematch |
| A10 | gebouwd, getest | Bel/WhatsApp-links overal werkend; apart terugbelverzoek niet gebouwd |

## B — Intake die meedenkt

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| B01 | gebouwd | Configurator-/contact-/B2B-/werken-met-ons-formulieren hebben eigen relevante velden |
| B02 | gebouwd, getest | `garden.areaKnown`/`geometryKnown` in `js/project-state.js`, unit-getest |
| B03 | gebouwd | `kennisbank/schutting-opmeten/` met eigen diagram |
| B04 | nog te bouwen | Geen contextuele uitleg per foto-type |
| B05 | nog te bouwen | Geen annotatietool op situatiefoto |
| B06 | nog te bouwen | Configurator-Situatie heeft alleen ondergrond; hoogteverschil/water/obstakels ontbreken als velden |
| B07 | nog te bouwen | Geen apart "eigen materiaal systeem/merk/SKU"-intakeveld (montage-only route bestaat wel als commerciële keuze) |
| B08 | gebouwd | Budget-pill-choice op `/contact/` |
| B09 | gebouwd, getest | Periode-veld in configurator en contactformulier |
| B10 | nog te bouwen | Geen "ontbrekende info"-indicator |

## C — Bestaande tuin en scope

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| C01 | nog te bouwen | Alleen twee verwijder-checkboxen; volledige `existingObjects[]`-catalogus (ch.37) nog niet gebouwd — schema bestaat al |
| C02 | nog te bouwen | Geen aparte "herstellen"-scope |
| C03 | gebouwd | `project.removal` in schema + checkboxen in configurator |
| C04 | gebouwd, getest | Kernflow van de configurator |
| C05 | nog te bouwen | Bestaande (te behouden) poort niet modelleerbaar, alleen nieuwe poorten |
| C06 | nog te bouwen | — |
| C07 | nog te bouwen | — |
| C08 | nog te bouwen | — |
| C09 | gebouwd | "Alleen montage"-route in commerciële routes |
| C10 | nog te bouwen | Geen gedeelde-burenklus-flow |

## D — Tuin tekenen in 2D en 3D

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| D01 | gebouwd, getest | Tuinvlak is rechthoek; L/vrije vorm alleen voor schutting, niet voor het tuinvlak zelf |
| D02 | nog te bouwen | Bekende, gedocumenteerde scope-keuze (zie IMPLEMENTATION_STATUS.md) |
| D03 | gebouwd | Schemavelden aanwezig, niet UI-blootgesteld |
| D04 | gebouwd, getest | I/L/U-schuttingvormen, `js/configurator/geometry.js` |
| D05 | gebouwd, getest | Toevoegen/verwijderen + live validatie; offset/breedte-edit ontbreekt nog |
| D06 | gebouwd, getest | Meerdere vlakken + overlapcontrole |
| D07 | nog te bouwen | Geen groenvakken/gazon/haag als parametrisch object |
| D08 | nog te bouwen | — |
| D09 | gebouwd, getest | 2D/3D-toggle, state behouden |
| D10 | nog te bouwen | — |

## E — Nauwkeurig bedienen en begrijpen

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| E01 | gebouwd | Via formuliervelden, niet klik-op-canvas-selectie |
| E02 | nog te bouwen | Geen snap/grid-bediening (3D-grid is alleen visueel) |
| E03 | gebouwd, getest | Maatlabels in 2D en 3D |
| E04 | nog te bouwen | Geen undo/redo |
| E05 | nog te bouwen | — |
| E06 | nog te bouwen | — |
| E07 | gebouwd, getest | 3D/boven/voor + camera-reset |
| E08 | gebouwd, getest | Mobiele viewport getest (390px, geen horizontale scroll); geen apart "fullscreen canvas"-modus |
| E09 | nog te bouwen | — |
| E10 | gebouwd, getest | 30-dagen opt-in localStorage + "opnieuw beginnen" |

## F — Materialen kiezen en rekenen

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| F01 | deels gebouwd | `data/materials.js`: 3 echte, bron-gekoppelde bestratingsproducten (60×60) selecteerbaar in de configurator; schutting/overige categorieën nog generieke presets, geen inkoopprijzen |
| F02 | gebouwd, getest | Materiaal-/kleurkeuze wijzigt 3D-weergave |
| F03 | nog te bouwen | Geen 3-variantenvergelijking |
| F04 | gebouwd | `kennisbank/hout-beton-vs-composiet/`, statisch, niet interactief |
| F05 | gebouwd, getest | Materiaalpreset gefilterd op compatibel systeem |
| F06 | gebouwd, getest | Legpatroon/formaat beïnvloedt raster |
| F07 | gebouwd, getest | 5% snijreserve, geverifieerd rekenvoorbeeld |
| F08 | extern geblokkeerd | Vereist leveranciersdata |
| F09 | nog te bouwen | — |
| F10 | gebouwd, getest | Tekstdossier-download |

## G — Budget, prijzen en alternatieven

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| G01 | gebouwd, getest | `/prijzen/` toont € 60/€ 72,60 + voorbeelden |
| G02 | gebouwd | Commerciële routes onderscheiden dit |
| G03 | gebouwd, getest | Alleen bekende regels opgeteld, nooit als "compleet" getoond |
| G04 | gebouwd, getest | Format-mismatch toont nu eerlijk "nog geen prijs" i.p.v. verkeerd product (v6.0 H04-fix) |
| G05 | gebouwd, getest | `observedAt`/`reviewAfter`/`status:"stale"` in `data/price-sources.json` |
| G06 | nog te bouwen | Geen A/B/C-variantvergelijking |
| G07 | nog te bouwen | Hangt af van G06 |
| G08 | nog te bouwen | — |
| G09 | gebouwd | Kostdrivers-uitleg op `/prijzen/` |
| G10 | extern geblokkeerd | Dossier/contact-handoff bestaat; echte serverontvangst ontbreekt |

## H — Groen en onderhoud

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| H01–H07, H09–H10 | nog te bouwen | Geen plantencatalogus, haagcalculator of onderhoudskalender gebouwd |
| H08 | gebouwd | `/periodiek-tuinonderhoud/` beschrijft eenmalig-vs-periodiek keuze, geen automatisch tarief |

## I — Inspiratie en fotografie

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| I01 | gebouwd, getest | Filterbalk op `/projecten/` |
| I02 | gebouwd, getest | 12 detailroutes met situatie/workDone waar bekend |
| I03 | gebouwd | Gallery op detailpagina's met >1 foto |
| I04 | nog te bouwen | Geen voor/na-slider |
| I05 | gebouwd, getest | Lightbox + directe link naar detailpagina |
| I06 | nog te bouwen | — |
| I07 | nog te bouwen | — |
| I08 | gebouwd | CTA "gebruik als inspiratie" geeft alleen dienst mee, geen maten/adres |
| I09 | gebouwd | `data/projects.js` als manifest; focal point niet expliciet per foto |
| I10 | nog te bouwen | Geen toestemmingsregistratiesysteem (eigen bedrijfsfoto's, dus lager risico) |

## J — Voorbereiding, levering en planning

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| J01 | nog te bouwen | `access.rearPassageWidthMm` in schema, geen UI-veld |
| J02–J03 | nog te bouwen | Afvalkeuze/-hoeveelheid niet als UI-stap |
| J04–J10 | extern geblokkeerd / nog te bouwen | Vereist planning-/agendabackend |

## K — Offerte en opdracht

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| K01–K10 | extern geblokkeerd | Vereist documentbackend/boekhoudkoppeling; datamodel (ch.18/40) staat klaar in `js/project-state.js` |

## L — Klantdossier en uitvoering

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| L01–L09 | extern geblokkeerd | Vereist auth/backend |
| L10 | gebouwd, getest | Gelijkwaardige telefoon/e-mail-route bestaat voor iedereen (geen portaal-verplichting) |

## M — Oplevering en nazorg

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| M01–M03, M06–M10 | extern geblokkeerd | Vereist backend/CRM |
| M04–M05 | nog te bouwen | Geen product-/garantiedatamodel |

## N — Rechten, privacy en vertrouwen

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| N01 | wacht op goedkeuring | `js/config.js` heeft gegevens; juridische verificatie (KvK/btw/naam) nog nodig |
| N02 | wacht op goedkeuring | `/voorwaarden/` heeft nu de volledige 24-artikel v6.0-structuur; vereist juridische toets vóór bindende publicatie |
| N03 | nog te bouwen | — |
| N04 | wacht op goedkeuring | `/privacy/` heeft nu de volledige verwerkingstabel (8 categorieën, doel + bewaartermijn/grondslag); vereist juridische toets |
| N05 | nog te bouwen | Geen cookiemodule (momenteel ook geen tracking actief) |
| N06 | nog te bouwen | — |
| N07 | nog te bouwen | — |
| N08 | gebouwd, getest | Disclaimers bij elke prijsindicatie/visualisatie |
| N09 | gebouwd | Genoemd in `kennisbank/schutting-opmeten/`, geen directe Omgevingsloket-link |
| N10 | gebouwd, deels getest | Mobiel/toetsenbord ad-hoc getest; geen formele WCAG 2.2 AA-audit |

## O — Zakelijk en samenwerken

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| O01 | gebouwd, getest | `/voor-aannemers/` intakeformulier |
| O02 | gebouwd | Door O01 gedekt, geen aparte VvE-flow |
| O03 | gebouwd | Tekstueel toegelicht op `/voor-aannemers/` |
| O04 | nog te bouwen | — |
| O05 | extern geblokkeerd | Vereist documentbackend |
| O06 | gebouwd, getest | Bestandsupload op `/voor-aannemers/` |
| O07 | gebouwd | `/werken-met-ons/` intake |
| O08 | gebouwd, getest | CV/certificaat-upload met eerlijke bijlage-waarschuwing |
| O09 | gebouwd, getest | — |
| O10 | extern geblokkeerd | Vereist auth |

## P — Administratie en bedrijfsvoering

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| P01–P10 | extern geblokkeerd | Vereist boekhoud-/factuur-/backendkoppeling; geen van deze bestaat op een statische GitHub Pages-site |

## Samenvatting

- **Substantieel gebouwd en (deels) getest:** A08, A10, B01–B03/B08–B09, C03–C04/C09, D01/D04–D06/D09, E03/E07–E08/E10, F02/F04–F07/F10, G01–G05/G09, I01–I03/I05/I08–I09, N08–N10, O01/O03/O06–O09.
- **Kerngat, bewust niet gebouwd (gedocumenteerd):** vrije tuincontour (D02), volledige existingObjects-catalogus (C01/C05), 3-variantenvergelijking (F03/G06), ontwerp-export als JSON/deellink.
- **Extern geblokkeerd (vereist backend/leverancier/auth):** vrijwel alle K/L/M/P, plus F08/G10/O05/O10 — dit is de inhoud van tier 9-12 uit `docs/IMPLEMENTATION_STATUS.md`.
- **Wacht op goedkeuring:** N01 (juridische identiteitsverificatie), en impliciet N02-N04 (juridische toets vóór bindende publicatie).
