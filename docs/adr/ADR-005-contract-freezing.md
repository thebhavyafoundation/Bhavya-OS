# ADR-005: Platform Contract Freezing

**Status:** Accepted | **Date:** 2026-08-07 | **Deciders:** Wave 4 Consolidation

## Context

Without explicit contracts, packages could change their public APIs at any time, breaking consumers unexpectedly.

## Decision

Freeze public APIs for all 6 canonical packages with versioned contracts in `contracts/` directory. Each contract documents:
- Public exports
- Breaking change policy
- Deprecation timeline
- Consumer list

## Consequences

- ✅ Explicit public API surface
- ✅ Breaking changes require major version bump
- ✅ Deprecation period enforced (2-3 releases)
- ⚠️ Additional maintenance burden
- ⚠️ May slow down rapid iteration

## Alternatives Considered

1. **No contracts** — Rejected: causes unexpected breakage
2. **Automated API extraction** — Rejected: over-engineering
3. **Just documentation** — Rejected: contracts need enforcement
