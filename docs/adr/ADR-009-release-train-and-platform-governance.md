# ADR-009: Release Train & Platform Governance Policy

**Status:** Accepted | **Date:** 2026-07-24 | **Deciders:** Founder & Governance Agent
**Source:** Migrated from governance ADR-0003 (2026-09-17)

## Context

The Bhavya Platform has reached v1.0.0-rc1 with three applications (website, docs, design-system) sharing a common runtime, SDK, and infrastructure. Feature-driven development served the initial build phase, but as the platform approaches production deployment, a disciplined release process is needed to ensure stability, operational readiness, and organizational alignment.

The platform needs:

1. A predictable release cadence that organizations can plan around
2. Clear boundaries between stable releases and experimental work
3. Governance processes that scale as more applications are added
4. External validation (staging, UAT, operational rehearsals) before production

## Decision

We adopt a **release train** model with the following policies:

### Release Train

| Release | Focus                         | Dependencies                                   |
| ------- | ----------------------------- | ---------------------------------------------- |
| v1.0.0  | Public production launch      | Staging deployment, UAT, operational rehearsal |
| v1.1.0  | Admin Platform (APP-003)      | v1.0.0 stable                                  |
| v1.2.0  | Volunteer Platform            | v1.1.0 stable                                  |
| v1.3.0  | Programs Platform             | v1.2.0 stable                                  |
| v1.4.0  | Heritage Platform             | v1.3.0 stable                                  |
| v1.5.0  | Nature Platform               | v1.4.0 stable                                  |
| v2.0.0  | Multi-organization federation | Justified by Foundation needs                  |

### Branching Strategy

- **`main` branch**: Always releasable. Only stabilization work after RC.
- **Release branches**: `release/v1.0`, `release/v1.1`, etc. Created at RC, only bugfixes allowed.
- **Feature branches**: Merged to `main` during development, frozen at RC cut.
- **Hotfix branches**: `hotfix/v1.0.1` for urgent production fixes.

### Semantic Versioning

- **MAJOR** (X.0.0): Breaking changes to runtime, SDK, or API contracts
- **MINOR** (1.X.0): New applications, features, or capabilities
- **PATCH** (1.0.X): Bugfixes, security patches, documentation updates

### Pre-Release Stages

Every release must pass these gates before tagging:

1. **RC (Release Candidate)**: Feature-complete, all tests pass
2. **Staging Deployment**: Deployed on production-matching infrastructure
3. **External Validation**: HTTPS, DNS, TLS, backups, rollback, monitoring verified
4. **UAT**: Small group of trustees/contributors test real workflows
5. **Operational Rehearsal**: Backup restore, rollback, secret rotation, crash recovery
6. **GA (General Availability)**: Tagged and deployed to production

### Branch Protection Rules

- `main` requires PR review before merge
- `main` requires CI to pass (build, lint, typecheck, runtime validation)
- Release branches require backport approval
- Tags require signed commits (when GPG keys are configured)

## Alternatives Considered

- **Continuous deployment**: Rejected because institutional software requires deliberate release cycles with stakeholder sign-off.
- **Calendar-based releases**: Rejected because not all applications have the same development velocity. Release train is dependency-driven.
- **No branching strategy**: Rejected because hotfixes and stabilization need isolation from feature development.

## Consequences

**Benefits:**

- Predictable release cadence for organizational planning
- Clear stability guarantees for each release
- Operational validation before production exposure
- Scalable as more applications are added

**Trade-offs:**

- Adds process overhead for each release
- Requires maintaining release branches

**Future Implications:**

- All new applications follow the same release train
- ADRs required for any change to the governance policy itself
- Quarterly dependency updates and security reviews scheduled
