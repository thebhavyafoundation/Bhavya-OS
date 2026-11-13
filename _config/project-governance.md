# Project Governance — Precedence & Human Gates

## Constitutional Authority Order

1. `docs/constitution/00-VISION.md` — supreme; conflicts: lower number wins (00 §5.4).
2. `docs/constitution/01`–`09` — lower-numbered documents.
3. `AGENTS.md` — L0 router + ICM workspace identity.
4. `CONTEXT.md` chain and domain hub `CONTEXT.md` files.
5. `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md` + `docs/architecture/DOMAIN_OWNERSHIP.md`.
6. `contracts/<pkg>/CONTRACT.md`, `standards/`, `_shared/factory-map.md`, `_system/schema.md`.
7. Installed skills under `.opencode/skills/`.
8. Implementation (code) — never higher than the docs above.

## Separate Legal/Trust Set

`@bhavya/constitution` SDK loads `_archive/constitution-2026-09-05/` (legacy 15-doc set). Do not merge with or cross-cite `docs/constitution/`.

## Conflict Resolution

If two authorities conflict and this order does not resolve it: **stop → record → human gate.** Never silently rewrite either authority.

## Human Gates (require explicit human authorization)

- Constitutional amendments.
- Brand / token authority changes (including resolving 01 vs 05 vs `tokens.css`).
- Auth stores and protected data.
- Commit, push, deploy, rollback.
- Destructive deletion.
- Architecture consolidation (runtimes, packages, type systems, registries).

Ordinary research, implementation, local verification, and task-authorized doc edits may proceed without extra checkpoints.
