# Slice 3: Known Limitations

## Current Limitations

### 1. Static Graph Layout

- Knowledge graph uses circular positioning by node type
- No force-directed physics simulation
- No drag-and-drop repositioning
- No zoom/pan interaction
- **Mitigation:** Works for 15 nodes; would need D3.js or similar for interactive graph

### 2. Static Health Scores

- Engineering health scores are manually seeded
- No real-time metric collection
- No CI/CD integration for test coverage
- No dependency freshness checking
- **Mitigation:** Schema supports real metrics; collection is a future integration

### 3. Static Learning Paths

- Learning paths are predefined content
- No AI-powered path generation
- No adaptive difficulty based on user progress
- No progress tracking
- **Mitigation:** Structure supports dynamic content; AI integration is a future slice

### 4. Manual Timeline Events

- Timeline events are manually created
- No webhook integration for releases
- No ADR creation workflow
- No technology adoption tracking
- **Mitigation:** Schema supports automated events; integration is a future feature

### 5. No AI Mentor

- AI repository mentor not implemented
- No "Explain architecture" functionality
- No "Recommend reading order" generation
- No "Answer repository questions" capability
- **Mitigation:** Uses existing AI platform; integration is straightforward

### 6. No Pattern Detection

- Patterns are manually assigned to repositories
- No code analysis for pattern detection
- No confidence scoring from actual code
- **Mitigation:** Schema supports dynamic patterns; AI analysis is a future feature

### 7. No Educational Export Generation

- Educational exports are static content
- No AI-powered content generation
- No customization based on audience
- No versioning of educational materials
- **Mitigation:** Structure supports dynamic content; generation is a future feature

### 8. No Institutional Memory Auto-Population

- Memory Q&A is manually created
- No automatic knowledge extraction
- No cross-referencing from other systems
- **Mitigation:** Schema supports auto-population; extraction is a future feature

## Technical Debt

1. **Graph rendering** — SVG graph doesn't scale beyond 50 nodes
2. **Health calculation** — No actual metric collection behind scores
3. **Learning paths** — Static content, not generated from code analysis
4. **Timeline** — Manual events, not automated from git/CI
5. **Memory** — Manual Q&A, not extracted from documentation

## Future Work

- D3.js force-directed graph with zoom/pan
- Real health metric collection from GitHub API
- AI-powered learning path generation
- Webhook integration for timeline events
- Code analysis for pattern detection
- AI educational content generation
- Automatic institutional memory extraction
- Progress tracking for learning paths
