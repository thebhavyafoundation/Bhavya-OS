# Competency Framework

Skill tracking and progression system.

---

## Competency Levels

| Level | Name       | Description        | Evidence              |
| ----- | ---------- | ------------------ | --------------------- |
| 1     | Novice     | Aware of concept   | Can identify          |
| 2     | Beginner   | Understands basics | Can explain           |
| 3     | Competent  | Can apply          | Can use in practice   |
| 4     | Proficient | Can analyze        | Can teach others      |
| 5     | Expert     | Can create         | Can advance the field |

---

## Skill Domains

### AI Fundamentals

- AI literacy
- LLM mechanics
- Tokenization
- Context windows
- Prompt engineering

### Prompt Engineering

- Basic prompts
- Chain-of-thought
- Few-shot learning
- System messages
- Prompt optimization
- Evaluation

### Agent Engineering

- Agent architectures
- Tool integration
- State management
- Multi-agent systems
- MCP servers

### Automation

- Workflow design
- Browser automation
- Data pipelines
- CI/CD
- Monitoring

### Development

- Programming (TypeScript/Python)
- API design
- Testing
- Debugging
- Version control

### Architecture

- System design
- Component design
- Interface design
- Scalability
- Performance

### Product

- User research
- MVP design
- Iteration
- Metrics
- Ethics

### Community

- Open source contribution
- Code review
- Documentation
- Mentoring
- Leadership

---

## Skill Assessment

### Direct Assessment

- Lab completion
- Project evaluation
- Certification exam
- Peer review

### Indirect Assessment

- Code quality metrics
- Contribution history
- Portfolio quality
- Community participation

### AI-Assisted Assessment

- Code review analysis
- Prompt quality evaluation
- Architecture review
- Portfolio review

---

## Skill Progression

```
Awareness → Understanding → Application → Analysis → Creation
    ↓           ↓              ↓            ↓          ↓
  Identify    Explain        Use        Teach     Advance
```

### Triggers for Level Up

- Completed assessment at higher level
- Demonstrated in real project
- Taught others successfully
- Created novel solution

### Triggers for Level Down

- Extended inactivity (6+ months)
- Failed reassessment
- Self-report of skill decay

---

## Skill Mapping

### To Curriculum

| Skill              | Foundation | Core AI  | Agent Eng  | Automation | Product    |
| ------------------ | ---------- | -------- | ---------- | ---------- | ---------- |
| Prompt Engineering | Basic      | Advanced | Expert     | Proficient | Proficient |
| Agent Building     | -          | Basic    | Expert     | Proficient | Competent  |
| Automation         | -          | Basic    | Competent  | Expert     | Proficient |
| Architecture       | -          | -        | Proficient | Competent  | Proficient |
| Product Thinking   | -          | -        | -          | Competent  | Expert     |

### To Careers

| Skill              | AI Engineer | AI Product | AI Ops     | AI Research |
| ------------------ | ----------- | ---------- | ---------- | ----------- |
| Prompt Engineering | Expert      | Proficient | Competent  | Proficient  |
| Agent Building     | Expert      | Competent  | Proficient | Expert      |
| Automation         | Proficient  | Proficient | Expert     | Competent   |
| Architecture       | Proficient  | Competent  | Proficient | Expert      |
| Product Thinking   | Competent   | Expert     | Competent  | Competent   |

---

## Competency Report

```yaml
competencyReport:
  student: "student-id"
  generatedAt: "2026-08-04"
  overallLevel: 3.5
  skills:
    - domain: "Prompt Engineering"
      level: 4
      evidence:
        - "Completed prompt engineering lab (score: 92)"
        - "Prompt challenge: 88/100"
        - "Peer review: 4.5/5"
      nextLevel:
        requirements:
          - "Complete advanced prompt engineering lab"
          - "Mentor 3 students on prompt design"
          - "Write a prompt engineering guide"
    - domain: "Agent Building"
      level: 3
      evidence:
        - "Completed agent building lab (score: 85)"
        - "Mini project: 82/100"
      nextLevel:
        requirements:
          - "Build production-quality agent"
          - "Contribute to agent framework"
  recommendations:
    - "Focus on agent building to advance"
    - "Consider mentoring to solidify prompt skills"
    - "Portfolio needs more agent projects"
```
