import type { AIProvider, CompletionRequest, CompletionResponse } from "../types";

export class MockProvider implements AIProvider {
  name = "mock";

  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    const prompt = request.messages[request.messages.length - 1].content;
    const response = this.generateResponse(prompt);
    return {
      content: response,
      usage: {
        promptTokens: prompt.split(" ").length,
        completionTokens: response.split(" ").length,
      },
      model: "mock-v1",
    };
  }

  private generateResponse(prompt: string): string {
    const words = prompt.split(/\s+/).length;
    const hasStructure = /[.:;,]/.test(prompt);
    const hasLength = prompt.length > 60;
    const hasAudience =
      /explain to|for a|for someone|tell me about|describe|teach|help.*understand/i.test(prompt);
    const hasFormat =
      /step by step|json|list|bullet|numbered|format|structure|example|like|such as|analogy|compare/i.test(prompt);
    const hasConstraint =
      /under \d+|less than|no more than|max \d+|short|concise|brief|simple|easy/i.test(prompt);
    const hasContext =
      /who|which|what kind|specific|particular|real world|everyday|in real life/i.test(prompt);

    let score = 0;
    if (words >= 5) score += 15;
    if (words >= 15) score += 10;
    if (hasStructure) score += 15;
    if (hasLength) score += 15;
    if (hasAudience) score += 20;
    if (hasFormat) score += 15;
    if (hasConstraint) score += 5;
    if (hasContext) score += 5;

    // Generate a REAL response, not a score
    if (score < 30) {
      return this.generateBasicResponse(prompt);
    }

    if (score < 60) {
      return this.generateBetterResponse(prompt);
    }

    if (score < 80) {
      return this.generateGoodResponse(prompt);
    }

    return this.generateExcellentResponse(prompt);
  }

  private generateBasicResponse(prompt: string): string {
    const topic = this.extractTopic(prompt);
    return `AI is a type of computer software that can learn from data and make decisions. It works by finding patterns in large amounts of information, then using those patterns to make predictions or generate new content.

There are many types of AI, from simple recommendation systems to complex language models that can write, code, and reason.

Is there something specific about AI you'd like me to explain in more detail?`;
  }

  private generateBetterResponse(prompt: string): string {
    const topic = this.extractTopic(prompt);
    return `Here's a clear explanation of ${topic || 'AI'}:

**What it is:**
AI (Artificial Intelligence) is software that learns from examples instead of being told exactly what to do. Think of it like teaching a child — you show them many examples, and they figure out the pattern.

**How it works:**
1. You feed the AI lots of data (like millions of text examples)
2. The AI finds patterns in that data
3. When you ask a question, the AI uses those patterns to generate a response

**Real examples:**
- ChatGPT: AI that conversations and answers questions
- GitHub Copilot: AI that writes code alongside you
- DALL-E: AI that creates images from text descriptions

**Key insight:**
AI doesn't "know" things like humans do. It's very good at predicting what comes next based on patterns it learned during training.

Would you like me to go deeper into any of these areas?`;
  }

  private generateGoodResponse(prompt: string): string {
    const topic = this.extractTopic(prompt);
    const audience = this.extractAudience(prompt);

    return `Here's an explanation of ${topic || 'AI'} designed for ${audience || 'you'}:

## What is AI?

Imagine you're teaching a friend to recognize cats. You show them 1000 photos of cats and 1000 photos of dogs. Eventually, they learn the difference — even though you never wrote down "rules" for what a cat looks like.

AI works the same way. Instead of writing rules, we show the computer millions of examples, and it learns the patterns.

## How Does It Actually Work?

**Step 1: Training**
We feed the AI massive amounts of text — books, websites, code, conversations. The AI reads everything and starts finding patterns.

**Step 2: Learning**
The AI learns that certain words tend to appear together. For example:
- "The capital of France" often leads to "Paris"
- "function add(" often leads to numbers being added
- "Once upon a" often leads to a story beginning

**Step 3: Generating**
When you ask a question, the AI uses these patterns to predict what should come next, word by word.

## Why This Matters

Understanding this changes how you interact with AI. Better prompts give the AI better patterns to work with, which leads to better responses.

## Real-World Applications

1. **Writing assistance** — AI helps you draft, edit, and improve text
2. **Code generation** — AI writes code based on your descriptions
3. **Data analysis** — AI finds patterns in large datasets
4. **Creative work** — AI generates images, music, and ideas

Would you like me to explain any of these applications in more detail?`;
  }

  private generateExcellentResponse(prompt: string): string {
    const topic = this.extractTopic(prompt);
    const audience = this.extractAudience(prompt);
    const format = this.extractFormat(prompt);

    const response = `## ${topic || 'AI'} — Explained for ${audience || 'You'}

### The Big Idea

${topic || 'Artificial Intelligence'} is fundamentally about **pattern recognition at scale**. Instead of programming rules, we show computers millions of examples and let them discover the rules themselves.

### A Simple Analogy

Think of it like learning to cook:
- **Traditional programming:** You follow a recipe exactly
- **AI:** You taste 1000 dishes and learn what makes food good

You don't memorize rules — you develop intuition. AI develops mathematical intuition from data.

### How It Actually Works

**1. Data Collection**
We gather examples — text, images, code, conversations. The more diverse and representative, the better.

**2. Pattern Discovery**
The AI analyzes the data and finds statistical relationships:
- Which words follow other words
- Which concepts are related
- Which patterns indicate which outcomes

**3. Response Generation**
When you give the AI a prompt, it uses these patterns to predict the most likely useful response, one word at a time.

### Why This Changes Everything

Understanding the mechanics makes you a better AI user:
- **Better prompts** → Better patterns activated → Better responses
- **Specific instructions** → More precise patterns → More useful output
- **Context and examples** → Richer patterns → Deeper understanding

### Real Examples You Can Try

1. **Prompt:** "Write a email" → Generic response
2. **Prompt:** "Write a professional email to a client apologizing for a delayed delivery" → Specific, useful response

The difference? The second prompt activates specific patterns about professional communication, apologies, and business context.

### What You've Learned

You now understand the fundamental mechanic of AI: pattern recognition. This knowledge applies to every AI tool you'll ever use.

---

*This explanation was generated based on your prompt. Notice how the level of detail, examples, and structure matched your request.*`;

    return response;
  }

  private extractTopic(prompt: string): string {
    const lower = prompt.toLowerCase();
    if (lower.includes("ai") || lower.includes("artificial intelligence")) return "Artificial Intelligence";
    if (lower.includes("machine learning")) return "Machine Learning";
    if (lower.includes("code") || lower.includes("programming")) return "Programming";
    if (lower.includes("data")) return "Data Science";
    return "";
  }

  private extractAudience(prompt: string): string {
    const lower = prompt.toLowerCase();
    if (lower.includes("12 year old") || lower.includes("12-year-old") || lower.includes("kid") || lower.includes("child")) return "a 12-year-old";
    if (lower.includes("beginner")) return "a beginner";
    if (lower.includes("student")) return "a student";
    if (lower.includes("developer") || lower.includes("programmer")) return "a developer";
    if (lower.includes("professional")) return "a professional";
    return "a general audience";
  }

  private extractFormat(prompt: string): string {
    const lower = prompt.toLowerCase();
    if (lower.includes("step by step")) return "step-by-step";
    if (lower.includes("json")) return "JSON";
    if (lower.includes("list")) return "a list";
    if (lower.includes("analogy")) return "an analogy";
    return "a structured explanation";
  }
}
