# Builder: Lesson

**Purpose:** Compile Knowledge Objects into lessons

## Input
- Knowledge Objects from `knowledge/objects/`
- Curriculum patterns from `_config/skills/education/`
- Lesson schema from `_config/schemas/lesson.schema.json`

## Process

```
1. Validate input Knowledge Objects
2. Load curriculum patterns
3. Compile lesson sections:
   - Learning Objectives
   - Prerequisites
   - Vocabulary
   - Key Concepts
   - Visual Explanation
   - Analogies
   - Examples
   - Local Examples
   - Exercises
   - Projects
   - Reflection
   - Assessment
   - Further Reading
   - Revision Notes
   - Teacher Notes
   - Student Notes
4. Validate against schema
5. Generate outputs
```

## Output

```
build/lesson/output/{lesson-id}/
├── web/              # HTML/React for website
├── pdf/              # PDF workbook
├── slides/           # Presentation
├── quiz.json         # Assessment
├── teacher-guide.md  # Teacher resource
└── metadata.json     # Version, sources, etc.
```

## Usage

```
bhavya build lesson ko-ai-what-is-ai
```
