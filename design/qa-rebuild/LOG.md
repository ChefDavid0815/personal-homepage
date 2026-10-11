# Exhibit rebuild log (Current 2.1, solo pass)

## DOT/AIR
- Adobe Fonts kit `mps7cmb` ("ChefZC exhibits"): Acumin Pro Wide, the software's own heading face (DOT/AIR web uses acumin-pro-wide 900). Linked with data-project-style on gallery/now/posts/post.
- New `dist/dot-air-motion.js` (imported by dot-air-art.js): canvas halftone sky field behind EVERY FLIGHT (diagonal fill-in entrance, cursor lens that swells and parts dots, yellow ripple from the globe when a viewpoint is picked); split-flap departure board (From DXB → To, great-circle km computed from the airport coordinates); magnetic fleet discs (dots repel from the pointer and spring back); Flight DNA composer from the real onboarding wizard (8 questions, radio/multi, keyboard arrows, strand punch-card); cycling flap board in Now/Post windows.
- Edition journal entries become boarding passes (perforated stub, date, dot barcode); the orbiting edition seal kept.
- `dotAirDna` added to dot-air-content.js (labels verbatim from DOT/AIR web/Algorithm.tsx).
- `flow-rebuild.css`: new last-loaded layer for the solo rebuild.
- Journal tokens `--jr-strong/--jr-mid` no longer hard-code JueJiangHei/GongLuTi; they use var(--body) (DM Sans + Huiwen Mincho).

## Roseraie
- New `dist/roseraie-atelier.js` (imported by roseraie-exhibit-v2.js and roseraie-post-art-v2.js): canvas petal field (the app's Atmosphere petals; tumble via flip-scale, cursor wind) in the hero, Now windows and post cover; silver filigree corners that draw in around the hero window and the capture stage; Sol / Astra / Luna radio medallion (keyboard arrows); woven threads for Weave; closing rosette drawn by scroll.
- Triptych → three porcelain oval medallions (beaded double frame, blooming nine-petal rose from the app's ornaments.tsx). All original labels kept.

## Shared follow-ups from the rooms agent
- flow-current.css finale: 9–10px micro text and −0.02em CJK tracking (fix in shell).
- Check repaired 让 glyph made it into the shipped subset.

## Atlas
- `dist/atlas-sky-data.js` generated from Atlas 0.3 catalog.ts (7 groups, 33 subjects, 241 topics, 20 relations; zh subject names are the standard IB Chinese course names).
- New `dist/atlas-chart.js`: the sky plate's decorative 8-point network replaced by the real Diploma constellation on canvas (group seals in roman numerals, subject stars sized by topic count in group colours, topic dust, dashed gold cross-topic relations); entrance reveal, pointer parallax, hover a star to light its topics and read its name and topic count; ledger figures (784 / 1,059 / 241) count up once.

## CHROMA
- New `dist/chroma-scope.js` (imported by chroma-exhibit.js): pixel-mosaic signal scope under the channel selector, in the app's tile colours; each channel plays its own simulated trace (CPU load waves, GPU frame bursts, RAM stepped fill), pointer adds gain; labelled SIMULATED SIGNAL (the room already states it never reads visitor hardware). Panel recolours with the channel.

## ProjectLens
- New `dist/lens-loupe.js` (imported by projectlens-exhibit.js): a mint glass loupe that follows the pointer over the real interface capture (exhibit plate and detail dialog) and magnifies it 2.6×, the app's "把线索，放大" made literal. Mouse/pen only; hidden on touch.

## AFTERIMAGE
- New `dist/afterimage-trails.js` (imported by afterimage-motion.js): long-exposure light trails (red tail-light streak with white core, tapered, 0.9 s life) following the pointer over the hero photograph; ghost afterimages sliding off each photograph on hover; 23 / 115 / 139 count up once.

## Festival Toolkit
- New `dist/festival-weather.js` (imported by festival-exhibit.js): the season switch now changes the weather over the room on canvas — summer light motes rising, autumn leaves tumbling, winter snow, spring blossom — fading in on each change; a still scatter remains with motion off.
- The seven woven wristband ribbons breathe (staggered, motion-guarded).

## AXIOM
- New `dist/axiom-fit.js` (imported by axiom-exhibit.js): Figure 01 is now a working instrument. The 12 Hooke's-law observations are draggable (pointer) and adjustable (focus + arrow keys, role=slider); the least-squares line, gradient triangle, k, the fitted equation and R² recompute live (reads k = 50.05 N/m, R² = 0.9998 at rest, matching the app's own example). Reset data restores the observations.

## Folio
- New `dist/folio-turn.js` (imported by folio-exhibit.js): choosing an index entry turns the old top page off its spine (3D rotateY from the left edge) before it settles back into the stack; the stack fans on hover; pages get a soft spine shadow.

## NBA After Hours
- New `dist/court-shot.js` (imported by court-exhibit.js): shoot around on the night court. Click the court (or "投一球 / Take a shot") and a ball arcs to a rim with projectile physics — swish (lime ripple), rim-out or a bank off the glass — with a makes / shots board. Motion off: the shot resolves instantly.

## Homepage 器 (owner request)
- Toolkit row: added Claude and Claude Code chips (orange starburst mark).
- Claude-chan sticker (`dist/assets/claude/claude-chan.webp`): owner-supplied art, background removed with Adobe Photoshop (image_remove_background) plus a local clean-up of hair gaps; peeks over the toolkit ledge with a white sticker outline, idle sway, twinkling spark, hover bubble `setup.claudeChan` (今天也一起写点什么吧？ / Shall we build something today?). Toolkit row clip-path reveal disabled so she isn't clipped.

## School Lab (NABAT / NeRF / STRIDE)
- New `dist/school-signatures.js` (imported by school-gallery.js): NABAT specimen tag answers with NFC ripples (once on view, then on hover); NeRF casts camera rays from the pointer through the specimen plate with volume samples that brighten near the scene; STRIDE sweeps a perception sonar under the pointer that lights what it reaches.
- flow-rebuild.css now also linked on school-gallery.html.

## Windows (Now + Posts covers)
- Every plate answers a hover with its project's signature: CHROMA meter blinks, Atlas orrery turns and the fresco breathes, ProjectLens lens tilts and zooms, line-art plates (NABAT circuit, NeRF rays, Festival journey/garage, Court, IB, Agents) trace like flowing data, AfterImage plates get a tail-light streak, photographic plates lift. DOT/AIR windows carry the cycling split-flap board, Roseraie windows the petal field.
- 器 rebuilt (owner request, round 2): every device gets a line drawing that draws in — ROG Strix G laptop with three streamlines on screen and a flowing RGB keyboard light, iPad Pro writing 川 with an Apple Pencil on hover, iPhone 15 Pro Max whose Dynamic Island widens and screen pulses on hover. The toolkit is now a dock (`dist/home-dock.js`, magnifies under the pointer, tiles pop in with stagger) in two groups: AI partners (ChatGPT Pro, Codex, Claude, Claude Code, Claude Max) and Design & media (Figma, Photoshop, Illustrator, After Effects, Premiere Pro, Audition, Media Encoder — the Adobe apps installed on F: — plus Adobe Fonts). Icons are hand-drawn SVG marks in each app's colours. `.h-rig-cap` raised to 12px.
- 2026-10-10: Now entry 030 and post `current-2` (Current 2.0 release note) with `current-release.js` / `current-release-art.js`: the homepage streamline field reused in the window, flowing around a Cesso "2.0" (new optional `density` in mountCurrentField).
- 2026-10-10: hero companion — chibi Claude-chan sticker (owner art, Photoshop cutout, `dist/assets/claude/claude-chibi.webp`) beside the stir hint; stick-on entrance, gentle float, hover bubble `home.buddy`.
- 2026-10-10: DOT/AIR 1.2 (Airline Identity) and 2.0 (The White Room) — Now entries 031/032, two new boarding passes in the edition journal (route 2.0 ← 1.2 ← 1.1 ← 0.1), exhibit current-version copy and plate moved to 2.0 (1.1 web capture kept in the detail dialog); new windows: 1.2 fins + airline flap board, 2.0 White Room (Swiss grid, glossy dotted planet, floor shadow, vertical 白之间, red-circle reveal, obliteration dots on hover); font kit bpr2xmr adds Neue Haas Grotesk Display.
- 2026-10-10: Code film 01, 《没了我你依然拥有太阳》 — new gallery room 代码影像 (`#code-films`, ROOM INDEX 01—05) built by `sun-mv-exhibit.js`: a live WebGL2 stage (`sun-mv-stage.js`) writes the poster calligraphy in its real stroke order from baked per-pixel time + SDF textures, lit by a realistic sun (granulated photosphere, limb darkening, rotating sunspots, chromosphere, prominences, coronal streamers; owner asked for a real sun instead of the seal), with pointer light on old ink, click crack, dissolve to embers; torn-paper theater with tear transition between muted excerpts (opening with brush sound, the seal-sun after the tear, the star, ash), 15-scene film map with playhead, song credits/interpretation, making-of. Now 033, post `sun-mv` (note 19), window art with the rendered sun (`sun.webp`, screen-blended). Copyright: no lyrics, no song audio; excerpts showing readable lyric lines (sheet, field, scrolls, ink blots, shatter) were cut and the full film is not published. Source repo: github.com/ChefDavid0815/the-sun-mv (code, README in the film's ink style, lyric-free stills).
- 2026-10-11: Films hall (`films.html`, 影像作品, fifth room in `collectionDestinations` and a `films` route) now holds both code films; the 《没了我你依然拥有太阳》 room moved out of gallery.html (old `#code-films` links redirect to `films.html#sun-mv`). New room for Code film 02 《周旋》 (王以太 & 艾热AIR): live Canvas stage (`zhouxuan-heart.js`) — the film's crayon-thread heart ported from its implicit-surface code, 100 precessing threads, beating at the song's 123 BPM on 15 taut lines that thrum each beat, sag with its sway, pluck when swept and take a new thread on click; the crayon title 周旋 written in the film's real 19-stroke order, then tethered to the heart. Screen hung from a nail on two crayon strings that swings through a circling wipe between lyric-free excerpts (cold open with crayon sound, prelude, interlude record, outro); film map drawn as one thread with a loop per section (coloured where the cover heart is on screen). Now 034, post `zhouxuan` (note 20), live heart window art. No lyrics, no song audio, no full film.
