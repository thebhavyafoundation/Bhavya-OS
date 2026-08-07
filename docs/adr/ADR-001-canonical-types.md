# ADR-001: Canonical Type Source in @bhavya/shared

**Status:** Accepted | **Date:** 2026-08-07 | **Deciders:** Wave 4 Consolidation

## Context

Multiple packages defined duplicate types (Workflow, Agent, Task, Memory, Event, etc.), causing fragmentation and type inconsistency across the platform.

## Decision

Establish `@bhavya/shared` as the SINGLE source of truth for all domain types. All other packages import from shared rather than defining their own versions.

## Consequences

- ✅ 33+ duplicate definitions eliminated
- ✅ Single source of truth for 100+ types
- ✅ Backward compatibility maintained via re-exports in kernel and types
- ⚠️ Breaking change: packages must update imports
- ⚠️ Requires discipline: no new domain types outside shared

## Alternatives Considered

1. **Keep duplicates** — Rejected: causes type drift and confusion
2. **Merge into kernel** — Rejected: kernel is runtime-specific, not all types belong there
3. **Create separate types package** — Rejected: adds unnecessary indirection
