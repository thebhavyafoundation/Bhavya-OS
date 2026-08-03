# Feature Audit — GitHub OS

## Classification

### Core (Must Have — 7 features):

| Feature                 | Rationale                            |
| ----------------------- | ------------------------------------ |
| Repository listing      | Discovery and navigation — essential |
| Repository detail       | Core interaction point               |
| Engineering assessment  | "Co-founder" value proposition       |
| Learning mode           | Educational value proposition        |
| Pattern library         | Unique knowledge value               |
| Technical debt tracking | Actionable engineering insight       |
| Implementation planning | Strategic engineering value          |

### Important (Should Have — 4 features):

| Feature                 | Rationale                                |
| ----------------------- | ---------------------------------------- |
| Dashboard               | Entry point (needs simplification)       |
| Educational exports     | Instructor value                         |
| Command palette         | Power user efficiency                    |
| Architecture comparison | Senior engineer value (as tab, not page) |

### Nice to Have (Could Remove — 5 features):

| Feature              | Rationale                                |
| -------------------- | ---------------------------------------- |
| Knowledge Graph      | Visual candy, low practical value        |
| Comparisons          | Side-by-side scores don't help decisions |
| Institutional Memory | Only 2 entries per repo, low value       |
| Timeline             | GitHub does this better                  |
| Elite Library        | Overlaps with Pattern Library            |

### Redundant (Should Remove — 4 features):

| Feature                           | Duplicate Of           |
| --------------------------------- | ---------------------- |
| Engineering Health                | Repository Fitness     |
| Repository Fitness                | Engineering Review     |
| Architecture Advisor (standalone) | Engineering Advisor    |
| Build Blueprint (standalone)      | Implementation Planner |

### Experimental (Evaluate — 1 feature):

| Feature         | Status                      |
| --------------- | --------------------------- |
| Command Palette | Useful but needs refinement |

---

## Feature Count Summary

| Category     | Count  |
| ------------ | ------ |
| Core         | 7      |
| Important    | 4      |
| Nice to Have | 5      |
| Redundant    | 4      |
| Experimental | 1      |
| **Total**    | **21** |

### Recommended Reduction:

- Remove Nice to Have: -5
- Remove Redundant: -4
- **Net: 12 features (43% reduction)**

---

## Feature Dependency Map

```
Dashboard
  ├── Repository List (core)
  │   └── Repository Detail (core)
  │       ├── Overview (core)
  │       ├── Architecture (core)
  │       ├── Knowledge (core)
  │       ├── Advisor (core) ← absorbs Review, Fitness, Health, Arch Advisor
  │       └── Plan (core) ← absorbs Blueprint
  ├── Pattern Library (core)
  ├── Learning Mode (core) ← absorbs Student Mode
  └── Technical Debt (core)

Educational Exports (important)
Command Palette (important)
```

**Total features after merge: 12**
