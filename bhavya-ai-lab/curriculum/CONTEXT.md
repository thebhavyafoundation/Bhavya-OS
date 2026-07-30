# Curriculum Workspace

**Last Updated:** 2026-07-30
**Current Goal:** Transform research briefs into structured lessons and courses
**Known Constraints:** Must follow pedagogical standards. Age-appropriate. Local examples required.
**Open Questions:** How to handle prerequisite chains?
**Recent Decisions:** Use BBL format for canonical source
**Next Review:** 2026-08-15

## Context

**Audience:** Students (ages 8-18), Teachers
**Input:** Research brief from research workspace
**Output:** Lesson, course, assessment

## Stages

### 01_outlines
- Read research brief
- Define learning objectives, module structure
- Output: `output/outline.md`

### 02_lesson_draft
- Write lesson following outline
- Include all required sections (see schema)
- Output: `output/lesson.md`

### 03_assessment
- Generate quiz questions
- Create rubrics
- Output: `output/assessment.json`

### 04_review
- Validate against schema
- Check educational quality
- Output: `output/validated/`

## References (Layer 3)

- `references/pedagogy.md` — Teaching methodology
- `references/voice.md` — Tone and style rules
- `../../_config/registries/` — Reusable components

## Output Format

Lesson JSON following `schemas/lesson.schema.json`
