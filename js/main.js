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

  /* Contact form: client-side validation + honest "not yet connected" handling */
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

      var subject = encodeURIComponent("Offerteaanvraag via website — " + (form.querySelector("[name=naam]") ? form.querySelector("[name=naam]").value : ""));
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

      if (statusEl) {
        statusEl.innerHTML = "Dit formulier is nog niet gekoppeld aan een server (de site draait op GitHub Pages zonder backend). Je gegevens zijn <strong>niet verstuurd</strong>. Klik op de knop hieronder om de aanvraag alsnog via e-mail te versturen, of neem direct contact op via telefoon of WhatsApp.";
        statusEl.className = "form-status error";
        statusEl.hidden = false;
        statusEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      var mailBtn = document.querySelector("[data-mailto-fallback]");
      if (mailBtn) {
        mailBtn.href = mailto;
        mailBtn.hidden = false;
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
})();
