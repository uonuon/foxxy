import * as SQLite from "expo-sqlite";

/**
 * Local-only persistence for v1. When the Firebase backend comes online we
 * will layer sync on top of this — local remains the source of truth for
 * offline use.
 */

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("foxxy.db").then(async (db) => {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;

        CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          started_at INTEGER NOT NULL,
          ended_at INTEGER,
          planned_seconds INTEGER NOT NULL,
          actual_seconds INTEGER NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('completed','broken')),
          intent TEXT
        );

        CREATE INDEX IF NOT EXISTS idx_sessions_started_at
          ON sessions (started_at DESC);

        CREATE TABLE IF NOT EXISTS wallet (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          finds INTEGER NOT NULL DEFAULT 0
        );

        INSERT OR IGNORE INTO wallet (id, finds) VALUES (1, 0);

        CREATE TABLE IF NOT EXISTS decorations (
          decoration_id TEXT PRIMARY KEY,
          acquired_at INTEGER NOT NULL,
          placed INTEGER NOT NULL DEFAULT 0
        );
      `);
      return db;
    });
  }
  return dbPromise;
}

export type SessionStatus = "completed" | "broken";

export interface SessionRecord {
  id: number;
  startedAt: number;
  endedAt: number | null;
  plannedSeconds: number;
  actualSeconds: number;
  status: SessionStatus;
  intent: string | null;
}

export async function insertSession(input: {
  startedAt: number;
  endedAt: number;
  plannedSeconds: number;
  actualSeconds: number;
  status: SessionStatus;
  intent?: string | null;
}): Promise<number> {
  const db = await getDb();
  const result = await db.runAsync(
    `INSERT INTO sessions
       (started_at, ended_at, planned_seconds, actual_seconds, status, intent)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      input.startedAt,
      input.endedAt,
      input.plannedSeconds,
      input.actualSeconds,
      input.status,
      input.intent ?? null,
    ],
  );
  return result.lastInsertRowId ?? 0;
}

export async function getRecentSessions(limit = 50): Promise<SessionRecord[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: number;
    started_at: number;
    ended_at: number | null;
    planned_seconds: number;
    actual_seconds: number;
    status: SessionStatus;
    intent: string | null;
  }>(
    `SELECT id, started_at, ended_at, planned_seconds, actual_seconds, status, intent
       FROM sessions
      ORDER BY started_at DESC
      LIMIT ?`,
    [limit],
  );
  return rows.map((r) => ({
    id: r.id,
    startedAt: r.started_at,
    endedAt: r.ended_at,
    plannedSeconds: r.planned_seconds,
    actualSeconds: r.actual_seconds,
    status: r.status,
    intent: r.intent,
  }));
}

export async function getWalletFinds(): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ finds: number }>(
    "SELECT finds FROM wallet WHERE id = 1",
  );
  return row?.finds ?? 0;
}

export async function addFinds(amount: number): Promise<number> {
  const db = await getDb();
  await db.runAsync(
    "UPDATE wallet SET finds = finds + ? WHERE id = 1",
    [amount],
  );
  return getWalletFinds();
}
