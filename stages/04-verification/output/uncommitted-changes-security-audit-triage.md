# Security & Audit Triage — Uncommitted Change Set (apps/ai-institute)

| Field      | Value                                                                                                                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date       | 2026-10-15                                                                                                                                                                                |
| Stage      | 04-verification                                                                                                                                                                           |
| Branch     | `feat/immersive-hero-background` @ `76a9732`                                                                                                                                              |
| Scope      | Uncommitted change set in `apps/ai-institute` (720 untracked + 47 modified; nothing staged)                                                                                               |
| Method     | Read-only review against the `bhavya-security` checklist: Authentication / Authorization / Input Validation / Secret Handling / Server-Client Boundaries / Web Security / Logging & Audit |
| Limitation | Triage only — local gates (`pnpm typecheck` / `lint` / `test` / `build`) not executed on this machine (CI-only per the machine resource contract)                                         |

## Findings

### #1 — Medium — Authorization: role gate removed from `POST /api/student/progress`

- **Evidence**: `apps/ai-institute/src/app/api/student/progress/route.ts` — only `requireAuth` (l.22); rate limit is `RateLimits.default` (l.29, previously `RateLimits.progress`). `src/lib/auth.ts` provides authentication only — no RBAC enforcement.
- **Impact**: Any authenticated account (any role) can write progress to its own student record. Certificate issuance reads self-reported completion fields, so progress toward module completion can be self-attested.
- **Fix**: Restore the role gate (inline check or add `requireRole` to `src/lib/auth.ts`), restore `RateLimits.progress`, and add a route test covering the 403 path.

### #2 — Medium (missing events) / Low (empty actor email) — Audit coverage reduced; `actor_email` always empty

- **Evidence**: `apps/ai-institute/src/lib/audit.ts` (29 lines) — `actor_email` is always `""`; `result` defaults to `"success"`. Removed events: certificate-issue, quiz-submit, project-submit, enroll, curriculum-progress-sync. Remaining: `lesson-complete` (progress route l.109) and `module-quiz-submit` (l.153–159).
- **Impact**: Material reduction in audit coverage for high-value actions; empty `actor_email` weakens traceability.
- **Fix**: Re-add audit events at the new call sites; pass `user.email` (or join `profiles`); cover failure paths.

### #3 — High (functionality) / Medium (security posture) — `POST /api/certificates` is a stub

- **Evidence**: `apps/ai-institute/src/app/api/certificates/route.ts` — only `POST` (l.46); no persistence; IDs are `cert-${Date.now()}-...`; no `GET`/verify endpoint; audit write and `X-Correlation-Id` response header removed. No consumers found in `src`.
- **Impact**: Returns non-persisted certificates — either a dead surface or a broken feature depending on intent.
- **Fix**: Decide ship vs remove. If ship: persist, audit, and add `GET /api/certificates/verify`; use or delete the remaining correlationId plumbing.

### #4 — High (functional regression) — Progress route dropped six action branches; all six live callers now receive 400

- **Evidence**: `apps/ai-institute/src/app/api/student/progress/route.ts` — switch at l.74 now handles only `lesson-complete` (l.75) and `module-quiz-submit` (l.124); `default:` at l.169 returns 400 `{ error: "Unknown action" }` (l.170). Live callers:
  - `src/components/AuthProvider.tsx` — fetches l.207/223/239/255/274/290; actions `enroll` l.210, `completeLab` l.242, `submitQuiz` l.259, `submitProject` l.277, `addReflection` l.294
  - `src/app/assessment/page.tsx` — fetches l.31/39; `submitQuiz` l.35, `enroll` l.43
  - `src/app/courses/[id]/enroll-button.tsx` — fetch l.31; `enroll` l.34
  - `src/lib/curriculum/ai-progress-sync.ts` — `PROGRESS_ENDPOINT` l.1; `syncCurriculumProgress` l.11; test (`__tests__/ai-progress-sync.test.ts`) expects body.action `"syncCurriculumProgress"` (l.36/72)
  - `src/components/curriculum/ModuleQuiz.tsx` l.40; `QuizBlock.tsx` l.46
- **Impact**: enroll, completeLab, submitQuiz, submitProject, addReflection, and syncCurriculumProgress flows all fail with 400.
- **Fix**: Restore the branches (aligned with #1/#2 remediation) or migrate all six callers in the same change set.

### #5 — Medium — B2 key-path mismatch between `assetUrls.ts` and `b2/storage.ts`

- **Evidence**: `src/lib/assetUrls.ts` builds `/models/gltf/` + `/hdris/` paths (base `B2_PUBLIC_URL_BASE`, default `https://f002.backblazeb2.com/file/${B2_BUCKET || "bhavya-ai-assets"}`). `src/lib/b2/storage.ts` writes `3d-models/gltf/` + `textures/hdri/` keys and builds URLs as `${S3_ENDPOINT}/${S3_BUCKET_NAME}/${key}` (no `/file/`). Textures and videos match; models/HDRIs do not.
- **Impact**: Model/HDR URLs built by one module will not resolve to objects written by the other.
- **Fix**: Reconcile key paths and URL base before trusting either module.

### #6 — Low — Minor code-quality issues

- **Evidence**: duplicated SELECT in profile auto-create (no-op re-query); `updateStudent` raw-SQL helper (internal keys only).
- **Impact**: Low risk; no user-facing exposure.
- **Fix**: Remove the duplicate query; consider a parameterized query helper for `updateStudent`.

### #7 — Info — QA artifacts uncommitted and not gitignored

- **Evidence**: `.playwright-mcp/` (581 files) plus root QA artifacts (`prod-*.png`, `typecheck-output*.txt`, `test-3d-hero.cjs`, `qa-screenshots/`) are untracked but not covered by `.gitignore`.
- **Impact**: Risk of accidental inclusion in a commit.
- **Fix**: Decide keep vs ignore vs delete; update `.gitignore` accordingly before any commit.

## Summary

| #   | Severity      | Area                  | Finding                                                   |
| --- | ------------- | --------------------- | --------------------------------------------------------- |
| 4   | High          | Functional regression | Six action branches dropped; all live callers receive 400 |
| 3   | High / Medium | API stub + posture    | Certificates endpoint returns non-persisted records       |
| 1   | Medium        | Authorization         | Role gate removed from progress route                     |
| 2   | Medium / Low  | Audit                 | Events removed; `actor_email` always empty                |
| 5   | Medium        | Assets                | B2 key-path mismatch (models/HDRIs)                       |
| 6   | Low           | Code quality          | Duplicate query; raw SQL helper                           |
| 7   | Info          | Hygiene               | QA artifacts untracked, not gitignored                    |

## Conclusion

Recommended remediation order: **#4 → #3 → #1 / #2 → #5 → #6 / #7** — #4, #1, and #2 touch the same route and should be addressed together.

Read-only triage — no code changes made.
