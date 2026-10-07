# Bronregister

Bronnen S01–S35 uit `docs/SEAL_BUILD_BRIEF.md` hoofdstuk 30 zijn het register voor
concurrentieonderzoek en prijsreferenties. Dit bestand volgt alleen de
implementatiestatus, conflicten en niet-gevonden gegevens die tijdens de bouw
naar voren komen. Het dupliceert het bronnenregister niet.

## Structured pricing data

Alle geïmporteerde referentieprijzen staan in `data/price-sources.json`, elk met
`sourceUrl`, `observedAt`, `status` en `reviewAfter`. Zie dat bestand voor de
machineleesbare vorm; dit document is voor afwijkingen en openstaande vragen.

## Conflicten

- **S28 (afval.nl schone grond, 6 m³):** bron vermeldt een afwijkende vanafprijs
  op een andere pagina/snippet dan de gebruikte overzichtspagina. De
  overzichtspagina-waarde (€475 incl. btw) is gebruikt; her-verifiëren bij
  eerste echt gebruik in een offerte.
- **S12 (HomingXL montagecijfers):** gepubliceerde peildatum oktober 2025, dus
  ouder dan de overige S15–S19-bronnen (oktober 2026). In `data/price-sources.json`
  bewust op `status: "stale"` gezet zodat de prijsengine (zodra gebouwd) deze
  nooit automatisch als actuele Sealcleaning-arbeidsregel gebruikt.

## Niet gevonden / nog te onderzoeken

Zie `data/price-sources.json` → `unresolved[]`: beplanting, zand per levering,
voegmateriaal, vlonders/pergola's, tuinverlichting, complexe boomzorg. Geen
verkoopprijs vastgesteld; blijft `null`/onbekend totdat een echte bron is
gecontroleerd.

## Sealcleaning-site auditbevindingen (ch.32, uitgevoerd 2026-10-07 door de
opsteller van het masterprompt-dossier, vóór deze implementatiesessie)

Alle vier geconstateerde punten zijn in deze sessie gecontroleerd tegen de
repository en bevestigd als reëel (niet alleen bestandsnaam-gebaseerd):

1. **Diensten-link → `/projecten/`:** bevestigd in `index.html` en alle 16
   subpagina's (nav + breadcrumb). Hersteld: wijst nu naar `#diensten` /
   `../#diensten`.
2. **`schutting-horizontaal-lamellen-zon-1.jpg` toont een sterk gesnoeide
   boom/heester, geen schutting:** visueel bevestigd (zie afbeelding in
   sessielog). Bestand hernoemd naar
   `snoeiwerk-heester-fors-teruggesnoeid.{jpg,webp}`, categorie/titel/alt
   overal gecorrigeerd. `schutting-horizontaal-lamellen-zon-2.jpg` is wél een
   echte lamellenschutting-foto en vervangt de mislabelde foto op de
   schuttingen-servicepagina.
3. **Homepage-sectie "Periodiek tuinonderhoud" toont een schuttingfoto terwijl
   alttekst een voortuin met grindpad/bankje beschrijft:** NIET bevestigd bij
   controle in deze sessie — de huidige `index.html` gebruikt daar
   `voortuin-grindpad-bankje.jpg` met bijpassende alt-tekst. Mogelijk al
   gecorrigeerd door eerder werk op `main`, of de auditeur zag een eerdere
   cache. Geen actie nodig; vermeld hier zodat een volgende sessie het niet
   opnieuw hoeft te onderzoeken.
4. **WhatsApp-nummer als zichtbare tekst:** bevestigd in footer (alle
   pagina's) en op de contactpagina. Hersteld: alle `data-whatsapp-text`
   voorkomens tonen nu een label ("WhatsApp" / "Stuur een bericht") in plaats
   van het nummer.

Publiek belnummer bijgewerkt naar het door de opdrachtgever bevestigde
+31 78 204 95 17 (operationeel bevestigd door de eigenaar op 2026-10-07).
