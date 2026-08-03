# Composite Actions — Knowledge Package

## Executive Summary

Composite actions bundle multiple workflow steps into a single reusable unit that runs as one step within a job. Unlike reusable workflows (which contain entire jobs), composite actions run on the caller's runner and can be placed before/after other steps. They're ideal for setup sequences, repeated command bundles, and Marketplace-publishable actions. This package covers the mechanics, patterns, and decision framework for composite actions.

## Workflow Patterns

### Pattern 1: Setup Composite Action

Bundle project setup steps into a reusable action.

```yaml
# .github/actions/setup-project/action.yml
name: "Setup Project"
description: "Install Node.js, cache dependencies, and run setup"
inputs:
  node-version:
    description: "Node.js version"
    required: false
    default: "20"
  install-command:
    description: "Install command"
    required: false
    default: "npm ci"
runs:
  using: "composite"
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: "npm"
    - name: Install dependencies
      shell: bash
      run: ${{ inputs.install-command }}
    - name: Build project
      shell: bash
      run: npm run build --if-present
```

```yaml
# Usage in a workflow
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/setup-project
        with:
          node-version: "22"
      - run: npm test
```

### Pattern 2: Docker Build & Push

Build and push Docker images with Trivy scanning.

```yaml
# .github/actions/docker-build-push/action.yml
name: "Docker Build and Push"
description: "Build Docker image, scan with Trivy, and push to registry"
inputs:
  image-name:
    description: "Docker image name"
    required: true
  tag:
    description: "Image tag"
    required: false
    default: "latest"
  registry:
    description: "Container registry"
    required: false
    default: "ghcr.io"
  username:
    description: "Registry username"
    required: true
  password:
    description: "Registry password"
    required: true
runs:
  using: "composite"
  steps:
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Log in to registry
      uses: docker/login-action@v3
      with:
        registry: ${{ inputs.registry }}
        username: ${{ inputs.username }}
        password: ${{ inputs.password }}

    - name: Build and push
      uses: docker/build-push-action@v5
      with:
        push: true
        tags: ${{ inputs.registry }}/${{ inputs.image-name }}:${{ inputs.tag }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

    - name: Trivy scan
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: "${{ inputs.registry }}/${{ inputs.image-name }}:${{ inputs.tag }}"
        format: "sarif"
        output: "trivy-results.sarif"
        severity: "CRITICAL,HIGH"

    - name: Upload SARIF
      uses: github/codeql-action/upload-sarif@v3
      if: always()
      with:
        sarif_file: "trivy-results.sarif"
```

### Pattern 3: Terraform Validation

Validate Terraform code and scan for misconfigurations.

```yaml
# .github/actions/terraform-validate/action.yml
name: "Terraform Validate"
description: "Validate and scan Terraform code"
inputs:
  working-directory:
    description: "Terraform working directory"
    required: true
runs:
  using: "composite"
  steps:
    - name: Setup Terraform
      uses: hashicorp/setup-terraform@v3

    - name: Terraform Init
      shell: bash
      run: terraform init -backend=false
      working-directory: ${{ inputs.working-directory }}

    - name: Terraform Validate
      shell: bash
      run: terraform validate
      working-directory: ${{ inputs.working-directory }}

    - name: Terraform Format Check
      shell: bash
      run: terraform fmt -check -recursive
      working-directory: ${{ inputs.working-directory }}

    - name: Checkov Scan
      uses: bridgecrewio/checkov-action@v12
      with:
        directory: ${{ inputs.working-directory }}
        quiet: true
```

### Pattern 4: Composite Action with Outputs

Return values from a composite action to the caller.

```yaml
# .github/actions/get-version/action.yml
name: "Get Version"
description: "Extract version from package.json"
outputs:
  version:
    description: "Package version"
    value: ${{ steps.version.outputs.version }}
runs:
  using: "composite"
  steps:
    - name: Get version
      id: version
      shell: bash
      run: |
        VERSION=$(node -p "require('./package.json').version")
        echo "version=$VERSION" >> $GITHUB_OUTPUT
```

```yaml
# Usage
steps:
  - uses: ./.github/actions/get-version
    id: version-info
  - run: echo "Version is ${{ steps.version-info.outputs.version }}"
```

## Comparison: Composite Actions vs Reusable Workflows

| Feature       | Composite Action       | Reusable Workflow        |
| ------------- | ---------------------- | ------------------------ |
| Unit of reuse | Steps within a job     | Entire jobs              |
| Runs on       | Caller's runner        | Own runner(s)            |
| Secrets       | Must pass as inputs    | Native `secrets` context |
| Multiple jobs | No                     | Yes                      |
| Marketplace   | Can be published       | Cannot                   |
| Nesting       | Up to 10 levels        | Up to 4 levels           |
| Logging       | One step               | Separate job logs        |
| Environment   | Runs in caller context | Separate context         |

**Use a composite action when:** You need to reuse a bundle of steps within a job.
**Use a reusable workflow when:** You need multiple jobs, different runners, or native secrets.

## Best Practices

1. **Keep actions in `.github/actions/`** — Standard location for project-local actions.
2. **Always set `shell: bash`** — Required for composite action steps.
3. **Use `description` field** — Documents what the action does in the marketplace and UI.
4. **Set default input values** — Reduce caller complexity with sensible defaults.
5. **Use outputs for return values** — Map step outputs to action outputs.
6. **Don't hardcode secrets** — Pass secrets as inputs from the calling workflow.
7. **Version your actions** — Use tags for published actions; SHA pins for internal.
8. **Test actions in isolation** — Create a test workflow that exercises the action.
9. **Use `continue-on-error` wisely** — Don't swallow errors; let callers decide.
10. **Document inputs/outputs** — Clear descriptions prevent misuse.

## Template

```yaml
# .github/actions/template-action/action.yml
name: "Template Action"
description: "Reusable action template"
inputs:
  input1:
    description: "First input"
    required: true
  input2:
    description: "Second input with default"
    required: false
    default: "default-value"
outputs:
  result:
    description: "Action result"
    value: ${{ steps.main.outputs.result }}
runs:
  using: "composite"
  steps:
    - name: Main step
      id: main
      shell: bash
      run: |
        echo "Processing ${{ inputs.input1 }}"
        echo "result=success" >> $GITHUB_OUTPUT
    - name: Secondary step
      shell: bash
      run: echo "Using ${{ inputs.input2 }}"
```

## Security Considerations

- **Composite actions cannot use `secrets` context** — Pass secrets as inputs.
- **Don't log secrets** — Use `::add-mask::` if secrets might appear in output.
- **Pin actions to SHA** — For third-party actions, SHA pins prevent supply chain attacks.
- **Review action source code** — Composite actions execute arbitrary shell commands.
- **Use `shell: bash`** — Avoid `shell: pwsh` or `shell: python` for portability and security.
- **Don't use `pull_request_target`** with composite actions from forks** — Exposes secrets.

## Performance

- **Composite actions run on the caller's runner** — No additional runner startup time.
- **Cache within actions** — Actions can use `actions/cache` just like regular steps.
- **Reuse setup sequences** — Eliminates repeated dependency installation across jobs.
- **No overhead** — Composite actions are parsed inline, not as separate workflow runs.

## Common Pitfalls

- **Forgetting `shell: bash`** — Every `run:` step in a composite action needs an explicit shell.
- **Not declaring outputs** — Outputs must be mapped from step outputs to action outputs.
- **Hardcoding paths** — Use `${{ github.action_path }}` for action-relative paths.
- **Secrets not available** — Must pass as inputs, not from `secrets` context.
- **Complex logic** — Composite actions aren't designed for complex conditional logic; use reusable workflows instead.
- **Not testing** — Actions should be tested independently before use.

## Reusable Ideas for GitHub OS

1. **Setup composite action** — `.github/actions/setup-project/action.yml` standardized across all repos.
2. **Docker build & scan action** — `.github/actions/docker-build/action.yml` with Trivy integration.
3. **Terraform validation action** — `.github/actions/terraform-validate/action.yml` for infrastructure repos.
4. **Release preparation action** — `.github/actions/prepare-release/action.yml` with changelog generation.
5. **Security scanning action** — `.github/actions/security-scan/action.yml` combining CodeQL + dependency review.

## Evidence

- **Source**: https://docs.github.com/en/actions/creating-actions/creating-a-composite-action
- **Source**: https://nerdleveltech.com/github-actions-reusable-workflow-vs-composite-action
- **Source**: https://blog.pmunhoz.com/blog/github-actions/github-actions-composite-actions-reusable-workflows/
- **Date collected**: 2026-08-03
- **Why it matters**: Composite actions eliminate step-level duplication; they're the building blocks of reusable CI infrastructure.
- **Trade-offs**: Composite actions are simpler than reusable workflows but can't use secrets natively or run multiple jobs.
- **Expected value**: 40-60% reduction in step-level YAML duplication; consistent setup sequences across repositories.
- **Maintenance burden**: Actions need versioning and testing; breaking changes affect all callers.
