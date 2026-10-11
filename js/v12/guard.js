/* Vangnet voor de ontwerphulp: blijft de route na 4 seconden leeg, dan verschijnt een duidelijke melding met
   de oorzaak (indien bekend) en een werkende alternatieve route. Klassiek script, geen module. */
(function () {
  var errs = [];
  window.addEventListener("error", function (e) { errs.push((e.message || "fout") + (e.filename ? " (" + e.filename.split("/").slice(-2).join("/") + ")" : "")); });
  window.addEventListener("unhandledrejection", function (e) { errs.push(String((e.reason && e.reason.message) || e.reason)); });
  setTimeout(function () {
    var root = document.querySelector("[data-beginner]");
    if (!root || root.hasAttribute("data-ready")) return;
    var f = document.querySelector("[data-b-fallback]");
    if (!f) return;
    f.classList.add("is-failed");
    var d = f.querySelector("[data-b-error]");
    if (d) {
      d.hidden = false;
      d.querySelector("pre").textContent = errs.join("\n") || "Het script is niet gestart en gaf geen foutmelding. Mogelijk blokkeert deze omgeving scripts of modules.";
    }
  }, 4000);
})();
