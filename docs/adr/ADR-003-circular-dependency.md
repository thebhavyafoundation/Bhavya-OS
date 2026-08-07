# ADR-003: Circular Dependency Elimination

**Status:** Accepted | **Date:** 2026-08-07 | **Deciders:** Wave 4 Consolidation

## Context

`@bhavya/kernel` depended on `@bhavya/agent-engine`, while agent-engine imported types from `@bhavya/kernel`, creating a circular dependency that caused quality gate failures.

**Evidence:**
- Quality gate "No circular dependencies" was FAILING
- `kernel/package.json` listed `@bhavya/agent-engine` as dependency
- `agent-engine/src/index.ts` imported from `@bhavya/kernel`

## Decision

Break the cycle by:

1. **`agent-engine`** imports types from `@bhavya/shared` instead of kernel
   - Changed: `import type { Agent, AgentId, Capability, Permission, AgentStatus } from '@bhavya/kernel'`
   - To: `import type { Agent, AgentId, Capability, Permission, AgentStatus } from '@bhavya/shared'`

2. **`kernel`** removes stale dependency on `agent-engine` (and 6 other unused engine packages)
   - Removed: `@bhavya/agent-engine`, `@bhavya/workflow-engine`, `@bhavya/memory-engine`, `@bhavya/knowledge-engine`, `@bhavya/search-engine`, `@bhavya/planner-engine`, `@bhavya/scheduler-engine`

3. **`kernel`** keeps BRP-specific types, imports shared types from shared
   - Added: `Capability` to imports from `@bhavya/shared`
   - Removed: Local `Capability` interface definition

## Consequences

- ✅ Quality gates pass 5/5
- ✅ No circular dependencies detected
- ✅ Clear dependency direction: agent-engine → shared ← kernel
- ✅ BRP-specific types remain in kernel (ExecutionContext, ExecutionTimestamps, etc.)
- ⚠️ Breaking change: agent-engine no longer re-exports kernel types
- ⚠️ 7 stale dependencies removed from kernel

## Alternatives Considered

1. **Merge agent-engine into kernel** — Rejected: different responsibilities (runtime vs. agent management)
2. **Create interface package** — Rejected: adds unnecessary indirection
3. **Use dynamic imports** — Rejected: doesn't solve root cause, adds runtime overhead
4. **Keep both dependencies** — Rejected: causes quality gate failures

## Validation

```bash
# After fix
node scripts/quality-gates.mjs
# Result: 5/5 PASS

# Verify no cycles
grep -r "@bhavya/agent-engine" packages/kernel/
# Result: No matches

grep -r "@bhavya/kernel" packages/agent-engine/
# Result: No matches
```

## Date Completed

2026-08-07 | Commit: `638be5a`
