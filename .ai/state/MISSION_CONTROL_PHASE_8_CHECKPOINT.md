# Mission Control Phase 8 Checkpoint (2026-09-18)

## Deployment forensics (verified, read-only)

- Mechanism: Cloudflare Workers via opennextjs-cloudflare (Next.js adapter). NOT Pages.
- Worker name: `bhavya-foundation` (apps/ai-institute/wrangler.json), nodejs_compat, assets from `.open-next/`.
- Production branch: master (deploy-cloudflare.yml triggers push→master; AGENTS.md confirms master→production).
- Preview: NO PR-preview mechanism exists in-repo. Vercel path (deploy.yml) targets nonexistent `main` + unauthorized — untouched.
- Secrets required: CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID (repo secrets, not inspected), Turso vars via manual `wrangler secret put`.
- Production gate: CI green + human merge to master + Cloudflare deploy + manual secrets. Deployment stays human-authorized; nothing here deploys.

## Remote CI / PAT scope finding

- PR checks API now 403s (`Resource not accessible by personal access token`) while pulls API works → fine-grained PAT lacks checks:read (or equivalent). Log access impossible from here. No new runs polled beyond run 35316903757 (secret/lint SUCCESS, test FAILURE cause unestablished).

## End-to-end traces (static, code-verified this phase)

- Studio: studio_lessons → dbGetLesson → artifacts API fromStudioLesson → createArtifactFromStudioLesson → v1 + evidence → requestApproval → decide → addVersion → verify/begin/complete + destination. Store never copied.
- GHOS: repository row → evaluations API → createJobFromEvaluation (idempotent) → started job + bound session + v1 → same review/integration chain. FACT vs RECOMMENDATION split at render.
- Integration: approved → verified → integrating → integrated, each guarded + evidenced + actor-persisted.

## API contract matrix (all /os/mission/*, admin/staff only)

- jobs GET (filter) / POST create+writes keyed evidence; jobs/[id] GET aggregate / POST start|submit|complete|stop|cancel|startSession|endSession|bind (400 unknown, 404 missing, 422 invalid transition).
- artifacts POST create|addVersion (+idempotencyKey) |verify|beginIntegrate|completeIntegrate|supersede|archive|setDestination (allowlist) |fromAcademyLesson|fromStudioLesson (404 missing lesson).
- approvals GET pending+artifact / POST request|decide (reason enforced, stale/terminal guarded).
- evaluations POST {repoId} → 201|200 deduped / 404 unknown row.
- tasks GET list|?id= with job counts. All mutations append evidence; actors from session only.

## This phase changes

- Commit 5d1aa30: decision search (repo + UI q param) + tests. Full suite 200/200 green before commit.
- No other code changes; verification + forensics + records.

## Blockers (unchanged)

- Push authorization; CI log access (now precisely: checks:read scope); human decisions 3/4/9/10; Vercel/Playwright unavailable for browser verification.
