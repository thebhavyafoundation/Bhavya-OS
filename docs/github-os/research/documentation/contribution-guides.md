# Contribution Guides — Knowledge Package

## Executive Summary

A CONTRIBUTING.md file is the single most important document for growing an open source community. It sets the tone for every interaction, reduces maintainer overhead, and transforms casual visitors into active contributors. Research from Vue, React, TypeScript, and dozens of top projects reveals consistent patterns in effective contribution guides. This package documents those patterns for adoption in the GitHub OS project.

## Patterns Found

### Pattern 1: The Pre-Submission Checklist

Top projects encode their quality bar in a clear checklist:

1. Opened a discussion for significant work first
2. Read existing documentation
3. Searched existing issues/PRs for duplicates
4. Tests pass locally
5. Code follows project style
6. Commit messages follow convention
7. PR is focused on a single logical change

### Pattern 2: The Two-Phase PR Process

Effective contribution guides separate before and when:

**Before submitting:**

- Discuss significant work with maintainers
- Read documentation and existing code
- Ensure tests pass
- Follow commit conventions

**When opening:**

- Use conventional commit format in title
- Provide detailed description
- Open WIP as draft
- Mark ready when complete
- Follow status checks
- Stay involved in conversation

### Pattern 3: Explicit Scope Boundaries

Vue.js is explicit about what's accepted:

- Bug fixes with clear reproduction → Accepted
- Features with prior approval → Accepted
- Code refactors for style only → Discouraged
- Performance improvements → Welcome with explanation

### Pattern 4: AI Agent Policy

TypeScript-Go's CONTRIBUTING.md includes explicit instructions for AI coding agents:

- No bulk/queue-driven workflows
- Specific human must shepherd each change
- AI assistance must be disclosed in PR
- Automated comments not allowed

### Pattern 5: Project Structure as Onboarding

Effective guides include a directory tree with purpose annotations:

```
├── api/          # Rust API, database migrations
├── web-client/   # Vue and Vite web client
├── sso-sdk/      # Framework-independent TypeScript SDK
├── packages/     # React, Vue, Node, and CLI packages
├── scripts/      # Installer, bootstrap, and release tooling
```

## Best Practices

1. **Place CONTRIBUTING.md in `.github/`.** GitHub surfaces it in the "Contributing" tab, on new issues, and on new PRs. Keeps root directory clean.

2. **Start with a welcome message.** Thank contributors for their interest. Set a friendly tone before diving into requirements.

3. **Link to discussions for questions.** Most questions from new contributors are documentation questions, not bug reports. Routing them to discussions keeps issues focused.

4. **Make the pre-submission checklist prominent.** Contributors who skip it create more work for maintainers. The checklist is the single most valuable section.

5. **Require discussion for significant work first.** A contributor might spend a week building a feature that isn't aligned with project direction. Catching that in a five-minute discussion saves everyone time.

6. **Include a visual contributor workflow.** A shell script example showing the full flow from forking through opening the PR reduces activation energy for first-time contributors.

7. **Explain the DCO/CLA upfront.** Don't bury legal requirements. Contributors need to know about sign-off requirements before they invest time.

8. **Document the review process.** What happens after PR submission? How long until review? What does approval look like? Set expectations.

9. **Keep it under 5 minutes to read.** Completeness without overwhelming detail. A contributor should read it end-to-end and know exactly what to do.

10. **Update when process changes.** A CONTRIBUTING.md that describes a workflow you no longer follow is worse than no guidelines at all.

## Templates

### Full CONTRIBUTING.md Template

````markdown
# Contributing to {Project Name}

Thank you for your interest in contributing! Every contribution helps make
this project better for everyone.

## Code of Conduct

This project adheres to our [Code of Conduct](CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code.

## Ways to Contribute

| Type               | Where to Start                                |
| ------------------ | --------------------------------------------- |
| Bug reports        | [Open an issue](link) with reproduction steps |
| Feature requests   | [Start a discussion](link) first              |
| Code contributions | Pick a [good first issue](link)               |
| Documentation      | Fix typos, add examples, improve guides       |
| Translations       | See our [i18n guide](link)                    |

## Getting Started

### 1. Read the Documentation

Before contributing, familiarize yourself with:

- [Project README](README.md)
- [Architecture Guide](docs/architecture/README.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

### 2. Set Up Your Development Environment

**Prerequisites:**

- {Runtime} {version}
- {Package manager} {version}
- {Other tools}

**Clone and install:**

```bash
git clone https://github.com/{org}/{repo}.git
cd {repo}
{install command}
```
````

**Verify setup:**

```bash
{test command}
```

### 3. Find Something to Work On

- Browse [good first issues](link) for starter tasks
- Check [help wanted](link) for maintainer needs
- Look for `docs` labels for documentation improvements

### 4. Make Your Changes

**Branch naming:**

- `feat/short-description` — New features
- `fix/short-description` — Bug fixes
- `docs/short-description` — Documentation

**Commit messages:**
Follow [Conventional Commits](https://conventionalcommits.org):

```
type(scope): description

{optional body}

Refs: #{issue-number}
```

**Before committing:**

```bash
{lint command}
{test command}
{format command}
```

### 5. Submit a Pull Request

**Before opening a PR, ensure:**

- [ ] You have discussed significant changes with maintainers first
- [ ] Your branch is up to date with `main`
- [ ] All tests pass locally
- [ ] Code follows project style guidelines
- [ ] Commit messages follow Conventional Commits
- [ ] PR focuses on a single logical change

**When opening a PR:**

- [ ] Use Conventional Commits format in PR title
- [ ] Fill out the PR template completely
- [ ] Link the related issue (e.g., `Fixes #123`)
- [ ] Describe what changed and why
- [ ] Open as draft if work-in-progress
- [ ] Mark as ready for review when complete

### 6. Code Review

- A maintainer will review your PR within {timeframe}
- Address feedback by pushing additional commits
- Once approved, a maintainer will merge your PR
- Your contribution will be recognized in release notes

## Development Guidelines

### Code Style

{Formatting rules, linting config, etc.}

### Testing

{Testing requirements, how to run tests, coverage expectations}

### Security

For security vulnerabilities, do NOT open a public issue.
Follow our [Security Policy](SECURITY.md) instead.

## Getting Help

- **Questions:** [GitHub Discussions](link)
- **Chat:** [Discord/Slack](link)
- **Email:** {maintainer@email.com}

## Recognition

All contributors are recognized in:

- [CONTRIBUTORS.md](link)
- Release notes
- Project website (if applicable)

Thank you for helping make this project better!

````

### PR Template
```markdown
## Description

{What does this PR do? Why is this change needed?}

## Related Issue

Fixes #{issue-number}

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated documentation accordingly
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally

## Screenshots (if applicable)

{Add screenshots to illustrate visual changes}

## Additional Notes

{Any additional context, concerns, or notes for reviewers}
````

## Anti-Patterns

1. **"Contributions welcome" without process.** Tell people exactly how to contribute, not just that you welcome contributions.

2. **Missing pre-submission checklist.** Without it, maintainers spend excessive time on basic corrections.

3. **No discussion requirement for significant changes.** Contributors build features that don't align with project direction.

4. **Buried legal requirements.** DCO/CLA requirements should be visible before contributors invest time.

5. **Outdated guidelines.** A CONTRIBUTING.md that describes a workflow you no longer follow erodes trust.

6. **No scope boundaries.** Without clear "what we accept" and "what we don't," maintainers waste time closing inappropriate PRs.

7. **Missing project structure.** Contributors can't find where to make changes without understanding the codebase layout.

8. **No review timeline expectations.** Contributors don't know how long to wait before following up.

## Reusable Ideas for GitHub OS

1. **Create `.github/CONTRIBUTING.md`** with the full template above, customized for our toolchain.

2. **Implement PR template** at `.github/pull_request_template.md` with checklist.

3. **Issue templates** at `.github/ISSUE_TEMPLATE/`:
   - `bug_report.yml` — Structured bug report form
   - `feature_request.yml` — Feature request form
   - `good_first_issue.yml` — Starter task template

4. **Require discussion for Level 2+ changes.** Link to RFC process for substantial features.

5. **Include project structure diagram** with purpose annotations for each directory.

6. **Add AI agent policy.** Explicit instructions for automated contributions.

7. **Document DCO sign-off requirement** with `--signoff` flag in commit example.

8. **Maintain CONTRIBUTORS.md** using all-contributors specification to recognize all contribution types.

## Evidence

- **Source:** https://github.com/vuejs/vue-next/blob/master/.github/contributing.md, https://tenthirtyam.org/dispatches/2026/03/21/writing-practical-contribution-guidelines-for-github-repositories/, https://github.com/vueuse/vueuse/blob/d5b0093b1ea90500b4c59c89ec37d37ba9531c51/CONTRIBUTING.md, https://github.com/microsoft/typescript-go/blob/94f31f32/CONTRIBUTING.md, https://github.com/nayafia/contributing-template, https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors
- **Date collected:** 2026-08-03
- **Why it matters:** GitHub's own research shows repos with detailed READMEs get 50% more contributions. A well-written CONTRIBUTING.md reduces maintainer overhead while attracting higher-quality contributions.
- **Trade-offs:** Comprehensive guidelines take time to write and maintain, but they pay dividends in reduced back-and-forth on PRs and issues.
- **Expected value:** 30-50% reduction in low-quality PRs. Faster review cycles. Higher contributor satisfaction.
- **Maintenance burden:** Low-Medium. Update when process changes. Review quarterly against actual practices.
