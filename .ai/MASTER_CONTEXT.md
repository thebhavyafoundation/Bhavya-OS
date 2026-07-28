# MASTER CONTEXT

**Last Updated:** 2026-07-27
**Version:** 1.1.0-alpha
**Status:** Phase 2 In Progress

---

## Current Mission

Build the world's first AI Native Foundation Operating System — a version-controlled institutional manual that any AI model can clone, read, and immediately contribute to the Bhavya Foundation repository.

## Active Release

**v1.1.0-alpha** — Phase 2: Bhavya Kernel

Features:
- **Bhavya Kernel** — Core runtime with 12 modules
- **Bhavya Runtime Protocol (BRP)** — Goal → Plan → Tasks → Events → Memory
- **7 Engine Packages** — Each with one responsibility
- **@bhavya/* namespace** — Consistent package naming
- Phase 1 features (Memory, Governance, Agents, Workflows, etc.)

## Current Priorities

1. **Complete Phase 2** — Kernel and engines
2. **Integration testing** — Verify kernel works with all apps
3. **Documentation** — Fill institutional knowledge base
4. **Testing** — Establish quality gates

## Architecture

```
Website
  ↓
Kernel (@bhavya/kernel)
  ↓
Engines (@bhavya/*-engine)
  ↓
Memory (.memory/)
  ↓
Agents (.agents/)
  ↓
Events (.events/)
```

## Package Namespace

```
@bhavya/kernel           → packages/kernel/
@bhavya/agent-engine     → packages/agent-engine/
@bhavya/workflow-engine  → packages/workflow-engine/
@bhavya/memory-engine    → packages/memory-engine/
@bhavya/knowledge-engine → packages/knowledge-engine/
@bhavya/search-engine    → packages/search-engine/
@bhavya/planner-engine   → packages/planner-engine/
@bhavya/scheduler-engine → packages/scheduler-engine/
@bhavya/runtime          → packages/runtime/ (legacy)
@bhavya/sdk              → packages/sdk/ (legacy)
```

## Kernel Modules

| Module | Purpose |
|--------|---------|
| `boot/` | Bootstrap and initialization |
| `runtime/` | Runtime lifecycle management |
| `scheduler/` | Task scheduling and execution |
| `planner/` | Goal → Plan → Tasks conversion |
| `memory/` | Unified memory interface |
| `events/` | Event bus (pub/sub) |
| `registry/` | Auto-discovery of resources |
| `permissions/` | Access control |
| `health/` | Health checks and monitoring |
| `logging/` | Structured logging |
| `configuration/` | Config management |
| `api/` | Kernel API surface |

## Bhavya Runtime Protocol (BRP)

Every engine understands:

```
Goal → Plan → Workflow → Tasks → Events → Agent Actions → Memory Updates → Knowledge Updates
```

## Active Agents

| Agent | Role | Status |
|-------|------|--------|
| Founder | Strategic direction | Active |
| CEO | Operations | Active |
| CTO | Technology | Active |
| Designer | Visual design | Active |
| Developer | Implementation | Active |
| Reviewer | Code review | Active |
| Researcher | Data gathering | Active |
| Writer | Content creation | Active |
| SEO | Search optimization | Active |
| Translator | Localization | Active |
| Historian | Knowledge preservation | Active |
| Legal | Compliance | Active |
| Volunteer | Community | Active |
| Donation | Fundraising | Active |
| Social Media | Outreach | Active |
| QA | Quality assurance | Active |
| Release | Deployment | Active |
| Security | Security | Active |

## Folder Map

```
├── .ai/                    # AI brain (read first)
│   ├── MASTER_CONTEXT.md   # This file
│   ├── MISSION.md          # Foundation mission
│   ├── VISION.md           # Long-term vision
│   ├── VALUES.md           # Core values
│   ├── CONSTRAINTS.md      # Operational constraints
│   ├── STYLE_GUIDE.md      # Brand guidelines
│   ├── CODING_STANDARD.md  # Development standards
│   └── DECISION_RULES.md   # Decision framework
│
├── .agents/                # Agent definitions
├── .memory/                # Long-term memory
├── .workflows/             # Operational workflows
├── .tasks/                 # Task management
├── .registry/              # System registries
├── .events/                # Event definitions
├── .prompts/               # Prompt templates
├── .commands/              # Command definitions
├── .templates/             # Content templates
├── .policies/              # Operational rules
├── .schemas/               # Validation schemas
├── .metrics/               # Dashboard data
├── .security/              # Security policies
├── .tests/                 # Test suites
├── .logs/                  # Agent logs
├── .snapshots/             # System snapshots
│
├── apps/                   # Applications
│   └── website/            # Main website
├── packages/               # Shared packages (@bhavya/*)
│   ├── kernel/             # Bhavya Kernel (NEW)
│   ├── agent-engine/       # Agent Engine (NEW)
│   ├── workflow-engine/    # Workflow Engine (NEW)
│   ├── memory-engine/      # Memory Engine (NEW)
│   ├── knowledge-engine/   # Knowledge Engine (NEW)
│   ├── search-engine/      # Search Engine (NEW)
│   ├── planner-engine/     # Planner Engine (NEW)
│   ├── scheduler-engine/   # Scheduler Engine (NEW)
│   ├── runtime/            # Legacy runtime
│   └── sdk/                # Legacy SDK
├── docs/                   # Institutional knowledge
│   ├── governance/         # Governance documents
│   ├── architecture/       # Architecture decisions
│   ├── standards/          # Coding standards
│   ├── releases/           # Release notes
│   ├── research/           # Research findings
│   ├── decisions/          # ADRs
│   └── archive/            # Historical snapshots
└── scripts/                # Build scripts
```

## Available MCPs

- `context7` — Documentation lookup
- `github` — GitHub operations

## Current Blockers

- None

## Quality Gates

- [ ] Local build passes
- [ ] Tests pass
- [ ] Lint clean
- [ ] Type check clean
- [ ] Accessibility score > 90
- [ ] Performance score > 90
- [ ] SEO score > 90

## Important Documents

| Document | Location |
|----------|----------|
| BRP Protocol | `docs/architecture/BRP.md` |
| Package Namespace | `docs/architecture/PACKAGE-NAMESPACE.md` |
| Mission | `.ai/MISSION.md` |
| Vision | `.ai/VISION.md` |
| Values | `.ai/VALUES.md` |
| Style Guide | `.ai/STYLE_GUIDE.md` |
| Coding Standard | `.ai/CODING_STANDARD.md` |
| Migration Plan | `docs/MIGRATION-PLAN.md` |
| Reorganization Summary | `docs/REORGANIZATION-SUMMARY.md` |
| Agent Registry | `.agents/registry.json` |
| Registry Index | `.registry/index.json` |

---

**Every coding session starts by reading this file.**
