# Bhavya Kernel

The core runtime for Bhavya OS. Every application talks to the kernel.

## Architecture

```
Website
  ↓
Kernel
  ↓
Services
  ↓
Memory
  ↓
Agents
  ↓
Events
```

## Modules (27)

| Module                | Purpose                                |
| --------------------- | -------------------------------------- |
| `boot/`               | Bootstrap and initialization           |
| `runtime/`            | Runtime lifecycle management           |
| `configuration/`      | Config management                      |
| `logging/`            | Structured logging                     |
| `events/`             | Event bus (pub/sub)                    |
| `registry/`           | Auto-discovery of resources            |
| `memory/`             | Unified memory interface               |
| `permissions/`        | Access control                         |
| `health/`             | Health checks and monitoring           |
| `scheduler/`          | Task scheduling and execution          |
| `planner/`            | Goal → Plan → Tasks conversion         |
| `api/`                | Kernel API surface                     |
| `observability/`      | Runtime dashboard                      |
| `contracts/`          | Input validation                       |
| `idempotency/`        | Duplicate prevention                   |
| `coordinator/`        | Multi-engine orchestration             |
| `replay/`             | Context restore + event replay         |
| `services/`           | Institution services                   |
| `self-organizing/`    | Autonomous work discovery + assignment |
| `orchestrator/`       | Event-driven workflow triggers         |
| `consensus/`          | Multi-agent voting + decisions         |
| `capability-matcher/` | Agent-to-task pairing                  |
| `auth/`               | Token auth + RBAC                      |
| `rate-limit/`         | Request throttling                     |
| `monitoring/`         | Metrics + alerting                     |
| `backup/`             | Backup + recovery                      |

## Bhavya Runtime Protocol (BRP)

```
Goal → Plan → Task → Event → Memory → Knowledge → Result
```

## Usage

```typescript
import { boot } from "@bhavya/kernel";

const kernel = await boot({ root: process.cwd() });

// Memory
const project = await kernel.memory.get("project");

// Self-Organizing
const work = await kernel.selfOrganizing.discoverWork({
  type: "task",
  title: "Update homepage",
  requiredCapabilities: ["design"],
});

// Consensus
const proposal = await kernel.consensus.createProposal({
  title: "Use Tailwind",
  proposedBy: "agent:designer",
  type: "decision",
});

// Auth
const token = await kernel.auth.issueToken("agent:dev", ["agent"]);

// Monitoring
kernel.monitoring.record("api.latency", 245);
```

## Design Principle

Every engine is behind a stable interface. Applications never know implementation details.

```typescript
// Always this:
const memory = await kernel.memory.get("project");

// Never this:
const memory = await fs.readFile("memory/projects.md");
```
