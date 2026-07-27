# Security: Permissions

## Access Control Matrix

### Repository Permissions

| Role      | Read | Write | Admin | Deploy |
| --------- | ---- | ----- | ----- | ------ |
| Founder   | ✓    | ✓     | ✓     | ✓      |
| CEO       | ✓    | ✓     | ✗     | ✓      |
| CTO       | ✓    | ✓     | ✗     | ✓      |
| Developer | ✓    | ✓     | ✗     | ✗      |
| Reviewer  | ✓    | ✓     | ✗     | ✗      |
| External  | ✓    | ✗     | ✗     | ✗      |

### Environment Secrets

| Environment | Access         |
| ----------- | -------------- |
| Development | Developer, CTO |
| Staging     | CTO, CEO       |
| Production  | Founder, CEO   |

### Branch Protection

- `main`: Requires PR review, no direct push
- `develop`: Requires PR review
- Feature branches: Developer access
