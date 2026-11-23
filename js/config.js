/**
 * Centrale bedrijfsgegevens Sealcleaning.
 * Pas hier telefoon, e-mail en openingstijden aan — dit werkt overal op de site door.
 * Zie README.md in de hoofdmap voor uitleg.
 */
(function () {
  "use strict";

  var SEAL = {
    businessName: "Sealcleaning Groenonderhoud en Aanleg",
    brandName: "Sealcleaning",
    tagline: "Groenonderhoud & Aanleg",
    phoneDisplay: "078 204 95 17",
    phoneHref: "tel:+31782049517",
    email: "sealcleaningaanleg@gmail.com",
    addressLine1: "Romboutslaan 582",
    addressLine2: "3312 KP Dordrecht",
    kvk: "83078665",
    btw: "NL003773849B79",
    hours: "",
    primaryArea: "Dordrecht",
    region: "Dordrecht, Hendrik-Ido-Ambacht, Zwijndrecht en de Drechtsteden",
    // Adres van de Sealcleaning-backend (bijv. "https://api.sealcleaning.nl"). Leeg = formulieren
    // gebruiken het eigen mailprogramma van de bezoeker (huidige werking).
    apiBase: "",
    /* Directe verzending van aanvragen per e-mail (formulierdienst); bij een storing valt het formulier terug op e-mail via het eigen mailprogramma. */
    formEndpoint: "https://formsubmit.co/ajax/sealcleaningaanleg@gmail.com"
  };

  function applyConfig(root) {
    root = root || document;

    root.querySelectorAll("[data-tel]").forEach(function (el) {
      el.setAttribute("href", SEAL.phoneHref);
      if (el.hasAttribute("data-tel-text")) el.textContent = SEAL.phoneDisplay;
    });

    // WhatsApp is niet langer een contactkanaal op deze website.
    // Verwijder de knoppen inclusief hun eigen lijstitem, zodat de layout netjes blijft.
    root.querySelectorAll("[data-whatsapp]").forEach(function (el) {
      var listItem = el.closest("li");
      (listItem || el).remove();
    });

    root.querySelectorAll("[data-email]").forEach(function (el) {
      el.setAttribute("href", "mailto:" + SEAL.email);
      if (el.hasAttribute("data-email-text")) el.textContent = SEAL.email;
    });

    root.querySelectorAll("[data-hours]").forEach(function (el) { el.textContent = SEAL.hours; });
    root.querySelectorAll("[data-address]").forEach(function (el) {
      el.innerHTML = SEAL.addressLine1 + "<br>" + SEAL.addressLine2;
    });
    root.querySelectorAll("[data-kvk]").forEach(function (el) { el.textContent = SEAL.kvk; });
    root.querySelectorAll("[data-btw]").forEach(function (el) { el.textContent = SEAL.btw; });
    root.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  window.SEAL_CONFIG = SEAL;
  document.addEventListener("DOMContentLoaded", function () { applyConfig(document); });
})();
