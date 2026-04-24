import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { canClaimDaily, claimDaily, getStreak } from "@/lib/state/daily";
import { BALANCE } from "@/lib/state/balance";
import { useGameState } from "@/hooks/useGameState";
import { useToast } from "@/hooks/use-toast";

export default function DailyLoginCard() {
  const { update } = useGameState();
  const { toast } = useToast();
  const [canClaim, setCanClaim] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setCanClaim(canClaimDaily());
    setStreak(getStreak());
  }, []);

  const claim = () => {
    const newStreak = claimDaily();
    if (newStreak == null) return;
    const reward = BALANCE.dailyBonus(newStreak);
    update((s) => ({ ...s, coins: s.coins + reward, totalEarned: s.totalEarned + reward }));
    setCanClaim(false);
    setStreak(newStreak);
    toast({
      title: `🎁 Tagesbonus Tag ${newStreak}!`,
      description: `+${reward} Münzen erhalten`,
    });
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-red-500/10 border-amber-500/40 max-w-4xl mx-auto mb-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-base flex items-center gap-2">
              Tagesbonus
              {streak > 0 && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-700 dark:text-orange-300">
                  <Flame className="w-3 h-3" /> {streak} Tage
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {canClaim
                ? `+${BALANCE.dailyBonus(Math.max(1, streak === 0 ? 1 : streak + 1))} 💰 wartet auf dich`
                : "Schon abgeholt – komm morgen wieder"}
            </div>
          </div>
        </div>
        <Button onClick={claim} disabled={!canClaim} size="sm" className="shadow-md">
          {canClaim ? "Abholen" : "Erledigt ✓"}
        </Button>
      </div>
      {/* 7-day strip */}
      <div className="grid grid-cols-7 gap-1 mt-3">
        {Array.from({ length: 7 }).map((_, i) => {
          const day = i + 1;
          const reached = day <= streak;
          return (
            <div
              key={i}
              className={`text-center py-1 rounded text-[10px] font-semibold ${
                reached
                  ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow"
                  : "bg-muted/50 text-muted-foreground"
              }`}
            >
              T{day}
              <div className="text-[9px] opacity-80">{BALANCE.dailyBonus(day)}💰</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
