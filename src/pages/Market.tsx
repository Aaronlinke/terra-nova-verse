import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, TrendingUp, TrendingDown, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGameState } from "@/hooks/useGameState";
import { toast } from "@/hooks/use-toast";
import type { DecorId } from "@/lib/gameStore";

interface CropInfo {
  id: string;
  name: string;
  emoji: string;
  basePrice: number;
}

const crops: CropInfo[] = [
  { id: "carrot", name: "Karotte", emoji: "🥕", basePrice: 4 },
  { id: "tomato", name: "Tomate", emoji: "🍅", basePrice: 6 },
  { id: "wheat", name: "Weizen", emoji: "🌾", basePrice: 8 },
  { id: "corn", name: "Mais", emoji: "🌽", basePrice: 10 },
  { id: "pumpkin", name: "Kürbis", emoji: "🎃", basePrice: 18 },
  { id: "mystic", name: "Mystikblume", emoji: "🌸", basePrice: 45 },
];

interface DecorItem {
  id: DecorId;
  name: string;
  emoji: string;
  price: number;
  effect: string;
}

const decorItems: DecorItem[] = [
  { id: "scarecrow", name: "Vogelscheuche", emoji: "🎭", price: 80, effect: "−30% Schädlingsrate" },
  { id: "fountain", name: "Brunnen", emoji: "⛲", price: 150, effect: "+10% Wasserregeneration" },
  { id: "gnome", name: "Gartenzwerg", emoji: "🧙", price: 120, effect: "+5% Glück" },
  { id: "windmill", name: "Windmühle", emoji: "🌀", price: 250, effect: "+15% Wachstum" },
  { id: "rainbow", name: "Regenbogen", emoji: "🌈", price: 400, effect: "+1 XP pro Aktion" },
  { id: "shrine", name: "Gaia-Schrein", emoji: "⛩️", price: 800, effect: "Legendäre Aura" },
];

// Price fluctuation: ±30% based on time-of-day seed, refreshed every 60s
function usePrices() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  useEffect(() => {
    const compute = () => {
      const next: Record<string, number> = {};
      const seed = Math.floor(Date.now() / 60000); // changes every minute
      crops.forEach((c, i) => {
        const noise = Math.sin(seed * (i + 1) * 1.7) * 0.3; // -0.3..0.3
        next[c.id] = Math.max(1, Math.round(c.basePrice * (1 + noise)));
      });
      setPrices(next);
    };
    compute();
    const t = setInterval(compute, 5000);
    return () => clearInterval(t);
  }, []);
  return prices;
}

const Market = () => {
  const { state, update } = useGameState();
  const prices = usePrices();

  const sellOne = (cropId: string) => {
    const owned = state.inventory[cropId] ?? 0;
    if (owned < 1) return;
    const price = prices[cropId] ?? 0;
    update((s) => ({
      ...s,
      inventory: { ...s.inventory, [cropId]: (s.inventory[cropId] ?? 0) - 1 },
      coins: s.coins + price,
      totalEarned: s.totalEarned + price,
    }));
    toast({ title: `+${price} 💰`, description: `1× ${crops.find((c) => c.id === cropId)?.name} verkauft` });
  };

  const sellAll = (cropId: string) => {
    const owned = state.inventory[cropId] ?? 0;
    if (owned < 1) return;
    const price = prices[cropId] ?? 0;
    const total = owned * price;
    update((s) => ({
      ...s,
      inventory: { ...s.inventory, [cropId]: 0 },
      coins: s.coins + total,
      totalEarned: s.totalEarned + total,
    }));
    toast({ title: `+${total} 💰`, description: `${owned}× ${crops.find((c) => c.id === cropId)?.name} verkauft` });
  };

  const buyDecor = (item: DecorItem) => {
    if (state.decor.includes(item.id)) {
      toast({ title: "Bereits gekauft", variant: "destructive" });
      return;
    }
    if (state.coins < item.price) {
      toast({ title: "Zu wenig Münzen", description: `Du brauchst ${item.price} 💰`, variant: "destructive" });
      return;
    }
    update((s) => ({
      ...s,
      coins: s.coins - item.price,
      decor: [...s.decor, item.id],
    }));
    toast({ title: `${item.emoji} ${item.name} gekauft!`, description: item.effect });
  };

  const totalInventory = Object.values(state.inventory).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500/5 via-background to-emerald-500/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <Link to="/farm">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Farm
            </Button>
          </Link>
          <div className="flex gap-2 flex-wrap">
            <Card className="bg-card/80 backdrop-blur">
              <CardContent className="py-2 px-4">
                <div className="text-xs text-muted-foreground">Münzen</div>
                <div className="text-xl font-bold text-primary">{state.coins} 💰</div>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur">
              <CardContent className="py-2 px-4">
                <div className="text-xs text-muted-foreground">Verdient</div>
                <div className="text-xl font-bold text-accent">{state.totalEarned}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-3 rounded-full bg-amber-500/10 border border-amber-500/30">
            <ShoppingCart className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium">Bauernmarkt</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-amber-500 to-emerald-600 bg-clip-text text-transparent">
            Markt &amp; Bazar
          </h1>
          <p className="text-sm text-muted-foreground">
            Verkaufe deine Ernte zu schwankenden Preisen, kaufe Dekor für deine Farm.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Verkauf */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Verkaufen
                </span>
                <Badge variant="secondary">{totalInventory} im Lager</Badge>
              </CardTitle>
              <CardDescription>Preise schwanken alle 60 Sekunden. Verkauf zur richtigen Zeit!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {crops.map((c) => {
                const owned = state.inventory[c.id] ?? 0;
                const price = prices[c.id] ?? c.basePrice;
                const trend = price > c.basePrice ? "up" : price < c.basePrice ? "down" : "flat";
                return (
                  <div key={c.id} className={`p-3 rounded-lg border flex items-center gap-3 ${owned > 0 ? "bg-card" : "bg-muted/30 opacity-60"}`}>
                    <span className="text-3xl">{c.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{c.name}</div>
                      <div className="text-xs flex items-center gap-1">
                        <span className="font-mono">{price} 💰</span>
                        {trend === "up" && <TrendingUp className="w-3 h-3 text-green-500" />}
                        {trend === "down" && <TrendingDown className="w-3 h-3 text-destructive" />}
                        <span className="text-muted-foreground ml-1">· Lager: {owned}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" disabled={owned < 1} onClick={() => sellOne(c.id)}>
                        ×1
                      </Button>
                      <Button size="sm" disabled={owned < 1} onClick={() => sellAll(c.id)}>
                        Alle
                      </Button>
                    </div>
                  </div>
                );
              })}
              {totalInventory === 0 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  Noch nichts geerntet. Geh zur Farm und sammle deine Ernte ein!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Decor Shop */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Dekorationen
              </CardTitle>
              <CardDescription>Einmaliger Kauf · Permanente Boni für deine Farm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {decorItems.map((d) => {
                const owned = state.decor.includes(d.id);
                const canAfford = state.coins >= d.price;
                return (
                  <div key={d.id} className={`p-3 rounded-lg border flex items-center gap-3 ${owned ? "bg-primary/5 border-primary/30" : "bg-card"}`}>
                    <span className="text-3xl">{d.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm flex items-center gap-2">
                        {d.name}
                        {owned && <Check className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="text-xs text-muted-foreground">{d.effect}</div>
                      <div className="text-xs font-mono mt-0.5">{d.price} 💰</div>
                    </div>
                    <Button
                      size="sm"
                      disabled={owned || !canAfford}
                      variant={owned ? "secondary" : "default"}
                      onClick={() => buyDecor(d)}
                    >
                      {owned ? "Im Besitz" : canAfford ? "Kaufen" : "Zu teuer"}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Market;
