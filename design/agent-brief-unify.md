# Unification pass — brief for agents (ChefZC 2.0)

The owner says the site still feels cheap in places: the project **windows** (the small artworks in Now and in Posts covers), the **actual content inside exhibits** (detail dialogs, version histories, info panels), many leftover fonts and legacy design conflicts. Goal of this pass: **one coherent, expensive-feeling visual system** across all of it, through typography, spacing, layout and redrawn art elements, while each project keeps its base identity (palette + one signature motif). Also fix interaction bugs and type width/spacing problems you find.

Project: `E:\个人项目\personal-homepage`, static site in `dist/`, server http://127.0.0.1:4173 (if it is down, start your own: `PORT=4190 node scripts/serve.mjs` in the background and use that port).

Read first: `DESIGN.md` (tokens, roles, refusals), `PRODUCT.md`, then `dist/flow-current.css` `:root`.

## Type system (mandatory everywhere in your scope) — UPDATED: Huiwen Mincho
- All Chinese text: 汇文明朝体 Huiwen Mincho via the tokens `var(--zh-display)` (big), `var(--zh-strong)` (sub-heads, labels), `var(--body)` (reading; DM Sans for Latin + Huiwen for CJK). Never hard-code HelloFont family names.
- Latin display: `var(--display)` = Cesso; a project may keep at most one signature Latin wordmark face.
- Data: `var(--mono)` IBM Plex Mono.
- Remove other Chinese fonts (Dot Air UI/Display for CJK, Nabat Sans, WisSerif, RoseHan, MoonHan, Space Grotesk/Yu Gothic for CJK, Noto Sans SC as primary). Text inside real screenshots untouched.
- One weight only: no bold requests. Chinese headings line-height 1.15–1.25, letter-spacing 0.02–0.06em; reading 1.85–1.95; Chinese never below 12px. Latin display −0.02em…0; Latin small labels sentence case, caps tracking ≤ 0.08em.
- At most two families per window/panel besides mono.

## Layout & art rules
- Windows: one consistent frame (the Now room already frames windows; Posts covers have their own frame) — inside each window keep a clear hierarchy: wordmark/title, one line, one data line. Cut clutter (stacked stickers, repeated tiny captions, fake UI chrome text, random badges). Redraw cheap-looking elements (clip-art badges, heavy drop-shadow stickers, offset block shadows, bevels, gradients-on-text) into clean flat graphic forms in the project's palette.
- Consistent safe margins inside art (≥ 20px desktop / 16px mobile), consistent corner radii by level, no text touching edges, no text over busy imagery without a solid/scrim ground.
- No gradient text, no decorative glass, no hard offset shadows, no Unicode glyph icons (`dist/assets/flow/current-icons.svg`), no eyebrow labels above headings.
- Respect `html[data-site-motion=off]` / reduced motion.

## Hard content rules
- No information may be lost: every fact, date, number, link, image, credit, version entry stays reachable (may move/merge/change form). Decorative-only text inside artworks (fake UI labels, repeated slogans) may be removed **only if** the same words do not carry information elsewhere; when unsure, keep it in a quieter form.
- Bilingual parity; real facts only. AC8 Tasha artwork stays.
- Do NOT edit: `flow-current.*`, `flow-home.*`, `current-field.js`, `flow.css`, `i18n.js`, `personal-content.js`, `projects.js`, `*-data.js`, `*-releases.js`, `flow-legacy-*.css`, any HTML `<head>`; do not run `build:flow` / `build:motion`; no git commits.
- Shared JS modules (an exhibit module often renders both the gallery room and the Now/Post window): edit **only the functions in your scope**, and only with targeted Edit replacements after re-reading the file — never rewrite a shared file wholesale, because another agent may be editing a different function in it at the same time.

## Tools
- Capture: `node scripts/capture.mjs <url> <outPrefix> <w> <h> <scrollYs|full> <waitMs>` (env `LANG_EN=1`, `REDUCED=1`, `PRE`, `EVAL`, `STEP`). Put images in your own folder under `design/qa-unify/<you>/` (inside the project; the temp scratchpad gets wiped).
- Audit: `node scripts/audit-typography.mjs <url> <w> <h> [scopeSelector]` → JSON with horizontal overflow, overflowing text, negative CJK tracking, overlapping text, tiny text, and which fonts render CJK / Latin text, plus console errors. Run it before and after on your pages (desktop 1440×900 and mobile 390×844, zh and en) and drive `negCJK`, `tiny` (readable text), real `overlap`, `overflow` to zero in your scope, and the CJK font list to only the three HelloFont faces + body.
- `node --check` every JS you edit.

## Report
Files changed; what you unified and redrew; audit numbers before → after for your pages; confirmation that no information was lost and how you checked; interaction bugs found/fixed; anything left.
