# Installing Bhavya AI Lab OS

## Philosophy

The Bhavya AI Lab Operating System is designed to run inside OpenCode. AI models are interchangeable. Skills are attached to the workspace rather than a specific model.

## Step 1 — Install Node.js

Before installing Remotion, ensure Node.js is available.

Check:

```bash
node --version
npm --version
```

If Node.js is missing, install the latest LTS version.

Verify:

```bash
node -v
npm -v
```

## Step 2 — Create the Workspace

```bash
mkdir bhavya-ai-lab
cd bhavya-ai-lab
```

Initialize:

```bash
npm init -y
```

## Step 3 — Install Remotion

OpenCode executes:

```bash
npm install remotion
```

or

```bash
npx remotion init
```

depending on the project template.

## Step 4 — Install Development Stack

```bash
npm install react react-dom typescript @types/react @types/react-dom
npm install eslint prettier vitest
```

## Step 5 — OpenCode Skills

Bhavya uses OpenCode Skills, not Claude Skills.

```
skills/
├── remotion/
├── react/
├── typescript/
├── nextjs/
├── education/
├── research/
├── writing/
├── qa/
├── deployment/
├── animation/
└── diagramming/
```

Each skill is model-independent.

## OpenCode Skill Structure

```
skills/
└── remotion/
    ├── skill.json          # Metadata
    ├── README.md           # Human documentation
    ├── CONTEXT.md          # Domain context
    ├── patterns.md         # Preferred patterns
    ├── anti_patterns.md    # What to avoid
    ├── examples.md         # Sample implementations
    ├── best_practices.md   # Guidelines
    ├── references.md       # External resources
    ├── prompts/            # Task-specific prompts
    └── templates/          # Starter files
```

Notice: No Claude-specific files.

## Skill Registration

Rather than hard-coding skills, maintain a registry:

```json
// _config/skills/registry.json
{
  "remotion": {
    "path": "skills/remotion",
    "version": "1.0.0",
    "workspaces": ["production"]
  }
}
```

OpenCode loads skills based on the current workspace instead of globally.

## Component Registry

The Production workspace references reusable animation assets:

```
_config/registries/
├── components/
├── layouts/
├── animations/
├── charts/
├── maps/
├── diagrams/
├── backgrounds/
└── audio/
```

The Remotion skill first checks this registry before generating new components.

## Long-Term: Skill Packages

Skills are portable packages that any coding agent can consume:

```
skills/remotion/
├── skill.json          # Metadata
├── CONTEXT.md          # Domain context
├── README.md           # Human documentation
├── patterns.md         # Preferred patterns
├── anti_patterns.md    # What to avoid
├── examples/           # Sample implementations
├── templates/          # Starter files
├── prompts/            # Task-specific prompts
└── tests/              # Validation checks
```

This approach makes the Bhavya AI Lab operating system independent of any single AI assistant.
