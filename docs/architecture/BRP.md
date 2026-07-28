# Bhavya Runtime Protocol (BRP)

**Version:** 1.0.0-alpha
**Status:** Frozen

---

## What is BRP?

BRP is the protocol every engine in Bhavya OS understands. It defines how goals become actions, how actions become knowledge, and how knowledge feeds back into goals.

## The Flow

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

## Core Concepts

### Goal
A desired outcome. Has priority, deadline, and constraints.

```typescript
interface Goal {
  id: GoalId;
  description: string;
  priority: Priority;
  deadline?: Date;
  constraints: string[];
}
```

### Plan
A sequence of steps to achieve a goal.

```typescript
interface Plan {
  id: PlanId;
  goalId: GoalId;
  steps: PlanStep[];
  status: 'draft' | 'approved' | 'executing' | 'completed' | 'failed';
}
```

### Task
A single unit of work.

```typescript
interface Task {
  id: TaskId;
  type: string;
  goal: string;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  status: 'pending' | 'queued' | 'running' | 'completed' | 'failed';
  assignee?: AgentId;
  dependencies: TaskId[];
}
```

### Event
Something that happened. Triggers reactions.

```typescript
interface Event {
  id: EventId;
  type: string;
  source: string;
  payload: Record<string, unknown>;
  timestamp: Date;
}
```

### Agent
A capability that can execute tasks.

```typescript
interface Agent {
  id: AgentId;
  name: string;
  role: string;
  capabilities: Capability[];
  permissions: Permission[];
  status: 'idle' | 'busy' | 'error' | 'offline';
}
```

## How Engines Use BRP

| Engine | BRP Role |
|--------|----------|
| Planner Engine | Goal → Plan → Tasks |
| Scheduler Engine | Tasks → Execution |
| Agent Engine | Tasks → Agent Actions |
| Workflow Engine | Workflows → Steps → Events |
| Memory Engine | Actions → Memory Updates |
| Knowledge Engine | Memory → Knowledge Graph |
| Event Engine | Events → Routing → Reactions |
| Registry Engine | Discovery → Registry Entries |

## Design Principles

1. **Stable Interfaces** — Applications never know implementation details
2. **Event-Driven** — Everything emits and responds to events
3. **Composable** — Engines can be mixed and matched
4. **Observable** — Every action is logged and traceable
5. **Recoverable** — Failures are retried and logged

## Example: Deploy Workflow

```typescript
// 1. Goal
const goal = await kernel.planner.createGoal({
  description: 'Deploy website to production',
  priority: 'high',
});

// 2. Plan
const plan = await kernel.planner.decomposeGoal(goal);

// 3. Execute
await kernel.planner.execute(plan.id);

// 4. Events fire
// workflow.started → workflow.step.started → workflow.step.completed → workflow.completed

// 5. Memory updated
// deployment记录 stored in .memory/

// 6. Knowledge updated
// deployment patterns added to knowledge graph
```

---

**BRP is not a framework. It is a protocol.** Every engine speaks it. Every application consumes it. Every action follows it.
