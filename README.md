# ChefZC — Digital space

**English** · [简体中文](README.zh-CN.md)

A personal website for the things I love and make: a dark digital canvas with lime, electric blue, violet and warm accents. Each real project gets its own art direction: a midnight basketball court for **NBA After Hours**, a warm paper journal for **Folio**, a lime/cobalt scientific exhibition for **AXIOM**, and a mint/blue/pink festival pass for **Festival Toolkit**.

[**Enter my space ↗**](https://chefzc-homepage.vercel.app) · [Gallery](https://chefzc-homepage.vercel.app/gallery.html) · [Posts](https://chefzc-homepage.vercel.app/posts.html) · [Now](https://chefzc-homepage.vercel.app/now.html) · [Game](https://chefzc-homepage.vercel.app/game.html)

## Game room / Life in play

A new [Game page](https://chefzc-homepage.vercel.app/game.html): FH6 in lime, cobalt and pink with Tokyo pop art; NBA 2K27 in a glass cover sleeve with animated RGB court lighting. Three official FH6 scenes, three NBA lighting looks, motion controls and bilingual copy. Only verified local records are shown; FH6 collection counts are explicitly historical. Unknown currency balances are omitted. [Data provenance and offline refresh](docs/game-room.md).

## The collection

| Page | Inside |
| :--- | :--- |
| **Personal Profile** | ChefZC, a Year 12 IB student at GEMS Wellington International School in Dubai. Basketball, motorsport, AI, art, devices, milestones and public contact links. Only the city is shown as a location. |
| **Gallery** | Four real projects: Festival Toolkit 0.2.0, AXIOM 1.0, Folio 1.1 and NBA After Hours. Actual application/game screenshots, independent visual identities, project dialogs, source and download/play links. |
| **3D collection** | Two independent works: Chase Center (switchable interior/exterior cases) and a Curry head study. Real, draggable glass cases with free modeling downloads. |
| **School Lab** | A separate `school-gallery.html` collection for school work. WIS TECH TANK · STRIDE has a woodland exhibition, three illustrated scene states, a real interface capture, web/source links and a simulation journal. |
| **Now** | A chronological journal, newest first. Twelve milestones, with the 3D collection and Festival Toolkit 0.2 and its version journal on September 20, 2026. |
| **Posts** | Seven bilingual essays, including the Courtside 3D collection: opening this website, NBA After Hours, Folio 1.0, AXIOM 1.0, Festival Toolkit 0.1.1 and STRIDE 0.2.0. An overview, individual articles, contents, reading progress and related notes. |

`index.html` redirects to `profile.html`, retaining the query and fragment. Navigation, language preference and footer are shared. The site defaults to Chinese; the **中 / EN** switch translates navigation, copy, dialogs and page titles. Preference persists when local storage is available and synchronises across same-origin tabs. Brand names and decorative artwork retain their original design.

## WIS TECH TANK / A separate school lab

[STRIDE](https://chefzc-wis-tech-tank.vercel.app) is a bilingual classroom environment simulator. The **Personal collection / School lab** navigation separates the four main personal projects from school work. The school page keeps the site's dark shell and uses forest green, warm paper, an original woodland artwork, drifting light, sensing rings and a field-book scene selector. Three exhibition illustrations explain pavement, stairs and uncertainty; the actual app offers nine scenarios. The exhibit is not a live sensor feed.

Motion can be paused and respects `prefers-reduced-motion`; the screenshot dialog supports Escape and restores focus. Chinese/English switching preserves the selected exhibit scene. The Now milestone and sixth Post share the natural art direction. `wis-content.js`, `wis-exhibit.js`, `wis-post.js`, `school-gallery.js` and `wis.css` contain the feature. [Artwork provenance and generation prompt](dist/assets/projects/wis-tech-tank/ARTWORK.md).

## Folio 1.1 — a new page

The exhibition uses cream paper, terracotta, serif type, layered sheets and subtle hover motion. An expandable **version journal** shows 1.1 and 1.0, release dates, changes and their respective downloads. It works with the keyboard, stays open when switching language, and can be linked directly at `gallery.html#folio-history`.

Three 1.1 screenshots show the in-app journal, FH6 collection and Nexus reading room. **FH6 uses controlled samples; Nexus works, authors and covers in the screenshot are test fixtures, not live listings.** They are actual UI captures, stored under `dist/assets/projects/folio/v1.1/`. Original 1.0 screenshots and the September 17 launch article remain historical records.

Folio's local file operations require its Windows app. Nexus personal API key support is implemented, but app registration is incomplete, SSO is unavailable, and live accounts/downloads and in-game compatibility are unverified. [Folio documentation](https://github.com/ChefDavid0815/folio-mod-studio).

## NBA After Hours

[Play in the browser](https://chefzc-homepage.vercel.app/play/nba-after-hours/) or inspect the [separate source repository](https://github.com/ChefDavid0815/nba-after-hours). `dist/play/nba-after-hours/` is a static release snapshot with `release.json` and dependency licences. It needs no backend or API. Saves belong to the current browser and do not automatically sync with desktop copies.

To update: build the game in its source directory, then run `node scripts/import-game.mjs "path-to-game-source"` here. Inspect and deploy the resulting snapshot. Screenshots are under `dist/assets/projects/nba-after-hours/`; exhibition styles live in `gallery-court.css`.

## A personal record shelf

The music section has **9 artists, 84 selected songs**, real portraits/album covers and two favourite albums: Joker Xue's《守村人》and Jay Chou's《七里香》. Jay Chou, Joker Xue, G.E.M., David Tao, Eason Chan, Vae Xu, Jane Zhang and JJ Lin have ten selections each; Menni has《哀人 (i)》《抑人 (e)》《巴拉莱卡（The Rod）》and《没有了 (The End)》. Official song titles and collaboration credits are preserved.

Covers rotate every 12 seconds within the selected artist or all songs. Hover, keyboard focus, hidden tabs and an open player pause rotation. Reduced-motion preference disables automatic rotation by default. Search, filtering, paging, manual next/previous and shuffle are available; changing the displayed card does not replace an open player.

The optional player loads QQ Music's official iframe only after a click. Playback needs its own official controls and is subject to login, membership, licensing and region. An official song link is offered if loading fails. **Successful embedded playback has not been verified.** The site does not read login state, cookies, passwords or membership credentials, sync private playlists, or host audio. Closing removes the iframe.

Music metadata and 71 local images have a source manifest at `dist/assets/music/sources.json`. Images belong to their respective rights holders and do not inherit the sports-photo Creative Commons licences. `scripts/import-music.mjs` imports an already verified local manifest; it does not run private search APIs in visitors' browsers.

## Run locally

Requires Node.js. No dependency installation or compilation is needed for this static site.

```powershell
git clone https://github.com/ChefDavid0815/personal-homepage.git
cd personal-homepage
npm run dev       # http://127.0.0.1:4173
npm run check     # JavaScript syntax checks
```

`dist/` is the complete website. `vercel.json` runs `npm run check` and deploys that directory. The website version **1.17.0** is separate from Folio's **1.1.0**.

## Maintain the space

| Files | Purpose |
| :--- | :--- |
| `dist/projects.js` | Real project list; tags, source/play links and per-language overrides. Count is generated from the list. |
| `dist/folio-releases.js` | Folio current version, immutable dates and bilingual history; newest first. |
| `dist/folio-exhibit.js`, `folio-content.js`, `gallery-folio.css`, `folio-history.css` | Folio exhibition, screenshots, translations and journal. |
| `dist/gallery.js`, `gallery.css`, `gallery.html` | Gallery rendering, native project dialog and layout. |
| `dist/posts-data.js`, `posts.js`, `posts.css` | Article data, reading interaction and art direction. Unknown article IDs show a return link. |
| `dist/profile.html`, `profile.css`, `personal-content.js`, `personal.js`, `personal.css` | Profile, interests, devices, contact and email-copy feedback. Copying does not send email. |
| `dist/now.html`, `now.css` | Timeline. Add a unique heading ID, update count/date and provide both languages. Dates record events, not visit dates. |
| `dist/i18n.js`, `language.css` | Language selection, translations and responsive bilingual typography. |
| `dist/music-data.js`, `music-content.js`, `music.js`, `music.css` | Music catalogue, bilingual copy, interactions and design. |
| `dist/styles.css`, `motion.js` | Shared design, scroll reveals and subtle pointer tilt. Touch disables tilt; reduced motion is respected. |

Keep new projects real and link their actual source or playable/downloadable release. Add `translations.zh` and `translations.en` for public copy. The three old placeholder projects have been removed. Existing artwork may retain its original language. Content remains readable without decorative animation.

## Credits

ChefZC is the display name; GitHub: [ChefDavid0815](https://github.com/ChefDavid0815), Instagram: [chefzichuan](https://www.instagram.com/chefzichuan/), public email: [zzichuan0808@outlook.com](mailto:zzichuan0808@outlook.com).

Sports photographs retain their attribution and CC BY-SA terms in `dist/assets/PHOTO-CREDITS.md`. Music imagery has separate rights and source records. Lucide and Tabler icon licences are included. The original hero asterisk was generated for this site. Folio's Cormorant Garamond font is local with its OFL licence; other site fonts load from Google Fonts with system fallbacks. Game metadata, covers, names and marks belong to their respective rights holders.


## AXIOM · 格物 / Scientific plotting

[Open AXIOM / 打开网页版](https://chefzc-axiom.vercel.app) · [Source / 源码](https://github.com/ChefDavid0815/axiom-studio)

A dedicated cold-white, ink, lime and cobalt exhibition uses real application imagery and the bundled Hooke’s-law dataset. The Now timeline adds milestone 008, with a matching experiment window. Content supports Chinese and English. Maintain the exhibition in `axiom-exhibit.js`, `axiom-content.js` and `axiom.css`.


## Festival Toolkit 0.2 / Website 1.15

[Exhibition](https://chefzc-homepage.vercel.app/gallery.html#project-festival-toolkit) · [Version journal](https://chefzc-homepage.vercel.app/gallery.html#festival-history) · [Windows release](https://github.com/ChefDavid0815/horizon-festival-toolkit/releases/tag/v0.2.0)

The original mint, sky-blue and pink Festival Pass now introduces 647 car models and an updatable content catalogue. A perforated ticket archive opens to public releases 0.2.0 and 0.1.1, with dates, bilingual changes and separate downloads. The detail dialog switches between actual 0.2.0 playlist and garage captures. Changing language preserves the selected screenshot, season palette and open journals.

Now milestone 011 records this release with a matching 647-model pass. The September 18 launch entry and 0.1.1 Post remain historical. Native disclosure controls support keyboard interaction; motion respects reduced-motion preferences. Main projects and the separate School Lab remain intact.

Maintain `festival-releases.js` for versions and links, `festival-content.js` for translations, `festival-exhibit.js` for markup, and `festival.css` / `festival-history.css` for the artwork. See the asset `SOURCES.md` for capture provenance. The app is Windows-only; encrypted saves use a third-party online service, and in-game effects remain unverified.

## Courtside collection / Website 1.16

`models-gallery.html` sits beside the main and school collections. Chase Center and Curry are independent works; the arena switches between interior and exterior glass cases. Three.js 0.180 loads actual Draco GLBs, with rotate, pause, reset and zoom controls. Rendering pauses offscreen/in background. Reduced motion disables automatic rotation; actual model renders remain available if WebGL or loading fails.

Now adds milestone 012. The seventh bilingual Post shares the glass artwork. All Posts now use a single-column chronological index: descending date, then descending issue number for same-day entries. The companion GitHub libraries are [NBA Arena Models](https://github.com/ChefDavid0815/nba-arena-models) and [NBA Player Models](https://github.com/ChefDavid0815/nba-player-models).

Browser display copies have simplified materials and seating; the native assets, import evidence and limitations are documented in their repositories. No reference library is published. See [artwork provenance](dist/assets/models/ARTWORK.md).

The checked-in viewer bundle works without a build. To modify `scripts/model-viewer.js`, run `npm ci`, `npm run build:models`, and `npm run check`. Build dependencies are pinned; Vercel continues to serve `dist`.

The Courtside **Pop Edition** uses cobalt, yellow and hot pink, comic halftones, offset printing shadows and collectible-card layouts across the 3D exhibition, Now and its journal entry. Motion includes floating artwork, a moving type strip, scroll reveals, pointer parallax and a small 3D basketball. The motion switch pauses decorative animation and turntables; reduced-motion preferences start with motion paused.
