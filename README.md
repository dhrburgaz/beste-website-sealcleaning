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

## Logo en foto's toevoegen

De site bevat op dit moment **geen echte foto's of logo-bestand** — alleen nette placeholder-illustraties (lijntekeningen) totdat de echte bestanden zijn geüpload. Reden: foto's die in een chatgesprek met Claude worden gedeeld, kunnen niet automatisch als bestand op de site worden gezet. Zo voeg je ze toe:

1. Upload het logo (bij voorkeur als `.svg` of `.png` met transparante achtergrond) naar de map `images/branding/`, bijvoorbeeld als `logo.png`.
2. Upload projectfoto's naar `images/projects/`, met een duidelijke bestandsnaam (bijv. `tuinaanleg-dordrecht-achtertuin-1.jpg`), niet `IMG_1234.jpg`.
3. Laat het weten (of vraag een vervolgsessie met Claude Code) om:
   - het logo in de header en favicon te verwerken;
   - de placeholder-illustraties in hero, diensten en projectenpagina te vervangen door de echte foto's;
   - alt-teksten toe te voegen die de foto's kort en eerlijk omschrijven.

**Belangrijk over het huidige logo-ontwerp:** het aangeleverde logo-concept toont de tekst "SEAL — Tuin en Onderhoud". De officiële bedrijfsnaam op deze site is "Sealcleaning Groenonderhoud en Aanleg". Stem dit af vóórdat het logo definitief wordt verwerkt, zodat naam op het logo en op de site consistent zijn.

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
