# Dependency Intelligence Report

**Generated:** 2026-08-07 | **Method:** Automated package.json scan | **Status:** LIVE

---

## Package Graph

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

## Runtime Graph

### Engine Pipeline

```
content-core
    ↓
[Validation] → [Citation] → [Versioning] → [Review] → [Publish]
    ↓
runtime (orchestrator)
    ↓
┌─────────────────────────────────────────────────────────┐
│  event-bus.ts        → BhavyaEvent, EventPriority       │
│  workflow-engine.ts  → WorkflowStatus, StepStatus       │
│  memory-engine.ts    → MemoryPriority, MemoryStatus     │
│  planning-engine.ts  → PlanStatus, GoalStatus, KPI      │
└─────────────────────────────────────────────────────────┘
    ↓
@bhavya/shared (canonical types)
```

### Event Flow

```
Agent → Event → EventBus → WorkflowEngine → TaskExecutor → Result
  ↓         ↓         ↓            ↓              ↓          ↓
agent-engine  shared  runtime     runtime        runtime    shared
```

---

## Package Map

### By Category

| Category | Packages | Count |
|----------|----------|-------|
| **Core** | shared, kernel, types | 3 |
| **Knowledge** | knowledge-graph, intelligence, project-runtime | 3 |
| **Runtime** | runtime, agent-engine, mission-runtime | 3 |
| **UI** | platform-ui, design-system, maps, charts, docs | 5 |
| **Content** | content-core | 1 |
| **Integration** | sdk | 1 |
| **Deprecated** | bdl, ui | 2 |
| **Tooling** | eslint, typescript | 2 |
| **Governance** | constitution | 1 |

### By Layer

| Layer | Packages | Purpose |
|-------|----------|---------|
| L0 | shared, platform-ui, design-system, content-core, intelligence, project-runtime, constitution, bdl | Foundation |
| L1 | kernel, types, knowledge-graph, agent-engine, mission-runtime, runtime, sdk, maps, charts, docs, ui | Services |
| L2 | website, forest, volunteer, dashboard, knowledge, heritage, github-os, social-os, ioc, knowledge-studio, lesson-studio, ai-university | Applications |
| T | eslint, typescript | Tooling |

---

## Layer Architecture

```
L2 (Apps)          website, forest, volunteer, dashboard, knowledge,
                   heritage, github-os, social-os, ioc, knowledge-studio,
                   lesson-studio, ai-university
                         ↓
L1 (Services)      kernel, types, knowledge-graph, agent-engine,
                   mission-runtime, runtime, sdk, maps, charts, docs
                         ↓
L0 (Foundation)    shared, platform-ui, design-system, content-core,
                   intelligence, project-runtime, constitution, bdl
                         ↓
T  (Tooling)       eslint, typescript
```

**Dependency Direction:** L2 → L1 → L0 ✅ (no upward dependencies)

---

## Circular Dependency Report

| Status | Description |
|--------|-------------|
| ✅ | No circular dependencies detected |
| ✅ | All dependency chains are acyclic |
| ✅ | kernel ↔ agent-engine cycle eliminated (2026-08-07) |

---

## Import Boundary Report

| Boundary | Status | Details |
|----------|--------|---------|
| L0 → L1 | ✅ | No L0 package imports from L1 |
| L0 → L2 | ✅ | No L0 package imports from L2 |
| L1 → L2 | ✅ | No L1 package imports from L2 |
| Deprecated imports | ✅ | Zero `@bhavya/ui` or `@bhavya/bdl` imports |
| Circular imports | ✅ | Zero circular imports |

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

| Package | Replacement | Consumers |
|---------|------------|-----------|
| `@bhavya/ui` | `@bhavya/platform-ui` | 0 (all migrated) |
| `@bhavya/bdl` | `@bhavya/design-system` | 0 (all migrated) |

---

## Violations Found: 0

- ✅ No circular dependencies
- ✅ No deprecated package imports
- ✅ All dependencies point downward in layer hierarchy
- ✅ Root packages: shared, platform-ui, design-system, content-core, intelligence, project-runtime
- ✅ Worktrees cleaned (18 stale copies removed)

---

## CI Automation

### Quality Gate Script

```bash
node scripts/quality-gates.mjs
```

**Gates:**
1. Shared package has 50+ types
2. No duplicate type definitions
3. No deprecated package imports
4. No circular dependencies
5. Constitution docs exist

### Dependency Enforcement Script

```bash
node scripts/enforce-deps.mjs
```

**Checks:**
- Forbidden dependency patterns
- Required dependency patterns
- Layer boundary violations

### Recommended CI Integration

```yaml
# .github/workflows/architecture.yml
name: Architecture Validation
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: node scripts/quality-gates.mjs
      - run: node scripts/enforce-deps.mjs
```

---

## Recommendations

1. **Delete deprecated packages** — `@bhavya/ui` and `@bhavya/bdl` have zero consumers. Safe to remove.
2. **Populate empty packages** — `intelligence` and `project-runtime` have no dependencies, suggesting they may be stubs. Consider merging into shared or content-core.
3. **Add CI automation** — Run quality gates on every PR to prevent architectural drift.
4. **Monitor layer violations** — Add pre-commit hooks to catch L0 → L1 imports.
