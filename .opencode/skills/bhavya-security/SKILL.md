---
name: bhavya-security
description: Verify security practices in Bhavya code. Use when adding authentication, handling user input, creating API endpoints, or implementing sensitive features.
compatibility: opencode
---

# Bhavya Security Skill

## Purpose

Ensure security best practices are followed across the Bhavya codebase.

## Security Checklist

### Authentication
- [ ] Uses `@bhavya/auth` package (not custom auth)
- [ ] Passwords hashed with bcrypt (12+ rounds)
- [ ] Session tokens are random and sufficiently long
- [ ] Sessions expire appropriately
- [ ] Password change invalidates existing sessions
- [ ] Login has rate limiting
- [ ] Registration has rate limiting

### Authorization
- [ ] Protected routes enforce auth via middleware
- [ ] API endpoints check user permissions
- [ ] Role-based access control (RBAC) is enforced on `/os/*` routes
- [ ] Users can only access their own data
- [ ] Admin operations require admin role

### Input Validation
- [ ] All user input is validated on the server
- [ ] SQL queries use parameterized statements
- [ ] File uploads are validated (type, size)
- [ ] Email addresses are validated
- [ ] URLs are validated before fetching

### Secret Handling
- [ ] No secrets in client-side code
- [ ] No secrets in git history
- [ ] Environment variables used for configuration
- [ `.env` files are in `.gitignore`
- [ ] API keys are not logged

### Server/Client Boundaries
- [ ] Sensitive logic runs on the server
- [ ] Client code does not access database directly
- [ ] API routes handle data mutations
- [ ] Server components do not expose internal state

### Web Security
- [ ] CSRF protection on mutating requests
- [ ] XSS prevention (escaped output, CSP headers)
- [ ] SQL injection prevention (parameterized queries)
- [ ] Security headers set (CSP, HSTS, X-Frame-Options)
- [ ] Unsafe file handling avoided

### Logging & Audit
- [ ] Auth events are logged (login, logout, password change)
- [ ] Errors are logged without sensitive data
- [ ] Audit trail exists for important actions
- [ ] Logs do not contain passwords or tokens

### Rate Limiting
- [ ] Login endpoint has rate limiting
- [ ] Registration endpoint has rate limiting
- [ ] API endpoints have appropriate rate limits
- [ ] Expensive operations are throttled

## Common Vulnerabilities to Check

1. **SQL Injection** — Are all queries parameterized?
2. **XSS** — Is user input escaped before display?
3. **CSRF** — Do mutating requests include CSRF protection?
4. **Auth Bypass** — Can unauthenticated users access protected routes?
5. **Privilege Escalation** — Can regular users access admin functions?
6. **Data Exposure** — Are internal errors logged without sensitive data?
7. **Session Fixation** — Are sessions regenerated on login?
8. **Open Redirect** — Are redirect URLs validated?
