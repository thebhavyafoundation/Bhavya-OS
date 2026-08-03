# Security Tools — Repository Profiles

Research Date: 2026-08-03

---

## Trivy

**URL:** https://github.com/aquasecurity/trivy
**Stars:** ~37,000
**Language:** Go
**Category:** Security Scanner
**License:** Apache-2.0

### What It Does

Trivy is an all-in-one security scanner that finds vulnerabilities, misconfigurations, secrets, and SBOMs across containers, Kubernetes, code repositories, and cloud environments. It's the most popular open-source security scanner.

### Architecture

Trivy is a single Go binary that uses local vulnerability databases (downloaded and cached). It scans container images, filesystems, Git repos, Kubernetes clusters, and IaC configurations.

### Key Features

- Container image vulnerability scanning
- Filesystem dependency scanning
- IaC misconfiguration detection (Terraform, CloudFormation, Kubernetes)
- Secret detection
- SBOM generation (SPDX, CycloneDX)
- License compliance scanning
- Zero configuration required
- Very fast (cached database)
- ~37K GitHub stars

### Why It Matters for Bhavya

Trivy is the default security scanner for modern development, covering containers, dependencies, and infrastructure in one tool.

### Reusable Patterns

- All-in-one security scanning
- Local database caching
- Multi-target scanning architecture
- Zero-config scanning
- SBOM generation

### Education Value

Can become lessons on: security scanning, vulnerability detection, SBOM generation, and container security.

### Evidence

- Source: https://trivy.dev/
- Date: 2026-08-03
- Quality Score: 10/10

---

## Snyk

**URL:** https://github.com/snyk/snyk
**Stars:** ~9,000
**Language:** TypeScript
**Category:** Developer Security Platform
**License:** Proprietary (Free tier available)

### What It Does

Snyk is a developer-first security platform with a large vulnerability database, IDE integrations, and automated fix pull requests. It scans open source dependencies, code, containers, and IaC.

### Architecture

Snyk uses a cloud-based vulnerability database (Snyk Intel) with IDE plugins, CLI tools, and CI/CD integrations. It provides reachability analysis to prioritize vulnerabilities that actually affect your code.

### Key Features

- Large vulnerability database (Snyk Intel)
- IDE plugins (VS Code, JetBrains)
- Automated fix pull requests
- Reachability analysis
- Container scanning
- IaC scanning
- SAST (Snyk Code)
- License compliance
- Free tier; Team: $25/month per developer

### Why It Matters for Bhavya

Snyk is the leading commercial security platform, demonstrating developer-first security integration.

### Reusable Patterns

- Developer-first security UX
- Reachability-based prioritization
- Automated fix PR generation
- IDE-integrated security scanning
- Multi-target security scanning

### Education Value

Can become lessons on: developer security, reachability analysis, and automated remediation.

### Evidence

- Source: https://snyk.io/
- Date: 2026-08-03
- Quality Score: 9/10

---

## OWASP Dependency-Check

**URL:** https://github.com/dependency-check/dependencycheck
**Stars:** ~7,600
**Language:** Java
**Category:** SCA (Software Composition Analysis)
**License:** Apache-2.0

### What It Does

OWASP Dependency-Check detects publicly disclosed vulnerabilities in application dependencies by matching against the NVD (National Vulnerability Database) using CPE identifiers.

### Architecture

Dependency-Check is a Java application that scans project dependencies, generates CPE identifiers, and matches against NVD data. It integrates with Maven, Gradle, Ant, and Jenkins.

### Key Features

- NVD vulnerability matching
- CPE-based identification
- Maven, Gradle, Ant plugins
- Jenkins plugin
- HTML/JSON/SARIF reports
- OWASP project
- ~7.6K GitHub stars

### Why It Matters for Bhavya

OWASP Dependency-Check is a foundational security tool, though newer tools like Trivy offer better accuracy.

### Reusable Patterns

- NVD-based vulnerability matching
- CPE identifier generation
- Build tool plugin architecture
- Security reporting formats

### Education Value

Can become lessons on: dependency vulnerability scanning, NVD integration, and security reporting.

### Evidence

- Source: https://owasp.org/www-project-dependency-check/
- Date: 2026-08-03
- Quality Score: 7/10

---

## OSV-Scanner

**URL:** https://github.com/google/osv-scanner
**Stars:** ~8,000
**Language:** Go
**Category:** Dependency Vulnerability Scanner
**License:** Apache-2.0

### What It Does

OSV-Scanner is Google's reference client for the OSV database, providing precise vulnerability matching across ecosystems. It aggregates data from 16+ ecosystem databases with ecosystem-native version ranges.

### Architecture

OSV-Scanner uses Google's OSV.dev database, which aggregates vulnerability data from npm, PyPI, Go, Rust, and other ecosystems. It matches against exact version ranges rather than CPE identifiers.

### Key Features

- Google OSV database integration
- Ecosystem-native version matching
- Guided remediation (osv-scanner fix)
- 38K+ advisories
- Very low false positive rate
- ~8K GitHub stars
- Free and open source

### Why It Matters for Bhavya

OSV-Scanner provides the most accurate dependency vulnerability scanning with the lowest false positive rate.

### Reusable Patterns

- Ecosystem-native vulnerability matching
- Guided remediation workflows
- Multi-ecosystem database aggregation
- Precise version range matching

### Education Value

Can become lessons on: vulnerability databases, precise matching algorithms, and remediation workflows.

### Evidence

- Source: https://github.com/google/osv-scanner
- Date: 2026-08-03
- Quality Score: 9/10

---

## Grype + Syft

**URL:** https://github.com/anchore/grype (Grype), https://github.com/anchore/syft (Syft)
**Stars:** ~8,000 (Grype), ~5,000 (Syft)
**Language:** Go
**Category:** SBOM + Vulnerability Scanning
**License:** Apache-2.0

### What It Does

Syft generates SBOMs (Software Bill of Materials) and Grype scans those SBOMs for vulnerabilities. Together they provide a composable security scanning pipeline.

### Architecture

Syft creates comprehensive SBOMs in SPDX and CycloneDX formats. Grype reads these SBOMs and matches components against vulnerability databases. The separation allows SBOM generation and scanning to be independent steps.

### Key Features

- High-quality SBOM generation (Syft)
- SBOM-based vulnerability scanning (Grype)
- SPDX and CycloneDX support
- Container image scanning
- Filesystem scanning
- ~13K combined GitHub stars
- Free and open source

### Why It Matters for Bhavya

Grype + Syft provide a composable, standards-based approach to security scanning with SBOMs.

### Reusable Patterns

- SBOM generation patterns
- Standards-based security (SPDX, CycloneDX)
- Composable security pipeline
- Separation of concerns (generate vs scan)

### Education Value

Can become lessons on: SBOM generation, security standards, and composable tool design.

### Evidence

- Source: https://github.com/anchore/grype
- Date: 2026-08-03
- Quality Score: 8/10

---

## Checkov

**URL:** https://github.com/bridgecrewio/checkov
**Stars:** ~7,000
**Language:** Python
**Category:** IaC Security Scanner
**License:** Apache-2.0

### What It Does

Checkov is a static analysis tool for Infrastructure as Code (IaC) that scans Terraform, CloudFormation, Kubernetes, ARM, and other IaC formats for security misconfigurations.

### Architecture

Checkov uses a policy-based scanning engine with 1,000+ built-in policies. It analyzes IaC code for security misconfigurations and provides fix recommendations.

### Key Features

- 1,000+ built-in policies
- Terraform, CloudFormation, Kubernetes, ARM support
- YAML-based policy definitions
- CI/CD integration
- Custom policy creation
- Graph-based analysis
- ~7K GitHub stars

### Why It Matters for Bhavya

Checkov provides deep IaC security analysis, essential for infrastructure-as-code security.

### Reusable Patterns

- Policy-based security scanning
- Multi-format IaC support
- Custom policy definitions
- Graph-based analysis

### Education Value

Can become lessons on: IaC security, policy-as-code, and infrastructure scanning.

### Evidence

- Source: https://www.checkov.io/
- Date: 2026-08-03
- Quality Score: 8/10

---

## Dependabot

**URL:** https://github.com/dependabot/dependabot-core
**Stars:** ~2,500
**Language:** Ruby
**Category:** Automated Dependency Updates
**License:** MIT

### What It Does

Dependabot is GitHub's native dependency update tool that automatically opens version-bump pull requests when new versions of dependencies are available or security vulnerabilities are discovered.

### Architecture

Dependabot runs as a GitHub service that monitors dependency manifests across multiple ecosystems. It opens PRs with version updates and security fixes automatically.

### Key Features

- Automatic dependency update PRs
- Security vulnerability alerts
- Multi-ecosystem support (npm, pip, Maven, Go, etc.)
- Grouped updates
- Auto-triage rules
- Free on GitHub
- ~2.5K GitHub stars

### Why It Matters for Bhavya

Dependabot provides zero-configuration dependency management, essential for any project with dependencies.

### Reusable Patterns

- Automated dependency update PRs
- Multi-ecosystem manifest parsing
- Security-first update prioritization
- Grouped update patterns

### Education Value

Can become lessons on: dependency management automation, security update workflows, and multi-ecosystem support.

### Evidence

- Source: https://github.com/dependabot/dependabot-core
- Date: 2026-08-03
- Quality Score: 8/10

---

## Semgrep

**URL:** https://github.com/semgrep/semgrep
**Stars:** ~11,000
**Language:** OCaml
**Category:** SAST (Static Application Security Testing)
**License:** LGPL-2.1

### What It Does

Semgrep is a fast, open-source static analysis tool for finding bugs and enforcing code standards. It supports 30+ languages with simple pattern-based rules and custom rule creation.

### Architecture

Semgrep uses a pattern-matching engine written in OCaml for fast code analysis. It supports custom rules written in YAML with pattern matching, taint tracking, and dataflow analysis.

### Key Features

- 30+ language support
- Pattern-based rule writing
- Custom rule creation
- Taint tracking
- CI/CD integration
- Community rule registry
- ~11K GitHub stars

### Why It Matters for Bhavya

Semgrep provides accessible static analysis that can be customized for specific security rules.

### Reusable Patterns

- Pattern-based static analysis
- Custom rule definition
- Multi-language support
- Taint tracking analysis

### Education Value

Can become lessons on: static analysis, pattern matching, and security rule creation.

### Evidence

- Source: https://semgrep.dev/
- Date: 2026-08-03
- Quality Score: 9/10

---

## Socket

**URL:** https://github.com/SocketDev/socket
**Stars:** ~3,000
**Language:** TypeScript
**Category:** Supply Chain Security
**License:** Proprietary (Free tier available)

### What It Does

Socket focuses on detecting malicious packages and supply chain attacks by analyzing what a package actually does — network access, install scripts, obfuscation — rather than just known CVEs.

### Architecture

Socket analyzes package behavior through static analysis of install scripts, network patterns, and code obfuscation. It provides real-time alerts for suspicious package activity.

### Key Features

- Malicious package detection
- Install script analysis
- Network access detection
- Obfuscation detection
- GitHub integration
- Real-time alerts
- Complements traditional SCA

### Why It Matters for Bhavya

Socket addresses supply chain attacks that traditional vulnerability scanners miss, an emerging security concern.

### Reusable Patterns

- Behavior-based package analysis
- Supply chain attack detection
- Real-time monitoring
- Complementary security analysis

### Education Value

Can become lessons on: supply chain security, malicious package detection, and behavior analysis.

### Evidence

- Source: https://socket.dev/
- Date: 2026-08-03
- Quality Score: 7/10

---

## OWASP Dependency-Track

**URL:** https://github.com/DependencyTrack/dependency-track
**Stars:** ~3,500
**Language:** Java
**Category:** SBOM Management Platform
**License:** Apache-2.0

### What It Does

Dependency-Track is a continuous SBOM analysis platform that tracks components and vulnerabilities across an organization's portfolio over time. It's the closest open-source answer to a security management dashboard.

### Architecture

Dependency-Track is a Java application with a PostgreSQL database that ingests CycloneDX SBOMs and tracks vulnerabilities over time. It provides dashboards, alerts, and policy enforcement.

### Key Features

- Continuous SBOM analysis
- Portfolio-wide vulnerability tracking
- CycloneDX SBOM ingestion
- Policy enforcement
- Dashboard and reporting
- Alert notifications
- Self-hosted
- ~3.5K GitHub stars

### Why It Matters for Bhavya

Dependency-Track provides portfolio-level security visibility, essential for organizations managing multiple projects.

### Reusable Patterns

- SBOM management platform
- Continuous vulnerability tracking
- Portfolio-level security analysis
- Policy-based enforcement

### Education Value

Can become lessons on: SBOM management, portfolio security, and continuous monitoring.

### Evidence

- Source: https://dependencytrack.org/
- Date: 2026-08-03
- Quality Score: 8/10

---

## Gitleaks

**URL:** https://github.com/gitleaks/gitleaks
**Stars:** ~17,000
**Language:** Go
**Category:** Secret Detection
**License:** MIT

### What It Does

Gitleaks is a SAST tool for detecting and preventing hardcoded secrets like passwords, API keys, and tokens in Git repos. It scans Git history and prevents secrets from being committed.

### Architecture

Gitleaks scans Git repositories using regex patterns to detect secrets. It can run as a pre-commit hook, CI/CD step, or standalone scanner.

### Key Features

- Git history scanning
- Pre-commit hook support
- CI/CD integration
- Custom rule definitions
- Allowlist support
- SARIF output
- ~17K GitHub stars

### Why It Matters for Bhavya

Gitleaks prevents secrets from being committed to repositories, a critical security practice.

### Reusable Patterns

- Git history secret scanning
- Pre-commit hook integration
- Custom rule definitions
- SARIF output format

### Education Value

Can become lessons on: secret detection, pre-commit security, and Git history analysis.

### Evidence

- Source: https://github.com/gitleaks/gitleaks
- Date: 2026-08-03
- Quality Score: 9/10
