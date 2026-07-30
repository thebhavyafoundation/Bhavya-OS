# CLAUDE.md — Bhavya AI Lab OS v3.0.0

## Identity

Bhavya AI Lab is a free, offline-first educational operating system for teaching AI/CS in rural Himachal Pradesh.

AI models are interchangeable. This OS belongs to the workspace, not to any model.

## Routing by Capability

| Capability | Builder | Skills | Agent |
|------------|---------|--------|-------|
| research_analysis | — | research, writing | research-agent |
| lesson_generation | lesson | education, writing | curriculum-agent |
| quiz_generation | quiz | education, qa | curriculum-agent |
| slides_generation | slides | education, writing | curriculum-agent |
| pdf_generation | pdf | education, writing | curriculum-agent |
| video_generation | video | remotion, animation, react | animation-agent |
| animation_generation | video | remotion, animation | animation-agent |
| diagram_generation | video | diagramming, animation | animation-agent |
| website_generation | website | deployment, react | website-agent |
| translation | — | translation, writing | curriculum-agent |

## Runtime Flow

```
User Request
      ↓
CLAUDE.md (Capability Routing)
      ↓
Orchestrator → Resolve Capability → Resolve Dependencies
      ↓
Load Skills → Load Registries → Pre-Validate
      ↓
Execute Builder → Post-Validate → Publish Artifacts
      ↓
Observability (Metrics, Logs, Traces)
```

## Folder Map

```
bhavya-ai-lab/
├── agents/            # Multi-agent runtime
├── apps/              # Foundation applications
├── builders/          # Deterministic build pipelines
├── cli/               # Developer CLI and templates
├── compilers/         # Animation compiler pipeline
├── dashboard/         # Engineering dashboard
├── dependency-graph/  # Dependency visualization
├── docs-gen/          # Documentation generator
├── examples/          # Reusable project templates
├── institution/       # Memory, decisions, governance
├── knowledge/         # Knowledge Objects + Graph
├── observability/     # Metrics, logs, tracing
├── orchestrator/      # Pipeline orchestration
├── packages/          # Modular, installable packages
├── plugins/           # Bhavya Package Registry (BPR)
├── providers/         # AI provider abstraction
├── quality-gates/     # Validation and quality
├── release/           # Release pipeline
├── security/          # Policies and verification
├── skills/            # Model-independent skills
├── tests/             # Automated test suites
└── _config/           # Global config
    ├── design/        # Design intelligence
    ├── registries/    # Reusable assets
    ├── schemas/       # Data schemas
    └── skills/        # Registry + capabilities
```

## Version

**3.0.0** — Model-independent production engineering ecosystem.
