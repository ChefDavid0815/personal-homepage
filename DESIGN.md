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

## Type (Adobe Fonts kit `per8hkf` + self-hosted)
- **Chinese display** `--zh-display`: HelloFont ID ChunHei — heavy, wide, modern. Headings, big numbers in Chinese, the hero.
- **Chinese strong** `--zh-strong`: HelloFont ID JueJiangHei 80 — long display sentences, sub-heads.
- **Chinese reading** inside `--body`: HelloFont ID JueJiangHei 50 (after DM Sans for Latin).
- **Latin display** `--display`: Cesso — hall titles, English headings, names, big Latin numbers.
- **Body** `--body`: DM Sans + JueJiangHei 50.
- **Mono** `--mono`: IBM Plex Mono — only for data: coordinates, times, dates, counts, specs.
- ChunHei/Cesso have one weight each: never ask them for bold (`font-synthesis:none` is global). Chinese display keeps letter-spacing ≥ 0.

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
