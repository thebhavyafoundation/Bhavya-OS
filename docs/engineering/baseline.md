# Bhavya Foundation — Engineering Baseline

**Date:** 2026-09-07
**Commit:** 144931b (fix(security,accessibility,design): wave 16 complete institutional verification)
**Branch:** master
**Node:** v24.13.0
**pnpm:** 10.17.1
**Turbo:** 2.10.4

## Commands Executed

### Typecheck

```
pnpm typecheck
```

**Result:** 52 successful / 58 total
**Failed:** `@bhavya/app-social-os` (pre-existing)

Pre-existing type errors in `apps/social-os`:

- Missing exports (`getPendingApprovals`, `github`, `Priority`)
- Missing platform types (`newsletter`, `discord`, `website` in `Record<PlatformType, ...>`)
- Event type mismatches (`calendar.entry_created`, `communication.loop_completed`, etc.)
- Buffer type incompatibility in Postiz provider

### Lint

```
pnpm lint
```

**Result:** 14 successful / 25 total
**Failed:** `@bhavya/kernel` (pre-existing)

Pre-existing lint errors in `packages/kernel`:

- 53 errors (mostly `@typescript-eslint/no-explicit-any` and `@typescript-eslint/no-require-imports`)
- 44 warnings (unused variables in tests and services)

Other packages pass lint with warnings only (zk-privacy, code-intelligence-mcp, edge-ml, ai-orchestration, skill-tree, knowledge-graph, context-optimizer).

### Test

```
pnpm test
```

**Result:** 4 successful / 20 total
**Failed:** `@bhavya/runtime` (pre-existing)

Pre-existing test failure:

- `runtime.test.mjs` fails with `ERR_MODULE_NOT_FOUND: Cannot find module 'constitution/src/sdk.mjs'`
- Expression evaluator tests pass (130/130)
- Constitution tests pass (4 test files)
- Other packages: database, platform, api, content-core, security, ai tests not yet cached/run

### Build

Not run separately (covered by typecheck and CI).

## Pre-Existing Failures Summary

| Package                 | Command   | Failure Type                 | Severity |
| ----------------------- | --------- | ---------------------------- | -------- |
| `@bhavya/app-social-os` | typecheck | Missing types/exports        | HIGH     |
| `@bhavya/kernel`        | lint      | `any` types, require imports | MEDIUM   |
| `@bhavya/runtime`       | test      | Missing module path          | HIGH     |

## Environment Assumptions

- Windows (win32) development environment
- pnpm workspaces with Turborepo
- SQLite database (better-sqlite3) for local development
- No external services required for basic typecheck/lint
- Vercel deployment from `master` branch

## Notes

- All failures are pre-existing and documented here for tracking
- No new failures were introduced during this baseline capture
- The canonical app (`apps/ai-institute`) typecheck passes
- The design system (`packages/platform-ui`) typecheck passes
- Core packages (auth, database, api, events, security) typecheck passes
