# Portfolio Model

Student work showcase system.

---

## Portfolio Structure

```yaml
portfolio:
  id: "portfolio-123"
  student: "student-456"
  visibility: "public" # private, mentors, public
  items:
    - id: "item-1"
      title: "AI-Powered Code Review Tool"
      type: "project"
      description: "Built a tool that uses AI to review code..."
      link: "https://github.com/student/code-review-tool"
      evidence:
        - "Demonstrates prompt engineering"
        - "Shows API integration"
        - "Includes comprehensive tests"
      feedback:
        - from: "mentor"
          content: "Excellent architecture and clean code..."
          score: 92
        - from: "peer"
          content: "Great documentation and examples..."
      dateAdded: "2026-08-04"
      tags:
        - "prompt-engineering"
        - "api-integration"
        - "testing"
  skills:
    - skill: "Prompt Engineering"
      level: 4
      evidence: ["item-1", "item-3"]
    - skill: "API Design"
      level: 3
      evidence: ["item-1", "item-2"]
  stats:
    totalItems: 8
    averageScore: 88
    totalFeedback: 12
    lastUpdated: "2026-08-04"
```

---

## Portfolio Item Types

### Project

- Complete application or tool
- Real-world problem solved
- Includes code, documentation, tests

### Lab

- Completed lab exercise
- Shows skill progression
- Includes validation results

### Contribution

- Open source contribution
- Community improvement
- Shows collaboration skills

### Reflection

- Learning journey documentation
- Insights and growth
- Shows metacognition

### Certification

- Certificate of competency
- Verified credential
- Shows commitment

---

## Portfolio Curation

### Automatic Curation

- All completed projects added
- All certifications added
- All contributions tracked
- Feedback aggregated

### Manual Curation

- Student selects best work
- Writes custom descriptions
- Orders by relevance
- Hides weaker pieces

### Mentor Curation

- Mentor recommends highlights
- Suggests improvements
- Validates competency claims
- Endorses portfolio

---

## Portfolio Sharing

### Public URL

```
https://bhavya.institute/portfolio/student-name
```

### Embeddable Widget

```html
<iframe src="https://bhavya.institute/embed/portfolio/student-id" />
```

### PDF Export

- Formatted resume-style document
- Includes all items and feedback
- Verifiable QR code

### LinkedIn Integration

- Automatic skill import
- Project links
- Certificate badges

---

## Portfolio Review

### Self-Review

Student evaluates their own portfolio:

- Completeness
- Quality
- Presentation
- Gaps

### Peer Review

Peers review the portfolio:

- Clarity of presentation
- Quality of work
- Skill demonstration
- Improvement suggestions

### Mentor Review

Mentor provides comprehensive review:

- Competency validation
- Career readiness
- Growth areas
- Recommendations

---

## Portfolio Metrics

| Metric         | Description                       |
| -------------- | --------------------------------- |
| Items          | Number of portfolio pieces        |
| Average Score  | Average score across items        |
| Skill Coverage | Percentage of skills demonstrated |
| Feedback Count | Number of reviews received        |
| Last Updated   | When portfolio was last modified  |
| Views          | Number of portfolio views         |
| Endorsements   | Number of peer endorsements       |
