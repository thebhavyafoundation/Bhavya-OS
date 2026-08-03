# Engineering Platforms — Repository Profiles

Research Date: 2026-08-03

---

## GitHub

**URL:** https://github.com/github/github
**Stars:** N/A (Proprietary)
**Language:** Ruby, JavaScript
**Category:** Engineering Platform / Git Hosting
**License:** Proprietary (GitHub Enterprise Server is on-prem)

### What It Does

GitHub is the world's largest software development platform, hosting over 300 million repositories with 100+ million developers. It provides Git hosting, pull requests, code review, CI/CD (Actions), package registry, security scanning, and project management in a unified cloud platform.

### Architecture

GitHub uses a monolithic Rails application with a custom Git hosting backend (Gitolite-derived), MySQL for metadata, DynamoDB for some services, and a globally distributed CDN. GitHub Actions uses a runner model with workflow YAML files stored in repositories.

### Key Features

- Repository hosting with unlimited public/private repos
- Pull request workflows with inline code review
- GitHub Actions CI/CD with 20,000+ marketplace actions
- Copilot AI coding assistant integration
- Dependabot for automated dependency updates
- GitHub Codespaces cloud development environments
- GitHub Security (code scanning, secret scanning, Dependabot alerts)
- Projects for issue tracking and project management
- Packages and container registry

### Why It Matters for Bhavya

GitHub is the default platform for open-source collaboration. Understanding its ecosystem is essential for any open-source OS project, including CI/CD workflows, community engagement, and developer onboarding patterns.

### Reusable Patterns

- Pull request template standardization
- GitHub Actions workflow templates for CI/CD
- Dependabot configuration for automated dependency management
- CODEOWNERS file for review assignment
- Issue templates for bug reports and feature requests

### Education Value

Can become lessons on: Git workflows, pull request etiquette, CI/CD pipeline design, and open-source community contribution patterns.

### Evidence

- Source: https://github.com/features
- Date: 2026-08-03
- Quality Score: 9/10

---

## GitLab

**URL:** https://github.com/gitlabhq/gitlabhq
**Stars:** ~24,000
**Language:** Ruby, Go
**Category:** Engineering Platform / DevOps
**License:** MIT (CE), Proprietary (EE)

### What It Does

GitLab is a complete DevOps platform delivered as a single application, covering the entire software development lifecycle from planning to monitoring. The Community Edition is fully open-source and self-hostable.

### Architecture

GitLab is a monolithic Ruby on Rails application with a Go-based Git backend (Gitaly), PostgreSQL database, Redis cache, and Sidekiq background processing. The Omnibus package bundles 19+ services into a single deployment.

### Key Features

- Complete DevOps platform (planning, code, CI/CD, security, deploy, monitor)
- Built-in CI/CD with native YAML configuration
- Container and package registry
- Security scanning (SAST, DAST, dependency scanning, secret detection)
- Code review with merge requests
- Issue boards, epics, and roadmaps
- GitLab Pages for static site hosting
- Kubernetes integration

### Why It Matters for Bhavya

GitLab demonstrates how a single platform can cover the entire development lifecycle. Its integrated approach offers patterns for building comprehensive developer workflows.

### Reusable Patterns

- Monorepo CI/CD pipeline patterns
- Integrated security scanning in pipelines
- Review apps for automated deployment previews
- DORA metrics and value stream analytics
- GitLab CI template library

### Education Value

Can become lessons on: DevOps platform architecture, CI/CD pipeline design, security integration in development workflows, and platform engineering.

### Evidence

- Source: https://docs.gitlab.com/
- Date: 2026-08-03
- Quality Score: 9/10

---

## Gitea

**URL:** https://github.com/go-gitea/gitea
**Stars:** ~44,000
**Language:** Go
**Category:** Self-Hosted Git Forge
**License:** MIT

### What It Does

Gitea is a lightweight, self-hosted Git service written in Go. It provides a GitHub-like interface with repository hosting, pull requests, issues, wikis, and package registry, all running as a single binary with minimal resource requirements.

### Architecture

Gitea is a single Go binary with an embedded web server, SSH server, and optional database backend (SQLite, MySQL, PostgreSQL). It requires only 100-200MB RAM at idle and runs on devices as small as a Raspberry Pi.

### Key Features

- Single Go binary deployment (~110MB)
- GitHub-like UI and workflows
- Gitea Actions (GitHub Actions-compatible CI/CD)
- Git LFS support
- Package registry (npm, PyPI, Maven, etc.)
- Container registry
- OAuth/OIDC SSO
- LDAP authentication support
- Mirror repositories from GitHub/GitLab

### Why It Matters for Bhavya

Gitea proves that a lightweight, self-hosted forge can serve teams effectively. Its minimal resource footprint makes it ideal for educational institutions and small teams.

### Reusable Patterns

- Single-binary deployment architecture
- GitHub Actions-compatible CI/CD integration
- Lightweight self-hosted service design
- Database abstraction layer for SQLite/MySQL/PostgreSQL
- Web-based Git repository management

### Education Value

Can become labs on: self-hosted infrastructure, Git server administration, lightweight service deployment, and container-based deployment.

### Evidence

- Source: https://github.com/go-gitea/gitea
- Date: 2026-08-03
- Quality Score: 8/10

---

## Forgejo

**URL:** https://github.com/go-gitea/gitea (fork: https://codeberg.org/forgejo/forgejo)
**Stars:** ~10,000 (Codeberg)
**Language:** Go
**Category:** Self-Hosted Git Forge
**License:** GPL-3.0

### What It Does

Forgejo is a community-governed fork of Gitea, maintained by Codeberg e.V., a German non-profit. It provides identical functionality to Gitea with a focus on community governance, copyleft licensing, and long-term open-source alignment.

### Architecture

Forgejo shares Gitea's single-binary Go architecture with the same resource footprint (~100-200MB RAM). It uses the same database backends and includes Forgejo Actions (compatible with GitHub Actions YAML).

### Key Features

- Community governance under Codeberg e.V.
- GPL-3.0 copyleft license
- Same lightweight footprint as Gitea
- Forgejo Actions (GitHub Actions-compatible)
- ActivityPub federation (in development)
- Container and package registry
- Webhook support
- REST API

### Why It Matters for Bhavya

Forgejo demonstrates how community governance can sustain a critical infrastructure project. Its model is relevant for Bhavya's open-source philosophy.

### Reusable Patterns

- Non-profit governance model for open-source projects
- Copyleft licensing for community protection
- Federation protocols (ActivityPub) for decentralized collaboration
- Community-driven development processes

### Education Value

Can become lessons on: open-source governance, community-driven development, federation protocols, and licensing models.

### Evidence

- Source: https://forgejo.org/
- Date: 2026-08-03
- Quality Score: 8/10

---

## OneDev

**URL:** https://github.com/the1812/OneDev
**Stars:** ~2,500
**Language:** Java
**Category:** Self-Hosted Git Forge
**License:** MIT

### What It Does

OneDev is a self-hosted Git forge built in Java with integrated CI/CD, package registry, and project management. It runs as a single JAR or Docker image with embedded H2 or PostgreSQL/MySQL backend.

### Architecture

OneDev is a Java application running on an embedded web server with a single JAR deployment. It supports H2 (embedded), PostgreSQL, or MySQL databases and includes built-in CI/CD pipeline execution.

### Key Features

- Single JAR or Docker deployment
- Built-in CI/CD pipelines
- Git hosting with pull requests
- Issue tracking and Kanban boards
- Package registry (Maven, npm, PyPI, Docker)
- Code search and navigation
- Wiki
- Email integration

### Why It Matters for Bhavya

OneDev shows that Java-based forges can offer integrated CI/CD without the complexity of GitLab, suitable for teams familiar with the Java ecosystem.

### Reusable Patterns

- Java-based monolith with embedded server
- Integrated CI/CD pipeline execution
- Code intelligence features (search, navigation)
- Single deployment artifact pattern

### Education Value

Can become labs on: Java web application architecture, integrated DevOps platforms, and self-hosted development environments.

### Evidence

- Source: https://github.com/the1812/OneDev
- Date: 2026-08-03
- Quality Score: 7/10

---

## SourceHut

**URL:** https://git.sr.ht/
**Stars:** N/A (Separate repos)
**Language:** Python, Go
**Category:** Minimalist Git Forge
**License:** GPL-3.0

### What It Does

SourceHut is a minimalist, email-based Git forge that rejects the GitHub-style web UI in favor of email-driven workflows. It includes git.sr.ht (Git hosting), builds.sr.ht (CI), todo.sr.ht (issue tracking), and lists.sr.ht (mailing lists).

### Architecture

SourceHut uses separate services for each feature, connected through email and APIs. The Git hosting is based on CGit with a custom web frontend. Each service is independently deployable.

### Key Features

- Email-based code review (no pull requests)
- Minimalist, text-focused interface
- No JavaScript required for core functionality
- Built-in CI/CD (builds.sr.ht)
- Mailing list integration (lists.sr.ht)
- Issue tracking (todo.sr.ht)
- Surf (static site hosting)

### Why It Matters for Bhavya

SourceHut represents an alternative philosophy to GitHub-like platforms, demonstrating that different workflows can be effective for different teams.

### Reusable Patterns

- Email-driven development workflows
- Minimalist service architecture
- Decoupled service components
- Text-first interface design

### Education Value

Can become lessons on: alternative development workflows, email-based collaboration, and minimalist system design.

### Evidence

- Source: https://sr.ht/
- Date: 2026-08-03
- Quality Score: 7/10

---

## Bitbucket

**URL:** https://github.com/atlassian/atlassian-rest
**Stars:** N/A (Proprietary)
**Language:** Java
**Category:** Engineering Platform
**License:** Proprietary

### What It Does

Bitbucket is Atlassian's Git hosting platform, tightly integrated with Jira and Confluence. It provides repository hosting, pull requests, and Bitbucket Pipelines CI/CD. Bitbucket Server (self-hosted) was discontinued in 2024, leaving only Bitbucket Data Center.

### Architecture

Bitbucket Data Center is a Java-based clustered application running on Apache Tomcat with PostgreSQL or Oracle databases. It supports high-availability deployments with shared storage.

### Key Features

- Deep Jira integration
- Bitbucket Pipelines CI/CD
- Branch permissions and code review
- Bitbucket Code Insights
- Smart Mirroring for distributed teams
- IP whitelisting
- SAML/SSO

### Why It Matters for Bhavya

Bitbucket demonstrates enterprise Git hosting patterns and tight integration with project management tools (Jira/Confluence).

### Reusable Patterns

- Integration with issue tracking systems
- Branch permission models
- Code review workflows
- Enterprise-grade access controls

### Education Value

Can become lessons on: enterprise Git hosting, Jira integration patterns, and access control models.

### Evidence

- Source: https://www.atlassian.com/software/bitbucket
- Date: 2026-08-03
- Quality Score: 7/10

---

## Azure DevOps

**URL:** https://github.com/microsoft/azure-devops
**Stars:** N/A (Proprietary)
**Language:** TypeScript, C#
**Category:** Engineering Platform
**License:** Proprietary

### What It Does

Azure DevOps is Microsoft's complete DevOps platform, providing Git hosting (Azure Repos), CI/CD (Azure Pipelines), artifact feeds, test plans, and boards. It supports both cloud and self-hosted server deployments.

### Architecture

Azure DevOps uses a service-oriented architecture with separate services for repos, pipelines, boards, artifacts, and test plans. Azure DevOps Server is a self-hosted option running on Windows Server.

### Key Features

- Azure Repos (Git hosting)
- Azure Pipelines (CI/CD supporting any language/platform)
- Azure Boards (agile project management)
- Azure Artifacts (package feeds for npm, Maven, NuGet, PyPI)
- Azure Test Plans
- GitHub integration
- REST API for extensions

### Why It Matters for Bhavya

Azure DevOps shows how Microsoft integrates development tools into a unified platform, relevant for teams using Microsoft technologies.

### Reusable Patterns

- Modular platform architecture
- Multi-language CI/CD pipeline support
- Package feed management
- Agile boards integration with code repositories

### Education Value

Can become lessons on: platform architecture, multi-language CI/CD, and enterprise DevOps practices.

### Evidence

- Source: https://learn.microsoft.com/en-us/azure/devops/
- Date: 2026-08-03
- Quality Score: 7/10

---

## Codeberg (Powered by Forgejo)

**URL:** https://codeberg.org/
**Stars:** N/A (Platform)
**Language:** Go (Forgejo)
**Category:** Community Git Hosting
**License:** GPL-3.0 (Forgejo)

### What It Does

Codeberg is a free public Git hosting service run by the German non-profit Codeberg e.V., powered by Forgejo. It hosts 100,000+ repositories and is free for open-source projects.

### Architecture

Codeberg runs Forgejo (the community fork of Gitea) on donated infrastructure. It uses PostgreSQL for the database and operates on a donation-funded model with no venture capital backing.

### Key Features

- Free hosting for open-source projects
- Community governance (no corporate owner)
- GPL-3.0 licensed infrastructure
- Forgejo Actions CI/CD
- Federation plans (ActivityPub)
- No tracking or advertising

### Why It Matters for Bhavya

Codeberg represents a community-owned alternative to GitHub, aligned with open-source values of transparency and community control.

### Reusable Patterns

- Non-profit governance for infrastructure projects
- Donation-funded operational model
- Community-driven feature development
- Federation for decentralized collaboration

### Education Value

Can become lessons on: open-source community governance, non-profit technology operations, and federated platforms.

### Evidence

- Source: https://codeberg.org/
- Date: 2026-08-03
- Quality Score: 8/10

---

## Woodpecker CI

**URL:** https://github.com/woodpecker-ci/woodpecker
**Stars:** ~5,000
**Language:** Go
**Category:** CI/CD (Self-Hosted)
**License:** Apache-2.0

### What It Does

Woodpecker CI is a lightweight, community-driven CI/CD engine with great extensibility, forked from Drone CI. It integrates natively with Gitea, Forgejo, GitHub, GitLab, and Bitbucket.

### Architecture

Woodpecker uses a server-agent architecture with pipeline definitions in YAML. The server manages pipelines and connects to Git forges via webhooks. Agents execute pipeline steps in Docker containers or Kubernetes pods.

### Key Features

- Native Gitea/Forgejo integration
- GitHub Actions-compatible YAML syntax
- Docker and Kubernetes pipeline execution
- Plugin ecosystem
- Secret management
- Cron scheduling
- Multi-pipeline support
- Low resource footprint (~50MB RAM)

### Why It Matters for Bhavya

Woodpecker CI pairs perfectly with Forgejo/Gitea for lightweight self-hosted CI/CD, completing the self-hosted development stack.

### Reusable Patterns

- Server-agent CI/CD architecture
- Webhook-driven pipeline triggers
- Docker-based pipeline execution
- Lightweight CI/CD design patterns

### Education Value

Can become labs on: CI/CD pipeline design, container-based build systems, and self-hosted CI/CD deployment.

### Evidence

- Source: https://woodpecker-ci.org/
- Date: 2026-08-03
- Quality Score: 8/10
