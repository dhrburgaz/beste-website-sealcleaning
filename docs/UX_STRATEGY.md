# UX_STRATEGY: doelgroepen, vertrouwen, journeys en hypotheses

Bron: `docs/SEAL_MASTER_BRIEF.md` (V7-01, V7-04, V7-11, V7-15). Dit document beschrijft **ontwerpaannames die nog getoetst moeten worden**, niet bewezen effecten. Er is nog geen gebruikerstest en geen bezoekersmeting uitgevoerd. De bronnen bij V7-21 (Baymard, NN/g, ACM, W3C, web.dev) konden vanuit deze omgeving niet worden geopend; de beginselen hieronder komen uit het dossier en algemene vakkennis.

## 1. De ontwerpvraag

Wie honderden tot duizenden euro's in woning en tuin investeert, moet bij elke stap een veilige, geïnformeerde en plezierige keuze kunnen maken. Daaruit volgen zes lagen en wat de site daar nu voor doet:

| Laag | Wat de klant nodig heeft | Wat er nu is |
|---|---|---|
| Aantrekkingskracht | Smaak, rust, een beeld van het resultaat | Echte projectfoto bovenaan, rustige typografie, geen stockbeeld |
| Begrip | In seconden weten wat, waar en hoe contact | Werkgebied in de hero, twee duidelijke paden, belknop altijd binnen bereik |
| Geloofwaardigheid | Echt werk, echte gegevens, eerlijk over onzekerheid | Eigen foto's, bedrijfsgegevens, bron en peildatum bij prijzen, "wat niet standaard is inbegrepen" |
| Controle | Terugkunnen, opslaan, vergelijken, begrijpen | Ontwerp bewaard, undo/redo, A/B/C, filters in de URL, vergelijken tot 3 |
| Transactiezekerheid | Verschil tussen aanvraag, indicatie, offerte, akkoord, bestelling | Vijf modellen met eigen taal en flow (`docs/COMMERCE_RULES.md`) |
| Vertrouwen na verkoop | Planning, voortgang, wijziging, nazorg | Klantportaal, berichten, afspraken met ICS, opleverdocument |

## 2. Doelgroepen (geen stereotypen) en kernrisico

| # | Groep | Eerste vraag | Grootste twijfel | Wat de site biedt | Nog open |
|---|---|---|---|---|---|
| a | Kleine, snelle klus | "Komt u ook voor iets kleins?" | Is dit de moeite voor hen? | Snelle aanvraagroute, "kleine klus" in intake | Geen minimum aangegeven; eigenaar beslist |
| b | Schutting/privacy | "Wat kost dit per meter?" | Verborgen kosten, buren | Schuttingconfigurator, aanpakkeuze, niet-standaard lijst | Buurafspraken niet uitgewerkt |
| c | Bestrating/terras/oprit | "Welke tegel, hoeveel?" | Snijverlies, ondergrond | Hoeveelheidsrekenaar, geverifieerde tegels, ondergrondinfo | Weinig echte producten (3 tegels) |
| d | Complete renovatie | "Waar begin ik?" | Overzicht, planning | Doelkeuze, fasering, projectportaal | Geen planningsvoorbeeld |
| e | Luxe tuinontwerp | "Kunnen jullie dit ontwerpen?" | Smaak, niveau | Cases, 3D | Geen ontwerpportfolio; stijlkiezer ontbreekt |
| f | Laag onderhoud | "Wat is onderhoudsvrij?" | Valse beloftes | Onderhoudsniveau per materiaal, geen onderhoudsvrij-belofte | Geen langetermijnkosten |
| g | Prijsgevoelig/vergelijkend | "Wat kost het, en bij anderen?" | Misleiding | Marktreferenties met bron, varianten A/B/C | Geen echte Sealcleaning-prijzen tot eigenaar invult |
| h | Bestaande klant/nazorg | "Kan ik iets laten herstellen?" | Opnieuw uitleggen | Portaal, serviceverzoek | Herinneringen niet geautomatiseerd |
| i | Aannemer/projectleider | "Kunnen jullie onderaannemer zijn?" | Betrouwbaarheid, PO | Zakelijke intake | Geen referentieprojecten voor B2B |
| j | VvE/verhuurder | "Meerdere locaties?" | Administratie | PO-veld, facturatie | Meerdere locaties per aanvraag niet gebouwd |
| k | Zakelijke inkoper | "Offerte met PO/btw?" | Btw-verlegging | Offertes met referentie | Btw-verlegging per geval toetsen |
| l | Vakman | "Kan ik met jullie samenwerken?" | Serieuzer dan een CV-ontvanger | Werken-met-ons-formulier | Geen proces beschreven |

## 3. Gedragsprincipes (alleen eerlijk toegepast)

| Principe | Toepassing | Verboden |
|---|---|---|
| Beperkte keuze, progressieve onthulling | Drie hoofdopties per scherm, details uitklapbaar, "weet ik niet" is een antwoord | Verplicht volledige configurator |
| Herkennen i.p.v. onthouden | Actieve filters als chips, vergelijking naast elkaar | Verborgen toestand |
| Endowment door eigen ontwerp | Eigen ontwerp bewaren en terugvinden | Manipulatieve herinneringspushes |
| Verliesvermijding door controle | Undo, bewaren, mandje blijft staan | Schuldgevoel, afleidende teksten |
| Zekerheid: wat gebeurt er daarna | Microcopy na CTA | Valse belofte van beschikbaarheid |
| Bewijs | Eigen foto's, echte bronnen | Nepreviews, nep-voor/na, nep-schaarste, aftelklokken, vooraf aangevinkte betaalde opties, verborgen kosten |

## 4. Hypotheses en experimenten (nog niet uitgevoerd)

Elke hypothese: primaire meting, guardrail, benodigde omvang en besluit. Zonder voldoende bezoekers geen A/B-test en geen uitspraak over significantie.

| # | Hypothese | Primaire meting | Guardrail | Status |
|---|---|---|---|---|
| H1 | Foto bovenaan met werkgebied en twee CTA's verhoogt het aandeel bezoekers dat een aanvraag of ontwerp start | Starts / unieke bezoekers | Aanvraagkwaliteit (volledig ingevuld) | niet gemeten |
| H2 | "Wat staat er niet standaard in uw offerte?" verlaagt vragen over onverwachte kosten | Aantal kostenvragen per offerte | Akkoordpercentage | niet gemeten |
| H3 | Instapkeuze snel/zelf ontwerpen verhoogt het aantal afgeronde aanvragen | Voltooiing intake | Tijd tot aanvraag | niet gemeten |
| H4 | Filters in de URL en vergelijken verlagen het aantal uitvallers op /materialen/ | Overgang naar productdetail of aanvraag | Pagina-interactietijd (INP) | niet gemeten |
| H5 | Een coupon die zijn reden uitlegt, verlaat het afrekenen minder vaak | Afbreekpercentage in stap 3 | Marge per bestelling | niet toepasbaar (webwinkel uit) |

## 5. Gebruikerstest (nog uit te voeren)

Doel: ontdekken waar echte bezoekers vastlopen. Een kleine test bewijst geen brede conversieverbetering.

Taken (vooraf vastgelegd):

1. "Vind de prijs voor een schutting met poort."
2. "Kies een 60×60-tegel én een alternatief."
3. "Maak uw ontwerp later af."
4. "Wat gebeurt er na uw aanvraag?"
5. "Pas een kortingscode toe." (zodra de webwinkel actief is)
6. "Herroep een aankoop waar dat wettelijk kan." (zodra de webwinkel actief is)

Deelnemers: minimaal 5, waaronder onervaren bezoekers en mobiele gebruikers. Vastleggen: tijd, fouten, twijfel, citaten. Herhalen na verbeteringen.

## 6. Meetplan (privacyvriendelijk, nog niet actief)

De site gebruikt bewust **geen** tracking of analytics-cookies. Meten vereist een beleidskeuze van de eigenaar (bijvoorbeeld een cookieloze, geaggregeerde teller zonder persoonsgegevens, of Search Console voor zoekverkeer). Tot die tijd zijn er alleen labmetingen (`tools/perf-lab.mjs`) en de aanvraagstatistiek in het beheer (aantal aanvragen per soort en status).

KPI-definities voor later: relevante service-route, kwalificerende aanvraagratio, voltooiing snelle intake, 3D-start versus aanvraag, ontwerp-opslag/hervatting, vergelijkingsgebruik, offerte bekeken/vragen/akkoord, checkoutstart/-afbreken/-voltooien, tevredenheid na oplevering, Core Web Vitals en toegankelijkheidsproblemen. Geen "hoge conversie" zonder baseline en noemer.

## 7. Prioriteiten

| Prio | Onderdeel | Reden |
|---|---|---|
| P0 | Geen klantdata of marge zichtbaar voor anderen; server rekent prijzen | Getest |
| P1 | Echte bewijsinhoud van de eigenaar (team, reviews) | Vertrouwen kan niet verzonnen worden |
| P1 | Juridisch gecontroleerde voorwaarden, privacy en herroeping | Voorwaarde voor live gebruik van akkoord en winkel |
| P2 | Gebruikerstest, fysieke toestellen, schermlezer | Kwaliteitsbewijs |
| P2 | Stijlkiezer, burenproject, "wat als"-scenario's, AVIF | Waarde, geen blokkade |
