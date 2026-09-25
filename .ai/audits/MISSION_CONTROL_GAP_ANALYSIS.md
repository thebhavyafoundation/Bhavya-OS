# Mission Control — Gap Analysis (2026-09-18)

## Proposed-skill verdicts (§11)

- **bhavya-capability-research — CREATE** (genuinely missing; no existing skill covers open-source discovery→disposition; core to the capability-acquisition doctrine).
- bhavya-open-source-forensics — REJECT as separate (folded into capability-research as its forensics checklist + existing bhavya-security).
- bhavya-capability-integration — REJECT as separate (ADOPT..REJECT protocol lives inside capability-research).
- bhavya-mission-control — REJECT (domain/architecture/UX docs suffice until implementation; revisit then).
- bhavya-human-control — REJECT as separate (approval doctrine lives in domain model + architecture).

## Capability dispositions (final framework)

- EXISTS→reuse: intelligence pipeline, runtime/daemon/events, /os shell+auth+nav, platform-ui, RBAC, audit repos, contracts, artifact/approval types.
- EXTEND: agent-engine (registry binding), approval engine (persist), job queue (persist+link), event envelope (MC namespace), evidence projections.
- BUILD NATIVE (staged): shared MC types (this phase) → persisted jobs/sessions/artifacts/decisions (next, with CI) → approvals UI slice → xyflow graphs.
- DISTILL later: xyflow COMPOSE, HITL inbox/audit, agent-obs envelopes, Kolibri packaging, pair-review UX.
- WATCH: H5P, intellectif/learning-kit, niche graph/observability repos.
- REJECT: second graphs/engines/DBs/auth, OTel/Grafana stacks, Docker/K8s, paid-API hard deps, AGPL (OpenObserve), Telegram/AutoGen approval surfaces, wholesale skill packs, full dashboard now.

## Open uncertainties

- H5P status unverified; agent-obs repo/license unverified (concepts only, no code taken).
- CI test failure cause unestablished (no log access; untouched by this phase).
- xyflow MIT license assumed from publication — re-verify LICENSE file before adding dependency.
- Whether `.ai/tasks` DAG should merge into persisted jobs or remain planner input (deferred to implementation).
