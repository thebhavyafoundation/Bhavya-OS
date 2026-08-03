# Slice 1 — Known Limitations

## Current Limitations

### 1. No Authentication

**Impact:** Medium
**Status:** Intentional for v1.0
**Mitigation:** Add NextAuth in Slice 2

### 2. Static Data

**Impact:** Low
**Status:** Seed data for demo
**Mitigation:** Connect to real data sources in later slices

### 3. No Real-Time Updates

**Impact:** Medium
**Status:** Dashboard shows snapshot
**Mitigation:** Add WebSocket or polling in Slice 3

### 4. Basic Search

**Impact:** Medium
**Status:** Simple LIKE queries
**Mitigation:** Add FTS5 full-text search in Slice 2

### 5. No Mobile Layout

**Impact:** Low
**Status:** Desktop-first
**Mitigation:** Add responsive design in Slice 6

### 6. No Accessibility Audit

**Impact:** Medium
**Status:** Basic ARIA labels
**Mitigation:** Full audit in Slice 6

### 7. No Tests

**Impact:** High
**Status:** Build passes, no tests
**Mitigation:** Add Vitest in Slice 2

### 8. No Error Boundaries

**Impact:** Medium
**Status:** Basic error handling
**Mitigation:** Add error boundaries in Slice 2

### 9. No Loading States

**Impact:** Low
**Status:** Direct render
**Mitigation:** Add skeleton loaders in Slice 2

### 10. No TypeScript Strict Mode

**Impact:** Low
**Status:** Relaxed for speed
**Mitigation:** Enable strict in Slice 2
