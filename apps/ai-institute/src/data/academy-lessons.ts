/**
 * Bhavya Academy — Lesson Content
 *
 * Real educational content for each lesson in the Academy curriculum.
 * This is the actual instructional material students will learn from.
 *
 * @module academy-lessons
 */

export interface LessonContent {
  id: string;
  title: string;
  reading: string;
  keyConcepts: { term: string; definition: string }[];
  examples: { title: string; code: string; explanation: string }[];
  exercises: {
    id: string;
    title: string;
    type: "prompt" | "code" | "reflection";
    instructions: string;
  }[];
  reflection: { prompt: string; followUp: string[] };
}

export const lessonContents: Record<string, LessonContent> = {
  // ═══════════════════════════════════════════════════════════════════
  // MODULE 1: What Is AI?
  // ═══════════════════════════════════════════════════════════════════

  "found-1-1": {
    id: "found-1-1",
    title: "The Idea of Intelligence",
    reading: `
## What Is Intelligence?

Intelligence is the ability to learn from experience, understand new situations, and apply knowledge to solve problems. Humans do this naturally. We learn to walk, recognize faces, understand language, and make decisions — all without being explicitly programmed for each task.

**Artificial Intelligence** is the attempt to make machines do the same things. Not by copying how the brain works, but by creating systems that can learn patterns from data and use those patterns to make decisions.

## A Brief History

The field of AI started in the 1950s. Alan Turing asked a simple question: "Can machines think?" He proposed a test — if a machine could converse well enough to fool a human, it could be considered intelligent.

For decades, AI progressed slowly. Computers were too slow, data was scarce, and the algorithms were limited. Then, in the 2010s, three things changed:

1. **Big Data** — The internet generated massive amounts of text, images, and video that machines could learn from.
2. **GPU Computing** — Graphics processors turned out to be perfect for the math that AI requires.
3. **Deep Learning** — New neural network architectures could learn complex patterns automatically.

Today, AI powers your phone's voice assistant, translates languages in real time, generates art, writes code, and drives cars. Understanding how these systems work is the first step to building with them.

## What AI Can and Cannot Do

AI is powerful but narrow. Current AI systems are **specialized** — they excel at specific tasks but lack general understanding.

**What AI can do well:**
- Recognize objects in images
- Translate between languages
- Generate human-like text
- Play games at superhuman levels
- Detect patterns in large datasets

**What AI cannot do (yet):**
- Truly understand meaning (it recognizes patterns, not meaning)
- Reason about novel situations the way humans do
- Have genuine emotions or consciousness
- Learn from a single example like humans can

This distinction matters because it shapes how we build with AI. We design systems that leverage AI's strengths while accounting for its limitations.
    `,
    keyConcepts: [
      {
        term: "Artificial Intelligence",
        definition:
          "The field of computer science focused on creating systems that can perform tasks requiring human-like intelligence, such as learning, reasoning, and problem-solving.",
      },
      {
        term: "Machine Learning",
        definition:
          "A subset of AI where systems learn patterns from data rather than being explicitly programmed with rules.",
      },
      {
        term: "Deep Learning",
        definition:
          "A subset of machine learning that uses multi-layered neural networks to learn complex patterns from large amounts of data.",
      },
      {
        term: "Narrow AI",
        definition:
          "AI systems designed for a specific task, like image recognition or language translation. All current AI is narrow AI.",
      },
    ],
    examples: [
      {
        title: "Voice Assistants",
        code: "",
        explanation:
          'When you say "Hey Siri" or "OK Google," the device uses AI to convert your speech to text, understand your intent, and generate a response. This combines speech recognition, natural language understanding, and text-to-speech — all powered by machine learning models trained on millions of examples.',
      },
    ],
    exercises: [
      {
        id: "found-1-1-ex-1",
        title: "AI in Your Life",
        type: "reflection",
        instructions:
          "List 5 AI-powered systems you used today. For each one, describe what the AI is actually doing (recognizing speech, recommending content, filtering spam, etc.).",
      },
      {
        id: "found-1-1-ex-2",
        title: "Narrow vs. General AI",
        type: "reflection",
        instructions:
          "A chess AI can beat the world champion but cannot recognize a cat in a photo. Explain why this illustrates the difference between narrow and general AI.",
      },
    ],
    reflection: {
      prompt:
        "If you could build an AI system to solve one problem in your community, what would it be? Why that problem specifically?",
      followUp: [
        "What data would the AI need to learn from?",
        "How would you know if the AI is working well?",
        "What could go wrong?",
      ],
    },
  },

  "found-1-2": {
    id: "found-1-2",
    title: "How Machines Learn",
    reading: `
## The Learning Process

Machine learning is fundamentally about **finding patterns in data**. Instead of writing rules by hand, we show the computer thousands of examples and let it figure out the patterns on its own.

Here is the basic process:

1. **Collect Data** — Gather examples of the task you want the AI to learn.
2. **Choose a Model** — Select a mathematical structure that can learn patterns.
3. **Train** — Show the model the data and let it adjust its internal parameters.
4. **Evaluate** — Test the model on new data it has never seen before.
5. **Deploy** — Use the trained model to make predictions on real inputs.

## Types of Learning

### Supervised Learning
The most common type. You provide **labeled examples** — input-output pairs — and the model learns to map inputs to outputs.

Example: Show the model 10,000 photos labeled "cat" or "dog." It learns to distinguish cats from dogs.

### Unsupervised Learning
You provide data **without labels**. The model finds hidden structure on its own.

Example: Give the model customer purchase data. It discovers groups of customers with similar buying patterns.

### Reinforcement Learning
The model learns by **trial and error**, receiving rewards for good actions and penalties for bad ones.

Example: Train a model to play a game. It gets points for winning and loses points for dying. Over millions of games, it learns optimal strategy.

## Training and Testing

A critical rule in machine learning: **never test on your training data**. If the model has already seen the answers, the test is meaningless.

We split data into:
- **Training set** (80%) — The model learns from this.
- **Test set** (20%) — We evaluate performance on this unseen data.

This tells us whether the model has truly learned generalizable patterns, or just memorized the training examples (a problem called **overfitting**).
    `,
    keyConcepts: [
      {
        term: "Training",
        definition:
          "The process of showing a model many examples so it can learn the patterns in the data.",
      },
      {
        term: "Overfitting",
        definition:
          "When a model memorizes training data instead of learning general patterns. It performs well on training data but poorly on new data.",
      },
      {
        term: "Supervised Learning",
        definition:
          "Learning from labeled examples where the correct answer is provided for each input.",
      },
      {
        term: "Generalization",
        definition:
          "The ability of a model to perform well on new, unseen data — the true measure of whether it has learned.",
      },
    ],
    examples: [
      {
        title: "Email Spam Filter",
        code: "",
        explanation:
          "A spam filter is trained on thousands of emails labeled 'spam' or 'not spam.' It learns patterns: certain words (free, winner, click here), certain email structures, certain sender patterns. When a new email arrives, it checks these patterns and predicts whether it is spam. The model never sees the same email twice — it generalizes from patterns it has learned.",
      },
    ],
    exercises: [
      {
        id: "found-1-2-ex-1",
        title: "Training Data",
        type: "reflection",
        instructions:
          "Imagine you are building an AI to detect whether a photo contains a tree. Describe 5 different types of photos you would include in your training data. Why diversity matters?",
      },
      {
        id: "found-1-2-ex-2",
        title: "Overfitting Example",
        type: "reflection",
        instructions:
          "A student studies only past exam papers and memorizes the answers. On the real exam, the questions are slightly different. How is this similar to overfitting in machine learning?",
      },
    ],
    reflection: {
      prompt:
        "What kinds of data do you think are most valuable for training AI? What data is dangerous to train on?",
      followUp: [
        "Who decides what data is collected?",
        "What biases might exist in training data?",
        "How does data quality affect AI performance?",
      ],
    },
  },

  "found-1-3": {
    id: "found-1-3",
    title: "Types of AI Systems",
    reading: `
## The AI Landscape

Not all AI systems work the same way. Understanding the different types helps you choose the right approach for the problem you are solving.

## By Capability

### Narrow AI (Current)
Designed for a specific task. A spam filter cannot drive a car. A chess AI cannot write poetry. All AI systems today are narrow — they are very good at one thing but cannot generalize.

### General AI (Theoretical)
A system that can perform any intellectual task a human can. This does not exist yet. It is the long-term goal of much AI research.

### Super AI (Hypothetical)
A system that surpasses human intelligence in every domain. This is the subject of much debate in AI safety research.

## By Architecture

### Rule-Based Systems
The oldest form of AI. Humans write explicit rules: "If temperature > 100, turn on fan." Simple, predictable, but cannot handle situations the rules do not cover.

### Machine Learning Systems
Learn patterns from data. No explicit rules — the model discovers them. This is the dominant approach today.

### Neural Networks
A specific type of machine learning inspired by the brain. Neural networks with many layers are called **deep learning**. They power most modern AI breakthroughs.

### Large Language Models (LLMs)
Neural networks trained on massive amounts of text. They learn to predict the next word in a sequence. This simple objective, scaled up, produces remarkable capabilities: conversation, writing, coding, reasoning.

## Choosing the Right Approach

| Problem | Best Approach |
|---------|--------------|
| Simple yes/no decisions with clear rules | Rule-based system |
| Pattern recognition in structured data | Classical ML (random forest, gradient boosting) |
| Image recognition | Deep learning (CNNs) |
| Language tasks | Large Language Models |
| Game playing | Reinforcement learning |
| Real-time decisions with streaming data | Online learning |

The key insight: **start simple**. Do not use a large language model when a rule-based system will do. Use the simplest approach that solves the problem.
    `,
    keyConcepts: [
      {
        term: "Neural Network",
        definition:
          "A computing system inspired by biological neural networks, consisting of layers of interconnected nodes that process information.",
      },
      {
        term: "Large Language Model (LLM)",
        definition:
          "A neural network trained on vast text data that generates language by predicting the next word in a sequence.",
      },
      {
        term: "Reinforcement Learning",
        definition:
          "A type of machine learning where an agent learns to make decisions by receiving rewards or penalties for its actions.",
      },
    ],
    examples: [
      {
        title: "When to Use What",
        code: "",
        explanation:
          "A bank needs to decide whether to approve a loan application. A rule-based system checks income and credit score against fixed thresholds. A machine learning system learns from thousands of past applications which factors predict successful repayment. A deep learning system might analyze document images and text. The best approach depends on the data available and the complexity of the decision.",
      },
    ],
    exercises: [
      {
        id: "found-1-3-ex-1",
        title: "Choosing an Approach",
        type: "reflection",
        instructions:
          "For each scenario, choose the most appropriate AI approach and explain why: (a) Detecting spam emails, (b) Recognizing faces in photos, (c) Translating English to Hindi, (d) Playing chess.",
      },
    ],
    reflection: {
      prompt:
        "Why do you think neural networks have become so dominant in recent years, even though simpler approaches exist?",
      followUp: [
        "What are the costs of using complex models when simple ones would suffice?",
        "How does compute availability affect which approach you choose?",
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════
  // MODULE 2: Working with Language Models
  // ═══════════════════════════════════════════════════════════════════

  "found-2-1": {
    id: "found-2-1",
    title: "What Is a Language Model?",
    reading: `
## Predicting the Next Word

At its core, a language model does one thing: **predict the next word**. Given a sequence of words, it estimates the probability of each possible next word.

Consider: "The cat sat on the ___"

A language model assigns probabilities:
- "mat" — 35%
- "floor" — 20%
- "couch" — 15%
- "roof" — 5%
- ... (all other words share the remaining probability)

This seems simple. But when you train a neural network on trillions of words and give it billions of parameters, this simple prediction task produces something remarkable: the model develops an internal representation of language, knowledge, and reasoning patterns.

## How LLMs Are Built

Large Language Models are built in three stages:

### 1. Pre-training
The model reads the entire internet — books, articles, code, conversations. It learns to predict the next word in any context. This takes millions of GPU hours and costs millions of dollars.

### 2. Fine-tuning
The pre-trained model is further trained on specific tasks — answering questions, following instructions, writing code. This shapes the raw prediction capability into useful behavior.

### 3. Alignment (RLHF)
The model is trained to be helpful, harmless, and honest using human feedback. Humans rate responses, and the model learns to produce outputs that humans prefer.

## What Can LLMs Actually Do?

LLMs are remarkably versatile because language encodes so much of human knowledge:

- **Write** — essays, stories, code, emails
- **Analyze** — summarize documents, extract information
- **Translate** — between languages, between technical and plain language
- **Reason** — solve problems step by step
- **Code** — write, debug, and explain programs

But they also have fundamental limitations:
- They **hallucinate** — generate plausible but false information
- They **do not understand** — they pattern-match, not comprehend
- They **have no memory** — each conversation starts fresh (unless given context)
- They **cannot verify** — they cannot check their own facts

Understanding both capabilities and limitations is essential for building with LLMs effectively.
    `,
    keyConcepts: [
      {
        term: "Token",
        definition:
          "The basic unit of text that a language model processes. A token might be a word, part of a word, or a punctuation mark.",
      },
      {
        term: "Context Window",
        definition:
          "The maximum amount of text a language model can consider at once, measured in tokens.",
      },
      {
        term: "Hallucination",
        definition:
          "When a language model generates text that sounds plausible but is factually incorrect or fabricated.",
      },
      {
        term: "Temperature",
        definition:
          "A parameter that controls how random or deterministic the model's output is. Low temperature = more predictable; high temperature = more creative.",
      },
    ],
    examples: [
      {
        title: "Tokenization in Practice",
        code: '"Hello, how are you?" → ["Hello", ",", " how", " are", " you", "?"]',
        explanation:
          "The model does not see words — it sees tokens. Common words like 'how' might be a single token. Rare words might be split into multiple tokens. This affects how the model processes and generates text.",
      },
    ],
    exercises: [
      {
        id: "found-2-1-ex-1",
        title: "Next Word Prediction",
        type: "reflection",
        instructions:
          'For each sentence, predict the 3 most likely next words and explain why: (a) "The capital of France is ___", (b) "def fibonacci(n): ___", (c) "The sun rises in the ___"',
      },
    ],
    reflection: {
      prompt:
        "If a language model just predicts the next word, how do you explain its ability to write code, solve math problems, and have conversations?",
      followUp: [
        "Is predicting the next word enough for intelligence?",
        "What might emerge from this simple objective at scale?",
      ],
    },
  },

  "found-2-2": {
    id: "found-2-2",
    title: "Prompt Engineering Basics",
    reading: `
## The Art of Asking

Prompt engineering is the practice of writing inputs that get the best outputs from a language model. It is not programming in the traditional sense — it is closer to clear communication.

The quality of your prompt directly determines the quality of the output. A vague prompt produces vague results. A specific, well-structured prompt produces useful, actionable results.

## The PRIME Framework

Use this framework for any prompt:

**P — Purpose**: What do you want the model to do?
**R — Role**: Who should the model be?
**I — Input**: What information does the model need?
**M — Method**: How should it approach the task?
**E — Examples**: What does good output look like?

## Core Techniques

### 1. Be Specific
Bad: "Write about AI"
Good: "Write a 300-word explanation of how neural networks learn, suitable for a 15-year-old student, using everyday analogies"

### 2. Provide Context
Bad: "Translate this"
Good: "Translate the following technical documentation from English to Hindi. The audience is software developers. Preserve technical terms."

### 3. Use Examples
Bad: "Write product descriptions"
Good: "Write product descriptions in this style: [example 1], [example 2]. Follow this format."

### 4. Set Constraints
Bad: "Write a story"
Good: "Write a 500-word science fiction story about a student who discovers an AI can predict their future. First person perspective. Include dialogue."

### 5. Chain Your Prompts
Break complex tasks into steps. Each step builds on the previous one:
1. "First, list the key themes in this article."
2. "Now, for each theme, provide supporting evidence."
3. "Finally, write a summary combining these themes."

## Common Mistakes

- **Being too vague** — The model has to guess what you want
- **Not giving examples** — You think the output should be obvious; it is not
- **Overloading one prompt** — Too many instructions in one prompt confuse the model
- **Ignoring format** — Specifying format (JSON, markdown, bullet points) dramatically improves results
    `,
    keyConcepts: [
      {
        term: "Prompt Engineering",
        definition:
          "The practice of designing inputs to language models that produce desired outputs, combining clarity, context, and constraints.",
      },
      {
        term: "Few-Shot Prompting",
        definition:
          "Providing examples of the desired input-output behavior before asking the model to perform the task.",
      },
      {
        term: "Chain of Thought",
        definition:
          "Asking the model to show its reasoning step by step, which improves accuracy on complex tasks.",
      },
    ],
    examples: [
      {
        title: "Vague vs. Specific",
        code: `// Vague prompt:
"Explain Python"

// Specific prompt:
"You are a Python instructor teaching a 14-year-old who has never programmed.
Explain what a variable is using a cooking analogy.
Keep it under 150 words.
Include one simple code example."`,
        explanation:
          "The specific prompt gives the model a role, audience, topic, format, length, and an example to follow. The output will be dramatically better.",
      },
    ],
    exercises: [
      {
        id: "found-2-2-ex-1",
        title: "Rewrite the Prompt",
        type: "prompt",
        instructions:
          'Rewrite this vague prompt to get a better result: "Write an essay about climate change." Use the PRIME framework. Include at least 4 specific constraints.',
      },
      {
        id: "found-2-2-ex-2",
        title: "Few-Shot Example",
        type: "prompt",
        instructions:
          'Create a few-shot prompt that teaches the model to classify text as "positive", "negative", or "neutral". Provide 3 examples of each classification.',
      },
    ],
    reflection: {
      prompt:
        "How is prompt engineering similar to or different from traditional programming?",
      followUp: [
        "What skills transfer from programming to prompt engineering?",
        "What new skills are needed?",
        "How might prompt engineering evolve as models improve?",
      ],
    },
  },

  "found-2-3": {
    id: "found-2-3",
    title: "Advanced Prompt Techniques",
    reading: `
## Beyond the Basics

Once you master the fundamentals, these advanced techniques unlock the full power of language models.

## Technique 1: System Prompts

A **system prompt** sets the model's behavior for the entire conversation. It is like giving the model a persistent identity and rules.

\`\`\`
You are a patient, encouraging math tutor. You never give direct answers.
Instead, you ask guiding questions that help the student discover the answer themselves.
When the student makes an error, you ask them to explain their thinking first.
\`\`\`

System prompts are powerful because they shape every response without being repeated.

## Technique 2: Structured Output

Force the model to return data in a specific format:

\`\`\`
Analyze the following text and return a JSON object with:
{
  "sentiment": "positive" | "negative" | "neutral",
  "confidence": 0.0 to 1.0,
  "key_topics": ["topic1", "topic2"],
  "summary": "one sentence summary"
}
\`\`\`

This makes the output machine-readable and consistent.

## Technique 3: Self-Consistency

Ask the model the same question multiple times with slightly different prompts. If the answer is consistent across runs, it is more likely to be correct. If answers vary, the question may be ambiguous or the model may be uncertain.

## Technique 4: Retrieval-Augmented Generation (RAG)

Give the model access to external information:

\`\`\`
Answer the following question using ONLY the provided context.
If the context does not contain the answer, say "I don't have enough information."

Context: [documents, database entries, web pages]

Question: [user's question]
\`\`\`

RAG grounds the model in real data, reducing hallucination.

## Technique 5: Prompt Chaining

Break a complex task into a pipeline of prompts:

1. **Extract** — "List all the facts mentioned in this article."
2. **Analyze** — "For each fact, determine if it is supported, contradicted, or unverifiable."
3. **Synthesize** — "Write a fact-check report based on this analysis."

Each prompt gets better input, producing better output.
    `,
    keyConcepts: [
      {
        term: "System Prompt",
        definition:
          "A special instruction that sets the model's persona, rules, and behavior for an entire conversation.",
      },
      {
        term: "Chain of Thought (CoT)",
        definition:
          "A prompting technique that asks the model to show its reasoning step by step before giving a final answer.",
      },
      {
        term: "RAG",
        definition:
          "Retrieval-Augmented Generation — combining a language model with external data retrieval to ground responses in real information.",
      },
    ],
    examples: [
      {
        title: "Chain of Thought Prompting",
        code: `// Without CoT:
Q: "If a train travels 60 mph for 2.5 hours, how far does it go?"
A: "150 miles" (sometimes wrong)

// With CoT:
Q: "If a train travels 60 mph for 2.5 hours, how far does it go?
   Think step by step."
A: "Distance = Speed × Time
   Speed = 60 mph
   Time = 2.5 hours
   Distance = 60 × 2.5 = 150 miles"`,
        explanation:
          "Asking the model to show its reasoning forces it to work through the problem systematically, dramatically improving accuracy on math, logic, and multi-step reasoning tasks.",
      },
    ],
    exercises: [
      {
        id: "found-2-3-ex-1",
        title: "System Prompt Design",
        type: "prompt",
        instructions:
          "Write a system prompt for an AI that helps students debug their Python code. It should never give the answer directly but guide students to find bugs themselves.",
      },
      {
        id: "found-2-3-ex-2",
        title: "Prompt Chain",
        type: "prompt",
        instructions:
          "Design a 3-step prompt chain for analyzing a news article: (1) extract key claims, (2) identify potential biases, (3) write a balanced summary. Show the exact prompt for each step.",
      },
    ],
    reflection: {
      prompt:
        "As AI models improve, will prompt engineering become more or less important? Why?",
      followUp: [
        "What happens when models can understand intent better?",
        "Will natural language replace programming languages?",
        "What new skills will be needed?",
      ],
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

export function getLessonContent(lessonId: string): LessonContent | undefined {
  return lessonContents[lessonId];
}

export function hasLessonContent(lessonId: string): boolean {
  return lessonId in lessonContents;
}

// ═══════════════════════════════════════════════════════════════════
// STUDIO PUBLISHED LESSONS (SQLite-backed)
// ═══════════════════════════════════════════════════════════════════

interface StudioPublishedLesson {
  id: string;
  title: string;
  sections?: { title: string; content: string; duration?: number }[];
  learningOutcomes?: string[];
  vocabulary?: { term: string; definition: string }[];
  assessment?: { questions?: { type: string; question: string; options?: string[]; answer: string }[] };
  teacherGuide?: { objectives?: string[]; materials?: string[]; discussionPrompts?: string[] };
  workbook?: { pages?: { title: string; content: string }[] };
}

export function studioToLessonContent(lesson: StudioPublishedLesson): LessonContent {
  const reading = (lesson.sections || [])
    .map((s) => `## ${s.title}\n\n${s.content}`)
    .join("\n\n");

  const keyConcepts = (lesson.vocabulary || []).map((v) => ({
    term: v.term,
    definition: v.definition,
  }));

  const exercises = (lesson.workbook?.pages || []).map((p, i) => ({
    id: `${lesson.id}-wb-${i}`,
    title: p.title,
    type: "reflection" as const,
    instructions: p.content,
  }));

  return {
    id: lesson.id,
    title: lesson.title,
    reading,
    keyConcepts,
    examples: [],
    exercises,
    reflection: {
      prompt: lesson.teacherGuide?.discussionPrompts?.[0] || "Reflect on what you learned.",
      followUp: lesson.teacherGuide?.discussionPrompts?.slice(1) || [],
    },
  };
}

let studioCache: Record<string, LessonContent> = {};
let studioCacheTime = 0;
const STUDIO_CACHE_TTL = 30_000;

export async function getPublishedLessonContent(lessonId: string): Promise<LessonContent | undefined> {
  const now = Date.now();
  if (now - studioCacheTime > STUDIO_CACHE_TTL) {
    try {
      const { dbListLessons } = await import("@/lib/studio/db");
      const lessons = await dbListLessons({ status: "published" });
      studioCache = {};
      for (const l of lessons) {
        studioCache[l.id] = studioToLessonContent(l);
      }
      studioCacheTime = now;
    } catch {
      return undefined;
    }
  }
  return studioCache[lessonId];
}
