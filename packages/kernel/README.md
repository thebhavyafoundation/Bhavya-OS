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
```

## Design Principle

Every engine is behind a stable interface. Applications never know whether memory is stored in Markdown, JSON, SQLite, or Qdrant.

```typescript
// Always this:
const memory = await kernel.memory.get('project');

// Never this:
const memory = await fs.readFile('.memory/projects.md');
```
