/**
 * /inspiratie/: toont het lokale inspiratiebord (zie window.SealInspiration
 * in js/main.js). Alles wordt met textContent/attributen opgebouwd; de
 * opgeslagen waarden komen uit localStorage en worden dus nooit als HTML
 * geïnterpreteerd. Afbeeldingen alleen uit de eigen images/projects-map.
 */
(function () {
  "use strict";
  var root = document.querySelector("[data-inspiration-board]");
  if (!root || !window.SealInspiration) return;
  var SAFE_IMG = /^images\/projects\/[a-z0-9-]+\.(jpg|webp)$/;
  var SAFE_SLUG = /^[a-z0-9-]{1,80}$/;
  var SAFE_HEX = /^#[0-9a-f]{6}$/i;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function summaryText(items) {
    var lines = ["Mijn inspiratiebord (Sealcleaning-website):"];
    items.forEach(function (i) {
      if (i.kind === "case") lines.push("- Project: " + i.title + " (sealcleaning.nl/projecten/" + i.id + "/)");
      else lines.push("- Materiaal (" + (i.group || "") + "): " + i.title + " — " + (i.note || "visuele indicatie"));
    });
    return lines.join("\n");
  }

  function render() {
    var items = window.SealInspiration.list();
    root.innerHTML = "";
    if (!items.length) {
      var empty = el("div", "inspiration-empty");
      empty.appendChild(el("p", null, "Uw inspiratiebord is nog leeg."));
      var p = el("p", "field-hint");
      p.appendChild(document.createTextNode("Bewaar een project via de knop op een "));
      var a1 = el("a", null, "projectpagina"); a1.href = "../projecten/"; p.appendChild(a1);
      p.appendChild(document.createTextNode(", of een materiaalkeuze in de "));
      var a2 = el("a", null, "configurator"); a2.href = "../project-samenstellen/"; p.appendChild(a2);
      p.appendChild(document.createTextNode("."));
      empty.appendChild(p);
      root.appendChild(empty);
      return;
    }
    var cases = items.filter(function (i) { return i.kind === "case" && SAFE_SLUG.test(i.id); });
    var materials = items.filter(function (i) { return i.kind === "material"; });

    if (cases.length) {
      root.appendChild(el("h2", "inspiration-heading", "Projecten"));
      var grid = el("ul", "inspiration-grid");
      cases.forEach(function (c) {
        var li = el("li", "inspiration-card");
        if (c.image && SAFE_IMG.test(c.image)) {
          var img = document.createElement("img");
          img.src = "../" + c.image; img.alt = ""; img.loading = "lazy"; img.decoding = "async";
          li.appendChild(img);
        }
        var a = el("a", "inspiration-title", c.title || c.id);
        a.href = "../projecten/" + c.id + "/";
        li.appendChild(a);
        if (c.service) li.appendChild(el("span", "tag", c.service));
        li.appendChild(removeBtn(c, c.title));
        grid.appendChild(li);
      });
      root.appendChild(grid);
    }
    if (materials.length) {
      root.appendChild(el("h2", "inspiration-heading", "Materialen"));
      var ml = el("ul", "inspiration-materials");
      materials.forEach(function (m) {
        var li = el("li", "inspiration-material");
        var sw = el("span", "inspiration-swatch");
        if (m.colorHex && SAFE_HEX.test(m.colorHex)) sw.style.background = m.colorHex; else sw.classList.add("inspiration-swatch-none");
        sw.setAttribute("aria-hidden", "true");
        li.appendChild(sw);
        var body = el("div");
        body.appendChild(el("strong", null, m.title || "Materiaal"));
        body.appendChild(el("span", "field-hint", (m.group ? m.group + " · " : "") + (m.note || "Visuele indicatie — kleur op scherm wijkt af van het echte materiaal.")));
        li.appendChild(body);
        li.appendChild(removeBtn(m, m.title));
        ml.appendChild(li);
      });
      root.appendChild(ml);
      root.appendChild(el("p", "field-hint", "Kleuren zijn een visuele indicatie; het echte materiaal kan afwijken. Een sample of bezichtiging geeft zekerheid."));
    }

    var actions = el("div", "btn-row");
    var take = el("button", "btn btn-primary", "Neem mee in mijn aanvraag");
    take.type = "button";
    take.addEventListener("click", function () {
      try {
        var prev = window.sessionStorage.getItem("sealProjectSummary");
        window.sessionStorage.setItem("sealProjectSummary", (prev ? prev + "\n\n" : "") + summaryText(items));
      } catch (e) { /* zonder sessionStorage gaat er niets mee; formulier blijft bruikbaar */ }
      window.location.href = "../contact/?from=inspiratie#formulier";
    });
    actions.appendChild(take);
    var cfg = el("a", "btn btn-secondary", "Naar de configurator"); cfg.href = "../project-samenstellen/";
    actions.appendChild(cfg);
    var clear = el("button", "btn btn-secondary", "Bord leegmaken");
    clear.type = "button";
    clear.addEventListener("click", function () {
      if (window.confirm("Alle bewaarde inspiratie verwijderen?")) { window.SealInspiration.clear(); render(); }
    });
    actions.appendChild(clear);
    root.appendChild(actions);
  }

  function removeBtn(item, title) {
    var b = el("button", "link-btn inspiration-remove", "Verwijderen");
    b.type = "button";
    b.setAttribute("aria-label", "Verwijder " + (title || "item") + " van inspiratiebord");
    b.addEventListener("click", function () { window.SealInspiration.remove(item.kind, item.id); render(); });
    return b;
  }

  render();
})();
