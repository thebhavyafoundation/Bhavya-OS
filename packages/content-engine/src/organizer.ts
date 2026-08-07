export interface School {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  programs: Program[];
  metadata: SchoolMetadata;
}

export interface SchoolMetadata {
  founded: string;
  mission: string;
  vision: string;
  values: string[];
  leadership: string[];
  contact: ContactInfo;
}

export interface ContactInfo {
  email: string;
  website: string;
  social: Record<string, string>;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  courses: Course[];
  metadata: ProgramMetadata;
}

export interface ProgramMetadata {
  credits: number;
  prerequisites: string[];
  learningOutcomes: string[];
  careerRelevance: string[];
  certification: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  modules: Module[];
  metadata: CourseMetadata;
}

export interface CourseMetadata {
  credits: number;
  prerequisites: string[];
  learningOutcomes: string[];
  syllabus: SyllabusItem[];
  assessment: AssessmentStructure;
}

export interface SyllabusItem {
  week: number;
  topic: string;
  description: string;
  readings: string[];
  assignments: string[];
}

export interface AssessmentStructure {
  homework: number;
  projects: number;
  exams: number;
  participation: number;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  duration: string;
  order: number;
  lessons: Lesson[];
  metadata: ModuleMetadata;
}

export interface ModuleMetadata {
  learningOutcomes: string[];
  prerequisites: string[];
  concepts: string[];
  skills: string[];
}

export interface Lesson {
  id: string;
  name: string;
  description: string;
  duration: string;
  order: number;
  type: "lecture" | "lab" | "workshop" | "seminar" | "project";
  metadata: LessonMetadata;
}

export interface LessonMetadata {
  learningOutcomes: string[];
  prerequisites: string[];
  resources: string[];
  activities: Activity[];
}

export interface Activity {
  id: string;
  name: string;
  type: "reading" | "coding" | "discussion" | "quiz" | "reflection";
  duration: string;
  description: string;
}

export class CurriculumOrganizer {
  private schools: Map<string, School> = new Map();

  async createSchool(
    id: string,
    name: string,
    description: string,
    icon: string,
    color: string,
    metadata: SchoolMetadata,
  ): Promise<School> {
    const school: School = {
      id,
      name,
      description,
      icon,
      color,
      programs: [],
      metadata,
    };

    this.schools.set(id, school);
    return school;
  }

  async createProgram(
    schoolId: string,
    id: string,
    name: string,
    description: string,
    duration: string,
    difficulty: Program["difficulty"],
    metadata: ProgramMetadata,
  ): Promise<Program> {
    const school = this.schools.get(schoolId);
    if (!school) throw new Error(`School ${schoolId} not found`);

    const program: Program = {
      id,
      name,
      description,
      duration,
      difficulty,
      courses: [],
      metadata,
    };

    school.programs.push(program);
    return program;
  }

  async createCourse(
    schoolId: string,
    programId: string,
    id: string,
    name: string,
    description: string,
    duration: string,
    difficulty: Course["difficulty"],
    metadata: CourseMetadata,
  ): Promise<Course> {
    const school = this.schools.get(schoolId);
    if (!school) throw new Error(`School ${schoolId} not found`);

    const program = school.programs.find((p) => p.id === programId);
    if (!program) throw new Error(`Program ${programId} not found`);

    const course: Course = {
      id,
      name,
      description,
      duration,
      difficulty,
      modules: [],
      metadata,
    };

    program.courses.push(course);
    return course;
  }

  async createModule(
    schoolId: string,
    programId: string,
    courseId: string,
    id: string,
    name: string,
    description: string,
    duration: string,
    order: number,
    metadata: ModuleMetadata,
  ): Promise<Module> {
    const school = this.schools.get(schoolId);
    if (!school) throw new Error(`School ${schoolId} not found`);

    const program = school.programs.find((p) => p.id === programId);
    if (!program) throw new Error(`Program ${programId} not found`);

    const course = program.courses.find((c) => c.id === courseId);
    if (!course) throw new Error(`Course ${courseId} not found`);

    const module: Module = {
      id,
      name,
      description,
      duration,
      order,
      lessons: [],
      metadata,
    };

    course.modules.push(module);
    return module;
  }

  async createLesson(
    schoolId: string,
    programId: string,
    courseId: string,
    moduleId: string,
    id: string,
    name: string,
    description: string,
    duration: string,
    order: number,
    type: Lesson["type"],
    metadata: LessonMetadata,
  ): Promise<Lesson> {
    const school = this.schools.get(schoolId);
    if (!school) throw new Error(`School ${schoolId} not found`);

    const program = school.programs.find((p) => p.id === programId);
    if (!program) throw new Error(`Program ${programId} not found`);

    const course = program.courses.find((c) => c.id === courseId);
    if (!course) throw new Error(`Course ${courseId} not found`);

    const module = course.modules.find((m) => m.id === moduleId);
    if (!module) throw new Error(`Module ${moduleId} not found`);

    const lesson: Lesson = {
      id,
      name,
      description,
      duration,
      order,
      type,
      metadata,
    };

    module.lessons.push(lesson);
    return lesson;
  }

  async getSchool(id: string): Promise<School | undefined> {
    return this.schools.get(id);
  }

  async listSchools(): Promise<School[]> {
    return Array.from(this.schools.values());
  }

  async getProgram(
    schoolId: string,
    programId: string,
  ): Promise<Program | undefined> {
    const school = this.schools.get(schoolId);
    return school?.programs.find((p) => p.id === programId);
  }

  async getCourse(
    schoolId: string,
    programId: string,
    courseId: string,
  ): Promise<Course | undefined> {
    const school = this.schools.get(schoolId);
    const program = school?.programs.find((p) => p.id === programId);
    return program?.courses.find((c) => c.id === courseId);
  }

  async getModule(
    schoolId: string,
    programId: string,
    courseId: string,
    moduleId: string,
  ): Promise<Module | undefined> {
    const school = this.schools.get(schoolId);
    const program = school?.programs.find((p) => p.id === programId);
    const course = program?.courses.find((c) => c.id === courseId);
    return course?.modules.find((m) => m.id === moduleId);
  }

  async getLesson(
    schoolId: string,
    programId: string,
    courseId: string,
    moduleId: string,
    lessonId: string,
  ): Promise<Lesson | undefined> {
    const school = this.schools.get(schoolId);
    const program = school?.programs.find((p) => p.id === programId);
    const course = program?.courses.find((c) => c.id === courseId);
    const module = course?.modules.find((m) => m.id === moduleId);
    return module?.lessons.find((l) => l.id === lessonId);
  }

  async getCurriculumStats(): Promise<{
    totalSchools: number;
    totalPrograms: number;
    totalCourses: number;
    totalModules: number;
    totalLessons: number;
  }> {
    let totalPrograms = 0;
    let totalCourses = 0;
    let totalModules = 0;
    let totalLessons = 0;

    for (const school of this.schools.values()) {
      totalPrograms += school.programs.length;
      for (const program of school.programs) {
        totalCourses += program.courses.length;
        for (const course of program.courses) {
          totalModules += course.modules.length;
          for (const module of course.modules) {
            totalLessons += module.lessons.length;
          }
        }
      }
    }

    return {
      totalSchools: this.schools.size,
      totalPrograms,
      totalCourses,
      totalModules,
      totalLessons,
    };
  }

  async searchLessons(query: string): Promise<Lesson[]> {
    const results: Lesson[] = [];
    const lowerQuery = query.toLowerCase();

    for (const school of this.schools.values()) {
      for (const program of school.programs) {
        for (const course of program.courses) {
          for (const module of course.modules) {
            for (const lesson of module.lessons) {
              if (
                lesson.name.toLowerCase().includes(lowerQuery) ||
                lesson.description.toLowerCase().includes(lowerQuery)
              ) {
                results.push(lesson);
              }
            }
          }
        }
      }
    }

    return results;
  }
}

export const curriculumOrganizer = new CurriculumOrganizer();
