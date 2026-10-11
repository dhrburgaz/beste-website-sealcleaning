# Prijs- en calculatieoperatie (ch. 38–39, V6-05)

Werkwijze voor de interne calculatie in `/beheer/`. De code is openbaar;
**bedrijfsgegevens (inkoop, marges, kostprijzen, klanten, offertes) staan
alleen versleuteld in de beheerkluis op het eigen apparaat** en nooit in
de repository, URL's of de publieke website.

## Bouwstenen

| Onderdeel | Bestand | Wat |
| --- | --- | --- |
| Hoeveelhedenstaat | `js/calc/quantities.js` | Uit het ontwerp: tegels (+5% snijverlies), opsluitband, zandbed, afgraven, trilplaatdagen, schermen/passtukken/palen/onderplaten/poorten, groen, verharding, verlichting, sloop, containers. Aannames per regel. |
| Rekenmotor | `js/calc/engine.js` | Per regel: arbeid, materiaal, machine, afvoer, transport; opslag per soort, algemene kosten, risico, minimumorder, afronding, btw, kostprijs, brutomarge; signalen. |
| Standaarden | `data/calc-defaults.js` | Alleen het bevestigde uurtarief (€ 60 excl. btw). Normen = voorbeeldwaarden. Marges/kostprijzen = leeg. |
| Marktprijzen | `data/price-sources.json` | Openbare consumentenprijzen met bron, peildatum, `reviewAfter` en status. Geen inkoopprijs. |
| Klantregels | `customerLines()` in `engine.js` | Verwerkt opslagen naar rato in de regelprijzen; de klant ziet geen interne opbouw. |

## Rekenregels (afzonderlijk berekend)

- **Arbeid:** persoonsuren = hoeveelheid × norm (u/eenheid). Verkoop = uren × € 60,00 excl. btw (bevestigd 9-10-2026). Kostprijs = uren × interne kostprijs per uur (alleen als ingesteld).
- **Materiaal / machines / afvoer:** kostprijs per eenheid = eigen inkoopprijs (voorrang) of anders de openbare marktprijs excl. btw als *benadering*. Verkoop = kostprijs × (1 + opslag%). Staffelprijzen uit de bron worden toegepast.
- **Transport:** werkdagen = ⌈uren / (ploeg × 8)⌉ × tarief per dag; doorberekend zonder marge.
- **Algemene kosten en risico:** percentage over het subtotaal van de verkoopregels.
- **Minimumorder en afronding:** daarna toegepast; afronding standaard op hele euro's.
- **Btw:** over het totaal excl. btw (standaard 21%; 9% alleen bij zelfstandige levering van planten/graszoden, per geval toetsen).
- **Opslag ≠ marge:** opslag is op kostprijs; brutomarge is op verkoopprijs. 25% opslag = 20% brutomarge. De instellingen tonen beide.

## Wat bewust onbekend blijft

- **Werkelijke kostprijs en brutomarge** worden alleen getoond als *iedere* geprijsde regel een echte kostprijs heeft (eigen inkoop, interne arbeidskostprijs, transport). Rust iets op een marktprijs, dan is de marge "onbekend" en staat er hooguit een gelabelde "benaderde kostprijs".
- **Regels zonder prijs** (bijv. palen, onderplaten, zandbed zonder inkoop, boomkap, herstel) worden "op aanvraag"; de offerte heet dan *incompleet* en het klantdocument vermeldt wat nog niet in het bedrag zit.
- **Status van een berekening:** `incompleet` (ontbrekende prijs) → `concept` (voorbeeldnorm, ontbrekende opslag, oude of onzekere bron) → `gereed voor controle`. Niets wordt automatisch definitief of verzonden.

## Signalen

| Signaal | Betekenis | Actie |
| --- | --- | --- |
| Voorbeeldnorm | Productiviteit niet bevestigd | Bevestig of wijzig in Instellingen |
| Geen prijs | Geen inkoop- of marktregel | Inkoopprijs invoeren |
| Btw-basis onbekend | Bron vermeldt btw niet eenduidig | Bij leverancier navragen |
| Verouderde bron / inkoop > 30 dagen | Prijs mogelijk niet actueel | Opnieuw opvragen |
| Minimale afname | Bron heeft minimumhoeveelheid | Meer afnemen of andere bron |
| Margeconflict | Verkoopprijs bij eigen inkoop boven de hoogste marktprijs | Lagere opslag, andere leverancier of meerwaarde onderbouwen |
| Opslag niet ingesteld | 0% gebruikt | Opslag invullen |

## Werkstromen

1. **Nieuwe leverancier:** Leveranciers & inkoop → leverancier toevoegen → per artikel prijs excl. btw, SKU en prijsdatum opslaan.
2. **Prijscontrole:** signalen "ouder dan 30 dagen" en "verouderde bron" volgen; marktbronnen in `data/price-sources.json` krijgen een nieuwe `observedAt`/`reviewAfter` na controle (publiek bestand: alleen openbare prijzen).
3. **Margegoedkeuring:** opslagen en algemene kosten worden alleen door de eigenaar in de kluis ingesteld; een offerte met margeconflict wordt niet verstuurd zonder bewuste keuze.
4. **Offerte:** aanvraagdossier → ontwerplink in Calculatie plakken → regels controleren → handmatige posten na opname → offerteconcept opslaan → printen/PDF → status "verstuurd".
5. **Akkoord → werkbon → factuur:** status "akkoord" → werkbon printen → uren boeken (signaal bij overschrijding) → factuurconcept maken → controleren tegen boekhouding → status "verstuurd"/"betaald".
6. **Verouderde prijs / spoedorder / retour / product uit assortiment:** inkoopregel bijwerken of verwijderen; bestaande offertes houden hun momentopname, een nieuwe berekening gebruikt de actuele regel.

## Nog door de eigenaar in te vullen (in de kluis)

Interne kostprijs per uur, opslag materiaal/machines/afvoer, algemene kosten, risico, transport per werkdag, minimumorder, productiviteitsnormen, inkoopprijzen per artikel, geldigheid offerte, betaaltermijn, IBAN en nummervoorvoegsels.
