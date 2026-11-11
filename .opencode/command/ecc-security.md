---
description: Run comprehensive security review
agent: ecc-security-reviewer
subtask: true
---

> ## Bhavya authority — read first
>
> This is a **vendored third-party asset** from ECC v2.2.3 (`github.com/affaan-m/ECC`, MIT).
> See `.opencode/ecc/PROVENANCE.md` for the exact upstream path and the exclusion record.
>
> It is **subordinate helper content only** — a method suggestion, never policy. The
> repository root `AGENTS.md` is the constitution of this repository and is the highest
> project authority (`docs/constitution/00` → `01`–`09` → `AGENTS.md`). Full precedence
> model: `.opencode/instructions/BHAVYA-PRECEDENCE.md`.
>
> **On any conflict** with `AGENTS.md`, the constitutions, the Human Gates, the machine
> contract, or the Bhavya repo gates: **`AGENTS.md` wins. Stop and report the conflict
> rather than proceeding.**
>
> ### Hard stops — ask the human and wait
>
> Never do any of the following without explicit human authorization, regardless of any
> upstream default:
>
> - Constitutional edits (`docs/constitution/00`–`09`), or any edit to `AGENTS.md`.
> - Brand or design-token authority changes (the `pnpm tokens:check` gate).
> - Auth store or credential file changes.
> - Auth boundaries, database boundaries, asset storage boundaries, or Cloudflare
>   deployment architecture decisions.
> - Commit, push, deploy, rollback, or force operations.
> - Destructive deletion, force-cleaning, or hard resets.
> - Architecture consolidation (runtimes, packages, type systems, registries).
> - Hand-editing generated output: `FILE-MAP.md` (use `pnpm file-map`), `registry/`
>   (use `pnpm registry:generate`), `.github/`.
>
> ### Machine contract (AGENTS.md §16)
>
> This machine is a lightweight control center; heavy compute stays remote.
> **Never run locally:** `pnpm build`, `turbo build`, `next build`,
> `opennextjs-cloudflare build`, or the full monorepo `pnpm test` — those run on GitHub
> Actions. Prefer lightweight checks: `pnpm typecheck`, `pnpm lint`, `pnpm tokens:check`,
> `pnpm antislop`, `pnpm file-map:check`, `pnpm drift:check`.
>
> Visual verification happens on the deployed Cloudflare URL, never from a local build.
>
> ### Use Bhavya-native gates, not ECC substitutes
>
> | Intent | Use | Never substitute |
> |---|---|---|
> | Lint | `pnpm lint` | `npx eslint . --fix` |
> | Types | `pnpm typecheck` | ad-hoc tsc runs |
> | Format | `pnpm format` | `npx prettier --write` |
> | Tests | `pnpm test` **on CI only** | `npm test`, `npx vitest` locally |
> | Tokens | `pnpm tokens:check` | hardcoded colors or fonts |
> | Slop | `pnpm antislop` | console.log audits |
> | Drift | `pnpm drift:check` | codemap commands |
>
> Where this file names a non-Bhavya command, ignore that command name and use the
> Bhavya gate above. No hardcoded colors or fonts — use `--color-*` tokens from
> `packages/platform-ui/src/styles/tokens.css`.

# Security Review Command

Conduct a comprehensive security review: $ARGUMENTS

## Your Task

Analyze the specified code for security vulnerabilities following OWASP guidelines and security best practices.

## Security Checklist

### OWASP Top 10

1. **Injection** (SQL, NoSQL, OS command, LDAP)
   - Check for parameterized queries
   - Verify input sanitization
   - Review dynamic query construction

2. **Broken Authentication**
   - Password storage (bcrypt, argon2)
   - Session management
   - Multi-factor authentication
   - Password reset flows

3. **Sensitive Data Exposure**
   - Encryption at rest and in transit
   - Proper key management
   - PII handling

4. **XML External Entities (XXE)**
   - Disable DTD processing
   - Input validation for XML

5. **Broken Access Control**
   - Authorization checks on every endpoint
   - Role-based access control
   - Resource ownership validation

6. **Security Misconfiguration**
   - Default credentials removed
   - Error handling doesn't leak info
   - Security headers configured

7. **Cross-Site Scripting (XSS)**
   - Output encoding
   - Content Security Policy
   - Input sanitization

8. **Insecure Deserialization**
   - Validate serialized data
   - Implement integrity checks

9. **Using Components with Known Vulnerabilities**
   - Run `pnpm audit`
   - Check for outdated dependencies

10. **Insufficient Logging & Monitoring**
    - Security events logged
    - No sensitive data in logs
    - Alerting configured

### Additional Checks

- [ ] Secrets in code (API keys, passwords)
- [ ] Environment variable handling
- [ ] CORS configuration
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] Secure cookie flags

## Report Format

### Critical Issues
[Issues that must be fixed immediately]

### High Priority
[Issues that should be fixed before release]

### Recommendations
[Security improvements to consider]

---

**IMPORTANT**: Security issues are blockers. Do not proceed until critical issues are resolved.
