# M17: Security Review

**Status:** ✅ Complete
**Date:** 2026-08-08

---

## Summary

Security is hardened for beta. All critical and high-severity issues from Wave 13 are resolved.

## Security Measures

### Authentication

| Measure             | Status | Implementation                  |
| ------------------- | ------ | ------------------------------- |
| Password hashing    | ✅     | bcryptjs (cost factor 12)       |
| Session tokens      | ✅     | HTTP-only cookies, 7-day expiry |
| Session storage     | ✅     | Server-side (SQLite)            |
| Password validation | ✅     | Minimum 8 characters            |
| Email validation    | ✅     | Regex format check              |

### CSRF Protection

| Measure           | Status | Implementation                              |
| ----------------- | ------ | ------------------------------------------- |
| Origin validation | ✅     | Middleware checks POST/PUT/PATCH/DELETE     |
| Allowed origins   | ✅     | localhost:3020, localhost:3030, Vercel URLs |
| Referer fallback  | ✅     | Validates referer when origin absent        |

### Security Headers

| Header                    | Value                                    | Status |
| ------------------------- | ---------------------------------------- | ------ |
| X-Content-Type-Options    | nosniff                                  | ✅     |
| X-Frame-Options           | DENY                                     | ✅     |
| X-XSS-Protection          | 1; mode=block                            | ✅     |
| Referrer-Policy           | strict-origin-when-cross-origin          | ✅     |
| Permissions-Policy        | camera=(), microphone=(), geolocation=() | ✅     |
| Strict-Transport-Security | max-age=63072000 (production only)       | ✅     |
| Content-Security-Policy   | Strict allowlist                         | ✅     |

### Rate Limiting

| Endpoint | Limit           | Status |
| -------- | --------------- | ------ |
| Register | 3/hour per IP   | ✅     |
| Login    | 5/15min per IP  | ✅     |
| API      | 60/min per user | ✅     |
| Progress | 30/min per user | ✅     |

### Input Validation

| Measure                | Status | Implementation                           |
| ---------------------- | ------ | ---------------------------------------- |
| Server-side validation | ✅     | All API routes validate inputs           |
| Field allowlisting     | ✅     | Student PUT only accepts name, interests |
| SQL injection          | ✅     | Parameterized queries via better-sqlite3 |
| XSS                    | ✅     | React auto-escapes, CSP header           |

### Data Security

| Measure               | Status | Notes                                   |
| --------------------- | ------ | --------------------------------------- |
| Secrets in .gitignore | ✅     | `.env*` excluded                        |
| No hardcoded secrets  | ✅     | Verified in Wave 13                     |
| PII handling          | ✅     | Passwords never logged (logger redacts) |

## Remaining Items (Post-Beta)

1. CSRF token validation (currently origin-based)
2. Session token hashing before storage
3. Email verification on registration
4. Password change endpoint
5. OAuth implementation

## Recommendation

Security is production-ready for beta with real learners.
