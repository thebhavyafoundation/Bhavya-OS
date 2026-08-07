# Lab Review — AI Institute v1.0

**Date:** 2026-08-04
**Scope:** Prompt Engineering Lab (4 tasks)

---

## Lab Structure

```
Prompt Engineering Lab (45 minutes)
├── Task 1: Basic Prompt (explain photosynthesis to 12-year-old)
├── Task 2: Structured Output (JSON with 3 solar system facts)
├── Task 3: Chain of Thought (step-by-step math problem)
└── Task 4: Few-Shot Learning (temperature conversion with examples)
```

---

## Evaluation

### Instructions

| Task   | Clarity  | Completeness | Achievable |
| ------ | -------- | ------------ | ---------- |
| Task 1 | ✅ Clear | ✅ Complete  | ✅ Yes     |
| Task 2 | ✅ Clear | ✅ Complete  | ✅ Yes     |
| Task 3 | ✅ Clear | ✅ Complete  | ✅ Yes     |
| Task 4 | ✅ Clear | ✅ Complete  | ✅ Yes     |

**Assessment:** Instructions are well-written and clear. Each task has a specific goal and expected output.

### Difficulty Progression

| Task   | Difficulty  | Progression              |
| ------ | ----------- | ------------------------ |
| Task 1 | Easy        | ✅ Appropriate start     |
| Task 2 | Medium      | ✅ Builds on Task 1      |
| Task 3 | Medium-Hard | ✅ Introduces complexity |
| Task 4 | Hard        | ✅ Requires synthesis    |

**Assessment:** Difficulty progression is appropriate. Each task builds on previous skills.

### Hints

| Task   | Hint Quality | Hint Helpfulness          |
| ------ | ------------ | ------------------------- |
| Task 1 | ⚠️ Generic   | ⚠️ Not specific to prompt |
| Task 2 | ⚠️ Generic   | ⚠️ Not specific to prompt |
| Task 3 | ⚠️ Generic   | ⚠️ Not specific to prompt |
| Task 4 | ⚠️ Generic   | ⚠️ Not specific to prompt |

**Assessment:** Hints are generic ("Think about the audience") not specific ("Try asking for step-by-step explanation"). They don't help students improve their actual prompts.

### Validation

| Task   | Validation Method        | Accuracy |
| ------ | ------------------------ | -------- |
| Task 1 | Word count + punctuation | ❌ Low   |
| Task 2 | Word count + punctuation | ❌ Low   |
| Task 3 | Word count + punctuation | ❌ Low   |
| Task 4 | Word count + punctuation | ❌ Low   |

**Assessment:** Validation is based on structure (word count, punctuation), not content (prompt quality). A student could game the system by writing long, punctuated nonsense.

### Feedback

| Task   | Feedback Quality | Specificity | Actionable        |
| ------ | ---------------- | ----------- | ----------------- |
| Task 1 | ❌ Poor          | ❌ Generic  | ❌ Not actionable |
| Task 2 | ❌ Poor          | ❌ Generic  | ❌ Not actionable |
| Task 3 | ❌ Poor          | ❌ Generic  | ❌ Not actionable |
| Task 4 | ❌ Poor          | ❌ Generic  | ❌ Not actionable |

**Assessment:** Feedback is based on word count thresholds:

- < 5 words: "Too brief"
- No punctuation: "Add structure"
- < 50 chars: "Add specifics"
- Otherwise: "Strong prompt!"

This doesn't evaluate:

- Prompt clarity
- Audience appropriateness
- Format specification
- Example quality
- Iteration potential

### Reflection

| Dimension             | Status             |
| --------------------- | ------------------ |
| Post-task reflection  | ❌ Not implemented |
| Learning capture      | ❌ Not implemented |
| Connection to lessons | ❌ Not implemented |

**Assessment:** No reflection component. Students complete tasks without capturing what they learned.

---

## Skill Development Assessment

### Does the student actually develop skill?

**Prompt Writing:** ⚠️ Partially

- Students write prompts
- But feedback doesn't evaluate prompt quality
- No guidance on improvement
- No iteration on actual output

**Audience Awareness:** ❌ No

- Task 1 mentions audience (12-year-old)
- But feedback doesn't evaluate audience appropriateness
- No guidance on adapting prompts for different audiences

**Format Specification:** ⚠️ Partially

- Task 2 requires JSON output
- But feedback doesn't evaluate format compliance
- No guidance on specifying output format

**Chain of Thought:** ⚠️ Partially

- Task 3 requires step-by-step reasoning
- But feedback doesn't evaluate reasoning quality
- No guidance on prompting for reasoning

**Few-Shot Learning:** ⚠️ Partially

- Task 4 requires examples
- But feedback doesn't evaluate example quality
- No guidance on selecting effective examples

---

## What's Missing

### 1. Real AI Integration

The lab should call an actual AI model. Students should see:

- How their prompt performs with a real AI
- What the AI actually generates
- How small changes affect output

### 2. Content-Based Feedback

Feedback should evaluate:

- Clarity of instructions
- Specificity of requirements
- Appropriateness for audience
- Quality of examples
- Potential for iteration

### 3. Iteration Support

Students should be able to:

- See AI output
- Revise prompt based on output
- Compare before/after results
- Track improvement

### 4. Reflection Component

After each task, students should:

- Reflect on what worked/didn't work
- Identify patterns in effective prompts
- Connect to lesson concepts
- Capture learning for future reference

### 5. Real-World Connection

Tasks should connect to real-world use cases:

- Task 1: Explaining concepts to non-technical stakeholders
- Task 2: Generating structured data for applications
- Task 3: Reasoning through complex problems
- Task 4: Teaching AI domain-specific patterns

---

## Recommendations

### Immediate Fixes

1. **Connect to real AI** — Even simulated real AI (call an API, return actual response)
2. **Add content-based feedback** — Evaluate prompt quality, not just structure
3. **Add iteration support** — Show AI output, allow revision
4. **Add reflection** — Post-task learning capture

### Lab Restructuring

1. **Add "See AI Output" button** — Students see what their prompt generates
2. **Add "Revise Prompt" flow** — Students iterate based on output
3. **Add "Compare Results" view** — Before/after comparison
4. **Add "Learning Journal"** — Capture what worked and why

### Task Improvements

1. **Task 1:** Add specific audience constraints (age, background, interests)
2. **Task 2:** Add specific JSON schema requirements
3. **Task 3:** Add specific reasoning format requirements
4. **Task 4:** Add specific example quality criteria

---

## Verdict

**Current State:** Structure-based validation, not content-based
**Target State:** Content-based evaluation with real AI interaction
**Gap:** Fundamental — lab teaches gaming the system, not prompt engineering

**Recommendation:** Connect to real AI, add content-based feedback, add iteration support.
