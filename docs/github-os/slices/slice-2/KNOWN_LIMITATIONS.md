# Slice 2: Known Limitations

## Current Limitations

### 1. Static Data

- All repository data is manually seeded
- No GitHub API integration for live data
- Patterns, ADRs, and knowledge packages are static
- **Mitigation:** Seed data represents the full schema and UI capabilities

### 2. No Real-time Pattern Detection

- Engineering patterns are manually assigned
- No AI-powered pattern analysis
- Confidence scores are static
- **Mitigation:** Schema supports dynamic patterns; AI integration is a future slice

### 3. No ADR Creation

- ADRs are read-only in the UI
- No workflow for creating new ADRs
- No ADR status transitions
- **Mitigation:** ADR creation is a separate feature (Slice 3+)

### 4. No Knowledge Package Creation

- Knowledge packages are seeded
- No UI for creating or editing packages
- No quality score calculation
- **Mitigation:** Knowledge Studio app handles this

### 5. No Authentication

- All data is publicly accessible
- No user-specific views or permissions
- **Mitigation:** Auth is a platform-level concern, not slice-specific

### 6. No Pagination

- Repository list loads all items at once
- Works for 8 repos, would break at 50+
- **Mitigation:** Easy to add with SQLite LIMIT/OFFSET

### 7. Comparison Storage

- Comparisons stored as JSON blobs
- No comparison analytics or trends
- No comparison deletion
- **Mitigation:** Sufficient for MVP; analytics is a future feature

### 8. No Cross-repository Analysis

- No dependency graph visualization
- No shared code detection
- No architectural relationship mapping
- **Mitigation:** Requires GitHub API integration

## Technical Debt

1. **Type safety** — JSON columns lose type safety at the database level
2. **Error handling** — API routes have basic error handling; needs comprehensive validation
3. **Loading states** — Skeleton loaders are basic; could be more sophisticated
4. **Responsive design** — Desktop-first; mobile layout needs work
5. **Accessibility** — No ARIA labels, keyboard navigation is partial

## Future Work

- GitHub API integration for live data
- AI-powered pattern detection
- ADR creation workflow
- Knowledge package editor
- User authentication and permissions
- Pagination and infinite scroll
- Comparison analytics and trends
- Dependency graph visualization
- Mobile responsive design
- Accessibility improvements
