# Quality Gates — Knowledge Package Validation

**Document:** QG-001  
**Version:** 1.0  
**Effective Date:** 2026-01-01  
**Owner:** Production Team  
**Status:** Active

---

## Overview

Every Knowledge Package (KP) must pass through 10 quality gates before release. Each gate has pass/fail criteria, automated checks, manual checks, and a scoring rubric. A KP must achieve a minimum composite score of 7.0/10 and pass all mandatory gates to proceed.

---

## Gate Architecture

```
KP Input
   │
   ▼
┌─────────────────────────┐
│ Gate 1: Educational     │──┐
│ Gate 2: Technical       │──┤
│ Gate 3: Constitution    │──┤
│ Gate 4: BEE 2.0         │──┤──► Composite Score ──► Pass/Fail
│ Gate 5: Citation        │──┤
│ Gate 6: Learning Outcomes│──┤
│ Gate 7: Project Quality  │──┤
│ Gate 8: Assessment      │──┤
│ Gate 9: Portfolio Value  │──┤
│ Gate 10: Media Complete  │──┘
└─────────────────────────┘
         │
    ┌────┴────┐
    │         │
 Pass      Fail ──► Rejection Workflow
```

---

## Composite Score Calculation

```
Composite Score = Σ (Gate Score × Gate Weight) / Σ Gate Weights
```

| Gate | Weight | Mandatory? |
|------|--------|------------|
| 1. Educational Quality | 15% | Yes |
| 2. Technical Accuracy | 15% | Yes |
| 3. Constitution Compliance | 10% | Yes |
| 4. BEE 2.0 Compliance | 10% | Yes |
| 5. Citation Quality | 10% | Yes |
| 6. Learning Outcomes | 10% | No |
| 7. Project Quality | 10% | No |
| 8. Assessment Quality | 10% | No |
| 9. Portfolio Value | 5% | No |
| 10. Media Completeness | 5% | No |

**Minimum passing composite score: 7.0/10**  
**All mandatory gates must score ≥ 6.0 individually**

---

## Gate 1: Educational Quality Gate

**Purpose:** Ensure content is pedagogically sound and age-appropriate.

### Pass/Fail Criteria

| Criterion | Pass | Fail |
|-----------|------|------|
| Learning outcomes measurable | All outcomes use action verbs from Bloom's taxonomy | Vague or unmeasurable outcomes |
| Bloom's levels appropriate | Levels match stated grade/age | Mismatch between content depth and audience |
| Age-appropriate | Language, examples, complexity match audience | Content too advanced or too simple |
| Prerequisites stated | All prerequisites explicitly listed | Missing or assumed prerequisites |

### Automated Checks

```javascript
// Bloom's taxonomy verb validation
const BLOOMS_VERBS = {
  remember: ['define', 'list', 'recall', 'identify', 'state'],
  understand: ['explain', 'describe', 'summarize', 'interpret', 'classify'],
  apply: ['demonstrate', 'solve', 'use', 'implement', 'calculate'],
  analyze: ['compare', 'contrast', 'differentiate', 'examine', 'break down'],
  evaluate: ['assess', 'critique', 'justify', 'evaluate', 'judge'],
  create: ['design', 'construct', 'develop', 'formulate', 'compose']
};

function validateLearningOutcomes(outcomes) {
  const issues = [];
  outcomes.forEach((outcome, i) => {
    const hasVerb = Object.values(BLOOMS_VERBS)
      .flat()
      .some(verb => outcome.toLowerCase().includes(verb));
    if (!hasVerb) issues.push(`Outcome ${i + 1} lacks measurable verb`);
  });
  return { pass: issues.length === 0, issues };
}

// Readability scoring (Flesch-Kincaid)
function validateReadability(content, targetGrade) {
  const score = fleschKincaid(content);
  const tolerance = 2; // ±2 grade levels
  return {
    pass: Math.abs(score - targetGrade) <= tolerance,
    score,
    targetGrade
  };
}

// Prerequisite completeness
function validatePrerequisites(kp) {
  const hasPrereqs = kp.prerequisites && kp.prerequisites.length > 0;
  const prereqsValid = kp.prerequisites?.every(p => p.id && p.description);
  return { pass: hasPrereqs && prereqsValid };
}
```

### Manual Checks

- [ ] Content engages the learner
- [ ] Examples are relatable to target audience
- [ ] Difficulty progression is smooth
- [ ] No jargon without explanation

### Scoring Rubric (1-10)

| Score | Description |
|-------|-------------|
| 9-10 | All outcomes measurable, perfect Bloom's alignment, age-perfect, prerequisites complete |
| 7-8 | Minor issues: one outcome slightly vague, or one prerequisite missing |
| 5-6 | Multiple measurable outcomes but Bloom's misalignment or readability off |
| 3-4 | Many vague outcomes, significant age mismatch |
| 1-2 | Unmeasurable outcomes, wrong audience, no prerequisites |

**Minimum passing score: 6.0**

### Escalation Path

If gate fails:
1. Return to content author with specific issues
2. Author has 48 hours to remediate
3. Re-run automated checks
4. If still failing, escalate to Education Lead for manual review

---

## Gate 2: Technical Accuracy Gate

**Purpose:** Ensure all facts are verifiable, code works, and no hallucinated information exists.

### Pass/Fail Criteria

| Criterion | Pass | Fail |
|-----------|------|------|
| Facts verifiable | All claims traceable to source | Unverifiable claims present |
| Code examples work | Code compiles/runs without errors | Broken or non-functional code |
| No hallucinations | Zero fabricated information | Any hallucinated data detected |
| References real | All citations resolve to real sources | Broken links or fake references |

### Automated Checks

```javascript
// Code execution validation
async function validateCodeExamples(examples) {
  const results = [];
  for (const example of examples) {
    try {
      const output = await executeCode(example.language, example.code);
      results.push({
        id: example.id,
        pass: output.exitCode === 0,
        output: output.stdout,
        errors: output.stderr
      });
    } catch (e) {
      results.push({ id: example.id, pass: false, error: e.message });
    }
  }
  return results;
}

// Reference URL validation
async function validateReferences(references) {
  const results = [];
  for (const ref of references) {
    try {
      const response = await fetch(ref.url, { method: 'HEAD' });
      results.push({
        url: ref.url,
        pass: response.ok,
        status: response.status
      });
    } catch (e) {
      results.push({ url: ref.url, pass: false, error: 'Unreachable' });
    }
  }
  return results;
}

// Fact extraction and cross-reference
function extractFacts(content) {
  // NLP-based fact extraction
  const facts = nlpExtractClaims(content);
  return facts.map(fact => ({
    claim: fact.text,
    confidence: fact.confidence,
    sources: fact.supportingSources
  }));
}
```

### Manual Checks

- [ ] Domain expert reviews technical claims
- [ ] Code examples follow best practices
- [ ] No misleading simplifications
- [ ] Edge cases mentioned where relevant

### Scoring Rubric (1-10)

| Score | Description |
|-------|-------------|
| 9-10 | All facts verified, all code runs, zero hallucinations, all references valid |
| 7-8 | Minor: one code example needs dependency note, all facts accurate |
| 5-6 | Code examples mostly work, some references broken |
| 3-4 | Multiple code failures, some unverifiable claims |
| 1-2 | Broken code, hallucinated information, fake references |

**Minimum passing score: 6.0**

### Escalation Path

If gate fails:
1. Flag specific inaccuracies with evidence
2. Content author must provide source for each claim or remove
3. Code must be tested in clean environment
4. Escalate to Technical Lead if author disputes findings

---

## Gate 3: Constitution Compliance Gate

**Purpose:** Ensure content aligns with constitutional principles, ethics, and inclusivity.

### Pass/Fail Criteria

| Criterion | Pass | Fail |
|-----------|------|------|
| No constitutional conflicts | Content aligns with all 15 documents | Any conflict detected |
| Ethical considerations | Ethical implications addressed | Ethical blind spots |
| Cultural sensitivity | No cultural bias or stereotypes | Biased or stereotypical content |
| Inclusivity | Accessible to diverse learners | Excludes or marginalizes groups |

### Automated Checks

```javascript
// Constitutional principle matching
const CONSTITUTIONAL_KEYWORDS = {
  'trust-deed': ['trust', 'fiduciary', 'beneficiary'],
  'code-of-conduct': ['integrity', 'honesty', 'transparency'],
  'ethics-policy': ['ethical', 'responsible', 'harm'],
  // ... all 15 documents
};

function validateConstitutionalAlignment(content) {
  const issues = [];
  // Check for negative patterns
  const negativePatterns = [
    /discriminat/i,
    /exclud/i,
    /stereotyp/i,
    /bias/i,
    /unfair/i
  ];
  
  negativePatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        pattern: pattern.source,
        match: matches[0],
        severity: 'high'
      });
    }
  });
  
  return { pass: issues.length === 0, issues };
}

// Inclusivity language check
function validateInclusivity(content) {
  const issues = [];
  const exclusivePatterns = [
    { pattern: /\bhe\b(?!\s*\/\s*she)/i, suggestion: 'Use "they" or "he/she"' },
    { pattern: /\bmankind\b/i, suggestion: 'Use "humanity" or "humankind"' },
    { pattern: /\bwhitespace\b/i, suggestion: 'Consider "space" or "margin"' }
  ];
  
  exclusivePatterns.forEach(({ pattern, suggestion }) => {
    if (pattern.test(content)) {
      issues.push({ pattern: pattern.source, suggestion });
    }
  });
  
  return { pass: issues.length === 0, issues };
}
```

### Manual Checks

- [ ] Constitutional principles reviewed against content
- [ ] Ethical implications discussed with domain expert
- [ ] Cultural sensitivity reviewed by diverse panel
- [ ] Accessibility requirements met (WCAG 2.1 AA)

### Scoring Rubric (1-10)

| Score | Description |
|-------|-------------|
| 9-10 | Full constitutional alignment, no ethical issues, culturally sensitive, fully inclusive |
| 7-8 | Minor: one cultural assumption, easily corrected |
| 5-6 | Some inclusivity gaps, ethical considerations partially addressed |
| 3-4 | Constitutional conflicts, significant bias detected |
| 1-2 | Serious ethical violations, excluded groups, constitutional breach |

**Minimum passing score: 6.0**

### Escalation Path

If gate fails:
1. Constitutional review panel convened within 24 hours
2. Content quarantined pending review
3. Author must address all flagged issues
4. Escalate to Governance Board for constitutional conflicts

---

## Gate 4: BEE 2.0 Compliance Gate

**Purpose:** Ensure content follows the Bhavya Evolution Engine lifecycle.

### Pass/Fail Criteria

| Criterion | Pass | Fail |
|-----------|------|------|
| Research-backed | Evidence cited for all claims | Unsubstantiated content |
| Reuse before creation | Existing components checked first | Duplicated existing content |
| Simplified before expanded | No unnecessary complexity | Over-complex without justification |
| Human approval required | Human sign-off documented | No human review recorded |

### Automated Checks

```javascript
// Research backing validation
function validateResearchBacking(kp) {
  const issues = [];
  if (!kp.researchSources || kp.researchSources.length === 0) {
    issues.push('No research sources cited');
  }
  if (kp.content && !kp.researchSources) {
    issues.push('Content present but no research backing');
  }
  return { pass: issues.length === 0, issues };
}

// Reuse check against existing KPs
function validateReuse(kp, existingKPs) {
  const similarities = existingKPs.map(existing => ({
    id: existing.id,
    similarity: calculateSimilarity(kp.content, existing.content)
  }));
  
  const highSimilarity = similarities.filter(s => s.similarity > 0.8);
  return {
    pass: highSimilarity.length === 0,
    duplicates: highSimilarity
  };
}

// Complexity analysis
function validateSimplicity(content) {
  const complexityScore = calculateComplexity(content);
  return {
    pass: complexityScore < COMPLEXITY_THRESHOLD,
    score: complexityScore
  };
}

// Human approval tracking
function validateHumanApproval(kp) {
  return {
    pass: kp.approvals && kp.approvals.length > 0,
    approvals: kp.approvals || []
  };
}
```

### Manual Checks

- [ ] Research methodology is sound
- [ ] Existing alternatives considered
- [ ] Complexity is justified by content needs
- [ ] Human reviewer identity verified

### Scoring Rubric (1-10)

| Score | Description |
|-------|-------------|
| 9-10 | Full research backing, reused where possible, simplified appropriately, human approved |
| 7-8 | Research present, minor reuse opportunity missed, human approved |
| 5-6 | Some research gaps, content slightly over-complex |
| 3-4 | Weak research backing, significant duplication, no human approval |
| 1-2 | No research, complete duplication, unapproved content |

**Minimum passing score: 6.0**

### Escalation Path

If gate fails:
1. Content held pending BEE 2.0 review
2. Research gaps identified and communicated
3. Author must provide research evidence or revise
4. Escalate to BEE 2.0 Compliance Officer

---

## Gate 5: Citation Quality Gate

**Purpose:** Ensure all sources are cited, authoritative, and properly attributed.

### Pass/Fail Criteria

| Criterion | Pass | Fail |
|-----------|------|------|
| All sources cited | Every claim has citation | Uncited claims present |
| Citations authoritative | Sources are credible and recent | Unreliable or outdated sources |
| No plagiarism | Original content or properly attributed | Plagiarized content detected |
| Attribution complete | All credits properly assigned | Missing attributions |

### Automated Checks

```javascript
// Plagiarism detection
async function validatePlagiarism(content) {
  const results = await plagiarismCheck(content);
  return {
    pass: results.similarityScore < 15, // < 15% similarity
    score: results.similarityScore,
    matches: results.matches
  };
}

// Citation completeness
function validateCitationCompleteness(content, citations) {
  const claims = extractFactualClaims(content);
  const uncitedClaims = claims.filter(claim => 
    !citations.some(cit => cit.claimId === claim.id)
  );
  return {
    pass: uncitedClaims.length === 0,
    uncitedCount: uncitedClaims.length,
    totalClaims: claims.length
  };
}

// Source authority check
function validateSourceAuthority(citations) {
  const authorityScores = citations.map(cit => ({
    url: cit.url,
    domain: extractDomain(cit.url),
    score: getDomainAuthority(extractDomain(cit.url))
  }));
  
  const lowAuthority = authorityScores.filter(a => a.score < AUTHORITY_THRESHOLD);
  return {
    pass: lowAuthority.length === 0,
    lowAuthoritySources: lowAuthority
  };
}
```

### Manual Checks

- [ ] Citation format is consistent
- [ ] Primary sources preferred over secondary
- [ ] Recent sources (within 5 years) for fast-moving fields
- [ ] All attributions are accurate and complete

### Scoring Rubric (1-10)

| Score | Description |
|-------|-------------|
| 9-10 | All claims cited, authoritative sources, zero plagiarism, complete attribution |
| 7-8 | Minor: one citation format inconsistent, all sources authoritative |
| 5-6 | Most claims cited, some sources questionable, low plagiarism |
| 3-4 | Many uncited claims, unreliable sources, moderate plagiarism |
| 1-2 | No citations, fake sources, significant plagiarism |

**Minimum passing score: 6.0**

### Escalation Path

If gate fails:
1. Plagiarism report generated with specific matches
2. Content quarantined if plagiarism > 30%
3. Author must provide citations or revise content
4. Escalate to Academic Integrity Officer for plagiarism cases

---

## Gate 6: Learning Outcomes Gate

**Purpose:** Ensure outcomes are clear, measurable, and aligned with objectives.

### Pass/Fail Criteria

| Criterion | Pass | Fail |
|-----------|------|------|
| Clear outcomes | Outcomes are specific and unambiguous | Vague or unclear outcomes |
| Measurable | Can be assessed objectively | Cannot be measured |
| Aligned with objectives | Outcomes match module goals | Misalignment detected |
| Appropriate difficulty | Difficulty matches target level | Too easy or too hard |
| Portfolio-relevant | Outcomes build portfolio value | No portfolio relevance |

### Automated Checks

```javascript
// Outcome measurability check
function validateOutcomeMeasurability(outcomes) {
  const measurablePatterns = [
    /will be able to/i,
    /can demonstrate/i,
    /will have learned/i,
    /will understand/i
  ];
  
  const issues = [];
  outcomes.forEach((outcome, i) => {
    const isMeasurable = measurablePatterns.some(p => p.test(outcome.text));
    if (!isMeasurable) {
      issues.push(`Outcome ${i + 1} not measurable`);
    }
  });
  
  return { pass: issues.length === 0, issues };
}

// Objective alignment check
function validateObjectiveAlignment(outcomes, objectives) {
  const outcomeTopics = outcomes.map(o => extractTopic(o.text));
  const objectiveTopics = objectives.map(o => extractTopic(o.text));
  
  const aligned = outcomeTopics.filter(t => objectiveTopics.includes(t));
  const misaligned = outcomeTopics.filter(t => !objectiveTopics.includes(t));
  
  return {
    pass: misaligned.length === 0,
    alignedCount: aligned.length,
    misalignedTopics: misaligned
  };
}

// Portfolio relevance check
function validatePortfolioRelevance(outcomes) {
  const portfolioPatterns = [
    /portfolio/i,
    /project/i,
    /demonstrate/i,
    /build/i,
    /create/i
  ];
  
  const relevant = outcomes.filter(o => 
    portfolioPatterns.some(p => p.test(o.text))
  );
  
  return {
    pass: relevant.length >= outcomes.length * 0.5, // 50%+ portfolio relevant
    relevantCount: relevant.length,
    totalCount: outcomes.length
  };
}
```

### Manual Checks

- [ ] Outcomes are learner-centered
- [ ] Difficulty progression is logical
- [ ] Outcomes are achievable within timeframe
- [ ] Assessment methods match outcome types

### Scoring Rubric (1-10)

| Score | Description |
|-------|-------------|
| 9-10 | All outcomes clear, measurable, aligned, appropriate difficulty, portfolio-relevant |
| 7-8 | Minor: one outcome slightly vague, rest excellent |
| 5-6 | Most outcomes measurable, some alignment gaps |
| 3-4 | Many vague outcomes, significant misalignment |
| 1-2 | Unmeasurable outcomes, no alignment, no portfolio value |

**Minimum passing score: 6.0**

### Escalation Path

If gate fails:
1. Specific outcomes flagged with improvement suggestions
2. Author revises outcomes with measurable verbs
3. Re-validation against objectives required
4. Escalate to Curriculum Lead for persistent issues

---

## Gate 7: Project Quality Gate

**Purpose:** Ensure projects are hands-on, well-rubricked, and portfolio-worthy.

### Pass/Fail Criteria

| Criterion | Pass | Fail |
|-----------|------|------|
| Hands-on projects | Projects require active creation | Theoretical only projects |
| Clear rubrics | Assessment criteria explicit | No rubric or vague criteria |
| Portfolio value | Projects demonstrate competencies | No demonstrable skills |
| Achievable | Projects completable in timeframe | Unrealistic scope |

### Automated Checks

```javascript
// Project hands-on validation
function validateProjectHandsOn(project) {
  const handsOnPatterns = [
    /build/i,
    /create/i,
    /design/i,
    /implement/i,
    /develop/i,
    /code/i
  ];
  
  const isHandsOn = handsOnPatterns.some(p => p.test(project.description));
  return { pass: isHandsOn };
}

// Rubric completeness check
function validateRubric(project) {
  const hasRubric = project.rubric && project.rubric.length > 0;
  const rubricComplete = project.rubric?.every(r => 
    r.criterion && r.weight && r.description
  );
  return {
    pass: hasRubric && rubricComplete,
    criteriaCount: project.rubric?.length || 0
  };
}

// Project scope validation
function validateProjectScope(project, maxHours) {
  const estimatedHours = project.estimatedHours || 0;
  return {
    pass: estimatedHours <= maxHours,
    estimatedHours,
    maxHours
  };
}
```

### Manual Checks

- [ ] Projects are engaging and relevant
- [ ] Rubrics are fair and comprehensive
- [ ] Projects build on each other logically
- [ ] Real-world applicability verified

### Scoring Rubric (1-10)

| Score | Description |
|-------|-------------|
| 9-10 | Fully hands-on, detailed rubrics, high portfolio value, achievable |
| 7-8 | Mostly hands-on, rubrics present, portfolio value good |
| 5-6 | Some hands-on elements, rubrics incomplete |
| 3-4 | Mostly theoretical, weak rubrics, limited portfolio value |
| 1-2 | No hands-on component, no rubric, not achievable |

**Minimum passing score: 6.0**

### Escalation Path

If gate fails:
1. Project design reviewed by Education Lead
2. Rubrics must be explicit and weighted
3. Scope must be realistic for target timeframe
4. Escalate to Project Design Lead

---

## Gate 8: Assessment Quality Gate

**Purpose:** Ensure assessments test understanding, not memorization.

### Pass/Fail Criteria

| Criterion | Pass | Fail |
|-----------|------|------|
| Tests understanding | Questions require analysis/application | Pure recall questions |
| Mix of types | Multiple assessment formats used | Single format only |
| Clear rubrics | Subjective questions have rubrics | No rubrics for open questions |
| Appropriate difficulty | Difficulty matches learning level | Too easy or too hard |

### Automated Checks

```javascript
// Assessment type diversity
function validateAssessmentDiversity(assessments) {
  const types = new Set(assessments.map(a => a.type));
  const requiredTypes = ['multiple-choice', 'short-answer', 'project'];
  const hasDiversity = requiredTypes.some(t => types.has(t));
  return {
    pass: hasDiversity && types.size >= 2,
    types: Array.from(types)
  };
}

// Bloom's level distribution
function validateBloomDistribution(questions) {
  const distribution = {
    remember: 0, understand: 0, apply: 0,
    analyze: 0, evaluate: 0, create: 0
  };
  
  questions.forEach(q => {
    const level = classifyBloomLevel(q.text);
    distribution[level]++;
  });
  
  // Should have questions across multiple levels
  const activeLevels = Object.values(distribution).filter(v => v > 0).length;
  return {
    pass: activeLevels >= 3,
    distribution
  };
}

// Rubric presence for subjective questions
function validateSubjectiveRubrics(assessments) {
  const subjective = assessments.filter(a => 
    ['short-answer', 'essay', 'project'].includes(a.type)
  );
  const withRubrics = subjective.filter(a => a.rubric && a.rubric.length > 0);
  return {
    pass: withRubrics.length === subjective.length,
    total: subjective.length,
    withRubrics: withRubrics.length
  };
}
```

### Manual Checks

- [ ] Questions are clearly worded
- [ ] Distractors are plausible (for MCQ)
- [ ] Time allocation is reasonable
- [ ] Assessments align with outcomes

### Scoring Rubric (1-10)

| Score | Description |
|-------|-------------|
| 9-10 | Tests understanding, diverse types, clear rubrics, appropriate difficulty |
| 7-8 | Mostly understanding-focused, good variety, minor rubric gaps |
| 5-6 | Mix of recall and understanding, some assessment diversity |
| 3-4 | Heavy on recall, limited assessment types |
| 1-2 | Pure memorization, single format, no rubrics |

**Minimum passing score: 6.0**

### Escalation Path

If gate fails:
1. Assessment questions reviewed by Assessment Specialist
2. Recall-only questions replaced with analysis/application
3. Rubrics must be explicit for subjective items
4. Escalate to Assessment Lead

---

## Gate 9: Portfolio Value Gate

**Purpose:** Ensure content generates portfolio artifacts demonstrating competencies.

### Pass/Fail Criteria

| Criterion | Pass | Fail |
|-----------|------|------|
| Portfolio artifacts | KP produces demonstrable outputs | No tangible outputs |
| Competency demonstration | Artifacts show specific skills | Skills not evident |
| Industry-relevant | Artifacts match industry needs | Industry disconnect |
| Community-relevant | Artifacts serve community needs | No community value |

### Automated Checks

```javascript
// Portfolio artifact validation
function validatePortfolioArtifacts(kp) {
  const hasArtifacts = kp.portfolioArtifacts && kp.portfolioArtifacts.length > 0;
  const artifactsValid = kp.portfolioArtifacts?.every(a => 
    a.type && a.description && a.competencies && a.competencies.length > 0
  );
  return {
    pass: hasArtifacts && artifactsValid,
    artifactCount: kp.portfolioArtifacts?.length || 0
  };
}

// Industry relevance check
function validateIndustryRelevance(artifacts) {
  const industryKeywords = [
    'production', 'deploy', 'scalable', 'maintainable',
    'test', 'document', 'collaborate', 'review'
  ];
  
  const relevantCount = artifacts.filter(a => 
    industryKeywords.some(k => 
      a.description.toLowerCase().includes(k)
    )
  ).length;
  
  return {
    pass: relevantCount >= artifacts.length * 0.5,
    relevantCount,
    totalArtifacts: artifacts.length
  };
}

// Community value check
function validateCommunityValue(kp) {
  const communityPatterns = [
    /community/i,
    /open.?source/i,
    /contribute/i,
    /share/i,
    /help/i
  ];
  
  const hasCommunityValue = communityPatterns.some(p => 
    p.test(kp.description) || p.test(kp.communityImpact || '')
  );
  
  return { pass: hasCommunityValue };
}
```

### Manual Checks

- [ ] Artifacts are genuinely portfolio-worthy
- [ ] Skills demonstrated are industry-demanded
- [ ] Community impact is meaningful
- [ ] Artifacts are presentable to employers

### Scoring Rubric (1-10)

| Score | Description |
|-------|-------------|
| 9-10 | Multiple high-quality artifacts, strong industry/community value |
| 7-8 | Good artifacts, solid industry relevance |
| 5-6 | Some artifacts, moderate relevance |
| 3-4 | Few or low-quality artifacts, limited relevance |
| 1-2 | No meaningful artifacts, no relevance |

**Minimum passing score: 6.0**

### Escalation Path

If gate fails:
1. Portfolio artifacts reviewed by Industry Advisor
2. Artifacts must demonstrate specific competencies
3. Community impact must be documented
4. Escalate to Portfolio Design Lead

---

## Gate 10: Media Completeness Gate

**Purpose:** Ensure all media assets are drafted and ready.

### Pass/Fail Criteria

| Criterion | Pass | Fail |
|-----------|------|------|
| Article drafted | Blog/article content complete | No article or incomplete |
| Carousel designed | Social carousel assets ready | No carousel or missing slides |
| Video script written | Script present (if applicable) | Required script missing |
| Media assets ready | All assets in correct format | Missing or wrong format |

### Automated Checks

```javascript
// Article completeness
function validateArticle(article) {
  const hasContent = article && article.content && article.content.length > 1000;
  const hasTitle = article && article.title;
  const hasMetadata = article && article.author && article.date;
  return {
    pass: hasContent && hasTitle && hasMetadata,
    wordCount: article?.content?.split(/\s+/).length || 0
  };
}

// Carousel validation
function validateCarousel(carousel) {
  const hasSlides = carousel && carousel.slides && carousel.slides.length >= 3;
  const slidesComplete = carousel?.slides?.every(s => 
    s.headline && s.body && s.visual
  );
  return {
    pass: hasSlides && slidesComplete,
    slideCount: carousel?.slides?.length || 0
  };
}

// Video script validation
function validateVideoScript(script, required) {
  if (!required) return { pass: true, skipped: true };
  const hasScript = script && script.content && script.content.length > 500;
  const hasScenes = script && script.scenes && script.scenes.length > 0;
  return {
    pass: hasScript && hasScenes,
    sceneCount: script?.scenes?.length || 0
  };
}

// Asset format validation
function validateAssetFormats(assets) {
  const validFormats = {
    image: ['png', 'jpg', 'svg', 'webp'],
    video: ['mp4', 'webm'],
    document: ['pdf', 'md', 'html']
  };
  
  const issues = [];
  assets.forEach(asset => {
    const ext = extractExtension(asset.path);
    const typeValid = validFormats[asset.type]?.includes(ext);
    if (!typeValid) {
      issues.push({ asset: asset.path, issue: `Invalid format: ${ext}` });
    }
  });
  
  return { pass: issues.length === 0, issues };
}
```

### Manual Checks

- [ ] Article is engaging and well-written
- [ ] Carousel visuals are on-brand
- [ ] Video script is clear and timed
- [ ] All assets are accessible (alt text, captions)

### Scoring Rubric (1-10)

| Score | Description |
|-------|-------------|
| 9-10 | All media complete, high quality, accessible, on-brand |
| 7-8 | Most media complete, minor quality issues |
| 5-6 | Some media missing, quality inconsistent |
| 3-4 | Multiple media missing, low quality |
| 1-2 | Most media missing or incomplete |

**Minimum passing score: 6.0**

### Escalation Path

If gate fails:
1. Missing media flagged with deadline
2. Content creator must complete or justify omission
3. Media reviewed by Creative Lead
4. Escalate to Media Production Lead

---

## Gate Enforcement Rules

### Rule 1: Sequential Processing
Gates must be evaluated in order (1-10). A KP cannot skip gates.

### Rule 2: Mandatory Gate Failure
If any mandatory gate (1-5) fails, the KP is **automatically rejected** regardless of composite score.

### Rule 3: Composite Score Threshold
Even if all mandatory gates pass, the composite score must be ≥ 7.0/10.

### Rule 4: Maximum Remediation Attempts
A KP can be remediated and resubmitted up to **3 times**. After 3 failures, it is archived.

### Rule 5: Time Limits
- Automated checks: Complete within **5 minutes**
- Manual checks: Complete within **48 hours**
- Remediation: **72 hours** per attempt

### Rule 6: Escalation Timeline
- Level 1 (Content Author): 24 hours
- Level 2 (Team Lead): 48 hours
- Level 3 (Director): 72 hours
- Level 4 (Governance Board): 7 days

---

## Rejection Workflow

```
KP Fails Gate
     │
     ▼
┌─────────────────┐
│ Generate Failure │
│ Report           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Notify Content   │
│ Author           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Author Remediate │──► Within 72 hours
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Re-submit for    │
│ Validation       │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
 Pass      Fail (Attempt 2/3)
    │         │
    ▼         ▼
 Release   ┌─────────────────┐
           │ Notify Escalation│
           └────────┬────────┘
                    │
               ┌────┴────┐
               │         │
          Attempt 3   Archive KP
               │
               ▼
          ┌─────────────────┐
          │ Final Review     │
          │ by Director      │
          └────────┬────────┘
                   │
              ┌────┴────┐
              │         │
           Pass      Archive
              │
              ▼
           Release
```

---

## Appeal Process

### Grounds for Appeal
1. **Automated Check Error:** The automated check produced a false positive
2. **Subjective Assessment:** The manual reviewer applied criteria incorrectly
3. **New Evidence:** New information has emerged since the review
4. **Process Failure:** The review process was not followed correctly

### Appeal Steps

1. **Submit Appeal** (within 7 days of rejection)
   - Written statement with evidence
   - Specific gate and criterion disputed
   - Proposed resolution

2. **Appeal Review** (within 48 hours)
   - Independent reviewer (not original reviewer)
   - Evidence evaluated
   - Decision rendered

3. **Appeal Decision**
   - **Upheld:** Original decision stands
   - **Overturned:** KP proceeds to next gate
   - **Modify:** Specific changes required

4. **Final Appeal** (if needed)
   - Governance Board review
   - Decision is final

---

## Quality Metrics Tracking

### Metrics Dashboard

| Metric | Target | Tracking |
|--------|--------|----------|
| First-pass rate | ≥ 70% | Per KP |
| Average composite score | ≥ 8.0 | Per KP |
| Gate failure rate | ≤ 30% | Per gate |
| Remediation success rate | ≥ 80% | Per attempt |
| Appeal success rate | ≤ 20% | Per appeal |
| Time to pass | ≤ 7 days | Per KP |
| Automated check coverage | ≥ 90% | Per gate |

### Reporting Schedule

| Report | Frequency | Audience |
|--------|-----------|----------|
| Gate pass/fail summary | Daily | Production Team |
| Quality trends | Weekly | Leadership |
| Gate performance | Monthly | Governance Board |
| System improvement | Quarterly | All stakeholders |

### Continuous Improvement

1. **Gate Tuning:** Review false positive/negative rates monthly
2. **Automation Expansion:** Convert manual checks to automated where possible
3. **Threshold Adjustment:** Review scoring thresholds quarterly
4. **Process Optimization:** Streamline based on metrics

---

## Appendix A: Gate Checklist Template

```markdown
# KP Quality Gate Checklist

**KP ID:** [ID]
**KP Title:** [Title]
**Reviewer:** [Name]
**Date:** [Date]

## Gate 1: Educational Quality
- [ ] Learning outcomes measurable (Score: __/10)
- [ ] Bloom's levels appropriate
- [ ] Age-appropriate content
- [ ] Prerequisites stated
- **Gate 1 Status:** PASS / FAIL

## Gate 2: Technical Accuracy
- [ ] Facts verifiable (Score: __/10)
- [ ] Code examples work
- [ ] No hallucinations
- [ ] References real
- **Gate 2 Status:** PASS / FAIL

[... continue for all 10 gates ...]

## Overall Assessment
- **Composite Score:** __/10
- **Mandatory Gates Passed:** __/5
- **Final Status:** PASS / FAIL
- **Remediation Needed:** [Yes/No]
- **Next Steps:** [Description]
```

---

## Appendix B: Automated Check Configuration

```yaml
# quality-gates-config.yaml

gates:
  educational:
    readability:
      targetGrade: 10
      tolerance: 2
    bloomsVerbs: true
    prerequisitesRequired: true
    
  technical:
    codeExecution: true
    referenceValidation: true
    hallucinationDetection: true
    
  constitution:
    inclusivityCheck: true
    culturalSensitivity: true
    negativePatterns: true
    
  bee2:
    researchBacking: true
    reuseCheck: true
    simplicityThreshold: 0.7
    humanApprovalRequired: true
    
  citation:
    plagiarismThreshold: 15
    citationRequired: true
    authorityThreshold: 50

scoring:
  minimumComposite: 7.0
  minimumMandatoryGate: 6.0
  weights:
    educational: 15
    technical: 15
    constitution: 10
    bee2: 10
    citation: 10
    outcomes: 10
    project: 10
    assessment: 10
    portfolio: 5
    media: 5

enforcement:
  maxRemediationAttempts: 3
  automatedCheckTimeout: 300  # 5 minutes
  manualCheckTimeout: 172800  # 48 hours
  remediationTimeout: 259200  # 72 hours

escalation:
  level1: 86400    # 24 hours
  level2: 172800   # 48 hours
  level3: 259200   # 72 hours
  level4: 604800   # 7 days
```

---

**Document History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-01 | Production Team | Initial release |

---

*This document is the single source of truth for quality gate processes. All KP validation must follow these procedures.*
