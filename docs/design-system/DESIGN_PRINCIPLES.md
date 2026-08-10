# Design Principles

Research-backed design principles extracted from Linear, Vercel, GitHub, Raycast, Notion, and shadcn/ui.

## 1. Dark Mode First

- Dark background (`#0a0a0a`) reduces eye strain and makes content pop
- Use semantic color tokens (`text-primary`, `bg-secondary`) — never hardcoded hex
- All components must work in dark mode by default

## 2. Border-Based Elevation

- Use subtle borders (`1px solid var(--border-primary)`) instead of box-shadows
- Reserve shadows for overlays (modals, dropdowns, toasts)
- Creates a cleaner, more modern look (Linear pattern)

## 3. Consistent Spacing

- 4px base unit for all spacing
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48px
- Use Tailwind spacing tokens (`p-4`, `gap-3`, `mb-6`)

## 4. Typography Hierarchy

- Inter font family with tight letter-spacing for headings (`-0.02em`)
- Maximum 2 font families (sans + mono)
- Clear size hierarchy: xs (12), sm (14), base (16), lg (18), xl (20), 2xl (24), 3xl (30)

## 5. Purposeful Motion

- 150ms ease-out for most transitions
- Respect `prefers-reduced-motion`
- Animate only when it adds value (page transitions, hover states, loading)
- Never animate for decoration

## 6. Keyboard-First

- All interactive elements must be keyboard accessible
- Command palette (⌘K) for power users
- Visible focus indicators on all focusable elements

## 7. Semantic Color Tokens

- Use tokens, not raw colors: `text-text-primary` not `text-white`
- Status colors: success (green), warning (yellow), error (red), info (blue)
- Accent colors: blue, purple, cyan for interactive elements

## 8. Responsive by Default

- Mobile-first approach
- Sidebar collapses to hamburger on mobile
- Grid layouts adapt: 3-col → 2-col → 1-col
- Test at 375px, 768px, 1024px, 1440px

## 9. Accessible Empty States

- Always provide icon + title + description + action
- Guide users to next steps
- Never show blank screens

## 10. Loading States

- Skeleton screens that match content shape
- Subtle shimmer animation
- Reduce perceived wait time
