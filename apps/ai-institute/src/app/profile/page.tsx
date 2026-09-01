"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { getCourseById } from "@/data/academy-courses";
import { BookOpen, BarChart3, Trophy, Flame } from "lucide-react";

export default function ProfilePage() {
  const { user, student, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const course = getCourseById("ai-foundations");
  const totalLessons = course?.modules.flatMap((m) => m.lessons).length ?? 0;
  const completedLessons = student?.lessonsCompleted.length || 0;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link
        href="/dashboard"
        className="text-sm text-[#8a7359] hover:text-[#c9a227] transition-colors flex items-center gap-2 mb-8"
      >
        <span className="text-lg">&larr;</span> Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c9a227] to-[#8a7359] flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#f5f1e6]">{user?.name}</h1>
            <p className="text-sm text-[#8a7359]">{user?.email}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a3a2a]/40 bg-[#0d1410] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[#c9a227] uppercase tracking-wider">
            Profile Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#8a7359]">Role</label>
              <p className="text-sm text-[#f5f1e6] capitalize">
                {user?.role || "Student"}
              </p>
            </div>
            <div>
              <label className="text-xs text-[#8a7359]">Interests</label>
              <p className="text-sm text-[#f5f1e6]">
                {user?.interests?.length
                  ? user.interests.join(", ")
                  : "Not set yet"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a3a2a]/40 bg-[#0d1410] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-[#c9a227] uppercase tracking-wider">
            Learning Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1a3a2a]/15 border border-[#1a3a2a]/25">
              <BookOpen className="w-5 h-5 text-[#4ade80]" />
              <div>
                <div className="text-lg font-bold text-[#f5f1e6]">
                  {completedLessons}/{totalLessons}
                </div>
                <div className="text-[10px] text-[#8a7359]">
                  Lessons Completed
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1a3a2a]/15 border border-[#1a3a2a]/25">
              <BarChart3 className="w-5 h-5 text-[#c9a227]" />
              <div>
                <div className="text-lg font-bold text-[#f5f1e6]">
                  {progressPercent}%
                </div>
                <div className="text-[10px] text-[#8a7359]">
                  Overall Progress
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1a3a2a]/15 border border-[#1a3a2a]/25">
              <Flame className="w-5 h-5 text-[#c9a227]" />
              <div>
                <div className="text-lg font-bold text-[#f5f1e6]">
                  {student?.streak || 0} day
                  {(student?.streak || 0) !== 1 ? "s" : ""}
                </div>
                <div className="text-[10px] text-[#8a7359]">
                  Learning Streak
                </div>
              </div>
            </div>
          </div>
        </div>

        {student?.badgeEarned && (
          <div className="rounded-2xl border border-[#c9a227]/25 bg-[#c9a227]/10 p-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-[#c9a227]" />
              <div>
                <h3 className="text-sm font-semibold text-[#c9a227]">
                  Foundation Explorer
                </h3>
                <p className="text-[10px] text-[#8a7359]">
                  Completed the AI Foundations project
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="w-full px-4 py-3 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors"
        >
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}
