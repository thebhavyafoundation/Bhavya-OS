# ICM archive manifest — 2026-09-05 migration

Nothing here was deleted. Every batch below was moved with history (`git mv`
for tracked files) and is documented with what / why / replaced-by / when.
Authorization: `_system/icm-restructure-proposal.md` §4 (+ migration
authorization 2026-09-05). HARD RULE honored: archive, never delete.

## constitution-2026-09-05/ (30 files: 15× .md tracked + 15× .docx untracked)

- **What:** the 15 constitutional documents in Markdown (previously root
  `01_…15_*.md`) + their Word originals (previously root `*.docx`, gitignored).
- **Why archived:** root declutter; one-home-per-fact (canonical programmatic
  access is the `@bhavya/constitution` SDK in `packages/constitution/`).
- **Replaced by:** this directory as the SDK's document store. Live consumer
  updated: `packages/constitution/src/loader.mjs` now resolves
  `registry.mjs` filenames against this directory (verified by
  `node packages/constitution/src/startup.mjs --validate-only`).
  Human entry: `README.md` → Governance section links here.
- **Known staleness (intentionally left):** `registry/documents.json`,
  `docs/governance/governance-registry.json`, and
  `docs/governance/archived/README.md` still record the old root paths.
  They are generated/historical catalogs — update them through their owning
  pipelines, not by hand here.
- **When:** 2026-09-05.

## root-status-2026-09-05/ (13 files, tracked)

- **What:** `ARCHITECTURE_OVERVIEW.md`, `EXECUTION_PLAN.md`,
  `EXECUTION_PROTOCOL.md`, `LESSONS_LEARNED_v1.0.md`, `MATURITY_REPORT.md`,
  `MATURITY_REPORT_PHASE2.md`, `PLATFORM_GUARANTEES.md`, `POST_RC_ACTIONS.md`,
  `PRD.md`, `SUCCESS_CRITERIA.md`, `VALIDATION_PLAN.md`,
  `RELEASE_NOTES_v3.1.0.md`, `RELEASE-CHECKLIST.md`.
- **Why archived:** superseded as live surfaces by `.ai/current-task.md`,
  `.ai/current-release.md`, and `docs/releases/`. Point-in-time evidence,
  preserved as history.
- **Replaced by:** `.ai/current-*.md` (live status) + `docs/releases/`
  (release history). Prose mentions in `CONTRIBUTING.md` and audit docs were
  intentionally left as historical record.
- **When:** 2026-09-05.

## test-artifacts-2026-09-05/ (4 dirs)

- **What:** `__test_io_dir__/`, `__test_io_json__/`, `__test_io_list__/`,
  `__test_output__/` — leftover fixtures from
  `packages/content-core/src/io.test.ts` (which recreates what it needs at
  runtime via `ensureDir`+`writeJSON` before reading; self-contained).
- **Why archived:** test scaffolding does not belong at the repo root.
- **Replaced by:** the test itself recreates its working dirs on each run.
- **When:** 2026-09-05.

## logs-2026-09-05/ (2 files, were gitignored)

- **What:** `dev-server.log`, `dev-server-err.log`.
- **Why archived:** generated output, never hand-edited. Ignored going forward
  by `.gitignore` (`dev-server.log`, `dev-server-err.log` — already present).
- **Replaced by:** `.logs/` convention for future runs.
- **When:** 2026-09-05.

## scripts/_archive/ (7 files, were gitignored)

- **What:** `check.mjs`, `verify.mjs`, `verify2.mjs`, `insert.mjs`,
  `insert2.mjs`, `insert3.mjs`, `insert-lessons.mjs` — one-off DB/script
  experiments superseded by `scripts/` and package runners.
- **Why archived:** no importers or workflow references found (verified by
  repo-wide grep before moving).
- **Replaced by:** `scripts/` + `pnpm --filter` package commands.
- **When:** 2026-09-05.
