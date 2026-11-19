# BFAOS V2 — 05 Agent Capability Matrix

**Date:** 2026-11-13 · **Base:** `master` @ `98388ddb`

## 1. Executable agents (the only ones that can act today)

| Agent | Definition | Mode | Tools / permissions | Status | Evidence |
|---|---|---|---|---|---|
| `bhavya` | `opencode.json` → `agent.bhavya` | primary, `steps: 150` | inherits tool permissions; `default_agent` for the project | OPERATIONAL | `opencode.json:5-10` |
| `build` | `agent.build` | primary | "full tool access for implementation tasks" | OPERATIONAL | `opencode.json:11-15` |
| `plan` | `agent.plan` | primary, **read-only enforced** | `read/glob/grep/list/todowrite/webfetch/websearch` = allow; **`edit`, `bash`, `task` = deny** | OPERATIONAL | `opencode.json:16-30` |
| `Explore` / `general` | harness subagents | — | explore = read-only; general = general purpose | OPERATIONAL | harness |

**Enforcement layer (user-scoped, machine-wide):** `D:\.config\opencode\opencode.jsonc` denies reading
`**/.env`, `**/*.env`, `**/.env.*`, `**/auth.json`, `**/mcp-auth.json`, `**/.git-credentials`,
`**/.npmrc`, `**/credentials*`, `**/*.pem`, `**/*.key`; denies editing `auth.json`, `mcp-auth.json`,
`.git-credentials`, `.npmrc`, `opencode.db*`; and requires `ask` for `git push*`, `git reset --hard*`,
`git clean*`, `git checkout -- *`, `git rm*`, `rm -rf*`, `Remove-Item*`, and `external_directory`.

**Assessment:** the read-only/planning boundary is enforced by configuration, not convention — a
genuinely good foundation for BFAOS autonomy.

## 2. Described agent roles (documentation, not executable)

| Registry | Roles | Count | Executable? | State |
|---|---|---|---|---|
| `.ai/agents/registry.yaml` | architecture, frontend, backend, documentation, release, testing, security, devops, research | 9 | No | Current: each role has `capabilities`, `loads`, `max_files` |
| `registry/agents.json` | Architecture, Backend, Devops, Documentation, Frontend, Release, Research, Security, Testing | 9 | No | **STALE** — `generated_at: 2026-09-17`, "GENERATED ONLY. NEVER EDIT MANUALLY" |
| `platform/agents/` | backend-engineer, chief-architect, design-system, devops-engineer, documentation, frontend-engineer, project-manager, qa-engineer | 8 | No (0 TS files) | Role briefs |
| `platform/ai-runtime/` | ai-product-manager, app-lifecycle, artifacts, backlog, business-intelligence, content-factory, continuous-improvement, executive-command, … | 171 files | No | Role/artefact definitions |
| `packages/mission-runtime` | `GatewayClient`, `RegistryReader`, `MemoryReader`, `AuthService`, event/log helpers | 12 consumers | **Yes (as library)** | INTEGRATED, UNTESTED |
| `packages/kernel` | 28 modules incl. orchestrator/permissions/replay | 11 consumers | **Yes (as library)** | INTEGRATED, not app-used |

**Conclusion (`VERIFIED`):** the repository describes agents four different ways; only `opencode.json`
binds a role to executable permissions. The blueprint's ten roles map onto these registries but should
not create a fifth description.

## 3. Blueprint role mapping

| Blueprint role | Existing home | Reuse decision | Missing contract elements |
|---|---|---|---|
| Chief Orchestrator | `packages/kernel` `EventDrivenOrchestrator` / `Coordinator` | adopt kernel | task intake, delegation policy, escalation |
| Architect | `.ai/agents/registry.yaml:architecture`; `platform/agents/chief-architect` | reuse role definition | output contract, evidence requirement |
| Engineering Agent | OpenCode `build` agent + `bhavya-*` skills | reuse | risk-class gating, checkpoint capture |
| QA Agent | `packages/kernel/src/testing`; `.ai` role `testing`; `platform/agents/qa-engineer` | reuse | independence rule (must not be the implementer) |
| Security Agent | `packages/security`; `.ai` role `security`; `bhavya-security` skill | reuse | independent-run mechanism, gate authority |
| Research Agent | `.ai` role `research`; `packages/knowledge-engine`, `search-engine` | reuse | citation requirement, source freshness |
| Knowledge Agent | `packages/knowledge-engine`, `content-engine`, `memory-engine`; `docs/` | reuse | single retrieval entry point, conflict policy |
| Education Agent | content under `content/`, curriculum data, `bhavya-content-truth` skill | reuse | **subject-matter review gate** (already mandatory on PR #62) |
| Operations Agent | `packages/kernel` `monitoring`, `observability`, `health`; `packages/runtime` `serve/validate` | reuse | quota monitoring, checkpoint watchdog |
| Auditor Agent | `mc_decisions`; `packages/kernel` `replay`; `bhavya-production-verification` skill | reuse | separation of duties from implementer |

**Decision:** no new agent processes. Ten logical responsibilities map onto one runtime (OpenCode),
one kernel, and one registry.

## 4. Required contract elements (not yet present anywhere)

| Element | Present today | Needed for |
|---|---|---|
| Purpose / objective | role briefs have `capabilities` | every role |
| Input contract | **absent** | task intake |
| Output contract | **absent** | independent review |
| Allowed tools | `plan` only (deny-list style) | least privilege per role |
| Permission scope | one global deny-list | per-role scoping |
| Budget / quota | **absent** | zero-budget discipline |
| Time limit | `steps: 150` on `bhavya` only | runaway prevention |
| Escalation rule | **absent** | approval gates |
| Evidence requirement | ad-hoc in reports | auditability |
| Self-granted permissions | explicitly forbidden by policy; kernel `Permissions` exists | enforcement |

## 5. Tool and integration surface available to agents today

| Surface | Declared | Authenticated | Operational | Notes |
|---|---|---|---|---|
| GitHub MCP | yes | yes (`thebhavyafoundation`) | yes | read + PR/issue write used in this phase |
| Cloudflare MCP (5 servers) | yes | yes | yes | read-only use verified; write not exercised |
| Playwright MCP | yes | n/a (local) | yes | drives the live site |
| Context7 MCP | yes | n/a | yes | documentation lookup |
| grep.app MCP | yes | n/a | yes | public code search |
| Supabase MCP | yes | yes | yes | **both projects INACTIVE** |
| Vercel MCP | yes | yes (personal) | partial | **team scope missing (403)**; CLI holds scope |
| Ruflo MCP | user-scoped | bearer | **no** | endpoint HTTP 410 |
| Vercel CLI | installed 65.14.0 | yes (`bhavya-foundation` team) | yes | read-only inspection used |
| Cloudflare CLI (`wrangler`) | via npx | yes | yes | deploy used by CI |

## 6. Model routing posture

- The session runs on a **free-tier model**; the machine contract forbids paid models.
- **No local auth store exists** (`~/.config/opencode/auth.json` absent), so provider credentials are
  supplied by the harness/session rather than persisted on disk — which is the correct posture for a
  zero-budget, cloud-independent agent.
- **No local model runtime is installed** (no Ollama binary). The Ruflo experiment's
  `qwen2.5:0.5b-instruct` lived only inside a remote sandbox and is **not** available locally.
- Consequence for V2: a GitHub-Actions agent runner has **no guaranteed model provider**. Proving
  headless OpenCode in CI is therefore a *provider-access* question, not only a tooling question —
  and is the single largest automation blocker.

## 7. Capability gaps, ranked

| Gap | Impact | Dependency |
|---|---|---|
| No demonstrated headless OpenCode execution in GitHub Actions | blocks the entire autonomous-execution capability | provider access in CI (free tier, no card) |
| No per-role tool/permission scoping (only one global deny-list) | least privilege is coarse | OpenCode config capability |
| No task input/output contracts | agents cannot be reviewed independently | contract schema in `mc_*` |
| No agent activity recording | Mission Control cannot show agent activity | `mc_sessions.producer` already exists — needs wiring |
| Four competing agent registries | drift, and a stale generated file | one canonical registry |
| No budget/quota or time limits per role | runaway risk | task contract fields |
| No escalation path for blocked approvals | agents may stall silently | approval routing |
