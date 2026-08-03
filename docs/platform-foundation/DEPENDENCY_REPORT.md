# DEPENDENCY REPORT

**Date:** 2026-08-03
**Sprint:** Platform Foundation v2.0

---

## New Package Dependencies

```
@bhavya/platform     → (none)
@bhavya/types        → (none)
@bhavya/security     → (none)
@bhavya/providers    → @bhavya/types
@bhavya/database     → better-sqlite3
@bhavya/api          → @bhavya/platform, @bhavya/security
@bhavya/events       → @bhavya/platform, @bhavya/types
@bhavya/workflows    → @bhavya/platform, @bhavya/types, @bhavya/events
@bhavya/ai           → @bhavya/platform, @bhavya/types
@bhavya/notifications → @bhavya/platform, @bhavya/types
@bhavya/platform-ui  → react (peer)
```

## Circular Dependency Analysis

**Before:** 7 circular dependencies (kernel ↔ engines)

**After:** Zero circular dependencies among new packages.

```
@bhavya/platform ─────────────────────────────────┐
@bhavya/types ────────────────────────────────────┤
@bhavya/security ─────────────────────────────────┤
                                                   │
@bhavya/api ─────→ @bhavya/platform ──────────────┤
                   @bhavya/security ───────────────┤
                                                   │
@bhavya/events ──→ @bhavya/platform ──────────────┤
                   @bhavya/types ──────────────────┤
                                                   │
@bhavya/workflows → @bhavya/platform ─────────────┤
                    @bhavya/types ─────────────────┤
                    @bhavya/events ────────────────┤
                                                   │
@bhavya/ai ───────→ @bhavya/platform ─────────────┤
                    @bhavya/types ─────────────────┤
                                                   │
@bhavya/providers → @bhavya/types ────────────────┤
@bhavya/notifications → @bhavya/platform ─────────┤
                         @bhavya/types ────────────┤
                                                   │
@bhavya/platform-ui → react (peer) ───────────────┘
```

## Unused Package Analysis

| Package                  | Status                         | Action                           |
| ------------------------ | ------------------------------ | -------------------------------- |
| `@bhavya/agent-platform` | Isolated (used by nothing)     | Keep as optional integration     |
| `@bhavya/bee`            | Isolated (used by nothing)     | Consider deprecating             |
| `@bhavya/cli`            | Isolated (used by nothing)     | Keep as standalone tool          |
| `@bhavya/branding`       | Unused by apps                 | Can be consumed by apps          |
| `@bhavya/config`         | Unused by apps                 | Can be consumed by apps          |
| `@bhavya/icons`          | Thin wrapper over lucide-react | Consider deprecating             |
| `@bhavya/ui`             | Broken stub (3 lines)          | Replace with @bhavya/platform-ui |
| `@bhavya/docs`           | Data-only package              | Keep as-is                       |
| `@bhavya/maps`           | Placeholder                    | Keep as-is                       |
| `@bhavya/charts`         | Placeholder                    | Keep as-is                       |

## Bundle Size Impact

New packages add ~3,650 lines of TypeScript source. When compiled and tree-shaken, the actual bundle impact will be minimal since apps only import what they use.
