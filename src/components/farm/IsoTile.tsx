import { Droplets, Sun } from "lucide-react";
import PlantSprite from "./PlantSprite";
import { isoToScreen, isoZ, TILE_W, TILE_H } from "@/lib/farm/iso";
import { useState } from "react";

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
  plot: PlotLike;
  gx: number;
  gy: number;
  weather: string;
  onClick: () => void;
  onWater: () => void;
  onSun: () => void;
}

export default function IsoTile({ plot, gx, gy, weather, onClick, onWater, onSun }: Props) {
  const { x, y } = isoToScreen(gx, gy);
  const [hover, setHover] = useState(false);

  const isEmpty = plot.stage === "empty";
  const isHarvest = plot.stage === "harvest";
  const isWithered = plot.stage === "withered";
  const wet = weather === "rainy" || weather === "stormy";

  // Diamond tile color
  const tileFill = isEmpty
    ? "#7a5a35"
    : isWithered
    ? "#5a4a3a"
    : "#6b4a25";
  const tileEdge = isHarvest ? "#ffd54f" : isEmpty ? "#9a7a55" : "#8a6035";

  return (
    <div
      className="absolute cursor-pointer select-none"
      style={{
        left: `calc(50% + ${x}px - ${TILE_W / 2}px)`,
        top: `calc(50% + ${y}px - ${TILE_H / 2}px)`,
        width: TILE_W,
        height: TILE_H + 60,
        zIndex: isoZ(gx, gy),
      }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Diamond base */}
      <svg
        width={TILE_W}
        height={TILE_H}
        viewBox={`0 0 ${TILE_W} ${TILE_H}`}
        className="absolute top-[60px] left-0 transition-transform duration-150"
        style={{ transform: hover ? "translateY(-4px)" : "translateY(0)" }}
      >
        <defs>
          <linearGradient id={`g-${plot.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={tileFill} />
            <stop offset="1" stopColor={isEmpty ? "#5a3e22" : "#4a2f17"} />
          </linearGradient>
        </defs>
        {/* shadow */}
        <ellipse cx={TILE_W / 2} cy={TILE_H - 2} rx={TILE_W / 2.4} ry={6} fill="rgba(0,0,0,0.25)" />
        <polygon
          points={`${TILE_W / 2},2 ${TILE_W - 2},${TILE_H / 2} ${TILE_W / 2},${TILE_H - 2} 2,${TILE_H / 2}`}
          fill={`url(#g-${plot.id})`}
          stroke={tileEdge}
          strokeWidth={isHarvest ? 2.5 : 1.5}
          style={{
            filter: isHarvest ? "drop-shadow(0 0 8px rgba(255,213,79,0.8))" : undefined,
          }}
        />
        {/* furrows */}
        {!isEmpty && (
          <>
            <line x1={TILE_W * 0.2} y1={TILE_H * 0.45} x2={TILE_W * 0.8} y2={TILE_H * 0.55}
              stroke="#3a2410" strokeWidth="1" opacity="0.4" />
            <line x1={TILE_W * 0.25} y1={TILE_H * 0.65} x2={TILE_W * 0.75} y2={TILE_H * 0.35}
              stroke="#3a2410" strokeWidth="1" opacity="0.3" />
          </>
        )}
        {/* puddle when wet */}
        {wet && !isEmpty && (
          <ellipse cx={TILE_W / 2} cy={TILE_H * 0.6} rx={14} ry={5}
            fill="rgba(110,160,220,0.5)" />
        )}
      </svg>

      {/* Plant sprite — anchored at tile center */}
      <div
        className="absolute left-1/2 pointer-events-none"
        style={{
          bottom: TILE_H / 2 - 2,
          transform: "translateX(-50%)",
        }}
      >
        <PlantSprite
          cropId={plot.plantType?.id ?? null}
          stage={plot.stage}
          health={plot.health}
        />
        {plot.hasPest && (
          <div
            className="absolute anim-pest text-2xl"
            style={{ bottom: 14, left: "50%", transform: "translateX(-50%)" }}
            aria-label="Schädling"
          >
            🐛
          </div>
        )}
      </div>

      {/* Hover quick actions */}
      {hover && !isEmpty && plot.stage !== "harvest" && plot.stage !== "withered" && (
        <div
          className="absolute left-1/2 -translate-x-1/2 flex gap-1 z-50"
          style={{ top: 4 }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onWater(); }}
            className="bg-blue-500/90 hover:bg-blue-400 rounded-full p-1 shadow-lg"
            aria-label="Gießen"
          >
            <Droplets className="h-3 w-3 text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onSun(); }}
            className="bg-amber-400/90 hover:bg-amber-300 rounded-full p-1 shadow-lg"
            aria-label="Sonne"
          >
            <Sun className="h-3 w-3 text-white" />
          </button>
        </div>
      )}

      {/* Resource bars under the plant */}
      {!isEmpty && plot.plantType && (
        <div
          className="absolute left-1/2 -translate-x-1/2 w-16 space-y-0.5"
          style={{ bottom: -6 }}
        >
          <div className="flex gap-0.5">
            <div className="flex-1 h-1 bg-black/40 rounded overflow-hidden">
              <div className="h-full bg-blue-400 transition-all" style={{ width: `${plot.water}%` }} />
            </div>
            <div className="flex-1 h-1 bg-black/40 rounded overflow-hidden">
              <div className="h-full bg-amber-300 transition-all" style={{ width: `${plot.sun}%` }} />
            </div>
          </div>
          <div className="h-1 bg-black/40 rounded overflow-hidden">
            <div
              className={`h-full transition-all ${
                plot.health > 60 ? "bg-green-400" : plot.health > 30 ? "bg-yellow-400" : "bg-red-500"
              }`}
              style={{ width: `${plot.health}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
