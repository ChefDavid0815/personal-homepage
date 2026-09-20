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
