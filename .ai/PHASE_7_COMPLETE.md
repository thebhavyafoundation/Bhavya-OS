# PHASE 7 COMPLETE — Engineering Recovery Report (verified)

**Date:** 2026-09-17
**Branch:** master
**Authoritative source:** filesystem + git + command results (this document is evidence, not truth)

> Supersedes the earlier premature report (eff717c), which claimed a clean
> tree while 32 modified files were still uncommitted and route tests were
> still polluting `content/`. Every claim below was re-verified by execution
> in the closure audit before writing.

## Commits (this closure)

1. `6620642` — fix(content-core): resolve BHAVYA_CONTENT_ROOT lazily for test isolation
   (also untracked the 16 generated `next-env.d.ts` files the pre-commit hook swept in)
2. `28c9110` — fix(ai-institute): isolate route tests from tracked content tree
3. `a52649f` — chore(recovery): land pending M4–M11 engineering fixes
4. docs(recovery): reconcile Phase 7 completion report with verified evidence (tip commit of this audit; verify with `git log --oneline -6`)

Prior recovery base: `eff717c`, `fddeabf`, `4e18c9a`, `a248b8e`, `4f2e4d2`, `98d43a6`,
`1585542`, `e97c191`, `6c7afce`, `e6cfc71`, `5177c67`, `6275694`, and earlier.

## M11 — Test isolation root cause and fix (verified)

**Root cause (traced, not assumed):**

- `packages/content-core/src/io.ts` cached `ROOT` at import time, so
  `BHAVYA_CONTENT_ROOT` set in ai-institute `setupFiles` arrived too late —
  `createMission`/`publishKnowledge` kept writing to the tracked tree
  (`content/forest/mission-*.json` + `content/knowledge/forest-mission-*.json`,
  24 polluting files observed and removed).
- The setup also pointed the var at a `.../content` dir, which would have
  produced `<tmp>/content/content/forest` (double nesting).

**Fix:**

- `io.ts` resolves the root lazily per call (production behavior unchanged when unset).
- New `resetForestCachesForTests()` (exported via index) busts module caches that
  could otherwise serve production data after the redirect.
- `apps/ai-institute/src/lib/__tests__/setup.ts` points `BHAVYA_CONTENT_ROOT` at
  the per-worker temp dir (repo-root equivalent) and calls the cache reset.
- `knowledge-mutation.test.ts` converted to the async SQLite-backed repository API;
  `forest-integration.test.ts` evidence/metrics checks use DB-derived queries.
- Fixed 4 pre-commit-hook lint errors found while landing this work
  (`no-useless-escape` in `academy-lessons.ts`, `no-require-imports` in
  `knowledge-mutation.test.ts`).

**Proof:** forest-integration run, full ai-institute suite, full `pnpm test`, and
post-commit re-runs all leave `git status` free of any `content/` change; mission
artifacts land in `$TEMP/bhavya-ai-institute-test/<worker>/content/{forest,knowledge}`.

## Verified gate results

| Gate                | Status                | Evidence                                                                                                                                                                         |
| ------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Typecheck           | ✅ PASS               | `pnpm typecheck` — 49/49 tasks successful                                                                                                                                        |
| Lint                | ✅ PASS               | `pnpm lint` — 16 tasks, 0 errors (kernel 29 + content-engine 3 pre-existing warnings)                                                                                            |
| Tests               | ✅ PASS               | `pnpm test` — 20/20 tasks; ai-institute 12 files / 166 tests; content-core 9 files / 55 tests                                                                                    |
| Quality gates (M12) | ✅ PASS 5/5           | `node scripts/quality-gates.mjs` — types, duplicates, imports, cycles, constitution                                                                                              |
| Antislop            | ✅ PASS               | `node scripts/antislop-gate.mjs` — 1199 files, no patterns                                                                                                                       |
| Drift-check         | ✅ PASS               | `node scripts/drift-check.mjs` — 7 passed, 0 failed, 3 warnings (example canvas only)                                                                                            |
| Tokens              | ✅ PASS               | `scripts/sync-tokens.mjs --check` — all apps in sync                                                                                                                             |
| FILE-MAP (M13)      | ✅ deterministic      | two runs identical sha256; blob hash equals HEAD                                                                                                                                 |
| Registry (M13)      | ✅ deterministic      | two regenerations identical; tree clean                                                                                                                                          |
| `git diff --check`  | ✅ PASS               | no whitespace errors                                                                                                                                                             |
| Machine paths       | ✅ clean              | no `C:/Users`, `BBNC`, `/home/` in registry or new files                                                                                                                         |
| Secrets             | ✅ clean              | no private-key / `ghp_` / `sk-live` / `AKIA` / `xoxb-` patterns in diff                                                                                                          |
| Build               | ⚠️ environmental-only | apps compile + generate pages (ai-institute: ✓ compiled, 147/147 static pages); `output: standalone` symlink copy fails with Windows EPERM (needs admin); CI/Linux authoritative |
| Git status          | ✅ CLEAN              | empty after commits (this file committed last)                                                                                                                                   |

## M15 — Production candidate audit

- Architecture boundaries: quality gates 5/5 (imports, cycles, duplicates enforced).
- Routing: ai-institute generates 147 static pages; no route changes in this phase.
- Package boundaries: untouched; no app-to-app dependencies added.
- Runtime/DB: `initDatabase()` + migrations run per test worker against temp SQLite; seed DB untouched.
- Content isolation: proven (see M11 proof).
- Security: `security.test.ts` 21/21 pass; no secrets in diff; no `.env`/credential files touched.
- Generated artifacts: FILE-MAP / registry / tokens deterministic; 16 generated
  `next-env.d.ts` files untracked to honor the existing `.gitignore` intent
  (working copies remain on disk, now ignored).
- OpenCode/MCP config: untouched; skills registry has no machine-specific paths.
- CI: `.github/workflows/ci.yml` triggers on `master`, runs antislop + lint +
  typecheck, test, secret-scan, then build on `ubuntu-latest`. Untouched by this phase.
- Deployment: `vercel.json` untouched; **no deployment performed or claimed**
  (requires explicit user authorization per AGENTS.md).

## Known limitations (documented, not blockers)

1. Windows `output: standalone` EPERM — environmental (Category B); compile + page
   generation verified green; CI/Linux authoritative.
2. `commitlint.config.js` "type: module" warning — cosmetic, pre-existing.
3. Drift-check example-canvas warnings (3) — draft example file only, non-blocking.
4. Kernel (29) + content-engine (3) lint warnings — pre-existing, errors are zero.

## Conclusion

Phase 7 is **COMPLETE by evidence**: M11 isolation fixed and proven, M12 5/5,
M13 deterministic, M14 matrix green (with the one documented environmental
exception), M15 audited. The repository is a **production candidate** from an
engineering perspective. Deployment awaits explicit human authorization and a
green CI run on `master` (CI has never run on the canonical branch yet).
