# BFAOS V2 — T-104 Authentication Architecture Truth

**Status:** read-only documentation · **Date:** 2026-11-13 · **Base:** `master` @ `98388ddb`
**Scope note:** no auth provider, code path, cookie, environment variable, database schema or session
was changed, and no learner record was read. Supabase is **not** declared obsolete here — D-03
remains founder-owned.

## 1. Two authentication stacks coexist in the application

| Stack | Module | Mechanism | Wired into |
|---|---|---|---|
| **A — learner sessions (primary in practice)** | `apps/ai-institute/src/lib/api-auth.ts` | Password hash verification against Turso, session row, `session-token` cookie | `/api/auth/{login,register,me,logout,password}`, `components/AuthProvider.tsx`, and every route that calls `requireAuth` from `@/lib/api-auth` |
| **B — Supabase (declared in platform truth)** | `apps/ai-institute/src/lib/auth.ts` + `src/lib/supabase/*` | `supabase.auth.getUser()` + `profiles` table lookup | `apps/ai-institute/src/app/api/certificates/route.ts`, `apps/ai-institute/src/app/api/student/progress/route.ts`, `src/app/auth/callback/route.ts` (OAuth code exchange), `src/lib/storage` |

**Third artefact — the development stub:** `src/lib/auth/index.ts` + `src/lib/auth/supabase-strategy.ts`,
wired into `src/lib/providers/AppProviders.tsx` (mounted by `src/app/layout.tsx:50`). It contains a
fixed test credential pair and a `test-token` branch that returns a fabricated session. Its own comment
states it is a development stub and not the live path. Phase 1-B/1-C analysis established that it
cannot produce a server-side session; it only affects client-side state inside the `AppProviders`
context, whose only accessor (`useAuthContext`) has no consumer.

## 2. Stack A — the live learner session flow (source-verified)

```
POST /api/auth/login
  ├─ checkRateLimit("login:<ip>", RateLimits.login)        → 429 + Retry-After
  ├─ body validation (email, password)                      → 400
  ├─ findUserByEmail(email)          [Turso users]         → 401 + audit(failure)
  ├─ verifyPassword(pw, user.passwordHash)                  → 401 + audit(failure)
  ├─ createSession(user)                [Turso session row]  → token + expiresAt
  ├─ recordAuditEvent(... result: "success")                [audit-repository]
  └─ Set-Cookie: session-token=<token>; HttpOnly; Secure(prod); SameSite=Strict; Path=/; Max-Age=7d
```

Session validation on every protected read: `requireAuth(request)` → read `session-token` cookie →
`findSessionByToken` → **expiry check** → `findUserById` → user or `null`.

Role gating is server-side and independent of the client: `roleIsAllowed(user.role, [...])` from
`src/lib/roles.ts`, used by the B2 routes (`admin`,`staff`; `upload`/`signed-url` also
`instructor`,`educator`), the forest mission routes (`CONTENT_MANAGEMENT_ROLES`) and the Mission
Control operator gate (`admin`,`staff`).

## 3. Observed public behaviour (no credentials used)

| Observation | Result | Method |
|---|---|---|
| `/login`, `/register` render | 200 | HTTPS GET |
| `/api/auth/me` unauthenticated | **401** | HTTPS GET |
| `/api/student` unauthenticated | **401** | HTTPS GET |
| `/os/mission`, `/os/mission/jobs`, `/os/mission/approvals` | **307** (auth redirect) | HTTPS GET |
| `/os/mission/api/jobs`, `/os/mission/api/approvals` unauthenticated | **401** | HTTPS GET |
| `/api/health` | 200 `{"status":"healthy","environment":"production"}` | HTTPS GET |

## 4. Flow classification

| Flow | Status | Evidence / limitation |
|---|---|---|
| Password sign-in (stack A) | **PROVEN OPERATIONAL (code + tests + live guards)** | Route, repository, hashing, rate limit, cookie flags, expiry and role gates all present; `apps/ai-institute/src/lib/__tests__/auth.test.ts` covers the repository layer. **A live end-to-end login with a real learner account was NOT performed** (no credential was used, no learner record was read) → live credentialed behaviour is `UNVERIFIED`. |
| Session validation / expiry | **PROVEN OPERATIONAL** | `requireAuth` + 401 responses observed live |
| Role authorisation | **PROVEN OPERATIONAL** | server-side `roleIsAllowed` in B2, forest and Mission Control routes |
| Registration, password change, logout | **PROVEN OPERATIONAL (code)** | routes exist and share the stack-A repository; live behaviour not exercised |
| Client session state (`components/AuthProvider.tsx`) | **PROVEN OPERATIONAL (code)** | `/api/auth/me` → `isAuthenticated`; used by dashboard, assessment, impact, login, onboarding pages |
| OAuth callback (`src/app/auth/callback/route.ts`) | **SECONDARY / DEPENDENT ON SUPABASE** | Supabase code exchange; the configured Supabase project's **auth** surface is on a paused project → **UNAVAILABLE** while the project stays inactive |
| Supabase `getUser()` + `profiles` (stack B) | **SECONDARY and currently UNAVAILABLE** | used by `/api/certificates` and `/api/student/progress`; the configured project `utekxrusinibsosthgec` reports `INACTIVE`, so these two routes' authentication path cannot succeed until the project is restored |
| Supabase **storage** helper (`src/lib/storage.ts`) | **SECONDARY** | B2 is the canonical asset store; this path is not on the live production path (production HTML has 0 B2 references) |
| Development stub credentials / `test-token` | **MUST NEVER AUTHENTICATE — no server grant** | client-side only; see §1. Its presence is a latent defect (any future consumer of `useAuthContext` would inherit a spoofable identity) — see Phase 1-A/1-B evidence |
| Migration of learners between stacks | **NOT ATTEMPTED / `UNKNOWN`** | out of scope; D-03 owns it |

## 5. Public route behaviour vs authenticated learner behaviour

| Surface | Public | Authenticated |
|---|---|---|
| Curriculum, knowledge, governance, learning paths, courses | fully rendered, indexable | same, plus learner-personalised blocks |
| `/dashboard`, `/assessment`, `/impact/*`, `/onboarding`, `/workspace`, `/profile` | shell renders (200) but content is session-gated | personalised content from `/api/student` and `/api/student/progress` |
| `/studio/*`, `/os/mission/*` | 307 redirect to `/login` | operator/staff content |
| `/api/auth/*` | 401 for protected verbs | session-scoped |
| `/api/certificates`, `/api/student/progress` | 401 | **depend on Supabase for identity** → at risk while the project is paused |

## 6. Architecture truth to record (D-03 input, not a decision)

1. The **running** identity system is Turso-backed sessions (`api-auth`), not Supabase.
2. The **declared** identity system in `docs/architecture/PLATFORM-TRUTH.md` is Supabase.
3. Two protected API routes (`/api/certificates`, `/api/student/progress`) use the **Supabase** path, so
   their authentication depends on a paused project even though the main sign-in flow does not.
4. `PLATFORM-TRUTH.md` therefore does not describe the running system accurately; a correction is
   needed, and whether the correction is "restore Supabase" or "document Turso sessions as primary"
   is **founder-owned (D-03)**.

## 7. Unknowns that need access this phase does not have

| Unknown | Why it is unknown | How to resolve (founder action) |
|---|---|---|
| Whether learner records exist in the production Turso database | no read-only production database access (T-102) | read-only credential |
| Whether any live learner session exists today | same | read-only credential; or an operator-only count query |
| Whether `/api/certificates` and `/api/student/progress` are currently failing for real learners | the route requires a Supabase-backed session; no learner credential was used | founder-authenticated smoke test |
| Whether the paused Supabase project can be restored and what it contains | provider-side, and both projects are paused | founder dashboard restore, then read-only inspection |
| Whether the OAuth path was ever used by learners | no telemetry | Supabase dashboard (after restore) |

## 8. Actions explicitly NOT taken

No authentication code was changed. No provider was restored, migrated or configured. No cookie,
environment variable, secret or database schema was touched. No learner record or session was read. No
Supabase project was modified, and no claim is made here that Supabase is obsolete. No login was
attempted with any credential.
