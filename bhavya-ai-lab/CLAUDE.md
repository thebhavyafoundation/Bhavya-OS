# CLAUDE.md — Bhavya AI Lab

## Identity

Bhavya AI Lab is a free, offline-first educational operating system for teaching AI/CS in rural Himachal Pradesh.

## Routing Table

| Task | Workspace | Read | Output |
|------|-----------|------|--------|
| Research a topic | research/ | CONTEXT.md | research brief |
| Create curriculum | curriculum/ | CONTEXT.md | lesson/course |
| Produce video | production/ | CONTEXT.md | animation |
| Build website | platform/ | CONTEXT.md | site |
| Design assessment | assessments/ | CONTEXT.md | quiz/rubric |
| Create teacher guide | teachers/ | CONTEXT.md | guide |

## Folder Map

```
bhavya-ai-lab/
├── research/          # Research workspace
├── curriculum/        # Curriculum workspace
├── production/        # Video/content production
├── platform/          # Website deployment
├── assessments/       # Assessment engine
├── teachers/          # Teacher resources
├── _config/           # Global config + registries
│   ├── registries/    # Reusable assets
│   └── voice.md       # Voice rules
└── knowledge/         # Knowledge Objects
```

## Naming Rules

- Knowledge Objects: `ko-{domain}-{slug}.json`
- Schemas: `{type}.schema.json`
- Decisions: `DEC-{YYYY-MM-DD}-{slug}.json`
- Versions: `MAJOR.MINOR.PATCH`
