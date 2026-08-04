# Mentor Model

AI-human collaboration for student guidance.

---

## Mentor Roles

### 1. Learning Mentor

- Guides students through curriculum
- Explains concepts
- Provides encouragement
- Reviews progress

### 2. Project Mentor

- Reviews project work
- Provides technical feedback
- Suggests improvements
- Validates competency

### 3. Career Mentor

- Discusses career paths
- Provides industry perspective
- Reviews portfolio
- Makes introductions

### 4. Community Mentor

- Facilitates discussions
- Organizes events
- Connects students
- Builds community

---

## AI Mentor Capabilities

### Reuse Existing AI Platform

**Do not create a separate AI subsystem.** The AI Institute uses the existing Bhavya AI platform.

### Core Capabilities

| Capability           | Description                | When to Use         |
| -------------------- | -------------------------- | ------------------- |
| Explain Lesson       | Break down concepts        | During lessons      |
| Answer Questions     | Respond to student queries | Anytime             |
| Review Code          | Evaluate code quality      | Lab submissions     |
| Review Prompts       | Evaluate prompt quality    | Prompt challenges   |
| Recommend Resources  | Suggest learning materials | Self-study          |
| Generate Hints       | Provide progressive hints  | When stuck          |
| Evaluate Projects    | Assess project quality     | Project submissions |
| Suggest Improvements | Recommend enhancements     | After evaluation    |
| Encourage Reflection | Prompt metacognition       | After activities    |

### AI Mentor Configuration

```yaml
aiMentor:
  personality: "supportive" # supportive, challenging, Socratic
  hintStyle: "progressive" # progressive, direct, Socratic
  feedbackStyle: "detailed" # detailed, concise, Socratic
  evaluationCriteria:
    - "Correctness"
    - "Code quality"
    - "Problem-solving approach"
    - "Learning demonstration"
```

### AI Mentor Interactions

#### During Lessons

```yaml
interaction:
  trigger: "student asks question"
  aiAction: "explain concept"
  response:
    - "Provide clear explanation"
    - "Use analogies"
    - "Give examples"
    - "Check understanding"
```

#### During Labs

```yaml
interaction:
  trigger: "student is stuck"
  aiAction: "provide hint"
  response:
    - "Analyze what student tried"
    - "Identify the gap"
    - "Provide progressive hint"
    - "Encourage persistence"
```

#### During Projects

```yaml
interaction:
  trigger: "student submits work"
  aiAction: "evaluate and provide feedback"
  response:
    - "Evaluate against rubric"
    - "Provide specific feedback"
    - "Suggest improvements"
    - "Recognize strengths"
```

---

## Human Mentor Responsibilities

### Weekly Activities

- Review student progress
- Conduct office hours
- Provide career guidance
- Review project submissions

### Monthly Activities

- Deep portfolio review
- Career path discussion
- Industry perspective sharing
- Student growth assessment

### Quarterly Activities

- Comprehensive progress review
- Learning path adjustment
- Mentor training
- Curriculum feedback

---

## Mentor-Student Relationship

### Assignment

- Students are assigned a mentor based on:
  - Learning path
  - Career interests
  - Mentor availability
  - Timezone compatibility

### Communication

- Weekly check-in (async)
- Bi-weekly office hours (live)
- Ad-hoc questions (async)
- Project reviews (async + live)

### Boundaries

- Mentors guide, don't solve
- Mentors encourage, don't pressure
- Mentors suggest, don't mandate
- Mentors model, don't lecture

---

## Office Hours

### Structure

```yaml
officeHours:
  mentor: "mentor-id"
  schedule: "Wednesdays 2-3 PM EST"
  format: "group"
  maxAttendees: 10
  topics:
    - "Open Q&A"
    - "Project reviews"
    - "Career discussions"
  recording: true
  notes: true
```

### Booking

- Students book slots in advance
- Can submit questions beforehand
- Walk-ins allowed if space available
- Recording available for those who can't attend

---

## Feedback Model

### Timely

- Lab feedback: within 24 hours
- Project feedback: within 48 hours
- Career guidance: within 1 week
- General questions: within 12 hours

### Constructive

- Start with what works
- Identify specific improvements
- Provide actionable suggestions
- Encourage growth

### Specific

- Reference specific code/decisions
- Explain why something works/doesn't
- Compare to best practices
- Connect to learning objectives

---

## Mentor Metrics

| Metric                  | Target       |
| ----------------------- | ------------ |
| Response time           | < 12 hours   |
| Office hours attendance | ≥ 5 students |
| Student satisfaction    | ≥ 4.5/5      |
| Student completion rate | ≥ 70%        |
| Feedback quality        | ≥ 4/5        |
| Mentor availability     | ≥ 90%        |

---

## Mentor Development

### Training

- Onboarding program (2 weeks)
- Monthly skill workshops
- Peer learning sessions
- Conference attendance support

### Recognition

- Mentor of the month
- Student testimonials
- Professional development budget
- Conference speaking opportunities

### Growth

- Learning Mentor → Project Mentor → Career Mentor → Lead Mentor
- Specialization tracks
- Curriculum contribution opportunities
- Research collaboration
