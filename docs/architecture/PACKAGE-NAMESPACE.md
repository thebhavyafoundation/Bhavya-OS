# @bhavya/* Package Namespace

**Version:** 1.0.0-alpha

---

## Convention

Every package in the Bhavya OS monorepo lives under the `@bhavya/` namespace.

```
@bhavya/kernel        → packages/kernel/
@bhavya/agent-engine  → packages/agent-engine/
@bhavya/workflow-engine → packages/workflow-engine/
@bhavya/memory-engine → packages/memory-engine/
@bhavya/knowledge-engine → packages/knowledge-engine/
@bhavya/search-engine → packages/search-engine/
@bhavya/planner-engine → packages/planner-engine/
@bhavya/scheduler-engine → packages/scheduler-engine/
@bhavya/runtime       → packages/runtime/ (legacy)
@bhavya/sdk           → packages/sdk/ (legacy)
```

## Usage

```typescript
import { boot } from '@bhavya/kernel';
import { AgentEngine } from '@bhavya/agent-engine';
import { WorkflowEngine } from '@bhavya/workflow-engine';
import { MemoryEngine } from '@bhavya/memory-engine';
```

## Why Namespace?

1. **Discoverability** — `@bhavya/*` instantly identifies Bhavya packages
2. **Avoids Conflicts** — No naming collisions with npm packages
3. **Consistency** — Same pattern as `@langchain/*`, `@trpc/*`
4. **Monorepo Native** — pnpm workspace protocol handles resolution

## Adding New Packages

1. Create `packages/<name>/`
2. Add `package.json` with `"name": "@bhavya/<name>"`
3. Add `"dependencies": { "@bhavya/kernel": "workspace:*" }`
4. Package is automatically available via `@bhavya/<name>`

---

**Every package speaks BRP. Every package lives under @bhavya/.**
