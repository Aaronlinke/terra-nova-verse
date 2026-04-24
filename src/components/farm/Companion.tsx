import { useEffect, useRef, useState } from "react";

interface Props {
  containerRef: React.RefObject<HTMLDivElement>;
}

// Tiny SVG companion (cat-ish bee mascot) that wanders around.
export default function Companion({ containerRef }: Props) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const targetRef = useRef({ x: 50, y: 50 });

  useEffect(() => {
    const pick = () => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      targetRef.current = {
        x: 20 + Math.random() * (r.width - 60),
        y: 60 + Math.random() * (r.height - 140),
      };
    };
    pick();
    const piv = setInterval(pick, 4000);

    let raf: number;
    const tick = () => {
      setPos((p) => {
        const t = targetRef.current;
        const dx = (t.x - p.x) * 0.02;
        const dy = (t.y - p.y) * 0.02;
        return { x: p.x + dx, y: p.y + dy };
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      clearInterval(piv);
      cancelAnimationFrame(raf);
    };
  }, [containerRef]);

  return (
    <div
      className="absolute pointer-events-none anim-companion"
      style={{ left: pos.x, top: pos.y, zIndex: 200 }}
      aria-hidden
    >
      <svg width="34" height="34" viewBox="0 0 34 34">
        {/* shadow */}
        <ellipse cx="17" cy="32" rx="10" ry="2" fill="rgba(0,0,0,0.25)" />
        {/* body */}
        <ellipse cx="17" cy="20" rx="10" ry="8" fill="#ffd54f" stroke="#5d4037" strokeWidth="1.5" />
        {/* stripes */}
        <path d="M10 18 Q17 22 24 18" stroke="#5d4037" strokeWidth="2" fill="none" />
        <path d="M11 22 Q17 26 23 22" stroke="#5d4037" strokeWidth="2" fill="none" />
        {/* head */}
        <circle cx="17" cy="11" r="6" fill="#ffe082" stroke="#5d4037" strokeWidth="1.5" />
        {/* eyes */}
        <circle cx="15" cy="11" r="1" fill="#000" />
        <circle cx="19" cy="11" r="1" fill="#000" />
        {/* wings */}
        <ellipse cx="11" cy="14" rx="4" ry="6" fill="rgba(255,255,255,0.7)" stroke="#5d4037" strokeWidth="0.8" />
        <ellipse cx="23" cy="14" rx="4" ry="6" fill="rgba(255,255,255,0.7)" stroke="#5d4037" strokeWidth="0.8" />
      </svg>
    </div>
  );
}
