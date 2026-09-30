# Core site typography / self-hosted edition

The same site families are locally hosted to remove the measured render-blocking Google Fonts chain. No new JavaScript font dependency is required.

- Space Grotesk variable, DM Sans variable and IBM Plex Mono 400/500/600: Fontsource packages **5.3.0**, individual Latin WOFF2 assets.
- Noto Sans SC variable: official Google Fonts TTF, subset to the current top-level HTML/JavaScript/CSS text with FontTools **4.66.1** and Brotli **1.2.0**. All **1,312 used CJK characters** were checked against the source cmap; system fonts remain the fallback for future characters not in this subset.

Exact sources, file sizes, source/output SHA-256 and package versions are in core-fonts-sources.json. The relevant SIL OFL licences are included beside the files. The isolated font tooling and full upstream TTF stay outside the website repository.

When adding new Chinese copy, regenerate/extend the subset or confirm fallback coverage. Keep the family names and existing type scales consistent with the site.
