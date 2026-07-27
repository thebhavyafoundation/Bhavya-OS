# Security: Dependency Audit

## Schedule

- Weekly automated scans
- Monthly manual review
- Quarterly deep audit

## Tools

- `npm audit`
- Snyk
- Dependabot
- Socket.dev

## Process

### Automated Scan

```bash
pnpm audit
```

### Manual Review

1. Review new dependencies
2. Check package reputation
3. Verify maintenance status
4. Assess security history

### Remediation

1. Critical: Fix within 24 hours
2. High: Fix within 1 week
3. Medium: Fix within 1 month
4. Low: Fix within 3 months

## Blocked Packages

- Packages with known vulnerabilities
- Abandoned packages
- Packages with suspicious behavior
