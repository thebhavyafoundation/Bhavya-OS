# Release Workflows — Knowledge Package

## Executive Summary

Release automation eliminates manual version bumping, changelog generation, and artifact publishing. By combining semantic versioning with automated workflows, teams achieve consistent, repeatable releases. This package covers three major approaches: semantic-release (commit-driven), Changesets (PR-driven), and release-please (Google's hybrid), plus manual tag-based releases. Each pattern includes workflow YAML, configuration, and trade-off analysis.

## Workflow Patterns

### Pattern 1: Semantic Release (Fully Automated)

Analyzes conventional commits to determine version bumps, generates changelogs, creates GitHub releases, and publishes to registries.

```yaml
name: Release
on:
  push:
    branches: [main]

permissions:
  contents: write
  issues: write
  pull-requests: write
  packages: write

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          persist-credentials: false

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - run: npm ci

      - name: Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npx semantic-release
```

### Pattern 2: Changesets (PR-Driven)

Creates a "Version Packages" PR that accumulates changes. Maintainers review before release.

```yaml
name: Release
on:
  push:
    branches: [main]

jobs:
  release:
    permissions:
      contents: write
      pull-requests: write
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - name: Create Release PR or Publish
        uses: changesets/action@v1
        with:
          publish: npx changeset publish
          title: "chore(release): version packages"
          commit: "chore(release): version packages"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Pattern 3: Release Please (Google's Hybrid)

Reads conventional commits, creates a release PR with changelog, then publishes on merge.

```yaml
name: Release
on:
  push:
    branches: [main]

permissions:
  contents: write
  pull-requests: write

jobs:
  release-please:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        id: release
        with:
          release-type: node

      - uses: actions/checkout@v4
        if: ${{ steps.release.outputs.release_created }}
      - uses: actions/setup-node@v4
        if: ${{ steps.release.outputs.release_created }}
        with:
          node-version: "20"
          registry-url: "https://registry.npmjs.org"
      - run: npm ci
        if: ${{ steps.release.outputs.release_created }}
      - run: npm publish
        if: ${{ steps.release.outputs.release_created }}
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Pattern 4: Tag-Based Release with Changelog

Triggered by version tags, generates changelog, builds, and publishes.

```yaml
name: Release
on:
  push:
    tags:
      - "v*"

permissions:
  contents: write
  packages: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - run: npm ci
      - run: npm test
      - run: npm run build

      - name: Generate changelog
        id: changelog
        uses: TriPSs/conventional-changelog-action@v5
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          output-file: "false"
          skip-version-file: true
          skip-commit: true
          skip-tag: true

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          body: ${{ steps.changelog.outputs.clean_changelog }}
          files: dist/*
```

## Best Practices

1. **Adopt Conventional Commits** — `feat:`, `fix:`, `chore:`, `BREAKING CHANGE:` drive automated versioning.
2. **Gate releases on CI passing** — Never release untested code.
3. **Use `fetch-depth: 0`** — Full git history is required for changelog generation.
4. **Separate release from CI** — Use `workflow_run` or tag triggers to decouple.
5. **Sign releases** — Use GPG signing or Sigstore for supply chain integrity.
6. **Test before publishing** — Run the full test suite before publishing artifacts.
7. **Use `persist-credentials: false`** — Avoid token leakage in checkout steps.
8. **Auto-generate changelogs** — Never write changelogs by hand.
9. **Use environment protection rules** — Require manual approval for production releases.
10. **Tag with semantic versions** — `v1.2.3` enables automated tooling integration.

## Template

```yaml
name: Release
on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      dry-run:
        description: "Perform dry run"
        required: false
        default: "false"
        type: boolean

permissions:
  contents: write
  packages: write
  issues: write
  pull-requests: write

jobs:
  ci:
    uses: ./.github/workflows/reusable-ci.yml

  release:
    needs: ci
    runs-on: ubuntu-latest
    if: ${{ !inputs.dry-run || inputs.dry-run == 'false' }}
    environment: production
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          persist-credentials: false

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - run: npm ci

      - name: Semantic Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: npx semantic-release
```

## Security Considerations

- Use `GITHUB_TOKEN` with minimal permissions — never `write-all`.
- Sign commits and tags with GPG or Sigstore for verification.
- Never publish with embedded secrets — use OIDC where possible (npm provenance).
- Audit release artifacts — include checksums and signatures.
- Protect release branches with branch protection rules.
- Use `environment: production` with required reviewers for manual approval gates.

## Performance

- **Cache dependencies** before building release artifacts.
- **Skip release if no releasable changes** — semantic-release exits early if no commits warrant a release.
- **Use `workflow_run`** to trigger release after CI completes, avoiding redundant test runs.
- **Build once, deploy many** — Upload build artifacts in CI, download them in the release job.

## Common Pitfalls

- **Forgetting `fetch-depth: 0`** — Changelogs will be empty or incorrect.
- **Missing permissions** — Release fails with 403 when `contents: write` is not set.
- **Releasing from feature branches** — Always gate releases on main branch merges only.
- **Conflicting tools** — Don't use semantic-release AND changesets on the same repo.
- **No test gate** — Releasing untested code creates broken releases.
- **Overwriting CHANGELOG.md** — Some tools have conflicts when multiple plugins write to the same file.

## Reusable Ideas for GitHub OS

1. **Reusable release workflow** — `.github/workflows/reusable-release.yml` with `workflow_call` that handles version bump, changelog, and publish.
2. **Changeset integration** — Use `@changesets/cli` for coordinated versioning across multiple packages.
3. **Release approval gate** — Use GitHub environments with required reviewers for production releases.
4. **Automated GitHub Release notes** — Use `softprops/action-gh-release` with auto-generated body from conventional commits.
5. **npm provenance** — Enable `--provenance` flag for supply chain attestation.

## Evidence

- **Source**: https://github.com/semantic-release/semantic-release
- **Source**: https://oneuptime.com/blog/post/2026-02-02-github-actions-release-automation/view
- **Source**: https://opencitations.github.io/repository_setup_guides/ci_cd/releases/
- **Date collected**: 2026-08-03
- **Why it matters**: Manual releases are error-prone; automation ensures consistency and eliminates human mistakes in versioning and publishing.
- **Trade-offs**: semantic-release is fully automated but requires conventional commits; Changesets gives control but creates PR noise; release-please is a middle ground.
- **Expected value**: Zero manual release steps, consistent versioning, auto-generated changelogs.
- **Maintenance burden**: Requires adoption of conventional commits discipline; tooling versions need periodic updates.
