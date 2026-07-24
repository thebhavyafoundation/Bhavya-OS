# BHAVYA OS — TOOL REGISTRY SPECIFICATION

All capabilities exposed to autonomous agents are cataloged in this registry.

## Registered Tools

| Tool ID | Category | Description | Approved Agents |
| --- | --- | --- | --- |
| `tool.fs.read` | Filesystem | Read file contents & list directories | All Agents |
| `tool.fs.write` | Filesystem | Create/edit workspace files | `agent.engineering`, `agent.documentation`, `agent.release` |
| `tool.git.commit` | Version Control | Commit & tag releases | `agent.release`, `agent.engineering` |
| `tool.gateway.invoke` | AI | Route inference requests via AI Gateway | `agent.engineering`, `agent.release` |
| `tool.ci.run_gates` | Quality | Run build, typecheck, lint, and test suites | `agent.release` |
| `tool.registry.generate` | Platform | Regenerate `registry/*.json` manifests | `agent.engineering`, `agent.release` |
