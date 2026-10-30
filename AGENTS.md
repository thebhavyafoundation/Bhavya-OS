# Bhavya OS — L0 Router (ICM-Aligned)

**Single entry point for all agents.** Embodies ICM five-layer architecture.
Next hop: `CONTEXT.md` (L1) → ICM stages (L2) → Layer 3 refs → Layer 4 artifacts.

## Layer Architecture

| Layer | File                  | Question                |
| ----- | --------------------- | ----------------------- |
| L0    | `AGENTS.md`           | Where am I?             |
| L1    | `CONTEXT.md`          | Where do I go?          |
| L2    | `stages/01-05/`       | What do I do?           |
| L3    | `_config/`, `shared/` | What rules apply?       |
| L4    | `stages/*/output/`    | What am I working with? |

## Task Routing

| Trigger     | Stage             | Entry Point                           |
| ----------- | ----------------- | ------------------------------------- |
| `discovery` | 01-discovery      | `stages/01-discovery/CONTEXT.md`      |
| `spec`      | 02-specification  | `stages/02-specification/CONTEXT.md`  |
| `implement` | 03-implementation | `stages/03-implementation/CONTEXT.md` |
| `verify`    | 04-verification   | `stages/04-verification/CONTEXT.md`   |
| `deploy`    | 05-deployment     | `stages/05-deployment/CONTEXT.md`     |
| `setup`     | onboarding        | `setup/questionnaire.md`              |
| `status`    | pipeline status   | scan `stages/*/output/`               |

Hubs: `apps/ai-institute/CONTEXT.md` · `packages/CONTEXT.md` · `docs/CONTEXT.md` · `.ai/CONTEXT.md` · `rfcs/CONTEXT.md`
Layer 3 refs: `_config/` · `shared/` · `skills/` → `.opencode/skills/`

## Walk Test

1. Read `AGENTS.md` → identity, ICM layers, routing
2. Read `CONTEXT.md` → stage/hub for current task
3. Read stage `CONTEXT.md` → Inputs, Process, Outputs
4. Load referenced Layer 3/4 files only (selective section routing)
5. Execute process, write to `output/`
6. Report status by scanning `stages/*/output/`

## Details (Layer 3 — `_config/`)

- Precedence & human gates → `_config/project-governance.md`
- ICM 15 conventions → `_config/icm-conventions.md`
- Design gate → `_config/design-gate.md`
- Skills (canonical list) → `skills-lock.json`
- Verification order & commands → `_config/verification-order.md`
- Non-goals → `_config/non-goals.md`
- Architecture-change trigger → `_config/architecture-trigger.md`
- Machine resource contract → `_config/machine-contract.md`

## ICM Alignment Notes

Known gaps vs ICM invariants, documented per ICM guardrail ("break one on purpose and write why"):

| ICM Invariant                       | Status     | Reason                                                                                                                |
| ----------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------- |
| L0 entry file ~60 lines             | ✅ fixed   | Slimmed to ~70 lines; details moved to `_config/`                                                                     |
| Skills in one canonical source      | ✅ fixed   | Canonical list is `skills-lock.json`; AGENTS.md points there                                                          |
| `check.md` beside outputs           | ✅ fixed   | One per stage in `stages/*/output/check.md`                                                                           |
| `_tools/links.py` in workspace root | ✅ fixed   | Copied from vendored `icm-architect` skill                                                                            |
| `CONTEXT.md` = routing only         | ⚠️ partial | Hub `CONTEXT.md` files are routing tables; stage `CONTEXT.md` files include `## Process` content (accepted deviation) |
| Total context per stage < 8K tokens | ⚠️ partial | AGENTS.md is slim; stage `CONTEXT.md` files may exceed 8K — selective section routing mitigates                       |

## References

- ICM Paper: arXiv:2603.16021 (Van Clief & McDermott, 2026)
- ICM Repo: https://github.com/RinDig/Interpretable-Context-Methodology
- RFC-0014: ICM Adoption for Bhavya OS
- Canvas: `specs/icm-workspace-implementation-reasons-canvas.md`
