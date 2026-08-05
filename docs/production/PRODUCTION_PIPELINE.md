# Production Pipeline — Bhavya Foundation

**Version:** 1.0
**Status:** Active
**Effective:** 2026-01-01
**Authority:** Production Governance

---

## 1. Overview

Every week, Bhavya Foundation produces educational assets from one canonical Knowledge Package (KP). The pipeline runs Monday–Sunday with defined owners, inputs, outputs, quality gates, and time allocations.

**Core Principle:** No asset ships without passing all quality gates. No stage begins without its inputs validated.

---

## 2. Weekly Calendar Template

| Day | Stage | Owner | Hours |
|-----|-------|-------|-------|
| Monday | Research + KP Authoring Start | Content Lead | 6 |
| Tuesday | KP Authoring Complete + Technical Review | Content Lead + Tech Reviewer | 6 |
| Wednesday | Educational Review | Edu Reviewer | 4 |
| Thursday | Founder Review | Founder (Manohar Lal) | 2 |
| Friday | Publication + Distribution Start | Distribution Lead | 6 |
| Saturday | Distribution Complete | Distribution Lead | 4 |
| Sunday | Analytics Collection | Analytics Lead | 2 |

**Total weekly hours:** 30 (distributed across team)

---

## 3. Pipeline Stages

### Stage 1: Research (Monday)

**Owner:** Content Lead

**Inputs:**
- Weekly topic assignment (from quarterly plan)
- Existing Knowledge Objects in `bhavya-ai-lab/knowledge/objects/`
- Source material (textbooks, papers, authoritative references)

**Outputs:**
- Source verification report (3+ authoritative sources per claim)
- Content outline with citations
- Identified gaps in existing KOs

**Quality Gates:**
- [ ] Minimum 3 authoritative sources verified
- [ ] No unverified claims in outline
- [ ] Topic aligns with quarterly curriculum plan
- [ ] Existing KOs reviewed for reuse opportunities

**Time Allocation:** 3 hours

**Tools/Systems:**
- `@bhavya/constitution` — search for existing knowledge
- `bhavya-ai-lab/knowledge/objects/` — existing KOs
- Web search for source verification
- Git for tracking source changes

---

### Stage 2: Knowledge Package Authoring (Monday–Tuesday)

**Owner:** Content Lead

**Inputs:**
- Research output (verified sources, outline)
- KO template (from `packages/constitution/templates/`)
- Existing KO examples for format reference

**Outputs:**
- Complete Knowledge Package JSON following factory template
- Minimum 5 concepts with definitions, examples, misconceptions
- 3+ difficulty levels (beginner, intermediate, advanced)
- Exercise sets per concept

**Quality Gates:**
- [ ] KP validates against schema (`npx tsx scripts/validate-ko.ts`)
- [ ] All 5 required fields present (title, domain, concepts, definitions, exercises)
- [ ] Each concept has: name, description, difficulty, examples, misconceptions
- [ ] No placeholder text remains
- [ ] Educational objectives stated explicitly

**Time Allocation:** 6 hours (3 Monday, 3 Tuesday)

**Tools/Systems:**
- KO editor in Knowledge Studio
- Schema validation script
- Git for version control
- `@bhavya/constitution` for citation requirements

---

### Stage 3: Technical Review (Tuesday)

**Owner:** Technical Reviewer (rotating role)

**Inputs:**
- Complete KP from Stage 2
- Technical reference materials
- Review checklist

**Outputs:**
- Technical review report (pass/fail with annotations)
- Corrections applied to KP
- Sign-off document

**Quality Gates:**
- [ ] All technical claims accurate and current
- [ ] Code examples compile and run (if applicable)
- [ ] No factual errors in definitions
- [ ] Difficulty levels appropriate for target audience
- [ ] Cross-references to other KOs correct

**Time Allocation:** 3 hours

**Tools/Systems:**
- KP diff viewer
- Code execution environment
- Review checklist template
- Git comments for feedback

---

### Stage 4: Educational Review (Wednesday)

**Owner:** Educational Reviewer

**Inputs:**
- Technically-reviewed KP
- Pedagogical standards document
- Learner persona profiles

**Outputs:**
- Educational quality report
- Learning outcome alignment check
- Pedagogical improvements applied
- Sign-off document

**Quality Gates:**
- [ ] Learning outcomes measurable and specific
- [ ] Content follows scaffolded learning progression
- [ ] Examples are relatable to target audience
- [ ] Misconceptions addressed proactively
- [ ] Exercises test understanding, not memorization
- [ ] Accessibility: reading level appropriate

**Time Allocation:** 4 hours

**Tools/Systems:**
- Pedagogical rubric
- Reading level analyzer
- Learning outcome validator
- Git comments for feedback

---

### Stage 5: Founder Review (Thursday)

**Owner:** Founder (Manohar Lal)

**Inputs:**
- Educationally-reviewed KP
- Executive summary (1 page)
- Risk assessment (if any controversial topics)

**Outputs:**
- Final approval or rejection with reasons
- Brand voice adjustments (if needed)
- Strategic alignment confirmation

**Quality Gates:**
- [ ] Aligns with institutional mission
- [ ] Brand voice consistent
- [ ] No reputational risk
- [ ] Strategic value confirmed
- [ ] Final sign-off recorded

**Time Allocation:** 2 hours

**Tools/Systems:**
- Executive summary template
- Approval workflow (email/Slack)
- Git tag for approved version
- `@bhavya/constitution` for mission alignment

---

### Stage 6: Publication (Friday)

**Owner:** Distribution Lead

**Inputs:**
- Founder-approved KP
- Publication checklist
- Channel-specific formatting requirements

**Outputs:**
- Published KP in Knowledge Studio
- GitHub repository updated with new KO
- Website article published
- Publication log entry

**Quality Gates:**
- [ ] KP renders correctly in Knowledge Studio
- [ ] GitHub commit follows convention
- [ ] Website article loads and displays properly
- [ ] All links functional
- [ ] Metadata complete (tags, categories, difficulty)
- [ ] SEO basics covered (title, description, keywords)

**Time Allocation:** 4 hours

**Tools/Systems:**
- Knowledge Studio publish API
- GitHub CLI (`gh`)
- Website CMS
- Publication log (`bhavya-ai-lab/logs/publication.json`)

---

### Stage 7: Multi-Channel Distribution (Friday–Saturday)

**Owner:** Distribution Lead

**Inputs:**
- Published KP
- Channel templates
- Brand assets (logos, fonts, colors)

**Outputs:**
- LinkedIn carousel (3-5 slides)
- Newsletter section draft
- Community post/discussion prompt
- Social media copy

**Quality Gates:**
- [ ] LinkedIn carousel follows brand guidelines
- [ ] Newsletter copy reviewed for tone
- [ ] Community post encourages discussion
- [ ] All channels tagged consistently
- [ ] No channel publishes duplicate content

**Time Allocation:** 6 hours (3 Friday, 3 Saturday)

**Tools/Systems:**
- LinkedIn carousel generator
- Newsletter platform (Mailchimp/similar)
- Community platform (Discord/Circle)
- Brand asset library (`@bhavya/platform-ui`)

**Distribution Channels:**

| Channel | Format | Timing | Owner |
|---------|--------|--------|-------|
| Knowledge Studio | Full KP | Friday AM | Distribution Lead |
| GitHub | KO JSON + README | Friday AM | Distribution Lead |
| Website | Article | Friday PM | Distribution Lead |
| LinkedIn | Carousel + Founder Post | Saturday AM | Content Lead |
| Newsletter | Weekly Digest | Saturday PM | Distribution Lead |
| Community | Discussion Post | Saturday PM | Community Manager |

---

### Stage 8: Analytics Collection (Sunday)

**Owner:** Analytics Lead

**Inputs:**
- Channel analytics from past week
- User feedback (comments, issues, discussions)
- Technical metrics (downloads, views, time-on-page)

**Outputs:**
- Weekly analytics report
- Feedback summary
- Improvement recommendations
- Next week's topic suggestions based on demand

**Quality Gates:**
- [ ] All channel metrics collected
- [ ] Feedback categorized (bug, improvement, request)
- [ ] Recommendations prioritized by impact
- [ ] Report shared with team before Monday

**Time Allocation:** 2 hours

**Tools/Systems:**
- Analytics dashboard
- GitHub Issues (for technical feedback)
- Community analytics
- Newsletter open/click rates
- LinkedIn engagement metrics

---

### Stage 9: Improvement (Next Monday)

**Owner:** Content Lead

**Inputs:**
- Weekly analytics report
- Feedback summary
- Improvement recommendations

**Outputs:**
- Updated KP (if corrections needed)
- Process improvement notes
- Next week's topic confirmed
- Retrospective entry

**Quality Gates:**
- [ ] All critical feedback addressed
- [ ] Process improvements documented
- [ ] Next topic aligned with demand data
- [ ] Retrospective completed

**Time Allocation:** 2 hours

**Tools/Systems:**
- Git for KP updates
- Retrospective template
- Topic backlog (`bhavya-ai-lab/data/topic-backlog.json`)
- Process improvement log

---

## 4. Roles and Responsibilities

| Role | Primary Responsibility | Weekly Hours | Backup |
|------|----------------------|--------------|--------|
| Content Lead | Research, KP authoring, improvement | 8 | Technical Reviewer |
| Technical Reviewer | Technical accuracy verification | 3 | Content Lead |
| Educational Reviewer | Pedagogical quality assurance | 4 | Content Lead |
| Founder (Manohar Lal) | Final approval, strategic alignment | 2 | — |
| Distribution Lead | Publication, multi-channel distribution | 10 | Content Lead |
| Community Manager | Community engagement, feedback collection | 2 | Distribution Lead |
| Analytics Lead | Metrics collection, reporting | 2 | Distribution Lead |

**Total:** 31 hours/week across team

---

## 5. Escalation Procedures

### Technical Issues
1. **Level 1:** Technical Reviewer flags issue → Content Lead fixes within 4 hours
2. **Level 2:** Issue blocks publication → Escalate to Founder with risk assessment
3. **Level 3:** Critical error post-publication → Immediate rollback, incident report within 24 hours

### Schedule Delays
1. **Level 1:** Stage runs over by <1 hour → Absorb in buffer time
2. **Level 2:** Stage runs over by 1-3 hours → Notify next stage owner, adjust timeline
3. **Level 3:** Stage delayed by >3 hours → Escalate to Founder, decide whether to skip stage or delay publication

### Quality Gate Failures
1. **Level 1:** Minor issues → Fix within current stage, no escalation
2. **Level 2:** Moderate issues → Return to previous stage, notify owner
3. **Level 3:** Critical issues → Block pipeline, escalate to Founder

### Founder Review Rejection
1. Document rejection reasons in writing
2. Content Lead addresses all concerns within 24 hours
3. Resubmit for Founder Review (same day if possible)
4. If rejected twice → Retire topic, select replacement from backlog

---

## 6. Buffer Time Allocation

| Buffer Type | Hours | Purpose |
|-------------|-------|---------|
| Stage Buffer | 2 hrs/week | Absorb minor delays within stages |
| Review Buffer | 1 hr/week | Handle review back-and-forth |
| Publication Buffer | 1 hr/week | Handle last-minute publication issues |
| Emergency Buffer | 2 hrs/month | Handle critical post-publication issues |

**Total Buffer:** 4 hours/week + 2 hours/month

---

## 7. Monthly Production Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Knowledge Packages published | 4 | Count of approved KPs |
| Knowledge Objects created | 20+ | Count of new/updated KOs |
| Quality gate pass rate | >90% | First-pass approvals |
| Publication on-time rate | >95% | Published by Friday PM |
| Average review cycle time | <3 days | Monday research → Thursday approval |
| Post-publication defects | <2 per KP | Issues reported within 7 days |

---

## 8. Quarterly Production Goals

| Quarter | Focus | KPs Target | KOs Target | Special Deliverables |
|---------|-------|------------|------------|---------------------|
| Q1 | Foundation building | 12 | 60 | Core curriculum KPs, baseline metrics |
| Q2 | Expansion | 13 | 65 | Advanced topics, community-contributed KOs |
| Q3 | Optimization | 13 | 65 | Process improvements, automation |
| Q4 | Scale | 13 | 65 | Multi-language support, certification KPs |

**Annual Total:** 51 KPs, 255+ KOs

---

## 9. Quality Gates Summary

```
Research → Technical Review → Educational Review → Founder Review → Publication
    ↓            ↓                  ↓                  ↓              ↓
  [G1]         [G2]              [G3]               [G4]           [G5]
 Sources      Accuracy         Pedagogy           Mission        Readiness
 Verified     Confirmed        Validated          Aligned        Confirmed
```

**Gate Definitions:**

| Gate | Name | Pass Criteria | Fail Action |
|------|------|---------------|-------------|
| G1 | Research Complete | 3+ sources, outline validated | Return to research |
| G2 | Technical Review | All claims accurate, code runs | Return to authoring |
| G3 | Educational Review | Learning outcomes measurable | Return to authoring |
| G4 | Founder Approved | Mission aligned, brand consistent | Retire topic |
| G5 | Publication Ready | All channels prepared, links work | Delay publication |

---

## 10. Pipeline Metrics Dashboard

Track these weekly:

- **Velocity:** KPs completed per week
- **Quality:** First-pass gate rate
- **Timeliness:** On-time publication rate
- **Engagement:** Views, downloads, discussions per KP
- **Feedback:** Issues reported, improvement suggestions
- **Process:** Average time per stage, bottleneck identification

---

## 11. Continuous Improvement

Every 4 weeks, conduct a pipeline retrospective:

1. What worked well?
2. What caused delays?
3. Which quality gates caught real issues?
4. What can be automated?
5. What should be added/removed?

Document improvements in `bhavya-ai-lab/logs/process-improvements.json`.

---

## Appendix A: Weekly Calendar Visual

```
Monday      Tuesday     Wednesday   Thursday    Friday      Saturday    Sunday
─────────── ─────────── ─────────── ─────────── ─────────── ─────────── ───────────
Research    KP Complete Tech Review Founder     Publish     Distribution Analytics
KP Start    Tech Review Edu Review  Approval    Distribute  Complete    Collection
            Edu Review                          Channels
```

## Appendix B: Key Files

| File | Purpose |
|------|---------|
| `bhavya-ai-lab/knowledge/objects/*.json` | Knowledge Objects |
| `bhavya-ai-lab/data/courses/*.json` | Course definitions |
| `bhavya-ai-lab/logs/publication.json` | Publication log |
| `bhavya-ai-lab/logs/process-improvements.json` | Improvement history |
| `bhavya-ai-lab/data/topic-backlog.json` | Topic queue |
| `packages/constitution/` | Constitutional authority |

## Appendix C: Template Files

| Template | Location | Used In |
|----------|----------|---------|
| KP Schema | `packages/constitution/templates/` | Stage 2 |
| Review Checklist | `docs/production/templates/` | Stages 3, 4 |
| Executive Summary | `docs/production/templates/` | Stage 5 |
| Analytics Report | `docs/production/templates/` | Stage 8 |
| Retrospective | `docs/production/templates/` | Stage 9 |
