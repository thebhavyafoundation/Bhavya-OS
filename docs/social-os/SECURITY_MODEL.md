# Social OS — Security Model

## Security Principles

1. **Least privilege.** Social OS only has access to the platforms it needs to publish to.
2. **No token storage.** OAuth tokens are managed by Postiz, not Social OS.
3. **Human approval.** No content publishes without explicit human approval.
4. **Audit trail.** Every action is logged and traceable.
5. **Encryption.** All secrets encrypted at rest and in transit.

## Authentication

### Postiz API Authentication

```typescript
// API key authentication
const postizAuth = {
  type: "api_key",
  header: "Authorization",
  prefix: "ApiKey",
  key: process.env.POSTIZ_API_KEY, // Stored in environment variables
};
```

### Platform Authentication

Platform OAuth tokens are managed by Postiz:

```
Social OS → Postiz API → Platform OAuth
```

Social OS never handles raw OAuth tokens. Postiz handles:

- Token storage
- Token refresh
- Platform compliance
- Rate limiting

## Authorization

### Role-Based Access

| Role    | Permissions                                            |
| ------- | ------------------------------------------------------ |
| Founder | Full access: approve, reject, edit, publish, analytics |
| Admin   | View publications, view analytics, cannot approve      |
| Editor  | Create publications, cannot approve                    |
| Viewer  | View only                                              |

### Publication Approval

```
┌─────────────────────────────────────────────────────────┐
│                    APPROVAL GATE                          │
│                                                          │
│  System creates draft                                    │
│       │                                                  │
│       ▼                                                  │
│  Draft visible to Founder                                │
│       │                                                  │
│       ▼                                                  │
│  Founder reviews (approve/reject/edit)                   │
│       │                                                  │
│       ▼                                                  │
│  Only approved publications reach Postiz                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Data Security

### Secrets Management

| Secret               | Storage              | Access         |
| -------------------- | -------------------- | -------------- |
| Postiz API key       | Environment variable | Social OS only |
| Postiz MCP URL       | Environment variable | Social OS only |
| Platform tokens      | Postiz database      | Postiz only    |
| Database credentials | Environment variable | Social OS only |

### Encryption

| Data                | At Rest               | In Transit |
| ------------------- | --------------------- | ---------- |
| Publication content | Database encryption   | TLS 1.3    |
| API keys            | Environment variables | TLS 1.3    |
| Analytics data      | Database encryption   | TLS 1.3    |
| User credentials    | Postiz handles        | TLS 1.3    |

### Data Classification

| Data Type           | Classification | Handling                     |
| ------------------- | -------------- | ---------------------------- |
| Publication content | Internal       | Standard storage             |
| API keys            | Confidential   | Encrypted, access-controlled |
| OAuth tokens        | Confidential   | Postiz-managed, encrypted    |
| Analytics           | Internal       | Standard storage             |
| User PII            | Confidential   | Encrypted, access-controlled |

## Audit Trail

Every action in Social OS is logged:

```json
{
  "auditId": "uuid",
  "timestamp": "2026-08-05T10:30:00Z",
  "actor": "founder@bhavya.org",
  "action": "publication.approved",
  "resource": "publication:uuid",
  "details": {
    "publicationTitle": "KP-001: How LLMs Work",
    "platforms": ["linkedin", "x"],
    "scheduledAt": "2026-08-06T09:00:00Z"
  },
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

### Audit Log Retention

| Log Type            | Retention |
| ------------------- | --------- |
| Publication actions | 2 years   |
| Approval decisions  | 2 years   |
| API calls           | 90 days   |
| Error logs          | 30 days   |
| Access logs         | 90 days   |

## Compliance

### Constitutional Compliance

Every publication must comply with Bhavya Foundation's Constitutional Documents:

| Document              | Relevance                       |
| --------------------- | ------------------------------- |
| 01_The Constitution   | Institutional authority         |
| 06_Code_Of_Ethics     | Content ethics                  |
| 13_AI_Ethics          | AI-generated content disclosure |
| 15_Brand_Constitution | Brand consistency               |

### Platform Compliance

Social OS ensures compliance with each platform's terms of service:

| Platform  | Key Compliance                                     |
| --------- | -------------------------------------------------- |
| LinkedIn  | No spam, professional content, proper formatting   |
| X         | No automation abuse, rate limits, content policies |
| GitHub    | No spam, technical content, community guidelines   |
| YouTube   | Content policies, copyright, community guidelines  |
| Instagram | Content policies, no spam, visual quality          |

### AI Content Disclosure

When content is AI-generated, Social OS includes appropriate disclosure:

```
This content was created with AI assistance and reviewed by humans.
```

## Incident Response

| Incident            | Response                                         |
| ------------------- | ------------------------------------------------ |
| Unauthorized access | Revoke all API keys, notify founder, audit logs  |
| Data breach         | Notify founder, assess scope, report if required |
| Platform suspension | Pause publishing, investigate, appeal            |
| Content violation   | Remove content, notify founder, review process   |
| System compromise   | Isolate system, investigate, restore from backup |
