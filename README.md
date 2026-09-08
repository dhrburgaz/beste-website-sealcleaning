# Sealcleaning — website

Deze site is gebouwd met alleen HTML, CSS en JavaScript (geen framework, geen buildstap), zodat hij direct op GitHub Pages werkt en eenvoudig te onderhouden is.

## Contactgegevens, openingstijden en prijzen aanpassen

Bijna alle bedrijfsgegevens staan op **één plek**: `js/config.js`. Pas daar telefoonnummer, WhatsApp-nummer, e-mail, adres, KvK, BTW-nummer of openingstijden aan — dit werkt automatisch door op elke pagina (header, footer, sticky balk onderin).

```js
phoneDisplay: "06 15 71 09 65",
phoneHref: "tel:+31615710965",
whatsappNumber: "31648871986",
...
```

Let op: het **telefoonnummer** is uitsluitend voor bellen (`tel:`-link), het **WhatsApp-nummer** is uitsluitend voor WhatsApp-berichten. Dit zijn bewust twee verschillende nummers.

## Logo en foto's

Het logo en 47 echte projectfoto's staan inmiddels verwerkt in de site, in `images/branding/` en `images/projects/`. Van elke foto is EXIF-data (waaronder eventuele GPS-locatie van een klantwoning) verwijderd, en er is een WebP-versie naast elke JPEG gezet voor snellere laadtijden. Niet elke aangeleverde foto is gebruikt: een aantal foto's van interieurwerk (badkamer, TV-wandmontage, vloerinstallatie) zijn bewust weggelaten omdat dit geen hoveniersproject is en het de positionering van Sealcleaning als groenbedrijf zou vertroebelen.

**Belangrijk over het logo:** het huidige logo toont de tekst "SEAL — Tuin en Onderhoud" (de KvK-naam), terwijl de site "Sealcleaning Groenonderhoud en Aanleg" als publieke handelsnaam gebruikt — dit is bevestigd als bewuste keuze (KvK-naam vs. lakam/handelsnaam). Het logo wordt klein getoond in de header naast de bedrijfsnaam in tekst; op dat formaat is de logotekst niet leesbaar, dus de tekst ernaast blijft de primaire naamsdrager.

Nieuwe foto's toevoegen:

1. Upload nieuwe projectfoto's naar `images/projects/`, met een duidelijke bestandsnaam (bijv. `tuinaanleg-dordrecht-achtertuin-2.jpg`), niet `IMG_1234.jpg`.
2. Laat het weten (of vraag een vervolgsessie met Claude Code) om ze te verwerken in de projectenpagina of een dienstpagina, inclusief een eerlijke alt-tekst.
3. Wil je een scherpere, transparante versie van het logo (bijvoorbeeld alleen het figuurtje, zonder cream achtergrond) laten maken? Lever dan een vectorbestand (.ai/.svg) of hoge-resolutie PNG met transparantie aan — dat geeft een beter resultaat dan verder bewerken van de huidige JPEG.

## Nieuwe projecten toevoegen

Gebruik dit sjabloon om een nieuw project vast te leggen (handig voordat je het aan Claude of jezelf doorgeeft om op de site te zetten):

```
PROJECTNAAM:
PLAATS:
DIENST (tuinonderhoud/tuinaanleg/renovatie/bestrating/schutting/snoeiwerk):
KLANTVRAAG:
BEGINSITUATIE:
WAT IS UITGEVOERD:
DUUR:
MATERIALEN:
VOORFOTO'S: (bestandsnamen)
NAFOTO'S: (bestandsnamen)
BIJZONDERHEDEN:
```

Projecten staan op `/projecten/index.html` en worden gefilterd op categorie via `data-category` op elke tegel.

## Formulier op de contactpagina

GitHub Pages heeft geen eigen server, dus het contactformulier op `/contact/` kan gegevens nog niet automatisch versturen of opslaan. Het formulier valideert wel netjes en biedt na het invullen een knop om de aanvraag alsnog per e-mail te versturen. Zodra je een formulierdienst koppelt (bijvoorbeeld Formspree, Netlify Forms bij een andere host, of een eigen backend), kan dit in `js/main.js` (functie rond `data-contact-form`) aangepast worden zodat het formulier écht verstuurt.

## Domeinmigratie naar sealcleaning.nl

De site verwijst in metadata (canonical-URLs, Open Graph, sitemap.xml, structured data) al naar `https://sealcleaning.nl/`. Zodra het domein gekoppeld is aan GitHub Pages:

1. Voeg een `CNAME`-bestand toe met daarin exact `sealcleaning.nl`.
2. Controleer de DNS-instructies van GitHub Pages voor het koppelen van een eigen domein.
3. Wacht tot SSL actief is (GitHub regelt dit automatisch na koppeling).
4. Meld het domein aan bij Google Search Console en dien `sitemap.xml` in.

Tot die tijd blijft de site gewoon bereikbaar via de huidige GitHub Pages-URL, zonder dat er iets breekt.

## Structuur

```
/                     → homepage
/tuinonderhoud/       → dienstpagina
/tuinaanleg/          → dienstpagina
/tuinrenovatie/       → dienstpagina
/bestrating/          → dienstpagina
/schuttingen/         → dienstpagina
/snoeiwerk/           → dienstpagina
/periodiek-tuinonderhoud/ → dienstpagina
/projecten/           → projectenoverzicht met filters
/werkwijze/           → klantproces + materiaalproces
/over-ons/            → verhaal en team
/werkgebied/          → Dordrecht, Drechtsteden, Rotterdam e.o.
/contact/             → offerteformulier + FAQ
/privacy/             → privacyverklaring (concept)
/voorwaarden/         → algemene voorwaarden (concept)
/kennisbank/          → placeholder voor toekomstige artikelen
/404.html             → aangepaste foutpagina
css/style.css         → volledig design system (kleuren, typografie, componenten)
js/config.js          → centrale bedrijfsgegevens
js/main.js            → menu, formulieren, filters, animaties
sitemap.xml, robots.txt → SEO-bestanden
```

## Juridische disclaimer

De teksten op `/privacy/` en `/voorwaarden/` zijn concepten, geschreven als praktische basis — geen juridisch dichtgetimmerde documenten. Laat deze vóór definitieve publicatie beoordelen door een jurist of brancheorganisatie.

## Groeiroadmap (kort)

**Fase 1 — livegang:** domein koppelen, SSL controleren, Google Search Console + sitemap indienen, Google Bedrijfsprofiel inrichten.

**Fase 2 — bewijs opbouwen:** echte reviews verzamelen, projectcases met foto's toevoegen, Instagram/Facebook koppelen zodra actief.

**Fase 3 — vindbaarheid:** lokale SEO verstevigen, kennisbank vullen met praktijkartikelen, lokale vermeldingen en samenwerkingen.

**Fase 4 — optioneel, later:** Google Ads / Meta Ads, analytics en conversietracking (privacybewust), CRM-koppeling.

SEO-resultaten kosten tijd en zijn nooit gegarandeerd — dit traject is een kwestie van maanden, niet weken.
