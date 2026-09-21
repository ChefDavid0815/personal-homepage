# Atelier / Shared visual and motion system

Version 1.18 unifies the site's frame while retaining every project's identity.

- Shared glass navigation, six destinations, bilingual footer directory, reading progress and back-to-top control.
- Profile: iridescent identity card, sculpture-like asterisk, framed sports photography, vinyl-inspired music display and device material accents.
- Gallery: Folio's paper and terracotta, AXIOM's plotting grid, Festival's mint/pink/blue tickets, NBA's midnight court, STRIDE's forest and the model collection's bold pop glass remain distinct.
- Now: consistent timeline spacing, with each milestone retaining its own art window and light/dark palette.
- Posts: chronological layout, roomier reading columns, active chapter navigation and theme-specific paper/ink treatments.
- Pulse: mint glass with blue cached-input bars and pink output. Its decorative signal sculpture is artwork, not a live token meter.

`dist/atelier.css` is loaded after each page's original styles; `atelier.js` provides shared enhancement. `motion-state.js` owns the persistent motion preference. Existing school, Game and Courtside controls use that same state. OS reduced-motion always takes priority. Text is visible without animation, hidden tabs pause decorative motion, offscreen scenes sleep, and pointer lighting uses a single queued frame rather than a continuous loop. Native cross-document transitions progressively enhance navigation; unsupported browsers retain normal navigation.

真实内容与各项目独有的美术语言保持不变。统一的是导航、留白、交互节奏、阅读层次和动效控制；不同展柜仍保留纸张、森林、科技图表与篮球波普的独立表达。

## Edition 1.19 — physical objects and directed light

The second edition adds `atelier-scenes.css/js` after the shared frame. The scene layer adds contour artwork, sculptural collection links, a compact project guide, profile chapters, a typographic finale, pointer-directed reflections and small scroll-linked shifts in artwork. Text does not move independently while being read. Folio remains warm paper, AXIOM lime/cobalt, Festival pastel mint/blue/pink, STRIDE woodland, and Courtside bold basketball pop art. Dialogs and chronologically ordered posts retain the original content.

The profile window contains an actual procedural Three.js sculpture: pearl/iridescent knot, two metallic orbits and small satellites. `scripts/atelier-sculpture.js` is built with `npm run build:atelier` into the committed `dist/atelier-sculpture.bundle.js`. The module is imported only near its viewport, capped around 30 fps with DPR at most 1.5, and stops outside the viewport or when motion is paused. A static mark survives WebGL failure. No external model or image service is required.

`neon-room.css` gives NBA 2K27 four 16 px desktop / 13 px narrow-screen glass tubes, white cores, colored spill, metal sockets and a reflective cover sleeve. Spectrum/ice/pink controls still own the palette. One segment briefly dims over a 13-second cycle; the whole screen never flashes. Paused and reduced-motion states keep a steady illuminated installation.

`music-cover-art.js/css` creates a procedural cinemagraph using the real album image as its texture. All 62 distinct covers were visually inspected; named treatments are assigned by cover ID, with a restrained portrait treatment as fallback. The two favourite albums are immediately selectable in the cover theatre. The main sleeve and favourites also animate in place. The browser does not upload artwork or request generation services. This does **not** synthesize a walking person or constitute official animated artwork or a music video; the theatre makes the distinction explicit in both languages. The treatment adds local light, mist, particles, fine texture movement and small perspective shifts while retaining recognizable faces and cover typography.

Cover rendering uses one scheduler capped around 24 fps. Only visible, ready canvases render; opening the theatre suspends the underlying covers. Existing canvases/textures/observers are disposed when language changes replace the favourite-album DOM. A missing WebGL context, shader failure or context loss leaves the original image readable. Global pause, reduced-motion and hidden-tab state stop the scheduler. The theatre also offers a separate hold/resume control, Escape/backdrop close, and focus restoration.
