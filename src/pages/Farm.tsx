import { useState, useEffect, useCallback, useRef } from "react";
import { Sprout, Droplets, Sun, ArrowLeft, Cloud, CloudRain, Moon, Trophy, Target, Sparkles, Zap, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useGameState } from "@/hooks/useGameState";
import FarmScene from "@/components/farm/FarmScene";
import ComboBadge from "@/components/farm/ComboBadge";
import type { BurstEvent } from "@/components/farm/HarvestBurst";
import { BALANCE } from "@/lib/state/balance";


type GrowthStage = "empty" | "seed" | "sprout" | "growing" | "mature" | "harvest" | "withered";
type Weather = "sunny" | "cloudy" | "rainy" | "stormy";
type DayPhase = "morning" | "day" | "evening" | "night";

interface PlantType {
  id: string;
  name: string;
  emoji: string;
  growthTime: number;
  waterNeeds: number;
  sunNeeds: number;
  yield: number;
  cost: number;
  unlockLevel: number;
  rarity: "common" | "rare" | "legendary";
}

interface Plot {
  id: number;
  stage: GrowthStage;
  plantType: PlantType | null;
  water: number;
  sun: number;
  health: number;
  hasPest: boolean;
  plantedAt: number | null;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  reward: number;
  type: "harvest" | "plant" | "water" | "pest";
  done: boolean;
}

const plantTypes: PlantType[] = [
  { id: "carrot", name: "Karotte", emoji: "🥕", growthTime: 15, waterNeeds: 60, sunNeeds: 50, yield: 2, cost: 5, unlockLevel: 1, rarity: "common" },
  { id: "tomato", name: "Tomate", emoji: "🍅", growthTime: 20, waterNeeds: 80, sunNeeds: 70, yield: 3, cost: 8, unlockLevel: 1, rarity: "common" },
  { id: "wheat", name: "Weizen", emoji: "🌾", growthTime: 25, waterNeeds: 40, sunNeeds: 90, yield: 5, cost: 10, unlockLevel: 2, rarity: "common" },
  { id: "corn", name: "Mais", emoji: "🌽", growthTime: 30, waterNeeds: 70, sunNeeds: 80, yield: 4, cost: 12, unlockLevel: 3, rarity: "rare" },
  { id: "pumpkin", name: "Kürbis", emoji: "🎃", growthTime: 45, waterNeeds: 75, sunNeeds: 75, yield: 8, cost: 20, unlockLevel: 5, rarity: "rare" },
  { id: "mystic", name: "Mystikblume", emoji: "🌸", growthTime: 60, waterNeeds: 90, sunNeeds: 60, yield: 15, cost: 50, unlockLevel: 8, rarity: "legendary" },
];

const xpForLevel = (lvl: number) => lvl * 100;

const Farm = () => {
  const { toast } = useToast();
  const { state, update } = useGameState();
  const resources = { coins: state.coins, harvested: state.harvested, xp: state.xp, level: state.level };
  const [plots, setPlots] = useState<Plot[]>(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      stage: "empty",
      plantType: null,
      water: 0,
      sun: 0,
      health: 100,
      hasPest: false,
      plantedAt: null,
    }))
  );
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null);
  const [weather, setWeather] = useState<Weather>("sunny");
  const [dayPhase, setDayPhase] = useState<DayPhase>("day");
  const [companionMood, setCompanionMood] = useState(80);
  const [quests, setQuests] = useState<Quest[]>([
    { id: "q1", title: "Erste Ernte", description: "Ernte 3 Pflanzen", target: 3, progress: 0, reward: 30, type: "harvest", done: false },
    { id: "q2", title: "Grüner Daumen", description: "Pflanze 5 Samen", target: 5, progress: 0, reward: 25, type: "plant", done: false },
    { id: "q3", title: "Schädlingsjäger", description: "Entferne 2 Schädlinge", target: 2, progress: 0, reward: 40, type: "pest", done: false },
  ]);
  const [bursts, setBursts] = useState<BurstEvent[]>([]);
  const burstIdRef = useRef(0);

  const spawnBurst = useCallback((text: string, color: string) => {
    const id = ++burstIdRef.current;
    // Random pixel position roughly centered in scene (scene height = 480)
    const x = 120 + Math.random() * 220;
    const y = 180 + Math.random() * 120;
    setBursts((b) => [...b, { id, x, y, text, color }]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1300);
  }, []);


  const updateQuest = useCallback((type: Quest["type"], amount = 1) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.type !== type || q.done) return q;
        const newProgress = Math.min(q.target, q.progress + amount);
        return { ...q, progress: newProgress };
      })
    );
  }, []);

  const claimQuest = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.progress < quest.target || quest.done) return;
    setQuests((prev) => prev.map((q) => (q.id === questId ? { ...q, done: true } : q)));
    update((s) => ({ ...s, coins: s.coins + quest.reward, xp: s.xp + 20, questsDone: s.questsDone + 1 }));
    toast({ title: "Quest abgeschlossen!", description: `+${quest.reward} Münzen, +20 XP` });
  };

  // Weather + Day cycle
  useEffect(() => {
    const cycle = setInterval(() => {
      setDayPhase((prev) => {
        const phases: DayPhase[] = ["morning", "day", "evening", "night"];
        return phases[(phases.indexOf(prev) + 1) % 4];
      });
      const weathers: Weather[] = ["sunny", "sunny", "cloudy", "rainy", "stormy"];
      setWeather(weathers[Math.floor(Math.random() * weathers.length)]);
    }, 30000);
    return () => clearInterval(cycle);
  }, []);

  // Level up check
  useEffect(() => {
    const required = xpForLevel(resources.level);
    if (resources.xp >= required) {
      update((s) => ({ ...s, level: s.level + 1, xp: s.xp - xpForLevel(s.level), coins: s.coins + 50 }));
      toast({ title: "🎉 Level Up!", description: `Du bist jetzt Level ${resources.level + 1}! +50 Münzen Bonus` });
    }
  }, [resources.xp, resources.level, toast, update]);

  // Main game tick
  useEffect(() => {
    const interval = setInterval(() => {
      setPlots((prevPlots) =>
        prevPlots.map((plot) => {
          if (plot.stage === "empty" || plot.stage === "harvest" || !plot.plantedAt || !plot.plantType) {
            return plot;
          }

          const elapsed = (Date.now() - plot.plantedAt) / 1000;
          // Weather effect on growth
          const growthMod = weather === "sunny" ? 1.2 : weather === "rainy" ? 1.1 : weather === "stormy" ? 0.7 : 1;
          const nightMod = dayPhase === "night" ? 0.5 : 1;
          const progress = (elapsed * growthMod * nightMod) / plot.plantType.growthTime;

          // Resource decay - rain adds water, sun adds sunlight
          let waterDecay = 0.5;
          let sunDecay = 0.3;
          let waterGain = 0;
          let sunGain = 0;

          if (weather === "rainy" || weather === "stormy") waterGain = 1.5;
          if (weather === "sunny" && dayPhase !== "night") sunGain = 1;
          if (dayPhase === "night") sunDecay = 0.6;

          const newWater = Math.max(0, Math.min(100, plot.water - waterDecay + waterGain));
          const newSun = Math.max(0, Math.min(100, plot.sun - sunDecay + sunGain));

          // Pest spawn
          let hasPest = plot.hasPest;
          if (!hasPest && Math.random() < 0.005 && plot.stage !== "seed") {
            hasPest = true;
          }

          // Health
          let newHealth = plot.health;
          if (newWater < 20 || newSun < 20) newHealth -= 1;
          if (hasPest) newHealth -= 2;
          if (weather === "stormy") newHealth -= 0.5;
          newHealth = Math.max(0, Math.min(100, newHealth));

          let newStage: GrowthStage = plot.stage;
          if (newHealth <= 0) {
            newStage = "withered";
          } else if (progress >= 1 && newWater >= plot.plantType.waterNeeds * 0.5 && newSun >= plot.plantType.sunNeeds * 0.5 && !hasPest) {
            newStage = "harvest";
          } else if (progress >= 0.75) {
            newStage = "mature";
          } else if (progress >= 0.5) {
            newStage = "growing";
          } else if (progress >= 0.25) {
            newStage = "sprout";
          } else {
            newStage = "seed";
          }

          return { ...plot, stage: newStage, water: newWater, sun: newSun, health: newHealth, hasPest };
        })
      );

      setCompanionMood((m) => Math.max(20, m - 0.3));
    }, 1000);

    return () => clearInterval(interval);
  }, [weather, dayPhase]);

  const handlePlotClick = (plotId: number) => {
    const plot = plots[plotId];
    if (plot.hasPest) {
      removePest(plotId);
    } else if (plot.stage === "harvest") {
      harvestPlot(plotId);
    } else if (plot.stage === "withered") {
      clearPlot(plotId);
    } else if (plot.stage === "empty" && selectedPlant) {
      plantSeed(plotId);
    }
  };

  const removePest = (plotId: number) => {
    setPlots((prev) => prev.map((p) => (p.id === plotId ? { ...p, hasPest: false, health: Math.min(100, p.health + 10) } : p)));
    update((s) => ({ ...s, xp: s.xp + 10, pestsRemoved: s.pestsRemoved + 1 }));
    updateQuest("pest");
    toast({ title: "🐛 Schädling entfernt!", description: "+10 XP" });
  };

  const clearPlot = (plotId: number) => {
    setPlots((prev) => prev.map((p) => (p.id === plotId ? { ...p, stage: "empty", plantType: null, water: 0, sun: 0, health: 100, hasPest: false, plantedAt: null } : p)));
    toast({ title: "Feld geräumt", description: "Bereit für neue Saat" });
  };

  const plantSeed = (plotId: number) => {
    if (!selectedPlant) return;
    if (selectedPlant.unlockLevel > resources.level) {
      toast({ title: "Gesperrt!", description: `Erreiche Level ${selectedPlant.unlockLevel}`, variant: "destructive" });
      return;
    }
    if (resources.coins < selectedPlant.cost) {
      toast({ title: "Nicht genug Münzen!", description: `Du brauchst ${selectedPlant.cost} Münzen.`, variant: "destructive" });
      return;
    }

    setPlots((prev) =>
      prev.map((plot) =>
        plot.id === plotId
          ? { ...plot, stage: "seed", plantType: selectedPlant, water: 50, sun: 50, health: 100, hasPest: false, plantedAt: Date.now() }
          : plot
      )
    );
    update((s) => ({ ...s, coins: s.coins - selectedPlant.cost, xp: s.xp + 5, plantsGrown: s.plantsGrown + 1 }));
    updateQuest("plant");
    toast({ title: "Gepflanzt!", description: `${selectedPlant.name} wurde gepflanzt.` });
  };

  const harvestPlot = (plotId: number) => {
    const plot = plots[plotId];
    if (!plot.plantType) return;
    const healthBonus = plot.health > 80 ? 1.5 : plot.health > 50 ? 1 : 0.5;
    const yield_amount = Math.ceil(plot.plantType.yield * healthBonus);
    const xp = yield_amount * 5;
    const cropId = plot.plantType.id;

    setPlots((prev) => prev.map((p) => (p.id === plotId ? { ...p, stage: "empty", plantType: null, water: 0, sun: 0, health: 100, hasPest: false, plantedAt: null } : p)));
    update((s) => ({
      ...s,
      harvested: s.harvested + yield_amount,
      xp: s.xp + xp,
      inventory: { ...s.inventory, [cropId]: (s.inventory[cropId] ?? 0) + yield_amount },
    }));
    setCompanionMood((m) => Math.min(100, m + 5));
    updateQuest("harvest");
    toast({ title: "🎉 Geerntet!", description: `+${yield_amount}× ${plot.plantType.name} ins Lager · Verkaufe im Markt!` });
  };

  const waterPlot = (plotId: number) => {
    setPlots((prev) => prev.map((plot) => (plot.id === plotId && plot.stage !== "empty" && plot.stage !== "harvest" ? { ...plot, water: Math.min(100, plot.water + 30) } : plot)));
    updateQuest("water");
  };

  const sunPlot = (plotId: number) => {
    setPlots((prev) => prev.map((plot) => (plot.id === plotId && plot.stage !== "empty" && plot.stage !== "harvest" ? { ...plot, sun: Math.min(100, plot.sun + 30) } : plot)));
  };

  const feedCompanion = () => {
    if (resources.coins < 10) {
      toast({ title: "Zu wenig Münzen", description: "10 Münzen nötig", variant: "destructive" });
      return;
    }
    update((s) => ({ ...s, coins: s.coins - 10 }));
    setCompanionMood(100);
    toast({ title: "🐝 Bizzy ist glücklich!", description: "Companion gefüttert" });
  };

  const getPlotEmoji = (plot: Plot) => {
    if (plot.hasPest) return "🐛";
    if (plot.stage === "withered") return "🥀";
    if (plot.stage === "harvest") return plot.plantType?.emoji || "🌱";
    if (plot.stage === "mature") return "🌿";
    if (plot.stage === "growing") return "🌱";
    if (plot.stage === "sprout") return "🌱";
    if (plot.stage === "seed") return "🌰";
    return "";
  };

  const WeatherIcon = weather === "sunny" ? Sun : weather === "rainy" ? CloudRain : weather === "stormy" ? Zap : Cloud;
  const PhaseIcon = dayPhase === "night" ? Moon : Sun;

  const bgClass =
    dayPhase === "night"
      ? "from-slate-900 via-indigo-950 to-slate-900"
      : dayPhase === "evening"
      ? "from-orange-900/20 via-background to-purple-900/20"
      : dayPhase === "morning"
      ? "from-amber-200/10 via-background to-sky-200/10"
      : "from-sky-200/10 via-background to-emerald-200/10";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgClass} transition-colors duration-1000`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück
              </Button>
            </Link>
            <Link to="/market">
              <Button variant="outline" size="sm">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Markt
              </Button>
            </Link>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Card className="bg-card/80 backdrop-blur">
              <CardContent className="py-2 px-4 flex items-center gap-2">
                <WeatherIcon className="h-5 w-5 text-primary" />
                <PhaseIcon className="h-4 w-4 text-accent" />
                <span className="text-xs capitalize">{weather} · {dayPhase}</span>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur">
              <CardContent className="py-2 px-4">
                <div className="text-xs text-muted-foreground">Münzen</div>
                <div className="text-xl font-bold text-primary">{resources.coins}</div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur">
              <CardContent className="py-2 px-4">
                <div className="text-xs text-muted-foreground">Lvl {resources.level}</div>
                <div className="w-20"><Progress value={(resources.xp / xpForLevel(resources.level)) * 100} className="h-2" /></div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Deine Lebendige Farm
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground">
            Wetter, Tag/Nacht, Schädlinge und Quests – ein echtes Farm-Erlebnis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle>Farmfelder</CardTitle>
                    <CardDescription className="text-xs">Pflanzen · Pflegen · Schädlinge bekämpfen · Ernten</CardDescription>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <Badge variant="secondary">🌾 {resources.harvested}</Badge>
                    <Badge variant="outline">⭐ {resources.xp} XP</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {plots.map((plot) => (
                    <div key={plot.id} className="relative">
                      <button
                        onClick={() => handlePlotClick(plot.id)}
                        className={`w-full aspect-square rounded-lg border-2 transition-all duration-300 relative overflow-hidden ${
                          plot.stage === "empty"
                            ? "border-dashed border-border bg-muted/20 hover:bg-muted/40"
                            : plot.stage === "harvest"
                            ? "border-accent bg-accent/10 hover:bg-accent/20 animate-pulse"
                            : plot.stage === "withered"
                            ? "border-destructive/50 bg-destructive/10"
                            : plot.hasPest
                            ? "border-orange-500 bg-orange-500/10 animate-pulse"
                            : "border-primary/50 bg-card hover:shadow-lg"
                        } flex flex-col items-center justify-center text-3xl md:text-4xl cursor-pointer`}
                      >
                        {weather === "rainy" && plot.stage !== "empty" && (
                          <div className="absolute inset-0 pointer-events-none opacity-30">
                            <div className="absolute top-0 left-1/4 w-0.5 h-2 bg-blue-400 animate-pulse" />
                            <div className="absolute top-0 right-1/3 w-0.5 h-2 bg-blue-400 animate-pulse" style={{ animationDelay: "0.3s" }} />
                          </div>
                        )}
                        {getPlotEmoji(plot)}
                        {plot.stage !== "empty" && plot.stage !== "harvest" && plot.stage !== "withered" && (
                          <div className="absolute bottom-1 left-1 right-1 flex gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); waterPlot(plot.id); }}
                              className="flex-1 bg-primary/20 hover:bg-primary/40 rounded p-1"
                            >
                              <Droplets className="h-3 w-3 text-primary mx-auto" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); sunPlot(plot.id); }}
                              className="flex-1 bg-accent/20 hover:bg-accent/40 rounded p-1"
                            >
                              <Sun className="h-3 w-3 text-accent mx-auto" />
                            </button>
                          </div>
                        )}
                      </button>
                      {plot.stage !== "empty" && plot.plantType && (
                        <div className="mt-1 space-y-0.5">
                          <div className="flex gap-1">
                            <div className="flex-1 h-1 bg-muted rounded overflow-hidden">
                              <div className="h-full bg-primary transition-all" style={{ width: `${plot.water}%` }} />
                            </div>
                            <div className="flex-1 h-1 bg-muted rounded overflow-hidden">
                              <div className="h-full bg-accent transition-all" style={{ width: `${plot.sun}%` }} />
                            </div>
                          </div>
                          <div className="h-1 bg-muted rounded overflow-hidden">
                            <div
                              className={`h-full transition-all ${plot.health > 60 ? "bg-green-500" : plot.health > 30 ? "bg-yellow-500" : "bg-destructive"}`}
                              style={{ width: `${plot.health}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5" /> Tagesquests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quests.map((q) => (
                  <div key={q.id} className={`p-3 rounded-lg border ${q.done ? "bg-muted/50 opacity-60" : "bg-card"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-sm">{q.title}</div>
                      <Badge variant={q.done ? "secondary" : "outline"} className="text-xs">+{q.reward} 💰</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">{q.description}</div>
                    <div className="flex items-center gap-2">
                      <Progress value={(q.progress / q.target) * 100} className="h-2 flex-1" />
                      <span className="text-xs font-mono">{q.progress}/{q.target}</span>
                      {q.progress >= q.target && !q.done && (
                        <Button size="sm" onClick={() => claimQuest(q.id)} className="h-7 text-xs">
                          <Trophy className="h-3 w-3 mr-1" /> Holen
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border-amber-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">🐝</span> Bizzy
                </CardTitle>
                <CardDescription className="text-xs">Dein Bienen-Companion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Stimmung</span>
                    <span>{Math.round(companionMood)}%</span>
                  </div>
                  <Progress value={companionMood} className="h-2" />
                </div>
                <div className="text-xs text-muted-foreground italic">
                  {companionMood > 70 ? "Bizzy summt fröhlich! +20% Wachstum 🌟" : companionMood > 40 ? "Bizzy ist okay..." : "Bizzy ist hungrig 😢"}
                </div>
                <Button onClick={feedCompanion} size="sm" className="w-full" variant="outline">
                  <Sparkles className="h-3 w-3 mr-1" /> Füttern (10 💰)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sprout className="h-5 w-5" /> Saatgut
                </CardTitle>
                <CardDescription className="text-xs">Lvl {resources.level} – mehr freischalten durch Leveln</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {plantTypes.map((plant) => {
                  const locked = plant.unlockLevel > resources.level;
                  return (
                    <button
                      key={plant.id}
                      onClick={() => !locked && setSelectedPlant(plant)}
                      disabled={locked}
                      className={`w-full p-3 rounded-lg border-2 transition-all ${
                        locked
                          ? "border-border bg-muted/30 opacity-50 cursor-not-allowed"
                          : selectedPlant?.id === plant.id
                          ? "border-primary bg-primary/10 shadow-lg scale-[1.02]"
                          : "border-border bg-card hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{plant.emoji}</span>
                        <div className="text-left flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{plant.name}</span>
                            {plant.rarity === "rare" && <Badge variant="secondary" className="text-[10px] py-0">Rare</Badge>}
                            {plant.rarity === "legendary" && <Badge className="text-[10px] py-0 bg-gradient-to-r from-purple-500 to-pink-500">Legend</Badge>}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {locked ? `🔒 Lvl ${plant.unlockLevel}` : `${plant.cost}💰 · ${plant.growthTime}s · +${plant.yield}`}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Farm;
