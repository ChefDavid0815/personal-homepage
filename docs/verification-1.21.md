# Festival Toolkit 0.3 publication check

Date: 2026-09-22. Website: 1.21.0. Application: 0.3.0.

## Delivered

- Existing 0.3.0 Gallery release history and four actual application captures reviewed.
- Original mint, blue and pink journal/compass artwork shared by the exhibition, Now window, project README and GitHub profile.
- New bilingual Now entry 014, dated September 22. Existing eight Posts and historical Now entries preserved; no new Post.
- Updated bilingual project, portfolio and profile READMEs, current project summaries, download links and metadata.
- Gallery dialog theme reset prevents a previous project's theme from carrying over. Full-bleed decoration is clipped at the root to prevent a horizontal page scrollbar.

## Verification

- Application `npm test`: 33/33 passed; `npm run build`: passed. Test fixtures only; no player save edits or new in-game verification.
- Four local release files match GitHub's SHA-256 digests: installer, portable, checksums and verification report. Existing 0.3.0 prerelease assets and source tag preserved.
- Website `npm run check` and `npm run test:motion`: passed.
- Browser check at a 390 x 844 viewport: Profile, Gallery, Game, Now, Posts, Pulse, School Lab and 3D Collection all rendered their main heading/navigation; document width equalled the available viewport width on all eight pages.
- Desktop visual inspection: Festival exhibit, application detail, Now, and SVG README poster. Mobile visual inspection: Now copy and complete journal/compass window.
- Chinese/English Now content and Gallery history checked. History stays expanded when changing languages and lists 0.3.0, 0.2.0 and 0.1.1.
- Four screenshot selectors update their image paths; all four screenshot URLs return HTTP 200. Wristbands image decoded at its real width of 2139 px.
- Global motion switch pauses the new paper animation and can be restored. Reduced-motion CSS is also provided.
- Local HTML/CSS/import reference audit: 432 references scanned; no missing local resource after excluding a bundled shader string falsely matched as an import.
- Production Pulse API returned HTTP 200 with 67 hourly records; snapshot age was about nine seconds at the check. This is a point-in-time connectivity check, not a guarantee of uninterrupted sync.

## Boundaries

This is a release-focused smoke and visual check, not exhaustive testing of every game, 3D interaction, external music player or third-party service. Browser-generated cross-document ViewTransition cancellation messages occurred during rapid automated navigation; page rendering and the tested controls remained functional. Native installer and in-game behavior were not retested in this website publication pass; the software's separate release verification report remains the source for those boundaries.
