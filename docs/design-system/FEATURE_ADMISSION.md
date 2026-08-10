# Feature Admission Policy

Every feature must pass through this gate before development begins.

---

## Gate Questions

No feature enters development until it answers all seven:

### 1. Mission Alignment

> Which Bhavya mission does this support?

- Education
- Open Source
- Community
- Platform Stability
- If it doesn't support any mission, it doesn't get built.

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
| Maintenance Burden | 10%    | ≤ 30%          |
| Exit Strategy      | 5%     | Must pass      |

**Decision:** All "Must pass" questions must pass. Weighted score must exceed 60%.

---

## Approval Flow

```
Feature Request
    ↓
Gate Questions (answered in writing)
    ↓
Scoring
    ↓
Human Review
    ↓
Approved / Rejected / Deferred
    ↓
If Approved → Development
If Rejected → Documented in Knowledge Base
If Deferred → Scheduled for next review
```

---

## GitHub OS — Current Status

**Feature freeze.** Only the following are admitted:

- Bug fixes (severity: medium or higher)
- UX refinements (must be user-tested)
- Performance improvements (must be measurable)
- Real GitHub integration (OAuth, API)
- Authentication (Supabase Auth)
- Accessibility (WCAG 2.1 AA compliance)
- User testing feedback (must be from real users)

All new feature requests go to AI Institute.

---

## AI Institute — Active Admission

AI Institute is in active development. Features are admitted through the full gate process.

Priority capabilities needed:

1. Course creation and management
2. Student enrollment and progress tracking
3. Assessment and quiz system
4. Live session integration
5. Certificate generation
6. Analytics dashboard
