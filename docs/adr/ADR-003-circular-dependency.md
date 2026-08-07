# ADR-003: Circular Dependency Elimination

**Status:** Accepted | **Date:** 2026-08-07 | **Deciders:** Wave 4 Consolidation

## Context

`@bhavya/kernel` depended on `@bhavya/agent-engine`, while agent-engine imported types from `@bhavya/kernel`, creating a circular dependency that caused quality gate failures.

## Decision

Break the cycle by:
1. `agent-engine` imports types from `@bhavya/shared` instead of kernel
2. `kernel` removes stale dependency on `agent-engine` (and 6 other unused engine packages)
3. `kernel` keeps BRP-specific types, imports shared types from shared

## Consequences

- ✅ Quality gates pass 5/5
- ✅ No circular dependencies detected
- ✅ Clear dependency direction: agent-engine → shared ← kernel
- ⚠️ Breaking change: agent-engine no longer re-exports kernel types

## Alternatives Considered

1. **Merge agent-engine into kernel** — Rejected: different responsibilities
2. **Create interface package** — Rejected: adds unnecessary indirection
3. **Use dynamic imports** — Rejected: doesn't solve root cause
