# ADR-014: Adopt Interpretable Context Methodology (ICM) for Agent Workflows

## Status

**Draft** — 2026-10-07

## Context

Bhavya OS currently uses a hub-based architecture for agent navigation (AGENTS.md → CONTEXT.md → domain hubs → skills). While functional, this approach has limitations:

1. **Context explosion**: Agents load entire hub contexts (e.g., `.ai/`, `docs/`, `packages/`) rather than task-scoped slices
2. **No structured handoffs**: No standardized mechanism for passing artifacts between workflow stages
3. **Implicit workflows**: Development workflows (RFC → Spec → Implementation → Verify → Deploy) exist but aren't encoded as reusable, reviewable stages
4. **Machine/agent coupling**: The current structure is tied to opencode's specific conventions; other agents/LLMs can't easily adopt it
5. **No human gates**: Creative decisions lack explicit checkpoints for human steering

## Decision

Adopt **Interpretable Context Methodology (ICM)** as the canonical agent workflow architecture for Bhavya OS.

ICM replaces framework-level orchestration with filesystem structure:

- **Layer 0** (`CLAUDE.md`): Workspace identity and routing (replaces AGENTS.md for agent purposes)
- **Layer 1** (`CONTEXT.md`): Task-to-stage routing
- **Layer 2** (`stages/NN-name/CONTEXT.md`): Stage contracts with Inputs/Process/Outputs tables
- **Layer 3** (`_config/`, `shared/`, `skills/`, `references/`): Stable reference material
- **Layer 4** (`output/` folders): Per-run working artifacts for stage handoffs

## Consequences

### Positive

- **Portability**: Workspace is a self-contained folder; works with any LLM/agent that reads markdown
- **Observability**: Every intermediate artifact is a plain file; human can inspect/edit between stages
- **Human-in-the-loop**: Checkpoints and audits built into stage contracts
- **Scalability**: Token-efficient layered loading (2K-8K vs 30K-50K tokens)
- **Version control**: All prompts, configs, and outputs are diffable/reversible
- **Multi-agent handoffs**: Stage outputs serve as explicit handoff points between agents

### Negative

- **Migration effort**: Significant restructuring of existing agent context files
- **Learning curve**: Team must learn ICM conventions (stage contracts, selective loading, etc.)
- **Tooling gap**: No native opencode ICM runtime; relies on agent discipline

## Migration Strategy

1. **Phase 1** (This RFC): Create ICM workspace structure alongside existing hub navigation
2. **Phase 2**: Migrate core development workflow (RFC → Spec → Implement → Verify → Deploy) to ICM stages
3. **Phase 3**: Migrate other repeatable workflows (content production, audit, release)
4. **Phase 4**: Deprecate hub-based agent navigation in favor of ICM task routing

## Alternatives Considered

| Alternative                           | Rejected Because                                       |
| ------------------------------------- | ------------------------------------------------------ |
| Keep hub-based navigation             | Doesn't solve context explosion or portability         |
| Build custom opencode plugin          | Reinvents ICM; higher maintenance burden               |
| Use LangGraph/CrewAI for workflows    | Framework lock-in; not filesystem-native               |
| Add checkpoints to existing AGENTS.md | Doesn't provide structured handoffs or layered loading |

## Open Questions

1. Should `CLAUDE.md` coexist with or replace `AGENTS.md` at repo root?
2. How to handle opencode-specific config (`.opencode/`) within ICM structure?
3. Should existing `.ai/` hub become a Layer 3 reference collection?

## References

- ICM Paper: arXiv:2603.16021 (Van Clief & McDermott, 2026)
- ICM Repo: https://github.com/RinDig/Interpretable-Context-Methodology
- ICM Conventions: `_core/CONVENTIONS.md` (15 patterns)
- Bhavya AGENTS.md: Current agent routing document
