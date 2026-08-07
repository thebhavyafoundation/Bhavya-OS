interface PortfolioProject {
  title: string;
  description: string;
  skillsDemonstrated: string[];
  technologies: string[];
  learningOutcomes: string[];
  suggestedImprovements: string[];
  githubUrl: string;
  liveUrl: string;
  screenshot: string;
}

interface SkillAssessment {
  skill: string;
  level: string;
  score: number;
  coursesCompleted: string[];
  projectsUsed: string[];
  endorsements: number;
  lastAssessed: string;
}

interface CareerPath {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  requiredCourses: string[];
  suggestedProjects: string[];
  averageSalary: string;
  growthOutlook: string;
  timeToEntry: string;
}

interface PortfolioTemplate {
  id: string;
  name: string;
  description: string;
  layout: string;
  sections: string[];
  customizableFields: string[];
}

export const projectTemplate: PortfolioProject = {
  title: "",
  description: "",
  skillsDemonstrated: [],
  technologies: [],
  learningOutcomes: [],
  suggestedImprovements: [],
  githubUrl: "",
  liveUrl: "",
  screenshot: "",
};

export const skillAssessment: SkillAssessment[] = [
  {
    skill: "Python Programming",
    level: "Intermediate",
    score: 75,
    coursesCompleted: ["Python Fundamentals", "Data Structures in Python"],
    projectsUsed: ["Data Pipeline Project", "ML Model Deployment"],
    endorsements: 3,
    lastAssessed: "2026-07-15",
  },
  {
    skill: "Machine Learning",
    level: "Beginner",
    score: 60,
    coursesCompleted: ["ML Foundations"],
    projectsUsed: ["Classification Model"],
    endorsements: 1,
    lastAssessed: "2026-07-20",
  },
  {
    skill: "Data Analysis",
    level: "Intermediate",
    score: 70,
    coursesCompleted: ["Data Analysis Fundamentals", "Statistical Methods"],
    projectsUsed: ["Data Visualization Dashboard"],
    endorsements: 2,
    lastAssessed: "2026-07-18",
  },
  {
    skill: "Deep Learning",
    level: "Beginner",
    score: 50,
    coursesCompleted: ["Neural Networks Intro"],
    projectsUsed: [],
    endorsements: 0,
    lastAssessed: "2026-07-22",
  },
  {
    skill: "Version Control",
    level: "Intermediate",
    score: 80,
    coursesCompleted: ["Git Fundamentals", "Collaborative Development"],
    projectsUsed: ["All Projects"],
    endorsements: 4,
    lastAssessed: "2026-07-10",
  },
  {
    skill: "Data Visualization",
    level: "Intermediate",
    score: 72,
    coursesCompleted: ["Data Visualization Fundamentals"],
    projectsUsed: ["Dashboard Project"],
    endorsements: 2,
    lastAssessed: "2026-07-16",
  },
  {
    skill: "API Development",
    level: "Beginner",
    score: 55,
    coursesCompleted: ["REST API Basics"],
    projectsUsed: ["ML Model Deployment"],
    endorsements: 1,
    lastAssessed: "2026-07-21",
  },
  {
    skill: "Cloud Computing",
    level: "Beginner",
    score: 45,
    coursesCompleted: ["Cloud Fundamentals"],
    projectsUsed: [],
    endorsements: 0,
    lastAssessed: "2026-07-23",
  },
];

export const careerPaths: CareerPath[] = [
  {
    id: "ml-engineer",
    title: "Machine Learning Engineer",
    description:
      "Design, build, and deploy machine learning systems at scale. Focus on production-ready ML pipelines, model optimization, and infrastructure.",
    requiredSkills: [
      "Python",
      "TensorFlow/PyTorch",
      "MLOps",
      "Cloud Platforms",
      "Data Engineering",
      "Model Deployment",
      "Distributed Systems",
      "Version Control",
    ],
    requiredCourses: [
      "ML Foundations",
      "Deep Learning Specialization",
      "MLOps Fundamentals",
      "Cloud for ML",
      "Data Engineering Basics",
    ],
    suggestedProjects: [
      "End-to-End ML Pipeline",
      "Real-Time Object Detection System",
      "Distributed Training Setup",
      "Model Serving API",
    ],
    averageSalary: "$120,000 - $180,000",
    growthOutlook: "Very High - 40% projected growth",
    timeToEntry: "6-12 months with focused study",
  },
  {
    id: "ai-researcher",
    title: "AI Research Scientist",
    description:
      "Push the boundaries of AI through original research. Publish papers, develop novel algorithms, and advance the state of the art in machine learning.",
    requiredSkills: [
      "Mathematics (Linear Algebra, Calculus, Probability)",
      "Research Methodology",
      "Paper Writing",
      "Advanced ML/DL",
      "Experimental Design",
      "Statistical Analysis",
      "Literature Review",
      "Python/R",
    ],
    requiredCourses: [
      "Advanced Mathematics for AI",
      "Research Methods in AI",
      "Advanced Deep Learning",
      "Statistical Learning Theory",
      "AI Ethics and Safety",
    ],
    suggestedProjects: [
      "Novel Algorithm Implementation",
      "Literature Review and Replication",
      "Benchmark Study",
      "Open Source Research Tool",
    ],
    averageSalary: "$100,000 - $160,000",
    growthOutlook: "High - 25% projected growth",
    timeToEntry: "12-24 months (often requires advanced degree)",
  },
  {
    id: "ai-product-manager",
    title: "AI Product Manager",
    description:
      "Bridge technical AI capabilities with business strategy. Define product vision, prioritize features, and lead cross-functional teams to deliver AI-powered products.",
    requiredSkills: [
      "Product Strategy",
      "Technical Literacy",
      "Data Analysis",
      "User Research",
      "Agile/Scrum",
      "Stakeholder Management",
      "AI/ML Understanding",
      "Business Acumen",
    ],
    requiredCourses: [
      "AI Fundamentals for Managers",
      "Product Management Basics",
      "Data-Driven Decision Making",
      "Agile Development",
      "AI Ethics and Governance",
    ],
    suggestedProjects: [
      "AI Product Roadmap",
      "Feature Prioritization Framework",
      "User Research Study",
      "Business Case for AI Initiative",
    ],
    averageSalary: "$110,000 - $170,000",
    growthOutlook: "High - 30% projected growth",
    timeToEntry: "3-6 months (leverages existing PM skills)",
  },
];

export const portfolioTemplates: PortfolioTemplate[] = [
  {
    id: "ml-engineer",
    name: "ML Engineer Portfolio",
    description:
      "Technical portfolio emphasizing ML projects and engineering skills",
    layout: "project-focused",
    sections: [
      "Hero Section with specialization",
      "Featured ML Projects",
      "Technical Skills Matrix",
      "Open Source Contributions",
      "Publications and Talks",
      "GitHub Statistics",
      "Contact and Links",
    ],
    customizableFields: [
      "primaryColor",
      "projectFilter",
      "skillDisplay",
      "githubUsername",
      "profileImage",
      "bio",
    ],
  },
  {
    id: "researcher",
    name: "Research Portfolio",
    description:
      "Academic-focused portfolio highlighting research and publications",
    layout: "publication-focused",
    sections: [
      "Research Interests",
      "Publications List",
      "Research Projects",
      "Conference Presentations",
      "Teaching Experience",
      "Collaborations",
      "CV Download",
    ],
    customizableFields: [
      "academicTitle",
      "institution",
      "researchAreas",
      "publicationStyle",
      "orcidId",
      "googleScholarId",
    ],
  },
  {
    id: "general",
    name: "General AI Portfolio",
    description:
      "Versatile portfolio for AI practitioners across specializations",
    layout: "hybrid",
    sections: [
      "Professional Summary",
      "Skills Overview",
      "Featured Projects",
      "Case Studies",
      "Blog Posts",
      "Certifications",
      "Contact Information",
    ],
    customizableFields: [
      "theme",
      "layout",
      "projectOrder",
      "blogIntegration",
      "socialLinks",
      "resumeUpload",
    ],
  },
];

export function generatePortfolioEntry(
  project: Record<string, unknown>,
  _template: PortfolioTemplate = portfolioTemplates[2],
): PortfolioProject {
  const skillsUsed = (project.skills || project.technologies || []) as string[];
  const outcomes = (project.outcomes ||
    project.learningOutcomes ||
    []) as string[];

  return {
    title: String(project.name || project.title || "Untitled Project"),
    description: String(project.description || ""),
    skillsDemonstrated: skillsUsed.slice(0, 5),
    technologies: (project.tools || project.technologies || []) as string[],
    learningOutcomes: outcomes.slice(0, 4),
    suggestedImprovements: [
      "Add comprehensive unit tests",
      "Implement CI/CD pipeline",
      "Add performance benchmarks",
      "Create detailed documentation",
      "Optimize for production deployment",
    ],
    githubUrl: String(project.repo || project.githubUrl || ""),
    liveUrl: String(project.demo || project.liveUrl || ""),
    screenshot: String(
      project.screenshot || `/screenshots/${project.id || "default"}.png`,
    ),
  };
}

export function calculateSkillLevel(score: number): string {
  if (score >= 90) return "Expert";
  if (score >= 75) return "Advanced";
  if (score >= 50) return "Intermediate";
  if (score >= 25) return "Beginner";
  return "Novice";
}

export function getCareerReadinessScore(
  skills: SkillAssessment[],
  path: CareerPath,
): { score: number; gaps: string[]; ready: boolean } {
  const requiredSkillNames = path.requiredSkills.map((s) => s.toLowerCase());
  const assessedSkills = skills.map((s) => ({
    name: s.skill.toLowerCase(),
    score: s.score,
  }));

  let _matchedCount = 0;
  const gaps: string[] = [];
  let totalScore = 0;

  for (const required of requiredSkillNames) {
    const matched = assessedSkills.find(
      (a) => a.name.includes(required) || required.includes(a.name),
    );
    if (matched) {
      _matchedCount++;
      totalScore += matched.score;
    } else {
      gaps.push(required);
    }
  }

  const score =
    requiredSkillNames.length > 0
      ? Math.round((totalScore / (requiredSkillNames.length * 100)) * 100)
      : 0;

  return {
    score,
    gaps,
    ready: score >= 70 && gaps.length <= 2,
  };
}

export function generateSkillAssessment(
  courses: string[],
  projects: string[],
): SkillAssessment[] {
  const skillMap: Record<
    string,
    { level: string; score: number; courses: string[]; projects: string[] }
  > = {};

  const courseSkills: Record<string, string[]> = {
    "Python Fundamentals": ["Python Programming"],
    "Data Structures in Python": ["Python Programming", "Data Structures"],
    "ML Foundations": ["Machine Learning"],
    "Deep Learning Specialization": ["Deep Learning", "Neural Networks"],
    "Data Analysis Fundamentals": ["Data Analysis", "Statistics"],
    "Statistical Methods": ["Data Analysis", "Statistics"],
    "Data Visualization Fundamentals": ["Data Visualization"],
    "REST API Basics": ["API Development"],
    "Cloud Fundamentals": ["Cloud Computing"],
    "Git Fundamentals": ["Version Control"],
    "Collaborative Development": ["Version Control", "Teamwork"],
    "MLOps Fundamentals": ["MLOps", "DevOps"],
  };

  for (const course of courses) {
    const skills = courseSkills[course] || [];
    for (const skill of skills) {
      if (!skillMap[skill]) {
        skillMap[skill] = {
          level: "Beginner",
          score: 40,
          courses: [],
          projects: [],
        };
      }
      skillMap[skill].courses.push(course);
      skillMap[skill].score = Math.min(100, skillMap[skill].score + 15);
    }
  }

  for (const project of projects) {
    for (const skill of Object.keys(skillMap)) {
      if (project.toLowerCase().includes(skill.toLowerCase().split(" ")[0])) {
        skillMap[skill].projects.push(project);
        skillMap[skill].score = Math.min(100, skillMap[skill].score + 10);
      }
    }
  }

  return Object.entries(skillMap).map(([skill, data]) => ({
    skill,
    level: calculateSkillLevel(data.score),
    score: data.score,
    coursesCompleted: data.courses,
    projectsUsed: data.projects,
    endorsements: data.projects.length + data.courses.length,
    lastAssessed: new Date().toISOString().split("T")[0],
  }));
}
