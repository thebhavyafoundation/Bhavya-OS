# Plugins Contract v1.0.0

**Frozen:** 2026-08-07 | **Owner:** Plugin Team | **Stability:** Stable

## Exports

### Plugin Types
- `Plugin` — Plugin definition
- `PluginConfig` — Plugin configuration
- `PluginMetadata` — Plugin metadata
- `PluginStatus` — Plugin status

### Plugin Operations
- `install()` — Install plugin
- `uninstall()` — Uninstall plugin
- `enable()` — Enable plugin
- `disable()` — Disable plugin
- `configure()` — Configure plugin

---

## Breaking Change Policy

1. **Major version bump** for removing/renaming exports
2. **Deprecation period:** 3 releases before removal
3. **Plugin changes:** Must maintain backward compatibility

## Validation Schema

```json
{
  "type": "object",
  "required": ["name", "version", "status"],
  "properties": {
    "name": { "type": "string" },
    "version": { "type": "string" },
    "status": { "enum": ["active", "inactive", "error"] }
  }
}
```
