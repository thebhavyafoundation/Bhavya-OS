# Access Policy

## Purpose
Defines who can access what in Bhavya OS.

## Roles

### Founder
- Full repository access
- Production deployment
- Security policy changes
- Financial operations

### CEO
- Repository write access
- Staging deployment
- Team management
- Strategic decisions

### CTO
- Repository write access
- Technical decisions
- Architecture changes
- Security reviews

### Developer
- Repository write access
- Feature development
- Bug fixes
- Code reviews

### Reviewer
- Repository write access
- Code review approval
- Quality assurance

### External
- Repository read access
- Issue creation
- PR submissions

## Permissions Matrix

| Resource | Founder | CEO | CTO | Developer | Reviewer | External |
|----------|---------|-----|-----|-----------|----------|----------|
| Main branch | ✓ | ✓ | ✓ | PR only | PR only | Read |
| Develop branch | ✓ | ✓ | ✓ | ✓ | ✓ | Read |
| Production secrets | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Staging secrets | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Team management | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Financial ops | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |

## Access Reviews
- Weekly: Active contributors
- Monthly: All access rights
- Quarterly: Security audit
