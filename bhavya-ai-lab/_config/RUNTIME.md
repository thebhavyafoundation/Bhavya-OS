# OpenCode Runtime Flow

## How the OS Works

```
User Request
      ↓
CLAUDE.md (Routing)
      ↓
Workspace CONTEXT.md
      ↓
Load Registered Skills
      ↓
Load Component Registry
      ↓
Generate / Modify Code
      ↓
Validate Output
```

Notice: The model is not mentioned anywhere in the flow.

## Execution Engine

Any AI model can serve as the execution engine:

- Claude (Anthropic)
- GPT-5 (OpenAI)
- Gemini (Google)
- Qwen (Alibaba)
- Codex (OpenAI)
- Any future model

The OS provides context. The model provides reasoning. Neither depends on the other.

## Skill Loading

When a workspace is activated, OpenCode loads:

1. **Workspace CONTEXT.md** — What this workspace does
2. **Registered Skills** — From `_config/skills/registry.json`
3. **Component Registry** — From `_config/registries/`

Example: When the production workspace loads:

```json
{
  "remotion": {
    "path": "skills/remotion",
    "workspaces": ["production"]
  },
  "animation": {
    "path": "skills/animation",
    "workspaces": ["production"]
  }
}
```

## Context Assembly

The execution engine receives:

```
1. CLAUDE.md (800 tokens) — Routing table, folder map
2. Workspace CONTEXT.md (300 tokens) — Current context
3. Skill patterns (500-1000 tokens) — Loaded from registry
4. Component references (as needed) — From registries
```

Total context per task: 1,600-2,100 tokens.

## Model Independence

The OS never:
- Assumes a specific model
- Uses model-specific syntax
- Hard-codes model capabilities
- References specific AI assistants

The OS always:
- Provides context files
- Loads skills dynamically
- Routes to workspaces
- Validates outputs
