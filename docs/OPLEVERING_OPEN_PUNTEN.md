# Oplevering: open punten voor de eigenaar

Deze punten kunnen niet vanuit de code worden bevestigd en staan bewust niet als zekerheid op de website.

1. **Formulierbezorging.** Formulieren gaan via FormSubmit naar het opgegeven mailadres, met een mailto-terugval. Of berichten daadwerkelijk in de mailbox aankomen (en FormSubmit is geactiveerd) is vanuit de ontwikkelomgeving niet te verifiëren. Doe één echte testaanvraag op de live site en controleer de mailbox (ook spam).
2. **Juridische teksten.** Privacyverklaring en algemene voorwaarden zijn herschreven op basis van het werkelijke gedrag van de site (geen eigen database, FormSubmit/mailto). Ze zijn niet juridisch getoetst; laat dit controleren voordat ze als bindend worden gepresenteerd.
3. **Projecten.** Gepubliceerd zijn alleen drie projecten met objectief zichtbare inhoud. Veertien projecten zijn verborgen (zie `tools/projects/hidden.json`, pagina's in `archief/`). Terugzetten kan pas na bevestiging van werkzaamheden en locatie door de eigenaar.
4. **Inspiratiebeelden** (`/inspiratie/`) zijn als impressiebeelden gelabeld, niet als eigen werk. Bevestig herkomst en gebruiksrechten.
5. **Werkgebied** (Dordrecht, Hendrik-Ido-Ambacht, Zwijndrecht, Drechtsteden) en vestigingsgegevens: bevestig dat deze kloppen. Rotterdam en openingstijden zijn verwijderd.
6. **Prijzen.** Er staan nergens bedragen, uurtarieven of marktbenchmarks op de site. Alleen met schriftelijke goedkeuring toevoegen.
7. **Foto's.** Kentekens in de gepubliceerde projectfoto's zijn afgeschermd; controleer bij nieuwe foto's altijd huisnummers, kentekens en personen.
8. **Live verificatie.** De live site kon vanuit de ontwikkelomgeving niet worden opgevraagd. Controleer na publicatie de GitHub Pages-run en bekijk https://sealcleaning.nl zelf.

## Aanvullingen premium-ronde
9. **Impressiebeelden.** De sfeerbeelden in `images/inspiratie/` staan als "Impressie" gelabeld (niet als eigen werk) op de homepage, dienstpagina's en materiaalpagina. Herkomst en gebruiksrechten moeten door de eigenaar worden bevestigd; zo nodig vervangen.
10. **Turkse juridische pagina's.** Privacy en voorwaarden zijn volledig in het Turks vertaald; het Nederlands blijft juridisch leidend. De voorwaarden-vertaling vermeldt dat de tekst nog niet juridisch is getoetst; dat blijft zo tot een juridische controle heeft plaatsgevonden.
11. **WebKit.** In de ontwikkelomgeving is alleen Chromium beschikbaar; Safari/WebKit is niet getest. Controleer de homepage (3D) handmatig op een iPhone.
12. **Homepage-pijplijn.** Draaivolgorde van generatoren: `tools/final/pages.py` → `diensten.py` → `premium.py` → `sweep.py` → `apply-nav.py` → `tools/i18n/build.py` (premium.py moet na pages.py/diensten.py draaien).
