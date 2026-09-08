import { getReadWriteDatabase, migrate } from "@bhavya/database";
import type Database from "better-sqlite3";

let initialized = false;

export function getDb(): Database.Database {
  const db = getReadWriteDatabase("social-os");
  if (!initialized) {
    migrate("social-os");
    initialized = true;
  }
  return db;
}
