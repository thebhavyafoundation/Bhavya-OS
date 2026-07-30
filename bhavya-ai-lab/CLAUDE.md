# CLAUDE.md — Bhavya AI Lab

## Identity

Bhavya AI Lab is a free, offline-first educational operating system for teaching AI/CS in rural Himachal Pradesh.

AI models are interchangeable. Claude, GPT-5, Gemini, Qwen, Codex, or any future model are execution engines. This OS belongs to the workspace, not to any model.

## Routing Table

| Task | Workspace | Read | OpenCode Skills |
|------|-----------|------|-----------------|
| Research a topic | research/ | CONTEXT.md | research |
| Create curriculum | curriculum/ | CONTEXT.md | education |
| Generate animation | production/ | CONTEXT.md | remotion, animation |
| Deploy website | platform/ | CONTEXT.md | deployment |
| Build output | build/ | README.md | typescript |
| Check institution | institution/ | README.md | — |

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
    └── skills/        # Model-independent skill packages
```

## Naming Rules

- Knowledge Objects: `ko-{domain}-{slug}.json`
- Schemas: `{type}.schema.json`
- Decisions: `DEC-{YYYY-MM-DD}-{slug}.json`
- Versions: `MAJOR.MINOR.PATCH`
- Each workspace has: CONTEXT.md (for AI) + MANIFEST.md (for humans)

## Runtime Flow

```
User Request
      ↓
CLAUDE.md (Routing)
      ↓
Workspace CONTEXT.md
      ↓
Load Registered Skills
      ↓
Load Component Registry
      ↓
Generate / Modify Code
      ↓
Validate Output
```
