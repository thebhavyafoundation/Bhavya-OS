# content-core Architecture

## Overview

content-core is the single source of truth for all content in the Bhavya Foundation platform. It follows a layered architecture:

```
Mission Apps (Research, Forest, Heritage, Volunteer)
    |
    v
content-core (models, repositories, publishing)
    |
    v
Knowledge (indexing, entities, relationships, search)
    |
    v
Library (public consumption)
    |
    v
Website (presentation)
```

## Design Principles

### 1. One Publishing Pipeline

Every mission app publishes through the same contract. There are no app-specific publication paths. This ensures:
- Consistent content format across all sources
- Single point of indexing for Knowledge
- Predictable data flow to Library and Website

### 2. Domain Isolation

Each domain (Research, Forest, Heritage, Volunteer) has its own module with:
- Domain-specific types
- Domain-specific repository functions
- Auto-publishing on create operations
- No cross-domain dependencies

Domains never import from each other. They only share:
- Core models (Document, Entity, Relationship)
- I/O utilities
- Publishing contract

### 3. Filesystem as Database

Content is stored as JSON and Markdown files on disk. This provides:
- Human-readable content
- Git-versioned data
- Simple deployment (no database server)
- Easy debugging and manual intervention

### 4. Thin Application Layer

Applications consume content-core but own no business logic for content management. They are responsible for:
- UI presentation
- User interaction
- Route handling
- Application-specific workflows

## Module Structure

```
packages/content-core/
  src/
    index.ts          # Public API surface
    models.ts         # Core type definitions
    io.ts             # Filesystem utilities
    documents.ts      # Document repository
    collections.ts    # Collection repository
    entities.ts       # Entity extraction and repository
    graph.ts          # Knowledge graph
    search.ts         # Search indexing
    research.ts       # Research domain
    forest.ts         # Forest domain
    heritage.ts       # Heritage domain
    volunteer.ts      # Volunteer domain
    publish.ts        # Publishing contract
```

## Data Flow

### Write Path (Mission App → Knowledge)

1. Mission app calls `createMission()` (or similar)
2. Domain module saves JSON to `content/{domain}/`
3. Domain module calls `publishFieldReport()` (or similar)
4. Publishing function writes to `content/knowledge/`
5. Knowledge indexes the new content automatically

### Read Path (Knowledge → Library → Website)

1. Knowledge reads from `content/knowledge/`
2. Library reads published content
3. Website reads from Library's API

## Type Hierarchy

```
Document (base)
  ├── ResearchProject
  ├── Mission (Forest)
  ├── HeritageMission
  └── Volunteer

Entity (knowledge index)
  └── Linked to Documents via Relationships

Source → Evidence → ResearchProject
Site → Survey/Planting/Monitoring → Mission
HeritageSite → HeritageAsset → Assessment/Documentation/ConservationPlan
Volunteer → Training/MissionAssignment/Participation/Recognition
```

## Publishing Contract

The `PublicationRequest` interface:

```typescript
interface PublicationRequest {
  source: string;           // e.g., "forest", "heritage", "volunteer"
  entityType: string;       // e.g., "mission", "site", "impact"
  entityId: string;         // Domain-specific ID
  title: string;
  content: string;          // Full content or summary
  summary: string;          // Brief description
  tags?: string[];
  visibility?: Visibility;  // "public" | "internal" | "private"
  documentType?: DocumentType;
}
```

## What Is Intentionally Not Here

- **No authentication** — Content is open within the platform
- **No validation beyond types** — Runtime validation is the app's responsibility
- **No caching** — Filesystem reads are the caching layer
- **No real-time** — Polling or webhook-based updates
- **No external APIs** — Platform-internal only
