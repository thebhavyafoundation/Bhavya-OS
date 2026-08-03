# Screen Inventory — GitHub OS

## Complete Page Analysis

### 1. Dashboard (`/`)

- **Purpose:** Entry point, overview of all data
- **Primary User:** Everyone
- **Frequency:** Daily (first visit)
- **Business Value:** Low — shows metrics but no action
- **Educational Value:** None
- **Platform Capabilities:** None
- **Could It Be Merged?** No (entry point), but needs radical simplification
- **Should It Be Removed?** No, but reduce from 8 widgets to 3

### 2. Repository List (`/repositories`)

- **Purpose:** Discover and filter repositories
- **Primary User:** Everyone
- **Frequency:** Daily
- **Business Value:** High — core navigation
- **Educational Value:** Low
- **Platform Capabilities:** Database queries
- **Could It Be Merged?** No (essential)
- **Should It Be Removed?** No

### 3. Repository Detail (`/repositories/[id]`)

- **Purpose:** Deep dive into a repository
- **Primary User:** Engineers, Students
- **Frequency:** Daily
- **Business Value:** High — core interaction
- **Educational Value:** High
- **Platform Capabilities:** Database queries, type parsing
- **Could It Be Merged?** No (essential), but tabs need reduction
- **Should It Be Removed?** No

### 4. Engineering Advisor (`/repositories/[id]/advisor`)

- **Purpose:** Comprehensive engineering assessment
- **Primary User:** Engineers, Instructors
- **Frequency:** Weekly per repository
- **Business Value:** High — unique value proposition
- **Educational Value:** High
- **Platform Capabilities:** Database queries, JSON parsing
- **Could It Be Merged?** Should absorb Review, Fitness, Architecture Advisor
- **Should It Be Removed?** No — this is the CORE page

### 5. Engineering Review (`/repositories/[id]/review`)

- **Purpose:** 10-dimension score analysis
- **Primary User:** Engineers
- **Frequency:** Monthly
- **Business Value:** Medium — overlaps with Advisor
- **Educational Value:** Medium
- **Platform Capabilities:** Database queries, JSON parsing
- **Could It Be Merged?** YES → into Advisor
- **Should It Be Removed?** YES (after merge)

### 6. Architecture Advisor (`/repositories/[id]/architecture-advisor`)

- **Purpose:** Compare against elite repos
- **Primary User:** Senior Engineers
- **Frequency:** Monthly
- **Business Value:** Medium — useful but niche
- **Educational Value:** Medium
- **Platform Capabilities:** Database queries, JSON parsing
- **Could It Be Merged?** YES → into Advisor (as a tab)
- **Should It Be Removed?** YES (after merge)

### 7. Technical Debt (`/repositories/[id]/debt`)

- **Purpose:** Categorized debt register
- **Primary User:** Engineers, Tech Leads
- **Frequency:** Weekly
- **Business Value:** High — actionable
- **Educational Value:** High
- **Platform Capabilities:** Database queries
- **Could It Be Merged?** No (unique value)
- **Should It Be Removed?** No

### 8. Implementation Planner (`/repositories/[id]/plan`)

- **Purpose:** Roadmap and milestones
- **Primary User:** Tech Leads, Managers
- **Frequency:** Monthly
- **Business Value:** Medium
- **Educational Value:** Medium
- **Platform Capabilities:** Database queries, JSON parsing
- **Could It Be Merged?** Should merge with Blueprint
- **Should It Be Removed?** No, but consolidate

### 9. Build Blueprint (`/repositories/[id]/blueprint`)

- **Purpose:** Project blueprint from analysis
- **Primary User:** Engineers, Students
- **Frequency:** Monthly
- **Business Value:** Medium
- **Educational Value:** High
- **Platform Capabilities:** Database queries, JSON parsing
- **Could It Be Merged?** YES → into Plan
- **Should It Be Removed?** YES (after merge)

### 10. Student Mode (`/repositories/[id]/student`)

- **Purpose:** Study guide and exercises
- **Primary User:** Students
- **Frequency:** Weekly
- **Business Value:** Medium
- **Educational Value:** High
- **Platform Capabilities:** Database queries, JSON parsing
- **Could It Be Merged?** YES → into Learning Mode
- **Should It Be Removed?** YES (after merge)

### 11. Learning Mode (`/repositories/[id]/learning`)

- **Purpose:** Learning path for a repository
- **Primary User:** Students, Instructors
- **Frequency:** Weekly
- **Business Value:** High
- **Educational Value:** High
- **Platform Capabilities:** Database queries, JSON parsing
- **Could It Be Merged?** No (keep, absorb Student Mode)
- **Should It Be Removed?** No

### 12. Engineering Health (`/repositories/[id]/health`)

- **Purpose:** 8-dimension health score
- **Primary User:** Engineers
- **Frequency:** Monthly
- **Business Value:** Medium — overlaps with Fitness and Review
- **Educational Value:** Low
- **Platform Capabilities:** Database queries
- **Could It Be Merged?** YES → into Advisor
- **Should It Be Removed?** YES (after merge)

### 13. Repository Fitness (`/repositories/[id]/fitness`)

- **Purpose:** 8-dimension quality analysis
- **Primary User:** Engineers
- **Frequency:** Monthly
- **Business Value:** Medium — overlaps with Health and Review
- **Educational Value:** Low
- **Platform Capabilities:** Database queries, JSON parsing
- **Could It Be Merged?** YES → into Advisor
- **Should It Be Removed?** YES (after merge)

### 14. Institutional Memory (`/repositories/[id]/memory`)

- **Purpose:** Q&A about the repository
- **Primary User:** Engineers
- **Frequency:** Rarely
- **Business Value:** Low — only 2 entries per repo
- **Educational Value:** Low
- **Platform Capabilities:** Database queries
- **Could It Be Merged?** Could become a section in Overview
- **Should It Be Removed?** YES (after merge)

### 15. Timeline (`/repositories/[id]/timeline`)

- **Purpose:** Engineering history
- **Primary User:** Engineers
- **Frequency:** Rarely
- **Business Value:** Low — GitHub does this better
- **Educational Value:** Low
- **Platform Capabilities:** Database queries
- **Could It Be Merged?** Could become a section in Overview
- **Should It Be Removed?** YES

### 16. Pattern Library (`/patterns`)

- **Purpose:** Reusable engineering patterns
- **Primary User:** Engineers, Students
- **Frequency:** Weekly
- **Business Value:** High — unique value
- **Educational Value:** High
- **Platform Capabilities:** Database queries
- **Could It Be Merged?** No (essential), should absorb Elite Library
- **Should It Be Removed?** No

### 17. Comparisons (`/comparisons`)

- **Purpose:** Side-by-side repo comparison
- **Primary User:** Tech Leads
- **Frequency:** Rarely
- **Business Value:** Low — scores don't tell the story
- **Educational Value:** None
- **Platform Capabilities:** Database queries
- **Could It Be Merged?** No (standalone)
- **Should It Be Removed?** YES

### 18. Educational Exports (`/educational`)

- **Purpose:** Reusable learning materials
- **Primary User:** Instructors
- **Frequency:** Monthly
- **Business Value:** Medium
- **Educational Value:** High
- **Platform Capabilities:** Database queries
- **Could It Be Merged?** Could become part of Learning
- **Should It Be Removed?** No (unique value for instructors)

### 19. Knowledge Graph (`/knowledge-graph`)

- **Purpose:** Visualize relationships
- **Primary User:** Researchers
- **Frequency:** Rarely
- **Business Value:** Low — visual candy
- **Educational Value:** None
- **Platform Capabilities:** Database queries
- **Could It Be Merged?** No
- **Should It Be Removed?** YES

### 20. Elite Library (`/elite`)

- **Purpose:** Curated quality patterns
- **Primary User:** Engineers
- **Frequency:** Weekly
- **Business Value:** Medium — overlaps with Patterns
- **Educational Value:** Medium
- **Platform Capabilities:** Database queries
- **Could It Be Merged?** YES → into Patterns
- **Should It Be Removed?** YES (after merge)

---

## Summary

| Category        | Count | Pages                                                                                                                                    |
| --------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Keep (Core)** | 8     | Dashboard, Repo List, Repo Detail, Advisor, Learning, Patterns, Debt, Plan                                                               |
| **Merge**       | 8     | Review→Advisor, Fitness→Advisor, Health→Advisor, Arch Advisor→Advisor, Blueprint→Plan, Student→Learning, Elite→Patterns, Memory→Overview |
| **Remove**      | 4     | Timeline, Comparisons, Knowledge Graph, (Institutional Memory)                                                                           |

### Post-Merge Page Count: 10 pages

- Dashboard (simplified)
- Repository List
- Repository Detail (5 tabs: Overview, Architecture, Knowledge, Advisor, Plan)
- Engineering Advisor (absorbs Review, Fitness, Health, Architecture Advisor)
- Technical Debt
- Implementation Planner (absorbs Blueprint)
- Learning Mode (absorbs Student Mode)
- Pattern Library (absorbs Elite Library)
- Educational Exports
- Settings

**Reduction: 20 → 10 pages (50% reduction)**
