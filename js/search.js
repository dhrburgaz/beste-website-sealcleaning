/**
 * /zoeken/: zoekt in data/search-index.json (gegenereerd door
 * tools/build-search-index.mjs uit de echte pagina's). Alle zoektermen moeten
 * voorkomen (woordbegin), met terugval op "één van de termen" en een
 * bruikbare lege toestand. Resultaten via textContent — geen HTML-injectie.
 */
(function () {
  "use strict";
  var form = document.querySelector("[data-site-search]");
  var input = document.getElementById("q");
  var list = document.querySelector("[data-search-results]");
  var status = document.querySelector("[data-search-status]");
  if (!form || !input || !list) return;

  var SYNONYMS = { hek: "schutting", erfafscheiding: "schutting", tegels: "bestrating", terras: "bestrating", hovenier: "tuinaanleg", snoeien: "snoeiwerk", gras: "gazon", prijs: "prijzen", kosten: "prijzen", tarief: "prijzen" };
  var index = null;

  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, " ");
  }
  function words(s) { return norm(s).split(/[\s-]+/).filter(Boolean); }

  function prepare(entries) {
    return entries.map(function (e) {
      return { e: e, title: words(e.title + " " + e.h1), desc: words(e.description), text: words(e.text) };
    });
  }

  function tokenScore(item, t) {
    var hit = function (arr) { return arr.some(function (w) { return w.indexOf(t) === 0 || (t.length >= 5 && w.indexOf(t) >= 0); }); };
    return (hit(item.title) ? 6 : 0) + (hit(item.desc) ? 3 : 0) + (hit(item.text) ? 1 : 0);
  }

  function search(q) {
    var tokens = words(q).filter(function (t) { return t.length >= 2; });
    tokens = tokens.concat(tokens.map(function (t) { return SYNONYMS[t]; }).filter(Boolean));
    if (!tokens.length) return { results: [], partial: false };
    var base = words(q).filter(function (t) { return t.length >= 2; });
    var scored = index.map(function (item) {
      var per = base.map(function (t) { return Math.max(tokenScore(item, t), SYNONYMS[t] ? tokenScore(item, SYNONYMS[t]) : 0); });
      var raw = per.reduce(function (a, b) { return a + b; }, 0);
      return { item: item, all: per.every(function (s) { return s > 0; }), score: raw > 0 && item.e.type === "Dienst" ? raw + 1 : raw };
    }).filter(function (r) { return r.score > 0; });
    var all = scored.filter(function (r) { return r.all; });
    var use = all.length ? all : scored;
    use.sort(function (a, b) { return b.score - a.score; });
    return { results: use.slice(0, 20).map(function (r) { return r.item.e; }), partial: !all.length && use.length > 0 };
  }

  function render(q) {
    list.innerHTML = "";
    if (!q.trim()) { status.textContent = ""; return; }
    var out = search(q);
    if (!out.results.length) {
      status.textContent = "Geen resultaten voor “" + q + "”.";
      var li = document.createElement("li");
      li.className = "search-empty";
      li.appendChild(document.createTextNode("Probeer een ander woord (bijv. schutting, bestrating, onderhoud, prijzen), bekijk "));
      var a = document.createElement("a"); a.href = "../projecten/"; a.textContent = "onze projecten"; li.appendChild(a);
      li.appendChild(document.createTextNode(" of "));
      var c = document.createElement("a"); c.href = "../contact/"; c.textContent = "stel uw vraag direct"; li.appendChild(c);
      li.appendChild(document.createTextNode("."));
      list.appendChild(li);
      return;
    }
    status.textContent = out.results.length + (out.results.length === 1 ? " resultaat" : " resultaten") + (out.partial ? " (niet alle woorden gevonden)" : "") + " voor “" + q + "”.";
    out.results.forEach(function (e) {
      var li = document.createElement("li");
      li.className = "search-result";
      var badge = document.createElement("span"); badge.className = "tag"; badge.textContent = e.type; li.appendChild(badge);
      var a = document.createElement("a"); a.href = "../" + e.url; a.textContent = e.title; a.className = "search-result-title"; li.appendChild(a);
      if (e.description) { var p = document.createElement("p"); p.textContent = e.description; li.appendChild(p); }
      list.appendChild(li);
    });
  }

  function run() {
    var q = input.value.slice(0, 80);
    try { history.replaceState(null, "", q ? "?q=" + encodeURIComponent(q) : location.pathname); } catch (e) {}
    if (index) render(q);
  }

  form.addEventListener("submit", function (e) { e.preventDefault(); run(); });
  input.addEventListener("input", function () { if (index && input.value.trim().length >= 2) render(input.value.slice(0, 80)); else if (!input.value.trim()) render(""); });

  input.value = (new URLSearchParams(location.search).get("q") || "").slice(0, 80);
  fetch("../data/search-index.json").then(function (r) { return r.json(); }).then(function (data) {
    index = prepare(data.entries || []);
    render(input.value);
  }).catch(function () {
    status.textContent = "Zoeken is nu niet beschikbaar. Gebruik het menu of neem contact op.";
  });
})();
