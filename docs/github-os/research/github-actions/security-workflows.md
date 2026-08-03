# Security Workflows — Knowledge Package

## Executive Summary

Security workflows shift vulnerability detection from periodic audits to every commit and pull request. GitHub Actions integrates with CodeQL (SAST), Dependabot (dependency scanning), secret scanning, and third-party tools like Trivy and Semgrep to create comprehensive security pipelines. This package covers the patterns for automated security scanning, dependency review, container scanning, and supply chain hardening.

## Workflow Patterns

### Pattern 1: CodeQL SAST Analysis

GitHub's free static analysis tool that treats code as data, building a database and running semantic queries.

```yaml
name: CodeQL Analysis
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: "0 6 * * 1" # Weekly Monday scan

jobs:
  analyze:
    name: Analyze (${{ matrix.language }})
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      actions: read
      contents: read
    strategy:
      fail-fast: false
      matrix:
        language: ["javascript", "python"]
    steps:
      - uses: actions/checkout@v4
      - name: Initialize CodeQL
        uses: github/codeql-action/init@v3
        with:
          languages: ${{ matrix.language }}
          queries: security-extended
      - name: Autobuild
        uses: github/codeql-action/autobuild@v3
      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v3
        with:
          category: "/language:${{ matrix.language }}"
```

### Pattern 2: Dependency Review

Scans pull requests for dependency changes and blocks vulnerable additions.

```yaml
name: Dependency Review
on: pull_request

permissions:
  contents: read

jobs:
  dependency-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Dependency Review
        uses: actions/dependency-review-action@v4
        with:
          fail-on-severity: high
          deny-licenses: GPL-3.0, AGPL-3.0
          comment-summary-in-pr: always
```

### Pattern 3: Comprehensive Security Pipeline

Combines SAST, dependency scanning, secret detection, and container scanning.

```yaml
name: Security Scan
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  security-events: write
  contents: read

jobs:
  codeql:
    name: CodeQL SAST
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with:
          languages: javascript
          queries: security-extended
      - uses: github/codeql-action/autobuild@v3
      - uses: github/codeql-action/analyze@v3

  dependency-review:
    name: Dependency Review
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/dependency-review-action@v4
        with:
          fail-on-severity: high

  secret-scan:
    name: Secret Scanning
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  container-scan:
    name: Container Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t app:test .
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: "app:test"
          format: "sarif"
          output: "trivy-results.sarif"
          severity: "CRITICAL,HIGH"
      - uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: "trivy-results.sarif"
```

### Pattern 4: OpenSSF Scorecard

Automated security posture assessment scoring 0-10.

```yaml
name: OpenSSF Scorecard
on:
  push:
    branches: [main]
  schedule:
    - cron: "0 0 * * 1"

permissions: read-all

jobs:
  analysis:
    name: Scorecard Analysis
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          persist-credentials: false
      - uses: ossf/scorecard-action@v2
        with:
          results_file: results.sarif
          results_format: sarif
      - uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: results.sarif
```

## Best Practices

1. **Run CodeQL on push + PR + schedule** — PRs catch new issues; scheduled scans find newly discovered CVEs.
2. **Use `security-extended` queries** — Broader coverage than the default query suite.
3. **Upload all results as SARIF** — GitHub's Security tab provides a unified dashboard.
4. **Block merges on critical findings** — Use branch protection with required status checks.
5. **Scan containers with Trivy** — Free, fast, and catches OS-level vulnerabilities.
6. **Enable Dependabot security updates** — Auto-creates PRs for known vulnerabilities.
7. **Use `actions/dependency-review-action`** — Prevents adding vulnerable dependencies in PRs.
8. **Schedule weekly full scans** — Catch newly discovered CVEs in existing code.
9. **Create suppression files** — Document false positives with `owasp-suppressions.xml` or CodeQL filters.
10. **Monitor OpenSSF Scorecard** — Track security posture over time.

## Template

```yaml
name: Security
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: "0 6 * * 1"

permissions:
  security-events: write
  contents: read
  actions: read

jobs:
  codeql:
    name: SAST
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with:
          languages: javascript
          queries: security-extended
      - uses: github/codeql-action/autobuild@v3
      - uses: github/codeql-action/analyze@v3

  dependencies:
    name: Dependency Review
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/dependency-review-action@v4
        with:
          fail-on-severity: high

  secrets:
    name: Secret Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  scorecard:
    name: OpenSSF Scorecard
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          persist-credentials: false
      - uses: ossf/scorecard-action@v2
        with:
          results_file: results.sarif
          results_format: sarif
      - uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: results.sarif
```

## Security Considerations

- **Pin all security actions to SHA** — Security tools are high-value targets for supply chain attacks.
- **Use `persist-credentials: false`** — Prevent token leakage in checkout steps.
- **Never run untrusted code in security workflows** — These workflows have elevated permissions.
- **Use `permissions: read-all`** for scorecard — Only needs read access.
- **Enable GitHub Advanced Security** — Required for private repos to use CodeQL.
- **Review SARIF uploads** — Check that results appear in the Security tab.

## Performance

- **Run CodeQL in parallel** with other CI jobs — It takes 5-15 minutes.
- **Cache CodeQL databases** — Reuse between runs for faster analysis.
- **Use `security-extended` not `security-and-quality`** — Faster, still comprehensive.
- **Schedule weekly scans** — Don't run full scans on every PR.
- **Use Trivy's `--severity` flag** — Only scan for CRITICAL and HIGH.

## Common Pitfalls

- **Missing `security-events: write` permission** — SARIF upload fails silently.
- **Not using `fetch-depth: 0`** — CodeQL needs full history for accurate analysis.
- **Ignoring scheduled scans** — New CVEs are discovered daily; weekly scans catch them.
- **Over-scanning** — Running full SAST on every PR is slow; consider diff-aware scanning.
- **Not triaging findings** — Security alerts without action become noise.

## Reusable Ideas for GitHub OS

1. **Reusable security workflow** — `.github/workflows/reusable-security.yml` with CodeQL + dependency review.
2. **Shared secret scanning composite action** — `.github/actions/scan-secrets/action.yml` with Gitleaks.
3. **Security gate for PRs** — Block merge if critical vulnerabilities are found.
4. **Container scanning action** — `.github/actions/scan-container/action.yml` wrapping Trivy.
5. **OpenSSF Scorecard monitoring** — Weekly scorecard with Slack notification on score drops.

## Evidence

- **Source**: https://github.com/step-security/secure-repo
- **Source**: https://vulert.com/blog/security-scanning-github-actions/
- **Source**: https://timesofcloud.com/github-actions-security-scanning-codeql-dependabot-sast
- **Date collected**: 2026-08-03
- **Why it matters**: Automated security scanning catches vulnerabilities before they reach production; manual audits are too infrequent for modern development speeds.
- **Trade-offs**: CodeQL adds 5-15 minutes to CI; comprehensive scanning may produce false positives that need triage.
- **Expected value**: Continuous vulnerability detection across code, dependencies, containers, and secrets.
- **Maintenance burden**: Security tools need regular updates; findings require ongoing triage and remediation.
