# Bhavya Foundation — the umbrella

Propose it (`rfcs/`) → build it (`apps/` + `packages/`) → govern it
(`standards/` + `contracts/` + constitution SDK) → ship it (canonical app).

| Hub                 | Form                | Entry                               | Status is                                    |
| ------------------- | ------------------- | ----------------------------------- | -------------------------------------------- |
| `apps/`             | umbrella            | `apps/CONTEXT.md`                   | route exists in `apps/ai-institute/src/app/` |
| `packages/`         | record library      | `packages/CONTEXT.md`               | `contracts/<pkg>/CONTRACT.md`                |
| `rfcs/`             | pipeline            | `rfcs/CONTEXT.md`                   | `status:` frontmatter per RFC                |
| `docs/`, `.ai/`     | knowledge bundle    | `docs/CONTEXT.md`, `.ai/CONTEXT.md` | files on disk                                |
| `registry/`, `bar/` | catalog (generated) | `registry/index.json`               | rebuilt by script                            |

Factory (stable): `_shared/factory-map.md`. Product (per run): RFCs, routes,
releases, curriculum runs. This file points — content lives in each hub.
