---
name: bhavya-github-workflow
description: Follow Bhavya GitHub workflow conventions. Use before committing, pushing, creating PRs, or managing branches.
compatibility: opencode
---

# Bhavya GitHub Workflow Skill

## Purpose

Ensure consistent Git workflow across the Bhavya Foundation repository.

## Canonical Workflow

```
INSPECT → BRANCH → PLAN → IMPLEMENT → TEST → REVIEW → COMMIT → PUSH → CI → VERIFY → MERGE
```

## Branch Naming

Use descriptive branch names:
- `feat/feature-name` — New features
- `fix/bug-description` — Bug fixes
- `chore/task-description` — Maintenance tasks
- `docs/doc-topic` — Documentation changes

## Commit Messages

Follow conventional commits:
- `feat(scope): description` — New features
- `fix(scope): description` — Bug fixes
- `chore(scope): description` — Maintenance
- `docs(scope): description` — Documentation
- `refactor(scope): description` — Code refactoring
- `test(scope): description` — Test additions/changes

Scope examples: `auth`, `design-system`, `api`, `database`, `ui`, `security`, `runtime`

## Pre-Commit Checklist

Before committing:

1. **Inspect git diff** — Review every changed file
2. **Run typecheck** — `pnpm typecheck`
3. **Run lint** — `pnpm lint`
4. **Run tests** — `pnpm test`
5. **Check for secrets** — Never commit `.env`, credentials, tokens, or private keys
6. **Check for generated files** — Never commit `node_modules/`, `.next/`, build artifacts
7. **Verify imports** — All imports resolve correctly
8. **Update documentation** — If architecture changed, update relevant docs

## Never Commit

- `.env` files
- Credentials or API tokens
- Private keys
- Local secrets
- `node_modules/`
- `.next/` build output
- Generated junk files
- Large binary files

## CI Pipeline

GitHub Actions runs on push to `main` and PRs to `main`:

1. **lint-and-typecheck** — `pnpm lint` + `pnpm typecheck`
2. **secret-scan** — Gitleaks + pattern-based detection
3. **test** — `pnpm test`
4. **build** — `pnpm build` (depends on lint+typecheck and test)

## PR Guidelines

- PRs target `main` branch
- PRs should be focused (one feature/fix per PR)
- PR description should explain what and why
- All CI checks must pass before merge
- Review required before merge
