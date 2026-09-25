# Mid-Autumn 2026 / 中秋一日皮肤

The original site CSS and project exhibits are unchanged. `dist/midautumn-season.js` activates the temporary layer only on **2026-09-25 in Asia/Dubai**; it removes the layer in an already-open tab after the date changes. The post remains in the journal after the skin expires. The user’s motion control and `prefers-reduced-motion` pause continuous effects without hiding content.

The festival layer uses a midnight-cobalt stage, warm ivory lunar light, persimmon silk lanterns, and fuchsia/cyan screen-print accents. All nine personal-site pages load the same seasonal entry. Each project exhibit retains its own art direction. `dist/midautumn-moon-source.js` is the editable Three.js sphere source; `dist/midautumn-moon.bundle.js` is the browser bundle. To rebuild it:

```sh
node scripts/build-midautumn.mjs
```

The built-in `imagegen` tool generated the three project assets, then they were inspected and converted to WebP:

- `dist/assets/midautumn-moon-lanterns.webp` (1672×941): cinematic indigo Mid-Autumn sky, realistic full moon on the right, handmade glowing silk lanterns, restrained cyan/fuchsia pop accents, dark space left for live type; no baked-in text.
- `dist/assets/midautumn-moon-albedo.webp` (1774×887): flat 2:1 lunar maria, highlands and crater map for the rotating sphere, with diffuse lighting and horizontally compatible edges.
- `dist/assets/midautumn-mooncake-stilllife.webp` (1672×941): mooncake, tea, lantern and distant moon in a tactile nighttime still life, with small pop-art accents and no baked-in text.

Check the date boundary with `node --test scripts/test-midautumn.mjs`. The in-app browser disables WebGL, so the CSS textured sphere remains visible and animated there; WebGL-capable browsers get the lit Three.js sphere. The CSS sphere responds to pointer movement and remains still when reduced motion is requested.
