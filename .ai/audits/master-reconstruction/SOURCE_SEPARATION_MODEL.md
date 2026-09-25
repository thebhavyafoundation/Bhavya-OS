# Source A / Source B Separation Model (Phase 3)

## Authorities

- **SOURCE A** — Existing Bhavya AI Institute curriculum. Location: `apps/ai-institute/src/data/academy-*.ts` (+ spec `docs/master-curriculum/`, `docs/ai-institute/`). Owner: Bhavya Foundation. License: repo (MIT-leaning). Mutable via KP pipeline with human approval.
- **SOURCE B** — Experience AI external corpus (Raspberry Pi Foundation). Location: `D:\Bhavya-Foundation-Source\Lessons\...` (OUTSIDE repo, immutable). License CC BY-NC-ND 4.0: attribute, non-commercial, NO derivatives. Immutable by license AND by mission rule.

## Rules (binding)

1. No merge, no overwrite, no rewrite of A to fit B, no ingest of B files into the repo (ND forbids adaptation; mission forbids silent merge).
2. B files never enter `D:\Bhavya OS` except GENERATED catalog metadata (titles, slugs, counts — facts, not expression).
3. Every B reference carries: slug, title, strand, age band, role, source path, license tag, access date.

## Relationship layer (future, explicit authorization required before build)

```
SOURCE A (repo academy: found/py/dl/llm tracks)
SOURCE B (external Experience AI: 31 packs, classroom)
RELATIONSHIP LAYER (repo-owned, generated/manual mapping only)
 ├── mapping (concept → A-lesson ↔ B-pack, incl. packaging-variant dedup notes)
 ├── references (B slug citations from A pages, attribution block)
 ├── prerequisites (B-first on-ramps → A tracks)
 └── enrichment (optional pathways; learner chooses, never auto-mixed)
```

4. Product may LIST B (library view, attribution, external open) but must not PRESENT B content as Bhavya-authored, must not assess/certify B content as academy progress without human pedagogy sign-off.
5. Catalog seed generated this mission: `source-b-catalog.json` (this dir) — 31 packs, file roles, word counts, license. Regeneration: re-run extractor script (temp copy at mission notes), never hand-edit.

## Status

Model SPECIFIED (this file), catalog GENERATED (pending next action), relationship rows EMPTY (correct — mapping is future human-approved work).
