# MASTER CONTEXT

**Last Updated:** 2026-07-28
**Version:** 2.0.0-beta
**Status:** Production Platform — Ready for real-world deployment

---

## Current Mission

Build the world's first AI Native Foundation Operating System — a version-controlled institutional manual that any AI model can clone, read, and immediately contribute to the Bhavya Foundation repository.

## Active Release

**v2.0.0-beta** — Production Platform

Features:
- **Production Configuration** — Environment-aware config with validation
- **Auth & Authorization** — Token-based auth with RBAC
- **Rate Limiting** — Request throttling and protection
- **Monitoring & Alerting** — Metrics, alerts, observability
- **Backup & Recovery** — Automated data protection
- **27 Kernel Modules** — Complete production runtime
- **7 Engine Packages** — Each with one responsibility
- **5 Institution Services** — Website Content, Transparency, Volunteer, Research, Governance

## Acceptance Criterion (MET)

> Bhavya OS is production-ready with auth, rate-limiting, monitoring, and backup.

## Current Priorities

1. **v3.0.0** — Bhavya OS (full release)
2. **Documentation** — Fill institutional knowledge base
3. **Testing** — Establish quality gates

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

## Kernel Modules (27)

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
| `self-organizing/` | Autonomous work discovery |
| `orchestrator/` | Event-driven workflow triggers |
| `consensus/` | Multi-agent voting |
| `capability-matcher/` | Agent-to-task pairing |
| `auth/` | Token auth + RBAC |
| `rate-limit/` | Request throttling |
| `monitoring/` | Metrics + alerting |
| `backup/` | Backup + recovery |

## Production Stack

```
Auth → Rate Limit → API → Coordinator → Engine → Memory
                ↓
          Monitoring → Alerting
                ↓
          Backup → Recovery
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
│   ├── kernel/             # Bhavya Kernel (27 modules)
│   ├── agent-engine/       # Agent Engine
│   ├── workflow-engine/    # Workflow Engine
│   ├── memory-engine/      # Memory Engine
│   ├── knowledge-engine/   # Knowledge Engine
│   ├── search-engine/      # Search Engine
│   ├── planner-engine/     # Planner Engine
│   ├── scheduler-engine/   # Scheduler Engine
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

## Important Documents

| Document | Location |
|----------|----------|
| BRP Protocol | `docs/architecture/BRP.md` |
| Frozen Contracts | `docs/standards/FROZEN-CONTRACTS.md` |
| Package Namespace | `docs/architecture/PACKAGE-NAMESPACE.md` |
| v2.0.0-beta Release | `docs/releases/v2.0.0-beta.md` |
| Mission | `.ai/MISSION.md` |
| Vision | `.ai/VISION.md` |
| Values | `.ai/VALUES.md` |

---

**Every coding session starts by reading this file.**
