# Atlas 0.3 presentation verification

Date: 2026-09-23. Local static server: `http://127.0.0.1:4173`.

- Opened Gallery `#project-atlas`, Now `#milestone-atlas`, Posts and `post.html?article=atlas` in the Codex in-app Chromium browser on Windows. Inspected desktop and narrow screenshots, Chinese and English copy, and the Atlas application's existing visual language.
- At CSS viewport widths 360, 390, 768 and 1440, all four routes rendered the Atlas artwork and had no document-level horizontal overflow.
- Gallery: switched from sky to manuscript and index; opened the project folio and closed it with both the close button and Escape. The plate button `aria-pressed` and figure number updated. Opened and paused the site's motion control, then resumed it. Browser warning/error log was empty during this interaction pass.
- The Now milestone kept the site's chronological structure. The latest Posts entry retained its journal order; the Atlas article displayed the matching art and readable English/Chinese text.
- `npm run check` passed; the check script includes the new Atlas JavaScript files.

These are local browser and syntax checks. The editorial constellations do not claim to show the application's actual node coordinates. 200% browser zoom and hardware frame times were not measured.

Production deployment `dpl_Gxp4GuCiCEtrXSaPNeXDVdYfJjjS` reported `READY` and was aliased to `https://chefzc.dev`. In a fresh online browser pass, Gallery, Now, Posts and the Atlas article all rendered the new Atlas elements, had no document-level horizontal overflow at 1440 CSS px, and recorded no browser warnings or errors. The Gallery hero image loaded at its real pixel dimensions.
