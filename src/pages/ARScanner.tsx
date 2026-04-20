import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Camera,
  CameraOff,
  Scan,
  Leaf,
  Droplets,
  Wind,
  TreePine,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

type PlantData = {
  id: string;
  name: string;
  latin: string;
  emoji: string;
  co2: number; // kg CO2 / Jahr
  water: number; // Liter / Tag
  oxygen: number; // g / Tag
  biodiversity: number; // 1-10
  fact: string;
  tip: string;
};

const plantDatabase: PlantData[] = [
  {
    id: "tomato",
    name: "Tomate",
    latin: "Solanum lycopersicum",
    emoji: "🍅",
    co2: 2.4,
    water: 1.5,
    oxygen: 12,
    biodiversity: 4,
    fact: "Eine Bio-Tomate verursacht 70% weniger CO₂ als ihre konventionell angebaute Schwester.",
    tip: "Pflanze Basilikum daneben – natürlicher Schutz gegen Weiße Fliegen.",
  },
  {
    id: "oak",
    name: "Eiche",
    latin: "Quercus robur",
    emoji: "🌳",
    co2: 22,
    water: 200,
    oxygen: 1200,
    biodiversity: 10,
    fact: "Eine alte Eiche beherbergt bis zu 500 verschiedene Insektenarten.",
    tip: "Eichen brauchen 30 Jahre, um zu fruchten – aber leben bis zu 1000 Jahre.",
  },
  {
    id: "lavender",
    name: "Lavendel",
    latin: "Lavandula angustifolia",
    emoji: "💜",
    co2: 0.8,
    water: 0.3,
    oxygen: 6,
    biodiversity: 8,
    fact: "Lavendel zieht über 100 Bestäuberarten an und wirkt als natürlicher Insektenschutz.",
    tip: "Schneide Lavendel nach der Blüte zurück – so bleibt er kompakt und langlebig.",
  },
  {
    id: "wheat",
    name: "Weizen",
    latin: "Triticum aestivum",
    emoji: "🌾",
    co2: 1.2,
    water: 1.0,
    oxygen: 8,
    biodiversity: 2,
    fact: "Konventioneller Weizen-Anbau ist für 1,5% aller globalen Treibhausgase verantwortlich.",
    tip: "Alte Sorten wie Emmer oder Einkorn brauchen 40% weniger Dünger.",
  },
  {
    id: "sunflower",
    name: "Sonnenblume",
    latin: "Helianthus annuus",
    emoji: "🌻",
    co2: 1.8,
    water: 2.0,
    oxygen: 14,
    biodiversity: 9,
    fact: "Sonnenblumen reinigen Schwermetalle aus dem Boden – nach Tschernobyl wurden sie genutzt.",
    tip: "Lasse einen Teil stehen – Vögel lieben die Kerne im Winter.",
  },
  {
    id: "moss",
    name: "Moos",
    latin: "Bryophyta",
    emoji: "🌱",
    co2: 0.5,
    water: 0.1,
    oxygen: 4,
    biodiversity: 7,
    fact: "Ein Quadratmeter Moos filtert so viel Feinstaub wie 275 Bäume.",
    tip: "Moos braucht keinen Boden – ideal für vertikale Stadtgärten.",
  },
];

const ARScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentPlant, setCurrentPlant] = useState<PlantData | null>(null);
  const [discovered, setDiscovered] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startCamera = async () => {
    setError(null);
    setCameraOn(true); // sofort aktivieren – Demo-Modus läuft auch ohne Kamera

    // Kamera-API überhaupt verfügbar?
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Demo-Modus aktiv – Kamera-API in dieser Umgebung nicht verfügbar.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (e: any) {
      const name = e?.name || "";
      if (name === "NotAllowedError") {
        setError("Kamera-Zugriff blockiert. Demo-Modus aktiv – Scans funktionieren trotzdem.");
      } else if (name === "NotFoundError") {
        setError("Keine Kamera gefunden. Demo-Modus aktiv.");
      } else {
        setError("Kamera nicht verfügbar (Preview-Sandbox). Demo-Modus aktiv – einfach scannen!");
      }
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
    setCurrentPlant(null);
    setScanProgress(0);
  };

  const startScan = () => {
    if (scanning) return;
    setScanning(true);
    setCurrentPlant(null);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          const plant = plantDatabase[Math.floor(Math.random() * plantDatabase.length)];
          setCurrentPlant(plant);
          setScanning(false);
          if (!discovered.has(plant.id)) {
            setDiscovered((d) => new Set(d).add(plant.id));
            toast.success(`Neu entdeckt: ${plant.name}!`, {
              description: "+1 zu deiner Bio-Sammlung",
            });
          } else {
            toast(`${plant.name} erneut gescannt`);
          }
          return 100;
        }
        return p + 5;
      });
    }, 80);
  };

  const totalCO2 = Array.from(discovered).reduce((sum, id) => {
    const p = plantDatabase.find((x) => x.id === id);
    return sum + (p?.co2 || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container px-4 py-6 mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </Link>
          <Badge variant="secondary" className="gap-1">
            <Leaf className="w-3 h-3" />
            {discovered.size} / {plantDatabase.length} entdeckt
          </Badge>
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-3 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AR-Pflanzenscanner</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Scanne die echte Welt
          </h1>
          <p className="text-muted-foreground">
            Richte deine Kamera auf eine Pflanze und sieh ihren Öko-Fußabdruck.
          </p>
        </div>

        <Card className="overflow-hidden mb-6">
          <div className="relative aspect-[4/3] bg-muted">
            {cameraOn ? (
              <>
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline
                  muted
                />
                {!streamRef.current && (
                  <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30">
                    {/* animierte Natur-Szene */}
                    <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.5),transparent_40%),radial-gradient(circle_at_80%_70%,hsl(var(--accent)/0.5),transparent_40%)] animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-7xl mb-3 animate-bounce" style={{ animationDuration: "3s" }}>🌿</div>
                        <div className="inline-block px-3 py-1 rounded-full bg-background/70 backdrop-blur text-xs font-medium">
                          Demo-Modus aktiv
                        </div>
                      </div>
                    </div>
                    {/* schwebende Partikel */}
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse"
                        style={{
                          left: `${(i * 13 + 10) % 90}%`,
                          top: `${(i * 17 + 15) % 80}%`,
                          animationDelay: `${i * 0.3}s`,
                          animationDuration: `${2 + (i % 3)}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* AR-Overlay-Ecken */}
                <div className="absolute inset-8 pointer-events-none">
                  <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-primary" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-primary" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-primary" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-primary" />
                </div>

                {scanning && (
                  <div className="absolute inset-0 flex items-end justify-center pb-8 pointer-events-none">
                    <div className="bg-background/90 backdrop-blur px-6 py-3 rounded-full border border-primary/30">
                      <div className="flex items-center gap-3">
                        <Scan className="w-5 h-5 text-primary animate-pulse" />
                        <span className="text-sm font-medium">Analysiere... {scanProgress}%</span>
                      </div>
                    </div>
                    <div className="absolute inset-x-8 top-0 h-1 bg-primary/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary via-accent to-primary"
                        style={{ width: `${scanProgress}%`, transition: "width 80ms linear" }}
                      />
                    </div>
                  </div>
                )}

                {currentPlant && !scanning && (
                  <div className="absolute top-4 left-4 right-4 bg-background/95 backdrop-blur rounded-lg p-3 border border-primary/30 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{currentPlant.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold truncate">{currentPlant.name}</div>
                        <div className="text-xs text-muted-foreground italic truncate">
                          {currentPlant.latin}
                        </div>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <Camera className="w-16 h-16 mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Aktiviere die Kamera, um Pflanzen zu scannen
                </p>
                <Button onClick={startCamera} size="lg">
                  <Camera className="w-4 h-4 mr-2" />
                  Kamera starten
                </Button>
              </div>
            )}
          </div>

          {cameraOn && (
            <div className="p-4 flex gap-3">
              <Button
                onClick={startScan}
                disabled={scanning}
                size="lg"
                className="flex-1"
              >
                <Scan className="w-4 h-4 mr-2" />
                {scanning ? "Scannt..." : "Pflanze scannen"}
              </Button>
              <Button onClick={stopCamera} variant="outline" size="lg">
                <CameraOff className="w-4 h-4" />
              </Button>
            </div>
          )}

          {error && (
            <div className="px-4 pb-4">
              <p className="text-xs text-muted-foreground text-center">{error}</p>
            </div>
          )}
        </Card>

        {currentPlant && (
          <Card className="p-6 mb-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-5xl">{currentPlant.emoji}</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{currentPlant.name}</h2>
                <p className="text-sm text-muted-foreground italic">{currentPlant.latin}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Wind className="w-4 h-4 text-primary mb-1" />
                <div className="text-xs text-muted-foreground">CO₂ / Jahr</div>
                <div className="text-lg font-bold">{currentPlant.co2} kg</div>
              </div>
              <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                <Droplets className="w-4 h-4 text-accent mb-1" />
                <div className="text-xs text-muted-foreground">Wasser / Tag</div>
                <div className="text-lg font-bold">{currentPlant.water} L</div>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Leaf className="w-4 h-4 text-primary mb-1" />
                <div className="text-xs text-muted-foreground">O₂ / Tag</div>
                <div className="text-lg font-bold">{currentPlant.oxygen} g</div>
              </div>
              <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                <TreePine className="w-4 h-4 text-accent mb-1" />
                <div className="text-xs text-muted-foreground">Biodiversität</div>
                <div className="text-lg font-bold">{currentPlant.biodiversity}/10</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                  Öko-Fakt
                </div>
                <p className="text-sm">{currentPlant.fact}</p>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                  Bio-Tipp
                </div>
                <p className="text-sm">{currentPlant.tip}</p>
              </div>
            </div>
          </Card>
        )}

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Deine Bio-Sammlung</h3>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Gesamter CO₂-Impact</div>
              <div className="text-lg font-bold text-primary">{totalCO2.toFixed(1)} kg/Jahr</div>
            </div>
          </div>

          <Progress value={(discovered.size / plantDatabase.length) * 100} className="mb-4" />

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {plantDatabase.map((p) => {
              const found = discovered.has(p.id);
              return (
                <div
                  key={p.id}
                  className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2 transition-all ${
                    found
                      ? "border-primary/50 bg-primary/5"
                      : "border-border bg-muted/30 opacity-40"
                  }`}
                >
                  <div className="text-2xl mb-1">{found ? p.emoji : "❓"}</div>
                  <div className="text-[10px] text-center text-muted-foreground truncate w-full">
                    {found ? p.name : "???"}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ARScanner;
