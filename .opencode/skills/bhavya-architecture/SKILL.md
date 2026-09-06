---
name: bhavya-architecture
description: Inspect and evolve Bhavya architecture without duplication or unnecessary structural change. Use before creating new packages, apps, routes, API endpoints, data models, or making structural changes.
compatibility: opencode
---

# Bhavya Architecture Skill

## Purpose

Ensure architectural decisions preserve the single-ecosystem integrity of Bhavya Foundation. Prevent duplication, maintain canonical ownership, and enforce incremental migration.

## Core Rules

1. **Inspect before modifying.** Read existing code, types, routes, and configs before creating anything new.
2. **Identify canonical entities.** Check `packages/shared/` for existing type definitions before creating new types.
3. **Identify existing capabilities.** Search `packages/` for existing implementations before building new packages.
4. **Avoid duplicate subsystems.** One concept → one canonical location.
5. **Preserve architectural boundaries.** Apps depend on packages, not on other apps.
6. **Document structural changes.** Update `CONTEXT.md`, `CANONICAL_ROUTE_MAP.md`, and `DOMAIN_OWNERSHIP.md` when architecture changes.
7. **Prefer incremental migrations.** Move functionality gradually, not big-bang rewrites.
8. **Verify dependency direction.** Packages must not depend on apps. Apps may depend on packages.
9. **Identify downstream impact.** Check what breaks before moving or renaming shared code.
10. **Never introduce infrastructure without justification.** Every new package, service, or pattern must solve a real problem.

## Pre-Change Checklist

Before any structural change, produce:

### CURRENT
What exists today. Include file paths, package names, and dependency relationships.

### TARGET
What the change achieves. Be specific about what moves, what gets created, what gets removed.

### MIGRATION
Step-by-step plan to get from CURRENT to TARGET without breaking existing functionality.

## Canonical Ownership

Refer to `docs/architecture/DOMAIN_OWNERSHIP.md` for package ownership.
Refer to `docs/architecture/CANONICAL_ROUTE_MAP.md` for route ownership.
Refer to `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md` for source-of-truth definitions.

## Anti-Patterns

- Creating a new package when an existing one can be extended
- Creating a new app when a route in the canonical app suffices
- Adding app-to-app dependencies
- Moving code without updating all import paths
- Creating duplicate type definitions
- Adding new ORM/database layers when SQLite abstraction exists
- Introducing new authentication mechanisms when `@bhavya/auth` exists
