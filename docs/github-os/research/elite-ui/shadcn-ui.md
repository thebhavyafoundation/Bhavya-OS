# shadcn/ui — UI Knowledge Package

## Executive Summary

shadcn/ui is not a component library — it's a design system foundation. Unlike traditional UI libraries that ship as npm packages, shadcn/ui copies component source code directly into your project. Built on Radix UI primitives (unstyled, accessible) + Tailwind CSS (utility-first styling), it provides beautifully designed components that you own, customize, and extend. The system is open source, open code — you're not locked into a vendor's API.

shadcn/ui targets React/Next.js developers who want production-ready components without the overhead of a traditional component library. The components follow WAI-ARIA design patterns, include keyboard navigation, screen reader support, and focus management out of the box. The theming system uses CSS variables with OKLCH color format, supporting light/dark mode via class-based toggle.

The philosophy: **copy-paste components you own.** No black boxes, no vendor lock-in, no fighting with library internals. Every component is written in TypeScript, follows React best practices, and can be customized via className, variants (cva), or by editing the source directly.

## Layout System

### Grid System

shadcn/ui doesn't define its own grid — it uses Tailwind CSS utilities:

```html
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
```

### Spacing

Uses Tailwind's spacing scale:

- `p-1` = 4px, `p-2` = 8px, `p-3` = 12px, `p-4` = 16px
- `p-5` = 20px, `p-6` = 24px, `p-8` = 32px
- `gap-*` for grid/flex gaps

### Layout Components

- **Stack** — vertical spacing between elements
- **Grid** — responsive grid layouts
- **Container** — max-width centered content

## Command Palette

### Command Component

shadcn/ui provides a `Command` component (built on cmdk):

```tsx
<Command>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search Emoji</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

### Features

- Fuzzy search
- Keyboard navigation
- Grouped results
- Customizable items
- Accessible by default

### Dialog + Command Pattern

```tsx
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <Command>
      <CommandInput />
      <CommandList>
        <CommandGroup>
          <CommandItem />
        </CommandGroup>
      </CommandList>
    </Command>
  </DialogContent>
</Dialog>
```

## Keyboard Shortcuts

### Built-In Patterns

Every component includes keyboard navigation:

- **Command:** Arrow keys, Enter, Escape
- **Dialog:** Tab trapping, Escape to close
- **Select:** Arrow keys, type-ahead, Enter to select
- **Tabs:** Arrow keys to switch, Home/End for first/last
- **Accordion:** Enter/Space to toggle, arrow keys for navigation

### Custom Shortcuts

shadcn/ui doesn't define app-level shortcuts — it provides the building blocks:

- `Command` for command palettes
- `Dialog` for modals with focus trapping
- `Sheet` for side panels
- Keyboard event handling via React

## Dashboard Design

### Card Component

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>{/* Content */}</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Features

- Consistent padding and spacing
- Border radius via `--radius` token
- Hover states
- Dark mode support

### Stats/Dashboard Cards

```tsx
<Card>
  <CardHeader>
    <CardTitle>Total Revenue</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">$45,231.89</div>
    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
  </CardContent>
</Card>
```

## Search UX

### Command Component

The `Command` component IS the search UX:

- `CommandInput` — search input with icon
- `CommandList` — scrollable results
- `CommandGroup` — grouped results
- `CommandItem` — individual result
- `CommandEmpty` — empty state
- `CommandLoading` — loading state

### Customization

- Custom filter functions
- Async search support
- Grouped results
- Keyboard shortcuts per item

## Activity Feeds

### List Component

```tsx
<List>
  <ListItem>
    <Avatar>
      <AvatarImage src="user.jpg" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
    <div>
      <p className="font-medium">John Doe</p>
      <p className="text-sm text-muted-foreground">Commented on your PR</p>
    </div>
    <time className="text-xs text-muted-foreground">2h ago</time>
  </ListItem>
</List>
```

### Features

- Consistent spacing
- Avatar support
- Timestamps
- Action buttons
- Hover states

## Typography

### Font System

shadcn/ui uses CSS variables for fonts:

```css
:root {
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}
```

### Type Scale (via Tailwind)

```html
<h1 className="text-4xl font-bold tracking-tight">Title</h1>
<h2 className="text-2xl font-semibold tracking-tight">Subtitle</h2>
<p className="text-sm text-muted-foreground">Description</p>
<code className="text-sm font-mono">Code</code>
```

### Key Decisions

- System font stack with Inter as primary
- Monospace for code
- Weight hierarchy: bold (700), semibold (600), medium (500), normal (400)
- Tracking (letter-spacing) for headings

## Color System

### Architecture

CSS variables with OKLCH color format:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  --radius: 0.5rem;
}
```

### Dark Mode

```css
.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  /* ... */
}
```

### Semantic Colors

- `primary` — main action color
- `secondary` — secondary actions
- `muted` — subtle backgrounds, muted text
- `accent` — hover states, emphasis
- `destructive` — error/delete actions
- `border` — borders and dividers
- `ring` — focus rings

### Theming

Change CSS variables to change the entire theme:

```css
:root {
  --primary: 142 76% 36%; /* Green theme */
}
```

## Accessibility

### WAI-ARIA Compliance

Built on Radix UI primitives:

- **Keyboard navigation** — built into every component
- **Screen reader support** — ARIA labels and roles
- **Focus management** — focus trapping in dialogs
- **Reduced motion** — respects `prefers-reduced-motion`

### Component-Specific Patterns

#### Accordion

```html
<button aria-expanded="false" aria-controls="content-1">Trigger</button>
<div id="content-1" role="region">Content</div>
```

#### Dialog

- Focus trapped inside
- `Escape` to close
- Click outside to close
- ARIA `role="dialog"` and `aria-modal="true"`

#### Select

- Keyboard navigable
- Type-ahead search
- ARIA `role="listbox"` and `role="option"`

### Testing Checklist

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Screen reader announces all content correctly
- [ ] Form errors announced and associated
- [ ] Color contrast meets WCAG AA
- [ ] Semantic HTML used
- [ ] ARIA labels provided for icon-only buttons
- [ ] Modal/dialog focus trap works
- [ ] Dropdown/select keyboard navigable
- [ ] Live regions announce updates
- [ ] Respects reduced motion preference
- [ ] Works with browser zoom up to 200%

## Design Tokens

### CSS Variables

All tokens are CSS variables:

```css
:root {
  /* Colors */
  --background: ...;
  --foreground: ...;
  --primary: ...;

  /* Typography */
  --font-sans: ...;
  --font-mono: ...;

  /* Spacing (via Tailwind) */
  --radius: 0.5rem;

  /* Shadows (via Tailwind) */
}
```

### Tailwind Integration

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... etc
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
};
```

### Border Radius

```css
:root {
  --radius: 0.5rem; /* 8px */
}
```

- `rounded-lg` = `var(--radius)` = 8px
- `rounded-md` = `calc(var(--radius) - 2px)` = 6px
- `rounded-sm` = `calc(var(--radius) - 4px)` = 4px

## Component Patterns

### Buttons

```tsx
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

### Cards

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Dialogs

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Tables

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Item</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Forms

```tsx
<Form>
  <FormField>
    <FormLabel>Name</FormLabel>
    <FormControl>
      <Input />
    </FormControl>
    <FormDescription>Help text</FormDescription>
    <FormMessage>Error message</FormMessage>
  </FormField>
</Form>
```

## Animation & Motion

### Built-In

- **Dialog:** Scale + opacity entrance
- **Dropdown:** Scale + opacity
- **Toast:** Slide in from corner
- **Accordion:** Height transition
- **Hover:** Background color change

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Custom Animation

Tailwind utilities for custom animations:

```html
<div className="animate-in fade-in slide-in-from-top-2">Animated content</div>
```

## Dark Mode

### Implementation

Class-based toggle:

```tsx
// Next.js with next-themes
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

### CSS Variables

```css
:root {
  /* Light mode */
}
.dark {
  /* Dark mode */
}
```

### Switching

```tsx
const { theme, setTheme } = useTheme();
<Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
  Toggle
</Button>;
```

## Mobile Responsive

### Tailwind Breakpoints

```html
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"></div>
```

### Component Adaptation

- **Dialog:** Full-screen on mobile
- **Sheet:** Bottom sheet on mobile
- **Sidebar:** Collapsible on mobile
- **Table:** Horizontal scroll on mobile

### Touch Targets

All interactive elements have appropriate touch targets (≥ 44x44px).

## Navigation Patterns

### Sidebar

```tsx
<Sidebar>
  <SidebarHeader>Logo</SidebarHeader>
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenuItem>Item 1</SidebarMenuItem>
      <SidebarMenuItem>Item 2</SidebarMenuItem>
    </SidebarGroup>
  </SidebarContent>
</Sidebar>
```

### Breadcrumbs

```tsx
<Breadcrumb>
  <BreadcrumbItem>
    <BreadcrumbLink href="/">Home</BreadcrumbLink>
  </BreadcrumbItem>
  <BreadcrumbSeparator>/</BreadcrumbSeparator>
  <BreadcrumbItem>
    <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
  </BreadcrumbItem>
</Breadcrumb>
```

### Tabs

```tsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account content</TabsContent>
  <TabsContent value="password">Password content</TabsContent>
</Tabs>
```

## Form Patterns

### Input Design

```tsx
<Input type="email" placeholder="Email" />
<Input type="password" />
<Input type="number" />
<Textarea />
```

### Validation

```tsx
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormDescription>Your email address.</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Multi-Step

```tsx
<Stepper>
  <Step>Step 1</Step>
  <Step>Step 2</Step>
  <Step>Step 3</Step>
</Stepper>
```

## Data Display

### Tables

- Sortable columns
- Row selection
- Pagination
- Responsive horizontal scroll

### Lists

- Dense rows
- Inline actions
- Avatar support
- Status badges

### Charts

```tsx
// Via Recharts integration
<ChartContainer>
  <BarChart data={data}>
    <Bar dataKey="value" />
  </BarChart>
</ChartContainer>
```

### Empty States

```tsx
<Empty>
  <EmptyIcon />
  <EmptyTitle>No results</EmptyTitle>
  <EmptyDescription>Try a different search term.</EmptyDescription>
</Empty>
```

## Error Handling

### Toast Notifications

```tsx
const { toast } = useToast();

toast({
  title: "Error",
  description: "Something went wrong.",
  variant: "destructive",
});
```

### Form Errors

```tsx
<FormMessage /> {/* Displays validation errors */}
```

### Error Boundaries

```tsx
<ErrorBoundary fallback={<ErrorFallback />}>{children}</ErrorBoundary>
```

## Loading States

### Skeleton

```tsx
<Skeleton className="h-4 w-[250px]" />
<Skeleton className="h-4 w-[200px]" />
```

### Spinner

```tsx
<Loader2 className="h-4 w-4 animate-spin" />
```

### Progress

```tsx
<Progress value={33} />
```

### Suspense

```tsx
<Suspense fallback={<Skeleton />}>
  <AsyncComponent />
</Suspense>
```

## Reusable Ideas

1. **Copy-paste ownership** — components are yours to modify, no vendor lock-in
2. **Radix UI primitives** — accessible by default, unstyled for maximum flexibility
3. **CSS variable theming** — change variables, change everything
4. **OKLCH color format** — perceptually uniform colors
5. **cva variants** — type-safe component variants
6. **Class-based dark mode** — simple toggle, no runtime overhead
7. **Tailwind integration** — utility-first styling with design tokens
8. **WAI-ARIA patterns** — keyboard navigation, screen readers, focus management

## Evidence

- **Source:** https://ui.shadcn.com/
- **Date collected:** 2026-08-03
- **Why it matters:** shadcn/ui redefined how developers think about component libraries — copy-paste ownership over npm dependencies.
- **Trade-offs:** Pros: Full ownership, accessible by default, beautiful design, massive community. Cons: Requires manual updates (no npm package), Tailwind learning curve, React-only.
- **Expected value:** Component patterns, CSS variable theming, and accessibility patterns directly transfer to GitHub OS.
- **Maintenance burden:** Low — you own the code, update when you want, no breaking changes from upstream.
- **Hardware impact:** Very low — no runtime library, CSS-only styling, minimal JS.
