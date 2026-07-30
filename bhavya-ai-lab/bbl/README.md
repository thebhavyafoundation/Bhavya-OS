# Bhavya Build Language (BBL)

**BICM Version:** 1.0.0  
**Purpose:** Declarative language for educational intent  

## Philosophy

BBL represents educational intent, not implementation. One source file compiles to many outputs.

## Example

```bbl
COURSE AI Foundations
MODULE What is Intelligence?
LESSON Humans and Machines

OBJECTIVES
- Explain intelligence
- Compare humans and computers

SCENE
Teacher and student discuss farming

VISUAL
Animated village
Neural network diagram

ACTIVITY
Identify three examples of intelligent behavior

ASSESSMENT
Five multiple-choice questions

PROJECT
Interview a local farmer about technology used on the farm
```

## Compilation Targets

One BBL file compiles to:

| Target | Format | Factory |
|--------|--------|---------|
| Web Lesson | HTML/React | Lesson Factory |
| Teacher Guide | PDF | PDF Factory |
| Student Workbook | PDF | PDF Factory |
| Quiz | JSON | Assessment Factory |
| Flashcards | JSON | Assessment Factory |
| Animation | Remotion | Video Factory |
| AI Tutor Context | JSON | AI Factory |
| Slides | PPTX/HTML | Slides Factory |
| Offline Package | ZIP | Offline Factory |

## Grammar

### Keywords

```
COURSE      — Define a course
MODULE      — Define a module within a course
LESSON      — Define a lesson within a module
OBJECTIVES  — Learning objectives
PREREQUISITES — Required prior knowledge
SCENE       — Scene description
VISUAL      — Visual elements
ACTIVITY    — Student activity
ASSESSMENT  — Assessment questions
PROJECT     — Project assignment
VOCABULARY  — Key terms
REFERENCES  — External resources
```

### Structure

```bbl
COURSE {course-name}
  MODULE {module-name}
    LESSON {lesson-name}
      OBJECTIVES
        - {objective}
      PREREQUISITES
        - {prerequisite}
      SCENE
        {scene-description}
      VISUAL
        {visual-description}
      ACTIVITY
        {activity-description}
      ASSESSMENT
        {assessment-description}
      PROJECT
        {project-description}
      VOCABULARY
        {term}: {definition}
      REFERENCES
        - {reference}
```

## Compilation Process

```
BBL Source
    ↓
[Parser] — Tokenize and parse BBL
    ↓
[AST] — Abstract Syntax Tree
    ↓
[Validator] — Check against schema
    ↓
[Compiler] — Transform to target format
    ↓
[Factory] — Apply factory-specific processing
    ↓
Output
```

## Validation Rules

1. **Required sections** — Every lesson must have objectives, assessment
2. **Valid references** — All references must exist in citation registry
3. **Schema compliance** — Output must match target schema
4. **Educational quality** — Objectives must be measurable

## Version History

| Date | Version | Change |
|------|---------|--------|
| 2026-07-30 | 1.0.0 | Initial BBL design |
