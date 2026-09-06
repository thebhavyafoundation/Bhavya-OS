"use client";

import { useState, useEffect } from "react";

// --- Data Structures ---
interface SkillData {
  id: string;
  skill: string;
  confidence: number; // 0-100
  evidence: string;
  nextStep: string;
}

interface DayData {
  day: string;
  minutes: number;
  streak: boolean;
}

interface UserProfile {
  name: string;
  joinDate: string;
}

interface SkillProgressProps {
  user?: UserProfile;
}

// --- Subcomponents ---

function SkillBar({
  skill,
  confidence,
}: {
  skill: string;
  confidence: number;
}) {
  const getColor = (conf: number) => {
    if (conf >= 70) return "var(--color-accent-green, #22c55e)";
    if (conf >= 40) return "var(--color-accent-gold, #f59e0b)";
    return "#ef4444";
  };

  const color = getColor(confidence);

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-white/80">{skill}</span>
        <span className="text-xs text-white/50">{confidence}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${confidence}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function DayBlock({ day, minutes, streak }: DayData) {
  const getIntensity = (min: number) => {
    if (min >= 30) return "bg-accent-green";
    if (min >= 15) return "bg-accent-green/60";
    if (min > 0) return "bg-accent-green/30";
    return "bg-white/5";
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-medium text-white/80 ${getIntensity(minutes)} ${streak ? "ring-1 ring-accent-green/50" : ""}`}
      >
        {minutes > 0 ? `${minutes}m` : "-"}
      </div>
      <span className="text-[10px] text-white/40">{day}</span>
    </div>
  );
}

function SkillTag({ skill, level }: { skill: string; level: string }) {
  const getColor = (lev: string) => {
    if (lev === "strong")
      return "bg-accent-green/20 text-accent-green border-accent-green/30";
    if (lev === "developing")
      return "bg-amber-500/20 text-amber-500 border-amber-500/30";
    return "bg-white/10 text-white/50 border-white/20";
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full border ${getColor(level)}`}
    >
      {skill}
    </span>
  );
}

// --- Main Component ---
export function ProgressIntelligence({ user }: SkillProgressProps) {
  const [skillData, setSkillData] = useState<SkillData[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<DayData[]>([]);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch skills
        const skillsRes = await fetch("/api/student/skills");
        if (skillsRes.ok) {
          const skillsJson = await skillsRes.json();
          if (skillsJson.data?.skills) setSkillData(skillsJson.data.skills);
        }

        // Fetch activity
        const activityRes = await fetch("/api/student/activity");
        if (activityRes.ok) {
          const activityJson = await activityRes.json();
          if (activityJson.data?.weekly)
            setWeeklyActivity(activityJson.data.weekly);
          if (activityJson.data?.streak)
            setStreakCount(activityJson.data.streak);
        }
      } catch {
        // Use empty defaults
      }
    };
    fetchData();
  }, []);

  const hasSkillData = skillData.length > 0;
  const hasActivity = weeklyActivity.some((d) => d.minutes > 0);
  const hasData = hasSkillData || hasActivity;

  const skillsByLevel = {
    strong: skillData.filter((s) => s.confidence >= 70),
    developing: skillData.filter(
      (s) => s.confidence >= 40 && s.confidence < 70,
    ),
    beginner: skillData.filter((s) => s.confidence < 40),
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Your Progress</h3>
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span>Streak: {streakCount} days</span>
          <span className="text-accent-green">
            {streakCount > 0 ? "🔥" : "—"}
          </span>
        </div>
      </div>

      {!hasData && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl mb-4">
            📊
          </div>
          <h4 className="text-sm font-semibold text-white/80 mb-1">
            No progress data yet
          </h4>
          <p className="text-xs text-white/50 max-w-[240px]">
            Start learning and your skills, activity, and streak will appear
            here.
          </p>
        </div>
      )}

      {hasData && (
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Skill Bars */}
          {hasSkillData && (
            <div>
              <h4 className="text-sm font-semibold text-white/70 mb-3">
                Skill Confidence
              </h4>
              {skillData
                .sort((a, b) => b.confidence - a.confidence)
                .map((s) => (
                  <SkillBar
                    key={s.id}
                    skill={s.skill}
                    confidence={s.confidence}
                  />
                ))}
            </div>
          )}

          {/* Skill Tags */}
          {hasSkillData && (
            <div>
              <h4 className="text-sm font-semibold text-white/70 mb-2">
                Skills Acquired
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skillsByLevel.strong.map((s) => (
                  <SkillTag key={s.id} skill={s.skill} level="strong" />
                ))}
                {skillsByLevel.developing.map((s) => (
                  <SkillTag key={s.id} skill={s.skill} level="developing" />
                ))}
                {skillsByLevel.beginner.map((s) => (
                  <SkillTag key={s.id} skill={s.skill} level="beginner" />
                ))}
              </div>
            </div>
          )}

          {/* Weekly Activity */}
          {hasActivity && (
            <div>
              <h4 className="text-sm font-semibold text-white/70 mb-2">
                This Week&apos;s Activity
              </h4>
              <div className="flex justify-between items-end gap-1">
                {weeklyActivity.map((day) => (
                  <DayBlock key={day.day} {...day} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
