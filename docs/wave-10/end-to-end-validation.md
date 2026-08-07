# Wave 10 Mission 9 — End-to-End Validation Report

**Bhavya AI Institute**

---

## Summary

| Metric              | Value               |
| ------------------- | ------------------- |
| Personas Tested     | 4                   |
| Total Steps         | 28                  |
| Steps Passed        | 0                   |
| Steps Failed        | 0                   |
| Steps Partial       | 0                   |
| Steps Not Tested    | 28                  |
| Estimated Pass Rate | 0% (pre-validation) |

This report defines validation routes for four user personas covering the full learner lifecycle from first visit to advanced research. All steps are defined and ready for execution.

---

## Persona 1: Beginner

**Description:** New learner with no AI background

**Goal:** "I want to learn AI from scratch"

**Steps:** 8

| Step | Action               | Page                                  | Expected Outcome                                                                | Status     |
| ---- | -------------------- | ------------------------------------- | ------------------------------------------------------------------------------- | ---------- |
| b1   | Visit homepage       | `/`                                   | Landing page loads with clear value proposition and school listings             | not-tested |
| b2   | Browse schools       | `/schools`                            | School catalog displays available learning schools with descriptions            | not-tested |
| b3   | Start AI Foundations | `/schools/ai-foundations`             | AI Foundations school page opens with curriculum overview and enrollment option | not-tested |
| b4   | Complete Lesson 1    | `/learn/ai-foundations/lesson-1`      | Lesson content loads, progress saves, and lesson marks complete                 | not-tested |
| b5   | Take Quiz            | `/learn/ai-foundations/lesson-1/quiz` | Quiz renders with questions, accepts answers, and scores result                 | not-tested |
| b6   | Open Lab             | `/labs/ai-foundations-intro`          | Lab environment initializes with workspace and instructions                     | not-tested |
| b7   | View Progress        | `/dashboard`                          | Dashboard shows completed lesson, quiz score, and lab status                    | not-tested |
| b8   | Verify persistence   | `/dashboard`                          | Progress remains after page refresh and session restore                         | not-tested |

**Walkthrough:** The beginner persona validates the complete onboarding and first-lesson experience. This is the highest-priority persona because it determines whether a new user converts to an active learner. Steps b1-b3 test discovery and enrollment, b4-b6 test the core learning loop, and b7-b8 verify data persistence.

**Completion Rate:** 0%

---

## Persona 2: Intermediate

**Description:** Developer with basic ML knowledge

**Goal:** "I want to improve my ML skills"

**Steps:** 7

| Step | Action                       | Page                             | Expected Outcome                                                           | Status     |
| ---- | ---------------------------- | -------------------------------- | -------------------------------------------------------------------------- | ---------- |
| i1   | Login                        | `/auth/login`                    | Authentication flow completes and redirects to dashboard                   | not-tested |
| i2   | View Dashboard               | `/dashboard`                     | Dashboard displays enrolled courses, progress metrics, and recommendations | not-tested |
| i3   | Continue ML Course           | `/learn/ml-engineering`          | ML course page opens at last completed lesson with resume prompt           | not-tested |
| i4   | Complete Module              | `/learn/ml-engineering/module-3` | Module content plays, exercises submit, and module marks complete          | not-tested |
| i5   | Review Knowledge Graph       | `/knowledge-graph`               | Knowledge graph visualizes concepts, connections, and mastery levels       | not-tested |
| i6   | Access Research Library      | `/research`                      | Research library loads with searchable papers and resource listings        | not-tested |
| i7   | Verify cross-module progress | `/dashboard`                     | Progress syncs across dashboard, knowledge graph, and research library     | not-tested |

**Walkthrough:** The intermediate persona validates returning-user flows including authentication, course resumption, and cross-feature navigation. Steps i1-i2 test session management, i3-i4 test the core learning loop, and i5-i7 verify that the knowledge graph and research library integrate with progress tracking.

**Completion Rate:** 0%

---

## Persona 3: Advanced

**Description:** ML practitioner targeting transformer architectures

**Goal:** "I want to master transformers and LLMs"

**Steps:** 7

| Step | Action                     | Page                                                | Expected Outcome                                                        | Status     |
| ---- | -------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------- | ---------- |
| a1   | Navigate to Learning Paths | `/learning-paths`                                   | Learning paths page shows progressive stages with prerequisites         | not-tested |
| a2   | Start Transformers Stage   | `/learning-paths/transformers`                      | Transformers path opens with stage breakdown and time estimates         | not-tested |
| a3   | Complete Lesson            | `/learning-paths/transformers/attention-mechanisms` | Advanced lesson content renders with code examples and references       | not-tested |
| a4   | Run Notebook               | `/labs/transformers-notebook`                       | Jupyter notebook executes cells and displays outputs in-browser         | not-tested |
| a5   | Build Project              | `/projects/build-transformer`                       | Project workspace provides templates, instructions, and submission flow | not-tested |
| a6   | View Portfolio             | `/portfolio`                                        | Portfolio aggregates projects, certificates, and skill endorsements     | not-tested |
| a7   | Verify portfolio update    | `/portfolio`                                        | Newly completed project appears in portfolio with metadata              | not-tested |

**Walkthrough:** The advanced persona validates the progressive learning path and project-based assessment flow. Steps a1-a2 test learning path navigation, a3-a4 test the technical notebook environment, a5 tests the project builder, and a6-a7 verify portfolio aggregation of completed work.

**Completion Rate:** 0%

---

## Persona 4: Researcher

**Description:** Academic or industry researcher seeking papers and resources

**Goal:** "I want to find research papers and resources"

**Steps:** 6

| Step | Action                 | Page                                                  | Expected Outcome                                                         | Status     |
| ---- | ---------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------ | ---------- |
| r1   | Visit Research Library | `/research`                                           | Research library landing page loads with search bar and category filters | not-tested |
| r2   | Search papers          | `/research/search`                                    | Search returns relevant papers with titles, abstracts, and metadata      | not-tested |
| r3   | Filter by topic        | `/research/search`                                    | Topic filters narrow results and update count in real time               | not-tested |
| r4   | Save paper             | `/research/paper/attention-is-all-you-need`           | Paper saves to user library and confirmation toast appears               | not-tested |
| r5   | View citations         | `/research/paper/attention-is-all-you-need/citations` | Citation panel shows paper references, DOI, and export options           | not-tested |
| r6   | Access Knowledge Graph | `/knowledge-graph`                                    | Knowledge graph displays paper connections and related research nodes    | not-tested |

**Walkthrough:** The researcher persona validates the research discovery and curation workflow. Steps r1-r3 test search and filtering, r4-r5 test the paper detail and citation flow, and r6 verifies that saved research connects back to the knowledge graph.

**Completion Rate:** 0%

---

## Issues Found

_No issues recorded yet. All steps are defined but not yet tested._

| ID  | Persona | Step | Issue                   | Severity |
| --- | ------- | ---- | ----------------------- | -------- |
| —   | —       | —    | Awaiting test execution | —        |

---

## Recommendations

1. **Execute Beginner persona first.** It covers the critical onboarding path and will surface blockers that affect all other personas.

2. **Automate step verification.** Write Playwright or Cypress tests for each step to enable repeatable validation runs.

3. **Add timing benchmarks.** Record page load times per step to establish performance baselines.

4. **Test error states.** Extend validation with failure scenarios (invalid login, network interruption, empty search results).

5. **Cross-browser validation.** Run all personas in Chrome, Firefox, and Safari to catch rendering or compatibility issues.

6. **Accessibility audit.** Add ARIA and keyboard-navigation checks to each step as a parallel validation track.

7. **Schedule weekly runs.** Run the full 28-step suite on every deployment to catch regressions early.

---

**Generated:** Wave 10, Mission 9 — Bhavya AI Institute
