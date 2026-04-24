import { useRef, useState } from "react";
import IsoTile from "./IsoTile";
import WeatherLayer from "./WeatherLayer";
import DayNightOverlay from "./DayNightOverlay";
import Companion from "./Companion";
import DecorSprite from "./DecorSprite";
import HarvestBurst, { type BurstEvent } from "./HarvestBurst";
import { GRID_COLS, plotIndexToGrid } from "@/lib/farm/iso";
import type { DecorId, DecorPlacement } from "@/lib/state/types";

type Weather = "sunny" | "cloudy" | "rainy" | "stormy";
type DayPhase = "morning" | "day" | "evening" | "night";

interface PlotLike {
  id: number;
  stage: string;
  plantType: { id: string; name: string; emoji?: string } | null;
  water: number;
  sun: number;
  health: number;
  hasPest: boolean;
}

interface Props {
  plots: PlotLike[];
  weather: Weather;
  dayPhase: DayPhase;
  decor: DecorId[];
  decorPlacements: Partial<Record<DecorId, DecorPlacement>>;
  bursts: BurstEvent[];
  onTileClick: (id: number) => void;
  onWater: (id: number) => void;
  onSun: (id: number) => void;
  onCompanionTap?: () => void;
}

const skyByPhase: Record<DayPhase, string> = {
  morning: "linear-gradient(to bottom, #ffd9a8 0%, #ffe9c8 40%, #c8e8a0 100%)",
  day: "linear-gradient(to bottom, #87ceeb 0%, #b8e0d2 50%, #a8d88a 100%)",
  evening: "linear-gradient(to bottom, #ff8a5b 0%, #c46690 50%, #5e4a7a 100%)",
  night: "linear-gradient(to bottom, #1a1f4a 0%, #2a2456 50%, #3a3068 100%)",
};

export default function FarmScene({
  plots,
  weather,
  dayPhase,
  decor,
  decorPlacements,
  bursts,
  onTileClick,
  onWater,
  onSun,
  onCompanionTap,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Default decor positions ringed around the field if user hasn't placed
  const defaultDecorPos = (i: number, total: number) => {
    const angle = (i / Math.max(1, total)) * Math.PI * 2;
    return { x: 50 + Math.cos(angle) * 40, y: 55 + Math.sin(angle) * 30 };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl border-2 border-amber-900/30 shadow-2xl"
      style={{
        height: 480,
        background: skyByPhase[dayPhase],
        transition: "background 1s ease",
      }}
    >
      <DayNightOverlay dayPhase={dayPhase} />

      {/* Distant hills */}
      <svg
        viewBox="0 0 600 120"
        preserveAspectRatio="none"
        className="absolute bottom-1/2 left-0 w-full h-32 pointer-events-none"
        style={{ zIndex: 5, opacity: dayPhase === "night" ? 0.5 : 0.85 }}
      >
        <path d="M0 80 Q150 20 300 70 T600 60 L600 120 L0 120 Z" fill="#7ba967" />
        <path d="M0 100 Q120 50 250 90 Q400 130 600 90 L600 120 L0 120 Z" fill="#5d8a4a" />
      </svg>

      {/* Iso grid stage */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 10 }}
      >
        {plots.map((plot, idx) => {
          const { gx, gy } = plotIndexToGrid(idx);
          return (
            <IsoTile
              key={plot.id}
              plot={plot}
              gx={gx}
              gy={gy}
              weather={weather}
              onClick={() => onTileClick(plot.id)}
              onWater={() => onWater(plot.id)}
              onSun={() => onSun(plot.id)}
            />
          );
        })}

        {/* Decor placed around */}
        {decor.map((d, i) => {
          const placed = decorPlacements[d];
          const pos = placed ?? defaultDecorPos(i, decor.length);
          return (
            <div
              key={d}
              className="absolute"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 150 + i,
              }}
            >
              <DecorSprite id={d} />
            </div>
          );
        })}
      </div>

      <WeatherLayer weather={weather} dayPhase={dayPhase} />

      <div onClick={onCompanionTap}>
        <Companion containerRef={containerRef} />
      </div>

      {/* Burst overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 250 }}>
        <HarvestBurst bursts={bursts} />
      </div>

      {/* Phase label bottom-right */}
      <div
        className="absolute bottom-2 right-3 px-2 py-1 rounded-full bg-black/40 backdrop-blur text-[10px] uppercase tracking-wider text-white/90 pointer-events-none"
        style={{ zIndex: 80 }}
      >
        {dayPhase} · {weather}
      </div>
    </div>
  );
}
