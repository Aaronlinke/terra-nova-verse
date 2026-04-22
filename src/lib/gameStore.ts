// Backwards-compatible façade over the new sliced store.
// Existing imports (loadState, saveState, updateState, subscribeState, GameState, Inventory, DecorId)
// continue to work unchanged. New code should prefer src/lib/state/*.

import {
  getFlat,
  getRoot,
  patchFlat,
  subscribe,
  EVENT_NAME as NEW_EVENT_NAME,
} from "./state/store";
import { flatten, type GameState as RootFlat, type DecorId, type Inventory } from "./state/types";

export type { DecorId, Inventory };
export type GameState = RootFlat;

export function loadState(): GameState {
  return getFlat();
}

export function saveState(state: GameState): void {
  patchFlat(() => state);
}

export function updateState(updater: (s: GameState) => GameState): GameState {
  patchFlat(updater);
  return getFlat();
}

export function subscribeState(cb: (s: GameState) => void): () => void {
  return subscribe((root) => cb(flatten(root)));
}

export const EVENT_NAME = NEW_EVENT_NAME;

// Re-export root accessor for power users / new code.
export { getRoot };
