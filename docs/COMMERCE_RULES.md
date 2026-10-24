# COMMERCE_RULES: diensten versus producten, kortingen, btw en juridische poorten

Status: **gebouwd en getest, uitgeschakeld.** Niets hier is live of operationeel. De feature flags staan standaard uit en er bestaat geen enkel product, geen enkele code en geen bezorgprijs totdat de eigenaar die invoert.

> **Let op, beleidskeuze eigenaar:** de huidige werkwijze op de site (`/werkwijze/` en dienstpagina's) is dat de klant materialen **zelf bestelt na advies**. De webwinkel in dit document spreekt dat tegen zodra hij aan staat. Activeren vraagt dus eerst een bewuste beleidswijziging, bevestigde assortiment- en leverafspraken en bijgewerkte teksten. Tot die tijd blijft de winkel uit en is `/materialen/` een informatiebron met adviesroute.

## 1. Vijf commerciële modellen (V7-09)

| Model | Wat de klant doet | Binding | Betaling |
|---|---|---|---|
| A. Vrijblijvende aanvraag | Formulier of configurator-aanvraag | geen | geen |
| B. Indicatieve calculator | Ontwerp en indicatie bekijken | geen, "indicatie, geen offerte" | geen |
| C. Offerte | Offerte ontvangen, vragen stellen | pas na akkoord | geen |
| D. Opdracht | Digitaal akkoord (naam, hash van de offerte, voorwaardenversie, toestemmingen) | ja | factuur, bank of Mollie |
| E. Productbestelling | Mandje → gegevens → expliciete knop "Bestellen en betalen" | ja, na betaalbevestiging | verplicht vooraf |

De knoptaal verschilt per model (de aanvraagroute zegt nooit "bestellen"). Een aanvraag krijgt nooit een "besteld"-mail. Een bestelling wordt pas "betaald" na een webhook die de status bij Mollie zelf ophaalt.

## 2. Feature flags (`/admin/#winkel`, alleen de eigenaar)

`catalog_enabled`, `quotes_enabled`, `checkout_enabled`, `coupon_enabled`, `payments_enabled` en `appointments_enabled`. Flags zijn een bedieningsschakelaar, geen beveiligingsgrens: de server controleert elke aanvraag zelf.

Bestellen is alleen open als **alle drie** gelden:

1. `checkout_enabled` staat aan.
2. `payments_enabled` staat aan én er is een `MOLLIE_API_KEY`.
3. Minstens één bezorg- of afhaalmethode heeft een vastgestelde prijs.

Anders ziet de klant een eerlijke melding met alternatieven (offerte aanvragen, advies vragen). De klant ziet geen nepbetaling en geen nepbevestiging.

## 3. Prijs en btw

- De prijs komt altijd uit de database. Een prijs, korting of totaal in het verzoek wordt genegeerd (getest).
- Bedragen zijn gehele centen. Btw wordt per tarief berekend over het bedrag **ná korting**, inclusief bezorging.
- De bezorgprijs is nooit stilzwijgend € 0: zonder vastgestelde prijs is de methode niet te kiezen. Afhalen met prijs 0 is een bewuste keuze.
- Elke bestelling bewaart een **momentopname** (regels, prijzen, korting, btw, totaal, voorwaardenversie, toestemmingen).
- Het IP-adres wordt alleen als hash bewaard.
- Of de btw-behandeling klopt (o.a. verlegging bij zakelijke opdrachten) moet de eigenaar of een adviseur bevestigen.

## 4. Kortingscodes

**Opslag:** type (percentage, vast bedrag, gratis bezorging), bereik (hele bestelling, categorieën of producten), periode in Amsterdamse tijd, actief, stapelbaar, minimum, maximum voordeel, maximaal totaal gebruik, maximaal per klant, notitie en auditspoor.

**Validatie (server):**

- bestaat en is actief;
- binnen de periode (Europe/Amsterdam, inclusief zomertijd);
- gebruikslimieten (totaal en per klant, gemeten via een geanonimiseerde e-mailhash);
- minimum over de in aanmerking komende regels;
- bereik;
- niet-stapelbare codes sluiten elke andere code uit;
- korting is nooit hoger dan het bedrag en nooit negatief.

**Gelijktijdigheid:** bij het bestellen reserveert de server de code binnen één transactie. Daarna telt hij opnieuw tegen het maximum. Twee gelijktijdige bestellingen op de laatste code: precies één slaagt (getest).

**Levenscyclus:** `reserved` → `redeemed` bij betaling, `released` bij mislukken, verlopen of annuleren.

**Gebruikerservaring:** het couponveld is optioneel en onopvallend. Bij een afgewezen code staat de concrete reden, bijvoorbeeld "verlopen", "op", "minimum € 50,00" of "geldt niet voor deze artikelen". Het verwijderen van een code herstelt het totaal direct. Er is geen aftelklok en geen nep-schaarste.

**Marge:** een code mag nooit onder de kostprijs uitkomen. Dat is een bewuste keuze van de eigenaar; er staan geen standaardcodes aan. De voorbeeldcode `WELCOME10` bestaat alleen als testfixture en is nergens publiek zichtbaar.

## 5. Van/voor-prijzen (ACM)

Een doorgestreepte "van"-prijs verschijnt alleen als alle drie gelden:

1. Er is een volledige prijshistorie.
2. Het product is minimaal 30 dagen bekend.
3. De "van"-prijs is de **laagste** eigen prijs uit de 30 dagen vóór de verlaging.

Een tijdelijk opgeschroefde prijs telt dus niet mee. Zonder historie wordt geen korting of besparing getoond (getest). Bron van de norm: de ACM-regels zoals gevonden in zoekresultaten (zie `COMPETITOR_BENCHMARK.md`). De volledige tekst kon vanuit deze omgeving niet geopend worden en moet vóór activering juridisch worden gecontroleerd.

## 6. Juridische poorten vóór activering

Vóór `checkout_enabled` en `payments_enabled` zijn nodig:

- Juridisch gecontroleerde algemene voorwaarden en privacyverklaring, met een herroepingsregeling voor producten.
- Een herroepingsformulier en de online ontbindingsfunctie waar die geldt. De ACM noemt een wettelijke online ontbindingsfunctie vanaf 25 juni 2026. Dit staat in het dossier, niet zelf geverifieerd; laat het juridisch beoordelen.
- Duidelijke levertijd, retour- en klachtenroute.
- Bevestigde assortiment-, voorraad- en leveranciersafspraken: de catalogus claimt geen voorraad of levertijd.
- Verwerkersovereenkomsten (hosting, betaalprovider, e-mail).
- Een Mollie-account en een geteste webhook.
- Btw- en factuurafspraken: een webwinkelbestelling krijgt nu een orderbevestiging, nog geen factuurnummer uit de reeks. Dit is een open punt voor de boekhouding.

## 7. Tests

- **Unit:** `tests/commerce.test.mjs` (prijzen, kortingen, stapelen, DST-grenzen, van/voor).
- **Integratie:** `tests/shop.test.mjs` (flags, beheer, prijsvalidatie, race op laatste code, idempotentie, webhook, mislukte betaling, geen bestelling bij providerfout).
- **Browser:** `tests/e2e/webwinkel.mjs` op 390 en 1440 px, met nagebootste Mollie.
