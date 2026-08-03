# Static Analysis — Knowledge Package

## Executive Summary

Static analysis enforces code quality standards automatically—catching style violations, type errors, and code smells before they reach code review. GitHub Actions integrates with ESLint, Prettier, Ruff, MyPy, golangci-lint, actionlint, and SonarQube to create comprehensive linting pipelines. This package covers the patterns for multi-language linting, result reporting, and quality gates.

## Workflow Patterns

### Pattern 1: JavaScript/TypeScript Linting

ESLint + Prettier + TypeScript check in a single job.

```yaml
name: Lint
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Lint & Format
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - name: ESLint
        run: npx eslint . --ext .js,.jsx,.ts,.tsx --max-warnings 0
      - name: Prettier
        run: npx prettier --check "src/**/*.{js,jsx,ts,tsx,json,css,md}"
      - name: TypeScript
        run: npx tsc --noEmit
```

### Pattern 2: Multi-Language Linting Pipeline

Parallel linting jobs for JavaScript, Python, and Go.

```yaml
name: Code Quality
on:
  push:
    branches: [main]
  pull_request:

jobs:
  javascript:
    name: JS/TS Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx eslint . --ext .js,.ts --max-warnings 0
      - run: npx prettier --check "src/**/*.{js,ts,json}"

  python:
    name: Python Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install ruff mypy
      - run: ruff check .
      - run: ruff format --check .
      - run: mypy . --ignore-missing-imports

  golang:
    name: Go Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: stable
      - uses: golangci/golangci-lint-action@v6
        with:
          version: latest
```

### Pattern 3: ESLint with SARIF Annotations

Upload lint results as SARIF for inline PR annotations.

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - name: Install SARIF formatter
        run: npm install --no-save @microsoft/eslint-formatter-sarif
      - name: Run ESLint
        run: |
          npx eslint . --ext .js,.ts \
            --format @microsoft/eslint-formatter-sarif \
            --output-file eslint-results.sarif
        continue-on-error: true
      - uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: eslint-results.sarif
```

### Pattern 4: ESLint with Caching

Use ESLint's cache to only re-lint changed files.

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - name: Cache ESLint
        uses: actions/cache@v4
        with:
          path: .eslintcache
          key: eslint-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**/*.js', '**/*.ts') }}
          restore-keys: |
            eslint-${{ hashFiles('**/package-lock.json') }}-
            eslint-
      - run: npm ci
      - run: npx eslint . --ext .js,.ts --cache --cache-location .eslintcache --max-warnings 0
```

### Pattern 5: GitHub Actions Linting with actionlint

Validate workflow files themselves.

```yaml
jobs:
  actionlint:
    name: Lint Workflows
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run actionlint
        run: |
          bash <(curl https://raw.githubusercontent.com/rhysd/actionlint/main/scripts/download-actionlint.bash)
          ./actionlint -color
```

### Pattern 6: SonarQube Integration

Enterprise-grade static analysis with quality gates.

```yaml
jobs:
  sonarqube:
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
      - name: SonarQube Scan
        uses: SonarSource/sonarqube-scan-action@v4
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

## Best Practices

1. **Use `--max-warnings 0`** — Treat warnings as errors in CI to maintain strict quality.
2. **Cache linting results** — ESLint's `--cache` flag skips unchanged files.
3. **Run linting in parallel** — Separate jobs for JS, Python, Go finish faster.
4. **Use SARIF format** — Upload results to GitHub's Security tab for inline annotations.
5. **Lint workflow files** — Use `actionlint` to catch GitHub Actions syntax errors.
6. **Use `continue-on-error: true`** for SARIF upload — Don't fail CI if upload fails.
7. **Separate formatting from linting** — Prettier for formatting, ESLint for logic.
8. **Use `ruff` for Python** — 10-100x faster than traditional Python linters.
9. **Set up path filters** — Only lint changed languages in monorepos.
10. **Enforce with branch protection** — Make lint checks required status checks.

## Template

```yaml
name: Code Quality
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: lint-${{ github.ref }}
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
      - run: npx prettier --check "src/**/*.{js,ts,json}" --if-present

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx tsc --noEmit

  workflow-lint:
    name: Lint Workflows
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run actionlint
        run: |
          bash <(curl https://raw.githubusercontent.com/rhysd/actionlint/main/scripts/download-actionlint.bash)
          ./actionlint -color
```

## Security Considerations

- Linting itself has low security risk, but SARIF uploads require `security-events: write`.
- Don't install untrusted linters from npm — verify package authenticity.
- Use `--max-warnings 0` to prevent suppressed warnings from hiding issues.
- Review ESLint plugin updates — plugins can introduce new rules that break CI.

## Performance

- **ESLint cache** (`--cache`) skips unchanged files — 50-80% faster on incremental changes.
- **`ruff` for Python** — 10-100x faster than flake8/pylint.
- **Parallel jobs** — Run JS, Python, Go linting simultaneously.
- **Path filters** — Skip linting for docs-only changes.
- **`timeout-minutes`** — Prevent hanging linters from consuming runner time.

## Common Pitfalls

- **Forgetting `--max-warnings 0`** — Warnings slip through and accumulate.
- **Not caching ESLint** — Every run re-lints all files from scratch.
- **Mixed Prettier + ESLint config** — Conflicting rules cause confusing errors.
- **Not linting workflow files** — GitHub Actions YAML errors break CI silently.
- **Overly strict rules in CI** — Rules that are too strict get disabled, defeating the purpose.

## Reusable Ideas for GitHub OS

1. **Reusable lint workflow** — `.github/workflows/reusable-lint.yml` with language detection.
2. **Shared ESLint config** — Organization-wide `.eslintrc` as a shared package.
3. **Linting composite action** — `.github/actions/lint/action.yml` that runs all linters.
4. **SARIF reporting** — Standardize SARIF upload across all analysis tools.
5. **actionlint in every repo** — Validate workflow files as part of CI.

## Evidence

- **Source**: https://oneuptime.com/blog/post/2025-12-20-linting-pipeline-github-actions/view
- **Source**: https://github.com/rhysd/actionlint
- **Source**: https://devtoollab.com/blog/github-actions-best-practices
- **Date collected**: 2026-08-03
- **Why it matters**: Static analysis catches bugs and style issues automatically, freeing reviewers to focus on logic and architecture.
- **Trade-offs**: Strict rules slow down development; lax rules let quality degrade. The right balance depends on team maturity.
- **Expected value**: 30-50% reduction in code review time; consistent code style across the codebase.
- **Maintenance burden**: Linter configs need periodic updates as tools and standards evolve.
