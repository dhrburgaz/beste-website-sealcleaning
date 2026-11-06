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
  function initContactForm() {
  var form = document.querySelector("[data-contact-form]");
  if (form && !form.__sealBound) {
    form.__sealBound = true;
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

      var apiBase = window.SEAL_CONFIG && window.SEAL_CONFIG.apiBase;
      if (apiBase && window.fetch && window.FormData) {
        submitToApi(apiBase, statusEl).catch(function () { showMailto(statusEl); });
        return;
      }
      var ep = window.SEAL_CONFIG && window.SEAL_CONFIG.formEndpoint;
      if (ep && window.fetch && window.FormData) {
        submitToForm(ep, statusEl).catch(function () { showMailto(statusEl); });
        return;
      }
      showMailto(statusEl);
    });

    /* Honeypot + starttijd tegen spam (alleen gebruikt als het API-adres is ingesteld). */
    var startedAt = Date.now();
    var hp = document.createElement("input");
    hp.type = "text"; hp.name = "website"; hp.tabIndex = -1; hp.autocomplete = "off";
    hp.setAttribute("aria-hidden", "true"); hp.setAttribute("aria-label", "Laat dit veld leeg");
    hp.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;opacity:0";
    form.appendChild(hp);

    function submitToApi(apiBase, statusEl) {
      var fd = new FormData(form);
      var kind = form.getAttribute("data-lead-kind") || (/from=configurator/.test(location.search) ? "configurator" : "contact");
      fd.append("kind", kind);
      fd.append("started_at", String(startedAt));
      var text = (form.querySelector("[name=omschrijving]") || {}).value || "";
      var m = /https?:\/\/\S+#ontwerp=[A-Za-z0-9_-]+/.exec(text);
      if (m) fd.append("design", m[0]);
      var submit = form.querySelector("[type=submit]");
      if (submit) submit.disabled = true;
      if (statusEl) { statusEl.textContent = "Bezig met versturen…"; statusEl.className = "form-status"; statusEl.hidden = false; }
      return fetch(apiBase.replace(/\/$/, "") + "/api/public/leads", { method: "POST", body: fd, mode: "cors", credentials: "omit" })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (data) {
            if (submit) submit.disabled = false;
            if (r.ok && data.ref) {
              form.reset();
              var label = document.querySelector("[data-file-count]");
              if (label) label.textContent = "";
              statusEl.textContent = "Bedankt, uw aanvraag is ontvangen (referentie " + data.ref + "). Bewaar dit nummer; wij nemen zo snel mogelijk contact met u op.";
              statusEl.className = "form-status success";
              statusEl.scrollIntoView({ behavior: "smooth", block: "center" });
              return;
            }
            if (r.status >= 400 && r.status < 500 && data.error) {
              statusEl.textContent = data.error;
              statusEl.className = "form-status error";
              statusEl.scrollIntoView({ behavior: "smooth", block: "center" });
              return;
            }
            throw new Error("server");
          });
        }, function (err) { if (submit) submit.disabled = false; throw err; });
    }

    /* Directe verzending zonder eigen backend: formulierdienst die de aanvraag per e-mail doorstuurt (incl. bijlagen). */
    function submitToForm(ep, statusEl) {
      var fd = new FormData(form);
      if (fd.get("website")) return Promise.resolve();          /* honeypot: bot, stil negeren */
      var nameField = form.querySelector("[name=naam]") || form.querySelector("[name=contactpersoon]");
      fd.append("_subject", (form.getAttribute("data-subject-prefix") || "Offerteaanvraag via website") + (nameField ? " — " + nameField.value : ""));
      fd.append("_template", "table"); fd.append("_captcha", "false");
      var mail = form.querySelector("[name=email]");
      if (mail && mail.value) fd.append("_replyto", mail.value);
      var submit = form.querySelector("[type=submit]");
      if (submit) submit.disabled = true;
      if (statusEl) { statusEl.textContent = "Bezig met versturen…"; statusEl.className = "form-status"; statusEl.hidden = false; }
      return fetch(ep, { method: "POST", body: fd, headers: { Accept: "application/json" } }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (data) {
          if (submit) submit.disabled = false;
          var needsActivation = /activat/i.test(String(data.message || ""));
          if (r.ok && (data.success === true || data.success === "true") && !needsActivation) {
            form.reset();
            var label = document.querySelector("[data-file-count]");
            if (label) label.textContent = "";
            statusEl.textContent = "Bedankt, uw aanvraag is verstuurd. Wij nemen contact met u op. Wilt u liever direct contact? Bel 078 204 95 17 of stuur een WhatsApp-bericht.";
            statusEl.className = "form-status success";
            statusEl.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
          }
          throw new Error("form");
        });
      }, function (err) { if (submit) submit.disabled = false; throw err; });
    }

    function showMailto(statusEl) {
      var subjectPrefix = form.getAttribute("data-subject-prefix") || "Offerteaanvraag via website";
      var nameField = form.querySelector("[name=naam]") || form.querySelector("[name=contactpersoon]");
      var subject = encodeURIComponent(subjectPrefix + (nameField ? " — " + nameField.value : ""));
      var lines = [];
      form.querySelectorAll("input, select, textarea").forEach(function (field) {
        if (!field.name || field.type === "file" || field.name === "website") return;
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
        var contactLine = " U kunt ook direct bellen (078 204 95 17) of een WhatsApp-bericht sturen.";
        var base = "Het versturen via de website is niet gelukt, uw aanvraag is dus nog niet verzonden. Klik hieronder om haar via uw e-mailprogramma te versturen. Uw ingevulde gegevens worden meegenomen.";
        statusEl.innerHTML = hasPhotos
          ? base + " <strong>Let op: uw geselecteerde " + attachmentNoun + " worden niet automatisch bijgevoegd.</strong> Voeg ze in uw mailprogramma zelf toe" + (attachmentAltChannel ? ", of stuur ze apart via " + attachmentAltChannel : "") + "." + contactLine
          : base + contactLine;
        statusEl.className = "form-status error";
        statusEl.hidden = false;
        statusEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      var mailBtn = document.querySelector("[data-mailto-fallback]");
      if (mailBtn) {
        mailBtn.href = mailto;
        mailBtn.hidden = false;
        mailBtn.focus();
      }
    }
  }
  }
  initContactForm();
  window.__sealBindContactForm = function () { initContactForm(); bindFileInput(); };

  /* File input label feedback */
  function bindFileInput() {
    var fileInput = document.querySelector("[data-file-input]");
    if (fileInput && !fileInput.__sealBound) {
      fileInput.__sealBound = true;
      fileInput.addEventListener("change", function () {
        var label = document.querySelector("[data-file-count]");
        if (label) {
          label.textContent = fileInput.files.length
            ? fileInput.files.length + " bestand(en) geselecteerd"
            : "";
        }
      });
    }
  }
  bindFileInput();
})();
