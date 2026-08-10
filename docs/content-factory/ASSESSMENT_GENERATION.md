# Assessment Generation

## Overview

Assessments verify learning. Every assessment ties back to competencies defined in the Knowledge Package.

## Assessment Types

### Quiz

- Multiple choice
- True/False
- Short answer
- Code completion
- Concept matching

### Prompt Challenge

- Specific prompt task
- Expected output
- Evaluation criteria
- Iteration guidance

### Code Review

- Code quality assessment
- Best practices verification
- Architecture evaluation
- Documentation review

### Architecture Review

- System design evaluation
- Trade-off analysis
- Scalability assessment
- Maintainability review

### Project Review

- Feature completeness
- Code quality
- Documentation
- Impact assessment
- Portfolio value

### Reflection

- Learning documentation
- Growth evidence
- Self-assessment
- Future planning

### Peer Discussion

- Knowledge sharing
- Perspective building
- Communication practice
- Community building

## Generation Process

### Input

- Knowledge Package
- Learning objectives
- Competency requirements
- Student skill level
- Assessment context

### Process

1. **Parse Knowledge Package** — Extract learning objectives
2. **Identify Competencies** — Map to assessable skills
3. **Design Questions** — Create assessment items
4. **Create Rubrics** — Define evaluation criteria
5. **Add Feedback** — Create explanatory responses
6. **Review** — Verify quality and alignment

### Output

- Complete assessment with all questions
- Rubrics for each question
- Feedback for each answer
- Scoring guide
- Competency mapping

## Assessment Quality

### Standards

- **Valid** — Measures what it claims to measure
- **Reliable** — Consistent results across evaluators
- **Fair** — Equitable for all students
- **Transparent** — Clear expectations and criteria
- **Actionable** — Provides clear next steps

### Metrics

- Assessment completion rate
- Score distribution
- Question analysis
- Student feedback
- Learning outcomes

## Example Assessment

### Quiz: What is an LLM?

**Question 1:**
What does LLM stand for?

- A) Large Language Model ✓
- B) Linear Learning Machine
- C) Logical Language Method
- D) Limited Learning Model

**Feedback:**
LLM stands for Large Language Model. These models are "large" because they have billions of parameters and are trained on massive amounts of text data.

**Question 2:**
True or False: LLMs understand language like humans do.

- A) True
- B) False ✓

**Feedback:**
False. LLMs don't understand language like humans. They predict the next token based on patterns learned during training. They don't have comprehension or consciousness.

**Question 3:**
What determines how much text an LLM can remember?

- A) Temperature
- B) Token count
- C) Context window ✓
- D) Model size

**Feedback:**
The context window determines how much text an LLM can process at once. It includes both the input and output tokens.

**Question 4:**
What does temperature control in an LLM?

- A) Processing speed
- B) Memory usage
- C) Creativity/randomness ✓
- D) Accuracy

**Feedback:**
Temperature controls the randomness of the output. Lower temperature makes output more deterministic, higher temperature makes it more creative and random.

**Question 5:**
Which is a best practice when working with LLMs?

- A) Use vague prompts
- B) Never iterate on prompts
- C) Always verify outputs ✓
- D) Trust all LLM responses

**Feedback:**
Always verify LLM outputs. LLMs can hallucinate, make mistakes, and have knowledge cutoffs. Verification is essential for reliable use.

### Prompt Challenge: Explain LLMs

**Task:**
Write a prompt that explains what an LLM is to a 10-year-old.

**Expected Output:**

- Simple language
- Relatable analogy
- Key concepts covered
- Engaging and fun

**Evaluation Criteria:**

- Clarity (1-5)
- Accuracy (1-5)
- Engagement (1-5)
- Age-appropriateness (1-5)

**Example Response:**
"An LLM is like a really smart autocomplete. It's read millions of books and articles, and it's really good at guessing what word comes next. When you ask it a question, it uses all that reading to generate an answer. It's not actually thinking like you do — it's just really good at pattern matching!"

### Code Review: LLM API Call

**Code:**

```python
import openai

openai.api_key = "sk-..."

response = openai.Completion.create(
    engine="text-davinci-003",
    prompt="Explain quantum computing",
    temperature=0.7,
    max_tokens=150
)

print(response.choices[0].text)
```

**Evaluation Criteria:**

- Code quality (1-5)
- Best practices (1-5)
- Error handling (1-5)
- Documentation (1-5)

**Feedback:**

- Good: Uses environment variable for API key
- Good: Sets appropriate temperature
- Good: Limits max tokens
- Improvement: Add error handling
- Improvement: Add comments
- Improvement: Use more descriptive variable names

## Assessment Generation Rules

### From Knowledge Package → Assessment

- Extract learning objectives
- Map to competencies
- Design questions
- Create rubrics
- Add feedback
- Verify alignment

### Question Types

- **Recall** — Tests memory of facts
- **Understanding** — Tests comprehension
- **Application** — Tests use of knowledge
- **Analysis** — Tests breakdown of concepts
- **Evaluation** — Tests judgment and critique
- **Creation** — Tests original work

### Difficulty Levels

- **Beginner** — Basic recall and understanding
- **Intermediate** — Application and analysis
- **Advanced** — Evaluation and creation
- **Expert** — Complex creation and critique

### Feedback Quality

- **Immediate** — Provided right away
- **Specific** — Addresses the exact issue
- **Constructive** — Provides improvement path
- **Encouraging** — Motivates continued learning
- **Comprehensive** — Covers all aspects
