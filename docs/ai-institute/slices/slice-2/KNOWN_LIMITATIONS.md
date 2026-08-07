# Known Limitations — Slice 2

**Date:** 2026-08-04
**Scope:** What Slice 2 does not solve

---

## Technical Limitations

### 1. Mock AI Provider

**Limitation:** AI responses are simulated, not real
**Impact:** Students learn prompt structure, but not real AI behavior
**Mitigation:** Design runtime around provider interfaces for easy swap
**Future:** Slice 3 plugs in real AI providers

### 2. localStorage Persistence

**Limitation:** Data stored in browser only
**Impact:** Progress lost if browser data cleared, no cross-device sync
**Mitigation:** Export functionality for portfolio artifacts
**Future:** Slice 3 adds backend API

### 3. No Authentication

**Limitation:** No user accounts
**Impact:** No persistent identity, no cohort features
**Mitigation:** LocalStorage works for individual learning
**Future:** Slice 4 adds authentication

### 4. No Backend

**Limitation:** No server-side logic
**Impact:** No real-time features, no data aggregation
**Mitigation:** Client-side analytics sufficient for Slice 2
**Future:** Slice 3 adds backend API

---

## Educational Limitations

### 1. Limited Lesson Content

**Limitation:** Only 3 lessons in foundation course
**Impact:** Students complete content quickly
**Mitigation:** Focus on quality over quantity
**Future:** Expand curriculum in Slice 3+

### 2. No Human Mentorship

**Limitation:** AI mentor only, no human review
**Impact:** No expert feedback on student work
**Mitigation:** AI mentor provides immediate feedback
**Future:** Slice 4 adds human mentor integration

### 3. No Peer Learning

**Limitation:** No community features
**Impact:** Students learn alone
**Mitigation:** Portfolio sharing enables some peer visibility
**Future:** Slice 5 adds community features

### 4. No Adaptive Learning

**Limitation:** Fixed path for all students
**Impact:** No personalization based on performance
**Mitigation:** AI mentor adapts responses to student level
**Future:** Slice 4 adds adaptive learning

---

## Product Limitations

### 1. No Mobile App

**Limitation:** Web only
**Impact:** No offline learning, no mobile experience
**Mitigation:** Responsive design works on mobile browsers
**Future:** Consider mobile app in future slices

### 2. No Offline Mode

**Limitation:** Requires internet connection
**Impact:** Can't learn without connectivity
**Mitigation:** Mock AI provider could work offline
**Future:** Offline mode in future slices

### 3. No Certification

**Limitation:** No formal credentials
**Impact:** No verifiable proof of completion
**Mitigation:** Portfolio artifacts serve as evidence
**Future:** Slice 5 adds certification

### 4. No Career Support

**Limitation:** No job placement, no networking
**Impact:** No direct career outcomes
**Mitigation:** Portfolio helps with job applications
**Future:** Slice 6 adds career support

---

## Design Limitations

### 1. No Dark/Light Toggle

**Limitation:** Dark mode only
**Impact:** Users can't switch themes
**Mitigation:** Dark mode is primary design choice
**Future:** Light mode in future slices

### 2. No Accessibility Audit

**Limitation:** No WCAG compliance verification
**Impact:** May not work for all users
**Mitigation:** Design system follows accessibility patterns
**Future:** Full accessibility audit in Slice 3

### 3. No Internationalization

**Limitation:** English only
**Impact:** Non-English speakers can't use platform
**Mitigation:** Content is clear and simple
**Future:** i18n in future slices

---

## What's NOT in Slice 2

### Explicitly Excluded

| Feature              | Reason                  | When    |
| -------------------- | ----------------------- | ------- |
| Authentication       | Premature               | Slice 4 |
| Backend API          | Premature               | Slice 3 |
| Real AI integration  | Mock first              | Slice 3 |
| Instructor dashboard | Not student-facing      | Slice 4 |
| Cohort management    | Not individual learning | Slice 5 |
| Community features   | Not core to learning    | Slice 5 |
| Certification        | Not career-critical     | Slice 5 |
| Career support       | Not learning-critical   | Slice 6 |

---

## Risk Assessment

| Risk                      | Likelihood | Impact | Mitigation                  |
| ------------------------- | ---------- | ------ | --------------------------- |
| Mock AI feels unrealistic | Medium     | Medium | Design clear mock responses |
| Students want real AI     | High       | Low    | Slice 3 adds real AI        |
| localStorage data loss    | Low        | Medium | Export functionality        |
| No cross-device sync      | Medium     | Low    | Accept for Slice 2          |
| Limited content           | Medium     | Low    | Focus on quality            |

---

## What Slice 2 DOES Solve

Despite limitations, Slice 2 solves the core problem:

**Before:** Students read about AI
**After:** Students interact with AI

**Before:** Students complete assignments
**After:** Students create portfolio artifacts

**Before:** Students earn badges
**After:** Students demonstrate skill

**The core gap is closed.** Limitations are acceptable for this stage.

---

## Verdict

Slice 2 has limitations but solves the fundamental problem.

**Proceed with awareness of limitations.**
**Address limitations in future slices as needed.**
