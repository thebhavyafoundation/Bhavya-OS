# Foundation v2 — Plan C: Certificate of Completion + Studio Gallery

Status: draft
Date: 2026-09-30
Branch: `build/plan-c-cert-gallery`
Author: Session C agent (session 1)
Brief: `session-c-brief.md`
Related plan (structure mirror): `docs/superpowers/plans/2026-09-26-foundation-v2-plan-b-curriculum.md`

## For agentic workers

This is an execution plan, not a design debate. Read the "Global constraints" and
"Scope boundaries" sections before touching code. Every task states files,
interfaces, and a verification step. A task is done only when its verification
step passes and the code is committed on this branch.

## Goal

Two user-visible features in `apps/ai-institute`, both derived from existing data
(so no new claims are invented):

1. **Certificate of completion.** A learner who has finished every lesson of a
   published academy course can claim a credential. The credential renders as a
   certificate page with the official logo, holder name, course title, level,
   issue date, an unguessable credential id, and a QR code pointing at a public
   verification URL. `/verify/[credentialId]` returns an honest valid /
   not-found answer. The certificate can be downloaded as a PNG rendered
   client-side from the live DOM (no server rasterization).

2. **Studio gallery.** Users holding a content-management role can upload photos
   through a Studio screen. Uploaded photos appear immediately on a public
   `/gallery` page that is labeled honestly as studio upload content.

## Architecture

- **App:** `apps/ai-institute` (Next.js App Router, OpenNext Cloudflare).
- **Data:** existing local SQLite / Turso async adapter
  (`src/lib/db.ts` `getAsyncDb()`), the app's single data store. No new data
  store, no new service, no new package.
- **Layers (existing pattern):** server components read via `src/lib/*-store.ts`;
  mutations only through route handlers (`src/app/api/**/route.ts`) which do
  `requireAuth` + validation + parameterized SQL + audit event. Pages never write.
- **Schema:** versioned migrations under
  `packages/database/migrations/ai-institute/006_*.ts` and `007_*.ts` (the local
  migration framework that every test run executes via `initDatabase()`), plus a
  runtime `CREATE TABLE IF NOT EXISTS` ensure inside the store for production,
  where only `BASELINE_SCHEMA` is applied.

## Tech stack

- Next.js App Router route handlers + server components, React client components
  for interactive parts.
- `qrcode` (QR data URL, rendered **server-side** in the certificate page) and
  `html-to-image` (client-side PNG
  export) — installed at `apps/ai-institute` per brief allowance.
- Design tokens only from `packages/platform-ui/src/styles/tokens.css`
  (`--color-forest-*`, `--color-ivory-*`, `--color-gold-*`, `--color-sage-*`,
  `--color-earth-*`, `--font-display`, `--font-sans`, `--space-*`).
- Existing helpers: `requireAuth`, `requireSessionUser`, `hasRole`, `isKnownRole`,
  `auditEvent`/`recordAuditEvent`, `RateLimits`, `getStudentByUserId`.

## REASONS summary (dimensions the plan satisfies)

| Dimension    | Decision in this plan                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Requirements | Certificate claim after all lessons complete; role-gated gallery upload; public gallery + public verify.                        |
| Entities     | Two app-local tables (`certificates`, `gallery_photos`); no new shared package (08 Art.3.4).                                    |
| Approach     | Derive everything from existing course/lesson/completion data; claim is write-once (08 8.3).                                    |
| Structure    | `api/certificates`, `api/studio/gallery`, `api/gallery`, pages `certificates/[id]`, `verify/[id]`, `studio/gallery`, `gallery`. |
| Operations   | Migration files + runtime ensure; local gates only (no builds); rollback = drop the two tables.                                 |
| Norms        | Tokens only, asymmetric editorial layout, one motion moment per view, reduced motion, claims registry untouched.                |
| Safeguards   | Auth on every mutation, role check, size/type/rate caps on upload, parameterized SQL, unguessable credential ids, honest copy.  |

## Global constraints

1. **Verification contract** (i3/8GB machine, GitHub Actions dead): run only
   `npx tsc --noEmit -p apps/ai-institute/tsconfig.json`, `npx eslint <changed
paths>`, `pnpm --filter @bhavya/ai-institute exec vitest run`,
   `pnpm tokens:check`, `pnpm antislop`, `git diff --check`. Never run
   `pnpm build`, `turbo build`, `next build`, or a full monorepo `pnpm test`.
2. **Git:** conventional commits (`feat(certificate): ...`, `feat(gallery): ...`),
   subject imperative, body lines max 100 chars, one logical change per commit.
   Stage only intended files. Never stage `opencode.json` or
   `packages/database/data/bhavya.db`. Push + PR to `master`, never merge.
3. **No questions mid-flight.** Record assumptions under "Open questions" and
   keep going.
4. **Honesty:** no invented numbers, no accreditation or official-authority
   language, no photographer/source attribution for uploaded photos, no new
   claims in `src/lib/claims.ts` (Plan B owns its edits; `isApprovedNumber`
   inputs stay valid).
5. **Design:** one authored motion moment per view, `prefers-reduced-motion`
   honored, no hardcoded colors/fonts, display sizes <= 6rem with tracking >=
   -0.04em, no eyebrow labels above headings, asymmetric composition.
6. **Security (bhavya-security):** server-side validation on all input,
   parameterized SQL, role checks on every studio mutation, size/type caps on
   uploads, rate limiting on upload, no secrets in client code, no client-side DB
   access.

## Scope boundaries

Owned by this plan and nothing else:

- `packages/database/migrations/ai-institute/006_certificates.ts`,
  `007_gallery_photos.ts`
- `apps/ai-institute/src/lib/certificate*.ts`, `gallery*.ts` (new)
- `apps/ai-institute/src/app/api/certificates/**`,
  `api/studio/gallery/**`, `api/gallery/**`
- `apps/ai-institute/src/app/certificates/**`, `verify/**`, `gallery/**`,
  `studio/gallery/**`
- New client components for claim, lesson-complete, upload form, certificate
  render/download
- Additive rows in `docs/architecture/CANONICAL_ROUTE_MAP.md`,
  `docs/architecture/DOMAIN_OWNERSHIP.md`, `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md`
- One-line CRLF fix in `scripts/sync-tokens.mjs` (see Task 13)

Explicitly out of scope (do not edit):

- `.github/workflows/**`, `.ai/current-task.md` (append-only Session C section at
  the end), `src/lib/photos.ts`, `public/photography/**`, `SplitHero.tsx`,
  homepage hero CSS/components (Session A/B), `src/lib/claims.ts`,
  `.opencode/skills/**`, auth stores, `wrangler.json`, `src/app/sitemap.ts`
  (Plan B adds its own public routes there; recorded as an open question).

## Entities

### `certificates` (migration 006)

```sql
CREATE TABLE certificates (
  id            TEXT PRIMARY KEY,
  credential_id TEXT NOT NULL UNIQUE,
  user_id       TEXT NOT NULL,
  subject_id    TEXT NOT NULL,
  subject_type  TEXT NOT NULL DEFAULT 'academy-course',
  holder_name   TEXT NOT NULL,
  subject_title TEXT NOT NULL,
  subject_level TEXT NOT NULL,
  issued_at     TEXT NOT NULL,
  created_at    TEXT NOT NULL,
  updated_at    TEXT NOT NULL,
  UNIQUE (user_id, subject_id)
);
CREATE INDEX idx_certificates_user_id ON certificates (user_id);
```

- `id`: `crypto.randomUUID()`.
- `credential_id`: lowercase, URL-safe, unguessable,
  `bv-` + 3 groups of 4 chars from `abcdef03456789mnprstvw` (56^12 entropy,
  well above unguessable), e.g. `bv-7k2m-9q4t-x8w1`.
- `UNIQUE (user_id, subject_id)` makes claim idempotent: a second POST returns
  the existing row (200), never a duplicate.
- No `deleted_at`: there is no delete path for credentials (write-once record,
  08 8.3). If a delete path is ever added, the column must be added then.
- `holder_name` / `subject_title` / `subject_level` are snapshots of the
  learner name and static course data at issue time, so the certificate renders
  identically even if course metadata later changes. The source of truth for
  eligibility remains `student_profiles.lessons_completed` + static
  `academy-courses.ts`.

### `gallery_photos` (migration 007)

```sql
CREATE TABLE gallery_photos (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  mime_type   TEXT NOT NULL,
  byte_size   INTEGER NOT NULL,
  image_data  TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL
);
CREATE INDEX idx_gallery_photos_created_at ON gallery_photos (created_at DESC);
```

- `image_data` holds a single data URL (`data:image/jpeg;base64,...`), capped at
  750 KB decoded (about 1 MB of base64 text).
- Rows are never updated or deleted after insert; `updated_at` exists because
  the architecture requires it on every table.

## Eligibility and claim rule

A certificate for course `C` may be claimed by user `U` iff:

1. `U` has a student profile (`getStudentByUserId(U.id)`), and
2. `C` exists in static `src/data/academy-courses.ts`, and
3. every lesson id reachable as `course.modules[].lessons[].id` is contained in
   `student.lessonsCompleted`.

The check runs server-side in the POST handler (never trusted from the client).
`GET /api/certificates?courseId=C` returns `{ eligible, completedLessons,
totalLessons, certificate }` so the claim button can render honestly.

**Completion loop:** no existing UI calls `completeLesson`, so the certificate
would be unreachable for a real learner. Task 7 adds a "Mark lesson complete"
button to `/courses/[id]/lessons/[lessonId]` using the existing
`AuthProvider.completeLesson` (which posts to the already-validated
`/api/student/progress`). This is the only new completion surface and it does
not change the progress API.

**Date semantics (honesty note):** the schema stores no per-lesson completion
timestamp, so the certificate records `issued_at` (the moment completion was
verified and the credential issued) and labels it "Completed". No other date is
invented. `/verify` shows the same timestamp as "Issued".

## Storage decision for gallery images (researched)

| Option                                                                | Verdict    | Reasoning                                                                                                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloudflare R2 object storage                                          | Rejected   | Needs a new bucket plus a wrangler/OpenNext binding; `wrangler.json` has none today. A second store also collides with "no shadow databases / no alternative data stores" and "never create parallel systems" (02 8.3, 08 Art.15.6). Not verifiable inside the allowed local gate set, and the deploy path is blocked while Actions are dead. |
| Existing SQLite/Turso via `getAsyncDb()`, size-capped base64 data URL | **Chosen** | No new infrastructure, no new store, works identically in local dev, tests, and production, and every step is verifiable with the allowed gates. Cost: row size, mitigated by a 750 KB cap, a list endpoint that returns metadata only, and an image endpoint that serves bytes per row.                                                      |

Byte serving design (keeps the page payload small): `GET /api/gallery` returns
metadata only; each tile renders `<img src="/api/gallery/[id]" loading="lazy">`,
so the browser fetches image bytes only for tiles near the viewport, with
`Cache-Control: public, max-age=31536000, immutable` because the URL is
id-addressed and rows never change.

## PART 1 — Certificate of completion

### Task 1: migration 006 + certificate store + pure helpers

Files:

- `packages/database/migrations/ai-institute/006_certificates.ts` (new; mirror
  `002_knowledge_objects_and_evidence.ts`: `export const migration: Migration`,
  `up`/`down`, sequential `order`, `appliesTo` unchanged)
- `apps/ai-institute/src/lib/certificate.ts` (new): types + pure functions
  - `interface CertificateRecord` (app-local type, 08 Art.3.4)
  - `issueCredentialId(): string`
  - `courseLessonIds(course): string[]`
  - `certificateEligibility(course, completedLessonIds): { eligible,
completedLessons, totalLessons }`
- `apps/ai-institute/src/lib/certificate-store.ts` (new): parameterized SQL
  - `ensureCertificatesTable()` — `CREATE TABLE IF NOT EXISTS` (production only
    has `BASELINE_SCHEMA`), called at the top of every store function
  - `insertCertificate(input): CertificateRecord` (insert + read back)
  - `findCertificateByCredentialId(id)`
  - `findCertificate(userId, subjectId)`
  - `listCertificatesByUser(userId)`

Interfaces: `certificateEligibility` is pure and unit-testable with static
course fixtures; the store takes/returns plain objects and never throws on
missing rows (returns `null`).

Verification: `npx tsc --noEmit -p apps/ai-institute/tsconfig.json`.

### Task 2: certificate API

File: `apps/ai-institute/src/app/api/certificates/route.ts` (new)

- `GET`
  - unauthenticated -> 401
  - without `courseId`: list the caller's certificates
    (`{ certificates: CertificateRecord[] }`)
  - with `courseId`: resolve course from `academy-courses.ts` (404 if unknown),
    load student profile (404 if none), return
    `{ eligible, completedLessons, totalLessons, certificate | null }`
- `POST` body `{ courseId: string }`
  - `requireAuth` -> 401 `{ error, code }`
  - JSON body guard, `courseId` string with `/^[a-z0-9-]{1,64}$/`
  - unknown course -> 404 `{ error: "Course not found", code: "not_found" }`
  - no profile -> 409 `{ error, code: "no_profile" }`
  - not eligible -> 403 `{ error, code: "not_eligible" }`
  - already issued -> 200 with the existing record (idempotent)
  - else insert + `recordAuditEvent` `certificate.claim` -> 201
- Error bodies use the architecture shape `{ error: string, code: string }`
  (a superset of the app's existing `{ error }`, so existing clients keep
  working). Rate limited with `RateLimits.api`.

Verification: `npx tsc --noEmit -p apps/ai-institute/tsconfig.json` and manual
read-through against the security checklist (auth, validation, parameterized
SQL, audit).

### Task 3: public verification page

File: `apps/ai-institute/src/app/verify/[credentialId]/page.tsx` (new)

- `export const dynamic = "force-dynamic";`
- Normalizes input (`decodeURIComponent`, trim, lowercase) and reads via
  `findCertificateByCredentialId`.
- Valid: credential id, holder name, course title, level, "Completed" date,
  plus one line stating the record was issued by Bhavya Foundation — factual,
  no accreditation wording.
- Not found: explicit "No credential matches this id" panel with a link to
  `/courses` (never a fake certificate, never a generic 404 that could be read
  as an error-page certificate).
- SEO: metadata title/description that describe verification, not the course.

Verification: typecheck; content check against the honesty rules (grep for
`accredit`, `certified by`, `license` must return nothing).

### Task 4: certificate render + PNG download

Files:

- `apps/ai-institute/src/app/certificates/[credentialId]/page.tsx` (new): server
  component, `force-dynamic`, loads the record (404 panel if missing), renders
  `<CertificateCard certificate={...} />`
- `apps/ai-institute/src/components/CertificateCard.tsx` (new, `"use client"`)

`CertificateCard` layout (Foundation mode, tokens only, no new globals file):

- Asymmetric composition: wide left column with the logo mark, "Certificate of
  Completion" in `var(--font-display)`, holder name, course title + level,
  "Completed <date>" and the credential id in monospace-ish small text; narrow
  right rail with the QR code and a gold hairline rule.
- Logo: raw `<img src="/brand/logo-full.png" alt="Bhavya Foundation">` because
  `BhavyaLogo` renders a Next `Link` and would put a link inside the exportable
  node.
- QR: **decided server-side** — `QRCode.toDataURL(verifyUrl, { margin: 1,
width: 512, color: { dark: "#0e382e", light: "#f7f4ec" } })` in
  `certificates/[credentialId]/page.tsx`, passed to `CertificateCard` as
  `qrDataUrl`. The original plan generated it client-side in `useEffect`; the
  shipped decision keeps `qrcode` out of the browser bundle (only
  `html-to-image` ships to the client) and removes the async slot entirely.
  `verifyUrl` = `process.env.NEXT_PUBLIC_SITE_URL ??
"https://bhavyafoundation.org"` + `/verify/<credentialId>`.
- PNG: `html-to-image.toPng(node, { pixelRatio: 2, cacheBust: true })` on
  click, downloaded as `<credentialId>.png`. Client-side only; no server
  rasterization, no canvas library added.
- Authored motion: a single gold rule sweep across the header on mount,
  `prefers-reduced-motion: reduce` disables it.
- All styles appended to `src/app/globals.css` under a clearly commented
  section (this file is the app's only stylesheet; a new file would fight
  Session B's homepage CSS edits for no benefit).

Verification: typecheck + `npx eslint` on the two files.

### Task 5: claim UI + credentials list

Files:

- `apps/ai-institute/src/components/CertificateClaim.tsx` (new, client): takes
  `courseId`, fetches `GET /api/certificates?courseId=`, and renders one of:
  progress ("42 of 74 lessons complete") when not eligible, a claim button when
  eligible, or a link to the issued certificate. Button calls `POST
/api/certificates` then routes to `/certificates/<credentialId>`.
- `apps/ai-institute/src/app/courses/[id]/page.tsx` (edit): mount
  `<CertificateClaim courseId={course.id} />` in the course detail column
  (below the module outline), session-aware rendering only.
- `apps/ai-institute/src/app/certificates/page.tsx` (new): **substitute for
  the planned edit to `/app/credentials`** — the read/edit tool deny rule
  `**/credentials*` blocks that path entirely, so the credential list lives at
  its own route instead: server component under
  `requireSessionUser("/certificates")` listing `listCertificatesByUser`, each
  row linking to the certificate and verify URL; empty state keeps the same
  copy shape. The `/app/credentials` static page is left untouched. Recorded
  in Open questions.

Verification: typecheck + eslint on the three files.

### Task 6 (from research): mark lesson complete

File:

- `apps/ai-institute/src/components/LessonCompleteButton.tsx` (new, client):
  reads `useAuth()`, posts the existing `completeLesson(courseId, lessonId)`,
  shows "Completed" once `student.lessonsCompleted` contains the id.
- `apps/ai-institute/src/app/courses/[id]/lessons/[lessonId]/page.tsx` (edit):
  mount it at the end of the lesson body.

Rationale is recorded under "Completion loop" above: without it no learner can
ever reach the certificate. No progress API or store changes.

Verification: typecheck + eslint.

### Task 7: certificate tests

File: `apps/ai-institute/src/lib/__tests__/certificate.test.ts` (new)

- eligibility: all lessons complete -> eligible; one missing -> not eligible;
  empty course -> not eligible; lesson count matches flattened static data
- `issueCredentialId` matches `^bv-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}$` and is
  unique across 500 samples
- store round trip against the test database (setup runs `initDatabase()`, so
  migration 006 executes here): insert, idempotent unique key, read by
  credential id, list by user, `null` for unknown id

Verification: `pnpm --filter @bhavya/ai-institute exec vitest run`.

## PART 2 — Studio gallery

### Task 8: migration 007 + gallery store + validation

Files:

- `packages/database/migrations/ai-institute/007_gallery_photos.ts` (new)
- `apps/ai-institute/src/lib/gallery-validation.ts` (new, pure)
  - `MAX_GALLERY_BYTES = 750_000`
  - `ALLOWED_IMAGE_MIME = ["image/jpeg", "image/png", "image/webp"]`
  - `parseImagePayload(value: unknown): { ok: true; dataUrl; mimeType;
byteSize } | { ok: false; reason }`
    - prefix must be `data:image/(jpeg|png|webp);base64,`
    - base64 charset + length guard before decode (cheap DoS guard)
    - magic bytes after decode: `FF D8 FF` (jpeg), `89 50 4E 47` (png),
      `52 49 46 46` + `WEBP` at offset 8 (webp)
    - decoded size within `MAX_GALLERY_BYTES`
  - `normalizeTitle` (trim, 1..120), `normalizeDescription` (trim, <=500, `""` ->
    null)
- `apps/ai-institute/src/lib/gallery-store.ts` (new): `ensureGalleryTable()`,
  `insertGalleryPhoto`, `listGalleryPhotos(limit = 60)` (metadata only),
  `getGalleryPhoto(id)` (full row), `countGalleryPhotos()`

Verification: typecheck.

### Task 9: gallery API + rate limit

Files:

- `apps/ai-institute/src/lib/rate-limit.ts` (edit, additive only): add
  `galleryUpload: { maxRequests: 10, windowMs: 60 * 60 * 1000 }`
- `apps/ai-institute/src/app/api/studio/gallery/route.ts` (new)
  - `GET`: `requireAuth` + `hasRole(user, CONTENT_MANAGEMENT_ROLES)` -> 403
    otherwise; returns metadata list (admin view includes `uploadedBy`)
  - `POST`: same auth + role gate, `RateLimits.galleryUpload` keyed by user id,
    JSON body `{ title, description?, image }` validated through
    `gallery-validation`, insert, `recordAuditEvent` `gallery.upload` -> 201
    with metadata. Validation failure -> 400 `{ error, code: "invalid_image" }`
    or `"invalid_title"`. Oversize -> 413 `{ error, code: "too_large" }`.
- `apps/ai-institute/src/app/api/gallery/route.ts` (new): public, no auth,
  metadata list for the public page (title, description, mime, byteSize, id,
  createdAt). No image bytes here.
- `apps/ai-institute/src/app/api/gallery/[id]/route.ts` (new): public, id
  lookup, 404 `{ error, code }` when missing, otherwise bytes with
  `Content-Type: <mime>`, `Content-Length`, `Cache-Control: public,
max-age=31536000, immutable`.

Verification: typecheck + eslint.

### Task 10: studio upload screen

Files:

- `apps/ai-institute/src/app/studio/gallery/page.tsx` (new): server component;
  reads role via `requireSessionUser("/studio")` (the `/studio` route policy
  already allows admin/educator/instructor) then double-checks
  `hasRole(..., CONTENT_MANAGEMENT_ROLES)` before rendering
- `apps/ai-institute/src/components/StudioGalleryUpload.tsx` (new, client):
  title + optional description inputs, file input accepting
  `image/jpeg,image/png,image/webp`, client-side 750 KB pre-check for fast
  feedback (server remains the authority), `FileReader` -> data URL -> `POST`,
  success appends the row to a list rendered from `GET /api/studio/gallery`,
  failures surface the server `error` string
- `apps/ai-institute/src/app/studio/page.tsx` (edit): add one tile linking to
  `/studio/gallery` so the screen is reachable (additive, no layout changes)

Verification: typecheck + eslint.

### Task 11: public gallery page

File: `apps/ai-institute/src/app/gallery/page.tsx` (new)

- `force-dynamic`; server component reads `listGalleryPhotos()`.
- Composition: editorial header (Playfair display heading, generous whitespace,
  left-aligned with a wide right margin — no centered hero), then an
  asymmetric 12-column grid where tiles alternate span-7 / span-5 and the
  second row offsets by one column, then a quiet footer note.
- Honest labeling: a single line under the heading — "Photos uploaded through
  the Bhavya Studio gallery." Each tile shows its title and description only.
  No photographer, no source, no "featured work", no location/date invention.
- Tiles: `<img loading="lazy" decoding="async" src={/api/gallery/${id}}
width height>` with the native aspect preserved from stored `byteSize`-free
  metadata (title/description shown below the image, not overlaid).
- Empty state: reuse the same copy shape as the credentials empty state (no
  invented counts).
- Authored motion: tiles fade/rise on first intersection with staggered
  `animation-delay`, disabled under `prefers-reduced-motion: reduce`.
- Styles appended to `globals.css` in the same commented section as Task 4.

Verification: typecheck + `pnpm tokens:check` + `pnpm antislop`.

### Task 12: gallery tests

File: `apps/ai-institute/src/lib/__tests__/gallery-validation.test.ts` (new)

- accepts a 1x1 PNG and a small JPEG fixture built inline from base64 constants
- rejects: non-data-URL string, wrong prefix, non-base64 characters, oversize
  payload, `image/gif`, text file renamed with a data-URL prefix (magic byte
  mismatch)
- title/description normalization edge cases
- store round trip: insert + list + get + unknown id -> null (exercises
  migration 007 through `initDatabase()`)

Verification: `pnpm --filter @bhavya/ai-institute exec vitest run`.

## PART 3 — Integration and verification

### Task 13: make `pnpm tokens:check` honest — DROPPED

Session A directive: the red `pnpm tokens:check` ("8 apps NEEDS SYNC") is a
known pre-existing checker bug — `/^\/\*[\s\S]*?\*\/\n\n/` never matches CRLF
headers — and the fix already landed on `master` via **PR #11**. This branch
must NOT touch `scripts/sync-tokens.mjs`, `tokens.css`, `_tokens-generated.css`
or run `pnpm tokens:sync`. Report `tokens:check` as `pre-existing-fail (checker
bug, fixed on master in PR #11)` in the gate report and skip it during this
session's gate run.

### Task 14: architecture docs

- `docs/architecture/CANONICAL_ROUTE_MAP.md`: add `/gallery`, `/verify/[id]`,
  `/certificates/[id]` under public/knowledge rows, and `/studio/gallery`,
  `/api/gallery*`, `/api/certificates` under the Studio/API rows, with the
  authorization column filled in (Public / Student / Instructor-Educator-Admin).
- `docs/architecture/DOMAIN_OWNERSHIP.md`: add the route mapping rows only.
- `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md`: note the two new tables as
  canonical for credentials and studio gallery photos under the ai-institute
  Knowledge/Learning entry.
- `apps/ai-institute/CONTEXT.md`: one line pointing at the two new route groups
  if such a route section exists; otherwise skip (do not invent hubs).

Verification: read back the edited tables for row/column alignment; no
generator exists for these files, hand editing is correct.

### Task 15: full gate run

In order, capturing output evidence for the PR:

1. `npx tsc --noEmit -p apps/ai-institute/tsconfig.json`
2. `npx eslint <every changed/added path>`
3. `pnpm --filter @bhavya/ai-institute exec vitest run`
4. `pnpm tokens:check` — **SKIPPED**: pre-existing failure (checker CRLF bug,
   fixed on master in PR #11); do not run `tokens:sync` per Session A
5. `pnpm antislop`
6. `pnpm file-map` then `pnpm file-map:check` (run the generator; it is declared
   in root package.json — if it reports pre-existing drift unrelated to this
   work, record that instead of chasing it)
7. `git diff --check`
8. `git status` (confirm no `opencode.json`, no `bhavya.db` staged)

Also grep-gate the copy: no `accredit`, `license`, `certified by`, no numbers
outside `claims.ts` in the new pages.

### Task 16: commits — push/PR/status handled by Session A

Run-2 brief (this session): git push is auth-blocked from this machine, so
this session **commits only** — no push, no PR, no edit to `.ai/current-task.md`
(Session A owns integration and that file).

- Commits: `feat(certificate): issue verifiable course credentials`,
  `feat(certificate): add claim and verification surfaces`,
  `feat(gallery): add role-gated studio photo uploads`,
  `feat(gallery): publish studio gallery page`,
  `docs: register plan C routes and tables`.
  (`fix(tokens): accept CRLF when stripping generated headers` is DROPPED —
  that fix lives on master via PR #11.)
- Session A pushes `build/plan-c-cert-gallery` and opens the PR against
  `master` with the Summary / Verification structure used by PR #9, including:
  local gate evidence, the `tokens:check` pre-existing-fail history, the
  completion-loop decision (mark lesson complete button), the storage decision
  with its rejected alternative, and the two deviations recorded below
  (`/certificates` substitute, server-side QR). Do not merge. GitHub Actions
  produce no runs on this repo, so local gates are the evidence.
- Session A appends `## Session C status` to `.ai/current-task.md` from this
  session's report (section supplied in the final message).

## Open questions (recorded, not blocking)

1. Sitemap: `src/app/sitemap.ts` is edited by Plan B's public-route task.
   `/gallery` should be in it; deferring avoids a same-file conflict. If Session
   A does not add it, Session C adds one entry in a follow-up commit.
2. `pnpm file-map` may reveal broader registry drift owned by Session A; this
   plan only guarantees its own files are mapped.
3. The "Mark lesson complete" button is new UI on a page no session owns. If
   Session A prefers a different completion trigger, the certificate logic is
   unaffected (it only reads `lessonsCompleted`).
4. Nav/menu entry for `/gallery` is not added (shared header is Session A/B
   territory); the gallery stays reachable by URL and from the course/certificate
   surfaces. Promote if requested.
5. **Blocker recorded:** the read/edit tool deny rule `**/credentials*` makes
   `src/app/app/credentials/**` unopenable, so Task 5 ships the list at a new
   `/certificates` route instead. If Session A wants the list inside
   `/app/credentials`, that edit must happen in a session whose tool rules
   allow the path.
6. `pnpm tokens:check` is reported `pre-existing-fail` (CRLF header-strip bug;
   fixed on master in PR #11). Not run this session; token files untouched.
7. Run-2 scope: no push, no PR, no `.ai/current-task.md` edit from this
   session — integration is Session A's.
8. `CANONICAL_ROUTE_MAP.md` has no Studio or API sections (it tracks IA/public,
   knowledge, my-bhavya and OS routes; `/studio/*` and `/api/*` are untracked
   entirely), so `/studio/gallery` and the API routes were NOT added there —
   inventing sections would imply existing studio routes are tracked when they
   are not. Route + authorization for them live in
   `DOMAIN_OWNERSHIP.md` (Package → Route Mapping) instead. `CONTEXT.md` has no
   route section, so it was left alone per plan.
