# Next Batch — KP-005 through KP-010

**Document:** NEXT_BATCH.md
**Generated:** 2026-08-05
**Sprint:** 4-Hour Production Sprint (Phases 5-9)
**Scope:** Next 6 Knowledge Packages

---

## Batch Overview

| Field | Value |
|-------|-------|
| Batch | 2 |
| KPs | KP-005 through KP-010 |
| Module Coverage | M0-01 (1 KP), M0-02 (4 KPs), M0-03 (1 KP) |
| Estimated Duration | 2 sprints (8 hours) |
| Dependencies | All prerequisites are COMPLETE |
| Priority | HIGH |

---

## Knowledge Packages

### KP-005: Hardware Basics

| Field | Value |
|-------|-------|
| **Title** | Hardware Basics |
| **Module** | M0-01: Computer Basics |
| **Prerequisites** | KP-004 (Software Installation) |
| **Duration** | 45 minutes |
| **Priority** | HIGH |
| **Unblocks** | KP-006, KP-007, KP-008 |

**Concepts to Cover:**
1. CPU and Processing
2. Memory (RAM) and Storage
3. Input/Output Devices
4. Motherboard and Components
5. Building vs. Buying

**Exercises:**
1. Hardware Identification
2. Performance Comparison
3. Upgrade Planning
4. Build Configuration
5. Troubleshooting Basics

---

### KP-006: Word Processing Fundamentals

| Field | Value |
|-------|-------|
| **Title** | Word Processing Fundamentals |
| **Module** | M0-02: Productivity Software |
| **Prerequisites** | KP-005 (Hardware Basics) |
| **Duration** | 45 minutes |
| **Priority** | HIGH |
| **Unblocks** | KP-011 |

**Concepts to Cover:**
1. Document Creation and Formatting
2. Styles and Templates
3. Tables and Lists
4. Collaboration Features
5. Export and Sharing

**Exercises:**
1. Create a Formatted Document
2. Build a Template
3. Create and Format a Table
4. Track Changes Exercise
5. Export to Multiple Formats

---

### KP-007: Spreadsheet Fundamentals

| Field | Value |
|-------|-------|
| **Title** | Spreadsheet Fundamentals |
| **Module** | M0-02: Productivity Software |
| **Prerequisites** | KP-005 (Hardware Basics) |
| **Duration** | 50 minutes |
| **Priority** | HIGH |
| **Unblocks** | None |

**Concepts to Cover:**
1. Cells, Rows, and Columns
2. Formulas and Functions
3. Data Validation
4. Charts and Visualization
5. Conditional Formatting

**Exercises:**
1. Budget Spreadsheet
2. Formula Practice
3. Data Validation Setup
4. Chart Creation
5. Conditional Formatting Dashboard

---

### KP-008: Presentation Software

| Field | Value |
|-------|-------|
| **Title** | Presentation Software |
| **Module** | M0-02: Productivity Software |
| **Prerequisites** | KP-005 (Hardware Basics) |
| **Duration** | 45 minutes |
| **Priority** | HIGH |
| **Unblocks** | None |

**Concepts to Cover:**
1. Slide Design Principles
2. Content Organization
3. Visual Elements
4. Transitions and Animations
5. Delivery and Sharing

**Exercises:**
1. Design a 5-Slide Presentation
2. Create a Data Visualization Slide
3. Build a Template
4. Animation Practice
5. Export for Different Platforms

---

### KP-009: Internet Fundamentals

| Field | Value |
|-------|-------|
| **Title** | Internet Fundamentals |
| **Module** | M0-03: Internet and Networking |
| **Prerequisites** | KP-004 (Software Installation) |
| **Duration** | 45 minutes |
| **Priority** | HIGH |
| **Unblocks** | KP-010, KP-011, KP-012 |

**Concepts to Cover:**
1. How the Internet Works
2. TCP/IP and Protocols
3. DNS and Domain Names
4. HTTP and HTTPS
5. Cloud Computing Basics

**Exercises:**
1. Network Diagnosis
2. DNS Lookup
3. Protocol Analysis
4. Cloud Service Comparison
5. Bandwidth Testing

---

### KP-010: Web Browsing and Research

| Field | Value |
|-------|-------|
| **Title** | Web Browsing and Research |
| **Module** | M0-03: Internet and Networking |
| **Prerequisites** | KP-009 (Internet Fundamentals) |
| **Duration** | 40 minutes |
| **Priority** | MEDIUM |
| **Unblocks** | None |

**Concepts to Cover:**
1. Browser Anatomy
2. Search Techniques
3. Source Evaluation
4. Bookmark Management
5. Privacy and Tracking

**Exercises:**
1. Advanced Search Practice
2. Source Credibility Assessment
3. Bookmark Organization
4. Browser Extension Evaluation
5. Privacy Settings Configuration

---

## Dependency Map

```
KP-001 (COMPLETE) → KP-002 (COMPLETE) → KP-003 (COMPLETE) → KP-005 → KP-006 → KP-011
                                        → KP-004 (COMPLETE) → KP-005 → KP-007
                                                            → KP-009 → KP-010
                                                                      → KP-012
```

### Critical Path

1. KP-005 (unblocks KP-006, KP-007, KP-008)
2. KP-009 (unblocks KP-010, KP-011, KP-012)
3. KP-006 (unblocks KP-011)

---

## Production Schedule

### Sprint 6 (4 hours)

| KP | Time Allocation | Dependencies | Can Start? |
|----|----------------|--------------|------------|
| KP-005 | 60 min | KP-004 (COMPLETE) | YES |
| KP-006 | 60 min | KP-005 | After KP-005 |
| KP-007 | 60 min | KP-005 | After KP-005 |

**Sprint 6 Output:** 3 KPs (KP-005, KP-006, KP-007)
**Cumulative:** 7 KPs (35% of Level 0)

### Sprint 7 (4 hours)

| KP | Time Allocation | Dependencies | Can Start? |
|----|----------------|--------------|------------|
| KP-008 | 60 min | KP-005 (COMPLETE) | YES |
| KP-009 | 60 min | KP-004 (COMPLETE) | YES |
| KP-010 | 60 min | KP-009 | After KP-009 |

**Sprint 7 Output:** 3 KPs (KP-008, KP-009, KP-010)
**Cumulative:** 10 KPs (50% of Level 0)

---

## Content Specifications

### Per-KP Content Requirements

| Content Type | Count | Description |
|--------------|-------|-------------|
| Concepts | 5 | Core ideas with explanations |
| Definitions | 5 | Clear, concise definitions |
| Examples | 5 | Practical, real-world examples |
| Exercises | 5 | Hands-on activities |
| Key Takeaways | 5 | Summary points |
| Prerequisites | 1-2 | Required KPs |
| Related Packages | 2-3 | Suggested follow-ups |

### Assessment Requirements

| Question Type | Count | Description |
|---------------|-------|-------------|
| MCQ | 8 | Multiple choice with 4 options |
| Short Answer | 4 | 2-3 sentence responses |
| Reflection | 2 | Personal application questions |
| Practical | 1 | Hands-on task |
| **Total** | **15** | |

### Media Requirements

| Asset | Count | Description |
|-------|-------|-------------|
| MDX Page | 1 | Website content with frontmatter |
| Social Campaign | 1 | 9-platform campaign file |
| OG Image | 1 | 1200x630 social sharing image |
| JSON-LD | 1 | Structured data for SEO |

---

## Quality Targets

| Dimension | Target | Notes |
|-----------|--------|-------|
| Educational Quality | >=8.0 | Maintain current level |
| Technical Accuracy | >=8.5 | Increase for technical topics |
| Content Completeness | >=8.0 | Full coverage of all concepts |
| Assessment Quality | >=8.0 | Varied question types |
| Portfolio Value | >=8.0 | Tangible student outputs |
| Media Readiness | >=8.0 | Complete media package |
| Constitution Compliance | >=8.0 | Mission-aligned content |
| BEE 2.0 Compliance | >=8.0 | Full lifecycle |
| KG Integration | >=8.0 | Connected knowledge graph |
| Student Engagement | >=8.0 | Practical exercises |
| **Overall** | **>=8.0** | |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| KP-005 blocks multiple KPs | HIGH | HIGH | Prioritize KP-005 completion |
| KP-009 blocks security KPs | MEDIUM | HIGH | Complete KP-009 early |
| Quality degradation | LOW | HIGH | Maintain quality gates |
| Timeline slippage | MEDIUM | MEDIUM | Buffer time in schedule |
| Content overlap | LOW | LOW | Clear scope boundaries |

---

## Recommendations

1. **Start with KP-005** — It unblocks the most downstream KPs
2. **Produce KP-009 early** — It unblocks the security module
3. **Maintain quality** — Current 8.5 average should be maintained
4. **Collect feedback** — Validate quality with student data
5. **Update projections** — Reassess after Sprint 6

---

## Cumulative Progress After Batch 2

| Metric | Before Batch 2 | After Batch 2 | Change |
|--------|----------------|---------------|--------|
| Total KPs | 4 | 10 | +6 |
| Level 0 Coverage | 20% | 50% | +30% |
| Modules Complete | 0 | 0 | — |
| Concepts | 20 | 50 | +30 |
| Exercises | 20 | 50 | +30 |
| Graph Edges | 5 | 15 | +10 |

---

*This document outlines the next production batch for the Bhavya Foundation curriculum. All specifications are based on the BEE 2.0 production protocol.*
