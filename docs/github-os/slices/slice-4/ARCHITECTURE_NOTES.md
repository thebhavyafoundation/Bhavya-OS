# Slice 4 — Architecture Notes

## Design Decisions

### 1. Engineering Co-Founder Pattern

Each repository now has an "Engineering Co-Founder" card with 8 intelligence views. This is the key UX pattern — when you open a repository, you immediately see what a senior engineer would tell you about it.

**Why this pattern:** The original plan was to clone GitHub (issues, PRs, commits). We pivoted because:

- GitHub already does that well
- Bhavya Foundation's value is in engineering thinking, not code hosting
- Students need mentorship, not more tools

### 2. Review System (10 Dimensions)

The review system scores repositories across 10 dimensions:

- Architecture, Code Organization, Documentation, Testing, Automation
- Maintainability, Extensibility, Developer Experience, Educational Value, Future Risk

**Why 10 dimensions:** Each dimension answers a specific question an engineer would ask. The scores are derived from evidence (patterns found, test coverage, documentation depth) not just opinion.

### 3. Technical Debt as First-Class Entity

Debt items have: category, severity, business impact, engineering impact, effort estimate, suggested solution, and links to related knowledge packages.

**Why this structure:** Debt is only useful if you can act on it. The business/engineering impact split helps prioritize. The solution link turns debt into action.

### 4. Architecture Comparison

Compare any repository against elite repos (Next.js, Linear, etc.) to identify missing layers, architectural drift, and duplicated concepts.

**Why compare:** You can't improve what you can't measure. Comparing against known-good architectures reveals gaps.

### 5. Student Mode as 7-Tab Interface

Study Guide, Roadmap, Exercises, Projects, Interview, Reflection, Challenges.

**Why 7 tabs:** Each tab serves a different learning modality:

- Guide = overview
- Roadmap = sequence
- Exercises = hands-on
- Projects = application
- Interview = career prep
- Reflection = metacognition
- Challenges = stretch goals

### 6. Elite Engineering Library

Reusable patterns indexed from repositories with quality scores and category filters.

**Why a library:** Patterns are only useful if they're findable. The library makes elite patterns discoverable.

## Data Flow

```
Repository → Review Engine → 10 Scores → Advisor Page
                ↓
        Technical Debt → Debt Center → Impact Analysis
                ↓
        Architecture Comparison → Missing Layers → Recommendations
                ↓
        Student Mode → Study Guide → Exercises → Challenges
                ↓
        Build Blueprint → Folder Structure → Tech Stack → Roadmap
                ↓
        Fitness Report → 8-Dimension Score → Explanations
```

## Tradeoffs

- **Static seed data vs dynamic analysis:** Seed data is static for now. Dynamic analysis would be more useful but requires significant AI integration work.
- **10 dimensions vs simpler score:** More dimensions = more nuance but more complexity. We chose nuance because engineering decisions require it.
- **7-tab student mode vs single page:** More tabs = more clicks but better organization. We chose organization because learning content is dense.
