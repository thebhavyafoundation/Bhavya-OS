# Architecture Diff — Platform Hardening v1.0

## New Files

```
apps/knowledge-studio/src/lib/auth-guard.ts          — requireAuth() helper
apps/knowledge-studio/src/lib/api-utils.ts            — Standardized error/success responses
apps/knowledge-studio/src/lib/rate-limit.ts           — Sliding window rate limiter
apps/knowledge-studio/src/lib/rate-limit.test.ts      — Rate limiter tests
apps/knowledge-studio/src/lib/api-utils.test.ts       — API utils tests
apps/knowledge-studio/vitest.config.ts                — Vitest configuration
.github/workflows/ci.yml                             — CI pipeline (lint, typecheck, test, build)
```

## Modified Files

```
packages/runtime/cli/api.mjs                          — +auth middleware, +CORS config, +ID validation, +sanitized errors
packages/bee/src/index.mjs                            — Fixed relative import → @bhavya/runtime/registry
turbo.json                                            — +test task
apps/knowledge-studio/next.config.ts                  — +security headers
apps/lesson-studio/next.config.ts                     — +security headers
apps/knowledge-studio/package.json                    — +vitest, +test scripts
apps/knowledge-studio/src/lib/auth.ts                 — +NEXTAUTH_SECRET, bcrypt 12, password complexity
apps/knowledge-studio/src/lib/db.ts                   — +9 indexes, +2 transactions
apps/knowledge-studio/src/lib/artifacts.ts            — Fixed FK violation, removed duplicates
apps/knowledge-studio/src/app/api/auth/register/route.ts  — +rate limiting
apps/knowledge-studio/src/app/api/kos/route.ts        — +auth enforcement
apps/knowledge-studio/src/app/api/search/route.ts     — +auth enforcement
apps/knowledge-studio/src/app/api/packages/route.ts   — +auth enforcement
apps/knowledge-studio/src/app/api/pipelines/route.ts  — +auth enforcement
apps/knowledge-studio/src/app/api/status/route.ts     — +auth enforcement, +userId scoping
apps/knowledge-studio/src/app/api/versions/route.ts   — +auth enforcement
apps/knowledge-studio/src/app/api/artifacts/route.ts  — +auth enforcement
apps/knowledge-studio/src/app/api/ingest/route.ts     — +auth enforcement, +file validation, +rate limiting
apps/knowledge-studio/src/app/api/execute/route.ts    — +transaction-wrapped setup
```

## Dependency Changes

```
packages/bee/package.json                             — Already had @bhavya/runtime (no change)
apps/knowledge-studio/package.json                    — +vitest devDependency
```

## Architecture Impact

### Before

```
Client → API (no auth) → DB (no indexes, no transactions)
Client → Runtime API (no auth, CORS *)
BEE → Runtime (relative path import)
```

### After

```
Client → API (requireAuth + rate limiting) → DB (indexes + transactions)
Client → Runtime API (API key auth, restricted CORS)
BEE → Runtime (package import)
```

## Migration Notes

- **No breaking changes for existing users** — auth was already in the UI flow
- **Runtime API** — If using API key auth, set `RUNTIME_API_KEY` env var
- **CORS** — If accessing Runtime API from other origins, set `CORS_ORIGINS` env var
- **File uploads** — Now validates type and size; previously accepted anything
