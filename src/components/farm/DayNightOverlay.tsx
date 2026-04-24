type DayPhase = "morning" | "day" | "evening" | "night";

interface Props {
  dayPhase: DayPhase;
}

const overlays: Record<DayPhase, string> = {
  morning: "linear-gradient(to bottom, rgba(255,200,140,0.35) 0%, rgba(255,230,200,0.1) 50%, rgba(135,206,250,0.1) 100%)",
  day: "linear-gradient(to bottom, rgba(135,206,250,0.15) 0%, rgba(255,255,200,0.05) 100%)",
  evening: "linear-gradient(to bottom, rgba(255,120,80,0.35) 0%, rgba(180,80,150,0.25) 60%, rgba(60,40,100,0.3) 100%)",
  night: "linear-gradient(to bottom, rgba(15,20,55,0.7) 0%, rgba(30,25,80,0.55) 100%)",
};

export default function DayNightOverlay({ dayPhase }: Props) {
  const isNight = dayPhase === "night";
  const isDay = dayPhase === "day" || dayPhase === "morning";
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{ background: overlays[dayPhase], zIndex: 50, mixBlendMode: "soft-light" }}
      />
      {/* Sun or Moon */}
      <div
        className="absolute pointer-events-none transition-all duration-1000"
        style={{
          top: dayPhase === "morning" ? "18%" : dayPhase === "evening" ? "22%" : "10%",
          right: dayPhase === "morning" ? "70%" : dayPhase === "evening" ? "10%" : "12%",
          zIndex: 55,
          animation: isDay ? "sun-orbit 30s ease-in-out infinite" : undefined,
        }}
      >
        {isNight ? (
          <div className="relative">
            <div
              className="w-12 h-12 rounded-full bg-slate-100"
              style={{ boxShadow: "0 0 30px rgba(220,230,255,0.6), inset -6px -4px 0 rgba(180,190,220,0.4)" }}
            />
          </div>
        ) : (
          <div
            className="w-14 h-14 rounded-full"
            style={{
              background: dayPhase === "evening"
                ? "radial-gradient(circle, #ff9248 0%, #ff5a3c 70%)"
                : "radial-gradient(circle, #fff8c4 0%, #ffce42 70%)",
              boxShadow: dayPhase === "evening"
                ? "0 0 50px rgba(255,140,80,0.7)"
                : "0 0 60px rgba(255,220,100,0.6)",
            }}
          />
        )}
      </div>
    </>
  );
}
