# Skill: bhavya-capability-research

# Bhavya Capability Research Skill

## Purpose

Research open-source capabilities and decide how Bhavya acquires them —
without blindly installing anything. Doctrine: Bhavya should not build
every capability from scratch; the ecosystem is its capability marketplace.

## Pipeline (follow in order)

1. **NEED** — state the Bhavya requirement in one sentence.
2. **EXISTING FIRST** — search `packages/`, `packages/shared/src/`, `.ai/audits/MISSION_CONTROL_EXISTING_CAPABILITY_MAP.md`. If it exists, EXTEND. Stop here if reuse suffices.
3. **DISCOVER** — find 2–5 ecosystem candidates (repo, URL).
4. **INSPECT** — for each serious candidate record: license, maturity/maintenance, architecture, dependencies, resource cost (i5/8GB/Windows/offline?), paid-API needs, security notes, overlap with Bhavya, constitutional fit.
5. **DISPOSE** — exactly one per candidate: ADOPT / ADAPT / COMPOSE / WRAP / FORK / DISTILL / WATCH / REJECT. Never rank for ranking's sake; never call anything "best" — state what it provides and in what manner Bhavya should use it.
6. **RECORD** — finding → evidence → disposition, with WHAT/WHY/SOURCE/LICENSE/PROVENANCE/DECISION.

## Rules

- No installs during research. Concepts and evidence only.
- MIT/Apache-2.0 preferred; copyleft (AGPL) and paid/cloud dependencies are REJECT-by-default — record the reason.
- Never present inference as fact; label FACT / OBSERVATION / INFERENCE / RECOMMENDATION.
- Forensics checklist (folded in, no separate skill): architecture, deps, license, security, maintenance, resource needs, integration points.
- Prefer DISTILL (extract methodology into Bhavya-native form) over importing code.
- i5/8GB/Windows/offline-first and zero-paid-API are hard constraints; violations need explicit human authorization.
