# SEAL MASTERDOSSIER v7.0 — PREMIUM EXPERIENCE, HIGH-CONVERSION COMMERCE & DESIGN INTELLIGENCE

**Opdrachtgever:** SEAL / Sealcleaning Groenonderhoud en Aanleg. **Bestemming:** Claude Code, bestaande repository `dhrburgaz/beste-website-sealcleaning`. **Datum:** 10 oktober 2026. **Karakter:** integraal uitvoeringsdossier (de volledige v6.0 staat onderaan). **Ambitie:** een uitstekend digitaal klant-, ontwerp- en bedrijfssysteem voor hoveniersdiensten, schuttingen, bestrating, materialen en onderhoud.

> **START HIER — BELANGRIJK:** Dit document bevat nieuwe v7.0-ontwerp-, commercie-, mobiele en producteisen EN alle oorspronkelijke v6.0-/v5.0-/v4.0-/v3.0-/v2.0-eisen. v7.0 heeft bij conflict voorrang, maar verwijdert geen veiligheidsregels, eerder goedgekeurde functionaliteit of klantdata. Lees de v7.0-hoofdstukken en de actuele projectstatus, raadpleeg oudere specificaties gericht per taak. Werk daadwerkelijk in de bestaande code. Nieuwe ontwerpen zijn pas gereed na toepassing, browsercontrole, toegankelijkheidscontrole en gebruikersgerichte beoordeling. **Noem SEAL nooit 'de beste website' zonder aantoonbaar, representatief vergelijkingsonderzoek en echte gebruikersresultaten.**

## V7-00. Ononderhandelbare strategische opdracht

De opdrachtgever wil niet simpelweg 'een fraaie hovenierssite'. Ontwikkel een zorgvuldig samenhangend digitaal product op het kwaliteitsniveau van een goed creatief bureau, retailproductteam en professionele softwareorganisatie. Gebruik de gecombineerde beoordelingsperspectieven van creative director, art director, brand strategist, service designer, senior product designer, e-commerce UX-researcher, gedragsonderzoeker, conversiespecialist, typograaf, fotograaf, hoveniervakexpert, calculator, accessibility engineer, front-end architect, security engineer en kritische bedrijfsleider. Het gaat om toetsbare kwaliteit, niet om prestigieuze titels.

**Nooit tevreden op basis van snelheid.** Een uur ontwikkelen is geen bewijs van topkwaliteit. De eerste werkende versie is slechts een prototype. Doe daarom meerdere volledige ontwerp- en kwaliteitsrondes: onderzoek → alternatieven → ontwerp → werkende implementatie → inspectie → verbeteren → met gebruikers toetsen → opnieuw verbeteren.

**Werk vanuit gebruikerswaarde, niet vanuit feature-count.** Een goede site heeft veel zinvolle mogelijkheden zonder de klant te overspoelen. Alle benodigde keuzen zijn bereikbaar; de standaardroute blijft eenvoudig. Bij een klant met één schutting hoef je geen volledige tuinontwerpstudio af te dwingen.

**Geen valse overtuigingstechnieken.** Verboden: nepreviews, fictieve voor/na-foto's, nep-schaarste, kunstmatige aftelklokken, verborgen toeslagen, misleidende 'van'-prijzen, vooraf aangevinkte betaalde opties, zonder toestemming volgen of automatisch akkoord afdwingen. Positieve psychologie betekent: minder onzekerheid, meer gemak, betere verbeelding, geloofwaardig bewijs en eerlijke prijsvergelijking. Gebruik privacy-by-design, AVG, ACM-regels en echte bewijsvoering.

**Status realistisch houden.** 'Gebouwd' ≠ 'getest' ≠ 'productiegeschikt' ≠ 'live' ≠ 'bewezen succesvol'. Voor alle claims moeten bronnen, testresultaten, screenshots of meetgegevens beschikbaar zijn. Geen kunstmatige 10/10-beoordelingen.

**Bestaande toestand bij aanvang:** PR #3 van `claude/sealcleaning-website-overhaul-gvgtfj` naar `main` was op 10 oktober 2026 nog open, niet gemerged. Een groot deel van frontend en backend is ontwikkeld, maar staat niet live. Het register `docs/REQUIREMENTS_INDEX.md` had bij die controle **138 van de 160** specifieke IDs; ontbrekend waren `H01–H04`, `H09`, `J08–J10`, `L01–L07`, `M04–M10` (22 IDs). Dit zijn historische meetpunten: **controleer actualiteit opnieuw**. Sommige ontbrekende registerregels vertegenwoordigen al gebouwde backendcode. Vul eerst de registratie aan; bouw niets dubbel.

**Afhankelijkheden:** e-mail `info@`, backend-hosting, Mollie/andere betaalprovider, leveranciersafspraken, juridische goedkeuring en inhoudelijke eigen bedrijfsgegevens mogen later worden aangesloten. Bouw hun contracten/adapters en duidelijke lege of geblokkeerde toestanden nu, maar geef nooit een vals signaal dat ze werken. Geen ongeautoriseerde DNS-wijziging, live-merge, accountaanmaak, uitgave of betaaltransactie.

## V7-01. Design thinking: hoe SEAL vertrouwen en verlangen tegelijk creëert

**De centrale ontwerpvraag:** 'Welke ervaring helpt iemand die honderden tot tienduizenden euro's in zijn woning en tuin investeert, bij elke stap een veilige, geïnformeerde en plezierige keuze te maken?' Vertaal dit naar zes lagen:

1. **Aantrekkingskracht:** smaak, rust, authenticiteit, passend aspiratieniveau, een eerste visueel beeld dat het resultaat voor de klant voelbaar maakt.
2. **Begrip:** iemand weet binnen seconden wat SEAL doet, in welk gebied, voor welk type klus, en hoe hij contact kan opnemen.
3. **Geloofwaardigheid:** eigen werk, echte mensen, heldere bedrijfsgegevens, juiste reviews/bron, hoe de uitvoering wordt aangepakt, wat er bij problemen gebeurt.
4. **Controle:** ontwerp vergelijken, teruggaan, opslaan, de consequenties van keuzes begrijpen, reële verwachtingen rond prijs en planning.
5. **Transactiezekerheid:** onderscheiden tussen vrijblijvende aanvraag, prijsindicatie, definitieve offerte, bindend akkoord, materiaalbestelling en betaling.
6. **Vertrouwen ná verkoop:** planning, voortgang, wijzigingen, oplevering, onderhoud en toegankelijke klantenservice.

Voor elk interactie-element noteer: klantvraag; onderliggende twijfel; informatie of bewijs; gewenst gedrag; alternatief zonder dwang; meetbare indicator; risico voor privacy/vertrouwen. Test aannames in plaats van ononderbouwde psychologische effecten te claimen.

**Doelgroepen (geen stereotype aannames):** (a) kleine, snelle onderhoudsklus, (b) schutting/privacy, (c) bestrating/terras/oprit, (d) complete tuinrenovatie, (e) luxe tuinontwerp, (f) laag-onderhoud-georiënteerde klant, (g) prijsgevoelige vergelijking, (h) bestaande klant/nazorg, (i) aannemer/projectleider, (j) VvE/verhuurder, (k) zakelijke inkoper, (l) vakman die samenwerking zoekt. Maak voor elk een journey map met vragen, risico's, CTA, bewijs en frictiemomenten.

**Cognitieve strategie (ethisch):** keuze-architectuur met beperkte hoofdopties, progressive disclosure, herkenning in plaats van onthouden, sociaal bewijs alléén indien echt, transparante ankers (inhoudelijke pakketten), endowment door eigen ontwerp, 'what happens next' zekerheid, uitleg bij ingewikkelde termen, verliespreventie door bewaren/undo, consistente feedback en voorspelbare foutafhandeling. Vermijd schuldgevoel, afleidingsmanoeuvres en manipulatie.

## V7-02. Hoogwaardige merk- en visuele ontwerprichting

Bestaande premium ankers uit de code: diep bosgroen `#1b2a1e`, warm zand `#f3ede1`, hout/steen, donker tekstcontrast, terracotta `#7a4e31`, Fraunces voor display, Inter voor UI, echte projectfotografie. **Beoordeel** de huidige richting; behoud indien deze na vergelijking sterker is. Geen redesign uitsluitend om redesign.

**Ontwikkel eerst drie volwassen visuele concepten in dezelfde contentstructuur:**

- **Concept A — Architectural Forest:** bosgroen, natuurlijke steentinten, editorial fotografie, rustige serif-koppen, nauwkeurige lijnen, veel ademruimte. Focus: premium maar toegankelijk.
- **Concept B — Modern Stone Studio:** meer warme, bijna-witte ondergrond, donkere, grafische typografie, subtiele aardekleuren, projectportfolio als galerij. Focus: verfijnd en architectonisch.
- **Concept C — Warm Craft & Nature:** natuurlijke warmte, aandacht voor ambacht, echte mensen/handen/materialen, toegankelijke informatieblokken. Focus: persoonlijkheid en betrouwbaarheid.

Maak voor ieder concept concrete desktop- en mobiele prototypes van homepage, dienstpagina, projectcase, materialendetail, configurator, offerte en checkout. Presenteer geen statische mock-up als productiecode. Kies één consistente richting met gedocumenteerde onderbouwing, designelementen en risico's; eventueel de beste details combineren zonder stijlloze collage. Gebruik de echte SEAL-foto's en gegevens; ontbreken de assets, maak neutrale beeldvakken met duidelijk aangegeven vereiste bron, geen nepklussen.

**Designsystem minimaal:**
- Semantische kleurrollen (primary, accent, positive, attention, danger, focus, muted, surface, overlay); kleurcontrast in alle toestanden; kleur niet als enige statusdrager.
- Typografische rollen en fluid scales voor H1/H2/H3/body/caption/numerieke tabellen; Nederlandse lange woorden en prijsregels testen; line-height en optimale regelbreedte.
- Spacing/rhythm 4/8-px schaal of een consistente variant; containers, grid, fotoverhoudingen, radii, borders en schaduwen met een bewuste signatuur.
- Componentbibliotheek voor knop, chip, kaart, tabs, accordion, keuze-tegel, input, validatie, status, vergelijkingstabel, sticky CTA, mobiele navigatie, dialog, toast, skeleton, progress-indicator, lightbox, galerij, besteloverzicht, prijstabel en foutscherm.
- Status voor loading, empty, error, no-Wi-Fi/offline, success, pending, estimated, out-of-service-area, not-configured; onafhankelijk van alleen kleur.
- Iconen met een consistente lijnstijl; geen decoratieve icon-wolk; geen onnodige gradients/glow/stockbeeld.
- Motion-systeem: purposeful 100–300 ms overgang (indicatief, testen), natuurlijke easing, animatie alleen indien behulpzaam, `prefers-reduced-motion`, animaties mogen metingen, klikken, contrast of compositie niet ondermijnen.
- Beeldregie: contact sheets van echte projecten; per foto onderwerp, locatie indien geverifieerd, doel, uitsnede, scherpstelpunt, kleurcorrectie zonder misleidend resultaat, geschikte webp/avif-versies en alt-tekst.
- Luxe vertaalt zich in beheersing, details en helderheid — niet in enorme heroes, kleine teksten of trage video-achtergronden.

**Designbeoordeling:** beoordeel elk concept met vaste criteria en bewijs: merkonderscheid, doelgroepmatch, geloofwaardigheid, typografie, fotografie, visuele hiërarchie, mobiel, toegankelijkheid, begrijpelijkheid van CTA, implementatiekosten en onderhoudbaarheid. Streef naar aantoonbare verbeteringen; verzin geen objectieve 'wereldbeste'-score.

## V7-03. Representatieve benchmark: van Nederlandse hovenier tot wereldklasse-productteam

Onderzoek live **minimaal 12 Nederlandse branchevoorbeelden** (directe hoveniersbedrijven, regionale concurrenten, tuinarchitecten, 3D-aanbieders, materiaalplatformen), aangevuld met **6 aangrenzende inspiratiecategorieën** (sterke retailers, interieurmerken, woningbouwers, online configuratoren, hospitality, B2B-dienstverleners). Geen belofte dat ze 'de beste' zijn: onderzoek juist uiteenlopende sterke en zwakke voorbeelden.

**Verifieerbare startkandidaten voor onderzoek (site en inhoud opnieuw inspecteren):**
- https://debiesboschgijsbersgroep.nl/tuinontwerp/voorbeelden/
- https://www.degroothoveniers.nl/3d-ontwerpen/
- https://www.dimhovenier.nl/tuinontwerp/3d-tuinontwerp
- https://bos-hoveniers.nl/projecten/voorbeelden-3d-tuinontwerp/
- https://www.verdahoveniers.nl/ontwerp-aanleg-renovatie-onderhoud.html
- https://www.siebersgroep.nl/luxe-tuin/
- https://burobuiten.nl/
- https://www.martinveltkamp.nl/
- https://www.tuinarchitect-rotterdam.nl/portfolio.html
- https://gernellhoveniers.nl/portfolio
- https://gratis-tuinontwerp.nl/
- https://maiapro.nl/

**Aangrenzende typen om te onderzoeken** (zoek actuele relevante pagina's, ga niet uit van onbewezen details): bol/Amazon voor filters en checkout; IKEA voor ruimte- en materiaalvoorstelling; Apple voor productpresentatie en typografie; Airbnb voor vertrouwen en beeld; premium architectuurportfolio's voor beeldregie. Benchmark geen merknaam, maar de concrete interactie.

**Benchmarkmatrix:** datum, URL, doelgroep, eerste indruk, mobiele eerste scherm, navigatie, bewijs, contentdiepte, pagina-architectuur, beeldkwaliteit, drempels om contact op te nemen, prijsduidelijkheid, configuratie, filters, informatie per product, checkoutfrictie, foutafhandeling, toegankelijkheid, performance, unieke elementen, negatieve verrassingen. Bewaar bron en screenshot waar toegestaan; vat samen in eigen woorden. Geef per patroon het voorstel 'overnemen als principe / verbeteren / vermijden / niet toepasbaar' met reden. Zonder webtoegang: markeer audit als **niet uitgevoerd**, vul geen verzonnen score in.

## V7-04. De complete klantreis: 16 routes in plaats van zeven oppervlakkige stappen

Voor iedere route: storyboard, schermen, edge cases, touch-specifieke flow, semantische CTA, servercontract, succesbevestiging en end-to-end test.

1. **Eerste bezoek mobiel → snelle bel/WhatsApp-actie:** meteen duidelijk werkgebied, diensten, bereikbaar kanaal en geen overbodige pop-ups.
2. **Nieuwe bezoeker → vrijblijvende tuinaanvraag in < 2 minuten** (gebruikersdoel, geen beloofde meetwaarde): dienst, locatie, korte omschrijving, contact; alleen noodzakelijke velden.
3. **Schuttingproject → meters/hoogte/hoek/poort → voorstel → aanvraag:** inclusief bestaande schutting, verwijdering en buurtafspraken.
4. **Bestratingsproject → oppervlak/verband/ondergrond/afvoer → materiaalscenario's → aanvraag:** pakketten en snijverlies transparant.
5. **Complete tuin → wensen → tekenen → bewaren → samen bespreken → aanvraag:** geen verplichte complete 3D voordat contact mogelijk is.
6. **Inspiratie → case → bewaren → vergelijken → eigen plan:** alleen echte case claims en herleidbare foto's.
7. **Materiaal ontdekken → zoeken/filteren → vergelijken → informatie/demonstratie → prijsstatus.**
8. **Materiaal kopen (alleen wanneer daadwerkelijk aangeboden):** productdetail → configureerbare hoeveelheid → mandje → coupon → verzending/afhaaloptie → betaaldienst → bevestiging → nazorg/retourproces.
9. **Alleen montage, klant levert materiaal:** duidelijke verantwoordelijkheid, aantallen, tolerantie, risico, levertijd en afspraak.
10. **Onderhoudsklant → éénmalig vs seizoenscontract:** scope, frequentie, toegankelijkheid, afvoer, opzeg- en prijsvoorwaarden.
11. **Budgetbewuste klant → varianten A/B/C:** eerlijke uitgangspunten en leverbaarheid; aanpassingen binnen hetzelfde ontwerp.
12. **Zakelijke opdrachtgever/VvE → meerdere locaties/PO/BTW:** gestandaardiseerde projectaanvraag, documenten, rollen, facturatie.
13. **Offerte ontvangen → vragen → wijzigen → akkoord:** exacte versie/voorwaarden vastleggen; niet verplicht eerst een account creëren om inhoud te zien.
14. **Uitvoering → planning/meerwerk/oplevering:** transparante status en contactmomenten.
15. **Probleem/klacht/herroeping:** frictiearme toegang, wettelijk proces, geen defensieve interface.
16. **Bestaande klant → onderhoud → vervolgproject → aanbeveling:** opt-in opvolging en eenvoudig opnieuw aanvragen.

Voor elke route ook de 'mislukte' scenario's testen: geen internet, verkeerd formaat, offerte verlopen, ontwerp te groot voor deellink, ontbrekend product, ongeldige korting, mislukte betaling, geen mailserver, verboden locatie, niet-beschikbare API, tablet gedraaid, sessie verlopen. Laat data niet onzichtbaar verdwijnen.

## V7-05. Pagina-architectuur en voorbeeldindeling per template

**Homepage — geen visuele rommel.** Boven de vouw: herkenbare merknaam, hoogwaardige echte projectfoto, heldere propositie, expliciet werkgebied, twee betekenisvolle paden ('Vraag een offerte aan' en 'Ontwerp uw tuin'; bellen als ondersteunende keuze); zinvolle microcopy wat er daarna gebeurt. Daarna: bewijs (echte projecten/team), 5–7 hoofdservices met logische verdere categorieën, ontwerpvoordeel, een echt projectverhaal, materiaalkeuze, transparante werkwijze, eerlijke vraag-en-antwoordsectie, zakelijke route en afsluitende CTA. Fotografie niet dupliceren louter om pagina te vullen.

**Dienstpagina:** duidelijke probleemstelling en wat SEAL concreet doet; toepassingsfoto's; voor wie; keuzes (alleen montage, compleet, onderhoud); 'wat is inbegrepen' vs 'niet standaard inbegrepen'; materiaalaanpak; factoren die kosten beïnvloeden; eigen projectcases; praktische voorbereiding; vaktechnische aandachtspunten; FAQ; contextuele aanvraag. Geen automatisch gegenereerde lege lokale SEO-pagina's.

**Projectcase:** 1 sterke foto, navigeerbare galerij, situatie/uitdaging/uitvoering/resultaat, verifieerbare locatie en maten wanneer aanwezig, gebruikte materialen als bekend, korte foto-captions, inspiratie opslaan, vergelijkbaar project starten, contact. Voor/na-sliders alleen bij echt identieke plekken.

**Materialencategorie:** categorie-uitleg, filters die aansluiten bij vaktaal (materiaal, formaat, kleur, structuur, toepassing, onderhoud, prijsklasse, leverancier/bronstatus, levertijd indien bekend), sortering en reset; duidelijke actieve filters, resultaatcount, no-results, snelle vergelijking.

**Productdetail:** duidelijke naam en variant, alle betrouwbare beelden/maattekeningen, technische specs, toepassing/ondergrond, onderhoud, eenheid, pakketinhoud, totale benodigde hoeveelheid, voorraadstatus indien gecontroleerd, eventuele sample-optie, levertijd indien bevestigd, reële BTW-/bezorginformatie, alternatief als product ontbreekt. Geen zelfbedachte SKU of 'direct leverbaar'.

**Configurator:** keuze 'Snel project' en 'Zelf ontwerpen'; logisch paneel, consistent canvas, persistent maat-/prijsstatus, onzekerheidsbadge, undo/redo, tips contextueel, materialenbibliotheek, mobiele editmodus en apart volledig scherm. Ontwerp heropenen ook na per ongeluk sluiten binnen bewaarbeleid.

**Prijzen:** gescheiden arbeidsverkooptarief, externe marktbenchmark, indicaties, pakketverschillen, bron/verversdatum, inclusies en uitsluitingen; geen magische totaalprijs. Uurtarief SEAL €60 excl. btw per medewerker (verkooptarief; controleer BTW-toepassing).

**Offertepagina/portaal:** helder opdrachtresultaat, projecttekening, vigerende versie, werkregels, materiaal, toelichtingen, prijs incl. toepasselijke btw, onzekerheden en keuze om vragen te stellen, voorgestelde planning, voorwaarden en expliciet akkoord. Meerwerk altijd aparte wijziging.

**Mandje/checkout:** alleen wanneer orders juridisch en technisch geactiveerd kunnen worden; zie V7-09 en V7-10. Materialen kopen is iets anders dan vrijblijvende offerteaanvraag.

**Over ons:** echte mensen, werkprocessen, vakinhoud en verificatie, geen ongefundeerde '35 jaar ervaring' of verzonnen certificaten. **Zakelijk:** PO, locaties, veiligheids-/toegangsafspraken, scope, werkbonnen. **Contact:** keuzehulp en werkelijk werkende ontvangst; probleemloos bellen en berichten. **404/0-resultaten:** vriendelijk herstelpad, interne zoekfunctie, relevante diensten; nooit dood einde.

## V7-06. Mobile-first premium, niet 'desktop verkleind'

**Standaard: ontwerp eerst de 360/390 px iPhone-/Androidervaring en werk op.** Test fysiek waar mogelijk, niet alleen browseremulatie. Specifieke extra browsermaat: 320, 360, 375, 390, 430, 768, 1024 en 1440 px; iOS Safari en Android Chrome; portrait/landscape; zoom 200% en systeemfontgroottes.

- **Bovenkant:** eerste 1–2 schermen moeten duidelijke dienst, vertrouwen en CTA bevatten; geen levensgrote hero die de inhoud wegdrukt.
- **Navigatie:** met één hand bruikbaar; menu met semantische categorieën en grote tikvlakken; back-button werkt; menu sluit bij keuze; focus blijft correct.
- **Tap targets:** minimaal WCAG 2.2 AA of voldoende ruimte (norm is 24px), maar streef voor eigen interactieve controls naar **44 × 44 CSS px** (verhoogde AAA-doelstelling en praktisch comfortabel), inclusief canvas-handgrepen en sluitknoppen.
- **Sticky balk:** contextueel één primaire actie ('Vraag offerte aan', 'Ga verder', 'Bekijk totaal'); rekening houden met `env(safe-area-inset-bottom)` en iPhone Safari-toolbar; verbergt geen formuliervelden, betaal- of herroepingsinformatie; geen dubbele sticky balk.
- **Formulieren:** correcte `autocomplete`, `inputmode`, persistente labels, expliciet optioneel/verplicht, passende toetsenborden, inline specifieke fouttekst, niet boven keyboard verborgen; focus/scrollpositie behouden.
- **Fotografie:** prioriteit aan relevant beeld, volledig scherm mogelijk, pinch-to-zoom waar zinvol, lazyload onder de vouw, dimensies voorkomen CLS, geen dure autoplay-video op mobiel.
- **2D/3D canvas:** bij scrollen geen onbedoeld slepen; eerste tik selecteert; tweevinger-pan/zoom of duidelijke alternatieve knoppen, schermlezer- en numerieke invoer alternatief, state nooit verliezen bij draaien.
- **Compatibiliteit:** langzaam 4G/CPU-throttle, 3D zonder WebGL2 → nette 2D-fallback, slecht netwerk, offline herstel, geen horizontale overflow; volledige pagina inclusief koopflow.
- **Typografie/contrast:** alles leesbaar zonder knijpen; actieve prijs/totaal/subtitel in juiste relatie; geen overcomplexe tabellen zonder mobiel toegankelijk alternatief.
- **Interrupties:** geen storende inlog-, cookie-, korting- of chatpopups boven het werk; subtiele relevante hulp of opt-in.
- **Polish:** geanimeerde statusovergangen alleen functioneel; pressed/focus/disabled/loading states; 'gelukt' en 'nog niet ontvangen' expliciet onderscheiden.

**Performance-doelen** (voor echt verkeer op p75, afhankelijk van meetmethode): LCP ≤2,5 s, INP ≤200 ms, CLS ≤0,1; documenteer labmetingen apart van echte bezoekersgegevens. 3D-code on demand; statische landingspagina laadt niet de zware editor. Beeldformaten, caches, splitsing, budgetten en browsermeting zichtbaar documenteren. Geen beloften zonder werkelijke meting.

## V7-07. De 2D/3D-editor als onderscheidende 'product experience'

**Behoud en consolideer wat bestaat:** gedeelde geometrie tussen 2D, 3D, materiaalhoeveelheden, export, scenario's, dossier en calculatie. Test alle berekeningen op grensgevallen. Maak verbeteringen op bestaande modules, geen tweede editor.

**Geavanceerde opties (faseren op echte waarde):**
1. Rechthoek, L-vorm, vrije contour, verspringingen en meerdere ontwerpzones met schaal, area sanity checks en niet-zelfkruisende polygonen.
2. Hoogteverschil als expliciete informatie of geverifieerde module, geen misleidende afwateringssimulatie.
3. Bestaande omheining, delen, hoeken, poorten, deurzwaai, perceelsgrens met disclaimer, behouden/herstellen/verwijderen.
4. Tegels, klinkers, halfverharding, grind, gras, borders, beplanting, vlonders, verlichting, plantenbakken, tuinmeubels als schematische objecten, waterafvoer.
5. Producten zien in geloofwaardige relatieve schaal, materiaalmonsters/texture atlas alleen met juiste rechten en bekende productspecificaties.
6. 3D camerastandpunten: boven, op ooghoogte, ingang, terras; reset, zoom, duidelijke hulpschermpjes.
7. Zon/schaduw met illustratieve status; noordpijl alleen waar oriëntatie door gebruiker is ingevoerd; geen klimaatsimulatieclaim.
8. Opslaan, versiegeschiedenis, undo/redo, kopiëren, dupliceren, vastzetten en A/B/C vergelijken.
9. 'Wat verandert er als?' scenario's: minder bestrating, andere hoogte, duurzamer materiaal, minder onderhoud, andere poort; prijswijziging alleen bij geldige bron/norm.
10. Zelfopmeten-hulp met fotovoorbeelden, toegang, scheefstand, obstakels, snijverlies, werkruimte en benodigde professional check.
11. Downloads: heldere PNG, bruikbaar geversioneerd ontwerpbestand en een leesbaar projectdossier; zorg dat re-import betrouwbaar werkt.
12. Delen met partner via veilige link zonder PII; ontwerpverwijdering en verlopen links waar serveropslag wordt gebruikt.
13. Visualisaties mogen aantrekkelijk zijn maar kunnen nooit exact product, licht of uitkomst garanderen.
14. Optionele AR en fotogebaseerde visualisatie zijn **R&D-kandidaten**; pas bouwen als assets, accuracy, apparaatcapaciteit, privacy en broninformatie betrouwbaar zijn.

**Configuratorspecifieke microdetails:** maatlabels, eenheden mm/cm/m consequent, duidelijke min/max, hover/focus/uitleg op warnings, zoom die cursor/touch center volgt, auto-fit zonder onverwachte sprongen, preview bij materiaalwijziging, selectie zichtbaar bij hout- én lichte tegeltextures, weergave van onbekende waarden, pure functies voor geometrie/calculatie en tests voor negatieve coördinaten, nullen, randcontact, overlappende vlakken, poortconflict en 3D/2D-sync.

## V7-08. Catalogue intelligence: méér mogelijkheden dan drie 60×60-tegels

**Het project heeft momenteel drie geverifieerde bestratingsproducten van hetzelfde formaat. Dat is niet het beoogde volledige assortiment.** Ontwikkel een schaalbare gegevensstructuur en sterke UI voor de onderstaande categorieën, maar onderscheid zorgvuldig `geverifieerd-product`, `algemene materiaaloptie`, `op aanvraag`, `niet leverbaar`.

**Categorieën:** schuttingdelen (grenen, douglas, hardhout waar mogelijk, composiet, hout-beton, beton), palen, onderplaten, poorten, beslag en fundering; bestrating (beton, keramiek, natuursteen, klinkers, waaltjes, groot/kleinformaten, 20/30/40/60 cm en andere echt beschikbare maten); opsluitbanden, voegmiddelen, zand, split, stabilisatie, grind, worteldoek; kunstgras, gazon, graszoden, bodemverbetering; haag, heesters, vaste planten, bomen, bodembedekkers, potten; verlichting, drainage, vlonders, pergola/overkapping **alleen binnen echt aangeboden scope**; onderhoud en afvoercategorieën.

**Productdatamodel**: id, category, title, description, SKU, leverancier, afbeeldingen/licenties, maat-dimensies, kleur/afwerking, technische toepasbaarheid, eenheid, verpakking, minimum hoeveelheid, beschikbaarheid plus datum, bron-URL, prijs excl/incl BTW indien betrouwbaar, vereiste onderlaag, gewicht/transport, onderhoud, geschiktheid/risico, herkomststatus en teststatus. Alle onzekere velden null, nooit gokken.

**Gebruikersfuncties:** productzoeker met synoniemen en verkeerd gespelde woorden, slimme facetfilters, vergelijk tot 3, favorieten/inspiratiebord, voorbeeldproject met product, geschiktheidscheck, eigen materiaal meebrengen, alternatieven bij niet-beschikbaarheid, automatische hoeveelheidberekening alleen waar wiskundig valide. 'Direct kopen' uitsluitend bij bevestigde assortiment- en fulfillment-afspraken. Voor samples eerst eigenaar/leverancierbeleid.

## V7-09. Prijzen, korting en promoties: echte retailcapaciteit zonder misleiding

**Duidelijke aparte commerciële modellen:** (A) vrijblijvende intake, (B) indicatieve calculator, (C) door SEAL beoordeelde offerte, (D) geaccepteerde opdracht, (E) werkelijk bestelbaar product met betaling. Gebruik niet één 'bestel nu'-CTA voor onzekere tuinwerkzaamheden.

**Promotie-engine voor later in productie, bouw architectuur en tests nu:**

- Kortingscode: code, interne id, type (`percentage`, `vast-bedrag`, `gratis-bezorging` waar passend, dienstkorting, bundelkorting), bereik (producten, categorieën, specifieke offertes of arbeid alleen als expliciet toegestaan), start/eind-datum met Europe/Amsterdam-verwerking, actieve status, stack-/combinatieregels, minimaal kwalificerend bedrag, maximum voordeel, maximaal gebruik totaal/per-klant/per-account, geautoriseerde klantgroep, eerste bestelling alleen wanneer werkelijk controleerbaar, klant-/kanaalrestricties en auditlog.
- Validatie **altijd op de server**; frontend enkel invoer en begrijpelijke feedback. Geen geheimen in client JS, geen via de browser aanpasbare finale prijs, race conditions voorkomen met transactionele teller/reservering, idempotente toepassing, geen negatieve totalen, duidelijke geldafronding en herstel bij mislukte betaling.
- Korting op basis van juiste BTW-grondslag en eventuele verzendkosten: contractueel/fiscaal laten valideren. Houd de historische prijs, koopprijs, korting, coupon en refund bij op de exacte ordermomentopname.
- Heldere UI: couponveld subtiel vindbaar, optioneel; geen couponjacht die klanten de checkout uitstuurt; uitleg waarom code niet werkt; wel tonen op orderoverzicht wat bespaard is en waarom; geen 'deal' zonder werkelijk voordeel.
- **Van/voor-korting**: handhaaf waar van toepassing de ACM-norm om te vergelijken met de relevante laagste eigen prijs uit de voorafgaande 30 dagen. Verplicht historische prijsdata; zonder data geen doorgestreepte prijs, geen procentuele nepbesparing. Controleer dienstspecifieke uitzonderingen en productregels juridisch.
- **Promotietypen ter beoordeling, niet als fictief actief**: getrouwheidsvoordeel, buurtcombinatie, onderhoudscontract, winter-/seizoensactie, bundelkorting, sample-tegoed, terugkerende klant, B2B-volume, cadeaukaart, introductieactie met harde actuele voorwaarden, afgehaalde materialen, restpartij alleen bij aantoonbare voorraad. Bevestiging eigenaar vereist voor commerciële condities.
- Geen kortingen die de eigen kostprijs/bodemprijs impliciet schenden zonder expliciet geautoriseerde uitzondering; marges alleen intern en server-side. Leg per promotie effect op marge vast, en voorkom stapelbare coupons die verlies veroorzaken.

**Voorbeeld niet-actieve configuratie (documentatie/testfixture, geen zakelijke belofte):** `WELCOME10` — 10% van toegelaten materiaalregels, maximum €100, niet cumuleerbaar, minimum orderbedrag configureerbaar, inactief totdat eigenaar data/voorwaarden bevestigt. Toon deze voorbeeldcode nooit publiek als werkende actie.

## V7-10. Bestelpagina, winkelmandje, offerte & checkout — twee aparte werelden

**Serviceflow:** kies dienst → projectinformatie → optioneel 3D → prijsstatus → aanvraag → echte ontvangstbevestiging → interne beoordeling → offerte → versiebevestiging en akkoord → uitvoering. Niet doen alsof een vrijblijvende aanvraag meteen een bindende betaalde aankoop is.

**Product-/webshopflow (pas live indien voorraad/levering/retouren/betaling en wettelijke teksten echt geregeld):** catalogus → productdetail → hoeveelheid/verpakking → winkelmandje → factuur-/leveringgegevens → levermethode en kosten → code → volledige prijs incl. juiste BTW → samenvatting → ondubbelzinnige betalingsverplichting → betaalprovider → bevestigde webhook → orderstatus → factuur → retour/herroepings-/serviceproces.

**Checkout-ervaring:** prominent **zonder account doorgaan** waar mogelijk; duidelijk stappenoverzicht; voortgang en 'bewaar later'; staplabels en editlinks; benodigde vs optionele velden expliciet; klant kent alle kosten voor bevestigen; prijsoverzicht sticky op desktop waar nuttig maar mobiel niet verstikkend; passende leverstatus, datum alleen als echt beschikbaar; adres validatie zonder privacyinbreuk; telefoon alleen vragen als doel helder is; couponveld niet dominant; geen opgelegde nieuwsbrief; echte foutafhandeling bij API, korting, adres, bank, betaling en time-out; dubbel klikken leidt nooit tot dubbele bestelling; betaling als voltooid markeren alleen na serverbevestiging.

**Juridisch:** vooraf juiste consumenteninformatie, BTW en bijkomende kosten, toepasselijk herroepingsrecht/uitzonderingen, overeenkomsten op afstand en eventuele bijzonderheden aan huis, expliciet akkoord bij vroeg starten waar nodig, begrijpelijke knoptekst met betalingsverplichting. Vanaf 25 juni 2026 noemt de ACM een wettelijke online ontbindings-/herroepingsfunctie in relevante contexten: laat dit juridisch beoordelen en voor toepasselijke flows implementeren vóór productie. Formele juridische teksten altijd laten controleren, geen schijnbare naleving.

**Checkout-microinteracties:** automatisch opslaan van winkelmandje zonder onnodige persoonsgegevens; geen stateverlies na back-button; miniwagen alleen wanneer zinvol; één duidelijke grote CTA; zichtbaar totaal binnen bereik; aantal aanpassen met invoerveld én +/-; alternatieven als product niet leverbaar; bestand veilig uploaden bij maatwerk; 'aanvraag' mag geen 'besteld'-mail krijgen; order- en transactiestatus met referentie, nooit zelf gefabriceerde bevestiging.

**Niet operationeel zonder externe toestemming/account:** betaling, voorraadreservering, fiscale orderverwerking en e-mail, retourafhandeling en definitieve commerciële voorwaarden. Bouw ze compleet voorbereid, zet provider-/config flags op uit en toon klantvriendelijke alternatieven waar toegestaan.

## V7-11. Conversie en psychologische excellentie: 40 uitvoerbare mechanismen

Gebruik elk mechanisme alleen wanneer het de beslissing eerlijk beter maakt. Voor elk mechanisme: bijbehorende journey, proof requirement, KPI, mogelijke negatieve effecten, test.

### A. Vertrouwen en eerste indruk
1. Fotografisch bewijs boven de vouw uit echte SEAL-klussen.
2. Direct zichtbaar werkgebied, zodat bezoeker niet hoeft te twijfelen.
3. Bereikbaarheid en verwachte contactroute duidelijk, geen onhaalbare beloftes.
4. Echte vakmensen en uitvoeringsproces, geen stockteam.
5. Geverifieerde reviews en herkomst, niet manipuleren of selectief fictief publiceren.
6. Casegegevens: situatie, aanpak, resultaat en authentieke foto's.
7. Duidelijke wat-wel/niet-inbegrepen informatie.
8. Concrete uitleg over onzekerheid, risico en onverwachte kosten.

### B. Keuze en begrip
9. Persoonlijke doelselectie ('privacy', 'onderhoudsvriendelijk', 'renovatie').
10. Snelle route zonder 3D en gevorderde route mét editor.
11. Progressive disclosure van technisch ingewikkelde velden.
12. Jargon in begrijpelijk Nederlands met contextuitleg.
13. Snel filteren op materiaal, formaat, onderhoud, stijl en kostenbasis.
14. Vergelijk maximaal drie hoofdopties per scherm, verdere keuzen uitklapbaar.
15. Alternatieven met uitleg waarom ze mogelijk beter passen.
16. 'Weet ik niet' als respectabele optie, niet afstraffen met error.

### C. Verlangen en verbeelding
17. Resultaatgericht schrijven (privacy/rust/gebruiksruimte), niet alleen werkzaamheden.
18. Kwalitatieve 3D-scène met begrijpelijke materiaalweergave.
19. Eerlijke kosten- en onderhoudsvergelijking over langere termijn.
20. Inspiratiebord en opgeslagen ontwerpen om samen te bespreken.
21. Relevante aanvullingen: bijvoorbeeld afvoer/ondergrond/poort bij schutting.
22. Niet-dwingende stijlkiezer (modern/natuurlijk/tijdloos) met echt beeld.
23. Locatie/passendheid alleen waar bron werkelijk geverifieerd.
24. Persoonlijke offertesamenvatting met het eigen tuinontwerp.

### D. Zekerheid in de transactie
25. Vroegtijdige totaalprijsstatus incl. onbekende onderdelen.
26. Geen onverwachte kosten op het laatst.
27. Begrijpelijke offertestadia en reactieverwachting.
28. Echt visueel verschil tussen 'prijsindicatie' en 'bindende opdracht'.
29. Duidelijke voorwaarden, garantie alleen met echt beleid.
30. Eenvoudig bestanden en ontwerpgegevens aanleveren.
31. Geen verplichte accountaanmaak voor een simpele aanvraag.
32. Bevestiging met referentie alleen na serveracceptatie.

### E. Relatie, herhaalbezoek en vertrouwen na aankoop
33. Projectportaal met tijdlijn, planning en verantwoordelijke acties.
34. Transparante controle en toestemming bij meerwerk.
35. Opleverchecklist en productspecifieke nazorg waar data bestaat.
36. Passende seizoensadviezen opt-in, geen ongevraagde marketing.
37. Eenvoudige klacht- en servicemelding.
38. Burenproject samenstellen met daadwerkelijke gedeelde kostenefficiëntie.
39. Vriendelijk terughalen van opgeslagen ontwerpen, zonder manipulatieve push.
40. Echte aanbevelingen van tevreden klanten alleen vrijwillig en geverifieerd.

## V7-12. 60 microdetails die het verschil maken

**Visueel en navigatie:**
01 voorspelbare button states; 02 focus altijd zichtbaar; 03 terugknop behoudt data; 04 tekst en getal netjes uitgelijnd; 05 consistente Nederlandse datum-/valutaformattering; 06 klikzones niet alleen op kleine iconen; 07 label/tooltip die uitleg geeft vóór de keuze; 08 projectfotografie met intelligente focal points; 09 leesbare chips en tags; 10 beelden met breedte/hoogte om layoutverschuiving te voorkomen.

**Zoek/filter/categorie:**
11 zoekresultaten bij synoniemen; 12 tikfouten tolerant; 13 actieve filters zichtbaar; 14 filter reset; 15 geen-resultaten met alternatief; 16 sorteren met uitleg; 17 merken/leveranciers niet suggereren die niet zijn aangesloten; 18 bron en datum bij prijzen; 19 productverschillen in gewone taal; 20 vergelijkingsweergave op mobiel zonder onbereikbare kolommen.

**Projectontwerp:**
21 undo/redo op mobiel; 22 annotaties en maatlabels schaalbaar; 23 bereikbare numeric editor als drag niet lukt; 24 tekenvenster blijft scherp na rotatie; 25 omrekenen m²/m/element per juiste eenheid; 26 ongeldige contour geeft visuele uitleg; 27 kopiëren van een vlak behoudt materiaalinformatie; 28 bescherming tegen per ongeluk verwijderen; 29 varianten consistent en synchroniseerbaar; 30 export bevat verwerkingsstatus en aannames.

**Formulieren en service:**
31 juiste toetsenbordtype; 32 auto-fill waar veilig; 33 veldfout direct bij veld; 34 eerdere velden bewaard bij teruggaan; 35 datum geen fictieve beschikbaarheid; 36 fotoformaat/limiet duidelijk; 37 success state niet te vroeg; 38 'ik weet het niet' waar zinvol; 39 contactvoorkeur; 40 WhatsApp-bericht met korte, niet-privacygevoelige context.

**Commerce en korting:**
41 promotiecode foutmelding vriendelijk; 42 uitgeputte code toont echt reden; 43 minimumwaarde eerlijk; 44 couponverwijdering herstelt totaal; 45 BTW na korting correct; 46 gebruikershoeveelheid begrensd; 47 nooit dubbele betaling door dubbele taps; 48 onbekende verzendkosten niet als €0; 49 uitstap uit checkout houdt mandje intact; 50 herroeping/retourregels bereikbaar.

**Beveiliging en toegankelijkheid:**
51 privacyvriendelijke meetopties; 52 server autoriseert prijs en order; 53 geen klant-PII in deellinks; 54 klant ziet nooit inkoop/marges; 55 sessieverloop begrijpelijk; 56 back-ups en herstel bewezen; 57 `prefers-reduced-motion`; 58 foutstatus schermlezer-aankondiging; 59 snelheid op zwakke telefoons; 60 duidelijke help/contactroute als iets faalt.

## V7-13. Content, SEO, communicatie en informatie-architectuur

Schrijf met vakinhoudelijke precisie en een warme, professionele Nederlandse toon. Vermijd generiek marketingjargon ('wij zijn de allerbeste') en niet-onderbouwde 'vanaf'-prijzen. Eén duidelijk onderwerp per pagina. Goede titels, meta, canonical, structured data alleen met echte feiten, interne links, echte plaatsnamen binnen het werkgebied, afbeeldingsalt en nuttige FAQ. Vermijd massaproductie van nagenoeg identieke lokale pagina's. Zoekintenties: onderhouden vs laten aanleggen, schutting vervangen/plaatsen, tuintegels kiezen, kosten bestrating, tuin opmeten, offertes begrijpen, alleen montage, afval/afvoer, onderhoudskalender en voorbereiding. SEO-prestatie meten met werkelijke Search Console-data wanneer gekoppeld; geen rankings garanderen.

**Copy-systeem per CTA:** werkwoord + uitkomst + verwachting ('Bekijk mijn ontwerp', 'Vergelijk materialen', 'Vraag vrijblijvend een offerte aan', 'Bekijk wat is inbegrepen'); labels moeten overeenkomen met werkelijk gedrag. Microcopy bij gevoelige keuzes: 'Dit is een indicatie, geen definitieve offerte'; 'Foto's worden pas toegevoegd bij succesvolle verzending'; 'U kunt uw ontwerp zonder account bewaren'; 'Afspraak volgt na bevestiging door ons team'.

**Huidige contactgegevens** uit `js/config.js`, KvK en BTW eerst met opdrachtgever controleren; huidige voorkeur `info@sealcleaning.nl` is nog niet als werkende mailbox geverifieerd. Bestaande telefoonlijn niet ongevraagd verwisselen met WhatsApp. Geen persoonsgegevens tonen in schema-markup als niet bevestigd.

## V7-14. Bedrijfsvoering en verantwoordelijkheden

**De klantketen:** aanvraag → klant/project → calculatie → offerteversie → overleg/akkoord → inkoop → uitvoering → werkbon → oplevering → factuur → ontvangst → nazorg. Bestaande backend hergebruiken.

**Rollen en scheiding:** eigenaar/admin, medewerker, externe vakman waar expliciet geautoriseerd, zakelijke opdrachtgever, particulier; autorisatie per object server-side; geen interne kostprijzen of leveranciersmarges voor klanten; geen publieke onbeveiligde `/beheer/`-data, ook niet via HTML-bron, browseropslag of exports. Mogelijke B2B-functies: meerdere locaties, PO-nummer, deelofferte, fasering, werkuren, opleverrapport, speciale BTW-behandeling alleen na zakelijke/juridische bevestiging.

**Leverscope:** niet automatisch beloven dat elk getoond product direct verkocht, geleverd of geplaatst kan worden. Gebruik feature flags `catalog_enabled`, `quotes_enabled`, `checkout_enabled`, `coupon_enabled`, `payments_enabled`, `appointments_enabled` (conceptnamen — aansluiten op bestaande config), en test per combinatie. Feature flags zijn geen beveiligingsgrens; server controleert bevoegdheid en zakelijke regels.

## V7-15. Meten, echte gebruikers, hypotheses, iteraties

**Doel-KPI's** en wat zij betekenen: bezoekers naar relevante service-route; kwalificerende aanvraagratio; start/afronding snelle intake; 3D-start versus succesvolle aanvragen; ontwerp-opslag/hervatting; vergelijking gebruikt; offerte bekeken/vragen/akkoord; checkout start/afbreken/vervolmaken bij actieve webshop; klanttevredenheid na oplevering; Core Web Vitals; toegankelijkheidsproblemen; fouten en uitval. Verzamel minimaal benodigde, geaggregeerde/consent-conforme data. Definieer geen 'hoge conversie' zonder baseline en de juiste noemer.

**Onderzoeksrondes:** scenario-gebaseerde usability tests met mensen die de doelgroep vertegenwoordigen, ook minstens enkele onervaren bezoekers en mobiele gebruikers. Vooraf concrete taken: 'vind prijs voor schutting met poort', 'kies 60x60 tegel én alternatief', 'maak ontwerp later af', 'wat gebeurt er na aanvraag?', 'pas kortingscode toe', 'herroep een koop waar wettelijk van toepassing'. Observeer misverstanden, tijd, fouten, onzekerheid en belemmeringen. Kleine tests vinden frictie maar bewijzen geen brede conversieverbetering; noem dat eerlijk. Bewaar bevindingen en herhaal na verbeteringen.

**Experimenteer gecontroleerd:** bij voldoende bezoekers eventueel A/B-testen van koppen, CTA-volgorde, materiaalpresentatie en lengte van intake; geen misleidende claims over statistische significantie. Hypothese + primaire metric + guardrail + minimumduur/volume + besluit. Marketingclaims uitsluitend bij gemeten feiten.

## V7-16. Veiligheid, privacy, rechtszekerheid en performance-gates

- **Vóór publicatie:** controleer algemene voorwaarden, privacyverklaring, offerte-/akkoordprocedure, consumentenwetgeving, herroepingsknop waar van toepassing, btw, factuurvereisten, kortingsregels, bedrijfscijfers, beeldrechten, cookies/analytics, bewaartermijnen en verwerkersovereenkomsten.
- **Beveiliging:** geen client-side final-price trust; validatie server-side; CSRF, CORS/Origin, rate limits, uploadinspectie, auth/2FA, sessiebeleid, logredactie, autorisatie op ieder object, back-up/herstel, voor productie alleen HTTPS. Coupons en prijsmomentopname atomair opslaan.
- **WCAG:** streef aantoonbaar naar WCAG 2.2 AA over alle kritieke pagina's en flows; voor maatwerk mobiele controls als kwaliteitskeuze 44px waar mogelijk; automatische audit alleen is geen formele toegankelijkheidsaudit. Test toetsenbord, schermlezer, kleurcontrast, reduced motion, zoom 200%, foutassistentie en focus na dialogs.
- **Core Web Vitals:** meet p75 waar real-user data bestaat; synthetische labtests als aanvullend, geen vervanging. LCP 2,5s / INP 200ms / CLS 0,1 zijn aanbevolen 'goed'-drempels; trage 3D mag homepage niet vertragen.
- **Productiefouten met P0:** klant kan ongeautoriseerde data zien, prijs/discount fout door client trust, dubbele betaling, echte aanvraag vals bevestigd, productie onveilig, wettelijke vereisten geblokkeerd, data verdwijnt. Geen merge totdat P0 is opgelost.
- **P1:** kapotte belangrijkste route, mobiel onbruikbaar, ontoegankelijke belangrijke control, foutieve materiaalhoeveelheid/offerte; fix vóór publicatie van betreffende functie.
- **P2:** belangrijke polish, niet-kritieke copy/layout. Prioriteit bepalen via impact/effort/risico.

## V7-17. Uitvoeringsplan: geen eenmalig snelle make-over, maar kwaliteitscycli

### Fase 0 — Behoud en waarheid

Controleer Git-status/branch, PR #3, teststaten en v6.0-dossier. Maak de 160-eisenindex volledig; onderscheid code aanwezig vs gekoppelde test vs live. Geen herbouw van bestaande configurator, geen destructieve merges. Maak daarnaast een **v7.0 experience-register** met nieuwe eisen (UX001 e.v.) en concrete acceptatietests.

### Fase 1 — Onafhankelijke designaudit

Maak echte browser-screenshots van huidige ontwikkelversie, niet de ongewijzigde live `main`. Audit ten minste homepage, menu, projectcase, schutting, bestrating, catalogus, prijspagina, configurator 2D/3D, aanvraag, offerte en klantenportaal; desktop + mobiel. Benchmark echte concurrenten en best practices, met bronnen. Benoem harde zwakke punten en volgorde van impact.

### Fase 2 — Ontwerpalternatieven

Ontwikkel 3 samenhangende designrichtingen, minimaal 5 kernschermen per richting. Beoordeel niet alleen 'mooi' maar klantbehoeften, laadsnelheid, authenticiteit, differentiatie, vertrouwen en bruikbaarheid. Kies/bevestig één sterke richting of verbeter de bestaande. Toon concrete 'voor/na'-screenshots van eigen site; niet alleen woorden.

### Fase 3 — Designsystem en premium pagina's

Implementeer tokens, componenten, mobile header, fotografie, templates, microcopy, hero, services, projectcases en navigatie. Test iedere ingreep; behoud SEO-links en bestaande bruikbare stijl.

### Fase 4 — Productervaring, configurator en materialen

Verbeter keuzes, editor, productcatalogus, filters, vergelijkingen, scenariopresentatie en volledig heldere onzekerheid/prijs. Bouw ontbrekende zelfstandige eisen en laat onbevestigde leveranciersdata leeg; niet 'leverbaar' simuleren.

### Fase 5 — Commerce flows en kortingsmotor

Bouw cart/checkout/coupon/actie-adapters en tests, desnoods achter uitgeschakelde feature flags totdat zakelijke en externe voorwaarden bekend zijn. Betalen, levering, e-mail en orderbevestiging pas live bij echte provider en geteste webhook. Integreer bestaande backend; geen tweede los platform.

### Fase 6 — Mobile polish en echte tests

Doe alle journeys op 320/360/390/430/768/1024/1440 px; browser-toetsenbord- en touchflows; visuele beoordeling naast geautomatiseerde crawl. Repareer kleine kwaliteitsfouten met prioriteit voor mobiel, checkout en aanvraag. Test 3D fallback en langzame verbinding.

### Fase 7 — Security, recht, performance, SEO, release

End-to-end regresstests, onafhankelijk review, wettelijke blokkades, volledige stagingdeploy incl. Docker-test, rollbackplan, gecontroleerde merge pas na toestemming. E-mail/hosting/Mollie kunnen los na deze kwaliteitsrondes worden geactiveerd.

**Doorgaan zonder onnodig te vragen:** werk autonoom aan onafhankelijke taken en commit/push na afgeronde geteste increments. Stop niet omdat een fase afgerond is zolang uitvoerbaar werk resteert; maar noem niet ongeteste zaken klaar. Bij echte tijd-/tool-/budgetgrens compact checkpoint en exact vervolgstap vastleggen. Geen onbeperkte achtergrondwerkclaims.

## V7-18. Acceptatiecriteria: ontwerp, commerce en volledigheid

Een 'afgeronde kwaliteitsronde' betekent minimaal het volgende:

**Visuele kwaliteit:**
- [ ] Hoogwaardige consistente huisstijl op 12+ essentiële schermtypen, met echte beelden.
- [ ] Designkeuze met aantoonbare vergelijking van drie richtingen óf gedocumenteerd waarom de bestaande variant op alle relevante assen beter is.
- [ ] Mobiele en desktopscreenshots per belangrijke klantreis, inclusief fouten en lege toestanden.
- [ ] Consistente componentbibliotheek, kleurcontrast, typografie, beeldsnede, statefeedback en iconen.
- [ ] Geen ongedocumenteerde inconsistenties, rommelige schermen of nutteloze motion.

**Functionele waarde:**
- [ ] Alle A01–P10 exact één keer in register; alle nieuwe v7-eisen in eigen aanvullende index.
- [ ] Snel aanvragen én diep ontwerpen zijn beide werkend, zonder dat gegevens verdwijnen.
- [ ] 2D/3D, hoeveelheden, materialen, varianten, export en calculatie consistent.
- [ ] Materialenbrowser is uitbreidbaar naar veel producten, ook als echte SKU-data nog ontbreken.
- [ ] Onbekende leveringen, prijzen, garanties en beschikbaarheid nooit als bevestigd gepresenteerd.
- [ ] Offerteproces, versies en klantgegevens getest zonder lek van interne marge.

**Bestel- en promotiekwaliteit:**
- [ ] Service-aanvraag, offerte-akkoord en materiaalbestelling zijn semantisch en technisch verschillend.
- [ ] Cart/coupon/checkout bieden juiste loading/error/empty/pending/success state; tests met goede, verlopen, gestapelde, verkeerd gescope, uitgeputte en race-condition-codes.
- [ ] Korting, inclusief ACM-referentieprijs en toepasselijk BTW-beleid, juridisch en technisch getest vóór activering.
- [ ] Zonder provider is geen nepbestelling of schijnbetaling mogelijk.
- [ ] Bestelpagina werkt zonder verplichte login waar mogelijk; in mobiele checkout blijven prijzen/CTA zichtbaar.

**Kwaliteit/gates:**
- [ ] Geen bekende P0/P1-bugs in de vrij te geven scope.
- [ ] WCAG 2.2 AA kernpunten getoetst; 44px mobiele controls nagestreefd; keyboard/zoom en reduced motion gecontroleerd.
- [ ] Realistische netwerk-/CPU-condities en 3D fallback getest.
- [ ] Pagina's op juiste branch getest; geen claim 'live' zonder check op productie-url.
- [ ] Juridische en externe blokkades helder; PR review en akkoord vóór merge.
- [ ] Bewijs: testlogs, screenshotlocaties, requirement IDs, meetdata, datum en commit SHA.

## V7-19. Verplichte opleverdocumenten en opdrachtgevervriendelijke rapportage

Werk bijgehouden bestanden bij (geen overlappende conflicterende projectbriefs):
- `docs/SEAL_MASTER_BRIEF.md`: één canonieke master, v7.0 boven v6.0.
- `docs/REQUIREMENTS_INDEX.md`: 160 IDs compleet, bewijs/test/deploystatus gescheiden.
- `docs/UX_STRATEGY.md`: doelgroepen, journeys, menselijk vertrouwen, experimenten/hypothesen, prioriteit.
- `docs/DESIGN_SYSTEM.md`: rationale, kleurrollen, fonts, tokens, componenten, beeldregels, alternatieven.
- `docs/COMPETITOR_BENCHMARK.md`: concrete gecontroleerde bronnen, datum, screenshots, kansen, niet verzinnen.
- `docs/COMMERCE_RULES.md`: service vs product, couponregels, tax/van-voor, voorraad, betaling en juridische gates.
- `docs/MOBILE_QA.md`: apparaten, viewport, tests, bevindingen, fixresultaat.
- `docs/IMPLEMENTATION_STATUS.md`: wat gebouwd/getest/deels/extern/wacht/live is met exact herstelpunt.

Rapporteer naar opdrachtgever beknopt per cohort: (1) zichtbaar designverbetering met voor/na-bewijs, (2) functionele verbetering, (3) kwaliteitsmetingen, (4) open blokkades/goedkeuringen, (5) eerstvolgende autonome taak. De volledige technische details staan in repo-documentatie; vraag niet na iedere commit om akkoord.

## V7-20. Exacte opdracht aan Claude Code

> **Claude Code, werk in de bestaande SEAL-repository en ga uit van de nieuwste ontwikkelbranch/PR, niet alleen de oude live homepage. Je opdracht is geen snelle facelift en geen nieuw statisch mock-updesign. Bouw een premium, toegankelijk, opvallend bruikbaar klant- en bedrijfsplatform door een grondige design-, gedrags-, mobile-, conversie-, catalogus- en checkoutaanscherping. Je krijgt dit volledige v7.0-dossier met daaronder de volledige v6.0-specificatie.**
>
> **Kijk eerst naar de huidige code en test echt. Corrigeer de incomplete eisenindex van 138 naar alle 160 IDs. Onderzoek relevante Nederlandse concurrenten en sterke retail/architectuurvoorbeelden met gedocumenteerde bronnen. Ontwerp drie serieuze kwaliteitsvarianten op basis van onze authentieke beelden en eigen merk. Kies het best onderbouwde ontwerp en implementeer het. Breid vervolgens ontbrekende nuttige opties uit: dienstkeuze, mobiele bedienbaarheid, product-/materiaaldetails, filters, vergelijkingen, ontwerpbeleving, bestelstroom, promotie- en kortingscodesysteem (achter veilige feature flags tot volledige zakelijke activatie), offertebeleving, vertrouwen en nazorg.**
>
> **Werk met de hoogst beschikbare denk-/redeneerinspanning voor moeilijke strategische keuzes en een zuinige contextaanpak voor repetitieve implementatiestappen. Laat de prompt nooit vervallen tot alleen een analyse. Voer veranderingen in de code uit, test, inspecteer screenshots en iteratief verbeter. Publiceer niet zonder akkoord. Verzin geen juridische waarheid, kortingshistorie, voorraad, echte beoordelingen of kosten. Externe accounts regelen we later: bouw de veilige voorbereide architectuur en eerlijke fallback.**
>
> **Blijf doorwerken aan uitvoerbare verbeteringen, commit/push geteste mijlpalen en documenteer elke blocker met eigenaar en benodigde input. Oplevering pas wanneer de volledige scope geregistreerd en aantoonbaar onderzocht is, en de niet-geblokkeerde onderdelen professioneel gebouwd en getest zijn.**

## V7-21. Onderzoeks- en regelgevingsreferenties (nieuwste bronpagina's vóór implementatie controleren)

- Baymard: Checkout UX 2025 — https://baymard.com/research-articles/current-state-of-checkout-ux
- Baymard: Mobile E-commerce — https://baymard.com/research/mcommerce-usability
- Nielsen Norman Group: Trust & Credibility — https://www.nngroup.com/reports/ecommerce-ux-trust-and-credibility/
- Nielsen Norman Group: Progressive Disclosure — https://www.nngroup.com/articles/progressive-disclosure/
- ACM: Prijzen vermelden en van/voor-kortingen — https://www.acm.nl/nl/verkoop-aan-consumenten/consumenten-informeren/prijzen-vermelden
- ACM: Leidraad prijsweergave en -vergelijkingen — https://www.acm.nl/nl/publicaties/leidraad-prijsweergave-en-vergelijkingen
- ACM: Bedenktijd / online ontbindingsfunctie — https://www.acm.nl/nl/verkoop-aan-consumenten/klantenservice/bedenktijd
- Business.gov.nl: consumer rights and distance selling — https://business.gov.nl/running-your-business/legal-matters/consumer-law-your-rights-and-obligations-as-a-seller/
- W3C: WCAG 2.2 target size AA — https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- W3C: WCAG 2.2 enhanced target AAA — https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced
- web.dev: Core Web Vitals — https://web.dev/articles/vitals

**Einde v7.0-toevoeging. Hierna volgt het volledige oorspronkelijke masterdossier v6.0 integraal als onderliggende specificatie, niet als tweede actieve opdracht.**

---

# BIJLAGE: VOLLEDIGE SEAL MASTERPROMPT v6.0 — HISTORISCH EN FUNCTIONEEL GEÏNTEGREERD

# SEAL MASTERPROMPT v6.0 — DEFINITIEF OVERDRACHTSDOSSIER VOOR CLAUDE CODE

**Project:** SEAL / Sealcleaning Groenonderhoud en Aanleg — Dordrecht  
**Datum samengestelde overdracht:** 10 oktober 2026  
**Doel:** de bestaande SEAL-hovenierswebsite en het bijbehorende digitale klant-, ontwerp-, calculatie- en projectproces afbouwen, testen en overdraagbaar maken.  
**Documenttype:** één zelfstandig uitvoerbaar masterdossier, inclusief de *volledige oorspronkelijke v5.0* met v4.0, v3.0 en alle 50 v2.0-hoofdstukken.  
**Belangrijk:** een historische status of claim in de naslag is geen bewijs van de huidige productiestand. Inspecteer eerst de actuele repository.

> **CLAUDE CODE — LEES EERST DIT v6.0-STARTBLOK.** Dit is geen verzoek voor een nieuwe planning of demo. Voer de opdracht daadwerkelijk uit in de bestaande repository. Het onderstaande v5.0-dossier is integraal behouden als functionele specificatie en historisch bewijs. Gebruik oudere START- en eindblokken uitsluitend als naslag; start geen tweede onafhankelijke opdracht.

## V6-00 — Voorrangsregels en veiligheidsgrenzen

1. **Volgorde bij tegenstrijdigheid:** (a) nieuwste expliciete beslissing van opdrachtgever, aantoonbaar in huidige opdracht of vastgelegde projectbron; (b) deze v6.0-instructies; (c) v5.0 H00–H09; (d) v4.0; (e) v3.0; (f) v2.0. Oudere historische feiten mogen worden gebruikt als onderzoeksspoor, niet als automatische actuele waarheid.
2. **Behoud scope:** geen onderdelen schrappen omdat het dossier omvangrijk is of een sessie-/tokenlimiet bereikt wordt. Bouw in verifieerbare stappen en leg alle nog open eisen vast.
3. **Behoud werk:** inspecteer eerst onopgeslagen wijzigingen, branches, commits en CI/deployment. Geen destructieve reset, force-push, ongevraagde migratie, verwijdering van gebruikerscode of overschrijven van een nieuwere branch.
4. **Geen schijnfunctionaliteit:** iets is pas 'gebouwd' wanneer het werkt, 'getest' wanneer relevante tests zijn uitgevoerd en 'live' wanneer dit afzonderlijk op productie is geverifieerd. Een mailto/WhatsApp-link is geen bevestigde serverontvangst.
5. **Eerlijkheid:** geen verzonnen prijzen, ervaring, reviews, garantievoorwaarden, KvK-/btw-nummers, materiaalbeschikbaarheid, certificaten, leverancierskortingen, betalingen of software-integraties. Gebruik duidelijk aangeduide indicaties en 'op aanvraag' waar nodig.
6. **Privacy en security:** nooit interne marge, inkoopcondities, privéklantgegevens, offertes, factuurreeksen of geheimen in de openbare GitHub Pages-repository, browserbundel of URL-parameters. Backendfuncties pas activeren na echte, veilige infrastructuur en AVG-controles.
7. **Geen onnodige vragen:** leid beslissingen af uit de vastgelegde eisen en aanwezige code. Vraag alleen om toegang of beleidskeuzes die objectief noodzakelijk zijn; werk intussen door aan onafhankelijke onderdelen.
8. **Kwaliteit:** senior-level architectuur, zakelijke calculatiediscipline, klantvriendelijkheid, toegankelijkheid, performance, responsiviteit, SEO en gedegen tests; zonder grootspraak over het bedrijf.

## V6-01 — Identiteit en contactgegevens: publiceer alleen gecontroleerde waarden

- **Bedrijf:** Sealcleaning Groenonderhoud en Aanleg; klantgerichte merknaam SEAL / SEAL — Tuin en Onderhoud, afstemmen op bestaande huisstijl.
- **Domein:** `https://sealcleaning.nl/`; bestaande GitHub Pages-architectuur en CNAME respecteren. Een DNS-/providerinstelling mag niet zonder verificatie worden aangepast.
- **Werkgebied:** Dordrecht, Drechtsteden en eerder bevestigd gebied rond Rotterdam; exacte plaatsnamen, radius, reistijd en servicebereik per dienst controleren voordat harde beloften online komen.
- **Publieke bellijn:** **078 204 95 17** (`tel:+31782049517`) volgens het laatst gecontroleerde v5.0-repositorybewijs. Niet stilzwijgend vervangen door WhatsApp.
- **WhatsApp:** `+31 6 48 87 19 86` (`wa.me/31648871986`) als afzonderlijke WhatsApp-CTA; volgens eerdere afspraak de cijferreeks niet als zichtbaar contactnummer tonen. Links zijn publiek inspecteerbaar; dit is geen verborgen nummer.
- **E-mail:** `info@sealcleaning.nl` is als gewenste/ingerichte domeinmail besproken; **verifieer mailbox, ontvangst, verzending en formulieren voordat je deze als werkende aanvraagbestemming gebruikt**. De oudere repository gebruikte `sealcleaningaanleg@gmail.com`. Kies publiek kanaal pas na werkende test en expliciete configuratie.
- **KvK, btw, officiële tenaamstelling, adresgegevens, garantiebeleid en voorwaarden:** controleer in de aangeleverde bedrijfsbronnen en relevante registers. Eerder genoemde nummers zijn niet voldoende geverifieerd door dit dossier; neem ze niet automatisch over.
- Scheid de SEAL-groenwebsite van andere ondernemingen en projecten van de opdrachtgever. Hergebruik geen ongerelateerde gegevens of administraties.

## V6-02 — Reproduceerbaar hervatten in GitHub

Primaire repository: `https://github.com/dhrburgaz/beste-website-sealcleaning`  
Historisch onderzochte branch: `claude/sealcleaning-website-overhaul-gvgtfj`  
Historisch onderzochte HEAD: `a139d0b580c47a77a61ecf1b15917e63a0ab64b2`  
Historische controledatum: 9 oktober 2026; **geen actuele statusgarantie**.

**Begin exact met de volgende inspecties, aangepast aan de bestaande omgeving:**

```bash
git status --short --branch
git branch -avv
git log --all --oneline --decorate -20
find . -maxdepth 3 \( -iname 'AGENTS.md' -o -iname 'CLAUDE.md' -o -name 'IMPLEMENTATION_STATUS.md' -o -name 'package.json' \) -print
```

1. Vergelijk lokale en remote branches zonder te veronderstellen dat `main` het laatste werk bevat. Behoud lokale wijzigingen.
2. Lees actuele `CLAUDE.md`/`AGENTS.md`, `docs/IMPLEMENTATION_STATUS.md`, projectconfiguratie en de v5.0 H02–H05 herstelpunten.
3. Controleer of de configurator op `/project-samenstellen/` en bestaande `js/project-state.js`, `js/configurator/geometry.js` en relevante datasets nog bestaan en functioneren. De aanwezigheid daarvan was in v5.0 vastgesteld, maar moet opnieuw worden geverifieerd.
4. Maak een **eis → bestaand bestand → huidig gedrag → ontbrekend gedrag → test → status**-matrix voor de 160 v4-eisen en alle aanvullende v2/v3/v5/v6-verplichtingen. Gebruik stabiele IDs, zodat opvolgende sessies kunnen voortbouwen.
5. Herstel risicovolle fouten met impact op calculatie, vorm/oppervlakte, validatie, gegevensoverdracht en aanvraagintegriteit vóór cosmetische uitbreiding. Hergebruik bestaande modellen.
6. Commit afgeronde, geteste wijzigingen met beschrijvende berichten; bescherm secrets en lokaal werk. Controleer expliciet wat op productie is gedeployed versus uitsluitend op de werkbranch.

## V6-03 — Eindproduct en gebruikersroutes

Bouw een logisch, schaalbaar SEAL-platform met een **rustige premium voorkant** en **veel relevante keuzes wanneer de bezoeker ze nodig heeft**. De 160 v4-functies zijn eisen aan de totale ervaring, niet 160 losse knoppen op de homepage.

### Publieke website

- Overzichtelijke homepage; duidelijke waardepropositie, diensten, aanpak, actuele werkgebieden en prominente aanvragen-/bel-/WhatsApp-routes.
- Uitgebreide individuele dienstenpagina's en praktische keuzehulpen; geen lege SEO-teksten of generieke nepclaims.
- Echte, aantoonbaar eigen SEAL-projectfotografie met juiste categorie, uitsnede, alt-tekst en context; placeholder/gegenereerde afbeeldingen nooit presenteren als werkelijk uitgevoerd project.
- Voor-en-na-cases alleen waar bronfoto's dat rechtvaardigen; review-/keurmerk-/garantiesignalen uitsluitend verifieerbaar.
- Kennisbank, onderhoudskalender, seizoensinformatie en FAQ met nuttige concrete antwoorden.
- Duidelijke routes voor particuliere klanten, aannemers/zakelijke opdrachtgevers, VvE's en vakmannen/samenwerkingspartners, plus aanvragen voor partnerschap of werk.
- Materialen- en prijzenvoorlichting, vergelijkingen, duidelijke scope en beperkingen; privacy-, algemene-voorwaarden- en cookie-/contactinformatie passend bij feitelijke verwerking.

### Diensten en werkzaamheden

Volledige breedte van het v5.0-dossier behouden: periodiek tuinonderhoud, snoeien, hagen, onkruid, gras/gazon, tuinrenovatie, tuin leeghalen, grond-/sloopwerk, grond- en puinafvoer, groenafval, schuttingen, poorten, hekwerk, bestrating, keramische tegels/klinkers/waaltjes/grind/opsluitbanden, borders/beplanting, tuinconstructies waar daadwerkelijk leverbaar, vlonders/pergola's, bomen/wortels/stronken en relevante buitenreiniging. Per dienst onderscheid tussen uitgevoerd, mogelijk na beoordeling en specialistisch/extern. Vermijd onbevoegde of onveilige werkaannames.

### Inzichtelijke commerciële routes

- **Snel aanvragen** zonder eerst te ontwerpen.
- **Uitgebreid project samenstellen** met één of meerdere diensten tegelijk.
- Keuze uit ontwerp/advies, alleen montage, materialen door klant, materiaal + arbeid via SEAL, complete uitvoering en periodieke nazorg waar passend.
- Behouden, herstellen, verwijderen/vervangen en nieuw aanleggen als expliciete keuzes met gevolgen voor hoeveelheden, arbeid, afval en prijs.
- Duidelijk onderscheid tussen indicatie, offerteaanvraag, bindend akkoord, bestelling en betaling.

## V6-04 — 2D/3D-projectconfigurator: één gedeelde waarheid

- Gebruik **één gedeelde projectstate, geometrie-/rekenkern en productcatalogus** voor 2D, 3D, hoeveelheden, regels, offertes en export. Geen dubbele schaduwberekeningen.
- Ondersteun vrije/meerdere tuincontouren waar technisch verantwoord, afmetingen, oriëntatie, schaal, obstakels, bestaande objecten, behouden/verwijderen, materiaalzones, schuttingdelen en poorten.
- Ondersteun realistische schuttingsystemen, planken, palen, hoogte, hoek-/eindposities, poorten en montagecondities; geen ongecontroleerd afronden of materiaalverlies.
- Ondersteun bestratingsvlakken, patroon, maat, snijverlies, opsluitbanden, ondergrond, ophoging, afwatering, afvoer en werkruimte; noodzakelijke expertbeoordeling expliciet aangeven.
- 2D (editabel) en 3D (navigeerbaar, begrijpelijk, performant) moeten hetzelfde ontwerp tonen; bied herstelbare invoer, undo/redo waar voorzien, validaties, waarschuwingen, varianten en een mobiel bruikbare fallback.
- Laat klant ontwerpen bewaren/vergelijkingen bekijken en delen/exporteren wanneer de infrastructuur dat veilig kan. Zorg dat prijsraming en export nooit stilzwijgend uiteenlopen.
- PDF-/afbeeldings-/projectexports moeten SEAL-branding, versiedatum, materiaalkeuzes, relevante maten en indicatie-/aansprakelijkheidsbeperkingen tonen; ontbrekende berekeningen niet als exacte getallen invullen.
- Test o.a. niet-rechthoekige contouren, overlap, grensgevallen, afronding, negatieve/nul-waarden, grote projecten, mobiele interacties en overstap naar aanvraag.

## V6-05 — Materialen, marktvergelijking en interne prijsmotor

**Vastgestelde verkoopbasis:** € 60,00 per medewerker per uur **exclusief btw**; bij btw-percentage 21% is dit € 72,60 inclusief btw. Dit is een verkoopuurtarief, **geen** loonkostprijs. Btw-regels altijd per toepasselijke dienst/product, rechtspositie en transactiedatum controleren.

Maak een goed onderscheid tussen:

1. Materiaalinkoop en leveranciersinformatie (intern, privé).
2. Eenheden, verpakkingen, snij-/uitvalpercentage, transport en afleverregels.
3. Arbeidsnormen/ploeggrootte/uren en projectcomplexiteit, niet uitsluitend vierkante meters.
4. Machinehuur, ondergrond, afvoer, stortkosten, parkeerkosten, bereikbaarheid, reis en overige projectkosten.
5. Eigen overhead, risico, winst- en materiaalopslag/marge (alleen intern; configureerbaar en niet verzinnen).
6. Aan klanten getoonde marktconforme verkoopprijzen en wat **wel/niet inbegrepen** is.
7. Btw- en totalenberekening met consistente geldafronding.
8. Onbekende tariefcomponenten met status `op aanvraag` of `handmatig beoordelen` — nooit willekeurig € 0.

**Bronbeleid:** prijzen zijn pas actueel nadat aanbieder, product/kwaliteit, eenheid, verpakking, levergebied, prijsdatum, btw-status en aanvullende kosten zijn gecontroleerd. Houd bronverwijzingen en vervaldatum vast. Benchmark representatief met meerdere relevante Nederlandse aanbieders, leveranciers en marktvoorbeelden waar nuttig. Kopieer concurrentprijzen niet als eigen verkoopbeleid. Maak geen automatische webscraping die voorwaarden schendt; bewaar intern bronregels en valideer bij toepassing.

**CEO-/calculatie-assistent (intern):** bereken realistische kosten, check ontbrekende posten, vergelijk scenario's, licht marge en risico toe, markeer prijsuitschieters en geef een concreet voorstel dat een medewerker kan goedkeuren. Laat deze assistent geen definitieve offerte verzenden of korting/marges publiceren zonder menselijke autorisatie. Geen ongecontroleerde AI-berekeningen als financieel bindende waarheid.

## V6-06 — Aanvragen, CRM, offerte, uitvoering en betalingen

Ontwikkel als samenhangende architectuur, en activeer alleen de onderdelen die door beschikbare infrastructuur ondersteund worden:

1. Intake, contacttoestemming en optionele foto's/bestanden; duidelijke privacydoeleinden en uploadrestricties.
2. Projectdossier inclusief gekozen materialen, maatvoering, situatiefoto's, prijsstatus en eventuele configuratorversies.
3. SEAL-intern behandelen, aanvullingen vragen, versies vergelijken en offertes opstellen.
4. Offerte inclusief werkzaamheden, uitsluitingen, hoeveelheden, btw, geldigheid, planning onder voorbehoud en akkoordproces.
5. Opdracht, wijzigingen/meerwerk, werkbon, uitvoering, oplevering, nazorg, factuur en betalingsstatus volgens eigenlijke processen.
6. Rollen en toegangscontrole voor medewerkers, klantportaal of aannemersomgeving waar veilig ondersteund.
7. Materiaalverkoop/order/checkout alleen met correcte productinformatie, levervoorwaarden, rechten, betaalprovider, retour-/herroepingsregels en operationele afhandeling.

**GitHub Pages is statisch.** Zonder een echte, beveiligde en geteste backend: géén schijn-upload, schijninlog, schijnbetalingen, schijnorderbevestiging of status 'aanvraag ontvangen'. Bouw waar mogelijk het frontend-contract, veilige adapters en een eerlijk werkend alternatief; documenteer exact de externe blokkade.

## V6-07 — Design, vindbaarheid en kwaliteit

- Behoud de premium richting: bosgroen, zand/steen, eventueel Fraunces en Inter, kwalitatief goede beeldverhoudingen, rustige typografie, compacte informatieve hero, heldere kaarten en contextuele opties.
- Responsive mobile-first; consistente navigatie, focusindicatoren, toetsenbordbediening, leesbare contrasten, semantische HTML en waar passend WCAG 2.2 AA als toetsnorm.
- Goede Core Web Vitals nastreven met aantoonbare metingen; lazily loaded fotografie, passende afmetingen en waar nodig beperkte/uitgestelde 3D-downloads.
- Werkende URL's/deeplinks, refreshen van statische routes, canonical, sitemap, robots, structured data zonder nepclaims, lokale SEO en begrijpelijke meta-teksten.
- Analytics alleen volgens feitelijke cookie-/toestemmingsarchitectuur en toepasselijke regels; leg leadconversies vast zonder privacy te schenden.
- Controleer productie op domein, HTTPS, DNS, CNAME, telefoonlinks, aanvragen, mobiele weergave en terugrolmogelijkheid. Geen wijzigingen aan DNS/mail/hosting zonder noodzaak en juiste toegang.

## V6-08 — Statusregister, testen en oplevering

Gebruik consequent deze zeven **hoofdstatussen** voor eisen, functionaliteiten, afhankelijkheden en beslissingen:

- `definitief besloten` — eis of beleidskeuze is vastgesteld; hoeft nog niet gebouwd te zijn.
- `gebouwd` — wijziging aantoonbaar geïmplementeerd; mogelijk nog niet getest.
- `getest` — specifieke acceptatie en regressies met resultaat bewezen; live-status blijft afzonderlijk.
- `nog te bouwen` — voorzien, nog niet daadwerkelijk aanwezig of niet volledig werkend.
- `extern geblokkeerd` — toegang, leverancier, DNS, betalingsprovider, backend of andere externe afhankelijkheid vereist.
- `wacht op goedkeuring` — wezenlijke zakelijke/juridische keuze door opdrachtgever nodig.
- `historisch/verouderd` — expliciet achterhaald door nieuwere beslissing; blijft als bron bewaard.

Eén eis kan zowel `definitief besloten` als een ontwikkelvoortgang hebben. Leg daarom bij voorkeur apart vast: `decisionStatus`, `implementationStatus`, `testEvidence`, `deployStatus`, `owner`, `updatedAt` en `nextAction`. Noem 'live' nooit synoniem aan 'gebouwd'.

**Acceptatie per klantreis:** een bezoeker kan een dienst vinden, de keuze begrijpen, optioneel ontwerpen/varianten vergelijken, een prijsstatus zien, een passende aanvraag starten, en krijgt uitsluitend een ontvangstbevestiging wanneer technisch daadwerkelijk bevestigd. Een medewerker kan voor zover de infrastructuur aanwezig is een volledige aanvraag veilig ontvangen en opvolgen. Als een extern systeem ontbreekt, is dat duidelijk en eerlijk gedocumenteerd.

**Opleverartefacten:**

- Werkende, niet-regressieve website in de bestaande repository, met aantoonbare wijzigingen.
- 160 v4-eisen + aanvullende criteria in een traceerbaar requirements-/testrapport.
- Uitgevoerde tests (inclusief randgevallen, viewport/mobiel, formulieren, prijzen en 2D/3D-synchronisatie), screenshots van echte lokale/browserweergaven en bekende beperkingen.
- `docs/IMPLEMENTATION_STATUS.md` met actuele status, branch/HEAD, gewijzigde bestanden, evidence, tests, blockers en eerstvolgende taak.
- Eén beknopte `BLOCKERS`-lijst met exact benodigde beslissing/toegang en eigenaar. Geen lange verzameling reeds beantwoorde vragen.
- Productie-/deploychecklist apart van code-completion, met eventuele risico's of rollback.

## V6-09 — Tokenbesparingsmodus zonder scopeverlies

Het volledige dossier is de **source of truth op schijf**, niet iets dat elke chat of elke tooluitvoer volledig opnieuw moet afdrukken. Minimaliseer tokens **zonder** functionaliteit, veiligheid, tests of kwaliteit te schrappen.

- Laad bij herstart V6-00–V6-09 + het actuele `IMPLEMENTATION_STATUS.md`; zoek vervolgens relevante delen van de naslag met `rg -n` en lees alleen die secties.
- Herhaal geen eerder afgerond marktonderzoek of samenvattingen zonder concrete actualiteitsreden.
- Hou wijzigingen klein en testbaar; automatiseer mechanische controles en hergebruik functionerende componenten.
- Na elk relevant checkpoint: **branch + HEAD, open wijzigingen, eisen-ID's, geslaagde/mislukte tests, externe blokkades, volgende taak en exacte volgende commando**.
- Bij onderbreking hervatten vanaf Git + statusbestand; geen volledige nieuwe briefing en geen opnieuw bouwen van bestaande configurator.
- Respecteer limieten van de gebruikte diensten. Geen claims over gegarandeerde resterende tokens, onbeperkte voortgang of asynchroon werk.

**Checkpointsjabloon:**

```text
specVersion: 6.0
branch / head:
localChanges:
decisionStatus / completedRequirementIds:
implementationStatus + file refs:
testsRun + results + date:
notRetested:
knownFailures:
deployStatus:
externalBlockers + required config keys:
awaitingApproval:
nextTask:
nextCommand:
```

## V6-10 — Concrete opdracht om onmiddellijk uit te voeren

**Claude Code: voer eerst repositoryinspectie en herstel uit volgens V6-02 en v5.0 H04; ga daarna door met de volledige eisenmatrix en bouw in volgorde van klantimpact en afhankelijkheden.** Lever niet uitsluitend een plan of samenvatting. Schrijf aan bestaande code, controleer je veranderingen en rapporteer alleen wat aantoonbaar gedaan is. Als een belangrijke bron of de repository niet toegankelijk is, meld precies die blokkade en rond alle onafhankelijke werkonderdelen af. Vraag niet telkens toestemming na een interne bouwstap.

### Leeswijzer

- **Hervatten, bewijs, bestaande reparaties:** v5 H00–H05.
- **Volledige website en 160 functies:** v4 hoofdstuk 2 en de 160-ID-functietabel.
- **Calculatie en inkoop:** v4/v3-prijsregels en v2 hoofdstukken 19–21, 38–40.
- **2D/3D:** v2 hoofdstukken 13–18, inclusief testmatrix hoofdstuk 28.
- **Aanvragen, privacy en operatie:** v2 hoofdstukken 22–23, 40–42 en 46–47, plus de v4-aanvullingen.
- **Onderzoek/design/SEO:** v5 H01, v4 hoofdstukken 1, 3 en relevante v2-hoofdstukken.
- **Historie:** v5 H09 bevat ook de oorspronkelijke regelnummers; door deze v6-inleiding zijn die oude nummers verschoven. Navigeer daarom op de hoofdstukkoppen (`rg -n`) in plaats van op oude absolute regelnummers.

---

# BIJLAGE A — INTEGRAAL OORSPRONKELIJK MASTERDOSSIER v5.0

**Bronversie integraal opgenomen voor volledige eisendekking.** De onderstaande historische start-, prioriteits- en eindinstructies vormen geen nieuwe zelfstandige opdracht en gelden alleen volgens de voorrangsregels in V6-00. De volledige tekst is behouden, inclusief de v4/v3/v2-naslag, zodat geen vereiste door samenvatten verdwijnt.

# SEAL MASTERPROMPT v5.0 — volledige opdracht én hervatting van de bestaande bouw

**Opdrachtgever:** Sealcleaning Groenonderhoud en Aanleg, Dordrecht.  
**Doel:** de bestaande hovenierswebsite afbouwen tot een overtuigend, overzichtelijk klant- en projectplatform, met echte fotografie, echte 2D/3D, bruikbare keuzehulp, controleerbare prijzen en nette zakelijke uitvoering.  
**Samengebracht op:** 9 oktober 2026. **Repository onderzocht op:** 9 oktober 2026.  
**Versiebeleid:** de nieuwe instructies H00–H09 gaan voor bij conflict. Daarna gelden de v4.0-eisen, vervolgens v3.0, vervolgens de volledige v2.0. Oude versiekoppen en eindinstructies verderop zijn historische naslag; begin daardoor geen nieuwe opdracht. Nieuwere, expliciete instructies van de opdrachtgever blijven leidend.

Dit is één zelfstandige opdracht. De uitvoerder hoeft geen oude chats, eerdere losse prompts of ontbrekende geheugeninformatie te hebben. De oude uitvoeringsdossiers v1.0 en v1.1 zijn inhoudelijk vergeleken; de relevante afspraken en gewijzigde scope staan hieronder. Het complete v4.0-bestand, inclusief v3.0 en alle 50 v2.0-hoofdstukken, is verderop ongewijzigd behouden. Dubbele versies van hetzelfde v1.1-dossier worden niet nogmaals in de context geladen.

## H00 START — lees dit eerst en voer vervolgens uit

Je werkt aan **een bestaand, onderbroken SEAL-project**. Ga verder met de aanwezige code en maak de volledige opdracht af. Lever niet alleen een analyse, ontwerpplaatje, nieuwe planning of fase 1. Vraag niet na iedere bouwstap om een vervolgprompt.

1. Inspecteer eerst de huidige checkout, branch, onopgeslagen wijzigingen, instructiebestanden en voortgang. De primaire repository is `dhrburgaz/beste-website-sealcleaning`. De op 9 oktober aangetroffen nieuwste bouwbranch is `claude/sealcleaning-website-overhaul-gvgtfj`, met HEAD `a139d0b580c47a77a61ecf1b15917e63a0ab64b2`. Deze informatie is een gecontroleerd vertrekpunt; actuelere lokale of remote wijzigingen moet je behouden.
2. Op die branch bestaan al het datafundament, de gedeelde geometrie en **een echte 2D/3D-configurator** op `/project-samenstellen/`. Begin die onderdelen niet opnieuw. `main` stond bij controle vier commits achter deze branch. Alleen `main` bekijken geeft daarom een onvolledige bouwstand.
3. Lees na dit START-blok H01–H05, de actuele `docs/IMPLEMENTATION_STATUS.md` en de v4.0-functietabel met 160 eisen. Lees overige dossiersecties alleen wanneer je eraan werkt. Het grote historische dossier hoort op schijf; herhaal het niet in iedere chat of tooluitvoer.
4. Maak een compacte verschilkaart: eis → aanwezige code → ontbrekend gedrag → bewijs/test → eerstvolgende wijziging. Repareer eerst foutieve prijs-/validatie-/overdrachtslogica uit H04. Werk daarna zonder onnodige pauze verder aan de volledige site en klantreis.
5. Behoud de huidige statische HTML/CSS/ES-modulebasis, bestaande routes, echt logo, echte projectfoto’s en bruikbare 2D/3D-code. Geen onnodige frameworkmigratie, nieuwe repository of tweede losstaande configurator.
6. Het bevestigde arbeidstarief is **EUR 60,00 excl. btw per medewerker per uur**, bij 21% btw **EUR 72,60 incl. btw**. Gebruik bevestigde prijzen en gecontroleerde regels. Onbekende componenten blijven onbekend/op aanvraag. Concurrentprijzen en oude losse offertes zijn geen automatische SEAL-verkoopprijzen.
7. Bouw rijke mogelijkheden uit gedeelde data en herbruikbare componenten. Maak geen 160 losse apps of 160 knoppen op de homepage. Prioriteit: overzicht, bewijs, ontwerp, heldere prijsstatus en een bruikbare volgende stap.
8. Sluit echte verzending, uploads, klanttoegang, facturatie of betalingen alleen aan op bestaande, bruikbare infrastructuur. Maak benodigde adapters en configuratie wel compleet. Toon zonder aansluiting een functionerende, eerlijke aanvraag/downloadroute. Een klik op mail openen is geen ontvangen aanvraag.
9. Werk met korte, afgeronde wijzigingen; test passende reken- en klantstromen. Leg na afgerond werk én vóór contextwissel vast wat werkelijk gebouwd/getest is. Een limiet mag niet leiden tot verlies van werk of een nieuwe inhoudelijke briefing.
10. Lever screenshots van de **werkende lokale site**, een korte testuitslag, de ingevulde eisenkaart en één exact hervatcommando als de sessie toch eindigt. Geen garantie dat een accountlimiet één onafgebroken bouwrun toestaat; beperk herhaling en ga zo ver als de beschikbare sessie verantwoord toelaat.

Begin nu met de inspectie. Geef hoogstens een korte statusmelding en voer daarna de wijzigingen uit.

## H01 Overdracht — wat wij hebben afgesproken

De website is van **SEAL / Sealcleaning Groenonderhoud en Aanleg**, een groenbedrijf in Dordrecht, met de Drechtsteden en het bevestigde gebied rond Rotterdam als werkgebied. De opdracht betreft uitsluitend dit bedrijf. Betrek geen andere ondernemingen, projecten of administratie.

De opdrachtgever wil denken en werken met de zorgvuldigheid van een ervaren, professioneel bedrijf: goed advies, nette uitvoering, heldere afspraken, doordachte opties en verantwoord financieel beheer. “50 jaar ervaring” en “miljoenenbedrijf” waren een gewenste mentaliteit, geen bewezen bedrijfsfeiten voor de website. Publiceer alleen onderbouwde ervaringsjaren, personeelsaantallen, omzet, reviews, certificaten, verzekering en garanties.

De site moet particulier én zakelijke bezoeker helpen begrijpen:

- welke dienst bij zijn situatie past en wanneer iets nodig is;
- wat onderhouden, behouden, herstellen, verwijderen of opnieuw aanleggen betekent;
- welke materialen, uitvoeringsroutes en onderhoudsniveaus mogelijk zijn;
- wat hij zelf kan voorbereiden en welke informatie SEAL nodig heeft;
- wat een prijs wel en niet omvat;
- hoe hij van idee naar ontwerp, aanvraag, offerte, uitvoering en nazorg gaat.

De eerder besproken diensten blijven behouden: tuinonderhoud, periodiek onderhoud, voor- en achtertuinaanleg, renovatie, onkruid verwijderen, heggen/hagen en struiken snoeien, gras, schuttingen en hekwerk, poorten, bestrating met tegels/klinkers/waaltjes/keramiek/grind en opsluitbanden, tuin leeghalen, sloop/grondwerk, puin/groenafval, bomen/wortels/stronken, bloembakken, pergola’s/vlonders en relevante buitenreiniging. Specialistische boomzorg, constructies, elektriciteit, afwatering en hogedruktoepassingen krijgen een passende inventarisatie en beoordeling; suggereer geen onbevestigde technische capaciteit. Materiaalspecifieke reinigingskeuze voorkomt schade door een generieke “hogedruk op alles”-belofte. Interieurwerk, laminaat, schilderen en stucen zijn in oudere bedrijfscommunicatie genoemd, maar vallen buiten deze groenwebsite.

De ontwerpafspraken blijven: premium bosgroen, zand en steen, Fraunces/Inter waar reeds toegepast, echte SEAL-fotografie, scherpe uitsnedes met focal points, sterke typografie, duidelijke tabellen, checklists, uitklapbare uitleg, materiaalvergelijking, nette kaders, duidelijke CTA’s en een rustige mobiele ervaring. De nieuwere compacte, inhoudelijke hero uit v3/v4 gaat voor op de oudere zeer hoge beeldhero. “Veel opties” betekent relevante keuzes op de juiste plek, met geleidelijke verdieping.

De volledige productvisie omvat:

- korte aanvraag zonder eerst zelf te ontwerpen én een uitgebreider projectdossier;
- losse en gecombineerde diensten in één project;
- echte tuincontour/oppervlakte, losse schuttingdelen, bestaande poorten/objecten en behouden/verwijderen;
- 2D en 3D die dezelfde geometrie, materiaalkeuze en projectstate gebruiken;
- materiaal zelf inkopen, levering via SEAL, alleen montage, ontwerp/advies, complete uitvoering en onderhoud als heldere routes;
- varianten vergelijken, bewaren, exporteren met SEAL-branding en meenemen naar een aanvraag;
- projectcases, kennisbank, seizoensadvies, onderhoud/nazorg, buurtschutting en zakelijke/aannemers-/vakmanroutes;
- leveranciers, prijsbronnen, interne inkoop/marge, offerte, akkoord, meerwerk, werkbon, oplevering en factuur als samenhangende operatie;
- klanttoegang, materiaalverkoop en betalingen volgens de actuele v4-scope en de echte beschikbare infrastructuur.

## H02 Gecontroleerd hervatpunt — repositorybewijs

**Primaire repository:** https://github.com/dhrburgaz/beste-website-sealcleaning  
**Onderzochte bouwbranch:** `claude/sealcleaning-website-overhaul-gvgtfj`  
**Onderzochte HEAD:** `a139d0b580c47a77a61ecf1b15917e63a0ab64b2`  
**Laatste commit op die HEAD:** 7 oktober 2026, 20:23:32 UTC — “Add real 2D/3D tuin-, schutting- en bestratingsconfigurator (/project-samenstellen/)”.  
**Onderzochte main:** `5c52dcb108d57042fb588c3de82b6f73f59c4f8a`, 7 oktober 2026, 17:55:03 UTC — “Create CNAME”.  
**GitHub-vergelijking:** bouwbranch 4 commits vooruit, 0 achter. Dit bewijst dat dit werk op dat moment niet in main zat; het bewijst op zichzelf niet wat momenteel live is.

De andere gevonden branch, `claude/website-deployment-check-sue9m8`, eindigt op `06e62de0fe04f4adacb4a363607b6b84221a117e` van 8 september 2026 en bevat ouder wizard-/lightboxwerk. Gebruik deze niet als automatische hervatbranch wanneer het recentere configuratorwerk elders staat.

### Vastgesteld in bestanden en commits

| Onderdeel | Aangetroffen bewijs | Wat de volgende uitvoerder ermee doet |
| --- | --- | --- |
| Herstel Diensten-links, verkeerd ingedeelde foto en zichtbaar WhatsApp-nummer | Commit `d2b166a`; bijgewerkt bronregister en sitebestanden | Behouden, regressiecontrole; herstel geen oud al opgelost probleem opnieuw |
| Nieuwe publieke bellijn | Commit `ab9ef58` en `js/config.js`: 078 204 95 17 | Behouden; bellen en WhatsApp blijven verschillende kanalen |
| Projectstate/datafundament | Commit `e4c8480`; `js/project-state.js`, services, fence-systems, paving-products, price-sources, projects en leeg reviewsbestand | Uitbreiden, schema migreren waar nodig, geen parallel datamodel |
| Gedeelde geometrie | `js/configurator/geometry.js`, gebruikt door SVG en Three | Behouden en versterken voor ontbrekende vorm-/validatieregels |
| 2D/3D-configurator | `project-samenstellen/index.html`, `app.js`, `svg-scene.js`, `three-scene.js` | Doorbouwen; geen mock-3D of tweede app |
| Lokale 3D-dependency | `vendor/three/`, Three.js 0.186.1 volgens checkpoint, licentie/NOTICE en OrbitControls | Gepinde dependency behouden; geen CDN-wissel of upgrade zonder concrete noodzaak |
| Lokale opslag en export | 30 dagen opt-in apparaatopslag; branded 3D-PNG en tekstdossier in controller | Completeren met veilige schema-/herstelcontrole, JSON/print/varianten |
| Overdracht naar contact | `js/wizard-prefill.js` en sessionStorage-samenvatting | Volledig dossier behouden; echte verzending apart verifiëren |
| Bouwinstructies/checkpoint | `docs/SEAL_BUILD_BRIEF.md`, `docs/IMPLEMENTATION_STATUS.md`, `docs/SOURCE_REGISTER.md` | Nieuwste masterprompt leidend maken; status niet blind als volledige waarheid kopiëren |
| Hosting | Statische HTML/CSS/JavaScript zonder package.json in de onderzochte tree; workflow publiceert bij push naar main | Pas tests/techniek aan de bestaande stack aan; een npm-build is niet automatisch aanwezig |

Het voortgangsbestand meldt tier 1 en 2 afgerond, tier 3 afgerond en tier 4 gedeeltelijk. **Dat is een historische projectstatus, geen bewijs dat alle nieuwste v4.0-eisen al af zijn.** De branch is gebouwd tegen v2.0; v3/v4 bevatten aanvullende eisen. Maak daarom de verschilkaart tegen deze volledige masterprompt.

### Nog open volgens het aangetroffen checkpoint

1. Vrije/L/U tuincontour voor het tuinvlak; momenteel alleen rechthoek. Schuttingvormen I/L/U bestaan wél.
2. Bestaande/behouden/te verwijderen objecten als bewerkbare catalogus en `existingObjects[]`-UI. Momenteel hoofdzakelijk twee verwijdercheckboxen.
3. Materiaal-/ontwerpvergelijking van maximaal drie varianten en JSON/deellinkexport.
4. Poortzijde, offset en breedte aanpassen; nu alleen toevoegen met vaste defaults en verwijderen.
5. Volledig prijsboek/rekenregels en `/prijzen/`; momenteel één materiaalvoorbeeld in overzicht.
6. Officiële materiaalcatalogus; `data/materials.js` ontbreekt, generieke presets zijn geen bevestigde verkoopproducten.
7. Echte leadverwerking, uploads, aanvraagontvangst en vervolgstroom; contact is nog geen serverbackend.
8. Projectdetailroutes, uitgewerkte kennisbank, B2B/aannemers en werken-met-ons.
9. Document-/offerte-/factuurarchitectuur, materiaalcheckout, analytics en eindcontrole.
10. Leveranciers-/inkoop-/marge-engine met echte interne kostprijzen en bedrijfsregels.

Drag-to-edit ontbreekt, maar bediening via getalsvelden bestaat al. Houd die toegankelijke route beschikbaar wanneer drag wordt toegevoegd. Ontbrekende optionele drag is iets anders dan een ontbrekende verplichte vrije tuincontour.

### Wat werkelijk opnieuw is gecontroleerd bij het opstellen

Op de opgehaalde rekenmodules van genoemde SHA zijn negen assertions uitgevoerd en geslaagd: komma/punt-maatconversie; L-lijnlengte 8,40+4,20 = 12,60 m; één gedeelde hoekpaal; na 1,00 m poort 11,60 m gesloten lengte; geldige poort; 24 m² met 60×60 cm en 5% reserve = precies 70 tegels; alleen raken van bestratingsvlakken geldt niet als overlap; echte overlap wordt herkend.

Het checkpoint en de commit beschrijven eerdere Playwright/Chromium-controles, waaronder 3D, PNG, mobile 390px en handoff. **Deze browsertests zijn tijdens deze dossierupdate niet opnieuw uitgevoerd.** Er zijn in de onderzochte tree geen blijvende testbestanden of package.json aangetroffen. Een committekst is dus geen actuele volledige acceptatietest. Controleer de echte klantreis in de uitvoeromgeving vóór oplevering.

## H03 Hervatten zonder werk te verliezen

Voer deze inspectie één keer compact uit; lees alleen de uitkomst die vervolgkeuzes bepaalt:

```bash
git status --short --branch
git remote -v
git branch --all
git worktree list
git log -n 12 --oneline --decorate
git diff --stat
git diff --cached --stat
rg --files -g 'AGENTS.md' -g 'CLAUDE.md' -g '*STATUS*' -g '*CHECKPOINT*' -g 'package.json' -g '*test*' -g '*spec*'
```

Controleer daarnaast instructiebestanden in bovenliggende directories. Lees de relevante onopgeslagen diff vóór je bestanden verandert. Dump geen geheimen, .env-inhoud of alle remote-/loggegevens in de gebruikersreactie. Gebruik stashes alleen als herstelbron die je eerst leest; pas niets blind toe.

- Als de actieve checkout recentere of onopgeslagen SEAL-werkzaamheden bevat, werk vanaf die toestand. De genoemde oude HEAD is geen reden om terug te gaan.
- Als main actief is en het configuratorwerk alleen remote staat, inspecteer die bouwbranch en kies een veilige checkout/worktree zonder lokaal werk te overschrijven.
- Als de verwachte branch ontbreekt, onderzoek lokale branches, remotes, commits en voortgangsbestanden. Vergelijk inhoud; een gewijzigde branchnaam betekent niet dat het werk weg is.
- Als geen repository beschikbaar is, probeer de bekende repository beschikbaar te maken binnen bestaande rechten. Vraag alleen om concrete toegang wanneer dit echt blokkeert; maak geen lege vervangende website.
- Voer geen `reset --hard`, `clean -fd`, geforceerde checkout, force-push, geschiedenisverwijdering of massale terugzetactie uit om een “schone start” te krijgen.
- Wijzig tijdens de bouw geen productiedomein, DNS, mailbox, externe accounts, betaald abonnement of advertentiebudget. Rond code, tests en reviewbare oplevering eerst af. Een expliciete eerdere toestemming blijft geldig binnen haar echte scope.

Leg na inspectie maximaal tien regels vast: actieve branch/HEAD; afwijking van de onderzochte SHA; lokaal werk; wat al werkt; wat gebroken is; wat nog ontbreekt; volgende drie concrete wijzigingen. Wacht daarna niet op een fasegoedkeuring voor het reeds opgedragen bouwen.

**Canonieke bestanden bij voortzetting:** leg dit volledige dossier vast als `docs/SEAL_BUILD_BRIEF.md` of als een duidelijk gekoppeld canoniek masterpromptbestand. Het oude brief is historisch in deze versie behouden; laat niet twee tegenstrijdige actieve briefs naast elkaar bestaan. Gebruik `docs/IMPLEMENTATION_STATUS.md` voor de bouwstand en `docs/REQUIREMENTS_INDEX.md` voor de eisenkaart. Verwijs vanuit eventuele `CLAUDE.md` naar deze drie bestanden; voeg geen enorme dubbele prompt toe.

## H04 Gerichte herstelpunten uit codelezing

Onderstaande punten zijn gebaseerd op de onderzochte SHA, geen claim dat ieder browsergevolg opnieuw is gereproduceerd. Controleer ze gericht en herstel het toepasselijke gedrag voordat je meer opties bovenop dezelfde logica stapelt.

| Codebevinding | Vereiste verbetering en betekenisvolle controle |
| --- | --- |
| `fillPriceStatusBlock()` kiest altijd `price-flairstone-garden-moon-6060`, terwijl de UI andere tegelmaten/presets toestaat | Koppel prijs aan een daadwerkelijk passend product-ID, formaat, eenheid en bron. Geen passende productkoppeling → geen automatische productprijs. Een 30×30-, 60×60- en 80×80-keuze mag niet dezelfde vaste 60×60-productregel gebruiken |
| De prijscontrole gebruikt alleen `status !== "stale"` | Controleer ook peildatum/reviewAfter, btw, productvariant, staffel, aantallen, beschikbaarheid en scopes. Een verouderde “active”-regel mag niet automatisch actueel worden genoemd |
| `canAdvanceTo()` en Volgende behandelen vooral dienstkeuze; poort-/overlapfouten blokkeren de flow niet centraal | Maak één validation-resultaat per project/stap, ook voor directe stapnavigatie, mobiele balk, export en handoff. Ongeldige poort of overlap krijgt uitleg en geen geldig geprijsd dossier |
| `computeFenceLayout()` ontvangt poorten zonder zelf fouten toe te voegen; `errors` blijft leeg | Valideer vóór geometriecommit. Houd laatste geldige geometrie plus tijdelijke ongeldige invoer gescheiden. Geen overlappende of buiten de zijde vallende poort in een ogenschijnlijk geldig ontwerp |
| L-right kan negatieve z-coördinaten opleveren; `fitGardenToContent()` verzamelt alleen positieve maxima | Gebruik gedeelde min/max-bounds en correcte scenevertaling in SVG én 3D. Maak links/rechtsvormen zichtbaar zonder echte opgegeven tuinmaten fictief te vergroten |
| Een bestratingsoverlapmelding vraagt positie aan te passen, maar de gelezen formulier-UI biedt vooral lengte/breedte | Voeg bewerkbare positie toe; bij ondersteunde rotatie ook echte geometrie/overlapcontrole. Test toevoegen/verplaatsen/verwijderen zonder dubbele oppervlakte |
| `buildTextSummary()` bevat alleen een beperkte selectie velden | Neem materiaal/systeem, alle maten/poorten, objectstatus, verwijdering, toegang, planning, notities, route en fotoreferenties mee volgens privacyregels. Gebruik één versieerbare dossierprojectie voor scherm, export en aanvraag |
| `loadSavedProject()` vertrouwt grotendeels op parse + ouderdom | Valideer schemaVersion, datatypen, grenzen en referenties. Migreer bestaande `sealConfiguratorProject`-gegevens wanneer schema verandert. Een corrupt of oud bestand mag geen crash of stil dataverlies veroorzaken |
| Tekstdossier en contacthandoff doen geen echte serverontvangst | Maak UI-statussen eerlijk: opgeslagen op apparaat, gedownload, e-mail geopend, aan server aangeboden, bevestigd ontvangen zijn verschillende gebeurtenissen |
| Bestaande tests zijn als sessieverslag vermeld, maar niet als herhaalbare tests in tree | Bewaar een kleine set waardevolle rekenregressies en één herhaalbare hoofdklantreis. Controleer daarna relevante browsers/kleine schermen; schrijf geen tests die alleen HTMLlabels of implementatiedetails kopiëren |

Breid deze lijst alleen uit met concrete nieuwe bevindingen. Start geen algemene herbouw om ieder theoretisch probleem te behandelen.

## H05 Historische besluiten samenvoegen — wat blijft en wat is gewijzigd

| Eerdere afspraak / bron | Besluit voor deze complete opdracht |
| --- | --- |
| Uitvoeringsdossier v1.0 en v1.1: echte 3D hoort bij de bouw, niet bij een latere optionele fase | Blijft verplicht. De aangetroffen echte 3D behouden en afmaken |
| V1: webshop, CRM, accounts, betaling, AI/AR en fotorealistische import waren buiten scope | V2–v4 hebben klantoperatie, materiaalverkoop, klanttoegang en betalingsarchitectuur toegevoegd. Die nieuwere onderdelen horen bij de actuele scope, met echte infrastructuur en activeringsgrenzen. AR/fotorealistische import en onbevestigde AI-uitkomsten zijn geen verplichte kernflow |
| Oude berichtgeving: KvK 80977790; nieuwere opdracht en repository: 83078665 | Nieuwere set gebruiken; geen oude administratieve gegevens mengen. Register-/factuurcontrole blijft nodig vóór juridische toepassing |
| V1/oudere site: belnummer mobiel; nieuwste opdracht en branch: 078 204 95 17 | Nieuwste publieke bellijn behouden. WhatsApp 0648871986 blijft alleen achter CTA/href, niet als zichtbare cijfertekst |
| Materialen vooraf regelen/betalen, klant kan zelf inkopen, overige betaling bij levering/oplevering | Vastleggen als configureerbaar offerte-/termijnbeleid met duidelijk onderscheid materiaal, arbeid, levering en oplevering. Geen universele aanbetaling of termijnpercentage verzinnen |
| Wens om annuleren, betaling en meerwerk duidelijk te regelen | Werk met duidelijke scope, akkoord, voorwaardenversie, meerwerkakkoord en betalingsbewijs. Maak geen absolute uitsluiting van wettelijke consumentrechten of een ongeoorloofde “nooit annuleren/nooit opschorten”-clausule |
| Afvoer was eerder soms als standaard inbegrepen verwoord | Blijft “in overleg / apart opgenomen in de offerte” tenzij een concrete prijsregel het expliciet omvat |
| Eerdere offerte-/presentatiematen 11,5 m versus circa 14,2 m | Conflict bewaren; geen universele meterprijs afleiden totdat scope, hoeveelheden en materiaalposten zijn verzoend |
| Oudere contante betaling mogelijk | Laat bankbetaling/factuur de normale zakelijke route zijn. Alleen toegestane, werkelijk aangeboden betaalmethoden tonen. Ook bij eventuele contante betaling horen factuur en ontvangstregistratie; geen fiscaal afwijkende “zonder factuur”-route |
| Historische gratis prijsinformatie op basis van foto’s / vrijblijvende kennismaking | Mag alleen als SEAL die service daadwerkelijk zo aanbiedt. Fotoindicatie is geen inmeting of definitieve offerte; betaalde ontwerp-/adviesdiensten apart beschrijven |
| Oudere 8+/10+/15+ ervaringsclaims en gewenste 50-jaar-mentaliteit | Geen automatisch marketinggetal kiezen. Gebruik aantoonbare feiten en echte cases; professionaliteit komt uit presentatie en uitvoering |
| Oud dossier kon de site niet ophalen; later siteaudit en repositorycontrole beschikbaar | Oude verbindingsfout is geen actuele offline-status. Deze v5 gebruikt echt repositorybewijs; live/domeinstatus afzonderlijk verifiëren |
| Oude audit noemde verkeerde onderhoudsfoto | Bouwbronregister meldt dat dit specifieke punt niet bevestigd is: huidige file gebruikt passende voortuin-foto. Geen al opgelost of niet-reproduceerbaar probleem opnieuw als actief defect presenteren |
| V4 bevat 160 eisen, 24 conceptvoorwaardenartikelen en 14 documenttypen | Allemaal behouden, naast overige v2/v3-eisen. Dit aantal is geen bewijs dat de hele huidige branch af is |
| Instagram-afbeelding met /compare, /factcheck, /checklist e.d. | Dit zijn voorbeeldinstructies, geen geïnstalleerde plugins of gegarandeerde productcommando’s. De bruikbare werkwijze toepassen: vergelijken, verifiëren, redigeren, structureren en controlelijsten maken |

### Tarief- en offertegeheugen — met scope

- **Bevestigde actuele arbeid:** EUR 60,00 excl. / EUR 72,60 incl. 21% btw per medewerker per uur. Twee medewerkers gedurende vier uur betekent acht medewerkeruren, niet vier. Materialen, vervoer, afvoer en huur zijn aparte posten tenzij expliciet inbegrepen.
- **Tuinwerk-offerte EUR 450 incl. btw:** historisch projectvoorbeeld, geen universeel onderhoudspakket; exacte werkbeschrijving bepaalt hergebruik.
- **Schuttingaandeel EUR 1.050 excl. btw:** specifieke verdeling/context; geen algemene meterprijs. Materiaal, container en snelbeton kunnen ontbreken.
- **Composietarbeid EUR 2.450 excl. btw:** historische projectregel. Presentatie vermeldde daarnaast systeem EUR 2.539, snelbeton/ophalen EUR 128, container EUR 529 en totaal EUR 6.160,50 volgens dat document; controleer de originele posten, btw en omvang vóór hergebruik.
- **Teruggevonden gesprek 17 mei 2026:** gewenste offerte EUR 4.500 excl. btw voor circa 8 m² voortuin en 24 m² achtertuin, met eerste termijn EUR 1.500 voor materialen/transport/container en restant bij oplevering; puincontainer 6 m³, verlichting/decoratie apart. Dit is een oude, specifieke opdracht, geen actuele aanneemsom of EUR/m²-prijs. De samenvatting bevat onduidelijkheid over welke siermaterialen wel/niet waren inbegrepen; originele offerte nodig vóór calculatiegebruik.
- **Markt- en leveranciersprijzen:** blijven afzonderlijke bronregels met datum, btw, eenheid, scope en geldigheid. Een openbare winkelprijs is geen bewezen SEAL-inkoopprijs of goedgekeurde marge.

Houd onbekende minimumopdracht, voorrijkosten, urenproductiviteit, machinehuur, stortkosten, margepercentages, betalingsschema’s, garantievoorwaarden en levertijden als open bedrijfsinstellingen bij. Stop daarvoor geen onafhankelijke frontendbouw. Laat onzekere automatische calculatie of verkoop wel eerlijk op aanvraag staan.

## H06 Verplicht te behouden dekking — geen onderdeel verliezen tijdens hervatten

De 160 v4-eisen A01–P10 zijn het actieve functieregister; daarnaast blijven alle relevante v2/v3-eisen gelden. Eén route kan meerdere eisen dragen. De uitvoerder koppelt iedere eis aan daadwerkelijk gedrag en bewijs, niet aan alleen een toekomstige roadmap.

- **Klantoriëntatie:** particulier/zakelijk, snelle route, beslisboom, problemen herkennen, wanneer onderhoud nodig is, seizoenen, budget, bereikbaar werkgebied en realistische planning.
- **Dienstinhoud:** wat/wanneer/voor wie, materiaalopties, behouden/herstellen/vervangen, werkzaamheden, voorbereiding, uitsluitingen, prijsfactoren, proces, relevante foto’s, FAQ en vervolgstap.
- **Fotografie en cases:** visuele inventaris van echte beelden, correcte categorieën en alttekst, aantoonbare voor/tijdens/na, casegroepering, mobiel crop/focal point, filters, lightbox en echte detailroutes.
- **Ontwerp:** tuincontour, oppervlakken, schutting/geometrie/palen/passtukken, poorten, bestrating/legpatroon/snedes, bestaande objecten, verwijdering, beplanting en passende visualisatie.
- **Vergelijking:** materialen, onderhoudsbehoefte, toepassingsgeschiktheid, prijsstatus, maximaal drie ontwerpvarianten, geen onbewezen levensduur/garantie als harde belofte.
- **Dossier:** lokaal bewaren, veilig herstellen, branding, print/PDF wanneer uitvoerbaar, JSON/import waar veilig, foto’s, notities, gezamenlijke buurtschutting, onderbouwde deel-/overdrachtsroute.
- **Aanvraag:** korte en uitgebreide intake, relevante conditionele velden, voorkeurkanaal, uploadvalidatie, volledige projectoverdracht, fout/herstel/ontvangststatus, geen verlies bij browserterug.
- **Prijzen:** publiek incl. btw voor consumenten; herleidbare materiaal/arbeid/overige posten; uren per medewerker; onbekend/onvolledig/stale-status; eigen verkoopregels gescheiden van bronprijzen/inkoop.
- **Zakelijk en samenwerking:** bedrijven, VvE/terreinonderhoud, aannemers, bestek/tekeningen, terugkerend onderhoud, vakmannen en open samenwerkingsinteresse zonder verzonnen vacature.
- **Operatie:** intake → controle/inmeting → offerte → akkoord → voorbereiding → uitvoering/meerwerk → oplevering → factuur → nazorg; rollen, bewijs, wijzigingen en herinneringen bij echte backend.
- **Documenten:** alle 14 documenttypen en 24 AV-conceptartikelen uit v4, met identiteit, scope, versie, benodigde velden, BTW, nummering, akkoord en printvriendelijke branding.
- **Juridisch/privacy:** duidelijke algemene voorwaarden, privacy, cookies, toestemming gescheiden per doel, rechten consument, contractsnapshot, herroeping waar toepasselijk, meerwerk, klacht-/garantieproces en minimale gegevens.
- **Beheer/veiligheid:** veilige uploads, servervalidatie, rechten, geen interne inkoopprijzen in frontend, audittrail, geen secrets, dataverwijdering, backups en werkelijke fallback.
- **Marketing/vindbaarheid:** unieke lokale dienstinformatie, kennisartikelen, canonicals/redirects, sitemap/robots, schema zonder fictieve reviews, meetbare CTA’s en consent-passende analytics.
- **Mobiel/performance/toegankelijkheid:** semantische HTML, toetsenbord, focus, contrast, accordeons/tabs, tabellen op kleine schermen, reduced motion, lazy 3D, WebGL-fallback, sceneperformance en correcte ankerpositie.
- **Oplevering:** geen dode knoppen, juiste status per extern onderdeel, passende tests, lokale desktop/mobile screenshots, controleerbare checklist en herstelbare voortgang.

Bij een conflict tussen een bestaand checkpoint en bovenstaande opdracht is het checkpoint bewijs van vroegere uitvoering, niet toestemming om nieuwere verplichte eisen weg te laten.

## H07 Uitvoeringsvolgorde — zelfstandig doorwerken met de aanwezige basis

Dit is een interne werkvolgorde binnen één opdracht, geen verzoek om de opdrachtgever iedere fase opnieuw te laten starten.

1. **Herstel en consolidatie:** huidige werkstand veiligstellen; prijs-productkoppeling, validatie, bounds, opslagmigratie en volledige overdracht herstellen. Zorg dat de bestaande hoofdflow heel blijft.
2. **Gedeelde data/prijsboek/ontwerp:** officiële of correct gelabelde catalogus, EUR 60-regel, onbekende posten, vrije contour/objecten/poortbewerking, materiaal- en variantvergelijking, dossiers en exports. Gebruik dezelfde geometry/state.
3. **Volledige publieke site:** v4-ontwerp toepassen op homepage, diensten, materialen/prijzen, cases, kennisbank, werkwijze, zakelijke routes, samenwerking, contact en nazorg. Vul bruikbare teksten en echte beeldrollen uit het dossier; geen pagina’s met alleen “binnenkort”.
4. **Aanvraag en zakelijke documenten:** volledige payload plus veilige attachments, echte bestaande endpointadapter indien beschikbaar, offertes/meerwerk/oplevering/factuurtemplates, privacy/voorwaarden en gekoppelde contactroutes.
5. **Externe activering en interne operatie:** sluit bestaande toegestane backend/mail/opslag/boekhouding/account/payment aan waar beschikbaar. Anders lever complete configuratie/adapters, documenteer exacte ontbrekende waarden en toon een functionerende aanvraagroute. Maak geen nepportaal of dummy-betaalsucces.
6. **Oplevering:** rekenregressies, sleutelklantreis, mobiel/desktop, contactflow, ontbrekende tarieven, browserfallback, toegankelijkheid en screenshots. Werk eisen-/statusdocumenten bij en presenteer een reviewbaar resultaat.

Besteed de sessie niet uitsluitend aan infrastructuur of planning terwijl de klantwebsite incompleet blijft. Omgekeerd vervangt een mooie homepage de calculatie, 3D, dossieroverdracht of juridische procesafspraken niet.

## H08 Tokens, skills en continuïteit

De opdrachtgever gebruikt Claude Code Pro en wil dat het meeste voorwerk in dit dossier gebeurt. Verlaag de uitvoerkosten zonder belangrijke functionaliteit stil weg te strepen.

- Lees START, hervatbewijs, actieve status en geselecteerde eisen. Gebruik de leeswijzer hieronder om één relevant hoofdstuk te openen; geen volledige 250+ KB dump, herhaald onderzoek of steeds alle bijlagen inladen.
- Houd een korte taaklijst, kleine gerichte diffs en gedeelde templates. Pas dezelfde service-/project-/kennisrenderer toe; bouw geen gekopieerde pagina’s met dezelfde logica.
- Laat tooluitvoer beperkt: relevante regelrange, alleen foutregels/testsamenvatting, compacte diffs. Vermijd het herhaald uitprinten van vendorcode, fotosets, lockfiles en dossierinhoud.
- Gebruik eerst de reeds aanwezige assets en gepinde libraries. Installeer alleen een dependency die een concrete ontbrekende functie oplost. Geen parallelle agentenkopieën met hetzelfde grote dossier om “meer plugins” te gebruiken.
- Beschikbare ChatGPT-skills zijn niet automatisch in Claude Code geïnstalleerd. Controleer echte mogelijkheden. Gebruik code-/GitHub-inspectie, browsercontrole, ontwerp/beeldbewerking, document/PDF-werk en prijs-/juridische broncontrole gericht waar nodig. Figma, Vercel, Sites, AI of extra connectors zijn geen verplichte migraties.
- De professionele ontwerpuitstraling moet in echte HTML/CSS zichtbaar zijn. Gegenereerde conceptbeelden mogen richting geven; presenteer ze niet als uitgevoerd SEAL-project of als screenshot van een gebouwde site.
- Research is al gedaan. Controleer alleen tijdgevoelige prijzen/regels bij werkelijk gebruik, open bronconflicten en nieuw benodigde informatie. Geen nieuwe brede concurrentieronde voor ieder component.
- Kijk naar beschikbare context-/sessie-indicatoren wanneer die bestaan. Verzín geen exact aantal resterende Pro-tokens of gegarandeerde accountquota. Reserveer tijd/context voor passende tests en een checkpoint.
- Werk een bestaand checkpoint na elke zinvolle afgeronde wijziging bij, niet na iedere tekstregel. Vóór compact/contextwissel: actieve branch/HEAD, changed files, laatste geslaagde controles, open fouten, externe blockers en exact volgende commando.
- Probeer de hele opdracht in dezelfde bouwrun uit te voeren. Als de sessielimiet toch ingrijpt, hervat met dezelfde masterprompt en statusfile; er is geen nieuwe inhoudelijke prompt of nieuwe ontwerpronde nodig.

**Minimale checkpointvelden:**
```text
specVersion: 5.0
branch / head:
localChanges:
completedRequirementIds + file refs:
testsRun + result + date:
notRetested:
knownFailures:
externalBlockers + required config keys:
nextTask:
nextCommand:
```

Gebruik duidelijke statussen: `aanwezig`, `gedeeltelijk`, `gebouwd`, `getest`, `extern geblokkeerd`, `niet van toepassing met reden`. Houd merge/deployment apart; gebouwd is niet automatisch live. Markeer geen ongeteste backendflow “af” omdat de knop er staat. Houd eventuele testdata, mockontvangers en demo-accounts buiten productie.

**Hervatregel bij een volgende sessie:** “Lees H00, de actieve IMPLEMENTATION_STATUS en de relevante eisen; controleer lokaal werk en vervolg nextTask. Behoud vorige beslissingen. Voer geen nieuw breed onderzoek of herbouw uit.”

## H09 Bronnen, leeswijzer en eindopdracht

### Wat voor deze samenvoeging is teruggevonden en beoordeeld

| Bron | Behandeling |
| --- | --- |
| `SEAL_Claude_Code_Uitvoeringsdossier (1).md`, intern v1.0, 7 oktober | Volledig gelezen en vergeleken met v2; unieke historische keuzes opgenomen in H05 |
| `SEAL_Claude_Code_Uitvoeringsdossier.md`, intern v1.1, 7 oktober | Volledig gelezen en vergeleken; contact-/live-herstelregels behouden en geactualiseerd |
| `SEAL_Claude_Code_Uitvoeringsdossier (2).md` | Dezelfde inhoud als v1.1; deduplicatie gecontroleerd, niet nogmaals als actieve instructie toegevoegd |
| `SEAL_CLAUDE_CODE_MASTERPROMPT_v2.0.md` | Alle 50 hoofdstukken staan volledig in de naslag hieronder |
| `SEAL_MASTERPROMPT_v3.0_COMPLEET.md` | Volledig aanwezig in v4-naslag, inclusief EUR 60-prijsbasis en informatie-/ontwerpuitwerking |
| `SEAL_MASTERPROMPT_v4.0_COMPLEET.md` | Volledig, ongewijzigd onder deze v5-overdracht behouden |
| Eerdere SEAL-gesprekscontext | Domein/repository, afzonderlijke bel-/WhatsApp-kanalen, materiaal/betaling, offertecontext, eigen werk, scope en tokenvoorkeuren in H01/H05 verwerkt |
| GitHub branches, commits, tree, compare en bron-/status-/codebestanden | Echte hervatbasis in H02; concrete codebevindingen in H04 |
| Tijdgevoelige prijs-/juridische bronnen | Reeds gedateerd opgenomen in v2/v4; opnieuw controleren bij toepassing, geen hernieuwde verificatie suggereren alleen omdat tekst is samengevoegd |

Dit dossier noemt alle teruggevonden bronversies concreet. Het claimt niet dat onbekende of niet-opgeslagen chats buiten deze bronnen zijn ingezien. Actuele lokale, niet-gepushte wijzigingen zijn vanuit GitHub niet zichtbaar; daarom blijft de eerste repositoryinspectie verplicht.

**Bronlinks voor de feitelijke bouwstand:**

- Branch: https://github.com/dhrburgaz/beste-website-sealcleaning/tree/claude/sealcleaning-website-overhaul-gvgtfj
- Onderzochte commit: https://github.com/dhrburgaz/beste-website-sealcleaning/commit/a139d0b580c47a77a61ecf1b15917e63a0ab64b2
- Checkpoint op die SHA: https://github.com/dhrburgaz/beste-website-sealcleaning/blob/a139d0b580c47a77a61ecf1b15917e63a0ab64b2/docs/IMPLEMENTATION_STATUS.md
- Bronregister op die SHA: https://github.com/dhrburgaz/beste-website-sealcleaning/blob/a139d0b580c47a77a61ecf1b15917e63a0ab64b2/docs/SOURCE_REGISTER.md
- Actuele branchvergelijking: https://github.com/dhrburgaz/beste-website-sealcleaning/compare/main...claude/sealcleaning-website-overhaul-gvgtfj

### Leeswijzer — open alleen wat bij de huidige taak hoort

| Taak | Relevante secties in ditzelfde bestand |
| --- | --- |
| Hervatcontext en huidig bewijs | H00 START — lees dit eerst en voer vervolgens uit (regels 10–26); H01 Overdracht — wat wij hebben afgesproken (regels 27–57); H02 Gecontroleerd hervatpunt — repositorybewijs (regels 58–106); H03 Hervatten zonder werk te verliezen (regels 107–134); H04 Gerichte herstelpunten uit codelezing (regels 135–153); H05 Historische besluiten samenvoegen — wat blijft en wat is gewijzigd (regels 154–184) |
| Actief functieregister, alle 160 IDs | 2 Functieregister — 160 concrete opties en eisen (regels 347–591) |
| Publieke informatie en dienstteksten | 3 Informatie, teksten en commerciële routes vooraf uitgewerkt (regels 592–620); 3 Dienstpagina's — schrijf bruikbare uitleg, geen generieke opvulling (regels 937–955) |
| Ontwerp en echte fotografie | 1 Ontwerpvisie — een rustige voorkant met veel mogelijkheden (regels 338–346); 4 Design en fotografie — premium, herkenbaar en functioneel (regels 956–974); 7 Eigen fotografie volledig benutten (regels 1250–1268); 34 Visuele uitwerking voor de bouw (regels 1829–1841) |
| State, schutting, bestrating, tuin en 3D | 5 Gegevenscontracten — één bron voor iedere weergave (regels 639–655); 13 Schuttingconfigurator (regels 1364–1385); 14 Bestratingsconfigurator (regels 1386–1403); 15 Complete tuin en overige diensten (regels 1404–1423); 16 3D techniek en bediening (regels 1424–1445); 18 Projectobject en versiebeheer (regels 1456–1505) |
| Bewaren, export en vergelijking | 17 Ontwerp bewaren en vergelijken (regels 1446–1455); 22 Leesbaar dossier voor klant en Sealcleaning (regels 1576–1587) |
| Prijsboek, bronregels en materiaalcatalogus | 7 Prijsboek — bevestigde basis, voorbeelden en onbekenden (regels 1012–1047); 19 Onderzochte prijsinformatie (regels 1506–1541); 20 Prijsboek en rekenregels (regels 1542–1565); 21 Productcatalogus en materiaalkeuze (regels 1566–1575) |
| Aanvragen, backend, privacy en veiligheid | 23 Werkelijke formulierarchitectuur (regels 1588–1607); 8 Privacy, toestemmingen en klanttoegang (regels 740–758); 46 Security, backendgrenzen en operationele data (regels 2099–2117) |
| 24 AV-conceptartikelen, documenten en werkwijze | 6 Juridische inrichting — concreet proces vóór contract (regels 656–708); 7 Offerte, bewijs, facturatie en documenten — vooraf uitgewerkt (regels 709–739); 9 Werkwijze — zichtbare klantuitleg plus interne uitvoering (regels 759–775) |
| Aannemers/vakmannen, verwijderen en inkoop | 36 Informatiearchitectuur voor particulier, zakelijk, aannemer en vakman (regels 1857–1872); 37 Verwijderen, grondwerk, afval en onbekende toestand als eersteklas projectdata (regels 1873–1892); 38 Leveranciers-, inkoop-, markt- en margeverkoopengine (regels 1893–1942); 39 Interne SEAL calculatie- en CEO-assistent (regels 1943–1965) |
| Offerte/factuur, checkout en operatie | 40 Offerte, opdracht, meerwerk, werkbon, oplevering en factuur (regels 1966–2003); 41 Online materiaalverkoop: checkout, consumentrecht en veilige fallback (regels 2004–2015); 42 Klantreis en operatie na de website (regels 2016–2037) |
| SEO, analytics, toegankelijkheid en performance | 25 SEO en lokale vindbaarheid (regels 1620–1637); 26 Analytics en advertentievoorbereiding (regels 1638–1649); 27 Performance en toegankelijkheid (regels 1650–1665) |
| Toetsen, tokenregels en oplevering | 11 Toetsen per klantreis en risicogrens (regels 785–814); 12 Tokenzuinig bouwen — grotere scope met minder herhaling (regels 815–828); 15 Oplevering en concrete overdracht (regels 872–885); 28 Testmatrix en acceptatie (regels 1666–1711); 47 Aanvullende acceptatietests voor de masterversie (regels 2118–2144) |
| Bronnen en oude live audit | 14 Actuele bronnen en onderzoeksgrenzen (regels 844–871); 30 Bronnenregister (regels 1730–1773); 32 Aanvulling na controle van de live website (regels 1782–1805) |

Gebruik de genoemde regelranges als startpunt. Vind bij gewijzigde dossierinhoud opnieuw de kop met `rg -n`; regelnummers zijn een leesgemak, geen programmatisch contract.

### Wanneer deze opdracht is afgerond

Een bezoeker kan begrijpen, kiezen, vergelijken, ontwerpen of direct aanvragen; de site toont echte relevante fotografie, duidelijke prijsstatus en werkende vervolgstappen. Het dossier blijft compleet van configurator tot aanvraag/export. De zakelijke/document-/privacyprocessen zijn coherent, en externe niet-geactiveerde functies zijn eerlijk begrensd.

De uitvoerder levert:

1. de verbeterde bestaande site en echte 2D/3D;
2. de eisenkaart met 160 v4-ID’s én relevante oudere aanvullende criteria, elk met bewijs;
3. passende uitgevoerde testresultaten en de resterende materiële beperkingen;
4. lokale screenshots van homepage, configurator, materiaalvergelijking/prijzen, contact en een mobiel scherm;
5. bijgewerkte compacte voortgang en, uitsluitend wanneer nodig, een exact hervatcommando;
6. één concrete lijst van ontbrekende bedrijfs-/externe instellingen, zonder dezelfde bekende vragen opnieuw te stellen.

**Eindinstructie:** neem eigenaarschap over het complete SEAL-project. Hergebruik wat aantoonbaar goed is, herstel de echte gaten en maak de klantreis af. De hieronder behouden versies zijn het volledige functionele naslagwerk binnen dezelfde opdracht. Begin niet opnieuw bij hun START-blokken en laat hun oudere scope de nieuwste afspraken niet ongedaan maken.

---

# VOLLEDIGE NASLAG — v4.0, v3.0 en alle 50 v2.0-hoofdstukken

**Hier begint het ongewijzigde eerdere v4.0-dossier. De instructieprioriteit bovenaan v5.0 blijft leidend.**


# SEAL MASTERPROMPT v4.0 — volledig klantplatform voor groenonderhoud en tuinaanleg
**9 oktober 2026 • Sealcleaning • Zelfstandige bouwopdracht voor Claude Code / Codex**
Deze versie bevat 160 concrete functies en eisen, 16 werkgebieden, documentmodellen, eigen conceptvoorwaarden, procesregels, fotoregels en toetsbare oplevering. V3.0 en alle 50 oorspronkelijke v2.0-hoofdstukken blijven onderaan behouden. **V4.0 gaat voor bij conflict.**
Status: onderzoeks- en bouwspecificatie. Functies zijn niet door dit document gebouwd of juridisch goedgekeurd. Welke code al bestaat, blijkt uit de actuele repository.
Het kwaliteitsdoel is een uitzonderlijk heldere en professionele website voor particulieren én bedrijven. Een mooie interface, een brede scope of deze prompt garandeert geen marktdominantie, juridisch waterdichte voorwaarden of voltooiing binnen één Pro-gebruiksvenster.

## START — geef dit aan de uitvoerder
Je voert één complete opdracht uit, geen losse fases waarvoor de opdrachtgever nieuwe prompts moet geven. Bouw binnen de bestaande SEAL-repository en behoud correct werk. Inspecteer eerst toepasselijke instructies, gitstatus en het laatste checkpoint; stel vast welke eerdere Tier-onderdelen werkelijk aanwezig zijn.
Lees dit START-blok, de nieuwe v4.0-regels en de tabel van 160 eisen. Gebruik daarna alleen relevante v3.0/v2.0-secties via de index. Dump of herlees het complete dossier niet steeds. Het bestand moet in de projectmap staan; plak niet de gehele bijlage in elke chatsessie.
De kern bestaat uit één gedeelde ProjectState/geometry, ServiceCatalog, MaterialCatalog, PricingRules, Journey/DocumentState en AssetManifest. Bouw herbruikbare onderdelen, geen 160 losstaande mini-apps.
Prijsbasis: EUR 60,00 exclusief btw per medewerker per uur, bevestigd 9 oktober 2026; bij 21% EUR 72,60 incl. Materialen, vervoer, afvoer en huur zijn apart tenzij uitdrukkelijk inbegrepen. Publiceer alleen bevestigde regels; onbekend is “op aanvraag”, geen EUR 0. Interne inkoop/marges blijven afgeschermd.
Realiseer alle zonder externe toegang bouwbare functies. Voor operationele integraties: gebruik bestaande geautoriseerde infrastructuur, configureer adapters en werkende eerlijke aanvraagroutes. Geen nepportaal, nepbetalingen, verzonnen beschikbaarheid of succes zonder echte ontvangst. Meld werkelijke externe afhankelijkheden precies; verlaag niet uit gemak de verplichte 2D/3D of de betrouwbaarheid van aanvragen.
Werk zelfstandig door, test gericht en bewaak gebruik. Maak na samenhangende wijzigingen een compact checkpoint met huidige bestanden, eis-ID's, echte testresultaten, blokkades en volgende taak. Herstart dezelfde opdracht na een limiet. Activeer geen extra betaald gebruik en wijzig geen hosting/DNS/mailboxen zonder bestaande autorisatie.
Lever een daadwerkelijk gecontroleerde preview, screenshots desktop/mobiel, acceptatierapport en release-/rollbackprocedure. Een conceptbeeld of teststub is geen bewijs van een werkende productieflow.

## 1 Ontwerpvisie — een rustige voorkant met veel mogelijkheden
De bezoeker moet binnen enkele seconden zien wat SEAL doet, welk eigen werk dat bewijst en welke volgende stap past. Toon mogelijkheden geleidelijk per intentie. De 160 eisen zijn geen 160 knoppen op de homepage.
Startscherm biedt vier hoofdvragen: “Onderhoud nodig?”, “Iets herstellen?”, “Een onderdeel toevoegen?” en “Uw tuin opnieuw aanleggen?”. Ernaast staat “Ontwerp in 2D/3D” en een korte foto-aanvraag. Particulier en zakelijk krijgen passende routes.
Hero: bestaande groen/zand-identiteit, gecontroleerde beste eigen tuinfoto, korte kop, twee duidelijke acties. Dienstkaarten en projectcases hebben passende kaders en uitsneden. Detailbeeld ondersteunt uitleg over afwerking; bij onvoldoende beeldkwaliteit niet kunstmatig mooier genereren.
Grote configuratorpreview, compacte keuzehulp, vergelijkingtabel, projectinspiratie en werkwijze geven visuele afwisseling. Geen zware 3D-scène automatisch in de eerste hero, geen overdreven animatie, geen drukke reeks vinkjes of onbewijsbare badges.
Navigatie: Diensten / Ontwerp uw tuin / Materialen & prijzen / Projecten / Zakelijk / Over SEAL / Contact. “Uw project” verschijnt contextueel zodra er ontwerpdata is. Kennisbank, Werkwijze, Nazorg en Juridisch zijn logisch bereikbaar. Geen desktopmenu op telefoons proppen.
Uitklappers beantwoorden verdiepende vragen; hoofdprijs, voorwaarden vóór akkoord en belangrijke beperkingen worden niet onvindbaar verstopt.
Gebruik de design-, foto- en accessibilityregels uit v3.0. Houd een visuele componentinventaris bij: header, hero, servicecard, casecard, comparetable, accordion, stepper, formfield, upload, 3Dpanel, materialcard, statuspill, documentsummary, legalnotice, timeline, reviewlink en sticky actionbar. Eén component per patroon; dezelfde semantiek en vorm op alle routes.

## 2 Functieregister — 160 concrete opties en eisen
**F** = bouwbaar in frontend/gedeelde data; **B** = echte verwerking of veilige toegang via backend; **X** = bevestigde bedrijfsdata, externe bron/provider of juridische vaststelling nodig.
Dit zijn afhankelijkheidstags, geen door de gebruiker te starten fases. Iedere regel beschrijft gedrag dat bij oplevering aantoonbaar moet worden gecontroleerd. Status per ID: gebouwd/getest/extern geblokkeerd, met bewijs. Een B/X-regel wordt niet als klaar geteld door een dummyknop, mockrespons of alleen een tekst “later”.
Voor B/X zonder operationele toegang blijft de klant geholpen met een echt bruikbare ondersteunde contact-/aanvraagroute. Ontbrekende identiteit of juridisch beleid houdt bindende verkoop tegen; het ontwerp, de informatie en de niet-bindende intake kunnen verder worden gebouwd.

### A — Oriëntatie en snel de juiste route

| ID | Functie | Vereist gedrag / controle | Afhankelijkheid |
| --- | --- | --- | --- |
| A01 | Doelkeuze | Kies privacy, onderhoud, groen, herstel of complete aanleg; open de juiste dienst met keuze bewaard. | F |
| A02 | Particulier of zakelijk | Toon passende tekst en intake; wijzig route zonder ingevulde projectgegevens kwijt te raken. | F |
| A03 | Dienstzoeker | Zoek in echte diensten, materialen en kennisbank; toon relevante resultaten en bruikbare lege toestand. | F |
| A04 | Projectomvang | Kleine klus, deelrenovatie of complete tuin past de vragen aan; geen ongegronde minimumprijs. | F |
| A05 | Stijlkeuze | Modern, natuurlijk, groenrijk of rustig geeft passende eigen voorbeelden; geen verzonnen projecten. | F |
| A06 | Gebruik van de tuin | Zitten, spelen, toegankelijkheid en privacy worden wensen in het projectdossier. | F |
| A07 | Onderhoudswens | Weinig, normaal of intensief onderhoud beïnvloedt advies, niet automatisch levensduurclaims. | F |
| A08 | Snelle fotoaanvraag | Aanvragen zonder te tekenen; één contactkanaal, situatie en veilige fotobijlage. | B |
| A09 | Werkgebiedcontrole | Postcode koppelt aan bevestigd werkgebied; buitengebied geeft aanvraagroute, geen ongefundeerde toeslag. | F |
| A10 | Bel/WhatsApp/terugbelverzoek | Functionele contactlinks plus verwerkbaar terugbelverzoek; alleen bevestigde contactgegevens. | B |

### B — Intake die meedenkt

| ID | Functie | Vereist gedrag / controle | Afhankelijkheid |
| --- | --- | --- | --- |
| B01 | Dienstafhankelijke vragen | Onderhoud vraagt andere velden dan schutting; geen irrelevant verplicht telefoon-plus-emailpaar. | F |
| B02 | Maten nog onbekend | Kies onbekend; geen fictieve afmetingen of exact bedrag; opnamevraag blijft mogelijk. | F |
| B03 | Meethulp | Afbeelding/uitleg per lengte, hoogte, m² en poort; invoer voor mm/cm/m converteert correct. | F |
| B04 | Fotoaanwijzingen | Vraag overzicht, ondergrond, toegang en detail waar relevant; toon waarom een foto helpt. | F |
| B05 | Annotaties op situatiefoto | Teken aanwijzingen als aparte overlay; originele foto blijft origineel en data gaat veilig mee. | B |
| B06 | Situatiecheck | Ondergrond, hoogteverschillen, water en obstakels worden afzonderlijke velden met onbekend-optie. | F |
| B07 | Eigen materialen | Vraag systeem, merk/SKU, aantallen en foto; compatibiliteit is controlepunt, geen automatisch akkoord. | F |
| B08 | Budgetvoorkeur | Optioneel bedrag/band; gebruik voor overleg en vergelijking zonder kunstmatige aanbieding. | F |
| B09 | Timing en flexibiliteit | Gewenste periode en harde wensdatum apart; geen livebeschikbaarheid zonder echte planning. | F |
| B10 | Compleetheidsoverzicht | Markeer ontbrekende nuttige informatie zonder onnodig te blokkeren; geen schijnexactheidsscore. | F |

### C — Bestaande tuin en scope

| ID | Functie | Vereist gedrag / controle | Afhankelijkheid |
| --- | --- | --- | --- |
| C01 | Behouden | Markeer bestaande delen; niet opnieuw als materiaal/montage verkopen. | F |
| C02 | Herstellen | Kies reparatie als scope; systeem vraagt schade/toestand en geeft geen automatische nieuwe schutting. | F |
| C03 | Verwijderen | Sloop en afvoer worden aparte onderdelen in ontwerp, hoeveelheden en aanvraag. | F |
| C04 | Nieuw toevoegen | Nieuwe objecten zijn onderscheidbaar van bestaande; legenda en dossier blijven coherent. | F |
| C05 | Bestaande poort | Behoud opening, draairichting en aansluiting; geen nieuw poortartikel zonder keuze. | F |
| C06 | Waardevolle beplanting | Markeer behouden plant/boom/haag en werkzone; uitvoerder ziet beschermingsaandachtspunt. | F |
| C07 | Bekende kabels/leidingen | Leg beschikbare informatie vast; geen consumentcheckbox die onderzoeksplicht opheft. | F |
| C08 | Erfgrens en afspraken | Vraag bekende grens/afspraak; ontwerp is geen juridische grensbepaling of vergunning. | F |
| C09 | Werk door klant | Klantvoorbereiding heeft expliciete eigenaar, scope en controle; geen ongecontroleerde besparingskorting. | F |
| C10 | Gezamenlijke burenklus | Eén gemeenschappelijke scope met aparte contact-/kostenafspraken; persoonsgegevens niet onderling openbaar. | B |

### D — Tuin tekenen in 2D en 3D

| ID | Functie | Vereist gedrag / controle | Afhankelijkheid |
| --- | --- | --- | --- |
| D01 | Standaardvormen | Rechthoek, L en vrije contour hebben bewerkbare maten en hetzelfde oppervlak in beide views. | F |
| D02 | Vrije contour | Voeg/schuif hoekpunten, sluit polygon en blokkeer ongeldige zelfdoorsnijding met uitleg. | F |
| D03 | Alleen oppervlakte | Toon bekende m² zonder echte geometrie te verzinnen; voorbeeldvorm herkenbaar voorbeeld. | F |
| D04 | Schuttinglijnen | Meerdere verbonden lijnen/hoeken, werkelijke segmentlengtes en eenduidige paalregels. | F |
| D05 | Poorten | Breedte, positie en draairichting; zichtbare openzwaai en controle op geometrische overlap. | F |
| D06 | Bestratingsvlakken | Teken meerdere vlakken; overlap niet dubbel berekenen; behouden en nieuw apart. | F |
| D07 | Groenvakken | Borders, haagsegmenten en gazon als parametrische objecten; hoeveelheden volgen de juiste eenheid. | F |
| D08 | Bestaande obstakels | Huiswand, schuur en behouden boom als schematische referentie; geen verkoopartikel vanzelf. | F |
| D09 | 2D/3D-schakel | Wisselen behoudt selectie en state; fallback bij WebGL-probleem blijft bruikbaar. | F |
| D10 | Schets als referentie | Upload/import gecontroleerde rasterreferentie met handmatige schaal; geen automatische meetclaim. | B |

### E — Nauwkeurig bedienen en begrijpen

| ID | Functie | Vereist gedrag / controle | Afhankelijkheid |
| --- | --- | --- | --- |
| E01 | Selectie en eigenschappen | Klik/tik object en wijzig via leesbaar paneel; dezelfde actie kan met toetsenbord/invoer. | F |
| E02 | Snapping en grid | Optioneel raster/snap met zichtbare status; mm-precisie blijft behouden. | F |
| E03 | Maatlabels | Lengtes/hoogtes/oppervlakte correct formatteren en bij wijzigingen herberekenen. | F |
| E04 | Undo/redo | Herstel ten minste ontwerpacties deterministisch; prijs en materiaalstaat lopen mee terug. | F |
| E05 | Object vergrendelen | Bestaand te behouden object niet per ongeluk verplaatsen; ontgrendelen expliciet. | F |
| E06 | Dupliceren en uitlijnen | Kopieer objecten met nieuwe ID, behoud materiaal; geen overlappende kosten zonder waarschuwing. | F |
| E07 | Aanzichten en reset | Boven, voor en perspectief; reset camera wijzigt geen ontwerp. | F |
| E08 | Mobiele canvasmodus | Vergroot werkvlak, duidelijke terugactie; scroll/zoom veroorzaakt geen onbedoelde objectverplaatsing. | F |
| E09 | Zon-/schaduwillustratie | Eenvoudige instelbare lichtstand, gelabeld als illustratie; geen locatie-exacte zonstudie zonder geodata/model. | F |
| E10 | Automatisch opslaan | Alleen niet-persoonlijke ontwerpstate, herstelbericht en expliciet wissen; geen klantfoto's/CV lokaal archiveren. | F |

### F — Materialen kiezen en rekenen

| ID | Functie | Vereist gedrag / controle | Afhankelijkheid |
| --- | --- | --- | --- |
| F01 | Materiaalcatalogus | Werkelijke SKU's en systemen met foto, maat, eigenschap en verkoopprijsstatus. | F |
| F02 | Swatches | Kleur/structuur verandert geselecteerd object; schermkleur is indicatie, sample kan verschillen. | F |
| F03 | Drievoudige vergelijking | Maximaal drie opties met onderhoud, opbouw, leverstatus, prijsbasis en bronnen. | F |
| F04 | Onderhoudsvergelijking | Concrete handelingen en frequentievoorwaarden, geen marketingsterren of onderhoudsvrij-overclaim. | F |
| F05 | Productcompatibiliteit | Palen, panelen, beslag en poortmatch vanuit systeemregels; fout heeft begrijpelijke oplossing. | F |
| F06 | Legverband en formaat | Bestratingspatroon/rotatie/tegelformaat beïnvloedt hoeveelheden via gecontroleerde geometrie. | F |
| F07 | Snij-/restmateriaal | Splits vereist materiaal en onderbouwde reserve; geen universeel afvalpercentage. | F |
| F08 | Levertijd en voorraadstatus | Geverifieerde datum/status of op aanvraag; frontend verzint geen voorraad. | X |
| F09 | Materiaalsample | Aanvraag voor werkelijk beschikbaar sample met kosten/voorwaarden; geen nepbestelling. | B |
| F10 | Materiaalstaat export | Aantallen, eenheden, systeem, prijsstatus en eigen merk; geen vertrouwelijke inkoop. | F |

### G — Budget, prijzen en alternatieven

| ID | Functie | Vereist gedrag / controle | Afhankelijkheid |
| --- | --- | --- | --- |
| G01 | Uurprijs helder | EUR 60 excl. per medewerker; EUR 72,60 incl. 21%; vermeld aparte posten. | F |
| G02 | Materiaal versus montage | Apart overzicht voor alleen materiaal, montage met eigen materiaal en compleet. | F |
| G03 | Bevestigde subtotalen | Tel bekende regels; verplichte onbekende posten blijven zichtbaar buiten een volledig totaal. | F |
| G04 | Op aanvraag | Unknown is null met reden en benodigde gegevens; nooit automatisch gratis. | F |
| G05 | Prijspeildatum | Artikelen hebben checkedAt/validUntil; verlopen prijs blokkeert bindend gebruik. | F |
| G06 | Varianten A/B/C | Vergelijk dezelfde geometrie met andere keuzes; toon welke scope wijzigt. | F |
| G07 | Budgetverschil | Toon berekend verschil alleen bij vergelijkbare bekende prijsregels; noem onbekende impact. | F |
| G08 | Alternatief voorstel | Suggestie uit compatibele catalogus; gebruiker kiest, geen stille productwissel. | F |
| G09 | Kostenfactoren | Toegang, verwijderen, onderbouw en afval uitlegbaar; geen willekeurige automatische toeslag. | F |
| G10 | Prijscheck aanvragen | Complete variant/materiaalstaat naar SEAL voor controle; geen direct bindende offerte uit onzekerheden. | B |

### H — Groen en onderhoud

| ID | Functie | Vereist gedrag / controle | Afhankelijkheid |
| --- | --- | --- | --- |
| H01 | Plantprofiel | Licht, bodem, beschikbare ruimte en onderhoudswens; geen ongetoetste plantgarantie. | F |
| H02 | Plantkeuze | Gecontroleerde catalogus met soort/cultivar, volwassen maatband en onderhoud; bronstatus zichtbaar. | F |
| H03 | Jaarrond interesse | Vergelijk groenblijvend, bloeiperiode en kleur op geverifieerde kenmerken. | F |
| H04 | Haagcalculator | Lengte, gewenste grootte en gecontroleerde plantafstand leveren aantallen; onbekende norm op aanvraag. | F |
| H05 | Gazonroute | Maaien, herstel, inzaaien of zoden; leg bestaande toestand en juiste maten vast. | F |
| H06 | Onkruidroute | Bestrating/border/erfgrens, type begroeiing en achterstand bepalen intake; geen permanent-vrij-belofte. | F |
| H07 | Snoeikeuze | Haag/struik/boom en gewenste ingreep; specialistisch werk alleen bevestigd aanbod. | F |
| H08 | Eenmalig of periodiek | Maak heldere routekeuze; vaste frequentie en tarief pas na passende afspraak. | F |
| H09 | Mijn onderhoudskalender | Plan voor gekozen/uitgevoerde tuin met geverifieerde soortinformatie; lokale export mogelijk. | F |
| H10 | Extra onderhoud aanvragen | Selecteer taken vanuit eerdere scope via veilige projectroute; geen ongeautoriseerde nieuwe opdracht. | B |

### I — Inspiratie en fotografie

| ID | Functie | Vereist gedrag / controle | Afhankelijkheid |
| --- | --- | --- | --- |
| I01 | Projectfilters | Dienst, materiaal en relevante stijl; tags passen bij echte beeldinhoud. | F |
| I02 | Projectverhaal | Vraag, aanpak, keuzes en resultaat met bevestigd openbaar bereik; geen klantadres standaard. | F |
| I03 | Detailbeelden | Toon voegen, aansluitingen, palen en afwerking met passende eigen foto. | F |
| I04 | Voor/na-slider | Alleen dezelfde locatie/ingreep, toegankelijk met knop/invoer en alternatief naast elkaar. | F |
| I05 | Fotolightbox | Juiste volgorde, captions, zoom waar bruikbaar en focusherstel; geen fout categorielabel. | F |
| I06 | Inspiratie bewaren | Bewaar eigen case/material-ID's zonder accountplicht; geen klantfoto's in openbaar moodboard. | F |
| I07 | Moodboard | Combineer gekozen eigen cases en materialen tot overzicht; noteer bron/visuele indicatie. | F |
| I08 | Gebruik als inspiratie | Neem stijl/materialen over, niet klantmaten, adres of persoonsgegevens. | F |
| I09 | Foto's beheren | Focal point/uitsnede/alt in manifest; origineel behouden, responsive afgeleiden reproduceerbaar. | F |
| I10 | Foto toestemming | Afzonderlijke publicatietoestemming beheren; weigering wijzigt offerte of service niet. | B |

### J — Voorbereiding, levering en planning

| ID | Functie | Vereist gedrag / controle | Afhankelijkheid |
| --- | --- | --- | --- |
| J01 | Bereikbaarheidscheck | Achterom, breedte, trappen, loopafstand en obstakels gaan mee in dossier. | F |
| J02 | Afvalkeuze | Klantcontainer, SEAL-afvoer of laten liggen; afvalstroom en verantwoordelijke apart. | F |
| J03 | Afvalhoeveelheden | Geometrische volumeindicatie met onzekerheid; gewicht/tarief pas betrouwbaar na materiaaldata. | F |
| J04 | Machine-/handwerkroute | Vastgelegde toegang leidt tot uitvoeringsaandachtspunt; geen automatische haalbaarheidsclaim. | F |
| J05 | Levering of afhalen | Alleen werkelijk beschikbare route; leverkosten en loslocatie expliciet. | X |
| J06 | Parkeren en lossen | Vraag mogelijkheden, beperkte tijden en bekende toestemming; geen boetevrij-belofte. | F |
| J07 | Klantvoorbereiding | Dienstspecifieke checklist met eigenaar en gereedmelding. | B |
| J08 | Opname aanvragen | Voorkeurmomenten of echte agenda; geen automatisch bevestigde afspraak zonder kalender. | B |
| J09 | Planning en weer | Bevestigde status en eventuele verplaatsingsreden; geen generieke weersgarantie. | B |
| J10 | Verplaatsen verzoek | Vraag wijziging met project-ID; voorwaarden en mogelijke kosten gecontroleerd, geen automatische boete. | B |

### K — Offerte en opdracht

| ID | Functie | Vereist gedrag / controle | Afhankelijkheid |
| --- | --- | --- | --- |
| K01 | Volledig projectdossier | Ontwerp, maten, scope, materiaal, onzekerheden en foto's gekoppeld aan één ID. | B |
| K02 | Prijssoort | Vast, richtprijs, regie en stelpost expliciet per relevante afspraak. | B |
| K03 | Scopecheck vóór akkoord | Inbegrepen, uitgesloten, behouden en klantwerk zijn zichtbaar vóór de opdracht. | B |
| K04 | Offerteversies | Vaste PDF/snapshot per versie; geaccepteerde versie niet overschrijven. | B |
| K05 | Voorwaarden vooraf | Toepasselijke PDF met versie/datum vóór akkoord toegankelijk en bewaarbaar. | B |
| K06 | Akkoord vastleggen | Identiteit, versie, bedrag, voorwaarden en relevante toestemmingen aantoonbaar. | B |
| K07 | Vraag bij offerte | Vraag aan specifiek onderdeel zonder bestaande scope stilzwijgend wijzigen. | B |
| K08 | Meer-/minderwerk | Nieuw voorstel met reden, bedrag en planning; akkoord vóór uitvoeren waar vereist. | B |
| K09 | Vroeg starten | Aparte actieve startkeuze en toepasselijke bedenktijdinformatie, duurzaam bevestigd. | B |
| K10 | Herroepen/opzeggen | Heldere toepasselijke route, ontvangstbevestiging en geen onnodige account-/motivatieplicht. | B |

### L — Klantdossier en uitvoering

| ID | Functie | Vereist gedrag / controle | Afhankelijkheid |
| --- | --- | --- | --- |
| L01 | Veilige projecttoegang | Ingelogde of kortlevende gecontroleerde link; nooit openbaar voorspelbaar project-ID. | B |
| L02 | Echte tijdlijn | Alleen status uit workflow: ontvangen, controleren, offerte, akkoord, gepland, uitvoering, oplevering. | B |
| L03 | Documentenmap | Eigen offertes, plannen, afspraken en facturen downloaden; servercontrole per klant. | B |
| L04 | Planningsoverzicht | Bevestigde afspraken en contactpunt; voorkeursdatum niet als toezegging tonen. | B |
| L05 | Berichten per project | Vragen en antwoorden gekoppeld, met veilige notificatie; geen losse publiek leesbare chat. | B |
| L06 | Wijziging aanvragen | Projectwijziging creëert verzoek, geen directe opdracht of ongecontroleerde prijswijziging. | B |
| L07 | Uitvoeringsfoto's | Veilig bewijs voor eigen project; datum/context, geen publicatie zonder grondslag/toestemming. | B |
| L08 | Werkbon | Scope, inzet, materialen en aandachtspunten voor juiste medewerker; geen intern kostprijslek. | B |
| L09 | Gereedmelding | Uitvoerder meldt gereed; klant kan inspectiepunten opgeven. | B |
| L10 | Contact zonder portaal | Gelijkwaardige telefoon/emailroute voor klanten die geen account willen. | B |

### M — Oplevering en nazorg

| ID | Functie | Vereist gedrag / controle | Afhankelijkheid |
| --- | --- | --- | --- |
| M01 | Opleverchecklist | Lijnvoering, montage, afwerking en afgesproken scope aantoonbaar nalopen. | B |
| M02 | Aandachtspunten | Leg restpunten en afspraak vast; geen impliciete afstand van wettelijke rechten. | B |
| M03 | Opleverdossier | Definitief ontwerp, uitgevoerde materialen en onderhoudsadvies bijeen. | B |
| M04 | Onderhoudsadvies per product | Gebonden aan geleverd SKU/systeem en fabrikant, niet generiek universeel. | F |
| M05 | Garantiekaart | Fabrikantsgarantie, eventuele vastgestelde SEAL-garantie en wettelijke rechten onderscheiden. | F |
| M06 | Serviceverzoek | Klant kiest klacht/onderhoud/herstel met foto's; ontvangstreferentie en juiste verwerking. | B |
| M07 | Klachtenroute | Contact, beoordeling en vervolgstap duidelijk; geen niet-bestaande geschillenlidmaatschappen. | B |
| M08 | Onderhoudsherinnering | Alleen passende toestemming/afspraak; lokaal kalenderbestand of echte notificatie. | B |
| M09 | Reviewverzoek | Echte klant naar bevestigd kanaal; geen sterren verzinnen of negatieve reviews wegfilteren. | B |
| M10 | Nieuw project uit vorige tuin | Dupliceer eigen niet-persoonlijke ontwerpdata na bevoegdheid; huidige prijs opnieuw controleren. | B |

### N — Rechten, privacy en vertrouwen

| ID | Functie | Vereist gedrag / controle | Afhankelijkheid |
| --- | --- | --- | --- |
| N01 | Bedrijfsinformatie | Geverifieerde handels/juridische naam, adres, KvK, btw-id en contact consistent. | F |
| N02 | Consumentenvoorwaarden | Eigen beoordeeld concept met juiste scope, versie en beschikbaarheid vóór akkoord. | X |
| N03 | Zakelijke voorwaarden | Aparte klantsoort met juridisch gecontroleerde regels; geen automatische B2B-ontheffing voor iedereen. | X |
| N04 | Privacyverklaring | Doelen, grondslagen, ontvangers, bewaartermijnen, rechten en aanspreekpunt sluiten aan op systeem. | X |
| N05 | Cookiekeuzes | Noodzakelijke functies bruikbaar; weigeren/intrekken eenvoudig; tracking niet vooraf aan. | F |
| N06 | Toestemmingen gescheiden | Contract, vroeg starten, marketing en projectpublicatie afzonderlijk; geen vooraf aangevinkte bundel. | B |
| N07 | Bewaarbeleid | Factuurplicht versus aanvraag/foto/CV apart; automatische verwijder-/archiefregels gecontroleerd. | B |
| N08 | Uitleg ontwerp en prijs | Visualisatie en indicatie correct gelabeld; disclaimer heft deskundigheidsplichten niet op. | F |
| N09 | Vergunning-/grensroute | Link naar actuele officiële controle en bespreek verantwoordelijkheden; geen juridisch groen vinkje uit 3D. | X |
| N10 | Toegankelijkheid | Toetsenbord, focus, contrast, labels, drag-alternatieven en leesbare tabellen daadwerkelijk testen. | F |

### O — Zakelijk en samenwerken

| ID | Functie | Vereist gedrag / controle | Afhankelijkheid |
| --- | --- | --- | --- |
| O01 | Aannemerintake | Project, bestek, planning, locatie en scope relevant; veilige bijlagen. | B |
| O02 | VvE/beheerroute | Contact/bevoegdheid, terrein en onderhoudswens; meer personen niet ongecontroleerd toegang geven. | B |
| O03 | Materiaal door hoofdaannemer | Compatibiliteit, levering en montage-eigenaarschap vastleggen. | F |
| O04 | Onderhoud per locatie | Locaties met aparte scope en planning; privacy/toegang per opdrachtgever. | B |
| O05 | B2B offertestructuur | Referentie/PO, excl./incl. en btwregel correct; reverse charge alleen gecontroleerd. | B |
| O06 | Aanbestedings-/bestekbijlage | Upload ondersteunde bestanden; beperkte grootte en gecontroleerde inhoud. | B |
| O07 | Vakmanprofiel | Vakgebied, regio, beschikbaarheid en ervaring; geen openbaar CV automatisch. | B |
| O08 | Certificaten ontvangen | Optionele beveiligde upload; noem bedrijf niet gecertificeerd door aanvraag van een derde. | B |
| O09 | Samenwerkingsaanvraag | Eigen pipeline, gegevensminimalisatie en passende reactieroute. | B |
| O10 | Projectrol en toegang | Aannemer, klant en uitvoerder zien alleen geautoriseerde onderdelen. | B |

### P — Administratie en bedrijfsvoering

| ID | Functie | Vereist gedrag / controle | Afhankelijkheid |
| --- | --- | --- | --- |
| P01 | Calculatie intern | Verkoop, kostprijs, inzet en marge privé; regels gecontroleerd en geen AI-verzonnen nummers. | B |
| P02 | Urenregistratie | Persoonsuren per taak en wijzigingshistorie; alleen voor afgesproken prijssoort factureerbaar. | B |
| P03 | Inkoopcontrole | Leverancier, prijsdatum, SKU en aantallen; goedkeuring voordat marge/prijs gepubliceerd wordt. | B |
| P04 | Offertegenerator | Snapshot, nummer, geldigheid, bedragen, scope en logo vanuit één dossier. | B |
| P05 | Opdrachtbevestiging | Geaccepteerde versie en relevante afspraken duurzaam beschikbaar. | B |
| P06 | Facturen | Unieke opeenvolgende nummerreeks server/boekhouding; correcte btw en prestatiedatum. | B |
| P07 | Termijnen en betalingen | Werkelijk overeengekomen schema, openstaand bedrag en verwerkte betaling; geen browserstatus als betaald. | B |
| P08 | Credit-/correctiedocument | Referentie origineel, reden en bedragen; geen oude verstuurde factuur stilzwijgend wijzigen. | B |
| P09 | Boekhoudingexport | Veilige mapping naar gekozen pakket of controleerbare export; geen klantdata in openbare repo. | B |
| P10 | Audit en back-up | Wie/wat/wanneer, minimale gegevens, hersteltest en versies; geen onnodige complete payloadlogging. | B |

## 3 Informatie, teksten en commerciële routes vooraf uitgewerkt
Maak gepubliceerde servicepagina's uit ServiceCatalog. Iedere record bevat: id/slug, titel, klantwens, korte uitleg, signals, behoud/herstelalternatieven, options, scope, exclusions, pricePolicyId, situationQuestions, preparation, aftercare, faq, caseIds, assetIds en offerStatus.
Gebruik geen 160 handmatig gekopieerde pagina's. Eén diensttemplate, één projecttemplate, één materialtemplate, één kennistemplate en één formulier/wizard-renderer zijn voldoende om de rijke scope te dragen. Sla teksten als controleerbare data op; semantische HTML en directe routes blijven werken.

### Klaarstaande dienstintro's en keuzevragen
| Dienst | Intro voor de pagina | Vragen die de klant helpen |
| --- | --- | --- |
| Onkruid verwijderen | Ongewenste begroeiing tussen tegels, in borders of langs de erfgrens vraagt een passende aanpak. We bekijken waar het groeit, wat moet blijven en hoeveel achterstand er is. | Waar groeit het? Hoe groot is het gedeelte? Wat behouden? Afvoer nodig? |
| Heggen en hagen | Een verzorgde haag geeft structuur en privacy. De gewenste vorm, bestaande toestand en soort bepalen welke snoei verantwoord is. | Lengte/hoogte? Gewenste ingreep? Toegang aan beide kanten? Bekende soort? |
| Snoeiwerk | We stemmen snoei af op de plant en uw wens. Een kleine onderhoudsingreep is iets anders dan sterk terugzetten of specialistisch boomwerk. | Welke planten? Behouden vorm? Schade of achterstand? Foto's? |
| Gazononderhoud | Een gezond gazon vraagt passende verzorging. We kijken of regulier onderhoud, herstel of nieuwe aanleg de beste route is. | Oppervlakte? Kale plekken/mos? Licht en gebruik? Huidige aanpak? |
| Borders en beplanting | Groen maakt een tuin persoonlijk. We kiezen samen een passende opbouw voor ruimte, licht, bodem en de hoeveelheid onderhoud die u wilt. | Licht? Bodem bekend? Kleur/bloeiperiode? Volwassen ruimte? |
| Periodiek onderhoud | U kiest wat u zelf blijft doen en welke werkzaamheden u wilt uitbesteden. We leggen taken, frequentie en afvoer vooraf vast. | Welke taken? Frequentie? Tuinomvang? Startbeurt nodig? |
| Achterstallige tuin | We brengen eerst de bestaande situatie in kaart: wat waardevol is, wat vrijgemaakt moet worden en hoe afval wordt verwerkt. | Welke delen aanpakken? Wat behouden? Obstakels? Bereikbaarheid? |
| Schuttingen | Meer privacy of een erfafscheiding die toe is aan herstel? Vergelijk hout, hout-beton en composiet op uitstraling, opbouw en onderhoud. | Lengte/hoogte? Bestaande delen? Hoeken/poort? Materiaal? |
| Poorten | Een poort moet passen bij de schutting én vrij kunnen openen. Breedte, draairichting en aansluiting bepalen de uitwerking. | Breedte? Draairichting? Nieuw/bestaand? Ondergrond/hoogte? |
| Bestrating | Een terras, pad of oprit begint met goed gebruik en een passende onderbouw. Vorm, materiaal en bestaande situatie beïnvloeden aanpak en prijs. | m²/vorm? Tegel/formaat? Gebruik/belasting? Oude bestrating? |
| Herleggen en herstellen | Soms kan bestaande bestrating opnieuw worden gebruikt. We bekijken de toestand en oorzaak voordat alleen het zichtbare probleem wordt aangepakt. | Verzakkingen? Herbruikbare stenen? Onderbouw? Afwatering? |
| Complete tuinaanleg | Begin met uw wensen voor zitten, groen, privacy, toegankelijkheid en onderhoud. Het ontwerp verbindt alle onderdelen in één plan. | Gebruik? Behouden? Budgetrichting? Maten? Onderhoudswens? |
| Zakelijk onderhoud | Bedrijfsterrein, vastgoed of VvE-groen vraagt heldere afspraken over taken, contact, locaties en planning. | Opdrachtgever/bevoegdheid? Locaties? Scope? Frequentie? |
| Alleen montage | U heeft de materialen al? We controleren systeem, aantallen en situatie voordat montage wordt bevestigd. | Merk/SKU? Compleet geleverd? Maten? Compatibiliteit? |
Alle teksten worden aan daadwerkelijk aanbod gekoppeld. Specialistische disciplines krijgen geen verkooppagina alsof ze beschikbaar zijn wanneer uitvoering niet bevestigd is.

### Drie complete klantreizen
1. **Onderhoud:** doel kiezen → situatie/foto's → te behouden groen → omvang/afvoer → prijsbasis → aanvraag → ontvangst → afspraak/offerte → uitvoering → oplevering → factuur → onderhoudsadvies.
2. **Ontwerp/aanleg:** inspiratie → 2D/3D → materialen/varianten → bestaande situatie/toegang → bekende/ongekende kosten → ontwerpcheck/aanvraag → opname → versievaste offerte → akkoord → voorbereiding/planning → uitvoeren/meerwerk → opleverdossier → factuur/nazorg.
3. **Zakelijk:** rol/organisatie → locatie/bestek → scope/eigen materiaal → timing/toegang → documenten → prijs-/btwcontrole → offerte/PO → opdracht → werkbonnen → oplevering → factuur/archief.
Er is geen verplichte account- of 3D-route om een kleine klus aan te vragen.

## 4 Bouwarchitectuur — 160 eisen uit acht samenhangende bouwblokken
Kies techniek na inspectie, niet uit gewoonte. De bestaande statische frontend kan worden behouden; echte private verwerking vraagt een backend. Verplaats niet automatisch de hele website.
| Bouwblok | Draagt | Hergebruik |
| --- | --- | --- |
| Content + AssetManifest | Diensten, kennis, cases, fotografie, juridisch | Datagedreven templates en gevalideerde manifesten |
| Shared ProjectState + geometry | 2D/3D, behouden/verwijderen/nieuw, varianten | Pure geometrie, versioned serialization |
| MaterialCatalog + PricingRules | SKU, compatibiliteit, hoeveelheden, prijsstatus | Eén rekenpad en public/private scheiding |
| Intake/Submission service | Foto's, context, contact, vraagroutes | Eén schema met serviceafhankelijke vragen |
| Identity + Media service | Projecttoegang, veilige bestanden | Bestaande auth/storageprovider; autorisatie per object |
| Journey + Quote/Change service | Statussen, offertes, akkoord, meerwerk | Eén gecontroleerde state machine |
| Document + Finance adapter | PDF's, facturen, credit, boekhouding | Documenttemplates, bestaande boekhouding indien aanwezig |
| Communication + Admin | Ontvangst, werkbon, nazorg, configuratie | Eén notifier, rollen, audit, beheerregels |

Een plugin is geen architectuur. Geen chatbot, AI-agent, AR-app, live realtime multiplayer, voorraad-ERP of zelfgebouwd volledig boekhoudpakket toevoegen enkel om indruk te maken. Alle rijke klantfuncties moeten helpen kiezen, uitvoeren of opvolgen.
AI mag ondersteunen met gecontroleerde tekst of interne samenvatting. Een deterministisch rekenmodel beslist aantallen en bedragen; een AI-antwoord mag niet zelfstandig contractprijs, garantie, factuurnummer of vergunningstatus bepalen.
Frontendgrenzen: alleen publieke catalogus, klantprijzen en niet-persoonlijke ontwerpstate. Private DTO: inkoop, marges, klantdossier, bestek, offerteakkoord, documenten, leverancierssleutels en sollicitaties. Test dat private DTO's nooit in build/network/public sources terechtkomen.
Gebruik kleine onderhouden dependencies alleen waar ze werk en onderhoud besparen: bestaande Three.js voor 3D; schema-validation waar al aanwezig of passend; bestaande PDF-/auth-/email-/storageadapter. Een eigen simpele printtemplate kan documentpreview dragen. Pin versies; geen ongepinde CDN's. React/Next.js is geen verplichting als de bestaande stack voldoet.

## 5 Gegevenscontracten — één bron voor iedere weergave
### Project
Project = schemaVersion, projectId, ownerAccessRef, customerType, serviceIds, route, siteProfile, geometry, objects, variants, materialSelections, quantities, priceSnapshot, assumptions, unknowns, situation, removalPlan, wastePlan, accessPlan, clientPreparation, desiredTiming, assets, contact, permissions, status en documentRefs.
Niet ieder veld gaat naar publieke export. Contact/foto's/auth zitten niet in niet-persoonlijke localStorage. Gebruik DTO's per doel met allowlist, geen alles-serialisatie.
Object = id, type, status(existingKeep/existingRepair/remove/new), geometryMm, materialId?, locked, measuredOrEstimated, source, quantityRulesRef. PriceSnapshot verandert niet ongemerkt bij een geaccepteerde offerte.
SiteProfile legt beschikbare maten, bodem/hoogte/afwatering, toegang en bekende bijzonderheden vast. Unknown blijft unknown. Schematische 3D-zon/groeivolumes worden niet als bouwkundige of botanische analyse verkocht.

### Prijsregel
PriceLine = id, item/serviceRef, description, quantity, unit, sourceStatus, unitSaleExclCents, vatCode, taxAmountCents, totalInclCents, scope, exclusions, checkedAt, validUntil, reviewRequired, confidenceReason.
PrivatePricingLine = purchase/handling/transport/labourCost/margin regels in afgeschermde opslag. Basistarief is verkoop, geen arbeidskost.
Quantity derivation is reproduceerbaar. Zelfde geometrie levert dezelfde materiaalstaat in 2D, 3D, export, aanvraag en servercontrole. Log foutoorzaken zonder gegevensdumps.
Geef geen alomvattend "exact totaal" wanneer noodzakelijke kosten ontbreken. Toon bevestigde onderdelen en de reden voor opname/prijscontrole.
### Document en toestemming
Document = documentId, type, sequenceRef?, version, projectId, status, issuedAt, immutablePayloadHash, templateVersion, termsVersion, taxSummary, attachments en accessPolicy.
PermissionRecord = purpose, presentedTextVersion, choice, actorRef, timestamp, confirmationRef; eventuele technische metadata beperkt en met grondslag. Niet alle verwerking berust op toestemming; contractuitvoering en wettelijke administratie zijn aparte grondslagen.
Een selectievak "privacy gelezen" is geen toestemming voor marketing of vrijbrief voor alle verwerking. Een offerteakkoord is geen fotopublicatietoestemming.

## 6 Juridische inrichting — concreet proces vóór contract
Deze sectie is een implementatiespecificatie met oorspronkelijke conceptteksten. Definitieve voorwaarden hangen af van juridische identiteit, aanbod, verzekeringen en gekozen afspraken; laat die juridisch beoordelen voor bindende publicatie. De website kan ondertussen volledig worden voorbereid.
Juridische bescherming ontstaat door passende afspraken, tijdige informatie, vakzorg en bewijs van wat is besloten. Een footerdisclaimer heft geen wettelijke verplichtingen op.
### Verplichte documenten/routes
| Document / route | Inhoud en moment |
| --- | --- |
| Bedrijfsinformatie | Geverifieerde identiteit/contact, consistent met offerte/factuur |
| Consumentenvoorwaarden | Eigen versie, werk en materiaal onderscheiden, vóór akkoord bewaarbaar |
| Zakelijke voorwaarden | Passende B2B-afspraken; geen ongemotiveerde kopie van B2C |
| Privacyverklaring | Werkelijke gegevensstromen, grondslagen, termijnen, ontvangers en rechten |
| Cookiebeleid/instellingen | Werkelijk gebruikte trackers, keuze en intrekken |
| Offerte/opdrachtbevestiging | Projectspecifieke scope/prijs/planning plus toepasselijke voorwaarden |
| Meer-/minderwerkvoorstel | Wijziging, reden, gevolgen en vastgelegd akkoord |
| Herroepingsinformatie/functie | Waar wettelijke bedenktijd geldt; ontvangst duurzaam bevestigen |
| Klachten/nazorg | Werkende ingang, ontvangst, behandeling en vervolg |
| Opleverdocument | Controle, restpunten, afspraken; wettelijke rechten behouden |
| Factuur/creditfactuur | Correcte administratie en oorspronkelijke documenten behouden |

### Algemene voorwaarden — inhoudelijke structuur en beschermingsregels
Onderstaande 24 artikelen zijn een EIGEN CONCEPT voor uitwerking in klanttaal en juridische toets, geen kopie van een branchelid of concurrent.
1. **Partijen en toepasselijkheid.** Identificeer SEAL met bevestigde juridische/handelsnaam, adres, KvK en btw-id. Beschrijf diensten en eventuele materiaalverkoop. Vermeld versiedatum en wanneer de klant de voorwaarden ontvangt.
2. **Opdracht en documentvolgorde.** Projectspecifieke afspraken komen in offerte/opdracht. Leg documentvolgorde vast; individuele afwijkingen schriftelijk. Een vrijblijvende intake of ontwerp is niet vanzelf een opdracht.
3. **Offerte en geldigheid.** Vermeld werk, hoeveelheden, materialen, inbegrepen/uitgesloten delen, onbekenden en geldigheid. Kies een geldigheidsduur als bevestigde bedrijfsinstelling, niet een willekeurige termijn.
4. **Prijssoort en btw.** Maak vaste prijs, richtprijs en regie herkenbaar. Consument ziet bedragen inclusief toepasselijke btw en bijkomende kosten. Btw en stelposten worden niet in kleine letters verborgen.
5. **Inmeting en klantinformatie.** Klant deelt bekende omstandigheden. SEAL controleert informatie waar professionele zorg dat verlangt en waarschuwt voor herkenbare fouten; verantwoordelijkheden niet geheel op klant afschuiven.
6. **Ontwerp en visualisatie.** 2D/3D ondersteunt keuzes; echte maatvoering, kleuren, materialen en montage worden gecontroleerd. Een schematische weergave is geen definitieve vergunning-, fundering-, zon- of groeistudie.
7. **Erfgrens en gezamenlijke opdracht.** Leg gewenste lijn, bevoegdheid en burenafspraak vast. Gezamenlijke scope, opdrachtgevers en factuurverdeling krijgen expliciete afspraken; geen stilzwijgende volledige aansprakelijkheid voor de buur.
8. **Toestemming en vergunning.** Verdeel controle en aanvraag passend aan de klus. Voeg actuele officiële checkroute toe. Een schutting onder 2 m is niet automatisch in alle opzichten vergunningvrij; locatie- en omgevingsregels kunnen verschillen.
9. **Voorbereiding en toegang.** Spreek af wat klant/SEAL voorbereidt, werkroute, parkeer-/losplek, eventuele water/elektra en veilige werkruimte. Extra inzet wordt gecontroleerd en besproken, niet direct als willekeurige toeslag afgeschreven.
10. **Graven en verborgen omstandigheden.** Controleer benodigde kabel-/leidinginformatie en werkwijze. Leg onverwachte obstakels vast en bespreek aanpak. Machinaal graven vraagt de relevante KLIC-procedure; een klantcheckbox vervangt die niet.
11. **Gevaarlijke/onbekende situatie.** Bij asbestverdacht materiaal, ernstige verontreiniging, gevaarlijke kabels of werk buiten competentie: veilig stoppen, documenteren en passende specialist. Geen bindende diagnose of willekeurige meerwerkfactuur.
12. **Eigen materiaal klant.** Materiaal, compleetheid, opslag, levering en compatibiliteit vooraf controleren. Waarschuw voor ongeschiktheid. Afspraken over materiaalgebrek ontslaan SEAL niet van montage-/waarschuwingsplichten.
13. **Door SEAL geleverd materiaal.** SKU/systeem, kwaliteit, levering, transport en lossing vastleggen. Alternatief alleen na passende informatie en akkoord; geen stille wissel door voorraadprobleem.
14. **Planning en omstandigheden.** Onderscheid voorkeursdatum, planningindicatie en bevestigde afspraak. Geef verandering en gevolgen tijdig door. Normale weersinvloed is geen automatische onbeperkte overmachtsvrijstelling.
15. **Meer- en minderwerk.** Leg wijziging en prijs-/planningsgevolgen vooraf vast; laat akkoord volgen waar vereist. Bewaak richtprijsafspraken tijdig. Geen generieke clausule “alle tegenvallers voor klant” of automatische 10%-toeslag.
16. **Uitvoering en onderaannemers.** Werk binnen afgesproken kwaliteit en competentie. Leg aanspreekpunt en rol vast. Noem certificering/verzekering alleen als bevestigd en toepasselijk.
17. **Afval en werkplek.** Benoem afvalstromen, verantwoordelijke, container, bijzondere afvoer en opruimniveau. Geen dubbele kosten voor reeds inbegrepen afvoer; milieuregels en eventuele gevaarlijke stromen apart behandelen.
18. **Oplevering.** Meld gereed, loop afgesproken scope na en leg aandachtspunten vast. Akkoord betekent geen afstand van rechten voor gebreken die juridisch nog aan de orde kunnen zijn. Geen absolute 24-/48-uursklachtdeadline.
19. **Onderhoud en levend groen.** Geef product-/soortspecifieke zorginstructies en leg de verantwoordelijke vast. Beoordeel oorzaak bij schade of uitval; sluit niet automatisch alle planten of alle garantie uit.
20. **Garantie en klachten.** Onderscheid wettelijke rechten, fabrikantsgarantie en uitsluitend vastgestelde eigen garantie. Werkende meldroute, redelijke behandeling en passende herstelafspraken; geen niet-bestaande geschillenregeling of VHG-lidmaatschapsclaim.
21. **Factuur en betaling.** Werk wordt netjes gedocumenteerd en gefactureerd. Betalingsschema, termijn, betaalbestemming en eventueel voorschot staan vóór akkoord vast. Neem een historische afspraak “betalen op opleverdag” niet automatisch als universeel nieuw beleid over.
22. **Herroeping, annuleren en opzeggen.** Verschillende juridische routes hebben verschillende voorwaarden. Pas de wettelijke route toe waar relevant, met noodzakelijke informatie en actieve toestemming voor vroeg starten. Geen universele boete of “alle configuraties zijn maatwerk”.
23. **Aansprakelijkheid en verzekering.** Gebruik alleen juridisch passende clausules voor klantsoort en werkzaamheden. Beperking mag verplichte consumentenrechten of aansprakelijkheid niet onrechtmatig uitsluiten. Noem verzekeringsdekking na verificatie; geen fictief plafond.
24. **Privacy, geschillen en wijzigingen.** Verwijs naar privacybeleid; marketing/fotopublicatie los van opdracht. Een latere voorwaardenversie verandert bestaande opdrachten niet stilzwijgend. Geschilroute en toepasselijk recht voldoen aan consumentenbescherming.

### Wat de bronnen concreet veranderen aan de bouw
- ACM: voorwaarden vóór sluiten beschikbaar, ook downloadbaar/bewaarbaar; link pas op factuur is te laat. Versioneer de meegegeven voorwaarden en koppel die aan akkoord.
- ACM ConsuWijzer: prijssoort en tijdige waarschuwing bij meerwerk zijn relevant. Bouw goedkeurings-/waarschuwingsmomenten; een richtprijs heeft niet onbeperkte automatische overschrijding. Een vaste prijs krijgt geen willekeurige meerwerktoeslag doordat werk tegenvalt.
- ACM/RVO: online/buiten verkoopruimte kunnen bedenktijdregels spelen. Bij online overeenkomsten waarvoor herroeping geldt hoort een gemakkelijk bereikbare ontbindingsfunctie; actuele officiële pagina's noemen 25 juni 2026. Onderscheid vroeg beginnen en volledig uitvoeren, met passend actief verzoek/informatie en bevestiging. Laat toepasselijkheid controleren per contracttype.
- KVK: voorwaarden zijn geen plek voor onredelijke clausules; consument en zakelijke opdrachtgever vragen passende verschillen. Geen beschermde voorwaarden van concurrent/branche letterlijk kopiëren.
- Kadaster/IPLO: graaf-/vergunningcheck is concrete voorbereiding, geen decoratief groen vinkje in de configurator.
Geen publicatie van commerciële placeholders [naam], [IBAN], [termijn], [garantieduur] of [vergoeding]. Houd onbesliste bedrijfsinstellingen intern; bouw de pagina's/templates alvast.

## 7 Offerte, bewijs, facturatie en documenten — vooraf uitgewerkt
### Documentenset
1 aanvraagbevestiging; 2 ontwerpsamenvatting; 3 materiaalstaat; 4 interne calculatie; 5 offerte; 6 opdrachtbevestiging; 7 meer-/minderwerk; 8 werkbon; 9 opleverdocument; 10 nazorg-/garantieoverzicht; 11 factuur; 12 creditfactuur; 13 klacht-/servicebevestiging; 14 herroepings-/annuleringsbevestiging.
Publiceer interne calculatie niet aan klant. Een browser zonder veilige nummerreeks produceert alleen een gemarkeerd concept.

### Offertetemplate
Kop: logo, bevestigde bedrijfsidentiteit, offerte-ID/versie/datum/geldigheid, opdrachtgever, projectreferentie.
Samenvatting: klantwens, ontwerpvariant, werkadres waar veilig documentdoel dit verlangt, geplande scope.
Regeltabel: omschrijving, hoeveelheid, eenheid, prijssoort, prijs excl., btwcode/bedrag en totaal incl.
Secties: behouden/herstellen/verwijderen/nieuw; materialen door klant/SEAL; ondergrond/inmeting; toegang; afval; werkzaamheden inbegrepen; uitgesloten; stelpost/unknown; planningstatus; klantvoorbereiding; betaalafspraken; voorwaardenversie; toepasselijke herroepingsinformatie.
Bijlagen: 2D/3D, materiaalstaat, relevante foto's/maatnotities en voorwaarden-PDF.
Akkoord: exact document/versie, prijs, toepasselijke afspraken en eventuele aparte actieve toestemming; duurzame bevestiging. Nooit een oude link tonen die na akkoord stilzwijgend naar nieuwe inhoud wijst.

### Meerwerktemplate
Project, oorspronkelijke opdrachtversie, wat verandert, waarom, wie verzoekt, materiaal/uren/afvoer, bedrag excl./btw/incl., effect planning, nieuw scope-overzicht, datum en akkoord. Bewaar ook een afwijzing/annulering. Werk dat wettelijk of contractueel geen factureerbaar meerwerk is wordt niet automatisch klantkosten.

### Factuurtemplate
Voor volledige factuur volgens Belastingdienst: juridische/erkende handelsnamen en adressen van leverancier/afnemer; btw-id; KvK indien ingeschreven; uitgiftedatum; uniek opeenvolgend factuurnummer; omschrijving en hoeveelheid/omvang; prestatie- of vooruitbetalingsdatum; bedrag excl.; toepasselijk tarief en btw-bedrag; gesplitste bedragen bij verschillende tarieven.
Aanvullend voor bruikbaarheid: project-/offertreferentie, betaaltermijn, geverifieerde betaalbestemming, totaal, eventueel eerder gefactureerde termijnen en resterend bedrag. Volledige factuur is veilige standaard; eventuele uitzonderingen zoals vereenvoudigde factuur worden apart gecontroleerd.
Btw-verlegging pas na gecontroleerde toepasselijkheid en vereiste tekst/afnemersgegevens. Zakelijk betekent niet automatisch btw verlegd.
Factuurnummers komen van server/gekozen boekhoudpakket; factuur na uitgifte niet herschrijven. Correctie via juiste nieuwe documentroute en verwijzing. Geen melding “betaald” zonder echte verwerkte betaalinformatie. Contant betaald krijgt eveneens nette registratie; geen werkzaamheden buiten administratie voorstellen.

### Gemengde btw: betekenisvolle test
Voorbeeldberekening, geen aanbod: EUR 100 excl. kwalificerende geleverde planten bij 9% = EUR 109; EUR 200 excl. arbeid bij 21% = EUR 242; gecombineerd EUR 300 excl., EUR 51 btw, EUR 351 incl.
De Belastingdienst beschrijft hoveniersaanleg/-onderhoud doorgaans onder 21%, met meegeleverde sierteeltproducten onder 9% waar van toepassing. Classificeer de daadwerkelijke prestatie correct, niet alle tuinregels uniform.
Administratieve bewaarplicht en privacyretentie zijn verschillende regels. Fiscale basisadministratie kent doorgaans 7 jaar, met situaties waarin 10 jaar geldt; leg toepasselijkheid met boekhouding vast. Bewaar niet ieder afgewezen verzoek of CV standaard even lang.

### Betaling en incasso
Bevestig redelijk betalingsbeleid als bedrijfsinstelling, niet uit één oude offerte afleiden. Leg termijnen/voorschotten vóór overeenkomst vast. Eventuele betalingsherinnering, rente en incassokosten volgen toepasselijke regels en klantsoort. Geen automatische consumentboete na één dag; toets de vereiste kosteloze aanmaning/termijn en wettelijke maxima waar relevant.
Een SEAL-website is geen nieuw boekhoudpakket; integreer bestaande administratie of lever gecontroleerde adapter/export. Nummers, ontvangers en bankgegevens uit oude bestanden met verschillende identiteit niet blind hergebruiken.

## 8 Privacy, toestemmingen en klanttoegang
Maak /privacy/ met werkelijke identiteit/verantwoordelijke en deze onderdelen: gegevens per route, doeleinden, grondslagen, ontvangers/verwerkers, eventuele internationale doorgifte, beveiligingsuitleg op passend niveau, termijn per gegevenscategorie, rechten/contact en AP-klachtrecht.
Tabel voor beleid:
| Categorie | Doel | Grondslag en termijn |
| --- | --- | --- |
| Niet-persoonlijk lokaal ontwerp | Tekenen/bewaren | Doelgebonden browseropslag; klant kan wissen |
| Aanvraag/contact/foto | Beoordeling en opvolging | Passende contractvoorbereiding/andere geldige grondslag; termijn beleid vaststellen |
| Opdracht/offerte/werkbewijs | Uitvoering en aantoonbare afspraken | Contract/legitiem doel met afgewogen termijn |
| Factuur/boekhouding | Administratie | Wettelijke plicht; fiscale termijn per categorie |
| Marketing | Nieuws/aanbiedingen | Passende geldige grondslag, duidelijke afmelding; niet verplicht voor offerte |
| Publieke projectfoto | Portfolio | Eigen grondslag/toestemming en privacycontrole; los van uitvoering |
| Sollicitatie/CV | Samenwerking beoordelen | Beperkt, aparte toegang/termijn; geen publiek projectbestand |
| Technische logs | Beveiliging/betrouwbaarheid | Minimalisatie, korte passende retentie; geen complete verzoekinhoud |

Geen onbevestigde termijnen als wettelijke standaard presenteren. Voorgesteld beleid wordt intern vastgesteld en technisch uitgevoerd. Een foto met gezicht, kenteken, buurwoning of adres vraagt passende publicatiecontrole; verwijder locatie-EXIF uit publieke afgeleiden.
Cookiemodule: noodzakelijke functies, tracking na geldige keuze waar vereist, eenvoudig weigeren/intrekken, geen vooraf aangevinkte marketing, geen gedwongen instemming om site te gebruiken. Derdenembed pas passend laden. Uitvoerbare persoonsgegevensverzoeken hebben een veilige identiteitscheck, redelijke workflow en beperkingen waar bewaren wettelijk verplicht is.
Klantportaal: server-side autorisatie op ieder object, beveiligde sessie/token, verifieer eigenaar/rol, expiry/intrekken, rate limits en geen raadbare links. Ontwerp-ID is geen toegangsbewijs. Aanvrager ziet geen inkoop/marge, andere klantdocumenten of andere buurcontactgegevens.
Zonder veilige projecttoegang: publiceer geen “log in en zie alles”-belofte. Gebruik bevestigde e-mail/documentroute, met dezelfde dienstverlening waar mogelijk.

## 9 Werkwijze — zichtbare klantuitleg plus interne uitvoering
Pagina /werkwijze/ gebruikt een tijdlijn met:
1 Uw wens: ontwerp of korte aanvraag.
2 Situatie: maten, foto's, behouden/verwijderen, bereikbaarheid en materiaal.
3 Beoordeling/inmeting: wat zeker is en wat gecontroleerd moet worden.
4 Voorstel: scope, prijssoort, voorwaarden en planningstatus.
5 Akkoord: exacte versie, afspraken en toepasselijke toestemmingen.
6 Voorbereiding: levering, materiaal, toegang en klanttaken.
7 Uitvoering: gecontroleerde werkzaamheden; wijzigingen eerst bespreken.
8 Oplevering: gezamenlijke controle en vastgelegde aandachtspunten.
9 Factuur en nazorg: duidelijke administratie, onderhoudsadvies en service.
Geen gefingeerde gemiddelde doorlooptijd of “altijd morgen klaar”. Gebruik echte planning of “we stemmen dit met u af”.

Interne stage machine: draft → submitted → needsInfo → reviewed → quoted → accepted → preparation → scheduled → inProgress → readyForInspection → completed → invoiced → closed.
Afwijkingen: revised/superseded quote, rejected, cancelled, disputed, serviceOpen. Contractstatus, projectstatus, factuurstatus en betalingstatus blijven afzonderlijk. “Factuur verstuurd” betekent niet “betaald”. Overgang accepted vereist geldige documentversie; overgang completed vereist opleverstatus; geen automatische status door alleen pagina te bezoeken.
Nieuws/klantnotificatie volgt echte overgang; herhaalde webhook mag geen dubbele mail/opdracht maken. Uitzonderingen en restpunten blijven zichtbaar voor juiste personen.

## 10 Foto's, prijzen, 3D en betrouwbaarheid — laatste harde grenzen
V3.0 bevestigt het EUR 60-tarief en beschrijft de eigen offertes. De tegenstrijdige 11,5 m/14,2 m blijven een controlevraag. Geen gemiddelde montageprijs als vaste SEAL-meterprijs afleiden uit één gedeeltelijk gedeelde klus.
Alle materiaalprijzen vereisen echte SKU/systeem en verkoopbeleid. Een leveranciersprijs of advertentievanafprijs is geen automatische SEAL all-in aanbieding. Interne opslag/marge zijn nog te bevestigen; voorgestelde marge wordt niet zonder bron gepubliceerd.
Basisbedragen kunnen direct in de tariefmodule: 8 persoonsuren EUR 480 excl./EUR 580,80 incl. 21%; 16 uren EUR 960/EUR 1.161,60; 56 uren EUR 3.360/EUR 4.065,60. Expliciet uitsluitend arbeid.
Foto's: eerst manifest en inhoudscontrole, daarna crop/focal point/responsive formaten. Renders zijn “ontwerpvisualisatie”. Geen spectaculaire AI-tuin als bewijs van SEAL-uitvoering.
3D draait lokaal op gedeelde geometrie met passende performance, niet via een dure AI-call per klik. Materiaal, poort, oppervlak, bestaand/verwijderen/nieuw en variantkeuze werken echt door.
Plant-/groeivolumes, schaduw en ruimtelijk gevoel zijn schematisch tenzij een inhoudelijk gevalideerde simulatie werkelijk bestaat. Geen onbekende fundering, windbelasting, drainage, vergunning of planttoxiciteit automatisch groen afvinken.
De bezoeker kiest moeiteloos; de professionele uitvoerder houdt de controle over uitvoering en contract.

## 11 Toetsen per klantreis en risicogrens
Voor ieder feature-ID: implemented, testEvidence, externalDependency, fallback en lastChecked. Gebruik meaningful acceptance, geen tests die alleen dezelfde implementatie herhalen.
Verplichte regressies uit v2/v3 blijven. Aanvullend:
| Test | Actie | Vereist resultaat |
| --- | --- | --- |
| Scope consistent | Behouden poort + nieuw hek + verwijderen heg | Zelfde onderscheid in 2D/3D/materiaalstaat/offerte |
| Geometrie | L-vorm, poortopening, aangrenzende/overlappende vlakken | Correcte mm/m²; geen dubbeltelling of afrondregressie |
| Variantvergelijking | Wissel alleen materiaal | Geen verborgen verandering van afmetingen/scope |
| Volledige prijs | Artikel bekend, levering onbekend | Alleen bekend subtotaal; totaal niet als compleet getoond |
| 9/21 btw | Voorbeeld EUR 100 planten + EUR 200 arbeid | EUR 351 incl., gesplitste btw EUR 51 |
| Teamdagen | Dag 1 3, daarna 2+2 personen ×8 | 56 persoonsuren, geen 24 |
| Legacy-offerte | Open geaccepteerde historische offerte | Geen stille EUR 60-hercalculatie |
| Voorwaarden | Sluit overeenkomst | Juiste versie vóór akkoord beschikbaar en duurzaam bevestigd |
| Richtprijsbewaking | Verwachte afwijking boven afgesproken grens | Tijdige controle/waarschuwing, geen stille automatische factuur |
| Meerwerk | Verander geaccepteerde scope | Nieuw voorstel/akkoord; originele versie intact |
| Vroeg starten | Dienst tijdens bedenktijd | Toepasselijke actieve verzoek-/informatieflow vastgelegd |
| Herroepen | Gebruik toepasselijke functie zonder account | Werkende route en onmiddellijke duurzame bevestiging |
| Factuur concurrency | Twee uitgiftes tegelijk | Geen dubbele nummers; immutable factuurdocument |
| Fotopublicatie | Weiger portfoliotoestemming | Dienst blijft mogelijk; foto niet openbaar |
| Buren | Bekijk gezamenlijke opdracht als één buur | Geen ongeautoriseerde persoonsgegevens van ander |
| Portaaltoegang | Verander project/document-ID in URL | Geen toegang tot dossier van ander |
| Betaling | Alleen factuurmail verzonden | Niet ten onrechte betaald-status |
| Privacybron | Inspecteer assets/build/network | Geen inkoop, secrets, CV of privéklantdata |
| Touch/toetsenbord | Menu, 3D, comparison, slider en form | Bruikbaar met bereikbare alternatieven |
| WebGL en netwerk | Falen tijdens aanvraag/ontwerp | Ontwerp intact, 2D/fout-/herstelroute begrijpelijk |
| Mobiel | 360/390/430 px en landscape | Geen bedekte velden, horizontale paginascroll of minuscule controles |
| Adminwijziging | Wijzig tarief/terms/article | Nieuwe data gecontroleerd; oude akkoordversies intact |
| Backup | Herstel gecontroleerde testdata | Toegang, documenten en status aantoonbaar herstellen |
Een provider-mock bevestigt alleen adapterschema/gedrag, niet echte levering of ontvangst. Noteer “blocked” voor ontbrekende end-to-end toegang.

## 12 Tokenzuinig bouwen — grotere scope met minder herhaling
De extra functies zijn bewust uit gedeelde blokken opgebouwd. Voeg geen parallel team van volledige uitvoerders toe uit gewoonte. Gebruik de bestaande gebruikerinstelling/modelkwaliteit; geen stil verlagen van niveau.
1. Brief staat één keer op disk. Compacte startregels in CLAUDE.md; de rest gericht per module. Bijlage niet telkens meegeven. Gebruik ID A01–P10 en document-ID's als verwijzing.
2. Inspecteer wat al gebouwd is en zet voort; geen frameworkherstart door de nieuwe prompt. Vertaal bestaande Tier-resultaten naar de nieuwe eisenindex.
3. Gebruik datarecords/templates/schema's; één implementatie ondersteunt veel keuzes. Iedere keuze heeft wel eigen correcte betekenis en afhankelijkheden.
4. Klaarstaand onderzoek, teksten en bronregister hergebruiken. Alleen ontbrekende of vluchtige feiten gericht controleren. Geen nieuw “beste site”-marktonderzoek bij iedere tegel.
5. Lees gerichte bestanden/regelselecties, beperkte logs en diffs. Niet whole repo, node_modules, alle pluginmetadata of alle afbeeldingen in context.
6. Gerichte functionele tests en kritieke regressies; één betekenisvolle eindreview. Geen twintig volledige reviews van hetzelfde resultaat.
7. Leg testuitvoer/meetresultaten in bestanden vast; updates kort. Een tool die echte toegang/testbewijs levert is nuttig; ongerelateerde plugins alleen kosten.
8. Bewaak /usage en /context waar beschikbaar; compact bij contextdruk bewaart ID's, gewijzigde bestanden, noodzakelijke besluiten en volgende taak. /compact reset geen abonnementsgebruik.
9. Voor iedere stop/checkpoint: gitbranch/status, wijzigingen, completed/tested IDs, external blockers en exact volgende task. Bij hervatten niet onderzoek/masterprompt opnieuw genereren.
10. Betaalde extra gebruiksruimte, nieuwe abonnementen, accounts of deployments niet automatisch inschakelen. Groot werk kan meerdere gebruiksvensters vergen; dat is geen reden om eisen te verliezen of opnieuw te bouwen.
Een volledigheidsindex is verplicht. “Niet genoeg tokens” wordt niet opgelost door kernfunctie weg te laten en klaar te claimen.

## 13 Beschikbare skills/plugins gericht inzetten
| Capability | Gebruik in dit project | Grens |
| --- | --- | --- |
| GitHub + code-uitvoerder | Actuele repo, branches, diff, tests en release | Toegang in Claude afzonderlijk controleren |
| Product Design audit/ideate/image-to-code | Echte flowcontrole, visuele richting en toepassing | Audit op bewijs; conceptbeeld is geen werkende UI |
| Browser | Desktop/mobiel en end-to-end testen | Geen claim ontvangst uit alleen succesmock |
| Webonderzoek | Officiële regels, productgegevens, concurrentiepatronen | Bron, datum en vergelijkbare scope |
| Figma | Component-/ontwerpsysteem wanneer concrete samenwerking helpt | Niet verplicht voor iedere codewijziging |
| Imagegen | Visuele concepten/illustraties | Nooit eigen projectbewijs vervalsen |
| Vercel/backend skills | Bestaande veilige API/preview waar passend | Geen automatische hostingmigratie of betaalde aanschaf |
| Library/document/PDF | Dossier, documenten en gecontroleerde templates | Private gegevens passend afschermen |
| Spreadsheets | Intern prijsboek als dat werkelijk beheer vereenvoudigt | Niet publiek maken met marges |
| Marketing/analytics plugins | Na consent/echte data inzicht in leads en kwaliteit | Geen advertentiebudget wijzigen zonder opdracht |
Hier zijn GitHub, Figma en Vercel als geïnstalleerd aangetroffen in ChatGPT; dat bewijst geen toegang tot de SEAL-repository of Claude-configuratie. Gebruik daadwerkelijke capabilities. Geen ongerelateerde mailbox-, pet-, presentatie- of mediaplugin toevoegen alleen omdat ze beschikbaar zijn.

## 14 Actuele bronnen en onderzoeksgrenzen
Nieuwe controle 9 oktober 2026. Dit is een gecontroleerde bronbasis, geen juridische goedkeuringsverklaring. Hercontrole voor productie wanneer regels/prijs/aanbod vluchtig zijn.
| ID | Primaire bron | Toepassing |
| --- | --- | --- |
| LAW01 | https://www.acm.nl/nl/verkoop-aan-consumenten/de-koop-sluiten/algemene-voorwaarden-aanbieden | Beschikbaar stellen vóór sluiten, geen onredelijke voorwaarden |
| LAW02 | https://www.kvk.nl/wetten-en-regels/hoe-je-algemene-voorwaarden-maakt/ | Eigen voorwaarden, klantsoort, juridische beoordeling |
| LAW03 | https://consument.acm.nl/rekeningen-en-incassoprocedures/wat-moet-ik-betalen-als-ondernemer-meer-of-minder-werk-uitvoert | Prijssoort, meer-/minderwerk en waarschuwing |
| LAW04 | https://www.acm.nl/nl/verkoop-aan-consumenten/klantenservice/bedenktijd | Toepasselijkheid en vroeg starten/volledig uitvoeren |
| LAW05 | https://ondernemersplein.overheid.nl/wetswijzigingen/webshops-moeten-een-herroepingsknop-hebben/ | Herroepingsfunctie, officiële actuele ingangsdatum |
| LAW06 | https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/facturen_maken/factuureisen/ | Factuurgegevens en nummerreeks |
| LAW07 | https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/tarieven_en_vrijstellingen/goederen_9_btw/sierteeltproducten/sierteeltproducten | Hoveniersarbeid/materialen en sierteelt-btw |
| LAW08 | https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/administratie_bewaren/ | Fiscale bewaring |
| LAW09 | https://autoriteitpersoonsgegevens.nl/nl/zelf-doen/privacyrechten/recht-op-informatie | Privacyinformatie; zoekindex ontsloten, direct ophalen 403 |
| LAW10 | https://autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/tracking-cookies | Trackingtoestemming; zoekindex ontsloten, direct ophalen 403 |
| LAW11 | https://www.kadaster.nl/producten/woning/klic-melding | Machinaal graven en KLIC |
| LAW12 | https://iplo.nl/thema/bouw/bouwen-vergunning-melding/erfafscheiding/ | Technisch/ruimtelijk onderscheid erfafscheiding |
| LAW13 | https://consument.acm.nl/aankoop-dienst-annuleren/klus-opleiding-opdracht-annuleren | Annulering/opzegging van opdracht onderscheiden |
| LAW14 | https://ondernemersplein.overheid.nl/wetten-en-regels/betalingstermijn-incassokosten-en-wettelijke-rente/ | Betaling, incasso en klantsoort |
| UX01 | https://www.ikea.com/nl/nl/planners/ | Plannen en specialistische ontwerpcheck als patroon |
| UX02 | https://www.tekenjetuin.nl/ | 2D/3D en tuininformatie als patroon |
| UX03 | https://www.schutting-direct.nl/configurator | Dienstgerichte configuratie als patroon |
| UX04 | https://www.houzz.com/magazine/how-to-create-and-use-ideabooks-stsetivw-vs~19764256 | Bewaren en groeperen van inspiratie als patroon |
| CC01 | https://code.claude.com/docs/en/costs | Context, usage, gerichte tools en hergebruik |

Cross-industry patronen worden vertaald, niet gekopieerd. IKEA ondersteunt zelfstandig plannen plus ontwerpcheck; Tekenjetuin verbindt 2D/3D; Houzz laat inspiratie verzamelen. Voor SEAL vertalen we dit naar eigen projectdata, materiaalstaat en persoonlijke beoordeling. Geen volledige browser-/conversietest van al deze diensten uitgevoerd.
De v2.0-vergelijking met acht regionale bedrijven en specialistische voorbeelden blijft gedateerde onderzoeksbasis. Er is geen bewijs dat alle 160 eisen uniek zijn in Nederland. Vergelijk bij een nieuwe brede claim voldoende relevante aanbieders met dezelfde scope.
Door bronnen gedekte passages zijn samengevat; beschermde teksten/foto's/voorwaarden niet overnemen. Projectfoto's blijven eigen gecontroleerde assets.

## 15 Oplevering en concrete overdracht
Lever in repository:
- docs/SEAL_MASTER_BRIEF.md: dit volledige dossier;
- docs/REQUIREMENTS_INDEX.md: 160 IDs + bestaande v2/v3-tests, status, bestands-/testverwijzing;
- docs/IMPLEMENTATION_STATUS.md: compact, maximaal circa 150 regels;
- docs/PRICING_OPERATIONS.md: tarief, prijsstatus, public/private, supplier-update en historie;
- docs/LEGAL_AND_DOCUMENTS.md: eigen conceptvoorwaarden, gecontroleerde bronnen, bedrijfsinstellingen en juridische open punten;
- docs/CONTENT_AND_ASSETS.md: services, cases, metadata, publicatiecontrole en fotoherkomst;
- docs/DEPLOYMENT_AND_ROLLBACK.md: bestaande releaseprocedure, configuratie en terugzetten;
- werkende code/data, benodigde betekenisvolle tests en gecontroleerde preview.
Dit zijn uit de bouw afgeleide korte beheerbestanden, geen zeven kopieën van het masterdossier.
Opleverrapport: concreet wat verandert, welke journeys werkelijk werken, wat is getest, desktop/mobielscreenshots, echte ontvangst/btw/versies, kosten-/toegangsafhankelijkheden en releasevoorstel.
Een incomplete geïntegreerde functie is “extern geblokkeerd” met reden en werkende ondersteunde route, niet “af”. Toon geen dode knoppen. Geef opdrachtgever geen nieuwe masterpromptvraag voor reeds beschreven eisen.

## 16 Eindopdracht — voer uit op het bestaande fundament
Gebruik de kracht van de complete opdracht zonder contextverspilling: één source of truth, één goed componentensysteem, één 2D/3D-engine en één gecontroleerde administratieve klantreis.
Werk met vakzorg: duidelijke keuze, correcte foto's, eerlijke prijzen, materiaalcompatibiliteit, passende contracten, nette facturen, echte ontvangst en nazorg. Richt iedere functie op een werkelijk klantprobleem en ieder intern scherm op controleerbaar werk.
Neem routinebeslissingen zelfstandig. Bouw en toets samenhangend verder; wacht niet op nieuwe “fase 2”-prompts. Bewaar noodzakelijke ontbrekende bedrijfs-/providergegevens als expliciete blokkade zonder de overige website stil te zetten.
Geen absoluut “juridisch waterdicht”, geen nepautoriteit, geen garantie dat Pro alles in één venster haalt. Wel een volledige zelfstandige opdracht, behoud van eerder werk, een auditbare voortgang en een website die vanaf de eerste blik helder is en bij verder gebruik rijk en professioneel blijft.

---
# NASLAG — v3.0 met volledige v2.0
De onderstaande versies zijn integraal behouden. V4.0 is leidend. Verwijzingen naar bestandsnaam/volledige eerste lezing uit oudere versies worden vervangen door de START- en contextregels hierboven.

# SEAL MASTERPROMPT v3.0 — complete website, groen en 3D
Datum: 9 oktober 2026. Opdrachtgever: Sealcleaning. Uitvoerder: Claude Code of Codex.
Status: bouwspecificatie; geen bewijs dat onderdelen al gebouwd zijn.
Dit bestand is één zelfstandige opdracht. De complete v2.0-specificatie staat als referentiebijlage onderaan; de v3.0-regels gaan bij conflict voor. Bewaar het hele bestand in de repository. Lees niet automatisch de hele referentiebijlage in iedere sessie.

## START — korte instructie voor de uitvoerder
Bouw de bestaande Sealcleaning-website daadwerkelijk af binnen de bestaande repository, met premium uitstraling, volledige groenonderhoud- en aanleginformatie, eigen projectfotografie, echte maatvaste 2D/3D, materiaalvergelijking, betrouwbare prijsstatussen en complete aanvraagverwerking. Behoud werkende bestaande code en gebruikerswijzigingen.
1. Lees toepasselijke repository-instructies, gitstatus, het laatste IMPLEMENTATION_STATUS-bestand en alleen de v3.0-hoofdstukken hieronder. Controleer wat al gebouwd is. De laatste bekende externe voortgang noemt een gedeelde geometrie-/rekenbasis; behandel dit als aanwijzing, niet als bewezen huidige status.
2. Maak een compacte eisenindex met verwijzingen naar de relevante v2.0-hoofdstukken. Lees die hoofdstukken pas wanneer een taak ze nodig heeft. Geen integrale herlezing van 125 kB onderzoek per bouwstap.
3. Gebruik één gedeelde projectstate voor 2D, 3D, hoeveelheden, prijzen, export en aanvraag. Gebruik bestaande stack en componenten. Migreer hosting of framework niet zonder concrete noodzaak en bestaande autorisatie.
4. Basistarief, bevestigd door opdrachtgever op 9 oktober: EUR 60,00 EXCLUSIEF btw per medewerker per uur; bij 21% btw EUR 72,60 inclusief. Dit is een verkooptarief, geen loon/kostprijs. Materiaal, transport, huur en afval zijn aparte posten tenzij een expliciet pakket ze omvat.
5. Behoud alle v2.0-eisen, met de wijzigingen hieronder. Controleer zichtbaar gewijzigd gedrag en noodzakelijke regressies. Toon geen nepfunctionaliteit, niet-ontvangen aanvraag als ontvangen, verzonnen bedrijfsbewijs of onbekende kosten als nul.
6. Werk zelfstandig door aan alle geautoriseerde onderdelen. Interne bouwstappen zijn geen verplichte goedkeuringsrondes. Vraag alleen om onmisbare ontbrekende toegang/beslissing; werk verder aan onafhankelijke taken.
7. Bewaar na samenhangende wijzigingen een compact checkpoint met bestanden, eisnummers, testresultaten, blokkades en exact volgende commando/taak. Bij een gebruikslimiet hervat je dezelfde opdracht; geen herbouw, nieuw dossier of nieuw onderzoek.
8. Lever een gecontroleerde preview, desktop- en mobiele screenshots, testverslag en concrete release-instructie. Publicatie volgt de bestaande repositoryafspraken. Hosting/DNS/mailboxen/betaalde extra gebruiksruimte veranderen valt niet onder deze opdracht.

## 1 Waarheid, grenzen en huidige onzekerheden
Professionele zorgvuldigheid van een groot ervaren bedrijf is de kwaliteitsnorm. Publiceer geen fictieve 50 jaar ervaring, omzet, personeel, certificaten, garanties, recensies of Google-rangpositie. Claim niet dat opties bij geen enkele concurrent bestaan zonder representatief bewijs.
De opdrachtgever wil één complete opdracht en zo weinig mogelijk verspild Claude-gebruik. Een prompt kan geen gegarandeerd eindresultaat binnen één Pro-gebruiksvenster of bepaald aantal tokens beloven.
De Instagram-afbeelding noemt o.a. compare, proscons, factcheck, table, checklist, brainstorm, debug en prompt. Dit zijn bruikbare intenties, geen universele ingebouwde slashcommando's. Voer de inhoudelijke werkwijzen uit: vergelijk, toets, controleer bronnen, inventariseer gaten, redigeer en debug gericht.
Er is hier geen actuele repositorycontrole of volledige actuele live-audit uitgevoerd. Oude browserbevindingen in v2.0 zijn regressieaanwijzingen; controleer opnieuw. Gooi eerdere gebouwde Tier-onderdelen niet weg.
Bedrijfsidentiteit, openbare contactgegevens en voorwaarden volgen de nieuwste geverifieerde bedrijfsconfiguratie. De oudere offerte en website bevatten afwijkende KvK-/contactgegevens: kopieer die niet blind naar nieuwe verkoopdocumenten.

## 2 Informatiearchitectuur — overzicht vóór hoeveelheid
Hoofdnavigatie: Diensten; Ontwerp uw tuin; Materialen & prijzen; Projecten; Zakelijk; Over SEAL; Contact. Werkwijze en kennisbank krijgen duidelijke subroutes. Op mobiel: korte groepen, uitklapbare subnavigatie en bereikbare contactactie.
Diensten worden opgeslagen als gestructureerde content en weergegeven met één herbruikbare paginatemplate. Toon alleen diensten die SEAL daadwerkelijk aanbiedt; voorbereid maar onbevestigd aanbod blijft ongepubliceerd.

| Dienstgroep | Subdiensten / benodigde inhoud | Aanvraag en prijsbasis |
| --- | --- | --- |
| Groenonderhoud | Onkruid verwijderen, schoffelen/wieden, heggen/hagen, struiken, gazon maaien, verticuteren, borders, blad, seizoensbeurt, achterstallig onderhoud | Foto's, oppervlakte/lengte/hoogte, achterstand, afvoer; uur of gecontroleerde projectprijs |
| Periodiek onderhoud | Eenmalige startbeurt, terugkerende afspraken, particulier/bedrijf/VvE, onderhoudsplan | Frequentie, omvang en scope bepalen na intake; geen fictief abonnementstarief |
| Groenaanleg | Beplanting, hagen, borders, gazon/graszoden, bodemverbetering en plantvakken | Maten, bodem, licht, gebruik, plant-/materiaalkeuze; bekende artikelen plus aanleg |
| Schuttingen en poorten | Hout, hout-beton, composiet, open/groene erfafscheiding waar leverbaar; herstellen/hergebruik | Lengte, hoogte, hoeken, poorten, bestaand werk, systeem en toegang |
| Bestrating | Terras, pad, oprit, herstel/herleggen, voegen/randen, voorbereiding | Oppervlakte, vorm, tegel, legverband, onderbouw, afwatering en oude situatie |
| Tuinrenovatie / aanleg | Bestaand behouden, verwijderen en nieuw combineren; budget-/onderhoudswensen | Eén gecombineerd dossier, 2D/3D en inspectie waar nodig |
| Voorwerk en afvoer | Tuin vrijmaken, wortel-/grondwerk binnen competentie, oude delen verwijderen, afvalstromen | Hoeveelheid, toestand, bereikbaarheid, container, gewicht/volume waar bekend |
| Zakelijk | Aannemers, VvE, bedrijfsterrein, vastgoedbeheer en samenwerking | Aparte intake met scope, planning, documenten en contactpersoon |
| Vakmensen | Samenwerking / sollicitatie | Vakgebied, regio, beschikbaarheid, ervaring en veilig documentkanaal |

Specialistisch boomwerk, drainage, elektra, vijvers en andere disciplines worden alleen als dienst geactiveerd als bevoegdheid, uitvoering en prijsroute bevestigd zijn. Advies of doorverwijzing kan een eerlijke alternatieve route zijn.

## 3 Dienstpagina's — schrijf bruikbare uitleg, geen generieke opvulling
Iedere gepubliceerde dienst bevat:
- een concrete klantwens en passende eigen foto;
- wanneer deze dienst nuttig is en herkenbare signalen;
- wanneer behouden, herstellen of een lichtere ingreep verstandiger is;
- opties met voordelen, beperkingen en onderhoud;
- werkzaamheden en inbegrepen/uitgesloten onderdelen;
- wat de prijs beïnvloedt, prijsstatus en benodigde intake;
- één relevante projectcase, werkwijze, voorbereiding en nazorg;
- korte veelgestelde vragen en contextuele ontwerp-/aanvraagactie.
Schrijf Nederlands op helder B1/B2-niveau, met vakkennis waar die een beslissing helpt. Begin met een kort antwoord; zet verdieping in toegankelijke accordions. Geen blokken SEO-tekst zonder nut.

Voorbeeldteksten om gericht in te passen:
**Schutting:** "Meer privacy, een duidelijke tuinafscheiding of een bestaande schutting die toe is aan herstel? We helpen u kiezen wat bij uw tuin past. Soms kunnen palen of delen behouden blijven. Bij vervanging vergelijken we materiaal, hoogte, onderhoud en de situatie ter plaatse."
**Onkruid:** "Ongewenste begroeiing tussen tegels, in borders of langs de erfgrens vraagt telkens een andere aanpak. We kijken waar het groeit, hoeveel achterstand er is en welke beplanting moet blijven. Verwijderen is een onderhoudsingreep; blijvend onkruidvrij kunnen we niet beloven."
**Onderhoud:** "Een losse onderhoudsbeurt of regelmatig hulp? Geef aan wat u zelf doet en wat u wilt uitbesteden. We maken een passende afspraak voor snoeiwerk, gazon, borders en afvoer."
**Aanleg:** "Een mooie tuin begint met hoe u hem gebruikt. Kies ruimte voor zitten, groen, spelen of onderhoudsgemak. Uw ontwerp geeft richting; bodem, afwatering en maatvoering controleren we voordat de uitvoering wordt vastgelegd."
Snoeiadvies is soort- en situatieafhankelijk. Verifieer seizoensinformatie en actuele natuurregels bij passende primaire bronnen. Bestaande beplanting wordt niet standaard verwijderd.

## 4 Design en fotografie — premium, herkenbaar en functioneel
Behoud de bestaande groen/zand-identiteit, logo en bruikbare typografie. Concrete starttokens, na contrastcontrole:
achtergrond #F5F2E9; oppervlak #FFFFFF; primaire tekst #18352B; actie #174C38; zachte lijn #D9E1D6. Accent alleen spaarzaam en met aantoonbaar contrast. Hergebruik bestaande Fraunces/Inter indien aanwezig; voeg geen extra fontfamilies toe.
Desktop contentbreedte circa 1200–1280 px; spacing 8/16/24/32/48/64; kaarten 12–16 px radius; rustige 1 px lijnen; nauwelijks schaduw. Vermijd pillen voor iedere tekstregel en een muur van groene vinkjes.
Homepage: compacte header; hero met echte beste tuinfoto en leesbare kop; vier duidelijke ingangen (Onderhoud, Schuttingen, Bestrating, Tuinaanleg); opvallende maar lichte 3D-preview; dienstkeuzehulp; eigen cases; materiaalvergelijking; prijsuitleg; werkwijze; zakelijk blok; contact.
Hero-copy: "Uw tuin. Goed doordacht. Mooi uitgevoerd." Subtekst: "Groenonderhoud, aanleg, schuttingen en bestrating in Dordrecht en omgeving." Acties: "Ontwerp uw tuin" en "Bekijk ons werk". Toon regio en aanbod alleen voor daadwerkelijk bediende gebieden.
Laat de configurator opvallen door ruimte en duidelijkheid, niet door automatisch draaiende zware 3D in de hero. Geen autoplayvideo, carrousel voor kritieke informatie of pop-up bij binnenkomst.

Maak eerst een assetmanifest en contact sheet van relevante foto's. Leg per foto vast: werkelijk onderwerp, diensttags, project-ID, eventueel voor/na-paar, uitsnede, focuspunt, bron en gebruiksstatus.
- Bestaande bestandsnaam bewijst het onderwerp niet. Controleer de afgebeelde inhoud.
- Een foto kan bij meerdere werkelijke diensten horen; niet willekeurig bij meerdere categorieën.
- Gebruik 4:3 voor cases, 3:2 voor dienstkaarten en een gecontroleerde ruime hero-uitsnede. Bewaar originele bestanden.
- Maak responsive AVIF/WebP-afgeleiden waar passend, met width/height, srcset/sizes, correcte focal points en nuttige alt-tekst.
- De eerste belangrijke foto krijgt passende laadprioriteit; overige foto's laden uitgesteld.
- Toon echte details van afwerking naast overzichtsfoto's. Voor/na-slider alleen voor dezelfde locatie en dezelfde ingreep.
- Geen AI-restyling die uitgevoerd werk mooier voorstelt dan het was. Beeldbewerking kan belichting, uitsnede en privacy verbeteren met behoud van werkelijkheid.
- Geen gegenereerde tuin als eigen case. Ontwerpvisualisaties worden als visualisatie aangeduid.
Gebruik bestaande foto’s alleen waar kwaliteit en onderwerp passen. Ontbrekend beeld: rustige typografie en een passende gecontroleerde bestaande foto; geen grote inventaris verzonnen projecten.

## 5 Extra opties — nuttig onderscheid en minder werk voor SEAL
Alles hieronder gebruikt dezelfde projectdata. Voeg geen afzonderlijke prijs-/aanvraaglogica per feature toe.

| Optie | Nut voor klant | Nut voor SEAL / bouwregel |
| --- | --- | --- |
| Behouden / herstellen / verwijderen / nieuw | Geen onnodige vervanging | Heldere scope, aparte verwijderposten |
| Keuzehulp "Wat wilt u verbeteren?" | Privacy, uitstraling, onderhoud, verzakking, achterstand | Route naar dienst met maximaal enkele relevante vragen |
| Materiaalvergelijking | Vergelijk onderhoud, uitstraling, opbouw en gecontroleerde prijs | Maximaal 3 gelijktijdige keuzes, brongebonden kenmerken |
| Ontwerpvarianten A/B/C | Budget versus materiaal en indeling bekijken | Gedeelde geometrie, afzonderlijke gekozen varianten |
| Alleen materiaal / eigen materiaal + montage / compleet | Flexibele opdracht | Geen dubbele materiaal-/arbeidregels |
| Te behouden poort of groen | Ontwerp sluit aan op bestaande tuin | Niet automatisch nieuw product toevoegen |
| Budgetrichting en onderhoudswens | Gerichter advies | Geen automatische betaalbaarheidsbelofte |
| Foto-intake zonder 3D | Snel hulp aanvragen | Korte route voor onderhoud en eenvoudige klussen |
| Maten nog onbekend | Bezoeker kan verder | Onbekend expliciet, geen verzonnen echte maten |
| Bereikbaarheid en achterom | Vroeg zien wat invloed heeft | Werkbreedte, loopafstand, obstakels en handtransport |
| Buren / gezamenlijke schutting | Eén gezamenlijke scope | Kostenverdeling alleen met vastgelegde afspraak |
| Afvalroute | Container klant, SEAL-afvoer of ter plekke | Zelfde stroom niet tweemaal berekenen |
| Werk door klant voorbereid | Eigen voorbereiding aangeven | Besparing pas na uitvoerbaarheidscontrole |
| Onderhoud na aanleg | Plan voor volgende jaren | Geen automatisch betaald abonnement |
| Seizoensadvies | Weten wat nu past | Per soort/dienst verifiëren, geen universele snoeikalender |
| Branded ontwerp-/materiaallijst | Overleggen en bewaren | Export heeft ontwerp-ID en geen intern kostprijsdetail |
| Ontwerp terughalen | Niet opnieuw beginnen | Lokaal niet-persoonlijk opslaan; delen vereist werkende route |
| Zakelijk en vakman apart | Relevante vragen en informatie | Gegevens en toegang gescheiden |
| Korte oplever-/nazorguitleg | Weten wat na aanleg gebeurt | Aansluiting op echte werkwijze |

Winkelfuncties, klantportaal, automatische facturen en een interne AI-assistent blijven volledige architectuureisen uit v2.0. Activeer operationele functies alleen met werkende veilige infrastructuur. Zonder toegang: complete prijs-/orderaanvraag en documentconcept, geen fictieve betaling, accountstatus of officiële factuur.

## 6 Echte 2D/3D — omvang vastleggen, gegevens delen
Gebruik vastgezette onderhouden Three.js + bijpassende OrbitControls binnen de bestaande build. Geen verplichte AI-dienst of zware commerciële configurator.
Eén pure geometrie-/hoeveelhedenmodule voert 2D, 3D, materialen en calculatie. Maten intern in millimeters en geld in gehele centen; afrondregels worden expliciet vastgelegd en betekenisvol getest.
Minimaal: tuincontour; rechthoek en bewerkbare vrije contour waar v2.0 vereist; schuttinglijn met hoeken; hoogte; poortpositie/-draairichting; bestratingsvlak, formaat en legverband; behouden/verwijderen/nieuw; eenvoudige bestaande objecten; maatlabels; boven-/vooraanzicht; 2D/3D-toggle.
Groenlagen: eenvoudige parametrische plantvakken, gazon, haagsegmenten en bomen/struiken als schematische volumes. Ze ondersteunen ruimtegebruik en behouden/verwijderen/nieuw; schematische volumes zijn geen exacte groeivoorspelling of plantadvies.
Interactie: selecteren, wijzigen, verwijderen, undo/redo, geselecteerd onderdeel herkenbaar, touchbediening en alternatieve invoervelden voor drag-acties. Standaardontwerp mag voorbeeld zijn maar wordt zo aangeduid. Alleen m² ingevuld betekent geen echte lengte/breedte.
Materiaal-/kleurkeuze verandert de betreffende objecten; gaten, poorten en snij-/eindvakken tellen correct mee. Advies over fundering volgt het betreffende systeem, niet één universele formule.
Technische schermen laden pas op verzoek. Gebruik herhaalde geometrie/instancing, begrens pixelratio/complexiteit en render waar mogelijk op verandering. Dispose resources. Een beperkte telefoon krijgt lichtere 3D; bij WebGL-falen blijft 2D plus aanvraag bruikbaar. Geen verborgen foutloop.
Delen is pas zichtbaar als de link werkelijk opnieuw opent met de bedoelde niet-persoonlijke projectstate. Gebruik anders export en lokaal bewaren als werkende functies.

## 7 Prijsboek — bevestigde basis, voorbeelden en onbekenden
### Vastgesteld
Arbeid EUR 60,00 excl. btw per medewerker per uur. Bij 21%: EUR 72,60 incl.
8 uren één medewerker: EUR 480,00 excl. / EUR 580,80 incl.
8 uren twee medewerkers: EUR 960,00 excl. / EUR 1.161,60 incl.
Deze bedragen zijn rekenvoorbeelden voor arbeid, geen all-in dagpakketten; geen vaste productiviteit, gratis reistijd of inbegrepen afvoer suggereren.
Eerder besproken bemanning (dag 1 drie personen; dag 2 en 3 twee personen; ieder 8 uur): 56 persoonsuren; EUR 3.360,00 excl. / EUR 4.065,60 incl. aan arbeid. Dit is een NIEUWE rekenvariant op de bevestigde basis, geen herziening van een al geaccepteerde offerte en geen bewijs van werkelijk bestede uren.

### Uit eigen documenten — uitsluitend historische projectreferenties
- Tuinwerk uit offerte deel 2: EUR 450,00 incl. btw voor heg snoeien, afgesproken deel onkruid/ongewenste begroeiing verwijderen en bijbehorend groenafval meenemen. Omvang/uren onvoldoende bekend om hieruit een algemene m²-, meter- of uurprijs af te leiden.
- Schuttingaandeel opdrachtgever: EUR 1.050,00 excl. btw / EUR 1.270,50 incl.; tuinwerk erbij maakt EUR 1.720,50 incl. Materialen, container en snelbeton werden door opdrachtgever verzorgd.
- Snelbeton ophalen: aankoop volgens bon + EUR 30,00 afgesproken ophaal-/transportkosten. Niet automatisch algemeen vervoertarief maken; btw-basis van deze losse post niet als nieuwe regel afleiden.
- Schuttingpresentatie: circa 14,2 m, composietarbeid EUR 2.450,00 excl., systeem EUR 2.539,00, snelbeton/ophalen EUR 128,00, container EUR 529,00, projecttotaal EUR 6.160,50 volgens document.
- De offerte noemt circa 11,5 m; presentatie 14,2 m. Niet combineren als dezelfde uniforme meetbasis. Geen gemiddelde meterprijs publiceren tot scope en kostenverdeling zijn opgehelderd.
- Alternatieve historische arbeidsbedragen voor hout en hout-beton zijn locatiespecifiek inclusief voorwerk; geen publieke standaardmontagetarieven.

### Prijsstatussen voor de klant
| Status | Wanneer | Klantweergave |
| --- | --- | --- |
| Vast tarief | Bevestigd uur-/diensttarief met scope | Bedrag, btw, eenheid, wat apart komt |
| Actuele artikelprijs | SKU, leverancier en verkoopprijs gecontroleerd | Verkoopprijs, hoeveelheid, peildatum, levering apart indien onbekend |
| Richtprijs / bandbreedte | Onderbouwde uren/hoeveelheden en onzekerheid | Indicatie plus aannames en opname waar nodig |
| Vanafprijs | Realistisch daadwerkelijk bestelbaar minimaal pakket | Minimale scope en extra posten helder |
| Op aanvraag | Geen betrouwbare prijsregel of situatie te onzeker | Welke informatie nodig is; geen leeg veld of EUR 0 |
| Verouderd / tijdelijk onbekend | Bron verlopen of productstatus onbekend | Prijs laten controleren; geen bindende automatische order |

Bekende subtotaalbedragen mogen worden getoond, maar een totaal is niet "compleet" wanneer verplichte levering/afvoer/arbeid ontbreekt. Toon dan "bekende onderdelen" plus de nog te bepalen posten. Onbekend is null/status, niet zero.
Publieke arbeidsprijs toont consumentbedrag inclusief btw, eenheid "per medewerker per uur" en uitsluitingen. Voor zakelijk kan excl./incl. expliciet worden weergegeven. Btw wordt per prestatie correct geconfigureerd; geen blanket 21% voor alle beplanting/artikelen. Verleggingsregels worden niet blind toegepast.
Publieke prijzen bevatten geen interne inkoop, marge of vertrouwelijke leveranciersafspraken. De private engine slaat die beveiligd op; de frontend ontvangt uitsluitend toegestane klantprijzen.

### Calculatie en bedrijfslogica
Per regel: artikel/dienst-ID; hoeveelheid; eenheid; prijsstatus; verkoopprijs excl.; btwcode; inbegrepen scope; datum; bronreferentie; geldigheid; onzekerheden. Private uitbreiding: kostprijs, opslag/marge, leverancier, transport, huur, arbeidskost en controlevlag.
Arbeid = gecontroleerde persoonsuren × bevestigd tarief. Teamdagen zijn niet persoonsuren. Urennormen moeten uit eigen uitvoering, onderbouwde offertes of expliciete voorlopige aannames komen.
Geen willekeurig materiaalopslagpercentage vastleggen als beleid. Eerst echte kosten plus transport/handling bepalen en vergelijken met gelijkwaardige marktproducten. Onderscheid opslag op kostprijs en brutomarge op verkoopprijs. Neem prijsafronding, minimumopdracht, reistijd, transport en afvalregels expliciet op als nog te bevestigen instellingen.
Geen dubbele kosten voor container/groenafval, gedeelde rit of montage bij meerdere onderdelen in dezelfde opdracht. Materiaal door klant geleverd veroorzaakt geen automatische materiaalverkoopregel. Reeds geaccepteerde offertes blijven intact bij tariefwijziging.

## 8 Onderzoek — representatief, herbruikbaar en brongebonden
Gebruik de acht regionale bedrijven en specialistische configuratorvoorbeelden uit v2.0 als onderzoeksbasis; oude waarnemingen zijn gedateerd. Vul gericht aan wanneer een concrete ontbrekende beslissing daarom vraagt. Vergelijk bij een brede nieuwe marktclaim minimaal circa 10 relevante aanbieders en vergelijk dezelfde scope, btw, afvoer, materiaal, toegang en regio. Een losse richtprijsgids vervangt geen bedrijfsprijslijst.
Sla per benchmark URL, bezoekdatum, letterlijke scope, prijsbasis en beperkingen op. Een niet-aangetroffen functie is geen bewezen afwezigheid. Gebruik patterns uit meubelconfigurators, keukenplanning, materiaalwebshops en onderhoudscontracten als hypotheses; kopieer geen assets/code/merk.
Nieuwe gecontroleerde referenties op 9 oktober 2026:
- KernGroen tarieven: https://www.kerngroen.nl/tarieven/ — publiceert EUR 57,50 excl./EUR 69,58 incl. per uur; verifieer inbegrepen scope.
- Riet-Poel: https://rietpoelhoveniers.nl/prijzen — publiceert regulier EUR 55–65 INCL. btw per medewerker per uur, normaal groenafval inbegrepen; geen gelijkwaardige vergelijking wanneer SEAL-afvoer apart is.
- WPC Solutions montage: https://wpc-solutions.com/pages/montage-schuttingen — lengte, palen, systeem, toegang, poort, verwijderen en obstakels beïnvloeden montage; gebruik actueel schema met gecontroleerde scope.
- Houthandel van Gelder: https://www.houthandelvangelder.nl/blogs/hout-blog/wat-kost-een-schutting-prijzen-per-type-en-per-met/ — hout-beton materiaal vanaf circa EUR 69/m EXCLUSIEF montage volgens pagina; dit is geen SEAL-verkoopprijs.
- P. van Hoek Montage: https://www.pvanhoekmontage.nl/composiet-schuttingen/ — vanafprijzen per variant, controleer inclusies voordat vergelijking.
- TEMM en TUIN: https://temm-tuin.nl/blog/kosten-hovenier/ — redactionele branchebanden op bedrijfswebsite, geen bevestigde offerte aan SEAL.
Deze bronnen stellen geen SEAL-m²-/meterprijzen vast. Eigen EUR 60 excl. is hoger dan sommige onderhoudsaanbieders; presenteer concrete kwaliteit en scope zonder prijsleiderschapsclaim.

## 9 Techniek, aanvragen, veiligheid en beheer
Hergebruik de bestaande stack. Bouw geen CMS, CRM en webshop van nul wanneer de bestaande site en een kleine adapter de klantflow kunnen dragen.
Servicecontent, projects, materials en public prices krijgen gestructureerde records; één renderer per paginatype en één aanvraagopbouw. Publiceer servicepagina's met bruikbare crawlbare HTML en werkende directe routes.
Aanvraagdossier: project-ID, dienst(en), route, geometry, behouden/verwijderen/nieuw, materialen, hoeveelheden, prijsstatus, situatie, afvoer, toegang, budgetrichting indien ingevuld, bestanden, contactkanaal/voorkeur en privacyversie.
Prijsregels worden voor een bindend bedrag server-side herberekend. Frontendindicatie is niet beveiligde verkoopautoriteit.
Gebruik bestaande werkende ontvangende infrastructuur als die voldoet. Zo niet: adapter met duidelijk gedocumenteerde ontbrekende instellingen. SMTP/API-secrets niet in publiek JavaScript, repository of logs. Geen complete klantdossiers/CV's in lokale ontwerpopslag.
Valideer zowel client als server. Uploadlimieten, MIME/contentcontrole, spam/rate limiting, idempotency, toegang, retentie en foutmeldingen volgen v2.0. Succesbericht uitsluitend na echte bevestigde ontvangst. Eén bruikbaar contactkanaal volstaat voor korte intake indien backend dit ondersteunt.
Beheerhandleiding: diensttekst/foto aanpassen, artikelprijs actualiseren, verouderde prijs blokkeren, nieuw project toevoegen, aanvraag controleren, tarief wijzigen en rollback. Vermijd afhankelijkheid van Claude voor iedere eenvoudige contentwijziging.
SEO: echte diensten/regio's, nuttige titels, canonicals, sitemap, interne links, projectbewijs en accurate structured data. Geen honderden vrijwel identieke wijkpagina's, fictieve lokale vestigingen of fake aggregateRating.
Analytics meet afgeronde relevante aanvragen en flowfouten; geen PII/foto's/ontwerpinhoud naar advertentieplatforms. Gebruik consent waar van toepassing en houd kernsite zonder trackers bruikbaar.

## 10 Tokenzuinige uitvoering zonder verlies van eisen
Deze versie OVERRULET v2.0 "lees het hele dossier één keer volledig" en vervangt dat door progressieve toegang met volledige eisenindex.
- Bewaar dit bestand één keer als docs/SEAL_MASTER_BRIEF.md. Maak korte docs/IMPLEMENTATION_STATUS.md en docs/REQUIREMENTS_INDEX.md. Hoofd-CLAUDE.md bevat alleen kritieke bedrijfsregels, locatie van de brief en hervatinstructie.
- Kopieer niet de volledige brief in gesprekken, reviews, toolcalls of iedere component. Lees alleen betrokken hoofdstukken/regelselecties.
- Onderzoek/teksten/tarieven hierboven zijn voorbereid materiaal. Heronderzoek uitsluitend vluchtige gegevens of een werkelijk ontbrekende beslissing.
- Gebruik rg --files en gerichte zoekopdrachten. Geen node_modules/lockfile/assetdump, hele toolcatalogus, volledige netwerklogs of steeds dezelfde geslaagde tests.
- Eén uitvoerder als standaard. Geen agentteam, meerdere reviewers of meerdere ontwerpvarianten uit gewoonte. Plugins alleen bij een concrete taak; ChatGPT-installatie betekent geen Claude-verbinding.
- Geef de gekozen kwaliteit/modelinstelling niet ongemerkt op. Standaard geen betaald extra gebruik inschakelen. Beschrijf bij een limiet precies hoe de bestaande taak verdergaat.
- Gebruik /usage en /context waar beschikbaar en passend. /compact kan context samenvatten, maar ververst geen Pro-gebruiksvenster. /clear is geen truc om abonnementslimieten op te heffen; veilig hervatten kan vanuit opgeslagen checkpoint.
- Bundel onafhankelijke zoek-/leesacties; schrijf herbruikbare componenten; voeg foto's met manifest in batches toe.
- Test gewijzigde functies en kritieke regressies. Uitvoer: korte foutmelding/resultaat; uitgebreide logs in bestand, niet context.
- Werkvolgorde volgt afhankelijkheden: huidige fouten controleren; gedeelde data/rekenbasis; 2D/3D; klantprijs/aanvraag; content/design; veilige zakelijke uitbreidingen. Dit is één doorlopende opdracht, geen losse door de gebruiker te starten fases.
- Beëindig een sessie niet bij een plan wanneer codewerk mogelijk is. Sla vóór limiet en na significante delen voortgang op. Hervatten leest status, gitdiff en alleen de benodigde briefsecties.
Officiële referentie: https://code.claude.com/docs/en/costs (gecontroleerd 9 oktober 2026). Planverbruik en API-dollarindicatie zijn verschillende dingen. Beloften over exacte tokens of gegarandeerde voltooiing binnen één venster zijn niet toegestaan.

## 11 Acceptatie — aantonen dat de klantreis werkt
Alle bestaande v2.0-tests blijven gelden. Voeg minimaal toe:
| Controle | Vereist resultaat |
| --- | --- |
| Tarief | 1 medewerker × 8 uur × EUR 60 = EUR 480 excl.; met 21% EUR 580,80 incl. |
| Bemanning | 3+2+2 medewerkers elk 8 uur = 56 uur, niet 24 uur |
| Onbekende prijs | Geen nulprijs, geen volledig totaal, wel vervolgvraag |
| Eigen materiaal | Geen materiaalverkoopregel, wel compatibiliteitscontrole |
| Historische offerte | Geen stille nieuwe EUR 60-herberekening van akkoordbedrag |
| Foto/categorie | Werkelijk beeld klopt met tekst in kaart, filter en lightbox |
| Groenkeuze | Behouden groen blijft behouden in 2D, 3D en aanvraag |
| Diensttemplate | Inhoud/CTA verschillen correct per dienst; geen dummyblokken |
| Materiaalvergelijking | Prijsbasis en inclusies gelijksoortig of verschil zichtbaar |
| 2D/3D/prijs | Zelfde state, hoeveelheden en poortopeningen |
| Overlap/ronding | Bestaande geometriegrenzen en eerdere epsilon-/overlapgevallen blijven correct |
| Aanvraag | Complete data/foto's/ontwerp aankomst aantoonbaar, juiste ontvanger |
| Dubbel klikken | Geen dubbele aanvraag of order door herhaald versturen |
| Offline/WebGL | Bruikbare fout/fallback; geen verloren ontwerp |
| Mobiel | 360–430 px geen afgesneden opties, overdekking of onbruikbare 3D-bediening |
| Toetsenbord | Menus, accordions, vergelijkingen, formulieren en 3D-alternatieven bereikbaar |
| Directe route | Dienst/projectpagina werkt na direct openen en verversen |
| Privacy | Geen inkoop/marge/secrets/PII in publieke bundle, URL of analytics |
| Publicatie | Canonical, echte contactlinks, prijsstatus, HTTPS en rollback gecontroleerd |

Richt op WCAG 2.2 AA: semantiek, focus, contrast, labels, foutrelaties, alternatieven voor slepen, reduced motion en toegankelijke tabellen. Toegankelijkheid wordt werkelijk gecontroleerd, niet alleen als badge geclaimd.
Webprestatie: lazy 3D, responsive fotografie, geen onnodige dependencies. Meet lokaal op een vastgelegde mobiele configuratie en meld beperkingen. Streef naar LCP <=2,5 s, CLS <=0,1 en INP <=200 ms waar representatieve meting beschikbaar is; geen verzonnen veldmetingen of gegarandeerde Lighthouse 100.
Oplevering: werkende preview, mobiele/desktopbeelden, korte uitleg wijzigingen, echte testresultaten, eventueel extern geblokkeerde onderdelen, hervatinstructie en release-/rollbackprocedure. Noem iets uitsluitend af als gedrag is gecontroleerd.

## 12 Dekking van de volledige v2.0-opdracht
Gebruik deze index om gericht bijlagen te lezen; de volledige teksten staan hieronder.
| Werkgebied | v2.0-hoofdstukken |
| --- | --- |
| Onderzoek, doelen, repo en identiteit | 1–6 |
| Dienst-/content-/foto-/prijs-/configuratordetails | Raadpleeg hoofdstukkoppen 7–27 gericht |
| Kernacceptatie | 28 |
| Oplevering / bronnen | 29–31 |
| Bestaande browserbevindingen | 32 |
| Gebruik/context | 33, vervangen waar strijdig door v3.0 §10 |
| Visuele richting | 34 en 45 |
| Projectplatform en navigatie | 35–36 |
| Bestaand/verwijderen/grond/afval | 37 |
| Leveranciers, prijzen en interne assistent | 38–39 |
| Documenten en orderarchitectuur | 40–41 |
| Operatie, kwaliteit, marketing | 42–44 |
| Backend en aanvullende tests | 46–47 |
| Uitvoeringsprioriteit en juridische broncontrole | 48–50 |
Alle hoofdstukken 1–50 zijn hieronder behouden. v3.0 voegt groeninhoud, UX-opties, bevestigde arbeidstarieven, historische-prijsgrenzen en progressieve context toe. Bij verschil geldt de meest recente bevestigde regel hierboven. V2.0-prijzen/onderzoek zijn geen actuele universele verkooptarieven.

## 13 Open bedrijfsinstellingen — geen excuus om de site te stoppen
Werkende intake en prijsstatus kunnen worden gebouwd terwijl onderstaande zaken nog worden vastgesteld:
- offerte 11,5 m versus presentatie 14,2 m en aandeel/verdeling;
- uren-/productiviteitsnormen per dienst en ondergrond;
- minimumopdracht, reis-/voorrijkosten, machinehuur en afvaltarieven;
- materiaalverkoopmarge/opslag en echte leveranciersafspraken;
- welke specialistische diensten beschikbaar zijn;
- correcte juridische identiteit, contactlijn en documentvoorwaarden;
- endpoint, mailboxontvangst, opslag en eventueel order-/boekhoudkoppeling.
Laat deze velden ongeconfigureerd of "op aanvraag"; verzin geen beleid. Maak een compacte BLOCKERS-sectie met eigenaar en concrete benodigde instelling. Geen nieuwe vragen voor keuzes die uit dossier of bestaande code af te leiden zijn.

---
# REFERENTIEBIJLAGE — complete v2.0, historische specificatie
Onderstaande tekst is volledig behouden voor dekking. Bij conflict hebben de v3.0-regels hierboven voorrang. Lees onderdelen op behoefte; niet automatisch de hele bijlage.

# SEAL Claude Code Masterprompt — website, 3D tuinontwerp, materiaalplatform en commerciële operatie

Versie 2.0 MASTER • 7 oktober 2026 • Opdrachtgever Sealcleaning • Uitvoerder Claude Code

Dit dossier is één complete bouwopdracht voor het verbeteren van de bestaande Sealcleaning website. Het combineert concurrentieonderzoek, fotografie, navigatie, conversie, echte interactieve 3D, aanvraagverwerking, prijsinformatie en toetsbare kwaliteitseisen. Behoud de bestaande premium identiteit en bouw daadwerkelijk in de repository.

**Gebruik:** geef dit hele bestand aan Claude Code met toegang tot de website repository. Alle hoofdstukken, tabellen en bijlagen horen bij dezelfde opdracht. Het dossier bevat voldoende beslisregels om zelfstandig door te werken. Externe gegevens die werkelijk ontbreken, krijgen een zichtbare status en een werkende fallback.

**Prioriteit bij conflict:** versie 2.0 is de nieuwste instructie. Hoofdstuk 35–50 en expliciete versie-2.0 wijzigingen overrulen oudere passages waar die botsen. Oudere onderzoeksfeiten en testbevindingen blijven bruikbaar zolang ze niet door nieuwere controle zijn achterhaald.

De professionele mentaliteit van een groot, ervaren hoveniersbedrijf is de kwaliteitsnorm. Dat is geen toestemming om 50 jaar ervaring, miljoenenomzet, certificaten, personeel, garanties of reviews als bedrijfsfeiten te presenteren. Het doel is aantoonbaar betere bruikbaarheid en aanvragen in Dordrecht. Een eerste positie in Google of marktdominantie kan niet worden gegarandeerd.

## 1 Opdracht en beslisregels

Je bent verantwoordelijk voor productkeuzes, frontend, 2D/3D, toegankelijkheid, SEO, privacy, calculatiearchitectuur, prijs- en productarchitectuur, aanvraag- en orderflows, offerte/factuurdocumenten, B2B-instroom, recruitmentvoorbereiding en regressietests. Werk met de zorgvuldigheid van een senior multidisciplinair team dat een belangrijk commercieel digitaal product oplevert.

- Voer verbeteringen uit in de bestanden. Stop niet bij advies, mockups of een plan.
- Inspecteer eerst bestaande code, assets, configuratie en repository instructies. Behoud bruikbare onderdelen en gebruikerswijzigingen.
- Echte 3D voor schuttingen én bestrating is verplicht in deze implementatie. Verlaag indien nodig grafische complexiteit; stel de functionele 3D scope niet uit.
- Combineer schutting en bestrating in één eenvoudige tuin scène. Alle schermen, 3D, prijsinformatie en aanvraag lezen dezelfde projectstate.
- Prijsinformatie mag nu worden toegevoegd op basis van controleerbare bronnen. Onderscheid leveranciersprijzen, marktbenchmarks, eigen verkoopprijzen en projectoffertes.
- Maak routinekeuzes zelfstandig. Vraag alleen om een werkelijk onmisbare ontbrekende toegang of een onomkeerbare wijziging die niet is geautoriseerd. Werk intussen door aan onafhankelijke onderdelen.
- Verander hosting, DNS, mailboxen, externe accounts of advertentiebudgetten niet als onderdeel van deze codeopdracht. Bereid een concrete, gecontroleerde release voor binnen de repository afspraken.
- Bij beperkte sessieruimte: leg voortgang vast in docs/IMPLEMENTATION_STATUS.md, inclusief werkende functies, tests en volgende commando’s. Dit dossier blijft de opdracht; vraag niet om een nieuwe prompt.
- Laat geen zichtbare dode knoppen, nepfunctionaliteit of onafgemaakte kernflow achter. Rapporteer een blokkade precies, zonder een ongeteste functie als gereed te markeren.

## 2 Onderzoeksbasis en beperkingen

Het openbare onderzoek is uitgevoerd op 7 oktober 2026. Acht directe en regionale hoveniers zijn vergeleken, aangevuld met configuratorspecialisten en leveranciers. De vergelijking betreft ontsloten pagina inhoud en herkenbare informatiearchitectuur. Er zijn geen gemeten snelheidsranglijsten, volledige mobiele audits of end to end tests van concurrenten uitgevoerd. Een niet waargenomen functie is geen bewijs dat zij nergens bestaat.

De actuele Sealcleaning repository en originele projectfoto’s waren bij het opstellen niet beschikbaar. Na de eerste versie is https://sealcleaning.nl/ wel rechtstreeks in een browser gecontroleerd: homepage, projectfilter, lightbox, contactformulier en de bestratingswizard tot aan de ingevulde contactpagina. De openbare onderzoekstool kon de site nog niet ophalen; dat is geen bewijs van een offline site. De bevindingen in hoofdstuk 32 zijn browserwaarnemingen. Bestandsstructuur, backendontvangst, alle dienstpagina’s, mobiel gedrag en broncode moeten tijdens uitvoering nog worden gecontroleerd.

Bronverwijzingen staan in hoofdstuk 30. Ze zijn onderdeel van het dossier. Controleer vluchtige productprijzen opnieuw tijdens uitvoering en registreer verschillen. Claims van concurrenten blijven claims op hun eigen websites; neem ze niet over als Sealcleaning bewijs.

## 3 Vergelijking van lokale en regionale hoveniers

| Bedrijf en bereik | Aangetroffen sterke aanpak | Kans voor Sealcleaning | Bron |
| --- | --- | --- | --- |
| Visser Tuinservice, Dordrecht en omgeving | Dienststructuur, veel benoemde tuincases met plaats, eigen projecten en Google reviewroute | Koppel een case direct aan een passende configuratie; laat de klant vanuit inspiratie een eigen ontwerp maken | S01 |
| De Biesbosch Gijsbers Groep, Dordrecht en Drechtsteden | Complete tuin als samenhangend plan; ontwerp, aanleg en onderhoud verbonden; expliciete trustinformatie | Toon die samenhang interactief en maak offerteonderdelen inzichtelijk; gebruik uitsluitend eigen bevestigd bewijs | S02 |
| Stam Hoveniers, Dordrecht en regio | Premium tuinvisie, ontwerp, impressies, showroom en materiaalpartners | Maak kwaliteit tastbaar met echte afwerkingsdetails en materiaalvergelijkingen die klanten zelf bedienen | S03 |
| Baan Hofman, Dordrecht | Brede disciplines, projecten en één aanspreekpunt, ook na oplevering | Maak het traject van wens tot onderhoud concreet en geef een klant een bruikbaar dossier mee | S04 |
| De Groene M, Dordrecht | Groen en infra, houtwerk, onderhoud en 3D ontwerp op aanvraag | Echte zelfbediening in 3D vóór de aanvraag; onderscheid dat van een 3D ontwerp dat het bedrijf later maakt | S05 |
| Drechtsteden Hoveniers, Dordrecht | Veel tuinonderdelen en zowel eenmalig als periodiek onderhoud | Begeleid de klant bij die breedte met korte dienstspecifieke vragen en relevante keuzes | S06 |
| Van der Elst Hoveniers, Drechtsteden | Grondwerk, bestrating en beplanting expliciet; regionale route en offerte CTA | Laat foto’s, gekozen onderdelen en technische aandachtspunten direct bij elkaar aansluiten | S07 |
| Zoon Hovenier, actief in Dordrecht | Familiebedrijf, klantverhalen en aparte onderhoudsopties | Verbind echte verhalen met vergelijkbare cases, herstelkeuzes en een onderhoudsaanvraag na aanleg | S08 |

Onze gevolgtrekking: mooie fotografie en een offerteknop zijn al gangbaar. Het sterkste onderscheid wordt de combinatie van echte cases, duidelijke keuzehulp, maatvaste 3D, transparante prijscomponenten en een complete aanvraag. Deze combinatie is onze productrichting, geen onderbouwde claim dat geen enkele concurrent haar aanbiedt.

| Aanvullend voorbeeld | Waargenomen patroon | Te gebruiken principe | Bron |
| --- | --- | --- | --- |
| Schutting Direct | Vormkeuze, materialen, poorten, services en overzicht in een gefaseerde aanvraag | Maak afhankelijkheden begrijpelijk en stuur de hele samenstelling mee | S09 |
| EvoWood | Secties in 3D selecteren, materiaalkeuze, draaien, delen en afbeelding downloaden in de interface | Maak de geometrie bewerkbaar en bied ontwerp export; verifieer onze uitvoering zelf | S10 |
| ForaVida | Configuratorpagina beschrijft 3D weergave en aanvullende opties | Toon opties meteen in het ontwerp wanneer ze ruimtelijk relevant zijn | S11 |
| HomingXL | Productgegevens, inspiratie en uitgesplitste montagekosten met voorwaarden | Scheid product, montage, vervoer en aanvullend werk in de prijsarchitectuur | S12 en S13 |
| Riet Poel Hoveniers, Rotterdam | Openbare richtprijzen met btw, actualisatiedatum, medewerkerbasis en afvoervoorwaarden | Maak onze prijsinformatie eveneens controleerbaar en leg verschillen in scope uit | S14 |

Kopieer geen teksten, foto’s, code, reviews, merkidentiteiten of ontwerpen van deze bedrijven. Gebruik patronen als onderzoeksmateriaal.

## 4 Meetbaar commercieel doel

Optimaliseer voor passende, complete aanvragen en winstgevende uitvoering. Pageviews en aantallen configuratorstarts zijn ondersteunende signalen.

Meet zodra toestemming en analytics zijn ingericht: afgeronde aanvragen per dienst, aandeel aanvragen met maten en foto’s, ontbrekende gegevens, contactvoorkeur, tijd van aanvraag tot persoonlijke reactie, offerteacceptatie en brutomarge per soort werk. Offerteacceptatie en marge vereisen bedrijfsgegevens en zijn geen browsermetrics.

Maak de beslisroute kort: zien wat Sealcleaning doet, bewijs bekijken, dienst kiezen, zelf ontwerpen of hulp kiezen, situatie aanvullen en aanvraag versturen. Geef bezoekers die niet willen ontwerpen ook een korte route met foto’s en omschrijving. Verplicht 3D niet om contact te kunnen opnemen.

Geen verzonnen schaarste, aftelklokken, automatische claim “binnen 5 minuten offerte”, kunstmatige badges of verplichte gegevens vóór de eerste preview. Geen popups die de gebruiker vroegtijdig onderbreken.

## 5 Repository onderzoek vóór wijzigen

Lees AGENTS.md en overige toepasselijke repository instructies. Controleer gitstatus, branch, deploymentproces, buildinstellingen en bestaande tests. Maak binnen de repository werkwijze een veilige featurebranch of geïsoleerde checkout. Behoud ongecommitte werk.

Inspecteer minimaal index.html, css/style.css, projecten/index.html, contact/index.html, schuttingen/index.html, bestrating/index.html, tuinaanleg/index.html, tuinrenovatie/index.html, werkwijze/index.html, werkgebied/index.html, js/config.js, js/main.js, js/wizard.js, js/wizard-prefill.js, js/lightbox.js, sitemap.xml, robots.txt, README.md en images/projects/. Controleer daarnaast alle dienstpagina’s, over ons, kennisbank, footer, privacy, 404 en eventuele form scripts.

Leg routes, bestaande wizardstate, hergebruikte componenten, contactgegevens, assets, claims, externe dependencies en terugkerende inconsistenties vast. Onderzoek de gemelde fout “Diensten verwijst naar /projecten/” in de actuele code en herstel alle voorkomens.

Behouden tenzij een concreet probleem verbetering vraagt: deep forest, sand en stone palette, Fraunces en Inter, echte fotografie, ruime editorial opbouw, responsive layout, skip link, focus states, reduced motion, canonicals, bestaande relevante structured data, WebP en mobiele contactmogelijkheden. Gooi de wizardlogica niet zonder onderzoek weg.

De site blijft geschikt voor de bestaande statische GitHub Pages omgeving. Een lokale build of generator mag, maar publiceer de gegenereerde statische bestanden met de correcte Pages configuratie. Introduceer geen frameworkmigratie zonder aantoonbare noodzaak. GitHub Pages voert geen eigen formulierbackend uit [S27].

## 6 Centrale gegevens en componenten

Organiseer gegevens bij voorkeur in data/projects.js, data/services.js, data/materials.js, data/fence-products.js, data/paving-products.js, data/price-sources.json en data/reviews.js. Gebruik stabiele IDs, geldige schema’s en één schrijfwijze per dienst. Bestaande architectuur mag andere namen krijgen als het resultaat even helder is.

Bedrijfsnaam, telefoon, WhatsApp, e-mail, KvK, btw nummer, werkgebied, domein en eventuele openingstijden komen uit één gecontroleerde businessconfig. Controleer tegen bestaande officiële gegevens; verzin ontbrekende waarden niet. De nieuwste door opdrachtgever aangeleverde bedrijfsset is hieronder leidend zolang een officiële controle haar niet tegenspreekt:

- Publieke handelsnaam: Sealcleaning Groenonderhoud en Aanleg; merknaam: Sealcleaning.
- KvK: 83078665. Dit nummer staat ook in de huidige repository. Verifieer in het actuele Handelsregister vóór definitieve juridische publicatie, maar vervang het niet op basis van oudere geheugeninformatie.
- Btw-id: NL003773849B79. Dit komt overeen met de huidige repository en de nieuwste gebruikersopgave; verifieer in de eigen administratie vóór officiële facturatie.
- Adres: Romboutslaan 582, 3312 KP Dordrecht. Het adres/postcodepaar bestaat; verifieer dat dit het juiste geregistreerde en openbaar te gebruiken ondernemingsadres is vóór webshop/contractgebruik.
- Publiek zakelijk telefoonnummer: +31 78 204 95 17, weer te geven als 078 204 95 17. Dit is de nieuwste door opdrachtgever bevestigde publieke bellijn en vervangt het oude zichtbare mobiele belnummer.
- WhatsApp: gebruik +31 6 48 87 19 86 (wa.me: 31648871986) alleen achter een WhatsApp-icoon/CTA en toon de cijferreeks nergens als zichtbare tekst. Een directe wa.me-link bevat technisch het nummer in de href en is dus niet geheim voor iemand die broncode inspecteert; beloof geen technische anonimiteit. Als echte afscherming gewenst is, is later een server-side redirect of officiële WhatsApp Business-integratie nodig.
- Huidige e-mail in de repository: sealcleaningaanleg@gmail.com. Gebruik een domeinmail zoals info@sealcleaning.nl pas wanneer die mailbox werkelijk bestaat en is getest. Bereid SPF/DKIM/DMARC en transactional-mail documentatie voor, maar wijzig DNS/mail niet zonder toestemming.

Publiceer geen privégegevens die niet functioneel of wettelijk nodig zijn en verzin geen showroom, IBAN, verzekeringsnummer, certificaat, garantie of openingstijd.

Modulaire code voor state, validatie, projectsummary, prijsregels, submission, analytics en 3D builders. Gebruik herbruikbare functies voor nummerformaten, maatconversie en tekstlabels. Houd een bestand bij voorkeur onder ongeveer 400 regels als dat logisch kan, maar maak geen kunstmatige versnippering.

Eén centrale state is leidend. Deriveer lengte, oppervlakte, materiaalindicatie en prijscomponenten; sla geen tweede, mogelijk verouderd totaal op. Camera en tijdelijke formulierinvoer zijn viewstate. Bestanden blijven in een aparte runtime opslag, gekoppeld met IDs aan het dossier.

## 7 Eigen fotografie volledig benutten

Maak eerst een visueel gecontroleerde inventaris van alle afbeeldingen: bestandsnaam, resolutie, oriëntatie, mogelijke case, zichtbaar onderwerp, kwaliteitsstatus, relevante diensten, privacy en bruikbare uitsnedes. Maak een contact sheet voor interne beoordeling en inspecteer de foto’s zelf. Bestandsnamen zijn aanwijzingen, geen sluitend bewijs.

Groepeer bijvoorbeeld schutting-grenen-zwarte-voet-1/2/3, schutting-horizontaal-lamellen-*, schutting-kastanje-paaltjes-dordrecht-1/2, terras-houtlook-kunstgras-pad-*, terras-kunstgras-zwart-plantenbak-* en waterzijde-tuin-* alleen als beeldinhoud en bestaande informatie de samenhang ondersteunen. Leg twijfel vast. Onzekere beelden mogen als algemene inspiratie met correcte omschrijving worden gebruikt, zonder verzonnen casegeschiedenis.

- Eén uitgevoerd werk is één case met meerdere beelden. Niet één case per foto.
- Eén case kan meerdere diensten bevatten. Gebruik primaryService én services[], bijvoorbeeld tuinaanleg plus bestrating en schutting.
- Geef een foto een rol: cover, totaalbeeld, afwerkingsdetail, aantoonbaar voor/tijdens/na of uitvoering. Bevestig de chronologie vóór labels of een voor en na slider.
- Kies per plaatsing een passende uitsnede en focal point. Een klein detailbeeld is geen geloofwaardige hero voor een volledige tuin.
- Toon op schuttingpagina’s schuttingcases en details van poort, palen en aansluitingen; op bestrating pagina’s terras, pad, kantopsluiting en afwerking; op onderhoud echte onderhoudsresultaten.
- Gebruik enkele sterke covers op de homepage. Laat niet dezelfde foto in iedere sectie terugkomen.
- Genereer benodigde responsive maten vanuit originele bestanden, behoud de originele bestanden en voorkom herhaald verlies door compressie.
- Stel width/height of aspect ratio in. Lazyload onder de vouw; hero krijgt passende prioriteit. Test srcset en sizes vanaf subroutes.
- Alt tekst beschrijft zichtbaar beeld. Geen SEO opsomming. Verberg decoratieve dubbele afbeeldingen correct voor assistieve technologie.
- Verwijder gevoelige EXIF locatiegegevens uit publieke afgeleiden. Beoordeel gezichten, kentekens, huisnummers en toestemming; publiceer geen volledige klantnamen of adressen zonder basis.

Maak een assetmanifest met koppeling naar cases en pagina’s, zodat een nieuw project later op één plek kan worden toegevoegd. Markeer een render van de configurator als visualisatie; meng hem niet tussen uitgevoerd werk zonder label.

## 8 Projecten als complete cases

Projectdatamodel: slug, title, primaryService, services[], location met verificatiestatus, coverImage, gallery[] met alt/focalPoint/stage, summary, situation, workDone[], materials[], duration, dimensions, tags[], featured, relatedServices[], evidence en publishStatus. Onbekende velden zijn null of ontbreken in de presentatie.

Projectkaart: grote cover, duidelijke naam, plaats indien bevestigd, dienst, twee tot vier inhoudelijke tags en “Bekijk project”. Geen fictieve locatie, duur, materiaalsoort of aantal projecten. Een houtlook tegel op een foto bewijst bijvoorbeeld niet dat het een bepaald keramisch merk is.

Filters: Alle, Tuinaanleg, Renovatie, Bestrating, Schuttingen, Onderhoud en Snoeiwerk. Filter op alle gekoppelde services, met aantallen en duidelijke actieve status. Maak leeg resultaat begrijpelijk met “Wis filters”. Filterstatus mag in de URL zonder persoonsgegevens en moet browser terug/vooruit ondersteunen.

Maak statische detailroutes /projecten/[slug]/ als de repository dit met een kleine generator kan dragen. Genereer ze vanuit dezelfde data; niet afzonderlijk handmatig dupliceren. Deze routes moeten direct openen en vernieuwen op GitHub Pages. Een JS router met wildcard fallback is daarvoor onvoldoende.

Een case toont cover, alleen de eigen fotogalerij, situatie, aantoonbare werkzaamheden, resultaat, bekende materialen/maten en locatie. Laat lege kopjes weg. Toon geschikte gerelateerde cases en “Heeft u een vergelijkbaar project? Stel uw project samen”. Prefill alleen onderbouwde voorkeuren en laat de bezoeker zijn eigen maten opgeven.

Een modal mag aanvullend snelle weergave bieden. Gebruik een toegankelijk dialog met label, focusbeheer, Escape, correcte terugkeerfocus en scroll lock zonder pagina sprong. Lightboxnavigatie blijft beperkt tot de geselecteerde case. Maak ook een gewone link naar de detailpagina beschikbaar.

Een voor en na vergelijking krijgt toetsenbordknoppen en tekstlabels. Bouw haar alleen als twee foto’s aantoonbaar dezelfde situatie vóór en na tonen. Vergelijk niet willekeurige tuinen.

## 9 Routes en navigatie

| Route | Hoofddoel | Primaire actie |
| --- | --- | --- |
| / | Diensten en eigen bewijs snel begrijpen | Stel uw project samen |
| /diensten/ | De juiste dienst kiezen | Dienst bekijken of direct starten |
| Bestaande afzonderlijke dienstpagina’s | Keuzehulp, bewijs, voorwaarden en prijscontext | Start met deze dienst |
| /projecten/ en /projecten/[slug]/ | Werk bekijken en een vergelijkbaar plan starten | Stel uw project samen |
| /project-samenstellen/ | Ontwerp en complete aanvraag | Project aanvragen |
| /werkwijze/ | Van intake tot oplevering begrijpen | Begin uw aanvraag |
| /over-ons/ en /werkgebied/ | Bedrijf en regio controleren | Contact of starten |
| /contact/ | Direct contact of korte aanvraag | Versturen of bewust kiezen voor WhatsApp |
| /prijzen/ | Onderbouwde prijscontext en inbegrepen werk | Eigen situatie samenstellen |
| /kennisbank/ | Antwoorden op echte klantvragen | Relevante dienst of configurator |
| /privacy/ en /404.html | Privacyinformatie en routeherstel | Passende vervolglink |
| /materialen/ | Materiaalkeuze, pakketten en gecontroleerde prijscontext | Ontwerp koppelen of materiaal aanvragen |
| /voor-aannemers/ | B2B samenwerking, onderaanneming, VvE/zakelijk | Project of capaciteit aanvragen |
| /werken-met-ons/ | Vakmensen, zzp'ers en toekomstige medewerkers | Interesse / beschikbaarheid doorgeven |

Hoofdnavigatie: Home, Diensten, Projecten, Werkwijze, Over ons, Werkgebied en Contact. Maak “Stel uw project samen” de duidelijke CTA. Plaats Prijzen als secundaire link bij Diensten en in footer; voorkom een overvolle desktopbalk.

Een diensten dropdown ondersteunt toetsenbord en touch. De link naar het overzicht moet ook zelfstandig bruikbaar blijven. Toon actieve route, aria-current, duidelijke submenu status en een sluitknop op mobiel. Een enorme megamenu is pas nuttig als de inhoud het rechtvaardigt.

Behoud bestaande URL’s zoveel mogelijk. Maak bij verplaatsing een routekaart en beschikbare redirects; een canonical is geen redirect. Corrigeer alle interne links en relatieve paden. Ondersteun een projectrepo preview met basePath, los van het SEO hoofddomein.

## 10 Design en interactieve patronen

Het ontwerp blijft rustig, premium en bouwkundig helder. Echte fotografie, typografie, ritme, maatvoering en afwerking dragen het merk. Werk met herbruikbare spacing, kleur, type, button en form tokens.

| Inhoud of keuze | Geschikt patroon | Gedrag |
| --- | --- | --- |
| Eén dienst, vorm, hoogte of materiaal | Radio opties of compacte visuele keuzegroepen | Eén actieve keuze, tekstlabel, goede focus |
| Meerdere tuinwensen | Checkboxes met duidelijke labels | Meerdere keuzes, geen impliciete betaalde toevoegingen |
| Ondergrond of bereikbaarheid onbekend | Ja, nee, onbekend of korte select | Onbekend blijft een geldige waarde |
| Meer technische informatie | Details en summary of toegankelijk accordion | Basiskeuze blijft zichtbaar; samenvatting noemt gekozen waarde |
| Materiaalsoorten vergelijken | Tabel met gelijke criteria | Mobiel eigen scrollcontainer of leesbare rijen |
| Case kiezen | Foto en korte editorial tekst | Klik opent uitsluitend die case |
| Live projectoverzicht | Beschrijvingslijst en gegroepeerde regels | Wijzigen link gaat naar juiste stap |
| Fout of verzendstatus | Inline tekst plus statusregion | Niet alleen kleur of toast |
| Extra terrasvlak of poort | Herhaalbare benoemde sectie | Toevoegen, bewerken en verwijderen met heldere grenzen |

Gebruik consistente lijniconen met dezelfde stroke en optische maat. Labels blijven aanwezig; een onbekend icoon is geen uitleg. Geen emoji als hoofdiconografie, glassmorphism, decoratieve gradients of ontelbare afgeronde kaarten.

Maak details van materiaal, uitvoering, wat inbegrepen is en veelgestelde vragen inklapbaar. Plaats belangrijke prijsbeperkingen, fouten en geselecteerde opties nooit uitsluitend in een gesloten blok. Geen automatische sprong naar een volgende stap na een keuze.

Materialen vergelijken op uitstraling, onderhoud, privacy/doorkijk, toepassingsmogelijkheden, prijsbasis en geverifieerde productspecificaties. Gebruik vinkjes alleen voor concrete ondersteunde eigenschappen. Geen willekeurige scores of universele “beste keuze”. “Meest gekozen” alleen op basis van eigen meetgegevens.

## 11 Homepage en dienstpagina’s

Homepage hero vermeldt duidelijk tuinaanleg, renovatie, bestrating, schuttingen en onderhoud in Dordrecht en het bevestigde werkgebied. Voorbeeldrichting: “Uw tuinproject in Dordrecht begint met een goed plan”. Primaire CTA “Stel uw project samen”, secundair “Bekijk onze projecten”, subtiel telefoon/WhatsApp. Geen zware 3D scene of automatisch afgespeelde video in de hero.

Volgorde: hero, compacte dienstkeuze, enkele sterke cases, uitleg over zelf ontwerpen of advies, duidelijke werkwijze, materiaalkeuze of vergelijking, werkgebied, echte trustinformatie indien beschikbaar, enkele relevante FAQ’s en afsluitende CTA. Pas lengte aan inhoud aan; geen lege secties vullen.

De dienstenpagina omvat Tuinonderhoud, Tuinaanleg, Tuinrenovatie, Bestrating, Schuttingen, Snoeiwerk en Periodiek onderhoud. Kunstgras/gazon kan als dienst of onderdeel worden gekoppeld afhankelijk van de huidige website. Overige bevestigde diensten blijven behouden en krijgen een logische plaats.

Dienstpagina’s beantwoorden: voor welke situaties, welke opties, relevante cases, materiaalverschillen, kostenfactoren, inbegrepen versus extra werk, praktische voorbereiding, werkwijze en aanvraag. Maak herstel/ophogen/hergebruik zichtbaar naast volledige vervanging wanneer Sealcleaning dat aanbiedt. Gebruik geen probleemtaal die automatisch de duurste optie stuurt.

Voeg een korte keuzehulp toe bij schuttingen en bestrating. Laat de configurator direct met die dienst starten. Bij tuinaanleg of renovatie wordt een onderdelenlijst geopend. Onderhoud, snoeiwerk en periodiek onderhoud krijgen een korte intake zonder overbodige maatstappen.

Voor zakelijke klanten en VvE’s: conditionele keuze particulier/zakelijk, terreinoppervlak, onderhoudsfrequentie, bereikbaarheid, factuurwensen en contactpersoon. Geen apart portal of abonnementcontract dat online automatisch wordt afgesloten.

Reviewscomponent leest uit een leeg of geverifieerd databestand met bron, datum, toestemming/rechten en eventueel originele link. Publiceer geen placeholder review of fictieve totaalscore. Voeg geen eigen LocalBusiness sterrenmarkup toe om Google reviewsterren af te dwingen; daarvoor gelden beperkingen op reviews over het eigen bedrijf [S25].

## 12 Centrale configurator en korte aanvraagroute

Begin met “Wat wilt u laten uitvoeren?”: Complete tuinaanleg, Tuinrenovatie, Bestrating, Schutting, Tuinonderhoud, Snoeiwerk, Kunstgras/gazon, Periodiek onderhoud en Anders. Laat combineren toe zonder bestaande onderdelen te wissen.

Algemene route: dienst → ontwerpen of wensen → bestaande situatie en uitvoering → locatie/foto’s/planning → overzicht en contact → bewust versturen. Toon stapnaam, afgeronde stappen en voortgang op basis van de werkelijk benodigde route.

3D diensten starten met een bruikbaar voorbeeldontwerp vóór contactgegevens. Benoem voorbeeldmaten en maak wijzigen eenvoudig. Een voorbeeld is nooit een gerealiseerde klantcase. Bied “Ik weet de maten nog niet” en “Liever hulp bij mijn project”; die route levert een bruikbare intake met maatstatus onbekend.

Behoud state bij teruggaan, wijzigen, sluiten van een accordion en interne navigatie. Sla standaard alleen niet persoonlijke ontwerpkeuzes tijdelijk op. Persoonsgegevens en ruwe foto’s blijven in geheugen totdat bewust wordt verzonden. Bewaren op dit apparaat gebeurt expliciet, met verwijderoptie en ontwerpvervaltermijn, bijvoorbeeld 30 dagen als productkeuze.

Wanneer een dienstwisseling bestaande elementen beïnvloedt, leg uit wat er gebeurt en bied behouden als gecombineerd project of bewust verwijderen. Back/forward, reset, refreshherstel van niet persoonlijke keuzes en meerdere tabbladen mogen geen verborgen gegevensverlies veroorzaken.

Validation gebeurt per stap en bij verzending. Focus de eerste fout, toon een korte foutlijst met links, behoud invoer en gebruik begrijpelijke meldingen. Geef foutieve maatvelden niet stilzwijgend een minimumwaarde. Bewaar een tijdelijk lege tekstinvoer los van de laatst geldige geometrie.

De korte aanvraagroute vraagt dienst, omschrijving, postcode/plaats, foto’s optioneel en naam plus één bereikbaar contactkanaal. Geen verplicht account, adres vóór de preview of marketingtoestemming als voorwaarde voor een offerte.

## 13 Schuttingconfigurator

Vormen: I, L links, L rechts, U en meerdere losse delen. Definieer links/rechts vanuit één benoemd bovenaanzicht. Elk deel heeft een stabiel ID, beginpunt, richting en lengte. Zijde A/B/C blijft herkenbaar in formulier, labels, 3D en dossier.

Maten worden intern opgeslagen als gehele millimeters. Laat invoer als meter met decimale komma of punt toe en bied waar nuttig aparte meter/centimetervelden die dezelfde waarde aanpassen. Vermeld wat de gemeten lengte inhoudt. Onderscheid lijnlengte, palen en vrije poortopening; de preview mag geen onbedoelde extra meters toevoegen.

Hoogtes 100, 120, 150, 180 en 200 cm zijn generieke visualisatieopties. Bij officiële systemen toon alleen ondersteunde varianten. Definieer hoogte boven lokaal maaiveld; bij hout beton is totale hoogte inclusief onderplaat, niet schermhoogte plus onzichtbaar extra beton. Een 180 cm scherm met 26 cm onderplaat is niet zonder meer een 180 cm complete schutting.

Generieke systemen: volledig hout, hout beton, composiet, horizontale lamellen en gaas/hekwerk. Materiaalpresets: naturel/donker hout, antraciet composiet, grijs/antraciet beton. Noem ze generieke visualisaties totdat een werkelijk product is geselecteerd. Gaas krijgt geloofwaardige transparantie of lichte draadgeometrie; geen massieve muur met ander label.

Palen en panelen komen uit de systeemconfig: nominale schermbreedte, paaldikte, montageafstand, onderplaat en passtukregels. Voor een generieke preview mag bijvoorbeeld 180 cm nominale schermbreedte als expliciete aanname worden gebruikt, zonder dit als universele standaard te claimen. Dedupliceer gedeelde hoekpalen. Geometrie moet de ingevoerde lijn afsluiten; passtukken worden zichtbaar en benoemd.

Poorten zijn zichtbaar, met vrije breedte, hoogte, zijde, afstand vanaf het aangeduide beginpunt, scharnierkant en draairichting. Bied aantal toevoegen/verwijderen en meerdere poorten. Definieer vrije opening apart van blad en palen. Trek poortopeningen af van gesloten schermvakken. Geen dubbel paneel achter de poort en geen dubbele paal op dezelfde knoop.

Controleer dat iedere poort plus benodigde systeemruimte binnen de zijde past, poorten niet overlappen en plaatsing bij hoeken mogelijk is. Bij niet kloppende invoer: behoud het laatste geldige model, toon fout en laat corrigeren. Toon desgewenst een open/dicht preview, met een herkenbare opening; draaiing is geen constructieve goedkeuring.

Projectvragen: bestaande schutting, verwijderen, afvoer, materiaal zelf leveren of laten adviseren/leveren, ondergrond aarde/bestrating/beton/onbekend, hoogteverschil, bereikbaarheid, breedte achterom, obstakels/wortels, gedeelde erfgrens/burenoverleg, wensen, postcode, plaats, planning, foto’s en eigen schets. Een onbekende ondergrond blijft onbekend in prijs en dossier.

Live overzicht: vorm, zijden, totale lijnlengte inclusief openingen, gesloten schuttinglengte, hoogtes, systeem, kleuren, poorten en uitvoering. Leg de twee lengtes kort uit. Automatische aantallen zijn voorlopig materiaaladvies zolang inmeting en systeemgegevens niet definitief zijn.

Plaats geen algemene belofte “vergunningsvrij tot 2 meter”. Locatie, erfpositie en regels vragen controle. Bied een contextlink naar de actuele gemeente/Omgevingsloket informatie als die tijdens implementatie is geverifieerd. Geef de klant geen automatische juridische goedkeuring.

## 14 Bestratingsconfigurator

Toepassing: terras, pad, oprit, parkeerplaats of anders. Vraag lengte en breedte, meerdere rechthoekige vlakken, positie en oriëntatie. Bereken oppervlak per vlak en totaal. Toon het verschil tussen geometrisch oppervlak en te bestellen materiaal inclusief snijverlies.

Formaten minimaal 20 × 30, 30 × 30, 40 × 40, 60 × 60, 60 × 30 en 80 × 80 cm als generieke maten. Productkeuze kan extra formaten toevoegen. Bij officiële producten gebruik werkelijke afmetingen, nominale modulemaat en voegbreedte afzonderlijk.

Legpatronen: recht en halfsteens. Ondersteun richting 0/90 graden waar zinvol. Een patroonwijziging moet zichtbaar zijn in het raster. Voeg wildverband of visgraat pas toe wanneer geometrie, compatibiliteit en hoeveelheden correct zijn geïmplementeerd; laat geen nepoptie zien.

Materiaal/kleur: generiek beton, keramiek of klinkeruitstraling met lichtgrijs, grijs, antraciet, beige, bruin of roodbruin. Toon echte productnaam alleen na broncontrole. Een kleur maakt een tegel niet geschikt voor een oprit. Producteigenschappen en legmethode bepalen de toepasbaarheid; onbekende geschiktheid vraagt beoordeling.

Preview heeft echte gewijzigde verhoudingen en individuele of instanced tegels met voegen. Snijd randtegels op de begrenzing; geen uitstekende rasterstukken of halfsteens dat buiten het terras doorgaat. Snijstukken zijn geen volwaardige extra m². Legpatroon en materiaalstaat delen dezelfde layoutlogica.

Bij meerdere vlakken: controleer overlap. Kies eerst een robuuste regel “vlakken mogen elkaar niet overlappen”; markeer overlap en blokkeer dubbeltelling. Voeg pas een oppervlakte union toe als die daadwerkelijk is getest. Een naastgelegen terras en pad delen eventueel een rand, zonder overlapoppervlak.

Vraag: bestaande bestrating, behouden/hergebruiken/verwijderen, afvoer, huidige ondergrond, ophogen ja/nee/onbekend, hoogteverschil, wateroverlast, gewenste afwatering/drainage, kantopsluiting/opsluitbanden, materiaalkeuze en levering, voegafwerking, toegang en achterombreedte, planning en foto’s. Bekende gewenste afschotrichting mag worden aangegeven; geef geen universele funderingsdikte of technisch legadvies als automatische uitvoeringsspecificatie.

Tel opsluitbanden alleen langs werkelijk gekozen grenzen; niet standaard de gehele rechthoekomtrek als een rand al tegen een geschikte constructie aansluit. Maak hoekstukken, aansluitingen en regenwaterwensen zichtbaar als onderdelen voor beoordeling.

## 15 Complete tuin en overige diensten

Bouw een instelbaar tuinvlak met lengte/breedte, een herkenbare huiszijde, eenvoudig nulpunt en grenzen. Schutting en bestrating moeten in dezelfde schaal zichtbaar zijn. Laat elementen via getalsvelden plaatsen; optioneel aanvullend slepen met raster/snapping en altijd een alternatief zonder drag.

Breid dit tuinmodel uit met een maatvaste 2D-plankaart die dezelfde state gebruikt als de 3D-scène. De gebruiker kan starten met rechthoek, L-vorm, U-vorm of vrije polygooncontour. Iedere zijde/punt krijgt stabiele IDs en maatvelden; bereken de werkelijke oppervlakte met polygon area. Wanneer alleen “80 m²” bekend is zonder vorm, registreer areaKnown=true en geometryKnown=false; verzin geen 10 × 8 meter als echte tuin. Bied dan een duidelijk schematisch voorbeeld dat niet als ingemeten situatie wordt gepresenteerd.

Ondersteun bestaande elementen als afzonderlijke objecten met status existing-keep, existing-remove of new. Minimaal: bestaande poort, schutting, muur/gevel, schuur/berging, boom/stronk, haag/heg, terras/bestrating, gazon, border en een vrij obstakel. Bestaande te behouden objecten kunnen worden vergrendeld en tellen niet als nieuw materiaal/montage, maar beïnvloeden geometrie, vrije ruimte en aansluitingen. Een bestaande poort kan dus tussen twee nieuwe schuttingdelen blijven staan. Nieuwe schuttingsecties mogen aan beide zijden aansluiten zonder dat de poort als nieuw product wordt geprijsd.

Maak ook een echte verwijder-/slooplaag: oude schutting, tegels/klinkers, graszoden, kunstgras, struiken/heggen, bomen/stronken, wortels, grond/zand, puin, groenafval, meubels/objecten en “onbekende rommel/overig”. Vraag aantal, strekkende meter, m², m³ of foto waar zinvol. Laat onbekende hoeveelheden onbekend en zet opname/controle in plaats van een verzonnen afvalprijs.

Verplicht voor de eerste complete tuin: tuinvlak, één of meer schuttingdelen, poorten, één of meer bestratingsvlakken en controle op buiten de tuin geplaatste elementen. Maak origin, oriëntatie en “links/rechts” overal consistent. Afmetingen en materiaalkeuzes komen uit dezelfde gespecialiseerde configurators.

Voeg eenvoudige schematische vlakken toe voor gazon/kunstgras, borders en grind en een eenvoudig volume voor plantenbakken als ze betrouwbaar binnen deze architectuur kunnen worden verwerkt. Tuinpad is een benoemd bestratingsvlak. Andere onderdelen krijgen nu een echte wensenlijst en dossierregel, zonder te doen alsof verlichting of pergola al volledig configureerbaar is.

Tuinaanleg/renovatie onderdelen: terras, tuinpad, schutting, kunstgras, gazon, borders, beplanting, grind, plantenbakken, verlichting, drainage, verwijderen bestaande tuin, grondwerk en overige wensen. Vraag globale maten, te behouden elementen, stijl strak/modern, groen/natuurlijk, onderhoudsarm, landelijk of nog niet bepaald. Vraag waar relevant zon/schaduw, gebruik door kinderen/huisdieren, gewenste groenbalans, toegankelijkheid en budgetvoorkeur met “weet ik nog niet”.

Onderhoud/snoeiwerk: tuinoppervlak indien bekend, werkzaamheden, type en hoeveelheid groen, haaglengte/hoogte indien bekend, eenmalig of periodiek, achterstallig onderhoud, afvoer, toegang, gewenste periode en foto’s. Risicovolle boomwerkzaamheden of onbekende boomconditie leveren een opnamevraag, geen vaste online prijs of automatische kaptoezegging.

Kunstgras/gazon: oppervlak, huidig terrein, verwijderen, bodemvoorbereiding, drainage, materiaal zelf leveren, huisdieren/gebruiksvoorkeur en onderhoud. Periodiek onderhoud: frequentievoorkeur, werkzaamheden, seizoenen, particulier/zakelijk en terrein. Een voorkeur voor vier of zes bezoeken is nog geen afgesloten onderhoudsovereenkomst.

## 16 3D techniek en bediening

Gebruik een vastgezette onderhouden Three.js versie, met overeenkomende OrbitControls uit dezelfde versie. Installeer via de bestaande build of vendor noodzakelijke modules lokaal met licentievermelding. Vermijd ongepinde CDN imports en afhankelijkheid van externe producttextures. Raadpleeg actuele officiële documentatie [S20 tot S22].

Recente WebGLRenderer gebruikt WebGL2; detecteer ondersteuning, rendererfouten en context loss [S20]. Op ondersteunde apparaten werkt echte roterende 3D. Zonder WebGL2 blijft de configurator volledig bruikbaar met een exacte 2D/SVG preview en alle dossierkeuzes. Die fallback mag de verplichte 3D op ondersteunde apparaten niet vervangen.

Gebruik modules voor scene lifecycle, camera, materiaalpresets, fence builder, paving builder, maatlabels en screenshot. Geometry/materialen worden hergebruikt. Gebruik InstancedMesh voor repeterende tegels/planken wanneer passend [S22]. Geef alle afhankelijke graphics en eventhandlers een expliciete opruimroute; verwijder niet een materiaal dat nog door een andere mesh wordt gedeeld.

Render op wijzigingen en camera interactie. Gebruik tijdelijke requestAnimationFrame tijdens controls/damping of animatie en stop zodra de scene stil is. Pauzeer bij verborgen tab of niet zichtbare viewer. Beperk device pixel ratio, begin bijvoorbeeld met maximaal 1,5 op mobiel en 2 op desktop en pas aan op gemeten prestaties.

Laat draaien, zoomen en camera reset werken. Bied 3D, bovenaanzicht en vooraanzicht met tekstknoppen. Configureer min/max afstand en grondgrenzen. Houd camera zo veel mogelijk vast bij materiaalwijziging. Bij forse maatwijziging kan “Alles in beeld” bewust kaderen; automatisch herframen mag een 5 meter en 15 meter schutting niet onbegrijpelijk even groot laten lijken. Toon een vaste maatgrid en maatlabels.

Mobiel: gewone pagina scrollt buiten de actieve viewer. Bied zo nodig een expliciete “3D bedienen” stand met “Terug naar formulier”. Scope touch action tot het actieve canvas. Geen sitebrede blokkade van pinch zoom of scrolling. Toetsenbordknoppen voor view reset, draaien en zoomen maken het ontwerp ook zonder muis begrijpelijk.

Maatlabels tonen zijden, hoogte waar bruikbaar, terraslengte/breedte en m². HTML overlays hebben heldere posities en botsen niet met knoppen. Eén korte aria-live samenvatting na een invoerwijziging, geen continue aankondiging van iedere cameraframe.

Maak “Bewaar ontwerp als afbeelding” via een render op het exportmoment en canvas.toBlob. Houd preserveDrawingBuffer niet standaard aan alleen voor export. Een canvasfoto bevat HTML maatlabels niet vanzelf: voeg die via een aparte 2D compositingstap toe of vermeld maten in een bijgevoegde samenvatting. Test export op ondersteunde browsers. Cross origin textures kunnen export blokkeren; gebruik eigen/licentieerbare assets en correcte CORS [S23].

Screenshot krijgt neutrale achtergrond, beschrijvende bestandsnaam en visualisatielabel. Bewaar een Blob/File referentie; zet geen zware base64foto in algemene state, URL of localStorage. Revoke tijdelijke object URLs na gebruik. Publiceer geen screenshot automatisch.

Iedere officiële export uit de configurator (PNG, print/PDF-samenvatting en social-share image) krijgt een subtiele vaste Sealcleaning-brandinglaag: logo/woordmerk, sealcleaning.nl, “Ontworpen met Sealcleaning” en optioneel project-ID/QR naar een niet-persoonlijke deelroute. Branding staat in een nette onderrand/hoek en bedekt het ontwerp niet. Een browser- of telefoonscreenshot buiten onze export is niet te voorkomen; misbruik wordt niet bestreden door normale bezoekers te hinderen. Laat high-resolution bulkexport of white-label/embedfunctionaliteit niet openbaar beschikbaar zijn.

## 17 Ontwerp bewaren en vergelijken

Laat maximaal drie ontwerpvarianten lokaal vergelijken, bijvoorbeeld hout beton versus composiet of beton versus keramiek. Variant bevat ontwerpkeuzes en toepasselijke prijscomponenten; kopieer geen persoonsgegevens mee.

“Dupliceer ontwerp” maakt een nieuw ontwerp ID. “Wijzig variant” beïnvloedt alleen die variant. Vergelijk in een tabel maten, materiaal, onderhoudskenmerken indien onderbouwd, opties en prijsstatus. Toon geen verschilbedrag wanneer één variant onbekende kosten bevat.

Export: niet persoonlijk ontwerp JSON, PNG en printbare samenvatting. Import: schema/versionvalidatie, lengte en bestandlimieten, veilige tekstverwerking, geldige IDs, geen uitvoerbare strings en geen arbitraire externe texture URL’s. Oude ontwerpen behouden hun inhoud via een migratie of krijgen een duidelijke melding.

Een openbare deellink mag uitsluitend niet persoonlijke configuratie bevatten, met lengtebeperking en expliciete deelactie. Een eigen download/upload route is voldoende wanneer een betrouwbare linkservice ontbreekt. Geen cloudopslag of login fingeren.

## 18 Projectobject en versiebeheer

Gebruik een gedocumenteerd schema. Onderstaande structuur is richtinggevend; definieer alle eenheden en referenties expliciet in code.

```json
{
  "schemaVersion": 1,
  "projectId": "generated-uuid",
  "projectType": "combined",
  "services": ["fence", "paving"],
  "sourceCaseId": null,
  "garden": {"widthMm": 10000, "depthMm": 6000},
  "fence": {
    "shape": "L-left",
    "systemId": "generic-wood-concrete",
    "heightMm": 1800,
    "materialPresetId": "natural-wood-grey-concrete",
    "sections": [
      {"id": "A", "start": {"xMm": 0, "zMm": 0}, "directionDeg": 0, "lengthMm": 8400},
      {"id": "B", "start": {"xMm": 8400, "zMm": 0}, "directionDeg": 90, "lengthMm": 4200}
    ],
    "gates": [
      {"id": "G1", "sectionId": "A", "offsetMm": 2000, "clearWidthMm": 1000, "heightMm": 1800, "hingeSide": "left", "swing": "inward"}
    ]
  },
  "paving": {
    "areas": [{"id": "P1", "lengthMm": 6000, "widthMm": 4000, "position": {"xMm": 0, "zMm": 0}, "rotationDeg": 0}],
    "productId": null,
    "nominalTileLengthMm": 600,
    "nominalTileWidthMm": 600,
    "pattern": "straight",
    "colorPresetId": "light-grey"
  },
  "options": {"materialSupply": "advice-needed"},
  "removal": {"existingFence": true, "removeFence": true, "disposal": "unknown"},
  "access": {"surface": "unknown", "rearPassageWidthMm": null},
  "location": {"postalCode": null, "city": null},
  "schedule": {"preferredPeriod": null, "flexible": true},
  "photos": [],
  "notes": "",
  "customer": {"name": null, "email": null, "phone": null, "preferredChannel": null}
}
```

Dit voorbeeld gebruikt een tuin van 10 bij 6 meter, met richting 0 langs de x as en richting 90 langs de z as. Valideer altijd posities, grenzen en onderlinge aansluitingen in de echte app; voorbeeldwaarden worden nooit blind als klantontwerp overgenomen.

Voeg waar nodig propertyDetails, maintenance, planting, attachments en consentStatus toe. Leg views/camera buiten dit domeinobject. Derived summary en estimate hebben eigen versienummer en verwijzen naar project en pricebook version. Leg vast welke prijsdata bij een verzonden aanvraag gold.

Foto’s[] bevatten alleen metadata en runtime bestandsreferentie of later een veilige server ID. Project JSON moet stringify/parse roundtrip ondersteunen zonder Three.js objecten, DOM nodes, File of Blob intern op te nemen. Voorlopige IDs zijn voorbeeldwaarden; genereer werkelijke IDs.

## 19 Onderzochte prijsinformatie

Onderstaande waarden zijn openbaar aangetroffen referenties, geen bindende Sealcleaning tarieven. “Onderzocht op 7 oktober 2026” betekent niet dat iedere bron zijn prijslijst op die datum heeft vernieuwd. Productprijzen kunnen per hoeveelheid, vestiging, levering en moment verschillen.

| Onderdeel | Aangetroffen prijsbasis | Scope en beperking | Bron |
| --- | --- | --- | --- |
| EXCLUTON Terrastegel Plus schelpkalk 60 × 60 × 4 cm | €8,85 per stuk; bron noemt €24,58/m² | Materiaal, btw inbegrepen, verzending extra; vanaf 28 stuks €8,40/stuk | S15 |
| EXCLUTON Keramische tuintegel Madrid 60 × 60 × 2 cm | €12,50 per stuk; €34,72/m² in bron | Materiaal, btw inbegrepen, verzending extra; vanaf 60 stuks €11,85/stuk | S15 |
| FLAIRSTONE Garden moon 60 × 60 × 2 cm | €13,95 per stuk; €38,75/m² | Materiaal, btw inbegrepen, verzending extra; vanaf 64 stuks €13,25/stuk | S15 |
| EXCLUTON Opsluitband antraciet 100 × 15 × 5 cm | €2,80 per stuk en per meter | Materiaal, btw inbegrepen, verzending extra; hoeveelheidkorting apart | S16 |
| EXCLUTON Opsluitband grijs 100 × 15 × 5 cm | €2,30 per stuk en per meter | Materiaal, btw inbegrepen, verzending extra | S16 |
| Elephant Finch grenen scherm 180 × 180 × 4,7 cm | €79 per stuk | SKU 007237; alleen scherm, palen/beton/beslag/montage/levering apart; btw basis opnieuw bevestigen | S13 |
| Graszoden Premium siergras | €3,39/m² | Btw inbegrepen, levering extra; bestellen in rollen van 1 m², minimaal 30 m² | S17 |
| GARDEN PLACE Nancy 30, 200 cm breed | €11,95/m²; €23,90 per strekkende meter | Materiaal, btw inbegrepen, levering extra; rolbreedte beïnvloedt snijverlies | S18 |
| GARDEN PLACE Dela 35, 200 cm breed | €19,95/m²; €39,90 per strekkende meter | Materiaal, btw inbegrepen, levering extra; geen compleet gelegd gazon | S18 |
| Lichte trilplaat huren | Vanaf €33/dag excl. btw; rekenkundig €39,93 incl. 21% | Algemene Boels vanafprijs; concrete machine, verzekering en extra kosten controleren | S19 |
| 6 m³ bouw en sloopafval container | Vanaf €405 incl. btw | Openbare vanafprijs; locatie, afvalvoorwaarden, plaatsing en vergunning controleren | S28 |
| 6 m³ schoon puin container | Vanaf €202 incl. btw | Geen gemengd tuin of grondafval; acceptatievoorwaarden controleren | S28 |
| 6 m³ tuin en plantsoenafval container | Vanaf €238 incl. btw | Alleen toegestane afvalstroom | S28 |
| 6 m³ schone grond container | Vanaf €475 incl. btw | Grondkwaliteit, gewicht en regio controleren; andere pagina/snippet gaf afwijkende vanafprijs | S28 |
| HomingXL schermmontage | Vanaf €46 per scherm | Btw inbegrepen, materiaal/reiskosten extra; gepubliceerde peildatum oktober 2025 | S12 |
| HomingXL paal plaatsen | Vanaf €49 per paal | Zelfde oude prijsbasis; geen complete schuttingprijs | S12 |
| HomingXL poort plaatsen | Vanaf €219 per poort | Btw inbegrepen, materiaal/reiskosten extra; minimumklus €99, reis vanaf €45/dag | S12 |
| Riet Poel regulier medewerkeruurtarief | €55–€65 incl. btw | Per medewerker; hun scope en afvoerregels; pagina vermeldt september 2026 | S14 |
| Riet Poel onderhoudsbeurt | Eenmalig €150–€400; periodiek €120–€280 | Hun richtprijzen incl. btw; regulier groenafval volgens eigen voorwaarden inbegrepen | S14 |
| Riet Poel boomsnoei | Klein onder 4 m €150–€300; 4–8 m €300–€600 | Referentie van die uitvoerder, geen tarief op alleen boomhoogte voor Sealcleaning | S14 |
| Hovenier Hoofddorp compleet terras | Vanaf €80/m² | Bron noemt grondwerk, ondergrond en bestrating; minimum en exacte toepassing niet vastgesteld | S29 |
| Hovenier Hoofddorp complete tuin | Indicatie €100–€200/m² | Contextuele bronindicatie, geen lokale gemiddelde marktprijs en geen optelpost naast alle onderdelen | S29 |
| Limberger hout beton grenen | Vanaf €145 per meter incl. montage | Genoemde standaardhoogte 2 m; btw, reis, poort, afvoer en volledige scope niet bevestigd | S30 |
| Limberger hout beton Douglas | Vanaf €160 per meter incl. montage | Zelfde beperkingen; niet gebruiken als volledig vergelijkbare Sealcleaning offerte | S30 |
| Schutting Direct Red Class | €120 per meter incl. montage op productpagina | Btw en extra werkzaamheden niet voldoende bevestigd; uitsluitend benchmark | S31 |

Gebruik bij tegels de stukprijs als basis voor bestellen. De bronwaarde per m² is afgerond en mag niet alsnog afrondingsverschillen veroorzaken. De korte naam Garden moon in de tabel verwijst naar het volledige officiële product op S15; neem een volledige officiële naam alleen over na actuele controle.

Voor beplanting, zand per levering, voegen, composiet systemen, vlonders, pergola’s, tuinverlichting, reiniging en complexe boomzorg is in dit dossier geen universele, voldoende afgebakende verkoopprijs vastgesteld. Onderzoek bij implementatie echte actuele product of uitvoerdersbronnen voor de daadwerkelijk aangeboden onderdelen. Als prijs of scope ontbreekt, zet die regel op onbekend; sla onderzoek en uitkomst op. Gebruik geen willekeurig bedrag om de engine compleet te laten lijken.

## 20 Prijsboek en rekenregels

Prijsinformatie is nu onderdeel van de website. Bouw drie onderscheiden niveaus: openbare materiaalreferentie, indicatieve marktcontext en een eigen projectraming wanneer Sealcleaning regels voldoende compleet zijn. Een bindende projectofferte volgt uit gecontroleerde inmeting en calculatie.

Elke prijsregel bevat id, product/service ID, sourceType, sourceUrl, observedAt, sourceEffectiveDate, currency, unit, amountCents of rangeCents, vatRate of null, vatIncluded, quantityTiers, minimumQuantity, scopeIncluded[], scopeExcluded[], region, assumptions[], status en reviewAfter. Bedrijfsregels krijgen daarnaast arbeidsbasis, materiaalopslag, kosten, margedoel en expliciete herkomst. Zet zakelijke kostprijzen en marges nooit in een publiek client bestand.

Importeer de onderzochte waarden als gedateerde referentiedata. Beschouw de oude HomingXL montagecijfers en waarden met onbekende btw/scope niet als actuele automatische verkoopregel. Een redelijke interne hercontroletermijn, bijvoorbeeld 30 dagen voor producten en 90 dagen voor marktbenchmarks, is een bedrijfsinstelling, geen wettelijke regel.

Reken intern in eurocenten en millimeters. Gebruik decimale/vaste precisie voor aantallen en oppervlak en één vastgelegde afrondingsmethode voor btw. Toon consumentenprijzen inclusief btw waar vastgesteld. De Belastingdienst noemt 21% voor aanleg en onderhoud, maar 9% voor meegeleverde sierteeltproducten; maak btw per regel mogelijk en controleer classificatie [S26]. Geen 21% over iedere mogelijke levering blind toepassen.

Materiaalhoeveelheden houden rekening met hele verpakkingen, passtukken, rolbreedte, minimumafname, voegbreedte en expliciet snijverlies. Een generiek percentage snijverlies is een schattingsinstelling met label, geen garantie. Een visueel gesneden tegel kan niet automatisch opnieuw worden benut in een ander vlak zonder geteste zaagplanning.

Arbeid: onderscheid uren per medewerker, ploeguren en dagen. Twee mensen acht uur is zestien medewerkeruren. Bereken alleen wanneer productiviteit of urenonderbouwing bekend is. Neem niet zomaar een concurrentuurtarief als eigen winstgevend tarief over. Het eigen tarief moet inkoop/inhuur, reistijd, voorbereiding, gereedschap, verzekering, herstelrisico en overhead dekken.

Een complete raming bevat materiaal, arbeid, voorbereiding/grondwerk, verwijdering, afvalstroom, huur, vervoer/levering, eventuele aansluitingen, belastingen en duidelijk benoemde onzekerheden. Verwijder dubbelgetelde posten: inclusief montage plus losse montage, all in terras plus nogmaals tegels en zand, compleet tuinbudget plus alle onderdelen, of groenafvoer die al in een beurt zit.

Prijsstatus is één van complete-indication, partial-indication, on-request of stale. Bij onbekende onderdelen toon “Bekende materiaalindicatie” met bedrag, en daarnaast wat nog moet worden beoordeeld. Toon nooit een gedeeltelijke subtotaal als projecttotaal of ontbrekende waarden als €0. Een benchmark met “vanaf” is geen maximum en vormt op zichzelf geen betrouwbare totaalbandbreedte.

Voorbeeldberekening zonder hoeveelheidkorting: terras 6 × 4 m = 24 m². Met expliciete voorlopige 5% snijreserve en nominale 0,36 m² per tegel: ceil(24 × 1,05 / 0,36) = 70 tegels. Bij €13,95/stuk is de bekende tegelcomponent €976,50 incl. btw. Montage, ondergrond, voegwerk, afvoer en levering ontbreken; dus geen totaalprojectprijs. Dit is een rekenvoorbeeld, geen exact legplan. Een actuele gecontroleerde hoeveelheidkorting kan de materiaalcomponent wijzigen.

Maak /prijzen/ met bronnen/peildatum, duidelijke kostendrivers, voorbeeldcomponenten en link naar configurator. Geef marktbenchmarks een bronlabel; presenteer ze niet als “onze tarieven”. Laat geen schijnprecies totaal van €x,xx zien waar de ondergrond onbekend is. Onderbouwde volledige indicaties mogen met een transparante bandbreedte en aannames verschijnen.

Als actuele eigen tariefdata ontbreekt, hoeft de klant zijn ontwerp of aanvraag niet uit te stellen. De flow toont “Prijs wordt na controle van uw samenstelling berekend”, met bekende prijscomponenten waar passend. Dit vervangt de eerdere blanket instructie om helemaal geen prijsinformatie toe te voegen.

## 21 Productcatalogus en materiaalkeuze

Per product: id, manufacturer, collection, officialName, sku/productCode, category, material, color, finish, nominalDimensionsMm, actualDimensionsMm, thicknessMm, modulePitchMm, mountingRules, compatibleSystems, supportedUseCases, packaging, image, texture, sourceUrl, verifiedAt, licenseStatus, active en priceRefId.

Maak generieke visualisatiepresets in een ander gegevensbestand dan officiële producten. Een preset krijgt geen fictieve fabrikant of SKU. Officiële productspecificaties kunnen de preview voeden, maar een schematische visualisatie is geen kleurvaste materiaalsample. Vermeld dat echte kleur en uitstraling kunnen afwijken.

Leg compatibiliteit vast voor palen/schermen/onderplaten/beslag en poorten, ondersteunde hoogtes, opritgeschiktheid en patronen. Productproperties die onbekend zijn blijven null. Voeg geen onbewezen levensduur, onderhoudsvrijheid, FSC status of garantie toe aan een algemene categorie op basis van één product.

Gebruik leverancierfoto’s/textures alleen met passende rechten. Begin anders met eigen materiaalbeelden en procedurele presets. Lokale catalogusimport en validatie zijn voldoende; voeg geen onbetrouwbare browser scraping of API sleutels toe. Documenteer product en prijs bijwerken zodat later geen redesign nodig is.

## 22 Leesbaar dossier voor klant en Sealcleaning

Eindoverzicht “Uw project” toont dienst(en), ontwerp, maten, materiaalvoorkeur, uitvoeringsopties, verwijderen/afvoer, bereikbaarheid, postcode/plaats, planning, opmerkingen, foto aantal en prijsstatus. Geef per groep een “Wijzigen” knop naar de juiste stap.

De klant kan printen naar PDF met browserfunctionaliteit. Gebruik print CSS: leesbare tekst, maten, bron/peildatum van indicatie en visualisatie, zonder navigatie of lege canvas. Maak een vóór print beschikbare snapshot, met tekstfallback als capture niet lukt. Geen grote PDF library alleen voor hetzelfde resultaat.

Sealcleaning ontvangt dezelfde inhoud gestructureerd plus een menselijke samenvatting. Voeg project ID, schema versie, datum, gekozen prijsboek versie en interne beoordelingspunten toe. De samenvatting moet onbekende waarden benoemen in plaats van ze te verbergen.

Maak voorbereiding voor een intakechecklist: inmeten, bodem/hoogte, materiaalkeuze, toegang, afvalstroom, levering, buren/erfgrens waar relevant, planning en offerteonderdelen. Dit is een controlelijst in het dossier, geen automatisch goedgekeurd uitvoeringsplan.

Na echte ontvangst: duidelijk wat is verstuurd, aanvraagreferentie indien server die teruggeeft en de volgende stap zonder verzonnen reactietermijn. Een lokaal project ID is niet hetzelfde als een bevestigde serverontvangst.

## 23 Werkelijke formulierarchitectuur

Centraliseer formEndpoint, formEnabled, allowedEndpointOrigins, adapter, supportsFiles, maxFiles, maxFileBytes, maxTotalBytes en responseMapping. Geen geheimen in statische JS. Ondersteun een eigen API/serverless of een later gekozen formprovider. Kies niet stilzwijgend een betaald abonnement.

Zonder geconfigureerd endpoint: toon bewust gekozen WhatsApp, e-mail, tekst kopiëren en dossier downloaden. Zeg helder dat WhatsApp of de mailapp wordt geopend en dat de klant daar zelf moet verzenden. Toon nooit “aanvraag ontvangen” op basis van mailto of een wa.me klik.

WhatsApp/mailto hebben geen betrouwbare mogelijkheid om lokale File attachments automatisch te versturen. Voeg foto’s niet als nepbijlage toe en stuur geen enorme base64 URL. Geef instructie om foto’s in de geopende app zelf toe te voegen. Verstuur alleen bewust geselecteerde informatie na de knopactie; geen persoonsgegevens in interne site querystrings.

Met endpoint: valideer lokaal en serverzijde, zet loading/disabled state, voorkom herhaalde clicks, gebruik fetch met timeout/AbortController en toegankelijke statusregion. Controleer werkelijk succes volgens adaptercontract, niet alleen iedere response als succes. Toon op fout invoer en bestanden nog aanwezig. Bij timeout kan de server al ontvangen hebben; bied een gecontroleerde retry met dezelfde submission ID als backend idempotency ondersteunt.

Gebruik een payload snapshot van de geldige state op het verzendmoment. Een netwerkverzoek leest niet halverwege veranderende state. Een submission ID identificeert één poging inclusief veilige retry. Een nieuwe gewijzigde aanvraag krijgt een nieuwe submission ID. Backends moeten rate limiting, validatie en idempotency daadwerkelijk implementeren; een honeypot alleen is onvoldoende.

Honeypot buiten de gewone tabroute en begrijpelijk voor assistieve technologie. Geen automatische CAPTCHA dependency zonder behoefte. Endpoint whitelist en CORS controleren. Stel Content-Type bij FormData niet zelf in; de browser maakt de boundary. JSON zonder bestanden en multipart met bestanden worden per adapter ondersteund.

Uploads: meerdere foto’s, schets optioneel, preview, verwijderen en duidelijke aantallen/grootte. Ondersteun mobiele fotokeuze en een aparte camera actie; dwing niet één capture route af die galerijselectie blokkeert. HEIC/HEIF kan niet op ieder apparaat worden voorvertoond of omgezet: toon een duidelijke melding, laat verwijderen of veilige originele overdracht toe als de provider dit ondersteunt.

Clientlimieten moeten bij de provider passen. Zonder provider is een productinstelling zoals maximaal 8 foto’s van 10 MB met 30 MB totaal slechts een lokale bovengrens. Compressie is optioneel en moet resolutie, oriëntatie en foutafhandeling correct houden. Server valideert inhoud, type, grootte, bewaartermijn en toegang. Bestandsnamen en teksten worden veilig weergegeven; geen innerHTML van gebruikersinput.

Maak endpoint integratiedocumentatie met payload voorbeeld, response voorbeelden en configuratieplek. Houd live verzending uit automatische tests tenzij een gecontroleerd testendpoint is toegestaan. Mocktests bewijzen de UI, niet werkelijke e-mailbezorging. Test een echte ingestelde provider apart van ontvangst tot bereikbare melding.

## 24 Privacy en vertrouwen

Vraag alleen noodzakelijke contactgegevens. Maak naam plus één bereikbaar kanaal verplicht; adres/huisnummer alleen als de intake dat daadwerkelijk nodig heeft. Planning en budget zijn voorkeuren. Geen persoonlijke gegevens, foto’s of exacte adressen in analytics, URL, console of fouttelemetrie.

Toon bij verzending een korte uitleg over gebruik voor projectbeoordeling en een link naar een actuele privacyverklaring. Verplicht geen marketingcheckbox. Een privacyverklaring lezen is geen universele toestemming voor alle verwerking. Bepaal gegevensverwerking, bewaartermijnen en providerafspraken op basis van het werkelijke proces; verzin geen juridische zekerheid.

Functionele ontwerpstate en tracking zijn verschillend. Laad Google/Meta tracking niet vóór geldige toestemming wanneer die vereist is. Maak weigeren en later aanpassen duidelijk; de site en configurator blijven werken. Een banner die alleen “door verder te gaan gaat u akkoord” zegt, is geen geschikte toestemming voor tracking [S24]. Plaats geen lege cookiebanner als er geen toestemmingsplichtige technologie actief is.

Publiceer uitsluitend bevestigde bedrijfsfeiten. Gratis bezichtiging, garantie, materiaaltransparantie, betaling na oplevering en responstijd worden alleen als concrete voorwaarden getoond als ze werkelijk gelden. Bied geen btwvrije “contantprijs” als verkoopoptie; betaalmethode verandert niet automatisch de fiscale behandeling.

Materiaal zelf inkopen, alleen advies, levering via Sealcleaning, alleen montage en materiaal + montage zijn afzonderlijke commerciële routes met uitleg over verantwoordelijkheid, prijs, levering en garantie. Dit voorkomt verwarring over inbegrepen materialen en service. Sealcleaning mag materiaal met een redelijke, marktconforme marge doorverkopen zodra de interne inkoop-, logistiek-, btw- en prijsregels uit hoofdstuk 38 betrouwbaar zijn ingericht. Nazorg en onderhoud mogen als aanvraagoptie worden aangeboden zonder fictief contract of garantie.

## 25 SEO en lokale vindbaarheid

Gebruik het beoogde hoofddomein https://sealcleaning.nl/ voor production canonical, Open Graph, structured data en sitemap. Maak basePath/publicAssetBase apart voor previewassets. Canonical op productie mag niet verwijzen naar een developmentserver of GitHub Pages repo URL.

Unieke title, beschrijving, H1 en heldere headinghierarchie per nuttige pagina. Natuurlijke zoekintentie: schutting plaatsen Dordrecht, bestrating Dordrecht, tuinaanleg Dordrecht en tuinonderhoud Dordrecht. Geen keyword stuffing en geen tientallen dunne gekopieerde wijk/plaatsroutes.

Werkgebiedpagina noemt alleen werkelijke plaatsen en koppelt bevestigde lokale cases waar beschikbaar. Maak locatiepagina’s alleen met eigen unieke informatie en relevante ervaring. Geen privéadres van klanten, verzonnen lokale vestigingen of wijkclaims uit een generieke foto.

Behoud/verifieer LocalBusiness of passende concrete subtype, Organization en stabiele @id verwijzingen. Gegevens moeten overeenkomen met zichtbare bedrijfsinformatie. Gebruik geldige afbeelding/logo/contact en werkelijk bevestigd adres waar passend. Zonder vereist publiek adres: claim geen lokale rich result geschiktheid; test schema en houd persoonlijke adresgegevens beschermd [S21a].

Voeg BreadcrumbList toe aan dienst/case/kennisbankroutes met werkelijk bestaande links [S21b]. Gebruik een passende WebPage/CreativeWork presentatie voor cases; forceer geen nep Product/Offer of reviewrating. FAQ inhoud kan nuttig zijn, maar beloof geen FAQ rich results.

Sitemap bevat alleen indexeerbare canonieke routes. robots.txt is geen beveiliging en een crawlblokkade is niet hetzelfde als noindex. Beoordeel noindex voor bedank en persoonlijke conceptpagina’s; ontwerpqueryvarianten mogen geen duizenden indexeerbare duplicaten vormen. Gebruik HTML noindex waar passend, met respect voor hoe zoekmachines die moeten kunnen ophalen.

Kennisbank: lever drie werkelijk bruikbare artikelen op, bijvoorbeeld schutting opmeten, bestratingoppervlak berekenen en hout beton versus composiet vergelijken. Gebruik eigen tekeningen, relevante cases, duidelijke bron/actualisatiedatum en alleen gecontroleerde technische claims. Kostenartikel kan verwijzen naar /prijzen/. Geen massaproductie van dunne artikelen.

Controleer favicon, OG fallback, image alt, interne links, 404 en echte case detailinhoud. Geen automatisch gewijzigd lastmod bij iedere build als inhoud niet veranderde. Maak een checklist voor Google Search Console, sitemap indienen en Business Profile website URL; externe accounts worden niet stilzwijgend gewijzigd.

## 26 Analytics en advertentievoorbereiding

Maak een veilige track(name, properties) facade. Standaard staat externe analytics uit. Publiceer desgewenst lokale CustomEvents; push alleen naar dataLayer wanneer expliciet ingesteld en toegestaan. Foutloze afwezigheid van GTM of analytics is vereist.

Events: click_call, click_whatsapp, configurator_start, configurator_service_selected, configurator_step_completed, configurator_complete, quote_form_start, quote_form_submit en project_view. Voeg indien nuttig configurator_error, estimate_view, design_export en lead_delivery_error toe zonder persoonsgegevens.

Definieer configurator_complete als een afgeronde, gevalideerde samenstelling. quote_form_submit betekent bevestigde ontvangst door het endpoint. Een fallbackklik of verzendpoging krijgt een aparte status/event en telt niet als ontvangen lead. Dedupeer echte succesvolle conversies.

Gebruik alleen niet persoonlijke parameters: dienst ID, stap, case ID, aantal onderdelen en prijsstatus. Telefoonnummers, namen, foto’s, opmerkingen en postcode horen niet in de eventpayload. Ga voorzichtig om met URL/UTM opslag; whitelist marketingparameters, filter lengte en lees ze niet als HTML.

Dienstpagina’s werken als zelfstandige landingspagina’s voor Google en Meta. Behoud duidelijke navigatie en snelle korte aanvraag. Maak geen tientallen identieke advertentiepagina’s of betaalde campagnes binnen deze bouwopdracht. Laat commerciële evaluatie later sturen op echte passende leads en marge.

## 27 Performance en toegankelijkheid

Doel voor echte gebruikersmetingen: LCP maximaal 2,5 seconden, INP maximaal 200 milliseconden en CLS maximaal 0,1, beoordeeld volgens de actuele Core Web Vitals context op het 75e percentiel [S22a]. Een Lighthouse score op een laptop is geen bewijs dat deze velddoelen al zijn gehaald.

Laad de 3D engine alleen voor de configurator en pas na benodigde selectie/viewportinteractie waar passend. Geen 3D bundle op alle dienstpagina’s. Gebruik fontsubsets/woff2, font display en gerichte preload. Geen zware slider, externe reviewwidget of videobackground zonder functionele noodzaak.

Stel meetbare startbudgetten vast en controleer de uiteindelijke output: gewone pagina JS bij voorkeur onder 80 KiB gzip, additionele 3D code bij voorkeur onder 350 KiB gzip, heroafbeelding passend bij viewport en geen texturepakketten van tientallen MB. Dit zijn engineeringbudgetten voor dit project, geen universele feiten. Rapporteer noodzakelijke afwijkingen met meting en reden.

Voor de 3D viewer: geen permanente renderloop in rust, bounded pixel ratio, geen geometriegeheugenlekken bij herhaald wijzigen, resize zonder vervorming en een zichtbaar laad/foutscherm zonder layout shift. Respons op een keuze bij voorkeur binnen 200 ms op het gekozen testapparaat na laden. Begrens instanceaantal en gebruik grotere rasters schematisch wanneer nodig met duidelijke status; verander nooit stilzwijgend de werkelijke maat of berekende oppervlakte.

Volg WCAG 2.2 AA als doel en controleer werkelijk relevante criteria [S22b]. Semantische HTML, fieldset/legend, labels, tekstuele fouten, headinghiërarchie, focus-visible, skip link, aria-expanded/pressed, contrast en toetsenbordroute. Grote bedieningsvlakken bij voorkeur 44 × 44 CSS px als ontwerpnorm; kleur is niet de enige selectie-indicatie.

3D canvas heeft naam, instructies en equivalente maat/keuze informatie in HTML. Canvas zelf is geen toegankelijke beschrijving van een ontwerp. Drag acties krijgen getalsvelden of knoppen als alternatief. Dialogs, gallery en vergelijking ondersteunen Escape en focusherstel. Gebruik reduced motion zonder noodzakelijke informatie te verwijderen.

Een sticky CTA/contactbar bedekt geen veld, fout, cookiekeuze of browser safe area. Test landscape, on screen toetsenbord en zoom. Responsive tabellen krijgen een eigen begrijpelijke scrollcontainer; de hele pagina mag niet horizontaal schuiven.

## 28 Testmatrix en acceptatie

Voer betekenisvolle unitchecks uit voor rekenlogica, validatie, state en export, plus browser tests voor gebruikersflows. Gebruik bestaande testtools of een kleine passende setup. Tests die alleen dezelfde implementatie herhalen zijn onvoldoende. Netwerkcalls in tests gaan naar mocks of toegestaan testendpoint.

| Test | Invoer of actie | Vereist resultaat |
| --- | --- | --- |
| Schuttingmaten | I van 5 m naar 15 m | Geometrie en labels veranderen; vaste grid verklaart schaal |
| Decimale invoer | 8,40 en 8.40 | Beide leveren 8400 mm; geen factor honderd fout |
| L vorm | A 8,40 m en B 4,20 m | Totale lijnlengte 12,60 m en één gedeelde hoek |
| Poortlengte | Openingen totaal 1 m bij 12,60 m lijn | Gesloten segmentlengte 11,60 m; poort zichtbaar |
| Poort past niet | Poort + systeemruimte overschrijdt zijde | Begrijpelijke fout; geen overlap of negatieve panelen |
| Meerdere poorten | Twee overlappende offsets | Validatie blokkeert overlap zonder stateverlies |
| Vormwijziging | U naar I met poort op verdwenen zijde | Expliciete correctie of behoud als losse zijde, geen stille orphan |
| Hoogte | 180 naar 120 cm | Geometrie en overzicht volgen definitie van totale hoogte |
| Materialen | Hout naar composiet/gaas | Werkelijke zichtbare wijziging met correct label |
| Terrasoppervlak | 6 × 4 m | 24 m² in UI, JSON, print en aanvraag |
| Verhoudingen | 3 × 3 versus 8 × 4 | Verschillende echte verhoudingen |
| Tegelformaat | 60 × 60 naar 30 × 30 | Ander raster, geen alleen tekstwijziging |
| Legverband | Recht naar halfsteens | Zichtbare verspringing en afgesneden randstukken |
| Meerdere vlakken | 24 en 6 m² zonder overlap | 30 m²; elk vlak apart te wijzigen |
| Overlap | Terrasvlakken deels boven elkaar | Geen dubbelgeteld totaal; heldere fout volgens gekozen regel |
| Tuinscene | Tuin 10 × 6, terras 5 × 3,5 en schutting | Gemeenschappelijke schaal; positie en grenscontrole werken |
| Terug en wijzigen | Stap 5 terug naar stap 2 | Keuzes/foto’s tijdens deze sessie behouden |
| Reset | Bewust nieuwe aanvraag starten | Ontwerp en tijdelijke gegevens werkelijk verwijderd |
| Ontwerpimport | Export/import plus ongeldige JSON | Geldige roundtrip; ongeldige structuur veilig geweigerd |
| Variant | Kopie maken en materiaal wijzigen | Origineel blijft gelijk; eigen ID’s en juiste vergelijking |
| Tegelcomponent | 70 × €13,95 zonder korting | €976,50; label materiaalcomponent, geen projecttotaal |
| Onbekende kosten | Ondergrond en montage onbekend | Onbekend of partial; geen €0 en geen complete prijs |
| Btw en minimum | Gemengde regels en gras 10 m² | Regel btw correct; 30 m² minimum zichtbaar, geen stil besteltotaal |
| Verouderde bron | reviewAfter verlopen | Stale status; automatische complete raming geblokkeerd |
| Submission | Dubbele click, timeout, 4xx, 5xx, success | Correcte status, data behouden, geen valse succesmelding |
| Bestanden | Too large, meerdere, verwijderen, HEIC | Limieten/uitleg correct; geen verdwenen attachment |
| Fallback | Geen endpoint ingesteld | Bewuste WhatsApp/mail/download; geen ontvangstclaim |
| Geen WebGL2 | Simuleer rendererfalen | Formulier + 2D + dossier blijven bruikbaar |
| Viewer lifecycle | 30 maatwisselingen en verwijderen | Geen oplopende ongebruikte meshes/listeners; geen rustloop |
| Export | PNG en browser print | Ontwerp/maten zichtbaar; geen blanco canvas |
| Case gallery | Open schuttingcase | Uitsluitend eigen foto’s; keyboard en Escape werken |
| Projectfilters | Iedere categorie en leeg resultaat | Juiste cases, status en reset; gecombineerde case vindbaar |
| Routes | Direct openen en refresh van iedere detailroute | Geen 404 door ontbrekende statische bestandroute |
| Privacy | Inspecteer requests, URL en console | Geen contactgegevens/foto’s in analytics of interne URL |
| Toestemming | Tracking uit, weigeren, later toestaan | Hele site werkt; tracking volgt echte instelling |

Controleer gewijzigde pagina’s op 360, 390, 430, 768, 1024 en 1440 px. Test minimaal een mobiel formaat volledig, alle kritieke breedtes op overflow, en desktop. Doe browser engine controle in Chromium, Firefox en WebKit waar beschikbaar; leg echte apparaatbeperkingen vast. Emulatie is geen claim van een fysieke iPhone test.

Controleer console errors, netwerkfouten, kapotte afbeeldingen, interne links, relatieve paden, tabvolgorde, focus, formulierlabels, mobiele toetsenbordbediening, reduced motion, 200% zoom en printlayout. Check bestaande wizardprefill en sticky contact op regressies. Meet performance met vastgelegde throttling/apparaatcondities.

## 29 Uitvoering release en oplevering

Werk in samenhangende stappen met een voortdurend bruikbare site. Eerste stap: inventaris en broncontrole. Daarna cases/beeldmanifest, diensten/navigatie, state en modulaire wizard, 3D schutting, 3D bestrating, combinatie tuin, samenvatting/export/varianten, prijsboek, submission/fallback, SEO/analytics/privacy en verificatie. Bouw per stap door tot de volledige opdracht gereed is.

Maak geen fase twee voor verplichte 3D. Geavanceerde AR, fotorealistische reconstructie van één tuinfoto, volledig autonoom AI-tuinontwerp en volledige technische constructiecalculatie blijven buiten de verplichte kern. Materiaalverkoop, winkelmand/order-intentie, B2B-instroom, offerte-/factuurarchitectuur en veilige backendgrenzen zijn vanaf deze versie wél onderdeel van de opdracht. Een daadwerkelijke online betaling, klantaccount of boekhoudkoppeling wordt alleen live geactiveerd wanneer een echte beveiligde provider/backend, juridische informatie en end-to-end test beschikbaar zijn; anders blijft er een eerlijke werkende bestel-/offerteaanvraag zonder nepcheckout.

Launchchecklist: DNS apex/www, GitHub Pages custom domain, HTTPS en redirectrichting, production canonical, OG/schema, sitemap/robots, Search Console, sitemap aanmelden, Business Profile URL, aanvraagtest, endpoint ontvangst, telefoon/WhatsApp, 404, detailroutes, mobiel, consent en rollback. Verifieer wat werkelijk toegankelijk is. CNAME wijzigen alleen wanneer domeinkoppeling en DNS status dat rechtvaardigen; een eerdere HTTPS fout is geen bewijs dat de koppeling nu gereed is.

GitHub Pages kan niet zelf een API ontvangen. Een provider of serverless endpoint blijft externe infrastructuur; documenteer precies wat ontbreekt. Een endpoint toevoegen omvat CORS, bestandslimieten, notificatiebestemming en echte ontvangsttest. Geen API key in README of frontend. Verplaats hosting niet alleen om 3D mogelijk te maken.

Documenteer in README: lokaal draaien/bouwen, deploymentpad, nieuw project toevoegen, foto’s verwerken, catalogus en prijzen vernieuwen, wizard schema, analytics configureren, formulieradapter, privacyinstellingen en tests. Voeg docs/SOURCE_REGISTER.md, docs/ACCEPTANCE_REPORT.md en docs/IMPLEMENTATION_STATUS.md toe. Een source register noteert ook conflicts en niet gevonden prijzen.

Oplevering bevat concrete gewijzigde bestanden, korte uitleg van gedrag, uitgevoerde tests met resultaat en bekende beperkingen. Onderscheid passed, failed en blocked. Geef geen “alles getest” zonder bewijs. Publicatie volgt bestaande autorisatie en repository afspraken; laat een reviewbare wijziging en rollbackmogelijkheid achter.

Externe TODO’s mogen alleen werkelijk ontbrekende gegevens betreffen: endpoint/toegang, geverifieerde bedrijfsvoorwaarden, rechten/toestemming bij foto’s/reviews, definitieve product/inkoopgegevens, arbeidskostregels en gecontroleerde domeinstatus. Laat zulke TODO’s werkende kernfeatures niet blokkeren als een nette fallback mogelijk is.

De eerstvolgende commerciële investering na deze release is een werkelijke aanvraagontvanger met volledige dossieroverdracht en betrouwbare opvolging, als die nog ontbreekt. Zodra ontvangst werkt, stuur verbeteringen op gemeten kwaliteit en offerteacceptatie van aanvragen, niet op steeds meer grafische effecten.

## 30 Bronnenregister

Alle onderstaande pagina’s zijn onderzocht op 7 oktober 2026. URL’s kunnen later inhoud of prijzen wijzigen. Een niet bevestigde prijs krijgt geen automatische verkoopstatus. Concurrentclaims zijn niet onafhankelijk gecertificeerd.

- [S01 Visser Tuinservice](https://vissertuinservice.nl/) — diensten, benoemde cases en reviewroute.
- [S02 De Biesbosch Gijsbers Groep](https://debiesboschgijsbersgroep.nl/tuinaanleg/) — complete aanleg en trustpresentatie.
- [S03 Stam Hoveniers](https://www.stamhoveniers.nl/) — tuinvisie, ontwerp, showroom en impressies.
- [S04 Baan Hofman](https://www.hoveniersbedrijfbaanhofman.nl/) — disciplines, projecten en aanspreekpunt.
- [S05 De Groene M](https://www.degroenem.nl/) — dienstverlening en 3D ontwerp op aanvraag.
- [S06 Drechtsteden Hoveniers](https://www.drechtstedenhoveniers.nl/) — onderdelen en onderhoud.
- [S07 Van der Elst Hoveniers](https://www.vanderelsthoveniers.nl/tuinaanleg/) — aanleg en regionale structuur.
- [S08 Zoon Hovenier](https://zoonhovenier.nl/werkgebied/hovenier-dordrecht/) — Dordrechtpagina en traject.
- [S09 Schutting Direct configurator](https://www.schutting-direct.nl/configurator) — vormen, materialen, poorten en intake.
- [S10 EvoWood configurator](https://www.evo-wood.com/schutting-configurator.html) — interface voor 3D secties, delen en export.
- [S11 ForaVida configurator](https://www.foravida.nl/configurator) — beschrijving van 3D en opties.
- [S12 HomingXL montage](https://homingxl.nl/schutting-laten-plaatsen/) — prijsbasis en gepubliceerde peildatum oktober 2025.
- [S13 HomingXL scherm](https://homingxl.nl/elephant-schutting-grenen-finch-recht-15l-rvs-groen-geimpregneerd-180x180cm-schermdikte-4-7-cm/) — prijs en SKU van het genoemde paneel.
- [S14 Riet Poel prijsinformatie](https://rietpoelhoveniers.nl/prijzen) — eigen richtprijzen en scope, update september 2026.
- [S15 HORNBACH tegelassortiment](https://www.hornbach.nl/c/tuin/sierbestrating/tuintegels/S4991/) — gecontroleerde stuk en m² prijzen. Een afzonderlijke productpagina gaf beperkte inhoud; de categoriepagina leverde de genoemde waarden.
- [S16 HORNBACH kantopsluiting](https://www.hornbach.nl/c/tuin/sierbestrating/opsluitbanden/S4993/) — materiaalprijzen per stuk/meter.
- [S17 HORNBACH graszoden](https://www.hornbach.nl/c/tuin/graszoden-graszaad-kunstgras/graszoden/S5199/) — prijs, rol en minimumafname.
- [S18 HORNBACH kunstgras](https://www.hornbach.nl/c/tuin/graszoden-graszaad-kunstgras/kunstgras/S4904/) — materiaalprijzen en rolbreedtes.
- [S19 Boels verdichting](https://www.boels.com/nl-nl/huren/grondverzet/verdichting/c/rf0bi1if) — algemene huur vanafprijs.
- [S20 Three.js WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html) — WebGL2 en renderer API.
- [S21 Three.js OrbitControls](https://threejs.org/docs/pages/OrbitControls.html) — camera controls.
- [S22 Three.js InstancedMesh](https://threejs.org/docs/pages/InstancedMesh.html) — herhaalde geometrie.
- [S21a Google lokale bedrijfsgegevens](https://developers.google.com/search/docs/appearance/structured-data/local-business) — actuele voorwaarden voor LocalBusiness.
- [S21b Google breadcrumbs](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) — breadcrumb structured data.
- [S22a web.dev Web Vitals](https://web.dev/articles/vitals) — doelen en beoordeling van Core Web Vitals.
- [S22b W3C WCAG quick reference](https://www.w3.org/WAI/WCAG22/quickref/) — toegankelijkheidscriteria.
- [S23 MDN canvas export](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob) — export en origin beperkingen.
- [S24 Autoriteit Persoonsgegevens cookieinformatie](https://autoriteitpersoonsgegevens.nl/themas/internet-slimme-apparaten/cookies/heldere-cookiebanners) — zoekresultaatinformatie over geldige trackingtoestemming; directe pagina was niet ontsloten. Controleer de actuele pagina tijdens uitvoering.
- [S25 Google reviews](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) — beperkingen bij reviews over het eigen bedrijf.
- [S26 Belastingdienst sierteelt en hoveniers](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/tarieven_en_vrijstellingen/goederen_9_btw/sierteeltproducten/) — 21% aanleg/onderhoud en 9% sierteeltlevering.
- [S27 GitHub Pages uitleg](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) — statische hosting.
- [S28 Afval.nl tariefoverzicht](https://www.afval.nl/tarieven/) — gebruikte container vanafprijzen. Gebruik het uitgewerkte actuele overzicht boven conflicterende zoeksnippets.
- [S29 Hovenier Hoofddorp kosteninformatie](https://www.hovenier-hoofddorp.nl/kennisbank/hovenier-kosten/) — eigen/contextuele terras en tuinrichtprijzen, update 7 augustus 2026.
- [S30 Limberger schuttingen](https://www.limbergerbouwservice.nl/schuttingen/) — montagebenchmarks, onvolledige btw/extrascope.
- [S31 Schutting Direct Red Class](https://www.schutting-direct.nl/schuttingen/red-class/) — gepubliceerde meterprijs incl. montage, aanvullende scope te verifiëren.
- [S32 Sealcleaning homepage](https://sealcleaning.nl/) — rechtstreeks bekeken in de browser; bestaande stijl, navigatie, foto's en wizard.
- [S33 Sealcleaning projecten](https://sealcleaning.nl/projecten/) — rechtstreeks getest: schuttingfilter, project openen, volgende foto en sluiten.
- [S34 Sealcleaning contact](https://sealcleaning.nl/contact/) — rechtstreeks bekeken; wizardprefill gecontroleerd, geen aanvraag verzonden.
- [S35 Claude Code kostengebruik](https://code.claude.com/docs/en/costs) — officiële uitleg over gebruik, contextbeheer, compaction en modelkeuze; controleer ondersteuning in de geïnstalleerde versie.

## 31 Onafhankelijke eindcontrole van het dossier en de uitvoering

Voer vóór oplevering een afzonderlijke kritische review uit na de implementatie. Toets dit dossier regel voor regel aan gewijzigde code en rapportage. Als de omgeving een reviewtool of afzonderlijke reviewer heeft, gebruik die binnen beschikbare toestemming; afwezigheid daarvan is geen reden om eigen controle over te slaan.

Zoek specifiek naar strijdige instructies: 3D uitstellen, fictieve officiële namen, dubbele state, dubbele meters, ongeldige poorten, dubbelgetelde vlakken, verouderde prijzen, onbekende btw, gedeeltelijke prijs als totaal, fallback als ontvangen aanvraag en SEO claims zonder bewijs.

Controleer dat elke zichtbare optie invloed heeft op ontwerp of dossier en dat elk dossieronderdeel de verzendpayload bereikt. Controleer dat al het verplichte werk is uitgevoerd of met een concrete echte blokkade is benoemd. Een professionele oplevering is volledig toetsbaar; geen enkele reviewer hoeft op “het zal wel werken” te vertrouwen.

## 32 Aanvulling na controle van de live website

Deze controle is uitgevoerd op 7 oktober 2026 in een desktopbrowser met een viewport van ongeveer 1348 × 926 px. Onderstaande stappen zijn werkelijk doorlopen. Er is geen klantaanvraag verzonden, geen DNS gewijzigd en geen productiecode aangepast. Dit is een gerichte controle van de belangrijkste instaproute, geen volledige technische audit.

| Stap en toestand | Waarneming | Concrete bouwopdracht |
| --- | --- | --- |
| 1 Homepage — goede visuele basis, navigatiefout | Zandkleurige header, donkergroene knoppen, grote serif koppen en een tuin aan het water. Zowel Diensten als Projecten verwijzen naar /projecten/. | Behoud logo en identiteit. Geef Diensten een echt dienstenoverzicht. Voeg naast de kennismaking een duidelijke instap naar ontwerpen in 3D toe. |
| 2 Projectfilter — werkt, inhoud moet worden gecontroleerd | Schutting kiezen beperkt de toegankelijke projectlijst tot drie schuttingkaarten. Titels en categorieën zijn aanwezig. | Behoud dit gedrag, voeg aantallen en consistente selectie toe; koppel gecombineerde cases aan meerdere diensten. Controleer ieder beeld op inhoud. |
| 3 Projectfoto — ernstige inhoudelijke mismatch | Open Grenen schutting en kies Volgende foto: het label wordt Schutting met horizontale lamellen, maar het beeld toont een sterk gesnoeide boom. De DOM koppelt dat beeld aan schutting-horizontaal-lamellen-zon-1.webp. | Controleer de bestandsbytes en iedere koppeling. De bestandsnaam is hier aantoonbaar geen betrouwbaar bewijs. Herstel cover, titel, alt, categorie en galerij gezamenlijk. |
| 4 Homepage onderhoud — foto past niet bij de dienst | De sectie Periodiek tuinonderhoud toont zichtbaar een schuttingfoto, terwijl de alttekst een voortuin met grindpad en bankje beschrijft. | Gebruik een visueel gecontroleerde onderhoudsfoto; herstel de bijbehorende alttekst en responsive varianten. |
| 5 Bestratingswizard — basisroute werkt | Bestrating → 10–25 m² → Dordrecht en Binnen 1–3 maanden → samenvatting. De wizard gebruikt grove omvangkeuzes en biedt in deze route geen 3D of exacte maatvoering. | Behoud een eenvoudige route. Voeg de verplichte exacte maatvoering en werkende 3D als aanvullende ontwerproute toe. Gebruik radiosemantiek voor één keuze en checkboxsemantiek voor meerdere. |
| 6 Overdracht naar contact — werkt voor deze keuzes | Dienst, woonplaats, omvang in de omschrijving en gewenste periode komen ingevuld op de contactpagina. | Behoud deze regressie. Breid overdracht uit naar het volledige dossier, afbeeldingen en variantkeuze; respecteer de privacyregels uit hoofdstuk 24. |
| 7 Aanvraagontvangst — niet getest | Het formulier toont foto-upload, maximaal vijf bestanden van 8 MB, en verplichte contactvelden. De DOM heeft geen gewone action/method; een JS handler kan de verzending regelen. | Inspecteer de bestaande handler en eventuele endpointconfig. Ontbrekende action bewijst geen defecte backend. Test ontvangst in een daarvoor toegestane testomgeving; geen valse succesmelding. |

**Eerste herstelprioriteit:** foutieve foto-inhoud en Diensten-link. **Daarna:** vroegere instap naar de configurator, complete projectcases, materiaalvergelijkingen en de volledige 3D-aanvraagflow. Voer dit uit als één samenhangende opdracht; het herstel vervangt de uitbreidingen niet.

Controleer voor beeldkwaliteit alle relevante bronbestanden via een contact sheet en individuele inspectie. Test dezelfde cases ook onder Alle projecten, Schutting en Snoeiwerk, en vergelijk steeds het werkelijk weergegeven beeld met de tekst. Laat een test niet slagen alleen omdat de bestandsnaam het woord schutting bevat. Als bronbestanden zelf verkeerd zijn benoemd, leg de herkomst vast voordat je namen of metadata wijzigt.

De live site publiceert nu afzonderlijke bel- en WhatsApp-nummers. De nieuwe instructie is: behoud de functionele scheiding tussen bellen en WhatsApp, maar toon het WhatsApp-nummer niet meer als tekst. Gebruik een WhatsApp-icoon/CTA met toegankelijke naam; het publieke belnummer wordt de nieuwste zakelijke lijn uit hoofdstuk 6 zodra operationeel bevestigd. De footer vermeldt KvK 83078665, overeenkomend met de nieuwste opgave. Verifieer de bedrijfsidentiteit en het openbaar te gebruiken adres vóór juridisch bindende verkoopdocumenten; voer geen blind global replace uit.

Geconstateerd visueel risico: de sticky header bedekt bij een wizardstap gedeeltelijk de stapkop na automatisch scrollen. Geef ankers en wizarddoelen passende scroll-margin-top; verifieer op desktop en mobiel. Het contactformulier is op desktop overzichtelijk, maar maakt zowel telefoon als e-mail verplicht. Laat voor de korte route één bruikbaar contactkanaal plus contactvoorkeur voldoende zijn als de gekozen aanvraagontvanger dat ondersteunt.

Bewijsbeelden zijn opgenomen in de Word-versie bij dit hoofdstuk. De afzonderlijke auditbestandsnamen zijn SEAL_huidig_home.jpg, SEAL_huidig_lightbox_fout.jpg en SEAL_huidig_prefill.jpg. De tekst van dit hoofdstuk blijft zelfstandig bruikbaar wanneer Claude alleen dit Markdown-bestand krijgt. Bron: [S32], [S33] en [S34].

## 33 Claude Code: zuinig werken met tokens en context

Behandel het tokengebruik van Claude Code als een expliciete uitvoeringseis. Het doel is minder onnodig lezen, herhalen, genereren en coördineren. Verlaag daarvoor niet de verplichte 3D, aanvraagbetrouwbaarheid, beeldcontrole of benodigde tests. Een prompt kan geen vast verbruik of besparingspercentage garanderen.

Officiële gebruiksinformatie: /usage toont gebruiksinformatie; dollarindicaties zijn bij een inbegrepen abonnement geen afzonderlijke API-factuur. /compact kan context samenvatten met instructies voor wat behouden moet blijven. /clear past bij een nieuwe, niet gerelateerde taak. Context vol en abonnementsgebruik op zijn verschillende beperkingen. Prompt caching kan kosten beperken; herhaalde grote context blijft context innemen. Onnodige MCP-tools en agentteams kunnen extra gebruik opleveren. Modelkeuze moet aansluiten op de complexiteit [S35]. Controleer eerst welke functies de geïnstalleerde versie en aanmeldmethode werkelijk ondersteunen. Voer slashcommando's via de ondersteunde Claude-interface uit; typ ze niet als willekeurige shellcommando's.

Concrete werkwijze voor deze repository:

- Lees dit dossier één keer volledig. Bewaar het daarna als docs/SEAL_BUILD_BRIEF.md, behoud de hoofdstuknummers en maak een compacte eisenlijst met verwijzingen. Kopieer het niet opnieuw naar ieder bericht, CLAUDE.md of iedere toolaanroep. Gebruik vervolgens alleen de hoofdstukken die bij de huidige wijziging horen.
- Begin met rg --files en gerichte rg-zoekopdrachten. Lees daarna relevante bestanden of regelbereiken. Dump niet de hele repository, node_modules, lockfiles, gegenereerde bundles, alle assets of alle tooldefinities in de context.
- Hergebruik het bronregister en de al onderzochte concurrenten. Controleer een vluchtige prijs gericht bij de bron. Herhaal geen compleet marktonderzoek als alleen de actuele tegelprijs ontbreekt. Verwerk foto-inventarisatie in overzichtelijke batches; sla visuele controle niet over.
- Bouw in samenhangende delen met een korte checklist. Gebruik bestaande componenten, dependencies en werkende prefill. Vermijd een grote herbouw en een lang architectuurdebat als een kleine wijziging het probleem oplost.
- Bundel onafhankelijke zoekopdrachten en controles. Beperk tooluitvoer tot de relevante resultaten. Bewaar grote logs in bestanden en lees alleen de foutregels en noodzakelijke context. Bij een fout: benoem eerst de oorzaak, pas gericht aan en herhaal de betrokken controle.
- Test gewijzigd gedrag en de afgesproken kritieke regressies. Herhaal een geslaagde volledige testset niet zonder nieuwe wijziging of nieuw risico. Sla verplichte checks niet over om tokens te sparen. Leg uit wat passed, failed of blocked is.
- Gebruik alleen relevante aangesloten plugins. Een verbinding in ChatGPT is geen bewijs dat dezelfde plugin in Claude Code beschikbaar is. Inventariseer daadwerkelijk beschikbare tools; werk zonder extra integratie als de taak dat toelaat. Installeer of activeer niet automatisch een hele toolset.
- Start geen agentteam of meerdere volledige reviews uit gewoonte. Gebruik standaard één uitvoerder. Als een gerichte reviewer binnen bestaande toestemming beschikbaar is, geef alleen het relevante verschil, de bijbehorende eisen en testresultaten; dupliceer niet het hele dossier of onderzoek.
- Behoud het door de gebruiker gekozen model en inspanningsniveau. Wissel niet ongemerkt naar een lager niveau of uitgebreidere context. Een passend goedkoper model voor een afgebakende eenvoudige taak is een keuze binnen toegestane instellingen, geen verplichting.
- Houd uitleg tijdens uitvoering kort: wat veranderd is, waarom en het testresultaat. Streef naar maximaal circa 150 woorden per gewone update en circa 350 woorden bij oplevering; wees langer wanneer een blokkade of risico dat nodig maakt. Plak geen complete bestanden of dit dossier terug in de chat.

**Checkpoint vóór contextverlies:** houd docs/IMPLEMENTATION_STATUS.md compact, bij voorkeur onder circa 150 regels. Noteer huidige branch, gewijzigde bestanden, afgeronde eisnummers, laatste testresultaten, echte blokkades en exact de eerstvolgende taak. Geen persoonsgegevens, secrets of volledige logs. Bij hervatten lees je dit checkpoint, gitstatus en de benodigde hoofdstukken; schrijf geen nieuwe masterprompt en begin niet opnieuw met onderzoek.

Gebruik de beschikbare gebruiksmonitor aan het begin, na grote onderdelen en bij oplevering wanneer dat zonder extra integratie kan. Rapporteer uitsluitend werkelijk gemeten waarden. Als token- of kosteninformatie niet beschikbaar is, schrijf dat kort op; schat geen exacte bedragen. Een vooraf ingesteld budget of limiet blijft gelden. Schakel extra betaalde gebruiksruimte niet zelf in. Dreigt een harde grens, leg voortgang vast en stop verantwoord op die grens; noem de resterende eisen en hervat vanuit hetzelfde dossier wanneer uitvoering weer mogelijk is.

## 34 Visuele uitwerking voor de bouw

De bij dit dossier getoonde conceptafbeelding is een visueel voorstel, geen screenshot van gewijzigde productiecode. Zij bewijst geen werkende 3D, prijsberekening, aanvraagontvangst of pixelidentieke eindweergave. Gebruik haar samen met onderstaande regels; bij verschil hebben functionele eisen, echte assets en gecontroleerde prijzen voorrang.

De desktophomepage behoudt de huidige zandkleurige header, het bestaande groene logo, serif koppen, rustige sans serif tekst en donkergroene acties. Maak de hero compacter dan de huidige vrijwel schermvullende foto, zodat de belangrijke vervolgstap eerder zichtbaar is. Gebruik dezelfde gecontroleerde tuin-aan-het-waterfoto met een zorgvuldige uitsnede en leesbare tekst. Kop: Tuinen die rust uitstralen. Acties: Stel uw project samen en Bekijk ons werk. Voeg Gratis bezichtiging in Dordrecht en Heldere offerte vooraf alleen toe als de bestaande voorwaarden dit dragen.

Direct daarna: drie duidelijke visuele ingangen voor Schuttingen, Bestrating en Complete tuin, met daarnaast een compacte ingang voor Onderhoud & snoeiwerk. Gebruik alleen passend eigen werk. Toon vervolgens een uitnodigende preview van de 3D-ontwerproute, projectcases met filters en een korte werkwijze. Prijscontext staat op de juiste dienstpagina en in de ontwerproute; zet geen willekeurige materiaalprijs neer als all-in homepageaanbieding.

De configurator heeft op desktop een compacte keuzezone links, een ruime interactieve 3D-scène rechts en een duidelijk projectoverzicht. Zichtbare stappen: Uw project, Maten & vorm, Materialen, Situatie, Overzicht. Vergelijk materialen is een bereikbare actie. Alleen de actieve keuze is geselecteerd. In het overzicht staan maten, materialen, bekende prijscomponenten, nog te bepalen kosten en de aanvraagactie. Op mobiel worden dezelfde onderdelen onder elkaar geplaatst; een vaste onderbalk mag de actieve stap en doorgaan tonen zonder velden te bedekken. 3D wordt pas na bewuste opening geladen.

Een beeldvoorbeeld mag eigen foto's tonen als stijlreferentie; de echte website gebruikt de oorspronkelijke, gecontroleerde bestanden. Gebruik door AI gegenereerde tuinen nooit als bewijs van uitgevoerd Sealcleaning-werk. Een stijlvolle schematische 3D-scène is passend voor ontwerp. Voeg geen fictieve reviews, sterren, kortingsbadges of garanties toe.


## 35 Productvisie: van hovenierswebsite naar SEAL projectplatform

De website blijft in de eerste plaats een geloofwaardige hovenierswebsite, maar de onderscheidende digitale functie is een gratis bruikbaar projectplatform. Iemand hoeft nog geen klant te zijn om een tuin, schutting of bestratingsvlak te tekenen. Dat gratis nut is acquisitie: mensen keren terug voor volgende projecten, delen ontwerpen en leren Sealcleaning kennen voordat zij materiaal of montage nodig hebben.

Bied na ieder bruikbaar ontwerp vier heldere vervolgroutes zonder druk:

1. **Alleen ontwerpen** — bewaren, vergelijken, branded exporteren en later terugkomen.
2. **Materialen via Sealcleaning** — gecontroleerde materiaallijst, prijsstatus, levering/afhalen waar werkelijk beschikbaar en bestel-/prijsaanvraag.
3. **Alleen montage** — klant heeft eigen materialen; vraag merk/systeem, aantallen, maten, foto’s, orderbon en compatibiliteit. Sealcleaning bevestigt pas na controle dat montage mogelijk is.
4. **Materiaal + montage / complete uitvoering** — één dossier met materiaal, werk, verwijderen, afval, grondwerk, vervoer, planning en opnamepunten.

Voeg voor complete tuinprojecten een vijfde route toe: **“Laat ons het complete plan beoordelen”**. De klant kan zelf ver komen, maar wordt niet gedwongen om technische beslissingen te nemen die vakkennis of locatiecontrole vereisen.

De configurator mag bewust aantrekkelijk genoeg zijn om ook door niet-klanten te worden gebruikt. Maak geen donkere patronen, kunstmatige tijdslimiet of verplichte contactgegevens vóór ontwerpen. Bescherm het merk met branded exports, rate limits op bulkverkeer en het niet aanbieden van white-label embeds; niet door de normale gebruiker te frustreren.

## 36 Informatiearchitectuur voor particulier, zakelijk, aannemer en vakman

Maak de hoofdsite niet onnodig druk. Houd de primaire navigatie consumentgericht. Plaats zakelijke ingangen in Diensten/footer en waar relevant als contextuele CTA.

### Voor aannemers, vastgoed, VvE en zakelijke opdrachtgevers

Bouw `/voor-aannemers/` als echte B2B-landingspagina, niet als generieke contactkopie. Mogelijke opdrachten: onderaanneming groen/tuin, schutting/hekwerk, herstelbestrating, terreinonderhoud, opleverwerk, periodiek onderhoud en tijdelijke capaciteit. Vraag: bedrijf, KvK optioneel bij eerste lead, contactpersoon, rol, projectlocatie, gewenste discipline, scope/hoeveelheden, planning/deadline, veiligheids- of toegangseisen, bestek/tekeningen/foto’s en gewenste vorm van prijs (uurtarief, dagtarief, vaste aanneemsom of nader te bepalen).

Maak in B2B-offertes/facturen btw-verlegging mogelijk wanneer de werkelijke situatie aan de voorwaarden voldoet. De verleggingsregeling kan in hoveniers-/onderaannemingssituaties voor fysieke werkzaamheden aan onroerende zaken gelden; pas dit nooit automatisch alleen op basis van “zakelijke klant” toe. Vereis classificatie van rol en prestatie, btw-id van afnemer en menselijke controle. Bij verlegging: geen btw-bedrag in rekening brengen, afnemers-btw-id vastleggen en “btw verlegd” op de factuur.

### Werken met ons / vakmensen

Bouw `/werken-met-ons/` voor zzp’ers, vakmensen en toekomstige medewerkers. Laat iemand zijn discipline kiezen: stratenmaker, hovenier/groen, schuttingbouwer/timmerman, grondwerker, boom-/snoeiwerk, voorman, algemeen buitenwerk of anders. Vraag regio, beschikbaarheid, ervaring, rijbewijs/vervoer, eigen gereedschap, KvK (bij zzp), VCA/certificaten indien relevant, tariefindicatie optioneel, korte motivatie en veilige bestandsupload voor CV/certificaten. Publiceer geen belofte dat er een vacature of opdracht is als dat niet zo is. Noem het “open samenwerking / interesse” wanneer er geen concrete vacature bestaat.

Recruitmentdata is persoonsgegevensinformatie met eigen bewaartermijn/toegang. Stuur sollicitatiebestanden niet door analytics en bewaar ze niet publiek in GitHub of clientstorage.

## 37 Verwijderen, grondwerk, afval en onbekende toestand als eersteklas projectdata

Een tuinproject bestaat vaak uit meer dan het nieuwe zichtwerk. Maak daarom “Wat moet eerst weg of worden voorbereid?” een volwaardige stap na ontwerp of als onderdeel van Situatie.

Ondersteun minimaal:

- oude schutting/poort demonteren en afvoeren;
- bestaande bestrating opnemen, hergebruiken, stapelen of afvoeren;
- gras/kunstgras verwijderen;
- struiken, heggen, klimplanten en beplanting verwijderen;
- boom/stronk/wortels: alleen intake en opname wanneer risico of conditie onbekend is;
- grond afgraven/aanvullen, zandbed, hoogtecorrectie;
- puin, groenafval, grondstromen en gemengd afval afzonderlijk;
- bestaande tuinmeubels/objecten verplaatsen of klant laat ze zelf verwijderen;
- smalle achterom, trappen, waterzijde, appartementen/galerijen of geen achterom;
- kabels/leidingen/drainage/putten: bekend/onbekend, nooit automatisch lokaliseren;
- onverwachte obstakels/rommel: foto + tekst, geen gokprijs.

Bereken containers, afvoer en arbeid alleen wanneer hoeveelheid, afvalstroom, acceptatievoorwaarden en transport voldoende bekend zijn. Geen generieke “1 container” omdat een oppervlakte groot is. Leg hergebruik expliciet vast om onnodige afval- en materiaalkosten te voorkomen.

## 38 Leveranciers-, inkoop-, markt- en margeverkoopengine

Dit is een kernonderdeel van de commerciële architectuur. De bezoeker ziet een begrijpelijke verkoopprijs; interne inkoop, kortingen, margedoel en leveranciersrangschikking blijven server-side of in een beveiligd beheersysteem.

### Gegevensmodel leverancier en aanbod

Maak naast het productmodel een `supplierOffer`-model met minimaal:

- supplierId, productId/SKU/mapping confidence;
- purchasePriceExVat en purchasePriceIncVat waar bron dit levert;
- kortingsstaffel, minimumafname, verpakkingsgrootte, statiegeld/palletkosten;
- bezorgkosten en voorwaarden, afhaaloptie, regio;
- voorraadstatus en voorraadbetrouwbaarheid;
- leadTimeMin/MaxDays en cut-off indien bevestigd;
- observedAt, validFrom, expiresAt/reviewAfter, source URL/API/feed;
- bronmethode: handmatig gecontroleerd, CSV/feed, API of publieke webbron;
- kwaliteits-/compatibiliteitsstatus en notities;
- `approvedForPricing` na menselijke controle.

Gebruik geen browser scraping als kritieke productiebron wanneer voorwaarden, login of stabiliteit dit niet dragen. Ontwerp adapters voor handmatige import, CSV/XML/JSON feed en later API. Sla credentials nooit in frontend/repository op.

### Landed cost

Bereken interne landed cost per order/product uit werkelijke componenten: netto inkoop, leverancierstransport, pallet/statiegeld, handling, betaal-/transactiekosten indien van toepassing, verwachte verpakkingsafronding/breukreserve wanneer aantoonbaar en toerekenbare logistiek. Houd projectarbeid apart zodat materiaal en montage niet dubbel worden belast.

### Marktconforme verkoopprijs

Maak een configureerbare pricing policy; geen hardcoded “altijd 25% opslag”. De interne assistent vergelijkt genormaliseerde marktprijzen op dezelfde SKU of werkelijk vergelijkbaar systeem, eenheid, maat, btw, levering en garantie. Leg per product een `competitiveCorridor` vast met brondata en datum.

Prijsbeslissing:

1. bepaal landed cost;
2. bereken duurzame ondergrens op basis van minimale bijdrage/marge en risico;
3. bereken doelprijs uit intern margedoel;
4. vergelijk met actuele marktband voor hetzelfde aanbod;
5. als doelprijs marktconform is: voorstel doelprijs;
6. als doelprijs boven marktband uitkomt: flag `margin-conflict` en laat mens kiezen tussen lagere marge, andere leverancier, bundel/servicewaarde of niet aanbieden;
7. als verkoop onder duurzame ondergrens zou komen: niet automatisch verliesgevend verkopen; toon op aanvraag of kies een ander product;
8. een servicepremie is alleen verdedigbaar wanneer Sealcleaning werkelijk waarde toevoegt zoals selectie, één aanspreekpunt, levering, coördinatie, montage, controle of duidelijke garantievoorwaarden. Claim geen garantie die niet is vastgelegd.

Publiceer nooit `purchasePrice`, `internalMargin`, leverancierskortingen of interne ranking in client JS, HTML, source maps of openbare JSON. Publieke productdata bevat alleen de verkoopprijs/prijsstatus en klantrelevante voorwaarden.

### Leverancierselectie

De “beste leverancier” is niet automatisch de laagste stuksprijs. Rangschik totale orderkosten, voorraad, levertijd, compleetheid van systeem, retour/garantieproces, leverbetrouwbaarheid en afstand/logistiek. Eén leverancier met iets hogere stuksprijs kan economisch beter zijn als transport lager is en alle compatibele palen, schermen, beslag en poort beschikbaar zijn.

### Exact versus indicatief

Een “exacte” materiaalprijs mag pas worden getoond wanneer SKU, hoeveelheid, verpakking, actuele verkoopprijs, btw en toepasselijke levering bekend zijn. Als leveradres, voorraad of transport nog ontbreekt, label materiaalprijs exact voor de artikelen maar levering nog te bepalen; noem het geen exact ordertotaal.

## 39 Interne SEAL calculatie- en CEO-assistent

Ontwerp de gegevenslaag zodat een interne assistent later als operationele copiloot kan werken. Het systeem mag voorstellen doen, maar publiceert geen nieuwe prijs, koopt niets in en verstuurt geen bindende offerte zonder menselijke goedkeuring.

De assistent moet op gestructureerde projectstate kunnen antwoorden:

- wat is de complete scope en wat ontbreekt nog;
- welke hoeveelheden volgen uit geometrie en productregels;
- welke bestaande delen blijven, worden verwijderd of hergebruikt;
- welke leverancierscombinatie is economisch en logistiek het beste;
- actuele inkoop, landed cost, verkoopvoorstel, brutomarge en marktpositie;
- benodigde medewerkeruren/ploeguren en risico-opslag;
- huur, vervoer, afval, voorwerk en onderaanneming;
- welke btw-regel per lijn moet worden beoordeeld;
- welke onzekerheid verhindert een bindende offerte;
- welke vragen nog aan de klant of leverancier moeten worden gesteld;
- welke commerciële route past: alleen materiaal, montage, compleet, B2B;
- voorstel voor duidelijke klanttekst zonder interne kosten prijs te geven.

Maak auditability verplicht: elk berekend bedrag verwijst naar pricebookVersion, source IDs, timestamp en aannames. AI-tekst mag nooit een numerieke prijs verzinnen buiten het calculatiemodel. Bij conflict tussen AI-advies en deterministische prijsregels winnen de gecontroleerde regels.

Lever naast code een `docs/PRICING_OPERATIONS.md` met workflow voor nieuwe leverancier, prijscontrole, margegoedkeuring, verouderde prijs, spoedorder, retour en product uit assortiment.

## 40 Offerte, opdracht, meerwerk, werkbon, oplevering en factuur

De digitale ervaring eindigt niet bij de lead. Ontwerp een document- en statusmodel dat later veilig op een backend/boekhoudpakket kan worden aangesloten.

### Documentsoorten

Minimaal voorbereiden:

- aanvraag/projectdossier;
- calculatie intern;
- offerte / prijsvoorstel;
- offerteversie/herziening;
- opdrachtbevestiging;
- materiaalbestelling/orderbevestiging;
- meerwerk-/wijzigingsvoorstel;
- werkbon / uitvoeringssamenvatting;
- opleveringssamenvatting;
- factuur en eventueel creditfactuur;
- nazorg/reviewverzoek.

### Huisstijl

Alle klantdocumenten hebben Sealcleaning-logo, bedrijfsnaam, contact, KvK, btw-id waar vereist, documentnummer, project-ID, datum en consistente groen/zand/zwart-wit typografie. Maak een printvriendelijke A4-stijl en een PDF-renderroute wanneer backend beschikbaar is. Gebruik een scherpe logo-afgeleide; vraag om vector/transparent bron als die ontbreekt, maar blokkeer niet als de bestaande hoge-resolutie versie bruikbaar is.

### Offerte

Een offerte toont minimaal scope, hoeveelheden/maten, gekozen producten, materiaal/arbeid/vervoer/afvoer/huur waar relevant, inbegrepen/uitgesloten onderdelen, aannames, onzekerheden, planningstatus, geldigheid, btw per relevante regel, betaalafspraken en toepasselijke voorwaarden. De 3D/2D visualisatie en materiaalstaat kunnen als bijlage/samenvatting worden toegevoegd met “visualisatie, maatvoering op locatie controleren” waar nodig.

Online akkoord mag pas wanneer identiteit, finale versie, voorwaardenversie, prijs en eventuele bedenktijdinformatie kunnen worden vastgelegd. Wijzig na akkoord niet stilzwijgend dezelfde offerte; maak versie of meerwerk.

### Factuur

Een officiële btw-factuur bevat de wettelijk vereiste gegevens: juridische/handelsnaam waar toegestaan, adressen van leverancier en afnemer, btw-id, KvK indien ingeschreven, uitgiftedatum, uniek opeenvolgend factuurnummer, omschrijving/hoeveelheid van goederen of omvang van diensten, lever-/prestatiedatum of vooruitbetaling, bedrag excl. btw, tarief per regel en btw-bedrag. Bij verschillende tarieven: splits de bedragen. Bij geldige btw-verlegging: geen btw-bedrag op die prestatie, afnemers-btw-id en “btw verlegd”.

Factuurnummers moeten uniek en opeenvolgend zijn en horen daarom niet door losse browsers/localStorage te worden uitgegeven. Laat een veilig backend- of boekhoudsysteem de reeks beheren. Als zo’n systeem ontbreekt, genereert de website alleen een **concept/calculatie**, nooit een officiële factuur met mogelijk dubbele nummers.

IBAN/betaallink, betalingstermijn en aanbetalingsregels zijn bedrijfsinstellingen en worden niet verzonnen. Het logo komt op de factuur; interne kostprijs/marge nooit.

## 41 Online materiaalverkoop: checkout, consumentrecht en veilige fallback

Wanneer Sealcleaning materiaal echt online verkoopt, verandert de site juridisch van alleen leadgen naar online verkoop. Activeer een bindende “Bestellen en betalen”-checkout daarom alleen als onderstaande lagen werkelijk zijn geregeld.

Vóór koop moet de klant duidelijke bedrijfsinformatie, belangrijkste product-/dienstkenmerken, totale prijs en bijkomende kosten, betaling, levering, garantie/klachten, bedenktijd/uitzonderingen en voorwaarden kunnen zien. Na koop volgt een duurzame bevestiging die de verplichte informatie bevat.

Voor online consumentenkoop geldt in veel situaties een wettelijke bedenktijd van 14 dagen. In 2026 geldt bovendien een verplichte online ontbindings-/herroepingsfunctie; implementeer die wanneer de site daadwerkelijk online contracten sluit waarop bedenktijd van toepassing is. Behandel wettelijke rechten nooit als speciale SEAL-bonus. Leg uitzonderingen alleen toe wanneer juridisch toepasselijk, bijvoorbeeld werkelijk maatwerk; neem niet aan dat iedere geconfigureerde standaardcombinatie automatisch maatwerk is.

Bij diensten die op uitdrukkelijk verzoek binnen de bedenktijd starten, leg de benodigde toestemmings-/informatieflow juridisch correct vast voordat werk wordt gestart. Laat dit door een jurist/branchebron controleren voordat het live bindend wordt.

Zonder veilige backend/payment/orderadministratie: bied **“Materiaalprijs aanvragen / bestelling laten controleren”** en een volledige winkelmand-/materiaallijst, maar toon geen nep-betaalknop of orderbevestiging. Het ontwerp moet later kunnen aansluiten op PSP, voorraad en orderstatus zonder de configurator opnieuw te bouwen.

## 42 Klantreis en operatie na de website

Maak `/werkwijze/` inhoudelijk rijker en laat dezelfde statussen ook intern bestaan:

1. Idee / zelfstandig ontwerp.
2. Aanvraag ontvangen.
3. Compleetheidscheck van maten, foto’s, bereikbaarheid, verwijderen en materiaal.
4. Indien nodig bezichtiging/inmeting.
5. Materiaal- en uitvoeringsadvies.
6. Calculatie en offerte.
7. Akkoord / voorwaarden / eventuele bedenktijd.
8. Materiaal inkoop/levering reserveren.
9. Planning bevestigen.
10. Uitvoering met wijzigings-/meerwerkprocedure.
11. Oplevering en aandachtspunten.
12. Factuur/betaling.
13. Nazorg, review en onderhoudsoptie.

Geef klanten op de website vooraf uitleg wat zij kunnen voorbereiden: vrije toegang, water/elektra alleen indien nodig, parkeer-/laadmogelijkheid, buren/erfgrens, waardevolle objecten verplaatsen, huisdieren/kinderen, bekende kabels/leidingen en wie aanwezig is. Maak dit projectafhankelijk; niet iedere klus krijgt dezelfde checklist.

Bouw geen fictief klantportaal. Als later een portal komt, moet projectstatus uit echte backenddata komen en geen nep-“in behandeling” tonen.

## 43 Garantie, kwaliteit en vertrouwen zonder overclaim

Een sterk merk mag premium worden geprijsd wanneer de ervaring daadwerkelijk beter is, maar de website mag dat niet onderbouwen met verzonnen garanties of nepautoriteit.

Maak garantie als gegevensmodel per component:

- manufacturerWarranty: bron, duur, voorwaarden, product-ID;
- Sealcleaning workmanship warranty: alleen wanneer de onderneming de inhoud, duur, uitsluitingen en claimprocedure formeel heeft vastgesteld;
- wettelijke rechten: niet presenteren als commerciële extra;
- garantie vervalt niet automatisch door kleine niet-gerelateerde handelingen tenzij juridisch/contractueel onderbouwd.

Toon premiumwaarde via concrete proceskwaliteit: correcte materiaalstaat, visuele configuratie, duidelijke prijscomponenten, nette voorbereiding, één dossier, levercoördinatie, foto’s van echt werk, gecontroleerde oplevering, bereikbaarheid en nazorg. “Duurder omdat ons systeem mooi is” is geen klantargument; “minder fouten, duidelijker keuze, één aanspreekpunt en gecontroleerde uitvoering” kan dat wel zijn als het proces dit waarmaakt.

## 44 Marketing, Meta/Google, content en herhaalbezoek

De website wordt de kern van acquisitie. Bouw landingspagina’s en events zo dat advertenties niet eindigen op een algemene homepage wanneer een specifieke intentie bekend is.

### Campagneroutes

- schutting → schuttingconfigurator met voorbeeld;
- bestrating → oppervlak/tegelkeuze + 2D/3D;
- complete tuin → tuinplan;
- onderhoud/snoei → korte foto-intake;
- alleen montage → montageroute;
- materialen → materiaalsamenstelling;
- aannemer/VvE → B2B-pagina;
- vakman/zzp → samenwerking.

Onderzoek in Nederlandse Meta-advertenties laat zien dat aanbieders vaak concurreren op voorraad, korting, privacy/uitstraling, directe prijs en lage frictie. Kopieer hun tekst niet. SEAL onderscheidt zich met “ontwerp eerst zelf”, transparante samenstelling en keuze tussen materiaal, montage of compleet. Test dit als hypotheses; claim geen hogere conversie zonder data.

### Contentmotor

Maak kennisbankclusters rond echte intentie: schutting opmeten, poortpositie, hout-beton/composiet, terras m² berekenen, tegelformaat/snijnadeel, tuin leeghalen vóór aanleg, afvalstromen, achterom/toegang, wat kost alleen montage, materiaal zelf kopen versus via hovenier, tuinrenovatie versus complete aanleg, VvE/zakelijk onderhoud. Gebruik configuratorvoorbeelden en eigen cases; geen generieke AI-vulling zonder vakcontrole.

### Meetplan

Breid events uit met design_start, design_object_add, design_save, design_export, design_share, material_list_view, material_quote_start, material_order_request, installation_quote_start, combined_quote_start, b2b_lead_start/submit, applicant_start/submit, quote_accept_start/complete en order_cancel_request. Verstuur geen PII of inhoud van ontwerpen/foto’s naar advertentieplatformen.

Koppel UTM/campagne aan sessie/lead via veilige whitelisted velden zodat offerteacceptatie en marge later per kanaal kunnen worden geëvalueerd zonder persoonsgegevens in analytics.

## 45 Visuele en UX-uitbreidingen bovenop de conceptafbeelding

De aangeleverde conceptafbeelding is een sterke richting: compacte premium header, fotografiehero, vier dienstingangen, grote configuratorpreview, projecten, werkwijze en donkere footer. Gebruik die hiërarchie, maar maak het eindproduct functioneler dan de afbeelding.

Voeg in/om de configurator toe:

- 2D/3D toggle plus bovenaanzicht/vooraanzicht;
- “bestaand / verwijderen / nieuw” objectstatus met duidelijke legenda;
- lock-icoon voor behouden objecten;
- undo/redo voor ontwerpacties;
- autosave van niet-persoonlijke lokale ontwerpstate en expliciet “Opnieuw beginnen”;
- materiaalvergelijking zonder marketingsterren;
- live materiaallijst met aantallen;
- prijsstatus met uitleg “exact artikelbedrag / levering nog te bepalen / opname nodig”;
- ontwerpvarianten A/B/C;
- branded export en “Voeg dit ontwerp toe aan mijn aanvraag”;
- duidelijke CTA-keuze materiaal, montage of compleet;
- op mobiel een compacte canvasmodus en geen miniatuurdesktopinterface.

Voeg op service- en materiaalpagina’s sticky context-CTA’s toe die de gekozen dienst/productprefill naar de configurator sturen. Een bezoeker die een eigen projectcase bekijkt kan “Gebruik dit als inspiratie” kiezen; kopieer alleen niet-persoonlijke stijl-/materiaalvoorkeuren en nooit klantmaten/adres.

## 46 Security, backendgrenzen en operationele data

De huidige site op GitHub Pages is openbaar en statisch. Behandel alles in repository/clientbundle als publiek leesbaar. Daarom horen hier **niet** in: inkoopprijzen, marges, supplier credentials, private APIs, klantdossiers, factuurreeksen, CV’s, offerte-akkoorden, orderstatus of betalingsgeheimen.

Definieer een adapterarchitectuur:

- public catalog/read-only prices;
- secure pricing/order API;
- submission API;
- document service;
- media upload/storage;
- transactional email;
- payment provider;
- accounting/CRM adapter.

Een provider mag pas worden gekozen na inspectie van bestaande hosting, kosten, AVG, file limits en onderhoud. Verplaats niet automatisch de hele site van GitHub Pages. Een statische frontend kan veilig met een aparte serverless/backend praten.

Minimale backendsecurity bij activering: server-side schema validation, rate limiting, CSRF/originstrategie waar relevant, allowlisted CORS, idempotency, signed/controlled uploads, MIME/content checks, beperkte bestandsgrootte, logging zonder gevoelige payloads, secrets via environment, role separation voor admin, backups en verwijder-/retentieproces.

## 47 Aanvullende acceptatietests voor de masterversie

Voeg deze tests toe aan hoofdstuk 28:

| Test | Actie | Vereist resultaat |
| --- | --- | --- |
| Vrije tuincontour | Teken niet-rechthoekige tuin en wijzig één zijde | m² verandert correct; 2D en 3D delen exact dezelfde geometrie |
| Alleen m² bekend | Vul 80 m² in zonder vorm | 80 m² blijft bekend; systeem verzint geen echte 10×8 geometrie |
| Bestaande poort | Zet bestaande te behouden poort tussen nieuwe schutting A/B | Opening blijft, geen nieuw poortproduct/montage, aansluitingen kloppen |
| Verwijderen | Markeer 20 m² oude tegels en 8 m heg voor verwijderen | Dossier bevat afzonderlijke sloop/afvoerregels; geen €0 bij onbekende afvoer |
| Branded export | Download PNG/PDF | Ontwerp, maten en subtiele Sealcleaning-branding zichtbaar; geen PII tenzij bewust documenttype |
| WhatsApp privacy UX | Bekijk footer/contactbron | Nummer niet als zichtbare tekst; toegankelijke WhatsApp-CTA werkt; site claimt geen technische geheimhouding |
| Publiek belnummer | Klik bellen | Gebruikt bevestigde zakelijke +31 78-lijn, geen oud mobiel nummer |
| Materiaalroute | Kies alleen materiaal | Geen montagekosten; materiaallijst/leverstatus coherent |
| Montage-only | Kies eigen materiaal + montage | Vraagt systeem/SKU/foto/orderinfo; geen automatische compatibiliteitsbelofte |
| Gecombineerd | Kies materiaal + montage + verwijderen | Eén dossier; geen dubbele transport-/montageposten |
| Markt/margeconflict | Interne doelprijs ligt boven vergelijkbare marktband | Publicatie geblokkeerd/flag; geen stille excessieve opslag |
| Inkoopgeheim | Inspecteer public assets/source map/network | Geen supplier purchasePrice, margin target of credentials in client |
| Verouderde supplier offer | expiresAt verstreken | Exacte bestelprijs niet automatisch gebruikt; review/refresh vereist |
| Factuurconcept zonder backend | Probeer officiële factuur te maken op statische site | Geen officieel uniek factuurnummer uit browser; alleen concept/preview |
| Btw verlegd | B2B onderaanneming met geldige configuratie | Afnemers-btw-id + “btw verlegd”; geen btw-bedrag; menselijke reviewstatus |
| B2C online order | Checkout actief | verplichte info, orderbevestiging en ontbindingsfunctie/bedenktijdflow waar toepasselijk |
| Aannemerlead | Verstuur B2B-intake | correcte aparte pipeline/event; geen particuliere velden verplicht zonder reden |
| Vakmanlead | Upload CV/certificaat | veilige file validation, geen analytics/URL-lek, juiste privacytekst |
| Offerteversie | Wijzig scope na akkoord | nieuwe versie/meerwerk, originele geaccepteerde versie onveranderd |
| Prijsbron | Open klantprijsdetail | bron/peildatum waar relevant; interne inkoop/marge niet zichtbaar |

## 48 Uitvoeringsprioriteit van versie 2.0

Bij conflict tussen eerdere hoofdstukken en hoofdstuk 35–48 geldt deze masteruitbreiding als nieuwste beslissing. Werk in deze volgorde, zonder verplichte kern onnodig uit te stellen:

1. **Herstel waarheid en huidige fouten:** foto-/categoriekoppelingen, Diensten-link, contactbeleid, nieuwste bedrijfsconfig, zichtbare WhatsApp verwijderen, oude telefoon opschonen.
2. **Datafundament:** projectstate, products, suppliers/public-vs-private pricing interface, bestaande/verwijder/nieuwe objectstatus en betrouwbare uploads.
3. **2D + echte 3D:** vrije/standaard tuincontour, schutting, poorten, bestrating, bestaande objecten, verwijderen, maatlabels, export.
4. **Commerciële routes:** ontwerp-only, materiaal, montage-only, materiaal+montage, compleet.
5. **Calculatie/prijsstatus:** actuele productdata, hoeveelheden, transport/afval/arbeidregels, marktvergelijking en veilige margearchitectuur.
6. **Leadbackend/fallback:** complete dossieroverdracht en echte ontvangsttest; geen mailto als eindambitie.
7. **Projectcases/SEO/content:** eigen bewijs, landingroutes en kennisbank.
8. **B2B + werken met ons.**
9. **Documentarchitectuur:** offerte, meerwerk, werkbon, oplevering, factuurconcept en veilige backendkoppeling.
10. **Webshop/checkout alleen wanneer backend, provider en juridische eisen echt gereed zijn.** Zonder die voorwaarden blijft materiaal bestellen een heldere prijs-/orderaanvraag, niet een nepcheckout.
11. **Analytics/ads:** privacybewuste eventlaag, daarna pas betaalde campagnes sturen op leadkwaliteit en brutomarge.
12. **Onafhankelijke review:** code, UX, bedragen, juridische labels, mobiel, toegankelijkheid, security, SEO en regressies.

Doel is niet zoveel mogelijk features zichtbaar maken. Doel is dat iedere zichtbare functie echt werkt, iedere prijs verklaarbaar is, iedere klantkeuze in hetzelfde dossier terechtkomt en Sealcleaning intern weet wat een opdracht oplevert voordat hij wordt aangenomen.

## 49 Nieuwe bron- en regelcontrole voor versie 2.0

Controleer tijdens implementatie de actuele officiële bronnen opnieuw; onderstaande uitgangspunten zijn op 7 oktober 2026 gecontroleerd:

- Belastingdienst factuureisen: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/administratie_bijhouden/facturen_maken/factuureisen/
- Belastingdienst sierteelt/hoveniers: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/tarieven_en_vrijstellingen/goederen_9_btw/sierteeltproducten/
- Belastingdienst btw-verlegging bij onderaanneming/groenvoorziening: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/btw/btw_berekenen_aan_uw_klanten/waarover_btw_berekenen/verleggingsregeling/wanneer_btw_verleggen/bij_onderaanneming_en_personeel_uitlenen/verlegging_bij_onderaanneming_en_personeel_uitlenen
- ACM verplichte informatie vóór/na online koop: https://www.acm.nl/nl/verkoop-aan-consumenten/consumenten-informeren/verplichte-informatie-voor-en-na-de-koop
- ACM bedenktijd/ontbindingsfunctie: https://www.acm.nl/nl/verkoop-aan-consumenten/klantenservice/bedenktijd
- Schutting Direct configurator en live prijslogica: https://www.schutting-direct.nl/configurator
- EvoWood 3D schuttingconfigurator: https://www.evo-wood.com/schutting-configurator.html
- SCHUTTING.nl configuratie + materiaal/montage positionering: https://www.schutting.nl/
- Tekenjetuin 2D/3D consumententool: https://www.tekenjetuin.nl/en/
- Smederij Papendrecht 3D poortconfigurator: https://smederijpapendrecht.nl/configurator/poorten

Gebruik deze voorbeelden alleen om patronen, eisen en marktverwachtingen te begrijpen. Kopieer geen tekst, code, visuals of merkuitingen.

## 50 Definitieve eindinstructie — MASTER

Lees dit masterdossier volledig één keer en behandel het als de leidende uitvoeringsspecificatie. Inspecteer daarna de echte repository en voer de opdracht daadwerkelijk uit. Werk niet terug naar alleen advies of mockups. Behoud aantoonbaar sterke bestaande onderdelen, maar laat oude teksten of flows niet staan wanneer ze rechtstreeks botsen met deze versie — met name het oude zichtbare WhatsApp-nummer, het oude mobiele belnummer, “klant koopt materiaal altijd zelf/geen opslag” als enige werkwijze en de beperking dat webshop/commerciële orderarchitectuur volledig buiten scope zou vallen.

Werk waarheid- en brongebaseerd. Exacte prijzen vereisen actuele product-/leveranciersdata en correcte scope. Maak onzekerheden zichtbaar, maar gebruik onzekerheid niet als excuus om de configurator, prijsarchitectuur, commerciële routes of documenten slecht te ontwerpen. Interne inkoop/marges blijven geheim. De klant krijgt een heldere, eerlijke verkoopprijs en weet wat inbegrepen is. Iedere export is herkenbaar van Sealcleaning; iedere aanvraag bevat het relevante ontwerp en dossier.

Bouw de website alsof zij niet alleen vandaag leads moet opleveren, maar de komende jaren het digitale hart van Sealcleaning wordt: ontwerpen, calculeren, materialen leveren, montage verkopen, aannemers bedienen, vakmensen aantrekken, projecten documenteren en professioneel opvolgen. Doe dit modulair, veilig, snel en toetsbaar. Geen nepfunctionaliteit, geen fictieve bewijsclaims, geen ongeteste “exacte” prijs en geen publieke bedrijfsgeheimen.


