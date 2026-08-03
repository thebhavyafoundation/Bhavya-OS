# Navigation Audit — GitHub OS

## Current State

### Sidebar Structure (8 groups + 2 standalone):

```
Dashboard (standalone)
Repositories (2 children, 1 dead link)
Intelligence (4 children, 3 dead links)
Engineering (3 children, 3 dead links)
Patterns (2 children, both exist)
Automation (3 children, 3 dead links)
Learning (3 children, 2 dead links)
Analytics (2 children, 2 dead links)
Co-Founder (1 child, exists)
Settings (standalone, dead link)
```

### Problems:

1. **9 dead links** (47% of sidebar links go nowhere)
2. **8 navigation groups** for 20 pages (too many)
3. **No clear hierarchy** — all groups appear equal
4. **No progressive disclosure** — everything visible at once
5. **Duplicate paths** — Learning accessible from sidebar AND repository detail

### Dead Links:

| Link                    | Status  |
| ----------------------- | ------- |
| `/repositories/starred` | NO PAGE |
| `/knowledge`            | NO PAGE |
| `/radar`                | NO PAGE |
| `/recommendations`      | NO PAGE |
| `/issues`               | NO PAGE |
| `/pull-requests`        | NO PAGE |
| `/releases`             | NO PAGE |
| `/workflows`            | NO PAGE |
| `/mcp`                  | NO PAGE |
| `/actions`              | NO PAGE |
| `/learning`             | NO PAGE |
| `/resources`            | NO PAGE |
| `/analytics`            | NO PAGE |
| `/analytics/teams`      | NO PAGE |
| `/settings`             | NO PAGE |

**15 dead links. 79% of sidebar links are broken.**

### Navigation Depth:

- Dashboard → Repository → Sub-page = 3 clicks
- Dashboard → Repository → Tab → Sub-page = 4 clicks
- No content is more than 4 clicks away (good)

### Context Switching:

- Each page switch requires full page reload (no SPA transitions)
- Sidebar stays fixed (good)
- No breadcrumb navigation (bad)

---

## Recommended Navigation

### Option A: Minimal (5 groups)

```
Dashboard
Repositories
Patterns
Learning
Settings
```

### Option B: Moderate (4 groups + contextual)

```
Dashboard
Repositories
  └── (tabs in detail page)
Patterns
Learning
```

### Option C: Contextual (2 groups + repository context)

```
Dashboard
Repository (when viewing a repo)
  ├── Overview
  ├── Architecture
  ├── Knowledge
  ├── Advisor
  └── Plan
Patterns
Learning
```

**Recommendation: Option A** — Clear, simple, 5 groups maximum.

---

## Navigation Metrics

| Metric                       | Current | Recommended |
| ---------------------------- | ------- | ----------- |
| Sidebar groups               | 8       | 5           |
| Sidebar links                | 19      | 5-7         |
| Dead links                   | 15      | 0           |
| Max clicks to content        | 4       | 3           |
| Context switches per journey | 5+      | 2-3         |
| Cognitive load               | High    | Low         |
