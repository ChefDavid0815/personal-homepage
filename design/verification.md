# Atlas 0.3 presentation verification

Date: 2026-09-23. Local static server: `http://127.0.0.1:4173`.

- Opened Gallery `#project-atlas`, Now `#milestone-atlas`, Posts and `post.html?article=atlas` in the Codex in-app Chromium browser on Windows. Inspected desktop and narrow screenshots, Chinese and English copy, and the Atlas application's existing visual language.
- At CSS viewport widths 360, 390, 768 and 1440, all four routes rendered the Atlas artwork and had no document-level horizontal overflow.
- Gallery: switched from sky to manuscript and index; opened the project folio and closed it with both the close button and Escape. The plate button `aria-pressed` and figure number updated. Opened and paused the site's motion control, then resumed it. Browser warning/error log was empty during this interaction pass.
- The Now milestone kept the site's chronological structure. The latest Posts entry retained its journal order; the Atlas article displayed the matching art and readable English/Chinese text.
- `npm run check` passed; the check script includes the new Atlas JavaScript files.

These are local browser and syntax checks. The editorial constellations do not claim to show the application's actual node coordinates. 200% browser zoom and hardware frame times were not measured.

Production deployment `dpl_Gxp4GuCiCEtrXSaPNeXDVdYfJjjS` reported `READY` and was aliased to `https://chefzc.dev`. In a fresh online browser pass, Gallery, Now, Posts and the Atlas article all rendered the new Atlas elements, had no document-level horizontal overflow at 1440 CSS px, and recorded no browser warnings or errors. The Gallery hero image loaded at its real pixel dimensions.


## 川流不息 · 2026-10-07

Local redesign candidate, with the existing site content preserved. Source of truth: `design-contract.json`; editable art direction: `flow-board.svg`; generated asset and exact prompt: `flow-assets.json`.

- 14 original HTML pages retain their original text, links and IDs; 359 original content/asset files retain their hashes.
- 15 behavior tests, 39 responsive cases and 9 project-modal paths passed.
- The rendered route graph covers 26 pages/readers, 951 internal links and 176 fragment targets; local HTTP checks cover 111 pages/assets.
- The flow index provides 39 real destinations. Project views are shareable, Back closes a detail, article return restores its stable card, and Atlas retains its plate when changing language.
- Shared engine chunks removed the observed repeated Three.js import warning; global language and motion state have one owner.

Evidence: `flow-delivery-verification.json`, `flow-route-verification.json`, `flow-responsive-verification.json`, `flow-navigation-verification.json`, `flow-hardening-verification.json`, `flow-engine-verification.json`, `flow-code-manifest.json` and `flow-qa/`.

The nine-perspective review is a single-agent simulation, without independent experts or numerical award scores. Physical phones/Safari, screen-reader speech, forced colours, 200% text zoom and hardware Web Vitals remain unverified. Production deployment and Awwwards submission were outside this local scope.


## 2026-10-07 · user art and readability revision

The green asterisk raster is retired from the served site and archived with its original SHA-256. Only exact approved decorative glyph, image URL and alt-text substitutions are allowed in protected authored data; the content verifier checks these separately. The current result preserves all 14 original HTML text/link/ID inventories, 356 unchanged frozen files and 2 explicitly revised decorative data sources.

The motto is a blue typographic poster with a separate current drawing. Exhibit shapes, materials and typography retain each project identity. Now keeps all 27 entries and the original chronology, with project-specific paper tones and heading fonts. CHROMA retains its pixel/chrome visual system and replaces jagged bursts with an editable signal disc.

Actual browser inspection covers 13 pages, 15 readers and 9 project dialogs. Computed text-color checks report zero warnings; this is a CSS heuristic, with selected image/gradient compositions also visually inspected. All 42 responsive cases have no document or checked reading-region overflow. An observed motion-off regression (dialog opacity 0) is repaired: all 9 actual dialogs now have opacity 1 while motion is paused. The new disc was observed moving and paused using the real site control.

Current evidence: flow-art-revision-verification.json, flow-contrast-after.json, flow-reader-contrast.json, flow-dialog-contrast.json, flow-responsive-revision.json, flow-expression-motion.json and flow-qa/. Editable geometry: ../dist/assets/flow/river-loop.svg and chroma-signal-disc.svg; original project content/assets and embedded apps remain protected. Production was not changed.


## 2026-10-07 · reading and spacing correction

The prior contrast pass did not cover direct div/b/figcaption text or resolve dark gradient backgrounds. User feedback and actual screenshots reproduced unreadable sport descriptions. This pass supersedes the earlier readability conclusion: both sport panels now own explicit dark surfaces and light text; body copy is 16px with 30.4px line height and generous insets.

All 13 main pages, 15 readers and 9 visible project dialogs were examined, including expanded native detail panels. The updated check includes direct container text and conservative gradient/image bounds, with a separate 3:1 graphic-symbol criterion. It reports no unresolved warnings; this is not a WCAG certification. Actual profile sections were visually inspected from hero through footer, and usage/cards/captions were revised. All 44 responsive cases pass; 320px English metrics and cumulative metric values were also checked without clipping. The profile NeRF banner was rechecked at 320px and 360px after adding horizontal insets. Original content and project identities remain preserved.

Current evidence: flow-spacing-verification.json, reading-inspector.js, flow-reading-pass.json, flow-reading-readers.json, flow-reading-dialogs.json, flow-spacing-responsive.json and flow-qa/. The preview remains local.
