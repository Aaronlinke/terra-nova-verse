import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Bot, Send, Lightbulb, AlertTriangle, TrendingUp, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface Tip {
  id: number;
  category: "warning" | "tip" | "insight";
  title: string;
  description: string;
  icon: typeof AlertTriangle;
}

const AIBioMentor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Willkommen beim KI-Bio-Mentor! Ich bin dein persönlicher Berater für nachhaltige Landwirtschaft. Wie kann ich dir heute helfen?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const tips: Tip[] = [
    {
      id: 1,
      category: "warning",
      title: "Wassermangel erkannt",
      description: "Deine Tomaten zeigen Anzeichen von Trockenstress. Erhöhe die Bewässerung um 20%.",
      icon: AlertTriangle,
    },
    {
      id: 2,
      category: "tip",
      title: "Optimale Pflanzzeit",
      description: "Die nächsten 3 Tage sind ideal für die Aussaat von Winterweizen.",
      icon: Lightbulb,
    },
    {
      id: 3,
      category: "insight",
      title: "Ertragsanalyse",
      description: "Dein Karottenertrag liegt 15% über dem Durchschnitt. Gute Arbeit!",
      icon: TrendingUp,
    },
    {
      id: 4,
      category: "tip",
      title: "Biodiversität",
      description: "Pflanze Wildblumen zwischen den Reihen für bessere Bestäubung.",
      icon: Leaf,
    },
  ];

  const botResponses: Record<string, string[]> = {
    wasser: [
      "Für optimale Bewässerung empfehle ich früh morgens oder spät abends zu gießen, um Verdunstung zu minimieren.",
      "Tropfbewässerung spart bis zu 50% Wasser im Vergleich zu herkömmlichen Methoden.",
      "Mulchen hilft, die Feuchtigkeit im Boden zu halten und reduziert den Wasserbedarf.",
    ],
    schädling: [
      "Marienkäfer sind natürliche Feinde von Blattläusen. Fördere ihre Ansiedlung!",
      "Neem-Öl ist ein biologisches Mittel gegen viele Schädlinge.",
      "Mischkultur verwirrt Schädlinge und reduziert Befall natürlich.",
    ],
    dünger: [
      "Kompost ist der beste natürliche Dünger und verbessert die Bodenstruktur.",
      "Gründüngung mit Leguminosen bindet Stickstoff aus der Luft.",
      "Brennnesseljauche ist ein hervorragender biologischer Flüssigdünger.",
    ],
    ernte: [
      "Ernte am besten morgens, wenn die Pflanzen noch kühl sind.",
      "Regelmäßiges Ernten fördert bei vielen Pflanzen weiteres Wachstum.",
      "Achte auf die Reifezeichen: Farbe, Festigkeit und Größe sind wichtige Indikatoren.",
    ],
    default: [
      "Das ist eine interessante Frage! Bio-Landwirtschaft basiert auf dem Prinzip des Kreislaufs.",
      "Ich empfehle, die natürlichen Prozesse zu beobachten und mit ihnen zu arbeiten.",
      "Geduld ist der Schlüssel zum Erfolg in der nachhaltigen Landwirtschaft.",
      "Experimentiere mit kleinen Testflächen, bevor du große Änderungen vornimmst.",
    ],
  };

  const getResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes("wasser") || lowerInput.includes("gieß")) {
      return botResponses.wasser[Math.floor(Math.random() * botResponses.wasser.length)];
    }
    if (lowerInput.includes("schädling") || lowerInput.includes("insekt") || lowerInput.includes("käfer")) {
      return botResponses.schädling[Math.floor(Math.random() * botResponses.schädling.length)];
    }
    if (lowerInput.includes("dünger") || lowerInput.includes("nähr") || lowerInput.includes("boden")) {
      return botResponses.dünger[Math.floor(Math.random() * botResponses.dünger.length)];
    }
    if (lowerInput.includes("ernte") || lowerInput.includes("pflück") || lowerInput.includes("reif")) {
      return botResponses.ernte[Math.floor(Math.random() * botResponses.ernte.length)];
    }
    
    return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: getResponse(input),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const getCategoryStyles = (category: Tip["category"]) => {
    switch (category) {
      case "warning":
        return "bg-amber-500/20 border-amber-500/50 text-amber-200";
      case "tip":
        return "bg-emerald-500/20 border-emerald-500/50 text-emerald-200";
      case "insight":
        return "bg-sky-500/20 border-sky-500/50 text-sky-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="icon" className="border-emerald-500/50 hover:bg-emerald-500/20">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 animate-pulse">
              <Bot className="h-8 w-8 text-slate-900" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">KI-Bio-Mentor</h1>
              <p className="text-emerald-300">Dein intelligenter Berater für nachhaltige Landwirtschaft</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-emerald-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-emerald-300">Chat mit dem Mentor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          message.isBot
                            ? "bg-emerald-600/30 text-emerald-100 rounded-bl-none"
                            : "bg-cyan-600/30 text-cyan-100 rounded-br-none"
                        }`}
                      >
                        {message.isBot && (
                          <Bot className="h-4 w-4 mb-2 text-emerald-400" />
                        )}
                        <p>{message.text}</p>
                        <span className="text-xs opacity-50 mt-2 block">
                          {message.timestamp.toLocaleTimeString("de-DE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-emerald-600/30 text-emerald-100 p-4 rounded-2xl rounded-bl-none">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Stelle eine Frage über Bio-Landwirtschaft..."
                  className="bg-slate-700/50 border-emerald-500/30 text-white placeholder:text-slate-400"
                />
                <Button
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Wassertipps", "Schädlinge", "Dünger", "Ernte"].map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInput(`Gib mir Tipps zu ${topic}`);
                    }}
                    className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <Card className="bg-slate-800/50 border-emerald-500/30 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-emerald-300">Aktuelle Empfehlungen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tips.map((tip) => {
                  const Icon = tip.icon;
                  return (
                    <div
                      key={tip.id}
                      className={`p-4 rounded-xl border ${getCategoryStyles(tip.category)} transition-all hover:scale-[1.02]`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold">{tip.title}</h3>
                          <p className="text-sm opacity-80 mt-1">{tip.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIBioMentor;
