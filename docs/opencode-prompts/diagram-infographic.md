# OpenCode Prompt — Diagram and Infographic Creation

Read first:

- `/AGENTS.md`
- `/docs/architecture/PLATFORM-TRUTH.md`
- diagram-related docs
- current infographic/chart components
- current design tokens
- current content and governance sources

## Goal

Create high-quality branded diagrams and infographics for Bhavya Foundation
using approved open-source tooling, especially Diagram Design where suitable.

## Permanent constraints

- Diagram Design is an authoring tool, not a runtime dependency.
- Do not generate factual diagrams without source-backed content.
- Do not add Google Font requests to production diagrams.
- Do not publish draft governance diagrams as approved.
- Use static SVG by default.
- Use interactive chart libraries only where interaction adds value.
- Every diagram needs an accessible text equivalent and manifest.

## Use Diagram Design for

- governance structure;
- curriculum pathways;
- public system explainers;
- process diagrams;
- architecture overviews;
- learning journeys;
- policy lifecycles.

## Use chart libraries for

- numeric comparisons;
- trends over time;
- dashboards;
- drill-down interactions;
- maps with live data.

## Use 3D instead only when

- spatial understanding matters;
- structure/explosion/layering is educationally meaningful;
- diagram alone is insufficient.

## Output requirements

Every diagram/infographic must have:

- purpose;
- audience;
- source content;
- chosen type;
- accessibility text;
- SVG/PNG path;
- manifest entry;
- mobile test;
- reduced-motion behaviour;
- review status.

## Storage rules

- source HTML/SVG authoring files in `content/diagrams/sources/`
- manifests in `content/diagrams/manifests/`
- accessible text in `content/diagrams/accessible-text/`
- reviewed production SVG in `apps/ai-institute/public/diagrams/`
- large export artefacts only in B2 if necessary

## Output format

Before coding, report:

- `CONFIRMED` source content
- `CHOSEN DIAGRAM TYPE`
- `WHY NOT MERMAID / WHY NOT ECHARTS / WHY NOT 3D`
- `FILES TO CREATE`
- `ACCESSIBILITY TEXT PLAN`
- `REVIEW STATUS`

## Diagram toolchain

Authoring is a local, offline concern and stays in Git. The scripts that exist
today are plain Node, run directly:

```bash
node scripts/diagrams/validate-diagrams.mjs
node scripts/diagrams/check-manifests.mjs
node scripts/diagrams/export-diagrams.mjs
```

There are **no `pnpm diagram:*` aliases** in root `package.json`. Do not
document one until it exists in `package.json`.

### Current state of the pipeline

`CONFIRMED` by running `check-manifests.mjs`:

```
[check-manifests] checked 6 manifest(s)
[check-manifests] 5 governance warning(s) (drafts on planned routes — expected for pilot)
[check-manifests] OK — all manifests consistent
```

`CONFIRMED` on disk:

- `content/diagrams/manifests/` — 6 manifests checked, consistent
- `content/diagrams/sources/html/` — 6 authoring sources
- `scripts/diagrams/` — `validate-diagrams.mjs`, `check-manifests.mjs`,
  `export-diagrams.mjs`

The 5 warnings are **draft diagrams on planned routes**, which the tooling
itself labels _expected for pilot_. That is normal, not a failure.

`UNKNOWN` / worth confirming before publishing anything new:

- `content/diagrams/accessible-text/` exists but holds **no files**. Every rule
  in this pack requires an accessible text equivalent, so confirm whether text
  lives inside the manifests instead of this directory before assuming it is
  missing.
- `apps/ai-institute/public/diagrams/` exists but holds **no files**. No
  reviewed diagram has reached publication.

No diagram has yet completed source → manifest → accessible text → published
SVG. Before adding another partial source file, finish one end-to-end.

Run `check-manifests.mjs` before claiming a diagram is complete.

## Text equivalent, not a screen-reader-only class

The text equivalent must be **visible**. Reasons, in order of importance:

- It is how a scanning reader understands the diagram at all.
- A screen-reader-only equivalent is invisible in every screenshot, review and
  support conversation, so a defect in it cannot be spotted by anyone looking.
- It survives the animation and rendering failures that hide visual output.

## Decision rule

Choose the simplest form that carries the meaning:

1. Semantic HTML and text.
2. Static SVG.
3. Diagram Design authored SVG.
4. Chart library, only if the reader needs to interrogate values.
5. 3D, only if spatial structure is the thing being taught.

Each step down adds bytes, runtime and a way to fail. Move up only with a
reason you can state in one sentence.
