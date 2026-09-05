# Schema — the rules of this workspace

The closed set of note types, the labels they carry, and the naming they
follow. When practice and this file disagree, reconcile the same day — schema
drift is how structures rot.

## Node types

| `type:`    | Lives at                                                     | Carries                                              |
| ---------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| team       | `.agents/` role or `platform/agents/` scope                  | In / Movement / Out / Edges                          |
| process    | per-team process note (see `node.md` template)               | full scoring frontmatter                             |
| job        | task outcome note                                            | the outcome, who owns it                             |
| data-asset | `data-<thing>.md` alongside its producer                     | source of truth, shape, sensitivity                  |
| governance | `governance/`, `standards/`, `docs/adr/`                     | what may not be automated, and why                   |
| pattern    | `docs/architecture/` (only after 3+ independent occurrences) | the repeated shape + evidence                        |
| rfc        | `rfcs/RFC-NNNN-<slug>.md`                                    | `status: draft → published → approved → implemented` |

## Labels that make it queryable

`type`, `status`, `owner`, `date`. Process nodes additionally carry `team`,
`ai-level` (L0–L3), `value` (1–5), `pain` (1–5), `governance`
(internal / sensitive / external); `consumes:` / `produces:` are links to data
assets. value + pain ≥ 8 flags a pilot candidate.

## Naming

- Stages: `NN_kebab-name` (`01_research`). Ordered files: `00-tracker.md`.
- System folders sort first with underscore: `_shared/`, `_system/`,
  `_templates/`, `_archive/`. Underscore = "about the workspace, not of the work."
- Records: kebab-case slugs. Data assets always `data-<thing>.md`.
- Entry file: `AGENTS.md` (agents). No second hand-maintained copy — any
  `CLAUDE.md` is a one-line pointer to `AGENTS.md`, never a drifted duplicate.
- Templates are blank, named for what they produce, live in `_templates/`.
- Generated indexes (`registry/*.json`, `bar/index.json`, `FILE-MAP.md`) are
  rebuilt by script, never hand-edited.
