import { useEffect, useRef } from "react";

type Weather = "sunny" | "cloudy" | "rainy" | "stormy";
type DayPhase = "morning" | "day" | "evening" | "night";

interface Props {
  weather: Weather;
  dayPhase: DayPhase;
}

// Single fullscreen canvas for rain + fireflies
export default function WeatherLayer({ weather, dayPhase }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = canvas.offsetWidth * devicePixelRatio);
    let h = (canvas.height = canvas.offsetHeight * devicePixelRatio);
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const cw = canvas.offsetWidth;
    const ch = canvas.offsetHeight;

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    window.addEventListener("resize", onResize);

    const isRain = weather === "rainy" || weather === "stormy";
    const isNight = dayPhase === "night";
    const dropCount = weather === "stormy" ? 140 : isRain ? 80 : 0;
    const fireflyCount = isNight ? 18 : 0;

    type Drop = { x: number; y: number; l: number; v: number };
    type Fly = { x: number; y: number; r: number; phase: number; vx: number; vy: number };

    const drops: Drop[] = Array.from({ length: dropCount }, () => ({
      x: Math.random() * cw,
      y: Math.random() * ch,
      l: 8 + Math.random() * 14,
      v: 4 + Math.random() * 6,
    }));

    const flies: Fly[] = Array.from({ length: fireflyCount }, () => ({
      x: Math.random() * cw,
      y: Math.random() * ch,
      r: 1.5 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // rain
      if (drops.length) {
        ctx.strokeStyle = weather === "stormy" ? "rgba(180,200,255,0.55)" : "rgba(150,180,230,0.4)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (const d of drops) {
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 2, d.y + d.l);
          d.y += d.v;
          d.x -= 0.6;
          if (d.y > ch) {
            d.y = -d.l;
            d.x = Math.random() * cw;
          }
        }
        ctx.stroke();
      }
      // fireflies
      for (const f of flies) {
        f.phase += 0.05;
        f.x += f.vx;
        f.y += f.vy;
        if (f.x < 0 || f.x > cw) f.vx *= -1;
        if (f.y < 0 || f.y > ch) f.vy *= -1;
        const a = 0.3 + Math.sin(f.phase) * 0.5;
        ctx.fillStyle = `rgba(255,240,140,${Math.max(0.05, a)})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * (1 + Math.sin(f.phase) * 0.3), 0, Math.PI * 2);
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [weather, dayPhase]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 60 }}
      />
      {weather === "stormy" && (
        <div
          className="absolute inset-0 pointer-events-none bg-white"
          style={{ animation: "lightning 6s ease-in-out infinite", zIndex: 70 }}
        />
      )}
    </>
  );
}
