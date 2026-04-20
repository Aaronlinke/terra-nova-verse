import type { GameState } from "./gameStore";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "farm" | "market" | "cross";
  rarity: "bronze" | "silver" | "gold" | "legendary";
  check: (s: GameState) => boolean;
  reward?: number; // coins
}

export const achievements: Achievement[] = [
  // FARM
  { id: "first_harvest", title: "Erste Ernte", description: "Ernte deine erste Pflanze", icon: "🌱", category: "farm", rarity: "bronze", check: (s) => s.harvested >= 1, reward: 10 },
  { id: "harvest_50", title: "Erntehelfer", description: "Ernte 50 Pflanzen", icon: "🌾", category: "farm", rarity: "silver", check: (s) => s.harvested >= 50, reward: 50 },
  { id: "harvest_200", title: "Erntemeister", description: "Ernte 200 Pflanzen", icon: "🚜", category: "farm", rarity: "gold", check: (s) => s.harvested >= 200, reward: 200 },
  { id: "level_5", title: "Aufsteiger", description: "Erreiche Level 5", icon: "⭐", category: "farm", rarity: "silver", check: (s) => s.level >= 5, reward: 50 },
  { id: "level_10", title: "Erfahrener Bauer", description: "Erreiche Level 10", icon: "🌟", category: "farm", rarity: "gold", check: (s) => s.level >= 10, reward: 150 },
  { id: "pest_hunter", title: "Schädlingsjäger", description: "Entferne 20 Schädlinge", icon: "🐛", category: "farm", rarity: "silver", check: (s) => s.pestsRemoved >= 20, reward: 60 },
  { id: "quest_master", title: "Questenjäger", description: "Schließe 10 Quests ab", icon: "🎯", category: "farm", rarity: "silver", check: (s) => s.questsDone >= 10, reward: 80 },

  // MARKET
  { id: "first_sale", title: "Erste Münze verdient", description: "Verkaufe deine erste Ernte", icon: "💰", category: "market", rarity: "bronze", check: (s) => s.totalEarned >= 1, reward: 10 },
  { id: "earned_500", title: "Händler", description: "Verdiene insgesamt 500 Münzen", icon: "💵", category: "market", rarity: "silver", check: (s) => s.totalEarned >= 500, reward: 50 },
  { id: "earned_5000", title: "Markt-Tycoon", description: "Verdiene insgesamt 5000 Münzen", icon: "🏆", category: "market", rarity: "gold", check: (s) => s.totalEarned >= 5000, reward: 300 },
  { id: "first_decor", title: "Dekorateur", description: "Kaufe deine erste Dekoration", icon: "🎨", category: "market", rarity: "bronze", check: (s) => s.decor.length >= 1, reward: 20 },
  { id: "decor_collector", title: "Sammler", description: "Besitze 3 Dekorationen", icon: "🏛️", category: "market", rarity: "silver", check: (s) => s.decor.length >= 3, reward: 80 },
  { id: "decor_complete", title: "Designer-Farm", description: "Besitze alle Dekorationen", icon: "👑", category: "market", rarity: "legendary", check: (s) => s.decor.length >= 6, reward: 500 },

  // CROSS-FEATURE
  { id: "first_scan", title: "Forscher", description: "Scanne deine erste Pflanze (AR)", icon: "🔍", category: "cross", rarity: "bronze", check: (s) => s.arScans >= 1, reward: 15 },
  { id: "first_craft", title: "Handwerker", description: "Schließe dein erstes Craft ab", icon: "🛠️", category: "cross", rarity: "bronze", check: (s) => s.craftsCompleted >= 1, reward: 15 },
  { id: "first_essence", title: "Alchemist", description: "Braue deine erste Essenz", icon: "🧪", category: "cross", rarity: "bronze", check: (s) => s.essencesBrewed >= 1, reward: 15 },
  { id: "polymath", title: "Polymath", description: "Berühre mind. 1× jedes Modul (Scan, Craft, Essenz, Ernte)", icon: "🌀", category: "cross", rarity: "gold", check: (s) => s.arScans >= 1 && s.craftsCompleted >= 1 && s.essencesBrewed >= 1 && s.harvested >= 1, reward: 200 },
  { id: "scan_10", title: "Bio-Detektiv", description: "Scanne 10 Pflanzen", icon: "📡", category: "cross", rarity: "silver", check: (s) => s.arScans >= 10, reward: 70 },
  { id: "essence_5", title: "Kreis der 5", description: "Braue 5 Essenzen", icon: "🌙", category: "cross", rarity: "silver", check: (s) => s.essencesBrewed >= 5, reward: 70 },
  { id: "gaia_master", title: "Gaia-Meister", description: "Schalte 15 andere Achievements frei", icon: "🌍", category: "cross", rarity: "legendary", check: (s) => s.achievements.length >= 15, reward: 1000 },
];

export const rarityClass: Record<Achievement["rarity"], string> = {
  bronze: "from-amber-700 to-amber-900",
  silver: "from-slate-400 to-slate-600",
  gold: "from-yellow-400 to-amber-600",
  legendary: "from-purple-500 via-pink-500 to-amber-500",
};
