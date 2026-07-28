# MASTER CONTEXT

**Last Updated:** 2026-07-28
**Version:** 1.1.0-alpha
**Status:** Phase 3 Complete

---

## Current Mission

Build the world's first AI Native Foundation Operating System — a version-controlled institutional manual that any AI model can clone, read, and immediately contribute to the Bhavya Foundation repository.

## Active Release

**v1.1.0-alpha** — Phase 3: Institution Runtime

Features:
- **Bhavya Kernel** — Core runtime with 14 modules
- **Bhavya Runtime Protocol (BRP)** — Goal → Plan → Tasks → Events → Memory
- **7 Engine Packages** — Each with one responsibility
- **Contracts** — Input validation for every engine
- **Observability** — Runtime dashboard
- **Boot Sequence** — Proper validation at every step
- **E2E Integration Test** — Acceptance criterion met

## Acceptance Criterion (MET)

> A founder can submit a single goal to Bhavya OS, and the kernel can autonomously plan it, execute a workflow, assign agents, publish events, update memory, and return a final execution report—all through BRP.

## Current Priorities

1. **Real execution** — Wire agents to actually execute tasks
2. **Real persistence** — Wire memory to actually persist
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

## BRP v1

```
Goal → Plan → Task → Event → Memory → Knowledge → Result
```

Small. Versioned. The contract for everything inside Bhavya OS.

## Kernel Modules (14)

| Module | Purpose |
|--------|---------|
| `boot/` | Bootstrap and validation |
| `runtime/` | Lifecycle management |
| `configuration/` | Config management |
| `logging/` | Structured logging |
| `events/` | Event bus (pub/sub) |
| `registry/` | Auto-discovery |
| `memory/` | Unified memory interface |
| `permissions/` | Access control |
| `health/` | Health checks |
| `scheduler/` | Task scheduling |
| `planner/` | Goal → Plan → Tasks |
| `api/` | API surface |
| `observability/` | Runtime dashboard |
| `contracts/` | Input validation |

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

## Boot Sequence

```
Load Configuration
  ↓
Initialize Logging
  ↓
Initialize Event Bus
  ↓
Initialize Registry
  ↓
Initialize Memory
  ↓
Initialize Permissions
  ↓
Initialize Health
  ↓
Initialize Scheduler
  ↓
Initialize Planner
  ↓
Initialize Observability
  ↓
Initialize API
  ↓
Initialize Runtime
  ↓
Health Check
  ↓
READY
```

If the kernel cannot boot cleanly, nothing else runs.

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
│   ├── kernel/             # Bhavya Kernel (14 modules)
│   ├── agent-engine/       # Agent Engine
│   ├── workflow-engine/    # Workflow Engine
│   ├── memory-engine/      # Memory Engine
│   ├── knowledge-engine/   # Knowledge Engine
│   ├── search-engine/      # Search Engine
│   ├── planner-engine/     # Planner Engine
│   ├── scheduler-engine/   # Scheduler Engine
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
| v1.1.0-alpha Release | `docs/releases/v1.1.0-alpha.md` |
| Mission | `.ai/MISSION.md` |
| Vision | `.ai/VISION.md` |
| Values | `.ai/VALUES.md` |
| Style Guide | `.ai/STYLE_GUIDE.md` |
| Coding Standard | `.ai/CODING_STANDARD.md` |
| Agent Registry | `.agents/registry.json` |
| Registry Index | `.registry/index.json` |

---

**Every coding session starts by reading this file.**
