# Dependency Graph

**Generated:** 2026-08-06 02:40 IST

---

## Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        BHAVYA OS (Root)                             │
│                    pnpm-workspace.yaml                              │
│                    turbo.json (build orchestrator)                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────── PLATFORMS ───────────────────────┐       │
│  │ platform        (core utilities: fs, id, validation)    │       │
│  │ types           (shared type definitions)               │       │
│  │ events          (event bus system)                      │       │
│  │ security        (auth, rate-limit, crypto)              │       │
│  │ database        (sqlite, migration, repository)         │       │
│  └─────────────────────────────────────────────────────────┘       │
│                              │                                      │
│  ┌─────────────────────── ENGINES ─────────────────────────┐       │
│  │ kernel (v3.1.0)  ← orchestrates all engines             │       │
│  │   ├── agent-engine                                       │       │
│  │   ├── workflow-engine                                    │       │
│  │   ├── memory-engine                                      │       │
│  │   ├── knowledge-engine                                   │       │
│  │   ├── search-engine                                      │       │
│  │   ├── planner-engine                                     │       │
│  │   └── scheduler-engine                                   │       │
│  └─────────────────────────────────────────────────────────┘       │
│                              │                                      │
│  ┌─────────────────── INTELLIGENCE LAYER ──────────────────┐       │
│  │ intelligence    (core intelligence abstractions)         │       │
│  │ capability-registry                                      │       │
│  │ github-intelligence                                      │       │
│  │ knowledge-extraction                                     │       │
│  │ technology-radar                                         │       │
│  │ mcp-manager                                              │       │
│  │ plugin-manager                                           │       │
│  │ browser-automation                                       │       │
│  │ crawlers                                                 │       │
│  │ analyzers                                                │       │
│  └─────────────────────────────────────────────────────────┘       │
│                              │                                      │
│  ┌─────────────────── UI / SHARED ─────────────────────────┐       │
│  │ ui → bdl ( Bhavya Design Language)                      │       │
│  │ platform-ui (components, layouts, hooks, styles)         │       │
│  │ branding                                                 │       │
│  │ icons                                                    │       │
│  │ charts → ui                                              │       │
│  │ maps → ui                                                │       │
│  │ docs → ui                                                │       │
│  └─────────────────────────────────────────────────────────┘       │
│                              │                                      │
│  ┌─────────────────── RUNTIME / SDK ───────────────────────┐       │
│  │ mission-runtime (v0.6.0) — 17 module exports            │       │
│  │ sdk → mission-runtime                                    │       │
│  │ runtime (v0.1.0) — 6 module exports                     │       │
│  │ bee → runtime                                            │       │
│  │ content-core (v0.6.0) — content management               │       │
│  │ constitution (v1.0.0) — governance SDK                   │       │
│  └─────────────────────────────────────────────────────────┘       │
│                              │                                      │
│  ┌─────────────────── APPLICATIONS ────────────────────────┐       │
│  │                                                          │       │
│  │  PUBLIC-FACING:                                          │       │
│  │  website (v0.9.0)    → mission-runtime, sdk, ui         │       │
│  │  forest (v0.7.0)     → content-core, maps, mission-r,ui │       │
│  │  heritage (v0.8.0)   → content-core, ui                 │       │
│  │  volunteer (v0.9.0)  → content-core, ui                 │       │
│  │                                                          │       │
│  │  KNOWLEDGE / CONTENT:                                    │       │
│  │  knowledge (v0.6.0)  → content-core, intelligence,      │       │
│  │                         mission-runtime, ui              │       │
│  │  library (v0.6.0)    → content-core                     │       │
│  │  research (v0.6.0)   → content-core                     │       │
│  │  lesson-studio (v0.1) → (none — standalone)             │       │
│  │  knowledge-studio    → (none — standalone)              │       │
│  │                                                          │       │
│  │  INTELLIGENCE:                                           │       │
│  │  github-os (v0.1.0)  → events, platform, platform-ui,  │       │
│  │                         types                            │       │
│  │  bhavya-intelligence-network → 14 packages               │       │
│  │  open-source-intelligence → 11 packages                  │       │
│  │  github-intelligence-lab → 9 packages                    │       │
│  │  capability-center → 6 packages                          │       │
│  │                                                          │       │
│  │  OPERATIONS:                                             │       │
│  │  dashboard (v0.1.0)  → content-core, intelligence, ui   │       │
│  │  admin (v0.1.0)      → mission-runtime, sdk             │       │
│  │  ioc (v0.1.0)        → (none — standalone)              │       │
│  │  social-os (v0.1.0)  → events, platform, platform-ui,  │       │
│  │                         types                            │       │
│  │                                                          │       │
│  │  DOCUMENTATION:                                          │       │
│  │  docs (v0.9.0)       → mission-runtime, sdk             │       │
│  │  design-system (v0.9) → (none — standalone)             │       │
│  │  transparency (v0.1)  → (none — standalone)             │       │
│  │                                                          │       │
│  │  AI / EDUCATION:                                         │       │
│  │  ai-institute (v0.1)  → platform-ui, learning-runtime,  │       │
│  │                         project-runtime, impact-runtime  │       │
│  │  bhavya-ai-lab (v0.1) → (none — standalone)             │       │
│  └─────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Critical Dependency Chains

### Chain 1: Platform Core

```
types → platform → events → security → database
```

### Chain 2: Kernel Engine System

```
kernel → agent-engine
       → workflow-engine
       → memory-engine
       → knowledge-engine
       → search-engine
       → planner-engine
       → scheduler-engine
```

### Chain 3: Intelligence Layer

```
intelligence → capability-registry → github-intelligence
                                  → knowledge-extraction
                                  → technology-radar
                                  → mcp-manager
                                  → plugin-manager
```

### Chain 4: UI System

```
bdl → ui → charts
          → maps
          → docs
platform-ui (standalone, uses React primitives)
```

### Chain 5: Content Pipeline

```
content-core → knowledge
             → library
             → research
             → forest
             → heritage
             → volunteer
             → dashboard
```

### Chain 6: Mission Runtime

```
mission-runtime → sdk → website
                     → admin
                     → docs
```

---

## Circular Dependencies

**None detected.** All dependency flows are unidirectional.

---

## Orphaned Projects

Projects with NO dependents (nothing imports from them):

| Package             | Evidence                           |
| ------------------- | ---------------------------------- |
| agent-platform      | Not imported by any app or package |
| bhavya-ai-lab (pkg) | Empty directory                    |
| learning-runtime    | Only imported by ai-institute      |
| project-runtime     | Only imported by ai-institute      |
| impact-runtime      | Only imported by ai-institute      |

---

## Duplicate Projects

| Name          | Location 1              | Location 2                        | Issue                     |
| ------------- | ----------------------- | --------------------------------- | ------------------------- |
| bhavya-ai-lab | `apps/bhavya-ai-lab/`   | `packages/bhavya-ai-lab/` (empty) | Empty package dir         |
| website       | `apps/website/`         | `website/` (root, Astro)          | Two different tech stacks |
| bar           | `packages/bar/` (empty) | `bar/` (root, JSON registry)      | Different purposes        |

---

## Most-Depended-On Packages

| Package             | Depended on by (count) | Consumers                                                                                                                                                         |
| ------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| platform            | 10                     | events, security, api, ai, capability-registry, crawlers, knowledge-extraction, mcp-manager, plugin-manager, github-intelligence                                  |
| intelligence        | 10                     | analyzers, browser-automation, capability-registry, crawlers, github-intelligence, knowledge-extraction, mcp-manager, plugin-manager, technology-radar, dashboard |
| types               | 6                      | ai, events, notifications, providers, social-os, github-os                                                                                                        |
| ui                  | 7                      | charts, maps, docs, forest, heritage, knowledge, volunteer                                                                                                        |
| kernel              | 7                      | agent-engine, workflow-engine, memory-engine, knowledge-engine, search-engine, planner-engine, scheduler-engine, cli                                              |
| content-core        | 7                      | dashboard, forest, heritage, knowledge, library, research, volunteer                                                                                              |
| capability-registry | 6                      | analyzers, github-intelligence, knowledge-extraction, mcp-manager, plugin-manager, technology-radar                                                               |
| mission-runtime     | 4                      | sdk, website, admin, docs, forest, knowledge                                                                                                                      |
