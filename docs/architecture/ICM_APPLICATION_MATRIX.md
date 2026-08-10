# ICM APPLICATION MATRIX

**Date:** 2026-08-10
**Status:** ACTIVE
**Owner:** Bhavya Foundation Architecture
**Last updated:** 2026-08-10

---

## Purpose

Maps where ICM is applied across Bhavya Foundation domains. Each entry shows the ICM form, stage structure, and status.

---

## Active ICM Applications

| Domain                      | ICM Form         | Stage Structure                                              | Status  |
| --------------------------- | ---------------- | ------------------------------------------------------------ | ------- |
| **Repository architecture** | Context Map      | L0 (AGENTS.md) → L1 (CONTEXT.md) → L2 (subsystem CONTEXT.md) | Active  |
| **Agent routing**           | Context Map      | L0 → L1 → L2 → L3 (references) → L4 (artifacts)              | Active  |
| **Package management**      | Record Library   | packages/CONTEXT.md with per-package contracts               | Active  |
| **Knowledge management**    | Knowledge Bundle | docs/CONTEXT.md with topic routing                           | Active  |
| **Institutional memory**    | Record Library   | memory/ with engineering/decisions/knowledge                 | Active  |
| **RFC processing**          | Pipeline         | rfcs/ → review → approval → implementation                   | Active  |
| **Standards enforcement**   | Contract         | standards/ → validation → compliance                         | Active  |
| **Curriculum production**   | Pipeline         | KO → lesson → assessment → guide → workbook                  | Defined |
| **Video production**        | Pipeline         | lesson → visual-spec → composition → render → QA             | Defined |
| **Content production**      | Pipeline         | research → creation → review → publication                   | Defined |
| **Knowledge ingestion**     | Pipeline         | discovery → validation → publication                         | Defined |
| **Design system evolution** | Pipeline         | research → recommendation → review → update (BEE 2.0)        | Active  |

---

## Stage Structures

### Curriculum Production Pipeline

```
01_knowledge_object/ → 02_lesson/ → 03_assessment/ → 04_teacher_guide/ → 05_workbook/ → 06_visual_spec/ → 07_video/ → 08_publish/
```

### Video Production Pipeline

```
01_lesson_content/ → 02_visual_spec/ → 03_react_composition/ → 04_render/ → 05_qa/ → 06_media_artifact/
```

### Content Production Pipeline

```
01_research/ → 02_draft/ → 03_review/ → 04_approval/ → 05_publication/
```

### Knowledge Ingestion Pipeline

```
01_discovery/ → 02_normalization/ → 03_validation/ → 04_enrichment/ → 05_publication/
```

### BEE 2.0 (Design System Evolution)

```
Research → Knowledge Package → Recommendation → Human Review → Platform Update → Application Update → Telemetry → Research
```

---

## ICM Forms Used in Bhavya OS

| Form                 | Where Used                        | Purpose                                 |
| -------------------- | --------------------------------- | --------------------------------------- |
| **Context Map**      | Root, .agents/, platform/         | Organization and routing                |
| **Umbrella**         | apps/                             | Multiple pipelines under one brand      |
| **Record Library**   | packages/, memory/, content/      | Accumulating records with uniform shape |
| **Knowledge Bundle** | docs/, .ai/, knowledge/           | Navigable body of knowledge             |
| **Pipeline**         | rfcs/, curriculum, video, content | Sequential production with gates        |

---

## Walk Test Results

**Before ICM:** 14/14 navigation questions required 3-5+ reads across scattered, duplicated locations.

**After ICM:** 14/14 questions answerable in 1-2 reads from root entry. Zero broken references. Zero duplication.

---

## Where ICM Wins

- Sequential, human-reviewed, repeatable workflows
- Content pipelines
- Research workflows
- Reporting
- Training material
- Knowledge bases
- Organizational mapping

## Where ICM Loses

- Real-time multi-agent collaboration
- High-concurrency multi-user serving
- Automated mid-pipeline branching

These require framework code (Bhavya OS runtime handles this).
