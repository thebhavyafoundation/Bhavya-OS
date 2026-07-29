// Backup & Recovery
// Data protection with automated backups.

import { resolve } from 'node:path';
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, unlinkSync } from 'node:fs';

export interface BackupConfig {
  root: string;
  backupDir: string;
  maxBackups: number;
  autoBackupIntervalMs: number;
}

export interface Backup {
  id: string;
  timestamp: Date;
  size: number;
  path: string;
  status: 'in-progress' | 'completed' | 'failed';
  metadata: Record<string, unknown>;
}

export interface RecoveryResult {
  backupId: string;
  restored: boolean;
  filesRestored: number;
  timestamp: Date;
}

export class BackupRecovery {
  private config: BackupConfig;
  private backups: Backup[] = [];
  private autoBackupTimer?: ReturnType<typeof setInterval>;

  constructor(config: BackupConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Ensure backup dir exists
    if (!existsSync(this.config.backupDir)) {
      mkdirSync(this.config.backupDir, { recursive: true });
    }

    // Load existing backups
    this.loadBackupIndex();

    // Start auto-backup
    if (this.config.autoBackupIntervalMs > 0) {
      this.autoBackupTimer = setInterval(
        () => this.createBackup(),
        this.config.autoBackupIntervalMs,
      );
    }
  }

  // Create backup
  async createBackup(): Promise<Backup> {
    const backup: Backup = {
      id: `backup:${crypto.randomUUID()}`,
      timestamp: new Date(),
      size: 0,
      path: '',
      status: 'in-progress',
      metadata: {},
    };

    try {
      const backupPath = resolve(this.config.backupDir, `${backup.id}.json`);

      // Collect files to backup
      const files = this.collectFiles(this.config.root);
      const backupData = {
        id: backup.id,
        timestamp: backup.timestamp,
        files,
        fileCount: files.length,
      };

      writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

      backup.path = backupPath;
      backup.size = files.length;
      backup.status = 'completed';
    } catch {
      backup.status = 'failed';
    }

    this.backups.push(backup);

    // Cleanup old backups
    if (this.backups.length > this.config.maxBackups) {
      const toRemove = this.backups.slice(0, this.backups.length - this.config.maxBackups);
      for (const old of toRemove) {
        if (existsSync(old.path)) unlinkSync(old.path);
      }
      this.backups = this.backups.slice(this.config.maxBackups);
    }

    this.saveBackupIndex();
    return backup;
  }

  // Restore from backup
  async restore(backupId: string): Promise<RecoveryResult> {
    const backup = this.backups.find((b) => b.id === backupId);
    if (!backup || backup.status !== 'completed') {
      return { backupId, restored: false, filesRestored: 0, timestamp: new Date() };
    }

    try {
      const data = JSON.parse(readFileSync(backup.path, 'utf-8'));
      let filesRestored = 0;

      for (const file of data.files) {
        const filePath = resolve(this.config.root, file.relativePath);
        const dir = require('node:path').dirname(filePath);
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        writeFileSync(filePath, file.content);
        filesRestored++;
      }

      return { backupId, restored: true, filesRestored, timestamp: new Date() };
    } catch {
      return { backupId, restored: false, filesRestored: 0, timestamp: new Date() };
    }
  }

  // Get backups
  getBackups(): Backup[] {
    return [...this.backups];
  }

  private collectFiles(dir: string): Array<{ relativePath: string; content: string }> {
    const files: Array<{ relativePath: string; content: string }> = [];
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = resolve(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          files.push(...this.collectFiles(fullPath));
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.json') || entry.name.endsWith('.md'))) {
          files.push({
            relativePath: fullPath.replace(this.config.root, '').replace(/\\/g, '/'),
            content: readFileSync(fullPath, 'utf-8'),
          });
        }
      }
    } catch {
      // Skip unreadable directories
    }
    return files;
  }

  private loadBackupIndex(): void {
    const indexPath = resolve(this.config.backupDir, 'index.json');
    if (existsSync(indexPath)) {
      this.backups = JSON.parse(readFileSync(indexPath, 'utf-8'));
    }
  }

  private saveBackupIndex(): void {
    const indexPath = resolve(this.config.backupDir, 'index.json');
    writeFileSync(indexPath, JSON.stringify(this.backups, null, 2));
  }

  async shutdown(): Promise<void> {
    if (this.autoBackupTimer) clearInterval(this.autoBackupTimer);
  }
}
