// Lightweight typed event bus. Decouples modules from each other.
// Usage:
//   gameEvents.on("harvest", (p) => ...)
//   gameEvents.emit("harvest", { plant: "wheat", amount: 1 })

export type GameEventMap = {
  harvest: { plant: string; amount: number };
  levelUp: { from: number; to: number };
  craft: { craftId: string };
  scan: { plantId: string; firstTime: boolean };
  brew: { essenceId: string };
  sell: { plant: string; amount: number; coins: number };
  buyDecor: { decorId: string; cost: number };
  questDone: { questId: string };
};

type Handler<K extends keyof GameEventMap> = (payload: GameEventMap[K]) => void;

class EventBus {
  private listeners: Map<keyof GameEventMap, Set<Handler<keyof GameEventMap>>> = new Map();

  on<K extends keyof GameEventMap>(event: K, handler: Handler<K>): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(handler as Handler<keyof GameEventMap>);
    return () => set!.delete(handler as Handler<keyof GameEventMap>);
  }

  emit<K extends keyof GameEventMap>(event: K, payload: GameEventMap[K]): void {
    const set = this.listeners.get(event) as Set<Handler<K>> | undefined;
    if (!set) return;
    set.forEach((h) => {
      try {
        h(payload);
      } catch (err) {
        console.error(`[gameEvents] handler for "${String(event)}" threw`, err);
      }
    });
  }
}

export const gameEvents = new EventBus();
