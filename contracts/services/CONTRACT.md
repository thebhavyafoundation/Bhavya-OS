# Services Contract v1.0.0

**Frozen:** 2026-08-07 | **Owner:** Service Team | **Stability:** Stable

## Exports

### Service Types
- `Service` — Service definition
- `ServiceConfig` — Service configuration
- `ServiceMetadata` — Service metadata
- `ServiceStatus` — Service status

### Service Operations
- `register()` — Register service
- `deregister()` — Deregister service
- `discover()` — Discover services
- `health()` — Health check
- `metrics()` — Get metrics

---

## Breaking Change Policy

1. **Major version bump** for removing/renaming exports
2. **Deprecation period:** 3 releases before removal
3. **Service changes:** Must maintain backward compatibility

## Validation Schema

```json
{
  "type": "object",
  "required": ["name", "version", "status"],
  "properties": {
    "name": { "type": "string" },
    "version": { "type": "string" },
    "status": { "enum": ["running", "stopped", "error"] }
  }
}
```
