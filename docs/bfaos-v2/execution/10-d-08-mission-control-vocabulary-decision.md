# BFAOS V2 — D-08 Decision Brief: Mission Control Status Vocabulary

**Date:** 2026-11-18 · **Branch:** `feat/bfaos-phase4-contracts` · **Owner:** Founder · **Status:** Proposed (not implemented)

## 1. The decision

Kernel integration with Mission Control is blocked until the founder chooses a job-status vocabulary and transition table (D-08) and an artefact store / checkpoint persistence (D-09). Neither may be implemented without founder approval.

This brief covers D-08 only.

## 2. What the kernel already provides (tested, not wired)

`packages/kernel/src/execution/mission-control-mapping.ts` exports a **pure mapping function**:

```ts
export function mapExecutionResultToMissionControl(
  result: ExecutionResult,
  transitions: MissionControlTransitionTable,
): MissionControlJobState
```

- `MissionControlTransitionTable = Record<string, string[]>` — caller-supplied
- The kernel does **not** declare any status vocabulary or transition table
- The mapping is pure: same inputs → same output, no side effects
- A drift guard (`mission-control-drift.spec.ts`) verifies the union and table stay in sync

## 3. What must be decided (D-08)

| Question | Options / notes |
|---|---|
| **Status vocabulary** | Which job statuses exist? E.g. `queued`, `running`, `succeeded`, `failed`, `retrying`, `cancelled`, `skipped`? |
| **Valid transitions** | Which status may follow which? E.g. `queued → running`, `running → succeeded/failed/retrying`, `retrying → running`? |
| **Terminal states** | Which statuses are terminal (no outgoing transitions)? E.g. `succeeded`, `failed`, `cancelled`? |
| **Retry/resume semantics** | Does `failed` transition to `retrying`? Who decides retry count/backoff? Is resume from `retrying` to `running` automatic? |
| **Decision logging** | Is every transition logged with timestamp, actor, and reason? Where? |
| **Effect on kernel integration** | The kernel's `mapExecutionResultToMissionControl` accepts the table as a parameter, so the kernel itself needs no change — only the caller supplies the table. |

## 4. Constraint

No kernel control may be wired into Mission Control until D-08 (vocabulary + transitions) and D-09 (artefact store / checkpoint persistence) are both decided. The kernel contracts are complete and tested; integration is a caller-side concern.

## 5. Recommendation

**Adopt a minimal vocabulary:** `queued`, `running`, `succeeded`, `failed`, `retrying`, `cancelled`. Terminal: `succeeded`, `failed`, `cancelled`. Retry: `failed → retrying` only when a retry policy allows it; `retrying → running` on retry. Log every transition in the caller's audit store. This keeps the kernel's pure mapping sufficient and requires no kernel change.

**Do not implement yet.** This is a founder decision; implementation follows approval.
