"use client";

import { useState } from "react";
import type { ToyProps } from "@/lib/lessons/types";

const WORDS = ["The", "robot", "fixed", "the", "car", "because", "it", "was", "broken"];
const IT_IDX = 6; // "it" — the pivot word

// Pre-baked attention weights [from][to] — designed to show clear, meaningful patterns
const ATTENTION: number[][] = [
//    The  robot  fixed   the   car  because   it   was  broken
  [1.00, 0.30,  0.20,  0.50, 0.15,  0.10,  0.10, 0.10, 0.10], // The
  [0.20, 1.00,  0.80,  0.10, 0.40,  0.10,  0.25, 0.10, 0.20], // robot
  [0.15, 0.90,  1.00,  0.10, 0.85,  0.20,  0.20, 0.10, 0.15], // fixed
  [0.50, 0.20,  0.10,  1.00, 0.60,  0.10,  0.10, 0.10, 0.10], // the
  [0.20, 0.30,  0.70,  0.30, 1.00,  0.20,  0.60, 0.20, 0.75], // car
  [0.10, 0.20,  0.30,  0.10, 0.30,  1.00,  0.40, 0.20, 0.30], // because
  [0.05, 0.20,  0.20,  0.05, 0.90,  0.15,  1.00, 0.40, 0.75], // it → car + broken 🎯
  [0.10, 0.20,  0.20,  0.10, 0.40,  0.10,  0.50, 1.00, 0.70], // was
  [0.10, 0.20,  0.20,  0.10, 0.80,  0.10,  0.70, 0.50, 1.00], // broken
];

const INSIGHTS: Partial<Record<number, string>> = {
  1: '"robot" looks hard at "fixed" — it\'s the one doing the fixing.',
  2: '"fixed" attends to "robot" (who did it?) and "car" (what was fixed?) — the core action.',
  4: '"car" connects to "fixed" and "broken" — it\'s the subject of both.',
  6: '"it" focuses on "car", not "robot" — that\'s how Anayo knows what "it" refers to! 🎯',
  8: '"broken" links back to "car" and "it" — confirming exactly what was broken.',
};

export function PayingAttentionToy({ mode, onComplete }: ToyProps) {
  const [focused, setFocused] = useState<number | null>(null);
  const [explored, setExplored] = useState<Set<number>>(new Set());

  function focus(i: number) {
    setFocused(i);
    setExplored((prev) => new Set([...prev, i]));
  }

  const attn = focused !== null ? ATTENTION[focused] : null;
  const insight =
    focused !== null
      ? (INSIGHTS[focused] ?? "This word mainly connects to its neighbours — grammar glue.")
      : null;

  const topWords = attn
    ? WORDS.map((w, i) => ({ w, i, a: attn[i] }))
        .filter((x) => x.i !== focused)
        .sort((a, b) => b.a - a.a)
        .slice(0, 3)
    : [];

  const canComplete = explored.size >= 3;

  const guide =
    canComplete
      ? "✨ You've got the idea — hit Continue whenever you're ready."
      : explored.size >= 1 && !explored.has(IT_IDX)
        ? `💡 Try clicking "it" — most interesting pattern! (${explored.size}/3 explored)`
        : focused === null
          ? "Click any word to see which others Anayo focuses on ↓"
          : `${explored.size}/3 words explored — keep clicking!`;

  return (
    <div className="toy">
      <div className="rule-card">
        🎯 <b>Attention</b> — when reading a word, Anayo weighs how much every other word matters.{" "}
        {mode === "curious"
          ? "Each token computes Q·Kᵀ dot-products across all positions, producing a softmax distribution of attention weights."
          : "Click a word and watch the sentence light up — bright words are what Anayo is really thinking about!"}
      </div>

      <div className="guide">{guide}</div>

      <div className="attn-sentence">
        {WORDS.map((w, i) => {
          const isFocused = focused === i;
          const weight = attn ? attn[i] : null;
          const isBright = weight !== null && !isFocused && weight >= 0.65;
          return (
            <button
              key={i}
              className={`attn-chip${isFocused ? " focused" : ""}${isBright ? " bright" : ""}`}
              style={weight !== null && !isFocused ? { opacity: Math.max(0.18, weight) } : undefined}
              onClick={() => focus(i)}
            >
              {w}
            </button>
          );
        })}
      </div>

      {attn && (
        <div className="attn-insight">
          <div className="attn-scores">
            {topWords.map(({ w, a }) => (
              <span key={w} className="attn-score">
                <b>{w}</b> {Math.round(a * 100)}%
              </span>
            ))}
          </div>
          <p>{insight}</p>
        </div>
      )}

      <div className="toy-actions">
        {canComplete ? (
          <button className="btn primary" onClick={onComplete}>
            ✨ I see it! Continue →
          </button>
        ) : (
          <p className="field-hint">
            Click {Math.max(0, 3 - explored.size)} more word{3 - explored.size !== 1 ? "s" : ""} to unlock Continue
          </p>
        )}
      </div>
    </div>
  );
}
