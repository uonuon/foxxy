import { useCallback, useEffect, useState } from "react";
import { getDb } from "@/db";

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

const DAY_MS = 86_400_000;

/**
 * Streak = consecutive days (ending today or yesterday) where at least one
 * "completed" session happened. We look back up to 60 days — anything longer
 * gets treated as an infrequent user, which is fine for v1.
 */
export async function computeStreak(): Promise<number> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ started_at: number }>(
    `SELECT started_at FROM sessions
      WHERE status = 'completed'
      ORDER BY started_at DESC
      LIMIT 500`,
  );
  if (rows.length === 0) return 0;

  const uniqueDays = new Set<number>();
  for (const row of rows) {
    uniqueDays.add(startOfDay(row.started_at));
  }

  const today = startOfDay(Date.now());
  let cursor = today;

  // If nothing today, start from yesterday so a rest-day doesn't kill streak.
  if (!uniqueDays.has(cursor)) {
    cursor -= DAY_MS;
    if (!uniqueDays.has(cursor)) return 0;
  }

  let streak = 0;
  while (uniqueDays.has(cursor)) {
    streak += 1;
    cursor -= DAY_MS;
  }
  return streak;
}

export function useStreak() {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const value = await computeStreak();
    setStreak(value);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { streak, loading, refresh };
}
