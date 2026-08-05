# Curriculum Production Backlog v1.0

## Status: Active

## Date: 2026-08-05

## Purpose

Complete production backlog for the Bhavya Foundation Master Curriculum (13 levels, 78 modules). Every module is listed with its full production requirements. This document is the single source of truth for content production scheduling.

---

## Production Conventions

| Symbol | Meaning |
|--------|---------|
| P0 | Must have — blocks foundational progression |
| P1 | Important — required for level completion |
| P2 | Nice to have — enhances learning, can be deferred |

**Difficulty to Production Days Mapping:**

| Difficulty | Module Days | Rationale |
|------------|-------------|-----------|
| Beginner | 5 | Shorter content, simpler labs, basic media |
| Intermediate | 7 | Deeper content, hands-on labs, richer media |
| Advanced | 10 | Complex topics, multi-part labs, full media suite |
| Expert | 12 | Specialized content, research-grade labs, comprehensive media |

**Media per KP:** 1 article + 1 video. Carousels added for intermediate+ modules on key topics.

---

## Level 0 — Digital Foundations

**Mission:** Ensure students can use a computer and the internet effectively.
**Duration:** 2-4 weeks | **Hands-on:** 80%

| Module ID | Module Name | KPs | Labs | Projects | Assessments | Media (Art/vid/car) | Prod Days | Priority | Dependencies |
|-----------|-------------|-----|------|----------|-------------|---------------------|-----------|----------|--------------|
| 0.1 | Computer Basics | 4 | 4 | 1 | 1 | 4/4/0 | 5 | P0 | None |
| 0.2 | Internet Fundamentals | 4 | 4 | 1 | 1 | 4/4/0 | 5 | P0 | 0.1 |
| 0.3 | File Management | 3 | 3 | 1 | 1 | 3/3/0 | 5 | P0 | 0.1 |
| 0.4 | Basic Troubleshooting | 3 | 3 | 1 | 1 | 3/3/0 | 5 | P0 | 0.1, 0.3 |
| 0.5 | Online Safety | 3 | 3 | 1 | 1 | 3/3/0 | 5 | P0 | 0.2 |
| 0.6 | Digital Communication | 3 | 3 | 1 | 1 | 3/3/0 | 5 | P0 | 0.2, 0.5 |
| **Totals** | | **20** | **20** | **6** | **6** | **20/20/0** | **30** | | |

---

## Level 1 — AI Foundations

**Mission:** Understand what AI is, how it works, and why it matters.
**Duration:** 4-6 weeks | **Hands-on:** 70%

| Module ID | Module Name | KPs | Labs | Projects | Assessments | Media (Art/vid/car) | Prod Days | Priority | Dependencies |
|-----------|-------------|-----|------|----------|-------------|---------------------|-----------|----------|--------------|
| 1.1 | What is AI? | 5 | 5 | 1 | 1 | 5/5/1 | 5 | P0 | L0 |
| 1.2 | How AI Works | 5 | 5 | 1 | 1 | 5/5/1 | 5 | P0 | 1.1 |
| 1.3 | AI History | 3 | 3 | 1 | 1 | 3/3/0 | 5 | P1 | 1.1 |
| 1.4 | AI Ethics | 4 | 4 | 1 | 1 | 4/4/1 | 5 | P0 | 1.1 |
| 1.5 | AI Applications | 5 | 5 | 1 | 1 | 5/5/1 | 5 | P0 | 1.1 |
| 1.6 | AI Limitations | 3 | 3 | 1 | 1 | 3/3/0 | 5 | P0 | 1.1 |
| **Totals** | | **25** | **25** | **6** | **6** | **25/25/4** | **30** | | |

---

## Level 2 — Prompt Engineering

**Mission:** Master the art and science of communicating with AI.
**Duration:** 4-6 weeks | **Hands-on:** 90%

| Module ID | Module Name | KPs | Labs | Projects | Assessments | Media (Art/vid/car) | Prod Days | Priority | Dependencies |
|-----------|-------------|-----|------|----------|-------------|---------------------|-----------|----------|--------------|
| 2.1 | Prompt Fundamentals | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | L1 |
| 2.2 | Advanced Prompting | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | 2.1 |
| 2.3 | Prompt Patterns | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | 2.1 |
| 2.4 | Prompt Evaluation | 3 | 3 | 1 | 1 | 3/3/1 | 7 | P0 | 2.1 |
| 2.5 | Prompt Optimization | 3 | 3 | 1 | 1 | 3/3/1 | 7 | P0 | 2.4 |
| 2.6 | Prompt Applications | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | 2.2 |
| **Totals** | | **26** | **26** | **6** | **6** | **26/26/6** | **42** | | |

---

## Level 3 — AI Applications

**Mission:** Build real AI-powered applications.
**Duration:** 6-8 weeks | **Hands-on:** 85%

| Module ID | Module Name | KPs | Labs | Projects | Assessments | Media (Art/vid/car) | Prod Days | Priority | Dependencies |
|-----------|-------------|-----|------|----------|-------------|---------------------|-----------|----------|--------------|
| 3.1 | LLM API Integration | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | L2 |
| 3.2 | Application Architecture | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | 3.1 |
| 3.3 | User Experience | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | 3.1 |
| 3.4 | Testing | 3 | 3 | 1 | 1 | 3/3/1 | 7 | P0 | 3.1 |
| 3.5 | Deployment | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | 3.1 |
| 3.6 | Maintenance | 3 | 3 | 1 | 1 | 3/3/0 | 7 | P1 | 3.5 |
| **Totals** | | **26** | **26** | **6** | **6** | **26/26/5** | **42** | | |

---

## Level 4 — AI Agents

**Mission:** Understand and build autonomous AI systems.
**Duration:** 6-8 weeks | **Hands-on:** 85%

| Module ID | Module Name | KPs | Labs | Projects | Assessments | Media (Art/vid/car) | Prod Days | Priority | Dependencies |
|-----------|-------------|-----|------|----------|-------------|---------------------|-----------|----------|--------------|
| 4.1 | Agent Concepts | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | L3 |
| 4.2 | Agent Architecture | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | 4.1 |
| 4.3 | Tool Integration | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | 4.1 |
| 4.4 | Agent Collaboration | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P1 | 4.2 |
| 4.5 | Agent Safety | 3 | 3 | 1 | 1 | 3/3/1 | 7 | P0 | 4.1 |
| 4.6 | Agent Deployment | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | 4.2 |
| **Totals** | | **28** | **28** | **6** | **6** | **28/28/6** | **45** | | |

---

## Level 5 — Knowledge Systems

**Mission:** Build systems that organize, retrieve, and apply knowledge.
**Duration:** 4-6 weeks | **Hands-on:** 80%

| Module ID | Module Name | KPs | Labs | Projects | Assessments | Media (Art/vid/car) | Prod Days | Priority | Dependencies |
|-----------|-------------|-----|------|----------|-------------|---------------------|-----------|----------|--------------|
| 5.1 | Knowledge Representation | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P1 | L4 |
| 5.2 | Information Retrieval | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P1 | 5.1 |
| 5.3 | Knowledge Graphs | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P1 | 5.1 |
| 5.4 | Vector Databases | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | 5.1 |
| 5.5 | RAG Systems | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P0 | 5.4 |
| 5.6 | Knowledge Applications | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P1 | 5.5 |
| **Totals** | | **30** | **30** | **6** | **6** | **30/30/6** | **48** | | |

---

## Level 6 — Automation

**Mission:** Automate tasks using AI and scripting.
**Duration:** 4-6 weeks | **Hands-on:** 90%

| Module ID | Module Name | KPs | Labs | Projects | Assessments | Media (Art/vid/car) | Prod Days | Priority | Dependencies |
|-----------|-------------|-----|------|----------|-------------|---------------------|-----------|----------|--------------|
| 6.1 | Scripting Fundamentals | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | L3 |
| 6.2 | Browser Automation | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | 6.1 |
| 6.3 | API Automation | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | 6.1 |
| 6.4 | Workflow Automation | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | 6.1 |
| 6.5 | AI-Powered Automation | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P0 | 6.4, L2 |
| 6.6 | Automation Best Practices | 3 | 3 | 1 | 1 | 3/3/0 | 5 | P1 | 6.4 |
| **Totals** | | **28** | **28** | **6** | **6** | **28/28/5** | **43** | | |

---

## Level 7 — AI Products

**Mission:** Design and build complete AI-powered products.
**Duration:** 8-12 weeks | **Hands-on:** 90%

| Module ID | Module Name | KPs | Labs | Projects | Assessments | Media (Art/vid/car) | Prod Days | Priority | Dependencies |
|-----------|-------------|-----|------|----------|-------------|---------------------|-----------|----------|--------------|
| 7.1 | Product Thinking | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P0 | L5, L6 |
| 7.2 | UX Design | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P0 | 7.1 |
| 7.3 | Technical Architecture | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P0 | 7.1 |
| 7.4 | Development Process | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P0 | 7.3 |
| 7.5 | Launch Strategy | 3 | 3 | 1 | 1 | 3/3/1 | 7 | P1 | 7.4 |
| 7.6 | Growth | 3 | 3 | 1 | 1 | 3/3/1 | 7 | P1 | 7.5 |
| **Totals** | | **26** | **26** | **6** | **6** | **26/26/6** | **54** | | |

---

## Level 8 — Open Source Engineering

**Mission:** Contribute to and lead open source projects.
**Duration:** 4-6 weeks | **Hands-on:** 85%

| Module ID | Module Name | KPs | Labs | Projects | Assessments | Media (Art/vid/car) | Prod Days | Priority | Dependencies |
|-----------|-------------|-----|------|----------|-------------|---------------------|-----------|----------|--------------|
| 8.1 | Open Source Culture | 3 | 3 | 1 | 1 | 3/3/0 | 5 | P0 | L3 |
| 8.2 | Git Mastery | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | 8.1 |
| 8.3 | Contribution Workflow | 5 | 5 | 1 | 1 | 5/5/1 | 7 | P0 | 8.2 |
| 8.4 | Code Review | 3 | 3 | 1 | 1 | 3/3/1 | 5 | P0 | 8.3 |
| 8.5 | Documentation | 3 | 3 | 1 | 1 | 3/3/0 | 5 | P0 | 8.3 |
| 8.6 | Community Building | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P1 | 8.3 |
| **Totals** | | **24** | **24** | **6** | **6** | **24/24/4** | **39** | | |

---

## Level 9 — Research

**Mission:** Conduct research and contribute to knowledge.
**Duration:** 4-6 weeks | **Hands-on:** 70%

| Module ID | Module Name | KPs | Labs | Projects | Assessments | Media (Art/vid/car) | Prod Days | Priority | Dependencies |
|-----------|-------------|-----|------|----------|-------------|---------------------|-----------|----------|--------------|
| 9.1 | Research Methods | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P1 | L5 |
| 9.2 | Literature Review | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P1 | 9.1 |
| 9.3 | Experiment Design | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P1 | 9.1 |
| 9.4 | Data Analysis | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P1 | 9.3 |
| 9.5 | Publication | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P1 | 9.4 |
| 9.6 | Peer Review | 3 | 3 | 1 | 1 | 3/3/0 | 7 | P1 | 9.5 |
| **Totals** | | **28** | **28** | **6** | **6** | **28/28/5** | **57** | | |

---

## Level 10 — Entrepreneurship

**Mission:** Build AI-powered businesses.
**Duration:** 4-6 weeks | **Hands-on:** 80%

| Module ID | Module Name | KPs | Labs | Projects | Assessments | Media (Art/vid/car) | Prod Days | Priority | Dependencies |
|-----------|-------------|-----|------|----------|-------------|---------------------|-----------|----------|--------------|
| 10.1 | Business Model Design | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P1 | L7 |
| 10.2 | Market Research | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P1 | 10.1 |
| 10.3 | Funding | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P1 | 10.1 |
| 10.4 | Team Building | 3 | 3 | 1 | 1 | 3/3/0 | 7 | P1 | 10.1 |
| 10.5 | Growth Strategy | 3 | 3 | 1 | 1 | 3/3/0 | 7 | P1 | 10.1 |
| 10.6 | Exit Strategy | 3 | 3 | 1 | 1 | 3/3/0 | 7 | P2 | 10.1 |
| **Totals** | | **24** | **24** | **6** | **6** | **24/24/3** | **51** | | |

---

## Level 11 — Mentorship

**Mission:** Guide and teach others effectively.
**Duration:** 4-6 weeks | **Hands-on:** 75%

| Module ID | Module Name | KPs | Labs | Projects | Assessments | Media (Art/vid/car) | Prod Days | Priority | Dependencies |
|-----------|-------------|-----|------|----------|-------------|---------------------|-----------|----------|--------------|
| 11.1 | Teaching Methods | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P0 | L8 |
| 11.2 | Mentoring Techniques | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P0 | 11.1 |
| 11.3 | Feedback | 3 | 3 | 1 | 1 | 3/3/0 | 7 | P0 | 11.1 |
| 11.4 | Assessment | 3 | 3 | 1 | 1 | 3/3/0 | 7 | P0 | 11.1 |
| 11.5 | Student Support | 3 | 3 | 1 | 1 | 3/3/0 | 7 | P0 | 11.1 |
| 11.6 | Community Building | 5 | 5 | 1 | 1 | 5/5/1 | 10 | P0 | 11.1 |
| **Totals** | | **24** | **24** | **6** | **6** | **24/24/3** | **51** | | |

---

## Level 12 — Institution Building

**Mission:** Build and lead educational institutions.
**Duration:** 4-6 weeks | **Hands-on:** 70%

| Module ID | Module Name | KPs | Labs | Projects | Assessments | Media (Art/vid/car) | Prod Days | Priority | Dependencies |
|-----------|-------------|-----|------|----------|-------------|---------------------|-----------|----------|--------------|
| 12.1 | Institutional Design | 5 | 5 | 1 | 1 | 5/5/1 | 12 | P1 | L11 |
| 12.2 | Governance | 5 | 5 | 1 | 1 | 5/5/1 | 12 | P1 | 12.1 |
| 12.3 | Curriculum Development | 5 | 5 | 1 | 1 | 5/5/1 | 12 | P1 | 12.1 |
| 12.4 | Community Building | 5 | 5 | 1 | 1 | 5/5/1 | 12 | P1 | 12.1 |
| 12.5 | Partnership Development | 3 | 3 | 1 | 1 | 3/3/0 | 7 | P1 | 12.1 |
| 12.6 | Sustainability | 3 | 3 | 1 | 1 | 3/3/0 | 7 | P1 | 12.1 |
| **Totals** | | **26** | **26** | **6** | **6** | **26/26/4** | **62** | | |

---

## Summary Totals

### By Level

| Level | Name | KPs | Labs | Projects | Assessments | Articles | Videos | Carousels | Prod Days |
|-------|------|-----|------|----------|-------------|----------|--------|-----------|-----------|
| 0 | Digital Foundations | 20 | 20 | 6 | 6 | 20 | 20 | 0 | 30 |
| 1 | AI Foundations | 25 | 25 | 6 | 6 | 25 | 25 | 4 | 30 |
| 2 | Prompt Engineering | 26 | 26 | 6 | 6 | 26 | 26 | 6 | 42 |
| 3 | AI Applications | 26 | 26 | 6 | 6 | 26 | 26 | 5 | 42 |
| 4 | AI Agents | 28 | 28 | 6 | 6 | 28 | 28 | 6 | 45 |
| 5 | Knowledge Systems | 30 | 30 | 6 | 6 | 30 | 30 | 6 | 48 |
| 6 | Automation | 28 | 28 | 6 | 6 | 28 | 28 | 5 | 43 |
| 7 | AI Products | 26 | 26 | 6 | 6 | 26 | 26 | 6 | 54 |
| 8 | Open Source Engineering | 24 | 24 | 6 | 6 | 24 | 24 | 4 | 39 |
| 9 | Research | 28 | 28 | 6 | 6 | 28 | 28 | 5 | 57 |
| 10 | Entrepreneurship | 24 | 24 | 6 | 6 | 24 | 24 | 3 | 51 |
| 11 | Mentorship | 24 | 24 | 6 | 6 | 24 | 24 | 3 | 51 |
| 12 | Institution Building | 26 | 26 | 6 | 6 | 26 | 26 | 4 | 62 |
| **TOTAL** | | **331** | **331** | **78** | **78** | **331** | **331** | **57** | **594** |

### Grand Totals

| Metric | Count |
|--------|-------|
| **Total Knowledge Packages** | 331 |
| **Total Labs** | 331 |
| **Total Projects** | 78 |
| **Total Assessments** | 78 |
| **Total Articles** | 331 |
| **Total Videos** | 331 |
| **Total Carousels** | 57 |
| **Total Media Assets** | 719 |
| **Total Estimated Production Days** | 594 |

### Production Effort by Difficulty

| Difficulty | Modules | Total Prod Days | % of Total |
|------------|---------|-----------------|------------|
| Beginner (L0-L1) | 12 | 60 | 10.1% |
| Intermediate (L2-L4, L6, L8) | 30 | 210 | 35.4% |
| Advanced (L5, L7, L9-L11) | 24 | 240 | 40.4% |
| Expert (L12) | 12 | 84 | 14.1% |

### Production Effort by Priority

| Priority | Modules | Total Prod Days | % of Total |
|----------|---------|-----------------|------------|
| P0 | 52 | 356 | 59.9% |
| P1 | 25 | 231 | 38.9% |
| P2 | 1 | 7 | 1.2% |

### Critical Path (P0 Only)

The minimum viable curriculum requires producing all P0 modules in dependency order:

**Phase 1 — Digital & AI Literacy (60 days)**
Level 0 (30d) + Level 1 (30d)

**Phase 2 — Prompt Engineering (42 days)**
Level 2 (42d)

**Phase 3 — Application Building (87 days)**
Level 3 (42d) + Level 4 (45d)

**Phase 4 — Knowledge & Automation (91 days)**
Level 5 (48d) + Level 6 (43d)

**Phase 5 — Products & Open Source (93 days)**
Level 7 (54d) + Level 8 (39d)

**Phase 6 — Mentorship (51 days)**
Level 11 (51d)

**Minimum Viable Curriculum Total: 424 days**

---

## All Modules — Master List

| # | Module ID | Module Name | Level | KPs | Labs | Proj | Assess | Media | Days | Priority |
|---|-----------|-------------|-------|-----|------|------|--------|-------|------|----------|
| 1 | 0.1 | Computer Basics | 0 | 4 | 4 | 1 | 1 | 8 | 5 | P0 |
| 2 | 0.2 | Internet Fundamentals | 0 | 4 | 4 | 1 | 1 | 8 | 5 | P0 |
| 3 | 0.3 | File Management | 0 | 3 | 3 | 1 | 1 | 6 | 5 | P0 |
| 4 | 0.4 | Basic Troubleshooting | 0 | 3 | 3 | 1 | 1 | 6 | 5 | P0 |
| 5 | 0.5 | Online Safety | 0 | 3 | 3 | 1 | 1 | 6 | 5 | P0 |
| 6 | 0.6 | Digital Communication | 0 | 3 | 3 | 1 | 1 | 6 | 5 | P0 |
| 7 | 1.1 | What is AI? | 1 | 5 | 5 | 1 | 1 | 11 | 5 | P0 |
| 8 | 1.2 | How AI Works | 1 | 5 | 5 | 1 | 1 | 11 | 5 | P0 |
| 9 | 1.3 | AI History | 1 | 3 | 3 | 1 | 1 | 6 | 5 | P1 |
| 10 | 1.4 | AI Ethics | 1 | 4 | 4 | 1 | 1 | 9 | 5 | P0 |
| 11 | 1.5 | AI Applications | 1 | 5 | 5 | 1 | 1 | 11 | 5 | P0 |
| 12 | 1.6 | AI Limitations | 1 | 3 | 3 | 1 | 1 | 6 | 5 | P0 |
| 13 | 2.1 | Prompt Fundamentals | 2 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 14 | 2.2 | Advanced Prompting | 2 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 15 | 2.3 | Prompt Patterns | 2 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 16 | 2.4 | Prompt Evaluation | 2 | 3 | 3 | 1 | 1 | 7 | 7 | P0 |
| 17 | 2.5 | Prompt Optimization | 2 | 3 | 3 | 1 | 1 | 7 | 7 | P0 |
| 18 | 2.6 | Prompt Applications | 2 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 19 | 3.1 | LLM API Integration | 3 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 20 | 3.2 | Application Architecture | 3 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 21 | 3.3 | User Experience | 3 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 22 | 3.4 | Testing | 3 | 3 | 3 | 1 | 1 | 7 | 7 | P0 |
| 23 | 3.5 | Deployment | 3 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 24 | 3.6 | Maintenance | 3 | 3 | 3 | 1 | 1 | 6 | 7 | P1 |
| 25 | 4.1 | Agent Concepts | 4 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 26 | 4.2 | Agent Architecture | 4 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 27 | 4.3 | Tool Integration | 4 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 28 | 4.4 | Agent Collaboration | 4 | 5 | 5 | 1 | 1 | 11 | 10 | P1 |
| 29 | 4.5 | Agent Safety | 4 | 3 | 3 | 1 | 1 | 7 | 7 | P0 |
| 30 | 4.6 | Agent Deployment | 4 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 31 | 5.1 | Knowledge Representation | 5 | 5 | 5 | 1 | 1 | 11 | 7 | P1 |
| 32 | 5.2 | Information Retrieval | 5 | 5 | 5 | 1 | 1 | 11 | 7 | P1 |
| 33 | 5.3 | Knowledge Graphs | 5 | 5 | 5 | 1 | 1 | 11 | 10 | P1 |
| 34 | 5.4 | Vector Databases | 5 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 35 | 5.5 | RAG Systems | 5 | 5 | 5 | 1 | 1 | 11 | 10 | P0 |
| 36 | 5.6 | Knowledge Applications | 5 | 5 | 5 | 1 | 1 | 11 | 7 | P1 |
| 37 | 6.1 | Scripting Fundamentals | 6 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 38 | 6.2 | Browser Automation | 6 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 39 | 6.3 | API Automation | 6 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 40 | 6.4 | Workflow Automation | 6 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 41 | 6.5 | AI-Powered Automation | 6 | 5 | 5 | 1 | 1 | 11 | 10 | P0 |
| 42 | 6.6 | Automation Best Practices | 6 | 3 | 3 | 1 | 1 | 6 | 5 | P1 |
| 43 | 7.1 | Product Thinking | 7 | 5 | 5 | 1 | 1 | 11 | 10 | P0 |
| 44 | 7.2 | UX Design | 7 | 5 | 5 | 1 | 1 | 11 | 10 | P0 |
| 45 | 7.3 | Technical Architecture | 7 | 5 | 5 | 1 | 1 | 11 | 10 | P0 |
| 46 | 7.4 | Development Process | 7 | 5 | 5 | 1 | 1 | 11 | 10 | P0 |
| 47 | 7.5 | Launch Strategy | 7 | 3 | 3 | 1 | 1 | 7 | 7 | P1 |
| 48 | 7.6 | Growth | 7 | 3 | 3 | 1 | 1 | 7 | 7 | P1 |
| 49 | 8.1 | Open Source Culture | 8 | 3 | 3 | 1 | 1 | 6 | 5 | P0 |
| 50 | 8.2 | Git Mastery | 8 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 51 | 8.3 | Contribution Workflow | 8 | 5 | 5 | 1 | 1 | 11 | 7 | P0 |
| 52 | 8.4 | Code Review | 8 | 3 | 3 | 1 | 1 | 7 | 5 | P0 |
| 53 | 8.5 | Documentation | 8 | 3 | 3 | 1 | 1 | 6 | 5 | P0 |
| 54 | 8.6 | Community Building | 8 | 5 | 5 | 1 | 1 | 11 | 10 | P1 |
| 55 | 9.1 | Research Methods | 9 | 5 | 5 | 1 | 1 | 11 | 10 | P1 |
| 56 | 9.2 | Literature Review | 9 | 5 | 5 | 1 | 1 | 11 | 10 | P1 |
| 57 | 9.3 | Experiment Design | 9 | 5 | 5 | 1 | 1 | 11 | 10 | P1 |
| 58 | 9.4 | Data Analysis | 9 | 5 | 5 | 1 | 1 | 11 | 10 | P1 |
| 59 | 9.5 | Publication | 9 | 5 | 5 | 1 | 1 | 11 | 10 | P1 |
| 60 | 9.6 | Peer Review | 9 | 3 | 3 | 1 | 1 | 6 | 7 | P1 |
| 61 | 10.1 | Business Model Design | 10 | 5 | 5 | 1 | 1 | 11 | 10 | P1 |
| 62 | 10.2 | Market Research | 10 | 5 | 5 | 1 | 1 | 11 | 10 | P1 |
| 63 | 10.3 | Funding | 10 | 5 | 5 | 1 | 1 | 11 | 10 | P1 |
| 64 | 10.4 | Team Building | 10 | 3 | 3 | 1 | 1 | 6 | 7 | P1 |
| 65 | 10.5 | Growth Strategy | 10 | 3 | 3 | 1 | 1 | 6 | 7 | P1 |
| 66 | 10.6 | Exit Strategy | 10 | 3 | 3 | 1 | 1 | 6 | 7 | P2 |
| 67 | 11.1 | Teaching Methods | 11 | 5 | 5 | 1 | 1 | 11 | 10 | P0 |
| 68 | 11.2 | Mentoring Techniques | 11 | 5 | 5 | 1 | 1 | 11 | 10 | P0 |
| 69 | 11.3 | Feedback | 11 | 3 | 3 | 1 | 1 | 6 | 7 | P0 |
| 70 | 11.4 | Assessment | 11 | 3 | 3 | 1 | 1 | 6 | 7 | P0 |
| 71 | 11.5 | Student Support | 11 | 3 | 3 | 1 | 1 | 6 | 7 | P0 |
| 72 | 11.6 | Community Building | 11 | 5 | 5 | 1 | 1 | 11 | 10 | P0 |
| 73 | 12.1 | Institutional Design | 12 | 5 | 5 | 1 | 1 | 11 | 12 | P1 |
| 74 | 12.2 | Governance | 12 | 5 | 5 | 1 | 1 | 11 | 12 | P1 |
| 75 | 12.3 | Curriculum Development | 12 | 5 | 5 | 1 | 1 | 11 | 12 | P1 |
| 76 | 12.4 | Community Building | 12 | 5 | 5 | 1 | 1 | 11 | 12 | P1 |
| 77 | 12.5 | Partnership Development | 12 | 3 | 3 | 1 | 1 | 6 | 7 | P1 |
| 78 | 12.6 | Sustainability | 12 | 3 | 3 | 1 | 1 | 6 | 7 | P1 |