# @bhavya/mission-runtime — Contract v1.0.0

**Frozen:** 2026-08-07 | **Author:** Wave 4 Consolidation | **Status:** ACTIVE

## Exports

### Core Types
- `Mission` — Mission definition
- `MissionStep` — Step in a mission
- `MissionConfig` — Configuration
- `MissionMetrics` — Performance metrics

### Event System
- `BhavyaEvent` — Event instance (from @bhavya/shared)
- `EventPriority` — Priority level (from @bhavya/shared)
- `EventType` — Event type (from @bhavya/shared)
- `EventStatus` — Event status (from @bhavya/shared)

### Integration
- Imports all event types from `@bhavya/shared`
- Does NOT duplicate type definitions

---

## Breaking Change Policy

1. **Major version bump** for removing/renaming exports
2. **Deprecation period:** 3 releases before removal
