# Content Model

What every lesson should support.

---

## Lesson Structure

Every lesson is a Knowledge Package. It must contain:

### Required Fields

| Field         | Type      | Description                              |
| ------------- | --------- | ---------------------------------------- |
| id            | string    | Unique identifier                        |
| title         | string    | Clear, descriptive title                 |
| description   | string    | What the student will learn              |
| objectives    | list      | Learning outcomes (3-5)                  |
| prerequisites | list      | What must be known before                |
| estimatedTime | number    | Minutes to complete                      |
| difficulty    | enum      | beginner, intermediate, advanced, expert |
| module        | reference | Parent module                            |
| track         | reference | Parent track                             |
| version       | string    | Semantic version                         |

### Content Sections

#### Reading

```yaml
reading:
  - title: "Section title"
    content: "Markdown content"
    codeBlocks:
      - language: "typescript"
        code: "actual code"
        explanation: "What this code does"
    images:
      - url: "path/to/image"
        alt: "Description"
        caption: "Context"
```

#### Video

```yaml
video:
  - title: "Video title"
    url: "video URL"
    duration: 300 # seconds
    transcript: "full transcript"
    chapters:
      - title: "Chapter 1"
        timestamp: 0
      - title: "Chapter 2"
        timestamp: 120
```

#### Interactive Explanation

```yaml
interactive:
  type: "playground" | "sandbox" | "visualization"
  config:
    # Type-specific configuration
    language: "typescript"
    initialCode: "// Starting code"
    expectedOutput: "Expected result"
```

### Code Examples

```yaml
codeExamples:
  - title: "Example title"
    description: "What this demonstrates"
    language: "typescript"
    code: |
      // Full code example
      const result = await ai.complete({
        prompt: "Hello",
      });
    explanation: "Line-by-line explanation"
    variations:
      - title: "Variation 1"
        code: "// Modified version"
        description: "What changed and why"
```

### Labs

```yaml
labs:
  - id: "lab-1"
    title: "Lab title"
    description: "What the student will build"
    type: "guided" | "semi-guided" | "open"
    estimatedTime: 60
    objectives:
      - "Specific skill practiced"
    instructions:
      - step: 1
        action: "Do this"
        expected: "This should happen"
    validation:
      type: "tests" | "output" | "manual"
      checks:
        - description: "What to verify"
          type: "automated" | "peer" | "mentor"
    hints:
      - level: 1
        content: "Subtle hint"
      - level: 2
        content: "More direct hint"
      - level: 3
        content: "Almost giving it away"
```

### Prompt Challenges

```yaml
promptChallenges:
  - title: "Challenge title"
    description: "What the student should achieve"
    task: "Specific instruction"
    constraints:
      - "Cannot use more than 100 tokens"
      - "Must include system message"
    evaluation:
      criteria:
        - name: "Accuracy"
          weight: 30
        - name: "Creativity"
          weight: 20
        - name: "Efficiency"
          weight: 20
        - name: "Clarity"
          weight: 30
    sampleSolutions:
      - title: "Basic solution"
        prompt: "Example prompt"
        output: "Expected output"
        explanation: "Why this works"
```

### Knowledge Checks

```yaml
knowledgeChecks:
  - type: "quiz"
    questions:
      - question: "What is...?"
        type: "multiple-choice"
        options:
          - "Option A"
          - "Option B"
          - "Option C"
          - "Option D"
        correct: 0
        explanation: "Why this is correct"
        knowledgePackage: "kp-123"
  - type: "reflection"
    prompt: "Explain in your own words..."
    minLength: 100
    rubric:
      - "Uses correct terminology"
      - "Provides examples"
      - "Connects to previous concepts"
```

### Knowledge Package References

```yaml
knowledgePackages:
  - id: "kp-123"
    title: "Related concept"
    relevance: "This lesson builds on this concept"
    required: true # or false for optional
  - id: "kp-456"
    title: "Advanced concept"
    relevance: "This lesson prepares for this concept"
    required: false
```

### Repository References

```yaml
repositoryReferences:
  - name: "Project name"
    url: "https://github.com/org/repo"
    relevance: "Real-world example of this concept"
    difficulty: "intermediate"
    contributionGuide: "How to contribute"
```

### MCP References

```yaml
mcpReferences:
  - name: "MCP Server name"
    url: "https://github.com/org/mcp-server"
    relevance: "This lesson uses this server"
    setup: "How to install and configure"
```

### Assessments

```yaml
assessments:
  - type: "quiz"
    title: "Knowledge check"
    passingScore: 80
    timeLimit: 15 # minutes, optional
    retakes: 3
    drawFrom:
      knowledgePackages:
        - "kp-123"
        - "kp-456"
  - type: "promptChallenge"
    title: "Apply what you learned"
    rubric: "rubric-123"
  - type: "codeReview"
    title: "Build and submit"
    rubric: "rubric-456"
```

### Reflection

```yaml
reflection:
  prompt: "What did you learn in this lesson?"
  followUp:
    - "How does this connect to what you already knew?"
    - "What was the most challenging part?"
    - "How would you explain this to someone else?"
  minLength: 100
  mentorReview: false # or true for mentor feedback
```

### Mentor Notes

```yaml
mentorNotes:
  commonPitfalls:
    - "Students often confuse X with Y"
    - "This concept is frequently misunderstood"
  teachingTips:
    - "Use this analogy to explain..."
    - "Connect to real-world example..."
  discussionPrompts:
    - "Ask students to share their approach to..."
    - "Have students compare their solutions to..."
```

### Student Notes

```yaml
studentNotes:
  enabled: true
  prompts:
    - "What's your key takeaway?"
    - "What questions do you still have?"
    - "How will you apply this?"
```

### Revision History

```yaml
revisionHistory:
  - version: "1.0.0"
    date: "2026-08-04"
    changes: ["Initial version"]
    author: "Author name"
  - version: "1.1.0"
    date: "2026-08-11"
    changes: ["Added new lab", "Updated assessment"]
    author: "Author name"
    reviewStatus: "approved"
```

---

## Metadata

```yaml
metadata:
  createdAt: "2026-08-04T10:00:00Z"
  updatedAt: "2026-08-04T10:00:00Z"
  author: "Author name"
  reviewers:
    - "Reviewer name"
  status: "draft" | "review" | "published" | "archived"
  tags:
    - "prompt-engineering"
    - "beginner"
  estimatedReadTime: 15
  wordCount: 2500
```

---

## Validation Rules

Every lesson must:

1. Have at least 3 learning objectives
2. Include at least one hands-on exercise
3. Reference at least one Knowledge Package
4. Pass accessibility review
5. Pass AI review
6. Pass educational review
7. Have a reflection prompt
8. Have estimated time
9. Have difficulty level
10. Have prerequisites listed
