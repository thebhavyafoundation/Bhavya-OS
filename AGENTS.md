# Bhavya OS — Engineering Constitution

## Engineering Principles (Permanent)

1. **Research before implementation.** Every change traces back to evidence.
2. **Reuse before creation.** Check `@bhavya/platform-ui` first.
3. **Simplify before expanding.** Remove complexity before adding features.
4. **Teach before automating.** Educational value is a core requirement.
5. **Measure before optimizing.** Data guides decisions, not intuition.
6. **Human approval before platform evolution.** No platform change without review.
7. **Cite the Constitution.** Every AI action that references governance, policy, ethics, compliance, or institutional authority must cite the relevant constitutional document.

---

## Constitution — Single Source of Truth

**Package:** `@bhavya/constitution` (`packages/constitution/`)

All 15 Constitutional Documents are the ONLY source of truth for governance, policy, ethics, compliance, and institutional authority. No duplicate copies. Every AI action must retrieve from this layer and cite sources.

### APIs

```javascript
import { initialize, search, cite, getConstitutionalDocument } from '@bhavya/constitution';

await initialize();

// Search across all documents
const results = await search('conflict of interest');

// Generate a citation
const citation = await cite('constitution', { format: 'text' });

// Get a specific document
const doc = await getConstitutionalDocument('trust-deed');
```

### Citation Requirement

Every AI response that references constitutional authority MUST include:
1. Document number (e.g., "01")
2. Document title
3. Relevant article or section
4. Effective date

**Example:** "The Founder's authority is perpetual per The Constitution (01), Article 7.2 (effective 2026-01-01)."

---

## Bhavya Evolution Engine (BEE 2.0)

Every application evolves through this lifecycle:

```
Research → Knowledge Package → Recommendation → Human Review → Platform Update → Application Update → Telemetry → Research
```

No application evolves independently. All changes are research-backed.

**Full protocol:** `docs/design-system/BEE-2.0.md`

---

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

| Stage        | Output                                 | Quality                                                       |
| ------------ | -------------------------------------- | ------------------------------------------------------------- |
| lesson       | 6 sections, 5 outcomes, 5 vocab        | Real content from KO                                          |
| assessment   | 15 questions, 8 MCQ                    | Real KO definitions as options, misconceptions as distractors |
| teacherGuide | 5 materials (STEM-specific), 6 prompts | Dynamic materials, content-aware prompts                      |
| workbook     | 8 pages with definitions               | Key terms include definitions, section-specific exercises     |
| visualSpec   | 8 scenes, 6-color palette              | Subject-aware (science=green, tech=blue, etc.)                |
| video        | 8 compositions, 196s                   | Remotion scene graph with transitions                         |
| website      | 4 pages with HTML+CSS                  | Actual `<!DOCTYPE html>` output with nav                      |

**Full pipeline: 173ms**

---

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

---

## GitHub OS — Maintenance Mode

**Status:** Feature freeze. Only the following are admitted:

- Bug fixes (severity: medium or higher)
- UX refinements (must be user-tested)
- Performance improvements (must be measurable)
- Real GitHub integration (OAuth, API)
- Authentication (Supabase Auth)
- Accessibility (WCAG 2.1 AA compliance)
- User testing feedback (must be from real users)

All new feature requests go to AI Institute.

---

## AI Institute — Active Development

All new platform work directly supports launching the first AI cohort.

GitHub OS has proven the platform. AI Institute proves the mission.

**Content OS Architecture:** `docs/ai-institute/`
- 20 documents covering domain model, learning philosophy, curriculum, labs, assessments, mentorship, certification, governance
- Full domain model with 25+ entities
- Complete learning journey from visitor to mentor
- 8 curriculum levels with objectives, skills, projects
- Lab system with 7 lab types
- Assessment model with 9 assessment types
- Content governance with review workflow
- Implementation plan with database schema and API design

---

## Design System

**Canonical UI layer:** `@bhavya/platform-ui`

**Rules:**
1. No application creates custom foundational components.
2. No inline design tokens.
3. No hardcoded spacing, colors, typography, or animations.
4. Components evolve only after research and approval.
5. Every component is versioned with documentation.

**Full specification:** `docs/design-system/`
- `BEE-2.0.md` — Evolution protocol
- `DESIGN_PRINCIPLES.md` — 10 research-backed principles
- `COMPONENT_CATALOG.md` — 17 components with usage
- `DESIGN_TOKENS.md` — Full token reference
- `FEATURE_ADMISSION.md` — Gate policy
- `AI_REVIEW.md` — Pre-merge checklist
- `QUARTERLY_REVIEW.md` — Product review template

---

## OpenCode Configuration

**IMPORTANT:** When editing `opencode.json` or `opencode.jsonc`:
- Always use the `"mcp"` key, NOT `"mcpServers"`
- Schema: https://opencode.ai/config.json
- Preserve all existing keys when modifying
- Validate JSON against current schema before saving
