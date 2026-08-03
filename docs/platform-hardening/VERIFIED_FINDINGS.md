# Verified Findings

**Audit Date:** 2026-08-03
**Verification Date:** 2026-08-03
**Method:** Direct source code inspection of every finding

---

## Summary

| #   | Finding                        | Verdict             | Severity | Exploitability                      |
| --- | ------------------------------ | ------------------- | -------- | ----------------------------------- |
| 1   | RCE via `new Function()`       | PARTIALLY CORRECT   | Critical | LOW — not reachable from API        |
| 2   | Runtime API zero auth          | CONFIRMED           | Critical | HIGH — fully open                   |
| 3   | Runtime API CORS `*`           | CONFIRMED           | Critical | HIGH — any origin                   |
| 4   | Path traversal in runtime API  | PARTIALLY CORRECT   | High     | LOW — constrained by `.json` suffix |
| 5   | No NEXTAUTH_SECRET             | CONFIRMED           | Critical | HIGH — JWT forging                  |
| 6   | File upload no validation      | CONFIRMED           | Critical | HIGH — exhaustion + traversal       |
| 7   | Auth middleware missing        | PARTIALLY CORRECT   | High     | HIGH — 6/7 routes leak data         |
| 8   | Zero DB indexes                | CONFIRMED           | High     | N/A — performance degradation       |
| 9   | Zero transactions              | CONFIRMED           | High     | N/A — data corruption on failure    |
| 10  | No CI pipeline                 | CONFIRMED           | High     | N/A — quality gate absence          |
| 11  | No test task in turbo          | CONFIRMED           | Medium   | N/A — tests don't run               |
| 12  | Circular dependencies          | PARTIALLY CORRECT   | Medium   | N/A — type-only at runtime          |
| 13  | @bhavya/ui is a stub           | CONFIRMED           | Medium   | N/A — broken dependency chain       |
| 14  | BEE relative path import       | CONFIRMED           | Medium   | N/A — fragile import                |
| 15  | FK violation in artifacts.ts   | CONFIRMED           | High     | N/A — runtime failure               |
| 16  | Duplicate listArtifacts        | CONFIRMED           | Low      | N/A — dead code                     |
| 17  | Zero shared components         | CONFIRMED           | Medium   | N/A — maintainability               |
| 18  | Tailwind unused                | CONFIRMED           | Low      | N/A — dead dependency               |
| 19  | lucide-react unused            | CONFIRMED           | Low      | N/A — dead dependency               |
| 20  | Empty BDL test files           | PARTIALLY INCORRECT | Medium   | N/A — 6 empty, 114 stubs            |
| 21  | Zero tests in knowledge-studio | CONFIRMED           | High     | N/A — no regression safety          |
| 22  | Kernel tests are custom        | CONFIRMED           | Medium   | N/A — CI cannot run them            |
| 23  | Version inconsistency          | CONFIRMED           | Low      | N/A — documentation drift           |
| 24  | Empty catch blocks             | CONFIRMED           | Medium   | N/A — silent failures               |
| 25  | Pervasive `any` types          | CONFIRMED           | Medium   | N/A — type safety                   |

---

## Finding 1: RCE via `new Function()`

**Severity:** Critical
**Confirmed:** PARTIALLY CORRECT

### Evidence

`packages/runtime/src/engines/workflow-engine.ts:435-438`:

```typescript
const func = new Function(
  ...Object.keys(execution.variables),
  `return ${condition}`,
);
return func(...Object.values(execution.variables));
```

`packages/runtime/src/engines/governance-engine.ts:352-355`:

```typescript
const func = new Function(...Object.keys(context), `return ${rule.condition}`);
const passed = func(...Object.values(context));
```

### Root Cause

Both engines use `new Function()` to evaluate dynamic conditions from workflow steps and governance rules. This is functionally equivalent to `eval()`.

### Exploitability Assessment

**LOW.** The runtime API (`packages/runtime/cli/api.mjs`) does NOT import or reference workflow-engine or governance-engine. The CLI imports only:

- `capability-engine.mjs`
- `knowledge-pipeline.mjs`
- `course-manager.mjs`
- `lesson-manager.mjs`

The engines are exported from `packages/runtime/src/engines/index.ts` but this TypeScript source is not consumed by the JavaScript CLI. No HTTP endpoint exposes workflow or governance CRUD operations.

### Impact

If engines are ever exposed via API, arbitrary JavaScript execution on the server becomes possible. Currently a ticking time bomb, not an active vulnerability.

### Recommended Fix

Replace `new Function()` with a safe expression evaluator (e.g., `expr-eval` package or manual condition parsing). Even if unreachable today, this pattern is inherently dangerous and should be eliminated.

### Estimated Effort

2 hours — replace `new Function()` in 2 files with safe evaluator.

---

## Finding 2: Runtime API Zero Auth

**Severity:** Critical
**Confirmed:** YES

### Evidence

`packages/runtime/cli/api.mjs:55-83` — The entire HTTP server has no authentication:

```javascript
export async function startServer(root, port = 3100) {
  const server = http.createServer(async (req, res) => {
    // ... no auth middleware
    await route(root, method, parts, url, req, res);
  });
}
```

No `Authorization` header check, no API key, no token validation, no session check.

### Affected Endpoints

All endpoints are fully unauthenticated:

- `/capability/:id` POST — Execute any capability
- `/pipeline` POST — Run full knowledge pipeline
- `/courses` POST — Create courses
- `/courses/:id` PUT/DELETE — Modify/delete any course
- `/lessons` POST — Create lessons
- `/lessons/:id` PUT/DELETE — Modify/delete any lesson
- `/knowledge` POST — Create knowledge objects
- `/knowledge/:id` PUT/DELETE — Modify/delete any KO
- `/metrics` GET — Read all metrics
- `/registry` GET — Read skill registry
- `/provenance` GET — Read all provenance

### Root Cause

The runtime API was built as a local development tool without considering network exposure. No authentication layer was ever implemented.

### Exploitability

HIGH. Any device on the network can reach port 3100 and perform full CRUD on all content.

### Impact

Complete data compromise. An attacker can create, modify, or delete any knowledge object, course, lesson, or artifact.

### Recommended Fix

Add API key authentication middleware. Require `X-API-Key` header on all endpoints except `/health`. Store the key in environment variable `RUNTIME_API_KEY`.

### Estimated Effort

3 hours — add middleware to api.mjs, validate key on all routes.

---

## Finding 3: Runtime API CORS Wildcard

**Severity:** Critical
**Confirmed:** YES

### Evidence

`packages/runtime/cli/api.mjs:51`:

```javascript
function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
```

`packages/runtime/cli/api.mjs:61-62`:

```javascript
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader(
  "Access-Control-Allow-Methods",
  "GET, POST, PUT, DELETE, OPTIONS",
);
```

### Root Cause

CORS was set to `*` for development convenience. No restriction was ever added.

### Exploitability

HIGH. Any website on the internet can make cross-origin requests to the runtime API. Combined with Finding 2 (no auth), a malicious webpage can perform all operations.

### Impact

Cross-origin attacks, CSRF-like exploitation, data exfiltration from any domain.

### Recommended Fix

Restrict CORS to specific origins. Default to `http://localhost:3020` (Lesson Studio) and `http://localhost:3030` (Knowledge Studio). Make configurable via `CORS_ORIGINS` environment variable.

### Estimated Effort

1 hour — modify CORS headers in api.mjs.

---

## Finding 4: Path Traversal in Runtime API

**Severity:** High
**Confirmed:** PARTIALLY CORRECT

### Evidence

`packages/runtime/cli/api.mjs:262-265`:

```javascript
const koDir = path.resolve(root, "bhavya-ai-lab/knowledge/objects");
if (id && method === "GET") {
  const ko = readJSON(path.join(koDir, `${id}.json`));
```

The `id` parameter comes from URL parsing and is interpolated into file paths. However:

- `path.join()` collapses `../` sequences on most platforms
- The `.json` suffix limits which files can be read
- The base directory is fixed

### Root Cause

No input validation on the `id` parameter before file path construction.

### Exploitability

LOW. Traversal is constrained by the `.json` suffix and `path.join()` behavior. An attacker could potentially read files like `../../config.json` but not arbitrary files.

### Impact

Partial directory traversal. Read/write/delete of `.json` files outside the intended directory.

### Recommended Fix

Validate `id` against strict regex `/^[a-zA-Z0-9_-]+$/` before any file operations.

### Estimated Effort

1 hour — add validation function, apply to all route handlers.

---

## Finding 5: No NEXTAUTH_SECRET

**Severity:** Critical
**Confirmed:** YES

### Evidence

`apps/knowledge-studio/src/lib/auth.ts:6-50` — `authOptions` has no `secret` field.

`apps/knowledge-studio/.env:1-8` — Contains only `DATABASE_URL`. No `NEXTAUTH_SECRET`.

### Root Cause

NextAuth configuration was created without setting a secret. The `.env` file was never updated.

### Exploitability

HIGH in development (sessions invalidate on restart). BLOCKING in production (NextAuth refuses to start).

### Impact

In development: sessions break on every restart. In production: application won't start. If bypassed: unsigned JWTs could be forged.

### Recommended Fix

Generate a strong secret, add to `.env`, add `secret: process.env.NEXTAUTH_SECRET` to authOptions.

### Estimated Effort

30 minutes.

---

## Finding 6: File Upload No Validation

**Severity:** Critical
**Confirmed:** YES

### Evidence

`apps/knowledge-studio/src/app/api/ingest/route.ts:33-67`:

```typescript
const file = formData.get("file") as File | null;
if (file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name}`;
  writeFileSync(join(UPLOAD_DIR, filename), buffer);
```

Missing:

- No file size limit
- No file type whitelist
- No filename sanitization
- `writeFileSync` blocks event loop

### Root Cause

File upload was implemented without security considerations. No validation layer exists.

### Exploitability

HIGH. Path traversal via malicious filename, disk exhaustion via large files, arbitrary file write.

### Impact

Server compromise via file write, denial of service via disk exhaustion.

### Recommended Fix

Add `MAX_FILE_SIZE` (10MB), whitelist extensions (`.pdf`, `.docx`, `.md`, `.txt`), sanitize filenames, use async write.

### Estimated Effort

2 hours.

---

## Finding 7: Auth Middleware Missing

**Severity:** High
**Confirmed:** PARTIALLY CORRECT

### Evidence

`apps/knowledge-studio/src/middleware.ts` is empty (exported as `{}`).

Per-route analysis:

- `api/ingest/route.ts` — Returns 401 if `!session?.user` ✅
- `api/execute/route.ts` — Returns 401 if `!session?.user` ✅
- `api/kos/route.ts` — `auth()` called but not enforced ❌
- `api/search/route.ts` — `auth()` called but not enforced ❌
- `api/packages/route.ts` — `auth()` called but not enforced ❌
- `api/pipelines/route.ts` — `auth()` called but not enforced ❌
- `api/status/route.ts` — No auth call at all ❌
- `api/versions/route.ts` — No auth call at all ❌
- `api/artifacts/route.ts` — No auth call at all ❌

### Root Cause

Auth was added to some routes but not enforced consistently. No shared helper exists.

### Exploitability

HIGH. 6/7 routes return all data to unauthenticated users.

### Impact

Complete data exposure. All knowledge objects, packages, artifacts, and pipeline executions readable without login.

### Recommended Fix

Create `requireAuth()` helper. Add to all routes. Return 401 if no session.

### Estimated Effort

2 hours.

---

## Finding 8: Zero DB Indexes

**Severity:** High
**Confirmed:** YES

### Evidence

`apps/knowledge-studio/src/lib/db.ts:22-121` — `initSchema()` creates 5 tables with zero `CREATE INDEX` statements. Only implicit indexes from PRIMARY KEY and UNIQUE constraints.

### Root Cause

Schema was created without considering query performance. Indexes were never added.

### Impact

All queries on FK columns (`user_id`, `ko_id`, `package_id`) and filter columns (`email`, `domain`, `status`) do full table scans. Performance degrades linearly with data growth.

### Recommended Fix

Add indexes on all FK columns and frequently queried columns.

### Estimated Effort

1 hour.

---

## Finding 9: Zero Transactions

**Severity:** High
**Confirmed:** YES

### Evidence

`apps/knowledge-studio/src/app/api/execute/route.ts:36-191` — 12 sequential DB writes with no transaction wrapper. `deleteKO()` in `db.ts:323-329` runs 4 deletes without transaction.

### Root Cause

No transaction pattern was established. Each operation is independent.

### Impact

Pipeline failure leaves DB in inconsistent state: orphaned artifacts, packages without executions, executions marked "running" forever.

### Recommended Fix

Wrap pipeline execution in `db.transaction()`. Wrap delete operations in transactions.

### Estimated Effort

2 hours.

---

## Finding 10: No CI Pipeline

**Severity:** High
**Confirmed:** YES

### Evidence

`.github/workflows/` contains only `deploy.yml` — Vercel deployment only. No lint, test, typecheck, or build jobs.

### Root Cause

CI was never implemented beyond deployment.

### Impact

Broken code ships to production without detection.

### Recommended Fix

Add `.github/workflows/ci.yml` with lint, typecheck, test, build steps.

### Estimated Effort

2 hours.

---

## Finding 11: No Test Task in Turbo

**Severity:** Medium
**Confirmed:** YES

### Evidence

`turbo.json` defines 5 tasks: `build`, `dev`, `lint`, `typecheck`, `clean`. No `test` task.

### Root Cause

Test task was never added to turbo configuration.

### Impact

`pnpm test` at root level is a no-op.

### Recommended Fix

Add `test` task to turbo.json.

### Estimated Effort

15 minutes.

---

## Finding 12: Circular Dependencies

**Severity:** Medium
**Confirmed:** PARTIALLY CORRECT

### Evidence

`packages/kernel/package.json` depends on 7 engine packages. All 7 engine packages depend back on `@bhavya/kernel`. However, engine imports are type-only:

```typescript
import type { Agent, AgentId, ... } from '@bhavya/kernel'
```

### Root Cause

Types are defined in kernel but needed by engines. No separate types package exists.

### Impact

Package managers and bundlers may have issues with the cycle. Runtime behavior is unaffected (type-only imports are erased).

### Recommended Fix

Extract types into `@bhavya/types` package. Remove kernel dependency from engines.

### Estimated Effort

4 hours.

---

## Finding 13: @bhavya/ui is a Stub

**Severity:** Medium
**Confirmed:** YES

### Evidence

`packages/ui/src/index.ts` — 3 lines, exports only `__bhavya_ui_version__ = "0.5.0"`. Zero components.

### Root Cause

UI package was created as a placeholder but never implemented.

### Impact

4 apps declare it as dependency but get nothing. Broken dependency chain.

### Recommended Fix

Either implement basic components or remove from dependency lists. Given the hardening scope, remove from dependency lists and note as future work.

### Estimated Effort

30 minutes (to remove from dependency lists).

---

## Finding 14: BEE Relative Path Import

**Severity:** Medium
**Confirmed:** YES

### Evidence

`packages/bee/src/index.mjs:2`:

```javascript
import { createRegistry } from "../../runtime/src/registry-loader.mjs";
```

### Root Cause

BEE was built as a quick integration without proper package linking.

### Impact

Fragile import that breaks if either package moves. Prevents proper package publishing.

### Recommended Fix

Add `@bhavya/runtime` as a workspace dependency in bee's package.json. Update import to use package path.

### Estimated Effort

30 minutes.

---

## Finding 15: FK Violation in artifacts.ts

**Severity:** High
**Confirmed:** YES

### Evidence

`apps/knowledge-studio/src/lib/artifacts.ts:73-89` — `savePipelineResult` inserts with hardcoded `'system'` as `user_id` and `'unknown'` as `ko_id`. Both columns have FOREIGN KEY constraints referencing `users(id)` and `knowledge_objects(id)`.

### Root Cause

`savePipelineResult` was written for a different data model and never updated to match the schema.

### Impact

Insert fails with FK violation. Pipeline results cannot be saved via this function.

### Recommended Fix

Remove `savePipelineResult` from artifacts.ts. Use `createExecution` and `createArtifact` from db.ts instead (which the execute route already does).

### Estimated Effort

30 minutes.

---

## Finding 16: Duplicate listArtifacts

**Severity:** Low
**Confirmed:** YES

### Evidence

`db.ts:528-546` and `artifacts.ts:42-60` — identical `listArtifacts` functions. The API route imports from `artifacts.ts`. The `db.ts` version is dead code.

### Root Cause

Function was implemented in both files during refactoring.

### Impact

Dead code, maintenance burden.

### Recommended Fix

Remove `listArtifacts` from `db.ts`.

### Estimated Effort

15 minutes.

---

## Finding 17: Zero Shared Components

**Severity:** Medium
**Confirmed:** YES

### Evidence

`apps/knowledge-studio/src/components/` contains exactly 1 file: `sidebar.tsx`. No other components.

### Root Cause

Component extraction was never done. Every page builds UI from scratch.

### Impact

2,500+ lines of duplicated inline styles. Visual changes require editing 9+ files.

### Recommended Fix

Create shared components: `PageShell`, `StatCard`, `StatusBadge`, `LoadingState`, `ErrorState`.

### Estimated Effort

4 hours.

---

## Finding 18: Tailwind Unused

**Severity:** Low
**Confirmed:** YES

### Evidence

`globals.css` has `@import "tailwindcss"` but zero `className` usage in any TSX file.

### Root Cause

Tailwind was installed but the app was built with inline styles instead.

### Impact

Dead dependency. No impact on functionality.

### Recommended Fix

Remove `tailwindcss` from devDependencies. Remove `@import "tailwindcss"` from globals.css. Note: keeping Tailwind is also valid if we plan to migrate to it during refactoring.

### Estimated Effort

15 minutes.

---

## Finding 19: lucide-react Unused

**Severity:** Low
**Confirmed:** YES

### Evidence

`package.json` lists `lucide-react` but zero imports found.

### Root Cause

Dependency installed but never used.

### Impact

Dead dependency.

### Recommended Fix

Remove from package.json.

### Estimated Effort

15 minutes.

---

## Finding 20: Empty BDL Test Files

**Severity:** Medium
**Confirmed:** PARTIALLY INCORRECT

### Evidence

Only 6 files are truly 0 bytes (all in Button component). The remaining 114 non-Button files are stubs (1-line comments, minimal boilerplate with no real logic).

### Root Cause

BDL was scaffolded with placeholder files but never implemented.

### Impact

False impression of test coverage. Design system has no real tests.

### Recommended Fix

Remove empty files. Convert stubs to meaningful tests during testing phase.

### Estimated Effort

2 hours.

---

## Finding 21: Zero Tests in Knowledge Studio

**Severity:** High
**Confirmed:** YES

### Evidence

Zero test files. No test script in package.json.

### Root Cause

Testing was never implemented for knowledge-studio.

### Impact

No regression safety for the primary application.

### Recommended Fix

Add vitest config, create test files for DB operations and API routes.

### Estimated Effort

4 hours.

---

## Finding 22: Kernel Tests Are Custom

**Severity:** Medium
**Confirmed:** YES

### Evidence

`packages/kernel/src/__tests__/integration.test.ts` defines its own `IntegrationTest` class with manual try/catch and console output. No vitest/jest imports.

### Root Cause

Kernel tests were written before a test runner was established.

### Impact

Tests cannot be discovered by CI, no coverage reporting, no standard filtering.

### Recommended Fix

Convert to vitest or note as future work (kernel is not in the critical path for hardening).

### Estimated Effort

4 hours (future work).

---

## Finding 23: Version Inconsistency

**Severity:** Low
**Confirmed:** YES

### Evidence

- `package.json`: `0.1.0`
- `CHANGELOG.md`: `v3.1.0`
- `PLATFORM_GUARANTEES.md`: `3.0.0`

### Root Cause

Root package.json version was never updated.

### Impact

Confusion about actual version.

### Recommended Fix

Update package.json to `3.1.0` to match CHANGELOG.

### Estimated Effort

5 minutes.

---

## Finding 24: Empty Catch Blocks

**Severity:** Medium
**Confirmed:** YES

### Evidence

7 locations with silently swallowed errors:

- 5 `.catch(() => setLoading(false))` patterns
- 2 empty `catch {}` blocks

### Root Cause

Error handling was not implemented. Catch blocks were left empty during development.

### Impact

Users see "Loading..." indefinitely on errors. No error feedback.

### Recommended Fix

Add proper error state handling in each location.

### Estimated Effort

2 hours.

---

## Finding 25: Pervasive `any` Types

**Severity:** Medium
**Confirmed:** YES

### Evidence

19 occurrences of `: any` across 6 page files. `packages/page.tsx` has 10 occurrences — its entire data model is untyped.

### Root Cause

TypeScript types were not defined for API responses.

### Impact

No type safety, no IDE support, runtime errors from wrong property access.

### Recommended Fix

Define interfaces for all API response types.

### Estimated Effort

2 hours.
