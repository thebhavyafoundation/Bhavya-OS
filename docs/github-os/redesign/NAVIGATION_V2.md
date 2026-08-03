# Navigation v2 — GitHub OS

## Sidebar Structure

```
GitHub OS
  Engineering Mentor

[Search... ⌘K]

Dashboard          /
Repositories        /repositories
Knowledge          /knowledge
Learning           /learning
Settings           /settings

---
Bhavya Foundation
Admin
```

**Total: 5 links. 0 dead links.**

## Repository Detail Navigation

```
Repositories > {Repository Name}

[Overview] [Architecture] [Learning] [Advisor] [Activity]

Overview:
  - Scores (Health, Technology, Difficulty)
  - Why Bhavya Cares
  - Architecture Summary
  - README Summary
  - Knowledge Packages (top 3)

Architecture:
  - Architecture Summary
  - Folder Structure
  - Technology Stack
  - Detected Patterns
  - ADRs
  - Dependencies

Learning:
  - Difficulty & Recommendation
  - Why Learn This
  - Prerequisites
  - Reading Order
  - Open Learning Mode → /repositories/{id}/learning

Advisor:
  - Full Assessment → /repositories/{id}/advisor
  - Technical Debt → /repositories/{id}/debt
  - Implementation Plan → /repositories/{id}/plan
  - Compare Architecture → /repositories/{id}/architecture-advisor
  - Quick Insights (patterns, ADRs, packages, deps counts)

Activity:
  - Latest Commit
  - Latest Release
  - MCP Recommendations
  - CLI Recommendations
  - README (with copy)
```

## Navigation Metrics

| Metric                | Before | After        |
| --------------------- | ------ | ------------ |
| Sidebar groups        | 8      | 5 standalone |
| Sidebar links         | 19     | 5            |
| Dead links            | 15     | 0            |
| Repository tabs       | 8      | 5            |
| Repository sub-pages  | 16     | 4            |
| Max clicks to content | 4      | 3            |
| Breadcrumbs           | 0      | All pages    |
