# Slice 4 — Known Limitations

## Current Limitations

### 1. Static Seed Data

All reviews, debt items, and recommendations are pre-seeded. Dynamic analysis from actual repository content would be significantly more useful.

**Impact:** Recommendations are generic, not specific to actual code.
**Mitigation:** Seed data demonstrates the UX pattern. Dynamic analysis is a future slice.

### 2. No Real-Time Scoring

Scores are static. When repository content changes, scores don't update automatically.

**Impact:** Scores may become stale.
**Mitigation:** Manual re-scoring via API endpoint (future work).

### 3. No Cross-Repository Analysis

Each repository is analyzed in isolation. Cross-repository patterns (shared debt, common architecture issues) are not surfaced.

**Impact:** Missed opportunities for organization-wide improvements.
**Mitigation:** Future slice could add portfolio-level analysis.

### 4. No AI Integration

The "Engineering Co-Founder" currently uses pre-seeded data, not live AI analysis. The AI would need to actually read repository content, analyze patterns, and generate recommendations.

**Impact:** Recommendations are not personalized to actual code.
**Mitigation:** AI integration is a future slice. The UX pattern is established.

### 5. No User Personalization

Student mode is the same for all users. Different experience levels would benefit from different content.

**Impact:** Advanced users may find content too basic; beginners may find it too advanced.
**Mitigation:** Future slice could add adaptive difficulty.

### 6. No Export/Share

Reviews, plans, and blueprints cannot be exported or shared with team members.

**Impact:** Limited collaboration value.
**Mitigation:** Future slice could add PDF/Markdown export.
