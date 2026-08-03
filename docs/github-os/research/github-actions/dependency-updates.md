# Dependency Updates — Knowledge Package

## Executive Summary

Stagnant dependencies accumulate CVEs and technical debt. Automated dependency update tools—Dependabot (GitHub-native) and Renovate (Mend.io)—create PRs to keep dependencies current. The key configuration decisions are grouping strategy, auto-merge policy, scheduling, and rate limiting. This package covers both tools with production-ready configurations that minimize PR noise while maintaining security.

## Workflow Patterns

### Pattern 1: Dependabot Configuration

GitHub-native dependency updates with grouping and auto-merge.

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 10
    reviewers:
      - "platform-team"
    labels:
      - "dependencies"
    groups:
      react-ecosystem:
        patterns:
          - "react*"
          - "@types/react*"
      testing:
        patterns:
          - "jest"
          - "@testing-library/*"
          - "vitest"
      eslint:
        patterns:
          - "eslint*"
          - "@typescript-eslint/*"
    ignore:
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      actions:
        patterns:
          - "*"

  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
```

### Pattern 2: Dependabot Auto-Merge

Automatically merge patch and minor updates after CI passes.

```yaml
# .github/workflows/dependabot-auto-merge.yml
name: Dependabot Auto-Merge
on: pull_request

permissions:
  contents: write
  pull-requests: write

jobs:
  dependabot:
    runs-on: ubuntu-latest
    if: github.event.pull_request.user.login == 'dependabot[bot]'
    steps:
      - name: Fetch Dependabot metadata
        id: metadata
        uses: dependabot/fetch-metadata@v2
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Approve patch updates
        if: steps.metadata.outputs.update-type == 'version-update:semver-patch'
        run: gh pr review --approve "$PR_URL"
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Auto-merge patch and minor updates
        if: |
          steps.metadata.outputs.update-type == 'version-update:semver-patch' ||
          steps.metadata.outputs.update-type == 'version-update:semver-minor'
        run: gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Pattern 3: Renovate Configuration

More granular control with dependency dashboard, intelligent grouping, and fine-grained auto-merge.

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:base", ":preserveSemverRanges"],
  "schedule": ["before 10am on monday"],
  "timezone": "America/New_York",
  "prConcurrentLimit": 10,
  "prHourlyLimit": 4,
  "packageRules": [
    {
      "matchPackagePatterns": ["react*"],
      "groupName": "react-ecosystem"
    },
    {
      "matchPackagePatterns": ["eslint*", "@typescript-eslint/*"],
      "groupName": "linting"
    },
    {
      "matchPackagePatterns": ["jest*", "@testing-library/*", "vitest"],
      "groupName": "testing"
    },
    {
      "matchUpdateTypes": ["patch"],
      "automerge": true,
      "automergeType": "pr"
    },
    {
      "matchUpdateTypes": ["minor"],
      "automerge": true,
      "automergeType": "pr",
      "minimumReleaseAge": "3 days"
    },
    {
      "matchUpdateTypes": ["major"],
      "automerge": false
    }
  ],
  "lockFileMaintenance": {
    "enabled": true,
    "schedule": ["before 6am on monday"]
  }
}
```

### Pattern 4: Renovate GitHub Actions Workflow

Run Renovate on a schedule with GitHub App or self-hosted.

```yaml
name: Renovate
on:
  schedule:
    - cron: "0 0 * * 1"
  workflow_dispatch:

jobs:
  renovate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: renovatebot/github-action@v40
        with:
          token: ${{ secrets.RENOVATE_TOKEN }}
          configurationFile: renovate.json
```

## Best Practices

1. **Group aggressively** — One PR per ecosystem, not one per package. Reduces PR volume 3-5x.
2. **Auto-merge patches** — With comprehensive CI, patch updates are low-risk and high-value.
3. **Use `minimumReleaseAge`** (Renovate) / `cooldown` (Dependabot) — Wait 3 days for new releases to bake.
4. **Weekly schedule** — Daily updates across 80+ dependencies generate too many PRs.
5. **Never auto-merge major versions** — Always require manual review for breaking changes.
6. **Use Dependabot security updates separately** — Security fixes get immediate attention.
7. **Enable lock file maintenance** — Keep lockfiles up to date for deterministic builds.
8. **Set `prConcurrentLimit`** — Prevent overwhelming the review queue.
9. **Use `packageRules` / `groups`** — Organize updates by risk level and ecosystem.
10. **Monitor the dependency dashboard** — Renovate's dashboard issue tracks all pending updates.

## Template

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 15
    groups:
      all-dependencies:
        patterns: ["*"]
    commit-message:
      prefix: "chore(deps)"
    labels:
      - "dependencies"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      all-actions:
        patterns: ["*"]

  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
```

## Security Considerations

- **Dependabot PR workflows cannot read Actions secrets** — Use Dependabot secrets separately.
- **Minimum release age protects against supply chain attacks** — Compromised packages are often unpublished quickly.
- **Never auto-merge without CI** — The test suite is the safety net for automated updates.
- **Review maintainer changes** — A new maintainer on a package is a red flag for auto-merge.
- **Use `deny-licenses`** — Block GPL/AGPL if your project has license restrictions.
- **Monitor for typosquatting** — Grouping reduces exposure; review new dependency additions carefully.

## Performance

- **Weekly schedule** reduces PR noise vs. daily.
- **Grouping** reduces CI runs — one grouped PR triggers one CI run instead of 15.
- **Auto-merge** eliminates manual review for low-risk updates.
- **Lock file maintenance** prevents gradual lockfile drift.

## Common Pitfalls

- **47 open Dependabot PRs** — Symptom of no auto-merge and too-frequent schedule.
- **Auto-merge on major versions** — Can silently break your application.
- **Not using Dependabot secrets** — Auto-merge workflows fail because they can't access tokens.
- **Ignoring the dependency dashboard** — Updates pile up without visibility.
- **Not testing cross-package dependencies** — Monorepo updates can break shared code.

## Reusable Ideas for GitHub OS

1. **Shared Dependabot config** — Organization-level `dependabot.yml` template for all repos.
2. **Auto-merge composite action** — `.github/actions/dependabot-automerge/action.yml` with metadata fetch + approve + merge.
3. **Renovate base config** — Shared `renovate.json` preset for the organization.
4. **Dependency review gate** — Block PRs that introduce high-severity vulnerabilities.
5. **Scheduled security digest** — Weekly summary of dependency updates and security findings.

## Evidence

- **Source**: https://blog.codercops.com/blog/renovate-vs-dependabot-dependency-updates-2026
- **Source**: https://www.iuriio.com/blog/posts/2026/05/dependabot-recent-updates
- **Source**: https://github.com/orgs/community/discussions/176055
- **Date collected**: 2026-08-03
- **Why it matters**: Stagnant dependencies are the #1 source of known vulnerabilities; automation is the only way to keep up.
- **Trade-offs**: Dependabot is simpler but less configurable; Renovate is more powerful but requires more setup.
- **Expected value**: 70-90% reduction in manual dependency update work; continuous CVE remediation.
- **Maintenance burden**: Grouping rules and auto-merge policies need periodic review as the project evolves.
