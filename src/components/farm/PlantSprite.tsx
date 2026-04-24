import { CROP_SPRITES, stageToFrame, type CropId } from "@/lib/farm/sprites";

interface Props {
  cropId: string | null;
  stage: string;
  health: number;
}

export default function PlantSprite({ cropId, stage, health }: Props) {
  if (!cropId || stage === "empty") return null;
  const sprite = CROP_SPRITES[cropId as CropId];
  if (!sprite) return null;

  const frame = stageToFrame(stage);
  const pieces = sprite.frames[frame] ?? [];
  const isHarvest = stage === "harvest";
  const isWithered = stage === "withered" || health <= 0;

  return (
    <svg
      viewBox="0 0 64 80"
      width={56}
      height={70}
      className={
        isWithered
          ? "anim-wither pointer-events-none"
          : isHarvest
          ? "anim-harvest pointer-events-none"
          : "anim-sway pointer-events-none"
      }
      style={
        isHarvest
          ? ({ ["--glow" as string]: sprite.glow } as React.CSSProperties)
          : undefined
      }
    >
      {pieces.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill={p.fill}
          stroke={p.stroke ?? "transparent"}
          strokeWidth={p.stroke ? 2 : 0}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
