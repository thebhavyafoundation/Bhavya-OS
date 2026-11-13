# BFAOS V2 — 08 Integration Map

**Date:** 2026-11-13 · **Base:** `master` @ `98388ddb`

Status labels: `VERIFIED_OPERATIONAL` · `CONNECTED_READ_ONLY` · `AUTHENTICATION_REQUIRED` ·
`CONFIGURED_NOT_TESTED` · `PARTIALLY_VERIFIED` · `BLOCKED` · `NOT_INSTALLED` · `NOT_NEEDED`

## 1. Integration matrix

| Integration | Declared | Installed | Reachable | Authenticated | Read-only tested | Write tested | Status | Free path? | Failure mode | Duplicates? |
|---|---|---|---|---|---|---|---|---|---|---|
| **GitHub** | `opencode.json` MCP + CLI | yes | yes | yes (`thebhavyafoundation`) | yes | yes (PR create/update, draft) | `VERIFIED_OPERATIONAL` | yes — public repo, Actions minutes free | token scope; rate limits | no |
| **Cloudflare** | 5 MCP servers + wrangler CLI | yes | yes | yes | yes (workers, deployments, D1) | not exercised (needs approval) | `VERIFIED_OPERATIONAL` (read) | yes — Workers free tier | account/token scope | no |
| **Turso** | env + `@libsql/client` | yes | production yes | not locally | no | no | `CONFIGURED_NOT_TESTED` | yes — 100 DBs / 5 GB / 500M rows read per month | credential is Worker-side; no local read path | no |
| **Supabase** | MCP + `NEXT_PUBLIC_SUPABASE_*` | yes | MCP yes | yes | yes (`list_projects`) | no | `PARTIALLY_VERIFIED` — **both projects INACTIVE** | yes — free tier pauses after 7 days idle | paused project ⇒ learner auth unavailable | partially — `api-auth` is the live path today |
| **Backblaze B2** | env (`B2_*`, `S3_*`) | yes | bucket probe inconclusive | no local credential | no | no | `CONFIGURED_NOT_TESTED` | yes — first 10 GB free, no card required | 90-day minimum retention; egress beyond 3× stored billed | no — canonical asset store |
| **Playwright** | MCP (local) + CI harness | yes | yes | n/a | yes (live site) | n/a | `VERIFIED_OPERATIONAL` | yes | local browser cost (avoid local suites) | no |
| **Context7** | MCP | yes | yes | n/a | yes | n/a | `VERIFIED_OPERATIONAL` | yes | none material | no |
| **grep.app** | MCP | yes | yes | n/a | yes | n/a | `VERIFIED_OPERATIONAL` | yes | none material | no |
| **Vercel (MCP)** | `opencode.json` | yes | yes | personal account | yes | no | `PARTIALLY_VERIFIED` — **team scope missing (403)** | yes (Hobby) | MCP cannot reach team resources | n/a — non-canonical |
| **Vercel (CLI)** | installed 65.14.0 | yes | yes | yes (`bhavya-foundation`, Hobby) | yes (projects, deployments, logs) | no | `VERIFIED_OPERATIONAL` | yes | Hobby 45-min sandbox cap | n/a |
| **Ruflo** | user MCP + bearer | yes | **HTTP 410** | n/a | no | no | `BLOCKED` | n/a | endpoint expired; model quality inadequate; cancellation unreliable | overlaps kernel — do not revive |
| **Notion** | not declared | no | no | no | no | no | `NOT_INSTALLED` | unknown | founder OAuth required | would overlap `docs/` |
| **Slack** | `packages/notifications` mention only | no | no | no | no | no | `NOT_INSTALLED` | yes (free tier) | founder OAuth + app scopes | would be a transport, not a source of truth |
| **Google Drive / Dropbox** | none | no | no | no | no | no | `NOT_INSTALLED` | yes (free) | founder OAuth | would duplicate `docs/` + B2 |
| **D1** | — | no resources | yes | yes | yes (0 databases) | no | `NOT_NEEDED` | yes | — | would duplicate Turso Mission Control |
| **Hermes** | — | not installed | — | — | — | — | `NOT_INSTALLED` | — | no demonstrated capability gap | overlaps OpenCode + kernel |
| **Hermes/Ruflo/other model runtimes (local)** | — | Ollama **not** installed | — | — | — | — | `NOT_NEEDED` (currently) | yes | no local inference capacity | — |
| **Qdrant** | env names in code | unknown | unknown | unknown | no | no | `CONFIGURED_NOT_TESTED` | unknown (free tier exists) | unused dependency risk | would overlap `knowledge-engine` / `search-engine` |

## 2. What the matrix says

**Working and free:** GitHub, Cloudflare (read), Playwright, Context7, grep.app, Vercel CLI.
**Working but unverified at runtime:** Turso, B2, Qdrant.
**Authenticated but degraded:** Supabase (projects paused), Vercel MCP (team scope missing).
**Blocked:** Ruflo.
**Not installed:** Notion, Slack, Google Drive, Dropbox, Hermes, D1.
**Explicitly rejected:** D1 as a ledger (duplicates Turso); Hermes (no capability gap); Qdrant (duplicates
existing search packages).

## 3. Cost and quota posture (₹0)

| Provider | Free allowance (verified 2026-11-13) | Paid risk in this setup |
|---|---|---|
| Cloudflare Workers | 100,000 requests/day · 10 ms CPU/request · 128 MB · 50 subrequests · 64 env vars · 100 workers | **None** — no plan change attempted |
| Cloudflare D1 | 5M rows read/day · 100k rows written/day · 5 GB · 10 DBs | None — unused |
| GitHub Actions | 2,000 min/month (private), public-repo minutes free · 500 MB artefacts · 10 GB cache/repo | **None** — repository is public; billing not enabled |
| Turso | 100 DBs · 5 GB · 500M rows read/mo · 10M rows written/mo · 3 GB sync · 1-day PITR | None — free plan |
| Supabase | 2 projects · 500 MB DB · 5 GB egress · 50k MAU · **auto-pause after 7 days idle** | None — but availability risk (both paused) |
| Backblaze B2 | first 10 GB storage · egress free to 3× stored · Class A free · Class B/C 2,500/day free | None — no card required for the 10 GB tier |
| Vercel | Hobby: 45-min sandbox cap, 1 concurrent build | None — Hobby only |
| Model providers | free-tier session model; no local runtime | **Must remain free** — no paid fallback, ever |

**No paid service is configured, referenced as required, or reachable in this setup.** No automatic
fallback may ever introduce one.

## 4. Integration design rules for BFAOS

1. **One authority per data kind.** Integration state (GitHub PR, Cloudflare deployment, Turso job row)
   must be *referenced* by the Mission Control record, never copied into a second store.
2. **Every integration must fail loudly.** No silent degradation: a failed provider sets the job to
   failed/stopped with the provider named.
3. **Every integration must have a free operating path**, or it is not adopted.
4. **Credentials stay server-side.** No integration credential may enter a client bundle, a log, a
   report, or model context.
5. **Read before write.** Every integration action must first confirm whether it already happened
   (the discipline already applied twice in this programme's Phase 1-B and 1-D work).
6. **A new integration requires founder authorisation** — this is a hard rule, not a preference.

## 5. Highest-value integration proof (next)

**Headless OpenCode inside a GitHub Actions runner, on a free provider, with no payment method.**
This single proof unblocks: task intake → execution → evidence → draft PR. Nothing else in the
blueprint's Phase 4 can start before it, and it is the only dependency that is currently *unknown*
rather than *missing*.
