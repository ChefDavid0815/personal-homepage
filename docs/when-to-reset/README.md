# When to Reset

Live route: https://chefzc.dev/when-to-reset/

Companion history route: https://chefzc.dev/reset-history/ — source-linked banked and automatic reset milestones, with a contextual entry below the signal desk. See `docs/reset-history/README.md` for the archive's scope and timestamp rules.

White, flat, bilingual fan project with Doto typography, a signal-driven Codex reset forecast, source excerpts, timezone selection, and a purely local pretend reset button. Homepage entry is embedded after the introductory divider; existing navigation is unchanged.

## Data and forecast

- `/api/reset-radar` reads the public FxEmbed v2 timelines for Tibo (including replies), @OpenAI and @OpenAIDevs, plus OpenAI Status. Original-author filtering excludes reposted third parties. The extra official timelines show only posts about Codex or ChatGPT Work resets.
- `/api/reset-post?url=` validates a single X or Twitter post URL, fetches its numeric post ID from FxEmbed, and checks the returned author and reset relevance. The page can inspect a public post from any account by pasted URL. It never fetches an arbitrary supplied host. Community posts are visible context and cannot confirm a global reset or raise the forecast.
- The signal desk searches and filters the posts it has fetched, and links to X's own live search for wider discovery. This is not complete X indexing: FxEmbed's public `/2/search` returned HTTP 404 during the 2026-09-26 check, and this project has no X API credential. The page states this coverage boundary rather than implying every post has been captured.
- Five-second server memory cache, five-second shared edge cache without stale-while-revalidate, and approximately ten-second foreground browser polling. Forecasts recalculate on each snapshot and every five seconds between snapshots. This is polling via a third-party mirror, not an official X streaming connection. Upstream delays are possible. Refresh times, partial coverage, stale responses, and unavailability are exposed.
- Network caches are opportunistic. A reviewed, source-linked latest reset report is retained in the companion archive and remains visible during a cold source outage. A browser can retain recently fetched public posts for up to 24 hours, explicitly marked stale when the source fails; old snapshots expire. A source outage never becomes a fake live connection.
- `dist/when-to-reset/model.js` is the shared, inspectable model. Its assumed 12% daily baseline, weights and the 85% near-term floor for an explicit first-party reset commitment are editorial design choices. No fitted model, measured historical base rate, or backtested accuracy is claimed.
- Signals affect an hourly hazard and are integrated over the remaining local day and the next calendar day. Dated language is interpreted in Pacific time. Duplicate signals and same-category posts do not stack. An explicit first-party commitment stays active for up to 36 hours unless a later denial or completed event retires it. The same-day forecast remains an estimate until a completion report arrives.
- An explicit first-party announcement that banked reset cards are being loaded, granted, or credited counts as an observed reset event that day. The displayed 100% means the announcement happened; it does not verify delivery to any individual account or imply that quotas refreshed automatically. Future banked-reset plans use a +2.20 weight with a twelve-hour half-life until confirmed. Questions and bare mentions have no weight. The page links to OpenAI's banked-reset help article and distinguishes saved cards from automatic resets.
- The local hope button does not affect the forecast, account quota, or any external service.

## September 26 case and verification

- Tibo's [first post](https://x.com/thsottiaux/status/2103637477760311522) said "we'll reset usage limits for all paid users across codex and ChatGPT work". The previous classifier treated this as a +0.30 hint because it missed "we'll", and the late-day forecast sank. It is now an explicit first-party commitment and keeps a strong, time-limited estimated signal.
- Tibo's later [post](https://x.com/thsottiaux/status/2103911959544610829) said "Resets all propagated." The previous classifier treated it as a future promise because another sentence contained "will". It is now a completed reset report, which makes today's event indicator 100% and retires the earlier commitment. That 100% describes the public report, not each subscriber's account state.
- `npm run test:reset` passed 32 model, data, archive, URL validation and API tests; `npm run check` passed. A live FxEmbed fetch in the local runtime returned the completion post and produced 100% for the current Dubai day. Browser checks on the local page showed the 100% card, direct source link, reset filter, bilingual copy, live X search link, post lookup, and search empty state. A real @OpenAI post was also resolved by the post lookup endpoint.
- The latest reviewed completion report remains separately visible when the selected timezone advances to the next day. The new day's percentage then means the chance of another event. A cold source outage keeps this archived evidence without calling the feed live.
- Final production deployment `dpl_9J6m2rvXEhDtYAtHEHmHzcjFsQ6C` was ready. `chefzc.dev` had a manual alias pinned to an older deployment, so that alias was updated explicitly. Production HTML, app JavaScript, model JavaScript, CSS, and companion archive assets matched local file hashes; `/api/reset-radar` returned the confirmed post and `/api/reset-post` returned the @OpenAI policy post. A production browser showed the 100% card and latest reviewed report with no warning/error logs. The companion archive showed ten reviewed milestones, including the September 26 completion report.

## Verification — 2026-09-22

- Repository JavaScript syntax check passed.
- Thirteen model and data tests passed, including date anchoring, duplicates, expiry, banked-reset grants and plans, confirmations, cancellation, irrelevant incidents, DST, author filtering, bounded forecasts, and short source-cache refresh.
- Live public data check succeeded locally and from the deployed Vercel function. The deployment retrieved 20 original Tibo posts/replies and one relevant OpenAI incident at the time of verification.
- Production page, JS modules, font, homepage, and API returned HTTP 200.
- Browser verification: Chinese and English show the banked-reset rollout, the exact eligibility sentence, the 100% observed-event result, the manual-redemption caveat, and the new method rule. The 390px layout fits a three-digit percentage without horizontal overflow; original-source and OpenAI help links are present.
- Production browser reported no warning/error logs during verification.
- The banked-reset model update was deployed as `dpl_G3afLSbAMuTdWRWZNUCnHt4sVybP`. The later companion archive deployment is `dpl_BWuvdjUrXxiQr7DzfSCUKeb8rEUz`; neither was pushed to GitHub.

## Local use

`npm run dev` serves the page and API. `npm run test:reset` runs the algorithm checks. `npm run check` includes the new source files. Doto is bundled with its OFL license; the existing Space Grotesk asset is reused.

Data provider documentation: https://docs.fxembed.com/api/twitter/operations/2profilehandlestatuses/

## Published promotion

Both posts were sent through the signed-in Edge X account `@TianShuAPI` and verified in the account timeline.

- English: https://x.com/TianShuAPI/status/2102453054339719422
- Chinese: https://x.com/TianShuAPI/status/2102453519978807749

Exact text is saved in `promotion.txt`. Both posts contain the live site link and identify the project as an experiment.
