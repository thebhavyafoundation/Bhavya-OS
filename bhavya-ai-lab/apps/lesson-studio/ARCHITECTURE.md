# Lesson Studio — Mission Application 001

**Status:** IN DEVELOPMENT  
**Version:** 0.1.0  
**Platform:** Bhavya AI Lab OS v3.0.0 (ENGINEERING FROZEN)  
**Last Updated:** 2026-07-30

---

## 1. Architecture

### 1.1 Overview

Lesson Studio is the flagship product of the Bhavya AI Lab Operating System. It transforms Knowledge Objects into complete educational experiences by invoking platform builders through capability resolution. It never calls AI models directly, never bypasses builders, and validates every output through quality gates.

### 1.2 System Context

```
┌─────────────────────────────────────────────────────────────────┐
│                      Lesson Studio                              │
│                                                                 │
│  Course Manager → Lesson Editor → Assessment Builder            │
│                                         ↓                       │
│  Visual Spec Generator → Animation Publisher                    │
│                                         ↓                       │
│  Teacher Guide Builder → Workbook Builder                       │
│                                         ↓                       │
│  Website Publisher                                              │
└─────────────────────────────────────────────────────────────────┘
         │                        │
         ▼                        ▼
  Platform Runtime         Quality Gates
         │                        │
         ▼                        ▼
  Builders + Skills + Registries + Packages
```

### 1.3 Data Flow

```
Knowledge Objects (knowledge/objects/)
         ↓
  ┌─────────────┐
  │  Orchestrator │  (capability: lesson_generation)
  └──────┬──────┘
         ↓
  ┌─────────────┐
  │  Lesson      │  → lesson output (JSON)
  │  Builder     │  → visual spec (JSON)
  └──────┬──────┘  → animation hints (JSON)
         ↓
  ┌─────────────┐
  │  Assessment  │  → quiz (JSON)
  │  Builder     │  → flashcards (JSON)
  └──────┬──────┘  → worksheet (JSON)
         ↓
  ┌─────────────┐
  │  Teacher     │  → teacher guide (MD)
  │  Guide Builder│
  └──────┬──────┘
         ↓
  ┌─────────────┐
  │  Workbook    │  → student workbook (PDF)
  │  Builder     │
  └──────┬──────┘
         ↓
  ┌─────────────┐
  │  Website     │  → static pages
  │  Builder     │  → offline package
  └─────────────┘
```

### 1.4 Application Structure

```
apps/lesson-studio/
├── app/                       # Next.js App Router
│   ├── page.tsx               # Dashboard
│   ├── courses/               # Course management
│   │   ├── page.tsx           # Course list
│   │   ├── new/page.tsx       # Create course
│   │   └── [id]/page.tsx      # Course detail
│   ├── lessons/               # Lesson management
│   │   ├── page.tsx           # Lesson list
│   │   ├── new/page.tsx       # Create lesson
│   │   └── [id]/              # Lesson detail
│   │       ├── page.tsx       # Lesson editor
│   │       ├── assessment/    # Assessment tab
│   │       ├── spec/          # Visual spec tab
│   │       ├── guide/         # Teacher guide tab
│   │       ├── workbook/      # Workbook tab
│   │       └── publish/       # Publish tab
│   ├── api/                   # API routes (platform bridge)
│   │   ├── build/route.ts     # Invoke builder
│   │   ├── courses/route.ts   # Course CRUD
│   │   ├── lessons/route.ts   # Lesson CRUD
│   │   └── publish/route.ts   # Publish to website
│   └── layout.tsx             # Root layout
├── components/                # Reusable UI components
│   ├── sidebar.tsx
│   ├── header.tsx
│   ├── lesson-editor.tsx
│   ├── assessment-editor.tsx
│   ├── course-card.tsx
│   ├── lesson-card.tsx
│   ├── builder-status.tsx
│   ├── quality-gate-results.tsx
│   └── publish-dialog.tsx
├── lib/                       # Platform integration
│   ├── capabilities.ts        # Capability resolution
│   ├── builders.ts            # Builder invocation
│   ├── quality-gates.ts       # Quality gate integration
│   └── types.ts               # Shared types
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 2. User Flows

### 2.1 Create Course Flow

```
User → "New Course" → Enter title, description, subject, grade
         ↓
    Orchestrator runs course validation
         ↓
    Course created in knowledge/objects/ as curriculum structure
         ↓
    Dashboard shows new course with empty lesson list
```

### 2.2 Create Lesson Flow

```
User → Select Course → "New Lesson"
         ↓
    Select Knowledge Object from knowledge/objects/
         ↓
    Orchestrator: capability lesson_generation
         ↓
    Lesson Builder compiles Knowledge Object → Lesson JSON
         ↓
    Quality Gates validate output
         ↓
    Lesson appears in editor with:
      - Learning outcomes
      - Key concepts
      - Visual explanation
      - Examples
      - Exercises
      - Summary
```

### 2.3 Generate Assessment Flow

```
User → Lesson → "Generate Assessment"
         ↓
    Orchestrator: capability quiz_generation
         ↓
    Quiz Builder compiles Knowledge Object → Quiz JSON
         ↓
    User reviews and edits questions
         ↓
    Regenerate option for specific question types
         ↓
    Quality Gates validate question quality
```

### 2.4 Generate Teacher Guide Flow

```
User → Lesson → "Generate Teacher Guide"
         ↓
    Teacher Guide Builder compiles lesson → Teacher Guide MD
         ↓
    Includes: objectives, vocabulary, discussion prompts,
              common misconceptions, answer keys, timing guide
```

### 2.5 Generate Workbook Flow

```
User → Lesson → "Generate Student Workbook"
         ↓
    Workbook Builder compiles lesson → Workbook PDF
         ↓
    Includes: exercises, practice problems, reflection prompts
```

### 2.6 Publish to Website Flow

```
User → Lesson → "Publish"
         ↓
    Website Builder compiles lesson → static pages
         ↓
    Capability: website_generation
         ↓
    Output written to build/website/
         ↓
    Quality Gates validate output
         ↓
    Published URL displayed
```

### 2.7 Full Pipeline Flow (One-Click)

```
User → Course → "Publish Full Course"
         ↓
    For each lesson in course:
      ↓
    1. lesson_generation → Lesson JSON ✓
    2. quiz_generation → Quiz JSON ✓
    3. Teacher Guide Builder → Teacher Guide ✓
    4. Workbook Builder → Workbook ✓
    5. video_generation → Animation ✓
    6. website_generation → Website ✓
         ↓
    Quality Gates validate all outputs
         ↓
    Observability records metrics
         ↓
    Report shows: completed, warnings, errors
```

---

## 3. UI Components

### 3.1 Dashboard

```
┌──────────────────────────────────────────────────────┐
│  Bhavya Lesson Studio                  [User] [⚙️]   │
├──────────────────────────────────────────────────────┤
│                                                       │
│  📊 Overview                                          │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │
│  │ 3    │ │ 12   │ │ 45   │ │ 89%  │                │
│  │Courses│ │Lessons│ │Quizzes│ │Pass   │              │
│  └──────┘ └──────┘ └──────┘ └──────┘                │
│                                                       │
│  📚 Recent Courses                                    │
│  ┌────────────────────────────────────────────┐       │
│  │ AI Foundations      Grade 9   3 Lessons    │       │
│  │ Machine Learning    Grade 10  5 Lessons    │       │
│  │ Neural Networks     Grade 11  4 Lessons    │       │
│  └────────────────────────────────────────────┘       │
│                                                       │
│  🏗️ Build Queue                                       │
│  ┌────────────────────────────────────────────┐       │
│  │ ✅ Lesson: What is AI?               Done  │       │
│  │ 🔄 Quiz: What is AI?                Running│       │
│  │ ⏳ Guide: What is AI?               Queued │       │
│  └────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────┘
```

### 3.2 Lesson Editor

```
┌──────────────────────────────────────────────────────┐
│  ← Courses / AI Foundations / What is AI?            │
├──────────────────────────────────────────────────────┤
│                                                       │
│  📝 Lesson Details                                    │
│  ┌────────────────────────────────────────┐           │
│  │ Title:    [What is AI?              ]  │           │
│  │ Subject:  [Artificial Intelligence  ]  │           │
│  │ Grade:    [9                       ]  │           │
│  │ Duration: [45 minutes              ]  │           │
│  └────────────────────────────────────────┘           │
│                                                       │
│  📋 Learning Outcomes                                 │
│  ┌────────────────────────────────────────┐           │
│  │ □ Define artificial intelligence       │           │
│  │ □ Identify examples of AI in daily life│           │
│  │ □ Explain how AI learns from data      │           │
│  │ □ Discuss ethical considerations of AI │           │
│  └────────────────────────────────────────┘           │
│                                                       │
│  [Regenerate Outcomes] [Add Outcome]                  │
│                                                       │
│  📑 Content Sections                                  │
│  ┌────────────────────────────────────────┐           │
│  │ 📖 Introduction              drag ⋮     │           │
│  │ 🔑 Key Concepts              drag ⋮     │           │
│  │ 👁️ Visual Explanation       drag ⋮     │           │
│  │ 💡 Examples                  drag ⋮     │           │
│  │ 🛠️ Exercises                drag ⋮     │           │
│  │ 📝 Summary                   drag ⋮     │           │
│  └────────────────────────────────────────┘           │
└──────────────────────────────────────────────────────┘
```

### 3.3 Builder Status

```
┌──────────────────────────────────────────────────────┐
│  🏗️ Build Pipeline — What is AI?                      │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Capability: lesson_generation                        │
│  Builder: lesson                                      │
│  Skills: education, writing                           │
│                                                       │
│  Steps                                                │
│  ✅ validate-input           0.2s                     │
│  ✅ compile-lesson           1.1s                     │
│  ✅ generate-sections        0.8s                     │
│  🔄 generate-outputs         0.4s                     │
│  ⏳ validate-output          —                        │
│                                                       │
│  Quality Gates                                        │
│  ✅ Structure                                        │
│  ✅ Schemas                                          │
│  ⚠️ Accessibility          (2 warnings)              │
│  ✅ Naming                                           │
│  ✅ Imports                                          │
└──────────────────────────────────────────────────────┘
```

---

## 4. Builders Used

| Builder       | Capability         | Input            | Outputs                      | Skills                     |
| ------------- | ------------------ | ---------------- | ---------------------------- | -------------------------- |
| lesson        | lesson_generation  | Knowledge Object | lesson JSON                  | education, writing         |
| quiz          | quiz_generation    | Knowledge Object | quiz JSON, flashcards        | education, qa              |
| teacher-guide | (direct)           | lesson           | teacher guide MD             | education, writing         |
| workbook      | (direct)           | lesson           | workbook PDF                 | education, writing         |
| video         | video_generation   | visual spec      | MP4, WebM, GIF               | remotion, animation, react |
| website       | website_generation | lessons          | static site, offline package | deployment, react          |

---

## 5. Capabilities Used

| Capability         | Builder | When Used                                |
| ------------------ | ------- | ---------------------------------------- |
| lesson_generation  | lesson  | Create/edit lesson from Knowledge Object |
| quiz_generation    | quiz    | Generate assessments for a lesson        |
| slides_generation  | slides  | Generate presentation slides             |
| video_generation   | video   | Generate animated video from visual spec |
| website_generation | website | Publish lesson to website                |

---

## 6. Packages Used

| Package              | Version | Usage                               |
| -------------------- | ------- | ----------------------------------- |
| `@bhavya/core`       | 1.0.0   | Types, routing, context loading     |
| `@bhavya/education`  | 1.0.0   | Curriculum patterns, lesson schemas |
| `@bhavya/knowledge`  | 1.0.0   | Knowledge Object access             |
| `@bhavya/assessment` | 1.0.0   | Quiz, rubric, worksheet generation  |
| `@bhavya/website`    | 1.0.0   | Website publishing                  |
| next                 | 15.5.20 | Application framework               |
| react                | 19.x    | UI components                       |
| tailwindcss          | latest  | Styling                             |
| shadcn/ui            | latest  | UI component library                |

---

## 7. Skills Used

| Skill      | Workspace  | Patterns Used                                               |
| ---------- | ---------- | ----------------------------------------------------------- |
| education  | curriculum | Lesson structure, learning objectives, pedagogical patterns |
| writing    | curriculum | Content generation, tone, voice                             |
| qa         | platform   | Question validation, rubric generation                      |
| remotion   | production | Animation timing, scene composition                         |
| deployment | platform   | Static site generation, SEO, offline packaging              |

---

## 8. Quality Gates

### 8.1 Pre-Build Gates (Before Builder Execution)

| Gate         | Checks                                   | Severity |
| ------------ | ---------------------------------------- | -------- |
| Structure    | Knowledge Object has all required fields | Error    |
| Schema       | Knowledge Object matches schema          | Error    |
| Assets       | All referenced assets exist              | Error    |
| Dependencies | Required skills available in registry    | Error    |

### 8.2 Post-Build Gates (After Builder Execution)

| Gate          | Checks                                  | Severity |
| ------------- | --------------------------------------- | -------- |
| Structure     | All required lesson sections present    | Error    |
| Schema        | Lesson JSON matches schema              | Error    |
| Accessibility | Color contrast, alt text, semantic HTML | Warning  |
| Naming        | File and component naming conventions   | Warning  |
| Performance   | Bundle size, image optimization         | Warning  |
| Responsive    | Mobile layout, breakpoints              | Warning  |

### 8.3 Pre-Publish Gates (Before Website Publishing)

| Gate          | Checks                        | Severity |
| ------------- | ----------------------------- | -------- |
| Structure     | All pages render correctly    | Error    |
| Assets        | All assets resolve            | Error    |
| Accessibility | WCAG AA compliance            | Warning  |
| SEO           | Meta tags, headings, alt text | Warning  |
| Offline       | Offline package complete      | Warning  |

---

## 9. Test Plan

### 9.1 Unit Tests

| Test Suite            | Tests                              | Coverage Target |
| --------------------- | ---------------------------------- | --------------- |
| Capability resolution | cap -> builder, skills, registries | 100%            |
| Lesson compilation    | KO -> Lesson                       | 100%            |
| Assessment generation | KO -> Quiz                         | 100%            |
| Guide generation      | Lesson -> Guide                    | 100%            |
| Workbook generation   | Lesson -> Workbook                 | 100%            |
| Quality gates         | Each gate validates correctly      | 100%            |

### 9.2 Integration Tests

| Test                  | Description                                     |
| --------------------- | ----------------------------------------------- |
| Full lesson pipeline  | KO → Lesson → Quiz → Guide → Workbook → Publish |
| Error handling        | Missing KO, invalid schema, missing skills      |
| Quality gate failures | Each gate type with failing input               |
| Builder timeout       | Builder exceeding max duration                  |

### 9.3 E2E Tests

| Test                | Description                        |
| ------------------- | ---------------------------------- |
| Create course       | Full course creation flow          |
| Create lesson       | Full lesson creation from KO       |
| Generate assessment | Assessment generation with editing |
| Publish lesson      | Lesson publish to website          |
| Full course publish | Multi-lesson course publish        |

---

## 10. Release Plan

### 10.1 Version Strategy

| Version | Milestone                    | Timeline |
| ------- | ---------------------------- | -------- |
| 0.1.0   | Scaffold + Dashboard         | Now      |
| 0.2.0   | Course + Lesson CRUD         | Next     |
| 0.3.0   | Lesson Builder Integration   | Next     |
| 0.4.0   | Assessment Generation        | Next     |
| 0.5.0   | Teacher Guide + Workbook     | Next     |
| 0.6.0   | Visual Spec + Video Pipeline | Next     |
| 0.7.0   | Website Publishing           | Next     |
| 1.0.0   | Production Release           | Final    |

### 10.2 Release Checklist

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Quality gates validate correctly
- [ ] Builders produce correct output
- [ ] No platform changes required
- [ ] Documentation updated
- [ ] Release notes generated

### 10.3 Rollback Plan

- Version revert in git
- All build artifacts versioned
- Previous website deployment preserved

---

## 11. Documentation

### 11.1 User Documentation

- `apps/lesson-studio/README.md` — Getting started
- Quick start guide: Create your first lesson
- Course management guide
- Assessment generation guide
- Publishing guide

### 11.2 Developer Documentation

- `apps/lesson-studio/ARCHITECTURE.md` — This document
- Builder integration guide
- Adding new question types
- Customizing visual specs

---

## 12. Roadmap

### 12.1 Current (0.1.0)

- [x] Architecture document
- [ ] Next.js scaffold
- [ ] Dashboard page
- [ ] Course list + create
- [ ] Lesson list + create

### 12.2 Next (0.2.0 - 0.3.0)

- [ ] Lesson editor with builder integration
- [ ] Learning outcomes management
- [ ] Content section editor
- [ ] Drag-and-drop sections

### 12.3 Future (0.4.0 - 1.0.0)

- [ ] Assessment generation
- [ ] Teacher guide generation
- [ ] Workbook generation
- [ ] Visual spec + video pipeline
- [ ] Website publishing
- [ ] Full course publish (one-click)
- [ ] Production release

---

_This document describes Lesson Studio v0.1.0. The platform is ENGINEERING FROZEN. Any gaps exposed by application development should be filed as ADRs, not as platform changes._
