# Governance Documents

## Status: ACTIVE

These are the authoritative governance documents for Bhavya Foundation.

**Single Source of Truth:** `packages/constitution/src/registry.mjs`

All document metadata, content, and relationships are managed by the Constitution SDK (`@bhavya/constitution`).

## Documents

| #   | Document                                  | Authority   | Level | Status |
| --- | ----------------------------------------- | ----------- | ----- | ------ |
| 01  | The Constitution                          | Supreme     | 100   | Active |
| 02  | Public Charitable Trust Deed              | Legal       | 95    | Active |
| 03  | The Founder's Charter                     | Visionary   | 90    | Active |
| 04  | Board of Trustees Charter                 | Governance  | 85    | Active |
| 05  | Governance Manual                         | Operational | 80    | Active |
| 06  | Code of Ethics & Professional Conduct     | Ethical     | 85    | Active |
| 07  | Conflict of Interest Policy               | Compliance  | 80    | Active |
| 08  | Financial Management & Procurement Policy | Financial   | 85    | Active |
| 09  | Donation Acceptance Policy                | Financial   | 75    | Active |
| 10  | Volunteer Management Policy               | Community   | 70    | Active |
| 11  | Child Protection & Safeguarding Policy    | Protection  | 90    | Active |
| 12  | Environmental Conservation Policy         | Mission     | 75    | Active |
| 13  | AI Ethics & Responsible AI Policy         | Technology  | 85    | Active |
| 14  | Digital Library Policy                    | Knowledge   | 75    | Active |
| 15  | Brand Constitution                        | Identity    | 80    | Active |

## Usage

```javascript
import {
  initialize,
  getConstitutionalDocument,
  search,
} from "@bhavya/constitution";

// Initialize SDK
await initialize();

// Get a document
const constitution = await getConstitutionalDocument("constitution");

// Search across all documents
const results = await search("conflict of interest");

// Get a specific article
const article = await getArticle("constitution", "7.2");

// Search for definitions
const defs = await searchDefinitions("Trust");

// Generate a citation
const citation = await cite("constitution", { format: "text" });
```

## Rules

1. Updates require Founder approval
2. Changes must be versioned
3. Superseded versions move to `superseded/`
4. Historical versions move to `archived/`

## Related

- Constitution SDK: `packages/constitution/`
- Brand guidelines: `docs/brand/BRAND_GUIDE.md`
- Governance registry: `docs/governance/governance-registry.json`
