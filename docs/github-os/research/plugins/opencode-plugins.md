# OpenCode Plugins — Knowledge Package

## Executive Summary

OpenCode is an open-source AI coding agent with a growing plugin ecosystem documented at opencode.ai and aggregated by awesome-opencode (8.9K GitHub stars, 643 forks). The ecosystem includes 80+ community plugins covering memory persistence, multi-agent orchestration, authentication providers, tool integrations, cost tracking, and workflow automation. Plugins extend OpenCode by hooking into events and modifying behavior. The ecosystem is maturing rapidly with official SDKs for JavaScript, TypeScript, Go, and Python, plus a plugin template for community contributions.

## Tools by Category

### Memory and Persistence

#### 1. Harness Memory

- **Description:** Persistent project memory across sessions. Maintains context about codebase decisions, architecture, and conventions.
- **Use Case:** Long-running projects, team knowledge retention
- **Installation:** Via OpenCode plugin system
- **Pricing:** Free
- **Maintenance:** Community-maintained

#### 2. opencode-claude-memory

- **Description:** Memory persistence compatible with Claude Code workflows. Cross-compatible memory layer.
- **Use Case:** Claude Code users switching to OpenCode
- **Installation:** Via OpenCode plugin system
- **Pricing:** Free

#### 3. supamem

- **Description:** Project-agnostic dual-memory MCP CLI. Semantic memory (Qdrant hybrid retrieval) and structural memory hooks. Ships installer that wires qdrant-find/qdrant-store tools.
- **Use Case:** Advanced memory retrieval, semantic search across codebase
- **Installation:** pip install supamem
- **Pricing:** Free (MIT license)
- **GitHub:** https://github.com/dzmitrys-dev/supamem/

### Multi-Agent Orchestration

#### 4. FlowDeck

- **Description:** Multi-agent workflow orchestration with phases (discuss, plan, execute, review). Orchestrates architect, planner, coder, reviewer, tester, debugger, risk-analyst, and policy-enforcer agents. 110+ tests.
- **Use Case:** Complex feature development, team workflows
- **Installation:** Via OpenCode plugin system
- **Pricing:** Free
- **Maintenance:** Actively maintained, well-tested

#### 5. OpenCode Mission Control

- **Description:** Parallel agent management. Run multiple AI agents simultaneously with centralized coordination.
- **Use Case:** Parallel development tasks, multi-component features
- **Installation:** Via OpenCode plugin system
- **Pricing:** Free

#### 6. Agentic

- **Description:** Modular AI agents and commands for structured development. Pre-built agent configurations for common development tasks.
- **Use Case:** Standardized development workflows
- **GitHub:** https://github.com/Cluster444/agentic

#### 7. opencode-agents

- **Description:** Configs, prompts, agents, and plugins for enhanced workflows. Community-contributed agent configurations.
- **Use Case:** Ready-to-use agent configurations
- **GitHub:** https://github.com/darrenhinde/opencode-agents

### Cost Tracking and Monitoring

#### 8. opencode-token-tracker

- **Description:** Displays input/output tokens, cache hits, reasoning tokens, latency, and cumulative session cost after each AI response. Toast notification for real-time cost visibility.
- **Use Case:** Cost monitoring, budget management
- **Installation:** Via OpenCode plugin system
- **Pricing:** Free

#### 9. opencode-quota

- **Description:** Quota management and spending limits for AI API usage. Prevent unexpected cost overruns.
- **Use Case:** Budget enforcement, team spending controls
- **Installation:** Via OpenCode plugin system
- **Pricing:** Free

### Debugging and Observability

#### 10. opencode-sentry-monitor

- **Description:** Trace and debug AI agents with Sentry AI Monitoring. Full observability into agent behavior and errors.
- **Use Case:** Agent debugging, error tracking
- **Installation:** Via OpenCode plugin system
- **Pricing:** Free
- **GitHub:** https://github.com/stolinski/opencode-sentry-monitor

#### 11. OC Monitor Share

- **Description:** CLI monitoring tool for analyzing OpenCode AI coding usage. Usage analytics and reporting.
- **Use Case:** Usage analytics, team reporting
- **GitHub:** https://github.com/Shlomob/ocmonitor-share

### Web and External Tools

#### 12. opencode-firecrawl

- **Description:** Web scraping, crawling, and search via the Firecrawl CLI. AI agents can access web content.
- **Use Case:** Web research, documentation gathering
- **Installation:** Via OpenCode plugin system
- **Pricing:** Free (Firecrawl may have usage limits)
- **GitHub:** https://github.com/firecrawl/opencode-firecrawl

#### 13. opencode-jfrog-plugin

- **Description:** JFrog platform integration. Artifact management, security scanning, and DevOps pipeline access.
- **Use Case:** JFrog Artifactory integration, supply chain security
- **Installation:** Via OpenCode plugin system
- **Pricing:** Free
- **GitHub:** https://github.com/jfrog/opencode-jfrog-plugin

### Workflow and Goals

#### 14. opencode-goal-plugin

- **Description:** Session-scoped /goal workflow that keeps objectives in context and auto-continues until complete. Goal-oriented development tracking.
- **Use Case:** Focused development sessions, objective tracking
- **Installation:** Via OpenCode plugin system
- **Pricing:** Free
- **GitHub:** https://github.com/willytop8/OpenCode-goal-plugin

#### 15. opencode-worktree

- **Description:** Zero-friction git worktrees for OpenCode. Isolated workspace management.
- **Use Case:** Parallel development, feature isolation
- **Installation:** Via OpenCode plugin system
- **Pricing:** Free
- **GitHub:** https://github.com/kdcokenny/opencode-worktree

### Editor and UI Integration

#### 16. OpenCode VS (VS Code Extension)

- **Description:** Copilot-style GUI for OpenCode inside VS Code. Wraps OpenCode server API with a familiar interface.
- **Use Case:** VS Code users wanting OpenCode capabilities
- **Installation:** VS Code Marketplace
- **Pricing:** Free
- **GitHub:** https://marketplace.visualstudio.com/items?itemName=RajendraRana.opencode-vscode-extension

#### 17. OpenChamber

- **Description:** Web and desktop interface for OpenCode with VS Code extension, multiple sessions, and git worktrees management.
- **Use Case:** GUI-based OpenCode interaction
- **GitHub:** https://github.com/btriapitsyn/openchamber

#### 18. opencode.nvim

- **Description:** Neovim plugin for editor-aware prompts, built on the OpenCode API.
- **Use Case:** Neovim users
- **GitHub:** https://github.com/NickvanDyke/opencode.nvim

#### 19. OpenCode-Obsidian

- **Description:** Obsidian plugin that embeds OpenCode in Obsidian's UI. AI coding within note-taking workflow.
- **Use Case:** Obsidian-based documentation workflows
- **GitHub:** https://github.com/mtymek/opencode-obsidian

### Package Management

#### 20. OCX

- **Description:** OpenCode extension manager with portable, isolated profiles. ShadCN model for plugin management.
- **Use Case:** Plugin management, profile isolation
- **GitHub:** https://github.com/kdcokenny/ocx

### Enterprise and Multi-Platform

#### 21. OpenAgent

- **Description:** Self-hosted control plane for OpenCode agents with isolated Linux workspaces (systemd-nspawn), git-backed Library configuration, and multi-platform dashboards (Next.js web, SwiftUI iOS).
- **Use Case:** Enterprise agent management, self-hosted deployment
- **GitHub:** https://github.com/Th0rgal/openagent

#### 22. Open Dispatch

- **Description:** Bridge app connecting chat platforms (Slack/Teams/Discord) to AI coding assistants. Run agents locally or spin up isolated Fly.io Sprites. Supports 75+ AI providers.
- **Use Case:** ChatOps, team collaboration, multi-platform access
- **GitHub:** https://github.com/bobum/open-dispatch

#### 23. CodeNomad

- **Description:** Desktop, Web, Mobile and Remote Client App for OpenCode. Multi-platform access to AI coding.
- **Use Case:** Mobile and remote access
- **GitHub:** https://github.com/NeuralNomadsAI/CodeNomad

### SDKs

#### 24. JavaScript/TypeScript SDK

- **Description:** Official OpenCode SDK for JavaScript and TypeScript. Build OpenCode integrations and extensions.
- **Use Case:** Custom OpenCode tooling, web integrations

#### 25. Python SDK

- **Description:** Official OpenCode SDK for Python. Build OpenCode integrations and automation.
- **Use Case:** Python-based automation, data pipeline integration

#### 26. Go SDK

- **Description:** Official OpenCode SDK for Go. Build high-performance OpenCode integrations.
- **Use Case:** Go-based tooling, performance-critical integrations

## Productivity Gain

**Rating: 4/5**

OpenCode plugins provide significant productivity gains for terminal-native developers. The multi-agent orchestration (FlowDeck) and memory persistence plugins are particularly impactful. Cost tracking plugins provide visibility into AI spending. However, the ecosystem is younger than VS Code/Cursor, and some plugins may have rough edges.

## Maintenance

| Plugin Category    | Quality Signal              | Update Frequency | Maturity    |
| ------------------ | --------------------------- | ---------------- | ----------- |
| Memory             | Growing                     | Monthly          | Medium      |
| Multi-Agent        | High (FlowDeck: 110+ tests) | Monthly          | Medium-High |
| Cost Tracking      | Medium                      | Quarterly        | Medium      |
| Editor Integration | Medium                      | Quarterly        | Early       |
| Enterprise         | Early                       | Variable         | Early       |

## Hardware Impact

- **Minimal:** Plugins are lightweight hooks and configurations
- **Memory plugins:** May require local database (Qdrant for supamem)
- **Agent orchestration:** Minimal overhead per agent
- **Network:** Most plugins require API access for AI models

## Compatibility

- **Platforms:** macOS, Linux, Windows (via WSL)
- **OpenCode Version:** Requires OpenCode CLI
- **Languages:** JavaScript, TypeScript, Python, Go (SDKs)
- **Editor Integration:** VS Code, Neovim, Obsidian, Custom GUIs

## Bhavya Usefulness

**Rating: 4/5**

OpenCode's plugin ecosystem is ideal for teams wanting extensible, cost-transparent AI coding. The multi-agent orchestration and memory plugins are particularly relevant for Bhavya Foundation's GitHub OS project. The terminal-native approach fits well with GitHub CLI workflows. However, the ecosystem is younger and may require more hands-on configuration than commercial alternatives.

## Reusable Ideas for GitHub OS

1. **Plugin Architecture:** Study OpenCode's event-hook plugin model for GitHub OS extensibility
2. **Multi-Agent Pattern:** FlowDeck's phase-based orchestration applicable to GitHub OS workflows
3. **Cost Transparency:** Token tracking pattern for AI usage visibility
4. **Memory Persistence:** Cross-session memory pattern for long-running projects
5. **ChatOps Bridge:** Open Dispatch pattern for team collaboration via Slack/Discord

## Evidence

- **Source:** https://opencode.ai/docs/plugins/
- **Source:** https://opencode.ai/docs/ecosystem/
- **Source:** https://github.com/awesome-opencode/awesome-opencode
- **Source:** https://composio.dev/content/best-opencode-plugins
- **Source:** https://www.blog.brightcoding.dev/2026/07/19/awesome-opencodeawesome-opencode-the-essential-plugin-registry-for-ai-coding-agents
- **Date collected:** 2026-08-03
- **Why it matters:** OpenCode represents the open-source alternative to commercial AI coding agents; its plugin ecosystem enables customization without vendor lock-in
- **Trade-offs:** Younger ecosystem than VS Code/Cursor; some plugins may be experimental; requires terminal comfort; community-maintained quality varies
- **Expected value:** 20-30% improvement in AI coding workflows with memory and multi-agent plugins
- **Maintenance burden:** Medium — plugins require manual updates; monitor for compatibility with OpenCode core updates
