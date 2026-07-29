# Contributing to Bhavya Foundation

Thank you for your interest in contributing to Bhavya Foundation. This guide will help you get started.

## Prerequisites

- Node.js 20.9.0 or higher
- pnpm 10.17.1

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Run quality gates
pnpm test
pnpm validate
pnpm build
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Follow the code standards defined in `standards/`.

### 3. Run Quality Gates

Before committing, ensure all checks pass:

```bash
pnpm lint && pnpm test && pnpm validate && pnpm build
```

### 4. Commit

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(app): add new feature
fix(core): resolve bug
docs: update documentation
```

### 5. Create a Pull Request

- Provide a clear description
- Link related issues
- Ensure CI passes

## Scaffolding

Use the scaffold CLI to create new components:

```bash
# Create a new mission app
pnpm scaffold mission <name> <port>

# Create a new page
pnpm scaffold page <app> <page>

# Create a new API route
pnpm scaffold api <app> <route>

# Create a new document
pnpm scaffold document <category> <title>

# Create a new entity
pnpm scaffold entity <type> <name>
```

## Architecture

See `PLATFORM_GUARANTEES.md` for architectural principles.

### Application Hierarchy

```
Mission Apps → content-core → Knowledge → Library → Website
```

### Data Flow

1. Mission apps publish to content-core
2. Content-core publishes to Knowledge graph
3. Library consumes published data
4. Website displays public content

## Testing

```bash
# Run all tests
pnpm test

# Run tests for a specific package
pnpm --filter @bhavya/content-core test

# Run validation
pnpm validate
```

## Code Standards

- TypeScript strict mode
- ESLint for linting
- Prettier for formatting
- Vitest for testing

## Getting Help

- Review existing code and patterns
- Check documentation in `docs/`
- Open an issue for questions
