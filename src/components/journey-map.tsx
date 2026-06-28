"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { World } from "@/lib/lessons/types";
import { getCompleted } from "@/lib/progress";

const WORLD_ICONS: Record<string, string> = {
  "meet-ai":          "🧠",
  "how-ai-talks":     "💬",
  "talking-to-ai":    "🗣️",
  "ai-that-does-things": "🤖",
  "ai-that-codes":    "💻",
};

export function JourneyMap({ worlds }: { worlds: World[] }) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompleted(getCompleted());
  }, []);

  // Global lesson numbers
  let num = 0;
  const lessonNums = new Map<string, number>();
  for (const w of worlds) for (const l of w.lessons) lessonNums.set(l.id, ++num);

  // First live lesson that isn't done = "next"
  let nextSlug: string | null = null;
  outer: for (const w of worlds) {
    for (const l of w.lessons) {
      if (l.live && !completed.includes(l.slug)) {
        nextSlug = l.slug;
        break outer;
      }
    }
  }

  return (
    <div className="jmap">
      <div className="jmap-head">
        <h2>🗺️ Your Journey</h2>
        <p>Five worlds · {worlds.reduce((a, w) => a + w.lessons.length, 0)} lessons · one AI buddy levelling up with you</p>
      </div>

      <div className="jmap-worlds">
        {worlds.map((w, wi) => {
          const worldDone = w.lessons.every((l) => completed.includes(l.slug));
          const worldActive = !worldDone && w.lessons.some(
            (l) => completed.includes(l.slug) || l.slug === nextSlug,
          );

          return (
            <div key={w.id} className="jmap-world-wrap">
              {/* Connector from previous world */}
              {wi > 0 && (
                <div className="jmc">
                  <div className="jmc-line" />
                  <div className="jmc-arrowhead">▼</div>
                </div>
              )}

              <div className={`jmap-station${worldDone ? " wdone" : worldActive ? " wactive" : ""}`}>
                {/* World header */}
                <div className="jmap-station-hd">
                  <div className="jmap-icon" style={{ background: w.color }}>
                    {WORLD_ICONS[w.slug] ?? w.emoji}
                  </div>
                  <div>
                    <div className="jmap-wtitle">{w.title}</div>
                    <div className="jmap-wtag">{w.tagline}</div>
                  </div>
                  {worldDone && <span className="jmap-wbadge done">✓ Complete</span>}
                  {!worldDone && !worldActive && wi > 0 && (
                    <span className="jmap-wbadge locked">🔒 Locked</span>
                  )}
                </div>

                {/* Lesson nodes */}
                <div className="jmap-lessons">
                  {w.lessons.map((l, li) => {
                    const isDone = completed.includes(l.slug);
                    const isNext = l.slug === nextSlug;
                    const n = lessonNums.get(l.id)!;
                    const cls = `jml${isDone ? " jml-done" : isNext ? " jml-next" : !l.live ? " jml-future" : ""}`;

                    const inner = (
                      <>
                        <div
                          className="jml-node"
                          style={isNext ? { borderColor: w.color, boxShadow: `0 0 18px ${w.color}88` } : undefined}
                        >
                          <span className="jml-ability">{l.ability.icon}</span>
                          {isDone && <span className="jml-check">✓</span>}
                          {isNext && (
                            <span className="jml-pulse" style={{ background: w.color }} />
                          )}
                        </div>
                        <span className="jml-num">{isDone ? "" : n}</span>
                        <span className="jml-name">{l.title}</span>
                        {isNext && <span className="jml-nextlabel">▶ Next</span>}
                      </>
                    );

                    return (
                      <div key={l.id} className="jml-outer">
                        {li > 0 && <span className="jml-sep" aria-hidden>→</span>}
                        {l.live
                          ? <Link href={`/learn/${w.slug}/${l.slug}`} className={cls}>{inner}</Link>
                          : <div className={cls}>{inner}</div>
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Finish line */}
        <div className="jmc">
          <div className="jmc-line" />
          <div className="jmc-finish">🎓 Graduation</div>
        </div>
      </div>

      <p className="footnote">🛠️ Lessons are being built — you&apos;re watching it happen live.</p>
    </div>
  );
}
