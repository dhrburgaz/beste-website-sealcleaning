/**
 * Vult het contactformulier voor met keuzes uit de tuinproject-configurator
 * op de homepage (zie js/wizard.js), op basis van de querystring.
 */
(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var service = params.get("service");
  // ?materiaal= vanuit /materialen/: alleen als tekst in de omschrijving (textarea.value, geen HTML).
  var materiaal = (params.get("materiaal") || "").slice(0, 140);

  /* Overdracht vanuit /project-samenstellen/: een leesbare samenvatting die
     daar in sessionStorage is gezet (zie js/configurator/app.js,
     storeHandoffSummary). Eenmalig gebruik: direct verwijderen na lezen. */
  var configuratorSummary = null;
  try {
    configuratorSummary = window.sessionStorage.getItem("sealProjectSummary");
    if (configuratorSummary) window.sessionStorage.removeItem("sealProjectSummary");
  } catch (e) { /* privénavigatie: geen sessionStorage, geen overdracht */ }

  if (!service && !configuratorSummary && !materiaal) return;

  var SERVICE_TO_OPTION = {
    tuinonderhoud: "Tuinonderhoud",
    tuinaanleg: "Tuinaanleg",
    tuinrenovatie: "Tuinrenovatie",
    bestrating: "Bestrating",
    schutting: "Schutting plaatsen/vervangen",
    snoeiwerk: "Snoeiwerk",
    bomen: "Snoeiwerk",
    gras: "Tuinonderhoud",
    kunstgras: "Tuinonderhoud",
    periodiek: "Periodiek onderhoud",
    anders: "Anders / weet ik nog niet"
  };
  var SERVICE_LABELS = {
    tuinonderhoud: "Tuinonderhoud",
    tuinaanleg: "Tuinaanleg",
    tuinrenovatie: "Tuinrenovatie",
    bestrating: "Bestrating",
    schutting: "Schutting",
    snoeiwerk: "Snoeiwerk",
    bomen: "Bomen verzorgen",
    gras: "Gras/gazon",
    kunstgras: "Gras/gazon",
    periodiek: "Periodiek onderhoud",
    anders: "Anders"
  };

  document.addEventListener("DOMContentLoaded", function () {
    var maat = params.get("maat");
    var extra = params.get("extra");
    var plaats = params.get("plaats");
    var periode = params.get("periode");

    var select = document.getElementById("werkzaamheden");
    if (select && SERVICE_TO_OPTION[service]) {
      select.value = SERVICE_TO_OPTION[service];
    }

    var woonplaats = document.getElementById("woonplaats");
    if (woonplaats && plaats) woonplaats.value = plaats;

    if (periode) {
      document.querySelectorAll("input[name=periode]").forEach(function (radio) {
        if (radio.value === periode) radio.checked = true;
      });
    }

    var omschrijving = document.getElementById("omschrijving");
    if (omschrijving) {
      if (materiaal && !service && !configuratorSummary) {
        omschrijving.value = materiaal === "advies"
          ? "Ik wil graag advies over welk materiaal past bij mijn tuin.\n\n(Vertel hier kort over uw tuin en wensen.)"
          : "Ik wil graag een offerte met dit materiaal: " + materiaal + "\n\n(Vul hieronder het oppervlak of de lengte en uw wensen aan.)";
      } else if (configuratorSummary) {
        omschrijving.value = configuratorSummary + "\n\n(Vul hieronder eventueel meer details aan.)";
      } else {
        var lines = ["Vanuit de tuinproject-configurator:", "Dienst: " + (SERVICE_LABELS[service] || service)];
        if (maat) lines.push("Omvang: circa " + maat);
        if (extra) lines.push("Type: " + extra);
        if (periode) lines.push("Gewenste periode: " + periode);
        lines.push("", "(Vul hieronder eventueel meer details aan.)");
        omschrijving.value = lines.join("\n");
      }
    }

    var note = document.querySelector("[data-wizard-prefill-note]");
    if (note) note.hidden = false;

    var target = document.getElementById("formulier");
    if (target) {
      window.setTimeout(function () { target.scrollIntoView({ behavior: "smooth", block: "start" }); }, 150);
    }
  });
})();
