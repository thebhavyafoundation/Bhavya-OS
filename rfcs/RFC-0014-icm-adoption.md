---
type: rfc
status: draft
owner: Bhavya Architecture
date: 2026-10-07
---

# RFC-0014: Adopt Interpretable Context Methodology (ICM) for Agent Workflows

## Summary

This RFC proposes adopting the Interpretable Context Methodology (ICM) as the canonical agent workflow architecture for Bhavya OS. ICM replaces framework-level orchestration with filesystem structure: numbered stage folders carry sequencing, hierarchy carries context scoping, and plain markdown files carry state. One agent, reading the right files at the right moment, does the work of a multi-agent framework — and a human can open any folder and see exactly what state the system is in.

## Motivation

The current Bhavya OS agent architecture uses a hub-based navigation system (AGENTS.md → CONTEXT.md → domain hubs → skills). While this works for opencode, it has fundamental limitations:

1. **Context explosion**: Agents load entire hub contexts rather than task-scoped slices, leading to 30K-50K token contexts where models lose track
2. **No structured handoffs**: No standardized mechanism for passing artifacts between workflow stages (RFC → Spec → Implement → Verify → Deploy)
3. **Implicit workflows**: Development workflows exist but aren't encoded as reusable, reviewable stages with explicit contracts
4. **Machine/agent coupling**: The structure is tied to opencode conventions; other agents/LLMs can't easily adopt it
5. **No human gates**: Creative decisions lack explicit checkpoints for human steering
6. **Observability gap**: Pipeline state lives in chat threads or agent memory, not inspectable files

ICM solves these by making the filesystem the orchestration layer. The five-layer architecture (CLAUDE.md → CONTEXT.md → Stage CONTEXT.md → References → Output) delivers 2K-8K tokens per stage — well within optimal model performance range.

## Proposal

### 1. Add ICM Workspace Structure at Repository Root

```
D:\Bhavya OS\
├── CLAUDE.md                    # L0: Workspace identity (coexists with AGENTS.md)
├── CONTEXT.md                   # L1: Task routing → stages (updated)
├── setup/
│   └── questionnaire.md         # L3: Onboarding (configures factory)
├── _config/                     # L3: Brand, design system, conventions
│   ├── brand-rules.md
│   ├── design-tokens.md
│   └── build-conventions.md
├── shared/                      # L3: Cross-stage resources
│   ├── constants/
│   └── schemas/
├── skills/                      # L3: Bundled skills (symlink to .opencode/skills/)
├── stages/                      # L2: Numbered stage folders
│   ├── 01-discovery/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   └── output/
│   ├── 02-specification/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   └── output/
│   ├── 03-implementation/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   └── output/
│   ├── 04-verification/
│   │   ├── CONTEXT.md
│   │   ├── references/
│   │   └── output/
│   └── 05-deployment/
│       ├── CONTEXT.md
│       ├── references/
│       └── output/
```

### 2. Core Development Workflow as ICM Pipeline

Encode the existing Bhavya development workflow as five ICM stages:

| Stage             | Purpose                            | Input                      | Output              |
| ----------------- | ---------------------------------- | -------------------------- | ------------------- |
| 01-discovery      | Understand problem, gather context | Issue/RFC, codebase        | Discovery report    |
| 02-specification  | Write REASONS Canvas / spec        | Discovery report           | Spec document       |
| 03-implementation | Implement per spec                 | Spec, contracts, standards | Code changes        |
| 04-verification   | Run gates, verify quality          | Implementation, gates      | Verification report |
| 05-deployment     | Deploy, monitor                    | Verified build             | Deployment record   |

Each stage has a `CONTEXT.md` contract with Inputs/Process/Outputs tables per ICM Pattern 1.

### 3. ICM Conventions Adoption

Adopt all 15 patterns from `_core/CONVENTIONS.md`:

- Stage contracts (Pattern 1)
- Stage handoffs via output/ folders (Pattern 2)
- One-way cross-references (Pattern 3)
- Selective section routing (Pattern 4)
- Canonical sources (Pattern 5)
- CONTEXT.md = routing, not content (Pattern 6)
- Tool prerequisites in references/ (Pattern 7)
- Questionnaire design (Pattern 8)
- Bundled skills (Pattern 9)
- Specs as contracts (Pattern 10)
- Checkpoints (Pattern 11)
- Stage audits (Pattern 12)
- Value validation (Pattern 13)
- Docs over outputs (Pattern 14)
- Shared constants (Pattern 15)

### 4. Coexistence with Existing Hub Navigation

- `AGENTS.md` remains for opencode-specific routing (L0 for opencode)
- `CLAUDE.md` added for ICM/agent-agnostic routing (L0 for all agents)
- `CONTEXT.md` updated to route tasks to ICM stages
- Existing `.ai/`, `docs/`, `packages/` hubs become Layer 3 reference collections
- Skills symlinked from `.opencode/skills/` to `skills/`

## Alternatives Considered

| Alternative                           | Rejected Because                                          |
| ------------------------------------- | --------------------------------------------------------- |
| Keep hub-based navigation             | Doesn't solve context explosion, portability, or handoffs |
| Build custom opencode workflow engine | Reinvents ICM; higher maintenance; not portable           |
| Use LangGraph/CrewAI/AutoGen          | Framework lock-in; not filesystem-native; opaque state    |
| Add checkpoints to AGENTS.md          | Doesn't provide structured handoffs or layered loading    |

## Migration / Rollout

### Phase 1: Foundation (This RFC)

- [ ] Create ICM workspace structure at repo root
- [ ] Add `CLAUDE.md` (L0) and update `CONTEXT.md` (L1)
- [ ] Create `_config/`, `shared/`, `setup/` with initial content
- [ ] Symlink `.opencode/skills/` → `skills/`
- [ ] Create 5 core development workflow stages with contracts

### Phase 2: Core Workflow Migration

- [ ] Migrate RFC → Spec → Implement → Verify → Deploy to ICM stages
- [ ] Add checkpoints and audits to creative stages (02, 03, 04)
- [ ] Create onboarding questionnaire in `setup/questionnaire.md`
- [ ] Test end-to-end with a real feature

### Phase 3: Additional Workflows

- [ ] Content production pipeline (research → script → spec → render)
- [ ] Audit workflow (scope → evidence → findings → report)
- [ ] Release workflow (changelog → version → deploy → verify)

### Phase 4: Deprecation

- [ ] Update AGENTS.md to point to ICM stages as primary routing
- [ ] Deprecate hub-based task routing in favor of ICM task routing
- [ ] Document migration for team

## Open Questions

1. **CLAUDE.md vs AGENTS.md**: Should CLAUDE.md replace AGENTS.md at root, or coexist? (Proposal: coexist — AGENTS.md for opencode config, CLAUDE.md for agent-agnostic workspace identity)
2. **opencode config**: Where does `.opencode/` live in ICM? (Proposal: stays at root; not part of ICM workspace)
3. **Existing hubs**: Should `.ai/`, `docs/` become Layer 3 reference collections? (Proposal: yes, with CONTEXT.md routing files)
4. **bar/ registry**: How does ICM interact with `bar/` architecture registry? (Proposal: bar/ becomes a Layer 3 reference in relevant stages)

## References

- ICM Paper: arXiv:2603.16021 (Van Clief & McDermott, 2026)
- ICM Repo: https://github.com/RinDig/Interpretable-Context-Methodology
- ICM Conventions: `_core/CONVENTIONS.md` (15 patterns)
- ADR-014: ICM Adoption (this RFC's architectural decision record)
- Bhavya AGENTS.md: Current agent routing document
