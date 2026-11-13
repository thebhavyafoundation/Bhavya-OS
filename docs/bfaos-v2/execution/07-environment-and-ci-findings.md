# BFAOS V2 — Environment and CI findings (Phase 4.1 · G)

**Date:** 2026-11-13/14 · **Branch:** `feat/bfaos-phase4-contracts` · Not committed to application code.

---

## F-1 — The tracked development database applied pending migrations during testing

`packages/database/data/bhavya.db` is a tracked development seed file. During Phase 4.1 test
runs, its `_migrations` table gained exactly five records:
`ai-institute/002_knowledge_objects_and_evidence`, `ai-institute/003_mission_control`,
`ai-institute/004_mission_control_sessions`, `ai-institute/005_mission_control_destinations`,
`ai-institute/006_module_progress`, all applied at `2026-11-13 18:11:21` UTC (18:11 = 23:41 IST local, matching the file's mtime).

Read-only comparison (HEAD vs working copy) shows:

- No application table gained or lost any row. Only `_migrations` gained five rows.
- No new table appeared beyond the five migration targets (`evidence_records`, `knowledge_objects`, `mc_*`, `module_progress`) — these are the tables those migrations create.
- The main checkout was **not** modified. Production (`bhavya-foundation`, deployment `953f06bb`, 2026-10-30) was **not** read or written.
- The file is **not** part of any committed branch; it remains modified and uncommitted in the development worktree.
- Production's baseline schema applied by production startup contains none of these (Phase 1-B/1-C finding S24 — `mc_*` tables absent from the production baseline). An eventual merge remains subject to that decision.

**Why it happened:** `apps/ai-institute`'s `initDatabase()` resolves through `@bhavya/database` to the tracked file whenever `BHAVYA_DB_PATH` is unset; some invocation path in the test suite ran with the un-redirected path once. Which exact command remains unconfirmed — the important, verified facts are above. The change is **reversible** with `git checkout -- packages/database/data/bhavya.db` if the founder wants the HEAD state restored; the migrations can be reapplied by any run of the migration runner.

**Not actionable here:** do not commit this file as part of release work; do not let tests run with the un-redirected path; consider adding the file to `.gitignore` or making the test setup fail-loud on un-redirected runs (founder/owners call).

## F-2 — ioc `getDb()` calls `migrate("ioc")` without awaiting it

`apps/ioc/src/lib/db.ts` calls `getReadWriteDatabase("ioc")`, then, on the first call,
`migrate("ioc")` **without `await`** (`migrate` is async). The same pattern exists in
`apps/ai-institute/src/lib/db.ts`-adjacent local-mode init (`_migrate!("ai-institute")` is awaited
there — it is fine). Consequence: the first DB operation in the process can race migration
application and observe an unmigrated schema. This has never been observed to break a deployed
artifact because ioc is not deployed to production, but it is a real race in the local app.

**Not actionable in this increment:** changing a live app's `getDb()` call graph is an
application-behaviour change for a repository the founder owns; it is recorded for the founder to
direct. The ioc tests verify behaviour *after awaiting the same migration against a scratch
SQLite database*, so they do not depend on the race.

## F-3 — Preview deploy failed on #69 and #70, succeeded on #71 (same commit class)

`opennext-preview.yml`'s `Deploy preview to Cloudflare` failed on #69 and #70 only, while the
identical job succeeded on #71 within the same window (and while the identical verify jobs that
build the same bundle passed on all three PRs). The failure is **runner/Cloudflare-environment
specific, not deterministic**: #69/#70 and #71 trigger the same workflow with the same app bundle
content. #69's deploy succeeded on re-run/push at 15:29. Root cause unverified — likely a runner
ephemeral failure (artifact download or wrangler credential fetch race on that runner window).

No code change was warranted and none was made. Production deploy requires the founder; preview
deploy failing ≠ production failing.

## F-4 — `packages/kernel/src/execution/mission-control-mapping.ts` verified intentionally un-wired

Unchanged from Phase 4 — recorded here only so the execution record shows this was verified in
Phase 4.1 as well: no application call site imports it; wiring remains gated on D-08 (job-status
vocabulary) and D-09 (artefact store).
