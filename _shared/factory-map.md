# _shared — factory map (pointers, not copies)

One home per fact. This folder holds no content payload — only links to the
canonical factory files that are stable across runs. Configure the factory
once; every run reads from the canonical home.

## Canonical factory homes

| Capability             | Canonical home                                          | Do not copy to            |
| ---------------------- | ------------------------------------------------------- | ------------------------- |
| Design tokens          | `packages/platform-ui/src/styles/tokens.css`            | any app `globals.css`     |
| UI components          | `packages/platform-ui/src/components/`                  | any app `components/`     |
| Brand + voice          | `docs/brand/BRAND_GUIDE.md`                             | `_shared/` copies         |
| Web experience spec    | `docs/design-system/BHAVYA_WEB_EXPERIENCE.md`           | stage references          |
| Motion grammar         | `docs/design-system/BHVYA_MOTION_SYSTEM.md`             | inline CSS animations     |
| Constitution (15 docs) | `packages/constitution/` via `@bhavya/constitution` SDK | root `01_*.md` / `*.docx` |
| Engineering standards  | `standards/README.md` + `standards/` (21 files)         | `.ai/` copies             |
| Governance rules       | `governance/README.md`                                  | `docs/` copies            |
| Schemas                | `schemas/`                                              | ad-hoc validation         |
| Package contracts      | `contracts/<pkg>/CONTRACT.md`                           | duplicated checks         |
| Agent registry         | `.ai/agents/registry.yaml` (exists on disk)             | `platform/agents/` copies |

## Product (new every run) — lives apart from factory

| Product                                     | Lives at                                                                                                                                                   |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RFC runs                                    | `rfcs/RFC-NNNN-*.md`                                                                                                                                       |
| Release artifacts                           | `docs/releases/`                                                                                                                                           |
| Curriculum runs (KO → lesson → … → website) | `bhavya-ai-lab/data/` + `apps/ai-institute` SQLite                                                                                                         |
| Task state                                  | `.ai/current-task.md`, `.ai/current-release.md`                                                                                                            |
| Generated indexes                           | `registry/*.json`, `FILE-MAP.md` (root scripts); `bar/index.json` (see `bar/scripts/`; rebuild authority open — do not treat as live without verification) |

## Rules

- A link beats a copy. If a fact exists in the canonical home, point — never duplicate.
- Generated indexes are rebuilt by script, never hand-edited (`scripts/generate-file-map.mjs`, `scripts/generate-registry.js`). Which index is canonical when `registry/` and `bar/` disagree is a **human decision** — this map does not choose.
- Method and instance live apart: blank starters live in `_templates/`; filled-in runs live in the product rows above.
