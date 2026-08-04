# Assessment Model

Multiple assessment types with AI-assisted and instructor-reviewed evaluation.

---

## Assessment Types

### 1. Knowledge Quiz

**Purpose:** Verify comprehension of concepts.

**Format:**

- Multiple choice
- True/False
- Short answer
- Matching
- Fill in the blank

**Scoring:**

- Automatic grading for objective questions
- AI grading for short answer
- Manual review for complex responses

**Retake policy:**

- 3 attempts allowed
- 24-hour cooldown between attempts
- Each attempt draws from question pool
- Best score counts

**Question source:** Knowledge Packages (spaced repetition)

---

### 2. Prompt Challenge

**Purpose:** Evaluate prompt engineering skills.

**Format:**

- Task description
- Constraints
- Evaluation criteria

**Scoring:**

- AI evaluates output quality
- Criteria-based rubric
- Peer review optional

**Example:**

```yaml
task: "Write a prompt that extracts key information from a resume"
constraints:
  - "Must use structured output"
  - "Must handle missing fields"
  - "Must work for any industry"
evaluation:
  criteria:
    - name: "Accuracy"
      weight: 30
      description: "Extracts correct information"
    - name: "Completeness"
      weight: 25
      description: "Handles all field types"
    - name: "Robustness"
      weight: 25
      description: "Works with edge cases"
    - name: "Efficiency"
      weight: 20
      description: "Uses minimal tokens"
```

---

### 3. Code Review

**Purpose:** Evaluate coding skills and AI integration.

**Format:**

- Submit code for a task
- AI reviews code quality
- AI reviews AI integration
- Mentor reviews if needed

**Scoring:**

- Automated tests (correctness)
- AI code review (quality)
- AI architecture review (design)
- Manual review (advanced)

**Review dimensions:**

- Correctness
- Code quality
- Error handling
- AI integration quality
- Testing
- Documentation

---

### 4. Architecture Review

**Purpose:** Evaluate system design decisions.

**Format:**

- Design a system
- Document decisions
- Explain trade-offs
- Present to mentor

**Scoring:**

- AI evaluates documentation
- Mentor evaluates design
- Peer review optional

**Review dimensions:**

- Problem decomposition
- Component design
- Interface design
- Trade-off analysis
- Scalability considerations

---

### 5. Project Evaluation

**Purpose:** Assess integrated skills through real projects.

**Format:**

- Build a complete project
- Document decisions
- Demonstrate functionality
- Reflect on learning

**Scoring:**

- Automated tests
- AI code review
- AI project evaluation
- Mentor review
- Peer review

**Evaluation criteria:**

- Functionality
- Code quality
- Architecture
- Documentation
- Testing
- Deployment
- Reflection quality

---

### 6. Peer Review

**Purpose:** Build community and practice giving feedback.

**Format:**

- Review a peer's work
- Provide structured feedback
- Discuss improvements

**Scoring:**

- Quality of feedback given
- Constructiveness
- Actionability
- Professionalism

**Review structure:**

```yaml
peerReview:
  sections:
    - title: "What works well"
      minWords: 50
    - title: "Areas for improvement"
      minWords: 50
    - title: "Specific suggestions"
      minWords: 50
    - title: "Questions for the author"
      minWords: 30
```

---

### 7. Reflection

**Purpose:** Develop metacognition and self-awareness.

**Format:**

- Respond to reflection prompts
- Document learning process
- Identify growth areas

**Scoring:**

- Completion (did they reflect?)
- Depth (how thoughtful?)
- Insight (what did they learn?)
- Action (what will they do differently?)

**Prompts:**

- What was the most challenging part?
- What would you do differently?
- How does this connect to previous learning?
- What questions do you still have?

---

### 8. Portfolio Review

**Purpose:** Assess cumulative learning.

**Format:**

- Curate best work
- Write reflections for each piece
- Present to mentor

**Scoring:**

- Breadth of skills demonstrated
- Depth of understanding
- Quality of work
- Growth over time
- Presentation quality

---

### 9. Certification Exam

**Purpose:** Final competency verification.

**Format:**

- Multi-part exam
- Theory questions
- Practical challenges
- Time-limited

**Scoring:**

- AI grading for objective parts
- Mentor grading for subjective parts
- Must pass all sections

**Sections:**

1. Knowledge assessment (30%)
2. Prompt challenges (20%)
3. Code review (20%)
4. Architecture design (20%)
5. Reflection (10%)

---

## Evaluation Modes

### AI-Assisted Evaluation

**When to use:**

- Objective questions
- Code correctness
- Output quality
- Pattern matching

**How it works:**

1. Student submits work
2. AI evaluates against rubric
3. AI provides detailed feedback
4. Score is recorded
5. Student can request human review

**Confidence threshold:** 85% — below this, human review required.

---

### Instructor-Reviewed Evaluation

**When to use:**

- Subjective assessments
- Architecture decisions
- Creative work
- Disputed AI scores
- Certification exams

**How it works:**

1. Student submits work
2. AI provides preliminary evaluation
3. Instructor reviews
4. Final score recorded
5. Feedback provided

---

### Peer-Reviewed Evaluation

**When to use:**

- Code reviews
- Project presentations
- Documentation quality
- Community contributions

**How it works:**

1. Work is assigned to 2-3 peers
2. Each peer evaluates independently
3. Scores are averaged
4. Outliers are flagged
5. Instructor resolves disputes

---

## Scoring System

### Competency Levels

| Level | Score  | Description                        |
| ----- | ------ | ---------------------------------- |
| 1     | 0-20   | Novice — needs significant support |
| 2     | 21-40  | Beginner — developing basic skills |
| 3     | 41-60  | Competent — can work independently |
| 4     | 61-80  | Proficient — can handle complexity |
| 5     | 81-100 | Expert — can teach others          |

### Grade Calculation

```
Module Grade = Average(Assessment Scores)
Track Grade = Average(Module Grades)
Course Grade = Average(Track Grades)
Overall Grade = Weighted Average(Course Grades)
```

### Passing Criteria

- Individual assessments: ≥ 60%
- Module: ≥ 65%
- Track: ≥ 70%
- Course: ≥ 75%
- Certification: ≥ 80%

---

## Feedback Model

### AI Feedback

```yaml
feedback:
  type: "assessment"
  score: 85
  dimensions:
    - name: "Correctness"
      score: 90
      feedback: "All tests pass. Code handles edge cases well."
    - name: "Code Quality"
      score: 80
      feedback: "Clean code. Consider extracting the validation logic."
    - name: "AI Integration"
      score: 85
      feedback: "Good prompt design. Could optimize token usage."
  overallFeedback: "Strong work. The architecture is solid."
  suggestions:
    - "Extract validation into a separate function"
    - "Add more edge case tests"
    - "Consider adding retry logic"
```

### Mentor Feedback

```yaml
feedback:
  type: "mentor"
  mentor: "mentor-id"
  dimensions:
    - name: "Architecture"
      score: 4
      feedback: "Good component separation. Consider..."
    - name: "Problem Solving"
      score: 5
      feedback: "Excellent approach to the challenge..."
  overallFeedback: "Impressive growth since last assessment."
  actionItems:
    - "Read about design patterns for next project"
    - "Practice explaining technical decisions"
```

### Peer Feedback

```yaml
feedback:
  type: "peer"
  reviewer: "peer-id"
  sections:
    - title: "What works well"
      content: "The API design is clean and intuitive..."
    - title: "Areas for improvement"
      content: "Error handling could be more robust..."
    - title: "Suggestions"
      content: "Consider adding retry logic for..."
```

---

## Retake Policy

### Quizzes

- 3 attempts allowed
- 24-hour cooldown
- Random question pool
- Best score counts

### Prompt Challenges

- 2 attempts allowed
- Must address feedback from first attempt
- Different constraints on second attempt

### Code Reviews

- 1 resubmission allowed
- Must address all feedback
- Full re-evaluation

### Projects

- 1 revision allowed
- Must address mentor feedback
- Partial re-evaluation

### Certification Exam

- 2 attempts allowed
- 30-day cooldown
- Must complete remediation first

---

## Anti-Cheating

### Measures

- Unique question pools per student
- Time limits on assessments
- Randomized parameters
- AI detection of copied work
- Viva voce for suspicious submissions

### Philosophy

- Trust but verify
- Focus on learning, not punishment
- Give benefit of the doubt
- Use as teaching moment
