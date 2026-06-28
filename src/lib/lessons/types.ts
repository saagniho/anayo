import type { Mode } from "@/lib/mode/mode-context";

/**
 * The curriculum is data, not code. A registry exposes these shapes so the
 * lesson player can render any lesson, and adding a lesson is just adding data.
 */

export type Ability = {
  id: string;
  label: string;
  icon: string;
};

export type LessonMeta = {
  id: string;
  slug: string;
  title: string;
  /** The real AI concept this lesson teaches, in plain words. */
  concept: string;
  /** One-line hook shown on cards and at the start of the lesson. */
  hook: string;
  ability: Ability;
  /** Plain-language "aha" reveal, written for each audience mode. */
  aha?: { explorer: string; curious: string };
  /** true once the interactive lesson is actually built and playable. */
  live: boolean;
};

export type World = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  emoji: string;
  /** accent colour used for this world's nodes/cards */
  color: string;
  order: number;
  lessons: LessonMeta[];
};

/** The shared contract every interactive lesson "toy" implements. */
export type ToyProps = {
  mode: Mode;
  onComplete: () => void;
  onProgress?: (pct: number) => void;
};
