# Layer 2 — Context

**BICM Version:** 1.0.0  
**Purpose:** How to navigate this workspace  

## Context Resolution

Always resolve in this order:

1. **Layer 0** — Identity (IDENTITY.md)
2. **Layer 1** — Mission (MISSION.md)
3. **Layer 2** — Context (this file)
4. **Layer 3** — Knowledge (objects, graph, domains)
5. **Layer 4** — Factories (compilation pipelines)
6. **Layer 5** — Applications (output formats)
7. **Layer 6** — Runtime (execution state)
8. **Layer 7** — Memory (decisions, changelog, audit)

Nearest CONTEXT.md always overrides higher layers.

## Folder Map

```
bhavya-ai-lab/
├── layer-0-identity/        # WHO we are
├── layer-1-mission/         # WHY we exist
├── layer-2-context/         # HOW to navigate
├── layer-3-knowledge/       # WHAT we know (Knowledge Objects)
│   ├── objects/             # Atomic knowledge units
│   ├── graph/               # Relationships between objects
│   └── domains/             # Domain organization
├── layer-4-factories/       # HOW knowledge transforms
│   ├── lesson-factory/      # Knowledge → Lessons
│   ├── video-factory/       # Knowledge → Videos
│   ├── assessment-factory/  # Knowledge → Assessments
│   ├── pdf-factory/         # Knowledge → PDFs
│   ├── slides-factory/      # Knowledge → Slides
│   ├── mobile-factory/      # Knowledge → Mobile
│   └── offline-factory/     # Knowledge → Offline packages
├── layer-5-applications/    # WHAT gets produced
│   ├── web/                 # Website output
│   ├── pdf/                 # PDF output
│   ├── video/               # Video output
│   ├── mobile/              # Mobile output
│   ├── slides/              # Slide output
│   └── offline/             # Offline package output
├── layer-6-runtime/         # CURRENT execution state
├── layer-7-memory/          # HISTORY of decisions
│   ├── decisions/           # Why things exist
│   ├── changelog/           # What changed
│   └── audit/               # Who did what
├── registries/              # REUSABLE components
├── bbl/                     # Bhavya Build Language
├── tests/                   # Validation tests
└── scripts/                 # Automation scripts
```

## Active Context

### Current Phase
- **Phase:** BICM v1.0 Implementation
- **Status:** In Progress
- **Focus:** Architecture rebuild

### Key Files
- `layer-0-identity/IDENTITY.md` — Who we are
- `layer-1-mission/MISSION.md` — Why we exist
- `layer-2-context/CONTEXT.md` — This file
- `layer-3-knowledge/` — Knowledge Objects
- `layer-4-factories/` — Universal Compiler
- `registries/` — Reusable components
- `bbl/` — Bhavya Build Language

## Version History

| Date | Version | Change |
|------|---------|--------|
| 2026-07-30 | 1.0.0 | Initial context layer |
