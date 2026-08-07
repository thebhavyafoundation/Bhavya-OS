# Playground Architecture — AI Learning Sandbox

**Date:** 2026-08-04
**Purpose:** Reusable sandbox component for every lesson

---

## What Is the AI Playground?

The AI Playground is a reusable component that enables students to interact with AI in every lesson. It is not a code editor. It is not an IDE. It is a **learning instrument**.

---

## Playground Layout

```
┌─────────────────────────────────────────────────────────────┐
│ AI Playground                                    [History] [Compare] │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Your Prompt                                            │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Write your prompt here...                          │ │ │
│ │ │                                                     │ │ │
│ │ │                                                     │ │ │
│ │ │                                                     │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │ [Run Prompt] [Clear] [Save to History]                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ AI Output                                             │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ The AI response will appear here...                │ │ │
│ │ │                                                     │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │ [Copy] [Save as Artifact] [Improve Prompt]            │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Reflection                                            │ │
│ │ What changed in your prompt?                          │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │                                                     │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │ What surprised you about the output?                  │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │                                                     │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │ [Save Reflection]                                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ AI Mentor Feedback                                    │ │
│ │ "I notice your prompt lacks constraints. What         │ │
│ │  happens if you specify the audience?"                │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Playground States

### 1. Empty State

- Prompt input empty
- Output panel empty
- Reflection hidden
- Mentor feedback hidden

### 2. Prompt Entered

- Prompt input has content
- "Run Prompt" button enabled
- Output panel empty
- Reflection hidden

### 3. Running

- Prompt input disabled
- Loading indicator
- Output panel shows spinner

### 4. Output Received

- Output panel shows AI response
- Reflection form appears
- Mentor feedback appears
- "Improve Prompt" button enabled

### 5. Reflected

- Reflection saved
- "Save to History" button enabled
- Comparison view enabled

### 6. History

- List of all attempts
- Select two to compare
- Best attempt highlighted

---

## Component Structure

```
AIPlayground
├── PromptInput
│   ├── TextArea (with syntax highlighting)
│   ├── RunButton
│   ├── ClearButton
│   └── SaveButton
├── OutputPanel
│   ├── OutputDisplay (formatted)
│   ├── CopyButton
│   ├── SaveArtifactButton
│   └── ImprovePromptButton
├── ReflectionForm
│   ├── WhatChangedInput
│   ├── WhatSurprisedInput
│   ├── SaveReflectionButton
│   └── ReflectionHistory
├── MentorFeedback
│   ├── FeedbackDisplay
│   └── FeedbackActions
├── ExperimentHistory
│   ├── AttemptList
│   ├── SelectForComparison
│   └── BestAttemptHighlight
└── ComparisonView
    ├── SideBySideDisplay
    ├── DiffHighlight
    └── ImprovementMetrics
```

---

## Mock AI Provider

For Slice 2, the playground uses a Mock AI Provider that simulates AI responses.

```typescript
class MockAIProvider implements AIProvider {
  name = "mock";

  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    const prompt = request.messages[request.messages.length - 1].content;

    // Simulate AI response based on prompt analysis
    const response = this.generateMockResponse(prompt);

    return {
      content: response,
      usage: {
        promptTokens: prompt.split(" ").length,
        completionTokens: response.split(" ").length,
      },
      model: "mock-v1",
    };
  }

  private generateMockResponse(prompt: string): string {
    const wordCount = prompt.split(" ").length;
    const hasStructure = prompt.includes(":") || prompt.includes(".");
    const hasSpecifics = prompt.length > 50;

    // Simulate improving responses based on prompt quality
    if (wordCount < 5) {
      return "I need more details to help you effectively. Could you tell me what you're trying to accomplish?";
    }

    if (!hasStructure) {
      return (
        "I can help with that! Let me provide a response based on your request...\n\n" +
        "To give you a better answer, try structuring your prompt with:\n" +
        "1. What you want me to do\n" +
        "2. Any constraints or requirements\n" +
        "3. The format you'd like the response in"
      );
    }

    if (!hasSpecifics) {
      return (
        "Here's my response to your request:\n\n" +
        "[Simulated AI output based on your prompt]\n\n" +
        "To improve this, consider:\n" +
        "- Being more specific about what you want\n" +
        "- Defining the audience\n" +
        "- Providing examples of expected output"
      );
    }

    return (
      "Excellent prompt! Here's my response:\n\n" +
      "[High-quality simulated AI output based on your well-structured prompt]\n\n" +
      "This is a strong response because you:\n" +
      "- Clearly stated what you wanted\n" +
      "- Provided necessary context\n" +
      "- Specified the format\n\n" +
      "To make it even better, try:\n" +
      "- Adding an example of the output you want\n" +
      "- Specifying the tone or style\n" +
      "- Including edge cases to handle"
    );
  }
}
```

---

## Experiment History View

```
┌─────────────────────────────────────────────────────────────┐
│ Experiment History                              [Best: #3]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ #1 (2 minutes ago)                    Score: 40/100        │
│ Prompt: "Explain AI"                                       │
│ Output: "I need more details..."                           │
│ [Select for comparison]                                    │
│                                                             │
│ #2 (1 minute ago)                     Score: 65/100        │
│ Prompt: "Explain AI to a beginner with examples"           │
│ Output: "AI is the ability of machines..."                 │
│ [Select for comparison]                                    │
│                                                             │
│ #3 (30 seconds ago)                   Score: 85/100 ⭐     │
│ Prompt: "Explain AI to a 12-year-old using analogies..."   │
│ Output: "Imagine you have a robot friend..."               │
│ [Select for comparison] [View Full]                        │
│                                                             │
│ Improvement: +110% from attempt #1 to #3                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Comparison View

```
┌─────────────────────────────────────────────────────────────┐
│ Comparing Attempt #1 vs Attempt #3                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Prompt Comparison                                          │
│ ┌─────────────────────┐ ┌─────────────────────┐            │
│ │ #1: "Explain AI"   │ │ #3: "Explain AI to  │            │
│ │                     │ │ a 12-year-old using │            │
│ │                     │ │ analogies..."       │            │
│ └─────────────────────┘ └─────────────────────┘            │
│                                                             │
│ Output Comparison                                          │
│ ┌─────────────────────┐ ┌─────────────────────┐            │
│ │ #1: "I need more   │ │ #3: "Imagine you    │            │
│ │ details..."         │ │ have a robot friend │            │
│ │                     │ │ who learns from..." │            │
│ └─────────────────────┘ └─────────────────────┘            │
│                                                             │
│ Improvement Metrics                                        │
│ • Prompt length: +340%                                     │
│ • Specificity: Vague → Specific                            │
│ • Structure: None → Clear                                  │
│ • Score: 40 → 85 (+112%)                                   │
│                                                             │
│ What improved: You added audience, format, and examples.   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Portfolio Export View

```
┌─────────────────────────────────────────────────────────────┐
│ Portfolio Artifact                               [Export]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Title: "Prompt Engineering: Explaining AI to Young         │
│         Audiences"                                         │
│                                                             │
│ Skills Demonstrated:                                       │
│ • Prompt structuring                                       │
│ • Audience awareness                                       │
│ • Iterative improvement                                    │
│ • AI interaction                                           │
│                                                             │
│ Best Attempt:                                              │
│ "Explain AI to a 12-year-old using analogies..."          │
│                                                             │
│ Experiment History: 3 attempts                             │
│ Improvement: +112% from attempt 1 to 3                     │
│                                                             │
│ Reflection:                                                │
│ "I learned that adding audience and format to my prompts   │
│  dramatically improves AI responses. Next time, I'll       │
│  start with the audience in mind."                         │
│                                                             │
│ [Export as JSON] [Export as HTML] [Share URL]              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Platform-UI Integration

| Playground Element | Platform-UI Component    |
| ------------------ | ------------------------ |
| Layout             | AppLayout                |
| Prompt Input       | Custom (styled textarea) |
| Output Panel       | Card                     |
| Button             | Button                   |
| History            | DataTable                |
| Comparison         | Side-by-side Cards       |
| Reflection         | Card + Form              |
| Mentor Feedback    | Card + Badge             |
| Progress           | Progress                 |
| Badge              | Badge                    |

No new foundational components. All styled with design tokens.

---

## Reusability

The AI Playground is designed to be reused across all lessons:

| Lesson Type        | Playground Configuration              |
| ------------------ | ------------------------------------- |
| Prompt Engineering | Full playground, all features         |
| Code Generation    | Playground + code syntax highlighting |
| Content Creation   | Playground + content formatting       |
| Data Analysis      | Playground + data visualization       |
| API Integration    | Playground + API response display     |

**Same component, different configurations.**

---

## Slice 2 Implementation

### Must Build

1. PromptInput component
2. OutputPanel component
3. ReflectionForm component
4. MentorFeedback component
5. ExperimentHistory component
6. ComparisonView component
7. MockAIProvider
8. PortfolioExport component

### Must Not Build

1. Real AI provider integration (Slice 3)
2. Backend storage (Slice 3)
3. Authentication (Slice 4)
4. Advanced analytics (Slice 4)

---

## Success Criteria

The Playground is complete when:

1. ✅ Students can write prompts
2. ✅ Students see AI output (mocked)
3. ✅ Students can iterate multiple times
4. ✅ Students can compare attempts
5. ✅ Students can reflect on experiments
6. ✅ Students can export artifacts
7. ✅ Component is reusable
8. ✅ Design system is preserved
9. ✅ Build passes
