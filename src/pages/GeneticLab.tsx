import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Dna, FlaskConical, Sparkles, Leaf, Zap, Shield, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface PlantTrait {
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface BasePlant {
  id: string;
  name: string;
  emoji: string;
  traits: string[];
}

interface HybridPlant {
  id: string;
  name: string;
  emoji: string;
  traits: string[];
  parents: [string, string];
  rarity: "common" | "rare" | "legendary";
  discovered: boolean;
}

const traitDefinitions: Record<string, PlantTrait> = {
  drought: { name: "Dürreresistent", icon: <Droplets className="w-3 h-3" />, color: "bg-amber-500" },
  fast: { name: "Schnellwuchs", icon: <Zap className="w-3 h-3" />, color: "bg-yellow-500" },
  resistant: { name: "Schädlingsresistent", icon: <Shield className="w-3 h-3" />, color: "bg-green-500" },
  yield: { name: "Hoher Ertrag", icon: <Leaf className="w-3 h-3" />, color: "bg-emerald-500" },
  glow: { name: "Biolumineszenz", icon: <Sparkles className="w-3 h-3" />, color: "bg-purple-500" },
  healing: { name: "Heilkräfte", icon: <FlaskConical className="w-3 h-3" />, color: "bg-pink-500" },
};

const basePlants: BasePlant[] = [
  { id: "tomato", name: "Tomate", emoji: "🍅", traits: ["yield"] },
  { id: "carrot", name: "Karotte", emoji: "🥕", traits: ["fast"] },
  { id: "wheat", name: "Weizen", emoji: "🌾", traits: ["drought"] },
  { id: "corn", name: "Mais", emoji: "🌽", traits: ["resistant"] },
  { id: "rose", name: "Rose", emoji: "🌹", traits: ["glow"] },
  { id: "herb", name: "Heilkraut", emoji: "🌿", traits: ["healing"] },
];

const possibleHybrids: HybridPlant[] = [
  { id: "golden-tomato", name: "Goldtomate", emoji: "✨🍅", traits: ["yield", "fast"], parents: ["tomato", "carrot"], rarity: "rare", discovered: false },
  { id: "iron-wheat", name: "Eisenweizen", emoji: "⚔️🌾", traits: ["drought", "resistant"], parents: ["wheat", "corn"], rarity: "rare", discovered: false },
  { id: "glow-carrot", name: "Leuchtkarotte", emoji: "💫🥕", traits: ["fast", "glow"], parents: ["carrot", "rose"], rarity: "legendary", discovered: false },
  { id: "healing-corn", name: "Heilmais", emoji: "💚🌽", traits: ["resistant", "healing"], parents: ["corn", "herb"], rarity: "rare", discovered: false },
  { id: "super-tomato", name: "Supertomate", emoji: "🦸🍅", traits: ["yield", "resistant", "fast"], parents: ["tomato", "corn"], rarity: "legendary", discovered: false },
  { id: "mystic-rose", name: "Mystische Rose", emoji: "🔮🌹", traits: ["glow", "healing"], parents: ["rose", "herb"], rarity: "legendary", discovered: false },
  { id: "desert-wheat", name: "Wüstenweizen", emoji: "🏜️🌾", traits: ["drought", "yield"], parents: ["wheat", "tomato"], rarity: "common", discovered: false },
  { id: "turbo-herb", name: "Turbokraut", emoji: "⚡🌿", traits: ["healing", "fast"], parents: ["herb", "carrot"], rarity: "rare", discovered: false },
];

const GeneticLab = () => {
  const { toast } = useToast();
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const [discoveredHybrids, setDiscoveredHybrids] = useState<HybridPlant[]>([]);
  const [isExperimenting, setIsExperimenting] = useState(false);
  const [experimentProgress, setExperimentProgress] = useState(0);
  const [dnaPoints, setDnaPoints] = useState(100);

  const handlePlantSelect = (plantId: string) => {
    if (selectedPlants.includes(plantId)) {
      setSelectedPlants(selectedPlants.filter(id => id !== plantId));
    } else if (selectedPlants.length < 2) {
      setSelectedPlants([...selectedPlants, plantId]);
    }
  };

  const startExperiment = () => {
    if (selectedPlants.length !== 2 || dnaPoints < 20) return;

    setIsExperimenting(true);
    setExperimentProgress(0);
    setDnaPoints(prev => prev - 20);

    const interval = setInterval(() => {
      setExperimentProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeExperiment();
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const completeExperiment = () => {
    const [plant1, plant2] = selectedPlants.sort();
    
    const matchingHybrid = possibleHybrids.find(
      h => (h.parents[0] === plant1 && h.parents[1] === plant2) ||
           (h.parents[0] === plant2 && h.parents[1] === plant1)
    );

    if (matchingHybrid) {
      const alreadyDiscovered = discoveredHybrids.find(h => h.id === matchingHybrid.id);
      
      if (alreadyDiscovered) {
        toast({
          title: "Bereits entdeckt!",
          description: `${matchingHybrid.name} ist bereits in deiner Sammlung.`,
        });
        setDnaPoints(prev => prev + 10);
      } else {
        const newHybrid = { ...matchingHybrid, discovered: true };
        setDiscoveredHybrids([...discoveredHybrids, newHybrid]);
        setDnaPoints(prev => prev + (matchingHybrid.rarity === "legendary" ? 50 : matchingHybrid.rarity === "rare" ? 30 : 15));
        
        toast({
          title: "🧬 Neue Sorte entdeckt!",
          description: `${matchingHybrid.emoji} ${matchingHybrid.name} wurde erfolgreich gezüchtet!`,
        });
      }
    } else {
      toast({
        title: "Experiment fehlgeschlagen",
        description: "Diese Kombination ergibt keine neue Sorte. Versuche andere Pflanzen!",
        variant: "destructive",
      });
    }

    setIsExperimenting(false);
    setExperimentProgress(0);
    setSelectedPlants([]);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case "rare": return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "Legendär";
      case "rare": return "Selten";
      default: return "Gewöhnlich";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Dna className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Genetisches Labor</h1>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-card px-4 py-2 rounded-full border">
            <Dna className="w-5 h-5 text-primary" />
            <span className="font-bold">{dnaPoints} DNA-Punkte</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Base Plants Selection */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                Basispflanzen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Wähle 2 Pflanzen zum Kreuzen (Kosten: 20 DNA)
              </p>
              <div className="grid grid-cols-2 gap-3">
                {basePlants.map((plant) => (
                  <Button
                    key={plant.id}
                    variant={selectedPlants.includes(plant.id) ? "default" : "outline"}
                    className="h-auto py-3 flex flex-col gap-1"
                    onClick={() => handlePlantSelect(plant.id)}
                    disabled={isExperimenting}
                  >
                    <span className="text-2xl">{plant.emoji}</span>
                    <span className="text-xs">{plant.name}</span>
                    <div className="flex gap-1 mt-1">
                      {plant.traits.map((trait) => (
                        <div
                          key={trait}
                          className={`${traitDefinitions[trait].color} p-1 rounded-full`}
                          title={traitDefinitions[trait].name}
                        >
                          {traitDefinitions[trait].icon}
                        </div>
                      ))}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experiment Area */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5" />
                Experimentierstation
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-3xl border-2 border-dashed border-primary/30">
                  {selectedPlants[0] ? basePlants.find(p => p.id === selectedPlants[0])?.emoji : "?"}
                </div>
                <Dna className="w-8 h-8 text-primary animate-pulse" />
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-3xl border-2 border-dashed border-primary/30">
                  {selectedPlants[1] ? basePlants.find(p => p.id === selectedPlants[1])?.emoji : "?"}
                </div>
              </div>

              {isExperimenting && (
                <div className="w-full space-y-2">
                  <Progress value={experimentProgress} className="h-3" />
                  <p className="text-sm text-center text-muted-foreground">
                    DNA wird analysiert... {experimentProgress}%
                  </p>
                </div>
              )}

              <Button
                onClick={startExperiment}
                disabled={selectedPlants.length !== 2 || isExperimenting || dnaPoints < 20}
                className="w-full"
                size="lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isExperimenting ? "Experiment läuft..." : "Kreuzung starten"}
              </Button>

              {selectedPlants.length === 2 && !isExperimenting && (
                <p className="text-xs text-muted-foreground text-center">
                  Kreuze {basePlants.find(p => p.id === selectedPlants[0])?.name} mit{" "}
                  {basePlants.find(p => p.id === selectedPlants[1])?.name}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Discovered Hybrids */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Entdeckte Sorten ({discoveredHybrids.length}/{possibleHybrids.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {discoveredHybrids.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Dna className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Noch keine Hybriden entdeckt.</p>
                  <p className="text-xs">Starte dein erstes Experiment!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {discoveredHybrids.map((hybrid) => (
                    <div
                      key={hybrid.id}
                      className="p-3 rounded-lg bg-muted/50 border"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{hybrid.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{hybrid.name}</span>
                            <Badge className={getRarityColor(hybrid.rarity)}>
                              {getRarityLabel(hybrid.rarity)}
                            </Badge>
                          </div>
                          <div className="flex gap-1 mt-1">
                            {hybrid.traits.map((trait) => (
                              <Badge key={trait} variant="secondary" className="text-xs py-0">
                                {traitDefinitions[trait]?.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Trait Legend */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Eigenschaften-Legende</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(traitDefinitions).map(([key, trait]) => (
                <div key={key} className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
                  <div className={`${trait.color} p-1.5 rounded-full text-white`}>
                    {trait.icon}
                  </div>
                  <span className="text-sm">{trait.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneticLab;
