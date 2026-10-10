/**
 * /materialen/: materialenzoeker (V7-05/V7-08). Alle data via textContent; staat in de URL
 * (terugknop en delen behouden filters); vergelijken tot 3; productdetail met hoeveelheid en alternatieven.
 */
import { CATALOG, CATALOG_CATEGORIES, CATALOG_STATUSES } from "../../data/catalog.js";
import { addToCart, apiBase, shopConfig, cartCount } from "../shop/cart-store.js";
import { searchCatalog, suggest, filterCatalog, facetCounts, sortCatalog, priceInfo, quantityFor, FACETS, SORTS } from "./search.js";

const root = document.querySelector("[data-catalog-app]");
const UNIT = { piece: "per stuk", m2: "per m²", day: "per dag", container: "per container", meter: "per m¹", hour: "per uur" };
const CAT_LABEL = Object.fromEntries(CATALOG_CATEGORIES.map((c) => [c.id, c.label]));
const MAX_COMPARE = 3;
let prices = { rows: [] };
let shop = { open: false, products: new Map() };
let state = readUrl();
let lastListScroll = 0;
let openedFromList = false;

const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "text") el.textContent = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
};
const euro = (c) => (c / 100).toLocaleString("nl-NL", { style: "currency", currency: "EUR" });
const dateNl = (iso) => (iso ? new Date(iso + "T12:00:00").toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" }) : "");
const facetLabel = (k, v) => (k === "category" ? CAT_LABEL[v] : k === "status" ? CATALOG_STATUSES[v]?.label : v.charAt(0).toUpperCase() + v.slice(1));

function readUrl() {
  const p = new URLSearchParams(location.search);
  const filters = {};
  for (const k of Object.keys(FACETS)) filters[k] = (p.get(k) || "").split("|").filter(Boolean);
  return { q: p.get("q") || "", filters, sort: SORTS[p.get("sort")] ? p.get("sort") : "relevantie", product: p.get("product") || null,
    compare: (p.get("vergelijk") || "").split("|").filter((id) => CATALOG.some((i) => i.id === id)).slice(0, MAX_COMPARE) };
}
function writeUrl(push) {
  const p = new URLSearchParams();
  if (state.q) p.set("q", state.q);
  for (const [k, v] of Object.entries(state.filters)) if (v.length) p.set(k, v.join("|"));
  if (state.sort !== "relevantie") p.set("sort", state.sort);
  if (state.compare.length) p.set("vergelijk", state.compare.join("|"));
  if (state.product) p.set("product", state.product);
  const url = location.pathname + (p.toString() ? "?" + p : "");
  try { history[push ? "pushState" : "replaceState"](null, "", url); } catch { /* sandbox */ }
}

/* ---------------- lijst ---------------- */
function results() {
  const found = searchCatalog(CATALOG, state.q);
  const inFilter = new Set(filterCatalog(found.map((r) => r.item), state.filters));
  return sortCatalog(found.filter((r) => inFilter.has(r.item)), state.sort);
}

function priceLine(item) {
  const p = priceInfo(item, prices);
  if (p.status === "reference") {
    return h("p", { class: "catalog-price" },
      h("span", { class: "price", text: `${euro(p.amountCents)} ${UNIT[p.unit] || ""}` }),
      ` ${p.vatIncluded === true ? "incl. btw" : p.vatIncluded === false ? "excl. btw" : "(btw-basis onbekend)"} · marktreferentie `,
      h("a", { href: p.sourceUrl, rel: "noopener nofollow", target: "_blank", text: p.domain }), `, ${dateNl(p.observedAt)}`);
  }
  if (p.status === "stale") return h("p", { class: "catalog-price" }, h("span", { class: "badge badge--estimated", text: "Referentie verlopen" }), " controle nodig; wij adviseren over de actuele prijs");
  return h("p", { class: "catalog-price muted", text: "Geen vaste prijs: wij adviseren, u bestelt zelf" });
}

function media(item, size = "card") {
  if (item.image) {
    const src = "../" + item.image.src;
    return h("figure", { class: `catalog-media catalog-media--${size}` },
      h("picture", {}, h("source", { srcset: size === "card" ? `${src.replace(/\.jpg$/, "-640.webp")} 640w, ${src.replace(/\.jpg$/, ".webp")} 1600w` : `${src.replace(/\.jpg$/, "-960.webp")} 960w, ${src.replace(/\.jpg$/, ".webp")} 1600w`, sizes: size === "card" ? "(max-width: 600px) 104px, 300px" : "(max-width: 900px) 92vw, 560px", type: "image/webp" }),
        h("img", { src, alt: item.image.alt, loading: size === "card" ? "lazy" : "eager", decoding: "async", width: "800", height: "600" })),
      h("figcaption", { text: item.image.project ? "Foto uit eigen werk" : "Foto uit eigen werk (materiaal volgens bestandsnaam)" }));
  }
  return h("div", { class: `catalog-media catalog-media--${size} catalog-media--empty`, role: "img", "aria-label": "Geen eigen foto beschikbaar" },
    h("span", { text: item.material || CAT_LABEL[item.category] }), h("small", { text: "Geen eigen foto beschikbaar" }));
}

function compareBtn(item) {
  const on = state.compare.includes(item.id);
  const full = !on && state.compare.length >= MAX_COMPARE;
  return h("button", { type: "button", class: "chip chip--sm", "aria-pressed": on ? "true" : "false", disabled: full,
    title: full ? `Maximaal ${MAX_COMPARE} tegelijk vergelijken` : null,
    onclick: () => { state.compare = on ? state.compare.filter((x) => x !== item.id) : [...state.compare, item.id]; writeUrl(); render(); announce(on ? `${item.title} uit vergelijking gehaald` : `${item.title} toegevoegd aan vergelijking`); } },
  on ? "✓ Vergelijken" : "Vergelijk");
}
function saveBtn(item) {
  const I = window.SealInspiration;
  if (!I) return null;
  const on = I.has("material", item.id);
  return h("button", { type: "button", class: "chip chip--sm", "aria-pressed": on ? "true" : "false",
    onclick: (e) => {
      if (I.has("material", item.id)) I.remove("material", item.id);
      else I.add({ kind: "material", id: item.id, title: item.title, group: CAT_LABEL[item.category], note: CATALOG_STATUSES[item.status].label });
      const now = I.has("material", item.id);
      e.currentTarget.setAttribute("aria-pressed", now ? "true" : "false");
      e.currentTarget.textContent = now ? "✓ Bewaard" : "Bewaar";
      announce(now ? "Bewaard op uw inspiratiebord" : "Verwijderd van uw inspiratiebord");
    } }, on ? "✓ Bewaard" : "Bewaar");
}

function card(item) {
  const st = CATALOG_STATUSES[item.status];
  const meta = [item.formats?.[0]?.label, item.maintenanceLevel && `onderhoud ${item.maintenanceLevel}`].filter(Boolean).join(" · ");
  return h("article", { class: "card catalog-card", "data-id": item.id },
    media(item),
    h("div", { class: "catalog-card-body" },
      h("span", { class: `badge ${st.badge}`, text: st.label }),
      h("h3", {}, h("a", { href: `?product=${encodeURIComponent(item.id)}`, class: "catalog-card-link", onclick: (e) => { if (e.metaKey || e.ctrlKey) return; e.preventDefault(); openProduct(item.id); } }, item.title)),
      h("p", { class: "catalog-summary", text: item.summary }),
      meta ? h("p", { class: "catalog-meta", text: meta }) : null,
      priceLine(item),
      h("div", { class: "catalog-actions" }, compareBtn(item), saveBtn(item))));
}

function facetGroup(key, counts) {
  const values = counts[key];
  if (!values.length) return null;
  const sel = state.filters[key];
  return h("fieldset", { class: "facet" }, h("legend", { text: FACETS[key].label }),
    ...values.map(([v, n]) => {
      const id = `f-${key}-${v}`.replace(/[^a-z0-9-]/gi, "_");
      return h("label", { class: "facet-option", for: id },
        h("input", { type: "checkbox", id, checked: sel.includes(v), onchange: (e) => {
          state.filters[key] = e.target.checked ? [...sel, v] : sel.filter((x) => x !== v); writeUrl(); render(); } }),
        h("span", { text: facetLabel(key, v) }), h("span", { class: "facet-count", text: `(${n})` }));
    }));
}

let filterDialog;
function filtersPanel(counts) {
  return h("div", { class: "catalog-facets" }, ...["status", "application", "material", "maintenance", "format"].map((k) => facetGroup(k, counts)));
}

function activeChips() {
  const chips = [];
  if (state.q) chips.push(h("button", { type: "button", class: "chip chip--sm", onclick: () => { state.q = ""; writeUrl(); render(); } }, `Zoekwoord: ${state.q} `, h("span", { class: "chip-x", "aria-hidden": "true", text: "×" }), h("span", { class: "visually-hidden", text: " verwijderen" })));
  for (const [k, vals] of Object.entries(state.filters)) for (const v of vals) chips.push(h("button", { type: "button", class: "chip chip--sm", onclick: () => { state.filters[k] = vals.filter((x) => x !== v); writeUrl(); render(); } },
    `${facetLabel(k, v)} `, h("span", { class: "chip-x", "aria-hidden": "true", text: "×" }), h("span", { class: "visually-hidden", text: " filter verwijderen" })));
  if (!chips.length) return null;
  return h("div", { class: "catalog-active", "aria-label": "Actieve filters" }, ...chips,
    h("button", { type: "button", class: "link-btn", onclick: resetAll, text: "Alles wissen" }));
}
function resetAll() { state.q = ""; for (const k of Object.keys(state.filters)) state.filters[k] = []; writeUrl(); render(); announce("Alle filters gewist"); }

let live;
function announce(text) { if (live) { live.textContent = ""; setTimeout(() => { live.textContent = text; }, 30); } }

function renderList() {
  const res = results();
  const counts = facetCounts(searchCatalog(CATALOG, state.q).map((r) => r.item), state.filters);
  const nFilters = Object.values(state.filters).reduce((a, v) => a + v.length, 0);

  const search = h("input", { type: "search", id: "catalog-q", value: state.q, placeholder: "Bijv. keramiek 60x60, composiet, kunstgras", autocomplete: "off", enterkeyhint: "search" });
  let t;
  search.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => { state.q = search.value.trim(); writeUrl(); render(true); }, 220); });
  const sort = h("select", { id: "catalog-sort", onchange: (e) => { state.sort = e.target.value; writeUrl(); render(); } },
    ...Object.entries(SORTS).map(([k, s]) => h("option", { value: k, selected: k === state.sort, text: s.label })));

  const cats = h("div", { class: "catalog-cats", role: "group", "aria-label": "Categorie" },
    h("button", { type: "button", class: "chip", "aria-pressed": state.filters.category.length ? "false" : "true", onclick: () => { state.filters.category = []; writeUrl(); render(); } }, "Alles"),
    ...CATALOG_CATEGORIES.map((c) => {
      const n = counts.category.find(([v]) => v === c.id)?.[1] || 0;
      const on = state.filters.category.includes(c.id);
      return h("button", { type: "button", class: "chip", "aria-pressed": on ? "true" : "false", disabled: !n && !on,
        onclick: () => { state.filters.category = on ? state.filters.category.filter((x) => x !== c.id) : [c.id]; writeUrl(); render(); } }, `${c.label} `, h("span", { class: "facet-count", text: `(${n})` }));
    }));

  const facets = filtersPanel(counts);
  const filterBtn = h("button", { type: "button", class: "btn btn-secondary btn-sm catalog-filter-btn", "aria-haspopup": "dialog", onclick: () => openFilterDialog(facets) }, nFilters ? `Filters (${nFilters})` : "Filters");

  const grid = res.length ? h("div", { class: "catalog-grid" }, ...res.map((r) => card(r.item))) : emptyState();
  const tray = compareTray();
  const helpSort = SORTS[state.sort].help;

  root.replaceChildren(
    h("div", { class: "catalog-toolbar" },
      h("div", { class: "field catalog-search" }, h("label", { for: "catalog-q", text: "Zoek materiaal" }), search),
      h("div", { class: "field catalog-sort" }, h("label", { for: "catalog-sort", text: "Sorteren" }), sort, h("span", { class: "hint", text: helpSort })),
      filterBtn),
    cats,
    h("div", { class: "catalog-layout" },
      h("aside", { class: "catalog-aside", "aria-label": "Filters" }, facets),
      h("div", { class: "catalog-results" },
        activeChips(),
        h("p", { class: "catalog-count", id: "catalog-count", text: `${res.length} ${res.length === 1 ? "resultaat" : "resultaten"}${state.q ? ` voor “${state.q}”` : ""}` }),
        grid,
        h("p", { class: "field-hint catalog-help" }, "Twijfelt u welk materiaal past? ", h("a", { href: "../contact/?materiaal=advies", text: "Vraag materiaaladvies" }), " — ‘weet ik nog niet’ is een prima startpunt."))),
    tray, live);
  return res.length;
}

function emptyState() {
  const alt = suggest(CATALOG, state.q);
  return h("div", { class: "notice notice--empty catalog-empty" },
    h("strong", { text: "Geen materialen gevonden." }),
    h("span", {}, alt ? h("span", {}, "Bedoelde u ", h("button", { type: "button", class: "link-btn", onclick: () => { state.q = alt; writeUrl(); render(); }, text: alt }), "? ") : "",
      "Pas uw zoekwoord aan, ", h("button", { type: "button", class: "link-btn", onclick: resetAll, text: "wis alle filters" }), " of ", h("a", { href: "../contact/?materiaal=advies", text: "vraag ons om advies" }), "."));
}

function openFilterDialog(facets) {
  if (!filterDialog) {
    filterDialog = h("dialog", { class: "dialog catalog-filter-dialog", "aria-labelledby": "fd-title" });
    document.body.append(filterDialog);
    filterDialog.addEventListener("close", () => render());
  }
  filterDialog.replaceChildren(
    h("div", { class: "dialog-head" }, h("h2", { id: "fd-title", text: "Filters" }), h("button", { type: "button", class: "dialog-close", "aria-label": "Filters sluiten", onclick: () => filterDialog.close(), text: "×" })),
    h("div", { class: "dialog-body" }, facets),
    h("div", { class: "dialog-foot" }, h("button", { type: "button", class: "link-btn", onclick: () => { resetAll(); filterDialog.close(); }, text: "Alles wissen" }),
      h("button", { type: "button", class: "btn btn-primary", onclick: () => filterDialog.close() }, `Toon ${results().length} resultaten`)));
  if (typeof filterDialog.showModal === "function") filterDialog.showModal(); else filterDialog.setAttribute("open", "");
}

/* ---------------- vergelijken ---------------- */
function compareTray() {
  if (!state.compare.length) return null;
  const items = state.compare.map((id) => CATALOG.find((i) => i.id === id));
  return h("div", { class: "compare-tray", role: "region", "aria-label": "Vergelijking" },
    h("div", { class: "container compare-tray-inner" },
      h("p", { text: `Vergelijken (${items.length}/${MAX_COMPARE}): ${items.map((i) => i.title).join(", ")}` }),
      h("div", { class: "btn-row" },
        h("button", { type: "button", class: "btn btn-primary btn-sm", disabled: items.length < 2, title: items.length < 2 ? "Kies minimaal twee materialen" : null, onclick: () => openCompare(items) }, items.length < 2 ? "Kies nog één materiaal" : "Vergelijk nu"),
        h("button", { type: "button", class: "link-btn", onclick: () => { state.compare = []; writeUrl(); render(); }, text: "Leegmaken" }))));
}

function openCompare(items) {
  const rows = [
    ["Status", (i) => CATALOG_STATUSES[i.status].label],
    ["Materiaal", (i) => i.material || "onbekend"],
    ["Formaat", (i) => i.formats.map((f) => f.label).join(", ") || "per project"],
    ["Toepassing", (i) => i.application.join(", ") || "—"],
    ["Onderhoud", (i) => (i.maintenanceLevel ? `${i.maintenanceLevel}: ${i.maintenance || ""}` : i.maintenance || "onbekend")],
    ["Ondergrond", (i) => i.base || "per situatie"],
    ["Prijsreferentie", (i) => { const p = priceInfo(i, prices); return p.status === "reference" ? `${euro(p.amountCents)} ${UNIT[p.unit] || ""} (${p.domain}, ${dateNl(p.observedAt)})` : p.status === "stale" ? "verlopen, controle nodig" : "na advies"; }],
    ["Let op", (i) => i.risks || "—"]
  ];
  const dlg = h("dialog", { class: "dialog compare-dialog", "aria-labelledby": "cmp-title" },
    h("div", { class: "dialog-head" }, h("h2", { id: "cmp-title", text: "Materialen vergelijken" }), h("button", { type: "button", class: "dialog-close", "aria-label": "Vergelijking sluiten", onclick: () => dlg.close(), text: "×" })),
    h("div", { class: "dialog-body" },
      h("div", { class: "compare-grid", style: `--n:${items.length}` },
        h("div", { class: "compare-row compare-row--head" }, h("span", { class: "compare-attr", "aria-hidden": "true" }), ...items.map((i) => h("strong", { class: "compare-cell", text: i.title }))),
        ...rows.map(([label, fn]) => h("div", { class: "compare-row" }, h("span", { class: "compare-attr", text: label }), ...items.map((i) => h("span", { class: "compare-cell", "data-item": i.title, text: fn(i) }))))),
      h("p", { class: "field-hint", text: "Prijsreferenties zijn openbare prijzen van andere partijen en geen Sealcleaning-prijs. Wij adviseren; u bestelt het materiaal zelf." })));
  dlg.addEventListener("close", () => dlg.remove());
  document.body.append(dlg);
  if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
}

/* ---------------- productdetail ---------------- */
function openProduct(id) {
  if (!state.product) { lastListScroll = window.scrollY; openedFromList = true; }
  state.product = id; writeUrl(true); render();
  window.scrollTo(0, root.getBoundingClientRect().top + window.scrollY - 90);
  root.querySelector("#product-title")?.focus();
}

function renderProduct(item) {
  const st = CATALOG_STATUSES[item.status];
  const p = priceInfo(item, prices);
  const spec = (k, v) => (v == null || v === "" ? null : [h("dt", { text: k }), h("dd", { text: v })]);
  const back = h("button", { type: "button", class: "link-btn catalog-back", onclick: () => { if (openedFromList) { openedFromList = false; history.back(); setTimeout(() => window.scrollTo(0, lastListScroll), 0); } else { state.product = null; writeUrl(true); render(); } } }, "← Terug naar alle materialen");
  const qty = quantityFor(item, { m2: 1, meters: 1 }) ? qtyCalc(item) : null;
  const alts = CATALOG.filter((x) => x.id !== item.id && x.status !== "unavailable" && (x.group === item.group || x.category === item.category))
    .sort((a, b) => (b.group === item.group) - (a.group === item.group)).slice(0, 3);
  const project = item.image?.project;
  const designHref = item.quantityRule === "tiles" && item.status === "verified-product" ? `../project-samenstellen/?service=bestrating&product=${encodeURIComponent(item.id)}`
    : item.category === "schutting" ? "../project-samenstellen/?service=schutting" : item.category === "bestrating" ? "../project-samenstellen/?service=bestrating" : null;

  root.replaceChildren(
    back,
    h("article", { class: "product-detail" },
      h("div", { class: "product-media" }, media(item, "detail")),
      h("div", { class: "product-info" },
        h("span", { class: `badge ${st.badge}`, text: st.label }),
        h("h2", { id: "product-title", tabindex: "-1", text: item.title }),
        h("p", { class: "lede", text: item.summary }),
        h("p", { class: "field-hint", text: st.help }),
        h("h3", { text: "Specificaties" }),
        h("dl", { class: "specs" },
          spec("Categorie", `${CAT_LABEL[item.category]} — ${item.group}`), spec("Materiaal", item.material),
          spec("Formaat", item.formats.map((f) => f.label).join(", ")), spec("Eenheid", item.unit),
          spec("Verpakking", item.packaging || "onbekend — volgt per leverancier"), spec("Toepassing", item.application.join(", ")),
          spec("Ondergrond / opbouw", item.base), spec("Onderhoud", item.maintenance),
          spec("Beschikbaarheid", "niet gecontroleerd — wij bevestigen levertijd in de offerte"),
          item.status === "verified-product" ? spec("Leverancier (bron)", item.supplier) : null, item.sku ? spec("Artikelnummer bron", item.sku) : null),
        h("h3", { text: "Prijs" }),
        p.status === "reference"
          ? h("div", { class: "notice" }, h("strong", {}, `Marktreferentie: ${euro(p.amountCents)} ${UNIT[p.unit] || ""} ${p.vatIncluded === true ? "incl. btw" : p.vatIncluded === false ? "excl. btw" : "(btw-basis onbekend)"}`),
            h("span", {}, `Openbare prijs bij `, h("a", { href: p.sourceUrl, rel: "noopener nofollow", target: "_blank", text: p.domain }), `, peildatum ${dateNl(p.observedAt)}. Exclusief ${p.scopeExcluded.join(", ") || "levering en montage"}. Geen Sealcleaning-prijs.`))
          : h("div", { class: "notice" }, h("strong", { text: p.status === "stale" ? "Referentie verlopen" : "Prijs na advies" }), h("span", { text: "U bestelt het materiaal zelf na ons advies. De prijs hangt af van het exacte product, de hoeveelheid en de aanbieder." })),
        qty,
        item.risks ? h("div", { class: "notice notice--attention" }, h("strong", { text: "Let op" }), h("span", { text: item.risks })) : null,
        project ? h("p", {}, h("a", { class: "link-underline", href: `../projecten/${project}/`, text: "Bekijk het project waarin dit is toegepast →" })) : null,
        h("div", { class: "btn-row product-ctas" },
          h("a", { class: "btn btn-primary", href: `../contact/?materiaal=${encodeURIComponent(item.title)}`, text: "Vraag advies en een offerte voor de werkzaamheden aan" }),
          designHref ? h("a", { class: "btn btn-secondary", href: designHref, text: "Gebruik in mijn ontwerp" }) : null,
          shopButton(item),
          compareBtn(item), saveBtn(item)))),
    alts.length ? h("section", { class: "product-alts" }, h("h2", { text: item.status === "unavailable" ? "Alternatieven" : "Vergelijkbare materialen" }), h("div", { class: "catalog-grid" }, ...alts.map(card))) : null,
    compareTray(), live);
  document.title = `${item.title} — Materialen — Sealcleaning`;
}

function shopButton(item) {
  const sp = shop.open ? shop.products.get(item.id) : null;
  if (!sp) return null;
  return h("button", { type: "button", class: "btn btn-primary", onclick: (e) => { addToCart(sp.id, 1); e.currentTarget.textContent = "✓ Toegevoegd, bekijk winkelmandje"; e.currentTarget.onclick = () => location.assign("../winkelmandje/"); announce(`${item.title} toegevoegd aan uw winkelmandje (${cartCount()} artikelen)`); } }, "In winkelmandje");
}

function qtyCalc(item) {
  const isLen = item.quantityRule === "edging";
  const inp = h("input", { type: "text", inputmode: "decimal", id: "qty-in", autocomplete: "off", placeholder: isLen ? "bijv. 12,5" : "bijv. 24" });
  const out = h("p", { class: "qty-out", role: "status", "aria-live": "polite" });
  inp.addEventListener("input", () => {
    const v = parseFloat(inp.value.replace(",", "."));
    const r = quantityFor(item, isLen ? { meters: v } : { m2: v });
    out.replaceChildren(r ? h("span", {}, h("strong", { class: "num", text: `${r.qty.toLocaleString("nl-NL")} ${r.unit}` }), ` — ${r.note}. Indicatie; de exacte hoeveelheid volgt uit de inmeting.`) : inp.value ? h("span", { text: `Vul een ${isLen ? "lengte in meters" : "oppervlak in m²"} tussen 0 en 10.000 in.` }) : "");
  });
  return h("div", { class: "qty-calc card" }, h("h3", { text: "Hoeveel heb ik nodig?" }),
    h("div", { class: "field" }, h("label", { for: "qty-in", text: isLen ? "Lengte in meters" : "Oppervlak in m²" }), inp), out);
}

/* ---------------- render ---------------- */
function render(keepFocus) {
  const focusId = keepFocus ? document.activeElement?.id : null;
  const caret = focusId === "catalog-q" ? document.activeElement.selectionStart : null;
  const item = state.product ? CATALOG.find((i) => i.id === state.product) : null;
  if (item) renderProduct(item);
  else {
    document.title = "Materialen kiezen en vergelijken — Sealcleaning";
    const n = renderList();
    if (keepFocus) announce(`${n} ${n === 1 ? "resultaat" : "resultaten"}`);
  }
  if (focusId) { const el = document.getElementById(focusId); if (el) { el.focus(); if (caret != null) el.setSelectionRange(caret, caret); } }
}

window.addEventListener("popstate", () => { state = readUrl(); render(); });

(async function init() {
  live = h("p", { class: "visually-hidden", role: "status", "aria-live": "polite" });
  try { prices = await (await fetch("../data/price-sources.json")).json(); }
  catch { prices = { rows: [] }; }
  try {
    const cfg = await shopConfig();
    if (cfg.checkoutOpen) {
      const list = await (await fetch(apiBase() + "/api/public/shop/products", { credentials: "omit" })).json();
      shop = { open: true, products: new Map(list.products.filter((x) => x.catalogId).map((x) => [x.catalogId, x])) };
    }
  } catch { /* winkel niet bereikbaar: catalogus blijft werken als informatiebron */ }
  render();
})();
