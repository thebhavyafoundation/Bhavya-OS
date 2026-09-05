/**
 * Public Agent Module
 *
 * Client-safe version of agents.ts that excludes system prompts.
 * Used by the mentor page for agent selection and display.
 *
 * System prompts remain server-side in agents.ts.
 */

export interface PublicAgent {
  id: string;
  name: string;
  role: string;
  personality: string;
  domain: string;
  avatar: string;
  greeting: string;
  specialties: string[];
  teachingStyle: "socratic" | "direct" | "exploratory" | "challenging" | "encouraging";
}

/**
 * Public agent definitions — NO system prompts.
 * Safe for client-side import.
 */
export const publicAgents: PublicAgent[] = [
  {
    id: "athena",
    name: "Athena",
    role: "Strategy & Architecture",
    personality: "Wise, methodical, sees the big picture. Speaks with clarity and precision.",
    domain: "System design, architecture, strategic thinking, AI safety",
    avatar: "🏛️",
    greeting: "Welcome, architect. Every great system begins with a single design decision. What shall we design today?",
    specialties: ["system design", "architecture", "AI safety", "tradeoffs", "strategic thinking"],
    teachingStyle: "socratic",
  },
  {
    id: "atlas",
    name: "Atlas",
    role: "Infrastructure & DevOps",
    personality: "Reliable, practical, hands-on. Speaks in concrete terms.",
    domain: "Deployment, infrastructure, DevOps, cloud, databases",
    avatar: "🌍",
    greeting: "Infrastructure is the foundation of every great application. What are you building, and how can I help you deploy it right?",
    specialties: ["deployment", "Docker", "Kubernetes", "CI/CD", "monitoring", "databases"],
    teachingStyle: "direct",
  },
  {
    id: "forge",
    name: "Forge",
    role: "Builder & Code",
    personality: "Energetic, hands-on, loves building things. Speaks with enthusiasm.",
    domain: "Programming, code architecture, building projects, debugging",
    avatar: "🔨",
    greeting: "Let's build something amazing! What project are you working on, and what's the next step?",
    specialties: ["programming", "code review", "debugging", "project architecture", "testing"],
    teachingStyle: "encouraging",
  },
  {
    id: "tensor",
    name: "Tensor",
    role: "ML & Mathematics",
    personality: "Precise, mathematical, loves proofs. Speaks with rigor.",
    domain: "Machine learning, deep learning, mathematics, statistics",
    avatar: "🔢",
    greeting: "Mathematics is the language of the universe. What concept shall we explore today?",
    specialties: ["linear algebra", "calculus", "probability", "neural networks", "optimization"],
    teachingStyle: "exploratory",
  },
  {
    id: "echo",
    name: "Echo",
    role: "Communication & Writing",
    personality: "Articulate, thoughtful, loves clarity. Speaks with precision.",
    domain: "Technical writing, documentation, communication, presentations",
    avatar: "📝",
    greeting: "Great ideas deserve great communication. What are you working on, and how can I help you express it?",
    specialties: ["technical writing", "documentation", "blog posts", "presentations", "README"],
    teachingStyle: "direct",
  },
  {
    id: "nexus",
    name: "Nexus",
    role: "Data & Analytics",
    personality: "Analytical, pattern-seeking, loves insights. Speaks with evidence.",
    domain: "Data science, analytics, visualization, SQL, data engineering",
    avatar: "📊",
    greeting: "Data tells stories if you know how to listen. What question are you trying to answer?",
    specialties: ["data analysis", "SQL", "visualization", "statistics", "ETL"],
    teachingStyle: "exploratory",
  },
  {
    id: "spark",
    name: "Spark",
    role: "Innovation & Creativity",
    personality: "Creative, energetic, loves brainstorming. Speaks with imagination.",
    domain: "Ideation, creative problem solving, innovation, brainstorming",
    avatar: "✨",
    greeting: "Every great innovation started with a 'what if.' What shall we imagine today?",
    specialties: ["brainstorming", "creative thinking", "innovation", "ideation", "design thinking"],
    teachingStyle: "exploratory",
  },
  {
    id: "sentinel",
    name: "Sentinel",
    role: "Ethics & Safety",
    personality: "Thoughtful, principled, loves rigor. Speaks with care.",
    domain: "AI ethics, safety, bias, fairness, responsible AI",
    avatar: "🛡️",
    greeting: "Building safe AI requires thinking about consequences before they happen. What system shall we examine?",
    specialties: ["AI ethics", "safety", "bias detection", "fairness", "responsible AI"],
    teachingStyle: "challenging",
  },
];

/**
 * Select the best agent for a user message.
 * Client-safe — no system prompts involved.
 */
export function selectPublicAgent(userMessage: string): PublicAgent {
  const msg = userMessage.toLowerCase();

  if (msg.includes("architecture") || msg.includes("design") || msg.includes("scale") || msg.includes("system"))
    return publicAgents.find((a) => a.id === "athena")!;
  if (msg.includes("deploy") || msg.includes("docker") || msg.includes("database") || msg.includes("infra"))
    return publicAgents.find((a) => a.id === "atlas")!;
  if (msg.includes("code") || msg.includes("build") || msg.includes("debug") || msg.includes("project"))
    return publicAgents.find((a) => a.id === "forge")!;
  if (msg.includes("math") || msg.includes("neural") || msg.includes("model") || msg.includes("train"))
    return publicAgents.find((a) => a.id === "tensor")!;
  if (msg.includes("write") || msg.includes("blog") || msg.includes("readme") || msg.includes("document"))
    return publicAgents.find((a) => a.id === "echo")!;
  if (msg.includes("data") || msg.includes("sql") || msg.includes("analytics") || msg.includes("chart"))
    return publicAgents.find((a) => a.id === "nexus")!;
  if (msg.includes("idea") || msg.includes("creative") || msg.includes("innovate") || msg.includes("brainstorm"))
    return publicAgents.find((a) => a.id === "spark")!;
  if (msg.includes("ethics") || msg.includes("safety") || msg.includes("bias") || msg.includes("responsible"))
    return publicAgents.find((a) => a.id === "sentinel")!;

  return publicAgents.find((a) => a.id === "forge")!;
}

/**
 * Generate a local response for demo purposes.
 * Client-safe — hardcoded responses, no LLM calls.
 */
export function getPublicAgentResponse(agent: PublicAgent, userMessage: string): string {
  const msg = userMessage.toLowerCase();

  // Agent-specific keyword matching (same logic as server, no system prompts)
  if (agent.id === "athena") {
    if (msg.includes("architecture") || msg.includes("design"))
      return "Architecture is about making fundamental choices. What are the key constraints you're working with?";
    if (msg.includes("scale"))
      return "Scaling is about tradeoffs. What are you optimizing for — latency, throughput, or cost?";
    return "Let's think about this systematically. What are the key tradeoffs you see?";
  }
  if (agent.id === "atlas") {
    if (msg.includes("deploy") || msg.includes("docker"))
      return "Let's get this deployed properly. What's your target environment?";
    if (msg.includes("database"))
      return "Database design is about access patterns. What queries will you run most often?";
    return "Infrastructure is about reliability. What's your current setup?";
  }
  if (agent.id === "forge") {
    if (msg.includes("code") || msg.includes("debug"))
      return "Let's look at the code. What's the specific issue you're seeing?";
    if (msg.includes("build") || msg.includes("project"))
      return "Building is about incremental progress. What's the smallest thing you can build next?";
    return "Let's break this down into concrete steps. What's the first thing you need to do?";
  }
  if (agent.id === "tensor") {
    if (msg.includes("math") || msg.includes("neural"))
      return "Let's work through the math. What's the core concept you're trying to understand?";
    return "Mathematics builds on fundamentals. What's the foundation you need to strengthen?";
  }
  if (agent.id === "echo") {
    if (msg.includes("write") || msg.includes("blog"))
      return "Writing is thinking made visible. What's the core message you want to convey?";
    return "Clear communication starts with clear thinking. What's the one thing you want your reader to remember?";
  }
  if (agent.id === "nexus") {
    if (msg.includes("data") || msg.includes("sql"))
      return "Data tells stories. What question are you trying to answer?";
    return "Analytics is about finding patterns. What's the data you're working with?";
  }
  if (agent.id === "spark") {
    if (msg.includes("idea") || msg.includes("creative"))
      return "Every idea starts with a question. What if we approached this differently?";
    return "Creativity is about connections. What unrelated concepts can we bring together?";
  }
  if (agent.id === "sentinel") {
    if (msg.includes("ethics") || msg.includes("safety"))
      return "Ethics is not a checkbox — it's a practice. Who could be harmed by this system?";
    if (msg.includes("bias") || msg.includes("fairness"))
      return "Bias comes from data and design. Let's audit your system systematically.";
    return "Every AI decision has consequences. Who is affected, and how?";
  }

  return "That's a great question. Let me think about the best way to approach this. What's your current understanding?";
}
