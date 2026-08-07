# Educational Audit — AI Institute v1.0

**Date:** 2026-08-04
**Scope:** All screens in Slice 1

---

## Screen-by-Screen Audit

### 1. Landing Page (`/`)

| Dimension                     | Assessment                                               |
| ----------------------------- | -------------------------------------------------------- |
| **Purpose**                   | Convert visitor to student                               |
| **Learning Objective**        | None (marketing)                                         |
| **Expected Outcome**          | Click "Take the Assessment"                              |
| **Estimated Time**            | 30 seconds                                               |
| **Cognitive Load**            | Low                                                      |
| **Motivation**                | Moderate — mission is compelling, stats are questionable |
| **Retention Value**           | None — no learning occurs                                |
| **Could this be simplified?** | Yes — remove fake stats, simplify to hero + CTA          |

**Recommendation:** Remove false claims. Simplify to mission + assessment CTA.

---

### 2. Assessment Intro (`/assessment`)

| Dimension                     | Assessment                        |
| ----------------------------- | --------------------------------- |
| **Purpose**                   | Set expectations for assessment   |
| **Learning Objective**        | None (orientation)                |
| **Expected Outcome**          | Click "Start Assessment"          |
| **Estimated Time**            | 30 seconds                        |
| **Cognitive Load**            | Low                               |
| **Motivation**                | High — promise of personalization |
| **Retention Value**           | None — no learning occurs         |
| **Could this be simplified?** | Yes — combine with first question |

**Recommendation:** Merge intro with first question. Reduce friction.

---

### 3. Assessment Quiz (`/assessment`)

| Dimension                     | Assessment                                                |
| ----------------------------- | --------------------------------------------------------- |
| **Purpose**                   | Measure student readiness                                 |
| **Learning Objective**        | None (assessment)                                         |
| **Expected Outcome**          | Complete 8 questions                                      |
| **Estimated Time**            | 3 minutes                                                 |
| **Cognitive Load**            | Medium — mix of knowledge and preference questions        |
| **Motivation**                | Moderate — progress bar creates momentum                  |
| **Retention Value**           | Low — questions don't teach, they measure                 |
| **Could this be simplified?** | Yes — remove preference questions (goals, time, language) |

**Recommendation:** Focus on knowledge assessment only. Move preferences to onboarding.

---

### 4. Assessment Results (`/assessment`)

| Dimension                     | Assessment                                         |
| ----------------------------- | -------------------------------------------------- |
| **Purpose**                   | Deliver personalized roadmap                       |
| **Learning Objective**        | None (orientation)                                 |
| **Expected Outcome**          | Click "Go to Dashboard"                            |
| **Estimated Time**            | 30 seconds                                         |
| **Cognitive Load**            | Low                                                |
| **Motivation**                | Moderate — roadmap is visible but not personalized |
| **Retention Value**           | None — no learning occurs                          |
| **Could this be simplified?** | Yes — roadmap should be dynamic based on answers   |

**Recommendation:** Make roadmap genuinely personalized. Show specific next steps.

---

### 5. Dashboard (`/dashboard`)

| Dimension                     | Assessment                                            |
| ----------------------------- | ----------------------------------------------------- |
| **Purpose**                   | Orient student, show progress                         |
| **Learning Objective**        | None (navigation)                                     |
| **Expected Outcome**          | Click "Start Lesson 1"                                |
| **Estimated Time**            | 30 seconds                                            |
| **Cognitive Load**            | Low                                                   |
| **Motivation**                | High — progress tracking creates momentum             |
| **Retention Value**           | Low — dashboard is reference, not learning            |
| **Could this be simplified?** | Yes — remove duplicate quick actions, simplify streak |

**Recommendation:** Simplify. Remove premature gamification (streak = 1 on first day).

---

### 6. Lesson — Reading Tab (`/courses/foundations/lessons/[id]`)

| Dimension                     | Assessment                                          |
| ----------------------------- | --------------------------------------------------- |
| **Purpose**                   | Deliver core content                                |
| **Learning Objective**        | Understand AI concepts                              |
| **Expected Outcome**          | Read content, understand concepts                   |
| **Estimated Time**            | 10-15 minutes                                       |
| **Cognitive Load**            | Medium — new concepts require processing            |
| **Motivation**                | Moderate — content is clear but passive             |
| **Retention Value**           | High — reading is foundational                      |
| **Could this be simplified?** | Yes — add interactive elements, reduce text density |

**Recommendation:** Good content. Add interactive examples. Connect to exercises.

---

### 7. Lesson — Examples Tab

| Dimension                     | Assessment                                 |
| ----------------------------- | ------------------------------------------ |
| **Purpose**                   | Show code examples                         |
| **Learning Objective**        | See AI concepts in code                    |
| **Expected Outcome**          | Read and understand code                   |
| **Estimated Time**            | 5 minutes                                  |
| **Cognitive Load**            | Medium — code requires parsing             |
| **Motivation**                | Moderate — examples are clear but static   |
| **Retention Value**           | Medium — code examples reinforce concepts  |
| **Could this be simplified?** | Yes — make examples interactive (runnable) |

**Recommendation:** Make code examples runnable. Add live AI responses.

---

### 8. Lesson — Exercises Tab

| Dimension                     | Assessment                                     |
| ----------------------------- | ---------------------------------------------- |
| **Purpose**                   | Practice applying concepts                     |
| **Learning Objective**        | Apply AI concepts through practice             |
| **Expected Outcome**          | Complete exercises                             |
| **Estimated Time**            | 10 minutes                                     |
| **Cognitive Load**            | High — requires application                    |
| **Motivation**                | Low — exercises reference non-existent AI chat |
| **Retention Value**           | High — practice is essential for learning      |
| **Could this be simplified?** | No — exercises are already minimal             |

**Recommendation:** CRITICAL: Fix broken promise. Add AI sandbox for exercises.

---

### 9. Lesson — Reflect Tab

| Dimension                     | Assessment                               |
| ----------------------------- | ---------------------------------------- |
| **Purpose**                   | Encourage metacognition                  |
| **Learning Objective**        | Reflect on learning                      |
| **Expected Outcome**          | Write reflection                         |
| **Estimated Time**            | 5 minutes                                |
| **Cognitive Load**            | Medium — requires self-reflection        |
| **Motivation**                | Low — no feedback on reflection          |
| **Retention Value**           | High — reflection improves retention     |
| **Could this be simplified?** | No — reflection is appropriately minimal |

**Recommendation:** Add AI feedback on reflections. Connect to learning outcomes.

---

### 10. Lesson — Notes Tab

| Dimension                     | Assessment                                         |
| ----------------------------- | -------------------------------------------------- |
| **Purpose**                   | Personal note-taking                               |
| **Learning Objective**        | None (reference)                                   |
| **Expected Outcome**          | Take notes                                         |
| **Estimated Time**            | 2 minutes                                          |
| **Cognitive Load**            | Low                                                |
| **Motivation**                | Low — notes are local only                         |
| **Retention Value**           | Medium — note-taking improves retention            |
| **Could this be simplified?** | Yes — notes could be pre-populated with key points |

**Recommendation:** Keep minimal. Notes are reference, not learning.

---

### 11. Lab (`/courses/foundations/lab`)

| Dimension                     | Assessment                                |
| ----------------------------- | ----------------------------------------- |
| **Purpose**                   | Practice prompt engineering               |
| **Learning Objective**        | Write effective prompts                   |
| **Expected Outcome**          | Complete 4 prompt tasks                   |
| **Estimated Time**            | 45 minutes                                |
| **Cognitive Load**            | High — requires application and iteration |
| **Motivation**                | Moderate — AI feedback is simulated       |
| **Retention Value**           | High — practice is essential              |
| **Could this be simplified?** | No — lab is appropriately scoped          |

**Recommendation:** CRITICAL: Connect to real AI. Feedback must be content-based, not structure-based.

---

### 12. Knowledge Check (`/courses/foundations/check`)

| Dimension                     | Assessment                                        |
| ----------------------------- | ------------------------------------------------- |
| **Purpose**                   | Verify learning                                   |
| **Learning Objective**        | Demonstrate understanding                         |
| **Expected Outcome**          | Answer 4 questions                                |
| **Estimated Time**            | 5 minutes                                         |
| **Cognitive Load**            | Medium — requires recall                          |
| **Motivation**                | Moderate — scoring creates momentum               |
| **Retention Value**           | Medium — testing improves retention               |
| **Could this be simplified?** | Yes — short-answer and reflection need evaluation |

**Recommendation:** Add AI evaluation for open-ended questions. Connect to skill demonstration.

---

### 13. Project (`/courses/foundations/project`)

| Dimension                     | Assessment                                               |
| ----------------------------- | -------------------------------------------------------- |
| **Purpose**                   | Apply all concepts in real project                       |
| **Learning Objective**        | Build working AI assistant                               |
| **Expected Outcome**          | Submit code for review                                   |
| **Estimated Time**            | 60 minutes                                               |
| **Cognitive Load**            | High — requires synthesis                                |
| **Motivation**                | Moderate — code editor is basic, review is keyword-based |
| **Retention Value**           | Very High — building is the best learning                |
| **Could this be simplified?** | No — project is appropriately scoped                     |

**Recommendation:** CRITICAL: Make project executable. Review must test functionality, not keywords.

---

### 14. Badge Award

| Dimension                     | Assessment                                   |
| ----------------------------- | -------------------------------------------- |
| **Purpose**                   | Recognize achievement                        |
| **Learning Objective**        | None (motivation)                            |
| **Expected Outcome**          | Feel accomplished                            |
| **Estimated Time**            | 10 seconds                                   |
| **Cognitive Load**            | None                                         |
| **Motivation**                | High — badge creates sense of completion     |
| **Retention Value**           | Low — badge is symbol, not learning          |
| **Could this be simplified?** | Yes — badge could include portfolio evidence |

**Recommendation:** Connect badge to portfolio. Show what was built, not just that it was completed.

---

## Summary

| Screen             | Learning Value | Could Simplify | Priority Fix              |
| ------------------ | -------------- | -------------- | ------------------------- |
| Landing            | None           | Yes            | Remove false claims       |
| Assessment Intro   | None           | Yes            | Merge with quiz           |
| Assessment Quiz    | Low            | Yes            | Remove preferences        |
| Assessment Results | None           | Yes            | Personalize roadmap       |
| Dashboard          | Low            | Yes            | Remove duplicates         |
| Lesson Reading     | High           | Yes            | Add interactivity         |
| Lesson Examples    | Medium         | Yes            | Make runnable             |
| Lesson Exercises   | High           | No             | Fix broken AI chat        |
| Lesson Reflect     | Medium         | No             | Add AI feedback           |
| Lesson Notes       | Low            | Yes            | Keep minimal              |
| Lab                | High           | No             | Connect to real AI        |
| Knowledge Check    | Medium         | Yes            | Add open-ended evaluation |
| Project            | Very High      | No             | Make executable           |
| Badge              | Low            | Yes            | Connect to portfolio      |

**Critical Fixes Required:**

1. Fix broken AI chat promise in exercises
2. Connect lab to real AI
3. Make project executable
4. Add open-ended question evaluation
