# Events Contract v1.0.0

**Frozen:** 2026-08-07 | **Owner:** Event Team | **Stability:** Stable

## Exports

### Event Types
- `Event` — Event definition (from @bhavya/shared)
- `EventPriority` — Event priority (from @bhavya/shared)
- `EventType` — Event type (from @bhavya/shared)
- `EventStatus` — Event status (from @bhavya/shared)
- `EventHandler` — Event handler (from @bhavya/shared)

### Event Operations
- `emit()` — Emit event
- `on()` — Subscribe to event
- `off()` — Unsubscribe from event
- `once()` — Subscribe to event once
- `filter()` — Filter events

---

## Breaking Change Policy

1. **Major version bump** for removing/renaming exports
2. **Deprecation period:** 3 releases before removal
3. **Event changes:** Must maintain backward compatibility

## Validation Schema

```json
{
  "type": "object",
  "required": ["id", "type", "priority", "status"],
  "properties": {
    "id": { "type": "string" },
    "type": { "enum": ["system", "user", "agent", "task", "workflow", "memory", "knowledge"] },
    "priority": { "enum": ["low", "medium", "high", "critical"] },
    "status": { "enum": ["pending", "processing", "completed", "failed", "retrying"] }
  }
}
```
