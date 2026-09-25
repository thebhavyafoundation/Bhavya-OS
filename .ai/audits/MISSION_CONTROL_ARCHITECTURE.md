# Mission Control — Architecture (2026-09-18)

## Placement

Mission Control is INTERNAL, served from the canonical app under `/os/mission/*` (extends existing `/os` shell, RBAC, nav registry — no new app, per bhavya-architecture). Public products consume only approved outputs via existing public routes. Hard boundary: no agent state/research/credentials/decisions on public routes (middleware + route-policy already enforce; mission routes inherit `OS_TOOL_ROLES`+admin gating).

## Layers (all reuse-first)

```
OpenCode events (session/tool/permission/todo/git — real, via existing integration surfaces)
  → Bhavya event envelope (EXTEND namespace; daemon JSONL + IOC table sinks)
  → Job/Session/Artifact/Approval stores (SQLite via @bhavya/database; persist-only-what-humans-audit)
  → /os/mission/* workspace (platform-ui primitives; modes below)
  → Human decisions → audit log → verification → integration records
  → GitHub OS capability loop for external needs (ADOPT..REJECT per research doc)
```

## Modes (composable workspace, build incrementally)

MISSION (overview) · APPROVALS (queue + review + lineage) · AGENT (sessions + tool executions) · REPOSITORY (local git state ✅ implemented + github-os data) · PRODUCTION (PR/CI/integration records) · CAPABILITY (radar + research + dispositions) · TIMELINE (event stream). First slice: APPROVALS (queue + artifact review + decision record) — the control plane's reason to exist.

## Graph system

COMPOSE xyflow later for repository/architecture/route/evidence graphs over EXISTING graph derivations (knowledge-graph-builder, intelligence-graph, file-map generator). Graph edges typed FACT/OBSERVATION/INFERENCE/RECOMMENDATION; inference never rendered as fact. No new graph store.

## departments

Labels on jobs/agents/routes per §4 list (intelligence/research/knowledge/content/design/engineering/distribution/governance). No department runtime, no agent sprawl.

## Resource strategy (i5/8GB/Windows)

Deterministic Node/SQLite processing; heavy work to GitHub Actions; public delivery via existing Vercel/Cloudflare; no Docker/K8s/Kafka/Grafana/new DB/new workflow engine/new vector infra. Useful with paid APIs disabled; no commercial API as hard dependency. Optional local models only.

## What is NOT built

Second knowledge graph, workflow engine, database, auth, observability stack, offline app, OpenSkool, social platform, full dashboard — all DEFERRED or REJECTED per drift rules. Interesting-but-out-of-scope findings go to gap analysis, then work resumes.
