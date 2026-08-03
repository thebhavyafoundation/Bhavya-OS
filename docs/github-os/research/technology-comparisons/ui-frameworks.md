# UI Frameworks — Repository Profiles

Research Date: 2026-08-03

---

## shadcn/ui

**URL:** https://github.com/shadcn-ui/ui
**Stars:** ~75,000
**Language:** TypeScript
**Category:** UI Component Library
**License:** MIT

### What It Does

shadcn/ui is not a traditional component library — it's a collection of beautifully designed, accessible components that you copy directly into your project. Built on Radix UI primitives and styled with Tailwind CSS, it gives you full ownership of every component.

### Architecture

shadcn/ui uses a copy-paste distribution model. Components are generated into your codebase via CLI (`npx shadcn@latest add button`). Each component is built on Radix UI or Base UI primitives with Tailwind CSS styling. The February 2026 Visual Builder lets you configure components visually.

### Key Features

- Copy-paste component model (you own the code)
- Built on Radix UI and Base UI primitives
- Tailwind CSS styling
- Zero runtime overhead
- AAA accessibility via Radix primitives
- Visual Builder (February 2026)
- 50+ components (dialog, dropdown, tabs, form, data table, etc.)
- CSS variables for dynamic theming
- Works with Next.js, Vite, and other React frameworks

### Why It Matters for Bhavya

shadcn/ui is the default choice for React UI development in 2026, with 75,000+ stars. Its copy-paste model and accessibility-first approach are directly relevant for building Bhavya's UI components.

### Reusable Patterns

- Copy-paste component distribution
- Headless primitive layer (Radix/Base UI) + styling layer
- CSS variables for dynamic theming
- Accessibility-first component design
- CLI-based component generation

### Education Value

Can become lessons on: component architecture, accessibility patterns, Tailwind CSS, and design system building.

### Evidence

- Source: https://github.com/shadcn-ui/ui
- Date: 2026-08-03
- Quality Score: 10/10

---

## Radix UI

**URL:** https://github.com/radix-ui/primitives
**Stars:** ~18,700
**Language:** TypeScript
**Category:** Headless UI Primitives
**License:** MIT

### What It Does

Radix UI provides unstyled, accessible React component primitives. It handles all complex behavior (focus management, keyboard navigation, ARIA attributes) while you control every visual detail.

### Architecture

Radix primitives are individual npm packages (`@radix-ui/react-dialog`, `@radix-ui/react-select`, etc.). Each package provides behavior-only components with full WAI-ARIA compliance. shadcn/ui is built on top of Radix primitives.

### Key Features

- 35+ accessible primitives
- AAA accessibility compliance
- Full WAI-ARIA support
- Keyboard navigation
- Focus management
- Screen reader support
- Individual npm packages per component
- 130M+ monthly npm downloads
- TypeScript support

### Why It Matters for Bhavya

Radix UI is the foundation that shadcn/ui and many other libraries build on. Understanding it is essential for any React component development.

### Reusable Patterns

- Headless component primitive pattern
- WAI-ARIA accessibility implementation
- Individual package per component
- Composition-based component API
- Keyboard navigation patterns

### Education Value

Can become lessons on: accessibility standards, headless component architecture, and React primitive patterns.

### Evidence

- Source: https://github.com/radix-ui/primitives
- Date: 2026-08-03
- Quality Score: 9/10

---

## Base UI

**URL:** https://github.com/mui/base-ui
**Stars:** ~4,200
**Language:** TypeScript
**Category:** Headless UI Primitives
**License:** MIT

### What It Does

Base UI is MUI's headless component library, rebuilt from the ground up with better TypeScript types and cleaner APIs for complex interaction patterns. It's now the default primitive layer in shadcn/ui (since July 2026).

### Architecture

Base UI provides unstyled, accessible React primitives with a state-based className API. It's more self-contained than Radix (fewer cross-package dependencies) and has better support for complex patterns like comboboxes and multi-select.

### Key Features

- Unstyled, accessible primitives
- Better TypeScript types than Radix
- Cleaner APIs for complex interactions
- State-based className function
- Full-time engineering team (MUI)
- 6M+ weekly npm downloads
- Compatible with shadcn/ui
- React 19 support from day one

### Why It Matters for Bhavya

Base UI is becoming the new standard for headless React primitives, with shadcn/ui switching to it as default in July 2026.

### Reusable Patterns

- State-based className for conditional styling
- Self-contained primitive packages
- Complex interaction pattern support
- Modern React 19 compatibility

### Education Value

Can become lessons on: modern component primitive design, TypeScript-first development, and React 19 patterns.

### Evidence

- Source: https://github.com/mui/base-ui
- Date: 2026-08-03
- Quality Score: 8/10

---

## React Aria

**URL:** https://github.com/adobe/react-spectrum
**Stars:** ~13,000
**Language:** TypeScript
**Category:** Headless UI Hooks
**License:** Apache-2.0

### What It Does

React Aria from Adobe provides unstyled UI hooks and components that focus on ARIA accessibility best practices and design patterns. It's backed by Adobe's accessibility research and provides the most thoroughly tested accessibility primitives available.

### Architecture

React Aria provides hooks and components that handle all accessibility, internationalization, and interaction behaviors. It's designed to be styled with any CSS solution (CSS-in-JS, Tailwind, CSS Modules).

### Key Features

- Adobe accessibility research-backed
- Most thoroughly tested accessibility primitives
- Hooks and components API
- Internationalization support
- Works with any styling solution
- 20K+ GitHub stars
- 500K+ weekly npm downloads

### Why It Matters for Bhavya

React Aria represents the gold standard for accessibility in React components, backed by Adobe's extensive accessibility research.

### Reusable Patterns

- Research-backed accessibility implementation
- Hooks-based component architecture
- Internationalization-first design
- Cross-styling-solution compatibility

### Education Value

Can become lessons on: accessibility standards, internationalization, and hooks-based component design.

### Evidence

- Source: https://github.com/adobe/react-spectrum
- Date: 2026-08-03
- Quality Score: 8/10

---

## DaisyUI

**URL:** https://github.com/saadeghi/daisyui
**Stars:** ~35,000
**Language:** CSS
**Category:** Tailwind CSS Plugin
**License:** MIT

### What It Does

DaisyUI is a Tailwind CSS plugin that adds semantic class names for rapid prototyping. It provides 60+ pre-built components and 35 themes, working across any framework since it's pure CSS.

### Architecture

DaisyUI extends Tailwind CSS with component class names (`btn`, `card`, `modal`). It's a CSS-only plugin with no JavaScript dependencies, making it framework-agnostic and lightweight.

### Key Features

- 60+ component classes
- 35 built-in themes
- Pure CSS (no JavaScript)
- Framework-agnostic
- ~20KB gzipped
- Customizable via Tailwind config
- Dark mode support
- RTL support

### Why It Matters for Bhavya

DaisyUI offers the fastest path to prototyping with Tailwind CSS, useful for rapid UI development and education.

### Reusable Patterns

- Tailwind CSS plugin architecture
- Semantic class naming system
- Theme customization system
- Framework-agnostic CSS components

### Education Value

Can become labs on: Tailwind CSS customization, CSS plugin development, and rapid prototyping.

### Evidence

- Source: https://github.com/saadeghi/daisyui
- Date: 2026-08-03
- Quality Score: 8/10

---

## Mantine

**URL:** https://github.com/mantinedev/mantine
**Stars:** ~28,000
**Language:** TypeScript
**Category:** Styled Component Library
**License:** MIT

### What It Does

Mantine is a full-featured React component library with 100+ components, hooks, and utilities. It provides a comprehensive set of styled components with built-in dark mode, RTL support, and accessibility.

### Architecture

Mantine provides styled React components with a theme system, CSS modules support, and extensive hook library. It includes components for forms, navigation, data display, feedback, and layout.

### Key Features

- 100+ components
- 50+ hooks
- Built-in dark mode
- RTL support
- Accessibility compliance
- CSS modules styling
- Storybook integration
- Full TypeScript support
- 800K+ weekly npm downloads

### Why It Matters for Bhavya

Mantine demonstrates how to build a comprehensive component library with excellent developer experience and accessibility.

### Reusable Patterns

- Comprehensive component library architecture
- Theme system design
- Hook library patterns
- CSS modules integration

### Education Value

Can become lessons on: component library architecture, theme system design, and React hook patterns.

### Evidence

- Source: https://github.com/mantinedev/mantine
- Date: 2026-08-03
- Quality Score: 8/10

---

## Tremor

**URL:** https://github.com/tremorlabs/tremor
**Stars:** ~18,000
**Language:** TypeScript
**Category:** Dashboard Component Library
**License:** MIT

### What It Does

Tremor is a React component library specifically designed for building data dashboards and analytical applications. It provides chart components, data display widgets, and layout components optimized for data-heavy UIs.

### Architecture

Tremor is built on Tailwind CSS and provides chart components (using Recharts), data tables, KPI cards, and dashboard layouts. It's designed for rapid dashboard prototyping.

### Key Features

- 50+ dashboard components
- Chart components (bar, line, area, pie)
- Data tables with sorting/filtering
- KPI cards and metrics
- Dashboard layout components
- Tailwind CSS styling
- React-based
- ~200K weekly npm downloads

### Why It Matters for Bhavya

Tremor is directly relevant for building analytics dashboards and data visualization components for Bhavya's education platform.

### Reusable Patterns

- Dashboard-specific component architecture
- Chart component integration patterns
- Data table with sorting/filtering
- KPI card and metric display patterns

### Education Value

Can become labs on: dashboard design, data visualization, and chart component architecture.

### Evidence

- Source: https://github.com/tremorlabs/tremor
- Date: 2026-08-03
- Quality Score: 8/10

---

## Headless UI

**URL:** https://github.com/tailwindlabs/headlessui
**Stars:** ~25,000
**Language:** TypeScript
**Category:** Headless UI Primitives
**License:** MIT

### What It Does

Headless UI, built by the Tailwind Labs team, provides a focused set of unstyled accessible components designed specifically for Tailwind CSS. It covers essentials: menus, dialogs, listboxes, transitions, and tabs.

### Architecture

Headless UI provides unstyled React and Vue components with full WAI-ARIA compliance. It's designed to work seamlessly with Tailwind CSS and provides both React and Vue versions.

### Key Features

- React and Vue support
- 10 core components (Dialog, Menu, Listbox, Switch, etc.)
- Full WAI-ARIA compliance
- Tailwind CSS integration
- Transition support
- ~4KB per component
- ~1.5M+ weekly npm downloads

### Why It Matters for Bhavya

Headless UI is the simpler alternative to Radix, useful when you only need basic accessible components.

### Reusable Patterns

- Focused component set design
- React and Vue dual support
- Tailwind CSS-native integration
- Lightweight component architecture

### Education Value

Can become lessons on: accessible component basics, Tailwind CSS integration, and dual-framework component design.

### Evidence

- Source: https://github.com/tailwindlabs/headlessui
- Date: 2026-08-03
- Quality Score: 7/10

---

## Ant Design

**URL:** https://github.com/ant-design/ant-design
**Stars:** ~92,000
**Language:** TypeScript
**Category:** Enterprise Component Library
**License:** MIT

### What It Does

Ant Design is a comprehensive enterprise-level React component library with 60+ components, used by Alibaba and thousands of enterprises. It provides a complete design system with tokens, themes, and extensive component coverage.

### Architecture

Ant Design provides styled React components with a design token system, CSS-in-JS styling (via @ant-design/cssinjs), and extensive enterprise features. It includes components for data entry, data display, navigation, feedback, and layout.

### Key Features

- 60+ enterprise components
- Design token system
- Dark mode support
- Internationalization (30+ languages)
- Accessibility compliance
- Figma design kit
- ProComponents for advanced use cases
- 3M+ weekly npm downloads

### Why It Matters for Bhavya

Ant Design demonstrates enterprise-scale component library patterns, relevant for building comprehensive UI systems.

### Reusable Patterns

- Enterprise component library architecture
- Design token system
- Internationalization patterns
- Figma-to-code workflow

### Education Value

Can become lessons on: enterprise UI design, design token systems, and internationalization.

### Evidence

- Source: https://github.com/ant-design/ant-design
- Date: 2026-08-03
- Quality Score: 8/10

---

## NextUI (HeroUI)

**URL:** https://github.com/nextui-org/nextui
**Stars:** ~22,000
**Language:** TypeScript
**Category:** Styled React Component Library
**License:** MIT

### What It Does

NextUI (now HeroUI) is a React UI library built on Tailwind CSS and React Aria, designed for fast, accessible, and highly customizable modern web applications.

### Architecture

NextUI combines React Aria accessibility with Tailwind CSS styling, using Framer Motion for animations. It provides styled components with built-in accessibility and animation support.

### Key Features

- 50+ components
- React Aria accessibility
- Tailwind CSS styling
- Framer Motion animations
- Dark mode support
- TypeScript support
- ~400K weekly npm downloads

### Why It Matters for Bhavya

NextUI demonstrates how to combine accessibility primitives with modern styling and animation.

### Reusable Patterns

- React Aria + Tailwind CSS integration
- Animation component patterns
- Modern React component design
- Accessibility-first styling

### Education Value

Can become lessons on: accessible animation, Tailwind CSS component design, and React Aria integration.

### Evidence

- Source: https://github.com/nextui-org/nextui
- Date: 2026-08-03
- Quality Score: 7/10

---

## TanStack Table

**URL:** https://github.com/TanStack/table
**Stars:** ~26,000
**Language:** TypeScript
**Category:** Headless Data Table
**License:** MIT

### What It Does

TanStack Table is a headless UI library for building powerful tables and datagrids. It provides sorting, filtering, pagination, grouping, and column pinning without any UI opinions.

### Architecture

TanStack Table is a headless library that provides table state management and logic without any UI rendering. It works with React, Vue, Svelte, Solid, and vanilla JS, giving you complete control over the table's appearance.

### Key Features

- Headless table logic (no UI opinions)
- Sorting, filtering, pagination
- Column pinning and resizing
- Row selection and expansion
- Virtual scrolling for large datasets
- Framework-agnostic (React, Vue, Svelte, Solid)
- TypeScript-first design
- 26K+ GitHub stars

### Why It Matters for Bhavya

TanStack Table is essential for building data-heavy UIs like dashboards, admin panels, and data analysis tools.

### Reusable Patterns

- Headless data table architecture
- Framework-agnostic state management
- Virtual scrolling for performance
- Column configuration patterns

### Education Value

Can become lessons on: data table design, virtual scrolling, and headless UI architecture.

### Evidence

- Source: https://github.com/TanStack/table
- Date: 2026-08-03
- Quality Score: 9/10
