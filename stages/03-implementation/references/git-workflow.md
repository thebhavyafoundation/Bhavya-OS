# Git Workflow — Bhavya Foundation

**For Stage 03: Implementation — Branching, commits, PRs.**

---

## Branch Strategy

### Protected Branches

| Branch   | Purpose                | Protection                                 |
| -------- | ---------------------- | ------------------------------------------ |
| `main`   | Production deployments | Required reviews, CI passes, no force push |
| `master` | CI runs, PR target     | Required reviews, CI passes                |

### Feature Branches

```
feat/<slug>           # New feature
fix/<slug>            # Bug fix
refactor/<slug>       # Refactor
docs/<slug>           # Documentation
chore/<slug>          # Maintenance
rfc/<nnnn>-<slug>     # RFC implementation
```

### Naming Examples

- `feat/user-search-api`
- `fix/button-focus-outline`
- `rfc/0014-icm-adoption`
- `docs/architecture-update`

---

## Commit Convention

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type       | Purpose            |
| ---------- | ------------------ |
| `feat`     | New feature        |
| `fix`      | Bug fix            |
| `refactor` | Code restructuring |
| `docs`     | Documentation      |
| `chore`    | Maintenance        |
| `test`     | Tests              |
| `build`    | Build system       |
| `ci`       | CI/CD              |
| `style`    | Formatting         |

### Subject Rules

- Imperative mood: "add" not "added"
- Lowercase first letter
- No period at end
- Max 50 chars

### Examples

```
feat(api): add user search endpoint

fix(ui): resolve button focus outline in dark mode

refactor(auth): extract token validation to shared util

docs(readme): update ICM setup instructions

chore(deps): update TypeScript to 5.4
```

### Footer

- `Closes #123` — Auto-close issue
- `Relates to RFC-0014` — Link RFC
- `Breaking Change: ...` — Breaking changes

---

## Pull Requests

### PR Title

Matches commit subject (first commit or squash).

### PR Description Template

```markdown
## Summary

[What this PR does, in 3 sentences.]

## Changes

- [Change 1]
- [Change 2]

## Testing

- [ ] Typecheck passes
- [ ] Lint passes
- [ ] Tests pass
- [ ] Build passes
- [ ] AntiSlop passes
- [ ] Tokens check passes

## Verification

- [ ] Manual testing done
- [ ] Visual regression checked (if UI)
- [ ] Performance impact assessed

## Related

- Closes #123
- Relates to RFC-0014
```

### PR Requirements

- [ ] All CI gates pass (antislop → lint → typecheck → test → secret-scan → build)
- [ ] No `pnpm antislop` failures
- [ ] No `pnpm tokens:check` failures
- [ ] Conventional commits
- [ ] Linked RFC for architectural changes
- [ ] At least 1 review (2 for architectural)

---

## Merge Strategy

### Squash Merge (Default)

- Squashes all commits into one
- Uses PR title as commit message
- Keeps history clean

### When Not to Squash

- Multi-commit refactors with logical steps
- RFC implementations with distinct phases

---

## Release Process

### Versioning

- Semantic versioning (MAJOR.MINOR.PATCH)
- `main` branch = production
- Tags: `v1.2.3`

### Changelog

- Generated from conventional commits
- `pnpm changelog` (if configured)
- Manual curation for major releases

---

## Hotfixes

### Process

1. Branch from `main`: `hotfix/<slug>`
2. Fix, test, verify
3. PR to `main`
4. Deploy
5. Backport to `master` if needed

---

## References

- `.github/workflows/ci.yml` — CI pipeline
- `.github/workflows/deploy.yml` — Deploy pipeline
- `bhavya-github-workflow` skill — Full workflow
- `CONTRIBUTING.md` — Contribution guide
