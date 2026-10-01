"use client";

import { useEffect, useMemo, useState } from "react";
import { aiModules } from "@/data/curriculum/ai-module-registry";
import {
  getModulesByBand,
  getPrerequisites,
  getStandardsForModule,
} from "@/lib/curriculum/ai-registry";
import { BAND_META } from "@/lib/curriculum/bands";
import {
  loadProgress,
  mergeAIProgress,
  saveProgress,
  toggleExpanded,
  toggleModuleComplete,
  type AIProgressState,
} from "@/lib/curriculum/ai-progress";
import {
  fetchCurriculumProgress,
  pushCurriculumProgress,
} from "@/lib/curriculum/ai-progress-sync";
import {
  AIBandFilter,
  type AIBandFilterId,
  type AIBandOption,
} from "./AIBandFilter";
import { AIModuleRow } from "./AIModuleRow";
import { AIProgressBar } from "./AIProgressBar";

const emptyProgress: AIProgressState = {
  completedModules: [],
  expandedModules: [],
};

export function AICurriculumTimeline() {
  const [progress, setProgress] = useState<AIProgressState>(emptyProgress);
  const [filter, setFilter] = useState<AIBandFilterId>("all");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const local = loadProgress();
    setProgress(local);
    setHydrated(true);
    let cancelled = false;
    void fetchCurriculumProgress().then((remote) => {
      if (cancelled || !remote) return;
      setProgress((current) =>
        mergeAIProgress(current, {
          completedModules: remote,
          expandedModules: [],
        }),
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hydrated) saveProgress(progress);
  }, [hydrated, progress]);

  const completedSet = useMemo(
    () => new Set(progress.completedModules),
    [progress.completedModules],
  );
  const expandedSet = useMemo(
    () => new Set(progress.expandedModules),
    [progress.expandedModules],
  );

  const update = (next: AIProgressState) => {
    setProgress(next);
    void pushCurriculumProgress(next.completedModules);
  };

  const options: AIBandOption[] = [
    { id: "all", label: "All bands", count: aiModules.length },
    ...BAND_META.map((band) => ({
      id: band.id,
      label: band.name,
      count: getModulesByBand(band.id).length,
    })),
  ];

  const visibleBands = BAND_META.filter(
    (band) => filter === "all" || band.id === filter,
  );
  const visibleModules = visibleBands.flatMap((band) =>
    getModulesByBand(band.id),
  );
  const visibleCompleted = visibleModules.filter((m) =>
    completedSet.has(m.id),
  ).length;
  const progressName =
    filter === "all"
      ? "Overall progress"
      : `${BAND_META.find((band) => band.id === filter)?.name} progress`;

  return (
    <div className="ai-timeline">
      <div>
        <AIProgressBar
          completed={visibleCompleted}
          total={visibleModules.length}
          name={progressName}
        />
        <AIBandFilter options={options} active={filter} onChange={setFilter} />
      </div>

      {visibleBands.map((band) => {
        const modules = getModulesByBand(band.id);
        const hours = modules.reduce((sum, m) => sum + m.estimatedHours, 0);
        const bandCompleted = modules.filter((m) =>
          completedSet.has(m.id),
        ).length;

        const renderRow = (module: (typeof aiModules)[number]) => (
          <AIModuleRow
            key={module.id}
            module={module}
            completed={completedSet.has(module.id)}
            expanded={expandedSet.has(module.id)}
            standards={getStandardsForModule(module.id)}
            prerequisites={getPrerequisites(module.id)}
            onToggleComplete={() =>
              update(toggleModuleComplete(progress, module.id))
            }
            onToggleExpand={() => update(toggleExpanded(progress, module.id))}
          />
        );

        return (
          <section key={band.id} className="ai-band" aria-label={band.name}>
            <header className="ai-band-header">
              <h3 className="ai-band-name">{band.name}</h3>
              <span className="ai-band-meta">
                {band.grades} · {modules.length} modules · {hours} h
              </span>
              <span className="ai-band-meta">
                {bandCompleted} of {modules.length} complete
              </span>
            </header>

            {band.levels.length > 1 ? (
              band.levels.map((level) => {
                const levelModules = modules.filter((m) => m.level === level);
                return (
                  <div key={level}>
                    <h4 className="ai-level-header">
                      Level {level} · {levelModules.length} modules
                    </h4>
                    <ul className="ai-module-list">
                      {levelModules.map(renderRow)}
                    </ul>
                  </div>
                );
              })
            ) : (
              <ul className="ai-module-list">{modules.map(renderRow)}</ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
