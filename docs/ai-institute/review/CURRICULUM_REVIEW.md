# Curriculum Review — AI Institute v1.0

**Date:** 2026-08-04
**Scope:** Foundation Course (3 lessons, lab, knowledge check, project)

---

## Course Structure

```
Foundation Course (4-6 weeks)
└── Module: What is AI?
    ├── Lesson 1: Introduction to AI (20 min)
    ├── Lesson 2: How AI Learns (25 min)
    ├── Lesson 3: Your First AI Build (30 min)
    ├── Lab: Prompt Engineering (45 min)
    ├── Knowledge Check (5 min)
    └── Project: Build Your AI Assistant (60 min)
```

---

## Order Assessment

### Is the order correct?

**Lesson 1 → Lesson 2:** ✅ Yes

- Introduction to AI provides foundation
- How AI Learns builds on that foundation
- Logical progression from "what" to "how"

**Lesson 2 → Lesson 3:** ⚠️ Partially

- How AI Learns explains concepts
- Your First AI Build applies concepts
- But the jump from theory to practice is abrupt
- Missing: "How to think about building with AI"

**Lessons → Lab:** ⚠️ Partially

- Lessons provide knowledge
- Lab provides practice
- But lab tasks don't directly connect to lesson content
- Task 1 (photosynthesis) isn't in any lesson
- Task 2 (JSON output) isn't taught

**Lab → Knowledge Check:** ⚠️ Partially

- Lab practices skills
- Knowledge check tests knowledge
- But knowledge check tests different skills than lab practices
- No connection between lab output and check questions

**Knowledge Check → Project:** ⚠️ Partially

- Knowledge check verifies understanding
- Project applies understanding
- But project requirements aren't taught in any lesson
- API basics are mentioned but not taught

---

## Prerequisites Assessment

### Are prerequisites missing?

**For Lesson 1:** ✅ None needed

- Introduction to AI assumes no prior knowledge
- Appropriate for beginners

**For Lesson 2:** ✅ Lesson 1 is prerequisite

- How AI Learns builds on Introduction
- Concepts from Lesson 1 are used

**For Lesson 3:** ⚠️ Missing prerequisites

- Your First AI Build assumes:
  - Basic TypeScript knowledge (not taught)
  - API concepts (mentioned but not taught)
  - Async/await patterns (not taught)
- Students without programming experience will struggle

**For Lab:** ⚠️ Missing prerequisites

- Prompt Engineering Lab assumes:
  - Understanding of what prompts are (taught in Lesson 1)
  - Ability to write clear instructions (not taught)
  - Understanding of AI output format (not taught)

**For Project:** ⚠️ Missing prerequisites

- Build Your AI Assistant assumes:
  - TypeScript class syntax (not taught)
  - Interface definitions (not taught)
  - Fetch API (not taught)
  - Error handling patterns (not taught)

---

## Practice Assessment

### Is there enough practice?

**Lesson 1:** ⚠️ Insufficient

- 2 exercises (1 prompt, 1 reflection)
- No code exercises
- No interactive AI practice
- Reading is passive

**Lesson 2:** ⚠️ Insufficient

- 1 exercise (prompt prediction)
- No code exercises
- No interactive AI practice
- Reading is passive

**Lesson 3:** ⚠️ Insufficient

- 2 exercises (code, customize)
- But no execution environment
- Can't run code
- Can't test AI responses

**Lab:** ⚠️ Partially sufficient

- 4 tasks with clear instructions
- But feedback is simulated
- No real AI interaction
- No iteration on actual output

**Project:** ⚠️ Partially sufficient

- 1 project with clear requirements
- But no execution environment
- Can't test functionality
- Review is keyword-based

### Is there too much theory?

**Yes.** The ratio is approximately:

- 70% reading/theory
- 20% passive examples
- 10% active practice

**Target ratio:**

- 30% reading/theory
- 30% interactive examples
- 40% active practice

---

## Beginner Success Assessment

### Can a complete beginner succeed?

**Lesson 1:** ✅ Yes

- Content is accessible
- No prior knowledge required
- Exercises are minimal but achievable

**Lesson 2:** ✅ Yes

- Builds on Lesson 1
- Content is clear
- Exercise is achievable

**Lesson 3:** ⚠️ Maybe

- Assumes programming knowledge
- Code examples are clear
- But no way to test if code works
- Beginner may not understand errors

**Lab:** ⚠️ Maybe

- Tasks are clear
- Hints are helpful
- But feedback doesn't evaluate content
- Beginner may not know how to improve

**Knowledge Check:** ✅ Yes

- Questions are clear
- Multiple-choice is accessible
- Short-answer is open-ended

**Project:** ❌ No

- Assumes significant programming knowledge
- No execution environment
- No way to test if code works
- Review is superficial

---

## Experienced Developer Assessment

### Would an experienced developer become bored?

**Lesson 1:** ✅ Yes, bored

- Content is too basic
- No depth
- No real examples
- No connection to real-world AI

**Lesson 2:** ⚠️ Maybe

- Content is accurate but shallow
- No technical depth
- No real-world examples

**Lesson 3:** ✅ Yes, bored

- Code is too simple
- No real functionality
- No execution environment

**Lab:** ⚠️ Maybe

- Tasks are interesting
- But feedback is useless for experienced developers
- No real AI interaction

**Project:** ⚠️ Maybe

- Project concept is good
- But implementation is too basic
- No real functionality
- No deployment

---

## Recommendations

### Immediate Fixes

1. **Add programming prerequisites** to Lesson 3 and Project
2. **Add interactive AI sandbox** to lessons
3. **Connect lab tasks** to lesson content
4. **Make project executable** in browser
5. **Add more practice** to each lesson

### Curriculum Restructuring

1. **Add Lesson 0:** "Programming Basics for AI"
   - Variables, functions, async/await
   - API concepts
   - Error handling
   - 2-3 hours

2. **Restructure Lessons:**
   - Lesson 1: What is AI? (theory + practice)
   - Lesson 2: How AI Learns (theory + practice)
   - Lesson 3: Thinking Like an AI Builder (theory + practice)
   - Lesson 4: Your First AI Build (practice + project)

3. **Add Practice Sessions:**
   - After each lesson: 15-minute practice
   - During each lesson: Interactive AI sandbox
   - Before project: Guided build session

### Content Improvements

1. **Reduce reading** by 50%
2. **Add interactive examples** that run
3. **Add live AI responses** to exercises
4. **Connect concepts** across lessons
5. **Add real-world examples** from actual AI projects

---

## Verdict

**Current State:** Theory-heavy curriculum with insufficient practice
**Target State:** Practice-heavy curriculum with just-in-time theory
**Gap:** Significant restructuring needed

**Recommendation:** Add Lesson 0 (programming basics), restructure lessons to balance theory/practice, add interactive AI sandbox to all lessons.
