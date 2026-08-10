import type {
  AIProvider,
  Experiment,
  Reflection,
  PortfolioArtifact,
  CapabilityScore,
  TimeDistribution,
  RuntimeState,
  LessonConfig,
} from "../types";
import { ExperimentEngine } from "../experiments/engine";
import { ReflectionEngine } from "../reflection/engine";
import { AIMentor, type MentorResponse } from "../mentor/mentor";
import { PortfolioGenerator } from "../portfolio/generator";
import { LearningAnalytics } from "../analytics/engine";

export class LearningRuntime {
  readonly experiments: ExperimentEngine;
  readonly reflections: ReflectionEngine;
  private _mentor: AIMentor;
  readonly portfolio: PortfolioGenerator;
  readonly analytics: LearningAnalytics;
  private provider: AIProvider;
  private state: RuntimeState;
  private lessonStartTime: number = 0;

  get mentor(): AIMentor { return this._mentor; }

  constructor(provider: AIProvider) {
    this.provider = provider;
    this.experiments = new ExperimentEngine();
    this.reflections = new ReflectionEngine();
    this._mentor = new AIMentor(provider);
    this.portfolio = new PortfolioGenerator();
    this.analytics = new LearningAnalytics();
    this.state = {
      lessonId: null,
      experiments: [],
      currentExperiment: null,
      artifacts: [],
      analytics: {
        experimentsCompleted: 0,
        totalIterations: 0,
        averageIterations: 0,
        reflectionDepth: 0,
        promptImprovement: 0,
        portfolioArtifacts: 0,
        overallScore: 0,
        trend: "stable",
      },
      timeDistribution: {
        experimenting: 0,
        reflecting: 0,
        building: 0,
        reading: 0,
        totalActive: 0,
        totalPassive: 0,
        creationRatio: 0,
      },
    };
  }

  setProvider(provider: AIProvider): void {
    this.provider = provider;
    this._mentor = new AIMentor(provider);
  }

  async startLesson(lessonId: string): Promise<void> {
    this.state.lessonId = lessonId;
    this.state.experiments = this.experiments.getByLesson(lessonId);
    this.lessonStartTime = Date.now();
  }

  async runExperiment(prompt: string, context?: string): Promise<Experiment> {
    const lessonId = this.state.lessonId || "unknown";
    const start = Date.now();

    const response = await this.provider.complete({
      messages: [
        { role: "system", content: context || "You are a helpful AI assistant." },
        { role: "user", content: prompt },
      ],
    });

    const exp = this.experiments.create(lessonId, prompt, context, response.content);
    this.state.currentExperiment = exp;
    this.state.experiments = this.experiments.getByLesson(lessonId);
    this.analytics.trackExperiment(lessonId, Date.now() - start);
    return exp;
  }

  async getMentorFeedback(experiment: Experiment): Promise<MentorResponse> {
    const metrics = this.experiments.getMetrics(experiment.lessonId);
    return this.mentor.coach(experiment, metrics);
  }

  submitReflection(experimentId: string, reflection: Omit<Reflection, "timestamp">): Reflection {
    const r = this.reflections.submit(experimentId, reflection);
    const exp = this.experiments.getById(experimentId);
    if (exp) {
      this.experiments.update(experimentId, { reflection: r });
      this.analytics.trackReflection(exp.lessonId, 0);
    }
    this.state.experiments = this.experiments.getByLesson(this.state.lessonId || "");
    return r;
  }

  getExperiments(lessonId: string): Experiment[] {
    return this.experiments.getByLesson(lessonId);
  }

  getBestExperiment(lessonId: string): Experiment | null {
    return this.experiments.getBest(lessonId);
  }

  getMetrics(lessonId: string) {
    return this.experiments.getMetrics(lessonId);
  }

  compareAttempts(id1: string, id2: string) {
    const e1 = this.experiments.getById(id1);
    const e2 = this.experiments.getById(id2);
    if (!e1 || !e2) return null;
    return { a: e1, b: e2 };
  }

  generateArtifact(params: {
    lessonId: string;
    title: string;
    description: string;
    skills: string[];
    knowledgePackages?: string[];
    repositories?: string[];
    technologies?: string[];
  }): PortfolioArtifact {
    const lessonId = params.lessonId;
    const experiments = this.experiments.getByLesson(lessonId);
    const reflections = experiments
      .map((e) => (e.reflection ? [e.reflection] : []))
      .flat();

    const artifact = this.portfolio.generate({
      ...params,
      experiments,
      reflections,
    });

    this.state.artifacts.push(artifact);
    this.updateAnalytics();
    return artifact;
  }

  exportArtifactJSON(artifact: PortfolioArtifact): string {
    return this.portfolio.exportJSON(artifact);
  }

  exportArtifactHTML(artifact: PortfolioArtifact): string {
    return this.portfolio.exportHTML(artifact);
  }

  getAnalytics(): CapabilityScore {
    return this.state.analytics;
  }

  getTimeDistribution(lessonId: string): TimeDistribution {
    return this.analytics.getTimeDistribution(lessonId);
  }

  getState(): RuntimeState {
    return { ...this.state };
  }

  private updateAnalytics(): void {
    const lessonId = this.state.lessonId || "";
    const experiments = this.experiments.getByLesson(lessonId);
    const allReflections = experiments
      .map((e) => (e.reflection ? [e.reflection] : []))
      .flat();
    this.state.analytics = this.analytics.getCapabilityScore({
      experiments,
      reflections: allReflections,
      artifacts: this.state.artifacts,
    });
    this.state.timeDistribution = this.analytics.getTimeDistribution(lessonId);
  }
}
