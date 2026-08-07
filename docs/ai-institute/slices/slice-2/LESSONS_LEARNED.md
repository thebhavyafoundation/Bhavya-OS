# Lessons Learned — Slice 2 Planning

**Date:** 2026-08-04
**Scope:** What we learned from Slice 1 review and Slice 2 planning

---

## Key Insights

### 1. "Teaching with AI" vs "Teaching about AI"

**Insight:** The biggest risk is becoming another LMS with AI branding.

**Evidence:** Slice 1 delivered a functional LMS that teaches about AI, not with AI.

**Lesson:** Every feature must answer: "Can the student now do something they could not do before?"

**Application:** Slice 2 builds an AI Learning Runtime that enables interaction, not just consumption.

### 2. Interaction Is Primary, Reading Is Secondary

**Insight:** Students learn more from doing than from reading.

**Evidence:** Slice 1 had 70% reading, 30% interaction. Learning outcomes were poor.

**Lesson:** Target 30% explanation, 70% interaction.

**Application:** Slice 2 rewrites lessons to prioritize experimentation over reading.

### 3. Simulated Feedback Doesn't Teach

**Insight:** Keyword-based feedback doesn't improve learning.

**Evidence:** Slice 1 lab evaluated word count, not prompt quality. Students learned to game the system.

**Lesson:** Feedback must be content-based, not structure-based.

**Application:** Slice 2 connects to real AI (or realistic mock) for meaningful feedback.

### 4. Non-Frustrating Projects Don't Build Confidence

**Insight:** Students can't demonstrate skill with non-functional projects.

**Evidence:** Slice 1 project was a textarea with keyword review. Students couldn't run code.

**Lesson:** Projects must be executable and provide real feedback.

**Application:** Slice 2 makes projects runnable and provides AI-powered review.

### 5. Portfolio Artifacts Motivate More Than Badges

**Insight:** Students value tangible outputs over symbolic achievements.

**Evidence:** Slice 1 badge was awarded for completion, not capability.

**Lesson:** Every lesson should produce a portfolio artifact.

**Application:** Slice 2 generates portfolio artifacts from experiments and reflections.

### 6. Reflection Deepens Learning

**Insight:** Structured reflection turns experience into knowledge.

**Evidence:** Slice 1 had minimal reflection with no feedback.

**Lesson:** Reflection is mandatory and should be structured.

**Application:** Slice 2 requires reflection after every experiment.

### 7. AI Should Coach, Not Solve

**Insight:** The AI mentor should guide through questions, not provide answers.

**Evidence:** Slice 1 had no AI mentor interaction.

**Lesson:** AI should ask: "What happens if you specify the audience?" not say "Here is the correct prompt."

**Application:** Slice 2 implements Socratic questioning in AI mentor.

---

## Process Insights

### 1. Product Validation Before Feature Building

**Insight:** The Product Validation Sprint identified critical flaws before Slice 2 development.

**Evidence:** Slice 1 review revealed the product teaches about AI, not with AI.

**Lesson:** Always validate product before adding features.

**Application:** Slice 2 was redesigned based on validation findings.

### 2. Multiple Perspectives Reveal Blind Spots

**Insight:** Reviewing from 7 perspectives (Founder, Curriculum Designer, AI Engineer, Instructor, Student, Parent, Hiring Manager) revealed issues no single perspective would catch.

**Evidence:** Parent perspective revealed trust issues with false claims. Hiring manager revealed portfolio value gaps.

**Lesson:** Always review from multiple perspectives.

**Application:** Slice 2 planning considered all perspectives.

### 3. Mission Validation Ensures Alignment

**Insight:** The Mission Validation Report ensures every slice moves toward the mission.

**Evidence:** Slice 1 scored 2.6/10 on mission alignment. Slice 2 targets 8.2/10.

**Lesson:** Always validate mission alignment before proceeding.

**Application:** Slice 2 includes mission validation as acceptance criteria.

---

## Technical Insights

### 1. Reusable Runtime Beats Feature-by-Feature Building

**Insight:** Building a reusable AI Learning Runtime is more efficient than building features one by one.

**Evidence:** Each lesson needs the same capabilities: AI playground, experiments, reflections, portfolio.

**Lesson:** Build the runtime once, use it everywhere.

**Application:** Slice 2 builds the runtime as a reusable component.

### 2. Mock First, Real Later

**Insight:** A realistic mock AI provider enables development without real AI integration.

**Evidence:** Real AI integration requires API keys, rate limiting, cost management.

**Lesson:** Design around interfaces, implement with mocks first.

**Application:** Slice 2 uses MockAIProvider, Slice 3 swaps in real providers.

### 3. Platform-UI Reuse Saves Time

**Insight:** Reusing @bhavya/platform-ui components accelerates development.

**Evidence:** Slice 1 reused AppLayout, Card, Button, Badge successfully.

**Lesson:** Always check platform-ui before creating new components.

**Application:** Slice 2 reuses all existing platform-ui components.

---

## What We'd Do Differently

### 1. Start with Interaction, Not Content

**What we did:** Built content-first, interaction second.
**What we'd do:** Build interaction-first, content second.

### 2. Validate Earlier

**What we did:** Built Slice 1, then validated.
**What we'd do:** Validate concept before building.

### 3. Build Runtime First

**What we did:** Built features, then realized they need a runtime.
**What we'd do:** Build runtime, then build features on top.

### 4. Define Principles Before Implementation

**What we did:** Implemented, then defined principles.
**What we'd do:** Define principles, then implement within them.

---

## What We'll Do in Slice 2

1. Build AI Learning Runtime first
2. Rewrite Lesson 1 for interaction
3. Implement AI Playground
4. Add reflection system
5. Generate portfolio artifacts
6. Track learning analytics
7. Validate mission alignment

---

## Verdict

Slice 1 taught us that the product must teach with AI, not about AI.

Slice 2 applies this lesson by building an AI Learning Runtime that enables interaction, experimentation, reflection, and portfolio creation.

**The learning from Slice 1 makes Slice 2 better.**
