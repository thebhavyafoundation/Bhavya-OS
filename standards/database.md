# Database Standard

**Status:** published
**Date:** 2026-07-15
**Owner:** Engineering Team

## Purpose

Define database standards for the Bhavya Foundation platform.

## Current Approach

The platform uses filesystem-based storage:

- **JSON files**: Structured data (entities, relationships, documents)
- **Markdown files**: Content with frontmatter
- **Directory structure**: Logical organization

## Data Organization

```
data/
  documents/        # Document content
  entities/         # Entity definitions
  relationships.json # Knowledge graph edges
  collections/      # Content collections
```

## JSON Standards

### Schema Validation

- Use TypeScript interfaces for data shapes
- Validate data at application boundaries
- Default values for optional fields

### File Naming

- Use descriptive filenames: `volunteer-001.json`
- Avoid spaces and special characters
- Use lowercase with hyphens

### Data Integrity

- Immutable records (append-only for history)
- Unique IDs across the platform
- Timestamps for creation and updates

## Future Considerations

If the platform outgrows filesystem storage:
1. Evaluate SQLite for local development
2. Consider PostgreSQL for production
3. Maintain API compatibility
