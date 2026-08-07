# ADR-004: Three-Layer Architecture

**Status:** Accepted | **Date:** 2026-08-07 | **Deciders:** Wave 4 Consolidation

## Context

The repository had 23 apps and 54 packages with no clear dependency hierarchy, making it difficult to understand what depends on what.

## Decision

Establish a strict three-layer architecture:
- **L0 (Foundation):** shared, platform-ui, design-system, content-core, intelligence, project-runtime, constitution
- **L1 (Services):** kernel, types, knowledge-graph, agent-engine, mission-runtime, runtime, sdk, maps, charts, docs
- **L2 (Apps):** All 12 applications
- **T (Tooling):** eslint, typescript

Dependencies flow downward only: L2 → L1 → L0. No upward dependencies.

## Consequences

- ✅ Clear dependency direction
- ✅ Easy to reason about what can import what
- ✅ Prevents architectural drift
- ⚠️ Requires enforcement (quality gate)
- ⚠️ Some packages may need restructuring

## Alternatives Considered

1. **No layers** — Rejected: causes chaos
2. **More layers** — Rejected: over-engineering for current needs
3. **Feature-based grouping** — Rejected: harder to enforce
