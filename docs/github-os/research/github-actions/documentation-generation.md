# Documentation Generation — Knowledge Package

## Executive Summary

Documentation that's out of sync with code is worse than no documentation. Automated documentation generation in CI ensures docs always reflect the current codebase state. GitHub Actions integrates with TypeDoc (TypeScript), Sphinx (Python), JSDoc (JavaScript), OpenAPI generators, and MkDocs to generate, build, and deploy documentation automatically. This package covers the patterns for generating API docs, deploying to GitHub Pages, and keeping documentation current.

## Workflow Patterns

### Pattern 1: TypeDoc + GitHub Pages

Generate TypeScript API documentation and deploy to GitHub Pages.

```yaml
name: Documentation
on:
  push:
    branches: [main]
    paths:
      - "src/**"
      - "docs/**"
      - "typedoc.json"
  workflow_dispatch:

jobs:
  build-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - name: Generate TypeDoc
        run: npx typedoc
      - name: Upload docs artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/

  deploy-docs:
    needs: build-docs
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Pattern 2: MkDocs Material

Build a documentation site with MkDocs and deploy to GitHub Pages.

```yaml
name: Docs
on:
  push:
    branches: [main]
    paths:
      - "docs/**"
      - "mkdocs.yml"
  workflow_dispatch:

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
          cache: "pip"
      - run: pip install mkdocs-material mkdocstrings mkdocstrings-python
      - run: mkdocs build --strict
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site/

  deploy:
    needs: docs
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

### Pattern 3: OpenAPI / Redoc

Generate API documentation from OpenAPI specs.

```yaml
name: API Docs
on:
  push:
    branches: [main]
    paths:
      - "openapi.yaml"
      - "openapi.json"

jobs:
  api-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate OpenAPI
        run: npx @redocly/cli lint openapi.yaml
      - name: Generate Redoc docs
        run: |
          npx @redocly/cli build-docs openapi.yaml \
            --output docs/api/index.html \
            --title "API Documentation"
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/
```

### Pattern 4: Sphinx for Python

Generate Python documentation with Sphinx and deploy.

```yaml
name: Python Docs
on:
  push:
    branches: [main]
    paths:
      - "docs/**"
      - "src/**"

jobs:
  sphinx:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
          cache: "pip"
      - run: pip install -r requirements.txt
      - run: pip install sphinx sphinx-rtd-theme sphinx-autodoc-typehints
      - run: cd docs && make html
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/_build/html
```

### Pattern 5: PR Documentation Preview

Deploy documentation previews for pull requests.

```yaml
name: Docs Preview
on: pull_request

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx typedoc
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/
      - name: Deploy preview
        uses: rossjrw/pr-preview-action@v1
        with:
          source-dir: docs/
```

## Best Practices

1. **Trigger on source + docs changes** — Don't rebuild docs when only workflow files change.
2. **Use `upload-pages-artifact`** — GitHub's official action for Pages deployment.
3. **Validate before deploying** — Run `mkdocs build --strict` or `npx typedoc` with strict mode.
4. **Use `workflow_dispatch`** — Allow manual doc rebuilds when automation misses something.
5. **Set path filters** — Only rebuild when `src/` or `docs/` directories change.
6. **Use GitHub Pages** — Free hosting for open source documentation.
7. **Deploy previews for PRs** — Let reviewers see documentation changes before merge.
8. **Cache dependencies** — Doc generation tools (TypeDoc, Sphinx) are installed from npm/pip.
9. **Use `id-token: write`** — Required for Pages deployment with OIDC.
10. **Version documentation** — Tag documentation versions alongside code releases.

## Template

```yaml
name: Documentation
on:
  push:
    branches: [main]
    paths:
      - "src/**"
      - "docs/**"
      - "typedoc.json"
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx typedoc
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Security Considerations

- Pages deployment requires `id-token: write` for OIDC authentication.
- Never include secrets in generated documentation.
- Use `permissions: contents: read` for read-only doc builds.
- Validate OpenAPI specs before generation to prevent XSS in rendered docs.
- Use `environment: github-pages` with protection rules for deployment.

## Performance

- **Cache pip/npm dependencies** — Doc generation tools install quickly.
- **Use path filters** — Skip doc builds for code-only changes.
- **Incremental builds** — Some tools (Sphinx, MkDocs) support incremental builds.
- **Parallel generation** — Generate TypeScript and Python docs in parallel jobs.

## Common Pitfalls

- **Forgetting `id-token: write`** — Pages deployment fails with OIDC errors.
- **Not validating generated docs** — Broken links and rendering errors ship to production.
- **Missing path filters** — Docs rebuild on every commit, wasting minutes.
- **Not using `workflow_dispatch`** — Can't manually rebuild when automation misses something.
- **Overwriting gh-pages branch** — Use `actions/deploy-pages` instead of pushing to gh-pages.

## Reusable Ideas for GitHub OS

1. **Reusable doc workflow** — `.github/workflows/reusable-docs.yml` that accepts doc-tool as input.
2. **Shared doc generation composite action** — `.github/actions/generate-docs/action.yml` with TypeDoc + validation.
3. **PR preview for all repos** — Standardize doc preview deployment across the organization.
4. **Doc link checker** — Add a step to validate all links in generated documentation.
5. **Multi-language doc builder** — Parallel TypeDoc + Sphinx in the same workflow.

## Evidence

- **Source**: https://oneuptime.com/blog/post/2026-01-27-generate-documentation-github-actions/view
- **Source**: https://github.com/marketplace/actions/tsdoc-action
- **Source**: https://typedoc.org/
- **Date collected**: 2026-08-03
- **Why it matters**: Documentation out of sync with code erodes trust; automation keeps them aligned.
- **Trade-offs**: Auto-generated docs are always current but may lack narrative; hand-written docs provide context but go stale.
- **Expected value**: Zero-maintenance documentation that's always in sync with the codebase.
- **Maintenance burden**: Tool versions need periodic updates; doc structure may need manual curation.
