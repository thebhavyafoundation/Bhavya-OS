# Snapshot: Daily

## Description

Daily project snapshot for rollback and tracking.

## Contents

- Website state
- Components state
- Architecture state
- Registry state
- Knowledge graph state

## Schedule

- Daily at midnight UTC
- Keep 30 days
- Archive old snapshots

## Usage

```bash
# Create snapshot
pnpm snapshot:create

# Restore snapshot
pnpm snapshot:restore [snapshot-id]

# List snapshots
pnpm snapshot:list
```

## Snapshot Format

```json
{
  "id": "snapshot-2026-07-27",
  "timestamp": "2026-07-27T00:00:00Z",
  "version": "0.1.0",
  "contents": {
    "website": "...",
    "components": "...",
    "architecture": "...",
    "registry": "...",
    "knowledgeGraph": "..."
  }
}
```
