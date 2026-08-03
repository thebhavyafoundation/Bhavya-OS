# Release Notes — Knowledge Package

## Executive Summary

Release notes and changelogs serve different but complementary purposes. A changelog is the complete, ongoing record of every notable change across every version, kept in one file and written plainly for anyone. Release notes are a curated selection for a single release, often with upgrade steps and a marketing voice. The dominant standard is "Keep a Changelog" — a convention that defines six change types, ISO 8601 dates, and a reverse-chronological structure. Combined with Conventional Commits and Semantic Versioning, it creates an automated pipeline from code changes to user-facing communication. This package documents these patterns for adoption in the GitHub OS project.

## Patterns Found

### Pattern 1: Keep a Changelog Format

The de facto standard for CHANGELOG.md files. Six change types, one structure:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Webhook support for the `invoices` resource

### Changed

- Export performance improved ~3× for large datasets

### Deprecated

- Nothing yet

### Removed

- Nothing yet

### Fixed

- Calendar sync no longer offsets events by the wrong time zone

### Security

- Nothing yet

## [2.1.0] — 2026-07-05

### Added

- Dark mode across the dashboard
- CSV export for the reports page

### Changed

- Renamed `user_id` to `account_id` across all endpoints (breaking)

### Fixed

- Login redirect loop on mobile devices
```

### Pattern 2: Conventional Commits → Changelog Mapping

Structured commit messages that automatically map to changelog categories:

| Commit Type | Changelog Category | Version Bump |
| ----------- | ------------------ | ------------ |
| `feat`      | Added              | Minor        |
| `fix`       | Fixed              | Patch        |
| `refactor`  | Changed            | Patch        |
| `perf`      | Changed            | Patch        |
| `docs`      | (excluded)         | None         |
| `style`     | (excluded)         | None         |
| `test`      | (excluded)         | None         |
| `build`     | (excluded)         | None         |
| `ci`        | (excluded)         | None         |
| `chore`     | (excluded)         | None         |

Breaking changes: `feat!:` or `BREAKING CHANGE:` footer → Major bump

### Pattern 3: The Three-Layer Release System

| Layer              | Purpose                 | Audience         |
| ------------------ | ----------------------- | ---------------- |
| CHANGELOG.md       | Complete record in repo | Developers       |
| Release Notes      | Curated announcement    | Users            |
| Blog Post / Social | Marketing narrative     | Broader audience |

Write once (CHANGELOG.md), publish to every destination.

### Pattern 4: Automation Pipeline

```
Conventional Commits → git-cliff/semantic-release → CHANGELOG.md → GitHub Release → Hosted Page
```

Tools:

- **git-cliff** — Rust-based, highly customizable, ships with Keep a Changelog template
- **semantic-release** — Fully automated, Node.js, determines version from commits
- **release-please** — Google's tool, monorepo support, creates release PRs
- **Towncrier** — Python, fragment-based, each PR adds a news file

### Pattern 5: The Unreleased Section

Keep an `## [Unreleased]` section at top of CHANGELOG.md. As changes merge, add entries. At release time, move contents to a new versioned section with date. This prevents the "forgot to write release notes" panic.

## Best Practices

1. **Changelogs are for humans, not machines.** Write entries a person can understand. Never paste raw git logs.

2. **Every version gets an entry.** Gaps erode trust. Even minor releases deserve documentation.

3. **Group changes by type.** The six Keep a Changelog categories are enough. No "Miscellaneous" or "Other."

4. **Date every release in ISO 8601.** `## [2.1.0] — 2026-07-05` is correct. `## v2.1.0` alone is incomplete.

5. **Mark breaking changes prominently.** Add `**Breaking:**` marker so they stand out in the entry.

6. **Lead with user value, not implementation details.** "Rotate API keys without downtime" beats "Added POST /v2/keys/rotate."

7. **Keep an Unreleased section.** Record notable changes as they merge, not when the release goes out.

8. **Machines draft, humans curate.** Use tools for the first pass, but always review and edit. A generated changelog is raw material at best.

9. **Separate changelog from release notes.** The changelog is the source; release notes are drawn from it and shaped for announcement.

10. **Link versions to diffs.** Every version should link to its compare view so readers can dig into details.

## Templates

### CHANGELOG.md Template

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

-

### Changed

-

### Deprecated

-

### Removed

-

### Fixed

-

### Security

-

## [X.Y.Z] — YYYY-MM-DD

### Added

- {New feature with user-facing description}

### Changed

- {Change to existing behavior}
  **Breaking:** {explanation and migration path}

### Deprecated

- {Feature marked for removal}
  Will be removed in v{next-major}. Migration: {link}

### Removed

- {Previously deprecated feature removed}

### Fixed

- {Bug fix with clear description}

### Security

- {Vulnerability fix with CVE if available}

## [X.Y.Z] — YYYY-MM-DD

...
```

### Release Notes Template

```markdown
# Release {version}

**Release Date:** YYYY-MM-DD
**Upgrade Guide:** [Link to migration docs]

## Highlights

{1-3 sentences summarizing the most important changes}

## What's New

- **Feature Name:** Description of what it does and why it matters
- **Feature Name:** Description

## Improvements

- {Performance improvement with quantified impact}
- {UX improvement}

## Bug Fixes

- {Fix for issue #123}

## Breaking Changes

⚠️ **This release contains breaking changes:**

- {What changed and why}
- **Migration:** {Steps to migrate}

## Deprecations

- {Feature deprecated, will be removed in next major}
- **Migration:** {How to update}

## Acknowledgments

Thanks to the following contributors who helped with this release:
@contributor1, @contributor2

**Full Changelog:** https://github.com/org/repo/compare/v{prev}...v{current}
```

### Conventional Commit Message Template

```
feat(scope): add user-facing description

Detailed explanation of what changed and why.

Refs: #{issue-number}
Signed-off-by: Name <email>
```

## Anti-Patterns

1. **Raw commit log dumps.** "Merge pull request #123 from user/branch" is noise, not documentation.

2. **"Various bug fixes and improvements."** Vague entries tell users nothing useful.

3. **Skipping versions.** If a release shipped, it should have a changelog entry.

4. **No breaking change markers.** Never make readers infer whether a release contains breaking changes.

5. **Inventing new categories.** "Polish", "Miscellaneous", "Internal" — they all drift toward "Other." Stick to the six.

6. **Forgetting Security.** If you fix a vulnerability, Security is its own section with a CVE reference.

7. **Hand-writing what tools can generate.** Use Conventional Commits + git-cliff for the first draft, then curate.

8. **Changelog as afterthought.** Write entries as you ship, not when the release goes out.

## Reusable Ideas for GitHub OS

1. **Adopt Keep a Changelog format immediately.** Create CHANGELOG.md with `## [Unreleased]` section.

2. **Implement Conventional Commits** via commitlint + husky hooks. Enforce at commit time.

3. **Set up git-cliff** for automated changelog generation. Configure to match Keep a Changelog format.

4. **Use release-please or semantic-release** for automated versioning and release creation.

5. **Create release notes template** at `.github/release-template.md`.

6. **Add changelog check to PR template.** Include "CHANGELOG.md updated (if user-facing change)" in PR checklist.

7. **Publish release notes** to:
   - GitHub Releases (primary)
   - Project website (if applicable)
   - Discord/Slack notification

8. **Three-layer release system:**
   - CHANGELOG.md → Complete record
   - GitHub Release → Curated announcement
   - Social/Discord → User-facing summary

## Evidence

- **Source:** https://keepachangelog.com/en/2.0.0/, https://github.com/conventional-changelog/conventional-changelog, https://www.releasepad.io/blog/keep-a-changelog/, https://scattercode.dev/2026/07/a-changelog-you-never-write-conventional-commits-lefthook-and-git-cliff/, https://unmarkdown.com/blog/changelog-best-practices, https://www.mychangenote.com/blog/changelog-format
- **Date collected:** 2026-08-03
- **Why it matters:** Clear release notes reduce support burden, improve user trust, and make upgrades less stressful. The Keep a Changelog standard is recognized by every major changelog tool and AI assistant.
- **Trade-offs:** Automated generation reduces manual work but requires commit discipline. Manual curation ensures quality but takes time. The hybrid approach (tools draft, humans curate) offers the best balance.
- **Expected value:** 50-70% reduction in "what changed?" support questions. Faster adoption of new features. Improved upgrade success rates.
- **Maintenance burden:** Low once automated. Commit message discipline is the main ongoing requirement.
