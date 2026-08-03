# CI Workflows — Knowledge Package

## Executive Summary

Continuous Integration (CI) workflows are the backbone of modern software delivery. They automatically validate every code change through linting, testing, and building, catching regressions before they reach production. GitHub Actions provides a native, event-driven CI platform with deep integration into the GitHub ecosystem. This package covers the patterns, templates, and best practices for building reliable CI pipelines that provide fast feedback loops while maintaining code quality gates.

## Workflow Patterns

### Pattern 1: Simple Test & Build Pipeline

The most fundamental CI pattern for libraries and small web applications.

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-artifact
          path: dist/
```

### Pattern 2: Matrix Build

Test across multiple language versions, OS environments, or dependency combinations.

```yaml
name: Matrix Build
on:
  pull_request:
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        node-version: [18, 20, 22]
        os: [ubuntu-latest, windows-latest, macos-latest]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
```

### Pattern 3: Multi-Language Parallel CI

Run linting and testing for multiple languages in parallel.

```yaml
name: Multi-Language CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  javascript:
    name: JavaScript/TypeScript
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx eslint . --ext .js,.ts --max-warnings 0
      - run: npx prettier --check .
      - run: npm test

  python:
    name: Python
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install ruff mypy pytest
      - run: ruff check .
      - run: mypy . --ignore-missing-imports
      - run: pytest

  golang:
    name: Go
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: stable
      - uses: golangci/golangci-lint-action@v6
      - run: go test ./...
```

### Pattern 4: Concurrency Controls

Cancel in-progress runs when new commits arrive to save compute.

```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # ...
```

## Best Practices

1. **Use `npm ci` over `npm install`** — `npm ci` is faster, deterministic, and uses the lockfile exactly.
2. **Enable dependency caching** — Use `cache: 'npm'` in `actions/setup-node` or `actions/cache` for other ecosystems.
3. **Set `fail-fast: false`** on matrix strategies to see all failures, not just the first.
4. **Use `needs:` to create dependency graphs** — Don't run builds if tests fail.
5. **Set workflow-level permissions** — Follow principle of least privilege.
6. **Use concurrency groups** — Cancel outdated runs to save minutes.
7. **Upload test artifacts** — Use `actions/upload-artifact` for test results and coverage reports.
8. **Pin action versions** — Use specific versions (e.g., `@v4`) or SHA pins for supply chain security.
9. **Run lint and test in parallel** — Independent jobs finish faster than sequential steps.
10. **Keep workflows focused** — One workflow per concern (CI, deploy, release).

## Template

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run lint --if-present

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm test --if-present
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: coverage/

  build:
    name: Build
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run build --if-present
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: dist/
```

## Security Considerations

- Always set `permissions` at the workflow level with minimal required scopes.
- Pin actions to SHA or specific version tags, not floating `@main`.
- Never echo secrets in logs — use `::add-mask::` if needed.
- Use `GITHUB_TOKEN` instead of personal access tokens where possible.
- Enable Dependabot for action version updates.
- Review third-party actions before use — check source code and maintainer reputation.

## Performance

- **Cache dependencies**: `actions/setup-node` with `cache: 'npm'` cuts install time by 50-80%.
- **Parallelize jobs**: Run lint, test, and build as separate parallel jobs.
- **Use `npm ci`** instead of `npm install` for faster, deterministic installs.
- **Concurrency groups**: Cancel stale runs automatically.
- **Shard tests**: Split large test suites across multiple runners using matrix strategies.
- **Selective execution**: Use path filters to skip CI for docs-only changes.

## Common Pitfalls

- **Missing `fetch-depth: 0`** — Shallow clones break changelog generation and some tools.
- **Using `npm install` instead of `npm ci`** — Non-deterministic, slower, ignores lockfile.
- **No concurrency controls** — Wasting compute on outdated runs.
- **Overly broad permissions** — `permissions: write-all` exposes unnecessary attack surface.
- **Hardcoded secrets** — Never embed credentials in workflow files.
- **Skipping caching** — Every run re-downloads all dependencies from scratch.
- **Using `if: always()` incorrectly** — Can mask failures in dependent jobs.

## Reusable Ideas for GitHub OS

1. **Centralized CI workflow** — Create `.github/workflows/reusable-ci.yml` with `workflow_call` that all repositories can invoke.
2. **Shared composite action for setup** — `.github/actions/setup-project/action.yml` that installs the right runtime, caches dependencies, and runs linting.
3. **Matrix testing across Node/Python/Go** — Parallel jobs per language with shared caching.
4. **Path-based filtering** — Use `dorny/paths-filter` to skip CI for documentation-only changes.
5. **Reusable build action** — Package the build + artifact upload into a composite action.

## Evidence

- **Source**: https://zenn.dev/shineos/articles/github-actions-cicd-patterns
- **Source**: https://dev.to/datanestdigital/github-actions-workflows-github-actions-patterns-best-practices-pge
- **Source**: https://docs.github.com/en/actions/tutorials/create-an-example-workflow
- **Date collected**: 2026-08-03
- **Why it matters**: CI is the first line of defense for code quality; poorly configured CI wastes developer time and misses bugs.
- **Trade-offs**: Parallel jobs are faster but consume more runner minutes; matrix builds provide compatibility guarantees but multiply cost.
- **Expected value**: 50-70% faster feedback loops with proper caching and parallelization.
- **Maintenance burden**: Workflow files need periodic updates as action versions and runtime versions change.
