# Mission Control Phase 7 Checkpoint (2026-09-18)

## Delivered

- Studio intake: `createArtifactFromStudioLesson` (dbGetLesson read, facts note, `studio:lesson:{id}` path) + API op + intake form + canonical Studio links. Lesson editing stays in Studio (linked); MC tracks review versions.
- Academy intake: `createArtifactFromAcademyLesson` (static data, course context note, `academy:{id}` path) + API op + Academy reader links.
- Both idempotent per (job, path) via evidence keys; missing lessons 404; tests green.
- Graph interaction: kind filters, edge-click detail (rel + endpoints + FACT label), node selection + open-record, URL state (?node=, ?hide=), Suspense boundary, accessible list retained.
- Decisions center: action/actor filters, immutable history copy, RBAC + matrix tests.
- Evidence: day grouping. Destinations: display only (no publication path exists — stated).
- Capability vocabulary: no ADOPT-family terms in governance/ → existing approve/reject vocabulary kept (T29).
- External exec audit: clean (1 hit = detection regex, not execution).
- Notifications: manager exists, channels unconfigured → queue counts remain the attention model (no email infra built).

## Commits (local, unpushed)

- 1d8ab3c lesson intake + tests. 7e84ed5 graph/decisions/evidence/RBAC.
- Ahead of origin by 15. Master untouched. opencode.json untouched.

## Verification

- Full app suite 199/199 PASS via throwaway harness (deleted after use).
- tsc zero new errors (fixed: bad academyCourses import, 2 bad casts, implicit any, 2 structural breaks caught immediately).
- SQL 005 proven; antislop/drift/diff-check/secret-path clean.
- Tracked seed DB was touched by a test run at one point — reverted immediately and verified clean twice after. Cause: unknown (isolation setup covers known paths); flagged for CI to confirm.
- CI test cause still unestablished (no log access). Local green ≠ CI green.
