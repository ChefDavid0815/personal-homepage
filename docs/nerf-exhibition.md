# NeRF / A world, made of numbers

Website **1.23.0**, prepared on 30 September 2026. The source repository is public. Live deployment and formal Release are verified in the publication record.

## The room inside the building

The site keeps its original shell, Space Grotesk / DM Sans / IBM Plex Mono typography, navigation, language preference, timeline and journal chronology. NeRF inhabits a separate School Lab specimen, rather than a standard school-work card.

The specimen has a perspective RGB plate, procedural point volume, sparse depth-faded binary fragments, camera trajectories, sample pulses, coordinate planes and restrained scanlines. The detail opening uses the same plate and a native cross-document View Transition name where supported. A sub-second sequence revisits actual saved previews before revealing the final 800px image. The six-step story uses existing GSAP / ScrollTrigger for a pinned narrative heading and depth reveals, with a plain reading fallback.

Now retains its existing date column, node spacing and milestone layout. Its side window links to the project and shows a saved reconstruction with a recorded 50k iteration and three-view validation mean. The event states that research began on 24 September and the audited source was made public on 30 September.

Posts retains the shared chronological overview. The NeRF entry has a dedicated computational cover and reader: a separate metadata rail, comfortable body width, original diagrams, formulas, actual screenshots and a scoped evidence table.

## Evidence

All RGB examples come from the actual Lego run step3_smoke_20260924T165838Z_f3bbd1f5. It continues a 500-step engineering smoke checkpoint to 50,000 steps with **256 rays/batch**, position/direction L=10/4 and 64/128 samples. It is not the 4096-ray baseline configuration.

The time machine shows recorded 100×100 previews at 500/2,000/10,000/50,000. Its readouts are the corresponding training-batch PSNR and total coarse-plus-fine MSE. Full-resolution validation/test images and tables are separate. Final validation views 0/1/2 average 27.333 dB; all five recorded final test views 0/1/2/66/133 average 26.055 dB. These are selected-view checks.

The evidence JSON records exact means, view sets, configuration and checkpoint SHA-256. WebP images are optimized exhibition copies; metric values come from the original floating RGB evaluations and CSVs.

The vector cover, canvas volume and spatial rays are original editorial illustrations, not inferred geometry or a live training feed. Dataset imagery remains attributed to the original NeRF synthetic creators. Actual bilingual workstation captures were made on 30 September with no training active.

## Implementation

- nerf-content.js: shared links and authored translations.
- nerf-art.js: specimen, editorial cover and vector pipeline.
- nerf-motion.js: localized canvas renderer, physical pointer interpolation, reconstruction sequence and GSAP story.
- nerf-project.js / nerf.html: project space, saved checkpoint and test-camera controls, evidence and screenshot dialog.
- nerf-entry.js: Now miniature and restrained profile discovery.
- nerf-post.js: bilingual research note and independent editorial reader.
- nerf.css: project-scoped materials, motion and responsive composition.

Every field has an IntersectionObserver and ResizeObserver. Rendering stops offscreen, in hidden tabs, under the shared pause setting or reduced-motion preference. DPR is capped at 1.5, and at 1 for miniatures, narrow stages or constrained devices. Ambient painting is capped at 30 fps, reduced to 24 on narrow/constrained stages; foreground pointer transforms follow requestAnimationFrame on capable desktops, with a 60 fps cap on constrained/narrow stages. Detached nodes remove observers, animation frames, timelines and input listeners. No DOM particle collection or new rendering dependency was introduced.

## Verification

JavaScript syntax checks and renderer/evidence tests pass. Browser verification covers navigation, actual checkpoint values, test-camera selection, both languages, global pause, Escape, focus restoration and scroll unlocking. Phone/tablet checks show no document overflow or missing images. The checked viewports include 360, 390, 768, 1366, 1440, 1920 and 2560 CSS pixels; publication status and performance evidence are recorded in nerf-publication.md.

The renderer lifecycle tests cover offscreen/hidden/pause suspension and cleanup; they do not constitute physical 120/144/240Hz or long hardware-soak measurements. Reduced-motion CSS and media-query handling are provided; no OS preference was changed during browser QA. The website is an exhibition, while local training requires the software.

The hero is pre-rendered from the same pure template used by the interactive page. It is visible before the module graph loads, and reserves its geometry before enhancement. Core typography is self-hosted; the Noto Sans SC subset covers all 1,312 CJK characters currently used in top-level site content. The local preview server now compresses text assets with gzip, matching the compression expected on Vercel. These changes address measured first-paint delay rather than reducing the art direction.
