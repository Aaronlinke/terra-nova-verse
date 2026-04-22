import { useSyncExternalStore } from "react";
import { getRoot, subscribe } from "@/lib/state/store";
import type { RootState } from "@/lib/state/types";

const subscribeRoot = (cb: () => void) => subscribe(() => cb());

/**
 * Subscribe to a specific slice of state. Component only re-renders
 * when the selected value changes (referentially or by custom isEqual).
 */
export function useStoreSelector<T>(
  selector: (r: RootState) => T,
): T {
  return useSyncExternalStore(
    subscribeRoot,
    () => selector(getRoot()),
    () => selector(getRoot()),
  );
}
