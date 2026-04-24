import type { DecorId } from "@/lib/state/types";

interface Props {
  id: DecorId;
  size?: number;
}

const decorMeta: Record<DecorId, { emoji: string; bonus: string }> = {
  scarecrow: { emoji: "🎃", bonus: "−Schädlinge" },
  fountain: { emoji: "⛲", bonus: "+Wachstum" },
  gnome: { emoji: "🧙", bonus: "+Münzen" },
  windmill: { emoji: "🌬️", bonus: "+XP" },
  rainbow: { emoji: "🌈", bonus: "+Selten" },
  shrine: { emoji: "⛩️", bonus: "+Alles" },
};

export default function DecorSprite({ id, size = 44 }: Props) {
  const meta = decorMeta[id];
  return (
    <div
      className="relative pointer-events-none anim-sway"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ fontSize: size * 0.85, lineHeight: 1, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))" }}
      >
        {meta.emoji}
      </div>
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 px-1.5 py-0.5 text-[8px] rounded-full bg-black/70 text-white whitespace-nowrap font-semibold"
      >
        {meta.bonus}
      </div>
    </div>
  );
}
