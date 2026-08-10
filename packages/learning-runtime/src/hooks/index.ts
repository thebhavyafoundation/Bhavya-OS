"use client";

import { useState, useCallback, useRef } from "react";
import { LearningRuntime } from "../runtime/runtime";
import { MockProvider } from "../providers/mock";
import type { Experiment, MentorResponse, Reflection, PortfolioArtifact, CapabilityScore } from "../types";

let runtimeInstance: LearningRuntime | null = null;

function getRuntime(): LearningRuntime {
  if (!runtimeInstance) {
    runtimeInstance = new LearningRuntime(new MockProvider());
  }
  return runtimeInstance;
}

export function useRuntime() {
  const runtime = useRef(getRuntime());

  const startLesson = useCallback(async (lessonId: string) => {
    await runtime.current.startLesson(lessonId);
  }, []);

  const runExperiment = useCallback(async (prompt: string, context?: string) => {
    return runtime.current.runExperiment(prompt, context);
  }, []);

  const getMentorFeedback = useCallback(async (experiment: Experiment) => {
    return runtime.current.getMentorFeedback(experiment);
  }, []);

  const getExperiments = useCallback((lessonId: string) => {
    return runtime.current.getExperiments(lessonId);
  }, []);

  const getBestExperiment = useCallback((lessonId: string) => {
    return runtime.current.getBestExperiment(lessonId);
  }, []);

  const getMetrics = useCallback((lessonId: string) => {
    return runtime.current.getMetrics(lessonId);
  }, []);

  return {
    runtime: runtime.current,
    startLesson,
    runExperiment,
    getMentorFeedback,
    getExperiments,
    getBestExperiment,
    getMetrics,
  };
}

export function usePlayground(lessonId: string) {
  const { runtime, runExperiment, getMentorFeedback } = useRuntime();
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [currentExperiment, setCurrentExperiment] = useState<Experiment | null>(null);
  const [mentorFeedback, setMentorFeedback] = useState<MentorResponse | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [reflection, setReflection] = useState<Reflection | null>(null);

  const execute = useCallback(
    async (promptText: string, context?: string) => {
      setIsRunning(true);
      try {
        const exp = await runExperiment(promptText, context);
        setCurrentExperiment(exp);
        setExperiments(runtime.getExperiments(lessonId));
        const feedback = await getMentorFeedback(exp);
        setMentorFeedback(feedback);
        return exp;
      } finally {
        setIsRunning(false);
      }
    },
    [lessonId, runExperiment, getMentorFeedback, runtime]
  );

  const submitReflection = useCallback(
    (data: Omit<Reflection, "timestamp">) => {
      if (!currentExperiment) return null;
      const r = runtime.reflections.submit(currentExperiment.id, data);
      runtime.experiments.update(currentExperiment.id, { reflection: r });
      setReflection(r);
      setExperiments(runtime.getExperiments(lessonId));
      return r;
    },
    [currentExperiment, lessonId, runtime]
  );

  const compare = useCallback(
    (id1: string, id2: string) => {
      return runtime.compareAttempts(id1, id2);
    },
    [runtime]
  );

  return {
    prompt,
    setPrompt,
    experiments,
    currentExperiment,
    mentorFeedback,
    isRunning,
    reflection,
    execute,
    submitReflection,
    compare,
  };
}
