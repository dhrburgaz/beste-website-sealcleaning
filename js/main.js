(function () {
  "use strict";

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  var backdrop = document.querySelector(".nav-backdrop");

  function closeNav() {
    if (!nav) return;
    nav.classList.remove("open");
    toggle && toggle.setAttribute("aria-expanded", "false");
    backdrop && backdrop.classList.remove("open");
    document.body.style.overflow = "";
  }
  function openNav() {
    if (!nav) return;
    nav.classList.add("open");
    toggle && toggle.setAttribute("aria-expanded", "true");
    backdrop && backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.contains("open");
      isOpen ? closeNav() : openNav();
    });
  }
  backdrop && backdrop.addEventListener("click", closeNav);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  /* Mobile submenu accordion (inside off-canvas nav) */
  document.querySelectorAll(".has-submenu > a").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (window.innerWidth > 940) return;
      var parent = link.parentElement;
      var isOpen = parent.classList.contains("open");
      if (!isOpen) {
        e.preventDefault();
        document.querySelectorAll(".has-submenu.open").forEach(function (el) { el.classList.remove("open"); });
        parent.classList.add("open");
      }
    });
  });

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal, .reveal-img");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Project filter */
  var filterBar = document.querySelector(".filter-bar");
  if (filterBar) {
    var buttons = filterBar.querySelectorAll(".filter-btn");
    var tiles = document.querySelectorAll(".project-tile");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        var filter = btn.getAttribute("data-filter");
        tiles.forEach(function (tile) {
          var match = filter === "alle" || tile.getAttribute("data-category") === filter;
          tile.hidden = !match;
        });
      });
    });
  }

  /* Contact form: client-side validation, then hand off to the visitor's own mail client */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        var wrap = field.closest(".field");
        var ok = field.type === "checkbox" ? field.checked : field.value.trim().length > 0;
        if (field.type === "email" && ok) {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        }
        if (wrap) wrap.classList.toggle("error", !ok);
        if (!ok) valid = false;
      });

      var statusEl = document.querySelector("[data-form-status]");
      if (!valid) {
        if (statusEl) {
          statusEl.textContent = "Controleer de gemarkeerde velden hierboven en probeer het opnieuw.";
          statusEl.className = "form-status error";
          statusEl.hidden = false;
          statusEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      var subjectPrefix = form.getAttribute("data-subject-prefix") || "Offerteaanvraag via website";
      var nameField = form.querySelector("[name=naam]") || form.querySelector("[name=contactpersoon]");
      var subject = encodeURIComponent(subjectPrefix + (nameField ? " — " + nameField.value : ""));
      var lines = [];
      form.querySelectorAll("input, select, textarea").forEach(function (field) {
        if (!field.name || field.type === "file") return;
        if ((field.type === "radio" || field.type === "checkbox") && !field.checked) return;
        lines.push(field.previousElementSibling && field.previousElementSibling.tagName === "LABEL"
          ? field.previousElementSibling.textContent + ": " + field.value
          : field.name + ": " + field.value);
      });
      var body = encodeURIComponent(lines.join("\n"));
      var mailto = "mailto:" + (window.SEAL_CONFIG ? window.SEAL_CONFIG.email : "") + "?subject=" + subject + "&body=" + body;

      var fileField = form.querySelector("[data-file-input]");
      var hasPhotos = fileField && fileField.files && fileField.files.length > 0;
      var attachmentNoun = form.getAttribute("data-attachment-noun") || "foto's";
      var attachmentAltChannel = form.getAttribute("data-attachment-alt-channel");

      if (statusEl) {
        statusEl.innerHTML = hasPhotos
          ? "Bijna klaar — klik hieronder om uw aanvraag via e-mail naar ons te versturen. Uw ingevulde gegevens worden automatisch meegenomen. <strong>Let op: uw geselecteerde " + attachmentNoun + " worden niet automatisch bijgevoegd</strong> — voeg ze in uw mailprogramma zelf als bijlage toe voordat u verstuurt" + (attachmentAltChannel ? ", of stuur ze apart via " + attachmentAltChannel + "." : ".")
          : "Bijna klaar — klik hieronder om uw aanvraag via e-mail naar ons te versturen. Uw ingevulde gegevens worden automatisch meegenomen.";
        statusEl.className = "form-status success";
        statusEl.hidden = false;
        statusEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      var mailBtn = document.querySelector("[data-mailto-fallback]");
      if (mailBtn) {
        mailBtn.href = mailto;
        mailBtn.hidden = false;
        mailBtn.focus();
      }
    });
  }

  /* File input label feedback */
  var fileInput = document.querySelector("[data-file-input]");
  if (fileInput) {
    fileInput.addEventListener("change", function () {
      var label = document.querySelector("[data-file-count]");
      if (label) {
        label.textContent = fileInput.files.length
          ? fileInput.files.length + " bestand(en) geselecteerd"
          : "";
      }
    });
  }

  /* Inspiratiebord (I06/I07): eigen cases en materialen bewaren zonder account,
     alleen in deze browser. Geen klantfoto's, geen server. */
  var INSP_KEY = "sealInspiration";
  var INSP_MAX = 24;
  function inspRead() {
    try {
      var raw = JSON.parse(window.localStorage.getItem(INSP_KEY) || "null");
      return raw && Array.isArray(raw.items) ? raw.items : [];
    } catch (e) { return []; }
  }
  function inspWrite(items) {
    try {
      window.localStorage.setItem(INSP_KEY, JSON.stringify({ savedAt: new Date().toISOString(), items: items.slice(0, INSP_MAX) }));
      return true;
    } catch (e) { return false; }
  }
  window.SealInspiration = {
    list: inspRead,
    has: function (kind, id) { return inspRead().some(function (i) { return i.kind === kind && i.id === id; }); },
    add: function (item) {
      var items = inspRead().filter(function (i) { return !(i.kind === item.kind && i.id === item.id); });
      items.unshift(item);
      return inspWrite(items);
    },
    remove: function (kind, id) {
      return inspWrite(inspRead().filter(function (i) { return !(i.kind === kind && i.id === id); }));
    },
    clear: function () { try { window.localStorage.removeItem(INSP_KEY); } catch (e) {} }
  };

  /* Bewaarknop op projectdetailpagina's (/projecten/<slug>/) */
  var caseMatch = /\/projecten\/([a-z0-9-]+)\/?$/.exec(window.location.pathname);
  var caseMeta = document.querySelector(".case-meta");
  if (caseMatch && caseMeta) {
    var slug = caseMatch[1];
    var h1 = document.querySelector("h1");
    var heroImg = document.querySelector(".hero-media img");
    var tag = caseMeta.querySelector(".tag");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-secondary btn-sm inspiration-save";
    var sync = function () {
      var saved = window.SealInspiration.has("case", slug);
      btn.setAttribute("aria-pressed", saved ? "true" : "false");
      btn.textContent = saved ? "Bewaard op inspiratiebord ✓" : "Bewaar op inspiratiebord";
    };
    btn.addEventListener("click", function () {
      if (window.SealInspiration.has("case", slug)) {
        window.SealInspiration.remove("case", slug);
      } else {
        window.SealInspiration.add({
          kind: "case", id: slug,
          title: h1 ? h1.textContent.trim() : slug,
          image: heroImg ? heroImg.getAttribute("src").replace(/^(\.\.\/)+/, "") : null,
          service: tag ? tag.textContent.trim() : null
        });
      }
      sync();
    });
    sync();
    caseMeta.appendChild(btn);
    var link = document.createElement("a");
    link.href = "../../inspiratie/";
    link.className = "inspiration-link";
    link.textContent = "Bekijk inspiratiebord";
    caseMeta.appendChild(link);
  }
})();
