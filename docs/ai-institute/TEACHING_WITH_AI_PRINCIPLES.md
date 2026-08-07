# Teaching With AI — Educational Constitution

**Date:** 2026-08-04
**Status:** Permanent — applies to all Bhavya Foundation educational products
**Supersedes:** Any prior instructional guidelines

---

## The Core Principle

**Bhavya AI Institute teaches with AI, not about AI.**

Every design decision, every feature, every lesson must pass this test:

> "Can the student now do something they could not do 30 minutes ago?"

If the answer is no, the lesson fails.

---

## The Seven Laws

### Law 1: Every lesson must include at least one live experiment.

Reading is preparation. Experimentation is learning.

A lesson without an experiment is a lecture. Lectures do not build engineers.

**Implementation:**

- Every lesson has an AI Playground
- Students write prompts, see results, iterate
- The experiment is the lesson, not the supplement

### Law 2: Every experiment must require reflection.

Experimentation without reflection is tinkering. Reflection turns experience into knowledge.

**Implementation:**

- After every experiment: "What changed? Why? What surprised you?"
- Reflection is mandatory, not optional
- Reflections are stored and reviewed

### Law 3: Every lesson must produce a reusable artifact.

Consumption leaves nothing. Creation leaves evidence.

A student who completes a lesson should have something they built, not just something they read.

**Implementation:**

- Every lesson produces a portfolio artifact
- Artifacts are exportable
- Artifacts demonstrate capability

### Law 4: AI should coach rather than solve.

The AI mentor guides, questions, challenges, encourages, reviews. It never simply gives answers.

**Implementation:**

- AI asks: "What happens if you specify the audience?"
- AI does not say: "Here is the correct prompt."
- AI coaches through Socratic questioning

### Law 5: Students should spend more time creating than consuming.

The ratio of creation to consumption defines the learning model.

**Target:** 70% creation, 30% consumption.

**Implementation:**

- Lessons are structured as experiments, not readings
- Time spent is tracked by activity type
- Analytics optimize for creation time

### Law 6: Progress is measured by demonstrated capability, not content completed.

Completing a reading is not progress. Demonstrating a skill is progress.

**Implementation:**

- Progress = experiments completed + reflections written + artifacts created
- Not = lessons read + quizzes passed
- Capability verification through demonstration

### Law 7: Every experiment becomes evidence of learning.

Experiments are not disposable. They are portfolio evidence.

**Implementation:**

- Experiment history is stored
- Best attempts are highlighted
- Experiments connect to portfolio artifacts

---

## The Learning Model

```
Explanation (10%)
    ↓
Experiment (40%)
    ↓
Reflection (15%)
    ↓
Iteration (20%)
    ↓
Portfolio Artifact (15%)
```

**Time Distribution:**

- 10% — Brief explanation of concept
- 40% — Live experimentation with AI
- 15% — Reflection on what worked/didn't
- 20% — Iteration and improvement
- 15% — Portfolio artifact creation

---

## The AI Mentor Contract

The AI mentor in Bhavya Foundation:

### Must

- Guide through questions
- Challenge assumptions
- Encourage experimentation
- Review student work
- Coach toward improvement

### Must Never

- Give answers directly
- Solve problems for students
- Provide correct prompts
- Complete work for students
- Skip the learning process

### Examples of Good Coaching

| Instead of...                | The mentor says...                                                     |
| ---------------------------- | ---------------------------------------------------------------------- |
| "Here is the correct prompt" | "What happens if you specify the audience?"                            |
| "This is wrong"              | "I notice your prompt lacks constraints. What constraints would help?" |
| "Try this"                   | "Can you reduce the ambiguity? What's unclear?"                        |
| "Good job"                   | "You improved from 40 to 72. What changed in your approach?"           |
| "Do it this way"             | "What would happen if you tried a different structure?"                |

---

## The Experiment Contract

Every experiment in Bhavya Foundation:

### Must

- Have a clear objective
- Allow multiple attempts
- Store attempt history
- Provide AI feedback
- Require reflection
- Connect to portfolio

### Must Not

- Be one-shot only
- Be disposable
- Be disconnected from learning outcomes
- Be evaluated by keyword matching
- Be optional

---

## The Portfolio Contract

Every artifact in Bhavya Foundation:

### Must

- Be created by the student
- Be exportable
- Include reflection
- Include experiment history
- Be shareable

### Must Not

- Be template-generated without student input
- Be disconnected from learning
- Be disposable
- Be inaccessible to the student

---

## The Analytics Contract

Bhavya Foundation tracks:

### Learning Metrics

- Experiments completed
- Iterations per experiment
- Reflection quality
- Prompt improvement over time
- Time spent creating vs. consuming
- Portfolio artifacts generated

### Does Not Track

- Time spent reading (not a learning metric)
- Video watch time (not a learning metric)
- Login frequency (engagement, not learning)
- Content completion (not capability)

---

## The Design Contract

Every interface in Bhavya Foundation:

### Must

- Use @bhavya/platform-ui
- Prioritize interaction over consumption
- Show experiment history
- Enable reflection
- Support portfolio export

### Must Not

- Introduce new foundational components
- Create custom design tokens
- Build LMS-style content pages
- Optimize for content consumption

---

## Validation Questions

Before implementing any feature, ask:

1. Does this help the student DO something?
2. Does this create a reusable artifact?
3. Does this improve demonstrated capability?
4. Does this coach rather than solve?
5. Does this increase creation over consumption?

If the answer to any question is no, reconsider.

---

## Enforcement

This document is the educational constitution.

All future slices, all new lessons, all platform evolution must comply.

Violations must be identified and corrected before shipping.

**Review frequency:** Every slice completion
**Review scope:** All new features, all lesson rewrites, all platform changes
**Authority:** This document supersedes feature requests, stakeholder opinions, and convenience

---

## The Promise

A student who completes a Bhavya Foundation lesson will:

1. Have interacted with real AI
2. Have experimented multiple times
3. Have reflected on what they learned
4. Have created something tangible
5. Have evidence of capability

Not:

1. Read about AI
2. Watched videos about AI
3. Answered questions about AI
4. Completed assignments about AI
5. Earned certificates for completing content

**The difference:** Building engineers, not educating students.
