import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Sparkles,
  Sprout,
  Heart,
  Brain,
  FlaskConical,
  Plane,
  BookOpen,
  Scan,
  Hammer,
  Moon,
  Zap,
  TrendingUp,
} from "lucide-react";

type Module = {
  id: string;
  name: string;
  path: string;
  icon: typeof Sprout;
  element: string;
  energy: number; // 0-100
  color: string;
  description: string;
};

const modules: Module[] = [
  { id: "farm", name: "Farm", path: "/farm", icon: Sprout, element: "Erde", energy: 78, color: "from-green-500 to-emerald-600", description: "Lebendiger Boden" },
  { id: "emo", name: "Emotion", path: "/emotional-farming", icon: Heart, element: "Herz", energy: 65, color: "from-rose-500 to-pink-600", description: "Pflanzenbande" },
  { id: "ai", name: "Mentor", path: "/ai-mentor", icon: Brain, element: "Geist", energy: 82, color: "from-blue-500 to-indigo-600", description: "Bio-Wissen" },
  { id: "lab", name: "Labor", path: "/genetic-lab", icon: FlaskConical, element: "Materie", energy: 71, color: "from-purple-500 to-violet-600", description: "DNA-Tanz" },
  { id: "tour", name: "Reise", path: "/climate-tourism", icon: Plane, element: "Luft", energy: 58, color: "from-sky-500 to-cyan-600", description: "Klima-Pfade" },
  { id: "narr", name: "Narrativ", path: "/bio-narrative", icon: BookOpen, element: "Wort", energy: 69, color: "from-amber-500 to-orange-600", description: "Lebende Geschichten" },
  { id: "ar", name: "Scanner", path: "/ar-scanner", icon: Scan, element: "Sicht", energy: 74, color: "from-teal-500 to-emerald-600", description: "Welt entschlüsselt" },
  { id: "craft", name: "Handwerk", path: "/craftsmanship", icon: Hammer, element: "Hand", energy: 63, color: "from-stone-500 to-amber-700", description: "Alte Künste" },
  { id: "crypto", name: "Alchemie", path: "/crypto-botany", icon: Moon, element: "Mond", energy: 85, color: "from-indigo-500 to-purple-700", description: "Mystische Essenzen" },
];

const Nexus = () => {
  const [pulse, setPulse] = useState(0);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [resonance, setResonance] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => (p + 1) % 360), 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Resonanz = harmonischer Durchschnitt der Modul-Energien
    const avg = modules.reduce((s, m) => s + m.energy, 0) / modules.length;
    let current = 0;
    const tick = setInterval(() => {
      current += 2;
      if (current >= avg) {
        setResonance(Math.round(avg));
        clearInterval(tick);
      } else {
        setResonance(current);
      }
    }, 30);
    return () => clearInterval(tick);
  }, []);

  const totalEnergy = modules.reduce((s, m) => s + m.energy, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      <div className="container px-4 py-6 mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </Link>
          <Badge variant="secondary" className="gap-1">
            <Zap className="w-3 h-3" />
            {totalEnergy} Gaia-Energie
          </Badge>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-3 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">Die Große Fusion</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            GaiaVerse Nexus
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Alle 9 Module verschmelzen zu einem lebendigen Organismus. Beobachte die Resonanz, spüre den Puls.
          </p>
        </div>

        {/* Zentrales Mandala */}
        <div className="relative aspect-square max-w-2xl mx-auto mb-10">
          {/* Hintergrund-Aura */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 blur-3xl"
            style={{ transform: `scale(${1 + Math.sin(pulse * 0.05) * 0.05})` }}
          />

          {/* Verbindungslinien (SVG) */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
            {modules.map((m, i) => {
              const angle = (i / modules.length) * Math.PI * 2 - Math.PI / 2;
              const x = 200 + Math.cos(angle) * 150;
              const y = 200 + Math.sin(angle) * 150;
              return (
                <line
                  key={m.id}
                  x1="200"
                  y1="200"
                  x2={x}
                  y2={y}
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  strokeOpacity={activeModule === m.id ? 0.8 : 0.2}
                  strokeDasharray={activeModule === m.id ? "0" : "4 4"}
                  className="transition-all duration-500"
                />
              );
            })}
            {/* Verbindungen zwischen benachbarten Modulen */}
            {modules.map((m, i) => {
              const next = (i + 1) % modules.length;
              const a1 = (i / modules.length) * Math.PI * 2 - Math.PI / 2;
              const a2 = (next / modules.length) * Math.PI * 2 - Math.PI / 2;
              return (
                <line
                  key={`edge-${m.id}`}
                  x1={200 + Math.cos(a1) * 150}
                  y1={200 + Math.sin(a1) * 150}
                  x2={200 + Math.cos(a2) * 150}
                  y2={200 + Math.sin(a2) * 150}
                  stroke="hsl(var(--accent))"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
              );
            })}
          </svg>

          {/* Zentrum: Resonanz-Kern */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div
              className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-2xl"
              style={{
                boxShadow: `0 0 ${40 + Math.sin(pulse * 0.05) * 20}px hsl(var(--primary) / 0.6)`,
                transform: `scale(${1 + Math.sin(pulse * 0.05) * 0.03})`,
              }}
            >
              <div className="text-center text-primary-foreground">
                <div className="text-3xl md:text-4xl font-bold">{resonance}</div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest opacity-90">Resonanz</div>
              </div>
            </div>
          </div>

          {/* Modul-Knoten */}
          {modules.map((m, i) => {
            const angle = (i / modules.length) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + Math.cos(angle) * 37.5;
            const y = 50 + Math.sin(angle) * 37.5;
            const Icon = m.icon;
            const isActive = activeModule === m.id;
            return (
              <Link
                key={m.id}
                to={m.path}
                onMouseEnter={() => setActiveModule(m.id)}
                onMouseLeave={() => setActiveModule(null)}
                onTouchStart={() => setActiveModule(m.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div
                  className={`relative w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center shadow-lg transition-all duration-300 ${
                    isActive ? "scale-125" : "group-hover:scale-110"
                  }`}
                  style={{
                    boxShadow: isActive
                      ? `0 0 30px hsl(var(--primary) / 0.8)`
                      : `0 0 ${10 + Math.sin((pulse + i * 40) * 0.05) * 5}px hsl(var(--primary) / 0.3)`,
                  }}
                >
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-center whitespace-nowrap">
                  <div className="text-xs md:text-sm font-bold">{m.name}</div>
                  <div className="text-[10px] text-muted-foreground">{m.element}</div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Modul-Details */}
        {activeModule && (
          <Card className="p-5 mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            {(() => {
              const m = modules.find((x) => x.id === activeModule)!;
              const Icon = m.icon;
              return (
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <h3 className="font-bold text-lg">{m.name}</h3>
                      <span className="text-xs text-muted-foreground">· {m.description}</span>
                    </div>
                    <Progress value={m.energy} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">{m.energy}% Vitalität</div>
                  </div>
                  <Link to={m.path}>
                    <Button size="sm" variant="outline">Öffnen</Button>
                  </Link>
                </div>
              );
            })()}
          </Card>
        )}

        {/* Statistik-Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <Card className="p-4">
            <TrendingUp className="w-5 h-5 text-primary mb-2" />
            <div className="text-2xl font-bold">{modules.length}</div>
            <div className="text-xs text-muted-foreground">Aktive Module</div>
          </Card>
          <Card className="p-4">
            <Zap className="w-5 h-5 text-accent mb-2" />
            <div className="text-2xl font-bold">{totalEnergy}</div>
            <div className="text-xs text-muted-foreground">Gaia-Energie</div>
          </Card>
          <Card className="p-4">
            <Sparkles className="w-5 h-5 text-primary mb-2" />
            <div className="text-2xl font-bold">{resonance}%</div>
            <div className="text-xs text-muted-foreground">Resonanz</div>
          </Card>
          <Card className="p-4">
            <Heart className="w-5 h-5 text-accent mb-2" />
            <div className="text-2xl font-bold">∞</div>
            <div className="text-xs text-muted-foreground">Verbindungen</div>
          </Card>
        </div>

        <div className="text-center mt-8 text-xs text-muted-foreground">
          Tippe auf einen Knoten, um das jeweilige Modul zu öffnen.
        </div>
      </div>
    </div>
  );
};

export default Nexus;
