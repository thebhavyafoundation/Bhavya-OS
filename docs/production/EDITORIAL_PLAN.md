# Editorial Plan — Production Era v1.0

**Document:** EP-001
**Version:** 1.0
**Status:** Active
**Effective:** 2026-08-05
**Authority:** Production Team

---

## 1. Overview

The Editorial Plan is the canonical publication planner for Bhavya Foundation. It manages scheduling, content types, channel distribution, themes, and seasonal planning across all production activities.

**Core Principle:** Every publication traces back to a Knowledge Package. No content exists in isolation.

---

## 2. Weekly Publishing Schedule

### Production Week (Monday–Sunday)

| Day | Time Block | Activity | Output | Owner |
|-----|-----------|----------|--------|-------|
| Monday | 09:00–12:00 | Research + source verification | Research report | Content Lead |
| Monday | 13:00–17:00 | KP authoring (concepts, definitions, examples) | Draft KP | Content Lead |
| Tuesday | 09:00–12:00 | KP authoring (misconceptions, exercises, references) | Complete KP | Content Lead |
| Tuesday | 13:00–16:00 | Technical review | Review report | Tech Reviewer |
| Wednesday | 09:00–13:00 | Educational review | Edu review report | Edu Reviewer |
| Wednesday | 14:00–17:00 | KP revision + finalization | Final KP | Content Lead |
| Thursday | 10:00–12:00 | Founder review + approval | Approval tag | Founder |
| Friday | 09:00–12:00 | Publication (Knowledge Studio, GitHub, Website) | Published KP | Distribution Lead |
| Friday | 13:00–17:00 | Distribution start (LinkedIn, Newsletter) | Social assets | Distribution Lead |
| Saturday | 09:00–13:00 | Distribution complete + community post | Full distribution | Distribution Lead |
| Saturday | 14:00–16:00 | Community engagement | Discussion thread | Community Manager |
| Sunday | 10:00–12:00 | Analytics collection + reporting | Weekly report | Analytics Lead |

### Weekly Deliverables

| Deliverable | Count | Pipeline Source |
|-------------|-------|-----------------|
| Knowledge Package | 1 | KP Factory |
| Lesson | 1 | Lesson Builder |
| Lab | 1 | Lab Builder |
| Assessment | 1 | Assessment Builder |
| Article | 1 | Website Builder |
| Video Script | 1 | Visual Spec + Video Builder |
| LinkedIn Carousel | 1 | Content Factory |
| Newsletter Section | 1 | Content Factory |
| GitHub Repository | 1 | GitHub OS |
| Blog Post | 1 | Website Builder |
| Portfolio Template | 1 | Portfolio Builder |
| Mentor Guide | 1 | Teacher Guide Builder |
| Student Workbook | 1 | Workbook Builder |

**Total weekly output: 13 assets from 1 Knowledge Package**

---

## 3. Content Types

### 3.1 Knowledge Package (KP)

| Attribute | Value |
|-----------|-------|
| **Type ID** | KP |
| **Description** | Canonical educational unit — the single source of truth |
| **Schema** | `KNOWLEDGE_PACKAGE_FACTORY.md` |
| **Sizes** | ConceptKP (1 concept), TopicKP (3-5 concepts), ModuleKP (8-15 concepts) |
| **Review** | Technical + Educational + Founder |
| **Publishing** | Knowledge Studio, GitHub, Website |
| **Frequency** | 1 per week |

### 3.2 Lesson

| Attribute | Value |
|-----------|-------|
| **Type ID** | LESSON |
| **Description** | 6-section structured lesson from KP |
| **Builder** | `packages/runtime/builders/lesson.mjs` |
| **Output** | 6 sections, 5 learning outcomes, 5 vocabulary terms |
| **Review** | Educational |
| **Publishing** | Knowledge Studio, Website |
| **Frequency** | 1 per week |

### 3.3 Lab

| Attribute | Value |
|-----------|-------|
| **Type ID** | LAB |
| **Description** | Hands-on coding environment from KP |
| **Builder** | Lab Builder |
| **Output** | Step-by-step instructions, starter code, solution code |
| **Review** | Technical |
| **Publishing** | Knowledge Studio, GitHub |
| **Frequency** | 1 per week |

### 3.4 Assessment

| Attribute | Value |
|-----------|-------|
| **Type ID** | ASSESSMENT |
| **Description** | 15-question assessment from KP (MCQ, short-answer, reflection, practical) |
| **Builder** | `packages/runtime/builders/assessment.mjs` |
| **Output** | 15 questions, 8 MCQ with real KO definitions as options |
| **Review** | Technical + Educational |
| **Publishing** | Knowledge Studio, Website |
| **Frequency** | 1 per week |

### 3.5 Article

| Attribute | Value |
|-----------|-------|
| **Type ID** | ARTICLE |
| **Description** | Website article from KP |
| **Builder** | `packages/runtime/builders/website.mjs` |
| **Output** | 4 HTML pages with CSS, navigation, structured content |
| **Review** | Content |
| **Publishing** | Website, Knowledge Studio |
| **Frequency** | 1 per week |

### 3.6 Video Script

| Attribute | Value |
|-----------|-------|
| **Type ID** | VIDEO |
| **Description** | Remotion scene graph video from KP |
| **Builder** | `packages/runtime/builders/video.mjs` |
| **Output** | 8 compositions, 196s at 1920x1080 |
| **Review** | Content + Brand |
| **Publishing** | YouTube, Website |
| **Frequency** | 1 per week |

### 3.7 LinkedIn Carousel

| Attribute | Value |
|-----------|-------|
| **Type ID** | CAROUSEL |
| **Description** | 3-5 slide LinkedIn carousel from KP |
| **Builder** | Content Factory |
| **Output** | Slide deck with brand styling |
| **Review** | Brand |
| **Publishing** | LinkedIn |
| **Frequency** | 1 per week |

### 3.8 Newsletter Section

| Attribute | Value |
|-----------|-------|
| **Type ID** | NEWSLETTER |
| **Description** | Weekly digest section from KP |
| **Builder** | Content Factory |
| **Output** | Newsletter section with summary, key takeaways, CTA |
| **Review** | Content |
| **Publishing** | Email newsletter |
| **Frequency** | 1 per week |

### 3.9 GitHub Repository

| Attribute | Value |
|-----------|-------|
| **Type ID** | REPO |
| **Description** | Repository template from KP + Lab + Project |
| **Builder** | GitHub OS |
| **Output** | README, architecture, issues, project board |
| **Review** | Technical |
| **Publishing** | GitHub |
| **Frequency** | 1 per week |

### 3.10 Blog Post

| Attribute | Value |
|-----------|-------|
| **Type ID** | BLOG |
| **Description** | Blog post from KP |
| **Builder** | Website Builder |
| **Output** | MDX blog post with frontmatter |
| **Review** | Content |
| **Publishing** | Website blog |
| **Frequency** | 1 per week |

### 3.11 Portfolio Template

| Attribute | Value |
|-----------|-------|
| **Type ID** | PORTFOLIO |
| **Description** | Portfolio artifact template from KP + Project |
| **Builder** | Portfolio Builder |
| **Output** | Portfolio page, case study, architecture summary |
| **Review** | Educational |
| **Publishing** | Knowledge Studio |
| **Frequency** | 1 per week |

### 3.12 Mentor Guide

| Attribute | Value |
|-----------|-------|
| **Type ID** | GUIDE |
| **Description** | Teacher/mentor guide from KP |
| **Builder** | `packages/runtime/builders/teacher-guide.mjs` |
| **Output** | 5 materials, 6 discussion prompts, timing guide |
| **Review** | Educational |
| **Publishing** | Knowledge Studio |
| **Frequency** | 1 per week |

### 3.13 Student Workbook

| Attribute | Value |
|-----------|-------|
| **Type ID** | WORKBOOK |
| **Description** | Student workbook from KP |
| **Builder** | `packages/runtime/builders/workbook.mjs` |
| **Output** | 8 pages with key terms, exercises, reflections |
| **Review** | Educational |
| **Publishing** | Knowledge Studio |
| **Frequency** | 1 per week |

---

## 4. Channel Distribution

### 4.1 Channel Matrix

| Channel | Content Types | Frequency | Timing | Owner |
|---------|--------------|-----------|--------|-------|
| Knowledge Studio | KP, Lesson, Lab, Assessment, Portfolio, Guide, Workbook | Weekly | Friday AM | Distribution Lead |
| GitHub | KO JSON, Repository, README | Weekly | Friday AM | Distribution Lead |
| Website | Article, Blog, Video | Weekly | Friday PM | Distribution Lead |
| LinkedIn | Carousel, Founder Post | Weekly | Saturday AM | Content Lead |
| Newsletter | Weekly Digest | Weekly | Saturday PM | Distribution Lead |
| Community | Discussion Post | Weekly | Saturday PM | Community Manager |

### 4.2 Channel-Specific Formatting

#### Knowledge Studio
- Full KP in JSON format
- Lesson in structured sections
- Lab with step-by-step instructions
- Assessment with answer keys
- All metadata (tags, difficulty, grade, Bloom's levels)

#### GitHub
- KO JSON file with schema validation
- README.md with overview, prerequisites, learning outcomes
- Issues for community contributions
- Project board for tracking
- CONTRIBUTING.md with guidelines

#### Website
- Article in MDX with frontmatter
- Blog post with SEO metadata
- Video embedded with transcript
- Related KPs linked
- Search-indexed content

#### LinkedIn
- 3-5 slide carousel with brand styling
- Founder post with personal perspective
- Key takeaways highlighted
- Call-to-action to full content
- Hashtags: #BhavyaFoundation #AI #Education

#### Newsletter
- Weekly digest section (500-800 words)
- Key takeaways (3-5 bullets)
- Link to full KP
- Upcoming content preview
- Community highlight

#### Community
- Discussion prompt tied to KP topic
- Question for community engagement
- Resource links
- Invitation to contribute
- Feedback request

### 4.3 Distribution Timing

```
Friday 09:00  → Knowledge Studio publish
Friday 10:00  → GitHub push
Friday 14:00  → Website article live
Saturday 09:00 → LinkedIn carousel + founder post
Saturday 14:00 → Newsletter section queued
Saturday 15:00 → Community discussion posted
```

---

## 5. Content Themes by Month

### Month 1 (August 2026): Foundation — What is AI?
**Theme:** Introduction to Artificial Intelligence
**Level:** 0-1
**KPs:** 4

| Week | KP Topic | Domain |
|------|----------|--------|
| 1 | What is AI? | AI |
| 2 | What are LLMs? | AI |
| 3 | Prompt Engineering Fundamentals | AI |
| 4 | What are AI Agents? | AI |

**Assets:** 4 KPs, 4 lessons, 4 labs, 4 assessments, 4 articles, 4 videos, 4 carousels, 4 newsletters

### Month 2 (September 2026): Building — Tools and Protocols
**Theme:** AI Development Tools
**Level:** 1-2
**KPs:** 4

| Week | KP Topic | Domain |
|------|----------|--------|
| 5 | Model Context Protocol | AI |
| 6 | Browser Automation with AI | AI |
| 7 | Building Knowledge Systems | AI |
| 8 | Contributing to Open Source | Open Source |

### Month 3 (October 2026): Deploying — From Dev to Production
**Theme:** Production Deployment
**Level:** 2
**KPs:** 4

| Week | KP Topic | Domain |
|------|----------|--------|
| 9 | Deploying AI Applications | Cloud |
| 10 | Integrating AI into Applications | Web Dev |
| 11 | Building Your Portfolio | Career |
| 12 | AI Career Paths | Career |

### Month 4 (November 2026): Data — Understanding Data Science
**Theme:** Data Foundations
**Level:** 2-3
**KPs:** 4

| Week | KP Topic | Domain |
|------|----------|--------|
| 13 | What is Data Science? | Data Science |
| 14 | Data Collection and Cleaning | Data Science |
| 15 | Data Visualization | Data Science |
| 16 | Statistical Foundations | Data Science |

### Month 5 (December 2026): Intelligence — Machine Learning
**Theme:** Machine Learning Basics
**Level:** 3
**KPs:** 4

| Week | KP Topic | Domain |
|------|----------|--------|
| 17 | Supervised Learning | ML |
| 18 | Unsupervised Learning | ML |
| 19 | Neural Networks | ML |
| 20 | Deep Learning | ML |

### Month 6 (January 2027): Applications — Real-World AI
**Theme:** AI in Practice
**Level:** 3-4
**KPs:** 4

| Week | KP Topic | Domain |
|------|----------|--------|
| 21 | Computer Vision | AI |
| 22 | Natural Language Processing | AI |
| 23 | Recommendation Systems | AI |
| 24 | AI in Healthcare | Healthcare |

### Month 7 (February 2027): Security — Protecting Systems
**Theme:** Cybersecurity Fundamentals
**Level:** 4-5
**KPs:** 4

| Week | KP Topic | Domain |
|------|----------|--------|
| 25 | What is Cybersecurity? | Security |
| 26 | Network Security | Security |
| 27 | Application Security | Security |
| 28 | AI-Powered Security | Security |

### Month 8 (March 2027): Cloud — Infrastructure
**Theme:** Cloud Computing
**Level:** 5
**KPs:** 4

| Week | KP Topic | Domain |
|------|----------|--------|
| 29 | Cloud Computing Fundamentals | Cloud |
| 30 | AWS for AI | Cloud |
| 31 | Azure for AI | Cloud |
| 32 | GCP for AI | Cloud |

### Month 9 (April 2027): Agents — Advanced AI
**Theme:** AI Agent Systems
**Level:** 5-6
**KPs:** 4

| Week | KP Topic | Domain |
|------|----------|--------|
| 33 | Multi-Agent Systems | AI |
| 34 | Agent Communication Protocols | AI |
| 35 | Agent Memory and Learning | AI |
| 36 | Agent Deployment | AI |

### Month 10 (May 2027): Products — Building for Users
**Theme:** AI Product Development
**Level:** 6-7
**KPs:** 4

| Week | KP Topic | Domain |
|------|----------|--------|
| 37 | AI Product Design | Product |
| 38 | User Research for AI | Product |
| 39 | AI Ethics in Products | Ethics |
| 40 | Measuring AI Impact | Product |

### Month 11 (June 2027): Open Source — Contributing Back
**Theme:** Open Source Leadership
**Level:** 7
**KPs:** 4

| Week | KP Topic | Domain |
|------|----------|--------|
| 41 | Leading Open Source Projects | Open Source |
| 42 | Community Building | Community |
| 43 | Open Source Governance | Governance |
| 44 | Sustainable Open Source | Open Source |

### Month 12 (July 2027): Institution — Building the Future
**Theme:** Institution Building
**Level:** 7-8
**KPs:** 4

| Week | KP Topic | Domain |
|------|----------|--------|
| 45 | Building Educational Institutions | Institution |
| 46 | Curriculum Design at Scale | Institution |
| 47 | Measuring Institutional Impact | Institution |
| 48 | The Future of AI Education | Institution |

---

## 6. Seasonal Content Planning

### Academic Calendar Alignment

| Season | Period | Content Focus | Audience |
|--------|--------|---------------|----------|
| Summer Foundation | Aug–Oct | Levels 0-2, beginner-friendly, high-level introductions | New students, career changers |
| Winter Deep Dive | Nov–Jan | Levels 3-5, technical depth, hands-on projects | Intermediate learners |
| Spring Applications | Feb–Apr | Levels 5-7, real-world applications, industry focus | Advanced learners |
| Summer Leadership | May–Jul | Levels 7-8, open source, institution building | Expert learners, mentors |

### Content Adaptation by Season

#### Summer (Aug–Oct)
- **Tone:** Welcoming, accessible, inspirational
- **Examples:** Everyday AI applications, consumer products
- **Projects:** Personal AI tools, simple automations
- **Media:** Short-form videos, beginner carousels

#### Winter (Nov–Jan)
- **Tone:** Technical, rigorous, hands-on
- **Examples:** Industry applications, research papers
- **Projects:** Data analysis pipelines, ML models
- **Media:** Deep-dive tutorials, technical articles

#### Spring (Feb–Apr)
- **Tone:** Practical, career-focused, industry-aligned
- **Examples:** Enterprise applications, startup stories
- **Projects:** Full-stack AI applications, deployment pipelines
- **Media:** Career-focused content, industry insights

#### Summer (May–Jul)
- **Tone:** Leadership, vision, community-building
- **Examples:** Open source projects, institutional case studies
- **Projects:** Community tools, educational platforms
- **Media:** Thought leadership, vision pieces

---

## 7. Evergreen Content Strategy

### Evergreen Categories

| Category | Content Type | Update Frequency | KP Examples |
|----------|-------------|-----------------|-------------|
| Foundational Concepts | ConceptKP | Quarterly review | "What is AI?", "What are LLMs?" |
| Best Practices | TopicKP | Semi-annual review | "Prompt Engineering", "Code Review" |
| Tool Guides | TopicKP | When tool updates | "Using GitHub Copilot", "MCP Setup" |
| Career Development | TopicKP | Annual review | "AI Career Paths", "Portfolio Building" |
| Ethics and Governance | TopicKP | Semi-annual review | "AI Ethics", "Responsible AI" |

### Evergreen Update Protocol

1. **Quarterly Audit:** Review all evergreen KPs for accuracy
2. **Version Control:** Update KP version number, log changes
3. **Cross-References:** Verify all prerequisite and related KP links
4. **Example Refresh:** Update examples to current products/services
5. **Reference Check:** Verify all URLs and citations still resolve

### Evergreen Quality Standards

- All examples must be verifiable and current
- No time-sensitive claims without expiration dates
- Prerequisites must link to existing KPs
- References must include at least 1 freely accessible resource
- Indian context examples required (minimum 1 per KP)

---

## 8. Content Calendar Integration

### Calendar System

The Editorial Plan integrates with Social OS v2's editorial calendar:

```http
POST /api/calendar
{
  "action": "create",
  "type": "knowledge_package",
  "title": "KP-005: What is Data Science?",
  "platforms": ["knowledge-studio", "github", "website", "linkedin", "newsletter"],
  "scheduledDate": "2026-11-03T09:00:00Z"
}
```

### Calendar Status Flow

```
draft → scheduled → in_progress → in_review → published → completed
```

### Calendar Stats

```http
GET /api/calendar?action=stats
```

Returns: total entries, draft/scheduled/published counts, this-week/this-month counts.

---

## 9. Content Governance

### Editorial Review Board

| Role | Responsibility | Review Scope |
|------|---------------|-------------|
| Content Lead | KP authoring, quality | All KPs |
| Technical Reviewer | Technical accuracy | Technical claims, code examples |
| Educational Reviewer | Pedagogical quality | Learning outcomes, exercises |
| Brand Reviewer | Brand consistency | All published content |
| Founder | Final approval | All KPs |

### Content Approval Workflow

```
Author → Technical Review → Educational Review → Brand Review → Founder Approval → Publish
```

### Content Freeze Dates

| Event | Freeze Date | Scope |
|-------|-------------|-------|
| Q1 Review | Last Friday of Q1 | No new KPs published during review |
| Q2 Review | Last Friday of Q2 | No new KPs published during review |
| Q3 Review | Last Friday of Q3 | No new KPs published during review |
| Q4 Review | Last Friday of Q4 | No new KPs published during review |
| Annual Review | Last week of December | Full content audit |

---

## 10. Metrics and Reporting

### Weekly Editorial Metrics

| Metric | Target | Source |
|--------|--------|--------|
| KPs published | 1 | Publication log |
| Assets generated | 13 | Pipeline output |
| Quality score avg | >= 4.0 | Quality rubric |
| Gate pass rate | >= 70% | Gate logs |
| On-time publication | 100% | Calendar |

### Monthly Editorial Report

Published on the 5th of each month. Includes:
- Production summary (KPs, assets, quality)
- Channel performance (views, engagement, growth)
- Content theme assessment
- Seasonal alignment check
- Next month preview

---

## Appendix: Key Files

| File | Purpose |
|------|---------|
| `docs/production/PRODUCTION_MANIFESTO.md` | Production Era declaration |
| `docs/production/EDITORIAL_PLAN.md` | This document |
| `docs/production/CONTENT_RELEASE_PLAN.md` | 12-month release plan |
| `docs/production/KNOWLEDGE_PACKAGE_FACTORY.md` | KP template and quality gates |
| `docs/production/PRODUCTION_PIPELINE.md` | Weekly production workflow |
| `docs/production/QUALITY_GATES.md` | 10 quality gates |
| `docs/production/PRODUCTION_METRICS.md` | Metrics framework |
| `docs/social-os-v2/EDITORIAL_CALENDAR.md` | Calendar API |

---

*This document is the single source of truth for editorial planning. All content scheduling must conform to this plan.*
