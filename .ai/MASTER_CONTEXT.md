# MASTER CONTEXT

**Last Updated:** 2026-07-28
**Version:** 1.3.0-alpha
**Status:** Institution Services — Real operational needs powered by the runtime

---

## Current Mission

Build the world's first AI Native Foundation Operating System — a version-controlled institutional manual that any AI model can clone, read, and immediately contribute to the Bhavya Foundation repository.

## Active Release

**v1.3.0-alpha** — Institution Services

Features:
- **Coordinator** — Multi-engine orchestration
- **Replay Engine** — Restore context, replay events, resume workflow
- **5 Institution Services** — Website Content, Transparency, Volunteer, Research, Governance
- **18 Kernel Modules** — Complete runtime
- **7 Engine Packages** — Each with one responsibility

## Acceptance Criterion (MET)

> Institution services solve real operational needs while exercising the runtime.

## Current Priorities

1. **v1.4.0-alpha** — Autonomous Coordination (self-organizing systems)
2. **v2.0.0-beta** — Production Platform (operational foundation)
3. **Documentation** — Fill institutional knowledge base

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

## Kernel Modules (18)

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
| `idempotency/` | Duplicate prevention |
| `coordinator/` | Multi-engine orchestration |
| `replay/` | Context restore + event replay |
| `services/` | Institution services |

## Institution Services (v1.3.0)

| Service | Solves | Exercises |
|---------|--------|-----------|
| Website Content | Create, update, publish web content | Planner, workflow, content, search |
| Transparency | Publish reports, releases, financials | Events, memory, releases, registry |
| Volunteer | Onboard, manage, recognize volunteers | Agents, workflows, permissions |
| Research | Ingest, index, search research | Knowledge, search, memory |
| Governance | Manage documents, approvals, history | Documents, approvals, history |

## Coordinator

Orchestrates multiple engines, combines outputs:

```typescript
const report = await coordinator.execute({
  name: 'build-website',
  steps: [
    { engine: 'planner', action: 'createPlan', input: {...} },
    { engine: 'agent', action: 'build', input: {...} }
  ]
});
// report.success, report.outputs, report.duration
```

## Replay Engine

Restore context, replay events, resume workflow:

```typescript
// Replay failed execution
const result = await replay.replay('exec-123');
// result.replayedEvents, result.newStatus

// Resume paused execution
const result = await replay.resume('exec-123');
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
```

## Boot Sequence

```
Load Configuration → Initialize Logging → Initialize Event Bus →
Initialize Registry → Initialize Memory → Initialize Permissions →
Initialize Health → Initialize Scheduler → Initialize Planner →
Initialize Observability → Initialize API → Initialize Runtime →
Health Check → READY
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
│   ├── kernel/             # Bhavya Kernel (18 modules)
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
| Frozen Contracts | `docs/standards/FROZEN-CONTRACTS.md` |
| Package Namespace | `docs/architecture/PACKAGE-NAMESPACE.md` |
| v1.3.0-alpha Release | `docs/releases/v1.3.0-alpha.md` |
| Mission | `.ai/MISSION.md` |
| Vision | `.ai/VISION.md` |
| Values | `.ai/VALUES.md` |
| Style Guide | `.ai/STYLE_GUIDE.md` |
| Coding Standard | `.ai/CODING_STANDARD.md` |
| Agent Registry | `.agents/registry.json` |
| Registry Index | `.registry/index.json` |

---

**Every coding session starts by reading this file.**
