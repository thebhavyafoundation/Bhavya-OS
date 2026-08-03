# Onboarding Documentation — Knowledge Package

## Executive Summary

Developer onboarding documentation determines whether a curious visitor becomes an active contributor. Research from successful open source projects shows that the journey from "first look" to "first merged PR" has specific, measurable checkpoints: find the repo, understand the project, set up locally, select an issue, ask for help, submit a PR, and get merged. If any stage is vague, contributors silently drift away. This package documents onboarding patterns from top OSS projects for adoption in the GitHub OS project.

## Patterns Found

### Pattern 1: The Contributor Journey Map

Every onboarding system maps to these stages:

1. **Discovery** — Find the repo and understand what it does
2. **Evaluation** — Decide if the project is a good fit for their skills
3. **Setup** — Get the project running locally
4. **Selection** — Choose a first issue to work on
5. **Contribution** — Make the change and submit a PR
6. **Review** — Get feedback and iterate
7. **Merge** — See the contribution accepted
8. **Return** — Come back for more contributions

### Pattern 2: Contract-First Onboarding (Ota)

The repo declares its onboarding contract explicitly instead of asking every contributor to reconstruct it from prose, shell history, and maintainer folklore. The contract defines:

- What the repo needs (runtimes, tools, services)
- How it becomes ready (setup commands)
- Which tasks exist (build, test, lint)
- What verifies success (CI checks)
- What is safe for automation

### Pattern 3: The Welcome Kit Pattern

A concise, self-contained "Welcome Kit" that includes:

- Project Mission & Values (200-word elevator pitch)
- Getting Started Checklist (8-10 steps, completable in under 1 hour)
- Key Resources (links to repo, docs, chat, issue tracker)
- Code of Conduct (quick reference with "I Agree" button)

### Pattern 4: Issue Taxonomy for Onboarding

Not all "good first issues" are equal. Best projects use layered labels:

| Label                | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `good-first-issue`   | Small, well-documented, safe for newcomers |
| `help-wanted`        | Maintainer needs community help            |
| `docs`               | Documentation improvements                 |
| `needs-reproduction` | Bug needs investigation                    |
| `mentor-available`   | A mentor is assigned for this issue        |
| `blocked`            | Cannot proceed without external input      |

### Pattern 5: Cohort-Based Onboarding

Instead of one-to-one pairing forever, create monthly onboarding cohorts where several new contributors join a shared channel, weekly office hours, and a rotating helper team. This creates peer learning and reduces maintainer load.

## Best Practices

1. **Make the first contribution feel predictable, safe, and rewarding.** Every stage should have explicit checkpoints. If contributors have to hunt across three repos and a Slack channel for basic instructions, onboarding is already leaking people.

2. **Issue templates are the highest-leverage onboarding tool.** They shape the work before a contributor touches code. A good "good first issue" has clear scope, context, acceptance criteria, and a suggested starting point.

3. **Respond within 24-72 hours.** Nothing discourages new contributors faster than silence. Even a "we'll review this soon" acknowledgment keeps people engaged.

4. **Create a rotating mentor roster.** Every new contributor should know exactly who to contact during onboarding hours. Bounded responsibilities prevent mentor burnout.

5. **Use checklists everywhere.** Local setup, code style, tests, issue selection, communication expectations, review etiquette. Repetition is reinforcement, not redundancy.

6. **Make setup deterministic.** If one machine behaves differently because setup depends on local residue, onboarding becomes unpredictable. A canonical setup path with deterministic output is essential.

7. **Separate safe tasks from destructive ones.** New contributors should not have to infer which commands are safe. Builds, tests, and verification should be clearly distinct from data resets or deployments.

8. **Measure the journey.** Track: time to first response, time to first accepted issue, time to first PR, time to first merge. Identify drop-off points.

9. **Use AI-agent-friendly structure.** If an AI agent can inspect the repository and determine what it needs, how to set up, how to verify success, and what is safe to run, the onboarding is truly contract-first.

10. **Audit quarterly for drift.** Outdated docs create false promises and frustrate contributors more than missing docs do.

## Templates

### CONTRIBUTING.md Template

````markdown
# Contributing to {Project}

Thanks for your interest in contributing! This guide will help you get started.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## Ways to Contribute

- **Bug reports:** Found a bug? [Open an issue](link) with reproduction steps
- **Feature requests:** Have an idea? [Start a discussion](link)
- **Code:** Pick a [good first issue](link) and submit a PR
- **Documentation:** Fix typos, add examples, improve guides

## Getting Started

### 1. Find an Issue

Browse our [issue tracker](link) for issues labeled:

- `good-first-issue` — Perfect for first-time contributors
- `help-wanted` — Maintainers need community help
- `docs` — Documentation improvements

### 2. Set Up Your Environment

**Prerequisites:**

- {runtime version}
- {package manager}
- {other tools}

**Setup:**

```bash
git clone https://github.com/org/repo.git
cd repo
{install command}
{setup command}
```
````

**Verify:**

```bash
{test command}
```

### 3. Make Your Change

```bash
git checkout -b {descriptive-branch-name}
# Make your changes
{lint command}
{test command}
git commit -m "{conventional-commit-message}"
git push origin {branch-name}
```

### 4. Submit a Pull Request

- Fill out the PR template completely
- Link the related issue
- Describe what you changed and why
- Ensure all CI checks pass

### 5. Code Review

- A maintainer will review your PR within {timeframe}
- Address feedback promptly
- Push additional commits as needed
- Once approved, a maintainer will merge

## Development Workflow

### Branch Naming

- `feat/short-description` — New features
- `fix/short-description` — Bug fixes
- `docs/short-description` — Documentation

### Commit Messages

Follow [Conventional Commits](https://conventionalcommits.org):

```
type(scope): description

[optional body]
[optional footer]
```

### Code Style

- {formatting rules}
- {linting rules}
- {testing requirements}

## Getting Help

- **Questions:** [GitHub Discussions](link)
- **Chat:** [Discord/Slack](link)
- **Issues:** [Issue tracker](link)

## Recognition

All contributors are recognized in our [ CONTRIBUTORS.md](link) and release notes.

````

### Good First Issue Template
```markdown
---
name: Good First Issue
about: A well-scoped task perfect for first-time contributors
labels: good-first-issue
---

## What needs to be done

{Clear, concise description of the task}

## Why it matters

{How does this help the project?}

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Suggested approach

{Where to start, relevant files, helpful context}

## Relevant files

- `path/to/file.ts` — {what's relevant here}
- `path/to/other.ts` — {what's relevant here}

## Help needed

If you get stuck, comment on this issue or reach out on {chat channel}.

## Definition of done

- [ ] All acceptance criteria met
- [ ] Tests added/updated
- [ ] Documentation updated (if applicable)
- [ ] PR submitted and reviewed
````

## Anti-Patterns

1. **"Contributions welcome" without specifics.** Tell people exactly how to contribute, not just that you welcome contributions.

2. **Assuming shared context.** The author knows which service owns billing, where secrets live, and who gets paged. The next engineer does not.

3. **Outdated setup instructions.** A setup command that fails on the current version destroys credibility instantly.

4. **Mentoring without boundaries.** Open-ended mentorship burns out your best people. Define bounded responsibilities: review first issue, answer one setup question, pair for 30 minutes.

5. **Over-labeling issues.** A taxonomy that looks organized but doesn't help anyone choose work. Keep labels small and high-signal.

6. **Silence on PRs.** Even if a full review takes time, acknowledge within 24-72 hours.

7. **Single hero maintainer.** If onboarding depends on one person, the system fails when they're unavailable.

8. **No verification that setup works.** Regularly test your own setup process. Better yet, ask someone new to try it.

## Reusable Ideas for GitHub OS

1. **Create WELCOME.md at repo root.** Project mission, getting started checklist, key resources, code of conduct reference.

2. **Implement contract-first setup.** Declare runtimes, tools, services, and verification commands in a single location (e.g., `ota.yaml` or equivalent).

3. **Maintain 10-15 well-scoped good first issues.** Each with setup notes, expected outputs, and clear acceptance criteria.

4. **Weekly 30-minute backlog triage.** One maintainer + one community volunteer to keep issue labels current.

5. **Cohort-based onboarding.** Monthly intake of new contributors with shared onboarding channel and office hours.

6. **First-task progression:**
   - Task 1: Fix a typo or update documentation
   - Task 2: Add a test case
   - Task 3: Fix a small bug
   - Task 4: Implement a small feature

7. **Automated welcome bot.** Greet first-time contributors, point them to docs, assign labels.

8. **Contributor metrics dashboard.** Track time-to-first-response, time-to-first-merge, contributor return rate.

## Evidence

- **Source:** https://opensources.live/a-step-by-step-oss-contributor-onboarding-playbook-for-engin, https://daily.dev/blog/open-source-contributor-onboarding-10-tips, https://ota.run/blog/github-repository-onboarding-checklist-for-new-contributors-263z, https://ota.run/blog/why-developer-onboarding-should-be-contract-first, https://github.com/gvwilson/10-newcomers/blob/master/README.md
- **Date collected:** 2026-08-03
- **Why it matters:** Projects that invest in structured onboarding attract outside contributors faster. The 2025 CHASE study found that most repositories create minimal READMEs proactively, favoring brevity over community-oriented documentation — creating the gap that structured onboarding fills.
- **Trade-offs:** Comprehensive onboarding takes time to create and maintain, but the payoff is exponential: each contributor helped becomes a force multiplier.
- **Expected value:** 75% reduction in ramp-up time for new contributors. Higher contributor retention at 30/90 days.
- **Maintenance burden:** Medium. Quarterly audits needed to prevent drift. Automation reduces ongoing overhead.
