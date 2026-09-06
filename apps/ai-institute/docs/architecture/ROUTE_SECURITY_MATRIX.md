# ROUTE SECURITY MATRIX

**Date:** 2026-09-06
**Status:** ACTIVE
**Owner:** Bhavya Foundation Architecture
**Sources:**

- `src/middleware.ts` — session enforcement, CSRF, public route exemptions
- `src/lib/route-policy.ts` — role-based access policies
- `docs/architecture/CANONICAL_ROUTE_MAP.md` — canonical route definitions

---

## Summary

| Layer             | Count  | Auth Mechanism                       |
| ----------------- | ------ | ------------------------------------ |
| Public            | 30     | None                                 |
| Authenticated     | 9      | Session cookie (`session-token`)     |
| Role-Gated (OS)   | 12     | Session cookie + role check          |
| Role-Gated (Tool) | 8      | Session cookie + OS_TOOL_ROLES check |
| **Total**         | **59** |                                      |

### Key Decisions

- Middleware protects `/app/*`, `/os/*`, `/studio/*`, `/dashboard/*`, `/onboarding`, `/api/studio` via `isProtectedRoute`.
- `/os`, `/os/knowledge`, `/os/search` are exempted from auth redirect by `isPublicOsRoute` — but page-level `requirePolicy()` still enforces roles where defined.
- `route-policy.ts` is the single source of truth for role requirements; anything not listed is governed only by middleware session rules.
- `/os/search` appears in `isPublicOsRoute` but has no canonical route or policy entry — excluded from this matrix.

---

## Public Layer

No middleware protection. No session required. No route policy.

| Route                      | Layer  | Middleware Protection | Route Policy | Required Roles | Auth Type |
| -------------------------- | ------ | --------------------- | ------------ | -------------- | --------- |
| `/`                        | Public | No                    | —            | —              | None      |
| `/about`                   | Public | No                    | —            | —              | None      |
| `/mission`                 | Public | No                    | —            | —              | None      |
| `/programs`                | Public | No                    | —            | —              | None      |
| `/transparency`            | Public | No                    | —            | —              | None      |
| `/transparency/financials` | Public | No                    | —            | —              | None      |
| `/transparency/governance` | Public | No                    | —            | —              | None      |
| `/transparency/projects`   | Public | No                    | —            | —              | None      |
| `/transparency/policies`   | Public | No                    | —            | —              | None      |
| `/transparency/releases`   | Public | No                    | —            | —              | None      |
| `/resources`               | Public | No                    | —            | —              | None      |
| `/donate`                  | Public | No                    | —            | —              | None      |
| `/volunteer`               | Public | No                    | —            | —              | None      |
| `/get-involved`            | Public | No                    | —            | —              | None      |
| `/contact`                 | Public | No                    | —            | —              | None      |
| `/forbidden`               | Public | No                    | —            | —              | None      |
| `/privacy`                 | Public | No                    | —            | —              | None      |
| `/accessibility`           | Public | No                    | —            | —              | None      |
| `/forest`                  | Public | No                    | —            | —              | None      |
| `/knowledge`               | Public | No                    | —            | —              | None      |
| `/heritage`                | Public | No                    | —            | —              | None      |
| `/community`               | Public | No                    | —            | —              | None      |
| `/knowledge/academy`       | Public | No                    | —            | —              | None      |
| `/knowledge/courses`       | Public | No                    | —            | —              | None      |
| `/knowledge/courses/[id]`  | Public | No                    | —            | —              | None      |
| `/knowledge/library`       | Public | No                    | —            | —              | None      |
| `/knowledge/research`      | Public | No                    | —            | —              | None      |
| `/knowledge/ai`            | Public | No                    | —            | —              | None      |
| `/knowledge/mentor`        | Public | No                    | —            | —              | None      |
| `/knowledge/projects`      | Public | No                    | —            | —              | None      |
| `/knowledge/credentials`   | Public | No                    | —            | —              | None      |
| `/knowledge/graph`         | Public | No                    | —            | —              | None      |

---

## Authenticated Layer

Middleware requires session cookie (`session-token`). No role policy — any authenticated user may access.

| Route                | Layer         | Middleware Protection  | Route Policy | Required Roles | Auth Type |
| -------------------- | ------------- | ---------------------- | ------------ | -------------- | --------- |
| `/app`               | Authenticated | Yes (session redirect) | —            | —              | Session   |
| `/app/learn`         | Authenticated | Yes (session redirect) | —            | —              | Session   |
| `/app/community`     | Authenticated | Yes (session redirect) | —            | —              | Session   |
| `/app/knowledge`     | Authenticated | Yes (session redirect) | —            | —              | Session   |
| `/app/missions`      | Authenticated | Yes (session redirect) | —            | —              | Session   |
| `/app/projects`      | Authenticated | Yes (session redirect) | —            | —              | Session   |
| `/app/credentials`   | Authenticated | Yes (session redirect) | —            | —              | Session   |
| `/app/contributions` | Authenticated | Yes (session redirect) | —            | —              | Session   |
| `/app/profile`       | Authenticated | Yes (session redirect) | —            | —              | Session   |

---

## Role-Gated Layer — Institutional (OS)

Middleware requires session cookie. `route-policy.ts` enforces specific roles. Middleware exempts `/os` from auth redirect, but `requirePolicy()` redirects unauthorized users to `/forbidden`.

| Route                | Layer      | Middleware Protection                  | Route Policy                                      | Required Roles                      | Auth Type  |
| -------------------- | ---------- | -------------------------------------- | ------------------------------------------------- | ----------------------------------- | ---------- |
| `/os`                | Role-Gated | Yes (public os exempt, policy checked) | Yes (`admin`, `trustee`, `staff`)                 | admin, trustee, staff               | Role-Based |
| `/os/admin`          | Role-Gated | Yes (session redirect)                 | Yes (`admin`)                                     | admin                               | Role-Based |
| `/os/admin/users`    | Role-Gated | Yes (session redirect)                 | Yes (`admin`)                                     | admin                               | Role-Based |
| `/os/admin/audit`    | Role-Gated | Yes (session redirect)                 | Yes (`admin`)                                     | admin                               | Role-Based |
| `/os/admin/content`  | Role-Gated | Yes (session redirect)                 | Yes (`admin`)                                     | admin                               | Role-Based |
| `/os/admin/releases` | Role-Gated | Yes (session redirect)                 | Yes (`admin`)                                     | admin                               | Role-Based |
| `/os/governance`     | Role-Gated | Yes (session redirect)                 | Yes (`admin`, `trustee`, `staff`)                 | admin, trustee, staff               | Role-Based |
| `/os/knowledge`      | Role-Gated | Yes (public os exempt, policy checked) | Yes (`admin`, `trustee`, `staff`, `educator`)     | admin, trustee, staff, educator     | Role-Based |
| `/os/docs`           | Role-Gated | Yes (session redirect)                 | Yes (`admin`, `trustee`, `staff`)                 | admin, trustee, staff               | Role-Based |
| `/os/forest`         | Role-Gated | Yes (session redirect)                 | Yes (`admin`, `trustee`, `staff`)                 | admin, trustee, staff               | Role-Based |
| `/os/trustee`        | Role-Gated | Yes (session redirect)                 | Yes (`trustee`, `admin`)                          | trustee, admin                      | Role-Based |
| `/os/student`        | Role-Gated | Yes (session redirect)                 | Yes (`student`, `builder`, `researcher`, `admin`) | student, builder, researcher, admin | Role-Based |
| `/os/volunteer`      | Role-Gated | Yes (session redirect)                 | Yes (`volunteer`, `admin`)                        | volunteer, admin                    | Role-Based |
| `/os/donor`          | Role-Gated | Yes (session redirect)                 | Yes (`donor`, `admin`)                            | donor, admin                        | Role-Based |

---

## Role-Gated Layer — Tools & Studio

Middleware requires session cookie. `route-policy.ts` enforces `OS_TOOL_ROLES` (all privileged roles).

| Route               | Layer      | Middleware Protection  | Route Policy                            | Required Roles                                                                              | Auth Type  |
| ------------------- | ---------- | ---------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------- | ---------- |
| `/studio`           | Role-Gated | Yes (session redirect) | Yes (`admin`, `educator`, `instructor`) | admin, educator, instructor                                                                 | Role-Based |
| `/os/runtime`       | Role-Gated | Yes (session redirect) | Yes (`OS_TOOL_ROLES`)                   | admin, trustee, staff, educator, instructor, student, builder, researcher, volunteer, donor | Role-Based |
| `/os/observability` | Role-Gated | Yes (session redirect) | Yes (`OS_TOOL_ROLES`)                   | admin, trustee, staff, educator, instructor, student, builder, researcher, volunteer, donor | Role-Based |
| `/os/memory`        | Role-Gated | Yes (session redirect) | Yes (`OS_TOOL_ROLES`)                   | admin, trustee, staff, educator, instructor, student, builder, researcher, volunteer, donor | Role-Based |
| `/os/api-explorer`  | Role-Gated | Yes (session redirect) | Yes (`OS_TOOL_ROLES`)                   | admin, trustee, staff, educator, instructor, student, builder, researcher, volunteer, donor | Role-Based |
| `/os/github`        | Role-Gated | Yes (session redirect) | Yes (`OS_TOOL_ROLES`)                   | admin, trustee, staff, educator, instructor, student, builder, researcher, volunteer, donor | Role-Based |
| `/os/ioc`           | Role-Gated | Yes (session redirect) | Yes (`OS_TOOL_ROLES`)                   | admin, trustee, staff, educator, instructor, student, builder, researcher, volunteer, donor | Role-Based |
| `/os/social`        | Role-Gated | Yes (session redirect) | Yes (`OS_TOOL_ROLES`)                   | admin, trustee, staff, educator, instructor, student, builder, researcher, volunteer, donor | Role-Based |
| `/os/videos`        | Role-Gated | Yes (session redirect) | Yes (`OS_TOOL_ROLES`)                   | admin, trustee, staff, educator, instructor, student, builder, researcher, volunteer, donor | Role-Based |

---

## Special Routes

| Route                                        | Layer         | Middleware Protection  | Route Policy | Required Roles | Auth Type |
| -------------------------------------------- | ------------- | ---------------------- | ------------ | -------------- | --------- |
| `/knowledge/courses/[id]/lessons/[lessonId]` | Authenticated | Yes (session redirect) | —            | —              | Session   |
| `/login`                                     | Public        | No                     | —            | —              | None      |
| `/register`                                  | Public        | No                     | —            | —              | None      |
| `/onboarding`                                | Authenticated | Yes (session redirect) | —            | —              | Session   |
| `/api/studio/*`                              | Role-Gated    | Yes (session 401 JSON) | —            | —              | Session   |
| `/api/studio/fallback`                       | Blocked       | Yes (403 hardcoded)    | —            | —              | Blocked   |

---

## Enforcement Layers (Defense in Depth)

```
Request
  │
  ├─ 1. CSRF Check (middleware) ──── /api/* mutating methods → origin/referer validation
  │
  ├─ 2. Session Gate (middleware) ── isProtectedRoute + !isPublicOsRoute → session-cookie required
  │     └─ Missing cookie → redirect to /login?redirect=<path>  (pages)
  │     └─ Missing cookie → JSON 401                              (API)
  │
  ├─ 3. Route Policy (page-level) ─ requirePolicy(pathname) → canAccess(pathname, roles)
  │     └─ No matching role → redirect to /forbidden
  │
  └─ 4. Security Headers (middleware) ── X-Frame-Options, CSP, HSTS, etc.
```

### Notes

- **Middleware** (`middleware.ts`) is the first line of defense — it runs on the Edge before any page component loads.
- **Route Policy** (`route-policy.ts`) is the second line — enforced server-side by `requirePolicy()` in page components.
- **`isPublicOsRoute`** exempts `/os`, `/os/knowledge`, `/os/search` from the login redirect, but does NOT bypass role checks in `route-policy.ts`. Unauthorized users hit `/forbidden` at the page level.
- **`OS_TOOL_ROLES`** includes all privileged roles: `admin`, `trustee`, `staff`, `educator`, `instructor`, `student`, `builder`, `researcher`, `volunteer`, `donor`. Tool routes are accessible to any authenticated user with a role.
- **`/api/studio/*`** requires session cookie at the middleware level (JSON 401). The open proxy fallback at `/api/studio/fallback` is hardcoded 403.
- **Public routes** have no entry in `route-policy.ts` — they are governed solely by middleware (which does not enforce sessions on them).
