# Slice 2: Lessons Learned

## What Worked

### 1. Rich Seed Data

The quality of the UI demo is directly proportional to seed data richness. Generic descriptions like "A repository" don't demonstrate the system's value. Specific details like "Layered architecture with 11 shared packages. Foundation Layer → Data Layer → Communication Layer → Integration Layer → Presentation Layer" make the UI come alive.

### 2. Tab Navigation

8 tabs is the right count for repository detail. Each tab has a clear, distinct purpose:

- Overview: Quick summary
- README: Full content
- Architecture: Structure and patterns
- Tech Stack: Dependencies and tools
- Knowledge: Educational content
- Patterns: Design patterns
- ADRs: Decision records
- Learning: Learning path

Users can scan the tab bar and know exactly where to find information.

### 3. Score Visualization

The circular SVG score visualization is more engaging than a simple number. It creates a "gamification" feel that encourages users to improve their scores.

### 4. Comparison Power

The comparison page reveals commonalities that aren't obvious when viewing repos individually. Common patterns, dependencies, and technology are surfaced automatically.

### 5. Search + Filter + Sort

The trifecta is essential. Any one alone isn't enough for 8+ repositories. All three together make the list page genuinely useful.

## What Didn't Work

### 1. Separate API Calls for Related Data

Initially, the repository detail page made separate calls for patterns, ADRs, and knowledge. This created flickering and loading states. Fixed by combining into a single API response.

### 2. JSON State in URL

Considered persisting filter state to URL params for shareability. Decided against it for MVP — adds complexity without clear value at this scale.

### 3. Static Confidence Scores

Pattern confidence scores are static. In a real system, these would be computed from actual code analysis. The static scores work for demo but don't represent real intelligence.

## Key Insights

1. **UI quality = data quality** — Invest in seed data; it's the demo
2. **Tabs are powerful** — 8 tabs with clear purposes beat a single scrolling page
3. **Scores motivate** — Circular score visualizations create engagement
4. **Comparison reveals** — Side-by-side views surface hidden relationships
5. **Search is table stakes** — No search = unusable at scale

## Next Time

1. Start with seed data before building UI
2. Design API responses to minimize client-side requests
3. Build comparison early — it's a power feature
4. Consider mobile from the start (not just desktop)
5. Add ARIA labels during initial build, not as an afterthought
