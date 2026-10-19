# Git hook wiring: Husky and Git LFS

Status: verified defect on `master` (observed 2026-10-19).

## Symptom

Two different symptoms appear in different clones of the same repository:

- **Ponytail gates never run.** `.husky/_` contains only Git LFS hooks; Husky's
  runtime files `husky.sh` and `h` are gone.
- **Git LFS objects may not upload.** `.husky/_/pre-push` is the 39-byte Husky
  shim, so `git lfs pre-push` never executes for `.glb`, `.gltf`, `.blend`, or
  `.zip` assets.

Neither clone reports an error. One tool silently destroys the other.

## Root cause

Husky v9 sets `core.hooksPath` to `.husky/_` and writes its shims there.
`git lfs install` also installs its hooks into `core.hooksPath`.

Both therefore write `.husky/_/pre-push`. The installer that runs last wins, and
the other's file is replaced without warning.

`core.hooksPath` is resolved **per worktree**, so a repository can be healthy in
one worktree and broken in another at the same time.

Evidence:

| Worktree | `.husky/_` contents | Husky | LFS `pre-push` |
| --- | --- | --- | --- |
| `D:\Bhavya OS` | `h`, `husky.sh`, 14 shims | working | **missing** |
| `D:\Bhavya-OS-wt\wt-release` | 4 LFS hooks only | **broken** | present |

## Why this matters

- **Enforcement gap.** A broken Husky runtime means the Ponytail pre-push gate
  silently does not run. Nothing fails loudly; the gate is simply absent.
- **Data-integrity risk.** A missing LFS `pre-push` means large binary assets
  can be pushed without their LFS objects being uploaded, leaving pointers that
  cannot be resolved on clone.

## Fix

Do not let the two tools share the hooks directory.

1. Install LFS filters **without** hooks: `git lfs install --manual`.
2. Let Husky own `.husky/_` exclusively.
3. Any tracked `.husky/pre-push` must then call `git lfs pre-push` explicitly to
   preserve LFS upload.

Run the bundled setup script, which performs steps 1 and 2 and then verifies the
result:

```bash
pnpm hooks:setup
```

Verify only, without changing anything:

```bash
pnpm hooks:check
```

## Follow-up required

`--manual` removes the LFS hook, so the tracked `.husky/pre-push` must restore the
LFS upload behaviour by invoking it. That file belongs to the Ponytail pre-push
gate workstream (`.husky/pre-push` on `feat/ponytail-pre-push-gate`), so it is
deliberately **not** changed here to keep this repair separate.

The required addition to that file is a single line:

```sh
git lfs pre-push "$@"
```

Until that lands, `pnpm hooks:check` reports a warning.

## Scope

This branch touches hook wiring and diagnostics only:

- `scripts/setup-git-hooks.mjs`
- `docs/tools/hooks/HOOK-WIRING.md`
- `.gitignore` (ignore generated `.husky/_`)
- `package.json` (`hooks:setup`, `hooks:check`)

It does not modify `.husky/pre-push`, any gate script, application code, or
constitutional documents.