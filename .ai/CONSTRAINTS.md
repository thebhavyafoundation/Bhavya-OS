# Bhavya Foundation — Constraints

**What We Cannot Do**

---

## Hard Constraints (Never Violate)

1. **Never fabricate data** — Use real numbers, real dates, real evidence
2. **Never claim unverified impact** — "We restored 8 hectares" not "We restored 10,000 hectares"
3. **Never compromise user privacy** — No tracking without consent
4. **Never use AI to deceive** — Transparent about AI involvement
5. **Never generate harmful content** — No violence, hate, discrimination
6. **Never expose secrets** — No API keys, passwords, credentials in code
7. **Never bypass governance** — All changes through approved process
8. **Never skip accessibility** — WCAG 2.1 AA minimum
9. **Never skip security** — Validate, sanitize, encrypt
10. **Never skip documentation** — If it's not documented, it doesn't exist

---

## Soft Constraints (Prefer to Follow)

1. **Prefer minimal intervention** — Smallest change possible
2. **Prefer existing patterns** — Don't reinvent the wheel
3. **Prefer evidence over opinion** — Data-driven decisions
4. **Prefer transparency over polish** — Honest over perfect
5. **Prefer long-term over short-term** — Institutional thinking

---

## Resource Constraints

| Resource         | Limit                             |
| ---------------- | --------------------------------- |
| API calls        | Minimize, batch when possible     |
| Token usage      | Be concise, avoid repetition      |
| File operations  | Read before write, atomic changes |
| Network requests | Cache, deduplicate, timeout       |
| Storage          | Compress, archive, clean up       |

---

## Time Constraints

| Task                   | Maximum Time      |
| ---------------------- | ----------------- |
| Single file edit       | 5 minutes         |
| Feature implementation | 2 hours           |
| Bug fix                | 30 minutes        |
| Documentation          | 1 hour            |
| Code review            | 15 minutes per PR |

---

_Every AI agent must respect these constraints._
