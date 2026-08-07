export interface LearningStage {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  color: string;
  icon: string;
  modules: string[];
  prerequisites: string[];
  skills: string[];
  projectIdea: string;
}

export const flagshipPath: LearningStage[] = [
  {
    id: "ai-foundations",
    number: 1,
    title: "AI Foundations",
    subtitle: "Understand what AI is and how it works",
    description:
      "Start your journey with the fundamental concepts of artificial intelligence. Learn what AI can do, how machines learn, and the different types of AI systems.",
    duration: "4 weeks",
    difficulty: "Beginner",
    color: "#1a3a2a",
    icon: "🧠",
    modules: [
      "What is AI?",
      "Types of Machine Learning",
      "The AI Workflow",
      "Data Fundamentals",
      "Ethics in AI",
    ],
    prerequisites: [],
    skills: ["AI Literacy", "Data Thinking", "Problem Framing"],
    projectIdea:
      "Build an AI-powered quiz app that adapts to your knowledge level",
  },
  {
    id: "python-for-ai",
    number: 2,
    title: "Python for AI",
    subtitle: "Master the language of AI",
    description:
      "Python is the lingua franca of AI. Learn Python specifically for AI development — data structures, libraries, and patterns used in every AI project.",
    duration: "6 weeks",
    difficulty: "Beginner",
    color: "#2d5a42",
    icon: "🐍",
    modules: [
      "Python Basics",
      "NumPy & Pandas",
      "Data Visualization",
      "File I/O & APIs",
      "Object-Oriented Python",
    ],
    prerequisites: ["ai-foundations"],
    skills: ["Python", "NumPy", "Pandas", "Matplotlib"],
    projectIdea:
      "Build a data analysis pipeline that cleans and visualizes real-world datasets",
  },
  {
    id: "mathematics-for-ai",
    number: 3,
    title: "Mathematics for AI",
    subtitle: "The mathematical foundations of intelligence",
    description:
      "Math is the language AI speaks. Build intuition for linear algebra, calculus, probability, and statistics — the pillars every AI algorithm stands on.",
    duration: "8 weeks",
    difficulty: "Intermediate",
    color: "#c9a227",
    icon: "📐",
    modules: [
      "Linear Algebra",
      "Calculus & Optimization",
      "Probability Theory",
      "Statistics & Inference",
      "Information Theory",
    ],
    prerequisites: ["python-for-ai"],
    skills: ["Linear Algebra", "Calculus", "Probability", "Statistics"],
    projectIdea:
      "Implement gradient descent from scratch and visualize convergence",
  },
  {
    id: "machine-learning",
    number: 4,
    title: "Machine Learning",
    subtitle: "Teach machines to learn from data",
    description:
      "The core of AI. Learn supervised, unsupervised, and reinforcement learning. Build models, evaluate them, and apply them to real problems.",
    duration: "10 weeks",
    difficulty: "Intermediate",
    color: "#8a7359",
    icon: "⚡",
    modules: [
      "Supervised Learning",
      "Unsupervised Learning",
      "Model Evaluation",
      "Feature Engineering",
      "Ensemble Methods",
    ],
    prerequisites: ["mathematics-for-ai"],
    skills: ["Scikit-learn", "Regression", "Classification", "Clustering"],
    projectIdea: "Build a house price predictor and deploy it as a web API",
  },
  {
    id: "deep-learning",
    number: 5,
    title: "Deep Learning",
    subtitle: "Neural networks that learn representations",
    description:
      "Go deep. Learn neural networks, backpropagation, CNNs, RNNs, and the architectures powering modern AI. Build and train networks from scratch.",
    duration: "12 weeks",
    difficulty: "Advanced",
    color: "#1a3a2a",
    icon: "🔬",
    modules: [
      "Neural Networks",
      "Backpropagation",
      "CNNs",
      "RNNs & LSTMs",
      "Training Techniques",
    ],
    prerequisites: ["machine-learning"],
    skills: ["PyTorch", "TensorFlow", "CNNs", "RNNs"],
    projectIdea:
      "Build an image classifier that identifies 100+ object categories",
  },
  {
    id: "transformers",
    number: 6,
    title: "Transformers",
    subtitle: "The architecture that changed everything",
    description:
      "The transformer architecture revolutionized AI. Understand self-attention, positional encoding, and the models behind GPT, BERT, and beyond.",
    duration: "10 weeks",
    difficulty: "Advanced",
    color: "#2d5a42",
    icon: "🔄",
    modules: [
      "Attention Mechanism",
      "Self-Attention",
      "Multi-Head Attention",
      "BERT & GPT",
      "Vision Transformers",
    ],
    prerequisites: ["deep-learning"],
    skills: ["Transformers", "Attention", "Hugging Face", "BERT", "GPT"],
    projectIdea: "Fine-tune a pre-trained transformer for text classification",
  },
  {
    id: "llm-engineering",
    number: 7,
    title: "LLM Engineering",
    subtitle: "Build with large language models",
    description:
      "Learn to work with LLMs at scale. Prompt engineering, RAG, fine-tuning, evaluation, and building production applications with language models.",
    duration: "8 weeks",
    difficulty: "Expert",
    color: "#c9a227",
    icon: "🚀",
    modules: [
      "Prompt Engineering",
      "RAG Systems",
      "Fine-Tuning",
      "Evaluation",
      "Production Deployment",
    ],
    prerequisites: ["transformers"],
    skills: ["OpenAI API", "LangChain", "RAG", "Prompt Engineering"],
    projectIdea:
      "Build a RAG-powered knowledge base with conversational interface",
  },
  {
    id: "ai-agents",
    number: 8,
    title: "AI Agents",
    subtitle: "Autonomous systems that reason and act",
    description:
      "The frontier of AI. Build agents that can reason, plan, use tools, and take actions autonomously. Multi-agent systems, tool use, and real-world deployment.",
    duration: "10 weeks",
    difficulty: "Expert",
    color: "#8a7359",
    icon: "🤖",
    modules: [
      "Agent Architecture",
      "Tool Use",
      "Planning & Reasoning",
      "Multi-Agent Systems",
      "Safety & Alignment",
    ],
    prerequisites: ["llm-engineering"],
    skills: ["Agent Frameworks", "Tool Integration", "Planning", "Memory"],
    projectIdea:
      "Build a multi-agent system that researches, writes, and edits articles",
  },
];

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  estimatedDuration: string;
  estimatedHours: number;
  icon: string;
  color: string;
  prerequisites: string[];
  outcomes: string[];
  modules: LearningModule[];
  projects: PathProject[];
  certifications: string[];
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  lessons: {
    id: string;
    title: string;
    type: "reading" | "video" | "hands-on" | "project";
    duration: number;
  }[];
}

export interface PathProject {
  id: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "production";
  description: string;
  skills: string[];
  estimatedHours: number;
}

export const learningPaths: LearningPath[] = [
  {
    id: "ai-beginner",
    title: "AI Beginner",
    slug: "ai-beginner",
    description:
      "From zero to understanding AI. No coding experience required.",
    difficulty: "beginner",
    estimatedDuration: "4-6 weeks",
    estimatedHours: 40,
    icon: "🌱",
    color: "#22c55e",
    prerequisites: [],
    outcomes: [
      "Understand what AI is and how it works",
      "Write effective prompts",
      "Use AI tools confidently",
      "Build your first AI project",
      "Understand AI ethics and limitations",
    ],
    modules: [
      {
        id: "foundations",
        title: "AI Foundations",
        description: "Core concepts every AI learner needs",
        lessons: [
          {
            id: "what-is-ai",
            title: "What is AI?",
            type: "reading",
            duration: 20,
          },
          {
            id: "machine-learning",
            title: "How Machines Learn",
            type: "reading",
            duration: 30,
          },
          {
            id: "neural-networks",
            title: "Neural Networks Explained",
            type: "video",
            duration: 25,
          },
          {
            id: "llm",
            title: "Large Language Models",
            type: "reading",
            duration: 35,
          },
          {
            id: "prompt-engineering",
            title: "Your First Prompts",
            type: "hands-on",
            duration: 30,
          },
        ],
      },
      {
        id: "hands-on",
        title: "Hands-On AI",
        description: "Start building with AI",
        lessons: [
          {
            id: "chatbot-project",
            title: "Build a Chatbot",
            type: "project",
            duration: 60,
          },
          {
            id: "few-shot",
            title: "Few-Shot Techniques",
            type: "hands-on",
            duration: 25,
          },
          {
            id: "chain-of-thought",
            title: "Chain-of-Thought",
            type: "hands-on",
            duration: 25,
          },
        ],
      },
      {
        id: "ethics",
        title: "AI Ethics",
        description: "Understanding AI's impact on society",
        lessons: [
          {
            id: "ai-safety",
            title: "AI Safety & Ethics",
            type: "reading",
            duration: 30,
          },
          {
            id: "bias",
            title: "Understanding Bias",
            type: "reading",
            duration: 25,
          },
        ],
      },
    ],
    projects: [
      {
        id: "build-chatbot",
        title: "Build Your First Chatbot",
        difficulty: "beginner",
        description:
          "Create a conversational AI assistant using prompt engineering.",
        skills: [
          "Prompt Engineering",
          "API Integration",
          "Conversation Design",
        ],
        estimatedHours: 8,
      },
      {
        id: "ai-writer",
        title: "AI Writing Assistant",
        difficulty: "beginner",
        description:
          "Build a tool that helps write emails, articles, or stories.",
        skills: ["Prompt Engineering", "User Interface", "Content Generation"],
        estimatedHours: 10,
      },
    ],
    certifications: ["AI Foundations Certificate"],
  },
  {
    id: "prompt-engineer",
    title: "Prompt Engineering",
    slug: "prompt-engineering",
    description: "Master the art of communicating with AI models.",
    difficulty: "beginner",
    estimatedDuration: "2-3 weeks",
    estimatedHours: 25,
    icon: "✍️",
    color: "#3b82f6",
    prerequisites: ["what-is-ai"],
    outcomes: [
      "Master zero-shot, few-shot, and chain-of-thought prompting",
      "Design system prompts for complex behaviors",
      "Evaluate and iterate on prompt quality",
      "Build prompt templates for production use",
    ],
    modules: [
      {
        id: "fundamentals",
        title: "Prompt Fundamentals",
        description: "Core prompting techniques",
        lessons: [
          {
            id: "prompt-anatomy",
            title: "Anatomy of a Prompt",
            type: "reading",
            duration: 20,
          },
          {
            id: "zero-shot",
            title: "Zero-Shot Prompting",
            type: "hands-on",
            duration: 25,
          },
          {
            id: "few-shot",
            title: "Few-Shot Prompting",
            type: "hands-on",
            duration: 30,
          },
          {
            id: "chain-of-thought",
            title: "Chain-of-Thought",
            type: "hands-on",
            duration: 30,
          },
        ],
      },
      {
        id: "advanced",
        title: "Advanced Techniques",
        description: "Production-grade prompting",
        lessons: [
          {
            id: "system-prompts",
            title: "System Prompts",
            type: "hands-on",
            duration: 30,
          },
          {
            id: "structured-output",
            title: "Structured Output",
            type: "hands-on",
            duration: 25,
          },
          {
            id: "prompt-templates",
            title: "Prompt Templates",
            type: "project",
            duration: 45,
          },
        ],
      },
    ],
    projects: [
      {
        id: "prompt-patterns",
        title: "Prompt Pattern Library",
        difficulty: "beginner",
        description:
          "Create a collection of reusable prompt patterns for common tasks.",
        skills: ["Prompt Design", "Pattern Recognition", "Documentation"],
        estimatedHours: 6,
      },
    ],
    certifications: ["Prompt Engineering Certificate"],
  },
  {
    id: "llm-engineer",
    title: "LLM Engineer",
    slug: "llm-engineer",
    description: "Build applications powered by large language models.",
    difficulty: "intermediate",
    estimatedDuration: "8-10 weeks",
    estimatedHours: 100,
    icon: "🔧",
    color: "#8b5cf6",
    prerequisites: ["what-is-ai", "prompt-engineering"],
    outcomes: [
      "Understand transformer architecture deeply",
      "Build RAG systems",
      "Implement tool-calling agents",
      "Fine-tune models for specific tasks",
      "Deploy LLM applications to production",
    ],
    modules: [
      {
        id: "transformers-deep",
        title: "Transformers Deep Dive",
        description: "Understanding the architecture",
        lessons: [
          {
            id: "transformers",
            title: "Transformer Architecture",
            type: "reading",
            duration: 45,
          },
          {
            id: "attention-mechanism",
            title: "Self-Attention Explained",
            type: "video",
            duration: 40,
          },
          {
            id: "tokenization",
            title: "Tokenization Deep Dive",
            type: "hands-on",
            duration: 30,
          },
          {
            id: "embeddings",
            title: "Embeddings & Vector Space",
            type: "hands-on",
            duration: 35,
          },
        ],
      },
      {
        id: "rag-systems",
        title: "Building RAG Systems",
        description: "Retrieval-Augmented Generation",
        lessons: [
          {
            id: "rag",
            title: "RAG Architecture",
            type: "reading",
            duration: 40,
          },
          {
            id: "chunking",
            title: "Document Chunking",
            type: "hands-on",
            duration: 30,
          },
          {
            id: "vector-databases",
            title: "Vector Databases",
            type: "hands-on",
            duration: 35,
          },
          {
            id: "rag-evaluation",
            title: "Evaluating RAG Quality",
            type: "hands-on",
            duration: 30,
          },
        ],
      },
      {
        id: "agents-intro",
        title: "Introduction to Agents",
        description: "Building autonomous AI systems",
        lessons: [
          {
            id: "agents",
            title: "What are Agents?",
            type: "reading",
            duration: 40,
          },
          {
            id: "tool-calling",
            title: "Tool Calling",
            type: "hands-on",
            duration: 35,
          },
          {
            id: "build-agent",
            title: "Build Your First Agent",
            type: "project",
            duration: 60,
          },
        ],
      },
    ],
    projects: [
      {
        id: "build-rag-system",
        title: "Document Q&A System",
        difficulty: "intermediate",
        description:
          "Build a RAG system that answers questions about uploaded documents.",
        skills: ["RAG", "Vector Databases", "Embeddings", "LangChain"],
        estimatedHours: 15,
      },
      {
        id: "build-agent",
        title: "Task Automation Agent",
        difficulty: "intermediate",
        description:
          "Create an agent that can search the web, read files, and execute tasks.",
        skills: ["Agent Architecture", "Tool Calling", "Error Handling"],
        estimatedHours: 20,
      },
    ],
    certifications: ["LLM Engineering Certificate"],
  },
  {
    id: "rag-engineer",
    title: "RAG Engineer",
    slug: "rag-engineer",
    description:
      "Specialize in building retrieval-augmented generation systems.",
    difficulty: "intermediate",
    estimatedDuration: "6-8 weeks",
    estimatedHours: 70,
    icon: "📚",
    color: "#06b6d4",
    prerequisites: ["llm", "embeddings"],
    outcomes: [
      "Design optimal chunking strategies",
      "Build hybrid search systems",
      "Implement reranking pipelines",
      "Evaluate RAG quality metrics",
      "Deploy production RAG systems",
    ],
    modules: [
      {
        id: "retrieval",
        title: "Retrieval Systems",
        description: "Finding the right information",
        lessons: [
          {
            id: "chunking",
            title: "Advanced Chunking",
            type: "hands-on",
            duration: 35,
          },
          {
            id: "vector-databases",
            title: "Vector DB Comparison",
            type: "reading",
            duration: 30,
          },
          {
            id: "hybrid-search",
            title: "Hybrid Search",
            type: "hands-on",
            duration: 40,
          },
          {
            id: "reranking",
            title: "Reranking Strategies",
            type: "hands-on",
            duration: 35,
          },
        ],
      },
      {
        id: "generation",
        title: "Augmented Generation",
        description: "Using retrieved context effectively",
        lessons: [
          {
            id: "context-window",
            title: "Context Window Management",
            type: "hands-on",
            duration: 30,
          },
          {
            id: "citation",
            title: "Citation & Grounding",
            type: "hands-on",
            duration: 25,
          },
          {
            id: "evaluation",
            title: "RAG Evaluation",
            type: "hands-on",
            duration: 40,
          },
        ],
      },
    ],
    projects: [
      {
        id: "enterprise-rag",
        title: "Enterprise Knowledge Base",
        difficulty: "advanced",
        description:
          "Build a RAG system for a company's internal documentation.",
        skills: ["RAG", "Chunking", "Vector DBs", "Evaluation"],
        estimatedHours: 25,
      },
    ],
    certifications: ["RAG Engineering Certificate"],
  },
  {
    id: "agent-engineer",
    title: "Agent Engineer",
    slug: "agent-engineer",
    description: "Build autonomous AI agents that can plan, reason, and act.",
    difficulty: "advanced",
    estimatedDuration: "8-10 weeks",
    estimatedHours: 100,
    icon: "🤖",
    color: "#f59e0b",
    prerequisites: ["llm", "tool-calling"],
    outcomes: [
      "Design agent architectures",
      "Implement planning and reasoning",
      "Build multi-agent systems",
      "Handle agent failure modes",
      "Deploy production agents",
    ],
    modules: [
      {
        id: "agent-fundamentals",
        title: "Agent Fundamentals",
        description: "Core agent patterns",
        lessons: [
          {
            id: "agents",
            title: "Agent Architecture",
            type: "reading",
            duration: 45,
          },
          {
            id: "planning",
            title: "Planning Strategies",
            type: "reading",
            duration: 40,
          },
          {
            id: "tool-calling",
            title: "Advanced Tool Calling",
            type: "hands-on",
            duration: 40,
          },
          {
            id: "memory",
            title: "Agent Memory Systems",
            type: "hands-on",
            duration: 35,
          },
        ],
      },
      {
        id: "multi-agent",
        title: "Multi-Agent Systems",
        description: "Coordinating multiple agents",
        lessons: [
          {
            id: "multi-agent",
            title: "Multi-Agent Architectures",
            type: "reading",
            duration: 45,
          },
          {
            id: "communication",
            title: "Agent Communication",
            type: "hands-on",
            duration: 40,
          },
          {
            id: "orchestration",
            title: "Orchestration Patterns",
            type: "hands-on",
            duration: 40,
          },
        ],
      },
    ],
    projects: [
      {
        id: "multi-agent-team",
        title: "AI Software Team",
        difficulty: "advanced",
        description:
          "Build a multi-agent system where agents collaborate on software development.",
        skills: ["Multi-Agent", "Planning", "Tool Calling", "Orchestration"],
        estimatedHours: 30,
      },
      {
        id: "research-agent",
        title: "Research Agent",
        difficulty: "advanced",
        description:
          "An agent that autonomously researches topics and produces reports.",
        skills: ["Web Search", "Document Analysis", "Report Generation"],
        estimatedHours: 25,
      },
    ],
    certifications: ["Agent Engineering Certificate"],
  },
  {
    id: "ai-product-manager",
    title: "AI Product Manager",
    slug: "ai-product-manager",
    description: "Lead AI product development from concept to launch.",
    difficulty: "intermediate",
    estimatedDuration: "6-8 weeks",
    estimatedHours: 70,
    icon: "📊",
    color: "#ec4899",
    prerequisites: ["what-is-ai", "llm"],
    outcomes: [
      "Define AI product strategy",
      "Manage AI development lifecycle",
      "Evaluate AI product metrics",
      "Navigate AI ethics and compliance",
      "Lead cross-functional AI teams",
    ],
    modules: [
      {
        id: "product-fundamentals",
        title: "AI Product Fundamentals",
        description: "Understanding AI products",
        lessons: [
          {
            id: "ai-product",
            title: "Building AI Products",
            type: "reading",
            duration: 35,
          },
          {
            id: "validation",
            title: "Product Validation",
            type: "reading",
            duration: 30,
          },
          {
            id: "metrics",
            title: "AI Product Metrics",
            type: "reading",
            duration: 30,
          },
        ],
      },
      {
        id: "execution",
        title: "Execution",
        description: "Shipping AI products",
        lessons: [
          {
            id: "roadmap",
            title: "AI Product Roadmaps",
            type: "hands-on",
            duration: 35,
          },
          {
            id: "launch",
            title: "AI Product Launch",
            type: "reading",
            duration: 30,
          },
          {
            id: "iteration",
            title: "Post-Launch Iteration",
            type: "reading",
            duration: 25,
          },
        ],
      },
    ],
    projects: [
      {
        id: "ai-product-prototype",
        title: "AI Product Prototype",
        difficulty: "intermediate",
        description:
          "Define, design, and prototype an AI product from concept to working demo.",
        skills: [
          "Product Strategy",
          "User Research",
          "AI Architecture",
          "Prototyping",
        ],
        estimatedHours: 20,
      },
    ],
    certifications: ["AI Product Management Certificate"],
  },
  {
    id: "ai-solutions-architect",
    title: "AI Solutions Architect",
    slug: "ai-solutions-architect",
    description: "Design and architect enterprise AI systems.",
    difficulty: "expert",
    estimatedDuration: "12-16 weeks",
    estimatedHours: 150,
    icon: "🏗️",
    color: "#14b8a6",
    prerequisites: ["llm", "rag", "agents", "deployment"],
    outcomes: [
      "Design end-to-end AI architectures",
      "Evaluate build vs. buy decisions",
      "Architect for scale and reliability",
      "Navigate AI infrastructure options",
      "Lead technical AI strategy",
    ],
    modules: [
      {
        id: "architecture",
        title: "AI Architecture",
        description: "Designing AI systems",
        lessons: [
          {
            id: "system-design",
            title: "AI System Design",
            type: "reading",
            duration: 50,
          },
          {
            id: "infrastructure",
            title: "AI Infrastructure",
            type: "reading",
            duration: 45,
          },
          {
            id: "scaling",
            title: "Scaling AI Systems",
            type: "reading",
            duration: 40,
          },
        ],
      },
      {
        id: "enterprise",
        title: "Enterprise AI",
        description: "Enterprise considerations",
        lessons: [
          {
            id: "security",
            title: "AI Security",
            type: "reading",
            duration: 40,
          },
          {
            id: "compliance",
            title: "AI Compliance",
            type: "reading",
            duration: 35,
          },
          {
            id: "cost",
            title: "AI Cost Optimization",
            type: "reading",
            duration: 35,
          },
        ],
      },
    ],
    projects: [
      {
        id: "architecture-design",
        title: "Enterprise AI Architecture",
        difficulty: "production",
        description:
          "Design a complete AI architecture for a real enterprise use case.",
        skills: ["System Design", "Architecture", "Infrastructure", "Security"],
        estimatedHours: 40,
      },
    ],
    certifications: ["AI Solutions Architecture Certificate"],
  },
  {
    id: "ai-researcher",
    title: "AI Researcher",
    slug: "ai-researcher",
    description: "Contribute to the frontier of AI research.",
    difficulty: "expert",
    estimatedDuration: "Ongoing",
    estimatedHours: 200,
    icon: "🔬",
    color: "#6366f1",
    prerequisites: ["transformers", "deep-learning", "llm"],
    outcomes: [
      "Read and understand AI papers",
      "Reproduce research results",
      "Design experiments",
      "Write research papers",
      "Contribute to open-source AI",
    ],
    modules: [
      {
        id: "research-methods",
        title: "Research Methods",
        description: "How to do AI research",
        lessons: [
          {
            id: "reading-papers",
            title: "Reading AI Papers",
            type: "reading",
            duration: 40,
          },
          {
            id: "experiment-design",
            title: "Experiment Design",
            type: "reading",
            duration: 45,
          },
          {
            id: "reproducibility",
            title: "Reproducibility",
            type: "hands-on",
            duration: 40,
          },
        ],
      },
    ],
    projects: [
      {
        id: "paper-implementation",
        title: "Paper Implementation",
        difficulty: "production",
        description:
          "Implement and reproduce results from a recent AI research paper.",
        skills: ["Research", "Implementation", "Evaluation", "Writing"],
        estimatedHours: 50,
      },
    ],
    certifications: ["AI Research Certificate"],
  },
  {
    id: "ai-entrepreneur",
    title: "AI Entrepreneur",
    slug: "ai-entrepreneur",
    description: "Build AI-powered businesses from idea to revenue.",
    difficulty: "advanced",
    estimatedDuration: "10-12 weeks",
    estimatedHours: 120,
    icon: "🚀",
    color: "#ef4444",
    prerequisites: ["llm", "ai-product"],
    outcomes: [
      "Identify AI business opportunities",
      "Validate AI product ideas",
      "Build MVPs quickly",
      "Navigate AI ethics and legal issues",
      "Scale AI businesses",
    ],
    modules: [
      {
        id: "ideation",
        title: "Ideation & Validation",
        description: "Finding and validating ideas",
        lessons: [
          {
            id: "opportunity",
            title: "Finding AI Opportunities",
            type: "reading",
            duration: 35,
          },
          {
            id: "validation",
            title: "Rapid Validation",
            type: "hands-on",
            duration: 40,
          },
          {
            id: "mvp",
            title: "Building AI MVPs",
            type: "project",
            duration: 60,
          },
        ],
      },
    ],
    projects: [
      {
        id: "ai-startup-mvp",
        title: "AI Startup MVP",
        difficulty: "production",
        description: "Build and launch an AI product MVP with real users.",
        skills: [
          "Product Development",
          "Business Strategy",
          "AI Implementation",
        ],
        estimatedHours: 40,
      },
    ],
    certifications: ["AI Entrepreneurship Certificate"],
  },
];

export function getPathBySlug(slug: string): LearningPath | undefined {
  return learningPaths.find((p) => p.slug === slug);
}

export function getPathsByDifficulty(
  difficulty: LearningPath["difficulty"],
): LearningPath[] {
  return learningPaths.filter((p) => p.difficulty === difficulty);
}

export function getPathById(id: string): LearningPath | undefined {
  return learningPaths.find((p) => p.id === id);
}
