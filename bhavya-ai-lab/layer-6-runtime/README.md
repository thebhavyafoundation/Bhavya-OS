# Layer 6 — Runtime

**BICM Version:** 1.0.0  
**Purpose:** Current execution state  

## Runtime State

This layer tracks current session state without persisting to disk.

### Session Data
- Current user context
- Active lesson/course
- Progress in current session
- Temporary calculations

### Rules
1. **Ephemeral** — Nothing here persists across sessions
2. **No secrets** — Runtime never stores sensitive data
3. **Reset-safe** — System works correctly after runtime reset
4. **Observable** — Runtime state can be inspected for debugging

## State Structure

```json
{
  "session": {
    "id": "session-uuid",
    "started": "2026-07-30T10:00:00Z",
    "user": "student-001",
    "context": "ko-ai-what-is-ai"
  },
  "progress": {
    "currentStep": 3,
    "totalSteps": 10,
    "score": null
  },
  "temp": {}
}
```

## Version History

| Date | Version | Change |
|------|---------|--------|
| 2026-07-30 | 1.0.0 | Initial runtime layer |
