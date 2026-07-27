# BOOK-007 — Design Constitution

**The Law of Design in Bhavya OS**

> "Design is not just what it looks like and feels like. Design is how it works."

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

This is the **Design Constitution** — the law governing visual design, user experience, and brand identity in Bhavya OS. It defines principles, standards, and processes that ensure design quality and consistency.

### 1.2 Why Does This Exist?

Design is the face of Bhavya OS. Without clear standards:

- Design becomes inconsistent across products
- User experience degrades
- Brand identity weakens
- Accessibility is compromised
- Design debt accumulates

This constitution prevents these failures.

### 1.3 Scope

This document governs:

- Visual design principles
- Brand identity and guidelines
- User experience design
- Accessibility standards
- Responsive design
- Animation and motion
- Design system
- Design process

---

## 2. Philosophy

### 2.1 Core Belief

> "Our identity is the trust we earn through every decision we make."

Design earns trust through:

- **Consistency** — Familiar patterns across products
- **Clarity** — Clear communication and navigation
- **Accessibility** — Usable by everyone
- **Beauty** — Pleasing to the eye
- **Functionality** — Works effectively

### 2.2 Design Principles

1. **Minimalism Over Maximalism**
   - Remove unnecessary elements
   - Focus on essential content
   - Use whitespace effectively
   - Let content breathe

2. **Consistency Over Novelty**
   - Use established patterns
   - Maintain brand consistency
   - Follow platform conventions
   - Create predictable experiences

3. **Accessibility Over Aesthetics**
   - Ensure everyone can use it
   - Follow WCAG guidelines
   - Test with assistive technologies
   - Design for all abilities

4. **Performance Over Polish**
   - Fast is better than pretty
   - Optimize for speed
   - Minimize visual complexity
   - Prioritize core functionality

5. **User-Centric Over Designer-Centric**
   - Design for users, not designers
   - Test with real users
   - Measure effectiveness
   - Iterate based on feedback

---

## 3. Mission

### 3.1 Design Mission

To build a design system that:

1. **Is Consistent** — Same patterns everywhere
2. **Is Accessible** — Usable by everyone
3. **Is Beautiful** — Pleasing to the eye
4. **Is Functional** — Works effectively
5. **Is Maintainable** — Easy to update and evolve

### 3.2 Success Criteria

The Design Constitution succeeds when:

- Design is consistent across all products
- Accessibility standards are met
- User satisfaction is high
- Design debt is minimized
- Design system is adopted and used

---

## 4. Architecture

### 4.1 Design System Structure

```
design-system/
├── tokens/                    # Design tokens
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   ├── shadows.ts
│   └── animations.ts
├── components/                # UI components
│   ├── Button/
│   ├── Card/
│   ├── Input/
│   ├── Modal/
│   └── Toast/
├── patterns/                  # Design patterns
│   ├── forms/
│   ├── navigation/
│   ├── data-display/
│   └── feedback/
├── utilities/                 # Design utilities
│   ├── mixins.ts
│   ├── functions.ts
│   └── helpers.ts
└── docs/                      # Documentation
    ├── principles.md
    ├── guidelines.md
    └── examples.md
```

### 4.2 Design Tokens

```typescript
// tokens/colors.ts
export const colors = {
  // Brand colors
  primary: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
  },

  // Neutral colors
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },

  // Semantic colors
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
};

// tokens/typography.ts
export const typography = {
  fontFamily: {
    sans: "Inter, system-ui, sans-serif",
    mono: "JetBrains Mono, monospace",
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

// tokens/spacing.ts
export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
  40: "10rem",
  48: "12rem",
  56: "14rem",
  64: "16rem",
};
```

### 4.3 Component Structure

```typescript
// components/Button/Button.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { colors, typography, spacing } from '@/design-system/tokens';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className,
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
        variant === 'primary' && 'bg-green-600 text-white hover:bg-green-700',
        variant === 'secondary' && 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        variant === 'ghost' && 'bg-transparent text-gray-900 hover:bg-gray-100',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-base',
        size === 'lg' && 'px-6 py-3 text-lg',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### 4.4 Page Layout Structure

```typescript
// Layout pattern
import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function PageLayout({
  children,
  showHeader = true,
  showFooter = true,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {showHeader && <Header />}
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
```

---

## 5. Rules

### 5.1 Visual Design Rules

1. **Use the design system** — Don't create custom styles
2. **Use consistent spacing** — Follow the spacing scale
3. **Use consistent typography** — Follow the type scale
4. **Use consistent colors** — Use the color palette
5. **Use consistent shadows** — Follow the shadow system
6. **Use consistent borders** — Follow the border system
7. **Use consistent icons** — Use the icon library
8. **Use consistent imagery** — Follow image guidelines
9. **Use consistent layouts** — Follow layout patterns
10. **Use consistent animations** — Follow motion guidelines

### 5.2 Brand Identity Rules

1. **Use the logo correctly** — Follow logo guidelines
2. **Use brand colors** — Primary and secondary colors
3. **Use brand typography** — Inter for all text
4. **Use brand voice** — Professional, minimal, premium
5. **Maintain brand consistency** — Same look everywhere
6. **Protect brand integrity** — Don't distort or alter
7. **Use brand assets** — Official logos, icons, images
8. **Follow brand guidelines** — Official brand book
9. **Update brand when needed** — Evolve thoughtfully
10. **Celebrate the brand** — Be proud of our identity

### 5.3 User Experience Rules

1. **Design for users** — Not for designers
2. **Test with real users** — Get feedback early
3. **Iterate based on data** — Measure effectiveness
4. **Keep it simple** — Simple is better
5. **Keep it consistent** — Predictable is better
6. **Keep it accessible** — Usable by everyone
7. **Keep it fast** — Performance matters
8. **Keep it clear** — Clear communication
9. **Keep it helpful** — Guide the user
10. **Keep it delightful** — Pleasant experience

### 5.4 Accessibility Rules

1. **Follow WCAG 2.1 AA** — Minimum standard
2. **Use semantic HTML** — Proper element usage
3. **Add alt text** — For all images
4. **Use sufficient contrast** — 4.5:1 minimum
5. **Make it keyboard accessible** — Tab navigation
6. **Use ARIA labels** — For complex components
7. **Test with screen readers** — VoiceOver, NVDA
8. **Provide captions** — For video content
9. **Use focus indicators** — Visible focus states
10. **Avoid flashing content** — Prevent seizures

### 5.5 Responsive Design Rules

1. **Mobile-first design** — Start with mobile
2. **Break at standard points** — 640px, 768px, 1024px, 1280px
3. **Use fluid layouts** — Flexbox and Grid
4. **Use relative units** — rem, em, percentages
5. **Optimize images** — Responsive images
6. **Test on real devices** — Not just simulators
7. **Consider touch targets** — 44px minimum
8. **Optimize for performance** — Mobile networks
9. **Consider offline usage** — Service workers
10. **Progressive enhancement** — Core functionality first

### 5.6 Animation and Motion Rules

1. **Use animation purposefully** — Not for decoration
2. **Keep animations short** — 200-500ms
3. **Use appropriate easing** — Natural motion
4. **Respect prefers-reduced-motion** — Accessibility
5. **Use animation consistently** — Same patterns
6. **Don't distract** — Subtle, not overwhelming
7. **Provide feedback** — Show what happened
8. **Guide attention** — Direct user focus
9. **Create continuity** — Connect changes
10. **Test performance** — 60fps target

---

## 6. Implementation

### 6.1 Setting Up Design System

```bash
# 1. Create design system directory
mkdir -p design-system/{tokens,components,patterns,utilities,docs}

# 2. Create design tokens
# tokens/colors.ts, tokens/typography.ts, tokens/spacing.ts

# 3. Create base components
# components/Button, components/Card, components/Input

# 4. Create documentation
# docs/principles.md, docs/guidelines.md

# 5. Test components
# Write tests for all components
```

### 6.2 Creating a New Component

```bash
# 1. Create component directory
mkdir -p design-system/components/NewComponent

# 2. Create component file
touch design-system/components/NewComponent/NewComponent.tsx

# 3. Create test file
touch design-system/components/NewComponent/NewComponent.test.tsx

# 4. Create story file (for Storybook)
touch design-system/components/NewComponent/NewComponent.stories.tsx

# 5. Create index file
touch design-system/components/NewComponent/index.ts
```

```typescript
// NewComponent.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface NewComponentProps {
  variant?: 'default' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function NewComponent({
  variant = 'default',
  size = 'md',
  children,
  className,
}: NewComponentProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        variant === 'default' && 'border-gray-200 bg-white',
        variant === 'secondary' && 'border-green-200 bg-green-50',
        size === 'sm' && 'p-2',
        size === 'md' && 'p-4',
        size === 'lg' && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
}
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
import { PageLayout } from '@/components/PageLayout';

export const metadata: Metadata = {
  title: 'New Page | Bhavya Foundation',
  description: 'Description of new page',
};

export default function NewPage() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900">New Page</h1>
        {/* Content */}
      </div>
    </PageLayout>
  );
}
```

### 6.4 Design Review Process

```yaml
design-review: 1. Create design spec
  2. Get feedback from design team
  3. Implement component
  4. Test for accessibility
  5. Test on multiple devices
  6. Get design approval
  7. Document component
  8. Add to design system
```

---

## 7. Examples

### 7.1 Good Design

```typescript
// Good: Clean, accessible, consistent
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  title: string;
  description: string;
  image?: string;
  href?: string;
}

export function Card({ title, description, image, href }: CardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-lg">
      {image && (
        <div className="aspect-video overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
        {href && (
          <a
            href={href}
            className="mt-4 inline-flex items-center text-green-600 hover:text-green-700"
          >
            Learn more
            <span className="ml-1" aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </article>
  );
}
```

### 7.2 Bad Design

```typescript
// Bad: Inconsistent, inaccessible, messy
import React from 'react';

export function Card(props: any) {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '10px',
      padding: '20px',
      margin: '10px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {props.image && (
        <img src={props.image} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      )}
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>{props.title}</h3>
      <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>{props.description}</p>
      {props.href && (
        <a href={props.href} style={{ color: 'green', marginTop: '10px', display: 'block' }}>
          Click here
        </a>
      )}
    </div>
  );
}
```

### 7.3 Good Accessibility

```typescript
// Good: Accessible, semantic, clear
import React from 'react';

interface NavigationProps {
  items: Array<{
    label: string;
    href: string;
    current?: boolean;
  }>;
}

export function Navigation({ items }: NavigationProps) {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex space-x-8">
        {items.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={cn(
                'text-sm font-medium transition-colors',
                item.current
                  ? 'text-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

---

## 8. Anti-patterns

### 8.1 Never Do This

| Anti-pattern         | Why it's wrong               | Correct approach         |
| -------------------- | ---------------------------- | ------------------------ |
| Inline styles        | Hard to maintain, no theming | Tailwind CSS classes     |
| Custom colors        | Inconsistent branding        | Use design tokens        |
| Custom spacing       | Inconsistent layout          | Use spacing scale        |
| Custom typography    | Inconsistent text            | Use type scale           |
| No alt text          | Inaccessible                 | Add descriptive alt text |
| No focus states      | Inaccessible keyboard        | Add visible focus        |
| No contrast          | Hard to read                 | Ensure 4.5:1 ratio       |
| Flashing content     | Can cause seizures           | Avoid flashing           |
| Large click targets  | Hard to tap                  | 44px minimum             |
| No responsive design | Broken on mobile             | Mobile-first             |

### 8.2 Common Mistakes

1. **Designing in isolation** — Not testing with users
2. **Ignoring accessibility** — Not following WCAG
3. **Inconsistent patterns** — Different everywhere
4. **Too much decoration** — Distracting from content
5. **Poor performance** — Slow loading
6. **No documentation** — Hard to maintain
7. **No versioning** — Can't track changes
8. **No review process** — Quality issues
9. **No feedback mechanism** — Can't improve
10. **No celebration** — Design work not valued

---

## 9. Checklists

### 9.1 Before Designing

- [ ] Understand user needs
- [ ] Review existing patterns
- [ ] Check brand guidelines
- [ ] Consider accessibility
- [ ] Plan responsive behavior
- [ ] Consider performance
- [ ] Set success metrics
- [ ] Get design review

### 9.2 While Designing

- [ ] Use design tokens
- [ ] Follow spacing scale
- [ ] Use consistent typography
- [ ] Ensure sufficient contrast
- [ ] Add alt text for images
- [ ] Make it keyboard accessible
- [ ] Test on multiple devices
- [ ] Document design decisions

### 9.3 Before Publishing

- [ ] Test accessibility
- [ ] Test responsive design
- [ ] Test performance
- [ ] Get design approval
- [ ] Document component
- [ ] Add to design system
- [ ] Notify stakeholders
- [ ] Celebrate completion

### 9.4 After Publishing

- [ ] Monitor usage
- [ ] Track metrics
- [ ] Collect feedback
- [ ] Iterate based on data
- [ ] Update documentation
- [ ] Share learnings
- [ ] Improve design system
- [ ] Celebrate success

---

## 10. Acceptance Criteria

### 10.1 For Design Quality

Design is high quality when:

1. It follows all design principles
2. It uses design tokens consistently
3. It meets accessibility standards
4. It works on all devices
5. It performs well
6. It is well-documented
7. It is consistent with brand
8. It is tested with users
9. It is maintainable
10. It is celebrated

### 10.2 For Design Process

Design process is effective when:

1. User research is conducted
2. Design options are explored
3. Design is tested with users
4. Design is reviewed by peers
5. Design is documented
6. Design is implemented correctly
7. Design is measured for effectiveness
8. Design is iterated based on data

### 10.3 For Design System

Design system is successful when:

1. Components are reusable
2. Patterns are consistent
3. Documentation is complete
4. Adoption is high
5. Quality is maintained
6. Evolution is planned
7. Community contributes
8. Value is demonstrated

---

## 11. Automation Hooks

### 11.1 Design System Automation

```yaml
automation:
  - name: Component Generation
    trigger: design-change
    action:
      - generate-component
      - generate-tests
      - generate-stories
      - generate-docs

  - name: Design Token Sync
    trigger: token-change
    action:
      - update-css
      - update-docs
      - notify-team

  - name: Accessibility Check
    trigger: component-change
    action:
      - run-axe
      - check-contrast
      - check-focus
      - report-issues
```

### 11.2 Design Quality Gates

```yaml
quality-gates:
  - name: Accessibility
    threshold: WCAG 2.1 AA
    action: block

  - name: Performance
    threshold: 90
    action: block

  - name: Consistency
    threshold: 95
    action: warn

  - name: Documentation
    threshold: 100
    action: block
```

---

## 12. Future Evolution

### 12.1 Planned Enhancements

1. **AI-Powered Design** — Automated design suggestions
2. **Design Tokens v2** — More sophisticated tokens
3. **Component Variants** — More flexible components
4. **Design Analytics** — Detailed usage metrics
5. **Design Collaboration** — Real-time design editing
6. **Design Prototyping** — Integrated prototyping
7. **Design Testing** — Automated design testing
8. **Design Education** — Training and tutorials

### 12.2 Evolution Process

Changes to this constitution require:

1. RFC submitted to `.ai/rfcs/`
2. Review by Design Agent
3. Approval by Founder Agent
4. Update to this document
5. Notification to all designers
6. Update to dependent documents

---

## 13. Appendices

### Appendix A: Design System Components

| Component  | Description         | Status      |
| ---------- | ------------------- | ----------- |
| Button     | Interactive element | ✅ Complete |
| Card       | Content container   | ✅ Complete |
| Input      | Form field          | ✅ Complete |
| Modal      | Dialog overlay      | ✅ Complete |
| Toast      | Notification        | ✅ Complete |
| Navigation | Menu system         | ✅ Complete |
| Layout     | Page structure      | ✅ Complete |

### Appendix B: Related Documents

- BOOK-001: AI Constitution
- BOOK-005: Coding Constitution
- BOOK-010: Quality Constitution
- `design-system/`: Design system files
- `apps/website/src/styles/`: Website styles

---

_This document defines the law of design in Bhavya OS. All design must comply with these standards._
