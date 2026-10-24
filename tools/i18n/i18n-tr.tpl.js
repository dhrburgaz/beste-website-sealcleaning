/* Gegenereerd door tools/i18n/js-dict.py — niet met de hand wijzigen. Vertaalt door JS getekende tekst (NL → TR) op /tr/-pagina's. */
(function () {
  "use strict";
  window.SEAL_LANG = "tr";
  /* JS die "../data/…" relatief aan de pagina ophaalt, moet op /tr/-pagina's naar de site-root wijzen */
  var ROOT = (document.currentScript && document.currentScript.src || "").replace(/js\/i18n-tr\.js.*$/, "");
  if (ROOT && window.fetch) {
    var f0 = window.fetch;
    window.fetch = function (u, o) {
      try {
        var s = typeof u === "string" ? u : (u && u.url);
        var full = new URL(s, location.href).href, pre = ROOT + "tr/";
        var m = full.indexOf(pre) === 0 && full.slice(pre.length).match(/^(data|images|js|vendor|api)\//);
        if (m && typeof u === "string") u = ROOT + full.slice(pre.length);
      } catch (e) {}
      return f0.call(this, u, o);
    };
  }
  var EXACT = __EXACT__;
  var WORDS = __WORDS__;
  var RULES = __RULES__;
  var ATTRS = ["placeholder", "aria-label", "title", "alt", "data-label", "data-tip"];
  var compiled = RULES.map(function (r) {
    var esc = r[0].replace(/[.*+?^$()|[\]\\]/g, "\\$&").replace(/\{\d+\}/g, "(.+?)");
    return [new RegExp("^" + esc + "$"), r[1]];
  });
  function norm(s) { return s.replace(/\s+/g, " ").trim(); }
  function tr(s) {
    var n = norm(s);
    if (!n) return s;
    var t = EXACT[n];
    if (t === undefined) {
      for (var i = 0; i < compiled.length; i++) {
        var m = compiled[i][0].exec(n);
        if (m) { t = compiled[i][1].replace(/\{(\d+)\}/g, function (_, k) { var a = m[+k + 1]; return a === undefined ? "" : (EXACT[a] || a); }); break; }
      }
    }
    if (t === undefined) {
      var inc = /^Inbegrepen: (.+?)(?: — Niet inbegrepen: (.+))?$/.exec(n);
      if (inc) {
        var list = function (x) { return x.split(/, /).map(function (w) { var k = w.trim(); return WORDS[k] || EXACT[k] || k; }).join(", "); };
        t = "Dahil: " + list(inc[1]) + (inc[2] ? " — Dahil değil: " + list(inc[2]) : "");
      }
    }
    if (t === undefined) return s;
    var lead = s.match(/^\s*/)[0], trail = s.match(/\s*$/)[0];
    return lead + t + trail;
  }
  /* door JS gemaakte afbeeldingen verwijzen document-relatief naar images/ → site-root */
  function fixSrc(n) {
    if (!ROOT || !n.getAttribute) return;
    var pre = ROOT + "tr/";
    ["src", "srcset"].forEach(function (a) {
      var v = n.getAttribute(a);
      if (!v || v.indexOf("images/") < 0) return;
      var out = v.split(",").map(function (part) {
        var p = part.trim().split(/\s+/), u;
        try { u = new URL(p[0], location.href).href; } catch (e) { return part; }
        if (u.indexOf(pre + "images/") === 0) p[0] = ROOT + u.slice(pre.length);
        return p.join(" ");
      }).join(", ");
      if (out !== v) n.setAttribute(a, out);
    });
  }
  var busy = false;
  function node(n) {
    if (n.nodeType === 3) {
      var p = n.parentNode;
      if (!p || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(p.nodeName) || (p.closest && p.closest("[data-no-i18n]"))) return;
      var v = tr(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v;
    } else if (n.nodeType === 1) {
      if (/^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.nodeName) || n.hasAttribute("data-no-i18n")) return;
      if (n.nodeName === "IMG" || n.nodeName === "SOURCE") fixSrc(n);
      for (var i = 0; i < ATTRS.length; i++) {
        var a = n.getAttribute(ATTRS[i]);
        if (a) { var b = tr(a); if (b !== a) n.setAttribute(ATTRS[i], b); }
      }
      if (n.nodeName === "INPUT" && /^(button|submit)$/.test(n.type) && n.value) { var c = tr(n.value); if (c !== n.value) n.value = c; }
      for (var k = n.firstChild; k; k = k.nextSibling) node(k);
    }
  }
  function run(root) { if (busy) return; busy = true; try { node(root); } finally { busy = false; } }
  function start() {
    var t = tr(document.title); if (t !== document.title) document.title = t;
    run(document.body);
    new MutationObserver(function (list) {
      if (busy) return;
      busy = true;
      try {
        list.forEach(function (m) {
          if (m.type === "characterData") node(m.target);
          else if (m.type === "attributes" && /^src(set)?$/.test(m.attributeName)) fixSrc(m.target);
          else if (m.type === "attributes") { var a = m.target.getAttribute(m.attributeName); if (a) { var b = tr(a); if (b !== a) m.target.setAttribute(m.attributeName, b); } }
          else m.addedNodes.forEach(node);
        });
      } finally { busy = false; }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS.concat(["src", "srcset"]) });
  }
  window.SEAL_TR = tr;
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
