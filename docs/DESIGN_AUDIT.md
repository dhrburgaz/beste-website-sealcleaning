# DESIGN_AUDIT: onafhankelijke audit van de ontwikkelversie (V7-17 fase 1)

- **Datum:** 10 oktober 2026.
- **Basis:** branch `claude/sealcleaning-website-overhaul-gvgtfj` (niet de live `main`), lokaal geserveerd.
- **Screenshots:** gemaakt met `tools/screens.mjs` op 390 en 1440 px, met fonts geladen en lazy-load uitgeschakeld. Ze staan buiten de repository, omdat ze reproduceerbaar zijn met hetzelfde script.
- **Metingen:** `tools/ux-metrics.mjs`.

## Meetresultaten (390 px, 35 pagina's uit sitemap)

| Meting | Vóór | Na ronde 1 |
|---|---|---|
| Horizontale overflow | 0 pagina's | zie `docs/MOBILE_QA.md` |
| Tikdoelen < 44 px (exclusief inline tekstlinks) | 929 (vooral footerlinks, breadcrumbs, menuknop, merklink) | zie MOBILE_QA |
| Afbeeldingen zonder `width`/`height` (CLS-risico) | 83 | zie MOBILE_QA |
| Formuliervelden zonder label | 3 | zie MOBILE_QA |
| Webfonts | Google Fonts (extern verzoek met IP-adres naar Google; in screenshots zonder netwerk viel de site terug op Georgia/Times) | zelf gehost (OFL), preload |

## Bevindingen op prioriteit

| # | Prio | Bevinding | Bewijs | Aanpak |
|---|---|---|---|---|
| 1 | P1 | Homepage-dienstenlijst is op mobiel kapot. Het desktopraster wordt samengedrukt: de omschrijving staat in een kolom van ±100 px, de naam rechts uitgelijnd, de pijl los links | home 390 px, segment 1–2 | Mobiel een eigen stapel: nummer + naam + pijl op één regel, omschrijving eronder |
| 2 | P1 | Eyebrow (terracotta `#7a4e31`) en breadcrumb op foto-hero's onleesbaar; contrast duidelijk onder 4,5:1 | alle hero's (home, schuttingen, prijzen, configurator, case) | Lichte tint op donkere scrim; scrim sterker aan de tekstzijde |
| 3 | P1 | Webfonts van Google: privacy (doorgifte IP-adres) en geen garantie op merktypografie | `index.html` + 37 pagina's | Zelf hosten (gedaan) |
| 4 | P2 | Breadcrumb lijnt niet uit met de titel (x = 136 tegenover 96 px op desktop) | case- en dienst-hero 1440 px | Zelfde container/padding |
| 5 | P1 | Configurator: op mobiel vult de hero het hele eerste scherm; het werkvlak begint pas na ±1,5 scherm | project-samenstellen 390 px | Compacte paginakop; startkeuze "Snel project / Zelf ontwerpen" direct zichtbaar |
| 6 | P2 | Homepage-hero op mobiel: werkgebied staat alleen in de onleesbare eyebrow; vertrouwensstrip pas onder de vouw, als vier gecentreerde hoofdletterregels | home 390 px | Werkgebied leesbaar in de propositie; compacte vertrouwensregel direct onder de CTA's |
| 7 | P2 | Hoofdnavigatie mist de producten van het platform (Project samenstellen, Prijzen, Materialen); de headerknop wijst alleen naar kennismaking | 1440 px header | Navigatie herordenen; primaire CTA "Vraag offerte aan" + secundair "Ontwerp uw tuin" |
| 8 | P2 | Veel lege verticale ruimte tussen secties op mobiel (spacing 8–10,5 rem) | home 390 px | Vloeiende sectiespacing |
| 9 | P2 | Contactpagina op mobiel: formulier pas na ruim een scherm intro | contact 390 px | Kortere intro, keuzehulp (bellen / WhatsApp / formulier) bovenaan |
| 10 | P2 | Stappenchips configurator (2–5) lijken uitgeschakeld (lichtgrijs) | configurator 1440 px | Duidelijke toestanden: actief / gedaan / beschikbaar |
| 11 | P2 | 83 afbeeldingen zonder afmetingen → layoutverschuiving bij laden | metingen | `width`/`height` toevoegen, ook in door JS gerenderde kaarten |
| 12 | P2 | 929 kleine tikdoelen | metingen | Footerlinks, breadcrumbs, menuknop en chips ≥ 44 px op mobiel |

## Wat sterk is en behouden blijft

- Rustige editorial basis:
  - bosgroen/zand/terracotta;
  - Fraunces met Inter;
  - echte projectfoto's;
  - geen stockbeeld;
  - geen glans of gradients.
- Eerlijke prijs- en onzekerheidscommunicatie (disclaimers, bronnen, peildata).
- Mobiele actiebalk Bellen / WhatsApp / Kennismaking.
- Casus-opbouw situatie / aanpak / resultaat.
