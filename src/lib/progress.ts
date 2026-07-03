import { useEffect, useState } from "react";

/**
 * Player profiles + progress, saved in localStorage under one key.
 * Multiple kids can share a browser; each gets their own name and progress.
 * The mutation core is pure (testable without a browser); a thin shell does
 * localStorage + change notification. Storage is only touched from event
 * handlers and effects, so static rendering/hydration never sees it.
 */

export type Player = {
  id: string;
  name: string;
  completed: string[];
  lastLesson?: string;
  updatedAt: string;
};

export type Save = { v: 1; activeId: string | null; players: Player[] };

const KEY = "anayo:save";
const LEGACY_KEY = "anayo:completed";

// ---------- pure core ----------

export function emptySave(): Save {
  return { v: 1, activeId: null, players: [] };
}

export function makePlayer(name: string, completed: string[] = []): Player {
  return {
    id: Math.random().toString(36).slice(2, 10),
    name: name.trim(),
    completed,
    updatedAt: new Date().toISOString(),
  };
}

export function activePlayer(save: Save): Player | undefined {
  return save.players.find((p) => p.id === save.activeId);
}

export function withPlayer(save: Save, player: Player): Save {
  return { ...save, activeId: player.id, players: [...save.players, player] };
}

export function withActive(save: Save, id: string): Save {
  return save.players.some((p) => p.id === id) ? { ...save, activeId: id } : save;
}

function updatePlayer(save: Save, id: string, patch: (p: Player) => Player): Save {
  return {
    ...save,
    players: save.players.map((p) =>
      p.id === id ? { ...patch(p), updatedAt: new Date().toISOString() } : p,
    ),
  };
}

export function withName(save: Save, id: string, name: string): Save {
  return updatePlayer(save, id, (p) => ({ ...p, name: name.trim() }));
}

/** Start from scratch: wipe progress, keep the player and their name. */
export function withReset(save: Save, id: string): Save {
  return updatePlayer(save, id, (p) => ({ ...p, completed: [], lastLesson: undefined }));
}

/**
 * Record a finished lesson on the active player. A kid who skipped the name
 * prompt gets a nameless player created on the spot — progress is never lost.
 */
export function withComplete(save: Save, slug: string): Save {
  let next = save;
  if (!activePlayer(next)) next = withPlayer(next, makePlayer(""));
  return updatePlayer(next, next.activeId!, (p) => ({
    ...p,
    completed: p.completed.includes(slug) ? p.completed : [...p.completed, slug],
    lastLesson: slug,
  }));
}

// ---------- storage shell ----------

let cache: Save | null = null;
const listeners = new Set<() => void>();

function load(): Save {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.v === 1 && Array.isArray(parsed.players)) {
        cache = parsed as Save;
        return cache;
      }
    }
    // one-time migration from the old single-track anayo:completed key
    const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) ?? "[]");
    if (Array.isArray(legacy) && legacy.length) {
      cache = withPlayer(emptySave(), makePlayer("", legacy));
      localStorage.setItem(KEY, JSON.stringify(cache));
      localStorage.removeItem(LEGACY_KEY);
      return cache;
    }
  } catch {}
  cache = emptySave();
  return cache;
}

function commit(next: Save): void {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((fn) => fn());
}

// ---------- public API ----------

export function getSave(): Save {
  return load();
}

export function getActivePlayer(): Player | undefined {
  return activePlayer(load());
}

export function getCompleted(): string[] {
  return getActivePlayer()?.completed ?? [];
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function createPlayer(name: string): string {
  const p = makePlayer(name);
  commit(withPlayer(load(), p));
  return p.id;
}

export function switchPlayer(id: string): void {
  commit(withActive(load(), id));
}

export function setName(id: string, name: string): void {
  commit(withName(load(), id, name));
}

export function resetPlayer(id: string): void {
  commit(withReset(load(), id));
}

export function markComplete(slug: string): void {
  commit(withComplete(load(), slug));
}

/** Hydration-safe view of the save. `hydrated` is false on the first render. */
export function usePlayer() {
  const [save, setSave] = useState<Save | null>(null);
  useEffect(() => {
    const sync = () => setSave(getSave());
    sync();
    return subscribe(sync);
  }, []);
  return {
    save,
    player: save ? activePlayer(save) : undefined,
    hydrated: save !== null,
  };
}
