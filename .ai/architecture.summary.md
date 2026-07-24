---
id: RUNTIME-005-SUMMARY
parent: RUNTIME-005
owner: Architecture
purpose: Lightweight summary of Bhavya OS architecture
---

# Architecture Summary

## Stack
- Turborepo monorepo + pnpm workspaces
- Next.js 15 + React 19 (apps)
- TypeScript 5.9 (strict)
- Tailwind CSS 4

## Layered Hierarchy
```
Apps (Next.js 15)
  ↓
Mission Runtime (gateway, registry, memory, events, metadata, a11y, observability)
  ↓
Shared Packages (ui, bdl, bdx, docs, branding, charts, icons, maps, auth, config, database)
  ↓
Infrastructure (schemas, registry, standards, specs, rfcs, config, memory)
```

## Rules
- No circular dependencies
- Apps depend only on packages
- `@bhavya/ui` re-exports `@bhavya/bdl`
- Registries are generated, never edited manually
- 8-phase release progression to v1.0

## Scope
- 9 apps (4 active, 5 shells)
- 14 packages
- 16 standards
- 7 schemas
- 3 RFCs, 4 ADRs

*Load architecture.md for full details.*
