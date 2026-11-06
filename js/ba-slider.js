/** Voor/na-slider: schuift met muis, aanraking en toetsenbord (pijltjes) via een onzichtbare range-input. */
(function () {
  "use strict";
  document.querySelectorAll("[data-ba]").forEach(function (box) {
    var input = box.querySelector("input[type=range]"), after = box.querySelector(".ba-after"), handle = box.querySelector(".ba-handle");
    if (!input || !after) return;
    function set() { var v = +input.value; after.style.clipPath = "inset(0 0 0 " + v + "%)"; if (handle) handle.style.left = v + "%"; }
    input.addEventListener("input", set); set();
  });
})();
