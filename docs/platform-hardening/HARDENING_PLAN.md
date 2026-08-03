# Platform Hardening Plan v1.0

**Date:** 2026-08-03
**Scope:** Stabilization and architecture sprint — no new features, no new modules

---

## Hardening Principles

1. **Verify before fixing** — Every finding confirmed against source code
2. **No new abstractions** — Use existing patterns, don't over-engineer
3. **Incremental delivery** — Each phase produces working, testable code
4. **Preserve functionality** — No visual changes, no feature changes
5. **Security first** — Critical vulnerabilities before architectural improvements

---

## Phase 1: Security Hardening (Days 1-2)

### 1.1 Runtime API Authentication

- Add API key middleware to `packages/runtime/cli/api.mjs`
- Require `X-API-Key` header on all endpoints except `/health`
- Store key in `RUNTIME_API_KEY` environment variable
- Return 401 on missing/invalid key

### 1.2 Runtime API CORS

- Replace `Access-Control-Allow-Origin: *` with configurable origins
- Default to `http://localhost:3020,http://localhost:3030`
- Add `CORS_ORIGINS` environment variable for production

### 1.3 NEXTAUTH_SECRET

- Generate strong secret (32+ bytes)
- Add to `apps/knowledge-studio/.env`
- Add `secret: process.env.NEXTAUTH_SECRET` to authOptions

### 1.4 Auth Middleware

- Create `apps/knowledge-studio/src/lib/auth-guard.ts` with `requireAuth()` helper
- Add to all 7 unprotected API routes
- Return 401 if no session

### 1.5 File Upload Validation

- Add `MAX_FILE_SIZE = 10 * 1024 * 1024` (10MB)
- Whitelist extensions: `.pdf`, `.docx`, `.md`, `.txt`
- Sanitize filenames: strip non-alphanumeric except `.` and `-`
- Replace `writeFileSync` with `.writeFile` (async)

### 1.6 Path Traversal Prevention

- Add `validateId(id)` function to api.mjs
- Reject IDs not matching `/^[a-zA-Z0-9_-]+$/`

### 1.7 Safe Expression Evaluation

- Replace `new Function()` in workflow-engine.ts and governance-engine.ts
- Use simple condition parser (check for known operators, reject arbitrary code)

---

## Phase 2: Database Hardening (Day 3)

### 2.1 Indexes

- Add indexes on all FK columns: `user_id`, `ko_id`, `package_id`
- Add index on `email` (already UNIQUE, but explicit is better)
- Add indexes on `domain`, `status` for filtered queries
- Add composite indexes for common query patterns

### 2.2 Transactions

- Wrap `execute/route.ts` pipeline in `db.transaction()`
- Wrap `deleteKO()` in transaction
- Wrap any multi-write operations

### 2.3 FK Violation Fix

- Remove `savePipelineResult` from artifacts.ts (hardcoded FK violations)
- Remove duplicate `listArtifacts` from db.ts

### 2.4 Portable SQL

- Replace `datetime('now')` with standard SQL where possible
- Document SQLite-specific features for future migration

---

## Phase 3: API Hardening (Day 4)

### 3.1 Shared Auth Helper

- `requireAuth()` returns session or throws 401
- Used by all API routes

### 3.2 Error Handling

- Replace `err.message` in responses with generic error messages
- Log actual errors server-side
- Return structured `{ error: string, code: string }` format

### 3.3 Rate Limiting

- Add in-memory rate limiter middleware
- Apply to: `/api/auth/register` (5/min), `/api/auth/[...nextauth]` (20/min), `/api/ingest` (10/min), `/api/execute` (5/min)

---

## Phase 4: Architecture Hardening (Day 5)

### 4.1 Fix BEE Import

- Add `@bhavya/runtime` as workspace dependency in bee/package.json
- Update import to use package path

### 4.2 Fix turbo.json

- Add `test` task definition

### 4.3 Fix Root package.json

- Remove duplicate `next`/`react` from dependencies (keep in devDependencies)
- Update version to `3.1.0`

### 4.4 Remove Dead Dependencies

- Remove `lucide-react` from knowledge-studio
- Decide on Tailwind: remove or migrate (recommend keep for future refactoring)

### 4.5 Fix @bhavya/ui

- Remove from dependency lists of apps that import it
- Or: create minimal re-export of BDL primitives

---

## Phase 5: Testing (Day 6)

### 5.1 CI Pipeline

- Create `.github/workflows/ci.yml`
- Steps: install, lint, typecheck, test, build
- Run on push to main and PRs

### 5.2 Knowledge Studio Tests

- Add vitest config
- Test DB operations (create, read, update, delete)
- Test API routes (auth, ingest, execute, search)
- Test auth flow (register, login, session)

### 5.3 BDL Test Cleanup

- Remove 6 empty Button test files
- Convert 5 representative stubs to real tests

---

## Phase 6: Knowledge Studio Refactoring (Day 7)

### 6.1 Shared Components

- Create `PageShell` component (sidebar + main wrapper)
- Create `StatCard` component
- Create `StatusBadge` component
- Create `LoadingState` component
- Create `ErrorState` component

### 6.2 Type Safety

- Define interfaces for all API responses
- Replace all `any` types with proper interfaces

### 6.3 Error Handling

- Replace silent catch blocks with proper error state
- Add error display to all pages

### 6.4 Layout

- Move Sidebar to shared layout.tsx
- Remove duplicate Sidebar imports from pages

---

## Phase 7: Documentation (Day 8)

### 7.1 README Update

- Add project description, prerequisites, quickstart
- Meet own standards/README.md requirements

### 7.2 API Documentation

- Document all API routes with request/response formats

### 7.3 Hardening Report

- Document all changes made
- Update CHANGELOG

---

## Execution Order

```
Day 1-2: Security (1.1-1.7) — CRITICAL
Day 3:   Database (2.1-2.4) — HIGH
Day 4:   API (3.1-3.3) — HIGH
Day 5:   Architecture (4.1-4.5) — MEDIUM
Day 6:   Testing (5.1-5.3) — HIGH
Day 7:   UI Refactoring (6.1-6.4) — MEDIUM
Day 8:   Documentation (7.1-7.3) — LOW
```

---

## Dependencies Between Phases

- Phase 1 (Security) is independent — can start immediately
- Phase 2 (Database) is independent — can start immediately
- Phase 3 (API) depends on Phase 1.4 (auth helper)
- Phase 4 (Architecture) is independent
- Phase 5 (Testing) depends on Phases 1-4 being stable
- Phase 6 (UI) depends on Phase 5 (tests prevent regressions)
- Phase 7 (Docs) depends on all phases being complete

---

## Risk Mitigation

| Risk                                  | Mitigation                                      |
| ------------------------------------- | ----------------------------------------------- |
| Breaking existing functionality       | Run `pnpm build` after each phase               |
| Auth changes break login              | Test login flow after each auth change          |
| DB schema changes lose data           | Backup DB before schema changes                 |
| New tests are flaky                   | Use deterministic test data, mock external deps |
| Circular dependency fix breaks builds | Test each package individually after change     |
