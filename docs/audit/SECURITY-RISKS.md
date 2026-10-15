# SECURITY-RISKS — Current Security Posture

**Date:** 2026-10-12
**Source:** Repository inspection, OWASP Top 10, AGENTS.md constraints

---

## Current Security Implementation

### ✅ Implemented

#### Authentication (Supabase)

- **SSR-compatible auth** — `@supabase/ssr` with cookie-based sessions
- **Middleware protection** — Route-level auth validation in `src/middleware.ts`
- **Rate limiting** — `src/lib/security/rate-limit.ts` (token bucket)
- **Password hashing** — `bcryptjs` for local auth fallback
- **JWT validation** — Supabase anon key validates tokens

#### Authorization

- **Role-based access** — student, volunteer, donor, researcher, mentor, educator, admin, trustee
- **Route policy** — `src/lib/route-policy.ts` maps routes to required roles
- **RLS-ready schema** — Supabase tables designed for Row Level Security

#### Data Protection

- **HTTPS only** — Cloudflare enforces TLS
- **Secure cookies** — `SameSite=Lax`, `Secure`, `HttpOnly` for auth
- **CSP-ready** — Next.js headers configurable
- **Audit logging** — `audit_events` table (append-only)

#### Infrastructure

- **Secrets in env** — No secrets in code (`.env.example` template)
- **Wrangler secrets** — Production secrets via `wrangler secret put`
- **GitHub Actions secrets** — CI/CD secrets in GitHub
- **No R2** — Complies with AGENTS.md constraint

---

## Identified Security Risks

### 🔴 Critical

| Risk                                 | Location                           | Impact                                      | Fix                                                           |
| ------------------------------------ | ---------------------------------- | ------------------------------------------- | ------------------------------------------------------------- |
| **B2 Credentials in Browser Bundle** | `src/lib/b2/client.ts` lines 22-36 | **Full bucket access** if exposed           | Move all B2 operations to API routes; use presigned URLs only |
| **Supabase Anon Key in Client**      | `src/lib/supabase/client.ts`       | Standard practice but must be anon key only | Verify service_role key NEVER in client bundle                |
| **No CSP Header**                    | `next.config.mjs`                  | XSS risk                                    | Add Content-Security-Policy header                            |

### 🟠 High

| Risk                                         | Location                    | Impact                      | Fix                                                                |
| -------------------------------------------- | --------------------------- | --------------------------- | ------------------------------------------------------------------ |
| **GSAP License Unverified**                  | `package.json` + components | Legal/compliance            | Verify Standard/Business license                                   |
| **No Security Headers**                      | `next.config.mjs`           | Clickjacking, MIME sniffing | Add `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` |
| **Rate Limiting Not Enforced on All Routes** | `src/middleware.ts`         | Brute force, DoS            | Apply to `/api/auth/*`, `/api/upload/*`, `/login`                  |
| **File Upload Validation**                   | `/api/upload/*`             | Malicious file upload       | MIME validation, size limits, malware scan                         |
| **No Input Sanitization Audit**              | API routes                  | XSS, injection              | Zod schemas on all inputs                                          |

### 🟡 Medium

| Risk                           | Location                   | Impact                 | Fix                                    |
| ------------------------------ | -------------------------- | ---------------------- | -------------------------------------- |
| **Audit Events Not Immutable** | `audit_events` table       | Tampering              | Append-only constraint, signed logs    |
| **No Secret Scanning in CI**   | `.github/workflows/ci.yml` | Leaked secrets         | ✅ Gitleaks + pattern scan present     |
| **Dependency Vulnerabilities** | `pnpm-lock.yaml`           | Supply chain           | Add OSV Scanner / Renovate             |
| **No Penetration Testing**     | —                          | Unknown vulns          | Schedule annual pen test               |
| **CORS Not Configured**        | API routes                 | Cross-origin abuse     | Explicit `Access-Control-Allow-Origin` |
| **No Request Size Limits**     | API routes                 | DoS via large payloads | `bodyParser` limits                    |

### 🟢 Low

| Risk                                 | Location                   | Impact                 | Fix                          |
| ------------------------------------ | -------------------------- | ---------------------- | ---------------------------- |
| **Error Messages Leak Stack Traces** | Dev mode only              | Info disclosure        | Ensure `NODE_ENV=production` |
| **No Security.txt**                  | `.well-known/security.txt` | Responsible disclosure | Add security.txt             |
| **Subresource Integrity**            | External scripts           | CDN compromise         | SRI for Google Fonts, etc.   |

---

## AGENTS.md Compliance Check

| Constraint                       | Status | Evidence                    |
| -------------------------------- | ------ | --------------------------- |
| **No paid model APIs**           | ✅     | No OpenAI/Anthropic keys    |
| **No local AI inference**        | ✅     | No ollama/llama.cpp         |
| **No Cloudflare R2**             | ✅     | B2 + Vercel Blob only       |
| **No payment-required services** | ✅     | All free tiers              |
| **No accidental paid upgrades**  | ✅     | Free tier configs only      |
| **No unbounded charge infra**    | ✅     | Workers/Pages/B2/Turso free |
| **No local video/3D rendering**  | ✅     | Cloud GitHub Actions only   |
| **No local heavy compute**       | ✅     | CI only                     |
| **No dev machine dependency**    | ✅     | Cloud deployments           |

---

## Data Classification Enforcement

| Classification   | Tables                                       | Current Protection            | Gap                      |
| ---------------- | -------------------------------------------- | ----------------------------- | ------------------------ |
| **Public**       | curriculum modules, missions, impact metrics | Turso read replica, CDN cache | None                     |
| **Internal**     | draft content, internal notes                | Auth required                 | Route policy only        |
| **Confidential** | donor details, finance, board packs          | Supabase + Turso, role check  | RLS not deployed         |
| **Safeguarded**  | child data, incidents, consents              | Supabase (RLS design)         | RLS policies not applied |

### RLS Policies Needed (Supabase)

```sql
-- Example: Users see only their own progress
CREATE POLICY "own_progress" ON module_progress
  FOR ALL USING (auth.uid() = user_id);

-- Example: Safeguarding lead only
CREATE POLICY "safeguarding_access" ON safeguarding_incidents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles
            WHERE user_id = auth.uid() AND role = 'safeguarding_lead')
  );
```

---

## API Security Checklist

| Endpoint               | Auth     | Rate Limit | Validation | Audit Log |
| ---------------------- | -------- | ---------- | ---------- | --------- |
| `/api/curriculum/*`    | Optional | ✅         | Zod        | ❌        |
| `/api/progress/*`      | Required | ❌         | Zod        | ✅        |
| `/api/enroll`          | Required | ❌         | Zod        | ✅        |
| `/api/upload/presign`  | Admin    | ❌         | Zod        | ✅        |
| `/api/upload/complete` | Admin    | ❌         | Zod        | ✅        |
| `/api/auth/*`          | N/A      | ❌         | Zod        | ✅        |
| `/api/admin/*`         | Admin    | ❌         | Zod        | ✅        |

---

## Secrets Management

### Current

| Secret                          | Location                  | Rotation |
| ------------------------------- | ------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Vercel/Cloudflare env     | Manual   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel/Cloudflare env     | Manual   |
| `SERVICE_ROLE_KEY`              | Cloudflare Workers secret | Manual   |
| `TURSO_DATABASE_URL`            | Cloudflare Workers secret | Manual   |
| `TURSO_AUTH_TOKEN`              | Cloudflare Workers secret | Manual   |
| `S3_ACCESS_KEY_ID`              | Cloudflare Workers secret | Manual   |
| `S3_SECRET_ACCESS_KEY`          | Cloudflare Workers secret | Manual   |
| `S3_BUCKET_NAME`                | Cloudflare Workers secret | Manual   |
| `BLOB_READ_WRITE_TOKEN`         | Vercel env                | Manual   |

### Gaps

- **No automated rotation** — Manual process only
- **No secret scanning in PRs** — Only Gitleaks on push
- **No secret inventory** — No centralized list

---

## Supply Chain Security

### Dependencies

| Package                 | Version | Last Audit | Known Vulns |
| ----------------------- | ------- | ---------- | ----------- |
| `next`                  | 15.5.25 | Never      | Check OSV   |
| `react`                 | 19.0.0  | Never      | Check OSV   |
| `@supabase/supabase-js` | 2.45.0  | Never      | Check OSV   |
| `@libsql/client`        | 0.17.4  | Never      | Check OSV   |
| `three`                 | 0.186.1 | Never      | Check OSV   |
| `gsap`                  | 3.15.0  | Never      | Check OSV   |

### Required

```yaml
# Add to CI
- name: OSV Scanner
  uses: google/osv-scanner@v1
  with: --scan=pnpm-lock.yaml
```

---

## Incident Response Readiness

| Component               | Status | Notes                            |
| ----------------------- | ------ | -------------------------------- |
| **Incident Runbook**    | ❌     | Not in `docs/runbooks/`          |
| **Breach Notification** | ❌     | No template                      |
| **Log Retention**       | ⚠️     | Audit events only; no infra logs |
| **Backup Verification** | ❌     | No restore test                  |
| **Rollback Procedure**  | ⚠️     | Git revert only; no DB rollback  |

---

## Recommendations

### Immediate (Before Launch)

1. **Move B2 to API routes only** — Never expose credentials to browser
2. **Add CSP Header** — `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://*.turso.io https://*.backblazeb2.com;`
3. **Security Headers** — `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
4. **Rate Limit Auth Routes** — 5 req/min on `/api/auth/*`, `/login`
5. **Verify GSAP License** — Document license type and expiry

### Phase 1

6. **Deploy Supabase RLS** — All tables with policies
7. **Add OSV Scanner** — CI dependency vulnerability scan
8. **File Upload Security** — MIME allowlist, size limit (50MB), ClamAV scan
9. **API Input Validation** — Zod schemas on every endpoint
10. **CORS Configuration** — Explicit allowlist per environment

### Phase 2

11. **Penetration Test** — Annual third-party
12. **Security.txt** — `/.well-known/security.txt` with contact
13. **Audit Log Integrity** — Hash chains or signed logs
14. **Backup/Restore Drill** — Quarterly Turso + Supabase restore test
15. **Incident Runbooks** — `docs/runbooks/security-incident.md`

### Compliance

16. **Data Retention Policy** — Document per classification
17. **Child Data Handling** — Safeguarding policy enforcement
18. **Donor Data Protection** — PCI/DSS if payments added
19. **Access Review** — Quarterly role audit
