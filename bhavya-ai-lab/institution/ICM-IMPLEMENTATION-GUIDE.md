# ICM Implementation Guide

## Original ICM (Interpretable Context Methodology)

**Authors:** Van Clief & McDermott

### Core Insight

"The folder structure is a context router, not a storage hierarchy."

### Five-Layer Context Hierarchy

| Layer | What | Size |
|-------|------|------|
| 0 | CLAUDE.md (bootloader) | ~800 tokens |
| 1 | CONTEXT.md (workspace) | ~300 tokens |
| 2 | Stage CONTEXT.md (step) | 200-500 tokens |
| 3 | Reference Material | 500-2k tokens |
| 4 | Working Artifacts | Varies |

**Total per stage:** 2,000-8,000 tokens.

### How Folders Route Context

```
CLAUDE.md
  ↓
Workspace/CONTEXT.md
  ↓
Step/CONTEXT.md
  ↓
Load Reference Material
  ↓
Work on Artifacts
```

### Three-Step Process

**Step 1: Context Selection**
- AI reads CLAUDE.md
- Routes to correct workspace
- Loads workspace CONTEXT.md

**Step 2: Prompt Minimization**
- Only load what's needed
- 2,000-8,000 tokens per stage
- No unnecessary context

**Step 3: Step Isolation**
- Each step has own CONTEXT.md
- Steps don't leak context
- Clean boundaries

### Result

- Smaller prompts → faster reasoning
- Lower cost per interaction
- Better accuracy
- Clean mental model

---

## BICM (Bhavya Institutional Context Methodology)

**Adapted from:** ICM by Van Clief & McDermott
**Author:** Bhavya AI Lab
**Version:** 3.0.0

### What BICM Added

1. **Knowledge at Center** — Not AI, not tools
2. **Platform as Closed Loop** — Institutional cycle
3. **Business Language** — institution/, not layer-7-memory/
4. **Workspace Isolation** — Each workspace knows only its domain
5. **Model Independence** — AI models are execution engines

### What BICM Preserved

1. **Five-Layer Context Hierarchy** — Same token budgets
2. **Folder-as-Context-Router** — Same routing pattern
3. **Step Isolation** — Each step clean boundaries
4. **Prompt Minimization** — Only load what's needed

### Key Differences from ICM

| Aspect | ICM | BICM |
|--------|-----|------|
| Center | AI | Knowledge |
| Context Owner | AI Agent | Workspace |
| Focus | Prompt Engineering | Institutional Memory |
| Memory | Implicit | Explicit (institution/) |
| Skills | Ad-hoc | First-class (skill.json) |
| Build System | None | Compiler pipeline |

---

## OpenCode Adaptation

### Model Independence

The OS belongs to the workspace, not to any model. Claude, GPT-5, Gemini, Qwen, Codex, or any future model are execution engines.

### Skill Packages

Skills are portable packages with skill.json manifests. Any coding agent can consume them.

### Runtime Flow

```
User Request → Routing → Workspace → Skills → Registry → Generate → Validate
```

No model is mentioned in the flow.
