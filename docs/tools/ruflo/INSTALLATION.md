# Ruflo — Installation Record

**Stage:** tooling install
**Status:** COMPLETE — remote environment, real execution verified
**Constraint:** Ruflo's runtime never runs on the control-centre laptop.

---

## 1. What was installed

| Item                | Value                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------- |
| Upstream            | `https://github.com/ruvnet/ruflo` @ `dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1`               |
| npm package         | `ruflo@3.76.0` (installed in the remote sandbox only)                                        |
| Remote host         | Vercel Sandbox `bhavya-ruflo` — team `bhavya-foundation`, project `bhavya-os`, region `iad1` |
| Sandbox size        | 2 vCPU / 4096 MB                                                                             |
| Published port      | 3000 → `https://<sandbox>.vercel.run` (URL is per-sandbox and ephemeral)                     |
| Install path        | `/vercel/sandbox/ruflo`                                                                      |
| MCP token           | `/vercel/.claude-flow/mcp-http-token` (auto-generated, mode 0600, never in Git)              |
| Local model         | `qwen2.5:0.5b-instruct` (Ollama, free, no payment method)                                    |
| Laptop installation | **None** — deliberately                                                                      |

## 2. Method (remote)

1. Created the sandbox with the Vercel CLI (team scope; the MCP's own OAuth
   grant did not carry team scope, so the CLI is the working path):
   ```bash
   sandbox create --scope bhavya-foundation --project bhavya-os \
     --name bhavya-ruflo --timeout 45m --vcpus 2 --publish-port 3000 \
     --network-policy allow-all --region iad1
   ```
2. Installed the pinned package inside the sandbox:
   `npm install ruflo@3.76.0 --no-audit --no-fund` (617 packages).
3. Ran `npx ruflo doctor` → 23 passed, 13 warnings, 0 failures.
4. Installed `zstd` (required by the Ollama installer) and then Ollama; pulled
   the pinned free model.
5. Started the MCP server over HTTP with bearer authentication:
   ```bash
   npx ruflo mcp start -t http -p 3000 --host 0.0.0.0
   ```
6. Cloned the repository into the sandbox at
   `/vercel/sandbox/Bhavya-OS` (branch `feat/visual-learning-batch`) so workers
   have real source to inspect.
7. Ran the acceptance gate (`scripts/ruflo/check-remote.sh`) — all checks pass.

The whole sequence is reproducible with `scripts/ruflo/bootstrap-remote.sh`,
which is idempotent and safe to re-run.

## 3. Execution-location record

| Concern                 | Where it runs                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| OpenCode (agent)        | Control centre (orchestration only)                                                                   |
| Ruflo MCP server        | **Remote** — Vercel Sandbox                                                                           |
| Ruflo runtime / workers | **Remote** — Vercel Sandbox                                                                           |
| LLM inference           | **Remote** — Ollama inside the sandbox                                                                |
| MCP subprocess          | Remote (the sandbox's own `npx ruflo mcp start`)                                                      |
| Build/test runner       | GitHub Actions `ubuntu-latest` (separate path)                                                        |
| Browser                 | GitHub Actions Playwright job (separate path)                                                         |
| Application             | Cloudflare Workers (production + preview workers)                                                     |
| Persistent state        | GitHub (canonical) · Vercel Sandbox snapshot (reconstructible) · Ollama model store (reconstructible) |

## 4. What was NOT done

- No Ruflo runtime, daemon, swarm or MCP subprocess on the laptop.
- No Ruflo code in the public application bundle.
- No paid API key (Anthropic / OpenRouter were rejected on principle).
- No unauthenticated MCP endpoint — the server refuses unauthenticated RPC.
- No Claude Code hooks/mods installed on the assumption that they work in OpenCode.
- No unbounded swarm — `maxAgents: 1` throughout, one task at a time.
- No production credential placed in the sandbox.
- No external data access and no deployment from the sandbox.

## 5. Re-verification commands

```bash
# list the sandbox
sandbox ls --scope bhavya-foundation --project bhavya-os

# inside the sandbox
sh scripts/ruflo/check-remote.sh /vercel/sandbox/Bhavya-OS

# from the agent, with the token supplied out of band
curl -s https://<sandbox>.vercel.run/health
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://<sandbox>.vercel.run/rpc \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $RUFLO_MCP_TOKEN" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"agent","version":"1.0"}}}'
```

## 8. Endpoint lifetime, expiry and refresh

The endpoint is a Vercel Sandbox published port. Its lifetime is **not** the
lifetime of the sandbox: it is the lifetime of the **sandbox session**.

Three facts were established by measurement on 2026-11-12:

1. **A server left running does not survive the command that started it.**
   The sandbox tears down the processes of a session when that session's
   command returns. A server started with `nohup ... &` from a script that
   then exits is gone by the next command, and the local health endpoint
   answers `000` while the published URL answers `502`.
   The bootstrap therefore holds the session open for as long as the
   endpoint is meant to serve (`HOLD_SECONDS`, default 3600).

2. **The published URL changes when the port is re-published.** Re-publishing
   port 3000 with
   `vercel sandbox config ports bhavya-ruflo --publish-port 3000` issued a
   new hostname (`sb-9y7o6ugluzbl.vercel.run`) in place of the previous one
   (`sb-64yygph2bz9q.vercel.run`). Any client configuration that names the
   endpoint has to be updated at the same time.

3. **An expired endpoint answers 410, not 404.** A 410 from the published URL
   means the session behind it has ended. It is not an authentication
   failure and not an application fault.

### Refresh procedure

```bash
# 1. Re-publish the port. Note the URL it prints; it may differ from the
#    previous one.
vercel sandbox config ports bhavya-ruflo --publish-port 3000 \
  --scope bhavya-foundation --project bhavya-os

# 2. Start the server inside a session that stays alive, and hold it.
vercel sandbox exec bhavya-ruflo --scope bhavya-foundation --project bhavya-os \
  --timeout 3600s -- sh /tmp/hold-ruflo.sh

# 3. Point the client at the new URL and keep the token where it is.
#    The token never leaves the approved store:
#    ~/.config/opencode/ruflo-mcp-token on the operator machine.

# 4. Verify from the operator machine.
curl -s -o /dev/null -w '%{http_code}\n' https://<new-url>/health
```

### What was found and corrected on 2026-11-12

- The bootstrap did not set `OLLAMA_DEFAULT_MODEL`. The execution path
  reported *"No Ollama model configured for this self-hosted/local endpoint —
  refusing to fall back to a cloud-suffixed default"*, which is the correct
  refusal but left the model-backed path unusable. The bootstrap now sets it
  and refuses to continue if the model is not installed.
- The bootstrap killed the server with `pkill -f 'ruflo mcp start'`. That
  pattern also matches the shell running the bootstrap, so the script killed
  itself and the endpoint never came back. The pattern now uses a character
  class, `pkill -f '[r]uflo mcp start'`, which cannot match its own command
  line.
- A stale single-instance lock left by a previous session stopped the new
  server from binding. The bootstrap now clears it.
