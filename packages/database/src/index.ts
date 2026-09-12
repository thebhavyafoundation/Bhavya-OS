export {
  getDatabase,
  getNamedDatabase,
  getConnection,
  closeNamedDatabase,
  closeAllDatabases,
  closeDatabase,
  transaction,
  exec,
} from "./sqlite";
export type { DatabaseConfig } from "./sqlite";
export {
  migrate,
  rollback,
  getMigrationStatus,
  computeChecksum,
} from "./migrate";
export type {
  Migration,
  MigrationRecord,
  MigrationResult,
  MigrationStatus,
} from "./migrate";

export {
  getDatabasePath,
  databaseExists,
  getReadonlyDatabase,
  getReadWriteDatabase,
  getAdaptedDatabase,
} from "./registry";
export type { DatabaseName } from "./registry";

export {
  initAsyncAdapter,
  getAsyncAdapter,
  type AsyncDatabase,
  type QueryRow,
  type QueryResult,
} from "./async-adapter";
