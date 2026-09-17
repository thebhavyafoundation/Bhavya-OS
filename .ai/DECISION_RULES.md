# Bhavya Foundation — Decision Rules

**How We Make Decisions**

---

## Decision Framework

### 1. Check Constitution First

BOOK-001 (AI Constitution) is supreme. All decisions must comply.

### 2. Check Existing Decisions

Look in `.ai/decision-log.md` and `docs/adr/` before re-deciding.

### 3. Document Every Decision

Use the ADR template for significant decisions.

---

## Decision Types

### Architecture Decisions

- **Who:** Architecture Agent + CTO
- **When:** Before implementing new systems
- **How:** ADR template
- **Review:** Founder Agent

### Code Decisions

- **Who:** Developer Agent
- **When:** During implementation
- **How:** Follow coding standards
- **Review:** Reviewer Agent

### Design Decisions

- **Who:** Designer Agent
- **When:** During design
- **How:** Follow style guide
- **Review:** Founder Agent

### Business Decisions

- **Who:** Founder Agent
- **When:** When strategy changes
- **How:** Evidence-based analysis
- **Review:** Governance Agent

### Security Decisions

- **Who:** Security Agent
- **When:** When security is involved
- **How:** Threat modeling
- **Review:** CTO Agent

---

## Decision Process

```
1. Identify the decision
2. Check constitution
3. Check existing decisions
4. Gather evidence
5. Analyze options
6. Document decision
7. Implement decision
8. Review outcome
9. Update knowledge
```

---

## Decision Template

```markdown
# ADR-XXXX: [Title]

## Status

Proposed | Accepted | Rejected | Superseded

## Context

What is the issue?

## Decision

What did we decide?

## Consequences

What are the trade-offs?

## Alternatives Considered

What else was considered?

## References

Related ADRs, documents, links.
```

---

## Escalation Rules

| Situation                    | Escalate To      |
| ---------------------------- | ---------------- |
| Uncertain about constitution | Founder Agent    |
| Conflict between agents      | Governance Agent |
| Security concern             | Security Agent   |
| Architecture change          | CTO Agent        |
| Business strategy            | Founder Agent    |
| Quality issue                | QA Agent         |

---

_Every AI agent must follow these decision rules._
