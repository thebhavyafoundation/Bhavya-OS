import { getReadWriteDatabase, migrate } from "@bhavya/database";
import type Database from "better-sqlite3";

let initialized = false;

export function getDb(): Database.Database {
  const db = getReadWriteDatabase("github-os");
  if (!initialized) {
    migrate("github-os");
    initialized = true;
  }
  return db;
}
