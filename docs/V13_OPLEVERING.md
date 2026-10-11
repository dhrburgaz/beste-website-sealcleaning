# V13 oplevering: pilotpagina's (wacht op ontwerpgoedkeuring)

Herstelpunt vóór V13: commit `596d242` (branch `claude/sealcleaning-website-overhaul-gvgtfj`). Terugdraaien: `git revert` van de V13-commits of een nieuwe branch vanaf 596d242. Productie (sealcleaning.nl), DNS, hosting en betalingen zijn niet aangeraakt.

## Referentiebesluit
- Algemene stijl en sectievolgorde: `docs/design-ref/00` (paginafamilie) en `03` (collage). Ontwerper: `03` scherm 2 en `02`.
- Bewuste afwijkingen van de referentie (strategie V13 of onbewezen): geen "4,9/5", "500+/100+ klanten", "10+ jaar garantie", prijzen (€ 89,00 e.d.), "Materialen"/winkelmand/productpagina's, teamfoto's en reviews; footer is donker en volledig (bedrijfsgegevens) in plaats van de lichte mini-balk; logo is het echte Sealcleaning-logo.

## Vergelijkingen (referentie | website | 50%-overlay)
`docs/v13/compare/{home,schuttingen,ontwerper}-{1440,768,390,320}-vergelijking.png` (+ `*-ours.png` volledige schermafbeelding) en `home-mobiel-390`.

| # | Afwijking gevonden | Pagina | Status |
|---|---|---|---|
| 1 | Sectievolgorde: 3D stond direct onder hero, FAQ/"Zo werkt het"/routes tussen content | home | Opgelost: hero, voordelenbalk, diensten, 3D, projecten, waarom, CTA |
| 2 | Voordelenbalk klein en op één regel; referentie: icoon boven tekst | alle | Opgelost |
| 3 | Dienstenkaarten ongelijke hoogte, subtekst; referentie: foto + titel + pijl, 4+3 | home | Opgelost (7 kaarten, gelijke hoogte) |
| 4 | Geen Plantenbakken-kaart/-pagina; "Materialen" als kaart | home/menu | Opgelost: nieuwe dienstpagina `/plantenbakken/` |
| 5 | 3D-sectie was lichte kaart; referentie: donkergroene band, tekst links, 3D rechts | home | Opgelost |
| 6 | Projectenknop outline; referentie: groen gevuld met pijl | home | Opgelost |
| 7 | CTA-band donker i.p.v. merkgroen | home | Opgelost |
| 8 | Schuttingenpagina: zes stijlkaarten (Modern, Klassiek, Horizontaal, Composiet zwart, Hout-beton, Met poort) met knoppen | schuttingen | Opgelost |
| 9 | Ontwerper: 3D te klein t.o.v. referentie, stap-titel te klein | ontwerper | Verbeterd (4:9 kolommen, grotere titel) |
| 10 | Ontwerper: geen startkeuze voor terras/tuinindeling/plantenbakken | ontwerper | Opgelost: "Iets anders ontwerpen" opent de volledige 2D/3D-ontwerper |
| 11 | 3D is schematisch, referentie is fotorealistisch | ontwerper | **Niet opgelost** (zie onder) |
| 12 | Snelle invoerbalk (Hekwerk/Lengte/Hoogte) onder de 3D | ontwerper | **Niet gebouwd**: invoer staat in het linkerpaneel |
| 13 | Hero ref is veel hoger op de tegel; echte hero begrensd op 760 px | home | Bewust: bruikbare hoogte |

## Verdwenen webshopdelen
Menu "Materialen" en "Prijzen" (Prijzen staat nog in de footer); `/materialen/`, productpagina Elephant Finch, `/winkelmandje/`, `/bestelling/` zijn doorverwijspagina's (meta refresh + `location.replace` + noindex + canonical; GitHub Pages kan geen 301) naar `/schuttingen/` resp. `/contact/`; uit sitemap en zoekindex; homepagina-route "Alleen materiaal bestellen". Webshop-e2e is `tests/e2e/dormant-webwinkel.mjs` (niet in `npm run e2e`).

## Behouden technische functies
Server (leads, offertes, facturen, betalingen uit), kortingsmotor en `js/shop/*`, `js/catalog/*`, `data/catalog.js` blijven in de repo maar zijn niet meer gelinkt; `data/materials.js`, `fence-systems.js`, calculatiemotor, geometrie, 3D/2D-scene, beginnersroute, volledige ontwerper (`/project-samenstellen/`), formulieren, events, inspiratiebord. Unit-tests: 68 geslaagd.

## Knoppentest (`tests/e2e/knoppen.mjs`, 17 groepen, desktop + 390 + 320)
Alle interne links op 7 kernpagina's (200 en geen winkelstub); logo; menu (Tuin ontwerpen, Projecten, Contact, Diensten > Plantenbakken, Offerte); hero-knoppen; 7 dienstenkaarten; 3 projectkaarten; 3D-startknop + 3 3D-knoppen; tel:/WhatsApp-bestemming; 6 stijlkaarten (beide knoppen); FAQ-accordeon; plantenbakkenkaarten; ontwerper (startkeuzes, volgende/terug, herstelroute, "iets anders"); leeg contactformulier geeft foutmelding; mobiel menu incl. submenu. Geen consolefouten. Volledige verzending met backend: `tests/e2e/server-keten.mjs` en `beginner.mjs` (alleen testgegevens).

## Eerlijk: wat klopt nog niet
- 3D niet fotorealistisch; geen foto-achtergrond, wel texturen/schaalfiguur.
- Beelden: 14 aangeleverde impressiebeelden (rechten/bron en AI-transparantieplicht nog te bevestigen); echte foto's alleen op echte projecten en drie dienstenkaarten. Ontbrekende beelden: zie `docs/IMAGE_BRIEFING_V13.md`.
- Over ons, Projecten, Contact, FAQ, overige diensten hebben nog de v12-stijl (fase 6 na goedkeuring); `/kennisbank/` en `/inspiratie/` ook.
- Niet getest: echte telefoons, schermlezer, echte gebruikers; contactformulier niet met echte verzending (geen SMTP).
