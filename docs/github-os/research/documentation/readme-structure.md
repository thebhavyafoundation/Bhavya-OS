# README Structure — Knowledge Package

## Executive Summary

The README.md file is the single most important file in any open source repository. It serves as the landing page, marketing copy, onboarding guide, and documentation hub all in one. Research from top-starred GitHub repositories (AFFiNE 60K+, React, Vue, Next.js, Rust) reveals consistent structural patterns that correlate with star growth, contributor adoption, and user retention. This package documents those patterns for adoption in the GitHub OS project.

## Patterns Found

### Pattern 1: The "First 50 Words" Rule

Top repos answer three questions in the first paragraph: What is this? Why is it different? Who is it for? Leading with a verb ("Converts markdown to HTML") beats leading with "This is a..."

**Example from AFFiNE (60K+ stars):**

```
One-line pitch with search keywords
Live demo link front and center
Feature table (scannable)
Quick start in 3 steps
```

### Pattern 2: The Conversion Funnel Structure

The reliable section order that maximizes visitor-to-user conversion:

1. Project name + one-line description
2. Visual (screenshot/GIF/demo video)
3. Badges (stars, license, CI, version)
4. Quick Start (3 steps max)
5. Features table
6. Architecture diagram (for complex projects)
7. Contributing guidelines
8. License

### Pattern 3: Badge Tiers

| Tier         | Badges                         | Purpose             |
| ------------ | ------------------------------ | ------------------- |
| Essential    | Build status, License, Version | Trust signals       |
| Social proof | Stars, Downloads               | Momentum indicators |
| Avoid        | "Made with ❤️", "PRs welcome"  | Noise, no signal    |

### Pattern 4: Monorepo README Routing

Root README explains monorepo purpose, workspace layout, and package map. Each package gets its own README with package-specific install, usage, and ownership details. The root file routes; local files instruct.

### Pattern 5: Repository Overview Section

An underrated section that maps the repo structure. Critical for monorepos, data repos, and projects with non-obvious directory layouts. Benefits both humans and AI systems.

## Best Practices

1. **Lead with value, not description.** The first screenful should show what the project does, not explain what it is. Demo GIFs above the fold increase star conversion by ~15%.

2. **Median length for 10K+ star repos: 800-1,500 words.** Short enough to scan, long enough to answer first-time visitor questions.

3. **Test your install commands on a clean machine.** A broken quick-start is the fastest way to lose a potential user. The install step that silently depends on something already on your machine destroys credibility.

4. **Update README with every release.** Outdated READMEs with broken badges and dead links erode trust faster than having no README at all. Make updating it part of your release routine.

5. **Write for beginners.** The curse of knowledge is the biggest README killer. Assume the reader has never seen your project before.

6. **One README, one purpose.** Get someone from "What is this?" to "I'm using it" as quickly as possible. Advanced docs, architecture decisions, and contribution policies belong in separate files.

7. **SEO-optimize for developer discoverability.** Primary keyword in first 50 words, secondary keywords in section headers, descriptive alt text for images.

8. **Use Mermaid for architecture diagrams.** GitHub natively renders Mermaid blocks. No external image files needed. Diagrams update when you update the markdown.

## Templates

### Minimal README Template

````markdown
# Project Name

> One-line description with primary SEO keywords — what it is, who it's for, why it's different.

[![Build](https://img.shields.io/github/actions/workflow/status/OWNER/REPO/ci.yml?style=flat-square)](https://github.com/OWNER/REPO/actions)
[![Version](https://img.shields.io/github/v/release/OWNER/REPO?style=flat-square)](https://github.com/OWNER/REPO/releases)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](opensource.org/licenses/MIT)

[Demo](https://demo-url.com) · [Docs](https://docs-url.com) · [Discord](https://discord.gg/server)

[Demo GIF or Screenshot]

## Features

| Feature   | Description       |
| --------- | ----------------- |
| Feature 1 | Brief description |
| Feature 2 | Brief description |

## Quick Start

```bash
# Install
npm install project-name

# Run
npx project-name init
```
````

## Architecture

[Mermaid diagram or link to architecture docs]

## Contributing

1. Fork → Branch → PR
2. Run tests before submitting
3. We respond within 48h

## License

MIT © [Your Name](https://your-website.com)

````

### Internal Tool README Template
```markdown
# Service Name

**Ownership:** Team, Slack channel, escalation path

## What It Does
One paragraph. Name the service boundary.

## Dependencies
- Datastores: [list]
- Upstream services: [list]
- Downstream consumers: [list]

## Environments
| Environment | URL | Notes |
|-------------|-----|-------|
| Local | http://localhost:3000 | See setup below |
| Staging | https://staging.example.com | Auto-deployed |
| Production | https://api.example.com | Manual deploy |

## Local Setup

```bash
# Prerequisites
docker compose up -d

# Verify
curl http://localhost:3000/health
````

## Deployment

How releases happen and where rollbooks live.

## Runbooks

- Incident response: [link]
- Recovery procedures: [link]

```

## Anti-Patterns

1. **Wall of text with no visual.** First screenful should show, not tell.
2. **No quick-start code.** Users who can't copy-paste a working example leave.
3. **Badge overload.** More than 7 badges reads as noise and pushes the description below the fold.
4. **Outdated information.** A README that says "requires Node.js 12" on a project on Node 20 signals neglect.
5. **Missing license.** Without a license, code is "all rights reserved" by default, discouraging adoption.
6. **Generic "Contributions welcome" without process.** Tell people exactly how to contribute.
7. **No table of contents on long READMEs.** GitHub auto-generates them from headings.
8. **Screenshots linked to external hosts.** Store images in the repository under `docs/` or `assets/`.

## Reusable Ideas for GitHub OS

1. **Hero section with demo GIF.** Place above the fold for maximum conversion.
2. **Star history chart.** Auto-updates daily via star-history.com. Signals momentum.
3. **Feature comparison table.** Show how GitHub OS compares to alternatives.
4. **Monorepo routing README.** Root explains structure, each package has its own README.
5. **Repository overview section.** Critical for onboarding AI agents and new contributors.
6. **Quick start in 3 commands.** Clone → install → run. Under 60 seconds to "it works."
7. **Architecture diagram using Mermaid.** Keep in README for complex projects, link for simple ones.
8. **Badges: build status, version, license, Discord.** Four badges maximum.

## Evidence

- **Source:** https://gingiris.tools/blog/2026/04/02/github-readme-template-guide/, https://repoclip.io/blog/how-to-write-a-github-readme, https://www.dokly.co/blog/readme-file-structure, https://dev.to/belal_zahran/the-github-readme-template-that-gets-stars-used-by-top-repos-4hi7, https://rivereditor.com/blogs/write-perfect-readme-github-repo
- **Date collected:** 2026-08-03
- **Why it matters:** README structure directly correlates with star growth, contributor adoption, and user conversion rates.
- **Trade-offs:** More detailed READMEs take longer to maintain but convert better. Minimal READMEs are easier to keep current but lose potential users.
- **Expected value:** 35-50% improvement in visitor-to-star conversion with hero image + quick start + badges.
- **Maintenance burden:** 4-8 hours one-time investment, update with every major release.
```
