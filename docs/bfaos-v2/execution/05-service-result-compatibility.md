# BFAOS V2 — Service Execution-Result Contract Reconciliation (Phase 4.1 · D)

**Date:** 2026-11-13 · **Branch:** `feat/bfaos-phase4-contracts` · **Method:** source inspection + type-level reconciliation.
Nothing in this task changes runtime behaviour: no return value, no control flow, no schema, no
persistence. The only changes are type-level, except the one new specification file.

---

## 1. The rule this section applies

The kernel ships seventeen service-like classes across two families:

- **Institution services** (audit, finance, governance V2, impact, mission-assignment, mission,
  people, projects, recognition, resource) — in-memory, `execute(input)`, eleven files.
- **Institution/artifact services** (transparency, volunteer, research, governance V1,
  knowledge-platform) — file-backed under a caller-supplied `root`, five files.
- **PublicAPI** — a separate request/response surface; audited separately; consistent.
- **`index.ts`** — the `InstitutionService` interface: `execute(input: unknown): Promise<unknown>`
  plus `initialize()`, `shutdown()`, `name`, `description`, `capabilities`.

Every `execute()` previously declared `Promise<{success: boolean; result?: unknown}>`, but every
implementation returned its payload under a **named** key. The declared type was therefore a lie:

- nothing at runtime was wrong (the named fields are what callers see);
- nothing failed to compile (the private handlers were typed, and their returns were assignable
  to the widened-enough-but-uninformative declared type);
- every consumer written against the declared type would read `result`, and get `undefined`.

The `InstitutionService` interface's `Promise<unknown>` declares nothing, so widening the concrete
implementations breaks no interface contract.

## 2. Compatibility matrix (before → after)

Every row was verified against the file at the commit before this change.

| Service | InstitutionService? | Declared before | Actually returns (named keys) | Consumers in repo | Status |
|---|---|---|---|---|---|
| `people-registry.ts` | no (not exported) | `{success, result?}` | `person?`, `people` | none | **reconciled** |
| `mission-assignment.ts` | no (not exported) | `{success, result?}` | `assignment?`, `assignments`, `matches` | none | **reconciled** |
| `recognition-service.ts` | no (not exported) | `{success, result?}` | `recognition?`, `recognitions`, `stats` | none | **reconciled** |
| `mission-service.ts` | yes | `{success, result?}` | `mission?`, `missions` | none | **reconciled** |
| `resource-registry.ts` | yes | `{success, result?}` | `resource?`, `resources` | none | **reconciled** |
| `impact-registry.ts` | yes | `{success, result?}` | `comparison`, `report?`, `reports`, `summary` | none | **reconciled** |
| `finance-service.ts` | yes | `{success, result?}` | `budget?`, `donation?`, `donations`, `grant?`, `grants`, `report?` | none | **reconciled** |
| `projects-service.ts` | yes | `{success, result?}` | `project?`, `projects` | none | **reconciled** |
| `governance-service.ts` | yes (as `GovernanceServiceV2`) | `{success, result?}` | `document?`, `documents`, `minutes?`, `resolution?` | none | **reconciled** |
| `audit-service.ts` | yes | `{success, result?}` | `compliant`+`violations`, `entry?`, `entries`, `snapshot?`, `snapshots` | none | **reconciled** |
| `knowledge-platform.ts` | yes | `{artifacts, success, result?}` | `document?`, `results`, `related`, `summary`+`keyPoints` | none (exercised by migrated `knowledge-platform.spec.ts`) | **reconciled** |
| `research.ts` | yes (`ResearchService`) | `{artifacts, success, results?}` | `summary` (summarize action), `results` (search) | none (exercised by new `research-service.spec.ts`) | **reconciled** |
| `transparency.ts` | yes | `{artifacts, success}` | `{artifacts, success}` | none | consistent, unchanged |
| `volunteer.ts` | yes | `{artifacts, success, volunteer?}` | `volunteer?` (with `Volunteer \| undefined` assignable) | none | consistent, unchanged |
| `governance.ts` | yes | `{artifacts, success, documents?}` | `documents` (list action), absent otherwise | none | consistent, unchanged |
| `public-api.ts` | yes | `Promise<APIResponse>` | `APIResponse` (success/error/timestamp) | none | consistent, unchanged |

"Consumers in repo" was verified with `git grep` for every service class name across `apps/`,
`packages/`, `content/`, `docs/` excluding the kernel's own services and `__tests__`: no application,
package or script consumer exists. The kernel barrel (`src/index.ts`) re-exports only the
`InstitutionService`-family four (TransparencyService, VolunteerService, ResearchService,
GovernanceService); `PeopleRegistry`, `MissionAssignmentService` and `RecognitionService` are
reachable nowhere outside `src/services/`.

Note the honesty rule applied to the matrix: the `mission-assignment.ts` row in the previous draft
listed `matches`; this draft keeps it because the implementation returns it
(`find-matches` action).

## 3. What changed, exactly

For each of the twelve reconciled services, the public `execute()` return annotation now names a
precise union type (exported from the service module, not from the package barrel):

- ten institution services → `audit-service.ts:AuditExecuteResult`, `finance-service.ts:FinanceExecuteResult`,
  `governance-service.ts:GovernanceExecuteResult`, `impact-registry.ts:ImpactExecuteResult`,
  `mission-assignment.ts:AssignmentExecuteResult`, `mission-service.ts:MissionExecuteResult`,
  `projects-service.ts:ProjectExecuteResult`, `recognition-service.ts:RecognitionExecuteResult`,
  `resource-registry.ts:ResourceExecuteResult`, and `people-registry.ts:PeopleExecuteResult`
- two artifact services → `knowledge-platform.ts:KnowledgeExecuteResult`, `research.ts:ResearchExecuteResult`

TypeScript compiles the union against the private handler returns, so assignability is proven at
`pnpm typecheck` — not asserted by hand. The exported type is a superset of the handlers' exact
shapes (each handler's own declared return type is assignable), so this cannot regress.

**The `InstitutionService` interface was deliberately not changed** (`execute(input: unknown): Promise<unknown>`).
Forcing the seventeen classes into that interface with precise generics is a different, larger
design task and outside this reconciliation.

The `MissionService.create` note from Phase 4 ("declared type lied") is therefore closed: the
declared type now tells the truth, and `people-registry.ts`/`research.ts` are the two documented
precedents with file-level comments saying so.

## 4. What deliberately did not change

- No runtime value is altered: no handler body, no control flow, no error path.
- No service was forced into one response shape; each keeps its own named payload keys.
- `public-api.ts` (typed `APIResponse`) is untouched — it was already truthful.
- `transparency.ts`, `volunteer.ts`, `governance.ts` were verified consistent and left alone.
- No schema, database, route, page or application change.

## 5. Test coverage of the reconciled contracts

| Service | Runtime coverage (already migrated or newly written) |
|---|---|
| people-registry | `human-capital.spec.ts` (register, verify, roles, get, search, get-by-skill) |
| mission-assignment | `human-capital.spec.ts` (propose, accept, log-hours, log-task, get-by-person) |
| recognition-service | `human-capital.spec.ts` (award-hours, achievement, certificate, recommendation, stats, public) |
| mission-service | `mission-operations.spec.ts` (create, approve, start, add-objective, add-timeline, get, get-by-domain) |
| resource-registry | `mission-operations.spec.ts` (register, assign, get-by-mission) |
| impact-registry | `mission-operations.spec.ts` (record-metric, generate-report, get-summary) |
| governance-service (V2) | `transparency-platform.spec.ts` (create-document, approve, resolution, vote, minutes, get) |
| finance-service | `transparency-platform.spec.ts` (create-budget, approve-budget, record-grant, record-donation) |
| projects-service | `transparency-platform.spec.ts` (create, approve, start, add-milestone, update-impact) |
| audit-service | `transparency-platform.spec.ts` (record, snapshot, query) |
| knowledge-platform | `knowledge-platform.spec.ts` (upload, summary, search, related, provenance, audit) |
| research.ts | `research-service.spec.ts` — **new**, ingest/search/summarize round-trip |
| transparency.ts | not covered — consistent with declaration, no payload keys to lose |
| volunteer.ts | not covered — consistent with declaration |
| governance.ts (V1) | not covered — consistent (`documents?` optional covers all cases) |
| PublicAPI | covered as part of the transparency-platform scenarios (health/documents/projects endpoints) |

## 6. Consumers of the reconciled types

None, today (§2 matrix). If an application or package adopts these services later, the widened
types mean named keys (`person`, `mission`, `report`, …) are readable without casts such as the
`payloadOf` helper used by the kernel specifications; that helper remains valid and safe.

## 7. Open items

- The `InstitutionService` interface's `Promise<unknown>` means a future refactor could still
  regress the concrete types without the union discipline. Nothing prevents that except the
  `typecheck` gate that compiles handler returns against the unions.
- `Person["status"]` narrowing: handlers returning `status` payloads remain as they are — the
  union's `person?: Person` covers them.
- This task touched only kernel services; no application behaviour, learner data, authentication
  surface or deployment configuration changed.
