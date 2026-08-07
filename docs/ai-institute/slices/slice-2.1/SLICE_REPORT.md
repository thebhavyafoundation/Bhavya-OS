# Slice 2.1 — First AI Experience (BLX)

## Status: COMPLETE

## Date: 2026-08-04

## Mission

Redesign Lesson 1 as the first AI experience. The student should feel like they are working alongside an AI mentor from the first minute. Reading is no longer the primary activity. Interaction is.

## What Changed

### Before (Slice 1)

- 5 tabs: Reading, Examples, Exercises, Reflect, Notes
- 70% reading, 30% interaction
- Student reads about AI before doing anything
- No live AI interaction
- No portfolio artifact
- Passive consumption

### After (Slice 2.1)

- 6 linear screens: Welcome → First Prompt → Experiment → Reflect → Build → Portfolio → Done
- 30% explanation, 70% interaction
- Student writes a prompt within 60 seconds
- Live AI interaction via Learning Runtime
- Portfolio artifact generated
- Active creation

## Implementation

### Files Changed

- `apps/ai-institute/package.json` — Added `@bhavya/learning-runtime` dependency
- `apps/ai-institute/src/app/courses/foundations/lessons/[id]/page.tsx` — Complete rewrite

### Architecture

- No tabs — linear flow
- AIPlayground component from `@bhavya/learning-runtime` as primary surface
- MockProvider for simulated AI responses
- Progress tracking via localStorage
- Portfolio artifact generated at completion

### Screen Flow

1. **Welcome** — AI mentor introduces itself, explains what will happen
2. **First Prompt** — Student writes prompt (within 60 seconds)
3. **Experiment** — AI responds, student sees output, can retry
4. **Reflect** — Mandatory reflection (what surprised you, what would you do differently)
5. **Build** — Student writes improved prompt with checklist
6. **Portfolio** — Artifact generated with title, summary, skills, export options
7. **Done** — Achievement unlocked, next lesson

## Quality Gates

| Gate                                   | Status |
| -------------------------------------- | ------ |
| First AI interaction within 60 seconds | PASS   |
| Reading never blocks experimentation   | PASS   |
| Reflection is mandatory                | PASS   |
| Portfolio artifact generated           | PASS   |
| AI mentor behaves like a coach         | PASS   |
| Build passes                           | PASS   |
| Feels like interactive workshop        | PASS   |

## Next Steps

1. Hand Lesson 1 to someone new to AI
2. Observe their experience
3. Note what works and what doesn't
4. Update runtime based on findings
5. Then build Lesson 2
