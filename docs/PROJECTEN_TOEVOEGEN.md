# Nieuwe projecten toevoegen

Lever foto's aan (liefst origineel, met een korte notitie welke bij elkaar horen en voor/tijdens/na). Daarna:

1. Foto's bekijken, werkzaamheden alleen noteren wat zichtbaar is of uit jouw informatie blijkt.
2. Manifest maken in `tools/projects/<slug>.json` (titel, categorie, diensten, plaats alleen als bekend, intro, werkzaamheden, resultaat, SEO-titel/-beschrijving, foto's met alt-tekst, kentekens/privégegevens in `blur`, optioneel `pairs` voor een voor/na-slider).
3. `python3 -I tools/add-project.py tools/projects/<slug>.json <map-met-originele-foto's>`
   Maakt WebP/JPG in vijf formaten, projectpagina met lightbox, tegel + filter op `/projecten/`, `data/projects.js`, sitemap.
4. `python3 tools/i18n/extract.py`, Turkse vertaling aanvullen in `tools/i18n/tr_*.py`, daarna `python3 tools/i18n/js-dict.py && python3 tools/i18n/build.py && node tools/build-search-index.mjs`.
5. `node tests/e2e/projecten.mjs` en de rest van de testen; daarna commit en publiceren.

Privacy: kentekens, naambordjes en huisnummers altijd afschermen (`blur: [[x, y, breedte, hoogte]]` in pixels van het origineel). Geen klantnamen of adressen in teksten.
