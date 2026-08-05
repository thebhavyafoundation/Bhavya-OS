# Social OS v2 — Constitution Integration

## Overview

Every publication must automatically validate against the Constitution SDK. No publication bypasses constitutional validation.

## Validation Checks (10 total)

| #   | Rule                    | Document | Section        | Severity |
| --- | ----------------------- | -------- | -------------- | -------- |
| 1   | Mission Alignment       | 01       | Article 2      | warning  |
| 2   | Brand Consistency       | 15       | Brand Identity | warning  |
| 3   | AI Ethics Disclosure    | 13       | Transparency   | info     |
| 4   | Source Traceability     | 05       | Governance     | warning  |
| 5   | Ethical Compliance      | 06       | Code of Ethics | error    |
| 6   | Child Protection        | 11       | Safeguarding   | info     |
| 7   | Environmental Awareness | 12       | Conservation   | info     |
| 8   | Approval Status         | 05       | Governance     | warning  |
| 9   | Version Control         | 05       | Governance     | info     |
| 10  | Financial Policy        | 08       | Procurement    | info     |

## Severity Levels

- **error** — Publication blocked until resolved
- **warning** — Publication flagged for review
- **info** — Advisory, does not block

## Brand Review

Automated brand consistency check:

- Brand name correct ("Bhavya Foundation")
- Tagline present ("Nature. Knowledge. Heritage.")
- Color palette consistent
- Tone consistent

## Citation Requirement

Every publication must include a constitutional citation:

```
The Constitution (KP-{knowledgePackageId}), effective 2026-01-01
```

## API

### Validate Publication

```http
POST /api/integrations
{
  "integration": "constitution",
  "action": "validate",
  "publicationId": "..."
}
```

### Brand Check

```http
POST /api/integrations
{
  "integration": "constitution",
  "action": "brand-check",
  "content": "..."
}
```

## Response

```json
{
  "check": {
    "passed": true,
    "overallScore": 85,
    "checks": [
      {
        "rule": "Mission_Alignment",
        "documentNumber": "01",
        "section": "Article 2",
        "passed": true,
        "severity": "info",
        "message": "Content aligns with Bhavya Foundation mission"
      }
    ],
    "citation": "The Constitution (KP-001), effective 2026-01-01"
  }
}
```
