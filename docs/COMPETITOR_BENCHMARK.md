# COMPETITOR_BENCHMARK: representatieve benchmark (V7-03)

## Status: live-audit **niet uitgevoerd**

Datum van de poging: 10 oktober 2026. Getest via drie routes:

- een echte browser (Playwright/Chromium);
- een HTTP-ophaaldienst;
- `curl`.

Alle routes zijn **geweigerd door de netwerkpolicy van de ontwikkelomgeving**. Fouten: `ERR_TUNNEL_CONNECTION_FAILED`, `ENOTFOUND` en proxy-403. Dat gold onder meer voor `debiesboschgijsbersgroep.nl`, `degroothoveniers.nl`, `dimhovenier.nl`, `bos-hoveniers.nl`, `verdahoveniers.nl`, `siebersgroep.nl`, `burobuiten.nl`, `baymard.com` en `acm.nl`.

Daarom bevat dit document **geen** scores, screenshots of beweringen over deze sites. Het dossier schrijft dat expliciet voor: "zonder webtoegang: markeer audit als niet uitgevoerd, vul geen verzonnen score in".

**Opheffen:** zet in de cloudomgeving de netwerktoegang ruimer, of voeg de onderstaande domeinen toe als *Allowed domains*. Zie https://code.claude.com/docs/en/cloud-environments#network-access. De audit is daarna in één ronde uit te voeren met `tools/screens.mjs` en de matrix hieronder.

## Wel uitgevoerd

- **Zoekmachineonderzoek (alleen zoekresultaten, geen pagina-inspectie) naar de ACM-regels voor van/voor-prijzen.** De 'van'-prijs moet de laagste eigen prijs uit de 30 dagen vóór de korting zijn. Er gelden uitzonderingen voor:
  - zeer beperkt houdbare producten;
  - producten die korter dan 30 dagen op de markt zijn;
  - progressieve kortingen.

  Bronnen in de zoekresultaten: acm.nl ("ACM wil einde aan nepkortingen na komst strengere regels"), ACM-boetebesluiten Leen Bakker en Jysk, en CMS ("Nieuwe ACM-leidraad: let op prijsinformatie"). Verwerkt in `docs/COMMERCE_RULES.md` en in de kortingsmotor: zonder 30-dagenhistorie geen doorgestreepte prijs.
- **Eigen designaudit met echte browserscreenshots:** zie `docs/DESIGN_AUDIT.md`.

## Te onderzoeken bronnen

### Nederlandse branche (12)

| # | URL | Type |
|---|---|---|
| 1 | https://debiesboschgijsbersgroep.nl/tuinontwerp/voorbeelden/ | hovenier, ontwerpvoorbeelden |
| 2 | https://www.degroothoveniers.nl/3d-ontwerpen/ | hovenier, 3D |
| 3 | https://www.dimhovenier.nl/tuinontwerp/3d-tuinontwerp | hovenier, 3D |
| 4 | https://bos-hoveniers.nl/projecten/voorbeelden-3d-tuinontwerp/ | hovenier, 3D-voorbeelden |
| 5 | https://www.verdahoveniers.nl/ontwerp-aanleg-renovatie-onderhoud.html | hovenier, dienstenstructuur |
| 6 | https://www.siebersgroep.nl/luxe-tuin/ | premium segment |
| 7 | https://burobuiten.nl/ | tuinarchitectuur |
| 8 | https://www.martinveltkamp.nl/ | tuinarchitectuur |
| 9 | https://www.tuinarchitect-rotterdam.nl/portfolio.html | regionaal, portfolio |
| 10 | https://gernellhoveniers.nl/portfolio | hovenier, portfolio |
| 11 | https://gratis-tuinontwerp.nl/ | ontwerpdienst |
| 12 | https://maiapro.nl/ | 3D-/ontwerpsoftware |

### Aangrenzende categorieën (6)

Te kiezen bij uitvoering, één concrete pagina per categorie:

- retailfilters en checkout (bol);
- ruimte- en materiaalvoorstelling (IKEA);
- productpresentatie en typografie (Apple);
- vertrouwen en beeld (Airbnb);
- beeldregie in een architectuurportfolio;
- een B2B-dienstverlener.

## Matrix (per bron in te vullen; leeg = niet onderzocht)

| Veld | Toelichting |
|---|---|
| Datum, URL, doelgroep | |
| Eerste indruk / eerste mobiele scherm | screenshot 390 px + 1440 px (`tools/screens.mjs`, `PAGES=` volledige URL) |
| Navigatie, bewijs, contentdiepte | |
| Beeldkwaliteit, contactdrempel, prijsduidelijkheid | |
| Configuratie, filters, productinformatie | |
| Checkoutfrictie, foutafhandeling | |
| Toegankelijkheid, performance | axe + Lighthouse lab |
| Uniek / negatieve verrassingen | |
| Advies per patroon | overnemen als principe / verbeteren / vermijden / niet toepasbaar, met reden |

## Gehanteerde principes zonder benchmarkclaim

Zolang de live-audit ontbreekt, volgen de ontwerpkeuzes de dossierregels (V7-01 t/m V7-12) en de eigen schermaudit. Er staat nergens dat SEAL "beter dan concurrent X" is.
