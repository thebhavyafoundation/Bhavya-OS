# ICM — Interpretable Context Methodology

**Date:** 2026-08-10
**Status:** ACTIVE
**Owner:** Bhavya Foundation Architecture
**Last updated:** 2026-08-10
**Source:** https://github.com/RinDig/Interpretable-Context-Methodology/
**Paper:** https://arxiv.org/abs/2603.16021
**License:** MIT (Jake Van Clief, 2026)

---

## What is ICM

**Folder structure as agent architecture.** Numbered folders = stages. Markdown files = prompts/context. One agent reads the right files at the right moment. Replaces framework-level orchestration with filesystem structure.

---

## Five-Layer Routing

| Layer  | File                      | Question                  | Token Budget |
| ------ | ------------------------- | ------------------------- | ------------ |
| **L0** | `AGENTS.md`               | "Where am I?"             | ~300-800     |
| **L1** | Root `CONTEXT.md`         | "Where do I go?"          | ~200-500     |
| **L2** | Stage `CONTEXT.md`        | "What do I do?"           | ~200-500     |
| **L3** | `references/`, `_shared/` | "What rules apply?"       | 500-2k       |
| **L4** | `output/`, artifacts      | "What am I working with?" | varies       |

L0+L1+L2 = ~2,000-8,000 tokens per step (vs 30k-50k monolithic prompts).

---

## The 15 Patterns

| #   | Pattern                   | Description                                                      |
| --- | ------------------------- | ---------------------------------------------------------------- |
| 1   | Stage Contracts           | Every stage has Inputs, Process, Outputs sections                |
| 2   | Stage Handoffs            | Each stage writes to `output/`; next reads from previous         |
| 3   | One-Way Cross-References  | Folders point outward only. No back-references                   |
| 4   | Selective Section Routing | Inputs specify which sections of which files to load             |
| 5   | Canonical Sources         | Every fact has ONE home. No duplication                          |
| 6   | CONTEXT.md = Routing      | CONTEXT.md answers routing questions, never holds payload        |
| 7   | Tool Prerequisites        | Setup guides in `references/` of the stage that uses them        |
| 8   | Questionnaire Design      | Onboarding configures the factory, not a run                     |
| 9   | Bundled Skills            | Workspaces bundle domain skills into `skills/` folder            |
| 10  | Specs Are Contracts       | Spec stages define WHAT/WHEN, not HOW                            |
| 11  | Checkpoints               | Creative stages include human pause points                       |
| 12  | Stage Audits              | Agent runs checklist after process, before output                |
| 13  | Value Validation          | Content stages define value their output delivers                |
| 14  | Docs Over Outputs         | Reference docs are authoritative. Previous outputs are artifacts |
| 15  | Shared Constants          | Code-producing workspaces define constants in shared files       |

---

## The Five Forms

| Form                 | Repeating Unit                          | Optimizes For                          |
| -------------------- | --------------------------------------- | -------------------------------------- |
| **Pipeline**         | A run (same stages, new deliverable)    | Sequential production with human gates |
| **Umbrella**         | Several pipeline types sharing identity | Portfolio of pipelines under one brand |
| **Record Library**   | A record that accumulates               | Retrieval and uniform shape            |
| **Knowledge Bundle** | The knowledge itself                    | Navigable body of knowledge            |
| **Context Map**      | An organization                         | Who does what and links between them   |

---

## The 10 Invariants

1. One folder, one job
2. Small, stable entry file (<~60 lines)
3. Numbering encodes order
4. Every folder-level contract is explicit
5. Factory vs. product (stable reference vs. per-run artifacts)
6. Every output is an edit surface
7. Load only what the step needs
8. Plain text, linkable, queryable
9. Filesystem is the state machine
10. Instantiate by copying

---

## Bhavya OS Application

Bhavya OS uses ICM as a **Context Map** at root, with mixed forms per subsystem:

| Subsystem                  | ICM Form         | Entry File                           |
| -------------------------- | ---------------- | ------------------------------------ |
| Root                       | Context Map      | `AGENTS.md` (L0) + `CONTEXT.md` (L1) |
| `apps/`                    | Umbrella         | `apps/CONTEXT.md`                    |
| `packages/`                | Record Library   | `packages/CONTEXT.md`                |
| `.ai/`                     | Knowledge Bundle | `.ai/CONTEXT.md`                     |
| `docs/`                    | Knowledge Bundle | `docs/CONTEXT.md`                    |
| `standards/`, `contracts/` | Contract         | Validation rules                     |
| `rfcs/`                    | Pipeline         | RFC processing                       |
| `registry/`, `bar/`        | Catalog          | Machine-readable indexes             |
| `memory/`                  | Record Library   | Institutional memory                 |
| `scripts/`                 | Factory          | Build/deploy automation              |

---

## ICM + Skill Routing Integration

```text
ICM CONTEXT (L0-L2)
  ↓
TASK
  ↓
TASK CLASSIFICATION
  ↓
SKILL DISCOVERY (from registry)
  ↓
SKILL SELECTION (primary, supporting, validation)
  ↓
SKILL COMPOSITION (ordered execution plan)
  ↓
ICM STAGE CONTRACT (inputs, process, outputs)
  ↓
EXECUTION
  ↓
HANDOFF (output to next stage)
  ↓
VALIDATION
  ↓
ARTIFACT
  ↓
DOCUMENTATION
```

The skill system is subordinate to the institutional methodology.

---

## Stage Contract Format

```markdown
# Stage Name — one-sentence purpose

## Inputs

| Source    | File/Location              | Section/Scope | Why   |
| --------- | -------------------------- | ------------- | ----- |
| Working   | ../01_stage/output/file.md | —             | Input |
| Reference | ../../_shared/voice.md     | "Voice Rules" | Tone  |

## Process

1. Step one
2. Step two

## Outputs

| Artifact | Location | Format   |
| -------- | -------- | -------- |
| draft.md | output/  | Markdown |

## Human check

Read the draft. Verify X.
```
