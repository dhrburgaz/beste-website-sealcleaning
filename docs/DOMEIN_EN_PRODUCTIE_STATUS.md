# Domein- en productiestatus (24 oktober 2026)

Vastgesteld (alleen leesrechten; geen wijzigingen aan DNS, hosting of nameservers):
- Domein sealcleaning.nl: nameservers `docks12.rzone.de` / `shades02.rzone.de` (Strato). Staat niet bij Vercel.
- DNS: A-record naar 185.199.108.153 (een GitHub Pages-IP). Vercel markeert het als "misconfigured" voor Vercel; dat is verwacht, de hosting is GitHub Pages. Slechts een van de vier Pages-IP's (…108/109/110/111.153) is bevestigd; een www-CNAME is niet zichtbaar via de beschikbare tool.
- Repo: `CNAME` = sealcleaning.nl in main. Laatste deploy van main (workflow "Deploy to GitHub Pages") 7 okt 2026: geslaagd. Eerdere mislukkingen op 8 sep zijn daarna hersteld.
- Main bevat nog de oude site. De vernieuwde site staat op branch `claude/sealcleaning-website-overhaul-gvgtfj` (PR #3, open, niet gemerged) en is nog niet door de eigenaar visueel goedgekeurd.

NIET vast te stellen vanuit deze omgeving (uitgaand verkeer naar sealcleaning.nl en github.io is geblokkeerd, Pages-API geeft 403):
- of de site nu echt onbereikbaar is en met welke foutmelding,
- Pages-instellingen (custom domain, "Enforce HTTPS", domeinverificatie), SSL-certificaat, www-redirect.

Waarschijnlijke oorzaken om als eerste te controleren door de eigenaar (kost 10 minuten):
1. GitHub > repo > Settings > Pages: staat Source op "GitHub Actions", Custom domain op sealcleaning.nl en "Enforce HTTPS" aan? Een gewijzigd of ontkoppeld custom domain geeft 404 of certificaatfout.
2. Strato DNS: voeg de drie overige A-records toe (185.199.109.153, .110.153, .111.153) en een CNAME `www` naar `dhrburgaz.github.io`.
3. Domein bij Strato niet verlopen/opgeschort (domeinfactuur, e-mail van Strato of SIDN).
4. Als het domein wel werkt maar de oude site toont: dat is main; de nieuwe site wordt pas live na goedkeuring en merge.

## Herstelplan (stappen waar toegang voor nodig is)
| # | Actie | Waar | Door |
|---|---|---|---|
| 1 | Pages-bron "GitHub Actions", custom domain sealcleaning.nl, Enforce HTTPS | GitHub > Settings > Pages | eigenaar |
| 2 | Extra A-records .109/.110/.111.153 + CNAME www -> dhrburgaz.github.io | Strato DNS | eigenaar |
| 3 | Domeinstatus/verlenging controleren | Strato / SIDN | eigenaar |
| 4 | PR #3 goedkeuren en mergen -> workflow deployt automatisch | GitHub | eigenaar (expliciete goedkeuring) |
| 5 | Na deploy: controleer https://sealcleaning.nl, https://www.sealcleaning.nl, /schuttingen/, /contact/ | browser | eigenaar of nieuwe sessie met internettoegang |

## Taal
Er is geen meertalige architectuur (geen i18n-laag, geen hreflang). Een Turkse versie vraagt om vertaalde pagina's per route en een taalkeuze; dit is niet "binnen de bestaande architectuur" en is niet gebouwd. Advies: eerst Turkse versie van home, contact en offerteflow door een moedertaalspreker laten vertalen.

## Aanvullingen 24 oktober 2026
- **Echte projectfoto's:** alle branches (`main`, `claude/website-deployment-check-sue9m8`, `review/v13-pilot-kwaliteit-20261011`) doorzocht. Er zijn geen foto's van de ~11,5 m composiet schutting in Hendrik-Ido-Ambacht (met verwijderen oude schutting/wortels, twee tuinen). Er is daarom bewust géén projectpagina voor gemaakt. Aanleveren: de foto's (voor/tijdens/na) + bevestiging van de gegevens; dan voeg ik de pagina toe.
- **Offerte-/contactformulier:** `js/config.js` heeft `apiBase: ""`; zonder backend op de productiehost valt het formulier terug op `mailto:`. Echt verzenden zonder mailprogramma vraagt een gehoste backend of formulierdienst (extern, eigenaar-keuze, mogelijk betaald) — niet toegevoegd zonder toestemming. Lokaal getest: server-keten en fallback (zie `tests/e2e/server-keten.mjs`, `beginner.mjs` netwerkfout-test).
- **Strato DNS (alleen eigenaar):** zie bovenstaand plan; MX/TXT-records van e-mail niet wijzigen.
