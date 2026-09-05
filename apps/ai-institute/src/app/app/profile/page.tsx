import type { Metadata } from "next";
import Link from "next/link";
import { User, BookOpen, Flame, Award } from "lucide-react";
import { requireSessionUser } from "@/lib/require-role";
import { getStudentByUserId } from "@/lib/student-store";
import { getRoleLabel, type Role } from "@/lib/roles";
import { ChangePasswordForm } from "./components/ChangePasswordForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profile — My Bhavya",
  description: "Your institutional profile at Bhavya Foundation.",
};

export default async function ProfilePage() {
  // Server-side session: this page never renders another person's data,
  // and never invents a sample user.
  const user = await requireSessionUser("/app/profile");
  const student = await getStudentByUserId(user.id);

  const initials = user.name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const roleLabel = getRoleLabel([user.role as Role]);
  const interests = student?.interests ?? [];
  const enrolledCount = student?.enrolledCourses.length ?? 0;
  const completedCount = student?.lessonsCompleted.length ?? 0;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-12">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "var(--text-3xl)",
                  fontWeight: 800,
                  color: "var(--text)",
                  letterSpacing: "-0.03em",
                }}
              >
                Profile
              </h1>
              <p
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--text-secondary)",
                  marginTop: "var(--space-3)",
                }}
              >
                Your institutional identity at Bhavya Foundation.
              </p>
            </div>
            <Link
              href="/app/learn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-2)",
                padding: "var(--space-2) var(--space-4)",
                background: "transparent",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)",
              }}
            >
              My Learning
            </Link>
          </div>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "var(--space-8)",
          }}
        >
          <div>
            <div
              style={{
                width: 120,
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--border)",
                borderRadius: "50%",
                marginBottom: "var(--space-4)",
              }}
            >
              {initials ? (
                <span
                  style={{
                    fontSize: "var(--text-3xl)",
                    fontWeight: 800,
                    color: "var(--text)",
                  }}
                >
                  {initials}
                </span>
              ) : (
                <User size={48} style={{ color: "var(--text-secondary)" }} />
              )}
            </div>

            <h2
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "var(--space-1)",
              }}
            >
              {user.name}
            </h2>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--text-secondary)",
                marginBottom: "var(--space-4)",
              }}
            >
              {user.email}
            </p>

            <div
              style={{
                display: "flex",
                gap: "var(--space-2)",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  padding: "4px 12px",
                  background: "var(--forest)",
                  color: "var(--bg)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                }}
              >
                {roleLabel}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-6)",
            }}
          >
            <div
              style={{
                padding: "var(--space-6)",
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <h3
                style={{
                  fontSize: "var(--text-base)",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "var(--space-4)",
                }}
              >
                Learning record
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "var(--space-4)",
                }}
              >
                {[
                  {
                    label: "Enrolled",
                    value: String(enrolledCount),
                    icon: BookOpen,
                  },
                  {
                    label: "Completed",
                    value: String(completedCount),
                    icon: Award,
                  },
                  {
                    label: "Streak",
                    value: `${student?.streak ?? 0}d`,
                    icon: Flame,
                  },
                ].map((stat) => (
                  <div key={stat.label} style={{ textAlign: "center" }}>
                    <stat.icon
                      size={20}
                      style={{
                        color: "var(--forest)",
                        marginBottom: "var(--space-2)",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "var(--text-2xl)",
                        fontWeight: 800,
                        color: "var(--text)",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              {enrolledCount === 0 && (
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--text-secondary)",
                    marginTop: "var(--space-3)",
                    textAlign: "center",
                  }}
                >
                  No enrollments yet.{" "}
                  <Link href="/courses" style={{ textDecoration: "underline" }}>
                    Browse courses
                  </Link>
                  .
                </p>
              )}
            </div>

            <div
              style={{
                padding: "var(--space-6)",
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <h3
                style={{
                  fontSize: "var(--text-base)",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "var(--space-4)",
                }}
              >
                Interests
              </h3>

              {interests.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    gap: "var(--space-2)",
                    flexWrap: "wrap",
                  }}
                >
                  {interests.map((interest) => (
                    <span
                      key={interest}
                      style={{
                        padding: "4px 12px",
                        background: "var(--border)",
                        color: "var(--text-secondary)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "var(--text-xs)",
                      }}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--text-secondary)",
                  }}
                >
                  No interests recorded yet.{" "}
                  <Link
                    href="/onboarding"
                    style={{ textDecoration: "underline" }}
                  >
                    Complete onboarding
                  </Link>
                  .
                </p>
              )}
            </div>

            <div
              style={{
                padding: "var(--space-6)",
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <h3
                style={{
                  fontSize: "var(--text-base)",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "var(--space-4)",
                }}
              >
                Security
              </h3>
              <ChangePasswordForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
