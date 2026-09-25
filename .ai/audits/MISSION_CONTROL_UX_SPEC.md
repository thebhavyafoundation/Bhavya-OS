# Mission Control — UX Spec (2026-09-18, design-before-build)

Bhavya-native visual language (forest/ivory/earth/gold, Playfair Display + Inter), platform-ui primitives only (Card/StatCard/DataTable/Badge/StatusBadge/Tabs/Toast/EmptyState/ErrorState/Skeleton), existing `/os` shell + OsSidebar. No new libraries until xyflow composition (approved for later).

## First slice: APPROVALS mode (`/os/mission/approvals`)

1. Queue (DataTable): artifact title, kind, version, producer, risk, waiting-since, status badge. EmptyState when clear ("No pending approvals" — never fake rows).
2. Review view: artifact render + version dropdown (lineage incl. human-uploaded replacements flagged) + WHY/EVIDENCE panel (source, license, findings, decision history) + diff-vs-previous where applicable.
3. Decision bar: Approve / Reject / Request revision / Regenerate / Upload replacement — each requires reason for reject/revise (recorded to decision log). Toast confirms; errors use ErrorState.
4. Timeline mode reuses the same event stream (filterable by job/agent/artifact/human).

## Later modes (specified, not built)

MISSION overview (department status cards from job labels + counts); AGENT (session inspector: tool executions from events, no secret values); REPOSITORY (local git panel ✅ + github-os data); PRODUCTION (PR/CI/integration records, real states only); CAPABILITY (radar + dispositions ADOPT..REJECT); TIMELINE (event stream).

## Anti-patterns enforced

No simulated agent thinking, no fake activity rows, no inference-rendered-as-fact, no giant single screen, no decorative motion (motion only for state transitions/feedback), responsive + keyboard-operable approval actions (J/K/A/R pattern DISTILLED from Permit.io research), mobile-readable queue.
