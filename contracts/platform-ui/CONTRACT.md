# @bhavya/platform-ui — Contract v1.0.0

**Frozen:** 2026-08-07 | **Author:** Wave 4 Consolidation | **Status:** ACTIVE

## Design Principles

1. **Light/Dark Theme:** Built-in theme switching via CSS variables
2. **Accessibility:** WCAG 2.1 AA compliance
3. **Responsive:** Mobile-first design
4. **Consistent:** All components follow design tokens

## Exports

### Component Categories
- **Layout:** Container, Grid, Stack, Spacer
- **Navigation:** Navbar, Sidebar, Breadcrumb, Tabs, Pagination
- **Forms:** Input, Select, Checkbox, Radio, Switch, Textarea, Form
- **Buttons:** Button, IconButton, ButtonGroup
- **Data Display:** Card, Table, List, Badge, Avatar, Tooltip
- **Feedback:** Alert, Toast, Modal, Drawer, Progress, Spinner
- **Typography:** Text, Heading, Link, Code

### Theme System
- `ThemeProvider` — Wraps app with theme context
- `useTheme()` — Hook to access/switch themes
- Light theme: Default
- Dark theme: `data-theme="dark"` attribute

### Design Tokens
- Colors: Primary, Secondary, Neutral, Success, Warning, Error, Info
- Spacing: 4px base unit (0.25rem increments)
- Typography: Inter font family, 400/500/600/700 weights
- Border radius: sm (4px), md (8px), lg (12px), xl (16px)

---

## Breaking Change Policy

1. **Major version bump** for removing/renaming exports
2. **Deprecation period:** 3 releases before removal
3. **Theme changes:** Must maintain backward compatibility
