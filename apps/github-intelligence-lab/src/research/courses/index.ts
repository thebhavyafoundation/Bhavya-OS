// Course Research — Internal module of GitHub Intelligence Lab
// Promotes to packages/course-research when AI Institute consumes it.

export type CourseType =
  | "video"
  | "interactive"
  | "textbook"
  | "bootcamp"
  | "workshop"
  | "capstone"
  | "lab";
export type DifficultyLevel =
  "beginner" | "intermediate" | "advanced" | "expert";

export interface Course {
  id: string;
  title: string;
  provider: string;
  url: string;
  type: CourseType;
  difficulty: DifficultyLevel;
  topics: string[];
  duration: string;
  hasCertificate: boolean;
  hasProjects: boolean;
  hasAssessments: boolean;
  openSource: boolean;
  repository: string | null;
  rating: number;
  enrollmentCount: number;
  lastUpdated: string;
  bhavyaScore: number;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: string[];
  difficulty: DifficultyLevel;
  estimatedHours: number;
  topics: string[];
  forInstitute: boolean;
}

export interface CurriculumRecommendation {
  courseId: string;
  action: "add_to_curriculum" | "reference" | "study" | "ignore";
  reasoning: string;
  mapsToModule: string | null;
  difficulty: DifficultyLevel;
  estimatedEffort: string;
}

export class CourseResearcher {
  private courses = new Map<string, Course>();
  private paths = new Map<string, LearningPath>();

  addCourse(course: Course): void {
    this.courses.set(course.id, course);
  }
  getCourse(id: string): Course | undefined {
    return this.courses.get(id);
  }
  listCourses(filter?: {
    type?: CourseType;
    difficulty?: DifficultyLevel;
    minScore?: number;
  }): Course[] {
    let results = Array.from(this.courses.values());
    if (filter?.type) results = results.filter((c) => c.type === filter.type);
    if (filter?.difficulty)
      results = results.filter((c) => c.difficulty === filter.difficulty);
    if (filter?.minScore !== undefined)
      results = results.filter((c) => c.bhavyaScore >= filter.minScore!);
    return results.sort((a, b) => b.bhavyaScore - a.bhavyaScore);
  }

  addPath(path: LearningPath): void {
    this.paths.set(path.id, path);
  }
  listPaths(): LearningPath[] {
    return Array.from(this.paths.values());
  }

  async discover(): Promise<Course[]> {
    try {
      const url =
        "https://api.github.com/search/repositories?q=ai+course+education+machine+learning+stars:>100&sort=stars&order=desc&per_page=20";
      const res = await fetch(url, {
        headers: {
          "User-Agent": "BhavyaOS-GIL/1.0",
          Accept: "application/vnd.github+json",
        },
      });
      if (!res.ok) return [];
      const data = (await res.json()) as {
        items: Array<{
          full_name: string;
          description: string;
          html_url: string;
          stargazers_count: number;
          topics: string[];
        }>;
      };
      return data.items.map((r) => ({
        id: r.full_name,
        title: r.full_name,
        provider: "GitHub",
        url: r.html_url,
        type: "interactive" as const,
        difficulty: "intermediate" as const,
        topics: r.topics || [],
        duration: "self-paced",
        hasCertificate: false,
        hasProjects: true,
        hasAssessments: false,
        openSource: true,
        repository: r.html_url,
        rating: 0,
        enrollmentCount: r.stargazers_count,
        lastUpdated: new Date().toISOString(),
        bhavyaScore: Math.min(100, Math.floor(r.stargazers_count / 100)),
      }));
    } catch {
      return [];
    }
  }

  recommend(course: Course): CurriculumRecommendation {
    const level =
      course.bhavyaScore >= 80
        ? "add_to_curriculum"
        : course.bhavyaScore >= 50
          ? "reference"
          : "study";
    return {
      courseId: course.id,
      action: level,
      reasoning: `Score ${course.bhavyaScore}/100. ${course.hasProjects ? "Has projects." : ""} ${course.openSource ? "Open source." : ""}`,
      mapsToModule: null,
      difficulty: course.difficulty,
      estimatedEffort: course.duration,
    };
  }
}
