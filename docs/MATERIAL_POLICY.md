# MATERIAL_POLICY: twee routes voor materiaal, bewust gescheiden

Status: **beleidsspanning vastgelegd, keuze ligt bij de eigenaar.** Niets in dit document wijzigt de live site.

## De spanning

| | Route 1: nu uitvoerbaar | Route 2: toekomstige verkoop door SEAL |
|---|---|---|
| Wat de site vandaag zegt | Wij adviseren en monteren. De klant bestelt het materiaal zelf na advies (`/werkwijze/`, dienstpagina's). | Niet gepubliceerd. |
| Opties voor de klant | Montage met materiaal van de klant; advies over wat te bestellen | Alleen materiaal, alleen montage, of compleet |
| Wie levert | Klant bij zijn eigen winkel of leverancier | SEAL koopt in en verkoopt door met marge |
| Wat er al gebouwd is | Adviescatalogus `/materialen/` met marktreferenties (bron + peildatum), hoeveelheidsrekenaar, aanpakkeuze | Prijs- en kortingsmotor, mandje, bestelling, Mollie-adapter: alles gebouwd, getest, **uit** (`docs/COMMERCE_RULES.md`) |
| Wat ontbreekt | niets blokkerends | leverancier, inkoopvoorwaarden, leverkosten en -tijd, voorraadregels, retourproces, btw-/factuurafspraken, juridisch getoetste voorwaarden, Mollie-account |

## Regels zolang route 2 niet is ingericht

1. Geen tekst of knop belooft levering, voorraad, levertijd of een "alles-in-één-prijs" voor materiaal.
2. Marktprijzen op `/materialen/` blijven *referenties*: bron, peildatum, geen Sealcleaning-aanbod. Verouderde prijs (> 30 dagen) toont geen bedrag.
3. Dienstpagina's en configurator spreken van "montage" en "advies", nooit van "wij leveren". Een offerte voor montage vermeldt expliciet dat materiaal door de klant wordt aangeleverd, met verantwoordelijkheid voor hoeveelheid en tolerantie (UX009).
4. De webwinkelcode blijft aanwezig maar uit: `checkout_enabled`, `payments_enabled` en `coupon_enabled` blijven `false`. De server weigert bestellen ook zonder `MOLLIE_API_KEY` en zonder vastgestelde bezorgprijs.
5. Inkoopprijzen en marge blijven in het beheer en nooit in de publieke bestanden, de browserbundel of een URL.
6. Er komen geen verzonnen leverancierstarieven, kortingen of marges.

## Wat de eigenaar moet beslissen (één keuze, daarna volgt de rest)

- **Optie A, aanbevolen: route 1 houden.** Niets verandert. Live gaan kan zodra juridische toetsing en hosting klaar zijn.
- **Optie B: route 2 activeren.** Eerst nodig: leveranciersafspraken en tarieven, leverroutes en -kosten, retour- en klachtenproces, getoetste voorwaarden met herroeping, Mollie, btw/factuurafspraken. Daarna: teksten op `/werkwijze/` en de dienstpagina's herschrijven, producten invoeren in het beheer, flags aanzetten, testbestelling doen.
- **Optie C: beide.** Klant kiest per project: materiaal zelf (route 1) of via SEAL (route 2). Vraagt dezelfde voorbereiding als B plus duidelijke keuzetaal per offerte.

Zolang er geen keuze is, geldt optie A.
