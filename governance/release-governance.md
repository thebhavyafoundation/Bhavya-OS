# Release Governance

## Overview

The Bhavya Platform follows a release train model defined in `ADR-009`. This document provides operational details for executing releases.

## Release Lifecycle

```
Development → RC Cut → Staging → UAT → Ops Rehearsal → GA
     ↑                                              |
     └──────────── Hotfix (if needed) ──────────────┘
```

### 1. Development Phase

- Features merged to `main` via PR
- CI must pass (build, lint, typecheck, runtime validation)
- No direct commits to `main`

### 2. RC Cut

- Version bumped in `package.json` files
- Changelog updated
- `vX.Y.Z-rc1` tag created
- Release branch `release/vX.Y` created

### 3. Staging Deployment

- Full stack deployed on staging infrastructure
- Verified: HTTPS, HTTP/2, DNS, TLS, health checks
- Backups and rollback tested
- Resource usage documented

### 4. User Acceptance Testing

- Small group (trustees, contributors) tests real workflows
- Feedback collected and critical issues addressed
- New RC if fixes needed

### 5. Operational Rehearsal

- Backup restore exercised
- Deployment rollback tested
- Secret rotation simulated
- Service crash recovery verified
- Server reboot recovery verified

### 6. General Availability

- `vX.Y.Z` tag created (drops -rc suffix)
- Deployed to production
- Monitoring confirms health
- Announcement sent

## Version Numbering

Following Semantic Versioning (semver):

- **MAJOR**: Breaking changes to runtime, SDK, or API contracts
- **MINOR**: New applications, features, or capabilities
- **PATCH**: Bugfixes, security patches, documentation updates

## Branch Naming

| Branch          | Purpose                       |
| --------------- | ----------------------------- |
| `main`          | Always releasable development |
| `release/vX.Y`  | Stabilization for release     |
| `hotfix/vX.Y.Z` | Urgent production fix         |

## Tag Naming

| Tag          | Meaning              |
| ------------ | -------------------- |
| `v1.0.0-rc1` | Release candidate    |
| `v1.0.0`     | General availability |

## Dependency Updates

- **Quarterly**: Review and update all dependencies
- **Security patches**: Applied immediately to `main` and backported to active release branches
- **Major updates**: Require ADR if they affect runtime or SDK contracts

## Security Reviews

- **Quarterly**: Automated dependency audit (npm audit, Snyk)
- **Before each major release**: Manual security review
- **Continuous**: CSP, HSTS, and header validation in CI

## Hotfix Process

1. Create `hotfix/vX.Y.Z` branch from release tag
2. Apply minimal fix
3. Test on staging
4. Merge to `main` and `release/vX.Y`
5. Tag `vX.Y.Z`
6. Deploy to production
