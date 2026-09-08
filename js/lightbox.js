/**
 * Premium lightbox voor de projectengalerij: opent een grotere foto met
 * volgende/vorige/sluiten, toetsenbord- en Escape-ondersteuning.
 */
(function () {
  "use strict";

  var root = document.querySelector("[data-lightbox-root]");
  if (!root) return;

  var tiles = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (!tiles.length) return;

  var img = root.querySelector("[data-lightbox-img]");
  var source = root.querySelector("[data-lightbox-source]");
  var titleEl = root.querySelector("[data-lightbox-title]");
  var metaEl = root.querySelector("[data-lightbox-meta]");
  var closeBtn = root.querySelector("[data-lightbox-close]");
  var prevBtn = root.querySelector("[data-lightbox-prev]");
  var nextBtn = root.querySelector("[data-lightbox-next]");

  var visibleTiles = [];
  var currentIndex = 0;
  var lastFocused = null;

  function getVisibleTiles() {
    return tiles.filter(function (tile) { return !tile.hidden; });
  }

  function render(index) {
    var tile = visibleTiles[index];
    if (!tile) return;
    currentIndex = index;
    source.setAttribute("srcset", tile.getAttribute("data-full-webp"));
    img.setAttribute("src", tile.getAttribute("data-full-jpg"));
    img.setAttribute("alt", tile.getAttribute("data-alt") || "");
    titleEl.textContent = tile.getAttribute("data-title") || "";
    metaEl.textContent = tile.getAttribute("data-meta") || "";
  }

  function open(tile) {
    visibleTiles = getVisibleTiles();
    var index = visibleTiles.indexOf(tile);
    if (index === -1) index = 0;
    lastFocused = document.activeElement;
    render(index);
    root.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function close() {
    root.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  function step(delta) {
    visibleTiles = getVisibleTiles();
    var next = (currentIndex + delta + visibleTiles.length) % visibleTiles.length;
    render(next);
  }

  tiles.forEach(function (tile) {
    tile.addEventListener("click", function () { open(tile); });
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", function () { step(-1); });
  nextBtn.addEventListener("click", function () { step(1); });

  root.addEventListener("click", function (e) {
    if (e.target === root) close();
  });

  document.addEventListener("keydown", function (e) {
    if (root.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
})();
