import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { achievements, rarityClass } from "@/lib/achievements";
import { useGameState } from "@/hooks/useGameState";

const Achievements = () => {
  const { state } = useGameState();
  const unlocked = state.achievements.length;
  const total = achievements.length;
  const pct = (unlocked / total) * 100;

  const categories = [
    { id: "farm" as const, label: "Farm" },
    { id: "market" as const, label: "Markt" },
    { id: "cross" as const, label: "Cross-Modul" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-500/5 via-background to-purple-500/5">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <Link to="/nexus">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Nexus
            </Button>
          </Link>
          <Badge variant="secondary" className="gap-1">
            <Trophy className="w-3 h-3" />
            {unlocked} / {total}
          </Badge>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-3 rounded-full bg-yellow-500/10 border border-yellow-500/30">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium">Halle der Erfolge</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-yellow-500 via-amber-500 to-purple-500 bg-clip-text text-transparent">
            Achievements
          </h1>
          <div className="max-w-md mx-auto">
            <Progress value={pct} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">{Math.round(pct)}% freigeschaltet</p>
          </div>
        </div>

        {categories.map((cat) => {
          const list = achievements.filter((a) => a.category === cat.id);
          return (
            <div key={cat.id} className="mb-8">
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                {cat.label}
                <Badge variant="outline" className="text-xs">
                  {list.filter((a) => state.achievements.includes(a.id)).length} / {list.length}
                </Badge>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {list.map((a) => {
                  const got = state.achievements.includes(a.id);
                  return (
                    <Card
                      key={a.id}
                      className={`relative overflow-hidden transition-all ${got ? "shadow-lg" : "opacity-70"}`}
                    >
                      {got && (
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${rarityClass[a.rarity]} opacity-10 pointer-events-none`}
                        />
                      )}
                      <CardContent className="p-4 flex gap-3 items-center relative">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${
                            got ? `bg-gradient-to-br ${rarityClass[a.rarity]}` : "bg-muted"
                          }`}
                        >
                          {got ? a.icon : <Lock className="w-5 h-5 text-muted-foreground" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm flex items-center gap-2">
                            {a.title}
                            <Badge variant="outline" className="text-[10px] capitalize py-0">
                              {a.rarity}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">{a.description}</div>
                          {a.reward && (
                            <div className="text-[10px] text-primary mt-0.5">+{a.reward} 💰</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
