# BOOK-005 — Coding Constitution

**The Law of Code in Bhavya OS**

> "Code is the material with which we build the future. It must be crafted with care, documented with precision, and maintained with integrity."

**Version:** 1.0
**Status:** Active
**Authority:** Subordinate to BOOK-001, BOOK-002, BOOK-003
**Last Updated:** 2026-07-27

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Philosophy](#2-philosophy)
3. [Mission](#3-mission)
4. [Architecture](#4-architecture)
5. [Rules](#5-rules)
6. [Implementation](#6-implementation)
7. [Examples](#7-examples)
8. [Anti-patterns](#8-anti-patterns)
9. [Checklists](#9-checklists)
10. [Acceptance Criteria](#10-acceptance-criteria)
11. [Automation Hooks](#11-automation-hooks)
12. [Future Evolution](#12-future-evolution)
13. [Appendices](#13-appendices)

---

## 1. Introduction

### 1.1 What Is This Document?

This is the **Coding Constitution** — the law governing how code is written, reviewed, tested, and maintained in Bhavya OS. It defines standards, practices, and processes that ensure code quality and consistency.

### 1.2 Why Does This Exist?

Code is the foundation of Bhavya OS. Without clear standards:

- Code becomes inconsistent and hard to maintain
- Bugs slip through to production
- Knowledge is lost when developers leave
- Security vulnerabilities emerge
- Technical debt accumulates

This constitution prevents these failures.

### 1.3 Scope

This document governs:

- Code style and formatting
- Code structure and organization
- Code review process
- Code testing requirements
- Code documentation standards
- Code security practices
- Code performance standards
- Code deployment process

---

## 2. Philosophy

### 2.1 Core Belief

> "Our identity is the trust we earn through every decision we make."

Code earns trust through:

- **Readability** — Code that can be understood by humans
- **Maintainability** — Code that can be changed safely
- **Reliability** — Code that works correctly
- **Security** — Code that protects against threats
- **Performance** — Code that runs efficiently

### 2.2 Design Principles

1. **Clarity Over Cleverness**
   - Write code that is easy to understand
   - Prefer explicit over implicit
   - Avoid clever tricks that obscure meaning

2. **Minimal Intervention**
   - Make the smallest change necessary
   - Don't refactor unrelated code
   - Keep changes focused and atomic

3. **Evidence-Based Decisions**
   - Base code decisions on data
   - Measure performance, don't guess
   - Test assumptions with experiments

4. **Fail-Safe Design**
   - Handle errors gracefully
   - Validate inputs at boundaries
   - Design for failure

5. **Continuous Improvement**
   - Refactor when you touch code
   - Leave code better than you found it
   - Learn from mistakes

---

## 3. Mission

### 3.1 Coding Mission

To build a codebase that:

1. **Is Readable** — Any developer can understand it
2. **Is Maintainable** — Changes are safe and predictable
3. **Is Reliable** — Works correctly in all conditions
4. **Is Secure** — Protects against threats
5. **Is Performant** — Meets performance requirements

### 3.2 Success Criteria

The Coding Constitution succeeds when:

- Code review time is reduced
- Bug rate is reduced
- Deployment frequency is increased
- Mean time to recovery is reduced
- Developer satisfaction is increased

---

## 4. Architecture

### 4.1 Code Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── (routes)/          # Route groups
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI primitives (Button, Card, Input)
│   ├── layout/           # Layout components (Header, Footer)
│   └── features/         # Feature-specific components
├── lib/                   # Utilities and helpers
│   ├── animations.ts     # Animation utilities
│   ├── utils.ts          # General utilities
│   └── constants.ts      # Constants
├── styles/                # Global styles
│   └── globals.css       # Global CSS
└── types/                 # TypeScript types
    └── index.ts          # Type definitions
```

### 4.2 File Naming Conventions

| Type       | Convention                 | Example                          |
| ---------- | -------------------------- | -------------------------------- |
| Components | PascalCase                 | `Header.tsx`, `MissionCards.tsx` |
| Utilities  | camelCase                  | `animations.ts`, `utils.ts`      |
| Constants  | UPPER_SNAKE_CASE           | `COLORS.ts`, `API_URL.ts`        |
| Types      | PascalCase                 | `Mission.ts`, `Event.ts`         |
| Tests      | `*.test.ts` or `*.spec.ts` | `Header.test.ts`                 |
| Styles     | `*.css` or `*.module.css`  | `globals.css`                    |

### 4.3 Component Structure

```typescript
// Component template
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  // Props definition
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
  return (
    <div className={cn('base-styles', conditionalStyles)}>
      {/* Content */}
    </div>
  );
}
```

### 4.4 Hook Structure

```typescript
// Hook template
import { useState, useEffect } from "react";

interface UseHookReturn {
  // Return type
}

export function useHook(param: ParamType): UseHookReturn {
  // State
  const [state, setState] = useState<StateType>(initialState);

  // Effects
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, [dependencies]);

  // Handlers
  const handler = () => {
    // Handler logic
  };

  // Return
  return {
    state,
    handler,
  };
}
```

---

## 5. Rules

### 5.1 Code Style Rules

1. **Use TypeScript** — No JavaScript files
2. **Use functional components** — No class components
3. **Use hooks** — No lifecycle methods
4. **Use Tailwind CSS** — No inline styles
5. **Use named exports** — No default exports
6. **Use const over let** — Avoid reassignment
7. **Use arrow functions** — For callbacks and small functions
8. **Use template literals** — Over string concatenation
9. **Use destructuring** — For objects and arrays
10. **Use early returns** — Avoid deep nesting

### 5.2 Code Structure Rules

1. **One component per file** — No multiple components
2. **Maximum 200 lines per file** — Split large files
3. **Maximum 20 lines per function** — Split large functions
4. **Maximum 3 levels of nesting** — Flatten deep nesting
5. **Maximum 3 parameters** — Use objects for more
6. **Import order** — React, libraries, components, utilities, types
7. **Export at bottom** — After component definition
8. **No magic numbers** — Use named constants
9. **No hardcoded values** — Use configuration
10. **No commented-out code** — Delete it

### 5.3 Code Review Rules

1. **Review every change** — No exceptions
2. **Review within 24 hours** — Don't block progress
3. **Check for correctness** — Does it work?
4. **Check for readability** — Is it understandable?
5. **Check for maintainability** — Is it easy to change?
6. **Check for security** — Is it safe?
7. **Check for performance** — Is it efficient?
8. **Check for accessibility** — Is it usable by everyone?
9. **Provide constructive feedback** — Help improve
10. **Approve when ready** — Don't delay unnecessarily

### 5.4 Testing Rules

1. **Test behavior, not implementation** — Black-box testing
2. **Write tests before code** — Test-driven development
3. **Test edge cases** — Boundary conditions
4. **Test error cases** — What happens when things go wrong?
5. **Keep tests fast** — Tests should run in milliseconds
6. **Keep tests isolated** — No dependencies between tests
7. **Keep tests readable** — Tests are documentation
8. **Keep tests maintainable** — Tests are code too
9. **Aim for 80% coverage** — Don't chase 100%
10. **Test in production** — Monitoring and alerting

### 5.5 Documentation Rules

1. **Document why, not what** — Code is self-documenting
2. **Use JSDoc for complex functions** — Explain algorithms
3. **Use comments for business logic** — Explain rules
4. **Keep comments up-to-date** — Outdated comments are worse than none
5. **Use TODO for future work** — Don't leave incomplete work
6. **Use FIXME for known issues** — Don't hide problems
7. **Document APIs** — OpenAPI/Swagger
8. **Document architecture** — High-level design
9. **Document decisions** — ADRs
10. **Document onboarding** — Getting started guide

### 5.6 Security Rules

1. **Validate all inputs** — Never trust user data
2. **Sanitize all outputs** — Prevent XSS
3. **Use parameterized queries** — Prevent SQL injection
4. **Use HTTPS everywhere** — Encrypt in transit
5. **Use CSRF protection** — Prevent cross-site request forgery
6. **Use rate limiting** — Prevent abuse
7. **Use authentication** — Verify identity
8. **Use authorization** — Verify permissions
9. **Log security events** — Audit trail
10. **Respond to incidents** — Have a plan

### 5.7 Performance Rules

1. **Measure first** — Don't guess
2. **Optimize hot paths** — Focus on bottlenecks
3. **Cache aggressively** — Reduce computation
4. **Lazy load** — Load on demand
5. **Code split** — Reduce bundle size
6. **Optimize images** — Compress and resize
7. **Minimize API calls** — Batch and deduplicate
8. **Use CDNs** — Distribute globally
9. **Monitor performance** — Track metrics
10. **Set performance budgets** — Enforce limits

---

## 6. Implementation

### 6.1 Setting Up Development Environment

```bash
# 1. Clone repository
git clone https://github.com/bhavya-foundation/bhavya-os.git
cd bhavya-os

# 2. Install dependencies
pnpm install

# 3. Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Run development server
pnpm dev

# 5. Run tests
pnpm test

# 6. Run linting
pnpm lint
```

### 6.2 Creating a New Component

```bash
# 1. Create component file
touch src/components/features/NewFeature.tsx

# 2. Create test file
touch src/components/features/NewFeature.test.tsx

# 3. Create style file (if needed)
touch src/components/features/NewFeature.module.css
```

```typescript
// NewFeature.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface NewFeatureProps {
  title: string;
  description?: string;
  variant?: 'default' | 'secondary';
  onClick?: () => void;
}

export function NewFeature({
  title,
  description,
  variant = 'default',
  onClick,
}: NewFeatureProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-6',
        variant === 'default' && 'border-gray-200 bg-white',
        variant === 'secondary' && 'border-green-200 bg-green-50'
      )}
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-gray-600">{description}</p>
      )}
    </div>
  );
}
```

```typescript
// NewFeature.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { NewFeature } from './NewFeature';

describe('NewFeature', () => {
  it('renders title', () => {
    render(<NewFeature title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <NewFeature title="Test Title" description="Test Description" />
    );
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<NewFeature title="Test Title" onClick={handleClick} />);
    fireEvent.click(screen.getByText('Test Title'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 6.3 Creating a New Page

```bash
# 1. Create page directory
mkdir -p src/app/new-page

# 2. Create page file
touch src/app/new-page/page.tsx

# 3. Create layout file (if needed)
touch src/app/new-page/layout.tsx
```

```typescript
// src/app/new-page/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Page | Bhavya Foundation',
  description: 'Description of new page',
};

export default function NewPage() {
  return (
    <main className="min-h-screen">
      <h1>New Page</h1>
      {/* Content */}
    </main>
  );
}
```

### 6.4 Code Review Process

```yaml
code-review: 1. Create PR with focused changes
  2. Fill out PR template completely
  3. Self-review your own code first
  4. Request review from appropriate agents
  5. Respond to feedback within 24 hours
  6. Make requested changes
  7. Get approval from reviewers
  8. Merge when all checks pass
```

### 6.5 Commit Message Format

```
<type>(<scope>): <description>

<body>

<footer>
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:

```
feat(components): add new mission card component

- Add MissionCard component with hover effects
- Add responsive design for mobile
- Add accessibility support

Closes #123
```

---

## 7. Examples

### 7.1 Correct Code Structure

```typescript
// Good: Clear, readable, maintainable
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface MissionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export function MissionCard({
  title,
  description,
  icon,
  href,
}: MissionCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-gray-600">{description}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        className="mt-4 w-full"
        href={href}
      >
        Learn More
      </Button>
    </div>
  );
}
```

### 7.2 Incorrect Code Structure

```typescript
// Bad: Unclear, hard to maintain
import React, { Component } from 'react';

export default class MissionCard extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      hovered: false
    };
  }

  render() {
    const { title, description, icon, href } = this.props;
    const { hovered } = this.state;

    return (
      <div
        style={{
          border: '1px solid #ccc',
          padding: '20px',
          margin: '10px',
          backgroundColor: hovered ? '#f0f0f0' : 'white'
        }}
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '15px' }}>{icon}</div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {title}
            </h3>
            <p style={{ marginTop: '10px', color: '#666' }}>
              {description}
            </p>
          </div>
        </div>
        <a
          href={href}
          style={{
            display: 'block',
            marginTop: '15px',
            textAlign: 'center',
            color: '#007bff'
          }}
        >
          Learn More
        </a>
      </div>
    );
  }
}
```

### 7.3 Correct Testing

```typescript
// Good: Tests behavior, not implementation
import { render, screen, fireEvent } from '@testing-library/react';
import { MissionCard } from './MissionCard';

describe('MissionCard', () => {
  const defaultProps = {
    title: 'Forest Mission',
    description: 'Restore nature',
    icon: <span>🌳</span>,
    href: '/nature',
  };

  it('renders title and description', () => {
    render(<MissionCard {...defaultProps} />);
    expect(screen.getByText('Forest Mission')).toBeInTheDocument();
    expect(screen.getByText('Restore nature')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<MissionCard {...defaultProps} />);
    expect(screen.getByText('🌳')).toBeInTheDocument();
  });

  it('links to correct href', () => {
    render(<MissionCard {...defaultProps} />);
    const link = screen.getByText('Learn More');
    expect(link).toHaveAttribute('href', '/nature');
  });
});
```

---

## 8. Anti-patterns

### 8.1 Never Do This

| Anti-pattern     | Why it's wrong                 | Correct approach                 |
| ---------------- | ------------------------------ | -------------------------------- |
| Class components | Outdated, hard to test         | Functional components with hooks |
| Inline styles    | Hard to maintain, no theming   | Tailwind CSS classes             |
| Default exports  | Hard to refactor, inconsistent | Named exports                    |
| Any type         | Defeats TypeScript purpose     | Proper type definitions          |
| Deep nesting     | Hard to read                   | Early returns, helper functions  |
| Magic numbers    | Unclear meaning                | Named constants                  |
| Commented code   | Clutters codebase              | Delete it                        |
| Large files      | Hard to navigate               | Split into smaller files         |
| Large functions  | Hard to test                   | Split into smaller functions     |
| No tests         | Low confidence                 | Write tests                      |

### 8.2 Common Mistakes

1. **Premature Optimization** — Optimize before measuring
2. **Over-engineering** — Build more than needed
3. **Under-documenting** — Not explaining complex logic
4. **Ignoring errors** — Swallowing exceptions
5. **Hardcoding values** — Making changes difficult
6. **Skipping validation** — Trusting user input
7. **Not handling edge cases** — Only handling happy path
8. **Mixing concerns** — Combining unrelated logic
9. **Circular dependencies** — Creating import cycles
10. **Dead code** — Leaving unused code

---

## 9. Checklists

### 9.1 Before Writing Code

- [ ] Understand the requirements
- [ ] Read existing patterns
- [ ] Plan the approach
- [ ] Identify dependencies
- [ ] Consider edge cases
- [ ] Consider security implications
- [ ] Consider performance impact
- [ ] Consider accessibility

### 9.2 While Writing Code

- [ ] Follow code style rules
- [ ] Write self-documenting code
- [ ] Handle errors gracefully
- [ ] Validate inputs
- [ ] Write tests as you go
- [ ] Keep functions small
- [ ] Keep files focused
- [ ] Use meaningful names

### 9.3 Before Committing

- [ ] Run linter
- [ ] Run tests
- [ ] Run type checker
- [ ] Review your own changes
- [ ] Write clear commit message
- [ ] Update documentation if needed
- [ ] Check for secrets
- [ ] Check for performance impact

### 9.4 During Code Review

- [ ] Check for correctness
- [ ] Check for readability
- [ ] Check for maintainability
- [ ] Check for security
- [ ] Check for performance
- [ ] Check for accessibility
- [ ] Check for test coverage
- [ ] Check for documentation

---

## 10. Acceptance Criteria

### 10.1 For Code Quality

Code is high quality when:

1. It follows all code style rules
2. It passes all linting rules
3. It passes all type checking
4. It has meaningful test coverage
5. It is well-documented
6. It handles errors gracefully
7. It is accessible
8. It performs well
9. It is secure
10. It is maintainable

### 10.2 For Code Review

Code review is complete when:

1. All changes are reviewed
2. All feedback is addressed
3. All tests pass
4. All documentation is updated
5. All security concerns are addressed
6. All performance concerns are addressed
7. All accessibility concerns are addressed
8. Approval is received from reviewers

### 10.3 For Deployment

Code is ready for deployment when:

1. All tests pass
2. All linting passes
3. All type checking passes
4. All code review approvals received
5. All documentation updated
6. All security concerns addressed
7. All performance concerns addressed
8. All accessibility concerns addressed
9. All monitoring in place
10. All rollback plan ready

---

## 11. Automation Hooks

### 11.1 Pre-commit Hooks

```yaml
pre-commit:
  - name: Lint
    command: pnpm lint
    failure: block

  - name: Type Check
    command: pnpm typecheck
    failure: block

  - name: Test
    command: pnpm test
    failure: block

  - name: Format
    command: pnpm format
    failure: auto-fix
```

### 11.2 CI/CD Pipeline

```yaml
pipeline:
  stages:
    - name: validate
      steps:
        - lint
        - typecheck
        - test

    - name: build
      steps:
        - build

    - name: deploy
      steps:
        - deploy-staging
        - integration-tests
        - deploy-production
```

### 11.3 Quality Gates

```yaml
quality-gates:
  - name: Code Coverage
    threshold: 80%
    action: warn

  - name: Bundle Size
    threshold: 100KB
    action: block

  - name: Performance Score
    threshold: 90
    action: block

  - name: Accessibility Score
    threshold: 95
    action: block
```

---

## 12. Future Evolution

### 12.1 Planned Enhancements

1. **AI-Powered Code Review** — Automated code analysis
2. **Automated Refactoring** — AI-suggested improvements
3. **Performance Profiling** — Automated performance analysis
4. **Security Scanning** — Automated security analysis
5. **Code Generation** — AI-assisted code writing
6. **Test Generation** — Automated test creation
7. **Documentation Generation** — Automated docs
8. **Architecture Analysis** — Automated design review

### 12.2 Evolution Process

Changes to this constitution require:

1. RFC submitted to `.ai/rfcs/`
2. Review by Engineering Agent
3. Approval by Founder Agent
4. Update to this document
5. Notification to all developers
6. Update to dependent documents

---

## 13. Appendices

### Appendix A: Code Style Guide

| Category   | Rule             | Example         |
| ---------- | ---------------- | --------------- |
| Variables  | camelCase        | `userName`      |
| Functions  | camelCase        | `getUser()`     |
| Components | PascalCase       | `UserCard`      |
| Constants  | UPPER_SNAKE_CASE | `API_URL`       |
| Types      | PascalCase       | `UserType`      |
| Interfaces | PascalCase       | `UserProps`     |
| Enums      | PascalCase       | `UserStatus`    |
| Files      | PascalCase       | `UserCard.tsx`  |
| Folders    | kebab-case       | `user-profile/` |

### Appendix B: Related Documents

- BOOK-001: AI Constitution
- BOOK-003: Engineering Constitution
- BOOK-010: Quality Constitution
- `.ai/CODING_STANDARDS.md`: Detailed coding standards
- `.ai/ARCHITECTURE.md`: Architecture decisions
- `package.json`: Project dependencies

---

_This document defines the law of code in Bhavya OS. All code must comply with these standards._
