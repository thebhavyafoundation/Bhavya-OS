"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

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
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#4ade80]">0</div>
              <div className="text-xs text-[#8a7359]">Lessons Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#c9a227]">0</div>
              <div className="text-xs text-[#8a7359]">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#f5f1e6]">0%</div>
              <div className="text-xs text-[#8a7359]">Progress</div>
            </div>
          </div>
        </div>

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
