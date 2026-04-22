// Daily login + streak system. Persisted in localStorage (separate key from gameStore
// so the cloud-sync migration in step 2 only owns gameplay state).

const KEY = "gaia-daily-v1";

interface DailyData {
  lastClaim: string | null; // ISO date YYYY-MM-DD
  streak: number;
}

const today = (): string => new Date().toISOString().slice(0, 10);

const yesterday = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

function load(): DailyData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { lastClaim: null, streak: 0 };
    return JSON.parse(raw);
  } catch {
    return { lastClaim: null, streak: 0 };
  }
}

function save(d: DailyData) {
  localStorage.setItem(KEY, JSON.stringify(d));
}

export function canClaimDaily(): boolean {
  return load().lastClaim !== today();
}

export function getStreak(): number {
  return load().streak;
}

/**
 * Claim today's daily bonus.
 * Returns the new streak (1 = first day, resets if a day was missed).
 * Returns null if already claimed today.
 */
export function claimDaily(): number | null {
  const data = load();
  const t = today();
  if (data.lastClaim === t) return null;

  const streak = data.lastClaim === yesterday() ? data.streak + 1 : 1;
  save({ lastClaim: t, streak });
  return streak;
}
