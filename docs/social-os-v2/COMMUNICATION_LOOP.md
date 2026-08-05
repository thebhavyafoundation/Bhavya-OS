# Social OS v2 — Communication Loop

## Overview

The Autonomous Communication Loop is the event-driven lifecycle that connects every component of Bhavya Foundation's communication infrastructure.

## Loop Flow

```
GitHub OS
  ↓
Research
  ↓
Knowledge Package
  ↓
Content Factory
  ↓
Campaign Creation
  ↓
Editorial Calendar
  ↓
Constitution Validation
  ↓
Approval Queue
  ↓
Publishing
  ↓
Analytics
  ↓
Community Feedback
  ↓
GitHub OS Learning
```

## Implementation

The loop is implemented in `src/campaign/communication-loop.ts`.

### Entry Point

```typescript
runCommunicationLoop({
  knowledgePackageId: "kp-001",
  title: "How Large Language Models Work",
  summary: "...",
  domain: "AI",
  level: 1,
  channels: [
    "linkedin",
    "x",
    "website",
    "github",
    "youtube",
    "instagram",
    "newsletter",
    "discord",
  ],
});
```

### Loop Steps

1. **Create Campaign** — Knowledge Package Launch campaign
2. **Create Calendar Entries** — One entry per channel
3. **Create Publications** — One publication per platform
4. **Constitutional Validation** — 10-check validation
5. **Brand Review** — Automated brand consistency
6. **Auto-Approve** — If constitutional check passes
7. **Activate Campaign** — Set status to active
8. **Emit Events** — Loop completion event

### Event Processing

```typescript
processEvents();
```

Processes unprocessed events:

- `publication.published` → Updates campaign status
- `feedback.submitted` → Processes and classifies feedback
- `campaign.completed` → Updates campaign to completed

### Status Query

```typescript
getCommunicationLoopStatus();
```

Returns:

- Active campaigns count
- Pending publications
- Pending approvals
- Unprocessed events
- Feedback intelligence summary

## Event Types

| Event                        | Trigger                          | Handler                  |
| ---------------------------- | -------------------------------- | ------------------------ |
| content.ready                | Content Factory produces content | Creates publication      |
| publication.created          | Publication created              | Links to campaign        |
| publication.approved         | Approval granted                 | Updates status           |
| publication.published        | Content published                | Updates campaign         |
| campaign.created             | Campaign created                 | Logs                     |
| campaign.completed           | Campaign ends                    | Updates status           |
| feedback.submitted           | Community feedback               | Classifies and processes |
| communication.loop_completed | Loop finishes                    | Logs                     |
| analytics.feed               | Analytics collected              | Stores metrics           |

## API

### Launch KP Campaign

```http
POST /api/loop
{
  "action": "launch-kp",
  "knowledgePackageId": "kp-001",
  "title": "How Large Language Models Work",
  "summary": "...",
  "domain": "AI",
  "level": 1,
  "channels": ["linkedin", "x", "website"]
}
```

### Process Events

```http
POST /api/loop
{
  "action": "process-events"
}
```

### Get Status

```http
GET /api/loop
```
