// Scenario 2: Publish Release Notes
// Input: "Publish release notes"
// Output: Release document, registry update, event, snapshot, metrics

import { resolve } from "node:path";
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  readdirSync,
} from "node:fs";
import type {
  ExecutionContext,
  Artifact,
  ExecutionReport,
} from "../types/index.js";

export interface PublishReleaseInput {
  version: string;
  title: string;
  description: string;
  changes: string[];
}

export interface PublishReleaseContext {
  root: string;
  events: {
    emit: (type: string, payload: Record<string, unknown>) => Promise<void>;
  };
  memory: { set: (entry: Record<string, unknown>) => Promise<unknown> };
}

export class PublishReleaseNotes {
  private ctx: PublishReleaseContext;

  constructor(ctx: PublishReleaseContext) {
    this.ctx = ctx;
  }

  async execute(input: PublishReleaseInput): Promise<ExecutionReport> {
    const startTime = Date.now();
    const executionId = `exec:${crypto.randomUUID()}`;
    const artifacts: Artifact[] = [];
    const events: string[] = [];
    const memoryUpdates: string[] = [];

    const context: ExecutionContext = {
      executionId,
      correlationId: `corr:${crypto.randomUUID()}`,
      retryCount: 0,
      maxRetries: 3,
      state: "running",
      timestamps: { started: new Date(), lastUpdated: new Date() },
      metadata: { scenario: "publish-release-notes" },
    };

    try {
      // 1. Generate release document
      const releaseContent = this.generateReleaseDocument(input);
      const releasesDir = resolve(this.ctx.root, "docs/releases");
      if (!existsSync(releasesDir)) mkdirSync(releasesDir, { recursive: true });
      const releasePath = resolve(releasesDir, `v${input.version}.md`);
      writeFileSync(releasePath, releaseContent);
      artifacts.push({
        path: `docs/releases/v${input.version}.md`,
        action: "created",
        content: releaseContent,
        metadata: {},
      });

      // 2. Update release registry
      const registryPath = resolve(this.ctx.root, "registry/releases.json");
      if (existsSync(registryPath)) {
        const registry = JSON.parse(readFileSync(registryPath, "utf-8"));
        registry.releases = registry.releases || [];
        registry.releases.push({
          version: input.version,
          title: input.title,
          date: new Date().toISOString(),
          path: `docs/releases/v${input.version}.md`,
        });
        writeFileSync(registryPath, JSON.stringify(registry, null, 2));
        artifacts.push({
          path: "registry/releases.json",
          action: "updated",
          metadata: {},
        });
      }

      // 3. Create snapshot
      const snapshotDir = resolve(
        this.ctx.root,
        `.snapshots/v${input.version}`,
      );
      if (!existsSync(snapshotDir)) mkdirSync(snapshotDir, { recursive: true });
      const snapshot = {
        version: input.version,
        timestamp: new Date().toISOString(),
        files: this.getSnapshotFiles(),
      };
      writeFileSync(
        resolve(snapshotDir, "snapshot.json"),
        JSON.stringify(snapshot, null, 2),
      );
      artifacts.push({
        path: `.snapshots/v${input.version}/snapshot.json`,
        action: "created",
        metadata: {},
      });

      // 4. Update metrics
      const metricsPath = resolve(this.ctx.root, ".metrics/engineering.json");
      if (existsSync(metricsPath)) {
        const metrics = JSON.parse(readFileSync(metricsPath, "utf-8"));
        metrics.data.releases.total++;
        metrics.data.releases.latest = input.version;
        writeFileSync(metricsPath, JSON.stringify(metrics, null, 2));
        artifacts.push({
          path: ".metrics/engineering.json",
          action: "updated",
          metadata: {},
        });
      }

      // 5. Update memory
      await this.ctx.memory.set({
        type: "history",
        content: `Release ${input.version} published: ${input.title}`,
        tags: ["release", input.version, "published"],
        source: "publish-release-notes",
        confidence: 1,
      });
      memoryUpdates.push(`Release ${input.version} documented in memory`);

      // 6. Emit events
      await this.ctx.events.emit("release.created", {
        version: input.version,
        title: input.title,
        artifacts: artifacts.length,
      });
      events.push("release.created");

      context.state = "completed";
      context.timestamps.completed = new Date();

      return {
        executionId,
        tasks: [],
        artifacts,
        events,
        memoryUpdates,
        status: "success",
        duration: Date.now() - startTime,
        timestamp: new Date(),
        context,
      };
    } catch (error) {
      context.state = "failed";
      context.timestamps.completed = new Date();

      return {
        executionId,
        tasks: [],
        artifacts,
        events,
        memoryUpdates,
        status: "failed",
        duration: Date.now() - startTime,
        timestamp: new Date(),
        context,
      };
    }
  }

  private generateReleaseDocument(input: PublishReleaseInput): string {
    return `# v${input.version}\n\n**Release Date:** ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}\n**Status:** Released\n\n---\n\n## ${input.title}\n\n${input.description}\n\n## Changes\n\n${input.changes.map((c) => `- ${c}`).join("\n")}\n\n---\n\n**End of release notes.**\n`;
  }

  private getSnapshotFiles(): string[] {
    const files: string[] = [];
    const dirs = [".ai", "memory", ".workflows", "registry"];
    for (const dir of dirs) {
      const dirPath = resolve(this.ctx.root, dir);
      if (existsSync(dirPath)) {
        const dirFiles = readdirSync(dirPath, { recursive: true });
        files.push(
          ...dirFiles
            .filter((f): f is string => typeof f === "string")
            .map((f) => `${dir}/${f}`),
        );
      }
    }
    return files;
  }
}
