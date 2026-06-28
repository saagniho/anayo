const KEY = "anayo:completed";

export function getCompleted(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function markComplete(slug: string): void {
  try {
    const done = getCompleted();
    if (!done.includes(slug)) {
      localStorage.setItem(KEY, JSON.stringify([...done, slug]));
    }
  } catch {}
}
