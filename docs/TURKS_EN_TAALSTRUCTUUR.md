# Nederlands / Turks — structuur en review

## Hoe het werkt
- Nederlandse pagina's blijven de bron. Turkse pagina's staan onder `/tr/…` (zelfde pad, aparte indexeerbare URL) en worden gegenereerd door `python3 tools/i18n/build.py` uit `tools/i18n/tr.json`.
- Elke pagina heeft `hreflang` nl / tr / x-default, een eigen canonical, lokale title/description en staat met beide talen in `sitemap.xml`.
- De taalschakelaar (`NL / TR`, in de header) linkt naar dezelfde pagina in de andere taal.
- Tekst die door JavaScript wordt getekend (3D-ontwerper, catalogus, winkelmandje-melding, formulierfouten) wordt op `/tr/`-pagina's vertaald door `js/i18n-tr.js` (gegenereerd door `tools/i18n/js-dict.py` uit `js_00*.py` + `js_extra.py`). Onvertaalde tekst blijft veilig Nederlands.
- Nieuwe Nederlandse tekst: `python3 tools/i18n/extract.py` en `js-extract.py` voegen nieuwe strings toe (append-only); vul de vertaling aan in `tr_*.py` / `js_*.py` en draai build + js-dict opnieuw.
- Test: `node tests/e2e/taal.mjs` (lang, hreflang, canonical, schakelaar, links, console, Nederlandse restwoorden).

## Moet door een Turkse moedertaalspreker worden nagelezen
Alle Turkse tekst is door mij geschreven en **niet** door een moedertaalspreker gecontroleerd. Controleer vooral:
- commerciële formuleringen (offerte, "keşif", "montaj", prijsindicaties) en de aanspreekvorm (nu "siz");
- technische tuinbouwtermen (kompozit, taban plakası, derz, kök örtüsü);
- `tr/privacy/` en `tr/voorwaarden/`: bewust alleen een Turkse kennisgeving; de Nederlandse tekst is juridisch bindend. Een volledige Turkse juridische vertaling hoort bij een jurist.
- Productnamen van leveranciers (EXCLUTON, FLAIRSTONE, Gardenplace, Elephant Finch) zijn niet vertaald.
