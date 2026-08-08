"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const skills = [
  { name: "Python", pct: 92, angle: 0 },
  { name: "ML", pct: 78, angle: 72 },
  { name: "DL", pct: 65, angle: 144 },
  { name: "Statistics", pct: 85, angle: 216 },
  { name: "MLOps", pct: 45, angle: 288 },
];

const projects = [
  {
    id: 1,
    title: "House Price Predictor",
    tags: ["ML", "Regression", "Scikit-learn"],
    duration: "2 weeks",
    status: "completed" as const,
  },
  {
    id: 2,
    title: "Sentiment Analyzer",
    tags: ["NLP", "Transformers", "BERT"],
    duration: "1 week",
    status: "completed" as const,
  },
  {
    id: 3,
    title: "Image Classifier",
    tags: ["CV", "CNN", "PyTorch"],
    duration: "3 weeks",
    status: "in_progress" as const,
  },
];

const papers = [
  {
    title:
      "Efficient Fine-Tuning of Small Language Models for Domain-Specific Tasks",
    venue: "arXiv preprint",
    year: "2025",
  },
  {
    title:
      "Data Augmentation Strategies for Low-Resource NLP in South Asian Languages",
    venue: "Bhavya AI Workshop",
    year: "2025",
  },
];

const badges = [
  { name: "First Lab", icon: "🔬", color: "from-[#1a3a2a] to-[#1a3a2a]/60" },
  { name: "7-Day Streak", icon: "🔥", color: "from-[#c9a227] to-[#c9a227]/60" },
  { name: "Code Master", icon: "💻", color: "from-[#8a7359] to-[#8a7359]/60" },
  { name: "Peer Reviewer", icon: "👁", color: "from-[#1a3a2a] to-[#c9a227]/60" },
  {
    name: "Research Lead",
    icon: "📄",
    color: "from-[#c9a227] to-[#8a7359]/60",
  },
];

function RadarChart() {
  const cx = 150;
  const cy = 150;
  const r = 110;
  const rings = [0.25, 0.5, 0.75, 1];
  const n = skills.length;

  const getPoint = (angle: number, radius: number) => ({
    x: cx + radius * Math.cos((Math.PI * 2 * angle) / 360 - Math.PI / 2),
    y: cy + radius * Math.sin((Math.PI * 2 * angle) / 360 - Math.PI / 2),
  });

  const dataPoints = skills
    .map((s) => {
      const p = getPoint(s.angle, (s.pct / 100) * r);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <div className="relative w-full max-w-[320px] mx-auto">
      <svg viewBox="0 0 300 300" className="w-full h-auto">
        {rings.map((ring) => {
          const pts = Array.from({ length: n }, (_, i) => {
            const p = getPoint(skills[i].angle, ring * r);
            return `${p.x},${p.y}`;
          }).join(" ");
          return (
            <polygon
              key={ring}
              points={pts}
              fill="none"
              stroke="rgba(245,241,230,0.06)"
              strokeWidth={1}
            />
          );
        })}

        {skills.map((s) => {
          const p = getPoint(s.angle, r);
          return (
            <line
              key={s.name}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="rgba(245,241,230,0.06)"
              strokeWidth={1}
            />
          );
        })}

        <motion.polygon
          points={dataPoints}
          fill="rgba(26,58,42,0.4)"
          stroke="#c9a227"
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1] as const,
            delay: 0.3,
          }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {skills.map((s) => {
          const p = getPoint(s.angle, (s.pct / 100) * r);
          return (
            <circle
              key={s.name}
              cx={p.x}
              cy={p.y}
              r={4}
              fill="#c9a227"
              stroke="#0a0f0d"
              strokeWidth={2}
            />
          );
        })}

        {skills.map((s) => {
          const p = getPoint(s.angle, r + 28);
          return (
            <text
              key={s.name}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[#f5f1e6]/50 text-[10px] font-medium"
            >
              {s.name}
            </text>
          );
        })}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#c9a227]">73</div>
          <div className="text-[10px] text-[#f5f1e6]/30 uppercase tracking-wider">
            Avg Score
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <div className="py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            My{" "}
            <span className="bg-gradient-to-r from-[#c9a227] via-[#8a7359] to-[#1a3a2a] bg-clip-text text-transparent">
              Portfolio
            </span>
          </h1>
          <p className="text-lg text-[#f5f1e6]/40 font-mono">sarah.bhavya.ai</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-8 md:p-10 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a3a2a] to-[#c9a227] flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-[#f5f1e6]">SC</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">Sarah Chen</h2>
              <p className="text-[#c9a227] font-medium mb-2">
                AI Builder · Level 3
              </p>
              <p className="text-sm text-[#f5f1e6]/40">
                Machine Learning Specialization
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#c9a227] animate-pulse" />
                <span className="text-sm font-semibold text-[#c9a227]">
                  2,450 XP
                </span>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-xl text-xs font-medium bg-[#c9a227] text-[#0a0f0d] hover:bg-[#c9a227]/90 transition-colors">
                  Share
                </button>
                <button className="px-4 py-2 rounded-xl text-xs font-medium bg-white/5 text-[#f5f1e6]/60 hover:bg-white/10 transition-colors border border-white/10">
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="lg:col-span-2 rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-8"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
              Skills
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <RadarChart />
              <div className="flex-1 space-y-3 w-full">
                {skills.map((s) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[#f5f1e6]/60">
                        {s.name}
                      </span>
                      <span className="text-xs font-mono text-[#c9a227]">
                        {s.pct}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.pct}%` }}
                        transition={{
                          delay: 0.5,
                          duration: 0.8,
                          ease: [0.22, 1, 0.36, 1] as const,
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-[#1a3a2a] to-[#c9a227]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-8"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8a7359]" />
              Achievements
            </h3>
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {badges.map((b) => (
                <motion.div
                  key={b.name}
                  variants={fadeUp}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-[#c9a227]/20 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center text-lg`}
                  >
                    {b.icon}
                  </div>
                  <span className="text-sm font-medium text-[#f5f1e6]/70">
                    {b.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a3a2a]" />
            Projects
          </h3>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {projects.map((p) => (
              <motion.div
                key={p.id}
                variants={fadeUp}
                className="group rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent overflow-hidden hover:border-[#c9a227]/20 transition-all duration-300"
              >
                <div className="h-36 bg-gradient-to-br from-[#1a3a2a]/30 to-[#0a0f0d] flex items-center justify-center relative">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-[#f5f1e6]/20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"
                      />
                    </svg>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                        p.status === "completed"
                          ? "bg-[#1a3a2a] text-[#c9a227] border border-[#c9a227]/20"
                          : "bg-[#c9a227]/15 text-[#c9a227] border border-[#c9a227]/20"
                      }`}
                    >
                      {p.status === "completed" ? "Done" : "In Progress"}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold mb-2 group-hover:text-[#c9a227] transition-colors">
                    {p.title}
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#f5f1e6]/5 text-[#f5f1e6]/40"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#f5f1e6]/30">
                      {p.duration}
                    </span>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-[#f5f1e6]/60 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100">
                      View
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
            Research
          </h3>
          <div className="space-y-3">
            {papers.map((paper, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className="flex items-start gap-4 p-5 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.02] to-transparent hover:border-[#c9a227]/15 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#c9a227]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-[#c9a227]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm leading-snug mb-1 group-hover:text-[#c9a227] transition-colors">
                    {paper.title}
                  </h4>
                  <p className="text-xs text-[#f5f1e6]/35">
                    {paper.venue} · {paper.year}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mt-20 rounded-3xl border border-white/[0.06] bg-gradient-to-br from-[#1a3a2a]/15 to-[#c9a227]/5 p-10 md:p-14 text-center"
        >
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: "3", label: "Projects" },
              { value: "2", label: "Papers" },
              { value: "5", label: "Badges" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
              >
                <div className="text-3xl font-bold bg-gradient-to-b from-[#c9a227] to-[#8a7359] bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-[#f5f1e6]/35 uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
