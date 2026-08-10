# Component Catalog

All components in `@bhavya/platform-ui` with usage guidelines.

## Layout

### AppLayout

Responsive application layout with sidebar offset and mobile hamburger menu.

```tsx
import { AppLayout } from "@bhavya/platform-ui";

<AppLayout sidebar={<Sidebar />}>
  <div>Page content</div>
</AppLayout>;
```

**Props:**

- `sidebar: React.ReactNode` — Sidebar component
- `children: React.ReactNode` — Main content

## Primitives

### Button

Trigger actions and navigate.

```tsx
import { Button } from "@bhavya/platform-ui";

<Button variant="primary" size="md">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Back</Button>
<Button variant="danger">Delete</Button>
```

**Variants:** primary, secondary, ghost, danger
**Sizes:** sm (32px), md (40px), lg (48px)

### Card

Container for related content.

```tsx
import { Card } from "@bhavya/platform-ui";

<Card padding="md">Content</Card>
<Card padding="lg" hover onClick={handleClick}>Interactive</Card>
```

**Props:**

- `hover?: boolean` — Add hover state
- `padding?: "none" | "sm" | "md" | "lg"`

### Badge

Display status or labels.

```tsx
import { Badge } from "@bhavya/platform-ui";

<Badge variant="success">Active</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="info">New</Badge>
<Badge variant="purple">Custom</Badge>
```

**Variants:** default, success, warning, error, info, purple
**Sizes:** sm, md (default)

### Avatar

User avatar with image or initials.

```tsx
import { Avatar } from "@bhavya/platform-ui";

<Avatar name="John Doe" size="md" />
<Avatar src="/photo.jpg" name="John" size="lg" />
```

**Sizes:** sm (24px), md (32px), lg (40px)

## Navigation

### Breadcrumb

Show navigation hierarchy.

```tsx
import { Breadcrumb } from "@bhavya/platform-ui";

<Breadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Repositories", href: "/repositories" },
    { label: "my-repo" },
  ]}
/>;
```

### Tabs

Tab navigation with underline indicator.

```tsx
import { Tabs } from "@bhavya/platform-ui";

<Tabs
  tabs={[
    { id: "overview", label: "Overview", icon: <Layers size={14} /> },
    { id: "settings", label: "Settings" },
  ]}
  activeTab="overview"
  onChange={setActiveTab}
/>;
```

## Feedback

### EmptyState

Guide users when no content exists.

```tsx
import { EmptyState } from "@bhavya/platform-ui";

<EmptyState
  icon={<FolderGit2 size={24} />}
  title="No repositories yet"
  description="Add a repository to get started"
  action={{ label: "Add Repository", onClick: handleAdd }}
/>;
```

### Toast

Toast notification for feedback.

```tsx
import { Toast } from "@bhavya/platform-ui";

<Toast
  message="Changes saved"
  type="success"
  onClose={() => setVisible(false)}
/>;
```

**Types:** success, error, info, warning

### Modal

Dialog overlay.

```tsx
import { Modal } from "@bhavya/platform-ui";

<Modal open={isOpen} onClose={() => setOpen(false)}>
  <h2>Confirm action</h2>
  <p>Are you sure?</p>
</Modal>;
```

## Loading

### Skeleton

Loading placeholder matching content shape.

```tsx
import { Skeleton, CardSkeleton, ListSkeleton, TableSkeleton } from "@bhavya/platform-ui";

<Skeleton width="50%" height={16} />
<Skeleton width={48} height={48} rounded="full" />

<CardSkeleton />
<ListSkeleton count={3} />
<TableSkeleton rows={5} cols={4} />
```

### LoadingSpinner

Circular spinner for inline loading.

```tsx
import { LoadingSpinner } from "@bhavya/platform-ui";

<LoadingSpinner size="md" />;
```

## Data Display

### StatCard

Metric display with label and value.

```tsx
import { StatCard } from "@bhavya/platform-ui";

<StatCard label="Repositories" value={42} />
<StatCard label="Score" value={85} trend="up" />
```

### StatusBadge

Status indicator with color coding.

```tsx
import { StatusBadge } from "@bhavya/platform-ui";

<StatusBadge status="success" label="Healthy" />
<StatusBadge status="warning" label="Needs attention" />
```

### DataTable

Table with sorting and pagination.

```tsx
import { DataTable } from "@bhavya/platform-ui";

<DataTable
  columns={[
    { key: "name", label: "Name" },
    { key: "score", label: "Score" },
  ]}
  data={rows}
/>;
```

## Forms

### SearchBar

Search input with icon.

```tsx
import { SearchBar } from "@bhavya/platform-ui";

<SearchBar value={search} onChange={setSearch} placeholder="Search..." />;
```
