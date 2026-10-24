"""Handmatige aanvullingen: losse zinnen die de extractor niet vindt + woordenlijst voor 'Inbegrepen/Niet inbegrepen'-regels."""
EXACT = {
 "1. Uw project":"1. Projeniz","1/5 · Uw project":"1/5 · Projeniz","Voor wie is het project?":"Proje kimin için?","Wat is uw doel?":"Hedefiniz nedir?",
 "Kies een doel — wij zetten de passende dienst alvast aan. U kunt hieronder altijd aanpassen.":"Bir hedef seçin — uygun hizmeti biz önceden açarız. Aşağıdan her zaman değiştirebilirsiniz.",
 "Meerdere diensten combineren kan — kies alles wat van toepassing is.":"Birden fazla hizmeti birleştirebilirsiniz — geçerli olan her şeyi seçin.",
 "Recht grenen scherm, schermdikte 4,7 cm (referentieartikel van een externe leverancier).":"Düz çam panel, panel kalınlığı 4,7 cm (harici bir tedarikçiden referans ürün).",
 "Betontegel met schelpkalk-toplaag (referentieartikel van een externe leverancier).":"Deniz kabuğu kireç üst katmanlı beton karo (harici bir tedarikçiden referans ürün).",
 "Keramische tuintegel van 2 cm (referentieartikel van een externe leverancier).":"2 cm seramik bahçe karosu (harici bir tedarikçiden referans ürün).",
 "Betonnen opsluitband voor een strakke rand (referentieartikel van een externe leverancier).":"Düzgün bir kenar için beton kenar taşı (harici bir tedarikçiden referans ürün).",
 "Kant-en-klaar gazon per m² (referentieartikel van een externe leverancier).":"m² başına hazır çim (harici bir tedarikçiden referans ürün).",
 "Kunstgras met 30 mm poolhoogte (referentieartikel van een externe leverancier).":"30 mm havlu yüksekliğinde suni çim (harici bir tedarikçiden referans ürün).",
 "Kunstgras met 35 mm poolhoogte (referentieartikel van een externe leverancier).":"35 mm havlu yüksekliğinde suni çim (harici bir tedarikçiden referans ürün).",
}
WORDS = {
 "scherm":"panel","palen":"direkler","beton":"beton","beslag":"bağlantı elemanları","montage":"montaj","levering":"teslimat","materiaal":"malzeme","reiskosten":"yol masrafı",
 "plaatsing per paal":"direk başına yerleştirme","plaatsing per poort":"kapı başına yerleştirme","montage per scherm":"panel başına montaj","verzending":"kargo","ondergrond":"zemin","voegwerk":"derz işi",
 "leggen":"döşeme","verzekering":"sigorta","extra kosten":"ek masraflar","transport":"nakliye","huur machine":"makine kirası","plaatsing":"yerleştirme","verwerking":"işleme",
 "vergunning indien nodig":"gerekirse izin","gemengd tuin-/grondafval":"karışık bahçe/toprak atığı","arbeid per medewerker":"çalışan başına işçilik",
 "afvoer buiten hun voorwaarden":"koşulları dışındaki atık taşıma","btw":"KDV","reis":"yol","poort":"kapı","afvoer niet bevestigd":"atık taşıma teyit edilmedi",
 "grondwerk":"toprak işi","bestrating volgens bron":"kaynağa göre zemin döşeme","regulier groenafval":"düzenli bahçe atığı",
 "montage inbegrepen per bron":"montaj kaynağa göre dahil","montage inbegrepen per bron, standaardhoogte 2m":"montaj kaynağa göre dahil, standart yükseklik 2 m",
 "montage per productpagina":"ürün sayfasına göre montaj","btw ve extra werkzaamheden onvoldoende bevestigd":"KDV ve ek işler yeterince teyit edilmedi",
 "contextuele indicatie":"bağlama göre gösterge","eenmalig":"tek seferlik","periodiek":"düzenli",
}
