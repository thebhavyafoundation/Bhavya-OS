# Slice 2 Recommendation — AI Institute v1.0

**Date:** 2026-08-04
**Scope:** Slice 2 planning based on Slice 1 review

---

## Slice 1 Review Summary

### What Works

1. Complete student flow (landing → badge)
2. Design system integration
3. Assessment-first entry
4. Project-based learning
5. Build quality

### Critical Problems

1. Landing page makes false claims
2. Assessment doesn't personalize
3. Lessons are content, not capability
4. Lab is simulated
5. Project is non-functional
6. No learning verification

### Core Issue

**The product teaches about AI, not with AI.**

---

## Slice 2 Philosophy

### Before Adding Features

Slice 2 must close the gap between:

- **Current state:** Functional LMS with AI branding
- **Target state:** Operating system for creating AI engineers

### Feature Selection Criteria

Only include features that directly improve student outcomes:

| Feature              | Improves Learning? | Priority    |
| -------------------- | ------------------ | ----------- |
| Authentication       | ❌ No              | ❌ Reject   |
| Persistent progress  | ⚠️ Partially       | ⚠️ Consider |
| Real AI mentor       | ✅ Yes             | ✅ Include  |
| Portfolio generation | ✅ Yes             | ✅ Include  |
| Instructor dashboard | ❌ No              | ❌ Reject   |
| Cohort management    | ❌ No              | ❌ Reject   |

### Slice 2 Focus

**Primary Goal:** Make the product teach with AI, not about AI.

**Secondary Goal:** Build community around learning.

---

## Recommended Slice 2 Features

### 1. Interactive AI Sandbox (CRITICAL)

**What:** Live AI environment in every lesson
**Why:** Students must write prompts that actually run
**How:** Integrate AI API (even simulated) into lesson exercises
**Impact:** Transforms passive reading into active building

**Requirements:**

- AI chat interface in lesson exercises
- Real AI responses (even simulated)
- Prompt iteration support
- Output visualization

### 2. Real AI Lab (CRITICAL)

**What:** Connect lab to actual AI model
**Why:** Feedback must be content-based, not structure-based
**How:** Call AI API with student prompts, evaluate response quality
**Impact:** Students learn to write better prompts, not game the system

**Requirements:**

- AI API integration
- Content-based feedback
- Iteration support
- Progress tracking

### 3. Executable Project (CRITICAL)

**What:** Make project runnable in browser
**Why:** Students must see their code work
**How:** Add code execution environment, real AI integration
**Impact:** Transforms code exercise into real application

**Requirements:**

- Browser-based code execution
- Real AI integration
- Live preview
- Deployment option

### 4. AI Mentor Integration (HIGH)

**What:** Conversational AI mentor throughout journey
**Why:** Guide, question, coach, encourage, review, challenge
**How:** Integrate AI with mentor personality and interaction patterns
**Impact:** Personalized learning experience

**Requirements:**

- Mentor personality design
- Conversation engine
- Context awareness
- Learning verification

### 5. Portfolio Generation (HIGH)

**What:** Auto-generate portfolio from completed work
**Why:** Every project becomes portfolio evidence
**How:** Collect projects, generate portfolio pages, enable sharing
**Impact:** Students leave with tangible career assets

**Requirements:**

- Project collection
- Portfolio template
- Sharing capabilities
- Live demo embedding

### 6. Community Discussion (MEDIUM)

**What:** Discussion per lesson
**Why:** Enable peer learning and support
**How:** Add threaded discussions, moderation, mentor oversight
**Impact:** Students learn from each other

**Requirements:**

- Discussion system
- Moderation tools
- Mentor integration
- Notification system

---

## Features to Reject

### Authentication (REJECT)

**Why reject:**

- Doesn't improve learning
- Adds friction to onboarding
- Local storage works for MVP

**When to add:**

- When cohort management is needed
- When persistent progress across devices is required
- When instructor dashboard is built

### Instructor Dashboard (REJECT)

**Why reject:**

- Doesn't improve student learning
- Adds complexity without student value
- Premature for Slice 2

**When to add:**

- When instructors are actually teaching
- When cohort management is needed
- When learning analytics are required

### Cohort Management (REJECT)

**Why reject:**

- Doesn't improve individual learning
- Adds significant complexity
- Premature for Slice 2

**When to add:**

- When actual cohorts are running
- When instructor dashboard exists
- When community features are mature

---

## Slice 2 Timeline

### Week 1: AI Sandbox Integration

- Design AI sandbox UI
- Integrate AI API (simulated)
- Add to lesson exercises
- Test with students

### Week 2: Real AI Lab

- Connect lab to AI API
- Implement content-based feedback
- Add iteration support
- Test feedback quality

### Week 3: Executable Project

- Add code execution environment
- Integrate real AI
- Add live preview
- Test project functionality

### Week 4: AI Mentor

- Design mentor personality
- Implement conversation engine
- Add context awareness
- Test mentor interactions

### Week 5: Portfolio Generation

- Design portfolio templates
- Implement project collection
- Add sharing capabilities
- Test portfolio quality

### Week 6: Community Discussion

- Add discussion system
- Implement moderation
- Add mentor oversight
- Test community features

---

## Slice 2 Success Criteria

### Must Have

1. ✅ AI sandbox in every lesson
2. ✅ Real AI lab with content-based feedback
3. ✅ Executable project with live preview
4. ✅ AI mentor with conversation engine
5. ✅ Portfolio generation from completed work

### Should Have

1. ⚠️ Community discussion per lesson
2. ⚠️ Peer feedback system
3. ⚠️ Weekly showcase

### Nice to Have

1. ❌ Authentication
2. ❌ Instructor dashboard
3. ❌ Cohort management

---

## Slice 2 Validation

### Before Starting

- [ ] Review Slice 1 with all perspectives
- [ ] Validate mission alignment
- [ ] Confirm feature selection criteria
- [ ] Get stakeholder approval

### During Development

- [ ] Test AI sandbox with real students
- [ ] Validate AI lab feedback quality
- [ ] Test project execution
- [ ] Validate AI mentor interactions

### After Completion

- [ ] Student usability testing
- [ ] Educational value assessment
- [ ] Mission validation report
- [ ] Slice 3 planning

---

## Verdict

**Slice 2 Focus:** Make the product teach with AI, not about AI

**Critical Features:**

1. Interactive AI Sandbox
2. Real AI Lab
3. Executable Project
4. AI Mentor Integration
5. Portfolio Generation

**Rejected Features:**

- Authentication (premature)
- Instructor dashboard (premature)
- Cohort management (premature)

**Timeline:** 6 weeks

**Success Criteria:** Students can write prompts that run, build projects that work, and leave with portfolio evidence.
