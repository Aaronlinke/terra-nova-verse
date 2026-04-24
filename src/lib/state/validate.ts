// Validation layer — clamps and sanitizes state before save.
// Prevents negative coins, NaN, runaway numbers, corrupted inventory.

import type { GameState, RootState } from "./types";

const MAX_NUM = 9_999_999_999;

const clampInt = (n: unknown, min = 0, max = MAX_NUM): number => {
  const v = typeof n === "number" && Number.isFinite(n) ? Math.floor(n) : 0;
  return Math.max(min, Math.min(max, v));
};

export function validateFlat(s: GameState): GameState {
  const inv: Record<string, number> = {};
  if (s.inventory && typeof s.inventory === "object") {
    for (const [k, v] of Object.entries(s.inventory)) {
      const c = clampInt(v);
      if (c > 0) inv[k] = c;
    }
  }
  const placements = (s.decorPlacements && typeof s.decorPlacements === "object")
    ? s.decorPlacements
    : {};
  return {
    coins: clampInt(s.coins),
    xp: clampInt(s.xp),
    level: clampInt(s.level, 1),
    totalEarned: clampInt(s.totalEarned),
    harvested: clampInt(s.harvested),
    inventory: inv,
    decor: Array.isArray(s.decor) ? Array.from(new Set(s.decor)) : [],
    decorPlacements: placements,
    comboStreak: clampInt(s.comboStreak),
    plantsGrown: clampInt(s.plantsGrown),
    pestsRemoved: clampInt(s.pestsRemoved),
    achievements: Array.isArray(s.achievements) ? Array.from(new Set(s.achievements)) : [],
    questsDone: clampInt(s.questsDone),
    arScans: clampInt(s.arScans),
    craftsCompleted: clampInt(s.craftsCompleted),
    essencesBrewed: clampInt(s.essencesBrewed),
  };
}

export function validateRoot(r: RootState): RootState {
  return {
    player: {
      coins: clampInt(r.player.coins),
      xp: clampInt(r.player.xp),
      level: clampInt(r.player.level, 1),
      totalEarned: clampInt(r.player.totalEarned),
    },
    farm: {
      harvested: clampInt(r.farm.harvested),
      inventory: validateFlat({
        ...r.player,
        ...r.farm,
        ...r.meta,
        inventory: r.farm.inventory,
      } as GameState).inventory,
      decor: Array.isArray(r.farm.decor) ? Array.from(new Set(r.farm.decor)) : [],
      decorPlacements: (r.farm.decorPlacements && typeof r.farm.decorPlacements === "object")
        ? r.farm.decorPlacements
        : {},
      comboStreak: clampInt(r.farm.comboStreak),
      plantsGrown: clampInt(r.farm.plantsGrown),
      pestsRemoved: clampInt(r.farm.pestsRemoved),
    },
    meta: {
      achievements: Array.isArray(r.meta.achievements)
        ? Array.from(new Set(r.meta.achievements))
        : [],
      questsDone: clampInt(r.meta.questsDone),
      arScans: clampInt(r.meta.arScans),
      craftsCompleted: clampInt(r.meta.craftsCompleted),
      essencesBrewed: clampInt(r.meta.essencesBrewed),
    },
    session: r.session ?? { lastEventAt: null },
  };
}
