export interface CurriculumLevel {
  readonly level: number;
  readonly name: string;
  readonly mission: string;
  readonly duration: string;
  readonly handsOnPercent: number;
  readonly outcome: string;
  readonly moduleCount: number;
}

export const curriculum: readonly CurriculumLevel[] = [
  {
    level: 0,
    name: "Digital Foundations",
    mission: "Ensure students can use a computer and the internet effectively.",
    duration: "2-4 weeks",
    handsOnPercent: 80,
    outcome: "Digital literacy",
    moduleCount: 2,
  },
  {
    level: 1,
    name: "AI Foundations",
    mission: "Understand what AI is, how it works, and why it matters.",
    duration: "4-6 weeks",
    handsOnPercent: 70,
    outcome: "AI literacy",
    moduleCount: 6,
  },
  {
    level: 2,
    name: "Prompt Engineering",
    mission: "Master the art and science of communicating with AI.",
    duration: "4-6 weeks",
    handsOnPercent: 90,
    outcome: "Prompt engineering skill",
    moduleCount: 6,
  },
  {
    level: 3,
    name: "AI Applications",
    mission: "Build real AI-powered applications.",
    duration: "6-8 weeks",
    handsOnPercent: 85,
    outcome: "Application development skill",
    moduleCount: 6,
  },
  {
    level: 4,
    name: "AI Agents",
    mission: "Understand and build autonomous AI systems.",
    duration: "6-8 weeks",
    handsOnPercent: 85,
    outcome: "Agent development skill",
    moduleCount: 6,
  },
  {
    level: 5,
    name: "Knowledge Systems",
    mission: "Build systems that organize, retrieve, and apply knowledge.",
    duration: "4-6 weeks",
    handsOnPercent: 80,
    outcome: "Knowledge system design",
    moduleCount: 6,
  },
  {
    level: 6,
    name: "Automation",
    mission: "Automate tasks using AI and scripting.",
    duration: "4-6 weeks",
    handsOnPercent: 90,
    outcome: "Automation skill",
    moduleCount: 6,
  },
  {
    level: 7,
    name: "AI Products",
    mission: "Design and build complete AI-powered products.",
    duration: "8-12 weeks",
    handsOnPercent: 90,
    outcome: "Product development skill",
    moduleCount: 6,
  },
  {
    level: 8,
    name: "Open Source Engineering",
    mission: "Contribute to and lead open source projects.",
    duration: "4-6 weeks",
    handsOnPercent: 85,
    outcome: "Open source skill",
    moduleCount: 6,
  },
  {
    level: 9,
    name: "Research",
    mission: "Conduct research and contribute to knowledge.",
    duration: "4-6 weeks",
    handsOnPercent: 70,
    outcome: "Research skill",
    moduleCount: 6,
  },
  {
    level: 10,
    name: "Entrepreneurship",
    mission: "Build AI-powered businesses.",
    duration: "4-6 weeks",
    handsOnPercent: 80,
    outcome: "Entrepreneurship skill",
    moduleCount: 6,
  },
  {
    level: 11,
    name: "Mentorship",
    mission: "Guide and teach others effectively.",
    duration: "4-6 weeks",
    handsOnPercent: 75,
    outcome: "Teaching and mentoring skill",
    moduleCount: 6,
  },
  {
    level: 12,
    name: "Institution Building",
    mission: "Build and lead educational institutions.",
    duration: "4-6 weeks",
    handsOnPercent: 70,
    outcome: "Leadership and institution building skill",
    moduleCount: 6,
  },
] as const;
