import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, Sprout, Heart, Globe, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Choice = {
  text: string;
  next: string;
  impact: { eco: number; community: number; yield: number };
};

type Scene = {
  id: string;
  title: string;
  text: string;
  choices?: Choice[];
  ending?: { title: string; description: string; type: "good" | "neutral" | "bad" };
};

type Story = {
  id: string;
  title: string;
  description: string;
  icon: typeof Sprout;
  scenes: Record<string, Scene>;
};

const stories: Story[] = [
  {
    id: "permakultur",
    title: "Das vergessene Tal",
    description: "Du erbst eine ausgelaugte Farm und musst sie wiederbeleben.",
    icon: Sprout,
    scenes: {
      start: {
        id: "start",
        title: "Die Ankunft",
        text: "Du stehst vor einem ausgetrockneten Feld. Der Boden ist hart, das Land erschöpft von jahrzehntelanger Monokultur. Wo fängst du an?",
        choices: [
          { text: "Boden mit Gründüngung beleben", next: "gruenduengung", impact: { eco: 20, community: 5, yield: -5 } },
          { text: "Sofort schnell wachsende Cash Crops anbauen", next: "cashcrop", impact: { eco: -15, community: 0, yield: 25 } },
          { text: "Nachbarn um Rat fragen", next: "nachbarn", impact: { eco: 5, community: 25, yield: 0 } },
        ],
      },
      gruenduengung: {
        id: "gruenduengung",
        title: "Geduld zahlt sich aus",
        text: "Du säst Klee, Lupinen und Phacelia. Nach Monaten der Geduld wird der Boden wieder krümelig und voller Leben. Die ersten Regenwürmer kehren zurück.",
        choices: [
          { text: "Mischkultur mit alten Sorten anlegen", next: "mischkultur", impact: { eco: 25, community: 10, yield: 15 } },
          { text: "Permakultur-Beete planen", next: "permakultur", impact: { eco: 30, community: 15, yield: 10 } },
        ],
      },
      cashcrop: {
        id: "cashcrop",
        title: "Kurzfristiger Gewinn",
        text: "Die erste Ernte bringt Geld – doch der Boden erodiert weiter. Im zweiten Jahr brechen die Erträge ein.",
        ending: { title: "Spirale der Erschöpfung", description: "Du hast kurzfristig gewonnen, aber das Land langfristig verloren.", type: "bad" },
      },
      nachbarn: {
        id: "nachbarn",
        title: "Gemeinschaft entsteht",
        text: "Die alteingesessenen Bauern teilen ihr Wissen. Eine alte Frau zeigt dir Saatgut, das ihre Großmutter gerettet hat.",
        choices: [
          { text: "Kooperative gründen", next: "kooperative", impact: { eco: 20, community: 30, yield: 15 } },
          { text: "Mischkultur mit alten Sorten anlegen", next: "mischkultur", impact: { eco: 25, community: 10, yield: 15 } },
        ],
      },
      mischkultur: {
        id: "mischkultur",
        title: "Vielfalt blüht",
        text: "Tomaten neben Basilikum, Mais mit Bohnen und Kürbis. Schädlinge halten sich in Schach, der Boden bleibt bedeckt.",
        ending: { title: "Lebendiges Mosaik", description: "Deine Farm wird zum Vorbild – Forscher und Schulen besuchen dich.", type: "good" },
      },
      permakultur: {
        id: "permakultur",
        title: "Das Tal erwacht",
        text: "Mit Hügelbeeten, Teichen und Waldgärten entsteht ein selbsterhaltendes System. Jede Pflanze hat ihren Platz.",
        ending: { title: "Lebendes Ökosystem", description: "Dein Tal ist heute ein UNESCO-Modellprojekt für regenerative Landwirtschaft.", type: "good" },
      },
      kooperative: {
        id: "kooperative",
        title: "Stärker zusammen",
        text: "Sieben Familien bündeln Land, Werkzeug und Wissen. Aus dem vergessenen Tal wird eine summende Gemeinschaft.",
        ending: { title: "Tal der Hoffnung", description: "Junge Menschen kehren zurück. Das Tal ernährt 200 Familien direkt.", type: "good" },
      },
    },
  },
  {
    id: "duerre",
    title: "Wenn der Regen ausbleibt",
    description: "Eine extreme Dürre bedroht deine Ernte. Wie reagierst du?",
    icon: Globe,
    scenes: {
      start: {
        id: "start",
        title: "Der dritte trockene Sommer",
        text: "Die Brunnen sinken, die Felder reißen auf. Deine Nachbarn bewässern Tag und Nacht – das Grundwasser fällt rapide.",
        choices: [
          { text: "Mit ihnen pumpen, bevor das Wasser weg ist", next: "pumpen", impact: { eco: -25, community: -10, yield: 20 } },
          { text: "Auf Trockenkulturen umstellen", next: "trocken", impact: { eco: 25, community: 5, yield: -5 } },
          { text: "Regenwasser-Sammelsystem bauen", next: "regenwasser", impact: { eco: 20, community: 15, yield: 5 } },
        ],
      },
      pumpen: {
        id: "pumpen",
        title: "Das Grundwasser bricht ein",
        text: "Innerhalb eines Sommers fallen alle Brunnen trocken. Streit zerreißt das Dorf.",
        ending: { title: "Verbrannte Erde", description: "Die Region wird zur Wüste. Viele Familien müssen wegziehen.", type: "bad" },
      },
      trocken: {
        id: "trocken",
        title: "Hirse, Kichererbsen, Feigen",
        text: "Du pflanzt Sorten, die mit wenig auskommen. Die Erträge sind kleiner – aber sicher.",
        choices: [
          { text: "Wissen mit dem Dorf teilen", next: "wissen_teilen", impact: { eco: 20, community: 30, yield: 10 } },
          { text: "Spezialmarkt für Dürre-Lebensmittel aufbauen", next: "markt", impact: { eco: 15, community: 10, yield: 25 } },
        ],
      },
      regenwasser: {
        id: "regenwasser",
        title: "Jeder Tropfen zählt",
        text: "Zisternen, Mulchschichten, Swales. Wenn der seltene Regen kommt, bleibt jeder Tropfen im Land.",
        ending: { title: "Oase der Resilienz", description: "Während andere Felder verdorren, bleibt deines grün – ein lebendes Beispiel.", type: "good" },
      },
      wissen_teilen: {
        id: "wissen_teilen",
        title: "Eine neue Landwirtschaft",
        text: "Workshops, Saatgut-Tausch, gemeinsames Lernen. Das Dorf stellt sich um.",
        ending: { title: "Pioniere der Trockenheit", description: "Eure Region wird Modell für Klimaanpassung weltweit.", type: "good" },
      },
      markt: {
        id: "markt",
        title: "Nische mit Zukunft",
        text: "Restaurants reißen sich um deine Hirse und Feigen. Der Hof floriert – aber allein.",
        ending: { title: "Erfolgreich, aber einsam", description: "Du verdienst gut, doch die Nachbarschaft bleibt verletzlich.", type: "neutral" },
      },
    },
  },
  {
    id: "biene",
    title: "Die letzten Bienen",
    description: "Die Bestäuber verschwinden. Du musst handeln.",
    icon: Heart,
    scenes: {
      start: {
        id: "start",
        title: "Stille im Frühling",
        text: "Die Apfelbäume blühen – aber kaum eine Biene summt. Deine Ernte hängt von ihnen ab.",
        choices: [
          { text: "Pestizide verbieten und Blühstreifen anlegen", next: "blueh", impact: { eco: 30, community: 15, yield: -5 } },
          { text: "Maschinelle Bestäubung kaufen", next: "maschine", impact: { eco: -10, community: -5, yield: 15 } },
          { text: "Imker-Kooperative gründen", next: "imker", impact: { eco: 25, community: 25, yield: 10 } },
        ],
      },
      blueh: {
        id: "blueh",
        title: "Das Summen kehrt zurück",
        text: "Innerhalb eines Jahres bevölkern Wildbienen, Hummeln und Schmetterlinge die Streifen. Auch Vögel kehren zurück.",
        ending: { title: "Blühende Landschaft", description: "Deine Erträge steigen wieder – und mit ihnen die Lebensqualität für alle.", type: "good" },
      },
      maschine: {
        id: "maschine",
        title: "Roboter statt Bienen",
        text: "Die Drohnen funktionieren – kosten aber ein Vermögen und ersetzen kein Ökosystem.",
        ending: { title: "Sterile Effizienz", description: "Du erntest, aber das Land stirbt langsam. Die Abhängigkeit von Technik wächst.", type: "bad" },
      },
      imker: {
        id: "imker",
        title: "Gemeinsame Stöcke",
        text: "Zwölf Höfe, zwanzig Bienenstöcke, ein Versprechen: keine Gifte mehr.",
        ending: { title: "Königinnen der Region", description: "Euer Honig wird zum Symbol – und die Bestäuber sichern alle Ernten.", type: "good" },
      },
    },
  },
];

const BioNarrative = () => {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [currentSceneId, setCurrentSceneId] = useState<string>("start");
  const [stats, setStats] = useState({ eco: 50, community: 50, yield: 50 });
  const [completed, setCompleted] = useState<Record<string, "good" | "neutral" | "bad">>({});

  const startStory = (story: Story) => {
    setActiveStory(story);
    setCurrentSceneId("start");
    setStats({ eco: 50, community: 50, yield: 50 });
  };

  const handleChoice = (choice: Choice) => {
    setStats((s) => ({
      eco: Math.max(0, Math.min(100, s.eco + choice.impact.eco)),
      community: Math.max(0, Math.min(100, s.community + choice.impact.community)),
      yield: Math.max(0, Math.min(100, s.yield + choice.impact.yield)),
    }));
    const parts: string[] = [];
    if (choice.impact.eco) parts.push(`Öko ${choice.impact.eco > 0 ? "+" : ""}${choice.impact.eco}`);
    if (choice.impact.community) parts.push(`Gemeinschaft ${choice.impact.community > 0 ? "+" : ""}${choice.impact.community}`);
    if (choice.impact.yield) parts.push(`Ertrag ${choice.impact.yield > 0 ? "+" : ""}${choice.impact.yield}`);
    if (parts.length) toast(parts.join(" · "));
    setCurrentSceneId(choice.next);
  };

  const finishStory = (type: "good" | "neutral" | "bad") => {
    if (!activeStory) return;
    setCompleted((c) => ({ ...c, [activeStory.id]: type }));
    setActiveStory(null);
  };

  const restart = () => {
    if (!activeStory) return;
    setCurrentSceneId("start");
    setStats({ eco: 50, community: 50, yield: 50 });
  };

  const currentScene = activeStory?.scenes[currentSceneId];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container px-4 py-8 mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              {Object.keys(completed).length} / {stories.length} Geschichten
            </span>
          </div>
        </div>

        {!activeStory ? (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Dynamische Bio-Narrative</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Geschichten, die du gestaltest
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Jede Entscheidung formt Boden, Gemeinschaft und Ernte. Welchen Weg gehst du?
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {stories.map((story) => {
                const Icon = story.icon;
                const result = completed[story.id];
                return (
                  <Card
                    key={story.id}
                    className="p-6 cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg group"
                    onClick={() => startStory(story)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      {result && (
                        <Badge variant={result === "good" ? "default" : result === "bad" ? "destructive" : "secondary"}>
                          {result === "good" ? "✓ Gemeistert" : result === "bad" ? "✗ Gescheitert" : "~ Neutral"}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                    <p className="text-sm text-muted-foreground">{story.description}</p>
                  </Card>
                );
              })}
            </div>
          </>
        ) : currentScene?.ending ? (
          <Card className="p-8 md:p-12">
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                  currentScene.ending.type === "good"
                    ? "bg-primary/20 text-primary"
                    : currentScene.ending.type === "bad"
                    ? "bg-destructive/20 text-destructive"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {currentScene.ending.type === "good" ? (
                  <Sparkles className="w-10 h-10" />
                ) : currentScene.ending.type === "bad" ? (
                  <RotateCcw className="w-10 h-10" />
                ) : (
                  <BookOpen className="w-10 h-10" />
                )}
              </div>
              <h2 className="text-3xl font-bold mb-3">{currentScene.ending.title}</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">{currentScene.ending.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.eco}</div>
                <div className="text-xs text-muted-foreground">Öko</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{stats.community}</div>
                <div className="text-xs text-muted-foreground">Gemeinschaft</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.yield}</div>
                <div className="text-xs text-muted-foreground">Ertrag</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={restart} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Nochmal versuchen
              </Button>
              <Button onClick={() => finishStory(currentScene.ending!.type)}>
                Zur Übersicht
              </Button>
            </div>
          </Card>
        ) : (
          currentScene && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Öko</span>
                      <span className="font-semibold text-primary">{stats.eco}</span>
                    </div>
                    <Progress value={stats.eco} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Gemeinschaft</span>
                      <span className="font-semibold text-accent">{stats.community}</span>
                    </div>
                    <Progress value={stats.community} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Ertrag</span>
                      <span className="font-semibold">{stats.yield}</span>
                    </div>
                    <Progress value={stats.yield} />
                  </div>
                </div>
              </Card>

              <Card className="p-8 md:p-10">
                <Badge variant="secondary" className="mb-4">
                  {activeStory.title}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{currentScene.title}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">{currentScene.text}</p>

                <div className="space-y-3">
                  {currentScene.choices?.map((choice, i) => (
                    <button
                      key={i}
                      onClick={() => handleChoice(choice)}
                      className="w-full text-left p-4 rounded-lg border bg-card hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{choice.text}</span>
                        <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              <div className="text-center">
                <Button variant="ghost" size="sm" onClick={() => setActiveStory(null)}>
                  Geschichte abbrechen
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BioNarrative;
