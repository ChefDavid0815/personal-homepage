# Verification / 1.18

Verified on 2026-09-20 during the Atelier + Pulse release.

- Syntax checks passed for all site modules and both Vercel functions.
- 7 accounting/ingestion tests passed: copied-fork/repeated-snapshot deduplication, partial JSONL append, reset counters, request-length uncertainty, Dubai day boundaries, pricing, schema privacy and rejected unauthenticated writes.
- Shared motion-state test passed for persistence, system preference, hidden tabs and cross-tab changes. The existing three game snapshot tests also passed.
- Browser-checked all eight existing routes plus Pulse, and all seven individual articles. Mobile widths 390px and 360px and tablet width 820px were checked. No horizontal page overflow remained in the final targeted checks.
- Browser-verified Folio history expansion, article active chapter, music next-track selection, model interior/exterior selection and actual WebGL preview, STRIDE scene selection, and synchronization between global and local motion controls.
- Production routes and `/api/usage` returned HTTP 200. The public aggregate uses `Cache-Control: no-store`. Ingestion secrets were absent from publishable files.
- The current-user **ChefZC Codex Usage Sync** scheduled task was installed and running. The retained local record window began on 2026-09-14; this is not a complete lifetime account history.
- A real new record at **2026-09-20T19:52:25.262Z** was observed through production SSE at **19:52:26.214Z**, approximately **0.95 seconds** after the local event timestamp. This measures one record-to-stream delivery, not upstream token-reporting latency or a guaranteed SLA. The browser was also observed updating its sync timestamp and metrics without manual refresh.

No claim is made of exact per-token billing during generation. The data updates when Codex emits precise usage, potentially many times during one long task. The site does not estimate hidden reasoning from visible text or simulate token growth. API equivalent amounts use the disclosed Standard rate table, not an actual subscription bill.
