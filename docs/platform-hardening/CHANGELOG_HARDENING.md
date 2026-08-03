# Platform Hardening Changelog

## 2026-08-03 — Platform Hardening v1.0

### Security

- **BREAKING**: All API routes now require authentication via `requireAuth()`
- Added API key authentication to Runtime API (X-API-Key / Bearer token)
- Restricted CORS from `*` to configurable origins (default: localhost:3020, localhost:3030)
- Added ID validation to prevent path traversal in Runtime API
- Set NEXTAUTH_SECRET from environment variable
- Increased bcrypt rounds from 10 to 12
- Enforced password complexity (min 8 chars, email format validation)
- Added file upload validation (10MB size limit, extension whitelist, filename sanitization)
- Added security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- Sanitized error messages to prevent information leakage

### Database

- Added 9 indexes on foreign key columns for query performance
- Wrapped `deleteKO` in a transaction for atomicity
- Wrapped pipeline execution setup in a transaction
- Fixed `savePipelineResult` FK violation (was hardcoded 'system'/'unknown')
- Removed duplicate `listArtifacts` function

### Architecture

- Fixed BEE relative import to use `@bhavya/runtime/registry`
- Added `test` task to turbo.json
- Created CI pipeline (GitHub Actions)

### API

- Created standardized error response format (`api-utils.ts`)
- Created rate limiting utility with sliding window
- Added rate limiting to auth endpoints (5 requests/15 minutes)
- Added rate limiting to file uploads (10 requests/minute)

### Testing

- Added vitest to knowledge-studio
- Created rate-limit tests
- Created api-utils tests
- Created CI pipeline (lint → typecheck → test → build)
