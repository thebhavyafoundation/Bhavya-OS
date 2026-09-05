# ICM restructure proposal — human gate (do not migrate without approval)

Mode: **Restructure** (existing repo). Method: ICM Architect
(Van Clief & McDermott, arXiv:2603.16021, MIT).
This file is the step-4 gate: target tree + migration map. Nothing below moves
until a person approves it. Additive scaffolding already created (safe, no
moves) is listed separately.

## 1. Hidden form (step 2)

Root is an **Umbrella** over nested forms. No reordering needed — the
`CONTEXT.md` ICM-Form column already declares this correctly:

| Hub                                               | Form                | Repeating unit                                                                         |
| ------------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------- |
| `apps/`                                           | umbrella            | an application migrating into the canonical host                                       |
| `packages/`, `memory/`, `content/`                | record library      | a package / memory / content record                                                    |
| `docs/`, `.ai/`, `knowledge/`                     | knowledge bundle    | a knowledge claim with evidence                                                        |
| `.agents/`, `platform/`                           | context map         | a team / process / data-asset node                                                     |
| `rfcs/`                                           | pipeline            | an RFC run (`draft → published → approved → implemented`)                              |
| curriculum (`packages/runtime` + `bhavya-ai-lab`) | pipeline            | a KO run (KO → lesson → assessment → guide → workbook → visual-spec → video → website) |
| `registry/`, `bar/`                               | catalog (generated) | a rebuild                                                                              |

## 2. Classification (step 3)

- **Catalog** (routing, keep): `AGENTS.md`, `CONTEXT.md`, `apps/CONTEXT.md`,
  `packages/CONTEXT.md`, `.ai/CONTEXT.md`, `docs/CONTEXT.md`,
  `apps/ai-institute/CONTEXT.md` (created this run), `rfcs/CONTEXT.md`
  (created this run), `registry/index.json`, `bar/index.json`
- **Contract** (how a step works, keep): `standards/` (21), `schemas/`,
  `contracts/*/CONTRACT.md` (11), `docs/adr/` (6),
  `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md`,
  `docs/architecture/CANONICAL_*.md`, `docs/architecture/DOMAIN_OWNERSHIP.md`
- **Factory** (stable reference, keep, point — never copy):
  `packages/platform-ui/src/styles/tokens.css`,
  `packages/platform-ui/src/components/`, `docs/brand/BRAND_GUIDE.md`,
  `docs/design-system/`, `governance/`, `scripts/`, `.templates/`,
  `packages/constitution/` (canonical constitution home)
- **Product** (per-run output, keep): `apps/ai-institute/src/app/`,
  `bhavya-ai-lab/data/`, `content/`, `docs/releases/`, `docs/wave-9/`,
  `docs/wave-10/`, `.ai/current-task.md`, `.ai/current-release.md`
- **Dead** (stale / duplicated / superseded → propose `_archive/`, never
  silently delete):
  - `01_The_Constitution.md` … `15_Brand_Constitution.md` (15 files)
  - `01_The_Constitution.docx` … `15_Brand_Constitution.docx` (15 files)
  - `check.mjs`, `verify.mjs`, `verify2.mjs`, `insert.mjs`, `insert2.mjs`,
    `insert3.mjs`, `insert-lessons.mjs` (7 files)
  - `dev-server.log`, `dev-server-err.log` (generated logs)
  - `__test_io_dir__/`, `__test_io_json__/`, `__test_io_list__/`, `__test_output__/` (test scaffolding)
  - Root status docs superseded by `.ai/current-*.md` + `docs/releases/`:
    `ARCHITECTURE_OVERVIEW.md`, `EXECUTION_PLAN.md`, `EXECUTION_PROTOCOL.md`,
    `LESSONS_LEARNED_v1.0.md`, `MATURITY_REPORT.md`, `MATURITY_REPORT_PHASE2.md`,
    `POST_RC_ACTIONS.md`, `PRD.md`, `SUCCESS_CRITERIA.md`, `VALIDATION_PLAN.md`,
    `RELEASE_NOTES_v3.1.0.md`, `RELEASE-CHECKLIST.md`, `PLATFORM_GUARANTEES.md`
  - `design-system/` (root doc-only dir; implementation is `packages/platform-ui/`)
  - `capability-registry.json`, `core-manifest.json` (root strays; belong with
    `registry/` or owning package — confirm owner before moving)

## 3. Target tree (additive parts already created marked *)

```
<root>/
├─ AGENTS.md                  slim entry (~50 lines; proposal: _system/proposed-AGENTS.md)
├─ CONTEXT.md                 slim umbrella router (proposal: _system/proposed-CONTEXT.md)
├─ FILE-MAP.md                GENERATED (script: scripts/generate-file-map.mjs)
├─ _shared/factory-map.md *   factory pointers (no payload)
├─ _templates/* *             stage-CONTEXT.md, rfc-record.md, node.md, README.md
├─ _system/* *                schema.md + proposals (this file)
├─ setup/questionnaire.md *   one-time factory config
├─ apps/ai-institute/CONTEXT.md *   canonical-host contract
├─ rfcs/CONTEXT.md *          decision-pipeline contract
├─ apps/                      (unchanged, migrates into canonical host per plan)
├─ packages/                  (unchanged)
├─ docs/ .ai/ knowledge/      (unchanged)
├─ _archive/                  dead files land here ONLY after approval (leave a
│                             link file where any moved copy lived, if referenced)
└─ archive/                   existing code archive (unchanged)
```

## 4. Migration map (needs approval — DO NOT EXECUTE YET)

| Old path                                         | New path                                       | Role                | Note                                                                          |
| ------------------------------------------------ | ---------------------------------------------- | ------------------- | ----------------------------------------------------------------------------- |
| `01_*.md` … `15_*.md` (15)                       | `_archive/constitution-duplicates-2026-09-05/` | Dead                | superseded by `packages/constitution/`; leave `CONSTITUTION_MOVED.md` pointer |
| `01_*.docx` … `15_*.docx` (15)                   | same `_archive/` dir                           | Dead                | binary duplicates; same pointer covers them                                   |
| `check.mjs`, `verify*.mjs`, `insert*.mjs` (7)    | `scripts/_archive/` or delete if superseded    | Dead                | confirm no workflow references them first (`grep`)                            |
| `dev-server*.log`                                | `.logs/` + `.gitignore`                        | Product (generated) | never hand-edit; ignore going forward                                         |
| `__test_io_*/`, `__test_output__/`               | delete after confirming test runner recreates  | Dead                | scaffolding, not source                                                       |
| root status docs (13 listed above)               | `_archive/root-status-2026-09-05/`             | Dead                | `.ai/current-*.md` + `docs/releases/` are the live surfaces                   |
| `design-system/` (root)                          | pointer to `packages/platform-ui/`             | Dead                | keep one `README.md` pointer if referenced                                    |
| `capability-registry.json`, `core-manifest.json` | owner-confirmed home (`registry/`?)            | Factory/Product     | do NOT move until owner confirmed                                             |
| `AGENTS.md` (264 lines)                          | slim to `_system/proposed-AGENTS.md` content   | Catalog             | human edits proposal first; then overwrite                                    |
| `CONTEXT.md` (84 lines)                          | slim to `_system/proposed-CONTEXT.md` content  | Catalog             | same gate as above                                                            |

Payload moved out of routing files goes to its shelf with a link left behind
— never deleted silently.

## 5. Already created this run (additive, safe, no approval needed to keep)

`_shared/factory-map.md`, `_templates/{README,stage-CONTEXT,rfc-record,node}.md`,
`setup/questionnaire.md`, `_system/{proposed-AGENTS,proposed-CONTEXT,schema}.md`
(this proposal), `apps/ai-institute/CONTEXT.md`, `rfcs/CONTEXT.md`.
No existing file was moved, edited, or deleted to create these.

## 6. Walk test

- [x] Open root: `AGENTS.md` (proposed, 45 lines) answers where-am-I +
      where-to-go; at most two more reads (`_shared/factory-map.md`, hub
      `CONTEXT.md`) reach any task. CURRENT `AGENTS.md` (264 lines) FAILS —
      carries builder/API/motion payload that belongs on shelves.
- [x] Any stage/node contract names exact inputs, job, output, human check:
      `apps/ai-institute/CONTEXT.md` + `rfcs/CONTEXT.md` PASS. Root `CONTEXT.md`
      currently FAILS (product definition + governance + design payload).
- [x] Status derivable by scan: RFC `status:` frontmatter + `.ai/current-*.md`
      PASS (after this run). Previously implicit.
- [x] No routing file carries payload: proposed files PASS; current
      `AGENTS.md`/`CONTEXT.md` FAIL (see §4 rows).
- [x] One home per fact: `_shared/factory-map.md` declares homes PASS as
      pointer; 30 root constitution duplicates FAIL until §4 approved.
- [x] Token check: proposed entry (~600 tokens) + one contract (~500) +
      inputs lands in 2k–8k PASS; current entry alone (~8–10k) FAILS.

Fix the structure by moving/splitting files (§4) — not by explaining more.

## 7. Schema drift found during walk (reconcile same day)

- RFC status vocabulary drifted: RFC-0001/0002 use `**Status:** published`,
  RFC-0003 uses `## Status / Accepted`. The `rfcs/CONTEXT.md` contract declares
  `draft → published → approved → implemented` frontmatter. Decision needed:
  canonicalize existing RFCs to the contract vocabulary, or amend the contract.
  `scripts/generate-file-map.mjs` reads all three shapes so status stays
  derivable either way.

## 8. Approval asked

1. Approve §4 migration map (all rows, or mark exceptions)?
2. Approve overwriting `AGENTS.md` ← `_system/proposed-AGENTS.md` and
   `CONTEXT.md` ← `_system/proposed-CONTEXT.md` after (1)?
3. Confirm homes for `capability-registry.json` + `core-manifest.json`?
