# Ruflo — Upstream Pin Record

**Role:** optional task dispatch, coordination and execution tracking.
**Authority:** `AGENTS.md` + `docs/architecture/PLATFORM-TRUTH.md`.
**Verification date:** 2026-11-12.
**Verified by:** direct upstream inspection (npm registry + GitHub API) and a real
remote execution gate — not inherited from a prior report.

---

## Pin

| Field                     | Value                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| Upstream repository       | `https://github.com/ruvnet/ruflo`                                                                      |
| Upstream commit           | `dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1` ("Make the skill work in any agent or harness", 2026-10-24) |
| npm package               | `ruflo@3.76.0` (thin wrapper; pulls `@claude-flow/cli@3.76.0`)                                         |
| npm `claude-flow` version | `3.76.0`                                                                                               |
| MCP server package        | `@claude-flow/mcp@3.1.7`                                                                               |
| Licence                   | MIT (`package.json` `license: MIT`; repo `LICENSE`)                                                    |
| Node requirement          | `>= 20` (verified running on Node v24.22.3)                                                            |
| Installation location     | **Remote only** — Vercel Sandbox (`bhavya-ruflo`), project `bhavya-os`, team `bhavya-foundation`       |
| Install path in sandbox   | `/vercel/sandbox/ruflo`                                                                                |
| Production dependency     | **No.** Authoring/coordination-time only. Never in the app bundle.                                     |
| Laptop installation       | **None.** The machine contract forbids the Ruflo runtime on the control centre.                        |

## Why the pin matters

`ruflo` ships as three npm packages (`ruflo` thin wrapper, `claude-flow`
umbrella, `@claude-flow/cli` implementation) and publishes `latest` on every
merge. `main` advances continuously; an unpinned install would silently change
what an agent is permitted to execute. Upgrades are a deliberate, reviewed action
via `UPDATE-PROCEDURE.md`.

## Execution model actually verified

Ruflo exposes **397 MCP tools**. Three execution paths exist for a spawned agent:

1. `agent_execute` — direct LLM call. Requires a provider credential.
2. Claude Code Task tool — spawns a real subagent.
3. `claude -p` — headless background instance.

Path 1 is the one this project uses, because it is the only one that can be
served over HTTP to a remote agent.

### Provider constraint (material)

`agent_execute` refuses to run without a provider and reports:

```
No LLM provider configured. Set ANTHROPIC_API_KEY or ANTHROPIC_AUTH_TOKEN
(Tier-3), OPENROUTER_API_KEY (#2042), or OLLAMA_API_KEY (Tier-2 — #1725).
```

`PLATFORM-TRUTH.md` prohibits paid APIs and payment-method-requiring services.
`ANTHROPIC_API_KEY` and `OPENROUTER_API_KEY` are therefore **not usable** here.
The approved path is `OLLAMA_API_KEY` with a **free local model running inside
the remote sandbox** — no payment method, no paid API, no laptop dependency.

Pinned model: `qwen2.5:0.5b-instruct` (397 MB, Ollama registry, permissive
licence — Ollama models are published under their own upstream licences).

Verified end to end:

```
agent_execute -> success: true, output: "RUFLO_OLLAMA_EXEC_OK",
                 usage: 88 input / 9 output tokens, durationMs 2350
ollama server log -> POST /v1/chat/completions 200 | 2.33s
```

## Independent verification performed

| Check                           | Method                                    | Result                                                       |
| ------------------------------- | ----------------------------------------- | ------------------------------------------------------------ |
| Upstream exists and is public   | GitHub API repo lookup                    | CONFIRMED                                                    |
| Pinned commit resolves          | GitHub API commit lookup                  | CONFIRMED                                                    |
| Licence                         | Read `package.json` + repo `LICENSE`      | CONFIRMED — MIT                                              |
| npm package pinned              | `npm view ruflo@3.76.0`                   | CONFIRMED                                                    |
| Installs and runs remotely      | `npx ruflo doctor` in Vercel Sandbox      | CONFIRMED — 23 passed, 13 warnings, 0 failures               |
| MCP server exposes tools        | `tools/list` over authenticated HTTP      | CONFIRMED — 397 tools                                        |
| Auth is enforced                | Unauthenticated and wrong-token RPC       | CONFIRMED — 401 both cases                                   |
| A remote worker really executes | `terminal_execute` + `agent_execute`      | CONFIRMED — exit 0, artifact written, LLM output returned    |
| Cancellation works              | `task_cancel`, `agent_terminate`          | CONFIRMED — `cancelled`, `terminated: true`                  |
| No application source modified  | `git status --porcelain` in sandbox clone | CONFIRMED — 0 tracked files modified                         |
| State survives a remote restart | Snapshot → restore → re-run               | CONFIRMED — task history, artifact and install all recovered |
| No paid credential used         | Environment inspection                    | CONFIRMED — only `OLLAMA_API_KEY=ollama` (local placeholder) |

## Re-verification

```bash
# inside the remote sandbox
sh scripts/ruflo/check-remote.sh /vercel/sandbox/Bhavya-OS
```

Expected: `RESULT: 13 passed, 0 failed`.
