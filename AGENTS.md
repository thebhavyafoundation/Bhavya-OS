# Runtime Architecture — Sprint 1 + Sprint 2 Progress

## Architecture

**Lesson Studio never calls builders directly.** It requests capabilities from the runtime; the runtime resolves which builder, skills, registries, and quality gates to use.

## What Was Built

### Runtime Engine (`packages/runtime/engine/`)
- **capability-engine.mjs** — Resolves capabilities from registry, runs 9-step pipeline, dynamic builder loading, quality gates (10 gates, 30+ checks), observability metrics
- **knowledge-pipeline.mjs** — Orchestrates KO → lesson → assessment → guide → workbook → visual-spec → video → website in sequence
- **course-manager.mjs** — File-based CRUD at `bhavya-ai-lab/data/courses/`
- **lesson-manager.mjs** — File-based CRUD at `bhavya-ai-lab/data/lessons/`

### Builders (`packages/runtime/builders/`)
- `lesson.mjs` — KO → 6-section lesson with 5 learning outcomes, vocabulary
- `assessment.mjs` — lesson → 15 questions (MCQ with real KO definitions/misconceptions, short-answer, reflection, practical)
- `teacher-guide.mjs` — lesson → objectives, dynamic subject-specific materials, content-aware discussion prompts, timing guide, answer keys
- `workbook.mjs` — lesson → 8 pages with key terms (with definitions), section exercises, content-specific reflection
- `website.mjs` — all artifacts → 4 HTML pages with CSS, navigation, and structured content
- `visual-spec.mjs` — lesson → scene graph with subject-aware palette, 8 scenes, timing, animation hints
- `video.mjs` — visual spec → Remotion scene graph with 8 compositions, 196s at 1920x1080
- `quiz.mjs` — alias re-exporting assessment.mjs

### Runtime API (`packages/runtime/cli/`)
- `api.mjs` — HTTP server on port 3100 with capability, pipeline, course, lesson, knowledge (now with full CRUD), metrics, registry, quality gates endpoints
- `api-standalone.mjs` — Entry point with startup banner

### Lesson Studio (`apps/lesson-studio/`)
- `src/lib/runtime-client.ts` — Capability-based client with KO CRUD helpers
- `src/app/knowledge/page.tsx` — Knowledge Browser (list, create, view, delete KOs)
- `src/app/knowledge/[id]/edit/page.tsx` — KO Editor (all sections: concepts, definitions, examples, misconceptions, exercises)
- `src/components/sidebar.tsx` — Updated with Knowledge navigation link
- `src/app/lessons/new/page.tsx` — Fetches KOs from runtime, search, dynamic selection
- `src/app/lessons/[id]/page.tsx` — 6 tabs (Content, Assessment, Guide, Workbook, Preview, Publish) with visual spec and video builders enabled

### Knowledge Objects (`bhavya-ai-lab/knowledge/objects/`)
- `ko-ai-what-is-ai.json` — Canonical KO (AI intro, Grade 9, 5 concepts)

### Pipeline Output Quality (verified)
| Stage | Output | Quality |
|-------|--------|---------|
| lesson | 6 sections, 5 outcomes, 5 vocab | Real content from KO |
| assessment | 15 questions, 8 MCQ | Real KO definitions as options, misconceptions as distractors |
| teacherGuide | 5 materials (STEM-specific), 6 prompts | Dynamic materials, content-aware prompts |
| workbook | 8 pages with definitions | Key terms include definitions, section-specific exercises |
| visualSpec | 8 scenes, 6-color palette | Subject-aware (science=green, tech=blue, etc.) |
| video | 8 compositions, 196s | Remotion scene graph with transitions |
| website | 4 pages with HTML+CSS | Actual `<!DOCTYPE html>` output with nav |

**Full pipeline: 173ms**

## How to Run

- Terminal 1: `pnpm run bhavya:api` — Runtime API (port 3100)
- Terminal 2: `pnpm studio` — Next.js Lesson Studio (port 3020)

## Commands

```bash
# Start runtime
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "packages/runtime/cli/api-standalone.mjs" -WorkingDirectory "F:\Bhavya Foundation"

# Test health
Invoke-RestMethod http://localhost:3100/health

# List KOs
Invoke-RestMethod http://localhost:3100/knowledge

# Generate full pipeline
Invoke-RestMethod -Method POST http://localhost:3100/pipeline -Body '{"knowledgeObject":{"id":"test","title":"Test","concepts":[{"name":"AI"}]}}' -ContentType "application/json"

# Create a KO
Invoke-RestMethod -Method POST http://localhost:3100/knowledge -Body '{"title":"New KO","domain":"AI","concepts":[{"name":"ML","description":"Machine Learning","difficulty":"beginner"}]}' -ContentType "application/json"
```
