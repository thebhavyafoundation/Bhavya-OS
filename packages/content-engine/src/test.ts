import { contentEngine } from "./engine.js";
import { _lessonPipeline } from "./pipeline.js";
import { _knowledgeAcquisition } from "./acquisition.js";
import { contentCatalog } from "./catalog.js";
import { qualityValidator } from "./validation.js";
import { contentVersioning } from "./versioning.js";
import { contentExporter, _contentImporter } from "./export.js";
import { curriculumOrganizer } from "./organizer.js";

async function testContentEngine() {
  console.log("Testing Content Engine...\n");

  // Test 1: Create a knowledge package
  console.log("1. Creating a knowledge package...");
  const pkg = await contentEngine.createPackage(
    {
      title: "Introduction to Machine Learning",
      subtitle: "Fundamentals of ML",
      description: "Learn the basics of machine learning",
      school: "AI Foundations",
      program: "AI Fundamentals",
      course: "Machine Learning 101",
      module: "Introduction",
      lesson: "What is ML?",
      order: 1,
      duration: "2 hours",
      difficulty: "beginner",
      tags: ["machine learning", "AI", "fundamentals"],
      prerequisites: [],
      learningOutcomes: [
        "Understand what machine learning is",
        "Differentiate between supervised and unsupervised learning",
        "Identify real-world applications of ML",
      ],
      competencies: ["ML basics", "Pattern recognition"],
      careerRelevance: ["Data Scientist", "ML Engineer"],
      authors: ["Dr. Sarah Chen"],
      reviewers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      contentHash: "",
    },
    {
      sections: [
        {
          id: "section-1",
          type: "concept",
          title: "What is Machine Learning?",
          content: "Machine learning is a subset of artificial intelligence...",
          order: 0,
          estimatedReadTime: "10 min",
          keyTakeaways: ["ML learns from data", "ML finds patterns"],
          concepts: ["machine learning", "AI", "data"],
        },
        {
          id: "section-2",
          type: "theory",
          title: "Types of Machine Learning",
          content: "There are three main types of machine learning...",
          order: 1,
          estimatedReadTime: "15 min",
          keyTakeaways: ["Supervised", "Unsupervised", "Reinforcement"],
          concepts: ["supervised learning", "unsupervised learning"],
        },
      ],
      visualExplanations: [
        {
          id: "vis-1",
          type: "diagram",
          title: "ML Types Overview",
          description: "Visual representation of ML types",
          data: {},
          format: "svg",
        },
      ],
      interactiveDiagrams: [],
      codeExamples: [
        {
          id: "code-1",
          language: "python",
          title: "Simple ML Example",
          description: "Basic ML code example",
          code: "from sklearn.linear_model import LinearRegression\nmodel = LinearRegression()",
          explanation: "This code creates a simple linear regression model",
          runnable: true,
          concepts: ["linear regression", "scikit-learn"],
        },
      ],
      executableNotebooks: [],
      glossary: [
        {
          term: "Machine Learning",
          definition: "A subset of AI that enables systems to learn from data",
          relatedTerms: ["AI", "Deep Learning"],
          examples: ["Image recognition", "Natural language processing"],
        },
      ],
      revisionNotes: [
        {
          concept: "ML Basics",
          keyPoints: ["Data-driven", "Pattern recognition"],
          commonMistakes: ["Confusing ML with AI"],
          practiceQuestions: ["What is machine learning?"],
        },
      ],
    },
    {
      checkpoints: [],
      quiz: {
        id: "quiz-1",
        questions: [
          {
            id: "q1",
            type: "mcq",
            content: "What is machine learning?",
            options: ["A type of AI", "A programming language", "A database"],
            correctAnswer: "A type of AI",
            explanation: "ML is a subset of AI",
            difficulty: "easy",
            concepts: ["ML"],
          },
        ],
        timeLimit: 10,
        passingScore: 70,
        attempts: 3,
      },
      assignment: {
        id: "assignment-1",
        title: "ML Research",
        description: "Research ML applications",
        requirements: ["Find 3 ML applications"],
        rubric: { categories: [], passingScore: 70 },
        estimatedTime: "2 hours",
      },
      lab: {
        id: "lab-1",
        title: "ML Lab",
        objective: "Build a simple ML model",
        problemStatement: "Create a model that predicts...",
        requirements: [],
        hints: [],
        solution: { code: "", explanation: "", alternatives: [] },
        tests: [],
        estimatedTime: "1 hour",
      },
      project: {
        id: "project-1",
        title: "ML Project",
        brief: "Build an ML application",
        milestones: [],
        rubric: { categories: [], passingScore: 70 },
        estimatedTime: "1 week",
      },
    },
    {
      reading: [],
      researchPapers: [],
      githubReferences: [],
      benchmarks: [],
      datasets: [],
      interviewQuestions: [],
    },
  );

  console.log(`   Created package: ${pkg.id}`);
  console.log(`   Title: ${pkg.metadata.title}`);
  console.log(`   Quality Score: ${pkg.quality.overallScore}\n`);

  // Test 2: Validate the package
  console.log("2. Validating package...");
  const validationReport = await qualityValidator.validatePackage(pkg);
  console.log(`   Validation Score: ${validationReport.summary.score}`);
  console.log(
    `   Passed: ${validationReport.summary.passed}/${validationReport.summary.total}\n`,
  );

  // Test 3: Search packages
  console.log("3. Searching packages...");
  const searchResults = await contentEngine.searchPackages("machine learning");
  console.log(`   Found ${searchResults.length} packages\n`);

  // Test 4: Create a version snapshot
  console.log("4. Creating version snapshot...");
  const snapshot = await contentVersioning.createSnapshot(
    pkg,
    "Dr. Sarah Chen",
    "Initial version",
    ["v1.0", "release"],
  );
  console.log(`   Snapshot created: ${snapshot.id}\n`);

  // Test 5: Export package
  console.log("5. Exporting package...");
  const exported = await contentExporter.exportPackage(pkg.id, "markdown");
  console.log(
    `   Exported as ${exported.type} (${exported.content.length} chars)\n`,
  );

  // Test 6: Create a school structure
  console.log("6. Creating school structure...");
  const school = await curriculumOrganizer.createSchool(
    "ai-foundations",
    "AI Foundations",
    "Core AI education",
    "brain",
    "#1a3a2a",
    {
      founded: "2026",
      mission: "Teach AI fundamentals",
      vision: "World-class AI education",
      values: ["Excellence", "Innovation"],
      leadership: ["Dr. Sarah Chen"],
      contact: { email: "ai@bhavya.edu", website: "bhavya.edu", social: {} },
    },
  );

  const program = await curriculumOrganizer.createProgram(
    school.id,
    "ai-fundamentals",
    "AI Fundamentals",
    "Core AI program",
    "6 months",
    "beginner",
    {
      credits: 30,
      prerequisites: [],
      learningOutcomes: ["Understand AI basics"],
      careerRelevance: ["AI Engineer"],
      certification: "AI Fundamentals Certificate",
    },
  );

  const course = await curriculumOrganizer.createCourse(
    school.id,
    program.id,
    "ml-101",
    "Machine Learning 101",
    "Introduction to ML",
    "8 weeks",
    "beginner",
    {
      credits: 4,
      prerequisites: [],
      learningOutcomes: ["Understand ML basics"],
      syllabus: [],
      assessment: { homework: 30, projects: 30, exams: 30, participation: 10 },
    },
  );

  console.log(`   Created school: ${school.name}`);
  console.log(`   Created program: ${program.name}`);
  console.log(`   Created course: ${course.name}\n`);

  // Test 7: Get curriculum stats
  console.log("7. Getting curriculum stats...");
  const stats = await curriculumOrganizer.getCurriculumStats();
  console.log(`   Schools: ${stats.totalSchools}`);
  console.log(`   Programs: ${stats.totalPrograms}`);
  console.log(`   Courses: ${stats.totalCourses}\n`);

  // Test 8: Get catalog stats
  console.log("8. Getting catalog stats...");
  await contentCatalog.indexPackage(pkg);
  const catalogStats = await contentCatalog.getCatalogStats();
  console.log(`   Total Packages: ${catalogStats.totalPackages}`);
  console.log(`   Average Quality: ${catalogStats.averageQuality}\n`);

  console.log("All tests passed!");
}

testContentEngine().catch(console.error);
