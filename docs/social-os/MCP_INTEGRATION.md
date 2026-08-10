# Social OS — MCP Integration

## Architecture

Social OS consumes Postiz through its MCP server, enabling AI agents to manage social publishing through natural language.

```
┌─────────────────────────────────────────────────────────┐
│                    OpenCode (AI Agent)                    │
│                                                          │
│  "Post the new Knowledge Package to LinkedIn and X"      │
│                                                          │
└──────────────────────┬──────────────────────────────────┘
                       │ MCP Protocol
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    Social OS                              │
│                                                          │
│  1. Receives publishing request                          │
│  2. Formats content for each platform                    │
│  3. Creates publication draft                            │
│  4. Submits for human approval                           │
│  5. On approval, calls Postiz MCP                        │
│                                                          │
└──────────────────────┬──────────────────────────────────┘
                       │ MCP Protocol
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    Postiz MCP Server                      │
│                                                          │
│  Tools:                                                  │
│  - schedulePostTool                                      │
│  - integrationList                                       │
│  - integrationSchema                                     │
│  - generateImageTool                                     │
│  - generateVideoTool                                     │
│                                                          │
└──────────────────────┬──────────────────────────────────┘
                       │ API
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Social Platforms                             │
│  LinkedIn · X · GitHub · YouTube · Instagram · ...       │
└─────────────────────────────────────────────────────────┘
```

## MCP Tools Available

### Postiz MCP Tools (via Postiz server)

| Tool                   | Description                    |
| ---------------------- | ------------------------------ |
| `integrationList`      | List connected social accounts |
| `integrationSchema`    | Get platform posting rules     |
| `schedulePostTool`     | Schedule or publish posts      |
| `generateImageTool`    | Generate AI images for posts   |
| `generateVideoOptions` | Explore video options          |
| `generateVideoTool`    | Create videos for posts        |

### Social OS MCP Tools (exposed to OpenCode)

| Tool                          | Description                   |
| ----------------------------- | ----------------------------- |
| `social_create_publication`   | Create a publication draft    |
| `social_submit_for_approval`  | Submit draft for human review |
| `social_approve_publication`  | Approve a pending publication |
| `social_reject_publication`   | Reject a pending publication  |
| `social_list_publications`    | List publications by status   |
| `social_get_publication`      | Get publication details       |
| `social_get_analytics`        | Get engagement metrics        |
| `social_schedule_publication` | Schedule approved publication |

## OpenCode Configuration

```json
{
  "mcp": {
    "postiz": {
      "type": "local",
      "command": ["npx", "-y", "@postiz/mcp-server"],
      "environment": {
        "POSTIZ_API_URL": "http://localhost:3000/api",
        "POSTIZ_API_KEY": "your-api-key"
      },
      "enabled": true
    }
  }
}
```

## Data Flow

### 1. AI Creates Publication

```
OpenCode → Social OS MCP → Create publication draft
```

### 2. Human Approves

```
Founder → Social OS UI → Approve publication
```

### 3. System Publishes

```
Social OS → Postiz MCP → schedulePostTool → Platform
```

### 4. Analytics Collected

```
Postiz API → Social OS → Analytics stored → GitHub OS notified
```

## Error Handling

| Error                           | Handling                              |
| ------------------------------- | ------------------------------------- |
| Postiz API unavailable          | Queue publication, retry in 5 minutes |
| Platform rate limit             | Reschedule to next available slot     |
| Authentication expired          | Notify founder, pause publishing      |
| Content exceeds platform limits | Auto-truncate with notification       |
| MCP timeout                     | Retry up to 3 times                   |
