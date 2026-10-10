# REQUIREMENTS_INDEX — 160-item register (A–P), per docs/SEAL_MASTER_BRIEF.md (v7.0 met v6.0 integraal)

Status values per v6.0 V6-08: `gebouwd`, `getest`, `nog te bouwen`,
`extern geblokkeerd`, `wacht op goedkeuring`, `definitief besloten`,
`historisch/verouderd`. `getest` means verified in this session via a real
browser (Playwright/Chromium) or a Node unit check, not just code review.
This is an honest self-assessment, not an external audit. Where a row says
"gebouwd" without "getest", it was implemented but not separately verified
in a browser this session.

## A — Oriëntatie en snel de juiste route

| ID | Code | Test | Live | Status (V6-08) | Bewijs / opmerking |
| --- | --- | --- | --- | --- | --- |
| A01 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Doelkeuze in configurator stap 1 zet passende dienst aan; `?doel=`/`?service=` werken (fix: 12 bestaande `?service=`-links werden genegeerd) |
| A02 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Particulier/zakelijk in configurator; zakelijk verwijst naar `/voor-aannemers/` zonder ontwerpverlies; in dossier |
| A03 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | `/zoeken/` over alle echte pagina's + materialen (`tools/build-search-index.mjs`), synoniemen, lege toestand |
| A04 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Omvang in stap 1; "kleine klus" klapt uitgebreide situatievragen in; geen minimumprijs |
| A05 | nee | — | nee | wacht op eigenaar | Vereist stijltoewijzing (modern/natuurlijk/…) per echte case door de eigenaar; niet zelf verzonnen |
| A06 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Gebruik van de tuin (meerkeuze) in dossier |
| A07 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Onderhoudswens in dossier; expliciet geen levensduurbelofte |
| A08 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Contactformulier met foto-upload + eerlijke mailto-fallback |
| A09 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Plaatsnaamcheck tegen gepubliceerd werkgebied (`data/service-area.js`); postcodegrenzen niet bevestigd → niet gebruikt |
| A10 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Bel/WhatsApp-links overal werkend; apart terugbelverzoek niet gebouwd |

## B — Intake die meedenkt

| ID | Code | Test | Live | Status (V6-08) | Bewijs / opmerking |
| --- | --- | --- | --- | --- | --- |
| B01 | ja | geen aparte test | nee — PR #3 niet gemerged | gebouwd | Configurator-/contact-/B2B-/werken-met-ons-formulieren hebben eigen relevante velden |
| B02 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | `garden.areaKnown`/`geometryKnown` in `js/project-state.js`, unit-getest |
| B03 | ja | geen aparte test | nee — PR #3 niet gemerged | gebouwd | `kennisbank/schutting-opmeten/` met eigen diagram |
| B04 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Fototips per dienst met uitleg in configurator-overzicht (upload zelf via contactformulier) |
| B05 | nee | — | nee | extern geblokkeerd | Masterdossier type B: foto-annotatie moet veilig met de aanvraag mee; vereist upload-backend |
| B06 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Ondergrond, hoogteverschil, natte plekken, obstakels — elk met "weet ik niet" |
| B07 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Systeem/SKU/aantallen bij route "alleen montage"; controle als voorwaarde, geen automatisch akkoord |
| B08 | ja | geen aparte test | nee — PR #3 niet gemerged | gebouwd | Budget-pill-choice op `/contact/` |
| B09 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Periode-veld in configurator en contactformulier |
| B10 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Niet-blokkerende lijst "nuttig om aan te vullen" met sprong naar stap; geen score |

## C — Bestaande tuin en scope

| ID | Code | Test | Live | Status (V6-08) | Bewijs / opmerking |
| --- | --- | --- | --- | --- | --- |
| C01 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Objecten met status behouden; niet als materiaal/montage gerekend; aparte groep in dossier |
| C02 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Schutting "herstellen" met schadeomschrijving; geen automatische vervanging |
| C03 | ja | geen aparte test | nee — PR #3 niet gemerged | gebouwd | `project.removal` in schema + checkboxen in configurator |
| C04 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Kernflow van de configurator |
| C05 | deels | deels | nee — PR #3 niet gemerged | deels gebouwd | "Bestaande poort" als object (behouden/verwijderen); draairichting/aansluiting nog niet vastlegbaar |
| C06 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Behouden boom/haag/border krijgt zichtbare beschermingszone + dossiernotitie |
| C07 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Kabels/leidingen als klantinformatie; tekst conform voorwaarden art. 10, vervangt geen onderzoek |
| C08 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Erfgrens/burenafspraak met disclaimer (geen grensbepaling/vergunning) |
| C09 | ja | geen aparte test | nee — PR #3 niet gemerged | gebouwd | "Alleen montage"-route in commerciële routes |
| C10 | nee | — | nee | extern geblokkeerd | Type B: gedeelde scope met gescheiden contactgegevens vereist backend/accounts |

## D — Tuin tekenen in 2D en 3D

| ID | Code | Test | Live | Status (V6-08) | Bewijs / opmerking |
| --- | --- | --- | --- | --- | --- |
| D01 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Rechthoek, L-vorm en vrije contour; zelfde contour en oppervlak in 2D en 3D |
| D02 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Hoekpunten toevoegen/verwijderen/typen/slepen; zelfdoorsnijding/samenvallende punten/<1 m² geblokkeerd met uitleg |
| D03 | ja | geen aparte test | nee — PR #3 niet gemerged | gebouwd | Schemavelden aanwezig, niet UI-blootgesteld |
| D04 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | I/L/U-schuttingvormen, `js/configurator/geometry.js` |
| D05 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Zijde, positie, doorgang, scharnier, draairichting; draaicirkel in 2D, blad in 3D; botsing met objecten/andere poort gemeld |
| D06 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Meerdere vlakken + overlapcontrole |
| D07 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Haag (m), border en gazon (m²) als parametrische objecten |
| D08 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Huiswand, schuur, boom als schematische referentie in 2D/3D |
| D09 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | 2D/3D-toggle, state behouden |
| D10 | nee | — | nee | extern geblokkeerd | Type B: gecontroleerde rasterreferentie-import vereist veilige upload/opslag |

## E — Nauwkeurig bedienen en begrijpen

| ID | Code | Test | Live | Status (V6-08) | Bewijs / opmerking |
| --- | --- | --- | --- | --- | --- |
| E01 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Klik/tik selecteert in 2D; positievelden als toetsenbordequivalent |
| E02 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Optioneel raster 10/25/50/100 cm met zichtbare status; alleen slepen snapt, invoer blijft mm-exact |
| E03 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Maatlabels in 2D en 3D |
| E04 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Undo/redo (knoppen + Ctrl+Z/Ctrl+Shift+Z/Ctrl+Y) op state-momentopnamen |
| E05 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Behouden objecten standaard vast; expliciet ontgrendelen |
| E06 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Dupliceren objecten/vlakken met nieuw id; overlapwaarschuwing tegen dubbel rekenen |
| E07 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | 3D/boven/voor + camera-reset |
| E08 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Vergroot-werkvlakmodus met terugknop; tekening sticky op mobiel; eerste tik selecteert alleen; 44px-handgrepen; 360/390/740px getest |
| E09 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Zonrichting/-hoogte met schaduw in 3D, gelabeld als illustratie |
| E10 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | 30-dagen opt-in localStorage + "opnieuw beginnen" |

## F — Materialen kiezen en rekenen

| ID | Code | Test | Live | Status (V6-08) | Bewijs / opmerking |
| --- | --- | --- | --- | --- | --- |
| F01 | deels | deels | nee — PR #3 niet gemerged | deels gebouwd | `data/materials.js`: 3 echte, bron-gekoppelde bestratingsproducten (60×60) selecteerbaar in de configurator; schutting/overige categorieën nog generieke presets, geen inkoopprijzen |
| F02 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Materiaal-/kleurkeuze wijzigt 3D-weergave |
| F03 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Max. 3 varianten: onderhoud, opbouw, leverstatus, prijsbasis, bronnen |
| F04 | ja | geen aparte test | nee — PR #3 niet gemerged | gebouwd | `kennisbank/hout-beton-vs-composiet/`, statisch, niet interactief |
| F05 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Materiaalpreset gefilterd op compatibel systeem |
| F06 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Legpatroon/formaat beïnvloedt raster |
| F07 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | 5% snijreserve, geverifieerd rekenvoorbeeld |
| F08 | nee | — | nee | extern geblokkeerd | Vereist leveranciersdata |
| F09 | nee | — | nee | extern geblokkeerd | Type B: vereist werkelijk beschikbare samples met kosten/voorwaarden van leverancier |
| F10 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Tekstdossier-download |

## G — Budget, prijzen en alternatieven

| ID | Code | Test | Live | Status (V6-08) | Bewijs / opmerking |
| --- | --- | --- | --- | --- | --- |
| G01 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | `/prijzen/` toont € 60/€ 72,60 + voorbeelden |
| G02 | ja | geen aparte test | nee — PR #3 niet gemerged | gebouwd | Commerciële routes onderscheiden dit |
| G03 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Alleen bekende regels opgeteld, nooit als "compleet" getoond |
| G04 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Format-mismatch toont nu eerlijk "nog geen prijs" i.p.v. verkeerd product (v6.0 H04-fix) |
| G05 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | `observedAt`/`reviewAfter`/`status:"stale"` in `data/price-sources.json` |
| G06 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Varianten op dezelfde geometrie; "wijzigt t.o.v. A" per variant |
| G07 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Verschil alleen bij twee bekende prijsregels; onbekende impact benoemd |
| G08 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Suggestie van formaat met onderzochte producten; wisselen alleen na klik |
| G09 | ja | geen aparte test | nee — PR #3 niet gemerged | gebouwd | Kostdrivers-uitleg op `/prijzen/` |
| G10 | nee | — | nee | extern geblokkeerd | Dossier/contact-handoff bestaat; echte serverontvangst ontbreekt |

## H — Groen en onderhoud

| ID | Code | Test | Live | Status (V6-08) | Bewijs / opmerking |
| --- | --- | --- | --- | --- | --- |
| H01 | nee | — | nee | wacht op eigenaar | Vereist een gecontroleerde plantcatalogus (soort/cultivar, maatband, plantafstand, onderhoud) met bronstatus; niet zelf verzonnen |
| H02 | nee | — | nee | wacht op eigenaar | Vereist een gecontroleerde plantcatalogus (soort/cultivar, maatband, plantafstand, onderhoud) met bronstatus; niet zelf verzonnen |
| H03 | nee | — | nee | wacht op eigenaar | Vereist een gecontroleerde plantcatalogus (soort/cultivar, maatband, plantafstand, onderhoud) met bronstatus; niet zelf verzonnen |
| H04 | nee | — | nee | wacht op eigenaar | Vereist een gecontroleerde plantcatalogus (soort/cultivar, maatband, plantafstand, onderhoud) met bronstatus; niet zelf verzonnen |
| H05 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Gazonroute (maaien/herstel/inzaaien/zoden/kunstgras), staat en oppervlak in configurator-intake |
| H06 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Onkruid: locatie, soort, achterstand; expliciet geen blijvend-onkruidvrij-belofte |
| H07 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Snoei: haag/struik/boom, ingreep, hoogte; groot boomwerk alleen na beoordeling |
| H08 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Eenmalig/periodiek + gewenste frequentie in configurator; frequentie en tarief pas na afspraak |
| H09 | nee | — | nee | wacht op eigenaar | Vereist een gecontroleerde plantcatalogus (soort/cultivar, maatband, plantafstand, onderhoud) met bronstatus; niet zelf verzonnen |
| H10 | deels | ja (server-integratietest) | nee — server niet gehost | deels gebouwd (server) | Klantportaal: serviceverzoek als gelabeld bericht binnen het eigen project (server-autorisatie); taakselectie uit eerdere scope nog niet |

## I — Inspiratie en fotografie

| ID | Code | Test | Live | Status (V6-08) | Bewijs / opmerking |
| --- | --- | --- | --- | --- | --- |
| I01 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Filterbalk op `/projecten/` |
| I02 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | 12 detailroutes met situatie/workDone waar bekend |
| I03 | ja | geen aparte test | nee — PR #3 niet gemerged | gebouwd | Gallery op detailpagina's met >1 foto |
| I04 | nee | — | nee | extern geblokkeerd | Geen echte voor/na-fotoparen van dezelfde plek beschikbaar; nodig van eigenaar |
| I05 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Lightbox + directe link naar detailpagina |
| I06 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Cases en materiaalkeuzes bewaren zonder account (localStorage) |
| I07 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | `/inspiratie/` moodboard met bron/visuele-indicatie-label; meenemen in aanvraag |
| I08 | ja | geen aparte test | nee — PR #3 niet gemerged | gebouwd | CTA "gebruik als inspiratie" geeft alleen dienst mee, geen maten/adres |
| I09 | ja | geen aparte test | nee — PR #3 niet gemerged | gebouwd | `data/projects.js` als manifest; focal point niet expliciet per foto |
| I10 | nee | — | nee | extern geblokkeerd | Type B: toestemmingsregistratie per foto vereist backend; nu alleen eigen bedrijfsfoto's |

## J — Voorbereiding, levering en planning

| ID | Code | Test | Live | Status (V6-08) | Bewijs / opmerking |
| --- | --- | --- | --- | --- | --- |
| J01 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Achterom, smalste doorgang, trappen, loopafstand, obstakels in dossier |
| J02 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Afvoer door SEAL / klantcontainer / blijft liggen, in dossier |
| J03 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Volume-indicatie per afvalstroom als bandbreedte (`js/configurator/waste.js`); geen gewicht/tarief |
| J04 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Aandachtspunten uit toegang (smalle doorgang, geen achterom, trappen, loopafstand); geen haalbaarheidsclaim |
| J05 | nee | — | nee | extern geblokkeerd | Vereist bevestigde leverroutes en leverkosten |
| J06 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Parkeren/lossen + bekende beperkingen in dossier |
| J07 | nee | — | nee | nog te bouwen | Dienstspecifieke klantchecklist met gereedmelding |
| J08 | ja | ja (browser/unit) | nee — server niet gehost | gebouwd, getest (server; operationeel na hosting) | Portaal: voorkeursmoment voorstellen (status "voorstel", geen toezegging), bevestigde afspraken met ICS, verzoek tot verplaatsen met project-ID als bericht; medewerker bevestigt/annuleert met notitie |
| J09 | ja | ja (browser/unit) | nee — server niet gehost | gebouwd, getest (server; operationeel na hosting) | Portaal: voorkeursmoment voorstellen (status "voorstel", geen toezegging), bevestigde afspraken met ICS, verzoek tot verplaatsen met project-ID als bericht; medewerker bevestigt/annuleert met notitie |
| J10 | ja | ja (browser/unit) | nee — server niet gehost | gebouwd, getest (server; operationeel na hosting) | Portaal: voorkeursmoment voorstellen (status "voorstel", geen toezegging), bevestigde afspraken met ICS, verzoek tot verplaatsen met project-ID als bericht; medewerker bevestigt/annuleert met notitie |

## K — Offerte en opdracht

| ID | Code | Test | Live | Status (V6-08) | Bewijs / opmerking |
| --- | --- | --- | --- | --- | --- |
| K01 | ja | ja (browser/unit); lokaal beheer | nee — PR #3 niet gemerged | gebouwd, getest (lokaal) | Beheer: project met ontwerp (via deellink), hoeveelheden, offertes, uren en notities onder één project-ID; foto's blijven via contactformulier/e-mail |
| K02 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Prijssoort vast/richtprijs/regie/stelpost met uitleg op de offerte |
| K03 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Offerte toont inbegrepen, niet inbegrepen, klantwerk, uitgangspunten en wat nog op aanvraag is |
| K04 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Versies: verstuurd/geaccepteerd wordt vastgelegd en niet overschreven; wijziging = nieuwe versie |
| K05 | ja | geen aparte test | nee — PR #3 niet gemerged | gebouwd | Offerte verwijst naar de voorwaarden op de site; versie-/PDF-archief van voorwaarden vereist backend (en juridische toets N02) |
| K06 | ja | ja (browser/unit) | nee — server niet gehost | gebouwd, getest (server; operationeel na hosting) | Digitaal akkoord: naam, e-mail, klant-ID, moment, IP-hash, user-agent, SHA-256 van exact getoonde offerte, voorwaardenversie, toestemmingen; offline akkoord apart vastgelegd met verklaring medewerker |
| K07 | ja | ja (browser/unit) | nee — server niet gehost | gebouwd, getest (server; operationeel na hosting) | Vraag per offerte (en onderdeel) als projectbericht; wijzigt de scope niet |
| K08 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Meerwerk als nieuwe offerteversie met handmatige regels en reden; akkoord vóór uitvoeren |
| K09 | ja | ja (browser/unit) | nee — server niet gehost | gebouwd, getest (server; operationeel na hosting) | Aparte, niet vooraf aangevinkte keuze "vroeg starten" + bevestiging bedenktijdinformatie, vastgelegd en per e-mail bevestigd; tekst wacht op juridische toets |
| K10 | deels | deels | nee — PR #3 niet gemerged | deels gebouwd | Herroepen/opzeggen via portaalbericht of e-mail/telefoon zonder motivatieplicht; formeel herroepingsformulier wacht op juridische toets |

## L — Klantdossier en uitvoering

| ID | Code | Test | Live | Status (V6-08) | Bewijs / opmerking |
| --- | --- | --- | --- | --- | --- |
| L01 | ja | ja (browser/unit) | nee — server niet gehost | gebouwd, getest (server; operationeel na hosting) | Klantportaal `/portaal/`: eenmalige inloglinks (geen voorspelbaar ID), server-side autorisatie per object, tijdlijn uit workflow, documenten (offertes/facturen/bestanden), planning, berichten, wijzigingsverzoek, uitvoeringsfoto's alleen als medewerker ze zichtbaar maakt |
| L02 | ja | ja (browser/unit) | nee — server niet gehost | gebouwd, getest (server; operationeel na hosting) | Klantportaal `/portaal/`: eenmalige inloglinks (geen voorspelbaar ID), server-side autorisatie per object, tijdlijn uit workflow, documenten (offertes/facturen/bestanden), planning, berichten, wijzigingsverzoek, uitvoeringsfoto's alleen als medewerker ze zichtbaar maakt |
| L03 | ja | ja (browser/unit) | nee — server niet gehost | gebouwd, getest (server; operationeel na hosting) | Klantportaal `/portaal/`: eenmalige inloglinks (geen voorspelbaar ID), server-side autorisatie per object, tijdlijn uit workflow, documenten (offertes/facturen/bestanden), planning, berichten, wijzigingsverzoek, uitvoeringsfoto's alleen als medewerker ze zichtbaar maakt |
| L04 | ja | ja (browser/unit) | nee — server niet gehost | gebouwd, getest (server; operationeel na hosting) | Klantportaal `/portaal/`: eenmalige inloglinks (geen voorspelbaar ID), server-side autorisatie per object, tijdlijn uit workflow, documenten (offertes/facturen/bestanden), planning, berichten, wijzigingsverzoek, uitvoeringsfoto's alleen als medewerker ze zichtbaar maakt |
| L05 | ja | ja (browser/unit) | nee — server niet gehost | gebouwd, getest (server; operationeel na hosting) | Klantportaal `/portaal/`: eenmalige inloglinks (geen voorspelbaar ID), server-side autorisatie per object, tijdlijn uit workflow, documenten (offertes/facturen/bestanden), planning, berichten, wijzigingsverzoek, uitvoeringsfoto's alleen als medewerker ze zichtbaar maakt |
| L06 | ja | ja (browser/unit) | nee — server niet gehost | gebouwd, getest (server; operationeel na hosting) | Klantportaal `/portaal/`: eenmalige inloglinks (geen voorspelbaar ID), server-side autorisatie per object, tijdlijn uit workflow, documenten (offertes/facturen/bestanden), planning, berichten, wijzigingsverzoek, uitvoeringsfoto's alleen als medewerker ze zichtbaar maakt |
| L07 | ja | ja (browser/unit) | nee — server niet gehost | gebouwd, getest (server; operationeel na hosting) | Klantportaal `/portaal/`: eenmalige inloglinks (geen voorspelbaar ID), server-side autorisatie per object, tijdlijn uit workflow, documenten (offertes/facturen/bestanden), planning, berichten, wijzigingsverzoek, uitvoeringsfoto's alleen als medewerker ze zichtbaar maakt |
| L08 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Werkbon uit beheer: taken, uren, materialen, situatie en te beschermen beplanting, zonder prijzen/kostprijs |
| L09 | deels | deels | nee — PR #3 niet gemerged | deels gebouwd | Gereedmelding via opleverdocument (papier/PDF) en projectstatus "Opgeleverd"; digitale melding door klant vereist portaal |
| L10 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Gelijkwaardige telefoon/e-mail-route bestaat voor iedereen (geen portaal-verplichting) |

## M — Oplevering en nazorg

| ID | Code | Test | Live | Status (V6-08) | Bewijs / opmerking |
| --- | --- | --- | --- | --- | --- |
| M01 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Opleverdocument met checklist uit de hoeveelhedenstaat |
| M02 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Restpunten met datum, expliciet zonder afstand van wettelijke rechten |
| M03 | deels | deels | nee — PR #3 niet gemerged | deels gebouwd | Opleverdocument met algemeen onderhoudsadvies; productspecifiek advies wacht op geleverde SKU's (M04) |
| M04 | nee | — | nee | wacht op eigenaar | Vereist geleverde SKU's, fabrikantsgarantie en eventuele vastgestelde SEAL-garantie |
| M05 | nee | — | nee | wacht op eigenaar | Vereist geleverde SKU's, fabrikantsgarantie en eventuele vastgestelde SEAL-garantie |
| M06 | ja | geen aparte test | nee — server niet gehost | gebouwd (server; operationeel na hosting) | Serviceverzoek en klacht als gelabeld portaalbericht met foto-upload en referentie (project-ID) |
| M07 | ja | geen aparte test | nee — server niet gehost | gebouwd (server; operationeel na hosting) | Serviceverzoek en klacht als gelabeld portaalbericht met foto-upload en referentie (project-ID) |
| M08 | deels | deels | nee — PR #3 niet gemerged | deels gebouwd | Toestemming onderhoudsherinnering vastgelegd in portaal; versturen/reviews/hergebruik nog niet geautomatiseerd |
| M09 | deels | deels | nee — PR #3 niet gemerged | deels gebouwd | Toestemming onderhoudsherinnering vastgelegd in portaal; versturen/reviews/hergebruik nog niet geautomatiseerd |
| M10 | deels | deels | nee — PR #3 niet gemerged | deels gebouwd | Toestemming onderhoudsherinnering vastgelegd in portaal; versturen/reviews/hergebruik nog niet geautomatiseerd |

## N — Rechten, privacy en vertrouwen

| ID | Code | Test | Live | Status (V6-08) | Bewijs / opmerking |
| --- | --- | --- | --- | --- | --- |
| N01 | nee | — | nee | wacht op goedkeuring | `js/config.js` heeft gegevens; juridische verificatie (KvK/btw/naam) nog nodig |
| N02 | nee | — | nee | wacht op goedkeuring | `/voorwaarden/` heeft nu de volledige 24-artikel v6.0-structuur; vereist juridische toets vóór bindende publicatie |
| N03 | nee | — | nee | wacht op goedkeuring | Type X: zakelijke voorwaarden vereisen juridische toets |
| N04 | nee | — | nee | wacht op goedkeuring | `/privacy/` heeft nu de volledige verwerkingstabel (8 categorieën, doel + bewaartermijn/grondslag); vereist juridische toets |
| N05 | ja | geen aparte test | nee — PR #3 niet gemerged | gebouwd | Geen tracking/niet-noodzakelijke cookies op de site (gecontroleerd); privacy legt uit dat toestemming eerst komt als dat ooit verandert |
| N06 | ja | ja (browser/unit) | nee — server niet gehost | gebouwd, getest (server; operationeel na hosting) | Gescheiden toestemmingen (vroeg starten, projectfoto-publicatie, nieuwsbrief, onderhoudsherinnering), nooit vooraf aangevinkt, intrekbaar, met tijdstip en tekstversie |
| N07 | ja | ja (browser/unit) | nee — server niet gehost | gebouwd, getest (server; operationeel na hosting) | Automatische verwijdering van aanvragen/sollicitaties na in te stellen termijn; facturen beschermd (7 jaar); AVG-verwijderen klant; termijnen wachten op eigenaar |
| N08 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Disclaimers bij elke prijsindicatie/visualisatie |
| N09 | ja | geen aparte test | nee — PR #3 niet gemerged | gebouwd | Genoemd in `kennisbank/schutting-opmeten/`, geen directe Omgevingsloket-link |
| N10 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Geautomatiseerde axe-core WCAG 2.2 AA-scan over alle 38 pagina's (0 bevindingen na fixes), mobiel 360/390px, toetsenbordbediening; een handmatige audit met hulptechnologie blijft aanbevolen |

## O — Zakelijk en samenwerken

| ID | Code | Test | Live | Status (V6-08) | Bewijs / opmerking |
| --- | --- | --- | --- | --- | --- |
| O01 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | `/voor-aannemers/` intakeformulier |
| O02 | ja | geen aparte test | nee — PR #3 niet gemerged | gebouwd | Door O01 gedekt, geen aparte VvE-flow |
| O03 | ja | geen aparte test | nee — PR #3 niet gemerged | gebouwd | Tekstueel toegelicht op `/voor-aannemers/` |
| O04 | nee | — | nee | extern geblokkeerd | Type B: meerdere locaties met eigen planning/toegang vereist backend |
| O05 | deels | deels | nee — PR #3 niet gemerged | deels gebouwd | Beheer: zakelijke klant, referentie/PO op offerte en factuur, excl./incl. btw; btw-verlegging bewust niet automatisch (per geval toetsen — wacht op eigenaar/adviseur) |
| O06 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Bestandsupload op `/voor-aannemers/` |
| O07 | ja | geen aparte test | nee — PR #3 niet gemerged | gebouwd | `/werken-met-ons/` intake |
| O08 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | CV/certificaat-upload met eerlijke bijlage-waarschuwing |
| O09 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | — |
| O10 | nee | — | nee | extern geblokkeerd | Vereist auth |

## P — Administratie en bedrijfsvoering

| ID | Code | Test | Live | Status (V6-08) | Bewijs / opmerking |
| --- | --- | --- | --- | --- | --- |
| P01 | ja | ja (browser/unit); lokaal beheer | nee — PR #3 niet gemerged | gebouwd, getest (lokaal) | Interne calculatie in versleutelde beheerkluis; verkoop, kostprijs, inzet en marge apart; geen verzonnen waarden (zie docs/PRICING_OPERATIONS.md) |
| P02 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Urenregistratie per project/medewerker met signaal bij overschrijding; CSV-export |
| P03 | deels | deels | nee — PR #3 niet gemerged | deels gebouwd | Inkoop per artikel met leverancier, SKU, prijsdatum (>30 dagen gemarkeerd); formele goedkeuringsstap volgt de eigenaar |
| P04 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Offerte uit één dossier: momentopname, nummer, prijssoort, scope, bedragen, logo; geldigheid uit instellingen |
| P05 | ja | ja (browser/unit) | nee — server niet gehost | gebouwd, getest (server; operationeel na hosting) | Geaccepteerde versie onwijzigbaar vastgelegd en als bevestiging per e-mail (wachtrij) + in portaal beschikbaar |
| P06 | ja | ja (browser/unit) | nee — server niet gehost | gebouwd, getest (server; operationeel na hosting) | Server-side unieke, doorlopende nummerreeks zonder gaten, toegekend bij uitgifte; btw en prestatiedatum; termijnfacturen en creditnota's |
| P07 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Betalingen vastleggen, openstaand bedrag, status betaald alleen na geregistreerde ontvangst door de eigenaar |
| P08 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Creditnota met verwijzing naar originele factuur, reden en bedrag; verstuurde factuur blijft ongewijzigd |
| P09 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | CSV-export facturen/creditnota's en uren (formule-injectie geneutraliseerd); koppeling met een specifiek pakket vereist keuze eigenaar |
| P10 | ja | ja (browser/unit) | nee — PR #3 niet gemerged | gebouwd, getest | Auditlog van belangrijke acties; versleutelde back-up met hersteltest; geen synchronisatie tussen apparaten |

## Samenvatting

Stand 10 oktober 2026.

- **Gebouwd en getest:** vrijwel alle frontend-eisen A–J; de interne calculatie en administratie (K01–K04, K08, L08, M01–M02, P01–P02, P04, P07–P10) als versleutelde, lokale beheeromgeving op `/beheer/`; toegankelijkheidsscan (N10).
- **Deels gebouwd:** F01 (echte producten alleen 60×60-bestrating), C05, L09, M03, O05, P03, P05, P06.
- **Wacht op eigenaar (gegevens/beslissing):** A05 stijllabels, H01–H04/H09 plantdata, I04 voor/na-foto's, M04–M05 product/garantie, inkoopprijzen, marges, normen en documentinstellingen (in de kluis), N01–N04 juridische toets, K09–K10.
- **Gebouwd in de server-backend (`server/`, zie docs/BACKEND.md), getest met integratie- en browsertests; operationeel zodra hosting is gekozen:** echte formulierverwerking, klantportaal (L01–L07), digitaal akkoord (K06–K07, K09), J08–J10, M06–M07, N06–N07, P05–P06, plus serverversies van K01–K04, K08 en P01–P10.
- **Voorbereid maar niet operationeel zonder account:** e-mail (SMTP), online betalen (Mollie), externe back-upopslag. De agenda (ICS-feed) werkt zonder account.
- **Nog extern geblokkeerd of nog te bouwen:** O10, B05, C10, D10, F09, H10, I10, J05, J07, K10 (formeel formulier), M08–M10, O04, G10, webshop/checkout.
