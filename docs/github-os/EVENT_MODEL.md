# GitHub OS — Event Model

## Overview

GitHub OS uses a domain event architecture. Every significant state change produces an event. Subscribers react to events asynchronously.

## Event Bus

Uses `@bhavya/events` (EventBus with history, retry, metrics).

```typescript
// packages/events/src/index.ts
import { EventBus } from "@bhavya/events";

export const eventBus = new EventBus({
  historySize: 1000,
  retryAttempts: 3,
  retryDelay: 1000,
});
```

## Event Categories

### 1. Repository Events

| Event                 | Trigger                     | Subscribers                               |
| --------------------- | --------------------------- | ----------------------------------------- |
| `repo.created`        | Repository created          | Capability Registry, Knowledge Extraction |
| `repo.updated`        | Repository metadata changed | Search Index                              |
| `repo.archived`       | Repository archived         | Cleanup                                   |
| `repo.health.checked` | Health analysis complete    | Dashboard                                 |

### 2. Code Events

| Event               | Trigger               | Subscribers                                            |
| ------------------- | --------------------- | ------------------------------------------------------ |
| `commit.pushed`     | New commit pushed     | Architecture Analysis, Knowledge Extraction, Analytics |
| `branch.created`    | New branch created    | Workflow Trigger                                       |
| `branch.deleted`    | Branch deleted        | Cleanup                                                |
| `release.published` | Release created       | Breaking Change Detection, Notifications               |
| `release.drafted`   | Release draft created | Changelog Generation                                   |

### 3. Issue Events

| Event                    | Trigger            | Subscribers                                  |
| ------------------------ | ------------------ | -------------------------------------------- |
| `issue.created`          | Issue opened       | AI Suggestions, Knowledge Linking, Analytics |
| `issue.updated`          | Issue modified     | Search Index                                 |
| `issue.assigned`         | Issue assigned     | Notification                                 |
| `issue.labeled`          | Label added        | Analytics                                    |
| `issue.milestone linked` | Milestone assigned | Progress Calculation                         |
| `issue.closed`           | Issue closed       | Metrics, Learning Resource Linking           |

### 4. Pull Request Events

| Event                  | Trigger                 | Subscribers                                          |
| ---------------------- | ----------------------- | ---------------------------------------------------- |
| `pr.opened`            | PR created              | AI Review, Context Gathering, Notifications          |
| `pr.review.requested`  | Review requested        | Notification                                         |
| `pr.reviewed`          | Review submitted        | Knowledge Extraction, Analytics                      |
| `pr.approved`          | PR approved             | Merge Readiness                                      |
| `pr.changes_requested` | Changes requested       | Notification                                         |
| `pr.merged`            | PR merged               | Architecture Analysis, Knowledge Extraction, Metrics |
| `pr.closed`            | PR closed without merge | Metrics                                              |

### 5. Review Events

| Event                      | Trigger              | Subscribers                           |
| -------------------------- | -------------------- | ------------------------------------- |
| `review.comment`           | Review comment added | Knowledge Extraction, Learning Points |
| `review.approved`          | Review approved      | PR Status Update                      |
| `review.changes_requested` | Changes requested    | Notification                          |

### 6. Commit Events

| Event                 | Trigger                  | Subscribers           |
| --------------------- | ------------------------ | --------------------- |
| `commit.analyzed`     | Commit analysis complete | Knowledge Extraction  |
| `commit.verified`     | Commit verified (signed) | Metrics               |
| `commit.ai_generated` | AI-generated commit      | Notification, Metrics |

### 7. Knowledge Events

| Event               | Trigger                   | Subscribers                 |
| ------------------- | ------------------------- | --------------------------- |
| `knowledge.created` | Knowledge Package created | Search Index, Notifications |
| `knowledge.updated` | Knowledge Package updated | Search Index                |
| `knowledge.related` | Packages linked           | Analytics                   |
| `knowledge.rated`   | Quality rated             | Metrics                     |

### 8. ADR Events

| Event            | Trigger        | Subscribers             |
| ---------------- | -------------- | ----------------------- |
| `adr.proposed`   | ADR proposed   | Notification, Analytics |
| `adr.accepted`   | ADR accepted   | Knowledge Extraction    |
| `adr.deprecated` | ADR deprecated | Notification            |
| `adr.superseded` | ADR superseded | Notification, Linking   |

### 9. Workflow Events

| Event                    | Trigger               | Subscribers            |
| ------------------------ | --------------------- | ---------------------- |
| `workflow.created`       | Workflow created      | Capability Registry    |
| `workflow.enabled`       | Workflow enabled      | Analytics              |
| `workflow.disabled`      | Workflow disabled     | Analytics              |
| `workflow.run.started`   | Workflow run started  | Monitoring             |
| `workflow.run.completed` | Workflow run finished | Metrics, Notifications |
| `workflow.run.failed`    | Workflow run failed   | Alert, Rollback        |

### 10. MCP Events

| Event                       | Trigger              | Subscribers                       |
| --------------------------- | -------------------- | --------------------------------- |
| `mcp.installed`             | MCP server installed | Capability Registry, Notification |
| `mcp.uninstalled`           | MCP server removed   | Cleanup                           |
| `mcp.status.changed`        | MCP status changed   | Dashboard                         |
| `mcp.capability.discovered` | New capability found | Knowledge Extraction              |

### 11. AI Events

| Event                     | Trigger               | Subscribers          |
| ------------------------- | --------------------- | -------------------- |
| `ai.session.started`      | AI session created    | Context Building     |
| `ai.suggestion.generated` | AI suggestion created | Notification         |
| `ai.suggestion.accepted`  | Suggestion accepted   | Metrics, Learning    |
| `ai.suggestion.rejected`  | Suggestion rejected   | Metrics, Learning    |
| `ai.analysis.completed`   | Analysis finished     | Knowledge Extraction |

### 12. User Events

| Event               | Trigger                  | Subscribers              |
| ------------------- | ------------------------ | ------------------------ |
| `user.joined`       | User joined organization | Onboarding, Notification |
| `user.role.changed` | Role updated             | Permission Cache         |
| `user.contributed`  | First contribution       | Celebration, Metrics     |

### 13. Task Events

| Event            | Trigger       | Subscribers           |
| ---------------- | ------------- | --------------------- |
| `task.created`   | Task created  | Assignment Suggestion |
| `task.assigned`  | Task assigned | Notification          |
| `task.completed` | Task done     | Metrics, Learning     |

### 14. Deployment Events

| Event                | Trigger              | Subscribers              |
| -------------------- | -------------------- | ------------------------ |
| `deploy.started`     | Deployment started   | Notification             |
| `deploy.completed`   | Deployment succeeded | Metrics, Release Linking |
| `deploy.failed`      | Deployment failed    | Alert, Rollback          |
| `deploy.rolled_back` | Rollback triggered   | Alert, Notification      |

### 15. System Events

| Event              | Trigger          | Subscribers |
| ------------------ | ---------------- | ----------- |
| `system.health`    | Health check     | Dashboard   |
| `system.backup`    | Backup completed | Log         |
| `system.migration` | Schema migration | Log         |

## Event Schema

```typescript
interface DomainEvent {
  id: string;
  type: EventType;
  aggregateId: string;
  aggregateType: string;
  data: Record<string, unknown>;
  metadata: EventMetadata;
  timestamp: Date;
  version: number;
}

interface EventMetadata {
  userId?: string;
  sessionId?: string;
  correlationId?: string;
  causationId?: string;
  source: string;
  aiGenerated?: boolean;
}

type EventType =
  | "repo.created"
  | "repo.updated"
  | "repo.archived"
  | "commit.pushed"
  | "branch.created"
  | "branch.deleted"
  | "release.published"
  | "release.drafted"
  | "issue.created"
  | "issue.updated"
  | "issue.assigned"
  | "pr.opened"
  | "pr.merged"
  | "pr.closed"
  | "review.comment"
  | "review.approved"
  | "knowledge.created"
  | "knowledge.updated"
  | "adr.proposed"
  | "adr.accepted"
  | "workflow.run.started"
  | "workflow.run.completed"
  | "mcp.installed"
  | "mcp.status.changed"
  | "ai.suggestion.generated"
  | "ai.analysis.completed"
  | "user.joined"
  | "user.contributed"
  | "deploy.started"
  | "deploy.completed"
  | "deploy.failed";
```

## Subscription Patterns

### Direct Subscription

```typescript
eventBus.on("pr.merged", async (event) => {
  await analyzeArchitecture(event.data.repositoryId);
  await extractKnowledge(event.data.pullRequestId);
  await updateMetrics(event.data);
});
```

### Pattern Subscription

```typescript
eventBus.on("pr.*", async (event) => {
  // React to all PR events
  await logActivity(event);
});
```

### Filtered Subscription

```typescript
eventBus.on(
  "commit.pushed",
  {
    filter: (event) => event.metadata.aiGenerated === false,
  },
  async (event) => {
    // Only human commits
    await analyzeCodePatterns(event.data);
  },
);
```

### Priority Subscription

```typescript
eventBus.on(
  "deploy.failed",
  {
    priority: "high",
  },
  async (event) => {
    // High priority - alert immediately
    await sendAlert(event.data);
  },
);
```

## Event History

Events are stored in memory (circular buffer of 1000) and can be queried:

```typescript
// Get recent events
const recent = eventBus.history({ limit: 50 });

// Get events by type
const prEvents = eventBus.history({ type: "pr.merged" });

// Get events by aggregate
const repoEvents = eventBus.history({ aggregateId: "repo-123" });

// Get events by time range
const todayEvents = eventBus.history({
  since: new Date(Date.now() - 86400000),
});
```

## Error Handling

```typescript
eventBus.on("commit.pushed", async (event) => {
  try {
    await analyzeCommit(event.data);
  } catch (error) {
    // EventBus will retry based on config
    throw error;
  }
});

// Dead letter queue for permanently failed events
eventBus.onDeadLetter(async (event, error) => {
  await logToDeadLetter(event, error);
  await notifyAdmins(event, error);
});
```

## Metrics

```typescript
// EventBus exposes metrics
const metrics = eventBus.metrics;

// metrics.totalEvents — total events processed
// metrics.eventsByType — events by type
// metrics.errors — error count
// metrics.averageProcessingTime — ms per event
// metrics.deadLetters — failed events
```

## Performance Targets

| Metric                   | Target                 |
| ------------------------ | ---------------------- |
| Event processing latency | < 100ms                |
| Event throughput         | 1000+ events/second    |
| History retention        | 1000 events in memory  |
| Retry attempts           | 3                      |
| Dead letter queue        | File-based persistence |

## Integration with BIN

The BIN intelligence loop consumes events from GitHub OS:

```typescript
// bhavya-intelligence-network subscribes to GitHub OS events
eventBus.on("pr.merged", async (event) => {
  await binEngine.process({
    type: "pr_activity",
    data: event.data,
  });
});

eventBus.on("knowledge.created", async (event) => {
  await binEngine.process({
    type: "knowledge_generated",
    data: event.data,
  });
});
```

## Integration with GIL

GIL research modules consume events for pattern extraction:

```typescript
// github-intelligence-lab subscribes to knowledge events
eventBus.on("knowledge.created", async (event) => {
  if (event.data.category === "architecture") {
    await gilArchitecture.analyze(event.data);
  }
});
```
