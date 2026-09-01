# Course Content Source Decision

**Date:** 2026-08-29
**Status:** DECIDED — CONFIRMS Wave J3 `LESSON_COURSE_SOURCE_DECISION.md`
**Wave:** Q
**Author:** Bhavya Foundation Engineering System

---

## 1. Question

Where does canonical Course/Lesson content live, and how does static curriculum relate to Studio SQLite?

## 2. Evidence (Wave Q Inspection)

### 2.1 Static Curriculum — the current real content

| File | Records | Status |
|------|---------|--------|
| `src/data/academy-courses.ts` | 10 courses (`ai-foundations`, `python-for-ai`, `deep-learning`, `llm-mastery`, `ai-safety`, `mathematics-for-ai`, `machine-learning`, `transformers`, `llm-engineering`, `ai-agents`) | `status: "published"` — all visible on `/courses` |
| `src/data/academy-lessons.ts` | `lessonContents` keyed by `found-*`, `py-*`, `dl-*`, `llm-*`, `eth-*`, `math-*`, `ml-*`, `trans-*`, `llme-*`, `agent-*` | Real reading + keyConcepts + examples + exercises + reflection (87 entries) |

Every course has: `id`, `title`, `description`, `domain`, `subject`, `grade`, `level`, `status`, `modules: CourseModule[]`, `prerequisites`, `estimatedDuration`, `tags`, `metadata`.

Every `CourseModule` has: `id`, `title`, `description`, `order`, `lessons: CourseModuleLesson[]`.

Lesson pages at `/courses/[id]/lessons/[lessonId]` resolve exclusively via `getLessonById()` → static `courses` array. No SQLite read on that path.

### 2.2 SQLite — the intended operational canonical

| Table | Schema | Current Rows | Writers |
|-------|--------|--------------|---------|
| `studio_courses` | `id, title, description, subject, grade, lessons(JSON), status, created_at, updated_at` | **0 published rows** (verified via `loadPublishedCourses()` fallback) | `POST /api/studio/courses`, `PUT /api/studio/courses/[id]` |
| `studio_lessons` | `id, course_id(FK), title, subject, grade, duration, status, learning_outcomes(JSON), sections(JSON), assessment, teacher_guide, workbook, published_at, ...` | **0 published rows** | `POST /api/studio/lessons`, publish routes |

Public projection already enforces `status = 'published'`:

```ts
// academy-courses.ts — loadPublishedCourses()
SELECT * FROM studio_courses WHERE status = 'published'
// if rows.length === 0 → return static courses (fallback)
```

```ts
// academy-lessons.ts — getPublishedLessonContent()
dbListLessons({ status: "published" }) → studioToLessonContent()
// falls back to static lessonContents[lessonId]
```

### 2.3 Prior Decision

`LESSON_COURSE_SOURCE_DECISION.md` (Wave J3, 2026-08-28) declared **Studio SQLite canonical**, static TypeScript as fallback, runtime JSON orphaned and deleted. That decision remains correct for *mutation*.

### 2.4 Canonical Data Model doc

`CANONICAL_DATA_MODEL.md` (2026-08-10) lists Academy `Course`/`Lesson` as SQLite-backed — aspirational at the time. The static fallback is the honest current state.

## 3. Decision — Model C (Hybrid) Is the Actual Architecture

**Model C — Hybrid — is what the code implements. We ratify it, not invent it.**

```
                     ┌─────────────────────────┐
                     │  Studio SQLite          │
                     │  studio_courses         │
                     │  studio_lessons         │
                     │  status = 'published'   │
                     └────────────┬────────────┘
                                  │  takes precedence when rows exist
                                  ▼
 Public pages ──► loadPublishedCourses() / getPublishedLessonContent()
                                  │
                     ┌────────────┴────────────┐
                     │  Static TypeScript      │
                     │  academy-courses.ts     │  ← current sole real content
                     │  academy-lessons.ts     │  ← current sole real content
                     └─────────────────────────┘
                                  │  fallback when SQLite has 0 published rows
```

**Canonical source for *mutation*:** Studio SQLite (`dbCreateCourse`, `dbCreateLesson`, publish routes).
**Canonical source for *current public content*:** Static TypeScript (the 5 published courses and their lessons).
**Authoritative public projection rule:** `status = 'published'` enforced in both SQLite and static paths.

This is not a new model — it is the model the code already implements.

## 4. Fallback Behavior (Verified)

| Condition | Result |
|-----------|--------|
| SQLite has ≥1 published course | Public `/courses` shows SQLite courses (mapped to `Course` type with empty `modules`) |
| SQLite has 0 published courses | Public `/courses` shows 5 static courses with full modules/lessons |
| SQLite unavailable (import throws) | Same fallback — static courses |
| `loadPublishedCourseById(id)` — found in SQLite published | Returns SQLite row mapped to `Course` |
| `loadPublishedCourseById(id)` — not in SQLite | Returns `getCourseById(id)` from static array |
| `getPublishedLessonContent(lessonId)` — found in SQLite published | Returns `studioToLessonContent()` |
| `getPublishedLessonContent(lessonId)` — not in SQLite | Returns `lessonContents[lessonId]` (static) |

## 5. Publication Semantics

| Concern | Rule |
|---------|------|
| `status` values | `draft \| ready \| published` — only `published` is public |
| Static courses | Hardcoded `status: "published"` — visible by definition |
| SQLite courses | Default `status: 'draft'` on `dbCreateCourse`; must be explicitly updated to `published` via `dbUpdateCourse` or publish route |
| SQLite lessons | Default `status: 'draft'`; `published_at` set on publish |
| Public leakage | `loadPublishedCourses()` and `loadPublishedCourseById()` filter `status = 'published'`; draft SQLite rows never reach public pages |

## 6. Lesson Relationship

```
Course (academy-courses.ts)
  └─ modules: CourseModule[]
       └─ lessons: CourseModuleLesson[]  { id, title, order, duration }
            └─ content: LessonContent (academy-lessons.ts)  { reading, keyConcepts, examples, exercises, reflection }
                 ↕  also available via SQLite studio_lessons.sections / learning_outcomes / workbook when published
```

Static lessons are keyed by `CourseModuleLesson.id` (e.g., `found-1-1`). SQLite lessons are keyed by `studio_lessons.id` (arbitrary, linked via `course_id`). The two namespaces are independent; `getLessonById()` only checks static.

## 7. What Must NOT Be Duplicated

- No second `Course` type — the single `Course` interface in `academy-courses.ts` is canonical for public pages.
- No `program_courses.json`, `learning-path-courses.json`, or `course-cache.json`.
- No fake SQLite rows to inflate `/courses` — empty SQLite is honest while Studio has no published content.
- No duplicate `LessonContent` — static `lessonContents` and SQLite `studio_lessons` are alternative sources, not parallel stores for the same lesson.
- Learning paths reference courses via `courseId: string` only — never by copying course/module/lesson objects.

## 8. Migration Implications

- Moving a static course to SQLite requires: `dbCreateCourse` + `dbCreateLesson` per lesson + `dbUpdateCourse` to set `lessons` JSON + `dbUpdateCourse`/`dbUpdateLesson` to set `status = 'published'`. Until that migration happens, static remains authoritative.
- Wave Q adds 4 new static courses to complete the flagship path — no SQLite migration in this wave. SQLite remains empty and honest.
- Phase 3/4 of the J3 plan (wire runtime to SQLite, migrate static to SQLite) remain future work.

## 9. Authority

This document **confirms and extends** `LESSON_COURSE_SOURCE_DECISION.md` (Wave J3). It does not supersede it. J3 decided mutation canonical (SQLite); this document records the verified hybrid reality for public content (SQLite-first, static fallback) and the publication semantics that enforce it.
