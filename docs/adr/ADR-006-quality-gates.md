# ADR-006: Quality Gate Enforcement

**Status:** Accepted | **Date:** 2026-08-07 | **Deciders:** Wave 4 Consolidation

## Context

Without automated checks, architectural violations could be introduced silently, degrading code quality over time.

## Decision

Implement 5 automated quality gates:
1. **Shared package has 50+ types** — Ensures shared is comprehensive
2. **No duplicate type definitions** — Prevents type drift
3. **No deprecated package imports** — Enforces migration
4. **No circular dependencies** — Maintains clean architecture
5. **Constitution docs exist** — Preserves governance

## Consequences

- ✅ Architectural violations caught immediately
- ✅ Automated enforcement (no manual oversight needed)
- ✅ Clear pass/fail criteria
- ⚠️ May need updates as architecture evolves
- ⚠️ False positives possible with dynamic imports

## Alternatives Considered

1. **Manual code review only** — Rejected: doesn't scale
2. **More gates** — Rejected: diminishing returns
3. **No automation** — Rejected: violations will slip through
