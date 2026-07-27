# Bhavya OS — Repository Reorganization Plan

**Date:** 2026-07-27
**Version:** 1.0
**Status:** In Progress

---

## Target Structure

```
bhavya-foundation/
├── apps/                    # Applications
├── packages/                # Shared packages
├── content/                 # Structured content (JSON/MDX)
├── docs/                    # Institutional knowledge
│
├── .ai/                     # AI Brain (constitution, mission, values)
├── .agents/                 # Autonomous workers (role definitions)
├── .memory/                 # Long-term memory
├── .workflows/              # Executable workflows
├── .tasks/                  # Autonomous backlog (todo/doing/review/completed)
├── .registry/               # Resource registry (JSON)
├── .events/                 # Event-driven system
├── .prompts/                # Prompt templates
├── .skills/                 # Reusable skills
├── .commands/               # Founder commands
├── .templates/              # Content templates
├── .analytics/              # Analytics and monitoring
├── .logs/                   # Agent logs
├── .snapshots/              # Daily project snapshots
├── .security/               # Security policies
├── .tests/                  # Testing suites
├── .github/                 # GitHub config
```

---

## Migration Mapping

### 1. `.ai/` → AI Brain

**Current state:** 55 files across 15 subdirectories
**Target:** Clean brain structure with core documents

| Current                          | Target                   | Action           |
| -------------------------------- | ------------------------ | ---------------- |
| `.ai/` (existing)                | `.ai/`                   | Keep, reorganize |
| `governance/constitution.md`     | `.ai/CONSTITUTION.md`    | Move             |
| `governance/governance-model.md` | `.ai/MISSION.md`         | Move             |
| `governance/roadmap.md`          | `.ai/VISION.md`          | Move             |
| `ai/memory/values.md`            | `.ai/VALUES.md`          | Move             |
| `.ai/conventions.md`             | `.ai/CONSTRAINTS.md`     | Rename           |
| `design-system/`                 | `.ai/STYLE_GUIDE.md`     | Consolidate      |
| `.ai/coding-standards.md`        | `.ai/CODING_STANDARD.md` | Keep             |
| `.ai/decision-log.md`            | `.ai/DECISION_RULES.md`  | Rename           |
| `standards/`                     | `.ai/standards/`         | Move             |

### 2. `.agents/` → Autonomous Workers

**Current state:** 5 agent definitions + 25 skills
**Target:** Full role definitions for all agents

| Current                            | Target                   | Action        |
| ---------------------------------- | ------------------------ | ------------- |
| `.agents/founder.agent.json`       | `.agents/Founder.md`     | Convert to MD |
| `.agents/governance.agent.json`    | `.agents/CEO.md`         | Convert to MD |
| `.agents/release.agent.json`       | `.agents/CTO.md`         | Convert to MD |
| `.agents/documentation.agent.json` | `.agents/Writer.md`      | Convert to MD |
| (new)                              | `.agents/Designer.md`    | Create        |
| (new)                              | `.agents/Developer.md`   | Create        |
| (new)                              | `.agents/Reviewer.md`    | Create        |
| (new)                              | `.agents/Researcher.md`  | Create        |
| (new)                              | `.agents/SEO.md`         | Create        |
| (new)                              | `.agents/Translator.md`  | Create        |
| (new)                              | `.agents/Historian.md`   | Create        |
| (new)                              | `.agents/Legal.md`       | Create        |
| (new)                              | `.agents/Volunteer.md`   | Create        |
| (new)                              | `.agents/Donation.md`    | Create        |
| (new)                              | `.agents/SocialMedia.md` | Create        |
| (new)                              | `.agents/QA.md`          | Create        |
| (new)                              | `.agents/Security.md`    | Create        |

### 3. `.memory/` → Long-term Memory

**Current state:** 7 category directories with `_meta.json`
**Target:** Consolidated memory files

| Current             | Target                    | Action      |
| ------------------- | ------------------------- | ----------- |
| `memory/agents/`    | `.memory/agents.md`       | Consolidate |
| `memory/decisions/` | `.memory/projects.md`     | Consolidate |
| `memory/knowledge/` | `.memory/knowledge.md`    | Consolidate |
| `memory/projects/`  | `.memory/projects.md`     | Consolidate |
| `memory/releases/`  | `.memory/history.md`      | Consolidate |
| `memory/research/`  | `.memory/research.md`     | Consolidate |
| `memory/tasks/`     | `.memory/lessons.md`      | Consolidate |
| `ai/memory/`        | `.memory/`                | Merge       |
| (new)               | `.memory/people.md`       | Create      |
| (new)               | `.memory/meetings.md`     | Create      |
| (new)               | `.memory/architecture.md` | Create      |
| (new)               | `.memory/bugs.md`         | Create      |

### 4. `.workflows/` → Executable Workflows

**Current state:** `.ai/WORKFLOWS.md`
**Target:** Individual workflow files

| Current            | Target                               | Action                      |
| ------------------ | ------------------------------------ | --------------------------- |
| `.ai/WORKFLOWS.md` | `.workflows/`                        | Split into individual files |
| (new)              | `.workflows/create-page.md`          | Create                      |
| (new)              | `.workflows/deploy.md`               | Create                      |
| (new)              | `.workflows/review-pr.md`            | Create                      |
| (new)              | `.workflows/write-blog.md`           | Create                      |
| (new)              | `.workflows/publish-news.md`         | Create                      |
| (new)              | `.workflows/research-forest.md`      | Create                      |
| (new)              | `.workflows/research-heritage.md`    | Create                      |
| (new)              | `.workflows/upload-documents.md`     | Create                      |
| (new)              | `.workflows/generate-report.md`      | Create                      |
| (new)              | `.workflows/fundraising.md`          | Create                      |
| (new)              | `.workflows/volunteer-onboarding.md` | Create                      |

### 5. `.tasks/` → Autonomous Backlog

**Current state:** `.ai/tasks/` with contracts
**Target:** Kanban-style task system

| Current                | Target              | Action |
| ---------------------- | ------------------- | ------ |
| `.ai/tasks/`           | `.tasks/`           | Move   |
| `.ai/tasks/contracts/` | `.tasks/todo/`      | Move   |
| (new)                  | `.tasks/doing/`     | Create |
| (new)                  | `.tasks/review/`    | Create |
| (new)                  | `.tasks/completed/` | Create |

### 6. `.registry/` → Resource Registry

**Current state:** `registry/` with 8 JSON files
**Target:** Consolidated registry

| Current                         | Target                      | Action        |
| ------------------------------- | --------------------------- | ------------- |
| `registry/agents.json`          | `.registry/agents.json`     | Move          |
| `registry/apps.json`            | `.registry/pages.json`      | Move + rename |
| `registry/knowledge-graph.json` | `.registry/knowledge.json`  | Move + rename |
| `registry/packages.json`        | `.registry/components.json` | Move + rename |
| `registry/search-index.json`    | `.registry/search.json`     | Move + rename |
| `registry/services.json`        | `.registry/services.json`   | Move          |
| `registry/standards.json`       | `.registry/standards.json`  | Move          |
| `registry/workflows.json`       | `.registry/workflows.json`  | Move          |
| (new)                           | `.registry/documents.json`  | Create        |
| (new)                           | `.registry/prompts.json`    | Create        |
| (new)                           | `.registry/models.json`     | Create        |
| (new)                           | `.registry/mcp.json`        | Create        |
| (new)                           | `.registry/plugins.json`    | Create        |

### 7. `.events/` → Event-driven System

**Current state:** `.ai/events/`
**Target:** Individual event definitions

| Current       | Target                         | Action |
| ------------- | ------------------------------ | ------ |
| `.ai/events/` | `.events/`                     | Move   |
| (new)         | `.events/website.updated.md`   | Create |
| (new)         | `.events/page.created.md`      | Create |
| (new)         | `.events/donation.received.md` | Create |
| (new)         | `.events/volunteer.joined.md`  | Create |
| (new)         | `.events/research.finished.md` | Create |
| (new)         | `.events/release.created.md`   | Create |

### 8. `.prompts/` → Prompt Templates

**Current state:** `.ai/prompts/`
**Target:** Individual prompt files

| Current        | Target                    | Action |
| -------------- | ------------------------- | ------ |
| `.ai/prompts/` | `.prompts/`               | Move   |
| (new)          | `.prompts/website.txt`    | Create |
| (new)          | `.prompts/writer.txt`     | Create |
| (new)          | `.prompts/designer.txt`   | Create |
| (new)          | `.prompts/reviewer.txt`   | Create |
| (new)          | `.prompts/seo.txt`        | Create |
| (new)          | `.prompts/developer.txt`  | Create |
| (new)          | `.prompts/qa.txt`         | Create |
| (new)          | `.prompts/translator.txt` | Create |

### 9. `.commands/` → Founder Commands

**Current state:** None
**Target:** Command definitions

| Current | Target                         | Action |
| ------- | ------------------------------ | ------ |
| (new)   | `.commands/publish.md`         | Create |
| (new)   | `.commands/release.md`         | Create |
| (new)   | `.commands/research.md`        | Create |
| (new)   | `.commands/create-page.md`     | Create |
| (new)   | `.commands/create-article.md`  | Create |
| (new)   | `.commands/create-event.md`    | Create |
| (new)   | `.commands/generate-report.md` | Create |
| (new)   | `.commands/improve-design.md`  | Create |
| (new)   | `.commands/audit.md`           | Create |

### 10. `.skills/` → Reusable Skills

**Current state:** `.agents/skills/` with 25 skills
**Target:** Consolidated skills directory

| Current             | Target     | Action |
| ------------------- | ---------- | ------ |
| `.agents/skills/`   | `.skills/` | Move   |
| `.opencode/skills/` | `.skills/` | Merge  |

### 11. `.templates/` → Content Templates

**Current state:** `.ai/templates/`
**Target:** All content templates

| Current                 | Target                     | Action |
| ----------------------- | -------------------------- | ------ |
| `.ai/templates/adr.md`  | `.templates/adr.md`        | Move   |
| `.ai/templates/task.md` | `.templates/task.md`       | Move   |
| (new)                   | `.templates/mission.md`    | Create |
| (new)                   | `.templates/blog.md`       | Create |
| (new)                   | `.templates/page.md`       | Create |
| (new)                   | `.templates/report.md`     | Create |
| (new)                   | `.templates/volunteer.md`  | Create |
| (new)                   | `.templates/newsletter.md` | Create |
| (new)                   | `.templates/policy.md`     | Create |
| (new)                   | `.templates/research.md`   | Create |
| (new)                   | `.templates/rfc.md`        | Create |
| (new)                   | `.templates/meeting.md`    | Create |

### 12. `.analytics/` → Analytics

**Current state:** None
**Target:** Analytics structure

| Current | Target                        | Action |
| ------- | ----------------------------- | ------ |
| (new)   | `.analytics/seo.md`           | Create |
| (new)   | `.analytics/traffic.md`       | Create |
| (new)   | `.analytics/performance.md`   | Create |
| (new)   | `.analytics/accessibility.md` | Create |
| (new)   | `.analytics/lighthouse.md`    | Create |
| (new)   | `.analytics/broken-links.md`  | Create |

### 13. `.logs/` → Agent Logs

**Current state:** None
**Target:** Agent log files

| Current | Target                | Action |
| ------- | --------------------- | ------ |
| (new)   | `.logs/designer.log`  | Create |
| (new)   | `.logs/developer.log` | Create |
| (new)   | `.logs/reviewer.log`  | Create |
| (new)   | `.logs/research.log`  | Create |

### 14. `.snapshots/` → Daily Snapshots

**Current state:** `.ai/snapshots/`
**Target:** Daily project snapshots

| Current          | Target              | Action |
| ---------------- | ------------------- | ------ |
| `.ai/snapshots/` | `.snapshots/`       | Move   |
| (new)            | `.snapshots/daily/` | Create |

### 15. `.security/` → Security

**Current state:** `governance/security.md`, `standards/security.md`
**Target:** Consolidated security

| Current                  | Target                          | Action |
| ------------------------ | ------------------------------- | ------ |
| `governance/security.md` | `.security/permissions.md`      | Move   |
| `standards/security.md`  | `.security/threat-model.md`     | Move   |
| (new)                    | `.security/secrets-policy.md`   | Create |
| (new)                    | `.security/dependency-audit.md` | Create |

### 16. `.tests/` → Testing

**Current state:** Scattered test files
**Target:** Organized test suites

| Current | Target                      | Action |
| ------- | --------------------------- | ------ |
| (new)   | `.tests/accessibility/`     | Create |
| (new)   | `.tests/seo/`               | Create |
| (new)   | `.tests/playwright/`        | Create |
| (new)   | `.tests/unit/`              | Create |
| (new)   | `.tests/integration/`       | Create |
| (new)   | `.tests/performance/`       | Create |
| (new)   | `.tests/visual-regression/` | Create |

### 17. `docs/` → Institutional Knowledge

**Current state:** 11 books + 8 other docs
**Target:** Organized knowledge base

| Current       | Target             | Action             |
| ------------- | ------------------ | ------------------ |
| `docs/Books/` | `docs/`            | Move books to root |
| `governance/` | `docs/governance/` | Move               |
| `standards/`  | `docs/standards/`  | Move               |
| `specs/`      | `docs/specs/`      | Move               |
| `rfcs/`       | `docs/rfcs/`       | Move               |
| `history/`    | `docs/history/`    | Move               |
| `validation/` | `docs/validation/` | Move               |

### 18. `content/` → Structured Content

**Current state:** 8 MDX + 31 JSON files
**Target:** Organized content

| Current    | Target                | Action           |
| ---------- | --------------------- | ---------------- |
| `content/` | `content/`            | Keep, reorganize |
| (new)      | `content/articles/`   | Create           |
| (new)      | `content/forests/`    | Create           |
| (new)      | `content/heritage/`   | Create           |
| (new)      | `content/library/`    | Create           |
| (new)      | `content/volunteers/` | Create           |
| (new)      | `content/events/`     | Create           |
| (new)      | `content/gallery/`    | Create           |
| (new)      | `content/media/`      | Create           |
| (new)      | `content/timeline/`   | Create           |
| (new)      | `content/research/`   | Create           |

### 19. `packages/` → Shared Packages

**Current state:** 16 packages
**Target:** Organized packages

| Current                     | Target                        | Action |
| --------------------------- | ----------------------------- | ------ |
| `packages/ui/`              | `packages/ui/`                | Keep   |
| `packages/bdl/`             | `packages/design-system/`     | Rename |
| `packages/mission-runtime/` | `packages/mission-runtime/`   | Keep   |
| `packages/runtime/`         | `packages/ai-runtime/`        | Rename |
| `packages/sdk/`             | `packages/sdk/`               | Keep   |
| (new)                       | `packages/analytics/`         | Create |
| (new)                       | `packages/seo/`               | Create |
| (new)                       | `packages/knowledge-engine/`  | Create |
| (new)                       | `packages/event-bus/`         | Create |
| (new)                       | `packages/agent-runtime/`     | Create |
| (new)                       | `packages/component-library/` | Create |

### 20. `apps/` → Applications

**Current state:** 10 Next.js apps
**Target:** Organized apps

| Current         | Target                  | Action |
| --------------- | ----------------------- | ------ |
| `apps/website/` | `apps/website/`         | Keep   |
| `apps/admin/`   | `apps/admin/`           | Keep   |
| `apps/docs/`    | `apps/docs/`            | Keep   |
| (new)           | `apps/dashboard/`       | Create |
| (new)           | `apps/portal/`          | Create |
| (new)           | `apps/cms/`             | Create |
| (new)           | `apps/mission-control/` | Create |

---

## Migration Order

1. **Phase 1:** Create `.ai/` brain structure
2. **Phase 2:** Reorganize `.agents/` with full role definitions
3. **Phase 3:** Consolidate `.memory/` from scattered sources
4. **Phase 4:** Create `.workflows/` from existing workflows
5. **Phase 5:** Create `.tasks/` from existing task system
6. **Phase 6:** Consolidate `.registry/` from scattered registries
7. **Phase 7:** Create `.events/` from existing event system
8. **Phase 8:** Create `.prompts/` from scattered prompts
9. **Phase 9:** Create `.commands/` for founder commands
10. **Phase 10:** Create `.templates/` from scattered templates
11. **Phase 11:** Create `.analytics/` structure
12. **Phase 12:** Create `.logs/` structure
13. **Phase 13:** Create `.snapshots/` structure
14. **Phase 14:** Create `.security/` structure
15. **Phase 15:** Reorganize `.tests/`
16. **Phase 16:** Clean up root directory
17. **Phase 17:** Update all references and imports

---

## MCP Servers to Add

| MCP             | Purpose                            |
| --------------- | ---------------------------------- |
| Filesystem      | Safe local file operations         |
| Git             | Commit, branch, history automation |
| Docker          | Build and manage containers        |
| SQLite/Postgres | Local data queries                 |
| Figma           | Design synchronization             |
| Browser         | Advanced web automation            |
| Notion          | Documentation sync                 |
| Slack/Discord   | Team notifications                 |
| Linear/Jira     | Issue management                   |
| Excalidraw      | Architecture diagrams              |

---

_This plan will be executed in phases. Each phase will be committed separately._
