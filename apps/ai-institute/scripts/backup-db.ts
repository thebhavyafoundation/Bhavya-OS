/**
 * AI Institute — SQLite Backup Script
 *
 * Creates timestamped backups of the SQLite database.
 * Usage: npx tsx scripts/backup-db.ts
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync, copyFileSync } from "fs";
import { join } from "path";

const DB_PATH = join(process.cwd(), "bhavya-ai-lab", "ai-institute.db");
const BACKUP_DIR = join(process.cwd(), "bhavya-ai-lab", "backups");

function backup(): void {
  if (!existsSync(DB_PATH)) {
    console.error("Database not found at:", DB_PATH);
    process.exit(1);
  }

  if (!existsSync(BACKUP_DIR)) {
    mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = join(BACKUP_DIR, `ai-institute-${timestamp}.db`);

  try {
    copyFileSync(DB_PATH, backupPath);
    console.log(`✅ Backup created: ${backupPath}`);
  } catch (err) {
    console.error("Backup failed:", err);
    process.exit(1);
  }
}

backup();
