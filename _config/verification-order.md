# Verification Order & Commands

inspect → identify authority → plan → implement → static review → `pnpm typecheck` → `pnpm lint` → `pnpm test` → `pnpm build` → applicable gates → `git diff --check` → `git status` → report with command evidence.

Only claim gates that exist in root `package.json`. Unverified "done" is not done.

## Commands

**Verify:** `pnpm typecheck` · `pnpm lint` · `pnpm test` · `pnpm build`

**Gates:** `pnpm antislop` · `pnpm tokens:check` · `pnpm file-map:check` · `pnpm registry:check` · `pnpm drift:check` · `pnpm validate` · `pnpm format`

**Generate (never hand-edit outputs):** `pnpm file-map` · `pnpm registry:generate` · `pnpm tokens:sync`

## CI

`.github/workflows/ci.yml` on branch **`master`**: antislop + lint + typecheck, test, secret-scan, then build.
`deploy.yml` targets **`main`** — push ≠ deploy (wiring mismatch is known; do not "fix" by deploying).
