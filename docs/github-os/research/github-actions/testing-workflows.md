# Testing Workflows — Knowledge Package

## Executive Summary

Testing workflows are the quality gates of CI/CD. They validate that code changes don't introduce regressions across unit, integration, and end-to-end test levels. GitHub Actions supports parallel execution, test sharding, matrix strategies, and service containers for comprehensive testing. This package covers the patterns for building fast, reliable testing pipelines with proper reporting and artifact management.

## Workflow Patterns

### Pattern 1: Layered Testing Pipeline

Unit tests first (fast), integration tests second, E2E tests last (slow).

```yaml
name: Test Suite
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: test-${{ github.ref }}
  cancel-in-progress: true

jobs:
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run test:unit -- --reporter=junit --outputFile=results/unit.xml
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: unit-results
          path: results/unit.xml

  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    timeout-minutes: 15
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  report:
    name: Test Report
    needs: [unit-tests, integration-tests, e2e-tests]
    if: always()
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          path: test-results
      - uses: dorny/test-reporter@v1
        with:
          name: Test Results
          path: "test-results/**/*.xml"
          reporter: java-junit
```

### Pattern 2: Parallel Test Sharding

Split large test suites across multiple runners for faster execution.

```yaml
jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - name: Run shard ${{ matrix.shard }}/4
        run: npx playwright test --shard=${{ matrix.shard }}/4
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-results-${{ matrix.shard }}
          path: test-results/
```

### Pattern 3: Matrix Browser Testing

Test across multiple browsers in parallel.

```yaml
jobs:
  e2e:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx playwright install --with-deps ${{ matrix.browser }}
      - run: npx playwright test --project=${{ matrix.browser }}
```

### Pattern 4: Coverage Gate

Fail the build if coverage drops below thresholds.

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          fail_ci_if_error: true
```

## Best Practices

1. **Separate test types** — Unit tests run fast (seconds), E2E tests are slow (minutes). Don't block fast feedback on slow tests.
2. **Use `fail-fast: false`** on matrix strategies — See all failures, not just the first.
3. **Set `timeout-minutes`** — Prevent hanging tests from consuming runner time indefinitely.
4. **Upload test artifacts on `if: always()`** — Get results even when tests fail.
5. **Use service containers** for databases — `services:` block runs Postgres, Redis, etc. as sidecars.
6. **Shard large suites** — Playwright, Jest, and Pytest all support built-in sharding.
7. **Aggregate results** — Merge JUnit XML reports from parallel shards for a unified view.
8. **Use concurrency groups** — Cancel stale test runs when new commits arrive.
9. **Cache Playwright browsers** — `npx playwright install` is slow; cache the browser binaries.
10. **Separate flaky tests** — Quarantine known-flaky tests so they don't block the pipeline.

## Template

```yaml
name: Tests
on:
  pull_request:
  push:
    branches: [main]

concurrency:
  group: test-${{ github.ref }}
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

  unit:
    name: Unit Tests
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run test:unit --if-present

  integration:
    name: Integration Tests
    runs-on: ubuntu-latest
    timeout-minutes: 15
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run test:integration --if-present
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/test

  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    timeout-minutes: 20
    needs: [lint, unit]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: e2e-report
          path: playwright-report/
          retention-days: 14
```

## Security Considerations

- Never commit test credentials — use GitHub secrets or environment variables.
- Use service containers with non-default passwords in CI.
- Don't expose database ports to the host network unless required.
- Use `GITHUB_TOKEN` with read-only permissions for test jobs.
- Store test artifacts securely — don't upload logs containing secrets.

## Performance

- **Use `npm ci`** for deterministic, fast installs.
- **Cache dependencies** aggressively — `actions/setup-node` with `cache: 'npm'`.
- **Shard tests** — Playwright: `--shard=N/M`; Jest: `--shard` option.
- **Parallel jobs** — Run unit, integration, and E2E tests in parallel.
- **Skip E2E on draft PRs** — Use `if: github.event.pull_request.draft == false`.
- **Use `timeout-minutes`** — Prevent infinite loops from consuming minutes.
- **Cache browser binaries** for Playwright/Cypress.

## Common Pitfalls

- **No `timeout-minutes`** — A hanging test can burn runner minutes for hours.
- **Missing `if: always()` on artifact upload** — You lose test results when tests fail.
- **Flaky tests blocking merge** — Quarantine known-flaky tests instead of retrying endlessly.
- **Not using `fail-fast: false`** — You only see the first failure, not all failures.
- **Forgetting service container health checks** — Tests fail because the database isn't ready.
- **Not aggregating shard results** — Each shard reports independently; you miss the big picture.

## Reusable Ideas for GitHub OS

1. **Reusable test workflow** — `.github/workflows/reusable-test.yml` that accepts `test-command` and `node-version` as inputs.
2. **Shared Playwright setup composite action** — `.github/actions/setup-playwright/action.yml` that installs browsers and caches them.
3. **Test reporter integration** — Use `dorny/test-reporter` for inline PR test results.
4. **Coverage gate reusable workflow** — Centralize coverage thresholds in one workflow.
5. **Quarantine label system** — Use PR labels to skip known-flaky tests.

## Evidence

- **Source**: https://oneuptime.com/blog/post/2026-01-26-testing-workflows-github-actions/view
- **Source**: https://www.plaintest.dev/blog/automated-e2e-testing-github-actions/
- **Source**: https://qaskills.sh/blog/github-actions-testing-ci-cd-guide
- **Date collected**: 2026-08-03
- **Why it matters**: Testing is the highest-value CI stage; poorly configured test pipelines either miss bugs or waste developer time waiting for feedback.
- **Trade-offs**: Parallel sharding is faster but requires more runner minutes; service containers add complexity but enable realistic integration testing.
- **Expected value**: 3-5x faster test feedback with sharding and parallelization; higher confidence with coverage gates.
- **Maintenance burden**: Flaky test quarantine requires ongoing triage; shard balance needs periodic rebalancing.
