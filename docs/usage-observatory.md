# Pulse / Codex usage observatory

Pulse is a bilingual public page at `/usage.html`. It publishes **hourly numeric aggregates only**, sourced from this computer's retained Codex rollout records. It is not an account-wide OpenAI billing feed.

## Data and accounting

- Local collector: `scripts/usage-sync.py`, Python 3.10+, optional `watchdog==6.0.0` for native filesystem notifications. Reads `sessions` and `archived_sessions` under `CODEX_HOME`, defaulting to the current user's `.codex`.
- Incremental offsets and numeric events are stored in `%LOCALAPPDATA%\ChefZC\UsageSync\ledger.sqlite`. It never writes to Codex files, reads authentication files, stores prompt content, or publishes session IDs and paths.
- Cumulative counter deltas exclude repeated rate-limit snapshots. Event fingerprints deduplicate replayed fork history. Counter resets are handled as a new counter. Incomplete trailing lines are retried on the next update.
- Input includes cache reads and cache writes. Output includes reasoning. Total is **input + output**, not the sum of all fields.
- Each record is attributed to its observed `turn_context.model`. Unrecognized names remain visible and unpriced. Request lengths are determined only when the cumulative delta matches `last_token_usage`; ambiguous intervals are unpriced.
- Dubai calendar days (`UTC+4`): today, today plus six earlier days, today plus 29 earlier days, or the full retained history. Dates preceding the first record are marked uncovered, not presented as measured zero usage.

## Latency and availability

The collector wakes on file changes, with a one-second fallback scan. New recorded usage uploads immediately, with at most one write per second. A 30-second heartbeat distinguishes an online idle collector from an offline computer. Network errors retry with exponential backoff up to 60 seconds.

Authenticated `POST /api/usage` validates a strict aggregate schema and writes to a private Vercel Blob. `GET /api/usage` and `GET /api/usage-stream` return the sanitized public summary. Blob reads use `useCache:false`; no CDN or browser caching is allowed. The page uses a server-sent event stream, renewed after about 23 seconds, with a one-second origin check while the page is visible. Hidden pages close their stream.

**This does not produce exact per-token streaming billing.** Codex must first emit a precise token-usage record, generally following a model request. A long task can emit many such updates before the whole task ends. The site never increments numbers speculatively. Internet delays, upstream reporting delays, computer sleep/shutdown, or a stopped collector can delay updates; the page shows last-sync time and stale/offline state.

## Equivalent pricing

`dist/usage-math.js` contains publicly verified **Standard** USD prices, checked 2026-09-20. It reprices retained usage at these rates, not historical invoices. Models currently observed are GPT-6 Astra and GPT-5.6 Sol.

Formula per request: `((input - cached - write) × inputRate + cached × cachedRate + write × writeRate + output × outputRate) / 1,000,000`.

Above 272K input tokens, input/cache rates double and output rates multiply by 1.5. Unknown models or ambiguous request lengths are excluded from the monetary sum and explicitly identified. Image/audio/tool fees, tax, regional uplifts and Pro subscription charges are excluded.

Sources: [OpenAI API prices](https://developers.openai.com/api/docs/pricing), [GPT-6 Astra context pricing](https://developers.openai.com/api/docs/models/gpt-6-astra), [Codex token usage notification schema](https://github.com/openai/codex/blob/main/codex-rs/app-server-protocol/schema/json/v2/ThreadTokenUsageUpdatedNotification.json), [workspace Analytics API scope](https://learn.chatgpt.com/docs/enterprise/analytics-api), [Vercel consistent Blob reads](https://vercel.com/changelog/vercel-blob-now-supports-consistent-reads-on-private-storage).

## Operating the collector

The Vercel project needs `BLOB_READ_WRITE_TOKEN` and sensitive `USAGE_SYNC_SECRET`. The collector has **only the ingestion secret**, not the Blob credential, in its private `config.json`:

```json
{"endpoint":"https://chefzc-homepage.vercel.app/api/usage","secret":"YOUR_PRIVATE_INGESTION_SECRET"}
```

Do not put this file in the repository. `python scripts/usage-sync.py` refreshes the local aggregate without uploading. `--watch --publish` runs continuous synchronization. `scripts/install-usage-sync.ps1` installs a silent current-user logon task, with a current-user startup-entry fallback if Task Scheduler is unavailable. `pythonw.exe` keeps it windowless. A process lock prevents duplicate workers.

To stop: end the `ChefZC Codex Usage Sync` scheduled task and disable it; if the fallback is installed, remove only `ChefZC Usage Sync` from the current-user Run key, then stop its `pythonw.exe` worker. The public site retains the last valid summary and shows it as stale. `status.json` contains the last attempt state with no credentials.

Local preview serves the same private aggregate through two local GET endpoints; it never exposes the state directory. `npm run test:usage` checks deduplication, partial appends, resets, day boundaries, pricing, private-field stripping and authentication.

## 中文说明

Pulse 展示今日、近 7 天、近 30 天及本机可追溯累计用量，含堆叠柱状图、模型比例与等额 API 估算。原始对话、文件路径、凭据和任务内容均不上传。同步器只读本机记录，新记录落地后上传数字汇总，服务器持续推送；电脑离线时展示最后记录。精确用量依赖 Codex 每次模型调用的上报，不伪造生成过程中的逐 Token 计数。金额按公开 Standard 费率估算，不是实际 Pro 账单。
