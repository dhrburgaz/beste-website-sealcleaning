# MATERIAL_POLICY: SEAL verkoopt materiaal, los of met montage

Status: **beleid besloten door de eigenaar (v12, 11 oktober 2026).** Dit vervangt het eerdere uitgangspunt "de klant bestelt het materiaal zelf". Online bestellen en betalen blijven **uit** tot de voorwaarden hieronder zijn afgerond.

## Besluit

SEAL koopt tuinmaterialen in bij leveranciers en verkoopt ze met eigen marge, op twee manieren:

1. **Alleen materiaal** (los).
2. **Materiaal met montage** (één offerte, materiaal en arbeid gescheiden zichtbaar).

Daarnaast blijft bestaan: **alleen montage van eigen materiaal** van de klant (voorwaarden art. 12).

## Wat de site nu doet

- Alle teksten gaan uit van de offerteroute: materiaal kan in de offerte worden opgenomen, prijs en levering bevestigen wij daarin.
- Geen levertijd, voorraad, vaste prijs of garantie wordt beloofd. Marktprijzen blijven referenties met bron en peildatum.
- De webwinkelcode (prijs- en kortingsmotor, mandje, bestelling, Mollie-adapter) bestaat, is getest en blijft uit (`checkout_enabled`, `payments_enabled`, `coupon_enabled` = `false`).
- Inkoopprijzen en marge staan alleen in het beheer, nooit in publieke bestanden of de browser.

## Poorten vóór `checkout_enabled` en `payments_enabled`

Leveranciersafspraken en inkoopprijzen met datum · beeldrechten per product · btw per product en dienst · bezorg- en afhaalregels met vastgestelde kosten · retour-, klacht- en herroepingsproces · getoetste voorwaarden en privacyverklaring · Mollie-account met geteste webhook · hosting en e-mail · boekhoudafspraken. Zie `docs/COMMERCE_RULES.md`.

## Marge en kostprijs

Marge wordt berekend op de totale kostprijs (inkoop, transport, handling, uitval, opslag), niet als standaardopslag op de leveranciersprijs. Het arbeidstarief is €60 per uur per medewerker excl. btw (€72,60 incl.) zolang de eigenaar dit bevestigt. Geen marges of inkoopprijzen worden verzonnen: onbekend blijft onbekend.
