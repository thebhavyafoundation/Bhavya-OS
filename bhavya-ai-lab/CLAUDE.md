# CLAUDE.md — Bhavya AI Lab

## Identity

Bhavya AI Lab is a free, offline-first educational operating system for teaching AI/CS in rural Himachal Pradesh.

AI models are interchangeable. Claude, GPT-5, Gemini, Qwen, Codex, or any future model are execution engines. This OS belongs to the workspace, not to any model.

## Routing by Capability

| Capability | Builder | Skills | Workspace |
|------------|---------|--------|-----------|
| Generate video | video | remotion, animation, react | production/ |
| Generate lesson | lesson | education, writing | curriculum/ |
| Generate quiz | quiz | education, qa | curriculum/ |
| Generate website | website | deployment, react | platform/ |
| Generate slides | slides | education, writing | curriculum/ |
| Generate PDF | pdf | education, writing | curriculum/ |
| Research topic | — | research, writing | research/ |
| Translate content | — | translation, writing | curriculum/ |

## Routing by Workspace

| Workspace | Read | Skills | Purpose |
|-----------|------|--------|---------|
| research/ | CONTEXT.md | research | Transform topic requests into research briefs |
| curriculum/ | CONTEXT.md | education | Transform research briefs into lessons |
| production/ | CONTEXT.md | remotion | Transform scripts into videos |
| platform/ | CONTEXT.md | deployment | Deploy content to web/mobile/offline |

## Folder Map

```
bhavya-ai-lab/
├── research/          # Research workspace
├── curriculum/        # Curriculum workspace
├── production/        # Video/content production
├── platform/          # Website deployment
├── builders/          # Deterministic build pipelines
├── packages/          # Modular, installable components
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

## Runtime Flow

```
User Request
      ↓
CLAUDE.md (Capability Routing)
      ↓
Workspace CONTEXT.md
      ↓
Load Registered Skills
      ↓
Load Component Registry
      ↓
Invoke Builder (if applicable)
      ↓
Generate / Modify Code
      ↓
Validate Output
```

## Naming Rules

- Knowledge Objects: `ko-{domain}-{slug}.json`
- Schemas: `{type}.schema.json`
- Decisions: `DEC-{YYYY-MM-DD}-{slug}.json`
- Versions: `MAJOR.MINOR.PATCH`
- Each workspace has: CONTEXT.md (for AI) + MANIFEST.md (for humans)
