# Atelier 1.20 — ProjectLens / 2026-09-21

## Published work

- ProjectLens 0.1.0: `https://github.com/ChefDavid0815/projectlens`.
- Existing Windows x64 portable release published with SHA-256. Signature status: `NotSigned`.
- GitHub release reports the same executable digest as the local file: `a994488729bf6862c219e8ddf6094d3d43e6e582ffbdce7828887be52d5bc0d8` (101,952,241 bytes).
- The software currently depends on Electron for directory access. No standalone scanner website was deployed. Portfolio content explicitly distinguishes the exhibition from the desktop scanner.

## Basic software checks, as requested

- Existing scanner tests: 3/3 pass (redaction, project foundations, ignored directories/duplicate files).
- Vite production build and TypeScript validation pass.
- Initial frontend inspected in the browser. The capture is the actual empty workspace, not a fabricated scan report.
- Existing GitHub CI completed successfully after source publication.
- No packaged-app end-to-end scan, broad project compatibility testing or security audit was performed.

## Portfolio

- New graphite/mint/ice-blue full-width exhibit with a procedural Three.js optical instrument, metal rim, translucent lens, code plates, scanning line, pointer parallax and three selectable feature perspectives.
- Same visual identity in a four-chapter bilingual post, chronological overview, Now milestone 013 and bilingual GitHub README artwork.
- Shared site motion preference, reduced-motion handling, viewport-based rendering, DPR cap and renderer disposal on translated/removed nodes. Existing project identities remain intact.
- Reproducible SVG cover source: `scripts/create-projectlens-art.py`.

## Local verification

- `npm run build:atelier`, `npm run check`, and `npm run test:motion` pass.
- Desktop Gallery: real rendered optical canvas, no horizontal overflow; mode switching updates the selected button, visible panel and optical accent.
- Detail modal displays the actual interface; screenshot link loads; Escape closes it.
- 390 px checks: Gallery, Now, Posts and ProjectLens reader all have zero horizontal overflow. Detail modal also has zero horizontal overflow.
- English switch updates the exhibit and creates only one new active optical canvas. Shared pause sets both motion state and CSS animations to paused, then resumes.
- Post overview shows eight articles with ProjectLens first; its reader has four chapters in both authored languages. Now has 13 entries, latest date 2026-09-21.
- Desktop screenshots inspected for Gallery, Now and the article. SVG cover visually inspected in the browser.

## Production verification

- Vercel deployment `dpl_7MwP3mgZ4GykjPRaGGQBzwL1CChX` reports `READY`, with `https://chefzc-homepage.vercel.app` assigned as the production alias.
- Four main publication routes and ten supporting data/artwork files return HTTP 200 with SHA-256 identical to local release files.
- The production Gallery renders all five real projects and one active optical canvas, with no horizontal overflow. Switching to Report updates the visible feature panel. No browser warnings or errors were captured.
- GitHub project page loads both original cover artwork (1600 × 900) and the real initial interface (1264 × 860); the English README entry is present. The separate GitHub profile repository was also pushed successfully.
- Delivery capture: `E:/个人项目/.release-work/projectlens-publication/gallery.jpg`.

## Limits

Procedural artwork is illustrative and never scans visitors' files. Performance was checked on this computer at desktop and emulated narrow widths, not on physical low-end mobile hardware. Static artwork remains available if WebGL cannot initialise.
