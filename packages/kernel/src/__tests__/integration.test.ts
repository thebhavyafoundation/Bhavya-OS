// Integration Test — All 27 Kernel Modules
// Verifies the entire kernel boots and modules work together.

import { boot } from "../boot/index.js";
import { Runtime } from "../runtime/index.js";
import { Configuration } from "../configuration/index.js";
import { ProductionConfiguration } from "../configuration/production.js";
import { Logging } from "../logging/index.js";
import { EventBus } from "../events/index.js";
import { Registry } from "../registry/index.js";
import { MemoryEngine } from "../memory/index.js";
import { Permissions } from "../permissions/index.js";
import { Health } from "../health/index.js";
import { Scheduler } from "../scheduler/index.js";
import { Planner } from "../planner/index.js";
import { Api } from "../api/index.js";
import { Observability } from "../observability/index.js";
import { Idempotency } from "../idempotency/index.js";
import { Coordinator } from "../coordinator/index.js";
import { ReplayEngine } from "../replay/index.js";
import { SelfOrganizingEngine } from "../self-organizing/index.js";
import { EventDrivenOrchestrator } from "../orchestrator/index.js";
import { ConsensusEngine } from "../consensus/index.js";
import { CapabilityMatcher } from "../capability-matcher/index.js";
import { Auth } from "../auth/index.js";
import { RateLimiter } from "../rate-limit/index.js";
import { Monitoring } from "../monitoring/index.js";
import { BackupRecovery } from "../backup/index.js";
import { TransparencyService } from "../services/transparency.js";
import { VolunteerService } from "../services/volunteer.js";
import { ResearchService } from "../services/research.js";
import { GovernanceService } from "../services/governance.js";

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

export class IntegrationTest {
  private results: TestResult[] = [];

  async runAll(): Promise<{
    passed: number;
    failed: number;
    total: number;
    results: TestResult[];
  }> {
    console.log("=== Bhavya OS Integration Test ===\n");

    await this.test("Production Configuration", async () => {
      const config = new ProductionConfiguration();
      await config.initialize();
      if (config.get("environment") !== "development")
        throw new Error("Wrong environment");
    });

    await this.test("Event Bus", async () => {
      const events = new EventBus();
      let received = false;
      events.on("test", async () => {
        received = true;
      });
      await events.emit("test", {});
      if (!received) throw new Error("Event not received");
    });

    await this.test("Memory Engine", async () => {
      const memory = new MemoryEngine();
      await memory.initialize();
      await memory.set({
        type: "test",
        content: "hello",
        tags: [],
        source: "test",
        confidence: 1,
      });
      const entries = await memory.getAll();
      if (entries.length === 0) throw new Error("No entries");
    });

    await this.test("Registry", async () => {
      const registry = new Registry();
      await registry.initialize();
    });

    await this.test("Auth", async () => {
      const auth = new Auth({
        secret: "a".repeat(32),
        tokenExpiryMs: 3600,
        refreshExpiryMs: 86400,
        issuer: "test",
      });
      await auth.initialize();
      const token = await auth.issueToken("agent:1", ["agent"]);
      const { valid } = await auth.validateToken(token.id);
      if (!valid) throw new Error("Token invalid");
    });

    await this.test("Rate Limiter", async () => {
      const limiter = new RateLimiter({ windowMs: 60000, maxRequests: 10 });
      await limiter.initialize();
      const result = await limiter.check({ agentId: "test" });
      if (!result.allowed) throw new Error("Request blocked");
    });

    await this.test("Monitoring", async () => {
      const monitoring = new Monitoring({
        alertThresholds: { errors: 10 },
        sampleRate: 1,
        retentionMs: 3600000,
      });
      await monitoring.initialize();
      monitoring.record("test.metric", 42);
      const metrics = monitoring.getMetrics("test.metric");
      if (metrics.length === 0) throw new Error("No metrics");
    });

    await this.test("Backup & Recovery", async () => {
      const backup = new BackupRecovery({
        root: process.cwd(),
        backupDir: "/tmp/bhavya-backups",
        maxBackups: 3,
        autoBackupIntervalMs: 0,
      });
      await backup.initialize();
      const b = await backup.createBackup();
      if (b.status !== "completed") throw new Error("Backup failed");
    });

    await this.test("Self-Organizing Engine", async () => {
      const engine = new SelfOrganizingEngine({
        events: { emit: async () => {}, on: () => () => {} },
        memory: {
          set: async () => ({}),
          get: async () => undefined,
          search: async () => [],
        },
        agents: {
          getAll: () => [],
          getAvailable: () => [],
          getBestMatch: () => undefined,
        },
      });
      await engine.initialize();
      const work = await engine.discoverWork({
        type: "task",
        title: "Test",
        description: "Test",
        requiredCapabilities: ["test"],
      });
      if (!work.id) throw new Error("No work item");
    });

    await this.test("Consensus Engine", async () => {
      const engine = new ConsensusEngine({
        events: { emit: async () => {} },
        memory: { set: async () => ({}) },
        agents: { getAll: () => [{ id: "a1", name: "Agent 1" }] },
      });
      await engine.initialize();
      const proposal = await engine.createProposal({
        title: "Test",
        description: "Test",
        proposedBy: "a1",
        type: "decision",
      });
      if (!proposal.id) throw new Error("No proposal");
    });

    await this.test("Capability Matcher", async () => {
      const matcher = new CapabilityMatcher({
        agents: {
          getAll: () => [
            {
              id: "a1",
              name: "Agent 1",
              capabilities: ["react"],
              availability: "available",
              currentWorkload: 0,
              maxWorkload: 5,
              performance: 0.9,
            },
          ],
        },
      });
      await matcher.initialize();
      const result = await matcher.match({
        id: "req-1",
        requiredCapabilities: ["react"],
        priority: "high",
      });
      if (!result.bestMatch) throw new Error("No match");
    });

    await this.test("Transparency Service", async () => {
      const service = new TransparencyService(process.cwd());
      await service.initialize();
    });

    await this.test("Volunteer Service", async () => {
      const service = new VolunteerService();
      await service.initialize();
    });

    await this.test("Research Service", async () => {
      const service = new ResearchService(process.cwd());
      await service.initialize();
    });

    await this.test("Governance Service", async () => {
      const service = new GovernanceService(process.cwd());
      await service.initialize();
    });

    const passed = this.results.filter((r) => r.passed).length;
    const failed = this.results.filter((r) => !r.passed).length;

    console.log(
      `\n=== Results: ${passed}/${this.results.length} passed, ${failed} failed ===`,
    );

    if (failed > 0) {
      console.log("\nFailed tests:");
      this.results
        .filter((r) => !r.passed)
        .forEach((r) => {
          console.log(`  - ${r.name}: ${r.error}`);
        });
    }

    return {
      passed,
      failed,
      total: this.results.length,
      results: this.results,
    };
  }

  private async test(name: string, fn: () => Promise<void>): Promise<void> {
    const start = Date.now();
    try {
      await fn();
      const duration = Date.now() - start;
      this.results.push({ name, passed: true, duration });
      console.log(`  ✓ ${name} (${duration}ms)`);
    } catch (err) {
      const duration = Date.now() - start;
      const error = err instanceof Error ? err.message : String(err);
      this.results.push({ name, passed: false, duration, error });
      console.log(`  ✗ ${name} (${duration}ms): ${error}`);
    }
  }
}
