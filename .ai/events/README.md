---
id: EVT-SPEC
owner: Engineering
purpose: Append-only event log for AI agents
---

# Event Bus

Every AI agent emits structured events to `event-log.jsonl`.

## Format

Each line is a JSON object:

```json
{"time":"<ISO-8601>","type":"<event_type>","agent":"<agent_id>","data":{...}}
```

## Event Types

| Type | Description | Example Data |
|------|-------------|-------------|
| `session.start` | Agent session begins | `{task_id}` |
| `session.end` | Agent session ends | `{task_id, outcome}` |
| `task.completed` | Task finished | `{task, files}` |
| `task.blocked` | Task hit blocker | `{task, reason}` |
| `file.created` | New file created | `{path}` |
| `file.modified` | File edited | `{path}` |
| `file.deleted` | File removed | `{path}` |
| `decision.made` | Architecture decision | `{id, title}` |
| `release.certified` | Release certified | `{version}` |
| `build.passed` | Build succeeded | `{command}` |
| `build.failed` | Build failed | `{command, error}` |
| `validation.passed` | Validation passed | `{check}` |
| `validation.failed` | Validation failed | `{check, error}` |

## Agents Append Only

- Never edit or delete existing lines.
- Always append to the end.
- One JSON object per line.
- Use ISO-8601 timestamps.
