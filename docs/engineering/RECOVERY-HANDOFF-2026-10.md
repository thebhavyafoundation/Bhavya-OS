# Recovery Handoff — Bhavya Foundation web platform (2026-10-28)

Secret-free operational memory so a fresh agent/session can recover context
without the original chat or this laptop. Companion incident record:
`docs/incidents/2026-10-28-homepage-freeze-storage-health-loop.md`.

## Canonical facts (verified 2026-10-28)

- **Repository:** `https://github.com/thebhavyafoundation/Bhavya-OS` (public),
  default branch `master`.
- **Baseline commit:** `5f61a802` — `feat(nav): lead every learning entry
point with the curriculum (#58)`.
- **Production:** Cloudflare Worker `bhavya-foundation` (OpenNext).
  URL `https://bhavya-foundation.thebhavyafoundation.workers.dev/`.
  Active deployment `db57b7f5-aacb-4d57-ba01-6ece01230a18`, Worker version
  `9a75f269-d8c7-44c0-b7fb-de0127418640` (v46), created 2026-10-22T17:46Z,
  GitHub Actions deploy run #61 (head_sha `5f61a802`, success).
- **Preview:** separate worker `bhavya-foundation-preview` via
  `.github/workflows/opennext-preview.yml` + `wrangler.preview.json`
  (PR-triggered; no production secrets; runtime secrets intentionally absent,
  so preview verifies the public shell only).
- **CI:** `.github/workflows/ci.yml` (branch `master`), `deploy-cloudflare.yml`
  (push to master → build → verify bundle → deploy), `opennext-build-verify.yml`,
  `opennext-preview.yml`, plus review-only asset workflows
  (`assets-glb/ktx2/posters.yml`).
- **Deployment/commit mapping:** Cloudflare metadata carries no commit
  annotation. Map by pairing the GitHub Actions run `head_sha` with the
  Cloudflare deployment `created_on` timestamp
  (`gh` CLI is NOT installed on the laptop; use the GitHub REST API or MCP).

## Service ownership

| Service                       | Purpose                     | Source of truth                 | Notes                                                                                                                                                                                |
| ----------------------------- | --------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GitHub                        | code, CI, curriculum source | repo `master`                   | canonical                                                                                                                                                                            |
| Cloudflare Workers (OpenNext) | production + preview web    | `deploy-cloudflare.yml`         | canonical web runtime                                                                                                                                                                |
| Cloudflare secrets (worker)   | runtime config              | dashboard/`wrangler secret put` | `TURSO_*`, `S3_*`, `B2_*`, `STORAGE_TYPE`, `NEXT_PUBLIC_SUPABASE_*` — names only; values never in Git                                                                                |
| Backblaze B2 (S3-compatible)  | 3D assets/media             | bucket + `assetUrls.ts`         | public assets via `https://f002.backblazeb2.com/file/<bucket>/...`; CSP allows only that origin                                                                                      |
| Turso (libsql)                | remote SQLite               | worker runtime secrets          | server routes only                                                                                                                                                                   |
| Supabase                      | auth                        | anon key                        | CAUTION: `NEXT_PUBLIC_*` supplied only as worker runtime secrets are NOT inlined into the client bundle at build time — client auth needs a build-time value; open verification item |
| Vercel                        | previews (non-canonical)    | `deploy.yml`/`vercel.json`      | not canonical; do not treat as production verification                                                                                                                               |

## Machine contract (control-center laptop)

- i3/8 GB laptop. Locally allowed: light edits, git, targeted `tsc --noEmit`,
  targeted `eslint`, single-file `vitest`, docs.
- NEVER locally: `next dev/dev servers`, `next build`, `pnpm build`,
  full monorepo test/typecheck matrices, Playwright automation, load tests.
  Heavy work runs on GitHub Actions; verification runs against deployed URLs.
- `D:` paths are workstation convenience only; never hardcode in app/CI.
  (`scripts/deploy-all.ps1` was already repaired to script-relative root —
  present as an uncommitted working-tree change.)

## Remote build/test/preview commands

- Production deploy: push to `master` → `deploy-cloudflare.yml` (build →
  OpenNext verify → deploy). OpenNext builds use
  `--dangerouslyUseUnsupportedNextVersion` because Next 15.5.25 is past the
  upstream support window; remove on a Next 16 upgrade.
- Preview: open a PR touching `apps/**`/`packages/**`/etc. →
  `opennext-preview.yml` → `bhavya-foundation-preview` worker.
- Playwright (remote): `apps/ai-institute/tests/performance/` (untracked as
  of this writing — commit pending authorization). `playwright.config.ts`
  defaults `baseURL` to production; override with `BASE_URL` to point at the
  preview worker. Runners: `run-verify.mjs`, `run-perf.mjs` (both default to
  the production URL). One worker; isolated test data; never submit real
  donations/messages/records.

## Environment variable names (never values)

- Storage code path actually reads: `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`,
  `S3_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`, `S3_REGION`, `STORAGE_TYPE`.
- `.env.example` documents canonical `B2_*` names (`B2_ACCESS_KEY_ID`,
  `B2_SECRET_ACCESS_KEY`, `B2_BUCKET`, `B2_S3_ENDPOINT`, `B2_S3_REGION`,
  `B2_PUBLIC_BASE_URL`) with `S3_*` as "deprecated aliases" — **the code and
  the worker secrets still use `S3_*`**; naming drift is an open cleanup item.
- Turso: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` (runtime only).
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  (must be build-time inlined to reach the browser — see open item above).
- `apps/ai-institute/.env.example` is the tracked template.

## Freeze incident (summary)

Client storage health-check loop (see incident doc for full evidence):
`useStorage()`/`useAuth()` returned fresh objects every render → provider
effects re-ran forever → CSP-blocked placeholder-bucket requests (~70/s) +
full-tree re-renders → "Page Unresponsive" on low-end devices. Fixed in the
working tree (memoization + configuration gate + single cancellation-guarded
probe). **Not yet on production.**

## Rules the curriculum/experience work must keep

- Counts and statuses come from the validated registry, not from prose.
  Separate: catalogued / draft / published / reviewed / assessable /
  certification-enabled. Never imply accreditation not evidenced.
- Brand authority conflict is OPEN and human-gated: Constitution 01
  (Inter/SF Pro headings, palette #1a3a2a/#c9a227) vs design plan/tokens.css
  (Playfair + Inter, #0e382e/#d4af37). Implementation keeps consuming
  `tokens.css` (implementation SoT); do not silently reconcile.
- No preloader/animation may gate essential content; reduced-motion must skip
  decorative motion entirely.

## Known unmerged local state (verify before touching)

- Working tree has uncommitted changes from prior sessions (SplitHero accent,
  nav token migration, Button/Modal/Sheet/Dialog/Input primitives,
  CurriculumGrid/InfographicCard, `design-integration-plan.md`,
  `tests/`, `tmp/`, `packages/runtime/src/context-trim/`) — preserved, not
  mine, not committed.
- Worktrees: `feat/elite-web-experience` (`459e789a`, NOT merged into master,
  lives under `C:\Users\kanta\AppData\Local\Temp\opencode\wt-elite`),
  `feat/curriculum-asset-pipeline` and `feat/curriculum-plan-b` (prunable),
  `D:/Bhavya-OS-wt/*` (plan-c, wt-ecc, wt-release).
- Stashes exist (`stash@{0..4}`); do not drop.
- `.wrangler/state/...` sqlite files are tracked in Git (local dev state —
  cleanup candidate, human-gated).
- `tests/security/b2-*.test.ts` (untracked) sit outside vitest's include
  pattern and never run in CI; one of them also misses the `.ts` import path
  through which the AWS SDK reached the client bundle.
