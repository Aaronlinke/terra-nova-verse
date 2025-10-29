import { 
  BookOpen, 
  Heart, 
  Dna, 
  Leaf, 
  Glasses, 
  Compass, 
  Wrench, 
  Brain, 
  Beaker 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: BookOpen,
    title: "Dynamische Bio-Narrative",
    description: "Die Geschichte und die Umwelt entwickeln sich dynamisch basierend auf den Entscheidungen der Spieler."
  },
  {
    icon: Heart,
    title: "Emotionale Landwirtschaft",
    description: "Interaktion mit Pflanzen und Tieren auf emotionaler Ebene, die die Erträge beeinflusst."
  },
  {
    icon: Dna,
    title: "Genetische Manipulation",
    description: "Experimentieren mit genetischer Manipulation, um neue Pflanzen und Tiere zu erschaffen."
  },
  {
    icon: Leaf,
    title: "Simulierte Ökosysteme",
    description: "Jede Farm bildet ein kleines, lebendiges Ökosystem, das in Echtzeit reagiert."
  },
  {
    icon: Glasses,
    title: "Augmented Reality mit realen Auswirkungen",
    description: "Virtuelle Aktionen fördern reale Umweltprojekte."
  },
  {
    icon: Compass,
    title: "Virtueller Klima-Tourismus",
    description: "Virtuelle Reisen zu klimatisch unterschiedlichen Farmen zur Wissensvermittlung."
  },
  {
    icon: Wrench,
    title: "Interaktive Handwerkskunst",
    description: "Spieler entwerfen Werkzeuge, die ihre Effizienz in der Landwirtschaft beeinflussen."
  },
  {
    icon: Brain,
    title: "KI-gesteuerte Bio-Mentoren",
    description: "Individuelle Ratschläge zur Optimierung von Farmen durch KI-Technologie."
  },
  {
    icon: Beaker,
    title: "Kryptobotanik und Alchemie",
    description: "Erforschung mystischer Pflanzenkunde zur Schaffung einzigartiger Effekte."
  }
];

const Features = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Innovative Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Entdecken Sie die einzigartigen Möglichkeiten, die GaiaVerse zu einer revolutionären Plattform machen.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
