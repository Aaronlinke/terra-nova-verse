import { useState, useEffect } from "react";
import { Heart, Music, MessageCircle, Sparkles, ArrowLeft, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

type Emotion = "happy" | "sad" | "stressed" | "calm" | "excited" | "lonely";
type InteractionType = "talk" | "music" | "pet" | "encourage";

interface Plant {
  id: number;
  name: string;
  emoji: string;
  emotion: Emotion;
  emotionalLevel: number; // 0-100
  bond: number; // 0-100
  yield: number;
  lastInteraction: number;
}

const emotionData: Record<Emotion, { color: string; label: string; effect: string }> = {
  happy: { color: "hsl(var(--accent))", label: "Glücklich", effect: "+25% Ertrag" },
  sad: { color: "hsl(var(--muted-foreground))", label: "Traurig", effect: "-20% Ertrag" },
  stressed: { color: "hsl(var(--destructive))", label: "Gestresst", effect: "-30% Ertrag" },
  calm: { color: "hsl(var(--primary))", label: "Ruhig", effect: "+10% Ertrag" },
  excited: { color: "hsl(var(--secondary))", label: "Aufgeregt", effect: "+15% Ertrag" },
  lonely: { color: "hsl(var(--muted))", label: "Einsam", effect: "-15% Ertrag" },
};

const plantNames = ["Luna", "Bella", "Max", "Rosie", "Oscar", "Daisy"];

const EmotionalFarming = () => {
  const { toast } = useToast();
  const [plants, setPlants] = useState<Plant[]>(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      name: plantNames[i],
      emoji: ["🌻", "🌹", "🌷", "🌺", "🌼", "🌸"][i],
      emotion: ["happy", "calm", "lonely", "excited", "stressed", "sad"][i] as Emotion,
      emotionalLevel: Math.floor(Math.random() * 40) + 30,
      bond: Math.floor(Math.random() * 30) + 10,
      yield: 1,
      lastInteraction: Date.now(),
    }))
  );
  const [totalYield, setTotalYield] = useState(0);
  const [selectedPlant, setSelectedPlant] = useState<number | null>(null);

  // Emotion decay over time
  useEffect(() => {
    const interval = setInterval(() => {
      setPlants((prev) =>
        prev.map((plant) => {
          const timeSinceInteraction = (Date.now() - plant.lastInteraction) / 1000;
          
          // Decay emotional level if not interacted with
          let newEmotionalLevel = plant.emotionalLevel;
          if (timeSinceInteraction > 30) {
            newEmotionalLevel = Math.max(0, plant.emotionalLevel - 0.5);
          }

          // Update emotion based on emotional level
          let newEmotion: Emotion = plant.emotion;
          if (newEmotionalLevel < 20) {
            newEmotion = "lonely";
          } else if (newEmotionalLevel < 40) {
            newEmotion = "sad";
          } else if (newEmotionalLevel < 60) {
            newEmotion = "calm";
          } else if (newEmotionalLevel < 80) {
            newEmotion = "happy";
          } else {
            newEmotion = "excited";
          }

          return {
            ...plant,
            emotionalLevel: newEmotionalLevel,
            emotion: newEmotion,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const interact = (plantId: number, type: InteractionType) => {
    setPlants((prev) =>
      prev.map((plant) => {
        if (plant.id !== plantId) return plant;

        const interactionBoost = {
          talk: 15,
          music: 20,
          pet: 25,
          encourage: 18,
        };

        const newEmotionalLevel = Math.min(100, plant.emotionalLevel + interactionBoost[type]);
        const newBond = Math.min(100, plant.bond + 5);

        return {
          ...plant,
          emotionalLevel: newEmotionalLevel,
          bond: newBond,
          lastInteraction: Date.now(),
        };
      })
    );

    const interactionMessages = {
      talk: "Mit Pflanze gesprochen",
      music: "Musik vorgespielt",
      pet: "Pflanze gestreichelt",
      encourage: "Pflanze ermutigt",
    };

    toast({
      title: interactionMessages[type],
      description: "Die Pflanze fühlt sich besser!",
    });
  };

  const harvestAll = () => {
    let totalHarvest = 0;

    plants.forEach((plant) => {
      const emotionMultiplier = {
        happy: 1.25,
        excited: 1.15,
        calm: 1.1,
        lonely: 0.85,
        sad: 0.8,
        stressed: 0.7,
      };

      const bondBonus = plant.bond / 100;
      const harvest = Math.floor(
        plant.yield * emotionMultiplier[plant.emotion] * (1 + bondBonus)
      );
      totalHarvest += harvest;
    });

    setTotalYield((prev) => prev + totalHarvest);

    toast({
      title: "Geerntet!",
      description: `${totalHarvest} Einheiten geerntet. Emotionale Bindung zahlt sich aus!`,
    });

    // Reset plants after harvest
    setPlants((prev) =>
      prev.map((plant) => ({
        ...plant,
        emotionalLevel: 50,
        emotion: "calm",
        yield: 1,
      }))
    );
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
          <Card className="bg-card/80 backdrop-blur">
            <CardContent className="py-3 px-6">
              <div className="text-sm text-muted-foreground">Gesamt-Ertrag</div>
              <div className="text-2xl font-bold text-primary">{totalYield}</div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Emotionale Landwirtschaft
          </h1>
          <p className="text-lg text-muted-foreground">
            Interagiere mit deinen Pflanzen auf emotionaler Ebene - ihre Gefühle beeinflussen die Erträge!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {plants.map((plant) => (
            <Card
              key={plant.id}
              className={`group hover:shadow-xl transition-all duration-300 cursor-pointer ${
                selectedPlant === plant.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedPlant(plant.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-5xl">{plant.emoji}</span>
                    <div>
                      <CardTitle className="text-xl">{plant.name}</CardTitle>
                      <CardDescription
                        style={{ color: emotionData[plant.emotion].color }}
                        className="font-semibold"
                      >
                        {emotionData[plant.emotion].label}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Ertrag-Effekt</div>
                    <div className="text-sm font-bold" style={{ color: emotionData[plant.emotion].color }}>
                      {emotionData[plant.emotion].effect}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Emotionales Level</span>
                    <span className="font-semibold">{Math.round(plant.emotionalLevel)}%</span>
                  </div>
                  <Progress value={plant.emotionalLevel} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Bindung</span>
                    <span className="font-semibold">{Math.round(plant.bond)}%</span>
                  </div>
                  <Progress value={plant.bond} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      interact(plant.id, "talk");
                    }}
                    className="gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Sprechen
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      interact(plant.id, "music");
                    }}
                    className="gap-2"
                  >
                    <Music className="h-4 w-4" />
                    Musik
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      interact(plant.id, "pet");
                    }}
                    className="gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    Streicheln
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      interact(plant.id, "encourage");
                    }}
                    className="gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Ermutigen
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Button size="lg" onClick={harvestAll} className="gap-2">
            <Sparkles className="h-5 w-5" />
            Alle Pflanzen ernten
          </Button>
        </div>

        <Card className="mt-8 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Spielmechanik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Pflanzen haben Emotionen, die ihre Erträge beeinflussen</li>
              <li>• Interagiere regelmäßig, um das emotionale Level hochzuhalten</li>
              <li>• Höhere Bindung = höhere Ertragsboni</li>
              <li>• Vernachlässigte Pflanzen werden einsam und traurig</li>
              <li>• Verschiedene Interaktionen steigern die Stimmung unterschiedlich stark</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmotionalFarming;
