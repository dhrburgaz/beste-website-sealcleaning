/**
 * Centrale bedrijfsgegevens Sealcleaning.
 * Pas hier telefoon, WhatsApp, e-mail en openingstijden aan — dit werkt overal op de site door.
 * Zie README.md in de hoofdmap voor uitleg.
 */
(function () {
  "use strict";

  var SEAL = {
    businessName: "Sealcleaning Groenonderhoud en Aanleg",
    brandName: "Sealcleaning",
    tagline: "Groenonderhoud & Aanleg",
    phoneDisplay: "06 15 71 09 65",
    phoneHref: "tel:+31615710965",
    whatsappNumber: "31648871986",
    whatsappDisplay: "06 48 87 19 86",
    email: "sealcleaningaanleg@gmail.com",
    addressLine1: "Romboutslaan 582",
    addressLine2: "3312 KP Dordrecht",
    kvk: "83078665",
    btw: "NL003773849B79",
    hours: "Dagelijks bereikbaar van 10:00 tot 19:00 uur",
    primaryArea: "Dordrecht",
    region: "Drechtsteden en Rotterdam e.o.",
    defaultWhatsappMessage: "Hallo Sealcleaning, ik wil graag meer informatie over jullie diensten."
  };

  function waLink(message) {
    var text = encodeURIComponent(message || SEAL.defaultWhatsappMessage);
    return "https://wa.me/" + SEAL.whatsappNumber + "?text=" + text;
  }

  function applyConfig(root) {
    root = root || document;

    root.querySelectorAll("[data-tel]").forEach(function (el) {
      el.setAttribute("href", SEAL.phoneHref);
      if (el.hasAttribute("data-tel-text")) el.textContent = SEAL.phoneDisplay;
    });

    root.querySelectorAll("[data-whatsapp]").forEach(function (el) {
      var msg = el.getAttribute("data-whatsapp-msg") || SEAL.defaultWhatsappMessage;
      el.setAttribute("href", waLink(msg));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
      if (el.hasAttribute("data-whatsapp-text")) el.textContent = SEAL.whatsappDisplay;
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
  window.sealWaLink = waLink;
  document.addEventListener("DOMContentLoaded", function () { applyConfig(document); });
})();
