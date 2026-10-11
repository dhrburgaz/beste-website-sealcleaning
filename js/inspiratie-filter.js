/** Filter voor de inspiratiegalerij op /inspiratie/ (knoppen met aria-pressed; zonder JS blijft alles zichtbaar). */
(function () {
  "use strict";
  var buttons = document.querySelectorAll(".i-filter button"), photos = document.querySelectorAll(".i-photo[data-cat]");
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.getAttribute("data-f");
      buttons.forEach(function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
      photos.forEach(function (p) { p.hidden = !(f === "all" || p.getAttribute("data-cat").split(" ").indexOf(f) > -1); });
    });
  });
})();
