# Vendored dependency: three.js

- **Package:** `three`
- **Version:** 0.186.1 (pinned; fetched from the official npm registry on 2026-10-07)
- **Files included:** `three.module.js` + `three.core.js` (the ESM build; `three.module.js` re-exports from `three.core.js`, both are required), `examples/jsm/controls/OrbitControls.js`
- **License:** MIT — see `LICENSE` in this directory (unmodified upstream file)
- **Why vendored:** docs/SEAL_BUILD_BRIEF.md ch.16 requires a pinned, unmodified
  Three.js build rather than an unpinned CDN import, with license attribution.
- **How it's wired:** `project-samenstellen/index.html` declares an import map
  mapping the bare specifier `three` to `../vendor/three/three.module.js`, so
  `OrbitControls.js` (which imports `from 'three'` unmodified) resolves
  correctly without patching the upstream file.
- **Upgrading:** re-run `npm pack three@<version>`, replace these two files and
  LICENSE, update the version/date above, and re-test the configurator.
