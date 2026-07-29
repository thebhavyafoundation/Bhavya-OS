# @bhavya/content-core

The canonical content platform for Bhavya Foundation. Every mission application publishes through this package. Knowledge indexes it. Library presents it. Website displays it.

## Purpose

content-core owns:
- **Shared data models** — Document, Entity, Relationship, Citation, Source, Evidence
- **Domain repositories** — Research, Forest, Heritage, Volunteer
- **Publishing pipeline** — Unified contract for mission apps to publish to Knowledge
- **Knowledge graph** — Entities, relationships, and search indexing
- **I/O utilities** — Filesystem operations for reading/writing content

## Quick Start

```typescript
import {
  // Documents
  getDocuments, getDocument,
  // Entities
  getEntities, getEntity,
  // Publishing
  publishKnowledge, publishFieldReport,
  // Domain-specific
  getMissions, createMission,
  getProjects, createProject,
  getHeritageMissions, createHeritageMission,
  getVolunteers, createVolunteer,
} from "@bhavya/content-core";
```

## Installation

```json
{
  "dependencies": {
    "@bhavya/content-core": "workspace:*"
  }
}
```

## How Applications Use It

Every mission app follows the same pattern:

1. Import from `@bhavya/content-core`
2. Call repository functions (get/create/update)
3. Publishing happens automatically on create operations
4. App-specific UI consumes the data

```typescript
// Example: Forest app creating a mission
import { createMission } from "@bhavya/content-core";

const mission = createMission({
  name: "Himachal Reforestation",
  description: "Restore 500 hectares",
  region: "Himachal Pradesh",
  goals: ["Plant 10,000 trees", "Restore watershed"],
});

// Automatically publishes to Knowledge via publishFieldReport
```

## What Is Intentionally Not Here

- **UI components** — Owned by `@bhavya/ui`
- **Theme/branding** — Owned by `@bhavya/branding`
- **Application-specific logic** — Owned by each app
- **Presentation layer** — Owned by Library and Website
- **Authentication/authorization** — Not yet implemented
- **Real-time subscriptions** — Not yet implemented
- **External integrations** — Not yet implemented

## Modules

| Module | Purpose |
|--------|---------|
| `models` | Core type definitions (Document, Entity, Relationship, etc.) |
| `io` | Filesystem utilities (readJSON, writeJSON, listDir) |
| `documents` | Document repository with markdown/JSON parsing |
| `collections` | Document collections (11 default collections) |
| `entities` | Entity extraction and repository |
| `graph` | Knowledge graph and relationships |
| `search` | Search indexing and content stats |
| `research` | Research projects, sources, evidence, reviews |
| `forest` | Forest missions, sites, surveys, plantings, monitoring, impact |
| `heritage` | Heritage missions, assets, assessments, conservation |
| `volunteer` | Volunteers, skills, training, assignments, recognition |
| `publish` | Unified publishing pipeline to Knowledge |

## Versioning

content-core follows semver within the v1.x range. Breaking changes will increment the major version. Within v1.x:
- New functions may be added
- Existing functions will not have breaking signature changes
- Types may be extended but not removed
