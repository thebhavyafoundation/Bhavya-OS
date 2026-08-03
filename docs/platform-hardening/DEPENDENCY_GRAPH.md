# Dependency Graph

**Generated:** 2026-08-03
**Scope:** All workspace packages and apps

---

## Package Dependency Diagram

```
                    ┌─────────────────────────────────────────┐
                    │              CONFIG PACKAGES             │
                    │  @bhavya/eslint    @bhavya/typescript   │
                    │  @bhavya/config    @bhavya/branding     │
                    └──────────────────┬──────────────────────┘
                                       │ (consumed by most packages)
                                       ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         CORE PACKAGES                                    │
│                                                                          │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐                │
│  │ content-core │◄───│ intelligence │    │ mission-     │                │
│  │   (541 LOC)  │    │   (97 LOC)   │    │ runtime      │                │
│  └──────┬───────┘    └──────────────┘    │  (31 LOC)    │                │
│         │                                └──────┬───────┘                │
│         │                                       │                        │
│         ▼                                       ▼                        │
│  ┌──────────────┐                        ┌──────────────┐                │
│  │   7 apps     │                        │     sdk      │                │
│  │ (dashboard,  │                        │   (5 LOC)    │                │
│  │  forest,     │                        └──────┬───────┘                │
│  │  heritage,   │                               │                        │
│  │  volunteer,  │                               ▼                        │
│  │  library,    │                        ┌──────────────┐                │
│  │  research,   │                        │  3 apps      │                │
│  │  knowledge)  │                        │ (admin,docs, │                │
│  └──────────────┘                        │  website)    │                │
│                                          └──────────────┘                │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                    KERNEL + ENGINE PACKAGES (CIRCULAR)                    │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │                    @bhavya/kernel                                │    │
│  │                    (107 LOC index, 30 subdirs)                   │    │
│  └────┬────┬────┬────┬────┬────┬────┬──────────────────────────────┘    │
│       │    │    │    │    │    │    │                                    │
│       ▼    ▼    ▼    ▼    ▼    ▼    ▼                                    │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │ agent-   workflow-  memory-  knowledge- search-  planner-     │     │
│  │ engine   engine     engine   engine     engine   engine       │     │
│  │ (99L)    (94L)      (94L)    (94L)      (73L)    (97L)       │     │
│  └────────────────────────────────────────────────────────────────┘     │
│       │    │    │    │    │    │                                        │
│       └────┴────┴────┴────┴────┘  (all import types from kernel)       │
│                                                                          │
│  ⚠️  CIRCULAR: kernel → engine → kernel (type-only imports)             │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                    RUNTIME + BEE PACKAGES                                │
│                                                                          │
│  ┌──────────────┐         ┌──────────────┐                              │
│  │   runtime    │◄────────│     bee      │                              │
│  │  (336 LOC)   │         │  (421 LOC)   │                              │
│  │              │  ⚠️     │              │                              │
│  │ exports:     │ RELATIVE│ exports:     │                              │
│  │  .           │ IMPORT  │  .           │                              │
│  │  ./registry  │         └──────────────┘                              │
│  │  ./resolver  │                                                       │
│  │  ./events    │         ┌──────────────┐                              │
│  │  ./permissions│        │ agent-       │                              │
│  │  ./provenance│         │ platform     │                              │
│  └──────────────┘         │ (langchain)  │                              │
│                           └──────────────┘                              │
│                           (unused by any app)                           │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                         UI PACKAGES                                      │
│                                                                          │
│  ┌──────────────┐         ┌──────────────┐                              │
│  │     bdl      │◄────────│     ui       │                              │
│  │  (22 LOC)    │         │  (3 LOC)     │                              │
│  │ 19 primitives│         │ ⚠️ STUB      │                              │
│  └──────────────┘         │ version only │                              │
│                           └──────┬───────┘                              │
│                                  │                                      │
│                    ┌─────────────┼─────────────┐                        │
│                    ▼             ▼             ▼                        │
│              ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│              │  charts  │ │   maps   │ │   docs   │                    │
│              └──────────┘ └──────────┘ └──────────┘                    │
│                                                                          │
│  ⚠️  ui is a STUB — 4 packages depend on a version string              │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                         APP DEPENDENCIES                                 │
│                                                                          │
│  Apps WITH workspace deps:                                               │
│    admin      → mission-runtime, sdk                                    │
│    dashboard  → content-core, intelligence, ui                          │
│    docs       → mission-runtime, sdk                                    │
│    forest     → content-core, maps, mission-runtime, ui                 │
│    heritage   → content-core, ui                                        │
│    knowledge  → content-core, intelligence, mission-runtime, ui         │
│    library    → content-core                                            │
│    research   → content-core                                            │
│    volunteer  → content-core, ui                                        │
│    website    → mission-runtime, sdk, ui                                │
│                                                                          │
│  Apps WITHOUT workspace deps (ISLANDS):                                  │
│    bhavya-ai-lab  (0 workspace deps)                                    │
│    design-system  (0 workspace deps)                                    │
│    knowledge-studio (0 workspace deps)                                  │
│    lesson-studio  (0 workspace deps)                                    │
│    transparency   (0 workspace deps)                                    │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Circular Dependencies

### Cycle: kernel ↔ engines (7 cycles)

```
@bhavya/kernel ──depends──► @bhavya/agent-engine
@bhavya/agent-engine ──depends (type-only)──► @bhavya/kernel

@bhavya/kernel ──depends──► @bhavya/workflow-engine
@bhavya/workflow-engine ──depends (type-only)──► @bhavya/kernel

@bhavya/kernel ──depends──► @bhavya/memory-engine
@bhavya/memory-engine ──depends (type-only)──► @bhavya/kernel

@bhavya/kernel ──depends──► @bhavya/knowledge-engine
@bhavya/knowledge-engine ──depends (type-only)──► @bhavya/kernel

@bhavya/kernel ──depends──► @bhavya/search-engine
@bhavya/search-engine ──depends (type-only)──► @bhavya/kernel

@bhavya/kernel ──depends──► @bhavya/planner-engine
@bhavya/planner-engine ──depends (type-only)──► @bhavya/kernel

@bhavya/kernel ──depends──► @bhavya/scheduler-engine
@bhavya/scheduler-engine ──depends (type-only)──► @bhavya/kernel
```

**Nature:** Type-only at runtime (engines use `import type` from kernel). But `package.json` declares full dependency, causing package manager issues.

**Fix:** Extract types into `@bhavya/types` package.

---

## Stub Packages (no package.json)

| Directory                | Contents                                  | Status                  |
| ------------------------ | ----------------------------------------- | ----------------------- |
| `packages/auth`          | Empty directory                           | Dead                    |
| `packages/database`      | Empty directory                           | Dead                    |
| `packages/bar`           | Subdirs only (bee-state, provenance)      | Data dir, not a package |
| `packages/bdx`           | Subdirs (cli, codemods, generators, etc.) | Orphaned tooling        |
| `packages/bhavya-ai-lab` | Subdir (data/)                            | Data dir, not a package |

---

## Unused Packages (not consumed by any app or package)

| Package                  | Lines | Notes                                  |
| ------------------------ | ----- | -------------------------------------- |
| `@bhavya/agent-platform` | ~200  | Has langchain integration but unused   |
| `@bhavya/branding`       | ~50   | Config package, unused                 |
| `@bhavya/charts`         | ~50   | Depends on stub `@bhavya/ui`           |
| `@bhavya/config`         | ~20   | Config package, unused                 |
| `@bhavya/docs`           | ~50   | Depends on stub `@bhavya/ui`           |
| `@bhavya/icons`          | ~50   | lucide-react wrapper, unused           |
| `@bhavya/bee`            | 421   | Execution engine, unused by apps       |
| `@bhavya/runtime`        | 336   | Only consumed by bee (which is unused) |

**Note:** `runtime` and `bee` are used by the Knowledge Studio via HTTP (not package import), so they're functionally used but not in the dependency graph.

---

## Package Consumption Heat Map

| Package                   | Consumed By           | Count |
| ------------------------- | --------------------- | ----- |
| `@bhavya/eslint`          | 21 (11 pkg + 10 apps) | 21    |
| `@bhavya/typescript`      | 20 (10 pkg + 10 apps) | 20    |
| `@bhavya/content-core`    | 10 (3 pkg + 7 apps)   | 10    |
| `@bhavya/ui`              | 10 (4 pkg + 6 apps)   | 10    |
| `@bhavya/kernel`          | 7 (7 engines)         | 7     |
| `@bhavya/mission-runtime` | 6 (1 pkg + 5 apps)    | 6     |
| `@bhavya/sdk`             | 3 (3 apps)            | 3     |
| `@bhavya/intelligence`    | 2 (2 apps)            | 2     |
| `@bhavya/bdl`             | 1 (ui)                | 1     |
| `@bhavya/maps`            | 1 (1 app)             | 1     |

---

## Architecture Issues Identified

1. **5 apps are islands** — zero workspace deps, no shared code
2. **@bhavya/ui is a stub** — 10 consumers get nothing
3. **kernel ↔ engines circular** — 7 cycles via type imports
4. **8 packages unused** — dead code in the monorepo
5. **5 stub directories** — no package.json, unclear purpose
6. **runtime/bee not consumed as packages** — used via HTTP instead
7. **No shared types package** — each package redefines domain entities
8. **No shared component library** — each app rebuilds UI from scratch
