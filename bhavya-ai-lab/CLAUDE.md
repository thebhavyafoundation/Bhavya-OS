# CLAUDE.md — Bhavya AI Lab

## Identity

Bhavya AI Lab is a free, offline-first educational operating system for teaching AI/CS in rural Himachal Pradesh.

## Routing Table

| Task | Workspace | Read | Output |
|------|-----------|------|--------|
| Research a topic | research/ | CONTEXT.md | research brief |
| Create curriculum | curriculum/ | CONTEXT.md | lesson/course |
| Produce video | production/ | CONTEXT.md | animation |
| Deploy website | platform/ | CONTEXT.md | site |
| Build output | build/ | README.md | compiled artifact |
| Check institution | institution/ | README.md | decision/history |

## Folder Map

```
bhavya-ai-lab/
├── research/          # Research workspace
├── curriculum/        # Curriculum workspace
├── production/        # Video/content production
├── platform/          # Website deployment
├── build/             # Build system (compilers)
├── assessments/       # Assessment engine
├── teachers/          # Teacher resources
├── institution/       # Memory, decisions, governance
├── knowledge/         # Knowledge Objects
│   ├── objects/       # Atomic knowledge units
│   ├── concepts/      # Concept definitions
│   ├── glossary/      # Terminology
│   ├── citations/     # Source citations
│   ├── taxonomy/      # Classification system
│   └── graph/         # Relationships
└── _config/           # Global config
    ├── rules/         # Permanent rules
    ├── registries/    # Reusable assets
    ├── schemas/       # Data schemas
    └── skills/        # Reusable expertise
```

## Naming Rules

- Knowledge Objects: `ko-{domain}-{slug}.json`
- Schemas: `{type}.schema.json`
- Decisions: `DEC-{YYYY-MM-DD}-{slug}.json`
- Versions: `MAJOR.MINOR.PATCH`
- Each workspace has: CONTEXT.md (for AI) + MANIFEST.md (for humans)
