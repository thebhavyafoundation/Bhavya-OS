import Link from "next/link";
import { HeartHandshake, TreePine, Users } from "lucide-react";
import { requirePolicy } from "@/lib/require-role";
import { getStudentByUserId } from "@/lib/student-store";
import { EmptyState } from "@bhavya/platform-ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Volunteer Workspace | Bhavya Foundation",
  description:
    "Your volunteer profile, mission opportunities, and contributions.",
};

export default async function VolunteerWorkspacePage() {
  const user = await requirePolicy("/os/volunteer");
  const student = await getStudentByUserId(user.id);
  const interests =
    student?.interests && student.interests.length > 0 ? student.interests : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <HeartHandshake className="w-6 h-6 text-accent-gold" />
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            Volunteer Workspace
          </h1>
        </div>
        <p className="text-sm text-text-tertiary">
          {user.name} · {user.email}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-3">
            Your interests
          </h2>
          {interests.length > 0 ? (
            <div className="flex gap-1.5 flex-wrap">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="text-[11px] px-2 py-0.5 rounded bg-bg-tertiary text-text-tertiary border border-border-primary"
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-tertiary">
              No interests recorded. Update them from your{" "}
              <Link href="/app/profile" className="underline">
                profile
              </Link>
              .
            </p>
          )}
        </div>
        <div className="glass rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-3">
            Mission opportunities
          </h2>
          <p className="text-xs text-text-tertiary mb-4">
            Forest restoration, heritage preservation, and community programs
            need volunteers.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/missions"
              className="px-4 py-2 rounded-lg bg-accent-gold text-text-primary text-xs font-semibold hover:bg-accent-gold-hover transition-colors"
            >
              Explore missions
            </Link>
            <Link
              href="/app/missions"
              className="px-4 py-2 rounded-lg border border-border-primary text-xs text-text-tertiary hover:text-text-primary transition-colors"
            >
              My missions
            </Link>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <TreePine className="w-4 h-4 text-accent-gold" />
        My applications
      </h2>
      <EmptyState
        title="No volunteer applications yet"
        description="Choose a mission above to begin contributing. Your applications and assignments will be recorded here."
      />

      <div className="glass rounded-xl p-5 mt-6 flex items-start gap-3">
        <Users className="w-5 h-5 text-accent-gold shrink-0 mt-0.5" />
        <p className="text-xs text-text-tertiary leading-relaxed">
          New to volunteering? Introduce yourself in the{" "}
          <Link href="/app/community" className="underline">
            community
          </Link>{" "}
          and tell mission coordinators how you would like to help.
        </p>
      </div>
    </div>
  );
}
