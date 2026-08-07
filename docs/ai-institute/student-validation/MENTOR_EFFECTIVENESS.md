# Mentor Effectiveness Review

## The AI Mentor

### What Exists

Two separate mentor systems:

1. **Welcome Screen Mentor** — Static text: "Hello! I'm here to help you explore AI by doing, not just reading."
2. **AIMentor Class** — Logic that generates coaching responses based on experiment metrics
3. **MockProvider** — Generates AI responses based on prompt quality scoring

### Critical Finding: The Mentor and the Provider Are Disconnected

The `AIMentor` class exists in `packages/learning-runtime/src/mentor/mentor.ts` but is **never called** by the `AIPlayground` component or the `usePlayground` hook.

The `AIPlayground` displays `mentorFeedback` from the hook, but the hook uses the `MockProvider` to generate responses, not the `AIMentor`.

**The mentor is not actually coaching. The AI is just responding to prompts.**

---

## Mentor Behavior Analysis

### Does It Coach?

**NO.** The MockProvider responds to prompts with score-based feedback, but it doesn't coach. It says things like "Your prompt scored 20/100" which is judgment, not coaching.

### Does It Question?

**NO.** The MockProvider doesn't ask questions. It gives instructions: "Try adding: What specifically you want to know."

### Does It Challenge?

**PARTIALLY.** The mentor feedback box in the playground says "Is this what you wanted? What is missing?" but this is static text, not dynamic coaching.

### Does It Encourage?

**NO.** The MockProvider says "I'd like to help, but I need more information" which is polite but not encouraging.

### Does It Celebrate?

**NO.** When the student gets a high score, the MockProvider says "Excellent prompt!" but this is rarely seen because the scoring is hard to achieve.

### Does It Promote Experimentation?

**NO.** The student is told to retry but given no guidance on what to try differently.

### Does It Prevent Dependency?

**NO.** The student is not taught to think independently. They're taught to follow instructions to get a higher score.

---

## What the Mentor Should Do

### Pattern 1: First Attempt

```
Student: "Explain AI to a 12 year old"
Mentor: "Interesting! You're asking AI to explain something.
        What happened when you tried that?
        What would you change?"
```

### Pattern 2: Improvement

```
Student: "Explain AI to a 12 year old using simple words and examples"
Mentor: "I notice you added more detail.
        What effect did that have?
        Try being even more specific about who the 12-year-old is."
```

### Pattern 3: Reflection

```
Student: "It worked better because I was specific"
Mentor: "That's a great insight.
        Specificity is one of the most powerful prompt techniques.
        What other techniques might work?"
```

---

## Recommendations

### 1. Connect the AIMentor to the Playground

The `usePlayground` hook should call `AIMentor.coach()` after each experiment and display the response.

### 2. Replace Score-Based Feedback with Coaching

Instead of "Your prompt scored 20/100", say "Your prompt is short. What if you added who this is for?"

### 3. Add Question-Driven Coaching

The mentor should ask questions, not give answers. "What would happen if...?" is better than "Try adding..."

### 4. Celebrate Progress

When the student improves, say "You went from X to Y. That's real progress."

### 5. Make the Mentor Visible

The mentor should be a persistent presence, not a static box that appears once.

---

## Score: 2/10

The mentor exists in code but not in experience. The student interacts with a scoring system, not a coach.
