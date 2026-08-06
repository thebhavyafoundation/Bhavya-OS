# Bhavya Foundation — Repository Audit

**Date:** 2026-08-06
**Auditor:** Bhavya OS Constitution Process
**Scope:** Complete repository — every app, package, component, route, service, schema, and document

---

## 1. Repository Overview

| Metric             | Value                                          |
| ------------------ | ---------------------------------------------- |
| Total apps         | 23                                             |
| Total packages     | 54 (50 with package.json, 4 empty/placeholder) |
| Total routes       | 175+                                           |
| Total source files | 800+                                           |
| Total docs files   | 200+                                           |
| Git status         | Active development                             |
| Package manager    | pnpm 10.17.1                                   |
| Node requirement   | >=20.9.0                                       |
| Build system       | Turborepo 2.5.6                                |
| Framework          | Next.js 15.x, React 19.x, Tailwind CSS 4.x     |

---

## 2. Application Inventory

### 2.1 Active Applications (5)

| App                | Port | Files | Routes | Status                      |
| ------------------ | ---- | ----- | ------ | --------------------------- |
| `ai-institute`     | 3030 | 37    | 15     | Active — AI University v2.0 |
| `github-os`        | 3070 | 65    | 22     | Active — Maintenance mode   |
| `knowledge-studio` | 3030 | 114   | 9      | Active — Largest app        |
| `transparency`     | 3003 | 18    | 5      | Active — Today              |
| `website`          | 3000 | 94    | 20     | Active — Most mature config |

### 2.2 Moderately Active (6)

| App                           | Port | Files | Routes | Status                       |
| ----------------------------- | ---- | ----- | ------ | ---------------------------- |
| `bhavya-ai-lab`               | 3012 | 69    | 18     | Moderate — 6 days ago        |
| `bhavya-intelligence-network` | 3050 | 9     | 1      | Moderate — Stub              |
| `capability-center`           | 3041 | 6     | 1      | Moderate — Stub              |
| `ioc`                         | 3090 | 39    | 10     | Moderate — 1 day ago         |
| `social-os`                   | 3080 | 32    | 3      | Moderate — 1 day ago         |
| `lesson-studio`               | 3020 | 33    | 15     | Active — Primary mission app |

### 2.3 Dormant Applications (12)

| App                        | Port | Files | Routes | Last Active |
| -------------------------- | ---- | ----- | ------ | ----------- |
| `admin`                    | 3003 | 27    | 5      | 13+ days    |
| `dashboard`                | 3010 | 25    | 12     | 7+ days     |
| `design-system`            | 3010 | 20    | 7      | 13+ days    |
| `docs`                     | 3002 | 21    | 8      | 13+ days    |
| `forest`                   | 3004 | 28    | 8      | 7+ days     |
| `heritage`                 | 3005 | 26    | 7      | 7+ days     |
| `knowledge`                | 3007 | 36    | 9      | 8+ days     |
| `library`                  | 3008 | 20    | 6      | 8+ days     |
| `open-source-intelligence` | 3040 | 7     | 1      | Stub        |
| `research`                 | 3009 | 20    | 3      | 8+ days     |
| `volunteer`                | 3006 | 27    | 8      | 7+ days     |
| `github-intelligence-lab`  | 3060 | 12    | 1      | Stub        |

### 2.4 Port Conflicts (CRITICAL)

| Port | Conflicting Apps                    |
| ---- | ----------------------------------- |
| 3003 | `admin` ↔ `transparency`            |
| 3010 | `dashboard` ↔ `design-system`       |
| 3030 | `ai-institute` ↔ `knowledge-studio` |

---

## 3. Package Inventory

### 3.1 Package Categories

| Category             | Count | Packages                                                                                                                                                         |
| -------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core/Runtime         | 3     | `kernel` (3.1.0), `runtime` (0.1.0), `constitution` (1.0.0)                                                                                                      |
| OSIP (Intelligence)  | 8     | `intelligence`, `analyzers`, `browser-automation`, `capability-registry`, `crawlers`, `github-intelligence`, `mcp-manager`, `technology-radar`, `plugin-manager` |
| Kernel Sub-Engines   | 7     | `agent-engine`, `workflow-engine`, `memory-engine`, `knowledge-engine`, `search-engine`, `planner-engine`, `scheduler-engine`                                    |
| Runtimes             | 4     | `mission-runtime`, `learning-runtime`, `impact-runtime`, `project-runtime`                                                                                       |
| UI/Design System     | 6     | `platform-ui`, `bdl`, `ui`, `charts`, `icons`, `maps`                                                                                                            |
| Core Utilities       | 5     | `platform`, `types`, `security`, `events`, `database`                                                                                                            |
| Content/Intelligence | 4     | `ai`, `content-core`, `knowledge-extraction`, `intelligence`                                                                                                     |
| Tools/CLI            | 3     | `cli`, `bee`, `runtime/cli`                                                                                                                                      |
| Config               | 4     | `config`, `eslint`, `typescript`, `branding`                                                                                                                     |
| API/SDK              | 3     | `api`, `sdk`, `providers`                                                                                                                                        |
| Workflows            | 1     | `workflows`                                                                                                                                                      |
| Notifications        | 1     | `notifications`                                                                                                                                                  |
| Docs                 | 1     | `docs`                                                                                                                                                           |
| Empty/Placeholder    | 3     | `auth` (empty), `bar`, `bdx`                                                                                                                                     |

### 3.2 Most-Used Workspace Packages

| Package                | Consumed By |
| ---------------------- | ----------- |
| `@bhavya/eslint`       | 8 apps      |
| `@bhavya/typescript`   | 8 apps      |
| `@bhavya/platform-ui`  | 7 apps      |
| `@bhavya/content-core` | 7 apps      |
| `@bhavya/ui`           | 6 apps      |
| `@bhavya/platform`     | 6 apps      |
| `@bhavya/intelligence` | 5 apps      |

---

## 4. Critical Duplicates

### DUPLICATE 1: Three UI Component Systems (SEVERITY: CRITICAL)

| Package               | Components         | Styling                       | Status               |
| --------------------- | ------------------ | ----------------------------- | -------------------- |
| `@bhavya/bdl`         | 19 primitives      | CSS class-based + tokens.json | Mature, tested       |
| `@bhavya/platform-ui` | 17 components      | Tailwind CSS + tokens.css     | Active, used by apps |
| `@bhavya/ui`          | 0 (re-exports BDL) | Delegates to BDL              | Stub                 |

**Overlapping components:** Button, Avatar, Badge, Card, Spinner, Sidebar — two entirely different implementations with different APIs.

### DUPLICATE 2: Three Workflow Systems (SEVERITY: CRITICAL)

| Location                                         | Types Defined                                           |
| ------------------------------------------------ | ------------------------------------------------------- |
| `@bhavya/types/src/workflow.ts`                  | Canonical `Workflow`, `WorkflowStep`, `WorkflowTrigger` |
| `@bhavya/kernel/src/types/index.ts`              | Redefines same types (incompatible)                     |
| `@bhavya/runtime/src/engines/workflow-engine.ts` | Redefines again (598 lines, different shapes)           |

`Workflow` interface has at least 3 incompatible definitions. `createdAt` is `string` in some, `Date` in others.

### DUPLICATE 3: Four Memory Engine Implementations (SEVERITY: HIGH)

| Location                                       | Lines                                 |
| ---------------------------------------------- | ------------------------------------- |
| `@bhavya/kernel/src/memory/`                   | Kernel MemoryEngine                   |
| `@bhavya/memory-engine/`                       | Dedicated package (depends on kernel) |
| `@bhavya/runtime/src/engines/memory-engine.ts` | 516-line standalone                   |
| `@bhavya/mission-runtime/src/memory/`          | Mission-level module                  |

### DUPLICATE 4: Three KnowledgePackage Interfaces (SEVERITY: HIGH)

| Location                             | Semantics                                       |
| ------------------------------------ | ----------------------------------------------- |
| `@bhavya/types/src/knowledge.ts`     | Educational content (lesson, assessment, video) |
| `@bhavya/intelligence/src/types.ts`  | OSIP item (analysis, recommendation, radar)     |
| `@bhavya/project-runtime/src/types/` | Project learning package                        |

Completely different shapes and semantics sharing the same name.

### DUPLICATE 5: Four Event System Implementations (SEVERITY: HIGH)

| Location                                   | Fields                            |
| ------------------------------------------ | --------------------------------- |
| `@bhavya/types/src/events.ts`              | `BhavyaEvent` — 13 fields         |
| `@bhavya/mission-runtime/src/events/`      | `BhavyaEvent` — 5 fields          |
| `@bhavya/runtime/src/engines/event-bus.ts` | `Event` — different type entirely |
| `@bhavya/kernel/src/types/`                | `Event` — yet another definition  |

### DUPLICATE 6: Two Design Token Systems (SEVERITY: MEDIUM)

| Location                                    | Theme                                 | Fonts                |
| ------------------------------------------- | ------------------------------------- | -------------------- |
| `@bhavya/bdl/tokens/tokens.json`            | Warm institutional (#F6F2E7, #173D2E) | Inter/Fraunces       |
| `@bhavya/platform-ui/src/styles/tokens.css` | Dark tech (#0a0a0a, #3b82f6)          | Inter/JetBrains Mono |

Two completely different color palettes and font stacks.

### DUPLICATE 7: bhavya-ai-lab in Three Locations (SEVERITY: HIGH)

| Location                   | Contents                                                          |
| -------------------------- | ----------------------------------------------------------------- |
| `/bhavya-ai-lab/` (root)   | Full standalone project — 45 dirs, own package.json, node_modules |
| `/packages/bhavya-ai-lab/` | Only `data/` directory                                            |
| `/apps/bhavya-ai-lab/`     | Another app entry                                                 |

### DUPLICATE 8: Runtime Engines vs Kernel (SEVERITY: HIGH)

`@bhavya/runtime/src/engines/` defines 10 standalone engines. `@bhavya/kernel` has its own implementations for memory, events, workflow, and knowledge. Parallel implementations of the same concepts.

---

## 5. Architecture Violations

### 5.1 Circular Dependency

`agent-engine` depends on `kernel`, and `kernel` depends on `agent-engine`. This creates a circular dependency chain visible in broken node_modules symlinks.

### 5.2 `ignoreBuildErrors: true`

Used in 3 apps (`github-os`, `knowledge-studio`, `lesson-studio`) — masks TypeScript errors, allowing broken code to build.

### 5.3 Mixed Framework Versions

| Version                  | Apps            |
| ------------------------ | --------------- |
| Next.js 15.5.20 (pinned) | 12 apps         |
| Next.js ^15.5.20 (range) | 9 apps          |
| Next.js 15.3.3 (older)   | `ai-institute`  |
| Next.js ^15.0.0 (oldest) | `design-system` |

### 5.4 No Root tsconfig.json

Only `tsconfig.base.json` exists. Each app has its own config, leading to inconsistent TypeScript settings.

### 5.5 Top-Level Directory Sprawl

120+ entries at root including dot-directories for AI tooling (`.ai`, `.agents`, `.analytics`, `.codex`, `.memory`, `.metrics`, etc.). Many are redundant or overlapping.

---

## 6. Dead Code & Technical Debt

### 6.1 TODO Comments (60+)

| Location                                       | Count | Examples                                                  |
| ---------------------------------------------- | ----- | --------------------------------------------------------- |
| `apps/ai-institute/src/data/course.ts`         | 4     | `// TODO: Call AI API`, `// TODO: Add assistant response` |
| `apps/ai-institute/src/components/assessment/` | 1     | `// TODO: Implement semantic search`                      |
| `packages/content-core/src/scaffold.ts`        | 2     | `// TODO: Implement GET /api/...`                         |
| `openhuman/`                                   | 60+   | Mostly in test files                                      |

### 6.2 Stub Packages

| Package | Status                                                 |
| ------- | ------------------------------------------------------ |
| `auth/` | Completely empty — no package.json, no source          |
| `bar/`  | No package.json — only state files                     |
| `bdx/`  | No package.json — CLI tooling without formal packaging |

### 6.3 Stub Documentation

| File                         | Status                            |
| ---------------------------- | --------------------------------- |
| `governance/constitution.md` | "Drafting in progress." (3 lines) |
| `governance/architecture.md` | One-line placeholder              |
| `specs/data-model.md`        | Just "# Data Model"               |
| `specs/product.md`           | Points to PRD                     |

### 6.4 Broken node_modules

`packages/agent-engine/node_modules/` contains deeply nested circular symlinks with broken path references — indicating a problematic installation.

### 6.5 Leftover Test Artifacts

Root contains `__test_io_dir__`, `__test_io_json__`, `__test_io_list__`, `__test_output__` directories — appear to be leftover test artifacts.

---

## 7. Documentation Inventory

### 7.1 Strategic Documents (33 found)

| Document                                  | Lines | Status                   |
| ----------------------------------------- | ----- | ------------------------ |
| `ARCHITECTURE_OVERVIEW.md`                | 308   | Substantive              |
| `docs/ai-institute/VISION.md`             | 92    | Substantive              |
| `docs/brand/BRAND_GUIDE.md`               | 172   | Substantive              |
| `docs/institution-os/VISION.md`           | 98    | Substantive              |
| `docs/github-os/VISION.md`                | 75    | Substantive              |
| `docs/social-os/VISION.md`                | 42    | Substantive              |
| `docs/ai-institute/ROADMAP.md`            | 221   | Substantive              |
| `docs/curriculum-intelligence/VISION.md`  | 103   | Substantive              |
| `docs/production/MISSION_VALIDATION.md`   | 520   | Substantive              |
| `bhavya-ai-lab/ARCHITECTURE.md`           | 1198  | Most detailed            |
| `docs/github-os/ROADMAP.md`               | 259   | Substantive              |
| `docs/curriculum-intelligence/ROADMAP.md` | 223   | Substantive              |
| `docs/MIGRATION-PLAN.md`                  | 409   | 17-phase plan            |
| `AGENTS.md`                               | 174   | Engineering constitution |

### 7.2 Governance Documents (26 files in `/governance/`)

Key files: `constitution.md` (STUB), `architecture.md` (STUB), `coding-standards.md`, `decision-framework.md`, `design-language.md`, `quality-governance.md`, `release-governance.md`, `security-governance.md`

### 7.3 Standards Documents (21 files in `/standards/`)

Cover: accessibility, api, architecture, backend, database, design, documentation, engineering, frontend, git, observability, performance, release, security, testing

### 7.4 Specs (8 files in `/specs/`)

Most are stubs: `data-model.md` (1 line), `product.md` (3 lines). `SKILL-ARCHITECTURE.md` is substantive.

---

## 8. Summary of Critical Issues

### Must Fix Before Constitutional Reorganization

1. **Three UI systems** — `bdl`, `platform-ui`, `ui` must be consolidated into one
2. **Three+ workflow type definitions** — Incompatible shapes must be unified
3. **Four memory engines** — Must be consolidated
4. **Three KnowledgePackage interfaces** — Must be unified
5. **Four event systems** — Must be consolidated
6. **Two design token systems** — Must be unified
7. **Circular dependency** — `agent-engine` ↔ `kernel`
8. **Port conflicts** — 3 port collisions
9. **Stub packages** — `auth`, `bar`, `bdx` must be completed or removed
10. **Stub docs** — `governance/constitution.md`, `specs/data-model.md` must be written

### Architectural Debt

1. `ignoreBuildErrors: true` in 3 apps
2. Mixed Next.js versions (15.0.0 to 15.5.20)
3. No root tsconfig.json
4. 120+ root directory entries
5. Broken node_modules in `agent-engine`
6. Leftover test artifacts at root
7. bhavya-ai-lab in 3 locations
8. Runtime engines duplicating kernel functionality

---

## 9. Recommendations

### Immediate (Week 1)

1. **Consolidate UI** — Choose one system (`platform-ui` is most used), deprecate others
2. **Unify types** — Single source of truth in `@bhavya/types`, all packages import from there
3. **Fix port conflicts** — Assign unique ports per app
4. **Remove stubs** — Complete or delete empty packages and docs
5. **Fix circular dependency** — Break `agent-engine` ↔ `kernel` cycle

### Short-term (Weeks 2-4)

6. **Consolidate memory engines** — One canonical implementation
7. **Consolidate event systems** — One canonical EventBus
8. **Consolidate workflow systems** — One canonical WorkflowEngine
9. **Unify design tokens** — One token system, one theme
10. **Standardize Next.js version** — All apps on same version

### Medium-term (Months 2-3)

11. **Reduce root directory sprawl** — Move dot-directories under `.bhavya/`
12. **Consolidate bhavya-ai-lab** — One location, not three
13. **Write constitutional docs** — Fill in all stub documents
14. **Remove `ignoreBuildErrors`** — Fix actual TypeScript errors
15. **Add root tsconfig.json** — Reference from all apps

---

_This audit is the foundation for constitutional reorganization. Every subsequent phase references this document._
