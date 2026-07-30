# Layer 4 — Factories

**BICM Version:** 1.0.0  
**Purpose:** Transform knowledge into applications  

## Philosophy

Factories never create knowledge. They transform knowledge.

## Universal Compiler Pipeline

```
Knowledge Objects
       ↓
   [Validator]
       ↓
   [Compiler]
       ↓
   ┌───────┬───────┬───────┬───────┬───────┐
   ↓       ↓       ↓       ↓       ↓       ↓
 Lessons  Video  PDF   Slides Mobile Offline
   ↓       ↓       ↓       ↓       ↓       ↓
   └───────┴───────┴───────┴───────┴───────┘
       ↓
   [Distributor]
       ↓
   Applications
```

## Factories

### Lesson Factory
- **Input:** Knowledge Objects + Curriculum Structure
- **Output:** Structured lessons (Markdown + JSON)
- **Process:** Compile, validate, package

### Video Factory
- **Input:** Knowledge Objects + Visual Specs
- **Output:** Rendered videos (MP4/WebM/GIF)
- **Process:** Script → Visual → Code → Render

### Assessment Factory
- **Input:** Knowledge Objects + Assessment Rules
- **Output:** Quizzes, worksheets, rubrics
- **Process:** Generate, validate, package

### PDF Factory
- **Input:** Knowledge Objects + Layout Templates
- **Output:** PDFs (workbooks, teacher guides)
- **Process:** Layout, render, package

### Slides Factory
- **Input:** Knowledge Objects + Slide Templates
- **Output:** Presentation slides
- **Process:** Layout, render, package

### Mobile Factory
- **Input:** Knowledge Objects + Mobile Templates
- **Output:** Mobile-optimized content
- **Process:** Adapt, validate, package

### Offline Factory
- **Input:** Any compiled output
- **Output:** Offline packages (USB/MicroSD)
- **Process:** Bundle, compress, validate

## Factory Rules

1. **One input, one output** — Each factory has clear input/output contracts
2. **Structured data only** — No free-form text between factories
3. **Validation at every stage** — Invalid input rejected, invalid output rejected
4. **Deterministic** — Same input always produces same output
5. **Versioned** — Every output has version metadata

## Version History

| Date | Version | Change |
|------|---------|--------|
| 2026-07-30 | 1.0.0 | Initial factories layer |
