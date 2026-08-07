"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

function AnimatedCounter({
  target,
  duration = 1.2,
}: {
  target: number;
  duration?: number;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const controls = animate(count, target, { duration, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [target, duration, count, rounded]);

  return <span>{display}</span>;
}

const stats = [
  { label: "Lessons Completed", value: 12, icon: "📚", color: "#1a3a2a" },
  { label: "Labs Done", value: 3, icon: "🔬", color: "#c9a227" },
  { label: "Projects", value: 2, icon: "🚀", color: "#8a7359" },
  { label: "XP Earned", value: 2450, icon: "⭐", color: "#1a3a2a" },
];

const activity = [
  {
    time: "2 min ago",
    text: "Completed Linear Regression lesson",
    type: "lesson",
  },
  {
    time: "1 hour ago",
    text: "Started Lab 1: Data Preprocessing",
    type: "lab",
  },
  {
    time: "3 hours ago",
    text: "Submitted Project: Sentiment Analyzer",
    type: "project",
  },
  { time: "Yesterday", text: "Earned 150 XP for streak bonus", type: "xp" },
  {
    time: "2 days ago",
    text: "Completed Neural Networks Foundations",
    type: "lesson",
  },
];

const quickActions = [
  {
    label: "Continue Lesson",
    href: "/courses/foundations/lessons/1",
    icon: "📖",
  },
  { label: "Open Lab", href: "/courses/foundations/lab", icon: "🧪" },
  { label: "Ask Mentor", href: "/playground", icon: "💬" },
  { label: "View Projects", href: "/projects", icon: "🛠" },
  { label: "Explore Research", href: "/knowledge-graph", icon: "🔬" },
  { label: "Knowledge Graph", href: "/knowledge-graph", icon: "🧠" },
];

const streakDays = [
  { day: "Mon", filled: true },
  { day: "Tue", filled: true },
  { day: "Wed", filled: true },
  { day: "Thu", filled: false },
  { day: "Fri", filled: true },
  { day: "Sat", filled: false },
  { day: "Sun", filled: false },
];

const schedule = [
  { day: "Mon", event: "ML Foundations", time: "10:00 AM", type: "lesson" },
  { day: "Wed", event: "Lab: Data Prep", time: "2:00 PM", type: "lab" },
  { day: "Fri", event: "Neural Networks", time: "10:00 AM", type: "lesson" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

export default function WorkspacePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/"
              className="text-xs text-white/30 hover:text-white/50 transition-colors mb-6 inline-flex items-center gap-1.5"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              AI Institute
            </Link>
            <h1
              className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-2"
              style={{
                background: "linear-gradient(135deg, #f5f1e6 0%, #c9a227 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Workspace
            </h1>
            <p className="text-white/40 text-lg">
              Your learning command center
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white/30"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search lessons, labs, concepts..."
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-12 pr-28 py-3.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#c9a227]/40 focus:ring-1 focus:ring-[#c9a227]/20 transition-all"
          />
          <div className="absolute inset-y-0 right-4 flex items-center gap-1.5">
            <kbd className="px-2 py-0.5 text-[10px] font-medium text-white/30 bg-white/[0.06] border border-white/[0.1] rounded-md">
              ⌘K
            </kbd>
          </div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i}
              className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: stat.color, opacity: 0.08 }}
              />
              <div className="text-2xl mb-3">{stat.icon}</div>
              <div
                className="text-3xl font-bold tracking-tight mb-1"
                style={{ color: "#f5f1e6" }}
              >
                <AnimatedCounter target={stat.value} />
              </div>
              <div className="text-xs text-white/35 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
            Continue Learning
          </h2>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-[#1a3a2a]/40 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-[#1a3a2a]/30 text-[#4ade80]">
                    Lesson 7
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-[#c9a227]/20 text-[#c9a227]">
                    In Progress
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-2">
                  Linear Regression: From Theory to Production
                </h3>
                <p className="text-sm text-white/40 mt-1">
                  Master the fundamentals of linear models, cost functions, and
                  gradient descent.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#c9a227]">68%</div>
                <div className="text-[10px] text-white/30">34 of 50 min</div>
              </div>
            </div>
            <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "68%" }}
                transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #1a3a2a, #c9a227)",
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4 text-xs text-white/30">
                <span>Module 2 of 5</span>
                <span>•</span>
                <span>~16 min remaining</span>
              </div>
              <Link
                href="/courses/foundations/lessons/1"
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-[#1a3a2a] text-[#4ade80] hover:bg-[#1a3a2a]/80 transition-colors"
              >
                Resume →
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
              Recent Activity
            </h2>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <div className="space-y-0">
                {activity.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 pb-5 last:pb-0 relative"
                  >
                    {i < activity.length - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-0 w-px bg-white/[0.06]" />
                    )}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] ${
                        item.type === "lesson"
                          ? "bg-[#1a3a2a]/40 text-[#4ade80]"
                          : item.type === "lab"
                            ? "bg-[#c9a227]/20 text-[#c9a227]"
                            : item.type === "project"
                              ? "bg-[#8a7359]/20 text-[#d4b896]"
                              : "bg-[#1a3a2a]/30 text-[#4ade80]"
                      }`}
                    >
                      {item.type === "lesson"
                        ? "📖"
                        : item.type === "lab"
                          ? "🧪"
                          : item.type === "project"
                            ? "🛠"
                            : "⭐"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/70">{item.text}</p>
                      <p className="text-[11px] text-white/25 mt-0.5">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
              Learning Streak
            </h2>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="text-4xl font-bold text-[#c9a227]">4</div>
                <div>
                  <div className="text-sm font-medium text-white/60">
                    day streak
                  </div>
                  <div className="text-[10px] text-white/25">Best: 7 days</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                {streakDays.map((d, i) => (
                  <motion.div
                    key={d.day}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.6 + i * 0.05,
                      type: "spring",
                      stiffness: 300,
                    }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                        d.filled
                          ? "bg-[#1a3a2a] text-[#4ade80] shadow-[0_0_12px_rgba(26,58,42,0.4)]"
                          : "bg-white/[0.04] text-white/20 border border-white/[0.06]"
                      }`}
                    >
                      {d.filled ? "✓" : ""}
                    </div>
                    <span className="text-[10px] text-white/25">{d.day}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4 mt-6">
              Weekly Schedule
            </h2>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
              <div className="space-y-3">
                {schedule.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                        s.type === "lab"
                          ? "bg-[#c9a227]/15 text-[#c9a227]"
                          : "bg-[#1a3a2a]/30 text-[#4ade80]"
                      }`}
                    >
                      {s.day}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white/70">
                        {s.event}
                      </div>
                      <div className="text-[11px] text-white/30">{s.time}</div>
                    </div>
                    <div
                      className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${
                        s.type === "lab"
                          ? "bg-[#c9a227]/10 text-[#c9a227]"
                          : "bg-[#1a3a2a]/20 text-[#4ade80]"
                      }`}
                    >
                      {s.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.05, duration: 0.4 }}
              >
                <Link
                  href={action.href}
                  className="group block bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center hover:border-[#c9a227]/30 hover:bg-white/[0.05] transition-all duration-300"
                >
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {action.icon}
                  </div>
                  <div className="text-xs font-medium text-white/50 group-hover:text-white/70 transition-colors">
                    {action.label}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
