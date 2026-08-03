# GitHub OS — Permission Model

## Role Hierarchy

```
Owner > Admin > Engineer > Instructor > Student > Volunteer > Viewer
```

## Roles and Permissions

### Owner

**Scope:** Organization-wide
**Permissions:**

- Full access to all repositories, teams, members
- Manage organization settings
- Manage billing and subscriptions
- Delete organization
- Transfer ownership
- Manage all roles

### Admin

**Scope:** Organization-wide
**Permissions:**

- Manage teams and members
- Manage repository settings
- Manage integrations (MCP, webhooks)
- Manage workflows
- View audit logs
- Manage security settings

### Engineer

**Scope:** Assigned repositories
**Permissions:**

- Create and manage issues
- Create and manage pull requests
- Review and merge code
- Manage workflows (create, edit, run)
- Install and configure MCP servers
- Create and manage ADRs
- View analytics

### Instructor

**Scope:** Learning-related features
**Permissions:**

- Manage learning paths
- Create and curate learning resources
- View student progress
- Assess contributions
- Create curriculum content
- View analytics

### Student

**Scope:** Learning and contribution
**Permissions:**

- View learning paths and resources
- Create issues
- Create pull requests
- Participate in discussions
- View own analytics

### Volunteer

**Scope:** Contribution only
**Permissions:**

- View repositories
- Create issues
- Create pull requests
- View learning resources
- Participate in discussions

### Viewer

**Scope:** Read-only
**Permissions:**

- View repositories
- View issues and PRs
- View knowledge base
- View analytics (public)

## Repository-Level Permissions

### Read

- View repository content
- View issues and PRs
- View knowledge packages
- View analytics

### Write

- Create and edit issues
- Create and edit pull requests
- Review pull requests
- Create and edit ADRs
- Create and edit workflows
- Install MCP servers

### Admin

- All Write permissions
- Manage repository settings
- Manage branch protection
- Manage collaborators
- Delete repository

## Permission Matrix

| Action            | Owner | Admin | Engineer | Instructor | Student | Volunteer | Viewer |
| ----------------- | ----- | ----- | -------- | ---------- | ------- | --------- | ------ |
| **Repositories**  |
| View              | ✓     | ✓     | ✓        | ✓          | ✓       | ✓         | ✓      |
| Create            | ✓     | ✓     | ✓        | —          | —       | —         | —      |
| Delete            | ✓     | ✓     | —        | —          | —       | —         | —      |
| Settings          | ✓     | ✓     | —        | —          | —       | —         | —      |
| **Issues**        |
| View              | ✓     | ✓     | ✓        | ✓          | ✓       | ✓         | ✓      |
| Create            | ✓     | ✓     | ✓        | ✓          | ✓       | ✓         | —      |
| Edit              | ✓     | ✓     | ✓        | —          | Own     | Own       | —      |
| Close             | ✓     | ✓     | ✓        | —          | —       | —         | —      |
| **Pull Requests** |
| View              | ✓     | ✓     | ✓        | ✓          | ✓       | ✓         | ✓      |
| Create            | ✓     | ✓     | ✓        | —          | ✓       | ✓         | —      |
| Review            | ✓     | ✓     | ✓        | —          | —       | —         | —      |
| Merge             | ✓     | ✓     | ✓        | —          | —       | —         | —      |
| **Knowledge**     |
| View              | ✓     | ✓     | ✓        | ✓          | ✓       | ✓         | ✓      |
| Create            | ✓     | ✓     | ✓        | ✓          | —       | —         | —      |
| Edit              | ✓     | ✓     | ✓        | —          | —       | —         | —      |
| Delete            | ✓     | ✓     | —        | —          | —       | —         | —      |
| **Workflows**     |
| View              | ✓     | ✓     | ✓        | ✓          | ✓       | ✓         | ✓      |
| Create            | ✓     | ✓     | ✓        | —          | —       | —         | —      |
| Edit              | ✓     | ✓     | ✓        | —          | —       | —         | —      |
| Run               | ✓     | ✓     | ✓        | —          | —       | —         | —      |
| Delete            | ✓     | ✓     | —        | —          | —       | —         | —      |
| **MCP Servers**   |
| View              | ✓     | ✓     | ✓        | ✓          | ✓       | ✓         | ✓      |
| Install           | ✓     | ✓     | ✓        | —          | —       | —         | —      |
| Configure         | ✓     | ✓     | ✓        | —          | —       | —         | —      |
| Uninstall         | ✓     | ✓     | —        | —          | —       | —         | —      |
| **Learning**      |
| View Paths        | ✓     | ✓     | ✓        | ✓          | ✓       | ✓         | ✓      |
| Create Paths      | ✓     | ✓     | ✓        | ✓          | —       | —         | —      |
| View Progress     | ✓     | ✓     | ✓        | ✓          | Own     | Own       | —      |
| Assess            | ✓     | ✓     | ✓        | ✓          | —       | —         | —      |
| **Analytics**     |
| View Own          | ✓     | ✓     | ✓        | ✓          | ✓       | ✓         | ✓      |
| View Team         | ✓     | ✓     | ✓        | ✓          | —       | —         | —      |
| View All          | ✓     | ✓     | ✓        | —          | —       | —         | —      |
| Export            | ✓     | ✓     | ✓        | —          | —       | —         | —      |
| **Settings**      |
| Organization      | ✓     | —     | —        | —          | —       | —         | —      |
| Teams             | ✓     | ✓     | —        | —          | —       | —         | —      |
| Members           | ✓     | ✓     | —        | —          | —       | —         | —      |
| Security          | ✓     | ✓     | —        | —          | —       | —         | —      |
| Integrations      | ✓     | ✓     | —        | —          | —       | —         | —      |
| Notifications     | ✓     | ✓     | ✓        | ✓          | ✓       | ✓         | ✓      |

## Team-Based Permissions

Teams provide repository access:

```typescript
interface TeamPermission {
  teamId: string;
  repositoryId: string;
  permission: "read" | "write" | "admin";
}
```

### Permission Inheritance

1. **Organization Role** — Base permissions for all repos
2. **Team Membership** — Additional permissions for assigned repos
3. **Repository Collaborators** — Direct repository permissions

### Effective Permission

```typescript
function getEffectivePermission(
  userId: string,
  repositoryId: string,
): Permission {
  const orgRole = getOrgRole(userId);
  const teamPermission = getTeamPermission(userId, repositoryId);
  const repoPermission = getRepoPermission(userId, repositoryId);

  return highest(orgRole, teamPermission, repoPermission);
}
```

## Branch Protection

### Rules

```typescript
interface BranchProtection {
  requirePullRequest: boolean;
  requiredReviews: number;
  requireStatusChecks: boolean;
  requiredStatusChecks: string[];
  requireUpToDate: boolean;
  restrictPushes: boolean;
  allowedPushers: string[];
  requireSignedCommits: boolean;
  requireLinearHistory: boolean;
  allowForcePushes: boolean;
  allowDeletions: boolean;
}
```

### Permission Checks

Before merge:

1. Check branch protection rules
2. Verify reviewer permissions
3. Verify status check permissions
4. Verify push permissions

## API Access

### API Keys

```typescript
interface ApiKey {
  id: string;
  userId: string;
  name: string;
  permissions: ApiPermission[];
  expiresAt: Date;
  lastUsedAt: Date;
}

type ApiPermission =
  | "repos:read"
  | "repos:write"
  | "issues:read"
  | "issues:write"
  | "prs:read"
  | "prs:write"
  | "knowledge:read"
  | "knowledge:write"
  | "workflows:read"
  | "workflows:write"
  | "analytics:read";
```

### Scope-Based Access

```typescript
// API key with limited scope
const apiKey = createApiKey({
  name: "CI Pipeline",
  permissions: ["repos:read", "prs:write", "workflows:run"],
  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
});
```

## Audit Logging

### Logged Actions

| Action                | Details                      |
| --------------------- | ---------------------------- |
| User Management       | Invite, remove, role change  |
| Repository Access     | Clone, push, settings change |
| Permission Changes    | Role updates, team changes   |
| Security Events       | Login, logout, API key usage |
| Data Access           | View, export, delete         |
| Configuration Changes | Settings, workflows, MCPs    |

### Audit Log Schema

```typescript
interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
}
```

### Retention

| Log Type      | Retention |
| ------------- | --------- |
| Security logs | 7 years   |
| Access logs   | 1 year    |
| Activity logs | 90 days   |
| Debug logs    | 30 days   |

## Compliance

### SOC 2 Compliance

- Role-based access control
- Audit logging
- Access reviews
- Incident response

### GDPR Compliance

- Data minimization
- Right to access
- Right to erasure
- Data portability

### Security Best Practices

- Principle of least privilege
- Separation of duties
- Regular access reviews
- Automated permission enforcement
