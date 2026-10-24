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
