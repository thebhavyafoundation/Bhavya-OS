# Agents Contract v1.0.0

**Frozen:** 2026-08-07 | **Owner:** Agent Team | **Stability:** Stable

## Exports

### Agent Types
- `Agent` — Agent definition (from @bhavya/shared)
- `AgentStatus` — Agent status (from @bhavya/shared)
- `AgentConfig` — Agent configuration (from @bhavya/kernel)
- `AgentMetrics` — Agent metrics (from @bhavya/kernel)
- `AgentContext` — Agent context (from @bhavya/kernel)

### Agent Operations
- `createAgent()` — Create new agent
- `updateAgent()` — Update agent configuration
- `deleteAgent()` — Remove agent
- `getAgent()` — Get agent by ID
- `listAgents()` — List all agents

---

## Breaking Change Policy

1. **Major version bump** for removing/renaming exports
2. **Deprecation period:** 3 releases before removal
3. **Agent changes:** Must maintain backward compatibility

## Validation Schema

```json
{
  "type": "object",
  "required": ["id", "name", "status"],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "status": { "enum": ["idle", "busy", "error", "offline", "maintenance"] }
  }
}
```
