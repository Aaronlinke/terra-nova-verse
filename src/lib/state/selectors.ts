// Pure selectors. Use with useStoreSelector to avoid unnecessary re-renders.

import type { RootState } from "./types";

export const selectPlayer = (r: RootState) => r.player;
export const selectFarm = (r: RootState) => r.farm;
export const selectMeta = (r: RootState) => r.meta;

export const selectCoins = (r: RootState) => r.player.coins;
export const selectLevel = (r: RootState) => r.player.level;
export const selectXp = (r: RootState) => r.player.xp;
export const selectInventory = (r: RootState) => r.farm.inventory;
export const selectAchievements = (r: RootState) => r.meta.achievements;
