# Compatibility Promise

**Version:** 1.0
**Status:** Active
**Last Updated:** 2026-07-28

---

## Guarantee

These APIs are **guaranteed stable**. Breaking changes require a major version bump.

| API | Version | Status |
|-----|---------|--------|
| Kernel API | v1 | **Guaranteed Stable** |
| BRP v1 | v1 | **Guaranteed Stable** |
| Memory API | v1 | **Guaranteed Stable** |
| Events API | v1 | **Guaranteed Stable** |
| Planner API | v1 | **Guaranteed Stable** |
| Registry API | v1 | **Guaranteed Stable** |
| Coordinator API | v1 | **Guaranteed Stable** |
| Replay API | v1 | **Guaranteed Stable** |
| Auth API | v1 | **Guaranteed Stable** |
| Monitoring API | v1 | **Guaranteed Stable** |

## What "Guaranteed Stable" Means

1. **No breaking changes** within the same major version
2. **Deprecation notice** at least one minor version before removal
3. **New capabilities** added as new methods, not by modifying existing ones
4. **Implementation changes** happen behind the interface
5. **Bug fixes** are backported to the current LTS release

## Breaking Changes

Breaking changes include:
- Removing a method or property
- Renaming a method or property
- Changing a method signature
- Changing a type definition
- Changing behavior in a way that breaks existing code

Breaking changes require:
- Major version bump (v1 to v2)
- Migration guide
- Deprecation period (minimum one minor version)

## Versioning

```
MAJOR.MINOR.PATCH
|       |     |
|       |     -- Bug fixes, security patches
|       -------- New features, backward compatible
|                Breaking changes
```

## What Can Change Without Breaking

- New kernel modules
- New engine packages
- New institution services
- New CLI commands
- Configuration options
- Performance optimizations
- Documentation

## What Cannot Change Without Breaking

- Function signatures of stable APIs
- Type definitions of stable interfaces
- BRP protocol flow
- Memory entry structure
- Event model
- Package namespace convention

---

**If you depend on these APIs, you are safe within the same major version.**
