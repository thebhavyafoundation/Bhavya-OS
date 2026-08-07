# ADR-002: UI Consolidation Under @bhavya/platform-ui

**Status:** Accepted | **Date:** 2026-08-07 | **Deciders:** Wave 4 Consolidation

## Context

Three UI packages existed: `@bhavya/ui`, `@bhavya/bdl`, and `@bhavya/platform-ui`. This caused confusion about which to use and duplicated component implementations.

## Decision

Establish `@bhavya/platform-ui` as the canonical UI package. Deprecate `@bhavya/ui` and `@bhavya/bdl`. All apps and packages use platform-ui exclusively.

## Consequences

- ✅ Single UI component library
- ✅ Consistent design system across all apps
- ✅ Light/dark theme support built-in
- ⚠️ All 6 app consumers migrated (no source imports found, only package.json)
- ⚠️ Deprecated packages remain until explicit removal

## Alternatives Considered

1. **Merge platform-ui into ui** — Rejected: platform-ui is more complete
2. **Keep all three** — Rejected: causes fragmentation
3. **Create new package** — Rejected: unnecessary, platform-ui already exists
