---
id: RUNTIME-009
owner: Engineering
version: 0.5
status: active
depends:
  - RUNTIME-004
related:
  - RUNTIME-010
  - STD-003
---

# Dependency Map

## Apps → Packages

| App | Dependencies |
|-----|-------------|
| `apps/website` | `@bhavya/mission-runtime`, `@bhavya/ui`, `next`, `react`, `react-dom` |
| `apps/admin` | (shell) |
| `apps/docs` | (shell) |
| `apps/forest` | (shell) |
| `apps/heritage` | (shell) |
| `apps/volunteer` | (shell) |
| `apps/knowledge` | (shell) |
| `apps/library` | (shell) |
| `apps/transparency` | (shell) |

## Package Dependencies

| Package | Depends On |
|---------|-----------|
| `@bhavya/ui` | `@bhavya/bdl` |
| `@bhavya/mission-runtime` | (none yet) |
| `@bhavya/docs` | `@bhavya/ui` |
| `@bhavya/bdl` | (none yet) |

## Dev Dependency Chain

| Config | Used By |
|--------|---------|
| `@bhavya/typescript` | All apps and packages |
| `@bhavya/eslint` | Root, apps/website, apps/admin, apps/docs |

## External Dependencies

| Package | Version | Used By |
|---------|---------|---------|
| `next` | 15.5.20 | apps |
| `react` | 19.2.4 | apps, packages/ui, packages/docs |
| `react-dom` | 19.2.4 | apps |
| `turbo` | 2.5.6 | root (dev) |
| `typescript` | 5.9.2 | root (dev) |
| `tailwindcss` | 4.1.13 | root (dev) |
| `eslint` | 9.36.0 | root (dev) |
| `prettier` | 3.6.2 | root (dev) |
| `husky` | 9.1.7 | root (dev) |

## No Dependency Cycles

The dependency graph is acyclic: Apps → Packages → Utilities. No circular dependencies exist or are permitted.
