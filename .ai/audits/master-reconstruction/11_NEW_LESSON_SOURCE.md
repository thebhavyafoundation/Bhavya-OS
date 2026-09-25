# 11–12 — New Lesson Source (Source B) + Comparison

> SUPERSEDED 2026-09-17 (execution mission): Source B WAS found out-of-band —
> `C:\Users\kanta\Downloads\Experience-AI-Resources-20260917T203559Z-1-001.zip`,
> extracted to `D:\Bhavya-Foundation-Source\Lessons\`. See `EXTERNAL_SOURCE_INVENTORY.md`,
> `LESSONS_SOURCE_ANALYSIS.md`, `SOURCE_SEPARATION_MODEL.md`, `source-b-catalog.json`.
> The in-repo absence finding below remains true (nothing landed in git); only the
> "never landed anywhere" conclusion is retired.

## Source B status: NOT FOUND IN REPOSITORY — evidence of absence

Searched: `git status --short` (only `M opencode.json`, `?? .pnpm-store/` cache noise), `git log -15 --name-only` (only test-isolation touches to `academy-*.ts`, `knowledge-graph.ts`), `git ls-files --others` (no lesson dirs), full `*lesson*/*curriculum*` directory sweeps, `content/knowledge/` (168 runtime JSON), `content/research/` (36 evidence JSON), `docs/master-curriculum/` (12 planning files, no lesson markdown), `knowledge-packages/` (1 README-only KP), `apps/ai-institute/bhavya-ai-lab/` (harness only), `prototypes/`, `archive/apps/lesson-studio|knowledge-studio` (legacy). CONCLUSION: **no separately supplied lesson collection exists on disk or in git.** If supplied out-of-band (e.g. Google Drive), it was never landed. No Drive document is claimed inspected (per §35).

## Required handling when Source B arrives

- Land under `content/lessons-source-b/` (new, provenance-preserving root) — NEVER into `src/data/` or `knowledge-packages/`.
- Per-lesson record required: id, title, source, purpose, objective, key concepts, age/level, prerequisites, structure, activities, exercises, questions, assessment, projects, outcome, language, media, dependencies, provenance, quality, overlap/conflict flags, missing metadata.
- Then produce OVERLAP / COMPLEMENT / PREREQUISITE-GAP / SEQUENCING / CONFLICT / LEVEL-MISMATCH / QUALITY / MISSING-METADATA comparison WITHOUT merging. Similarity ≠ permission.

## Provenance model (for both sources)

```
CURRICULUM SOURCE (A: repo academy | B: new collection)
  → COLLECTION → MODULE → LESSON → ACTIVITY → ASSESSMENT
  each node carries: source, original doc, original title, version, author, date, transform history
```

Enforcement: future `packages/curriculum` (does not exist yet) must carry provenance fields; `content-core` SSOT migration must preserve them; no transform may drop source identity. Educational content must stay auditable.

## Comparison (Source A vs Source B)

NOT PERFORMABLE — Source B absent. Placeholder table with Source B column marked UNKNOWN is in `22_IMPLEMENTATION_GAP_MATRIX.md` scope (folded into roadmap). Any agent claiming "lessons integrated" before Source B lands is fabricating.
