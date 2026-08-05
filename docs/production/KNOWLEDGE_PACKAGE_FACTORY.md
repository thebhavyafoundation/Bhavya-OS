# Knowledge Package Factory — Production Specification v1.0

**Status:** Active  
**Authority:** Bhavya Foundation Content Operations  
**Source Standard:** KP-001 (`ko-ai-what-is-ai.json`)  
**Effective:** 2026-08-05

---

## 1. Purpose

This document defines the mandatory template, quality gates, content rules, and sizing conventions for every Knowledge Package (KP) produced by Bhavya Foundation. No KP may enter the Knowledge Graph without passing all checks defined here.

---

## 2. Production Template

Every KP MUST conform to the following JSON schema. No optional field may be omitted at creation time. Empty arrays (`[]`) are permitted only where explicitly noted.

### 2.1 Top-Level Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | YES | Globally unique identifier. Format: `ko-{domain-slug}-{topic-slug}`. Max 64 chars, lowercase, hyphens only. Example: `ko-ai-what-is-ai` |
| `domain` | string | YES | Domain slug from the approved domain registry. Must match `domains.yaml`. Examples: `artificial-intelligence`, `data-science`, `web-development` |
| `title` | string | YES | Human-readable title. Max 120 chars. Title Case. Must be unambiguous within the domain. |
| `description` | string | YES | 1-3 sentence summary. Must state the target grade level and primary learning goal. Max 300 chars. |
| `grade` | integer | YES | Target grade level. Range: 6–12. Must be a single integer. |
| `subject` | string | YES | Subject name from approved subject registry. Must match `subjects.yaml`. Example: `Artificial Intelligence` |

### 2.2 Concepts

Array of concept objects. Minimum 3 entries.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `name` | string | YES | Max 80 chars. Must be a distinct, teachable concept. |
| `description` | string | YES | 1-2 sentence explanation. Max 200 chars. Must be understandable at the target grade level. |
| `difficulty` | string | YES | One of: `beginner`, `intermediate`, `advanced`. At least one `beginner` concept required. |

**Structural rule:** Concepts must progress from beginner to advanced within the array. The first concept must be `beginner` or `intermediate`.

### 2.3 Definitions

Array of definition objects. Minimum 3 entries.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `term` | string | YES | The term being defined. Max 60 chars. Must appear in at least one concept description or exercise. |
| `definition` | string | YES | Student-friendly definition. Max 200 chars. Must use language appropriate for the target grade. No jargon without explanation. |

**Structural rule:** Definitions must not duplicate content from concept descriptions. They serve as a glossary, not a repeat.

### 2.4 Examples

Array of example objects. Minimum 3 entries. All must be real-world, verifiable, and current.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `title` | string | YES | Max 80 chars. Must be a recognizable product, system, or phenomenon. |
| `description` | string | YES | 1-3 sentences explaining how the example demonstrates the concept. Max 300 chars. Must be factually accurate. |

**Content rule:** At least one example must be from India or relevant to Indian students. No fictional examples.

### 2.5 Misconceptions

Array of misconception objects. Minimum 2 entries.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `belief` | string | YES | The common misconception stated as a belief. Max 150 chars. Must be a belief actually held by students or the general public. |
| `correction` | string | YES | The accurate counter-statement. Max 300 chars. Must cite evidence or reasoning. Must be respectful in tone. |

**Content rule:** Misconceptions must be sourced from documented educational research, teacher feedback, or well-known cognitive biases in the domain. No fabricated misconceptions.

### 2.6 Exercises

Array of exercise objects. Minimum 3 entries. Must include at least 2 different exercise types.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `prompt` | string | YES | The exercise question or task. Max 500 chars. Must be unambiguous. |
| `type` | string | YES | One of: `mcq`, `short-answer`, `reflection`, `project`, `fill-in-the-blank`, `true-false`, `matching`, `diagram` |
| `solution` | string | NO | Model answer or rubric. Required for `mcq` and `true-false`. Recommended for all others. Max 500 chars. |

**Type distribution rule:** At least one exercise must be `reflection` or `project` (higher-order thinking). At least one must be `mcq` or `true-false` (recall/understanding).

### 2.7 References

Array of reference objects. Minimum 2 entries.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `title` | string | YES | Max 120 chars. Must be the actual title of the resource. |
| `type` | string | YES | One of: `video`, `book`, `article`, `website`, `paper`, `course`, `tool` |
| `url` | string | NO | Required if `type` is `video`, `website`, `course`, or `tool`. Must be a valid, accessible URL. No broken links. |

**Content rule:** At least one reference must be freely accessible (no paywall). At least one must be from an Indian educational institution or government source where applicable.

### 2.8 Navigation Fields

| Field | Type | Required | Constraints |
|---|---|---|---|
| `prerequisites` | string[] | YES | Array of KP IDs that must be learned first. Empty array `[]` if none. Each ID must exist in the Knowledge Graph. |
| `related` | string[] | YES | Array of KP IDs covering adjacent topics. Empty array `[]` if none. Each ID must exist or be planned. |

### 2.9 Metadata

Object. All sub-fields required.

| Field | Type | Required | Constraints |
|---|---|---|---|
| `author` | string | YES | Organization or individual name. Max 80 chars. Default: `Bhavya Foundation` |
| `targetAudience` | string | YES | Specific audience description. Max 120 chars. Must reference grade, region, or learner type. Example: `Grade 9 students in Himachal Pradesh` |
| `language` | string | YES | ISO 639-1 code. Default: `en`. For bilingual KPs, use primary language. |
| `estimatedDuration` | string | YES | Format: `{number} minutes`. Must be realistic for the content volume. Range: 15–120 minutes. |
| `bloomTaxonomy` | string[] | YES | At least 2 levels from: `remember`, `understand`, `apply`, `analyze`, `evaluate`, `create`. Must reflect the exercise types included. |
| `tags` | string[] | YES | 3-8 lowercase tags. Must include the domain slug and grade level. No spaces, no capital letters. |

---

## 3. Quality Checklist

Every KP must satisfy ALL of the following before it enters the Knowledge Graph. The pipeline must enforce these as hard gates — no exceptions without documented override from Content Lead.

### 3.1 Structural Completeness

| # | Check | Gate Type |
|---|---|---|
| S-1 | `id` matches format `ko-{domain}-{topic}` and is unique | HARD FAIL |
| S-2 | `domain` exists in `domains.yaml` | HARD FAIL |
| S-3 | `subject` exists in `subjects.yaml` | HARD FAIL |
| S-4 | `grade` is integer 6–12 | HARD FAIL |
| S-5 | `title` is unique within domain | HARD FAIL |
| S-6 | `description` is 10–300 chars | HARD FAIL |
| S-7 | `prerequisites` IDs all exist in Knowledge Graph | HARD FAIL |
| S-8 | `related` IDs all exist or are planned | SOFT WARN |

### 3.2 Content Minimums

| # | Check | Minimum | Gate Type |
|---|---|---|---|
| C-1 | Concepts count | ≥ 3 | HARD FAIL |
| C-2 | Concepts with `beginner` difficulty | ≥ 1 | HARD FAIL |
| C-3 | Definitions count | ≥ 3 | HARD FAIL |
| C-4 | Examples count | ≥ 3 | HARD FAIL |
| C-5 | Examples from India or relevant to Indian students | ≥ 1 | SOFT WARN |
| C-6 | Misconceptions count | ≥ 2 | HARD FAIL |
| C-7 | Exercises count | ≥ 3 | HARD FAIL |
| C-8 | Exercise types (distinct) | ≥ 2 | HARD FAIL |
| C-9 | Exercises with type `reflection` or `project` | ≥ 1 | HARD FAIL |
| C-10 | References count | ≥ 2 | HARD FAIL |
| C-11 | References with accessible URL | ≥ 1 | HARD FAIL |
| C-12 | Metadata `bloomTaxonomy` levels | ≥ 2 | HARD FAIL |
| C-13 | Metadata `estimatedDuration` set | present | HARD FAIL |
| C-14 | Metadata `tags` count | ≥ 3 | HARD FAIL |

### 3.3 Content Quality

| # | Check | Method | Gate Type |
|---|---|---|---|
| Q-1 | No hallucinated facts | Cross-reference examples against known sources | HARD FAIL |
| Q-2 | All examples verifiable | Each example must reference a real product, system, or phenomenon | HARD FAIL |
| Q-3 | Definitions student-friendly | Readability check: Flesch-Kincaid grade level ≤ target grade + 2 | SOFT WARN |
| Q-4 | Exercises have rubrics | `solution` field present for `mcq` and `true-false` | HARD FAIL |
| Q-5 | Misconceptions documented | Each misconception must trace to a source (research, teacher feedback, or domain expert) | SOFT WARN |
| Q-6 | No plagiarism | Content原创性 check against existing Knowledge Graph | SOFT WARN |
| Q-7 | Language consistent | No mixed languages within a field unless intentionally bilingual | SOFT WARN |

---

## 4. Content Quality Rules

### 4.1 Factual Accuracy

- Every claim in descriptions, examples, and definitions must be verifiable.
- Statistics and numbers must cite a source within the KP or in references.
- No speculative statements presented as fact. Opinion must be clearly marked.
- When referencing companies or products, use current, publicly available information.

### 4.2 Example Standards

- All examples must be **real-world** — actual products, services, research projects, or phenomena.
- No hypothetical or fictional examples unless explicitly labeled as such in a `project` exercise.
- Examples must be current within 3 years. Outdated examples (e.g., referencing discontinued products) must be updated or removed.
- At least one example per KP must be relevant to the Indian context (Indian companies, government initiatives, local applications).

### 4.3 Definition Standards

- Definitions must be self-contained — a student reading only the definition should understand the term.
- Avoid circular definitions (defining term A using term B, then defining term B using term A).
- Technical terms used in definitions must themselves be defined in the same KP or in a prerequisite KP.
- Definitions must use the target grade's reading level. If a term requires advanced vocabulary, break it down.

### 4.4 Exercise Standards

- Every exercise prompt must be unambiguous — two students reading it should arrive at the same understanding of the task.
- `mcq` exercises must have exactly one correct answer. Distractors must be plausible but clearly incorrect.
- `short-answer` exercises must include a model answer or evaluation rubric in the `solution` field.
- `reflection` exercises must prompt personal connection or opinion, not recall.
- `project` exercises must be completable within the estimated duration or clearly state additional time requirements.
- All exercises must be age-appropriate for the target grade.

### 4.5 Misconception Standards

- Every misconception must be a belief that is **actually held** by students or the general public in the domain.
- Corrections must be evidence-based, not dismissive. Tone: "Many people believe X, but research shows Y because Z."
- Misconceptions must not be strawman arguments. They should represent genuine confusion.
- At least one misconception per KP should be addressable through a classroom activity or demonstration.

---

## 5. KP Sizing Guide

KPs exist at three sizes. The size determines the scope, not the quality — all quality gates apply equally to every size.

### 5.1 ConceptKP

**Scope:** Single concept deep-dive.

| Attribute | Value |
|---|---|
| Concepts | Exactly 1 |
| Definitions | ≥ 3 (the concept + its components) |
| Examples | ≥ 3 (all illustrating the same concept from different angles) |
| Misconceptions | ≥ 2 (specific to this concept) |
| Exercises | ≥ 3 |
| Estimated Duration | 15–30 minutes |
| Use Case | Foundational building block. Used when a concept is complex enough to warrant focused treatment. |

**Example:** `ko-ai-neural-networks` — a deep-dive into neural networks only.

### 5.2 TopicKP

**Scope:** 3–5 related concepts forming a coherent topic.

| Attribute | Value |
|---|---|
| Concepts | 3–5 |
| Definitions | ≥ 5 (covering all concepts + shared terms) |
| Examples | ≥ 5 (at least one per concept) |
| Misconceptions | ≥ 3 |
| Exercises | ≥ 5 (mix of types across concepts) |
| Estimated Duration | 30–60 minutes |
| Use Case | Standard teaching unit. The default size for most KPs. |

**Example:** `ko-ai-what-is-ai` — the gold standard KP covering AI, ML, NLP, computer vision, and neural networks.

### 5.3 ModuleKP

**Scope:** Complete module or unit coverage. Multiple topics, prerequisite chains, assessment-ready.

| Attribute | Value |
|---|---|
| Concepts | 8–15 (organized into sub-topics) |
| Definitions | ≥ 10 |
| Examples | ≥ 10 |
| Misconceptions | ≥ 5 |
| Exercises | ≥ 10 (must include all exercise types) |
| Estimated Duration | 60–120 minutes |
| Use Case | End-of-unit comprehensive package. Includes built-in assessment. |

**Example:** `ko-ai-intro-to-ai-module` — covers the full "Introduction to AI" unit for a semester.

### 5.4 Size Selection Decision Tree

```
Is this a single, foundational concept that students need before anything else?
  → YES → ConceptKP
  → NO ↓

Does this topic contain 3+ related concepts that are always taught together?
  → YES → TopicKP
  → NO ↓

Does this cover an entire unit/module with multiple topics and assessment needs?
  → YES → ModuleKP
  → NO → Re-scope the content. KPs must fit one of these three sizes.
```

---

## 6. Production Workflow

### 6.1 KP Creation Pipeline

```
1. AUTHOR drafts KP using Production Template (Section 2)
       ↓
2. STRUCTURAL VALIDATION — automated checks (Section 3.1, 3.2)
       ↓ fail → REJECT with specific error codes
       ↓ pass ↓
3. CONTENT REVIEW — human review for quality (Section 3.3, 4.x)
       ↓ fail → REJECT with revision notes
       ↓ pass ↓
4. DOMAIN EXPERT SIGN-OFF — factual accuracy verification
       ↓ fail → REJECT with source corrections
       ↓ pass ↓
5. GRAPH INTEGRATION — link prerequisites, related KPs, update dependency graph
       ↓
6. PUBLISH — KP enters Knowledge Graph, available to all builders
```

### 6.2 Revision Cycle

- KPs may be revised at any time. Revisions must pass the same quality gates as new KPs.
- Major changes (concept additions, scope changes) require re-review from step 2.
- Minor changes (typo fixes, example updates) require structural re-validation only.
- All revisions must be logged with author, date, and change summary.

### 6.3 Retirement Policy

KPs may be retired when:
- Content is outdated and cannot be updated within the domain.
- The KP is superseded by a more comprehensive KP covering the same scope.
- The KP fails quality gates repeatedly and cannot be brought to standard.

Retired KPs are removed from the Knowledge Graph but retained in archive with `status: "retired"`.

---

## 7. Schema Reference

### 7.1 Complete JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Knowledge Package",
  "type": "object",
  "required": ["id", "domain", "title", "description", "grade", "subject", "concepts", "definitions", "examples", "misconceptions", "exercises", "references", "prerequisites", "related", "metadata"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^ko-[a-z0-9]+(-[a-z0-9]+)*$",
      "maxLength": 64
    },
    "domain": {
      "type": "string",
      "maxLength": 64
    },
    "title": {
      "type": "string",
      "maxLength": 120
    },
    "description": {
      "type": "string",
      "maxLength": 300
    },
    "grade": {
      "type": "integer",
      "minimum": 6,
      "maximum": 12
    },
    "subject": {
      "type": "string",
      "maxLength": 64
    },
    "concepts": {
      "type": "array",
      "minItems": 3,
      "items": {
        "type": "object",
        "required": ["name", "description", "difficulty"],
        "properties": {
          "name": { "type": "string", "maxLength": 80 },
          "description": { "type": "string", "maxLength": 200 },
          "difficulty": { "type": "string", "enum": ["beginner", "intermediate", "advanced"] }
        }
      }
    },
    "definitions": {
      "type": "array",
      "minItems": 3,
      "items": {
        "type": "object",
        "required": ["term", "definition"],
        "properties": {
          "term": { "type": "string", "maxLength": 60 },
          "definition": { "type": "string", "maxLength": 200 }
        }
      }
    },
    "examples": {
      "type": "array",
      "minItems": 3,
      "items": {
        "type": "object",
        "required": ["title", "description"],
        "properties": {
          "title": { "type": "string", "maxLength": 80 },
          "description": { "type": "string", "maxLength": 300 }
        }
      }
    },
    "misconceptions": {
      "type": "array",
      "minItems": 2,
      "items": {
        "type": "object",
        "required": ["belief", "correction"],
        "properties": {
          "belief": { "type": "string", "maxLength": 150 },
          "correction": { "type": "string", "maxLength": 300 }
        }
      }
    },
    "exercises": {
      "type": "array",
      "minItems": 3,
      "items": {
        "type": "object",
        "required": ["prompt", "type"],
        "properties": {
          "prompt": { "type": "string", "maxLength": 500 },
          "type": { "type": "string", "enum": ["mcq", "short-answer", "reflection", "project", "fill-in-the-blank", "true-false", "matching", "diagram"] },
          "solution": { "type": "string", "maxLength": 500 }
        }
      }
    },
    "references": {
      "type": "array",
      "minItems": 2,
      "items": {
        "type": "object",
        "required": ["title", "type"],
        "properties": {
          "title": { "type": "string", "maxLength": 120 },
          "type": { "type": "string", "enum": ["video", "book", "article", "website", "paper", "course", "tool"] },
          "url": { "type": "string", "format": "uri" }
        }
      }
    },
    "prerequisites": {
      "type": "array",
      "items": { "type": "string" }
    },
    "related": {
      "type": "array",
      "items": { "type": "string" }
    },
    "metadata": {
      "type": "object",
      "required": ["author", "targetAudience", "language", "estimatedDuration", "bloomTaxonomy", "tags"],
      "properties": {
        "author": { "type": "string", "maxLength": 80 },
        "targetAudience": { "type": "string", "maxLength": 120 },
        "language": { "type": "string", "minLength": 2, "maxLength": 5 },
        "estimatedDuration": { "type": "string", "pattern": "^\\d+ minutes$" },
        "bloomTaxonomy": {
          "type": "array",
          "minItems": 2,
          "items": { "type": "string", "enum": ["remember", "understand", "apply", "analyze", "evaluate", "create"] }
        },
        "tags": {
          "type": "array",
          "minItems": 3,
          "maxItems": 8,
          "items": { "type": "string", "pattern": "^[a-z0-9]+(-[a-z0-9]+)*$" }
        }
      }
    }
  }
}
```

---

## 8. Quality Gate Enforcement

### 8.1 Automated Checks (Pre-Commit)

These checks run automatically when a KP file is saved. All HARD FAIL checks must pass.

```
kp-validate --file <path>
```

Output: `PASS` or list of `{gate-id}: {reason}` failures.

### 8.2 Human Review Checklist

Content reviewers must verify:

- [ ] Facts are accurate and current
- [ ] Examples are real and verifiable
- [ ] Misconceptions are genuine, not strawman
- [ ] Exercises are age-appropriate and unambiguous
- [ ] Tone is educational and respectful
- [ ] Indian context represented where applicable
- [ ] Learning outcomes align with Bloom's taxonomy tags

### 8.3 Sign-Off Required

| Gate | Reviewer | Turnaround |
|---|---|---|
| Structural | Automated | Instant |
| Content Quality | Content Author | Self-review |
| Domain Accuracy | Domain Expert | 2 business days |
| Final Publish | Content Lead | 1 business day |

---

## 9. Appendix

### 9.1 Approved Domains (excerpt)

| Slug | Display Name |
|---|---|
| `artificial-intelligence` | Artificial Intelligence |
| `data-science` | Data Science |
| `web-development` | Web Development |
| `cybersecurity` | Cybersecurity |
| `cloud-computing` | Cloud Computing |

Full list maintained in `bhavya-ai-lab/knowledge/domains.yaml`.

### 9.2 Bloom's Taxonomy Quick Reference

| Level | Description | Exercise Types |
|---|---|---|
| `remember` | Recall facts and basic concepts | mcq, true-false, fill-in-the-blank |
| `understand` | Explain ideas or concepts | short-answer, matching, diagram |
| `apply` | Use information in new situations | short-answer, project |
| `analyze` | Draw connections among ideas | short-answer, reflection |
| `evaluate` | Justify a stand or decision | reflection, project |
| `create` | Produce new or original work | project, diagram |

### 9.3 Error Code Reference

| Code | Gate | Description |
|---|---|---|
| `E001` | S-1 | ID format invalid |
| `E002` | S-2 | Domain not in registry |
| `E003` | S-3 | Subject not in registry |
| `E004` | S-4 | Grade out of range |
| `E005` | S-5 | Title not unique in domain |
| `E006` | S-6 | Description length invalid |
| `E007` | S-7 | Prerequisite ID not found |
| `E010` | C-1 | Fewer than 3 concepts |
| `E011` | C-2 | No beginner concept |
| `E012` | C-3 | Fewer than 3 definitions |
| `E013` | C-4 | Fewer than 3 examples |
| `E015` | C-6 | Fewer than 2 misconceptions |
| `E016` | C-7 | Fewer than 3 exercises |
| `E017` | C-8 | Fewer than 2 exercise types |
| `E018` | C-9 | No reflection or project exercise |
| `E019` | C-10 | Fewer than 2 references |
| `E020` | C-11 | No reference with accessible URL |
| `E021` | C-12 | Fewer than 2 Bloom's levels |
| `E022` | C-13 | Estimated duration missing |
| `E023` | C-14 | Fewer than 3 tags |

---

*This document is the single source of truth for Knowledge Package production. All KPs created after 2026-08-05 must conform to this specification.*
