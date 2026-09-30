# NeRF exhibition assets

Generated/curated on 30 September 2026. Source software: [NeRF Research Console](https://github.com/ChefDavid0815/nerf-research-console).

- **reconstruction.webp:** actual validation view 000, 800×800, from the 50,000-step checkpoint.
- **iteration-*.webp:** actual saved 100×100 validation previews at the named iterations, from the same run.
- **test-000/066/133.webp:** actual 800×800 test predictions at checkpoint 50,000.
- **input-view.webp / input-view-001.webp:** official Lego training reference views 000 and 001, exported from the run's saved ground truths. The input pipeline illustration uses training images, not validation/test supervision.
- **workstation-zh/en.webp:** actual local browser-rendered software captures on 30 September; no training was active.
- **evidence.json:** exact stored values, selected-view means, sampled training curve and checkpoint identity. Metrics were computed on original floating RGB, not these optimized WebP copies.
- **cover.svg:** original editorial vector composition by ChefZC; its volume/rays are illustrative.

The run is step3_smoke_20260924T165838Z_f3bbd1f5, a 256-ray engineering continuation, not the 4096-ray baseline configuration. Checkpoint SHA-256 is recorded in evidence.json.

Lego imagery derives from the original NeRF synthetic data; attribution and archive identity are in the software repository's data/PROVENANCE.md and THIRD-PARTY.md. It does not inherit a new original-artwork licence. Spatial canvas points and rays in the website are diagrams, not measured geometry.
