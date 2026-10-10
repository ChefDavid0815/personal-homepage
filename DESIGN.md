# ChefZC — Current 2.1 design system

The site is one river: **night-river indigo**, **mist**, and one living **current** of colour. The homepage hero (streamlines parting around 川流不息, `dist/current-field.js`) is the single loudest element; every other page is calmer and lets its content lead.

Source of truth for shared tokens: `dist/flow-current.css` (`:root`). Homepage: `dist/flow-home.css`. Shared motion: `dist/flow-current.js`.

## Colour
| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0b0d26` | Night river: dark chapters, finale band, dark panels |
| `--ink-2` | `#14173a` | Raised dark surface |
| `--paper` | `#e7ebf2` | Mist: light page ground |
| `--paper-2` | `#f3f5f9` | Raised light surface |
| `--flow-ink` | `#10132e` | Text on mist |
| `--muted` | `#4e5373` | Secondary text on mist (≥4.5:1) |
| `--line` | `#10132e1c` | Hairlines |
| current | `#3d5cff` `#7a5cff` `#ff5c9a` `#ff6b3d` `#ffd23f` `#35d49a` | Strokes, fields, progress, small marks. Never as gradient text. |
| `--seal` | `#d7263d` | Seal-red, a rare accent |

On dark: text `#e7ebf2`, secondary `#e7ebf2b3`.

## Type
- **Chinese, everywhere** `--zh` (aliased as `--zh-display`, `--zh-strong`, `--zh-mid`, and the CJK part of `--body`): **汇文明朝体 Huiwen Mincho** by TerryWang — a letterpress-textured Song/Mincho, self-hosted as a site subset (`assets/fonts/huiwen-mincho-site.woff2`, licence in `LICENSE-Huiwen-Mincho.txt`: open source, free for commercial use, no resale). One weight (400): hierarchy comes from size, colour and space, never bold.
- **Latin display** `--display`: Cesso (Adobe Fonts kit `fty8nfs`) — hall titles, English headings, names, big Latin numerals.
- **Body / UI Latin** `--body`: DM Sans (Chinese inside it falls to Huiwen Mincho).
- **Mono** `--mono`: IBM Plex Mono — only for data: coordinates, times, dates, counts, specs.
- Chinese headings: line-height 1.15–1.25, letter-spacing 0.02–0.06em. Chinese reading text: 1.85–1.95. Nothing readable below 12px in Chinese (the inked edges close up).
- `font-synthesis:none` is global — no faux bold or italic.

## Layout
- Gutter `--gutter` = clamp(20px, 4.2vw, 72px); content max 1680px.
- Generous separation between chapters (120–170px desktop, 90–110px mobile); tight groups inside.
- Left-aligned reading; centre only for the return/finale moments.
- Radius by hierarchy: 18–22px for media panels, 999px for pills, 0 for hairline lists.

## Rules (refuse)
- No eyebrow/kicker labels above headings; no 01/02/03 unless the content is a real sequence (timelines, release histories are).
- No gradient text. No glass/blur as decoration. No zero-blur offset shadows.
- No all-caps tracked labels; labels are sentence case in `--body`.
- No Unicode glyph icons for UI: use `dist/assets/flow/current-icons.svg` (`#arrow-up-right`, `#arrow-down`, `#arrow-up`, `#arrow-right`, `#copy`) or `dist/assets/icons.svg`.
- One authored motion moment per page; respect `html[data-site-motion=off]` and `prefers-reduced-motion`.
- Theme browser surfaces: selection, scrollbars, focus rings already set globally.

## Hard content rules
- **No original information may be lost**: every text, number, date, link, image, credit and licence line stays reachable (it can move, regroup, or change form).
- Bilingual parity (中 / EN) through the existing i18n mechanisms.
- Each project exhibit keeps the base visual identity of its software (its palette and signature motifs) but may be redrawn freely.
- **AC8 (Ace Combat 8): the Tasha character artwork must be kept.**
- Real facts only.

## Exhibit layer (2.1)
- `dist/flow-rebuild.css` loads last on gallery, now, posts, post and school-gallery; one section per project.
- Each exhibit keeps its software's palette and at most one signature Latin face. DOT/AIR uses Acumin Pro Wide (its own heading face) from Adobe Fonts kit `mps7cmb`; Chinese stays Huiwen Mincho everywhere.
- Each exhibit gets one signature interaction drawn from the real product, never decoration for its own sake. DOT/AIR: halftone sky, split-flap board, Flight DNA. Roseraie: petals, filigree, medallions. Atlas: the real Diploma constellation. CHROMA: signal scope. ProjectLens: loupe. AFTERIMAGE: light trails. Festival: season weather. AXIOM: live least-squares fit. Folio: page turn. NBA After Hours: shoot-around. School Lab: NFC / rays / sonar.
- All of it pauses off-screen, in hidden tabs, with the site motion switch and with reduced motion. Data shown is real or explicitly labelled as simulated.
- Huiwen Mincho subset: `py -3 scripts/subset-huiwen.py` (from the repaired master). Preservation record: review `scripts/verify-flow-content.py`, then `py -3 scripts/bless-redesign.py`.
