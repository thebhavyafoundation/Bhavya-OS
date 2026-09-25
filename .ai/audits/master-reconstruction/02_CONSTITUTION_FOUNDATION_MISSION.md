# 02–04 — Constitution, Foundation, Mission/Program Model

## Constitution map (9 live docs in `docs/constitution/`)

| File                                   | Effective  | Core content                                                                                                                                                                                        | Implementation consequence                                                                  |
| -------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `00-VISION.md` (SUPREME)               | 2026-01-01 | 4 missions (header says "Three Pillars" — CONFLICT); Visitor→Builder→Contributor→Mentor→Institution Builder filter; 10-yr targets (50k builders, 10k PRs, 100ha, 500 KPs, 16 domains, 100 villages) | All product/institution decisions filter through Art.3.3; metrics must reconcile with Art.4 |
| `01-BRAND-CONSTITUTION.md`             | 2026-01-01 | Tagline NATURE. KNOWLEDGE. HERITAGE. (omits Community — CONFLICT); stats 8+ha, 10K+ students, 50+ communities (CONFLICT with 00 + MISSION.md)                                                       | Voice + stats binding; currently violated by unsourced claims                               |
| `02-BHAVYA-OS-CONSTITUTION.md`         | 2026-01-01 | 6-layer OS; L1 creates via `publishKnowledge()`; L2 `content-core` SSOT; L4 intelligence never mutates                                                                                              | Code must move curriculum truth out of app SQLite into `content-core`                       |
| `03-KNOWLEDGE-OS-CONSTITUTION.md`      | 2026-08-06 | "AI Institute is one consumer of the Knowledge OS" (§2.3); KP canonical unit; never hardcode content                                                                                                | Institute routes consume; KP pipeline is the content vehicle                                |
| `04-ENGINEERING-CONSTITUTION.md`       | 2026-08-06 | Downward-only deps; quality gates                                                                                                                                                                   | `video-engine` test app-import violates this                                                |
| `05-DESIGN-SYSTEM.md`                  | —          | Token/component discipline                                                                                                                                                                          | Token rebuild required                                                                      |
| `06-AI-ETHICS.md`                      | —          | Responsible AI, child safeguarding alignment                                                                                                                                                        | No runtime enforcement found — DOCUMENTED ONLY                                              |
| `07-CONTENT-CONSTITUTION.md`           | —          | Truth states (verified/reported/estimated/demo)                                                                                                                                                     | Zero frontmatter usage found — FAIL                                                         |
| `08-ARCHITECTURE.md` / `09-ROADMAP.md` | 2026-08-06 | Layer doctrine; roadmap                                                                                                                                                                             | Effective-date skew vs 00 (no amendment record per 00 Art.5.3)                              |

Missing: promised docs 10–15 (`00 Art.5.1`: education, volunteers, donations, etc. under different names) — UNKNOWN whether renamed into 06/07/governance or never written. HUMAN DECISION REQUIRED.

## Foundation model (evidenced)

```
BHAVYA FOUNDATION (institution; "not a startup, not an LMS" — 00 Art.1.1)
├── FOREST (mission) — 10,000ha by 2030 (.ai/MISSION.md) vs 100ha/10yr (00 Art.4) — CONFLICT
├── KNOWLEDGE (mission) — AI Institute lives here (AGENTS.md; 03 §2.3; VISION.md:19-21)
│   └── AI INSTITUTE (program/product: structured learning; consumer of Content OS, never its owner)
├── HERITAGE (mission)
└── COMMUNITY (mission)
ONE canonical app (apps/ai-institute) → ONE Vercel project → bhavyafoundation.org
```

## Mission → Program → Product (actual vs imposed)

- EVIDENCE SHOWS missions = pillars (Forest/Knowledge/Heritage/Community). `specs/missions.md` is a 4-bullet STUB — no program definitions.
- `Program` entity is UNDEFINED in `DOMAIN_OWNERSHIP.md` and constitution. `/programs` route exists; no owner package.
- KP (Knowledge Package) is the evidenced canonical content unit (`03 §§4,10`), not "Program".
- Proposed hierarchy Mission → Program → Product/Experience → Content/Data → Learning/Participation is COMPATIBLE but NOT evidenced verbatim; do not impose. Actual evidenced chain: Mission → Content OS (L1→L2) → Consumer (Institute/Website/Media/GitHub/Forest/Heritage/Volunteer OS per `03 §2.3`) → Route (`CANONICAL_ROUTE_MAP.md`).

## AI Institute placement — settled doctrine

Institute = structured-learning consumer inside Knowledge pillar. Three independent sources agree (`03-KNOWLEDGE-OS:15-16`, `docs/ai-institute/VISION.md:19-21`, `PRD.md:5,108-113`, `AGENTS.md`). No contrary evidence found. FACT.
