import { useEffect, useState, useCallback } from "react";
import { loadState, saveState, subscribeState, type GameState } from "@/lib/gameStore";
import { achievements } from "@/lib/achievements";
import { toast } from "@/hooks/use-toast";

export function useGameState() {
  const [state, setState] = useState<GameState>(() => loadState());

  useEffect(() => {
    const unsub = subscribeState(setState);
    return unsub;
  }, []);

  // Mutator
  const update = useCallback((updater: (s: GameState) => GameState) => {
    const current = loadState();
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
      };
      // Re-check meta achievements (e.g. gaia_master)
      for (const a of achievements) {
        if (!next.achievements.includes(a.id) && a.check(next)) {
          next.achievements.push(a.id);
          next.coins += a.reward ?? 0;
        }
      }
      // Toasts
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

    saveState(next);
    return next;
  }, []);

  return { state, update };
}
