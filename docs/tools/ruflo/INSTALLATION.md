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
