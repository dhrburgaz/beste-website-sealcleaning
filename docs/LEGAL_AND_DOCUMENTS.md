# Juridische teksten en documenten

Status: **concept — juridische toets vereist vóór bindend gebruik** (REQUIREMENTS_INDEX N01–N04).

## Publieke teksten

| Pagina | Inhoud | Status |
| --- | --- | --- |
| `/voorwaarden/` | 24 artikelen (partijen, offerte, prijs/btw incl. € 60/€ 72,60, inmeting, ontwerp, erfgrens, vergunning, graven/KLIC, materiaal, planning, meer-/minderwerk, oplevering, garantie, factuur, herroeping, aansprakelijkheid, privacy/geschillen) | wacht op juridische toets |
| `/privacy/` | Verwerkingstabel (8 categorieën, doel, grondslag, bewaartermijn), bijlagen, delen, rechten, AP-klacht, cookies, projectfoto's | wacht op juridische toets |
| Configurator-teksten | Erfgrens (geen grensbepaling/vergunning), kabels/leidingen (vervangt geen onderzoek; art. 10), geen levensduur-/onkruidvrij-belofte, kleur = visuele indicatie | gebouwd |

Bedrijfsgegevens (`js/config.js`): naam, adres, KvK 83078665, btw NL003773849B79. Verificatie tegen het Handelsregister door de eigenaar nog vereist.

## Documenten uit de beheeromgeving (`/beheer/`)

| Document | Inhoud | Nooit op het document |
| --- | --- | --- |
| Offerte | Bedrijfsgegevens + logo, klant, project, regels met eindprijzen (opslagen naar rato verwerkt), totaal excl./btw/incl., wat nog op aanvraag is, uitgangspunten, geldigheid, verwijzing naar voorwaarden, akkoordregel | inkoopprijzen, leveranciers, SKU's, opslag-%, kostprijs, marge, voorbeeldnormen |
| Werkbon | Werkzaamheden met geplande uren, materiaal en hoeveelheden, situatie (toegang, kabels, te beschermen beplanting), afmeldregels | prijzen |
| Factuurconcept | Na akkoord; nummer per jaar doorlopend, datum, regels, btw, betaaltermijn en IBAN uit instellingen | inkoop, marge |

Alle documenten tonen **CONCEPT** zolang de berekening niet "gereed voor controle" is of de status "concept" is. Er wordt niets automatisch verzonden; printen of "Opslaan als PDF" gebeurt bewust door een medewerker.

### Nog niet ingevuld (bewust, geen aannames)

- Geldigheidsduur offerte, betaaltermijn, IBAN, aanbetalingsregels — instellingen in de kluis; zolang leeg staat er een zichtbare plaatshouder op het document.
- Factuurnummering: per apparaat doorlopend. Gebruik één apparaat voor facturen en controleer tegen de boekhouding (fiscaal vereiste: doorlopende reeks).
- Garantievoorwaarden (M05), betaalprovider, digitale akkoordregistratie, klantportaal: vereisen externe keuzes of backend.

## Privacy en beveiliging beheer

- Kluis: PBKDF2-SHA256 (310.000 iteraties) → AES-GCM-256, alleen in de browser van het eigen apparaat; back-up is even sterk versleuteld.
- Strikte Content-Security-Policy, `noindex`, `robots.txt`-disallow. Geen externe scripts of lettertypen.
- Klant verwijderen in de kluis (AVG). Bewaarplicht voor facturen geldt in de boekhouding.
- Risico's: wachtwoordverlies = gegevensverlies (back-up maken); de kluis is per apparaat, geen synchronisatie of gelijktijdig gebruik.
