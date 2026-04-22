// Mathematical balancing constants for the core game loop.
// Centralized so XP curves and rewards can be tuned in one place.

export const BALANCE = {
  // XP needed to reach (level + 1). Curve: 100 * level^1.5
  // L1→L2: 100 | L2→L3: 282 | L5→L6: 1118 | L10→L11: 3162
  xpForLevel(level: number): number {
    return Math.floor(100 * Math.pow(Math.max(1, level), 1.5));
  },

  // Base XP per harvest, scaled by rarity multiplier.
  harvestXp(rarity: "common" | "rare" | "legendary"): number {
    return { common: 10, rare: 25, legendary: 60 }[rarity];
  },

  // Base coin value per crop (used by Market floor price).
  cropFloor(rarity: "common" | "rare" | "legendary"): number {
    return { common: 5, rare: 15, legendary: 50 }[rarity];
  },

  // Daily login bonus scales gently with streak (max 7×).
  dailyBonus(streakDays: number): number {
    const s = Math.min(7, Math.max(1, streakDays));
    return 25 + (s - 1) * 15; // day1: 25 | day7: 115
  },

  // Combo multiplier for N consecutive perfect harvests.
  // 3 in a row → 1.5x | 5 → 2x | 10 → 3x
  comboMultiplier(combo: number): number {
    if (combo < 3) return 1;
    if (combo < 5) return 1.5;
    if (combo < 10) return 2;
    return 3;
  },

  // Decor passive bonus (applied when present in farm.decor).
  decorBonus: {
    scarecrow: { pestResistance: 0.3 },
    fountain: { growthSpeed: 0.15 },
    gnome: { coinBonus: 0.1 },
    windmill: { xpBonus: 0.15 },
    rainbow: { rareChance: 0.1 },
    shrine: { allBonus: 0.05 },
  } as const,
} as const;

export type Rarity = "common" | "rare" | "legendary";
