# MEETPLAN (V12-10): nog niet actief, geen tracker

Er staat geen analytics op de site. De code roept alleen `emit(naam, eigenschappen)` aan (`js/v12/events.js`); dat stuurt een lokaal browser-event `seal:event`. Doorsturen naar een ontvanger kan pas als de eigenaar een oplossing kiest én de bezoeker toestemming geeft (`SEAL_CONFIG.analytics = { enabled, consent, send }`).

Events: `service_choice`, `product_view`, `material_selected`, `measurement_help_opened`, `design_preview_seen`, `quote_started`, `quote_submitted`, `checkout_enabled_order_completed` (alleen als de winkel echt open is).
Toegestane eigenschappen: `service`, `material`, `route`, `measure`, elk met een vaste lijst waarden. Naam, e-mail, adres, foto, vrije tekst, locatie en ontwerp worden nooit meegestuurd (getest in `tests/events.test.mjs`).

Wat dit later kan laten zien: waar bezoekers afhaken in de beginnersroute (stap voor stap), hoe vaak de uitleg wordt geopend, hoeveel starts tot een aanvraag leiden. Er is nog geen baseline en dus geen uitspraak over conversie. Keuzes voor de eigenaar: cookieloze teller, Search Console, of niets.
