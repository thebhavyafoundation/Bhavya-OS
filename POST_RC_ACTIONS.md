# Post-RC Actions

## Trigger → Action

| Trigger | Action | Priority |
|---------|--------|----------|
| Staging issue | Fix in `release/v1.0` | High |
| UAT usability issue | Evaluate, then patch or defer | High |
| Security finding | Immediate patch | Critical |
| Runtime architectural issue | ADR required | High |
| Feature request | Backlog for v1.1 | Medium |
| Nice-to-have | Consider after v1.1 | Low |

## Release Gates

1. No new features on the release branch.
2. Every production fix references an issue or ADR.
3. Every architectural change requires an ADR.
4. Everything else goes to the next minor release.

## Release Cadence

| Type | Scope | Cadence |
|------|-------|---------|
| Patch (v1.0.x) | Bug fixes, security updates | As needed |
| Minor (v1.1, v1.2, …) | New capabilities, new applications | Quarterly |
| Major (v2.0) | Architectural changes only | When justified |

## Engineering Phase Status

- Architecture proven across 4 applications
- Release candidate quality reached
- Governance documented and integrated
- Remaining work: external validation (staging, UAT, ops rehearsal)

## What Drives v1.1

Not more code. These insights:

- How the platform performs in staging
- How people actually use it
- What operational realities emerge
