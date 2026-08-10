# M12: Learning State

**Status:** ✅ Complete
**Date:** 2026-08-08

---

## Summary

Learning state is fully tracked and persisted in SQLite. All progress data survives session restarts and server restarts.

## State Tracked

| Field                 | Type     | Persisted | Notes                      |
| --------------------- | -------- | --------- | -------------------------- |
| enrolledCourses       | string[] | ✅        | Course enrollment          |
| currentCourse         | string   | ✅        | Active course              |
| currentLessonIndex    | number   | ✅        | Position in course         |
| lessonsCompleted      | string[] | ✅        | Completed lesson IDs       |
| labTasksCompleted     | string[] | ✅        | Completed lab task IDs     |
| assessmentScore       | number   | ✅        | Assessment results         |
| assessmentCompleted   | boolean  | ✅        | Completion flag            |
| knowledgeCheckAnswers | Record   | ✅        | Quiz answers               |
| knowledgeCheckScore   | number   | ✅        | Quiz score                 |
| projectSubmitted      | boolean  | ✅        | Submission flag            |
| projectScore          | number   | ✅        | Project results            |
| badgeEarned           | boolean  | ✅        | Achievement flag           |
| reflectionEntries     | array    | ✅        | Journal entries with dates |
| streak                | number   | ✅        | Consecutive days           |
| lastActiveDate        | string   | ✅        | For streak calculation     |
| onboardingComplete    | boolean  | ✅        | Onboarding flag            |

## Persistence Architecture

- **Storage:** SQLite via `better-sqlite3`
- **Repository pattern:** `sqlite-student-repository.ts`
- **Init:** `initDatabase()` called on first access
- **Migrations:** Schema managed via `migrations.ts`

## Streak Calculation

- Same day: no change
- Consecutive day: +1
- Gap > 1 day: reset to 1

## Recommendation

Learning state is production-ready. No changes needed for beta.
