// Sliced game state types. Single source of truth.

export type Inventory = Record<string, number>;
export type DecorId = "scarecrow" | "fountain" | "gnome" | "windmill" | "rainbow" | "shrine";

export interface PlayerState {
  coins: number;
  xp: number;
  level: number;
  totalEarned: number;
}

export interface FarmState {
  harvested: number;
  inventory: Inventory;
  decor: DecorId[];
  plantsGrown: number;
  pestsRemoved: number;
}

export interface MetaState {
  achievements: string[];
  questsDone: number;
  arScans: number;
  craftsCompleted: number;
  essencesBrewed: number;
}

export interface SessionState {
  // Volatile UI / runtime flags. Not persisted (kept in memory only).
  lastEventAt: number | null;
}

export interface RootState {
  player: PlayerState;
  farm: FarmState;
  meta: MetaState;
  session: SessionState;
}

// Back-compat flat shape used by all existing pages.
export interface GameState
  extends PlayerState,
    Omit<FarmState, never>,
    Omit<MetaState, never> {}

export const defaultRoot: RootState = {
  player: { coins: 50, xp: 0, level: 1, totalEarned: 0 },
  farm: { harvested: 0, inventory: {}, decor: [], plantsGrown: 0, pestsRemoved: 0 },
  meta: {
    achievements: [],
    questsDone: 0,
    arScans: 0,
    craftsCompleted: 0,
    essencesBrewed: 0,
  },
  session: { lastEventAt: null },
};

// Flatten root → legacy GameState (what pages currently consume).
export function flatten(root: RootState): GameState {
  return {
    ...root.player,
    ...root.farm,
    ...root.meta,
  };
}

// Lift a partial flat update back into sliced root.
export function lift(prev: RootState, flat: GameState): RootState {
  return {
    player: {
      coins: flat.coins,
      xp: flat.xp,
      level: flat.level,
      totalEarned: flat.totalEarned,
    },
    farm: {
      harvested: flat.harvested,
      inventory: flat.inventory,
      decor: flat.decor,
      plantsGrown: flat.plantsGrown,
      pestsRemoved: flat.pestsRemoved,
    },
    meta: {
      achievements: flat.achievements,
      questsDone: flat.questsDone,
      arScans: flat.arScans,
      craftsCompleted: flat.craftsCompleted,
      essencesBrewed: flat.essencesBrewed,
    },
    session: prev.session,
  };
}
