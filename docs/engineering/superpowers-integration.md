# Superpowers Integration — Bhavya Foundation

**Date:** 2026-09-07
**Status:** Installed and verified

## 1. Superpowers Installation

Superpowers is installed as an OpenCode plugin via `opencode.json`:

```json
{
  "plugin": ["superpowers@git+https://github.com/obra/superpowers.git"]
}
```

Version: 5.0.4 (from `.opencode/skills/superpowers/package.json`)

## 2. OpenCode Integration

The plugin integrates with OpenCode through:

- `experimental.chat.messages.transform` hook — injects superpowers awareness
- `config` hook — registers skills directory

Skills are discovered automatically by OpenCode's skill tool.

## 3. Available Skills

### Superpowers Skills (14)

From `.opencode/skills/superpowers/skills/`:

| Skill                          | Purpose                              |
| ------------------------------ | ------------------------------------ |
| brainstorming                  | Explore intent before implementation |
| dispatching-parallel-agents    | Run independent tasks in parallel    |
| executing-plans                | Execute written implementation plans |
| finishing-a-development-branch | Complete development work            |
| receiving-code-review          | Handle review feedback               |
| requesting-code-review         | Request review on completed work     |
| subagent-driven-development    | Use subagents for bounded tasks      |
| systematic-debugging           | Debug with root cause analysis       |
| test-driven-development        | TDD workflow                         |
| using-git-worktrees            | Isolated feature work                |
| using-superpowers              | How to find and use skills           |
| verification-before-completion | Verify before claiming done          |
| writing-plans                  | Create implementation plans          |
| writing-skills                 | Create and edit skills               |

### Bhavya Skills (22)

From `.opencode/skills/bhavya-*`:

| Skill                          | Purpose                          |
| ------------------------------ | -------------------------------- |
| bhavya-architecture            | Inspect and evolve architecture  |
| bhavya-design-system           | Enforce dual-mode design system  |
| bhavya-content-truth           | Prevent data fabrication         |
| bhavya-data-model              | Manage canonical entities        |
| bhavya-route-audit             | Audit routes and navigation      |
| bhavya-ui-verification         | Verify UI implementation         |
| bhavya-security                | Verify security practices        |
| bhavya-github-workflow         | Git workflow conventions         |
| bhavya-production-verification | Production readiness checks      |
| bhavya-ai-development          | AI agent development guide       |
| bhavya-qa                      | Browser-driven QA                |
| bhavya-autoplan                | Auto-review pipeline             |
| bhavya-canary                  | Post-deploy monitoring           |
| bhavya-freeze                  | Scope lock for debugging         |
| bhavya-investigate             | Systematic debugging             |
| bhavya-learn                   | Persistent engineering knowledge |
| bhavya-plan-review             | Structured plan review           |
| bhavya-retro                   | Weekly retrospective             |
| bhavya-review                  | Pre-landing code review          |
| bhavya-security-audit          | CSO security audit               |
| bhavya-ship                    | Ship workflow                    |
| bhavya-spec                    | Specification development        |

## 4. Skill Precedence

1. **Project skills** (`.opencode/skills/bhavya-*`) — highest priority
2. **Personal skills** (`~/.config/opencode/skills/`)
3. **Superpowers skills** (`.opencode/skills/superpowers/skills/`) — lowest priority

Bhavya-specific skills override generic superpowers skills when both apply.

## 5. Execution Workflow

For substantive engineering tasks, follow this sequence:

```
BRAINSTORM (superpowers/brainstorming)
    ↓
SPECIFICATION (bhavya-spec)
    ↓
PLAN (superpowers/writing-plans)
    ↓
TDD (superpowers/test-driven-development)
    ↓
IMPLEMENTATION (superpowers/subagent-driven-development)
    ↓
REVIEW (bhavya-review)
    ↓
VERIFICATION (bhavya-production-verification)
    ↓
GIT (bhavya-github-workflow)
```

## 6. Verification Workflow

Every completion requires evidence:

1. `pnpm typecheck` — passes
2. `pnpm lint` — passes
3. `pnpm test` — passes
4. `pnpm build` — succeeds
5. Route audit — no broken links
6. Security check — no vulnerabilities
7. Git status — clean
8. CI — passes

Use `bhavya-production-verification` skill for structured verification.

## 7. Known Limitations

- Superpowers plugin requires OpenCode restart to pick up changes
- Some Windows environments may have git-backed plugin cache issues
- Plugin installs through OpenCode's plugin manager, not npm directly
- Skills are discovered at session start, not dynamically

## 8. Upgrade Procedure

To upgrade Superpowers:

1. Update `opencode.json` plugin spec if pinning a version:
   ```json
   "plugin": ["superpowers@git+https://github.com/obra/superpowers.git#v5.1.0"]
   ```
2. Restart OpenCode
3. Verify with: "Tell me about your superpowers"

To clear cache if updates don't appear:

- Clear OpenCode's package cache
- Or reinstall the plugin

## 9. Repository Baseline

### Pre-Integration Status

| Check     | Status  | Notes                                            |
| --------- | ------- | ------------------------------------------------ |
| Typecheck | PARTIAL | 52/58 pass. `app-social-os` fails (pre-existing) |
| Lint      | PARTIAL | 14/25 pass. `kernel` fails (pre-existing)        |
| Tests     | PARTIAL | 4/20 pass. `runtime` fails (pre-existing)        |
| Build     | NOT RUN | Covered by CI                                    |

### Post-Integration Status

| Check         | Status   | Notes                                              |
| ------------- | -------- | -------------------------------------------------- |
| Typecheck     | SAME     | No new failures introduced                         |
| Lint          | SAME     | No new failures introduced                         |
| Tests         | SAME     | No new failures introduced                         |
| Skills        | VERIFIED | 22 Bhavya skills + 14 Superpowers skills available |
| AGENTS.md     | UPDATED  | Engineering constitution added                     |
| opencode.json | UPDATED  | Plugin entry added                                 |
