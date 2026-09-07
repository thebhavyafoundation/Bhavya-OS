# Bhavya Feature Admission Criteria

**Status:** ACTIVE
**Version:** 1.0.0
**Created:** 2026-09-07
**Owner:** Bhavya Foundation Design

---

## Purpose

This document defines the admission criteria for new features in Bhavya Foundation. Every feature must pass through this gate before development begins.

---

## Gate Questions

No feature enters development until it answers all seven:

### 1. Mission Alignment

> Which Bhavya mission does this support?

- Forest (ecological restoration)
- Knowledge (AI Institute, education)
- Heritage (cultural preservation)
- Community (volunteers, social impact)

**If it doesn't support any mission, it doesn't get built.**

### 2. User Problem

> Which user problem does it solve?

- Must be a specific, observable problem
- "Users would find this useful" is not a problem
- "Users cannot do X" is a problem

### 3. Platform Reuse

> Which existing platform capabilities does it reuse?

- Check `@bhavya/platform-ui` first
- Check existing packages before creating new ones
- If it reimplements existing functionality, refactor instead

### 4. Research Support

> Which research supports it?

- Must cite a Knowledge Package or research entry
- "We think this is better" is not research
- "Linear does X and research shows Y" is research

### 5. Educational Value

> What educational value does it create?

- Does it teach something?
- Does it make learning easier?
- Does it expose engineering patterns?
- If no educational value, reconsider

### 6. Maintenance Burden

> What maintenance burden does it introduce?

- Estimated ongoing cost
- Required expertise
- Dependencies created
- If burden exceeds value, don't build

### 7. Exit Strategy

> What is the exit strategy if it fails?

- Can it be removed cleanly?
- Does it depend on external services?
- Can data be migrated?
- Always have an exit strategy

---

## Scoring

| Question           | Weight | Pass Threshold |
| ------------------ | ------ | -------------- |
| Mission Alignment  | 25%    | Must pass      |
| User Problem       | 20%    | Must pass      |
| Platform Reuse     | 15%    | ≥ 50%          |
| Research Support   | 15%    | ≥ 50%          |
| Educational Value  | 10%    | ≥ 50%          |
| Maintenance Burden | 10%    | ≤ 50% burden   |
| Exit Strategy      | 5%     | Must have one  |

**Minimum score to proceed:** 70/100
**Hard gates:** Mission Alignment + User Problem must both pass

---

## Feature Admission Form

```
## Feature Admission Request

**Feature:** [Name]
**Requester:** [Name]
**Date:** [Date]

### 1. Mission Alignment
- Mission: [Forest / Knowledge / Heritage / Community]
- Alignment: [How it supports the mission]
- Score: [0-25]

### 2. User Problem
- Problem: [Specific, observable problem]
- Users affected: [Who]
- Frequency: [How often]
- Score: [0-20]

### 3. Platform Reuse
- Existing capabilities: [What we reuse]
- New capabilities: [What we create]
- Reuse percentage: [0-100%]
- Score: [0-15]

### 4. Research Support
- Research cited: [What research]
- Source: [Where it comes from]
- Relevance: [How it applies]
- Score: [0-15]

### 5. Educational Value
- Value: [What it teaches]
- Audience: [Who learns]
- Impact: [How significant]
- Score: [0-10]

### 6. Maintenance Burden
- Ongoing cost: [Estimated]
- Expertise required: [What skills]
- Dependencies: [What we depend on]
- Score: [0-10]

### 7. Exit Strategy
- Removal: [Can it be removed cleanly?]
- External dependencies: [What services?]
- Data migration: [Can data be migrated?]
- Score: [0-5]

### Total Score
- Score: [0-100]
- Pass: [Yes / No]
- Hard gates: [Pass / Fail]

### Decision
- [ ] Approved
- [ ] Approved with conditions
- [ ] Denied

### Conditions
- [List any conditions]

### Signature
[Requester signature]
```

---

## Admission Process

### Step 1: Submit Request

1. Fill out the Feature Admission Form
2. Submit to design lead
3. Wait for review

### Step 2: Review

1. Design lead reviews form
2. Checks scoring
3. Verifies hard gates
4. Makes decision

### Step 3: Approval

1. If approved, proceed to development
2. If approved with conditions, address conditions first
3. If denied, document rationale

### Step 4: Development

1. Follow design principles
2. Use canonical tokens
3. Reuse existing components
4. Document new components

### Step 5: Verification

1. Run AI Review Checklist
2. Request design lead review
3. Verify against admission criteria
4. Document any deviations

---

## Exceptions

### Emergency Fixes

Emergency fixes (security, data loss, critical bugs) may bypass the admission process but must:

1. Be documented after the fact
2. Be reviewed within 24 hours
3. Be refactored if needed

### Research Features

Research features may have relaxed criteria but must:

1. Be clearly marked as research
2. Not affect production users
3. Be removed if not validated

### Community Contributions

Community contributions may have relaxed criteria but must:

1. Follow design principles
2. Use canonical tokens
3. Be reviewed before merging

---

## Verification

This criteria is verified by:

- `pnpm file-map:check` — structural integrity
- `pnpm typecheck` — no type errors
- `pnpm test` — all tests pass
- Git status clean — no uncommitted changes
