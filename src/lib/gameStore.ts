// Lightweight global game store using localStorage + custom events.
// No backend yet - persists per browser. Easy to swap for Cloud later.

export type Inventory = Record<string, number>; // plantId -> count
export type DecorId = "scarecrow" | "fountain" | "gnome" | "windmill" | "rainbow" | "shrine";

export interface GameState {
  coins: number;
  xp: number;
  level: number;
  harvested: number;
  inventory: Inventory;
  decor: DecorId[];
  totalEarned: number;
  achievements: string[]; // unlocked ids
  // Cross-feature counters (incremented from each module)
  arScans: number;
  craftsCompleted: number;
  essencesBrewed: number;
  plantsGrown: number;
  pestsRemoved: number;
  questsDone: number;
}

const KEY = "gaia-game-state-v1";
const EVENT = "gaia-state-change";

const defaultState: GameState = {
  coins: 50,
  xp: 0,
  level: 1,
  harvested: 0,
  inventory: {},
  decor: [],
  totalEarned: 0,
  achievements: [],
  arScans: 0,
  craftsCompleted: 0,
  essencesBrewed: 0,
  plantsGrown: 0,
  pestsRemoved: 0,
  questsDone: 0,
};

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return { ...defaultState };
  }
}

export function saveState(state: GameState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(EVENT, { detail: state }));
  } catch {
    // ignore
  }
}

export function updateState(updater: (s: GameState) => GameState): GameState {
  const next = updater(loadState());
  saveState(next);
  return next;
}

export function subscribeState(cb: (s: GameState) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<GameState>).detail);
  window.addEventListener(EVENT, handler);
  // Cross-tab sync
  const storageHandler = (e: StorageEvent) => {
    if (e.key === KEY) cb(loadState());
  };
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}

export const EVENT_NAME = EVENT;
