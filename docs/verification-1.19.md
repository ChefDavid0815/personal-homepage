# Atelier 1.19 verification / 2026-09-21

## Scope

- Shared frame and scene layer across Profile, Gallery, School Lab, 3D collection, Game, Now, Posts, article readers and Pulse.
- Real procedural WebGL sculpture in Profile; frame cap, on-demand import, static fallback and common motion preference.
- Four physical neon tubes for NBA 2K27; spectrum/ice/pink palette selection, sockets, cores, surrounding light and local low-frequency dimming.
- Procedural album-cover animation and bilingual cover theatre, retaining the 62 original artwork files. No generated walking performance or official music video is claimed.

## Local verification

- `npm run build:atelier` and `npm run check` pass.
- Existing motion-state test passes; all three game-data tests pass.
- Desktop browser: real sculpture canvas rendered, no captured shader or runtime errors. Festival and Folio artwork and the Now header/timeline were inspected as rendered pages, retaining their separate palettes.
- Responsive checks: eight main/reader routes at 390 px; decorative overflow found in the Profile/Gallery/Posts mastheads was corrected and rechecked. Profile, Gallery, Game and Pulse also report zero horizontal overflow at 360 px, with all six navigation destinations present.
- All seven article themes checked at 390 px: zero horizontal overflow, original 3/4 chapter count preserved, no broken loaded images observed.
- NBA desktop: four rendered tubes at 16 px; narrow screen: 13 px; zero horizontal overflow. Pink-mode selection updates the active state and actual tube color. Desktop/mobile screenshots show a white core, colored halo, metal holders and cover reflections.
- Cover theatre checked in English on desktop and Chinese on mobile. Both favourite albums select their own treatment (`earth` / `garden`), use the original cover, and render real canvases. Mobile dialog has zero horizontal overflow. Pause/resume works; Escape closes and restores focus to the opener.
- The school field-book still switches to the stairs scene. Shared pause survives navigation to Game, where the tube animation becomes `none` and the page motion state is `off`; resuming restores both common and page state.
- The temporary visual contact sheet used to inspect covers was removed before publication.

## Production verification

- Published to `https://chefzc-homepage.vercel.app` on 2026-09-21; Vercel deployment `dpl_GpR2Fjh9huGjr91hqVV94sF5nHTu` reports `READY` with the production alias assigned.
- All eight main HTML routes and all six new visual assets return HTTP 200. SHA-256 of each published response matches the local release file.
- Production browser: the Profile sculpture reaches `is-rendered` with a real canvas; Game has four rendered neon tubes and no horizontal overflow; the cover theatre opens with the original artwork and four initialized cover canvases. No captured browser warnings or errors during these checks.

## Limits

Performance was checked functionally on this computer and at emulated browser widths, not on physical low-end phones. Offline artwork and WebGL fallback paths are implemented; actual reduced-motion state ownership is covered by the shared motion test. The shader animation is an interpretation of the original cover; a real walking character would require a separate video-generation workflow that is not available in this session. QQ Music playback remains subject to its existing platform constraints.
