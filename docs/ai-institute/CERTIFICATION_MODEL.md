# Certification Model

Credentials and verification system.

---

## Certificate Types

### 1. Foundation Certificate

**Requirements:**

- Complete Foundation course (all modules)
- Pass all knowledge checks (≥ 80%)
- Complete final project
- Mentor approval

**Competencies verified:**

- AI literacy
- Basic prompt engineering
- Simple AI application building
- Responsible AI use

---

### 2. Specialist Certificate

**Requirements:**

- Complete a specialization track
- Pass all assessments (≥ 85%)
- Complete capstone project
- Portfolio review
- Mentor approval

**Specializations:**

- Prompt Engineering
- Agent Engineering
- Automation
- AI Product Development

**Competencies verified:**

- Domain-specific skills
- Real-world application
- Problem-solving
- Communication

---

### 3. Professional Certificate

**Requirements:**

- Complete all levels up to chosen track
- Pass all assessments (≥ 85%)
- Complete capstone project
- Portfolio review (≥ 3 strong pieces)
- Mentor approval
- Peer reviews (≥ 3)

**Competencies verified:**

- Comprehensive AI knowledge
- System design
- Project execution
- Teaching ability

---

### 4. Mentor Certificate

**Requirements:**

- Hold Professional Certificate
- 6+ months industry experience
- Complete mentor training
- Mentor 5+ students successfully
- Peer recommendation
- Student feedback ≥ 4.5/5

**Competencies verified:**

- Teaching ability
- Feedback quality
- Student development
- Leadership

---

## Certificate Structure

```yaml
certificate:
  id: "cert-123"
  type: "specialist"
  title: "Specialist Certificate in Prompt Engineering"
  student:
    id: "student-456"
    name: "Student Name"
  issuedDate: "2026-08-04"
  expiryDate: "2028-08-04" # 2 years
  competencies:
    - name: "Prompt Engineering"
      level: 4
      evidence:
        - "Lab: Advanced Prompt Engineering (score: 92)"
        - "Challenge: Resume Parser (score: 88)"
        - "Capstone: Domain-Specific Prompts (score: 90)"
  verification:
    url: "https://bhavya.institute/verify/cert-123"
    hash: "sha256:abc123..."
  issuer: "Bhavya Foundation"
  signature: "digital-signature"
```

---

## Verification

### On-Chain (Optional)

- Certificate hash stored on blockchain
- Tamper-proof verification
- Public verification URL

### API Verification

```
GET /api/verify/{certificateId}
Response:
{
  "valid": true,
  "certificate": { ... },
  "competencies": [ ... ],
  "issuedDate": "2026-08-04",
  "expiryDate": "2028-08-04"
}
```

### LinkedIn Integration

- One-click sharing
- Automatic badge import
- Verification link

---

## Certificate Lifecycle

```
Application
  ↓
Verification (prerequisites met)
  ↓
Assessment (certification exam)
  ↓
Evaluation (AI + Human)
  ↓
Approval (mentor + committee)
  ↓
Issuance (digital certificate)
  ↓
Verification (public)
  ↓
Renewal (if applicable)
```

---

## Renewal

### When Required

- Every 2 years for Professional and Mentor certificates
- Foundation and Specialist certificates do not expire

### Process

- Complete continuing education requirements
- Demonstrate current competency
- Submit updated portfolio
- Mentor review

### Continuing Education

- 20 hours of learning per year
- Or 1 significant project contribution
- Or mentoring 2 students
- Or conference talk or publication

---

## Badge System

### Skill Badges

- Awarded when skill level increases
- Shareable on social media
- Verified through API

### Achievement Badges

- First lab completed
- First project completed
- First peer review
- First mentor session
- Community contribution
- Open source contribution

### Milestone Badges

- Foundation complete
- Track complete
- Course complete
- Specialization complete
- Professional complete

### Rarity Levels

| Level     | Criteria                |
| --------- | ----------------------- |
| Common    | Any achievement         |
| Uncommon  | Difficult achievement   |
| Rare      | Exceptional achievement |
| Legendary | Top 1% of students      |
