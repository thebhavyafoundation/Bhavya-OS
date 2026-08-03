# Simplification Plan — GitHub OS

## Goal

Reduce from 20 pages to 10 pages. Remove redundancy. Clarify navigation. Establish clear product identity.

---

## Phase 1: Remove Dead Links (Immediate)

### Remove from Sidebar:

| Link                | Status |
| ------------------- | ------ |
| Starred             | Dead   |
| Knowledge Base      | Dead   |
| Technology Radar    | Dead   |
| Recommendations     | Dead   |
| Issues              | Dead   |
| Pull Requests       | Dead   |
| Releases            | Dead   |
| Workflows           | Dead   |
| MCP Servers         | Dead   |
| Actions Library     | Dead   |
| Learning Paths      | Dead   |
| Resources           | Dead   |
| Engineering Metrics | Dead   |
| Team Performance    | Dead   |
| Settings            | Dead   |

**Action:** Remove all 15 dead links from Sidebar.

---

## Phase 2: Merge Redundant Pages (Core Work)

### Merge 1: Engineering Assessment

**Target:** Engineering Advisor (`/repositories/[id]/advisor`)

**Absorb:**

- Engineering Review (`/repositories/[id]/review`) → "Review" tab in Advisor
- Repository Fitness (`/repositories/[id]/fitness`) → "Fitness" tab in Advisor
- Engineering Health (`/repositories/[id]/health`) → "Health" tab in Advisor
- Architecture Advisor (`/repositories/[id]/architecture-advisor`) → "Compare" tab in Advisor

**Result:** One "Advisor" page with 5 tabs:

1. Overview (verdict, strengths, weaknesses)
2. Review (10-dimension scores)
3. Debt (technical debt items)
4. Compare (architecture comparison)
5. Plan (roadmap and milestones)

### Merge 2: Learning Experience

**Target:** Learning Mode (`/repositories/[id]/learning`)

**Absorb:**

- Student Mode (`/repositories/[id]/student`) → "Study" tab in Learning

**Result:** One "Learning" page with tabs:

1. Overview (prerequisites, objectives)
2. Reading Order (step-by-step)
3. Concepts (what you'll learn)
4. Exercises (hands-on practice)
5. Projects (mini + capstone)
6. Interview (questions + discussion)
7. Challenges (engineering problems)

### Merge 3: Planning

**Target:** Implementation Planner (`/repositories/[id]/plan`)

**Absorb:**

- Build Blueprint (`/repositories/[id]/blueprint`) → "Blueprint" tab in Plan

**Result:** One "Plan" page with tabs:

1. Roadmap (phases and milestones)
2. Blueprint (folder structure, tech stack)
3. Risk (analysis and dependencies)

### Merge 4: Patterns

**Target:** Pattern Library (`/patterns`)

**Absorb:**

- Elite Library (`/elite`) → "Elite" filter in Patterns

**Result:** One "Patterns" page with quality filter.

---

## Phase 3: Remove Standalone Pages

### Remove:

| Page                 | Rationale                         |
| -------------------- | --------------------------------- |
| Knowledge Graph      | Visual candy, low practical value |
| Comparisons          | Scores don't tell the story       |
| Timeline             | GitHub does this better           |
| Institutional Memory | Only 2 entries per repo           |

---

## Phase 4: Simplify Dashboard

### Current: 8 widgets

### Recommended: 3 widgets

1. **Welcome Card** — "What would you like to do?" with 3 actions:
   - Browse repositories
   - Explore patterns
   - Start learning

2. **Recent Repositories** — Last 3 visited repositories with scores

3. **Quick Stats** — 3 numbers (repos, patterns, knowledge packages)

### Remove:

- Activity Feed (low value)
- Radar Widget (low value)
- Recommendation Widget (low value)
- Pattern Widget (move to Patterns page)
- Health Widget (move to Advisor page)

---

## Phase 5: Simplify Sidebar

### Current: 8 groups + 2 standalone = 10 items

### Recommended: 4 groups + 1 standalone = 5 items

```
Dashboard (standalone)
Repositories (standalone, leads to list)
Patterns (standalone, leads to library)
Learning (standalone, leads to exports)
Settings (standalone)
```

### Repository Detail: 5 tabs (down from 8)

```
Overview | Architecture | Knowledge | Advisor | Plan
```

### Advisor: 5 tabs (down from 5 standalone pages)

```
Overview | Review | Debt | Compare | Plan
```

---

## Summary

| Metric                | Before | After | Reduction |
| --------------------- | ------ | ----- | --------- |
| Total pages           | 20     | 10    | 50%       |
| Sidebar groups        | 8      | 5     | 37%       |
| Sidebar links         | 19     | 5     | 74%       |
| Dead links            | 15     | 0     | 100%      |
| Repository sub-pages  | 16     | 5     | 69%       |
| Score metrics         | 4      | 1     | 75%       |
| Learning views        | 3      | 1     | 67%       |
| Dashboard widgets     | 8      | 3     | 63%       |
| Max clicks to content | 4      | 3     | 25%       |
