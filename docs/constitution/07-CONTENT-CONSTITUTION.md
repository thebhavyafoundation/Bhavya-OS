# Constitution 07 — Content Constitution

**Document Number:** 07  
**Title:** Content Constitution  
**Status:** CONSTITUTIONAL  
**Effective Date:** 2026-08-06  
**Authority:** Derived from Document 00 (Vision), Articles 2, 3, and 7  
**Supersedes:** All conflicting content guidelines, editorial standards, and publication policies

---

## Preamble

Content is institutional knowledge, not marketing. Every piece of content that Bhavya Foundation produces — whether a Knowledge Package, a lesson, a newsletter, a video, or a governance document — is institutional knowledge. It must be treated with the rigor, versioning, and governance that institutional knowledge demands.

This constitution establishes the canonical laws governing how content is created, validated, published, and evolved across every domain Bhavya Foundation serves. Content is not a byproduct of the institution. Content is the institution.

---

## Article 1 — Content as Institutional Knowledge

### 1.1 The Principle

Content is not marketing collateral. Content is not social media filler. Content is not SEO material. Content is the institutional knowledge that Bhavya Foundation builds, preserves, and transmits across generations.

Every lesson, every lab, every assessment, every article, every video, every publication is a canonical artifact that represents the institution's knowledge. It is versioned, tracked, cited, and evolved. It is never disposable.

### 1.2 Content Categories

| Category               | Description                          | Examples                                       | Governance           |
| ---------------------- | ------------------------------------ | ---------------------------------------------- | -------------------- |
| **Knowledge Packages** | Canonical educational units          | Lessons, labs, assessments, projects           | Full quality gates   |
| **Documents**          | Governance and institutional records | ADRs, RFCs, constitutions, policies            | Full quality gates   |
| **Publications**       | External-facing content              | Articles, newsletters, videos, podcasts        | Full quality gates   |
| **Research**           | Evidence-gathering and analysis      | Research briefs, industry analysis, surveys    | Research governance  |
| **Reports**            | Outcome and impact records           | Impact reports, audit reports, metrics reports | Review governance    |
| **Infrastructure**     | Platform documentation               | Architecture docs, API docs, runbooks          | Technical governance |

### 1.3 What Content Is Not

Content is not:

- A tweet with no lasting value
- A social media post that exists for engagement only
- A placeholder or stub
- A draft marked as final
- An AI-generated output without human review

---

## Article 2 — The Evidence Mandate

### 2.1 Every Claim Has a Source

This is the single most important rule of content creation at Bhavya Foundation. Every factual claim, every statistic, every definition, every assertion must have a verifiable source.

**No exceptions. No "everyone knows this." No "this is common knowledge." Every claim has a source.**

### 2.2 Source Hierarchy

| Source Type                             | Reliability | Acceptable For                   |
| --------------------------------------- | ----------- | -------------------------------- |
| Peer-reviewed research                  | Highest     | All claims                       |
| Government/institutional data           | High        | Statistics, policy claims        |
| Industry reports from established firms | High        | Market data, trends              |
| Expert interviews and consultations     | Medium-high | Contextual claims                |
| Reputable journalism                    | Medium      | Current events, industry news    |
| Community reports and surveys           | Medium      | Community impact claims          |
| Open-source project documentation       | Medium      | Technical claims                 |
| Social media posts                      | Low         | Not acceptable as primary source |
| AI-generated text without verification  | Lowest      | Not acceptable as source         |

### 2.3 Citation Format

Every published content piece must include a references section with:

```
References:
1. [Author/Organization], "[Title]," [Source], [Date]. [URL if available]
```

Minimum citation requirements per content type:

| Content Type        | Minimum Citations                    | Enforcement |
| ------------------- | ------------------------------------ | ----------- |
| Knowledge Package   | 1 freely accessible reference per KP | Hard fail   |
| Lesson              | 1 reference per section              | Hard fail   |
| Article             | 3 references minimum                 | Hard fail   |
| Newsletter          | 2 references minimum                 | Hard fail   |
| Video script        | 2 references minimum                 | Soft warn   |
| Governance document | 1 reference per claim                | Hard fail   |

### 2.4 Fabrication Prohibition

Fabricating data, statistics, evidence, or sources is a constitutional violation. This includes:

- Inventing statistics ("80% of users prefer...")
- Fabricating case studies or testimonials
- Misrepresenting research findings
- Creating fictional examples presented as real
- Generating fake data to fill content gaps

**Enforcement:** Fabrication results in immediate content quarantine, incident report, and governance review.

---

## Article 3 — Content Lifecycle

### 3.1 The Canonical Lifecycle

Every piece of content follows this lifecycle. No stage may be skipped.

```
Research → Draft → Review → Approval → Publication → Feedback → Update → Archival
```

### 3.2 Stage Definitions

**Research**
Gather evidence. Understand the topic. Identify sources. Score against the North Star criteria. Research produces a research brief that the draft consumes.

**Draft**
Create the content following the canonical schema and quality standards. Drafts may use AI assistance but must clearly mark AI-generated sections. Every draft must include source citations.

**Review**
Peer review by domain experts. Reviews check:

- Factual accuracy (all claims verified against sources)
- Brand compliance (voice, tone, visual identity per Document 01)
- Cultural sensitivity (no stereotyping, inclusive language)
- Mission alignment (serves at least one mission pillar)
- AI disclosure (AI usage properly documented)
- Accessibility (meets WCAG 2.1 AA per Document 05)

**Approval**
Designated authority approves content for publication. The approver is accountable for the content. Approval is logged with approver name, date, and scope.

**Publication**
Content is published through the Content OS pipeline. Published content is versioned, tracked, and auditable.

**Feedback**
Structured feedback from learners, educators, and community. Feedback is evidence, not opinion. Feedback feeds into the update cycle.

**Update**
Content is revised based on feedback, new evidence, or error correction. Updates follow the same lifecycle. Version numbers increment.

**Archival**
Content that is no longer current but retains historical value is archived, not deleted. Archived content is marked as archived and preserved for institutional memory.

### 3.3 Stage Timing

| Stage       | Target Duration       | Maximum Duration |
| ----------- | --------------------- | ---------------- |
| Research    | 1–2 weeks             | 4 weeks          |
| Draft       | 1 week                | 2 weeks          |
| Review      | 3–5 days              | 2 weeks          |
| Approval    | 1–2 days              | 1 week           |
| Publication | 1 day                 | 3 days           |
| Feedback    | Ongoing               | —                |
| Update      | Triggered by feedback | —                |

### 3.4 No Skipping Stages

Every stage produces a canonical artifact. The next stage consumes that artifact. Skipping a stage produces orphaned content that lacks provenance, accountability, and institutional context.

---

## Article 4 — Content Quality Gates

### 4.1 Gate 1: Schema Validation

Every content piece must conform to its canonical schema. Knowledge Packages must conform to the KP schema defined in Document 03 (Knowledge OS Constitution), Article 4. Documents must conform to document templates.

**Enforcement:** Automated validation at draft creation. Non-conforming drafts are rejected.

### 4.2 Gate 2: Source Verification

Every factual claim must have a source. Every source must be verifiable. Every citation must include enough information for the reader to find the original.

**Enforcement:** Automated citation checking + human verification during review. Claims without sources are flagged and must be either sourced or removed.

### 4.3 Gate 3: North Star Validation

Every content piece must answer: "Will this help someone discover, trust, learn from, or contribute to Bhavya Foundation?"

| Score | Description                    | Action             |
| ----- | ------------------------------ | ------------------ |
| 4     | Strongly serves all 4 criteria | Approved           |
| 3     | Serves 3 criteria well         | Approved           |
| 2     | Serves 2 criteria adequately   | Approved (minimum) |
| 1     | Serves 1 criterion adequately  | Requires revision  |
| 0     | Does not serve any criterion   | Rejected           |

**Enforcement:** Minimum score of 2. Content scoring below 2 is rejected.

### 4.4 Gate 4: Mission Alignment

Every content piece must serve at least one mission pillar: Nature, Knowledge, Heritage, or Community. Content that serves none of these pillars is not published.

**Enforcement:** Automated tagging + review verification. Content without mission alignment is rejected.

### 4.5 Gate 5: Cultural Sensitivity

Every content piece is reviewed for cultural sensitivity. Stereotyping, appropriation, or disrespectful framing results in immediate rejection.

**Checks performed:**

- Inclusive language detection
- Stereotyping pattern detection
- Discrimination and exclusion detection
- Gender neutrality verification
- Religious neutrality verification
- Regional sensitivity assessment

**Enforcement:** Automated detection + human review. Violations are hard-fail.

### 4.6 Gate 6: Accessibility

Every content piece must meet accessibility standards:

- Alt text for all meaningful images
- Proper heading hierarchy
- Color contrast meeting WCAG 2.1 AA
- Keyboard accessibility for interactive elements
- Captions for video content
- Plain language (no jargon without explanation)

**Enforcement:** Automated accessibility scanning + human review.

### 4.7 Gate 7: AI Disclosure

Every content piece that involves AI generation or AI assistance must include proper disclosure per Document 06 (AI Ethics Constitution), Article 2.

**Enforcement:** Automated detection of AI-generated content without disclosure. Missing disclosure blocks publication.

---

## Article 5 — Content Types and Standards

### 5.1 Knowledge Packages

The canonical educational unit. Every KP must conform to the schema in Document 03, Article 4.

**Quality requirements:**

- Minimum 3 core concepts
- Every concept has a definition
- At least 1 real-world example
- At least 1 example from India
- At least 1 freely accessible reference
- At least 1 misconception addressed
- At least 2 practice opportunities
- All prerequisites declared
- North Star score >= 2

### 5.2 Documents

Governance and institutional records.

**Quality requirements:**

- Follows document template
- Every claim cited
- Author and date identified
- Version tracked
- Review completed
- Approved by designated authority

### 5.3 Publications

External-facing content: articles, newsletters, videos, podcasts.

**Quality requirements:**

- Mission aligned
- Brand compliant
- AI disclosure present
- Citations present
- Reviewed by domain expert
- Approved for publication

### 5.4 Research

Evidence-gathering and analysis.

**Quality requirements:**

- Research question clearly stated
- Methodology documented
- Sources cited
- Findings reported without bias
- Limitations acknowledged
- Recommendations evidence-based

### 5.5 Reports

Outcome and impact records.

**Quality requirements:**

- Data sources identified
- Methodology documented
- Metrics defined and explained
- Findings verified against data
- Limitations and assumptions stated
- Recommendations actionable

---

## Article 6 — The Three Prohibitions

### 6.1 No Placeholder Content — Ever

Placeholder content is content that exists to be replaced later. It is a promise that is rarely kept. Every published content piece must be complete and functional.

**What counts as placeholder:**

- "Content coming soon"
- "To be updated"
- Empty sections with "TBD"
- Lorem ipsum or filler text
- Stub pages with no substance

**Enforcement:** Placeholder content at publication is a hard-fail. Content must be complete before publication.

### 6.2 No Synthetic Metrics — Ever

Metrics must be measured, not fabricated. Synthetic metrics are numbers presented as data that were not derived from actual measurement.

**What counts as synthetic metrics:**

- "10K+ students empowered" without verified enrollment data
- "95% satisfaction" without survey methodology
- "100+ projects" without portfolio evidence
- Rounded-up numbers without disclosure
- Extrapolated projections presented as current facts

**Enforcement:** Every metric published must reference its data source and measurement methodology. Synthetic metrics are a constitutional violation.

### 6.3 No Citation-Free Claims — Ever

Every factual claim has a source. No exceptions. "Common knowledge" is not an exemption. "Everyone knows this" is not a citation. "This is obvious" is not evidence.

**Enforcement:** Content without citations for factual claims is rejected. The reviewer's responsibility is to verify that every claim traces to a source.

---

## Article 7 — Content Governance

### 7.1 Who Can Publish

| Content Type      | Creator        | Reviewer           | Approver            |
| ----------------- | -------------- | ------------------ | ------------------- |
| Knowledge Package | Content author | Domain expert      | Domain lead         |
| Document          | Domain expert  | Peer reviewer      | Governance board    |
| Publication       | Content author | Brand reviewer     | Editorial authority |
| Research          | Researcher     | Peer researcher    | Research lead       |
| Report            | Analyst        | Data reviewer      | Domain lead         |
| Video/Media       | Creator        | Technical reviewer | Editorial authority |

### 7.2 Review Responsibilities

Reviewers are accountable for:

1. Verifying factual accuracy against cited sources
2. Checking brand compliance (voice, tone, visual identity)
3. Assessing cultural sensitivity
4. Confirming mission alignment
5. Verifying AI disclosure
6. Checking accessibility compliance

### 7.3 Escalation Process

If content review reveals issues:

| Issue Type                 | Severity | Action                                |
| -------------------------- | -------- | ------------------------------------- |
| Missing citation           | Moderate | Block publication, require source     |
| Brand inconsistency        | Moderate | Block publication, require revision   |
| Cultural sensitivity issue | High     | Hold for cultural review panel        |
| Fabricated data            | Critical | Quarantine, incident report           |
| AI disclosure missing      | Moderate | Block publication, require disclosure |
| Plagiarism                 | Critical | Quarantine, incident report           |

### 7.4 Editorial Calendar

Content production follows a quarterly editorial calendar:

| Quarter      | Focus               | Deliverables                                  |
| ------------ | ------------------- | --------------------------------------------- |
| Q1 (Aug-Oct) | Foundation content  | Core KPs, governance docs, platform docs      |
| Q2 (Nov-Jan) | Expansion content   | New domain KPs, community content             |
| Q3 (Feb-Apr) | Assessment content  | Labs, assessments, certification materials    |
| Q4 (May-Jul) | Research and impact | Impact reports, research briefs, case studies |

---

## Article 8 — Content Versioning

### 8.1 Semantic Versioning for Content

Content follows semantic versioning:

| Version Change | Trigger                                       | Example     |
| -------------- | --------------------------------------------- | ----------- |
| **MAJOR**      | Substantial content restructure, topic change | 1.0 → 2.0   |
| **MINOR**      | New sections, expanded examples, updated data | 1.0 → 1.1   |
| **PATCH**      | Error correction, citation update, typo fix   | 1.0 → 1.0.1 |

### 8.2 Version History

Every content piece maintains a version history:

```yaml
versions:
  - version: "1.0.0"
    date: "2026-08-06"
    author: "Name"
    changes: "Initial publication"
  - version: "1.0.1"
    date: "2026-08-13"
    author: "Name"
    changes: "Corrected citation in Section 3"
```

### 8.3 Deprecation

Content that is no longer current:

1. Is marked as "Deprecated" with the date
2. Links to the replacement content
3. Is preserved (not deleted) for institutional memory
4. Is removed from active catalogs but remains accessible via direct link

---

## Article 9 — The Content Factory Pipeline

### 9.1 Pipeline Definition

The Content Factory is the automated pipeline that transforms Knowledge Packages into published content across all formats.

```
KP → Content Engine → [Lesson, Assessment, Teacher Guide, Workbook, Video Spec, Website]
```

### 9.2 Pipeline Rules

1. **No content bypasses the pipeline.** All content flows through the Content OS.
2. **No domain-specific hardcoding.** Content is generated from KPs, not hardcoded in applications.
3. **No duplicated content.** One KP serves multiple formats. Content is not copy-pasted across platforms.
4. **No orphaned content.** Every published piece traces to a KP and a pipeline run.
5. **No unversioned content.** Every pipeline run produces a versioned output.

### 9.3 Pipeline Quality

Every pipeline output undergoes the same quality gates as handcrafted content. Automated generation does not reduce quality requirements.

---

## Article 10 — Mission Metrics: What to Measure

### 10.1 The Principle

We do not measure activity. We measure transformation. Activity metrics are vanity metrics that do not correlate with institutional impact.

### 10.2 What We Measure (Transformation Metrics)

| Category            | Metric                                 | Target                     | Measurement        |
| ------------------- | -------------------------------------- | -------------------------- | ------------------ |
| **Building**        | Students who build real projects       | 80% of active students     | Portfolio review   |
| **Contributing**    | Students who contribute to open source | 50% of active students     | GitHub tracking    |
| **Teaching**        | Students who teach others              | 30% of active students     | Community tracking |
| **Mentoring**       | Students who mentor others             | 20% of active students     | Mentoring system   |
| **Getting Hired**   | Students who get AI jobs               | 80% of graduating students | Career tracking    |
| **Creating Impact** | Students who create social impact      | 40% of active students     | Impact assessment  |

### 10.3 What We Do NOT Measure (Vanity Metrics)

The following metrics are explicitly excluded from institutional reporting:

| Vanity Metric          | Why It Does Not Matter      |
| ---------------------- | --------------------------- |
| Lessons written        | Activity ≠ Impact           |
| Videos created         | Content ≠ Learning          |
| Pages published        | Production ≠ Transformation |
| Hours of content       | Volume ≠ Value              |
| Number of courses      | Count ≠ Quality             |
| Website visitors       | Traffic ≠ Transformation    |
| Social media followers | Followers ≠ Community       |
| Course completions     | Completion ≠ Understanding  |
| Certificates issued    | Paper ≠ Competence          |
| Enrollment numbers     | Enrollment ≠ Transformation |

### 10.4 Measurement Cadence

| Frequency  | What Is Measured                                            |
| ---------- | ----------------------------------------------------------- |
| Per lesson | Learning effectiveness (assessment scores)                  |
| Monthly    | Student transformation, content impact, community health    |
| Quarterly  | Strategic assessment, career outcomes, institutional health |
| Annually   | Mission evaluation, long-term impact                        |

---

## Article 11 — Content Standards Enforcement

### 11.1 Automated Enforcement

| Check                 | Tool                 | Failure Action         |
| --------------------- | -------------------- | ---------------------- |
| Schema validation     | Automated validator  | Block draft creation   |
| Citation checking     | Automated scanner    | Flag missing citations |
| Brand compliance      | Brand checker        | Flag violations        |
| Accessibility         | axe-core, lighthouse | Block publication      |
| AI disclosure         | Detection scanner    | Block publication      |
| Placeholder detection | Pattern scanner      | Block publication      |

### 11.2 Human Enforcement

| Role                | Responsibility                      | Frequency           |
| ------------------- | ----------------------------------- | ------------------- |
| Content author      | Follows standards, provides sources | Every content piece |
| Peer reviewer       | Verifies accuracy, brand, culture   | Every content piece |
| Domain expert       | Validates technical accuracy        | Every KP            |
| Editorial authority | Final approval for publication      | Every publication   |
| Governance board    | Reviews critical violations         | As needed           |

### 11.3 Violation Response

| Violation            | Response                              | Timeline           |
| -------------------- | ------------------------------------- | ------------------ |
| Missing citation     | Block publication, require source     | Before publication |
| Brand inconsistency  | Block publication, require revision   | Before publication |
| Placeholder content  | Block publication, require completion | Before publication |
| Synthetic metric     | Block publication, require real data  | Before publication |
| Cultural sensitivity | Hold for cultural review              | Within 48 hours    |
| Fabrication          | Quarantine, incident report           | Immediate          |
| Plagiarism           | Quarantine, incident report           | Immediate          |

---

## Article 12 — What We Never Do

1. **Never publish placeholder content.** Content is complete or it is not published.
2. **Never publish synthetic metrics.** Numbers are measured, not fabricated.
3. **Never publish citation-free claims.** Every claim has a source.
4. **Never skip human review.** Every publication has a named reviewer.
5. **Never duplicate content.** One KP, multiple formats. No copy-paste across platforms.
6. **Never publish without mission alignment.** Content serves the mission or it is not published.
7. **Never prioritize quantity over quality.** One excellent KP is worth more than ten mediocre ones.
8. **Never hardcode domain-specific content.** All content flows through the Content OS.
9. **Never delete archived content.** Deprecated content is archived, not deleted.
10. **Never optimize for engagement over learning.** Educational outcomes, not clicks, are the measure.

---

## Article 13 — Amendment Process

This constitution may only be amended through:

1. A written proposal with evidence supporting the change
2. Review by the governance board
3. A 30-day comment period
4. Approval by the institution builder designated for content governance
5. Publication with version bump and changelog entry

Amendments may only strengthen content standards. Weakening of quality gates, citation requirements, or evidence mandates requires extraordinary evidence and unanimous governance board approval.

---

## Article 14 — Definitions

For the purposes of this Constitution:

- **Content** — Any institutional knowledge artifact produced by Bhavya Foundation, including KPs, documents, publications, research, reports, and media
- **Knowledge Package (KP)** — The canonical educational unit defined in Document 03, Article 4
- **Evidence** — Verifiable data, research, or documentation that supports a claim
- **Citation** — A reference to an evidence source sufficient for the reader to verify the claim
- **Placeholder Content** — Incomplete or stub content published before it is ready
- **Synthetic Metrics** — Numbers presented as measured data that were not derived from actual measurement
- **Content OS** — The canonical content pipeline defined in Document 03, Article 2
- **North Star** — The four-criteria test: Discover, Trust, Learn from, Contribute to
- **Content Lifecycle** — The canonical stages from Research through Archival
- **Quality Gate** — Automated or human checks that content must pass before publication

---

## Article 15 — Effective Date and Authority

This Constitution takes effect on 2026-08-06 and remains in force indefinitely. It may only be amended through the process defined in Article 13.

The authority for this Constitution derives from Document 00 (Vision), Article 7 (The Institutional Cycle), which establishes that every workflow follows Research → Knowledge Package → Proposal → Review → Approval → Publication → Feedback → Continuous Improvement.

---

**End of Document 07 — Content Constitution**

_This document is derived from Document 00 (Vision) and is subordinate only to it. Content is institutional knowledge. Institutional knowledge is never disposable._
