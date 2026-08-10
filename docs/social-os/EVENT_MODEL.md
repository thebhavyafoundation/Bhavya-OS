# Social OS — Event Model

## Event Types

### Content Pipeline Events (Inbound)

| Event                         | Source           | Description                         |
| ----------------------------- | ---------------- | ----------------------------------- |
| `content.ready`               | Content Factory  | New content is ready for publishing |
| `content.updated`             | Content Factory  | Existing content was modified       |
| `knowledge_package.published` | Knowledge Studio | KP reached approved status          |
| `blog.published`              | Website          | Blog post went live                 |
| `announcement.created`        | Founder          | Manual announcement created         |

### Publication Lifecycle Events (Internal)

| Event                                | Description                         |
| ------------------------------------ | ----------------------------------- |
| `publication.created`                | Draft created in queue              |
| `publication.formatted`              | Platform-specific content generated |
| `publication.submitted_for_approval` | Sent to founder for review          |
| `publication.approved`               | Founder approved publication        |
| `publication.rejected`               | Founder rejected publication        |
| `publication.edited`                 | Founder edited and resubmitted      |
| `publication.scheduled`              | Publication scheduled in Postiz     |
| `publication.publishing`             | Publication in progress             |
| `publication.published`              | Successfully published              |
| `publication.failed`                 | Publishing failed                   |

### Analytics Events (Inbound)

| Event                        | Source                       | Description                       |
| ---------------------------- | ---------------------------- | --------------------------------- |
| `analytics.collected`        | Postiz (via polling/webhook) | Engagement metrics available      |
| `analytics.threshold_met`    | Social OS                    | Post reached engagement threshold |
| `analytics.anomaly_detected` | Social OS                    | Unusual engagement pattern        |

### Research Events (Outbound)

| Event                         | Target    | Description                      |
| ----------------------------- | --------- | -------------------------------- |
| `research.feed`               | GitHub OS | Analytics data for research loop |
| `research.trending`           | GitHub OS | Platform-specific trend data     |
| `research.engagement_pattern` | GitHub OS | Best posting times, formats      |

## Event Schema

```json
{
  "eventId": "uuid",
  "eventType": "publication.created",
  "timestamp": "2026-08-05T10:30:00Z",
  "source": "social-os",
  "data": {
    "publicationId": "uuid",
    "title": "KP-001: How LLMs Work",
    "platforms": ["linkedin", "x", "github"],
    "status": "draft",
    "priority": "normal",
    "source": {
      "type": "knowledge_package",
      "knowledgePackageId": "KP-001",
      "version": "1.0.0"
    }
  },
  "metadata": {
    "correlationId": "uuid",
    "causationId": "uuid"
  }
}
```

## Event Routing

```
Content Factory
    │
    ├── content.ready ──────────► Social OS
    ├── knowledge_package.published ──► Social OS
    └── blog.published ──────────────► Social OS
                                        │
                                        ▼
                                   Publication Queue
                                        │
                                        ▼
                                   Approval Gate
                                        │
                                        ├── approved ──► Postiz API
                                        └── rejected ──► Notification
                                        │
                                        ▼
                                   Postiz Publishing
                                        │
                                        ▼
                                   Analytics Collection
                                        │
                                        ▼
                                   GitHub OS Research
```

## Event Guarantees

- **At-least-once delivery:** Events may be delivered multiple times. Handlers must be idempotent.
- **Ordering:** Events within a single publication are ordered. Events across publications are not.
- **Persistence:** All events stored in event log for audit trail.
- **Retry:** Failed event processing retries 3 times with exponential backoff.
