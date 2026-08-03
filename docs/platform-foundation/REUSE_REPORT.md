# REUSE REPORT — Bhavya Foundation

**Date:** 2026-08-03
**Sprint:** Platform Foundation v2.0

---

## Executive Summary

The repository has **massive duplication** across 15 apps and 26 packages. The audit found **4,600+ wasted lines** of duplicated UI components, **50+ duplicated type definitions**, and **6+ copies** of core utilities. Every app rebuilds the same sidebar, cards, badges, layouts, and data access layers from scratch. No shared platform exists despite having `@bhavya/ui` (a broken stub) and `@bhavya/bdl` (unused primitives).

---

## 1. UI Component Duplications

### Sidebar (11 copies — 730 wasted lines)

Every app implements its own Sidebar. All follow the same pattern: sticky nav with brand, links, active state, back link.

| App              | File                          | Lines |
| ---------------- | ----------------------------- | ----- |
| knowledge-studio | `src/components/sidebar.tsx`  | 79    |
| lesson-studio    | `src/components/sidebar.tsx`  | 48    |
| forest           | `src/components/Sidebar.tsx`  | 89    |
| heritage         | `src/components/Sidebar.tsx`  | 58    |
| knowledge        | `src/components/Sidebar.tsx`  | 93    |
| library          | `src/components/Sidebar.tsx`  | 49    |
| research         | `src/components/Sidebar.tsx`  | 79    |
| volunteer        | `src/components/Sidebar.tsx`  | 55    |
| bhavya-ai-lab    | `src/components/sidebar.tsx`  | 247   |
| design-system    | `src/components/Sidebar.tsx`  | 54    |
| admin            | `src/app/layout.tsx` (inline) | 28    |

**Note:** `packages/bdl/primitives/Sidebar/` exists (13 lines) but is unused by all apps.

### StatCard (13 copies — 150 wasted lines)

| App              | File                                                    |
| ---------------- | ------------------------------------------------------- |
| bhavya-ai-lab    | `src/components/stat-card.tsx` (58 lines, best version) |
| dashboard        | `src/app/page.tsx` (inline)                             |
| dashboard        | 9 sub-pages (inline 7-line copies)                      |
| knowledge-studio | `src/app/pipeline/[id]/page.tsx` (inline)               |

### WidgetCard (12 copies — 100 wasted lines)

All 12 dashboard pages define the same inline WidgetCard wrapper.

### StatusBadge (15+ files — 300 wasted lines)

Same badge pattern redefined in every dashboard page, forest, heritage, volunteer, research, lesson-studio.

### SearchClient (3 copies — 420 wasted lines)

| App       | File                              | Lines |
| --------- | --------------------------------- | ----- |
| knowledge | `src/components/SearchClient.tsx` | 184   |
| library   | `src/components/SearchClient.tsx` | 101   |
| docs      | `src/components/SearchClient.tsx` | 136   |

### Layout Shell (70+ pages — 700+ wasted lines)

Every page in forest, heritage, knowledge, library, research, volunteer, knowledge-studio, lesson-studio repeats:

```tsx
<div style={{ display: "flex", minHeight: "100vh" }}>
  <Sidebar />
  <main>...
```

### EmptyState (5+ inline instances — 100 wasted lines)

Only bhavya-ai-lab extracted it as a component. Others handle inline.

### Page Header Pattern (12+ pages — 200 wasted lines)

All dashboard pages repeat the same uppercase label + h1 + subtitle pattern.

### Filter Pills / Badge Patterns (10+ files — 150 wasted lines)

Same inline badge styling repeated across lesson-studio, forest, heritage, volunteer.

### Data Access Layer — `lib/data.ts` (8 files — 950 wasted lines)

Every app has its own `data.ts` re-exporting from `@bhavya/content-core`. Two apps (bhavya-ai-lab, docs) have independent filesystem implementations.

---

## 2. Type Duplications (26 categories, 50+ definitions)

### Critical Conflicts

| Type           | Locations                               | Conflict                                                             |
| -------------- | --------------------------------------- | -------------------------------------------------------------------- |
| `Workflow`     | kernel, runtime, workflow-engine        | Different statuses, step shapes, trigger structures                  |
| `Event`        | kernel, runtime, mission-runtime        | Different field names (`type` vs `name`, `timestamp` vs `createdAt`) |
| `Memory`       | kernel, runtime, content-core           | Different type enums (7 vs 10 values), different structures          |
| `Policy`       | content-core, runtime                   | Different statuses, different fields (`title` vs `name+rules`)       |
| `GraphNode`    | content-core, runtime, knowledge-engine | Three incompatible shapes                                            |
| `SearchResult` | search-engine, mission-runtime, website | `content+path` vs `excerpt+url`                                      |
| `Document`     | content-core, mission-runtime           | Completely different domain models                                   |
| `AuditEntry`   | mission-runtime, runtime                | Different action types, timestamp types                              |
| `User`         | knowledge-studio, mission-runtime       | `role: string` vs `roles: string[]`                                  |
| `Artifact`     | kernel, knowledge-studio                | File change record vs pipeline output                                |
| `Evidence`     | content-core, runtime                   | Same strength enum, different structures                             |
| `Source`       | content-core, runtime                   | Different SourceType enums                                           |
| `Research`     | content-core, runtime                   | Different status enums, different fields                             |
| `Goal`         | kernel, runtime                         | Same priority, runtime adds KPIs/owner                               |
| `Plan`         | kernel, runtime                         | Different statuses, different structures                             |
| `Priority`     | 5 locations                             | Same `'critical'                                                     | 'high' | 'medium' | 'low'` union, different names |

---

## 3. Utility Duplications

### File System Helpers (6+ copies)

`readJSON`, `readMD`, `listDir`, `writeJSON`, `ensureDir` duplicated in:

- `packages/content-core/src/io.ts`
- `apps/docs/src/lib/data.ts`
- `apps/bhavya-ai-lab/src/lib/data.ts`
- `packages/runtime/engine/config.mjs`
- `packages/runtime/cli/api.mjs`
- `packages/bee/src/engines/state-manager.mjs`

### EventBus (3 implementations)

1. `packages/bee/src/engines/event-bus.mjs` (127 lines, lightweight)
2. `packages/runtime/src/engines/event-bus.ts` (400 lines, full-featured)
3. `packages/kernel/src/events/index.ts` (re-export)

### RateLimiter (3 implementations)

1. `apps/knowledge-studio/src/lib/rate-limit.ts` (functional, sliding window)
2. `packages/kernel/src/rate-limit/index.ts` (class-based, sliding window)
3. `apps/website/src/lib/api-layer.ts` (stub)

### Auth (5 implementations)

1. `apps/knowledge-studio/src/lib/auth.ts` (NextAuth.js)
2. `apps/knowledge-studio/src/lib/auth-guard.ts` (wrapper)
3. `packages/kernel/src/auth/index.ts` (custom token-based)
4. `packages/mission-runtime/src/auth/index.ts` (interface stub)
5. `packages/runtime/cli/api.mjs` (API key check)

### API Client (5+ implementations)

1. `apps/website/src/lib/api-client.ts` (APIClient class)
2. `apps/lesson-studio/src/lib/runtime-client.ts` (runtimeFetch)
3. `apps/lesson-studio/src/lib/capabilities.ts` (direct fetch)
4. `packages/sdk/src/runtime.ts` (RuntimeClient)
5. `packages/agent-platform/src/adapters.ts` (requestJson)

### KO CRUD (4 implementations)

1. `apps/knowledge-studio/src/lib/db.ts` (SQLite)
2. `apps/knowledge-studio/src/lib/ingestion.ts` (filesystem)
3. `packages/runtime/cli/api.mjs` (filesystem inline)
4. `apps/lesson-studio/src/lib/runtime-client.ts` (remote fetch)

### ID Generation (7 variations)

Same `Date.now()-random` pattern in 7 locations with different prefixes and slice lengths.

### Logging

Only `packages/kernel/src/logging/index.ts` has structured logging. All other packages use raw `console.*`.

---

## 4. Package Status

### Broken

| Package      | Issue                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| `@bhavya/ui` | Stub (3 lines). Does not re-export BDL despite claiming to. 3 packages import from it and will fail. |

### Unused (imported by zero consumers)

| Package                  | Code                              |
| ------------------------ | --------------------------------- |
| `@bhavya/agent-platform` | 5 files, LangGraph research agent |
| `@bhavya/bee`            | 421 lines, full execution engine  |
| `@bhavya/cli`            | 6 files, Commander CLI            |
| `@bhavya/branding`       | 59 lines, brand constants         |

### Empty Directories

| Directory           | Status                           |
| ------------------- | -------------------------------- |
| `packages/auth`     | Empty, no package.json           |
| `packages/database` | Empty, no package.json           |
| `packages/bdx`      | 9 empty subdirs, no package.json |

---

## 5. Recommended Consolidation

| Category                                     | Current State      | Target Package                |
| -------------------------------------------- | ------------------ | ----------------------------- |
| Sidebar, StatCard, WidgetCard, Badge, Layout | 11+ copies each    | `@bhavya/platform-ui`         |
| KnowledgeObject, Package, Artifact, etc.     | 50+ type defs      | `@bhavya/types`               |
| readJSON, writeJSON, listDir, ensureDir      | 6 copies           | `@bhavya/database` (fs layer) |
| EventBus                                     | 3 implementations  | `@bhavya/events`              |
| RateLimiter                                  | 3 implementations  | `@bhavya/security`            |
| Auth                                         | 5 implementations  | `@bhavya/security`            |
| API Client, error handling                   | 5+ implementations | `@bhavya/api`                 |
| KO CRUD                                      | 4 implementations  | `@bhavya/database`            |
| Workflow engine                              | 3 implementations  | `@bhavya/workflows`           |
| Validation, ID generation                    | Scattered          | `@bhavya/platform`            |
