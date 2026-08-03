# Cursor Extensions — Knowledge Package

## Executive Summary

Cursor is an AI-native code editor built as a VS Code fork by Anysphere. In 2026, it has evolved from an "AI autocomplete editor" to a full agentic development platform with cloud agents, subagents, and its own frontier models. Cursor supports most VS Code extensions (since it's a VS Code fork), but its real differentiation lies in deeply integrated AI features that go beyond any plugin: Agent Mode, Composer, Cloud Agents, and project-wide context understanding. Used by 50%+ of Fortune 500 companies including NVIDIA (40K engineers) and Salesforce.

## Tools by Category

### Native AI Features (Not Extensions — Built Into Cursor)

#### 1. Agent Mode (Cmd+I)

- **Description:** Full autonomous coding agent that plans and executes multi-step work across entire projects. Orchestrates system instructions, tools, and prompts for autonomous coding.
- **Use Case:** Multi-file refactoring, feature implementation, bug fixing
- **Maintenance:** Core Cursor feature, updated monthly

#### 2. Composer

- **Description:** Cursor's frontier coding model for multi-step reasoning, cross-file context, and large refactors. Generates entire new files from descriptions.
- **Use Case:** New file generation, large-scale refactoring, architecture changes
- **Maintenance:** Core Cursor feature

#### 3. Cloud Agents

- **Description:** AI agents running in isolated virtual machines with full dev environments. Run continuously even with laptop closed. Test changes against real runtime environments.
- **Use Case:** Long-running tasks, background CI/CD, parallel development
- **Maintenance:** Cursor 3+ feature (April 2026)

#### 4. Subagents

- **Description:** Specialized AI agents working in parallel as part of larger Agent Mode tasks. Decompose complex tasks across codebase.
- **Use Case:** Parallel code generation, multi-component development
- **Maintenance:** Cursor 3+ feature

#### 5. Background Agents

- **Description:** Agents that run while you work on other things. Complete tasks, create PRs, and report status.
- **Use Case:** Background feature development, automated code review
- **Maintenance:** Cursor 3+ feature

#### 6. Tab Completion (Copilot++)

- **Description:** Predicts entire multi-line edits, not just next-word autocomplete. Understands edit intent, not just typing.
- **Use Case:** Day-to-day coding, rapid prototyping
- **Maintenance:** Core Cursor feature

### Cursor-Specific Configuration

#### 7. .cursorrules

- **Description:** Project-level rules file defining coding conventions, style preferences, and AI behavior. The single highest-impact configuration for team consistency.
- **Use Case:** Team coding standards, AI behavior customization
- **Installation:** Create `.cursorrules` file in project root
- **Pricing:** Free
- **Maintenance:** Project-specific configuration

#### 8. Cursor Rules (Global)

- **Description:** Global rules that apply across all projects. Define personal preferences and coding standards.
- **Use Case:** Personal coding preferences, global standards
- **Installation:** Configure in Cursor settings
- **Pricing:** Free

### VS Code Extension Compatibility

Since Cursor is a VS Code fork, most VS Code extensions work. Key compatible extensions:

#### 9. GitLens (Compatible)

- **Description:** Full GitLens functionality works in Cursor. Blame annotations, history visualization, branch comparison.
- **Use Case:** Git history and blame
- **Compatibility:** Full — imports with VS Code settings

#### 10. ESLint + Prettier (Compatible)

- **Description:** Both ESLint and Prettier work identically in Cursor. Same configuration, same behavior.
- **Use Case:** Code quality and formatting
- **Compatibility:** Full

#### 11. Docker Extension (Compatible)

- **Description:** Docker management works in Cursor. Container inspection, Compose management, log viewing.
- **Use Case:** Container development
- **Compatibility:** Full

#### 12. Remote Development (Compatible)

- **Description:** SSH, Containers, and WSL remote development all work in Cursor.
- **Use Case:** Remote development
- **Compatibility:** Full

### Extensions With Known Issues

#### 13. Some Extensions May Behave Differently

- **Description:** While most extensions work, some may have partial compatibility or behave differently due to Cursor's AI integration layers.
- **Use Case:** Check before assuming critical extensions work identically
- **Recommendation:** Test extensions before committing to Cursor as primary editor

### Cursor-Specific Tools

#### 14. MCP (Model Context Protocol) Support

- **Description:** Native MCP support allows Cursor to connect to external tools, documentation, and data sources at inference time.
- **Use Case:** External tool integration, documentation access, custom data sources
- **Installation:** Configure MCP servers in Cursor settings
- **Pricing:** Free

#### 15. BugBot (Add-on)

- **Description:** AI-powered PR reviews with custom rules. Automated code review for pull requests.
- **Use Case:** Automated code review, PR quality gates
- **Pricing:** $40/user/mo add-on
- **Maintenance:** Cursor-maintained

## Productivity Gain

**Rating: 5/5**

Cursor's native AI features provide the highest productivity gains of any editor in 2026. The combination of Agent Mode, Composer, and Cloud Agents enables autonomous development workflows that reduce manual coding time by 50-70%. Tab completion is noticeably faster and more accurate than GitHub Copilot.

## Maintenance

| Feature        | Update Frequency | Reliability | Cost                  |
| -------------- | ---------------- | ----------- | --------------------- |
| Agent Mode     | Monthly          | High        | Included in Pro       |
| Composer       | Monthly          | High        | Included in Pro       |
| Cloud Agents   | Monthly          | Medium-High | Included in Pro+      |
| Tab Completion | Continuous       | Very High   | Included in all tiers |
| MCP Support    | Quarterly        | High        | Free                  |

### Pricing (2026)

- **Hobby:** Free — Limited Agent/Tab usage
- **Pro:** $20/mo — Extended Agent limits, unlimited Tab, Background Agents
- **Pro+:** $60/mo — 3× usage on supported models
- **Ultra:** $200/mo — 20× usage + priority features
- **Teams:** $40/user/mo — Org controls, SSO, analytics

## Hardware Impact

- **RAM:** 300-500MB base (VS Code fork overhead)
- **AI Features:** Additional 200-400MB for AI language models
- **Cloud Agents:** No local resource impact (runs in cloud VMs)
- **Disk:** ~500MB for Cursor installation
- **Network:** Requires internet for AI features; completely useless offline

## Compatibility

- **Platforms:** macOS, Windows, Linux
- **VS Code Extensions:** Most compatible (VS Code fork)
- **VS Code Settings:** One-click import on first launch
- **Models Supported:** Claude 4.x, GPT-5.x, Gemini 3.x, o1, Cursor's own Composer models
- **Git:** Full Git integration, works with all Git hosting

## Bhavya Usefulness

**Rating: 4/5**

Cursor is the most capable AI editor available. For Bhavya Foundation, it's excellent for developers who want maximum AI assistance. However, the credit-based pricing can be unpredictable, and it requires internet connectivity. For teams with privacy or compliance requirements, consider Continue (open-source) or Codeium (free tier) as alternatives.

**Best for:** Professional developers writing code daily, teams wanting AI-native workflows
**Not ideal for:** Hobby coders, offline-first workflows, strict budget constraints

## Reusable Ideas for GitHub OS

1. **`.cursorrules` Pattern:** Adopt project-level AI configuration files (`.cursorrules` equivalent) for any AI tool
2. **Agent Architecture:** Study Cursor's Agent Mode + Subagent pattern for multi-agent orchestration
3. **Cloud Agent Pattern:** Background agent execution model applicable to CI/CD automation
4. **MCP Integration:** Model Context Protocol for connecting AI agents to external tools
5. **Settings Import:** One-click migration from existing editor configurations
6. **Rules-as-Code:** Define coding standards in machine-readable format for AI consumption

## Evidence

- **Source:** https://cursor.com/
- **Source:** https://prismic.io/blog/cursor-ai
- **Source:** https://computertech.co/cursor-review/
- **Source:** https://daily.dev/blog/cursor-ai-everything-you-should-know-about-the-new-ai-code-editor-in-one-place/
- **Date collected:** 2026-08-03
- **Why it matters:** Cursor represents the future of AI-native development; its patterns influence the entire developer tooling ecosystem
- **Trade-offs:** Credit-based pricing is unpredictable; completely offline-incompatible; costs 2-6x more than GitHub Copilot; not 100% VS Code compatible
- **Expected value:** 50-70% reduction in manual coding time for professional developers
- **Maintenance burden:** Low — Cursor handles updates; team must manage `.cursorrules` and MCP configs
