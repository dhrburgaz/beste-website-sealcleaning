/**
 * Rendert de prijstabellen op /prijzen/ rechtstreeks uit data/price-sources.json,
 * zodat deze pagina nooit uit de pas kan lopen met de brondata die de
 * configurator ook gebruikt (ch.20: "Maak /prijzen/ met bronnen/peildatum").
 */
(function () {
  "use strict";

  var GROUP_LABELS = {
    bestrating: "Bestrating",
    schutting: "Schutting",
    "gras-kunstgras": "Gras & kunstgras",
    "huur-transport": "Huur & transport",
    afval: "Afval & afvoer",
    "arbeid-onderhoud": "Arbeid & onderhoud (marktbenchmark)",
    "complete-tuin": "Complete tuin (marktbenchmark)",
    overig: "Overig"
  };
  var GROUP_ORDER = ["schutting", "bestrating", "gras-kunstgras", "huur-transport", "afval", "arbeid-onderhoud", "complete-tuin", "overig"];

  function formatAmount(row) {
    var fmt = function (cents) {
      return (cents / 100).toLocaleString("nl-NL", { style: "currency", currency: "EUR" });
    };
    var unitLabel = { piece: "stuk", m2: "m²", day: "dag", container: "container", hour: "uur", visit: "beurt", tree: "boom", meter: "meter" }[row.unit] || row.unit;
    if (row.rangeCents) return fmt(row.rangeCents[0]) + " – " + fmt(row.rangeCents[1]) + " / " + unitLabel;
    if (row.amountCents != null) return fmt(row.amountCents) + " / " + unitLabel;
    return "—";
  }

  function row(r) {
    var tr = document.createElement("tr");
    if (r.status === "stale") tr.className = "price-row-stale";

    var tdLabel = document.createElement("td");
    tdLabel.textContent = r.productLabel;
    tr.appendChild(tdLabel);

    var tdAmount = document.createElement("td");
    tdAmount.textContent = formatAmount(r);
    tr.appendChild(tdAmount);

    var tdVat = document.createElement("td");
    tdVat.textContent = r.vatIncluded === true ? (r.vatRate ? "incl. " + r.vatRate + "%" : "incl.") : r.vatIncluded === false ? "excl." : "onbekend";
    tr.appendChild(tdVat);

    var tdScope = document.createElement("td");
    var bits = [];
    if (r.scopeIncluded && r.scopeIncluded.length) bits.push("Inbegrepen: " + r.scopeIncluded.join(", "));
    if (r.scopeExcluded && r.scopeExcluded.length) bits.push("Niet inbegrepen: " + r.scopeExcluded.join(", "));
    tdScope.textContent = bits.join(" — ") || "—";
    tr.appendChild(tdScope);

    var tdSource = document.createElement("td");
    var link = document.createElement("a");
    link.href = r.sourceUrl;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Bron (" + r.observedAt + ")";
    tdSource.appendChild(link);
    if (r.status === "stale") {
      var badge = document.createElement("span");
      badge.className = "price-badge-stale";
      badge.textContent = "Verouderd — niet automatisch gebruikt";
      tdSource.appendChild(document.createElement("br"));
      tdSource.appendChild(badge);
    }
    tr.appendChild(tdSource);

    return tr;
  }

  function render(data) {
    var root = document.querySelector("[data-prijzen-root]");
    if (!root) return;
    root.innerHTML = "";

    var byGroup = {};
    data.rows.forEach(function (r) {
      (byGroup[r.group] = byGroup[r.group] || []).push(r);
    });

    GROUP_ORDER.forEach(function (groupId) {
      var rows = byGroup[groupId];
      if (!rows || !rows.length) return;
      var section = document.createElement("div");
      section.className = "price-group";
      var h3 = document.createElement("h3");
      h3.textContent = GROUP_LABELS[groupId] || groupId;
      section.appendChild(h3);

      var tableWrap = document.createElement("div");
      tableWrap.className = "price-table-wrap";
      tableWrap.tabIndex = 0;
      tableWrap.setAttribute("role", "region");
      tableWrap.setAttribute("aria-label", (GROUP_LABELS[groupId] || groupId) + " (tabel, horizontaal scrollbaar)");
      var table = document.createElement("table");
      table.className = "price-table";
      var thead = document.createElement("thead");
      thead.innerHTML = "<tr><th>Product / dienst</th><th>Prijs</th><th>Btw</th><th>Scope</th><th>Bron</th></tr>";
      table.appendChild(thead);
      var tbody = document.createElement("tbody");
      rows.forEach(function (r) { tbody.appendChild(row(r)); });
      table.appendChild(tbody);
      tableWrap.appendChild(table);
      section.appendChild(tableWrap);
      root.appendChild(section);
    });

    var unresolvedEl = document.querySelector("[data-prijzen-unresolved]");
    if (unresolvedEl && data.unresolved && data.unresolved.length) {
      unresolvedEl.innerHTML = "";
      data.unresolved.forEach(function (text) {
        var li = document.createElement("li");
        li.textContent = text;
        unresolvedEl.appendChild(li);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/price-sources.json")
      .then(function (res) { return res.json(); })
      .then(render)
      .catch(function () {
        var root = document.querySelector("[data-prijzen-root]");
        if (root) root.innerHTML = "<p>De prijsgegevens konden niet worden geladen.</p>";
      });
  });
})();
