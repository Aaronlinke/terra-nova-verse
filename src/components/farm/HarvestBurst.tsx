import { useEffect, useState } from "react";

export interface BurstEvent {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
}

interface Props {
  bursts: BurstEvent[];
}

export default function HarvestBurst({ bursts }: Props) {
  return (
    <>
      {bursts.map((b) => (
        <Burst key={b.id} {...b} />
      ))}
    </>
  );
}

function Burst({ x, y, text, color }: BurstEvent) {
  const [confetti] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      i,
      cx: (Math.random() - 0.5) * 120,
      cy: -40 - Math.random() * 80,
      hue: Math.floor(Math.random() * 360),
    }))
  );

  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, zIndex: 300 }}
    >
      <div
        className="absolute font-bold text-base"
        style={{
          color,
          left: 0,
          top: 0,
          animation: "harvest-burst 1.2s ease-out forwards",
          textShadow: "0 2px 4px rgba(0,0,0,0.6)",
        }}
      >
        {text}
      </div>
      {confetti.map((c) => (
        <div
          key={c.i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            background: `hsl(${c.hue}, 80%, 60%)`,
            left: 0,
            top: 0,
            ["--cx" as string]: `${c.cx}px`,
            ["--cy" as string]: `${c.cy}px`,
            animation: "confetti 1.1s ease-out forwards",
          }}
        />
      ))}
    </div>
  );
}
