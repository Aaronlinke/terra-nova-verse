import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { ArrowLeft, Globe, Thermometer, Droplets, Sun, Wind, Leaf, MapPin, Info } from "lucide-react";

interface ClimateZone {
  id: string;
  name: string;
  icon: string;
  temperature: { min: number; max: number; unit: string };
  rainfall: { amount: number; unit: string };
  humidity: number;
  sunHours: number;
  description: string;
  crops: string[];
  challenges: string[];
  tips: string[];
  color: string;
}

const climateZones: ClimateZone[] = [
  {
    id: "tropical",
    name: "Tropische Zone",
    icon: "🌴",
    temperature: { min: 24, max: 32, unit: "°C" },
    rainfall: { amount: 2000, unit: "mm/Jahr" },
    humidity: 85,
    sunHours: 6,
    description: "Heiß und feucht das ganze Jahr. Ideale Bedingungen für schnelles Pflanzenwachstum, aber auch für Schädlinge und Krankheiten.",
    crops: ["Bananen", "Kakao", "Kaffee", "Reis", "Maniok", "Zuckerrohr"],
    challenges: ["Starke Regenfälle", "Bodenerosion", "Pilzkrankheiten", "Hoher Schädlingsdruck"],
    tips: ["Mulchen gegen Erosion", "Mischkulturen anlegen", "Natürliche Schädlingsbekämpfung", "Drainage-Systeme nutzen"],
    color: "from-green-500 to-emerald-600"
  },
  {
    id: "desert",
    name: "Wüstenklima",
    icon: "🏜️",
    temperature: { min: 10, max: 45, unit: "°C" },
    rainfall: { amount: 100, unit: "mm/Jahr" },
    humidity: 20,
    sunHours: 12,
    description: "Extreme Temperaturschwankungen und minimaler Niederschlag. Landwirtschaft nur mit Bewässerung möglich.",
    crops: ["Datteln", "Oliven", "Feigen", "Granatäpfel", "Aloe Vera"],
    challenges: ["Wassermangel", "Extreme Hitze", "Sandstürme", "Versalzung des Bodens"],
    tips: ["Tröpfchenbewässerung", "Nachtbewässerung", "Schattennetze", "Salztolerante Sorten wählen"],
    color: "from-amber-500 to-orange-600"
  },
  {
    id: "temperate",
    name: "Gemäßigte Zone",
    icon: "🌳",
    temperature: { min: -5, max: 25, unit: "°C" },
    rainfall: { amount: 800, unit: "mm/Jahr" },
    humidity: 65,
    sunHours: 8,
    description: "Vier ausgeprägte Jahreszeiten mit milden Sommern und kalten Wintern. Vielfältige Anbaumöglichkeiten.",
    crops: ["Weizen", "Kartoffeln", "Äpfel", "Kirschen", "Kohl", "Karotten"],
    challenges: ["Frost im Frühjahr", "Trockenperioden im Sommer", "Hagel", "Kurze Vegetationsperiode"],
    tips: ["Fruchtfolge einhalten", "Winterharte Sorten", "Folientunnel nutzen", "Kompostierung"],
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: "mediterranean",
    name: "Mediterranes Klima",
    icon: "🫒",
    temperature: { min: 8, max: 35, unit: "°C" },
    rainfall: { amount: 500, unit: "mm/Jahr" },
    humidity: 55,
    sunHours: 10,
    description: "Warme, trockene Sommer und milde, feuchte Winter. Ideal für Obst, Gemüse und Wein.",
    crops: ["Oliven", "Weintrauben", "Tomaten", "Zitrusfrüchte", "Mandeln", "Lavendel"],
    challenges: ["Sommerdürre", "Waldbrände", "Wasserknappheit", "Hitzeperioden"],
    tips: ["Wassersparende Techniken", "Mulchen im Sommer", "Morgendliche Bewässerung", "Terrassenbau"],
    color: "from-yellow-500 to-amber-600"
  },
  {
    id: "arctic",
    name: "Arktisches Klima",
    icon: "❄️",
    temperature: { min: -30, max: 10, unit: "°C" },
    rainfall: { amount: 300, unit: "mm/Jahr" },
    humidity: 75,
    sunHours: 4,
    description: "Extreme Kälte und kurze Sommer. Permafrost erschwert den Anbau, aber Gewächshäuser ermöglichen lokale Produktion.",
    crops: ["Kartoffeln", "Kohl", "Beeren", "Kräuter", "Pilze"],
    challenges: ["Permafrost", "Kurze Wachstumsperiode", "Extreme Kälte", "Wenig Sonnenlicht"],
    tips: ["Gewächshäuser nutzen", "LED-Beleuchtung", "Hydroponik", "Kälteresistente Sorten"],
    color: "from-slate-400 to-blue-500"
  },
  {
    id: "monsoon",
    name: "Monsunklima",
    icon: "🌧️",
    temperature: { min: 20, max: 38, unit: "°C" },
    rainfall: { amount: 3000, unit: "mm/Jahr" },
    humidity: 90,
    sunHours: 5,
    description: "Ausgeprägte Regen- und Trockenzeiten. Die Regenzeit bringt intensive Niederschläge.",
    crops: ["Reis", "Tee", "Jute", "Gewürze", "Zuckerrohr", "Baumwolle"],
    challenges: ["Überschwemmungen", "Dürre in Trockenzeit", "Erosion", "Schimmel"],
    tips: ["Reisterrassen anlegen", "Regenwasser sammeln", "Schnell wachsende Sorten", "Hochbeete"],
    color: "from-teal-500 to-emerald-600"
  }
];

const ClimateTourism = () => {
  const [selectedZone, setSelectedZone] = useState<ClimateZone | null>(null);
  const [visitedZones, setVisitedZones] = useState<string[]>([]);
  const [knowledgePoints, setKnowledgePoints] = useState(0);

  const visitZone = (zone: ClimateZone) => {
    setSelectedZone(zone);
    if (!visitedZones.includes(zone.id)) {
      setVisitedZones([...visitedZones, zone.id]);
      setKnowledgePoints(prev => prev + 25);
    }
  };

  const explorationProgress = (visitedZones.length / climateZones.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Globe className="w-5 h-5 mr-2" />
              {knowledgePoints} Wissenspunkte
            </Badge>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">🌍 Virtueller Klima-Tourismus</h1>
          <p className="text-muted-foreground text-lg">
            Erkunde verschiedene Klimazonen und lerne deren Einfluss auf die Landwirtschaft
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Erkundungsfortschritt</span>
              <span className="text-sm text-muted-foreground">
                {visitedZones.length} / {climateZones.length} Zonen besucht
              </span>
            </div>
            <Progress value={explorationProgress} className="h-3" />
          </CardContent>
        </Card>

        {/* Climate Zones Grid */}
        {!selectedZone ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {climateZones.map((zone) => (
              <Card 
                key={zone.id}
                className={`cursor-pointer transition-all hover:scale-105 hover:shadow-xl ${
                  visitedZones.includes(zone.id) ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => visitZone(zone)}
              >
                <CardHeader className={`bg-gradient-to-r ${zone.color} text-white rounded-t-lg`}>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-4xl">{zone.icon}</span>
                    <div>
                      <div className="text-xl">{zone.name}</div>
                      {visitedZones.includes(zone.id) && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          ✓ Besucht
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-red-500" />
                      <span>{zone.temperature.min}-{zone.temperature.max}{zone.temperature.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span>{zone.rainfall.amount} {zone.rainfall.unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-gray-500" />
                      <span>{zone.humidity}% Feuchte</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-yellow-500" />
                      <span>{zone.sunHours}h Sonne/Tag</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Erkunden
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Detailed Zone View */
          <div className="space-y-6">
            <Button variant="outline" onClick={() => setSelectedZone(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Alle Zonen anzeigen
            </Button>

            <Card className="overflow-hidden">
              <CardHeader className={`bg-gradient-to-r ${selectedZone.color} text-white`}>
                <CardTitle className="flex items-center gap-4 text-2xl">
                  <span className="text-5xl">{selectedZone.icon}</span>
                  {selectedZone.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Climate Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Thermometer className="w-8 h-8 mx-auto text-red-500 mb-2" />
                    <div className="font-bold">{selectedZone.temperature.min} - {selectedZone.temperature.max}{selectedZone.temperature.unit}</div>
                    <div className="text-sm text-muted-foreground">Temperatur</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Droplets className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                    <div className="font-bold">{selectedZone.rainfall.amount} {selectedZone.rainfall.unit}</div>
                    <div className="text-sm text-muted-foreground">Niederschlag</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Wind className="w-8 h-8 mx-auto text-gray-500 mb-2" />
                    <div className="font-bold">{selectedZone.humidity}%</div>
                    <div className="text-sm text-muted-foreground">Luftfeuchtigkeit</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Sun className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                    <div className="font-bold">{selectedZone.sunHours}h/Tag</div>
                    <div className="text-sm text-muted-foreground">Sonnenstunden</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-muted-foreground">{selectedZone.description}</p>
                  </div>
                </div>

                {/* Crops */}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    Typische Kulturpflanzen
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedZone.crops.map((crop, index) => (
                      <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                        {crop}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Challenges & Tips Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3 text-red-600">⚠️ Herausforderungen</h3>
                    <ul className="space-y-2">
                      {selectedZone.challenges.map((challenge, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <span className="w-2 h-2 bg-red-500 rounded-full" />
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-3 text-green-600">💡 Profi-Tipps</h3>
                    <ul className="space-y-2">
                      {selectedZone.tips.map((tip, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Achievement Banner */}
        {visitedZones.length === climateZones.length && (
          <Card className="mt-8 bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
            <CardContent className="py-6 text-center">
              <div className="text-4xl mb-2">🏆</div>
              <h3 className="text-2xl font-bold">Weltreisender!</h3>
              <p>Du hast alle Klimazonen erkundet und bist jetzt ein Experte für globale Landwirtschaft!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ClimateTourism;
