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
  private listeners: { [K in keyof GameEventMap]?: Set<Handler<K>> } = {};

  on<K extends keyof GameEventMap>(event: K, handler: Handler<K>): () => void {
    const set = (this.listeners[event] ??= new Set()) as Set<Handler<K>>;
    set.add(handler);
    return () => set.delete(handler);
  }

  emit<K extends keyof GameEventMap>(event: K, payload: GameEventMap[K]): void {
    const set = this.listeners[event] as Set<Handler<K>> | undefined;
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
