# Bhavya OS — Architecture Redesign Plan

**Date:** 2026-08-06
**Status:** Approved — Constitutional Reorganization
**Supersedes:** `docs/MIGRATION-PLAN.md` (v1.0, 2026-07-27)
**Constitutional Authority:** `docs/constitution/08-ARCHITECTURE.md`

---

## 1. Current State Summary

From the repository audit (`docs/audit/repository-audit.md`):

| Metric                 | Current                        | Target              |
| ---------------------- | ------------------------------ | ------------------- |
| Apps                   | 23 (12 dormant, 4 stubs)       | 8 domain apps       |
| Packages               | 54 (3 empty, 8+ duplicated)    | 12 unified packages |
| UI systems             | 3 (`bdl`, `platform-ui`, `ui`) | 1 (`platform-ui`)   |
| Workflow engines       | 3                              | 1                   |
| Memory engines         | 4                              | 1                   |
| Event systems          | 4                              | 1                   |
| KnowledgePackage types | 3                              | 1                   |
| Design token systems   | 2                              | 1                   |
| Port conflicts         | 3                              | 0                   |
| Root directory entries | 120+                           | ~30                 |

---

## 2. Target Architecture

### 2.1 Repository Structure

```
bhavya-foundation/
├── apps/                          # Domain applications (8)
│   ├── foundation-os/             # Public website + transparency (port 3000)
│   ├── knowledge-os/              # Knowledge platform + AI University (port 3020)
│   ├── forest-os/                 # Forest management + GIS (port 3004)
│   ├── heritage-os/               # Heritage conservation (port 3005)
│   ├── volunteer-os/              # Volunteer management (port 3006)
│   ├── grants-os/                 # Grants + donations (port 3007)
│   ├── impact-os/                 # Impact measurement (port 3008)
│   └── admin-os/                  # Internal administration (port 3003)
│
├── packages/                      # Shared packages (12)
│   ├── platform-ui/               # Canonical UI component library
│   ├── design-system/             # Design tokens + primitives
│   ├── content-core/              # Universal content engine
│   ├── knowledge-graph/           # Institutional knowledge graph
│   ├── ai-runtime/                # AI provider abstraction
│   ├── workflow-engine/           # Workflow execution
│   ├── auth/                      # Authentication + authorization
│   ├── analytics/                 # Event tracking + metrics
│   ├── search/                    # Full-text search
│   ├── storage/                   # File + data persistence
│   ├── shared/                    # Types, utils, config
│   └── sdk/                       # Public API SDK
│
├── docs/                          # Institutional knowledge
│   ├── constitution/              # 10 constitutional documents
│   ├── audit/                     # Repository audits
│   ├── architecture/              # ADRs + architecture docs
│   ├── governance/                # Governance policies
│   ├── standards/                 # Engineering standards
│   └── releases/                  # Release notes
│
├── content/                       # Structured content (JSON/MDX)
│   ├── knowledge/                 # Knowledge packages by domain
│   ├── curriculum/                # Learning paths + courses
│   ├── research/                  # Research papers + findings
│   └── templates/                 # Content templates
│
├── platform/                      # Platform infrastructure
│   ├── agents/                    # AI agent definitions
│   ├── workflows/                 # Executable workflows
│   ├── schemas/                   # JSON schemas
│   └── registry/                  # Machine-readable registries
│
├── scripts/                       # Build + deploy scripts
├── tests/                         # Cross-package test suites
│
├── .ai/                           # AI brain (constitution, mission)
├── .agents/                       # Autonomous worker definitions
├── .memory/                       # Institutional memory
├── .github/                       # GitHub config
│
├── package.json                   # Root workspace config
├── pnpm-workspace.yaml            # Workspace definition
├── tsconfig.json                  # Root TypeScript config
├── turbo.json                     # Turborepo pipeline
├── AGENTS.md                      # Engineering constitution
└── README.md                      # Repository overview
```

### 2.2 App Consolidation Map

| Current App                   | → Target App               | Action                    |
| ----------------------------- | -------------------------- | ------------------------- |
| `website`                     | `foundation-os`            | Merge with transparency   |
| `transparency`                | `foundation-os`            | Merge into website        |
| `ai-institute`                | `knowledge-os`             | Merge with lesson-studio  |
| `lesson-studio`               | `knowledge-os`             | Merge with ai-institute   |
| `knowledge-studio`            | `knowledge-os`             | Merge (largest app)       |
| `bhavya-ai-lab`               | `knowledge-os`             | Merge data + tools        |
| `forest`                      | `forest-os`                | Keep, consolidate         |
| `heritage`                    | `heritage-os`              | Keep, consolidate         |
| `volunteer`                   | `volunteer-os`             | Keep, consolidate         |
| `library`                     | `grants-os`                | Repurpose as grants       |
| `research`                    | `impact-os`                | Merge into impact         |
| `dashboard`                   | `admin-os`                 | Merge into admin          |
| `admin`                       | `admin-os`                 | Keep, consolidate         |
| `docs`                        | `admin-os`                 | Merge into admin          |
| `design-system`               | `packages/design-system`   | Move to package           |
| `knowledge`                   | `packages/knowledge-graph` | Move to package           |
| `ioc`                         | `admin-os`                 | Merge into admin          |
| `social-os`                   | `admin-os`                 | Merge into admin          |
| `github-os`                   | DELETE                     | Maintenance mode, archive |
| `bhavya-intelligence-network` | DELETE                     | Stub, no value            |
| `capability-center`           | DELETE                     | Stub, no value            |
| `open-source-intelligence`    | DELETE                     | Stub, no value            |
| `github-intelligence-lab`     | DELETE                     | Stub, no value            |

### 2.3 Package Consolidation Map

| Current Packages                                                                                                                                                                                  | → Target Package             | Action                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ---------------------------------- |
| `platform-ui` + `bdl` + `ui` + `charts` + `icons` + `maps`                                                                                                                                        | `platform-ui`                | Merge all UI into one              |
| `kernel` + `agent-engine` + `workflow-engine` + `memory-engine` + `knowledge-engine` + `search-engine` + `planner-engine` + `scheduler-engine`                                                    | `workflow-engine` + `shared` | Split kernel into focused packages |
| `runtime` + `mission-runtime`                                                                                                                                                                     | `content-core`               | Merge content-related runtimes     |
| `intelligence` + `analyzers` + `browser-automation` + `capability-registry` + `crawlers` + `github-intelligence` + `mcp-manager` + `plugin-manager` + `technology-radar` + `knowledge-extraction` | `ai-runtime`                 | Consolidate AI/intelligence        |
| `types` + `config` + `branding` + `eslint` + `typescript`                                                                                                                                         | `shared`                     | Merge config + types               |
| `events` + `workflows`                                                                                                                                                                            | `workflow-engine`            | Merge event + workflow             |
| `platform` + `database` + `security`                                                                                                                                                              | `storage` + `auth`           | Split into focused packages        |
| `learning-runtime` + `project-runtime` + `impact-runtime`                                                                                                                                         | `content-core`               | Merge domain runtimes              |
| `sdk` + `api` + `providers`                                                                                                                                                                       | `sdk`                        | Merge API layer                    |
| `bee` + `cli`                                                                                                                                                                                     | DELETE                       | Tooling, not packages              |
| `constitution`                                                                                                                                                                                    | `docs/constitution/`         | Move to docs                       |
| `notifications`                                                                                                                                                                                   | `analytics`                  | Merge into analytics               |
| `docs`                                                                                                                                                                                            | DELETE                       | Documentation, not a package       |
| `auth` (empty)                                                                                                                                                                                    | `auth`                       | Build or delete                    |
| `bar` (no pkg)                                                                                                                                                                                    | DELETE                       | Remove                             |
| `bdx` (no pkg)                                                                                                                                                                                    | DELETE                       | Remove                             |

### 2.4 Dependency Graph (Target)

```
apps/
  foundation-os ──→ platform-ui, content-core, sdk
  knowledge-os ───→ platform-ui, content-core, knowledge-graph, ai-runtime, sdk
  forest-os ──────→ platform-ui, content-core, storage, sdk
  heritage-os ────→ platform-ui, content-core, storage, sdk
  volunteer-os ───→ platform-ui, content-core, storage, sdk
  grants-os ──────→ platform-ui, content-core, storage, sdk
  impact-os ──────→ platform-ui, content-core, knowledge-graph, sdk
  admin-os ───────→ platform-ui, content-core, analytics, auth, sdk

packages/
  platform-ui ────→ design-system (tokens only)
  design-system ──→ (standalone)
  content-core ───→ knowledge-graph, shared
  knowledge-graph → shared
  ai-runtime ─────→ shared, storage
  workflow-engine → shared, storage
  auth ───────────→ shared, storage
  analytics ──────→ shared, storage
  search ─────────→ shared, storage
  storage ────────→ shared
  shared ─────────→ (standalone)
  sdk ────────────→ shared, content-core
```

**Dependency rules (constitutional):**

- Apps depend on packages, never on other apps
- Packages depend only on packages below them in the graph
- No circular dependencies
- `shared` has zero external dependencies
- `design-system` has zero external dependencies

---

## 3. Migration Plan

### Phase 1: Constitutional Foundation (Week 1)

| Task                                                | Priority | Risk | Effort   |
| --------------------------------------------------- | -------- | ---- | -------- |
| Create `docs/constitution/` (DONE)                  | Critical | None | Complete |
| Create `docs/audit/` (DONE)                         | Critical | None | Complete |
| Create `docs/audit/architecture-redesign.md` (THIS) | Critical | None | Complete |
| Assign unique ports to all apps                     | Critical | Low  | 1 hour   |
| Fix port conflicts (3003, 3010, 3030)               | Critical | Low  | 2 hours  |
| Remove stub packages (`bar`, `bdx`)                 | High     | Low  | 30 min   |
| Remove stub apps (4 intelligence stubs)             | High     | Low  | 1 hour   |

### Phase 2: UI Consolidation (Week 2)

| Task                                                   | Priority | Risk   | Effort   |
| ------------------------------------------------------ | -------- | ------ | -------- |
| Choose canonical UI system (`platform-ui`)             | Critical | None   | Decision |
| Migrate `bdl` primitives → `platform-ui`               | Critical | Medium | 3 days   |
| Migrate `ui` re-exports → `platform-ui`                | High     | Low    | 1 hour   |
| Merge `charts`, `icons`, `maps` into `platform-ui`     | High     | Medium | 1 day    |
| Unify design tokens (one system)                       | Critical | Medium | 1 day    |
| Update all app imports                                 | Critical | Low    | 2 hours  |
| Remove `bdl`, `ui`, `charts`, `icons`, `maps` packages | High     | Low    | 1 hour   |

### Phase 3: Type Unification (Week 2-3)

| Task                                         | Priority | Risk   | Effort  |
| -------------------------------------------- | -------- | ------ | ------- |
| Audit all `Workflow` type definitions        | Critical | None   | 2 hours |
| Unify `Workflow` in `shared` package         | Critical | Medium | 1 day   |
| Audit all `Event` type definitions           | Critical | None   | 2 hours |
| Unify `Event` in `shared` package            | Critical | Medium | 1 day   |
| Audit all `KnowledgePackage` definitions     | Critical | None   | 2 hours |
| Unify `KnowledgePackage` in `shared` package | Critical | Medium | 1 day   |
| Update all packages to import from `shared`  | Critical | Low    | 4 hours |

### Phase 4: Engine Consolidation (Week 3-4)

| Task                                                | Priority | Risk   | Effort |
| --------------------------------------------------- | -------- | ------ | ------ |
| Consolidate 4 memory engines → 1                    | High     | High   | 3 days |
| Consolidate 4 event systems → 1                     | High     | High   | 2 days |
| Consolidate 3 workflow engines → 1                  | High     | High   | 3 days |
| Break `agent-engine` ↔ `kernel` circular dependency | Critical | High   | 2 days |
| Merge `kernel` sub-engines into focused packages    | High     | Medium | 3 days |

### Phase 5: App Consolidation (Week 4-6)

| Task                                                                         | Priority | Risk   | Effort |
| ---------------------------------------------------------------------------- | -------- | ------ | ------ |
| Merge `website` + `transparency` → `foundation-os`                           | High     | Medium | 3 days |
| Merge `ai-institute` + `lesson-studio` + `knowledge-studio` → `knowledge-os` | Critical | High   | 5 days |
| Merge `forest` + GIS → `forest-os`                                           | Medium   | Medium | 2 days |
| Merge `heritage` → `heritage-os`                                             | Medium   | Low    | 1 day  |
| Merge `volunteer` → `volunteer-os`                                           | Medium   | Low    | 1 day  |
| Merge `library` + `research` → `grants-os` + `impact-os`                     | Medium   | Medium | 2 days |
| Merge `admin` + `docs` + `ioc` + `social-os` → `admin-os`                    | Medium   | Medium | 3 days |
| Delete dormant/stub apps (7 apps)                                            | High     | Low    | 1 hour |

### Phase 6: Package Restructuring (Week 6-8)

| Task                                                         | Priority | Risk   | Effort |
| ------------------------------------------------------------ | -------- | ------ | ------ |
| Create `shared` package (types + utils + config)             | Critical | Medium | 2 days |
| Create `auth` package (from `security` + `database`)         | High     | Medium | 2 days |
| Create `storage` package (from `platform` + `database`)      | High     | Medium | 1 day  |
| Create `analytics` package (from `events` + `notifications`) | High     | Medium | 1 day  |
| Create `search` package (from `search-engine`)               | Medium   | Low    | 1 day  |
| Merge `sdk` + `api` + `providers` → `sdk`                    | Medium   | Low    | 1 day  |
| Delete empty/unused packages                                 | High     | Low    | 1 hour |

---

## 4. Deliverables Checklist

| #   | Deliverable                        | Status             |
| --- | ---------------------------------- | ------------------ |
| 1   | Repository audit                   | ✅ Complete        |
| 2   | Architecture redesign plan         | ✅ This document   |
| 3   | Target architecture diagrams       | 📋 See Section 2   |
| 4   | Dependency graph                   | 📋 See Section 2.4 |
| 5   | Migration plan                     | 📋 See Section 3   |
| 6   | Prioritized implementation backlog | 📋 See Section 5   |
| 7   | Risk assessment                    | 📋 See Section 6   |
| 8   | Execution timeline                 | 📋 See Section 7   |

---

## 5. Prioritized Implementation Backlog

### P0 — Must Do First (Week 1)

1. Fix port conflicts
2. Remove stub packages and apps
3. Create constitutional docs (DONE)
4. Create architecture redesign plan (THIS)

### P1 — Critical Path (Weeks 2-3)

5. Consolidate UI systems → one `platform-ui`
6. Unify type definitions → one `shared` package
7. Fix circular dependency (`agent-engine` ↔ `kernel`)
8. Remove `ignoreBuildErrors: true` from 3 apps

### P2 — High Impact (Weeks 3-4)

9. Consolidate memory engines → 1
10. Consolidate event systems → 1
11. Consolidate workflow engines → 1
12. Merge `kernel` sub-engines into focused packages

### P3 — App Consolidation (Weeks 4-6)

13. Merge `ai-institute` + `lesson-studio` + `knowledge-studio` → `knowledge-os`
14. Merge `website` + `transparency` → `foundation-os`
15. Merge remaining apps into domain packages
16. Delete dormant/stub apps

### P4 — Package Restructuring (Weeks 6-8)

17. Create `shared` package
18. Create `auth` package
19. Create `storage` package
20. Create `analytics` package
21. Merge SDK packages

### P5 — Knowledge OS (Months 3-4)

22. Build universal content engine
23. Build institutional knowledge graph
24. Refactor AI University into Knowledge OS modules
25. Build multi-domain content pipeline

### P6 — Platform Hardening (Months 4-6)

26. Security audit + hardening
27. Performance optimization
28. Monitoring + observability
29. Documentation completion

---

## 6. Risk Assessment

| Risk                                       | Probability | Impact   | Mitigation                                               |
| ------------------------------------------ | ----------- | -------- | -------------------------------------------------------- |
| App merge breaks functionality             | High        | High     | Incremental merge, test after each                       |
| Type unification causes compile errors     | Medium      | Medium   | Fix errors incrementally, don't mass-rename              |
| UI migration breaks layouts                | Medium      | High     | Visual regression testing per page                       |
| Circular dependency fix breaks runtime     | High        | High     | Test kernel + agent-engine together                      |
| Data loss during consolidation             | Low         | Critical | Backup before every merge, git history                   |
| Developer confusion during transition      | Medium      | Medium   | Clear communication, migration guide                     |
| Scope creep (adding features during reorg) | High        | High     | Constitutional rule: no new features until consolidation |

---

## 7. Execution Timeline

```
Week 1:  Constitutional Foundation
         ├── Audit complete ✅
         ├── Constitution complete ✅
         ├── Architecture plan complete ✅
         └── Port fixes + stub removal

Week 2:  UI Consolidation
         ├── platform-ui becomes canonical
         ├── bdl/ui/charts/icons/maps merged
         └── Design tokens unified

Week 3:  Type Unification
         ├── shared package created
         ├── Workflow/Event/KnowledgePackage unified
         └── All packages import from shared

Week 4:  Engine Consolidation
         ├── Memory engines → 1
         ├── Event systems → 1
         ├── Workflow engines → 1
         └── Circular dependency fixed

Weeks 5-6: App Consolidation
         ├── knowledge-os created (ai-institute + lesson-studio + knowledge-studio)
         ├── foundation-os created (website + transparency)
         ├── Domain apps consolidated
         └── Dormant apps deleted

Weeks 7-8: Package Restructuring
         ├── auth, storage, analytics, search created
         ├── SDK consolidated
         └── Unused packages deleted

Months 3-4: Knowledge OS
         ├── Universal content engine
         ├── Institutional knowledge graph
         └── Multi-domain content pipeline

Months 5-6: Platform Hardening
         ├── Security audit
         ├── Performance optimization
         └── Documentation completion
```

---

## 8. Success Criteria

| Metric                   | Current | 30-Day Target | 90-Day Target |
| ------------------------ | ------- | ------------- | ------------- |
| Apps                     | 23      | 8             | 8             |
| Packages                 | 54      | 12            | 12            |
| UI systems               | 3       | 1             | 1             |
| Port conflicts           | 3       | 0             | 0             |
| Circular dependencies    | 1       | 0             | 0             |
| `ignoreBuildErrors`      | 3 apps  | 0             | 0             |
| Stub packages            | 3       | 0             | 0             |
| Root directory entries   | 120+    | ~30           | ~30           |
| Constitutional docs      | 0       | 10            | 10            |
| TypeScript strict errors | Unknown | 0             | 0             |

---

_This plan is the execution roadmap for constitutional reorganization. Every phase references the constitutional documents in `docs/constitution/`. No features are built until consolidation is complete._
