# Capability Inventory (2026-09-17, Phase 0)

## Project skills (`.opencode/skills/`, 12 — prompt-executable, doc-only)

bhavya-ai-development, bhavya-architecture, bhavya-content-truth, bhavya-data-model, bhavya-design-system, bhavya-github-workflow, bhavya-production-verification, bhavya-reasons-canvas, bhavya-route-audit, bhavya-security, bhavya-spec, bhavya-ui-verification. Status: PRESENT, loadable via skill tool.

## Superpowers skills (via `opencode.json` → `superpowers@git+https://github.com/obra/superpowers.git`)

Materialized at `C:\Users\kanta\.cache\opencode\packages\superpowers@git+https_\github.com\obra\superpowers.git\node_modules\superpowers\skills\` — 13 skills: brainstorming, dispatching-parallel-agents, executing-plans, finishing-a-development-branch, receiving-code-review, requesting-code-review, subagent-driven-development, systematic-debugging, test-driven-development, using-git-worktrees, using-superpowers, verification-before-completion, writing-plans, writing-skills. Status: RECOVERED (project-local mirror path `.opencode/skills/superpowers/` absent, but skills loadable). See CAPABILITY_RECOVERY.md.

## Global / Claude / agents skills

`~/.config/opencode/skills/`: none found. `.claude/skills/`: absent. `.agents/skills/`: not present (agent profiles live in `.ai/agents/` + `platform/agents/` + `bar/agents/` doc-only).

## MCP (from `opencode.json`: `$schema`, `plugin`, `default_agent`, `agent`, `mcp`)

MCP servers configured: github-mcp (file-backed token — protected user work), cloudflare builds/observability, context7, playwright (configured; browser-side availability unverified locally). No credential values inspected.

## Repository capabilities

- Runtime daemon (`packages/runtime/daemon/watch.mjs`), `MemoryEngine` (`packages/memory-engine/`), 11 contracts, turbo pipeline, antislop gate, file-map/token/registry/drift generators, CI (antislop+lint+typecheck+test+build+secret-scan), dual deploy (Vercel + Cloudflare/opennext), 127-route canonical app.
