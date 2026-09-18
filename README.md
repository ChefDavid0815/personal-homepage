# ChefZC — Digital space

**English** · [简体中文](README.zh-CN.md)

A personal website for the things I love and make: a dark digital canvas with lime, electric blue, violet and warm accents. Each real project gets its own art direction: a midnight basketball court for **NBA After Hours**, a warm paper journal for **Folio**, and a lime/cobalt scientific exhibition for **AXIOM**.

[**Enter my space ↗**](https://chefzc-homepage.vercel.app) · [Gallery](https://chefzc-homepage.vercel.app/gallery.html) · [Posts](https://chefzc-homepage.vercel.app/posts.html) · [Now](https://chefzc-homepage.vercel.app/now.html)

## The collection

| Page | Inside |
| :--- | :--- |
| **Personal Profile** | ChefZC, a Year 12 IB student at GEMS Wellington International School in Dubai. Basketball, motorsport, AI, art, devices, milestones and public contact links. Only the city is shown as a location. |
| **Gallery** | Three real projects: AXIOM 1.0, Folio 1.1 and NBA After Hours. Actual application/game screenshots, independent visual identities, project dialogs, source and download/play links. |
| **Now** | A chronological journal, newest first. September 18, 2026 adds AXIOM’s web launch and the Folio 1.1 release in its paper-and-terracotta style; the previous six milestones remain. |
| **Posts** | Four bilingual essays: opening this website, NBA After Hours, Folio 1.0, and AXIOM 1.0. An overview, individual articles, contents, reading progress and related notes. |

`index.html` redirects to `profile.html`, retaining the query and fragment. Navigation, language preference and footer are shared. The site defaults to Chinese; the **中 / EN** switch translates navigation, copy, dialogs and page titles. Preference persists when local storage is available and synchronises across same-origin tabs. Brand names and decorative artwork retain their original design.

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

`dist/` is the complete website. `vercel.json` runs `npm run check` and deploys that directory. The website version **1.12.0** is separate from Folio's **1.1.0**.

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
