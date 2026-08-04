// Foundation Course Data — Vertical Slice 1
// Single course, single module, single lesson for MVP

export interface Lesson {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  prerequisites: string[];
  estimatedTime: number; // minutes
  difficulty: "beginner" | "intermediate" | "advanced";
  content: {
    reading: string;
    keyConcepts: { term: string; definition: string }[];
    examples: { title: string; code: string; explanation: string }[];
  };
  knowledgePackages: { id: string; title: string; relevance: string }[];
  repositoryReferences: { name: string; url: string; relevance: string }[];
  exercises: {
    id: string;
    title: string;
    type: "prompt" | "code" | "reflection";
    instructions: string;
  }[];
  reflection: { prompt: string; followUp: string[] };
}

export interface Lab {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  estimatedTime: number;
  tasks: {
    id: string;
    title: string;
    instruction: string;
    expectedOutput: string;
    hints: string[];
  }[];
  rubric: { dimension: string; weight: number; levels: string[] }[];
}

export interface KnowledgeCheck {
  id: string;
  title: string;
  questions: {
    id: string;
    question: string;
    type: "multiple-choice" | "short-answer" | "reflection";
    options?: string[];
    correct?: number;
    rubric?: string[];
  }[];
}

export interface MiniProject {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  requirements: string[];
  starterCode: string;
  rubric: { dimension: string; weight: number; criteria: string[] }[];
  submissionInstructions: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner";
  estimatedDuration: string;
  outcomes: string[];
  modules: {
    id: string;
    title: string;
    lessons: Lesson[];
    lab: Lab;
    knowledgeCheck: KnowledgeCheck;
    project: MiniProject;
  }[];
}

export const foundationCourse: Course = {
  id: "ai-foundations",
  title: "AI Foundations",
  description: "Your first step into AI. Build real things from day one.",
  difficulty: "beginner",
  estimatedDuration: "4-6 weeks",
  outcomes: [
    "Explain what AI is and how LLMs work",
    "Write effective prompts for different tasks",
    "Build a simple AI-powered assistant",
    "Understand AI safety and ethics",
    "Contribute to open source AI projects",
  ],
  modules: [
    {
      id: "mod-1",
      title: "What is AI?",
      lessons: [
        {
          id: "lesson-1-1",
          title: "Introduction to AI",
          description: "What AI is, what it isn't, and why it matters.",
          objectives: [
            "Define AI in your own words",
            "Distinguish AI from traditional software",
            "Identify 3 real-world AI applications",
          ],
          prerequisites: [],
          estimatedTime: 20,
          difficulty: "beginner",
          content: {
            reading: `## What is AI?

Artificial Intelligence is the ability of machines to perform tasks that typically require human intelligence.

### The Simple Definition

AI is software that learns from data instead of being explicitly programmed.

### What AI Is NOT

- AI is not magic
- AI is not sentient (yet)
- AI is not a replacement for human thinking
- AI is a tool that amplifies human capability

### Why It Matters Now

Large Language Models (LLMs) have made AI accessible to everyone. You don't need a PhD to build with AI. You need curiosity and a willingness to build.

### Real Examples

1. **GitHub Copilot** — AI that writes code alongside you
2. **ChatGPT** — AI that conversations and reasons
3. **DALL-E** — AI that creates images from text
4. **Tesla Autopilot** — AI that drives cars

### The Bhavya Perspective

At Bhavya Foundation, we believe AI is the most powerful learning tool ever created. Our mission is to help you use it to build real things, not just consume content.`,
            keyConcepts: [
              {
                term: "Artificial Intelligence",
                definition:
                  "Software that learns from data to perform tasks requiring human intelligence",
              },
              {
                term: "Machine Learning",
                definition:
                  "A subset of AI where systems improve through experience",
              },
              {
                term: "Large Language Model (LLM)",
                definition:
                  "AI trained on vast text data that can understand and generate human language",
              },
              {
                term: "Prompt",
                definition: "Instructions you give to an AI model",
              },
            ],
            examples: [
              {
                title: "Traditional vs AI Software",
                code: `// Traditional: Explicit rules
if (input === "hello") {
  return "Hi there!";
}

// AI: Learned from data
const response = await ai.complete({
  prompt: "How should I respond to a greeting?",
  context: input
});`,
                explanation:
                  "Traditional software follows rules you write. AI software learns patterns from data and generates responses.",
              },
            ],
          },
          knowledgePackages: [
            {
              id: "kp-ai-intro",
              title: "AI Introduction",
              relevance: "Core concept for this lesson",
            },
            {
              id: "kp-llm-basics",
              title: "How LLMs Work",
              relevance: "Preparation for next lesson",
            },
          ],
          repositoryReferences: [
            {
              name: "awesome-ai",
              url: "https://github.com/bhavya-foundation/awesome-ai",
              relevance: "Curated list of AI resources",
            },
          ],
          exercises: [
            {
              id: "ex-1",
              title: "Your First Prompt",
              type: "prompt",
              instructions:
                "Write a prompt asking an AI to explain what AI is to a 10-year-old. Use the AI chat on the right to test it.",
            },
            {
              id: "ex-2",
              title: "Reflection",
              type: "reflection",
              instructions:
                "In your own words, what is the difference between traditional software and AI?",
            },
          ],
          reflection: {
            prompt:
              "What surprised you about AI? What expectations did you have before this lesson?",
            followUp: [
              "How does this change how you think about software?",
              "What would you like to build with AI?",
            ],
          },
        },
        {
          id: "lesson-1-2",
          title: "How AI Learns",
          description: "Training, data, and the magic behind machine learning.",
          objectives: [
            "Explain how AI models are trained",
            "Understand the role of data in AI",
            "Describe what a model 'knows'",
          ],
          prerequisites: ["lesson-1-1"],
          estimatedTime: 25,
          difficulty: "beginner",
          content: {
            reading: `## How AI Learns

AI learns by finding patterns in data. The more data, the better the patterns.

### Training Data

Imagine showing a child thousands of pictures of cats. Eventually, they learn to recognize cats. AI works similarly.

\`\`\`
Training Data → Patterns → Model → Predictions
\`\`\`

### The Training Process

1. **Collect data** — Gather examples (text, images, code)
2. **Prepare data** — Clean and structure it
3. **Train model** — Find patterns in the data
4. **Evaluate** — Test if the model works
5. **Deploy** — Use the model in real applications

### What a Model "Knows"

A model doesn't "know" things like humans do. It has learned statistical patterns:

- "Paris" often appears near "France"
- "function" often appears near "return"
- "Hello" often leads to "How can I help?"

### Why This Matters for You

When you write a prompt, you're activating these learned patterns. Better prompts activate better patterns.

### The Bhavya Philosophy

We teach you to understand AI at this level because understanding the mechanics makes you a better builder, not just a user.`,
            keyConcepts: [
              {
                term: "Training Data",
                definition: "The examples used to teach an AI model",
              },
              {
                term: "Model",
                definition:
                  "The learned patterns stored as mathematical parameters",
              },
              {
                term: "Parameters",
                definition: "The numbers that encode what the model learned",
              },
              {
                term: "Fine-tuning",
                definition:
                  "Additional training on specific data to specialize a model",
              },
            ],
            examples: [
              {
                title: "Pattern Recognition",
                code: `// The model has learned these patterns:
// "The capital of France is" → "Paris"
// "The capital of Japan is" → "Tokyo"
// "The capital of ___" → [capital city]

const response = await ai.complete({
  prompt: "The capital of Brazil is"
});
// Response: "Brasília"`,
                explanation:
                  "The model doesn't look up answers in a database. It generates the most likely completion based on patterns it learned during training.",
              },
            ],
          },
          knowledgePackages: [
            {
              id: "kp-training",
              title: "How AI Learns",
              relevance: "Core concept for this lesson",
            },
            {
              id: "kp-model-architecture",
              title: "Model Architecture",
              relevance: "Deeper understanding",
            },
          ],
          repositoryReferences: [],
          exercises: [
            {
              id: "ex-3",
              title: "Pattern Prediction",
              type: "prompt",
              instructions:
                "Try these prompts and predict what the AI will say BEFORE you send it: 'The opposite of hot is', 'The capital of France is', 'function add(a, b) { return'. Were you right?",
            },
          ],
          reflection: {
            prompt:
              "How does understanding that AI learns from patterns change how you might write prompts?",
            followUp: [
              "What kinds of patterns do you think AI is best at learning?",
              "What kinds of patterns can't AI learn?",
            ],
          },
        },
        {
          id: "lesson-1-3",
          title: "Your First AI Build",
          description: "Build something real in your first lesson.",
          objectives: [
            "Build a simple AI assistant",
            "Understand API basics",
            "See your code produce AI output",
          ],
          prerequisites: ["lesson-1-2"],
          estimatedTime: 30,
          difficulty: "beginner",
          content: {
            reading: `## Your First AI Build

Let's build something real. In 10 minutes, you'll have a working AI assistant.

### What We're Building

A simple AI chatbot that:
- Takes your input
- Sends it to an AI model
- Returns a response
- Remembers the conversation

### The Code

We'll use TypeScript and a simple AI API. Don't worry about understanding every line yet — focus on the flow.

### Why Start Building Immediately

At Bhavya, we believe in learning by doing. You'll understand the concepts better by building than by reading about them.`,
            keyConcepts: [
              {
                term: "API",
                definition:
                  "Application Programming Interface — how software communicates",
              },
              {
                term: "Endpoint",
                definition: "A specific URL where an API accepts requests",
              },
              {
                term: "Completion",
                definition:
                  "When an AI model generates a response to your input",
              },
            ],
            examples: [
              {
                title: "Simple AI Chatbot",
                code: `// Your first AI assistant
interface Message {
  role: "user" | "assistant";
  content: string;
}

async function chat(messages: Message[]): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await response.json();
  return data.reply;
}

// Usage
const reply = await chat([
  { role: "user", content: "Hello!" }
]);
console.log(reply); // "Hi! How can I help you today?"`,
                explanation:
                  "This is a minimal AI chatbot. It sends your message to an API and returns the AI's response. The API handles the AI model interaction.",
              },
            ],
          },
          knowledgePackages: [
            {
              id: "kp-api-basics",
              title: "API Basics",
              relevance: "Understanding how to connect to AI services",
            },
          ],
          repositoryReferences: [
            {
              name: "ai-starter",
              url: "https://github.com/bhavya-foundation/ai-starter",
              relevance: "Starter project for this exercise",
            },
          ],
          exercises: [
            {
              id: "ex-4",
              title: "Build Your Assistant",
              type: "code",
              instructions:
                "Copy the code above into the editor. Run it. Try different prompts. What happens when you ask it to explain something? To write a poem? To solve a problem?",
            },
            {
              id: "ex-5",
              title: "Customize It",
              type: "code",
              instructions:
                "Change the system message to give your assistant a specific personality. Make it a cooking assistant, a coding tutor, or a poetry critic.",
            },
          ],
          reflection: {
            prompt:
              "What did it feel like to build something that uses AI? How is this different from just using ChatGPT?",
            followUp: [
              "What would you want your AI assistant to do?",
              "How could you extend this to solve a real problem?",
            ],
          },
        },
      ],
      lab: {
        id: "lab-prompt-engineering",
        title: "Prompt Engineering Lab",
        description: "Practice writing effective prompts with AI feedback.",
        objectives: [
          "Write prompts for different tasks",
          "Understand prompt structure",
          "Iterate on prompt quality",
          "Receive AI-powered feedback",
        ],
        estimatedTime: 45,
        tasks: [
          {
            id: "task-1",
            title: "Basic Prompt",
            instruction:
              "Write a prompt that asks AI to explain photosynthesis to a 12-year-old.",
            expectedOutput:
              "A clear, age-appropriate explanation of photosynthesis",
            hints: [
              "Think about what a 12-year-old already knows",
              "Use simple language and analogies",
              "Ask for examples they can relate to",
            ],
          },
          {
            id: "task-2",
            title: "Structured Output",
            instruction:
              "Write a prompt that returns a JSON object with 3 facts about the solar system. The JSON should have fields: fact, source, confidence.",
            expectedOutput: "Valid JSON with 3 solar system facts",
            hints: [
              "Tell the AI exactly what format you want",
              "Provide an example of the output format",
              "Be specific about what fields you need",
            ],
          },
          {
            id: "task-3",
            title: "Chain of Thought",
            instruction:
              "Write a prompt that makes AI solve this problem step by step: 'If a train travels 60mph for 2.5 hours, then 80mph for 1.5 hours, what is the total distance?'",
            expectedOutput: "Step-by-step solution with final answer",
            hints: [
              "Ask the AI to think step by step",
              "Break the problem into parts",
              "Have it calculate each segment separately",
            ],
          },
          {
            id: "task-4",
            title: "Few-Shot Learning",
            instruction:
              "Write a prompt with 2 examples that teaches AI to convert temperatures between Celsius and Fahrenheit. Then test it with a new temperature.",
            expectedOutput: "Correct temperature conversion with examples",
            hints: [
              "Provide clear input-output examples",
              "Show the pattern you want the AI to follow",
              "Test with a temperature not in your examples",
            ],
          },
        ],
        rubric: [
          {
            dimension: "Clarity",
            weight: 25,
            levels: [
              "Unclear",
              "Basic",
              "Clear",
              "Very Clear",
              "Crystal Clear",
            ],
          },
          {
            dimension: "Specificity",
            weight: 25,
            levels: [
              "Vague",
              "General",
              "Specific",
              "Very Specific",
              "Precise",
            ],
          },
          {
            dimension: "Output Quality",
            weight: 30,
            levels: ["Poor", "Acceptable", "Good", "Very Good", "Excellent"],
          },
          {
            dimension: "Iteration",
            weight: 20,
            levels: [
              "No iteration",
              "1 revision",
              "2 revisions",
              "3+ revisions",
              "Systematic improvement",
            ],
          },
        ],
      },
      knowledgeCheck: {
        id: "kc-1",
        title: "What is AI? — Knowledge Check",
        questions: [
          {
            id: "q-1",
            question:
              "What is the primary difference between traditional software and AI?",
            type: "multiple-choice",
            options: [
              "AI is faster than traditional software",
              "AI learns from data instead of following explicit rules",
              "AI can only be used by large companies",
              "AI doesn't need electricity",
            ],
            correct: 1,
          },
          {
            id: "q-2",
            question: "How does an AI model 'learn'?",
            type: "multiple-choice",
            options: [
              "A programmer writes rules for every situation",
              "It downloads knowledge from the internet",
              "It finds patterns in training data",
              "It asks humans for answers",
            ],
            correct: 2,
          },
          {
            id: "q-3",
            question: "Explain in your own words what a prompt does.",
            type: "short-answer",
            rubric: [
              "Mentions activating patterns or providing instructions",
              "Uses an analogy or example",
              "Shows understanding that prompts affect output quality",
            ],
          },
          {
            id: "q-4",
            question: "What surprised you most about how AI works?",
            type: "reflection",
            rubric: [
              "Shows genuine curiosity",
              "Connects to personal experience",
              "Identifies something new learned",
            ],
          },
        ],
      },
      project: {
        id: "project-1",
        title: "Build Your AI Assistant",
        description:
          "Create a personalized AI assistant that helps with a specific task.",
        objectives: [
          "Apply prompt engineering concepts",
          "Build a working AI application",
          "Customize AI behavior",
          "Document your build",
        ],
        requirements: [
          "Must have a system message defining the assistant's role",
          "Must handle at least 5 different types of requests",
          "Must maintain conversation context",
          "Must include error handling",
          "Must have a README explaining the design",
        ],
        starterCode: `// AI Assistant Starter
interface AssistantConfig {
  name: string;
  systemMessage: string;
  capabilities: string[];
}

interface Conversation {
  messages: { role: "user" | "assistant"; content: string }[];
}

class AIAssistant {
  config: AssistantConfig;
  conversation: Conversation;

  constructor(config: AssistantConfig) {
    this.config = config;
    this.conversation = { messages: [] };
  }

  async chat(userMessage: string): Promise<string> {
    // TODO: Add user message to conversation
    // TODO: Call AI API with system message + conversation
    // TODO: Add assistant response to conversation
    // TODO: Return response
    throw new Error("Not implemented");
  }

  reset(): void {
    this.conversation = { messages: [] };
  }
}

// Your task: Implement the chat method
// Test with different assistant configs`,
        rubric: [
          {
            dimension: "Functionality",
            weight: 30,
            criteria: ["Chat works", "Handles errors", "Maintains context"],
          },
          {
            dimension: "Prompt Quality",
            weight: 25,
            criteria: [
              "Clear system message",
              "Appropriate for use case",
              "Tested with various inputs",
            ],
          },
          {
            dimension: "Code Quality",
            weight: 20,
            criteria: ["Clean structure", "TypeScript types", "Readable"],
          },
          {
            dimension: "Documentation",
            weight: 15,
            criteria: [
              "README explains design",
              "Usage examples",
              "Design decisions documented",
            ],
          },
          {
            dimension: "Creativity",
            weight: 10,
            criteria: [
              "Unique use case",
              "Thoughtful customization",
              "Personal touch",
            ],
          },
        ],
        submissionInstructions:
          "Push your code to a GitHub repository. Share the link and a brief demo in your portfolio.",
      },
    },
  ],
};

export const assessmentQuestions = foundationCourse.modules[0].knowledgeCheck;
