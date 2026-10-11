# V12_VERSCHILKAART (pilotfase)

Basis: branch `claude/sealcleaning-website-overhaul-gvgtfj`, PR #3, niets gemerged. Statussen: *gepland, gebouwd, automatisch getest, visueel getest, echte gebruiker getest, extern geblokkeerd, wacht op eigenaar*. "Visueel getest" betekent: door mij op een screenshot bekeken, niet door een gebruiker.

## Hergebruikt (niet opnieuw gebouwd)
`geometry.js`, `three-scene.js` (uitgebreid met een optionele `scenic`-stand, de standaardeditor is ongewijzigd), `svg-scene.js`, `project-state.js`, `design-io.js` (deellink), `data/catalog.js`, contactformulier en leadbackend (`main.js`, `server/`), winkelcode (uit), 66 unit-tests.

## De tien v12-onderdelen
| ID | Status | Bewijs / wat ontbreekt |
|---|---|---|
| V12-01 herstellen of vervangen | automatisch getest | Route `?doel=herstel` en keuze in stap 1; e2e-scenario. Nog niet op de dienstpagina's (schuttingen, renovatie, onderhoud). |
| V12-02 project → materiaal | gepland | Cataloogbeeld kent een projectslug, label "Gebruikt materiaal" is nog niet gebouwd. |
| V12-03 drie productbeelden | gebouwd, extern geblokkeerd | Drie fotoplekken met eerlijk label. Rechten op leveranciersfoto's onbekend: geen foto geplaatst. |
| V12-04 hoogte op schaal | gebouwd, visueel getest | Schaalfiguur 1,75 m in tekening en 3D, hoogte ook als tekst. Nog niet met een gebruiker getest. |
| V12-05 geschiktheidscheck | automatisch getest | Productpagina; geen opslag, nooit "geschikt". |
| V12-06 echte foto naast 3D | gebouwd (gedeeltelijk) | Foto en 3D naast elkaar met labels. De 3D is een materiaalcategorie, geen exact artikel; dat staat erbij. |
| V12-07 Mijn tuinplan | gebouwd (gedeeltelijk) | Samenvatting en lokale opslag in de route. Nog geen sitebrede samenvatting met het inspiratiebord. |
| V12-08 kostenkaart | automatisch getest | Zonder bedragen; alleen "Wordt berekend na controle". |
| V12-09 FAQ's op klantvragen | gebouwd (gedeeltelijk) | Vakinhoudelijke vragen op home en product. Er zijn geen echte klantvragen of Search Console-data aangeleverd; herkomstlabel in het beheer ontbreekt. |
| V12-10 privacyvriendelijke events | automatisch getest | `js/v12/events.js`, geen tracker, test in `tests/events.test.mjs`. Meetplan: `docs/MEETPLAN.md`. |

## Pilotpagina's
| Pilot | Status |
|---|---|
| Homepage met 3D direct onder de hero | gebouwd, automatisch getest (1440/390/320), visueel getest |
| Productpagina schutting | gebouwd, automatisch getest, visueel getest; foto's van het exacte artikel ontbreken |
| Beginnersroute schutting met meten en uitleg | gebouwd, automatisch getest (11 scenario's), visueel getest; **echte gebruiker: niet getest** |

## Acceptatiescenario's uit `acceptatie_v12.json` (alle uitgevoerde markeren we hier; de rest blijft NOT_RUN)
Automatisch getest: UX001, UX002, UX003, UX004, UX008, UX011, UX012 (320 px; 200 % zoom niet), UX022. Gebouwd en deels getest: UX009, UX010, UX013, UX014. Gepland: UX005, UX006, UX007 (alleen hout met beton visueel bekeken). Extern geblokkeerd of wacht op eigenaar: UX015, UX016, UX020, UX021, UX023 (eigen foto's aanwezig, echte voor/na-paren niet). UX017 en UX018: zie crawl. UX019 en UX024: bestaande servertests.

## Extern geblokkeerd of wacht op eigenaar
Beeldrechten en exacte productfoto's · avondfoto voor de hero · echte teamfoto's en reviews · definitieve kop (voorstel: "Jouw droomtuin, ons vakwerk") · ontwerpakkoord op deze drie pilots · juridische toetsing, hosting, e-mail, Mollie · gebruikerstest met minstens drie beginners · uitrol naar de overige pagina's.
