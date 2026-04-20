import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Hammer,
  Recycle,
  Wheat,
  Scissors,
  FlaskConical,
  Sprout,
  CheckCircle2,
  Circle,
  Trophy,
  Sparkles,
  Clock,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { updateState } from "@/lib/gameStore";

type Step = {
  title: string;
  description: string;
  tip?: string;
};

type Craft = {
  id: string;
  title: string;
  category: string;
  difficulty: "Einfach" | "Mittel" | "Fortgeschritten";
  duration: string;
  icon: typeof Recycle;
  intro: string;
  materials: string[];
  steps: Step[];
  reward: string;
};

const crafts: Craft[] = [
  {
    id: "kompost",
    title: "Heißkompost in 18 Tagen",
    category: "Bodenleben",
    difficulty: "Einfach",
    duration: "18 Tage",
    icon: Recycle,
    intro:
      "Verwandle Küchen- und Gartenabfälle in lebendigen Humus – schneller als jede industrielle Anlage.",
    materials: [
      "Grünes Material (Rasenschnitt, Küchenabfälle)",
      "Braunes Material (Stroh, Laub, Pappe)",
      "Mistgabel oder Kompostwender",
      "Wasser",
      "Thermometer (optional)",
    ],
    steps: [
      {
        title: "Verhältnis vorbereiten",
        description: "Mische 1 Teil Grün (stickstoffreich) mit 2 Teilen Braun (kohlenstoffreich).",
        tip: "Die richtige Mischung riecht erdig, niemals faul.",
      },
      {
        title: "Schichten aufbauen",
        description:
          "Baue einen Haufen von mindestens 1 m³ in dünnen Schichten – wie Lasagne. Jede Schicht leicht befeuchten.",
        tip: "Unter 1 m³ erreicht der Haufen keine ausreichende Hitze.",
      },
      {
        title: "Tag 4: Erstes Wenden",
        description:
          "Der Haufen sollte jetzt 55–65 °C erreicht haben. Wende ihn komplett von außen nach innen.",
      },
      {
        title: "Tag 7, 10, 13: Weiter wenden",
        description:
          "Alle 3 Tage wenden. Bei jedem Wenden Feuchtigkeit prüfen – wie ein ausgedrückter Schwamm.",
      },
      {
        title: "Tag 18: Reife prüfen",
        description:
          "Der Kompost ist dunkel, krümelig, riecht nach Waldboden. Lass ihn 1 Woche abkühlen, dann ist er einsatzbereit.",
        tip: "Ein guter Kompost lebt – Regenwürmer sind ein perfektes Zeichen.",
      },
    ],
    reward: "Lebendige Erde – nährt deine Pflanzen ein Jahr lang.",
  },
  {
    id: "saatgut",
    title: "Saatgut für Generationen retten",
    category: "Pflanzenvielfalt",
    difficulty: "Mittel",
    duration: "1 Saison",
    icon: Wheat,
    intro:
      "Bewahre alte Sorten vor dem Aussterben. Eigenes Saatgut macht dich unabhängig und stärker.",
    materials: [
      "Reife, samenfeste Pflanzen (keine F1-Hybriden!)",
      "Sieb oder Schale",
      "Papiertüten oder Glasgefäße",
      "Beschriftungs-Etiketten",
      "Trockener, luftiger Ort",
    ],
    steps: [
      {
        title: "Mutterpflanzen auswählen",
        description:
          "Wähle die kräftigsten, geschmackvollsten Pflanzen aus – keine kranken oder schwächeren.",
        tip: "Lass mindestens 6 Pflanzen einer Sorte zur Samengewinnung stehen.",
      },
      {
        title: "Volle Reife abwarten",
        description:
          "Samen brauchen länger als die essbare Reife. Tomaten werden weich, Bohnen rasseln in der Hülse.",
      },
      {
        title: "Ernten und reinigen",
        description:
          "Trockene Samen (Bohnen, Salat): direkt ausschütteln. Feuchte Samen (Tomaten, Gurken): 3 Tage in Wasser fermentieren, dann waschen.",
        tip: "Fermentation tötet samenbürtige Krankheiten ab.",
      },
      {
        title: "Vollständig trocknen",
        description:
          "1–2 Wochen luftig trocknen, bis sie beim Knicken brechen statt biegen.",
      },
      {
        title: "Lagern und beschriften",
        description:
          "In Papiertüten oder Gläsern, dunkel und trocken. Sorte, Jahr und Herkunft notieren.",
        tip: "Bei 5 °C im Glas halten viele Samen 5–10 Jahre keimfähig.",
      },
    ],
    reward: "Ein eigenes Saatgut-Archiv – frei und unabhängig.",
  },
  {
    id: "korb",
    title: "Korb aus Weiden flechten",
    category: "Naturhandwerk",
    difficulty: "Fortgeschritten",
    duration: "4–6 Stunden",
    icon: Scissors,
    intro:
      "Eine uralte Technik mit nachwachsendem Material – nutzbar für Ernte, Lagerung und Geschenke.",
    materials: [
      "Frische Weidenruten (1–2 m, verschiedene Stärken)",
      "Eimer mit warmem Wasser",
      "Scharfe Gartenschere",
      "Ahle oder spitzer Stab",
      "Geduld",
    ],
    steps: [
      {
        title: "Weiden vorbereiten",
        description:
          "Ruten 24 Stunden in warmem Wasser einweichen, bis sie biegsam sind.",
        tip: "Geschnittene Weiden im Frühling vor dem Austrieb sind am besten.",
      },
      {
        title: "Boden anlegen",
        description:
          "8 dicke Ruten kreuzweise legen, mit feinen Ruten verflechten – über und unter abwechselnd.",
      },
      {
        title: "Speichen aufstellen",
        description:
          "Die dicken Ruten am Ende des Bodens nach oben biegen – das werden die Stützen der Wand.",
        tip: "Ungerade Anzahl an Speichen ist wichtig für das Wechselmuster.",
      },
      {
        title: "Wand flechten",
        description:
          "Mit feinen Weiden im Wechsel um die Speichen flechten. Reihe für Reihe nach oben arbeiten.",
      },
      {
        title: "Rand abschließen",
        description:
          "Speichen-Enden umbiegen, ineinander verflechten und einsticken. Überschuss abschneiden.",
        tip: "Trocknen lassen – der Korb wird fester, je trockener er wird.",
      },
    ],
    reward: "Ein Korb, der Generationen hält.",
  },
  {
    id: "fermentieren",
    title: "Sauerkraut fermentieren",
    category: "Konservierung",
    difficulty: "Einfach",
    duration: "3–6 Wochen",
    icon: FlaskConical,
    intro:
      "Wilde Mikroben verwandeln Kohl in lebendiges Probiotikum – ohne Energie, ohne Verlust.",
    materials: [
      "1 Weißkohl (ca. 1 kg)",
      "15 g Steinsalz (1,5%)",
      "Großes Glas oder Steinguttopf",
      "Beschwerung (kleines Glas, Stein)",
      "Sauberes Tuch",
    ],
    steps: [
      {
        title: "Kohl hobeln",
        description:
          "Äußere Blätter abnehmen (aufheben!). Kohl in feine Streifen hobeln.",
      },
      {
        title: "Mit Salz mischen",
        description:
          "Salz untermischen und 10 Minuten kräftig kneten, bis Saft austritt.",
        tip: "Genug Saft entsteht erst, wenn die Zellwände aufbrechen – nicht zu früh aufhören.",
      },
      {
        title: "Einschichten",
        description:
          "Schichtweise fest in das Gefäß drücken, bis der Saft alles bedeckt. Mit Außenblatt abdecken.",
      },
      {
        title: "Beschweren und abdecken",
        description:
          "Beschwerung darauflegen, sodass alles unter dem Saft bleibt. Mit Tuch zudecken.",
        tip: "Sauerstoff = Schimmel. Saftschicht = Schutz.",
      },
      {
        title: "Fermentieren lassen",
        description:
          "Bei 18–22 °C 3–6 Wochen reifen. Täglich kurz lüften, weißen Schaum abschöpfen.",
        tip: "Geschmackstest ab Tag 14 – wenn es schmeckt, kühl stellen.",
      },
    ],
    reward: "Lebendiges Sauerkraut – haltbar 6+ Monate, voller probiotischer Kulturen.",
  },
  {
    id: "stecklinge",
    title: "Pflanzen aus Stecklingen vermehren",
    category: "Pflanzenvielfalt",
    difficulty: "Einfach",
    duration: "2–4 Wochen",
    icon: Sprout,
    intro:
      "Vermehre deine Lieblingspflanzen kostenlos und genetisch identisch – mit nichts als Wasser und Geduld.",
    materials: [
      "Mutterpflanze (Tomate, Minze, Rosmarin, Geranie...)",
      "Scharfes, sauberes Messer",
      "Glas mit Wasser oder Anzuchterde",
      "Heller, warmer Standort (kein direktes Sonnenlicht)",
    ],
    steps: [
      {
        title: "Steckling schneiden",
        description:
          "10–15 cm langen, gesunden Trieb knapp unter einem Blattknoten schneiden.",
        tip: "Morgens schneiden – Pflanzen sind dann am stärksten gefüllt mit Saft.",
      },
      {
        title: "Untere Blätter entfernen",
        description:
          "Nur die oberen 2–3 Blätter behalten – sonst verdunstet der Steckling sich aus.",
      },
      {
        title: "In Wasser oder Erde stellen",
        description:
          "Wasser: Glas mit Knoten unter Wasser. Erde: Loch vorbohren, einsetzen, andrücken.",
      },
      {
        title: "Geduld haben",
        description:
          "1–4 Wochen warten. Wasser alle 3 Tage wechseln. Wurzeln werden sichtbar.",
        tip: "Sobald Wurzeln 3 cm lang sind, in Erde umpflanzen.",
      },
      {
        title: "Eingewöhnen",
        description:
          "Erste Woche schattig stellen, danach langsam an mehr Licht gewöhnen.",
      },
    ],
    reward: "Eine neue Pflanze – kostenlos, genetisch identisch.",
  },
  {
    id: "bienenwachstuch",
    title: "Bienenwachstuch herstellen",
    category: "Konservierung",
    difficulty: "Einfach",
    duration: "30 Minuten",
    icon: Hammer,
    intro:
      "Ersetze Plastikfolie durch wiederverwendbare, kompostierbare Tücher – ein Tuch hält ein Jahr.",
    materials: [
      "Bio-Baumwollstoff (gewaschen)",
      "Bienenwachs (geraspelt)",
      "Backpapier",
      "Backofen (80 °C)",
      "Pinsel",
    ],
    steps: [
      {
        title: "Stoff zuschneiden",
        description:
          "Quadrate in gewünschten Größen schneiden – z. B. 25×25 cm für Brot, 15×15 cm für Schalen.",
      },
      {
        title: "Wachs verteilen",
        description:
          "Stoff auf Backpapier legen, Wachs gleichmäßig dünn darüberstreuen.",
        tip: "Lieber zu wenig als zu viel – nachträglich ergänzen geht immer.",
      },
      {
        title: "Im Ofen schmelzen",
        description:
          "5–8 Minuten bei 80 °C, bis das Wachs vollständig geschmolzen ist.",
      },
      {
        title: "Verteilen und trocknen",
        description:
          "Mit Pinsel überschüssiges Wachs verteilen, dann sofort an einer Ecke nehmen und an der Luft trocknen.",
        tip: "Trocknet in 30 Sekunden – sofort einsatzbereit.",
      },
      {
        title: "Pflegen",
        description:
          "Mit kaltem Wasser abwaschen. Bei Verschleiß einfach erneut leicht im Ofen erwärmen.",
      },
    ],
    reward: "Plastikfreie Küche – ein Tuch spart 100+ Stück Frischhaltefolie.",
  },
];

const Craftsmanship = () => {
  const [selected, setSelected] = useState<Craft | null>(null);
  const [progress, setProgress] = useState<Record<string, Set<number>>>({});
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggleStep = (craftId: string, stepIndex: number) => {
    setProgress((prev) => {
      const next = { ...prev };
      const set = new Set(next[craftId] || []);
      if (set.has(stepIndex)) set.delete(stepIndex);
      else set.add(stepIndex);
      next[craftId] = set;
      return next;
    });
  };

  const finishCraft = (craft: Craft) => {
    if (completed.has(craft.id)) {
      toast(`${craft.title} bereits gemeistert`);
      return;
    }
    setCompleted((c) => new Set(c).add(craft.id));
    updateState((s) => ({ ...s, craftsCompleted: s.craftsCompleted + 1 }));
    toast.success("Handwerk gemeistert!", { description: craft.reward });
    setSelected(null);
  };

  const difficultyColor = (d: Craft["difficulty"]) =>
    d === "Einfach" ? "bg-primary/10 text-primary" : d === "Mittel" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive";

  const craftProgress = (craftId: string, total: number) => {
    const done = progress[craftId]?.size || 0;
    return Math.round((done / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container px-4 py-6 mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </Link>
          <Badge variant="secondary" className="gap-1">
            <Trophy className="w-3 h-3" />
            {completed.size} / {crafts.length} gemeistert
          </Badge>
        </div>

        {!selected ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-3 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Interaktives Handwerk</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Altes Wissen, lebendig
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Lerne traditionelle Bio-Techniken Schritt für Schritt – vom Kompost bis zum Bienenwachstuch.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {crafts.map((craft) => {
                const Icon = craft.icon;
                const isDone = completed.has(craft.id);
                const pct = craftProgress(craft.id, craft.steps.length);
                return (
                  <Card
                    key={craft.id}
                    onClick={() => setSelected(craft)}
                    className="p-5 cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-lg leading-tight">{craft.title}</h3>
                          {isDone && <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{craft.category}</p>
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <Badge variant="outline" className={`text-xs ${difficultyColor(craft.difficulty)}`}>
                            {craft.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs gap-1">
                            <Clock className="w-3 h-3" />
                            {craft.duration}
                          </Badge>
                        </div>
                        {pct > 0 && !isDone && (
                          <div>
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Fortschritt</span>
                              <span>{pct}%</span>
                            </div>
                            <Progress value={pct} className="h-1.5" />
                          </div>
                        )}
                        <div className="flex items-center text-sm text-primary mt-2 group-hover:gap-2 gap-1 transition-all">
                          <span className="font-medium">Handwerk lernen</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              onClick={() => setSelected(null)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Alle Handwerke
            </Button>

            <Card className="p-6 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <selected.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <Badge variant="outline" className="mb-2">{selected.category}</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{selected.title}</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={difficultyColor(selected.difficulty)}>{selected.difficulty}</Badge>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="w-3 h-3" />
                      {selected.duration}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{selected.intro}</p>
            </Card>

            <Card className="p-6 mb-6">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Hammer className="w-4 h-4 text-primary" />
                Was du brauchst
              </h3>
              <ul className="space-y-2">
                {selected.materials.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1">•</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <div className="space-y-3 mb-6">
              {selected.steps.map((step, i) => {
                const done = progress[selected.id]?.has(i);
                return (
                  <Card
                    key={i}
                    className={`p-5 cursor-pointer transition-all ${
                      done ? "bg-primary/5 border-primary/30" : "hover:border-primary/30"
                    }`}
                    onClick={() => toggleStep(selected.id, i)}
                  >
                    <div className="flex items-start gap-3">
                      <button className="mt-0.5 flex-shrink-0">
                        {done ? (
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        ) : (
                          <Circle className="w-6 h-6 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">Schritt {i + 1}</Badge>
                          <h4 className={`font-bold ${done ? "line-through text-muted-foreground" : ""}`}>
                            {step.title}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                        {step.tip && (
                          <div className="text-xs bg-accent/5 border border-accent/20 rounded-md p-2 text-foreground/80">
                            <span className="font-semibold text-accent">💡 Tipp: </span>
                            {step.tip}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <div className="flex items-start gap-3 mb-4">
                <Trophy className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold mb-1">Deine Belohnung</h4>
                  <p className="text-sm text-muted-foreground">{selected.reward}</p>
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
                disabled={(progress[selected.id]?.size || 0) < selected.steps.length}
                onClick={() => finishCraft(selected)}
              >
                {completed.has(selected.id)
                  ? "✓ Bereits gemeistert"
                  : (progress[selected.id]?.size || 0) < selected.steps.length
                  ? `Noch ${selected.steps.length - (progress[selected.id]?.size || 0)} Schritte`
                  : "Handwerk abschließen"}
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Craftsmanship;
