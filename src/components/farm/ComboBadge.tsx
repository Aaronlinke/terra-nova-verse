import { Flame } from "lucide-react";
import { BALANCE } from "@/lib/state/balance";

interface Props {
  combo: number;
}

export default function ComboBadge({ combo }: Props) {
  if (combo < 2) return null;
  const mult = BALANCE.comboMultiplier(combo);
  const active = combo >= 3;
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
        active
          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg animate-pulse"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <Flame className="h-3 w-3" />
      <span>{combo}× Combo</span>
      {active && <span className="opacity-90">· {mult}× 💰</span>}
    </div>
  );
}
