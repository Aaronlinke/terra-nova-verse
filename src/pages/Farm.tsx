import { useState, useEffect } from "react";
import { Sprout, Droplets, Sun, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

type GrowthStage = "empty" | "seed" | "sprout" | "growing" | "mature" | "harvest";

interface PlantType {
  id: string;
  name: string;
  emoji: string;
  growthTime: number; // seconds
  waterNeeds: number;
  sunNeeds: number;
  yield: number;
}

interface Plot {
  id: number;
  stage: GrowthStage;
  plantType: PlantType | null;
  water: number;
  sun: number;
  plantedAt: number | null;
}

const plantTypes: PlantType[] = [
  { id: "tomato", name: "Tomate", emoji: "🍅", growthTime: 20, waterNeeds: 80, sunNeeds: 70, yield: 3 },
  { id: "carrot", name: "Karotte", emoji: "🥕", growthTime: 15, waterNeeds: 60, sunNeeds: 50, yield: 2 },
  { id: "wheat", name: "Weizen", emoji: "🌾", growthTime: 25, waterNeeds: 40, sunNeeds: 90, yield: 5 },
  { id: "corn", name: "Mais", emoji: "🌽", growthTime: 30, waterNeeds: 70, sunNeeds: 80, yield: 4 },
];

const Farm = () => {
  const { toast } = useToast();
  const [plots, setPlots] = useState<Plot[]>(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      stage: "empty",
      plantType: null,
      water: 0,
      sun: 0,
      plantedAt: null,
    }))
  );
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null);
  const [resources, setResources] = useState({ coins: 50, harvested: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setPlots((prevPlots) =>
        prevPlots.map((plot) => {
          if (plot.stage === "empty" || plot.stage === "harvest" || !plot.plantedAt || !plot.plantType) {
            return plot;
          }

          const elapsed = (Date.now() - plot.plantedAt) / 1000;
          const progress = elapsed / plot.plantType.growthTime;

          // Decay water and sun
          const newWater = Math.max(0, plot.water - 0.5);
          const newSun = Math.max(0, plot.sun - 0.3);

          let newStage: GrowthStage = plot.stage;
          if (progress >= 1 && newWater >= plot.plantType.waterNeeds * 0.7 && newSun >= plot.plantType.sunNeeds * 0.7) {
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

          return { ...plot, stage: newStage, water: newWater, sun: newSun };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePlotClick = (plotId: number) => {
    const plot = plots[plotId];

    if (plot.stage === "harvest") {
      harvestPlot(plotId);
    } else if (plot.stage === "empty" && selectedPlant) {
      plantSeed(plotId);
    }
  };

  const plantSeed = (plotId: number) => {
    if (!selectedPlant || resources.coins < 5) {
      toast({
        title: "Nicht genug Münzen!",
        description: "Du brauchst 5 Münzen zum Pflanzen.",
        variant: "destructive",
      });
      return;
    }

    setPlots((prevPlots) =>
      prevPlots.map((plot) =>
        plot.id === plotId
          ? {
              ...plot,
              stage: "seed",
              plantType: selectedPlant,
              water: 50,
              sun: 50,
              plantedAt: Date.now(),
            }
          : plot
      )
    );

    setResources((prev) => ({ ...prev, coins: prev.coins - 5 }));
    toast({
      title: "Gepflanzt!",
      description: `${selectedPlant.name} wurde gepflanzt.`,
    });
  };

  const harvestPlot = (plotId: number) => {
    const plot = plots[plotId];
    if (!plot.plantType) return;

    const yield_amount = plot.plantType.yield;
    const coins = yield_amount * 3;

    setPlots((prevPlots) =>
      prevPlots.map((p) =>
        p.id === plotId
          ? { ...p, stage: "empty", plantType: null, water: 0, sun: 0, plantedAt: null }
          : p
      )
    );

    setResources((prev) => ({
      coins: prev.coins + coins,
      harvested: prev.harvested + yield_amount,
    }));

    toast({
      title: "Geerntet!",
      description: `+${yield_amount} ${plot.plantType.name}, +${coins} Münzen`,
    });
  };

  const waterPlot = (plotId: number) => {
    setPlots((prevPlots) =>
      prevPlots.map((plot) =>
        plot.id === plotId && plot.stage !== "empty" && plot.stage !== "harvest"
          ? { ...plot, water: Math.min(100, plot.water + 30) }
          : plot
      )
    );
    toast({ title: "Bewässert!", description: "Pflanze wurde bewässert." });
  };

  const sunPlot = (plotId: number) => {
    setPlots((prevPlots) =>
      prevPlots.map((plot) =>
        plot.id === plotId && plot.stage !== "empty" && plot.stage !== "harvest"
          ? { ...plot, sun: Math.min(100, plot.sun + 30) }
          : plot
      )
    );
    toast({ title: "Sonnenlicht!", description: "Pflanze bekommt Sonne." });
  };

  const getPlotEmoji = (plot: Plot) => {
    if (plot.stage === "harvest") return plot.plantType?.emoji || "🌱";
    if (plot.stage === "mature") return "🌿";
    if (plot.stage === "growing") return "🌱";
    if (plot.stage === "sprout") return "🌱";
    if (plot.stage === "seed") return "🌰";
    return "";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück
            </Button>
          </Link>
          <div className="flex gap-4">
            <Card className="bg-card/80 backdrop-blur">
              <CardContent className="py-3 px-6">
                <div className="text-sm text-muted-foreground">Münzen</div>
                <div className="text-2xl font-bold text-primary">{resources.coins}</div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur">
              <CardContent className="py-3 px-6">
                <div className="text-sm text-muted-foreground">Geerntet</div>
                <div className="text-2xl font-bold text-accent">{resources.harvested}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Deine Interaktive Farm
          </h1>
          <p className="text-lg text-muted-foreground">
            Pflanze Samen, kümmere dich um sie und ernte deine Belohnungen!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Farmfelder</CardTitle>
                <CardDescription>Klicke auf ein leeres Feld zum Pflanzen, auf reife Pflanzen zum Ernten</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {plots.map((plot) => (
                    <div key={plot.id} className="relative">
                      <button
                        onClick={() => handlePlotClick(plot.id)}
                        className={`w-full aspect-square rounded-lg border-2 transition-all duration-300 ${
                          plot.stage === "empty"
                            ? "border-dashed border-border bg-muted/20 hover:bg-muted/40"
                            : plot.stage === "harvest"
                            ? "border-accent bg-accent/10 hover:bg-accent/20 animate-pulse"
                            : "border-primary/50 bg-card hover:shadow-lg"
                        } flex flex-col items-center justify-center text-4xl cursor-pointer`}
                      >
                        {getPlotEmoji(plot)}
                        {plot.stage !== "empty" && plot.stage !== "harvest" && (
                          <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                waterPlot(plot.id);
                              }}
                              className="flex-1 bg-primary/20 hover:bg-primary/30 rounded p-1"
                            >
                              <Droplets className="h-3 w-3 text-primary mx-auto" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                sunPlot(plot.id);
                              }}
                              className="flex-1 bg-accent/20 hover:bg-accent/30 rounded p-1"
                            >
                              <Sun className="h-3 w-3 text-accent mx-auto" />
                            </button>
                          </div>
                        )}
                      </button>
                      {plot.stage !== "empty" && plot.plantType && (
                        <div className="mt-1 flex gap-1">
                          <div
                            className="flex-1 h-1 bg-muted rounded"
                            style={{
                              background: `linear-gradient(to right, hsl(var(--primary)) ${plot.water}%, hsl(var(--muted)) ${plot.water}%)`,
                            }}
                          />
                          <div
                            className="flex-1 h-1 bg-muted rounded"
                            style={{
                              background: `linear-gradient(to right, hsl(var(--accent)) ${plot.sun}%, hsl(var(--muted)) ${plot.sun}%)`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5" />
                  Saatgut auswählen
                </CardTitle>
                <CardDescription>Wähle eine Pflanze zum Anbauen (5 Münzen)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {plantTypes.map((plant) => (
                  <button
                    key={plant.id}
                    onClick={() => setSelectedPlant(plant)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedPlant?.id === plant.id
                        ? "border-primary bg-primary/10 shadow-lg"
                        : "border-border bg-card hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{plant.emoji}</span>
                      <div className="text-left flex-1">
                        <div className="font-semibold">{plant.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {plant.growthTime}s • Ertrag: {plant.yield}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Farm;
