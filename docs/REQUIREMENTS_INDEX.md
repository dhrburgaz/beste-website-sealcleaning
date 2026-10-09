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
| A01 | gebouwd, getest | Doelkeuze in configurator stap 1 zet passende dienst aan; `?doel=`/`?service=` werken (fix: 12 bestaande `?service=`-links werden genegeerd) |
| A02 | gebouwd, getest | Particulier/zakelijk in configurator; zakelijk verwijst naar `/voor-aannemers/` zonder ontwerpverlies; in dossier |
| A03 | gebouwd, getest | `/zoeken/` over alle echte pagina's + materialen (`tools/build-search-index.mjs`), synoniemen, lege toestand |
| A04 | gebouwd, getest | Omvang in stap 1; "kleine klus" klapt uitgebreide situatievragen in; geen minimumprijs |
| A05 | wacht op eigenaar | Vereist stijltoewijzing (modern/natuurlijk/…) per echte case door de eigenaar; niet zelf verzonnen |
| A06 | gebouwd, getest | Gebruik van de tuin (meerkeuze) in dossier |
| A07 | gebouwd, getest | Onderhoudswens in dossier; expliciet geen levensduurbelofte |
| A08 | gebouwd, getest | Contactformulier met foto-upload + eerlijke mailto-fallback |
| A09 | gebouwd, getest | Plaatsnaamcheck tegen gepubliceerd werkgebied (`data/service-area.js`); postcodegrenzen niet bevestigd → niet gebruikt |
| A10 | gebouwd, getest | Bel/WhatsApp-links overal werkend; apart terugbelverzoek niet gebouwd |

## B — Intake die meedenkt

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| B01 | gebouwd | Configurator-/contact-/B2B-/werken-met-ons-formulieren hebben eigen relevante velden |
| B02 | gebouwd, getest | `garden.areaKnown`/`geometryKnown` in `js/project-state.js`, unit-getest |
| B03 | gebouwd | `kennisbank/schutting-opmeten/` met eigen diagram |
| B04 | gebouwd, getest | Fototips per dienst met uitleg in configurator-overzicht (upload zelf via contactformulier) |
| B05 | extern geblokkeerd | Masterdossier type B: foto-annotatie moet veilig met de aanvraag mee; vereist upload-backend |
| B06 | gebouwd, getest | Ondergrond, hoogteverschil, natte plekken, obstakels — elk met "weet ik niet" |
| B07 | gebouwd, getest | Systeem/SKU/aantallen bij route "alleen montage"; controle als voorwaarde, geen automatisch akkoord |
| B08 | gebouwd | Budget-pill-choice op `/contact/` |
| B09 | gebouwd, getest | Periode-veld in configurator en contactformulier |
| B10 | gebouwd, getest | Niet-blokkerende lijst "nuttig om aan te vullen" met sprong naar stap; geen score |

## C — Bestaande tuin en scope

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| C01 | gebouwd, getest | Objecten met status behouden; niet als materiaal/montage gerekend; aparte groep in dossier |
| C02 | gebouwd, getest | Schutting "herstellen" met schadeomschrijving; geen automatische vervanging |
| C03 | gebouwd | `project.removal` in schema + checkboxen in configurator |
| C04 | gebouwd, getest | Kernflow van de configurator |
| C05 | deels gebouwd | "Bestaande poort" als object (behouden/verwijderen); draairichting/aansluiting nog niet vastlegbaar |
| C06 | gebouwd, getest | Behouden boom/haag/border krijgt zichtbare beschermingszone + dossiernotitie |
| C07 | gebouwd, getest | Kabels/leidingen als klantinformatie; tekst conform voorwaarden art. 10, vervangt geen onderzoek |
| C08 | gebouwd, getest | Erfgrens/burenafspraak met disclaimer (geen grensbepaling/vergunning) |
| C09 | gebouwd | "Alleen montage"-route in commerciële routes |
| C10 | extern geblokkeerd | Type B: gedeelde scope met gescheiden contactgegevens vereist backend/accounts |

## D — Tuin tekenen in 2D en 3D

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| D01 | gebouwd, getest | Rechthoek, L-vorm en vrije contour; zelfde contour en oppervlak in 2D en 3D |
| D02 | gebouwd, getest | Hoekpunten toevoegen/verwijderen/typen/slepen; zelfdoorsnijding/samenvallende punten/<1 m² geblokkeerd met uitleg |
| D03 | gebouwd | Schemavelden aanwezig, niet UI-blootgesteld |
| D04 | gebouwd, getest | I/L/U-schuttingvormen, `js/configurator/geometry.js` |
| D05 | gebouwd, getest | Zijde, positie, doorgang, scharnier, draairichting; draaicirkel in 2D, blad in 3D; botsing met objecten/andere poort gemeld |
| D06 | gebouwd, getest | Meerdere vlakken + overlapcontrole |
| D07 | gebouwd, getest | Haag (m), border en gazon (m²) als parametrische objecten |
| D08 | gebouwd, getest | Huiswand, schuur, boom als schematische referentie in 2D/3D |
| D09 | gebouwd, getest | 2D/3D-toggle, state behouden |
| D10 | extern geblokkeerd | Type B: gecontroleerde rasterreferentie-import vereist veilige upload/opslag |

## E — Nauwkeurig bedienen en begrijpen

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| E01 | gebouwd, getest | Klik/tik selecteert in 2D; positievelden als toetsenbordequivalent |
| E02 | gebouwd, getest | Optioneel raster 10/25/50/100 cm met zichtbare status; alleen slepen snapt, invoer blijft mm-exact |
| E03 | gebouwd, getest | Maatlabels in 2D en 3D |
| E04 | gebouwd, getest | Undo/redo (knoppen + Ctrl+Z/Ctrl+Shift+Z/Ctrl+Y) op state-momentopnamen |
| E05 | gebouwd, getest | Behouden objecten standaard vast; expliciet ontgrendelen |
| E06 | gebouwd, getest | Dupliceren objecten/vlakken met nieuw id; overlapwaarschuwing tegen dubbel rekenen |
| E07 | gebouwd, getest | 3D/boven/voor + camera-reset |
| E08 | gebouwd, getest | Vergroot-werkvlakmodus met terugknop; tekening sticky op mobiel; eerste tik selecteert alleen; 44px-handgrepen; 360/390/740px getest |
| E09 | gebouwd, getest | Zonrichting/-hoogte met schaduw in 3D, gelabeld als illustratie |
| E10 | gebouwd, getest | 30-dagen opt-in localStorage + "opnieuw beginnen" |

## F — Materialen kiezen en rekenen

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| F01 | deels gebouwd | `data/materials.js`: 3 echte, bron-gekoppelde bestratingsproducten (60×60) selecteerbaar in de configurator; schutting/overige categorieën nog generieke presets, geen inkoopprijzen |
| F02 | gebouwd, getest | Materiaal-/kleurkeuze wijzigt 3D-weergave |
| F03 | gebouwd, getest | Max. 3 varianten: onderhoud, opbouw, leverstatus, prijsbasis, bronnen |
| F04 | gebouwd | `kennisbank/hout-beton-vs-composiet/`, statisch, niet interactief |
| F05 | gebouwd, getest | Materiaalpreset gefilterd op compatibel systeem |
| F06 | gebouwd, getest | Legpatroon/formaat beïnvloedt raster |
| F07 | gebouwd, getest | 5% snijreserve, geverifieerd rekenvoorbeeld |
| F08 | extern geblokkeerd | Vereist leveranciersdata |
| F09 | extern geblokkeerd | Type B: vereist werkelijk beschikbare samples met kosten/voorwaarden van leverancier |
| F10 | gebouwd, getest | Tekstdossier-download |

## G — Budget, prijzen en alternatieven

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| G01 | gebouwd, getest | `/prijzen/` toont € 60/€ 72,60 + voorbeelden |
| G02 | gebouwd | Commerciële routes onderscheiden dit |
| G03 | gebouwd, getest | Alleen bekende regels opgeteld, nooit als "compleet" getoond |
| G04 | gebouwd, getest | Format-mismatch toont nu eerlijk "nog geen prijs" i.p.v. verkeerd product (v6.0 H04-fix) |
| G05 | gebouwd, getest | `observedAt`/`reviewAfter`/`status:"stale"` in `data/price-sources.json` |
| G06 | gebouwd, getest | Varianten op dezelfde geometrie; "wijzigt t.o.v. A" per variant |
| G07 | gebouwd, getest | Verschil alleen bij twee bekende prijsregels; onbekende impact benoemd |
| G08 | gebouwd, getest | Suggestie van formaat met onderzochte producten; wisselen alleen na klik |
| G09 | gebouwd | Kostdrivers-uitleg op `/prijzen/` |
| G10 | extern geblokkeerd | Dossier/contact-handoff bestaat; echte serverontvangst ontbreekt |

## H — Groen en onderhoud

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| H01–H04, H09 | wacht op eigenaar | Vereist een gecontroleerde plantcatalogus (soort/cultivar, maatband, plantafstand, onderhoud) met bronstatus; niet zelf verzonnen |
| H05 | gebouwd, getest | Gazonroute (maaien/herstel/inzaaien/zoden/kunstgras), staat en oppervlak in configurator-intake |
| H06 | gebouwd, getest | Onkruid: locatie, soort, achterstand; expliciet geen blijvend-onkruidvrij-belofte |
| H07 | gebouwd, getest | Snoei: haag/struik/boom, ingreep, hoogte; groot boomwerk alleen na beoordeling |
| H10 | extern geblokkeerd | Vereist projectportaal/authenticatie |
| H08 | gebouwd, getest | Eenmalig/periodiek + gewenste frequentie in configurator; frequentie en tarief pas na afspraak |

## I — Inspiratie en fotografie

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| I01 | gebouwd, getest | Filterbalk op `/projecten/` |
| I02 | gebouwd, getest | 12 detailroutes met situatie/workDone waar bekend |
| I03 | gebouwd | Gallery op detailpagina's met >1 foto |
| I04 | extern geblokkeerd | Geen echte voor/na-fotoparen van dezelfde plek beschikbaar; nodig van eigenaar |
| I05 | gebouwd, getest | Lightbox + directe link naar detailpagina |
| I06 | gebouwd, getest | Cases en materiaalkeuzes bewaren zonder account (localStorage) |
| I07 | gebouwd, getest | `/inspiratie/` moodboard met bron/visuele-indicatie-label; meenemen in aanvraag |
| I08 | gebouwd | CTA "gebruik als inspiratie" geeft alleen dienst mee, geen maten/adres |
| I09 | gebouwd | `data/projects.js` als manifest; focal point niet expliciet per foto |
| I10 | extern geblokkeerd | Type B: toestemmingsregistratie per foto vereist backend; nu alleen eigen bedrijfsfoto's |

## J — Voorbereiding, levering en planning

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| J01 | gebouwd, getest | Achterom, smalste doorgang, trappen, loopafstand, obstakels in dossier |
| J02 | gebouwd, getest | Afvoer door SEAL / klantcontainer / blijft liggen, in dossier |
| J03 | gebouwd, getest | Volume-indicatie per afvalstroom als bandbreedte (`js/configurator/waste.js`); geen gewicht/tarief |
| J04 | gebouwd, getest | Aandachtspunten uit toegang (smalle doorgang, geen achterom, trappen, loopafstand); geen haalbaarheidsclaim |
| J05 | extern geblokkeerd | Vereist bevestigde leverroutes en leverkosten |
| J06 | gebouwd, getest | Parkeren/lossen + bekende beperkingen in dossier |
| J07–J10 | extern geblokkeerd | Vereist planning-/agenda- en projectbackend |

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
| M04–M05 | wacht op eigenaar | Vereist geleverde SKU's, fabrikantsgarantie en eventuele vastgestelde SEAL-garantie |

## N — Rechten, privacy en vertrouwen

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| N01 | wacht op goedkeuring | `js/config.js` heeft gegevens; juridische verificatie (KvK/btw/naam) nog nodig |
| N02 | wacht op goedkeuring | `/voorwaarden/` heeft nu de volledige 24-artikel v6.0-structuur; vereist juridische toets vóór bindende publicatie |
| N03 | wacht op goedkeuring | Type X: zakelijke voorwaarden vereisen juridische toets |
| N04 | wacht op goedkeuring | `/privacy/` heeft nu de volledige verwerkingstabel (8 categorieën, doel + bewaartermijn/grondslag); vereist juridische toets |
| N05 | gebouwd | Geen tracking/niet-noodzakelijke cookies op de site (gecontroleerd); privacy legt uit dat toestemming eerst komt als dat ooit verandert |
| N06 | extern geblokkeerd | Type B: gescheiden toestemmingen opslaan vereist backend |
| N07 | extern geblokkeerd | Type B: automatische bewaar-/verwijderregels vereisen backend |
| N08 | gebouwd, getest | Disclaimers bij elke prijsindicatie/visualisatie |
| N09 | gebouwd | Genoemd in `kennisbank/schutting-opmeten/`, geen directe Omgevingsloket-link |
| N10 | gebouwd, deels getest | Mobiel/toetsenbord ad-hoc getest; geen formele WCAG 2.2 AA-audit |

## O — Zakelijk en samenwerken

| ID | Status | Bewijs / opmerking |
| --- | --- | --- |
| O01 | gebouwd, getest | `/voor-aannemers/` intakeformulier |
| O02 | gebouwd | Door O01 gedekt, geen aparte VvE-flow |
| O03 | gebouwd | Tekstueel toegelicht op `/voor-aannemers/` |
| O04 | extern geblokkeerd | Type B: meerdere locaties met eigen planning/toegang vereist backend |
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

Stand na de sessie van 10 oktober 2026 (configurator-uitbreiding).

- **Gebouwd en getest (frontend):** vrijwel alle F-eisen in A–J: doel/klanttype/zoeken/omvang/gebruik/onderhoudswens/werkgebied (A), intake en compleetheid (B), behouden/herstel/verwijderen/nieuw met objecten, kabels en erfgrens (C), contour, poorten, groenvakken, obstakels (D), selectie, raster/snap, undo/redo, vergrendelen, dupliceren, mobiel canvas, zonillustratie (E), varianten A/B/C met prijsverschil en alternatief (F/G), inspiratiebord (I), afval, toegang en parkeren (J), onderhoudsintake (H05–H08).
- **Deels gebouwd:** F01 (echte producten alleen voor 60×60-bestrating), C05 (bestaande poort zonder draairichting), N10 (geen formele WCAG 2.2 AA-audit).
- **Wacht op eigenaar (gegevens/beslissing):** A05 stijllabels per case, H01–H04/H09 gecontroleerde plantdata, I04 echte voor/na-fotoparen, N01–N04 juridische toets, inkoop-/leveranciersdata (F08, margin-engine).
- **Extern geblokkeerd (backend/auth/agenda/betaling):** B05, C10, D10, F09, H10, I10, J05, J07–J10, vrijwel alle K/L/M/P, N06/N07, O04/O05/O10, G10.
