# Platform Guarantees

These are the architectural promises that every contributor to the Bhavya Foundation platform must understand and respect. They are the principles that make the system coherent as it grows.

## 1. Single Publishing Pipeline

Every mission application publishes through `@bhavya/content-core`. There are no app-specific publication paths. This ensures consistent content format, single-point indexing, and predictable data flow.

```
Mission App → content-core → Knowledge → Library → Website
```

## 2. Knowledge Is the Canonical Institutional Index

Knowledge owns the entity registry, relationship graph, and search index. No other application maintains a competing index. If something should be discoverable, it must be indexed in Knowledge.

## 3. Library Never Stores Content

Library is a read-only consumption layer. It presents published knowledge without duplicating or transforming it. Content changes happen in content-core; Library reflects them.

## 4. Website Consumes Published Data

Website reads from the published content layer. It does not maintain its own content store. This ensures consistency between what Library presents and what Website displays.

## 5. Shared Models Are Versioned Within Major Releases

Within a major version (e.g., v1.x), shared models in content-core are backward-compatible:
- New types and functions may be added
- Existing type signatures will not change
- Deprecated features will be marked before removal

## 6. New Mission Apps Extend the Platform

New mission applications follow the established pattern:
- Import from `@bhavya/content-core`
- Use domain-specific repositories
- Publish through the standard contract
- Own only UI and application-specific workflows

Bypassing content-core is not permitted for new applications.

## 7. Domain Isolation

Mission domains (Research, Forest, Heritage, Volunteer) do not import from each other. They share only:
- Core models
- I/O utilities
- Publishing contract

Cross-domain queries go through Knowledge, not direct imports.

## 8. Filesystem Is the Source of Truth

Content is stored as JSON and Markdown files on disk. There is no separate database. This provides:
- Human-readable content
- Git-versioned history
- Simple deployment
- Easy debugging

## 9. Applications Are Thin

Applications own:
- UI presentation
- User interaction
- Route handling
- Application-specific workflows

Applications do not own:
- Content models
- Publication logic
- Entity extraction
- Search indexing
- Knowledge graph management

## 10. Breaking Changes Are Deliberate

Breaking changes to the public API require a major version bump. Within a major version, the API surface is stable. Changes are documented in CHANGELOG.md before release.
