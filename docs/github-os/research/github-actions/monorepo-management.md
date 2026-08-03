# Monorepo Management — Knowledge Package

## Executive Summary

Monorepos contain multiple packages, services, or applications in a single repository. Naive CI runs everything on every change—wasting time and compute. Effective monorepo CI uses path filtering, dependency-aware builds (Turborepo, Nx), and dynamic matrix strategies to run only what changed. This package covers the patterns for selective CI execution, shared workflows, and monorepo-specific optimizations.

## Workflow Patterns

### Pattern 1: Path Filtering with dorny/paths-filter

Detect which directories changed and conditionally run jobs.

```yaml
name: Monorepo CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  changes:
    name: Detect Changes
    runs-on: ubuntu-latest
    outputs:
      frontend: ${{ steps.filter.outputs.frontend }}
      backend: ${{ steps.filter.outputs.backend }}
      shared: ${{ steps.filter.outputs.shared }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2
      - uses: dorny/paths-filter@v3
        id: filter
        with:
          filters: |
            frontend:
              - 'packages/frontend/**'
              - 'packages/shared/**'
            backend:
              - 'packages/backend/**'
              - 'packages/shared/**'
            shared:
              - 'packages/shared/**'

  frontend:
    name: Frontend CI
    needs: changes
    if: needs.changes.outputs.frontend == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run test --workspace=packages/frontend
      - run: npm run build --workspace=packages/frontend

  backend:
    name: Backend CI
    needs: changes
    if: needs.changes.outputs.backend == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run test --workspace=packages/backend
      - run: npm run build --workspace=packages/backend
```

### Pattern 2: Turborepo Affected Builds

Use Turborepo's `--affected` flag to build only changed packages and their dependents.

```yaml
name: Turborepo CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  ci:
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
      - name: Build affected packages
        run: npx turbo run build --affected
      - name: Test affected packages
        run: npx turbo run test --affected
      - name: Lint affected packages
        run: npx turbo run lint --affected
```

### Pattern 3: Nx Affected Commands

Use Nx's project graph and affected analysis for large monorepos.

```yaml
name: Nx CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: nrwl/nx-set-shas@v5
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - name: Lint affected
        run: npx nx affected -t lint --base=${{ env.NX_BASE }} --head=${{ env.NX_HEAD }}
      - name: Test affected
        run: npx nx affected -t test --base=${{ env.NX_BASE }} --head=${{ env.NX_HEAD }}
      - name: Build affected
        run: npx nx affected -t build --base=${{ env.NX_BASE }} --head=${{ env.NX_HEAD }}
```

### Pattern 4: Shared Reusable Workflow for Packages

A single reusable workflow that each package calls.

```yaml
# .github/workflows/package-ci.yml
name: Package CI
on:
  workflow_call:
    inputs:
      package-name:
        required: true
        type: string
      node-version:
        required: false
        type: string
        default: "20"

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: "npm"
      - run: npm ci
      - run: npm run build --workspace=packages/${{ inputs.package-name }}
      - run: npm run test --workspace=packages/${{ inputs.package-name }}
      - run: npm run lint --workspace=packages/${{ inputs.package-name }}
```

```yaml
# .github/workflows/frontend-ci.yml
name: Frontend CI
on:
  push:
    branches: [main]
    paths:
      - "packages/frontend/**"
      - "packages/shared/**"
jobs:
  ci:
    uses: ./.github/workflows/package-ci.yml
    with:
      package-name: frontend
```

### Pattern 5: Dynamic Matrix from Changed Files

Detect changed services and create a dynamic matrix.

```yaml
name: Service CI
on:
  push:
    branches: [main]

jobs:
  detect:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - id: set-matrix
        run: |
          CHANGED=$(git diff --name-only HEAD~1 | grep '^services/' | cut -d'/' -f2 | sort -u | jq -R . | jq -sc .)
          echo "matrix={\"service\":$CHANGED}" >> $GITHUB_OUTPUT

  test:
    needs: detect
    if: needs.detect.outputs.matrix != '[]'
    runs-on: ubuntu-latest
    strategy:
      matrix: ${{ fromJson(needs.detect.outputs.matrix) }}
    steps:
      - uses: actions/checkout@v4
      - run: cd services/${{ matrix.service }} && npm ci && npm test
```

## Best Practices

1. **Use path filters** — Don't trigger CI for unchanged packages.
2. **Include shared dependencies** — If `packages/shared/` changes, test all dependents.
3. **Use `fetch-depth: 2`** — Path filters need at least one previous commit to diff.
4. **Always include `.github/` in filters** — Workflow file changes should trigger re-evaluation.
5. **Use Turborepo or Nx for 5+ packages** — Manual path maintenance doesn't scale.
6. **Cache aggressively** — Each package needs its own cache key.
7. **Run affected-only on PRs, full builds on main** — PR feedback should be fast.
8. **Use status jobs** — Required checks need a job that always runs, even when filtered jobs are skipped.
9. **Keep dependencies explicit** — Document which packages depend on which.
10. **Use workspace protocols** — `workspace:*` for internal dependencies.

## Template

```yaml
name: Monorepo CI
on:
  push:
    branches: [main]
  pull_request:

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  changes:
    runs-on: ubuntu-latest
    outputs:
      packages: ${{ steps.changes.outputs.changes }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2
      - uses: dorny/paths-filter@v3
        id: changes
        with:
          filters: |
            frontend:
              - 'packages/frontend/**'
            backend:
              - 'packages/backend/**'
            shared:
              - 'packages/shared/**'

  frontend:
    needs: changes
    if: needs.changes.outputs.packages contains 'frontend'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run test --workspace=packages/frontend
      - run: npm run build --workspace=packages/frontend

  backend:
    needs: changes
    if: needs.changes.outputs.packages contains 'backend'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run test --workspace=packages/backend

  status:
    if: always()
    needs: [changes, frontend, backend]
    runs-on: ubuntu-latest
    steps:
      - name: Check results
        run: |
          if [ "${{ needs.frontend.result }}" = "failure" ] || [ "${{ needs.backend.result }}" = "failure" ]; then
            exit 1
          fi
```

## Security Considerations

- Path filters can be bypassed by editing workflow files — always include `.github/` in filters.
- Shared workflows reduce the attack surface — one workflow to secure instead of many.
- Use `permissions` at the workflow level for monorepo-wide security.
- Protect shared packages with branch protection rules.

## Performance

- **Path filters** skip CI for unchanged packages — 50-80% reduction in CI time.
- **Turborepo remote caching** — Shared build cache across CI runs and developers.
- **Nx affected analysis** — Dependency-aware selective execution.
- **Dynamic matrix** — Only spin up runners for changed services.
- **Shared workflows** — One workflow file to maintain instead of N copies.

## Common Pitfalls

- **Naive path filters miss shared dependencies** — Changing `shared/` must trigger all dependent packages.
- **Forgetting `fetch-depth: 2`** — Path filters can't diff without previous commit.
- **Missing status job** — Required checks hang when filtered jobs are skipped.
- **Over-filtering** — Missing legitimate changes because filter patterns are too narrow.
- **Not including workflow files** — Changes to CI config don't trigger re-evaluation.

## Reusable Ideas for GitHub OS

1. **Reusable package CI workflow** — One workflow template for all packages with `package-name` input.
2. **Shared path detection composite action** — `.github/actions/detect-changes/action.yml` with standard filters.
3. **Dynamic matrix generation** — Script that detects changed packages and outputs a matrix.
4. **Turborepo cache configuration** — Shared `turbo.json` with remote cache setup.
5. **Status check aggregation** — Single status job that checks all package CI results.

## Evidence

- **Source**: https://www.warpbuild.com/blog/github-actions-monorepo-guide
- **Source**: https://tenki.cloud/blog/monorepo-ci-github-actions-selective-builds
- **Source**: https://oneuptime.com/blog/post/2026-01-26-monorepos-github-actions/view
- **Date collected**: 2026-08-03
- **Why it matters**: Without selective CI, monorepos waste 80%+ of CI compute on unchanged code.
- **Trade-offs**: Path filters are simple but miss dependency edges; Turborepo/Nx add complexity but handle the full dependency graph.
- **Expected value**: 60-90% reduction in CI time and cost for monorepos.
- **Maintenance burden**: Filter patterns need updating when package structure changes; build tool configs need periodic tuning.
