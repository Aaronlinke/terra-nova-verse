// Sliced store with persistence + selector subscriptions.
// Persistence: localStorage (will be swapped for Cloud sync in step 2).

import {
  defaultRoot,
  flatten,
  lift,
  type GameState,
  type RootState,
} from "./types";
import { validateRoot } from "./validate";

const KEY = "gaia-game-state-v1"; // unchanged for backward compat with existing saves
const EVENT = "gaia-state-change";

let current: RootState = load();
let cachedFlat: GameState = flatten(current);

function load(): RootState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(defaultRoot);
    const parsed = JSON.parse(raw);
    // Legacy flat saves → migrate
    if (parsed && typeof parsed === "object" && "coins" in parsed && !("player" in parsed)) {
      const merged: GameState = { ...flatten(defaultRoot), ...parsed };
      return validateRoot(lift(defaultRoot, merged));
    }
    // New sliced shape
    if (parsed && "player" in parsed) {
      return validateRoot({ ...defaultRoot, ...parsed });
    }
    return structuredClone(defaultRoot);
  } catch {
    return structuredClone(defaultRoot);
  }
}

function persist() {
  try {
    // Save flat shape (back-compat) so older code paths still work mid-migration.
    const flat = flatten(current);
    localStorage.setItem(KEY, JSON.stringify(flat));
    window.dispatchEvent(new CustomEvent(EVENT, { detail: current }));
  } catch {
    // ignore quota errors
  }
}

export function getRoot(): RootState {
  return current;
}

export function getFlat(): GameState {
  return cachedFlat;
}

export function setRoot(next: RootState) {
  current = validateRoot(next);
  cachedFlat = flatten(current);
  persist();
}

export function patchRoot(updater: (r: RootState) => RootState) {
  current = validateRoot(updater(current));
  cachedFlat = flatten(current);
  persist();
  return current;
}

export function patchFlat(updater: (s: GameState) => GameState) {
  const nextFlat = updater(flatten(current));
  current = validateRoot(lift(current, nextFlat));
  cachedFlat = flatten(current);
  persist();
  return current;
}

// Subscribe to entire state.
export function subscribe(cb: (r: RootState) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<RootState>).detail);
  window.addEventListener(EVENT, handler);
  const storageHandler = (e: StorageEvent) => {
    if (e.key === KEY) {
      current = load();
      cachedFlat = flatten(current);
      cb(current);
    }
  };
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}

// Selector subscription — only fires when the selected slice changes.
export function subscribeSelector<T>(
  selector: (r: RootState) => T,
  cb: (value: T) => void,
  isEqual: (a: T, b: T) => boolean = Object.is,
): () => void {
  let last = selector(current);
  return subscribe((r) => {
    const next = selector(r);
    if (!isEqual(last, next)) {
      last = next;
      cb(next);
    }
  });
}

export const STORAGE_KEY = KEY;
export const EVENT_NAME = EVENT;
