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

## Modules

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
| `contracts/` | Input validation |
| `idempotency/` | Duplicate prevention |
| `coordinator/` | Multi-engine orchestration (v1.3.0) |
| `replay/` | Context restore + event replay (v1.3.0) |
| `services/` | Institution services (v1.3.0) |

## Bhavya Runtime Protocol (BRP)

Every engine understands BRP:

```
Goal
  ↓
Plan
  ↓
Workflow
  ↓
Tasks
  ↓
Events
  ↓
Agent Actions
  ↓
Memory Updates
  ↓
Knowledge Updates
```

## Usage

```typescript
import { Kernel } from '@bhavya/kernel';

const kernel = await Kernel.boot({
  root: process.cwd(),
  config: 'bhavya.config.ts'
});

// Memory
const project = await kernel.memory.get('project');

// Workflows
await kernel.workflow.start('deploy');

// Events
await kernel.events.emit('page.created', { page });

// Registry
const agents = await kernel.registry.discover('agents');

// Coordinator (multi-engine)
const report = await kernel.coordinator.execute({
  name: 'build-website',
  steps: [
    { engine: 'planner', action: 'createPlan', input: {...} },
    { engine: 'agent', action: 'build', input: {...} }
  ]
});

// Replay
await kernel.replay.replay('exec-123');

// Services
const { artifacts } = await kernel.services.websiteContent.execute({
  action: 'create', type: 'page', name: 'mission',
  title: 'Our Mission', content: '...'
});
```

## Design Principle

Every engine is behind a stable interface. Applications never know whether memory is stored in Markdown, JSON, SQLite, or Qdrant.

```typescript
// Always this:
const memory = await kernel.memory.get('project');

// Never this:
const memory = await fs.readFile('.memory/projects.md');
```
