import { createHash } from "crypto";
import { KnowledgePackage } from "./types.js";

export interface VersionSnapshot {
  id: string;
  packageId: string;
  version: string;
  timestamp: Date;
  contentHash: string;
  snapshot: Partial<KnowledgePackage>;
  author: string;
  description: string;
  tags: string[];
  size: number;
}

export interface DiffResult {
  field: string;
  type: "added" | "removed" | "modified";
  oldValue?: string | number | boolean | Record<string, unknown>;
  newValue?: string | number | boolean | Record<string, unknown>;
}

export class ContentVersioning {
  private snapshots: Map<string, VersionSnapshot[]> = new Map();

  async createSnapshot(
    pkg: KnowledgePackage,
    author: string,
    description: string,
    tags: string[] = [],
  ): Promise<VersionSnapshot> {
    const id = `vs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const contentHash = this.hashPackage(pkg);
    const size = this.calculateSize(pkg);

    const snapshot: VersionSnapshot = {
      id,
      packageId: pkg.id,
      version: pkg.version,
      timestamp: new Date(),
      contentHash,
      snapshot: {
        metadata: { ...pkg.metadata },
        content: { ...pkg.content },
        assessment: { ...pkg.assessment },
        resources: { ...pkg.resources },
        quality: { ...pkg.quality },
      },
      author,
      description,
      tags,
      size,
    };

    const existing = this.snapshots.get(pkg.id) || [];
    existing.push(snapshot);
    this.snapshots.set(pkg.id, existing);

    return snapshot;
  }

  async getSnapshots(packageId: string): Promise<VersionSnapshot[]> {
    return this.snapshots.get(packageId) || [];
  }

  async getSnapshotById(
    snapshotId: string,
  ): Promise<VersionSnapshot | undefined> {
    for (const snapshots of this.snapshots.values()) {
      const found = snapshots.find((s) => s.id === snapshotId);
      if (found) return found;
    }
    return undefined;
  }

  async getSnapshotByVersion(
    packageId: string,
    version: string,
  ): Promise<VersionSnapshot | undefined> {
    const snapshots = this.snapshots.get(packageId) || [];
    return snapshots.find((s) => s.version === version);
  }

  async getLatestSnapshot(
    packageId: string,
  ): Promise<VersionSnapshot | undefined> {
    const snapshots = this.snapshots.get(packageId) || [];
    return snapshots[snapshots.length - 1];
  }

  async compareVersions(
    packageId: string,
    version1: string,
    version2: string,
  ): Promise<DiffResult[]> {
    const snapshot1 = await this.getSnapshotByVersion(packageId, version1);
    const snapshot2 = await this.getSnapshotByVersion(packageId, version2);

    if (!snapshot1 || !snapshot2) {
      throw new Error("One or both versions not found");
    }

    return this.compareSnapshots(snapshot1, snapshot2);
  }

  async rollbackToVersion(
    packageId: string,
    version: string,
  ): Promise<VersionSnapshot | undefined> {
    const snapshot = await this.getSnapshotByVersion(packageId, version);
    if (!snapshot) return undefined;

    const rollbackSnapshot: VersionSnapshot = {
      ...snapshot,
      id: `vs-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      description: `Rollback to version ${version}`,
      tags: ["rollback"],
    };

    const existing = this.snapshots.get(packageId) || [];
    existing.push(rollbackSnapshot);
    this.snapshots.set(packageId, existing);

    return rollbackSnapshot;
  }

  async getVersionTimeline(packageId: string): Promise<
    {
      version: string;
      timestamp: Date;
      author: string;
      description: string;
      tags: string[];
    }[]
  > {
    const snapshots = this.snapshots.get(packageId) || [];
    return snapshots.map((s) => ({
      version: s.version,
      timestamp: s.timestamp,
      author: s.author,
      description: s.description,
      tags: s.tags,
    }));
  }

  async searchSnapshots(query: string): Promise<VersionSnapshot[]> {
    const results: VersionSnapshot[] = [];
    const lowerQuery = query.toLowerCase();

    for (const snapshots of this.snapshots.values()) {
      for (const snapshot of snapshots) {
        if (
          snapshot.description.toLowerCase().includes(lowerQuery) ||
          snapshot.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        ) {
          results.push(snapshot);
        }
      }
    }

    return results;
  }

  async exportSnapshot(snapshotId: string): Promise<string> {
    const snapshot = await this.getSnapshotById(snapshotId);
    if (!snapshot) throw new Error(`Snapshot ${snapshotId} not found`);

    return JSON.stringify(snapshot, null, 2);
  }

  async importSnapshot(data: string): Promise<VersionSnapshot> {
    const snapshot = JSON.parse(data) as VersionSnapshot;

    const existing = this.snapshots.get(snapshot.packageId) || [];
    existing.push(snapshot);
    this.snapshots.set(snapshot.packageId, existing);

    return snapshot;
  }

  private compareSnapshots(
    snapshot1: VersionSnapshot,
    snapshot2: VersionSnapshot,
  ): DiffResult[] {
    const diffs: DiffResult[] = [];

    const compare = (
      field: string,
      val1: Record<string, unknown> | undefined,
      val2: Record<string, unknown> | undefined,
    ) => {
      if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        diffs.push({
          field,
          type: "modified",
          oldValue: val1,
          newValue: val2,
        });
      }
    };

    compare(
      "metadata",
      snapshot1.snapshot.metadata as unknown as Record<string, unknown>,
      snapshot2.snapshot.metadata as unknown as Record<string, unknown>,
    );
    compare("content", snapshot1.snapshot.content as unknown as Record<string, unknown>, snapshot2.snapshot.content as unknown as Record<string, unknown>);
    compare(
      "assessment",
      snapshot1.snapshot.assessment as unknown as Record<string, unknown>,
      snapshot2.snapshot.assessment as unknown as Record<string, unknown>,
    );
    compare(
      "resources",
      snapshot1.snapshot.resources as unknown as Record<string, unknown>,
      snapshot2.snapshot.resources as unknown as Record<string, unknown>,
    );

    return diffs;
  }

  private hashPackage(pkg: KnowledgePackage): string {
    const contentString = JSON.stringify(pkg);
    return createHash("sha256").update(contentString).digest("hex");
  }

  private calculateSize(pkg: KnowledgePackage): number {
    return Buffer.byteLength(JSON.stringify(pkg), "utf-8");
  }
}

export const contentVersioning = new ContentVersioning();
