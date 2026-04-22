import { useCallback, useSyncExternalStore } from "react";
import { getFlat, patchFlat, subscribe } from "@/lib/state/store";
import { flatten, type GameState } from "@/lib/state/types";
import { gameEvents } from "@/lib/state/events";
import { achievements } from "@/lib/achievements";
import { toast } from "@/hooks/use-toast";

const subscribeRoot = (cb: () => void) => subscribe(() => cb());
const getSnapshot = () => getFlat();

export function useGameState() {
  const state = useSyncExternalStore(subscribeRoot, getSnapshot, getSnapshot);

  const update = useCallback((updater: (s: GameState) => GameState) => {
    let prevLevel = 0;
    let nextOut: GameState = getFlat();

    patchFlat((current) => {
      prevLevel = current.level;
      let next = updater(current);

      // Auto-check achievements
      const newlyUnlocked: string[] = [];
      for (const a of achievements) {
        if (!next.achievements.includes(a.id) && a.check(next)) {
          newlyUnlocked.push(a.id);
        }
      }
      if (newlyUnlocked.length > 0) {
        const reward = newlyUnlocked.reduce((sum, id) => {
          const a = achievements.find((x) => x.id === id);
          return sum + (a?.reward ?? 0);
        }, 0);
        next = {
          ...next,
          achievements: [...next.achievements, ...newlyUnlocked],
          coins: next.coins + reward,
          totalEarned: next.totalEarned + reward,
        };
        // Re-check meta achievements (e.g. gaia_master)
        for (const a of achievements) {
          if (!next.achievements.includes(a.id) && a.check(next)) {
            next.achievements.push(a.id);
            next.coins += a.reward ?? 0;
            next.totalEarned += a.reward ?? 0;
          }
        }
        // Toast each unlocked achievement
        setTimeout(() => {
          newlyUnlocked.forEach((id) => {
            const a = achievements.find((x) => x.id === id);
            if (a) {
              toast({
                title: `🏆 Achievement: ${a.title}`,
                description: `${a.icon} ${a.description}${a.reward ? ` · +${a.reward} 💰` : ""}`,
              });
            }
          });
        }, 100);
      }

      nextOut = next;
      return next;
    });

    // Emit level-up event after persistence
    if (nextOut.level > prevLevel) {
      gameEvents.emit("levelUp", { from: prevLevel, to: nextOut.level });
    }

    return nextOut;
  }, []);

  return { state, update };
}
