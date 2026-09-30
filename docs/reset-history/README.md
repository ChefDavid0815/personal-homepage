# Reset Archive

Live route: https://chefzc.dev/reset-history/

An independent, bilingual page beside When to Reset. It reuses that page's white canvas, Doto and Space Grotesk fonts, lime and lilac cards, dotted details, motion and compact mobile layout. The contextual link is inside When to Reset's content, not in the homepage top navigation.

## What a node means

- `dist/reset-history/data.js` holds selected, manually checked public reset milestones from August 21 through September 26, 2026. Multiple posts about the same event share one card and retain separate original links. The current snapshot contains five banked-reset milestones and five automatic-reset milestones.
- Each exact timestamp is the time of a Tibo public announcement or completion report. It is **not** an account-specific delivery timestamp. Cards identify announcement versus completion and keep targeted remedies separate from general grants.
- The [OpenAI banked-reset guide](https://help.openai.com/en/articles/20001498-how-banked-codex-resets-work) confirms eligible banked grants on September 3 and 4, and a global automatic reset on September 7 (Pacific time). The history links that guide next to Tibo's posts.
- `dist/reset-history/model.js` merges newly observed Tibo posts from the existing `/api/reset-radar` feed. Only explicit banked-reset rollout/grant posts and automatic-reset completion reports qualify. Live additions are marked auto-detected and excluded if their post ID already belongs to a reviewed card. Questions, vague hints and future plans do not qualify.
- An open history page polls the radar about every ten seconds; it always has the checked archive if the mirror becomes unavailable. The reviewed archive is a curated snapshot, not an exhaustive historical feed or durable record of every future event. New auto-detected posts older than the radar's latest batch require later manual curation to remain in the long-term archive.

## Review and verification

- Source posts were checked through FxEmbed's public profile timeline, with original X links on every card. The profile endpoint supports cursor pagination; no X credentials or account cookies are used.
- `npm run test:reset` checks source attribution, unique grouping, official corroboration, live-addition inclusion/exclusion, and the existing forecast model.
- `npm run check` syntax-checks the archive code. The local dev server's `/reset-history/` page was inspected in desktop and 390px browser views; its filter, language and timezone controls were checked.
- Production deployment `dpl_BWuvdjUrXxiQr7DzfSCUKeb8rEUz` is aliased to `chefzc.dev`. The direct route, extensionless redirect, CSS and JS modules, and live radar API returned successfully. The deployed 390px page showed nine milestones, five banked and four automatic; its filter, bilingual switch, timezone conversion, and link from When to Reset were verified in the browser with no console or page errors. A 320px layout overflow found during local verification was fixed and rechecked.
- The deployment was made directly with the Vercel CLI. No GitHub push, commit, pull request, or release was created for this page.

## September 26 addition

The September 26 automatic reset groups [Tibo's commitment](https://x.com/thsottiaux/status/2103637477760311522) and [completion report](https://x.com/thsottiaux/status/2103911959544610829). Its timestamp is the public completion post, not an individual account delivery time. The forecast retains this reviewed, source-linked report when the live X mirror is temporarily unavailable.

Deployment `dpl_9J6m2rvXEhDtYAtHEHmHzcjFsQ6C` was ready and the explicit `chefzc.dev` alias was updated. The production archive displayed ten milestones, with the September 26 completion report first; its app and data files matched the local source hashes.

Updated: September 26, 2026.
