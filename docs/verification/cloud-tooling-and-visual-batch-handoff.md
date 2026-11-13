# Handoff — Cloud tooling install and visual-learning batch

**Date:** 2026-11-12
**Branch:** `feat/visual-learning-batch`
**Task:** cloud tooling installation + first visual-learning batch
**Status:** tooling ready and remotely verified; batch implemented on the branch; awaiting push/PR approval

---

## Execution-location record

| Concern                              | Where it runs                                                                                         |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| OpenCode (orchestration)             | Control centre — orchestration only                                                                   |
| Ruflo MCP server + runtime + workers | **Remote** — Vercel Sandbox (`bhavya-ruflo`, team `bhavya-foundation`)                                |
| LLM inference for Ruflo              | **Remote** — Ollama (`qwen2.5:0.5b-instruct`) inside the sandbox                                      |
| Build/test runner                    | GitHub Actions `ubuntu-latest`                                                                        |
| Browser                              | GitHub Actions Playwright job                                                                         |
| Application                          | Cloudflare Workers (production `bhavya-foundation`, preview `bhavya-foundation-preview`)              |
| Durable state                        | GitHub (canonical) · Vercel Sandbox snapshot (reconstructible) · Ollama model store (reconstructible) |

Nothing heavy runs on the laptop. The laptop is a control centre, not a dependency.

## Vercel setup (playbook: vercel.com/get-started.md)

| Item       | State                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CLI        | 65.14.0 (updated from 58.9.0), authenticated as `thebhavyafoundation` via device flow                                                                                                                                                                                                                                                                                                    |
| Team scope | `bhavya-foundation` — CLI holds it; the **MCP** OAuth grant returns an empty `list_teams` (documented gap)                                                                                                                                                                                                                                                                               |
| Guidance   | Plugin route **unsupported** (upstream is `private: true` and exposes `exports["."]`; OpenCode 1.18.33 requires `exports["./server"]`). Fallback per playbook: standalone skills installed globally to `~/.agents/skills/` — `deploy-to-vercel`, `vercel-react-best-practices`, `vercel-composition-patterns`, `vercel-react-native-skills`, `vercel-react-view-transitions` (132 files) |
| MCP        | `https://mcp.vercel.com` added globally to `~/.config/opencode/opencode.jsonc`; `get_auth_user` and `search_vercel_documentation` verified working                                                                                                                                                                                                                                       |
| Projects   | `bhavya-os` → `https://bhavya-os-bhavya-foundation.vercel.app`                                                                                                                                                                                                                                                                                                                           |

## Ruflo — installed and verified remotely

| Item                | Value                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Upstream            | `ruvnet/ruflo` @ `dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1`, npm `ruflo@3.76.0`, MIT                             |
| Host                | Vercel Sandbox, 2 vCPU / 4096 MB, iad1, port 3000 published                                                      |
| Install path        | `/vercel/sandbox/ruflo` (remote only — never on the laptop)                                                      |
| Health              | `npx ruflo doctor` → 23 passed, 13 warnings, 0 failures                                                          |
| Discovery           | OpenCode registers the server natively: **394 tools** as `tools.ruflo.*`                                         |
| Auth                | Bearer token, auto-generated, mode 0600 in the sandbox; unauthenticated RPC → 401                                |
| Provider            | Free local model only (`OLLAMA_API_KEY=ollama` + `RUFLO_PROVIDER=ollama`); Anthropic/OpenRouter rejected as paid |
| Committed artefacts | `scripts/ruflo/bootstrap-remote.sh`, `scripts/ruflo/check-remote.sh`, `docs/tools/ruflo/*`                       |

### Acceptance gate — `scripts/ruflo/check-remote.sh` → **15 passed, 0 failed**

```
discovery           tools/list returns a tool surface        PASS  (397 tools)
dispatch            swarm_init (maxAgents=1)                 PASS
                    agent_spawn                              PASS
                    task_create                              PASS
                    task_assign                              PASS
execution           terminal_execute exit code               PASS
                    artifact written                         PASS
                    no tracked application file modified     PASS
llm path            agent_execute via local model            PASS  ("RUFLO_ACCEPTANCE_OK")
observability       task_status readable                     PASS
cancellation        task_cancel sets cancelled               PASS
                    agent_terminate                          PASS
permissions         unauthenticated RPC refused              PASS  (401)
                    wrong-token RPC refused                  PASS  (401)
                    health endpoint reachable                PASS  (200)
```

### Compatibility gate (9 points)

1. **OpenCode discovers the Ruflo MCP tools** — PASS. 394 tools registered; `agent_list` and `agent_health` called from this session and returned live remote state (2 workers, overall health 100, 0 errors).
2. **A real task is dispatched** — PASS. `task_create` + `task_assign` (task `task-1794494844774-jlhts2`).
3. **A real worker executes it remotely** — PASS. `terminal_execute` exit 0 in the sandbox; `agent_execute` returned model output.
4. **The task produces a verifiable file** — PASS. `ruflo-findings.md` (1223 bytes) and `ruflo-concept-visual-audit.md` (761 bytes), both real content.
5. **Execution status and errors are observable** — PASS. `task_status`, `agent_list`, `agent_health`, exit codes, stderr captured.
6. **Cancellation works** — PASS. `task_cancel` → `cancelled`; `agent_terminate` → `terminated: true`.
7. **Permissions constrain tools and filesystem** — PASS. 401 without a token, 401 with a wrong token; `HOME=/vercel`, working dir under `/vercel/sandbox`; 0 tracked application files modified.
8. **No production credentials unnecessarily exposed** — PASS. No Cloudflare/Supabase/Turso/B2 credential in the sandbox; no paid API key; the MCP token never enters the repository.
9. **State survives a remote restart** — PASS. Snapshot `snap_DbbogPcTMpn9M3NP0m5ytZVt7VkT` → new sandbox → install, artifact (1223 bytes), repo HEAD `a30614d` and **task history (`tasks=1 statuses=["cancelled"]`)** all recovered; `agent_execute` worked again post-restore (`RUFLO_RESTART_OK`).

### Known limitation (exact)

`agent_execute` refuses to run without a provider credential. Anthropic and OpenRouter are paid and prohibited by `PLATFORM-TRUTH.md`. The approved path is a **free local model in the remote sandbox** (`qwen2.5:0.5b-instruct`). The default Ruflo model label still reads `sonnet` in `agent_spawn` responses; `modelRoutedBy: explicit` and `modelId` show the model actually bound is `qwen2.5:0.5b-instruct`, and Ollama's own log confirms `POST /v1/chat/completions 200`.

## Baseline verified (production, 2026-11-12)

- `https://bhavya-foundation.thebhavyafoundation.workers.dev/` — HTTP 200, title `Bhavya Foundation — For People. For Nature. For Generations.`, h1 `Building for Generations.`
- **Console errors: 0**
- **B2 storage health-check requests: 0** (the freeze loop has not returned)
- All 8 homepage images decode, including the curriculum SVG at **960×540**; the 5 that initially reported `naturalWidth: 0` were `loading="lazy"` and decoded once the tab was focused and the page was scrolled.

## Concept-visual inventory (new)

`apps/ai-institute/src/data/curriculum/visual-inventory.ts` — extends the existing `DiagramSpec` schema; **does not** create a competing content registry. `lessonContent.visual` stays the single runtime source.

Fields per entry: id · purpose · existingVisual · missing · medium · mediumJustification · source · license · location · dimensions · altText · reviewStatus · loading · optional `spec`.

**Coverage (derived by the remote Ruflo worker from source, not asserted):**

| Metric                                   | Value                                 |
| ---------------------------------------- | ------------------------------------- |
| Curriculum lessons                       | 10                                    |
| Lessons rendering a runtime visual today | **1** (`defining-ai`)                 |
| Inventory entries                        | 12 (10 lessons + 2 homepage concepts) |
| Entries `published`                      | 2                                     |
| Entries `draft`                          | 10                                    |
| Lessons with no inventory entry          | **0**                                 |

The catalogue is **not** visually complete. Only `defining-ai` renders a concept visual; the other 9 lessons are inventoried with the medium chosen and justified, but the visual is still `draft`.

## Files changed on this branch (mine)

```
AGENTS.md                                                          (+2 routing lines)
.gitattributes                                                     (*.sh text eol=lf)
apps/ai-institute/src/data/curriculum/visual-inventory.ts          (new)
apps/ai-institute/src/data/curriculum/index.ts                     (export the inventory)
scripts/ruflo/bootstrap-remote.sh                                 (new)
scripts/ruflo/check-remote.sh                                     (new)
docs/tools/ruflo/UPSTREAM-PIN.md                                  (new)
docs/tools/ruflo/INSTALLATION.md                                  (new)
docs/tools/ruflo/SECURITY-REVIEW.md                               (new)
docs/tools/ruflo/UPDATE-PROCEDURE.md                              (new)
docs/tools/ruflo/UNINSTALL-PROCEDURE.md                           (new)
```

## Next permitted action

1. Push the branch and open/refresh the PR — **requires explicit approval** (AGENTS.md Human Gates; task §15).
2. Then: Phase D reference batch — implement the 9 `draft` inventory entries as runtime visuals, one bounded slice at a time, with a remote Playwright pass per slice.
3. Production promotion of PR #62 remains a separate, explicit approval.
