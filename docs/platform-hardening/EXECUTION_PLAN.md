# Execution Plan

**Sprint Duration:** 8 days
**Team:** 1 developer
**Start Date:** 2026-08-03

---

## Day 1: Security — Critical Vulnerabilities

### Morning (4 hours)

- [ ] 1.1 Add API key auth to runtime API (`packages/runtime/cli/api.mjs`)
- [ ] 1.2 Restrict CORS on runtime API
- [ ] 1.3 Generate and set NEXTAUTH_SECRET
- [ ] 1.4 Create `requireAuth()` helper and apply to all routes

### Afternoon (4 hours)

- [ ] 1.5 Add file upload validation (size, type, filename sanitization)
- [ ] 1.6 Add ID validation for path traversal prevention
- [ ] 1.7 Replace `new Function()` with safe evaluator

### Verification

- [ ] `pnpm build` succeeds
- [ ] Runtime API returns 401 without API key
- [ ] Runtime API returns 401 with invalid API key
- [ ] Runtime API works with valid API key
- [ ] CORS headers restrict origins
- [ ] Login/register still work
- [ ] File upload rejects oversized files
- [ ] File upload rejects invalid extensions

---

## Day 2: Security — Remaining Issues + Verification

### Morning (4 hours)

- [ ] Add security headers to knowledge-studio next.config.ts
- [ ] Add security headers to lesson-studio next.config.ts
- [ ] Remove `NEXT_PUBLIC_RUNTIME_URL` from lesson-studio client
- [ ] Add password complexity requirements (min 8 chars)

### Afternoon (4 hours)

- [ ] Full security regression test
- [ ] Verify all API routes require auth
- [ ] Verify file upload validation works end-to-end
- [ ] Verify runtime API auth works

### Verification

- [ ] All API routes return 401 when unauthenticated (except /api/auth/*)
- [ ] Security headers present in responses
- [ ] No `NEXT_PUBLIC_RUNTIME_URL` in client bundle

---

## Day 3: Database Hardening

### Morning (4 hours)

- [ ] Add indexes on FK columns (user_id, ko_id, package_id)
- [ ] Add indexes on query columns (email, domain, status)
- [ ] Remove `savePipelineResult` from artifacts.ts (FK violation)
- [ ] Remove duplicate `listArtifacts` from db.ts

### Afternoon (4 hours)

- [ ] Wrap execute/route.ts pipeline in transaction
- [ ] Wrap deleteKO() in transaction
- [ ] Test DB operations under simulated failure

### Verification

- [ ] `SELECT * FROM sqlite_master WHERE type='index'` shows new indexes
- [ ] Pipeline execution is atomic (all or nothing)
- [ ] Delete operations are atomic
- [ ] No FK violations in any code path

---

## Day 4: API Hardening

### Morning (4 hours)

- [ ] Create shared error response format `{ error: string, code: string }`
- [ ] Replace all `err.message` in API responses with generic messages
- [ ] Add server-side error logging

### Afternoon (4 hours)

- [ ] Add rate limiting middleware
- [ ] Apply to auth routes (5/min register, 20/min login)
- [ ] Apply to pipeline routes (10/min ingest, 5/min execute)

### Verification

- [ ] API errors return generic messages, not internal details
- [ ] Rate limiting triggers after threshold
- [ ] Server-side logs contain actual error details

---

## Day 5: Architecture Hardening

### Morning (4 hours)

- [ ] Fix BEE import: add @bhavya/runtime workspace dep, update import
- [ ] Add `test` task to turbo.json
- [ ] Fix root package.json (remove duplicate deps, update version)

### Afternoon (4 hours)

- [ ] Remove lucide-react from knowledge-studio
- [ ] Remove @bhavya/ui from dependency lists (or create minimal re-export)
- [ ] Verify all packages build independently

### Verification

- [ ] `pnpm install` succeeds with no circular dependency warnings
- [ ] `turbo test` actually runs tests
- [ ] Each package builds independently
- [ ] No broken imports

---

## Day 6: Testing

### Morning (4 hours)

- [ ] Create `.github/workflows/ci.yml`
- [ ] Configure lint, typecheck, test, build steps
- [ ] Test CI workflow locally with `act` or manual verification

### Afternoon (4 hours)

- [ ] Add vitest config to knowledge-studio
- [ ] Create DB operation tests (CRUD for all tables)
- [ ] Create API route tests (auth, ingest, execute, search)
- [ ] Remove 6 empty BDL Button test files

### Verification

- [ ] CI workflow syntax is valid
- [ ] `pnpm test` runs and passes in knowledge-studio
- [ ] DB tests verify CRUD operations
- [ ] API tests verify auth enforcement
- [ ] Empty BDL files removed

---

## Day 7: Knowledge Studio Refactoring

### Morning (4 hours)

- [ ] Create shared components: PageShell, StatCard, StatusBadge, LoadingState, ErrorState
- [ ] Define TypeScript interfaces for all API responses
- [ ] Replace all `any` types with proper interfaces

### Afternoon (4 hours)

- [ ] Replace Sidebar-in-every-page with shared layout
- [ ] Replace silent catch blocks with proper error handling
- [ ] Apply shared components to all 9 pages

### Verification

- [ ] All 9 pages render correctly
- [ ] No `any` types remain in page files
- [ ] Error states display properly
- [ ] Loading states display properly
- [ ] Sidebar appears via layout, not per-page import

---

## Day 8: Documentation + Final Verification

### Morning (4 hours)

- [ ] Update README.md to meet own standards
- [ ] Document all API routes
- [ ] Create HARDENING_REPORT.md
- [ ] Update CHANGELOG.md

### Afternoon (4 hours)

- [ ] Full regression test of all pages
- [ ] Verify all security fixes work
- [ ] Verify all database changes work
- [ ] Verify all API changes work
- [ ] Create NEXT_PHASE.md

### Verification

- [ ] `pnpm build` succeeds for all apps
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] All pages functional
- [ ] All security fixes verified
- [ ] Documentation complete

---

## Progress Tracking

| Phase                 | Status  | Started | Completed | Verified |
| --------------------- | ------- | ------- | --------- | -------- |
| 1.1 Runtime API Auth  | Pending | —       | —         | —        |
| 1.2 CORS              | Pending | —       | —         | —        |
| 1.3 NEXTAUTH_SECRET   | Pending | —       | —         | —        |
| 1.4 Auth Middleware   | Pending | —       | —         | —        |
| 1.5 File Upload       | Pending | —       | —         | —        |
| 1.6 Path Traversal    | Pending | —       | —         | —        |
| 1.7 Safe Evaluator    | Pending | —       | —         | —        |
| 2.1 Indexes           | Pending | —       | —         | —        |
| 2.2 Transactions      | Pending | —       | —         | —        |
| 2.3 FK Fix            | Pending | —       | —         | —        |
| 2.4 Portable SQL      | Pending | —       | —         | —        |
| 3.1 Error Format      | Pending | —       | —         | —        |
| 3.2 Rate Limiting     | Pending | —       | —         | —        |
| 4.1 BEE Import        | Pending | —       | —         | —        |
| 4.2 Turbo Test        | Pending | —       | —         | —        |
| 4.3 Root Config       | Pending | —       | —         | —        |
| 4.4 Dead Deps         | Pending | —       | —         | —        |
| 5.1 CI Pipeline       | Pending | —       | —         | —        |
| 5.2 KS Tests          | Pending | —       | —         | —        |
| 5.3 BDL Cleanup       | Pending | —       | —         | —        |
| 6.1 Shared Components | Pending | —       | —         | —        |
| 6.2 Type Safety       | Pending | —       | —         | —        |
| 6.3 Error Handling    | Pending | —       | —         | —        |
| 6.4 Layout            | Pending | —       | —         | —        |
| 7.1 README            | Pending | —       | —         | —        |
| 7.2 API Docs          | Pending | —       | —         | —        |
| 7.3 Hardening Report  | Pending | —       | —         | —        |
