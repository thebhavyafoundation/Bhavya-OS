# TASK → SKILL ROUTER

**Date:** 2026-08-10
**Status:** ACTIVE
**Owner:** Bhavya Foundation Architecture
**Last updated:** 2026-08-10

---

## Routing Process

```text
TASK
  ↓
CONTEXT PREFLIGHT (read governance docs)
  ↓
ICM CLASSIFICATION (determine stage/form)
  ↓
SKILL DISCOVERY (search registry for matching skills)
  ↓
SKILL MATCHING (filter by triggers, capabilities)
  ↓
SKILL RANKING (primary → supporting → validation)
  ↓
SKILL COMPOSITION (assemble skill plan)
  ↓
EXECUTION (load and apply skills)
  ↓
VALIDATION (verify output)
  ↓
DOCUMENTATION UPDATE
  ↓
COMMIT
```

---

## Discovery Function

```
discoverSkills(task) → matching_skills[]
```

Matches task description against:

- Skill triggers (keyword match)
- Skill capabilities (semantic match)
- Skill dependencies (prerequisite check)

## Matching Function

```
matchSkills(task, candidates) → scored_skills[]
```

Scores each candidate by:

- Trigger match strength (exact > partial)
- Capability relevance
- Dependency availability
- Category fit

## Ranking Function

```
rankSkills(scored) → { primary[], supporting[], validation[] }
```

Classifies into:

- **Primary:** Directly fulfills the task
- **Supporting:** Enhances the output quality
- **Validation:** Verifies the output works

## Composition Function

```
composeSkillPlan(primary, supporting, validation) → skill_plan
```

Produces ordered execution plan with:

- Skill load order (respecting dependencies)
- Input/output handoffs
- Validation checkpoints

---

## Routing Table

### Public Website Tasks

| Task                    | Primary                   | Supporting                                          | Validation                            |
| ----------------------- | ------------------------- | --------------------------------------------------- | ------------------------------------- |
| Build homepage          | ui-ux-pro-max, ui-styling | brand, design-system, gsap-core, gsap-scrolltrigger | browser-automation, seo-audit         |
| Build about page        | ui-ux-pro-max, ui-styling | brand, design-system                                | browser-automation                    |
| Build mission page      | ui-ux-pro-max, ui-styling | brand, design-system                                | browser-automation                    |
| Build transparency page | ui-styling                | design-system                                       | browser-automation                    |
| Add animation           | gsap-core, gsap-react     | gsap-scrolltrigger, gsap-timeline, gsap-performance | browser-automation                    |
| Create banner           | banner-design             | ui-ux-pro-max, brand                                | browser-automation                    |
| Style review            | ui-ux-pro-max             | design-system                                       | browser-automation, verification-loop |

### Academy Tasks

| Task                 | Primary       | Supporting                   | Validation         |
| -------------------- | ------------- | ---------------------------- | ------------------ |
| Build course page    | ui-styling    | ui-ux-pro-max, design-system | browser-automation |
| Build lesson player  | ui-styling    | ui-ux-pro-max, design-system | browser-automation |
| Create assessment UI | ui-styling    | design-system                | browser-automation |
| Design learning path | ui-ux-pro-max | brand, design-system         | browser-automation |

### OS/Internal Tasks

| Task                   | Primary    | Supporting                   | Validation         |
| ---------------------- | ---------- | ---------------------------- | ------------------ |
| Build admin dashboard  | ui-styling | ui-ux-pro-max, design-system | browser-automation |
| Build IOC interface    | ui-styling | design-system                | browser-automation |
| Build social dashboard | ui-styling | design-system                | browser-automation |
| Build intelligence UI  | ui-styling | design-system                | browser-automation |

### Design System Tasks

| Task                 | Primary              | Supporting                   | Validation         |
| -------------------- | -------------------- | ---------------------------- | ------------------ |
| Create design tokens | design-system        | brand, ui-ux-pro-max         | token-validation   |
| Create component     | ui-styling           | design-system, ui-ux-pro-max | browser-automation |
| Style guide          | brand, ui-ux-pro-max | design-system                | —                  |
| Logo design          | design               | brand, ui-ux-pro-max         | browser-automation |
| Icon design          | design               | brand                        | browser-automation |

### Architecture Tasks

| Task             | Primary       | Supporting | Validation |
| ---------------- | ------------- | ---------- | ---------- |
| Workspace design | icm-architect | —          | walk-test  |
| Package design   | icm-architect | —          | —          |
| Route planning   | — (manual)    | —          | —          |

---

## Design System Authority

**NON-NEGOTIABLE:** All UI skills are subordinate to Bhavya's canonical design system.

```text
BHAVYA CONSTITUTION
        ↓
BHAVYA PRODUCT ARCHITECTURE
        ↓
BHAVYA DESIGN SYSTEM (platform-ui)
        ↓
CANONICAL TOKENS (tokens.css)
        ↓
UI/UX SKILLS (ui-ux-pro-max, ui-styling, etc.)
        ↓
IMPLEMENTATION
```

Skills provide expertise. They do NOT replace the canonical design system.

**Forbidden:**

- Random colors not from brand palette
- Random typography not from Inter scale
- Competing spacing scales
- Duplicate buttons, cards, navigation
- Generic AI SaaS styling
- Arbitrary gradients
- Arbitrary component libraries
