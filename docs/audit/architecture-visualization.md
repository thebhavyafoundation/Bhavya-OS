# Bhavya OS — Architecture Visualization

**Date:** 2026-08-06
**Status:** Wave 3 Consolidation In Progress

---

## Current State (Post-Wave 3)

```
┌─────────────────────────────────────────────────────────────────┐
│                    BHAVYA OS ARCHITECTURE                        │
│                    (Post-Wave 3 Consolidation)                   │
└─────────────────────────────────────────────────────────────────┘

┌─── CANONICAL PACKAGES (Source of Truth) ────────────────────────┐
│                                                                 │
│  @bhavya/shared ─────────── All domain types (100+)             │
│       │                                                         │
│       ├── Workflow, WorkflowStep, WorkflowStatus                 │
│       ├── BhavyaEvent, EventHandler, EventPriority              │
│       ├── Memory, MemoryType, MemoryPriority                    │
│       ├── Goal, Plan, PlanStep, KPI, Milestone                  │
│       ├── Agent, Task, Permission, Schema, Artifact             │
│       ├── KnowledgePackage (= EducationalPackage)               │
│       ├── User, Session, AuthCredentials                         │
│       └── BaseEntity, EntityRelation, EntityType                 │
│                                                                 │
│  @bhavya/platform-ui ────── All UI components (19)              │
│       │                                                         │
│       ├── Button, Card, Badge, Avatar, Modal, Tabs              │
│       ├── DataTable, SearchBar, Sidebar, PageLayout              │
│       ├── Toast, Skeleton, Breadcrumb, EmptyState                │
│       └── tokens.css (Tailwind @theme variables)                 │
│                                                                 │
│  @bhavya/design-system ──── Types/tokens/accessibility           │
│       │                                                         │
│       ├── Component prop interfaces (17)                         │
│       ├── Light/dark theme tokens                                │
│       └── WCAG accessibility utilities                           │
│                                                                 │
│  @bhavya/knowledge-graph ── Graph schema (17 entity types)       │
│       │                                                         │
│       ├── Concept, Course, Project, Publication, Research        │
│       ├── Person, Institution, Tool, Technology, Forest          │
│       └── Graph traversal, cycle detection, validation           │
│                                                                 │
│  content-core ───────────── Content authoring pipeline           │
│       │                                                         │
│       ├── Validation, citation, version management               │
│       └── Review workflow, publish gates, quality scoring        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
        │
        │ imports from
        ▼
┌─── CONSUMER PACKAGES ──────────────────────────────────────────┐
│                                                                 │
│  @bhavya/kernel ──────────── Core runtime (BRP types)            │
│       │  imports from @bhavya/shared                             │
│       ├── ExecutionContext, IdempotencyKey (BRP-specific)        │
│       ├── SelfOrganizingEngine (SelfOrganizingAgent)             │
│       └── ⚠️  Circular dep with agent-engine (known issue)       │
│                                                                 │
│  @bhavya/runtime ─────────── 10 engines                          │
│       │  imports from @bhavya/shared                             │
│       ├── event-bus.ts (BhavyaEvent, EventBus)                   │
│       ├── workflow-engine.ts (Workflow, WorkflowStep)            │
│       ├── memory-engine.ts (Memory, MemoryType)                  │
│       ├── planning-engine.ts (Goal, Plan, KPI)                   │
│       ├── decision-engine, research-engine, reasoning-engine     │
│       ├── self-improvement-engine, governance-engine             │
│       └── knowledge-graph.ts                                     │
│                                                                 │
│  @bhavya/types ───────────── Re-exports from @bhavya/shared      │
│       │  (backward compatibility barrel)                         │
│       └── 10 old files deleted, barrel rewritten                 │
│                                                                 │
│  @bhavya/mission-runtime ─── BhavyaEvent from @bhavya/shared     │
│  @bhavya/intelligence ────── TechnologyKnowledgePackage (renamed) │
│  @bhavya/project-runtime ─── ProjectKnowledgePackage (renamed)   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
        │
        │ used by
        ▼
┌─── APPS ────────────────────────────────────────────────────────┐
│                                                                 │
│  AI INSTITUTE (apps/ai-institute/)                               │
│       │  imports from @bhavya/platform-ui                        │
│       ├── Knowledge Browser, Concept Pages                       │
│       ├── Learning Paths, Simulations, Playground                 │
│       ├── Assessment, Tutor, Search, Progress                    │
│       └── Research, Projects, Impact                             │
│                                                                 │
│  GITHUB OS (apps/github-os/)                                     │
│       │  imports from @bhavya/platform-ui                        │
│       ├── Repository Intelligence                                │
│       ├── Knowledge Management                                   │
│       └── Learning System                                        │
│                                                                 │
│  KNOWLEDGE STUDIO (apps/knowledge-studio/)                       │
│       │  imports from @bhavya/platform-ui                        │
│       ├── Knowledge Object Editor                                │
│       ├── Pipeline Execution                                     │
│       └── Artifact Management                                    │
│                                                                 │
│  + 20 more apps (website, social-os, forest, heritage, etc.)     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─── DEPRECATED ──────────────────────────────────────────────────┐
│                                                                 │
│  @bhavya/bdl ──── 19 CSS-class primitives                       │
│       └── DEPRECATED: Use @bhavya/platform-ui                   │
│                                                                 │
│  @bhavya/ui ───── Dead bridge package                           │
│       └── DEPRECATED: Use @bhavya/platform-ui                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─── TOOLING ─────────────────────────────────────────────────────┐
│                                                                 │
│  scripts/enforce-deps.mjs ── Dependency violation checker        │
│  scripts/quality-gates.mjs ─ Architectural integrity gates       │
│  docs/constitution/ ──────── 10 governance documents             │
│  docs/audit/ ─────────────── Repository audit + redesign plan    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Type Flow Diagram

```
@bhavya/shared (canonical)
    │
    ├──→ @bhavya/kernel (imports + BRP extensions)
    │        │
    │        └──→ ⚠️  @bhavya/agent-engine (circular dep)
    │
    ├──→ @bhavya/runtime (imports + engine extensions)
    │        ├── event-bus.ts
    │        ├── workflow-engine.ts
    │        ├── memory-engine.ts
    │        └── planning-engine.ts
    │
    ├──→ @bhavya/types (re-export barrel)
    │        └──→ any legacy consumer
    │
    ├──→ @bhavya/mission-runtime
    ├──→ @bhavya/intelligence
    ├──→ @bhavya/project-runtime
    └──→ @bhavya/knowledge-graph
```

---

## Dependency Rules

```
FORBIDDEN:
  * → @bhavya/bdl     (DEPRECATED)
  * → @bhavya/ui      (DEPRECATED)

REQUIRED:
  All domain types → @bhavya/shared
  All UI components → @bhavya/platform-ui
  All design tokens → @bhavya/design-system
```

---

## Quality Gates Status

```
PASS  Shared package has 50+ types
PASS  No duplicate type definitions
PASS  No deprecated package imports
FAIL  No circular dependencies (kernel ↔ agent-engine)
PASS  Constitution docs exist

Score: 4/5 (80%)
```

---

*Generated by Wave 3 consolidation process.*
