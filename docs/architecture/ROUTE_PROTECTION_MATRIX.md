# Route Protection Matrix

**Status:** active
**Last updated:** 2026-09-05
**Enforcement layers:** middleware (session presence + CSRF + robots) →
page gates (`lib/require-role.ts`) → API checks (`requireAuth` +
`roleIsAllowed`/`hasPermission` from `lib/roles.ts`).

Client-side role checks are UX only. Every row below names its
server-side enforcement.

## Public (no session)

| Route                                                                                          | Enforcement                                           |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `/`, `/about`, `/mission`, `/programs`, `/resources`                                           | none (public knowledge)                               |
| `/forest`, `/knowledge`, `/heritage`, `/community`, `/missions/*`                              | none                                                  |
| `/knowledge/*` (academy, courses, library, research, ai, mentor, projects, credentials, graph) | none — descriptions and open content                  |
| `/courses`, `/courses/[id]`, `/courses/[id]/lessons/[lessonId]`                                | none — open lesson content; progress requires session |
| `/research`, `/library`, `/transparency/*`, `/resources`                                       | none                                                  |
| `/donate`, `/impact`, `/volunteer`, `/get-involved`                                            | none                                                  |
| `/login`, `/register`, `/forbidden`                                                            | none (robots noindex via middleware)                  |
| `/privacy`, `/terms`, `/accessibility`                                                         | none                                                  |

## Authenticated (any role; middleware session gate + page/API checks)

| Route                                                                                              | Enforcement                                                                     |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `/app`, `/app/*`, `/dashboard`, `/profile`                                                         | middleware session → `/login`; personal data scoped to session user server-side |
| `/onboarding`                                                                                      | middleware session → `/login` (anonymous cannot start onboarding)               |
| `/os`, `/os/knowledge`, `/os/search`, `/os/docs`, `/os/governance`, `/os/memory` (read surfaces)   | middleware session; data reads scoped, no mutations                             |
| `/api/*` reads (academy, knowledge, forest, heritage, library, mentors, student GET, transparency) | `requireAuth` → 401                                                             |
| `/api/*` mutations                                                                                 | `requireAuth` + CSRF origin check → 401/403                                     |

## Role workspaces (page gate `requireRoles` + middleware session)

| Route                                                                                                                     | Allowed roles                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `/os/student`                                                                                                             | student, builder, researcher, admin                                                                    |
| `/os/volunteer`                                                                                                           | volunteer, admin                                                                                       |
| `/os/donor`                                                                                                               | donor, admin                                                                                           |
| `/os/trustee`                                                                                                             | trustee, admin                                                                                         |
| `/os/admin`, `/os/admin/*`                                                                                                | admin                                                                                                  |
| `/os/runtime`, `/os/observability`, `/os/memory`, `/os/api-explorer`, `/os/github`, `/os/ioc`, `/os/social`, `/os/videos` | educator, researcher, builder, mentor, instructor, admin (`OS_TOOL_ROLES`)                             |
| `/studio`, `/studio/*`                                                                                                    | middleware session; mutations via `/api/studio/*` (session-required, content roles enforced per route) |
| `/os/admin/api/*`                                                                                                         | `requireAuth` + admin-only → 401/403 JSON                                                              |

Anonymous → `/login?redirect=…`. Authenticated but unauthorized → `/forbidden`.

## Role assignment (no self-promotion)

- Registration accepts name/email/password only — no role parameter.
- Self-service (`PUT /api/student`) whitelists `ONBOARDING_ROLES`
  (student, builder, researcher); trustee/admin/instructor/volunteer/donor
  requests are ignored and logged.
- Privileged roles are assigned through approved paths only (currently:
  direct institutional assignment; no self-service endpoint exists).

## Known gaps (not silently accepted)

- No audit-event store yet: admin activity/audit surfaces report
  "not connected" instead of inventing events (see Remaining Work).
- Email verification / password reset need mail infrastructure, which
  does not exist: registration works without them; password change is
  available to authenticated users.
- Volunteer applications and donations have no operational tables:
  workspaces show honest empty states; online payment is explicitly
  marked not-connected (no fabricated transactions).
