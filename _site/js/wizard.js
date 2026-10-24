/**
 * Tuinproject-configurator: korte wizard op de homepage die de bezoeker
 * helpt zijn aanvraag te omschrijven, en de keuzes doorgeeft aan het
 * contactformulier via de querystring (zie js/wizard-prefill.js).
 */
(function () {
  "use strict";

  var root = document.querySelector("[data-wizard]");
  if (!root) return;

  var SERVICE_LABELS = {
    tuinonderhoud: "Tuinonderhoud",
    tuinaanleg: "Tuinaanleg",
    tuinrenovatie: "Tuinrenovatie",
    bestrating: "Bestrating",
    schutting: "Schutting",
    snoeiwerk: "Snoeiwerk",
    bomen: "Bomen verzorgen",
    gras: "Gras/gazon",
    periodiek: "Periodiek onderhoud",
    anders: "Anders"
  };

  var SIZE_CONFIG = {
    tuinonderhoud: { title: "Hoe groot is de tuin ongeveer?", buckets: ["< 25 m²", "25 – 50 m²", "50 – 100 m²", "100 – 250 m²", "250+ m²"] },
    gras: { title: "Hoe groot is het gazon ongeveer?", buckets: ["< 25 m²", "25 – 50 m²", "50 – 100 m²", "100 – 250 m²", "250+ m²"] },
    periodiek: { title: "Hoe groot is de tuin ongeveer?", buckets: ["< 25 m²", "25 – 50 m²", "50 – 100 m²", "100 – 250 m²", "250+ m²"] },
    tuinaanleg: {
      title: "Hoeveel tuinoppervlakte gaat het ongeveer om?",
      buckets: ["< 25 m²", "25 – 50 m²", "50 – 100 m²", "100 – 250 m²", "250+ m²"],
      extraTitle: "Gedeeltelijke vernieuwing of complete aanleg?",
      extraOptions: ["Gedeeltelijke vernieuwing", "Complete aanleg"]
    },
    tuinrenovatie: {
      title: "Hoeveel tuinoppervlakte gaat het ongeveer om?",
      buckets: ["< 25 m²", "25 – 50 m²", "50 – 100 m²", "100 – 250 m²", "250+ m²"],
      extraTitle: "Gedeeltelijke of complete renovatie?",
      extraOptions: ["Gedeeltelijke renovatie", "Complete renovatie"]
    },
    bestrating: { title: "Hoeveel m² wilt u ongeveer laten bestraten?", buckets: ["< 10 m²", "10 – 25 m²", "25 – 50 m²", "50 – 100 m²", "100+ m²"] },
    schutting: { title: "Hoeveel meter schutting gaat het ongeveer om?", buckets: ["5 m", "10 m", "15 m", "20 m", "25+ m"] },
    snoeiwerk: { title: "Hoeveel meter haag of heg gaat het ongeveer om?", buckets: ["< 10 m", "10 – 25 m", "25 – 50 m", "50+ m"] },
    bomen: {
      title: "Om hoeveel bomen gaat het ongeveer?",
      buckets: ["1 boom", "2 – 3 bomen", "4 – 6 bomen", "7+ bomen"],
      extraTitle: "Wat is ongeveer de grootte?",
      extraOptions: ["Klein", "Middelgroot", "Groot"]
    }
    /* "anders" heeft geen stap 2 en slaat deze over */
  };

  var state = { service: null, size: null, extra: null, plaats: "", period: null };
  var currentStep = 1;

  var progressBar = root.querySelector("[data-wizard-progress]");
  var steps = root.querySelectorAll("[data-wizard-step]");
  var sizeTitle = root.querySelector("[data-wizard-size-title]");
  var sizeTiles = root.querySelector("[data-wizard-size-tiles]");
  var extraWrap = root.querySelector("[data-wizard-extra]");
  var extraTitle = root.querySelector("[data-wizard-extra-title]");
  var extraTiles = root.querySelector("[data-wizard-extra-tiles]");
  var plaatsInput = root.querySelector("[data-wizard-plaats]");
  var periodTiles = root.querySelectorAll("[data-period]");
  var summaryList = root.querySelector("[data-wizard-summary]");
  var submitLink = root.querySelector("[data-wizard-submit]");

  function goToStep(n) {
    currentStep = n;
    steps.forEach(function (step) {
      step.hidden = step.getAttribute("data-wizard-step") !== String(n);
    });
    if (progressBar) progressBar.style.width = (n / 4 * 100) + "%";
    root.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* Stap 1: kies dienst */
  root.querySelectorAll("[data-service]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      root.querySelectorAll("[data-service]").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      state.service = btn.getAttribute("data-service");
      state.size = null;
      state.extra = null;

      var config = SIZE_CONFIG[state.service];
      if (!config) {
        goToStep(3);
        return;
      }

      sizeTitle.textContent = config.title;
      sizeTiles.innerHTML = "";
      config.buckets.forEach(function (bucket) {
        var tile = document.createElement("button");
        tile.type = "button";
        tile.className = "wizard-tile wizard-tile-sm";
        tile.setAttribute("aria-pressed", "false");
        tile.setAttribute("data-size", bucket);
        tile.innerHTML = "<span>" + bucket + "</span>";
        tile.addEventListener("click", function () {
          sizeTiles.querySelectorAll("[data-size]").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
          tile.setAttribute("aria-pressed", "true");
          state.size = bucket;
          maybeAdvanceFromStep2();
        });
        sizeTiles.appendChild(tile);
      });

      if (config.extraOptions) {
        extraWrap.hidden = false;
        extraTitle.textContent = config.extraTitle;
        extraTiles.innerHTML = "";
        config.extraOptions.forEach(function (opt) {
          var tile = document.createElement("button");
          tile.type = "button";
          tile.className = "wizard-tile wizard-tile-sm";
          tile.setAttribute("aria-pressed", "false");
          tile.setAttribute("data-extra", opt);
          tile.innerHTML = "<span>" + opt + "</span>";
          tile.addEventListener("click", function () {
            extraTiles.querySelectorAll("[data-extra]").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
            tile.setAttribute("aria-pressed", "true");
            state.extra = opt;
            maybeAdvanceFromStep2();
          });
          extraTiles.appendChild(tile);
        });
      } else {
        extraWrap.hidden = true;
      }

      goToStep(2);
    });
  });

  function maybeAdvanceFromStep2() {
    var config = SIZE_CONFIG[state.service];
    var needsExtra = config && config.extraOptions;
    if (state.size && (!needsExtra || state.extra)) {
      window.setTimeout(function () { goToStep(3); }, 220);
    }
  }

  /* Stap 2: terug */
  root.querySelectorAll("[data-wizard-back]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      goToStep(parseInt(btn.getAttribute("data-wizard-back"), 10));
    });
  });

  /* Stap 3: plaats + periode */
  if (plaatsInput) {
    plaatsInput.addEventListener("input", function () { state.plaats = plaatsInput.value.trim(); });
  }
  periodTiles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      periodTiles.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      state.period = btn.getAttribute("data-period");
    });
  });

  root.querySelectorAll("[data-wizard-next]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      buildSummary();
      goToStep(parseInt(btn.getAttribute("data-wizard-next"), 10));
    });
  });

  function addSummaryRow(label, value) {
    var li = document.createElement("li");
    li.innerHTML = "<span class=\"label\">" + label + "</span><strong>" + value + "</strong>";
    summaryList.appendChild(li);
  }

  function buildSummary() {
    summaryList.innerHTML = "";
    addSummaryRow("Dienst", SERVICE_LABELS[state.service] || "—");
    if (state.size) addSummaryRow("Omvang", "circa " + state.size);
    if (state.extra) addSummaryRow("Type", state.extra);
    addSummaryRow("Plaats", state.plaats || "—");
    addSummaryRow("Gewenste periode", state.period || "—");

    if (submitLink) {
      var params = new URLSearchParams();
      params.set("service", state.service || "");
      if (state.size) params.set("maat", state.size);
      if (state.extra) params.set("extra", state.extra);
      if (state.plaats) params.set("plaats", state.plaats);
      if (state.period) params.set("periode", state.period);
      submitLink.setAttribute("href", "contact/?" + params.toString() + "#formulier");
    }
  }
})();
