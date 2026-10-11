# SEAL-backend — architectuur, hosting en beheer

De backend handelt de bedrijfsvoering af: aanvragen, klanten, projecten, calculatie, offertes, digitaal akkoord, facturen, betalingen, planning, berichten en het klantportaal. De publieke website blijft statisch op GitHub Pages. Die stuurt formulieren alleen naar de backend als `apiBase` in `js/config.js` is ingevuld. Bij een leeg `apiBase` gebruiken de formulieren het mailprogramma van de bezoeker, net als nu.

## Gekozen opzet

- **Runtime:** Node 22 LTS met ingebouwde SQLite (`node:sqlite`). Er zijn geen npm-afhankelijkheden, dus geen supply-chain-risico van externe pakketten.
- **Data:** één SQLite-bestand plus een bestandenmap (uploads) in `SEAL_DATA_DIR`.
- **Omgevingen:**
  - `/admin/` is het beheer voor medewerkers.
  - `/portaal/` is het klantportaal.
  - `/api/public/*` ontvangt de websiteformulieren. CORS is alleen open voor `SITE_ORIGINS`.

### Beveiliging

| Onderdeel | Maatregel |
|---|---|
| Wachtwoorden | scrypt, minimaal 12 tekens |
| Medewerkers | Tweestapsverificatie (TOTP) is verplicht |
| Sessies | Alleen de hash van het token wordt opgeslagen. De cookie is `__Host-`, HttpOnly, SameSite=Strict, met een idle- én een absolute verlooptijd |
| CSRF | Verplichte header plus Origin-controle |
| Overige weerbaarheid | Rate limiting, CSP `default-src 'self'`, HSTS, uploads gecontroleerd op inhoud (jpg/png/webp/heic/pdf, max. 8 MB) |
| Klantportaal | Eenmalige inloglinks, zonder wachtwoord |
| Offertes | Een klant ziet nooit kostprijzen, opslagen of marges. Die staan alleen in `internal_json` |
| Digitaal akkoord | Vastgelegd: naam, moment, hash van de exacte offerte-inhoud, voorwaardenversie, toestemmingen en IP-hash |
| Facturen | Nummer pas bij uitgifte, doorlopend en zonder gaten (`F{jaar}{volgnr}`). Een uitgegeven factuur is onwijzigbaar; correcties gaan via een creditnota |
| Auditlog | Alle mutaties |
| Back-ups | `VACUUM INTO`, daarna versleuteld met AES-256-GCM. Herstel via de CLI |

## Hostingvergelijking

| Optie | Veiligheid | Onderhoud | Kosten | Eenvoud | Past bij deze code |
|---|---|---|---|---|---|
| **Eén VPS in de EU + Docker + Caddy** (bijv. Hetzner, TransIP, Scaleway) | Goed: eigen afgeschermde machine, data in de EU, automatische HTTPS | OS-updates zelf (automatische security-updates aanzetten) | Laag, vast maandbedrag (kleinste VPS volstaat). Actuele prijs bij de aanbieder controleren | Gemiddeld: eenmalig inrichten, daarna `docker compose up -d` | **Ja, direct** |
| Beheerd containerplatform (Fly.io, Render, Railway) | Goed | Weinig OS-onderhoud | Laag tot gemiddeld; een persistente schijf kost extra | Eenvoudig | Ja, met een persistent volume voor SQLite. Let op de dataregio (EU kiezen) |
| Serverless (Cloudflare Workers + D1/R2) | Goed | Weinig | Laag | Hoog leerwerk | Nee: vraagt een herschrijving van opslag en uploads |
| Backend-as-a-service (Supabase, Firebase) | Goed, mits de beveiligingsregels correct zijn | Weinig | Gratis laag, daarna betaald | Ander model (row-level security) | Nee: vraagt een herschrijving en bindt aan de leverancier |

**Advies:** één kleine VPS in een Nederlands of EU-datacenter met de meegeleverde `deploy/docker-compose.yml` (app + Caddy) op het subdomein `api.sealcleaning.nl`.

- Laagste structurele kosten, volledige controle, data in de EU en geen lock-in.
- De website blijft op GitHub Pages en verandert pas als u `apiBase` invult.
- Hiervoor zijn **uw akkoord en een account** nodig (zie de beslislijst in de PR). Er is niets aangeschaft of aangemaakt.

## Installatie (VPS met Docker)

1. **DNS:** maak een A-record `api.sealcleaning.nl` naar het IP van de VPS. Dit gebeurt alleen na uw akkoord.
2. **Configuratie:** `cp server/.env.example deploy/.env` en vul het bestand in. Sleutels maakt u met `node server/cli.js gen-key`.
3. **Starten:** `docker compose -f deploy/docker-compose.yml up -d --build`
4. **Eigenaar aanmaken:**
   `docker compose -f deploy/docker-compose.yml exec app node server/cli.js create-owner <email> "<naam>"`
   Het eenmalige wachtwoord verschijnt in de terminal.
5. **Eerste inlog:** log in op `https://api.sealcleaning.nl/admin/` en stel tweestapsverificatie in met een authenticator-app.
6. **Documentgegevens:** vul in het beheer onder **Instellingen** de betaaltermijn, de geldigheid van offertes en het IBAN in. Zonder die gegevens weigert het systeem facturen uit te geven.
7. **Website koppelen:** zet in `js/config.js` `apiBase: "https://api.sealcleaning.nl"`. Dit is een productiewijziging en gebeurt alleen na uw akkoord.

Zonder Docker kan het ook met `deploy/sealcleaning.service` (systemd) en Node 22 LTS achter Caddy of nginx.

In productie (`NODE_ENV=production`) weigert de server te starten zonder:

- veilige cookies;
- verplichte tweestapsverificatie;
- een `IP_HASH_SECRET` van minimaal 32 tekens;
- een https-adres.

## Status van koppelingen

Het beheer toont onder Overzicht en Instellingen per onderdeel of het operationeel is.

| Onderdeel | Zonder account | Nodig om operationeel te worden |
|---|---|---|
| E-mail | Mails komen in de wachtrij (beheer → E-mail). Daar kunt u ze lezen en als "zelf verstuurd" markeren. Portaallinks kunt u ook kopiëren en zelf sturen | SMTP-account (bijv. van de domeinhost of een maildienst). Daarna `SMTP_*` invullen |
| Online betalen | Uitgeschakeld. De klant ziet de bankgegevens voor een overschrijving en de medewerker registreert de betaling | Mollie-account met KYC. Daarna `MOLLIE_API_KEY`. De webhook staat klaar en controleert elke betaling opnieuw bij Mollie |
| Agenda | **Werkt.** Een geheime ICS-URL (beheer → Instellingen) voor Google Agenda, Apple Agenda of Outlook. Klanten krijgen hun eigen .ics in het portaal | Geen. Tweerichtingssynchronisatie (agenda → systeem) is niet gebouwd, omdat daarvoor een account per agenda-aanbieder nodig is |
| Back-ups | Versleutelde lokale back-ups op dezelfde server (niet voldoende als enige kopie) | Externe opslag in de EU (bijv. S3-compatibel of een tweede server). `SEAL_BACKUP_DIR` wijst naar een gekoppelde map, of er draait een sync-taak naar externe opslag |

## Beheer en onderhoud

| Taak | Hoe |
|---|---|
| Back-up maken | Automatisch elke `BACKUP_INTERVAL_HOURS`. Handmatig via beheer → Instellingen of `node server/cli.js backup` |
| Hersteltest (elk kwartaal) | `node server/cli.js restore <back-upmap> /tmp/herstel`. Start daarna een tweede instantie met `SEAL_DATA_DIR=/tmp/herstel` en controleer facturen en bestanden |
| Bewaartermijnen | Beheer → Instellingen. Standaard staan ze uit tot u termijnen vaststelt. Facturen vallen onder de fiscale bewaarplicht van 7 jaar: een klant met uitgegeven facturen kan daarom niet worden verwijderd |
| 2FA kwijt | `node server/cli.js reset-totp <email>`, uit te voeren door de eigenaar op de server |
| Updates | `git pull` en daarna `docker compose ... up -d --build`. Databasemigraties lopen automatisch |
| Tests | `npm test` (unit en integratie) en `npm run e2e`, met de variabelen `PLAYWRIGHT` en `CHROMIUM` |
