import { resolve } from 'node:path';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

export async function createAgent(type: string, name: string): Promise<void> {
  const root = process.cwd();

  switch (type) {
    case 'agent':
      await createAgentDefinition(root, name);
      break;
    case 'workflow':
      await createWorkflow(root, name);
      break;
    case 'service':
      await createService(root, name);
      break;
    case 'event':
      await createEvent(root, name);
      break;
    case 'memory':
      await createMemoryType(root, name);
      break;
    default:
      console.error(`Unknown type: ${type}. Use agent, workflow, service, event, or memory.`);
      process.exit(1);
  }
}

async function createAgentDefinition(root: string, name: string): Promise<void> {
  const dir = resolve(root, '.agents');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const content = `# ${name}

**Status:** Active
**Created:** ${new Date().toISOString()}

---

## Role

[Describe the agent role]

## Capabilities

- [ ] [Capability 1]
- [ ] [Capability 2]

## Permissions

- read
- write
- execute

## Workflows

- [workflow-1]
- [workflow-2]

## Memory

- [memory-types-this-agent-uses]

## Events

- [events-this-agent-emits]
- [events-this-agent-listens-to]

---

*Edit this file to define the agent.*
`;

  writeFileSync(resolve(dir, `${name}.md`), content);
  console.log(`Created: .agents/${name}.md`);
  console.log(`
Next steps:`);
  console.log(`  1. Edit .agents/${name}.md`);
  console.log(`  2. Define capabilities and permissions`);
  console.log(`  3. Test with: bhavya test agent ${name}`);
}

async function createWorkflow(root: string, name: string): Promise<void> {
  const dir = resolve(root, '.workflows');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const content = `# ${name}

**Status:** Active
**Created:** ${new Date().toISOString()}

---

## Trigger

[When does this workflow start?]

## Steps

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Agents

- [agent-1]: [role]
- [agent-2]: [role]

## Events

### Emitted

- [event-1]
- [event-2]

### Listens To

- [event-3]

## Memory

- [memory-types-used]

---

*Edit this file to define the workflow.*
`;

  writeFileSync(resolve(dir, `${name}.md`), content);
  console.log(`Created: .workflows/${name}.md`);
  console.log(`
Next steps:`);
  console.log(`  1. Edit .workflows/${name}.md`);
  console.log(`  2. Define trigger, steps, and agents`);
  console.log(`  3. Test with: bhavya test workflow ${name}`);
}

async function createService(root: string, name: string): Promise<void>
  const dir = resolve(root, 'packages/kernel/src/services');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const className = name.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Service';

  const content = `// ${name} Service
// Solves: [describe the institutional need]
// Exercises: [list runtime capabilities]

import type { InstitutionService } from './index.js';
import type { Artifact } from '../types/index.js';

export interface ${className}Input {
  action: string;
  // Add fields here
}

export class ${className} implements InstitutionService {
  name = '${name}';
  description = '[describe the service]';
  capabilities = ['[capability-1]', '[capability-2]'];

  async initialize(): Promise<void> {
    // Service ready
  }

  async execute(input: ${className}Input): Promise<{ artifacts: Artifact[]; success: boolean }> {
    const artifacts: Artifact[] = [];
    // Implement here
    return { artifacts, success: true };
  }

  async shutdown(): Promise<void> {
    // Clean up
  }
}
`;

  writeFileSync(resolve(dir, `${name}.ts`), content);
  console.log(`Created: packages/kernel/src/services/${name}.ts`);
  console.log(`
Next steps:`);
  console.log(`  1. Edit packages/kernel/src/services/${name}.ts`);
  console.log(`  2. Implement execute() method`);
  console.log(`  3. Export from services/index.ts`);
  console.log(`  4. Test with: bhavya test service ${name}`);
}

async function createEvent(root: string, name: string): Promise<void> {
  const dir = resolve(root, '.events');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const content = `# ${name}

**Status:** Active
**Created:** ${new Date().toISOString()}

---

## Description

[Describe what this event represents]

## Payload

\`\`\`typescript
interface ${name.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Payload {
  // Define payload fields
}
\`\`\`

## Emitted By

- [agent/workflow that emits this]

## Listened By

- [agent/workflow that listens]

---

*Edit this file to define the event.*
`;

  writeFileSync(resolve(dir, `${name}.md`), content);
  console.log(`Created: .events/${name}.md`);
  console.log(`
Next steps:`);
  console.log(`  1. Edit .events/${name}.md`);
  console.log(`  2. Define payload and listeners`);
}

async function createMemoryType(root: string, name: string): Promise<void> {
  const dir = resolve(root, '.memory');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const content = `# ${name}

**Status:** Active
**Created:** ${new Date().toISOString()}

---

## Description

[Describe what this memory type stores]

## Schema

\`\`\`typescript
interface ${name.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')}Memory {
  // Define fields
}
\`\`\`

## Used By

- [agent/workflow that uses this]

---

*Edit this file to define the memory type.*
`;

  writeFileSync(resolve(dir, `${name}.md`), content);
  console.log(`Created: .memory/${name}.md`);
  console.log(`
Next steps:`);
  console.log(`  1. Edit .memory/${name}.md`);
  console.log(`  2. Define schema and usage`);
}
