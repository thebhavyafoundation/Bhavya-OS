# Slice 2: Architecture Notes

## Component Architecture

### Page Components

- `RepositoriesPage` — List with search/filter/sort, state management for filters
- `RepositoryDetailPage` — Tabbed detail view, state for active tab
- `ComparisonsPage` — Comparison picker and results display

### Shared Components

- `Sidebar` — Reused from Slice 1, navigation backbone

### Data Flow

```
User Action → React State → fetch(`/api/...`) → SQLite Query → JSON Response → UI Update
```

## Database Design

### New Tables

```sql
engineering_patterns (
  id TEXT PRIMARY KEY,
  repository_id TEXT FK,
  pattern_name TEXT,
  confidence REAL,
  evidence TEXT,
  description TEXT
)

adrs (
  id TEXT PRIMARY KEY,
  repository_id TEXT FK,
  number INTEGER,
  title TEXT,
  status TEXT,
  context TEXT,
  decision TEXT,
  consequences TEXT
)

repository_comparisons (
  id TEXT PRIMARY KEY,
  repo_a_id TEXT FK,
  repo_b_id TEXT FK,
  comparison TEXT (JSON)
)
```

### Repository Table Extensions

18 new columns added to the existing `repositories` table, maintaining backward compatibility. All new columns have defaults.

## API Design

### Repository List

```
GET /api/repositories?search=...&language=...&maturity=...&recommendation=...&sort=...
```

Returns filtered/sorted repositories plus filter options.

### Repository Detail

```
GET /api/repositories/[id]
```

Returns full repository data plus related patterns, ADRs, and knowledge packages in a single request.

### Comparison

```
POST /api/comparisons { repo_a_id, repo_b_id }
```

Creates comparison, auto-generates analysis, stores result.

## Key Patterns

1. **Single-fetch detail** — Repository detail page fetches everything (repo + patterns + ADRs + knowledge) in one API call. Avoids N+1.
2. **Computed comparisons** — Comparison analysis is computed at creation time and stored as JSON. Fast reads, expensive writes (acceptable).
3. **Filter state in URL params** — Repository list filters are URL-searchable but not persisted to URL. Could be extended.
4. **JSON columns for flexibility** — `tech_stack`, `patterns`, `dependencies` are stored as JSON strings. Flexible schema without migrations.

## Scaling Considerations

- 8 repositories is well within SQLite limits
- Pattern detection is manual/seeded — real implementation would need AI integration
- Comparison storage grows linearly — could add TTL cleanup
- No pagination yet — would be needed at 50+ repositories
