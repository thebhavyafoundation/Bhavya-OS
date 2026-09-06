import Link from "next/link";
import { GraduationCap, BookOpen, Flame, Award } from "lucide-react";
import { requirePolicy } from "@/lib/require-role";
import { getStudentByUserId } from "@/lib/student-store";
import { getCourseById } from "@/data/academy-courses";
import { EmptyState } from "@bhavya/platform-ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Student Workspace | Bhavya Foundation",
  description: "Your enrollments, progress, and learning record.",
};

export default async function StudentWorkspacePage() {
  const user = await requirePolicy("/os/student");
  const student = await getStudentByUserId(user.id);

  const enrolled = (student?.enrolledCourses ?? [])
    .map((id) => ({ id, course: getCourseById(id) }))
    .filter((e) => e.course);
  const completedCount = student?.lessonsCompleted.length ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="w-6 h-6 text-accent-gold" />
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Student Workspace
          </h1>
        </div>
        <p className="text-sm text-text-tertiary">
          {user.name} · {completedCount} lessons completed ·{" "}
          {student?.streak ?? 0} day streak
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-accent-gold" />
            <span className="text-xs text-text-tertiary">Enrolled courses</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {enrolled.length}
          </div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-accent-gold" />
            <span className="text-xs text-text-tertiary">Learning streak</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {student?.streak ?? 0} days
          </div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-4 h-4 text-accent-gold" />
            <span className="text-xs text-text-tertiary">Badge</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {student?.badgeEarned ? "Earned" : "Not yet"}
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-text-primary mb-4">
        My enrollments
      </h2>
      {enrolled.length > 0 ? (
        <div className="flex flex-col gap-3">
          {enrolled.map(({ id, course }) => (
            <Link
              key={id}
              href={`/courses/${id}`}
              className="glass rounded-xl p-5 hover:border-border-secondary transition-colors"
            >
              <div className="text-sm font-semibold text-text-primary">
                {course!.title}
              </div>
              <div className="text-xs text-text-tertiary mt-1">
                {course!.modules.length} modules · Continue learning →
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No enrollments yet"
          description="Browse the course catalog and enroll in a course to begin. Your progress is recorded here."
        />
      )}

      <div className="flex flex-wrap gap-3 mt-8">
        <Link
          href="/courses"
          className="px-5 py-2.5 rounded-xl bg-accent-gold text-text-primary text-sm font-semibold hover:bg-accent-gold/90 transition-colors"
        >
          Browse courses
        </Link>
        <Link
          href="/app/learn"
          className="px-5 py-2.5 rounded-xl border border-border-primary text-sm text-text-tertiary hover:text-text-primary transition-colors"
        >
          Learning dashboard
        </Link>
      </div>
    </div>
  );
}
