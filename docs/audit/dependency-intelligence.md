# Dependency Intelligence Report

**Generated:** 2026-08-06 | **Method:** Automated package.json scan (main repo, excludes worktrees)

---

## Dependency Graph

### Packages (23)

| Package | Depends On | Layer |
|---------|-----------|-------|
| `shared` | *(none — root)* | L0 |
| `types` | shared | L1 |
| `kernel` | shared | L1 |
| `knowledge-graph` | shared | L1 |
| `agent-engine` | shared | L1 |
| `mission-runtime` | shared | L1 |
| `runtime` | shared | L1 |
| `platform-ui` | *(none — root)* | L0 |
| `design-system` | *(none — root)* | L0 |
| `content-core` | *(none — root)* | L0 |
| `intelligence` | *(none — root)* | L0 |
| `project-runtime` | *(none — root)* | L0 |
| `maps` | platform-ui | L1 |
| `charts` | platform-ui | L1 |
| `docs` | platform-ui | L1 |
| `bdl` | *(none — deprecated)* | L0 |
| `ui` | bdl | L1 *(deprecated)* |
| `sdk` | mission-runtime | L1 |
| `constitution` | *(none — root)* | L0 |
| `eslint` | *(none — tooling)* | T |
| `typescript` | *(none — tooling)* | T |

### Apps (12)

| App | Depends On |
|-----|-----------|
| `website` | mission-runtime, sdk |
| `forest` | content-core, maps, mission-runtime |
| `volunteer` | content-core |
| `dashboard` | content-core, intelligence |
| `knowledge` | content-core, intelligence, mission-runtime |
| `heritage` | content-core |
| `github-os` | events, platform, platform-ui, types |
| `social-os` | events, platform, platform-ui, types |
| `ioc` | *(none)* |
| `knowledge-studio` | *(none)* |
| `lesson-studio` | *(none)* |
| `ai-university` | *(none)* |

---

## Layer Architecture

```
L0 (Foundation)    shared, platform-ui, design-system, content-core,
                   intelligence, project-runtime, constitution, bdl

L1 (Services)      kernel, types, knowledge-graph, agent-engine,
                   mission-runtime, runtime, sdk, maps, charts, docs

L2 (Apps)          website, forest, volunteer, dashboard, knowledge,
                   heritage, github-os, social-os, ioc, knowledge-studio,
                   lesson-studio, ai-university

T  (Tooling)       eslint, typescript
```

**Dependency Direction:** L2 → L1 → L0 ✅ (no upward dependencies)

---

## Canonical Packages (12 — Constitution)

| Canonical | Current | Status |
|-----------|---------|--------|
| `@bhavya/shared` | `shared` | ✅ Integrated |
| `@bhavya/types` | `types` | ✅ Re-exports from shared |
| `@bhavya/kernel` | `kernel` | ✅ BRP-specific only |
| `@bhavya/knowledge-graph` | `knowledge-graph` | ✅ Integrated |
| `@bhavya/mission-runtime` | `mission-runtime` | ✅ Integrated |
| `@bhavya/runtime` | `runtime` | ✅ Engine pipeline |
| `@bhavya/platform-ui` | `platform-ui` | ✅ Canonical UI |
| `@bhavya/design-system` | `design-system` | ✅ Integrated |
| `@bhavya/content-core` | `content-core` | ✅ Content pipeline |
| `@bhavya/intelligence` | `intelligence` | ⚠️ Empty package |
| `@bhavya/project-runtime` | `project-runtime` | ⚠️ Empty package |
| `@bhavya/constitution` | `constitution` | ✅ Docs only |

---

## Deprecated Packages (2)

| Package | Replacement | Status |
|---------|------------|--------|
| `@bhavya/ui` | `@bhavya/platform-ui` | ⚠️ Stale — all consumers migrated |
| `@bhavya/bdl` | `@bhavya/design-system` | ⚠️ Stale — all consumers migrated |

---

## Violations Found: 0

- ✅ No circular dependencies
- ✅ No deprecated package imports
- ✅ All dependencies point downward in layer hierarchy
- ✅ Root packages: shared, platform-ui, design-system, content-core, intelligence, project-runtime

---

## Stale Worktrees (Cleanup Recommended)

`.worktrees/` contains 7 worktree copies with outdated `@bhavya/ui` references. These should be cleaned:
```bash
git worktree prune
```

---

## Recommendations

1. **Delete deprecated packages** — `@bhavya/ui` and `@bhavya/bdl` have zero consumers. Safe to remove.
2. **Clean worktrees** — `git worktree prune` to remove stale copies.
3. **Populate empty packages** — `intelligence` and `project-runtime` have no dependencies, suggesting they may be stubs. Consider merging into shared or content-core.
