import type { Project, ProjectDNA } from "@bhavya/project-runtime";

export const firstProject: Project = {
  id: "proj-first-ai-assistant",
  title: "Build Your First AI Assistant",
  description:
    "Create a personalized AI assistant that helps with a specific task.",
  problem:
    "Many people use AI tools like ChatGPT but don't know how to build their own AI-powered assistant. This project teaches you to design, build, and document a simple AI assistant from scratch.",
  objectives: [
    "Design an AI assistant for a specific use case",
    "Implement a working assistant with mock AI provider",
    "Create a conversation interface",
    "Document architecture and design decisions",
    "Reflect on the building process",
    "Generate a portfolio-ready project",
  ],
  milestones: [
    {
      id: "ms-1",
      order: 1,
      title: "Understand the Problem",
      description:
        "Define what your AI assistant will do, who will use it, and what problem it solves.",
      tasks: [
        {
          id: "task-1-1",
          title: "Choose a use case",
          description:
            "Pick a specific problem your assistant will solve. Examples: cooking assistant, study buddy, fitness coach, code helper, writing assistant.",
          type: "research",
          status: "pending",
        },
        {
          id: "task-1-2",
          title: "Define the user",
          description:
            "Who will use this assistant? What do they need? What's their skill level?",
          type: "research",
          status: "pending",
        },
        {
          id: "task-1-3",
          title: "Write the problem statement",
          description:
            "One sentence: What problem does your assistant solve for whom?",
          type: "document",
          status: "pending",
        },
      ],
      status: "locked",
    },
    {
      id: "ms-2",
      order: 2,
      title: "Design the Solution",
      description:
        "Design how your assistant will work, what it will say, and how it will behave.",
      tasks: [
        {
          id: "task-2-1",
          title: "Write the system message",
          description:
            "Write the personality and behavior instructions for your AI assistant. This is the most important design decision.",
          type: "design",
          status: "pending",
        },
        {
          id: "task-2-2",
          title: "Design conversation flows",
          description:
            "Map out 3-5 typical conversations your assistant will have. What will users ask? How should it respond?",
          type: "design",
          status: "pending",
        },
        {
          id: "task-2-3",
          title: "Define capabilities",
          description:
            "List 3-5 things your assistant can do. Be specific: 'Answer cooking questions' not 'Help with cooking'.",
          type: "design",
          status: "pending",
        },
      ],
      status: "locked",
    },
    {
      id: "ms-3",
      order: 3,
      title: "Build",
      description: "Implement your AI assistant with a working interface.",
      tasks: [
        {
          id: "task-3-1",
          title: "Set up project structure",
          description:
            "Create the basic files: index.html (or main.ts), styles, and configuration.",
          type: "build",
          status: "pending",
        },
        {
          id: "task-3-2",
          title: "Implement the assistant",
          description:
            "Build the core assistant logic: message handling, AI provider integration, conversation history.",
          type: "build",
          status: "pending",
        },
        {
          id: "task-3-3",
          title: "Build the interface",
          description:
            "Create a simple chat interface where users can talk to the assistant.",
          type: "build",
          status: "pending",
        },
        {
          id: "task-3-4",
          title: "Test with real conversations",
          description:
            "Have 5 real conversations with your assistant. Note what works and what doesn't.",
          type: "test",
          status: "pending",
        },
      ],
      status: "locked",
    },
    {
      id: "ms-4",
      order: 4,
      title: "Document",
      description: "Create documentation that explains your project to others.",
      tasks: [
        {
          id: "task-4-1",
          title: "Write the README",
          description:
            "Write a README that explains what your assistant does, how to use it, and what you learned.",
          type: "document",
          status: "pending",
        },
        {
          id: "task-4-2",
          title: "Document the architecture",
          description:
            "Explain how your assistant is structured. What are the components? How do they communicate?",
          type: "document",
          status: "pending",
        },
        {
          id: "task-4-3",
          title: "Add knowledge package references",
          description:
            "Link to any repositories, patterns, or resources you used.",
          type: "document",
          status: "pending",
        },
      ],
      status: "locked",
    },
    {
      id: "ms-5",
      order: 5,
      title: "Reflect",
      description:
        "Think about what you built, what you learned, and what you'd improve.",
      tasks: [
        {
          id: "task-5-1",
          title: "Write your learning journal",
          description:
            "What was difficult? What surprised you? What would you redesign?",
          type: "reflect",
          status: "pending",
        },
        {
          id: "task-5-2",
          title: "Identify improvements",
          description:
            "List 3 things you would improve if you built this again.",
          type: "reflect",
          status: "pending",
        },
        {
          id: "task-5-3",
          title: "Plan next steps",
          description:
            "What would you add to this assistant? What features would make it production-ready?",
          type: "reflect",
          status: "pending",
        },
      ],
      status: "locked",
    },
    {
      id: "ms-6",
      order: 6,
      title: "Publish",
      description: "Prepare your project for sharing with the world.",
      tasks: [
        {
          id: "task-6-1",
          title: "Create GitHub repository",
          description:
            "Create a GitHub repository for your project with a clear name and description.",
          type: "build",
          status: "pending",
        },
        {
          id: "task-6-2",
          title: "Push code",
          description: "Push your code to GitHub with a clear commit message.",
          type: "build",
          status: "pending",
        },
        {
          id: "task-6-3",
          title: "Generate portfolio entry",
          description: "Export your project as a portfolio artifact.",
          type: "document",
          status: "pending",
        },
      ],
      status: "locked",
    },
  ],
  knowledgePackages: [
    {
      id: "kp-api-basics",
      title: "API Basics",
      type: "article",
      relevance: "Understanding how to connect to AI services",
      description: "Learn how APIs work and how to call AI providers",
    },
    {
      id: "kp-prompt-patterns",
      title: "Prompt Engineering Patterns",
      type: "lesson",
      relevance: "Writing effective system messages",
      description: "Patterns for crafting prompts that produce good results",
    },
    {
      id: "kp-ai-starter",
      title: "AI Starter Template",
      type: "repository",
      url: "https://github.com/bhavya-foundation/ai-starter",
      relevance: "Starter code for AI projects",
      description:
        "A minimal AI project template with TypeScript and API integration",
    },
    {
      id: "kp-conversation-design",
      title: "Conversation Design Patterns",
      type: "pattern",
      relevance: "Designing natural conversations",
      description: "Patterns for creating conversational interfaces",
    },
  ],
  resources: [
    {
      id: "res-ai-starter",
      title: "AI Starter Repository",
      type: "repository",
      url: "https://github.com/bhavya-foundation/ai-starter",
      description: "Starter template for AI projects",
    },
    {
      id: "res-typescript",
      title: "TypeScript Handbook",
      type: "documentation",
      url: "https://www.typescriptlang.org/docs/",
      description: "Official TypeScript documentation",
    },
  ],
  status: "not-started",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const projectDNA: ProjectDNA = {
  mission: "Teach students to build AI-powered applications from scratch",
  realWorldProblem:
    "Most AI education focuses on using AI tools, not building them. Students need to learn to design, implement, and document AI applications.",
  learningObjectives: [
    "Design an AI assistant for a specific use case",
    "Implement a working AI assistant",
    "Create a conversation interface",
    "Document architecture and design decisions",
    "Reflect on the building process",
  ],
  skillsGained: [
    "Architecture Design",
    "Prompt Engineering",
    "API Integration",
    "User Interface Design",
    "Technical Documentation",
    "Project Planning",
  ],
  knowledgePackagesUsed: [
    "API Basics",
    "Prompt Engineering Patterns",
    "AI Starter Template",
    "Conversation Design Patterns",
  ],
  engineeringPatterns: [
    "Interface-based design",
    "Separation of concerns",
    "Event-driven architecture",
    "Configuration-based behavior",
  ],
  aiCapabilitiesPracticed: [
    "System message design",
    "Conversation flow design",
    "Prompt engineering",
    "AI response evaluation",
  ],
  portfolioOutcome:
    "A working AI assistant with documentation, architecture explanation, and reflection",
  openSourceContributionPath:
    "Share the assistant as a template for other students to fork and customize",
  extensionIdeas: [
    "Add memory to remember previous conversations",
    "Integrate with external APIs (weather, news, etc.)",
    "Add a web interface",
    "Deploy to a public URL",
    "Add voice input/output",
  ],
};
