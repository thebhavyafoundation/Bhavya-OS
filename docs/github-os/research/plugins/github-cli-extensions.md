# GitHub CLI Extensions — Knowledge Package

## Executive Summary

GitHub CLI (`gh`) is the official command-line tool for GitHub, bringing pull requests, issues, Actions, and other features to the terminal. The extension system (`gh extension install`) has grown to 867+ community extensions covering dashboard UIs, notification management, branch cleanup, CI/CD automation, and AI-powered workflows. The ecosystem is anchored by high-quality extensions like `gh-dash` (12.1K stars), `gh-aw` (4.8K stars — GitHub's Agentic Workflows), and `gh-signoff` (1.8K stars — local CI). Extensions are simple executables, making the ecosystem highly accessible for contributions.

## Tools by Category

### Dashboard & Visualization

#### 1. gh-dash

- **Description:** Rich terminal UI for GitHub — view PRs, issues, notifications, and repo activity in a beautiful dashboard. The most popular gh extension with 12.1K stars.
- **Use Case:** GitHub activity overview, PR/issue management
- **Installation:** `gh extension install dlvhdr/gh-dash`
- **Pricing:** Free
- **Maintenance:** Very actively maintained, updated July 2026

#### 2. gh-skyline

- **Description:** Generate a 3D model of your GitHub contribution history. Visualize coding activity as a physical artifact.
- **Use Case:** Contribution visualization, team motivation
- **Installation:** `gh extension install github/gh-skyline`
- **Pricing:** Free
- **Maintenance:** GitHub-maintained

#### 3. gh-montage

- **Description:** Generate montage from GitHub user avatars. Visual representation of contributors.
- **Use Case:** Team pages, contributor recognition
- **Installation:** `gh extension install andyfeller/gh-montage`
- **Pricing:** Free

### Issue & PR Management

#### 4. gh-stack

- **Description:** GitHub Stacked PRs — manage dependent pull requests as a stack. Essential for feature branch workflows.
- **Use Case:** Stacked PR workflows, incremental code review
- **Installation:** `gh extension install github/gh-stack`
- **Pricing:** Free
- **Maintenance:** GitHub-maintained, updated July 2026

#### 5. gh-poi

- **Description:** Safely clean up local branches that have been merged. Prevents accidental deletion of unmerged work.
- **Use Case:** Branch cleanup, workspace hygiene
- **Installation:** `gh extension install seachicken/gh-poi`
- **Pricing:** Free
- **Maintenance:** Actively maintained

#### 6. gh-branch

- **Description:** Fuzzy finding, quick switching, and deleting branches. Dramatically faster than git branch commands.
- **Use Case:** Branch navigation, branch management
- **Installation:** `gh extension install mislav/gh-branch`
- **Pricing:** Free

#### 7. gh-i

- **Description:** Search GitHub issues interactively. Fuzzy search across issue titles and bodies.
- **Use Case:** Issue discovery, bug triage
- **Installation:** `gh extension install gennaro-tedesco/gh-i`
- **Pricing:** Free

#### 8. gh-f

- **Description:** The ultimate compact fzf gh extension — fuzzy find anything across repos, PRs, issues.
- **Use Case:** Universal fuzzy search for GitHub
- **Installation:** `gh extension install gennaro-tedesco/gh-f`
- **Pricing:** Free

#### 9. gh-s

- **Description:** Search GitHub repositories interactively. Find repos by name, description, or topic.
- **Use Case:** Repository discovery, dependency research
- **Installation:** `gh extension install gennaro-tedesco/gh-s`
- **Pricing:** Free

### CI/CD & Automation

#### 10. gh-aw (Agentic Workflows)

- **Description:** GitHub's official agentic workflows extension. Transform natural language markdown into GitHub Actions. AI-powered CI/CD automation.
- **Use Case:** AI-powered workflow creation, CI/CD automation
- **Installation:** `gh extension install github/gh-aw`
- **Pricing:** Free
- **Maintenance:** GitHub-maintained, actively developed (4.8K stars)

#### 11. gh-signoff

- **Description:** Local CI — sign off on your own work before pushing. Run checks locally before they hit CI.
- **Use Case:** Pre-push validation, local CI
- **Installation:** `gh extension install basecamp/gh-signoff`
- **Pricing:** Free
- **Maintenance:** Actively maintained (1.8K stars)

#### 12. gh-actions-importer

- **Description:** Migrate CI/CD pipelines from Azure DevOps, Bamboo, Bitbucket, CircleCI, GitLab, Jenkins, and Travis CI to GitHub Actions.
- **Use Case:** CI migration, pipeline automation
- **Installation:** `gh extension install github/gh-actions-importer`
- **Pricing:** Free
- **Maintenance:** GitHub-maintained

#### 13. gh-repo-stats

- **Description:** Pull statistics on repository metadata used in GitHub migrations. Assess migration readiness.
- **Use Case:** Migration planning, repo analysis
- **Installation:** `gh extension install mona-actions/gh-repo-stats`
- **Pricing:** Free

### Notifications

#### 14. gh-notify

- **Description:** Display GitHub notifications in terminal. Filter by repo, type, and status.
- **Use Case:** Notification management, staying updated
- **Installation:** `gh extension install meiji163/gh-notify`
- **Pricing:** Free
- **Maintenance:** Actively maintained

#### 15. gh-not

- **Description:** Rule-based notifications management. Auto-mark, filter, and organize notifications.
- **Use Case:** Notification automation, inbox management
- **Installation:** `gh extension install nobe4/gh-not`
- **Pricing:** Free

### Security & Analysis

#### 16. gh-sbom

- **Description:** Generate Software Bill of Materials (SBOMs) with gh CLI. Supply chain security compliance.
- **Use Case:** Supply chain security, compliance reporting
- **Installation:** `gh extension install advanced-security/gh-sbom`
- **Pricing:** Free
- **Maintenance:** GitHub-maintained

#### 17. gh-codeql

- **Description:** GitHub CLI extension for working with CodeQL — semantic code analysis engine.
- **Use Case:** Security analysis, vulnerability detection
- **Installation:** `gh extension install github/gh-codeql`
- **Pricing:** Free
- **Maintenance:** GitHub-maintained

#### 18. gh-mrva

- **Description:** Run CodeQL queries at scale using Multi-Repository Variant Analysis.
- **Use Case:** Large-scale security analysis
- **Installation:** `gh extension install GitHubSecurityLab/gh-mrva`
- **Pricing:** Free

### Repository Management

#### 19. gh-markdown-preview

- **Description:** Preview Markdown exactly as it appears on GitHub. Local rendering with GitHub Flavored Markdown.
- **Use Case:** README preview, documentation writing
- **Installation:** `gh extension install yusukebe/gh-markdown-preview`
- **Pricing:** Free

#### 20. gh-repo-explore

- **Description:** Interactively explore a repository without cloning. Browse files, view content, navigate structure.
- **Use Case:** Quick repo inspection, dependency review
- **Installation:** `gh extension install samcoe/gh-repo-explore`
- **Pricing:** Free

#### 21. gh-eco

- **Description:** Explore the GitHub ecosystem. Browse trending repos, topics, and developer profiles.
- **Use Case:** Discovery, research, community engagement
- **Installation:** `gh extension install jrnxf/gh-eco`
- **Pricing:** Free

### Productivity & Workflow

#### 22. gh-token

- **Description:** Manage installation access tokens for GitHub apps from terminal. Token lifecycle management.
- **Use Case:** GitHub App token management, CI/CD authentication
- **Installation:** `gh extension install Link-/gh-token`
- **Pricing:** Free

#### 23. gh-user-status

- **Description:** Set and get GitHub user statuses. Show availability to team.
- **Use Case:** Team visibility, availability management
- **Installation:** `gh extension install vilmibm/gh-user-status`
- **Pricing:** Free

#### 24. gh-tidy

- **Description:** Clean up Git workspace to get ready for the day. Prune branches, fetch updates, clean stale refs.
- **Use Case:** Morning workspace setup
- **Installation:** `gh extension install HaywardMorihara/gh-tidy`
- **Pricing:** Free

#### 25. gh-milestone

- **Description:** Manage GitHub Milestones from CLI. Create, list, close milestones.
- **Use Case:** Project management, release planning
- **Installation:** `gh extension install valeriobelli/gh-milestone`
- **Pricing:** Free

#### 26. gh-label

- **Description:** Manage GitHub labels from CLI. Create, list, update, delete labels.
- **Use Case:** Label management, issue organization
- **Installation:** `gh extension install heaths/gh-label`
- **Pricing:** Free

### Migration & Enterprise

#### 27. gh-gei

- **Description:** Migration CLI for GitHub-to-GitHub migrations. Transfer repos, issues, PRs between organizations.
- **Use Case:** Organization migration, repo transfer
- **Installation:** `gh extension install github/gh-gei`
- **Pricing:** Free
- **Maintenance:** GitHub-maintained

#### 28. gh-es

- **Description:** GitHub's official CLI tool for Enterprise Server. Manage GHES instances from terminal.
- **Use Case:** Enterprise Server management
- **Installation:** `gh extension install github/gh-es`
- **Pricing:** Free

## Productivity Gain

**Rating: 4/5**

GitHub CLI extensions significantly reduce context switching between terminal and browser. The `gh-dash` dashboard alone replaces multiple browser tabs. Extensions like `gh-stack`, `gh-poi`, and `gh-tidy` automate routine Git workflows. The `gh-aw` agentic workflows extension represents the future of AI-powered CI/CD.

## Maintenance

| Extension           | Stars | Last Updated | Activity Level |
| ------------------- | ----- | ------------ | -------------- |
| gh-dash             | 12.1K | 2026-07-20   | Very Active    |
| gh-aw               | 4.8K  | 2026-07-19   | Very Active    |
| gh-signoff          | 1.8K  | 2026-07-18   | Active         |
| gh-skyline          | 1.3K  | 2026-07-20   | Active         |
| gh-actions-importer | 1.2K  | 2026-07-17   | Active         |
| gh-poi              | 979   | 2026-07-17   | Active         |
| gh-stack            | 535   | 2026-07-20   | Active         |

## Hardware Impact

- **Minimal:** Extensions are lightweight executables (1-10MB each)
- **No background processes:** Extensions run on-demand only
- **Network:** Extensions require GitHub API access (rate limits apply)
- **Storage:** Each extension ~1-5MB installed

## Compatibility

- **Platforms:** Windows, macOS, Linux
- **GitHub CLI Version:** Requires gh 2.0+
- **GitHub Platforms:** github.com, GitHub Enterprise Server, GitHub AE
- **Architecture:** x64, ARM64

## Bhavya Usefulness

**Rating: 5/5**

GitHub CLI extensions are essential for any team using GitHub. They bring GitHub features to the terminal where developers already work. For Bhavya Foundation, `gh-dash` (dashboard), `gh-aw` (agentic workflows), `gh-stack` (stacked PRs), and `gh-poi` (branch cleanup) provide immediate value. The extension system is simple enough that custom extensions can be built for Bhavya-specific workflows.

## Reusable Ideas for GitHub OS

1. **Extension Template:** Create a `gh-bhavya` extension for Bhavya-specific workflows
2. **Agentic Workflows:** Adopt `gh-aw` pattern for AI-powered CI/CD automation
3. **Stacked PRs:** Use `gh-stack` for incremental code review workflows
4. **Branch Hygiene:** Automate `gh-poi` in CI/CD for branch cleanup
5. **Custom Dashboard:** Build `gh-dash`-style dashboards for Bhavya project metrics

## Evidence

- **Source:** https://github.com/myzkey/awesome-gh-extensions
- **Source:** https://cli.github.com/manual/gh_extension
- **Source:** https://github.github.com/gh-aw/setup/cli
- **Date collected:** 2026-08-03
- **Why it matters:** GitHub CLI extensions bring GitHub features to the terminal, reducing browser context switching
- **Trade-offs:** Extensions are community-maintained (quality varies); some may break with gh updates; limited to GitHub ecosystem
- **Expected value:** 20-30% reduction in GitHub-related browser tab switching
- **Maintenance burden:** Low — extensions are simple executables; `gh extension upgrade` updates all
