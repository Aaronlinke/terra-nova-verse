import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Sparkles, Moon, Sun, Droplets, Flame, Wind, Mountain, FlaskConical, Star } from "lucide-react";
import { toast } from "sonner";
import { updateState } from "@/lib/gameStore";

type Element = "sun" | "moon" | "water" | "fire" | "wind" | "earth";

interface Ingredient {
  id: string;
  name: string;
  element: Element;
  icon: typeof Sun;
  essence: string;
}

interface Ritual {
  id: string;
  name: string;
  description: string;
  required: Element[];
  result: {
    name: string;
    description: string;
    power: string;
    color: string;
  };
}

const ingredients: Ingredient[] = [
  { id: "sunflower", name: "Sonnenblume", element: "sun", icon: Sun, essence: "Lichtkraft" },
  { id: "mondkraut", name: "Mondkraut", element: "moon", icon: Moon, essence: "Traumessenz" },
  { id: "wassertau", name: "Morgentau", element: "water", icon: Droplets, essence: "Reinheit" },
  { id: "feuerlilie", name: "Feuerlilie", element: "fire", icon: Flame, essence: "Glut" },
  { id: "windhalm", name: "Windhalm", element: "wind", icon: Wind, essence: "Hauch" },
  { id: "wurzelstein", name: "Wurzelstein", element: "earth", icon: Mountain, essence: "Verwurzelung" },
];

const rituals: Ritual[] = [
  {
    id: "vitalis",
    name: "Elixier Vitalis",
    description: "Pflanzentrank für vitale Bodenmikroben",
    required: ["sun", "water", "earth"],
    result: { name: "Vitalis-Essenz", description: "Belebt müde Böden mit Sonnenkraft, Tau und Erdmineralien.", power: "+40% Bodenleben", color: "from-amber-400 to-emerald-500" },
  },
  {
    id: "lunaris",
    name: "Mondritual Lunaris",
    description: "Nachttrank für Saatgut-Aktivierung",
    required: ["moon", "water", "wind"],
    result: { name: "Lunaris-Essenz", description: "Erweckt schlummernde Samen durch Mondlicht und Morgentau.", power: "+60% Keimrate", color: "from-indigo-400 to-cyan-300" },
  },
  {
    id: "ignis",
    name: "Phönix-Alchemie",
    description: "Asche-Transformation für Mineralisierung",
    required: ["fire", "earth", "sun"],
    result: { name: "Ignis-Essenz", description: "Verwandelt Pflanzenreste in mineralreiche Bio-Asche.", power: "+50% Mineralien", color: "from-orange-500 to-yellow-400" },
  },
  {
    id: "aether",
    name: "Äther-Synthese",
    description: "Die ultimative Transmutation aller Elemente",
    required: ["sun", "moon", "water", "fire", "wind", "earth"],
    result: { name: "Aether-Essenz", description: "Die legendäre Verbindung aller sechs Elemente. Ein perfektes Bio-Universum im Tropfen.", power: "+100% alle Eigenschaften", color: "from-fuchsia-500 via-primary to-emerald-400" },
  },
];

const elementIcons: Record<Element, typeof Sun> = {
  sun: Sun, moon: Moon, water: Droplets, fire: Flame, wind: Wind, earth: Mountain,
};

const CryptoBotany = () => {
  const [cauldron, setCauldron] = useState<Ingredient[]>([]);
  const [brewing, setBrewing] = useState(false);
  const [brewProgress, setBrewProgress] = useState(0);
  const [discoveries, setDiscoveries] = useState<string[]>([]);
  const [moonPhase, setMoonPhase] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setMoonPhase((p) => (p + 1) % 8), 3000);
    return () => clearInterval(t);
  }, []);

  const addIngredient = (ing: Ingredient) => {
    if (brewing) return;
    if (cauldron.find((i) => i.id === ing.id)) {
      toast.info(`${ing.name} ist bereits im Kessel`);
      return;
    }
    setCauldron([...cauldron, ing]);
    toast.success(`${ing.essence} hinzugefügt`);
  };

  const clearCauldron = () => {
    setCauldron([]);
    setBrewProgress(0);
  };

  const brew = () => {
    if (cauldron.length < 3) {
      toast.error("Mindestens 3 Zutaten benötigt");
      return;
    }
    setBrewing(true);
    setBrewProgress(0);
    const interval = setInterval(() => {
      setBrewProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          finishBrew();
          return 100;
        }
        return p + 4;
      });
    }, 80);
  };

  const finishBrew = () => {
    const elements = cauldron.map((i) => i.element).sort();
    const match = rituals.find((r) => {
      const req = [...r.required].sort();
      return req.length === elements.length && req.every((e, i) => e === elements[i]);
    });

    setTimeout(() => {
      if (match) {
        toast.success(`✨ ${match.result.name} erschaffen!`, { description: match.result.power });
        updateState((s) => ({ ...s, essencesBrewed: s.essencesBrewed + 1 }));
        if (!discoveries.includes(match.id)) {
          setDiscoveries([...discoveries, match.id]);
        }
      } else {
        toast.error("Die Elemente harmonieren nicht", { description: "Versuche eine andere Kombination" });
      }
      setBrewing(false);
      setCauldron([]);
      setBrewProgress(0);
    }, 500);
  };

  const moonGlyphs = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,hsl(var(--accent)/0.15),transparent_50%)] pointer-events-none" />

      <div className="container relative z-10 px-4 py-8 mx-auto">
        <Link to="/">
          <Button variant="ghost" className="mb-6 group">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Zurück
          </Button>
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Feature 9 · Krypto-Botanik</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Mystische Bio-Alchemie
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sammle die sechs Elemente, vereine sie im Kessel und erschaffe lebendige Pflanzen-Essenzen.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-2xl">{moonGlyphs[moonPhase]}</span>
            <span>Mondphase aktiv</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Ingredients */}
          <Card className="lg:col-span-1 backdrop-blur-sm bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Heilige Zutaten
              </CardTitle>
              <CardDescription>Wähle Elemente für deinen Trank</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {ingredients.map((ing) => {
                const Icon = ing.icon;
                const selected = cauldron.find((i) => i.id === ing.id);
                return (
                  <button
                    key={ing.id}
                    onClick={() => addIngredient(ing)}
                    disabled={brewing}
                    className={`p-4 rounded-lg border transition-all hover-scale ${
                      selected
                        ? "bg-primary/20 border-primary"
                        : "bg-background/50 border-border hover:border-primary/50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-sm font-medium">{ing.name}</div>
                    <div className="text-xs text-muted-foreground">{ing.essence}</div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Cauldron */}
          <Card className="lg:col-span-2 backdrop-blur-sm bg-card/80 relative overflow-hidden">
            <div className={`absolute inset-0 transition-opacity duration-500 ${brewing ? "opacity-30" : "opacity-0"} bg-gradient-to-t from-primary/40 via-accent/20 to-transparent animate-pulse pointer-events-none`} />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-accent" />
                Alchemie-Kessel
              </CardTitle>
              <CardDescription>
                {cauldron.length === 0 ? "Der Kessel ist leer..." : `${cauldron.length} Element${cauldron.length > 1 ? "e" : ""} im Kessel`}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="min-h-[180px] rounded-lg border-2 border-dashed border-primary/30 bg-background/30 p-6 flex flex-wrap gap-3 items-center justify-center mb-4">
                {cauldron.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Klicke auf Zutaten links</p>
                ) : (
                  cauldron.map((ing, idx) => {
                    const Icon = ing.icon;
                    return (
                      <div
                        key={ing.id}
                        className="flex flex-col items-center gap-1 animate-in fade-in zoom-in duration-500"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border border-primary/40 ${brewing ? "animate-spin" : ""}`}>
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xs">{ing.essence}</span>
                      </div>
                    );
                  })
                )}
              </div>

              {brewing && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Transmutation läuft...</span>
                    <span>{brewProgress}%</span>
                  </div>
                  <Progress value={brewProgress} />
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={brew} disabled={brewing || cauldron.length < 3} className="flex-1">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {brewing ? "Brauen..." : "Ritual entfachen"}
                </Button>
                <Button onClick={clearCauldron} variant="outline" disabled={brewing || cauldron.length === 0}>
                  Leeren
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rituals grimoire */}
        <Card className="backdrop-blur-sm bg-card/80">
          <CardHeader>
            <CardTitle>Buch der Rituale</CardTitle>
            <CardDescription>
              {discoveries.length} von {rituals.length} Essenzen entdeckt
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {rituals.map((r) => {
              const found = discoveries.includes(r.id);
              return (
                <div
                  key={r.id}
                  className={`p-5 rounded-lg border transition-all ${
                    found ? "bg-gradient-to-br " + r.result.color + " border-primary/40" : "bg-background/50 border-border"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-bold ${found ? "text-white" : ""}`}>{found ? r.result.name : "??? Unbekannt"}</h3>
                    {found && <Badge className="bg-white/20 text-white border-0">Entdeckt</Badge>}
                  </div>
                  <p className={`text-sm mb-3 ${found ? "text-white/90" : "text-muted-foreground"}`}>
                    {found ? r.result.description : r.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {r.required.map((el, i) => {
                      const Icon = elementIcons[el];
                      return (
                        <div
                          key={i}
                          className={`w-7 h-7 rounded-full flex items-center justify-center ${
                            found ? "bg-white/20" : "bg-primary/10"
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${found ? "text-white" : "text-primary"}`} />
                        </div>
                      );
                    })}
                  </div>
                  {found && <div className="text-xs font-medium text-white">⚡ {r.result.power}</div>}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {discoveries.length === rituals.length && (
          <Card className="mt-8 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border-primary/40 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Großmeister der Bio-Alchemie
              </h2>
              <p className="text-muted-foreground">
                Du hast alle Essenzen gemeistert und das GaiaVerse vollendet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CryptoBotany;
