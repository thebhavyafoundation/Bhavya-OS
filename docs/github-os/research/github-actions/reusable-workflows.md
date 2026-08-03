# Reusable Workflows — Knowledge Package

## Executive Summary

Reusable workflows eliminate YAML duplication across repositories by defining a pipeline once and calling it from multiple places. They use the `workflow_call` trigger, accept inputs and secrets, and can be invoked cross-repository. This package covers the mechanics of creating, calling, versioning, and testing reusable workflows, plus the decision framework for when to use them vs. composite actions.

## Workflow Patterns

### Pattern 1: Basic Reusable Workflow

Define a reusable workflow with inputs and secrets.

```yaml
# .github/workflows/reusable-ci.yml
name: Reusable CI
on:
  workflow_call:
    inputs:
      node-version:
        type: string
        default: "20"
      test-command:
        type: string
        default: "npm test"
    secrets:
      CODECOV_TOKEN:
        required: false
    outputs:
      coverage:
        description: "Coverage percentage"
        value: ${{ jobs.test.outputs.coverage }}

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: "npm"
      - run: npm ci
      - run: npm run lint --if-present

  test:
    runs-on: ubuntu-latest
    outputs:
      coverage: ${{ steps.test.outputs.coverage }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: "npm"
      - run: npm ci
      - name: Run tests
        id: test
        run: |
          ${{ inputs.test-command }}
          echo "coverage=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')" >> $GITHUB_OUTPUT
      - uses: codecov/codecov-action@v4
        if: secrets.CODECOV_TOKEN != ''
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

### Pattern 2: Calling Reusable Workflows

Invoke a reusable workflow from a caller workflow.

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  ci:
    uses: ./.github/workflows/reusable-ci.yml
    with:
      node-version: "20"
    secrets:
      CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
```

### Pattern 3: Cross-Repository Reusable Workflow

Call a reusable workflow from a different repository.

```yaml
jobs:
  deploy:
    uses: my-org/shared-workflows/.github/workflows/deploy.yml@v1.2.0
    with:
      environment: production
    secrets: inherit
```

### Pattern 4: Matrix with Reusable Workflows

Fan a reusable workflow across a matrix of values.

```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [18, 20, 22]
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: ${{ matrix.node-version }}
```

### Pattern 5: Nested Reusable Workflows

Call a reusable workflow from within another reusable workflow (up to 4 levels).

```yaml
# .github/workflows/pipeline.yml
name: Pipeline
on:
  workflow_call:

jobs:
  build:
    uses: ./.github/workflows/reusable-build.yml

  test:
    needs: build
    uses: ./.github/workflows/reusable-test.yml

  deploy:
    needs: test
    uses: ./.github/workflows/reusable-deploy.yml
```

## Best Practices

1. **Version reusable workflows** — Use tags (`@v1.2.0`) or specific branches (`@main`), not floating references.
2. **Document inputs and outputs** — Clear descriptions prevent misuse.
3. **Use `secrets: inherit`** — Pass all secrets from caller to avoid explicit mapping.
4. **Keep workflows focused** — One reusable workflow per concern (CI, deploy, release).
5. **Test reusable workflows** — Use a dedicated test repository before deploying widely.
6. **Use descriptive names** — The `name:` field shows in the GitHub UI.
7. **Set default values** — Sensible defaults reduce caller complexity.
8. **Limit nesting depth** — Maximum 4 levels; keep it flat when possible.
9. **Use `workflow_dispatch` alongside `workflow_call`** — Allow manual triggering for debugging.
10. **Maintain a centralized workflows repository** — Single source of truth for shared pipelines.

## Template

```yaml
# .github/workflows/reusable-template.yml
name: Reusable Template
on:
  workflow_call:
    inputs:
      node-version:
        description: "Node.js version"
        type: string
        default: "20"
      run-tests:
        description: "Whether to run tests"
        type: boolean
        default: true
    secrets:
      DEPLOY_TOKEN:
        required: false
    outputs:
      result:
        description: "Pipeline result"
        value: ${{ jobs.main.outputs.result }}

jobs:
  main:
    runs-on: ubuntu-latest
    outputs:
      result: ${{ steps.output.outputs.result }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: "npm"
      - run: npm ci
      - run: npm run lint --if-present
      - run: npm test --if-present
        if: inputs.run-tests
      - run: npm run build --if-present
      - name: Set output
        id: output
        run: echo "result=success" >> $GITHUB_OUTPUT
```

## Security Considerations

- **Reusable workflows can access caller's GITHUB_TOKEN** — Set minimal permissions.
- **Cross-repo workflows require explicit access** — The target repo must allow access.
- **Don't pass secrets as inputs** — Use `secrets:` block or `secrets: inherit`.
- **Pin to SHA for maximum security** — Prevents supply chain attacks via tag manipulation.
- **Limit `secrets: inherit` scope** — Only pass what's needed, not all secrets.
- **Review workflow permissions** — Reusable workflows inherit the caller's token scope.

## Performance

- **Reusable workflows add no overhead** — They run as regular jobs.
- **Shared caching** — Reusable workflows can share cache keys across repositories.
- **Parallel execution** — Multiple jobs in a reusable workflow run in parallel by default.
- **Reduce YAML size** — Smaller workflow files are faster to parse and review.

## Common Pitfalls

- **Environment variables don't pass between caller and reusable workflow** — Use inputs/outputs instead.
- **Maximum 20 reusable workflow calls per workflow** — Including nested calls.
- **`env` context not available in reusable workflows** — Must pass as inputs.
- **Can't add steps after calling a reusable workflow** — The job is consumed by the call.
- **Subdirectories not supported** — Reusable workflows must be in `.github/workflows/` directly.
- **Cross-repo pinning is fragile** — Composite actions within reusable workflows don't inherit the pin.

## Reusable Ideas for GitHub OS

1. **Centralized reusable CI** — `my-org/shared-workflows/.github/workflows/ci.yml@main` for all repos.
2. **Reusable deploy workflow** — Standardized deployment with environment protection.
3. **Reusable security workflow** — CodeQL + dependency review as a shared pipeline.
4. **Reusable release workflow** — semantic-release integration as a callable workflow.
5. **Workflow testing repository** — Dedicated repo to test reusable workflows before deployment.

## Evidence

- **Source**: https://www.incredibuild.com/blog/best-practices-to-create-reusable-workflows-on-github-actions
- **Source**: https://matheusthurler.com.br/posts/reusable-workflows-github-actions
- **Source**: https://docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations
- **Date collected**: 2026-08-03
- **Why it matters**: Copy-pasted YAML across repositories is a maintenance nightmare; reusable workflows centralize pipeline logic.
- **Trade-offs**: Reusable workflows are powerful but have strict limitations (nesting depth, env passing); composite actions are simpler but can't use secrets natively.
- **Expected value**: 60-80% reduction in workflow YAML across repositories; single point of maintenance.
- **Maintenance burden**: Versioning and testing reusable workflows requires discipline; breaking changes affect all consumers.
