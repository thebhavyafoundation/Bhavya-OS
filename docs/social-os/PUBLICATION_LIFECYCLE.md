# Social OS — Publication Lifecycle

## State Machine

```
                    ┌─────────────┐
                    │   DRAFT     │
                    └──────┬──────┘
                           │
                    submit_for_approval
                           │
                           ▼
                    ┌──────────────┐
              ┌─────│PENDING_APPROVAL│─────┐
              │     └──────┬──────┘     │
              │            │            │
         reject        approve       edit
              │            │            │
              ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │ REJECTED │ │ APPROVED │ │  EDITED  │
       └──────────┘ └─────┬────┘ └─────┬────┘
                          │            │
                    schedule      resubmit
                          │            │
                          ▼            │
                   ┌──────────┐        │
                   │SCHEDULED │        │
                   └─────┬────┘        │
                         │             │
                    publish            │
                         │             │
                         ▼             │
                   ┌──────────┐        │
                   │PUBLISHING│        │
                   └─────┬────┘        │
                         │             │
              ┌──────────┼──────────┐  │
              │          │          │  │
         success      failure   retry │
              │          │          │  │
              ▼          ▼          │  │
       ┌──────────┐ ┌──────────┐   │  │
       │PUBLISHED │ │ FAILED   │   │  │
       └─────┬────┘ └──────────┘   │  │
             │                      │  │
      collect_analytics             │  │
             │                      │  │
             ▼                      │  │
       ┌──────────────┐             │  │
       │  ANALYTICS   │             │  │
       │  COLLECTED   │             │  │
       └──────────────┘             │  │
```

## Transitions

| From             | To                  | Trigger             | Actor  |
| ---------------- | ------------------- | ------------------- | ------ |
| DRAFT            | PENDING_APPROVAL    | submit_for_approval | System |
| PENDING_APPROVAL | APPROVED            | approve             | Human  |
| PENDING_APPROVAL | REJECTED            | reject              | Human  |
| PENDING_APPROVAL | EDITED              | edit                | Human  |
| EDITED           | PENDING_APPROVAL    | resubmit            | Human  |
| APPROVED         | SCHEDULED           | schedule            | System |
| SCHEDULED        | PUBLISHING          | publish             | System |
| PUBLISHING       | PUBLISHED           | success             | System |
| PUBLISHING       | FAILED              | failure             | System |
| FAILED           | SCHEDULED           | retry               | System |
| PUBLISHED        | ANALYTICS_COLLECTED | collect_analytics   | System |

## Business Rules

### BR1 — Approval Gate

No publication reaches Postiz without explicit human approval. The system can draft, format, and schedule — but the final "publish" action requires a human `approve` event.

### BR2 — Edit Loop

If a human edits a publication, it returns to PENDING_APPROVAL. The human must re-approve after editing.

### BR3 — Retry Logic

Failed publications retry up to 3 times with exponential backoff (1min, 5min, 15min). After 3 failures, status moves to FAILED and a notification is sent.

### BR4 — Scheduling Window

Publications can be scheduled up to 30 days in advance. The system suggests optimal posting times based on analytics data from GitHub OS research.

### BR5 — Analytics Collection

Analytics are collected 24 hours, 7 days, and 30 days after publishing. Each collection creates an AnalyticsSnapshot linked to the publication.

### BR6 — Batch Operations

Multiple publications can be approved, rejected, or rescheduled in a single action. Batch operations are atomic — either all succeed or all fail.

## Timeouts

| State            | Timeout             | Action                        |
| ---------------- | ------------------- | ----------------------------- |
| PENDING_APPROVAL | 48 hours            | Reminder notification         |
| PENDING_APPROVAL | 7 days              | Auto-reject with notification |
| SCHEDULED        | Past scheduled time | Publish immediately           |
| PUBLISHING       | 5 minutes           | Retry or fail                 |
| FAILED           | 24 hours            | Archive and notify            |
