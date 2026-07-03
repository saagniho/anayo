"use client";

import { useState } from "react";
import type { ToyProps } from "@/lib/lessons/types";

type Blob = { id: number; size: number; trueLove: boolean };
type Label = "love" | "nope";

const TRUE_THRESHOLD = 40; // big (>= 40) = Anayo's favourite
const MAX_LABELS = 6; // leave at least 2 for Anayo to guess

function makeBlobs(): Blob[] {
  // clear gap between the "small" cluster and the "big" cluster
  const sizes = [16, 22, 28, 34, 46, 52, 58, 64];
  return sizes
    .map((size, i) => ({ id: i, size, trueLove: size >= TRUE_THRESHOLD }))
    .sort(() => Math.random() - 0.5);
}

export function WhatIsAiToy({ mode, onComplete }: ToyProps) {
  const [blobs] = useState<Blob[]>(makeBlobs);
  const [labels, setLabels] = useState<Record<number, Label>>({});
  const [brush, setBrush] = useState<Label>("love");
  const [preds, setPreds] = useState<Record<number, boolean> | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  const loveCount = Object.values(labels).filter((l) => l === "love").length;
  const nopeCount = Object.values(labels).filter((l) => l === "nope").length;

  const guide =
    loveCount === 0 && nopeCount === 0
      ? "Step 1 — with the 💜 Loved brush, tap 2 of the BIGGEST blobs."
      : loveCount > 0 && nopeCount === 0
        ? "Step 2 — tap the 🚫 Nope brush above, then tap 2 of the SMALLEST blobs."
        : loveCount === 0 && nopeCount > 0
          ? "Step 2 — tap the 💜 Loved brush above, then tap 2 of the BIGGEST blobs."
          : "Step 3 — press 🧠 Teach Anayo and watch it figure out the rest!";

  function paint(id: number) {
    if (preds) return;
    setHint(null);
    setLabels((prev) => {
      const next = { ...prev };
      if (next[id] === brush) {
        delete next[id]; // tap again with the same brush to clear it
      } else {
        if (!next[id] && Object.keys(prev).length >= MAX_LABELS) {
          setHint("Leave a few blobs blank for Anayo to guess! 🙂");
          return prev;
        }
        next[id] = brush;
      }
      return next;
    });
  }

  function teach() {
    if (loveCount < 1 || nopeCount < 1) {
      setHint("Anayo needs at least one 💜 and one 🚫 example. Follow the step above ☝️");
      return;
    }
    // Learn a 1-D decision boundary from the labelled examples — including
    // which side is "loved". Anayo follows the kid's teaching faithfully,
    // even when it contradicts the secret rule (garbage in, garbage out).
    const loved = blobs.filter((b) => labels[b.id] === "love").map((b) => b.size);
    const noped = blobs.filter((b) => labels[b.id] === "nope").map((b) => b.size);
    const avg = (xs: number[]) => xs.reduce((a, x) => a + x, 0) / xs.length;
    const bigIsLoved = avg(loved) >= avg(noped);
    const threshold = bigIsLoved
      ? (Math.min(...loved) + Math.max(...noped)) / 2
      : (Math.max(...loved) + Math.min(...noped)) / 2;
    const p: Record<number, boolean> = {};
    for (const b of blobs) {
      p[b.id] = labels[b.id]
        ? labels[b.id] === "love"
        : bigIsLoved
          ? b.size >= threshold
          : b.size <= threshold;
    }
    setPreds(p);
  }

  function reset() {
    setLabels({});
    setPreds(null);
    setHint(null);
  }

  const unseen = blobs.filter((b) => !labels[b.id]);
  const correct = preds ? unseen.filter((b) => preds[b.id] === b.trueLove).length : 0;
  const accuracy = unseen.length ? Math.round((correct / unseen.length) * 100) : 0;
  const aced = !!preds && unseen.length > 0 && correct === unseen.length;

  return (
    <div className="toy">
      <div className="rule-card">
        🎯 <b>Secret rule:</b> BIG blobs are Anayo&apos;s favourite 💜 · small ones are 🚫.{" "}
        {mode === "curious"
          ? "Give a few labelled examples and Anayo will infer the boundary itself."
          : "Don't tell Anayo the rule — just show it a few examples!"}
      </div>

      {!preds && <div className="guide">{guide}</div>}

      {!preds && (
        <div className="brushes">
          <button className={`brush ${brush === "love" ? "on" : ""}`} onClick={() => setBrush("love")}>
            💜 Loved (big)
          </button>
          <button className={`brush ${brush === "nope" ? "on" : ""}`} onClick={() => setBrush("nope")}>
            🚫 Nope (small)
          </button>
        </div>
      )}

      <div className="blob-field">
        {blobs.map((b) => {
          const d = Math.round(b.size * 1.5) + 24;
          const lab = labels[b.id];
          const showPred = !!preds && !lab;
          const pred = preds ? preds[b.id] : undefined;
          const isCorrect = showPred && pred === b.trueLove;
          return (
            <button key={b.id} className="blobtile" onClick={() => paint(b.id)} aria-label={`blob, size ${b.size}`}>
              <span
                className="blobdot"
                style={{
                  width: d,
                  height: d,
                  outline: lab
                    ? "3px solid rgba(255,255,255,.7)"
                    : showPred
                      ? "3px dashed rgba(255,255,255,.4)"
                      : "none",
                  opacity: showPred ? 0.95 : 1,
                }}
              >
                <span className="eye l" />
                <span className="eye r" />
              </span>
              {lab && <span className="blobtag">{lab === "love" ? "💜" : "🚫"}</span>}
              {showPred && (
                <span className="blobtag">
                  {pred ? "💜" : "🚫"} {isCorrect ? "✅" : "❌"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!preds && (
        <p className="field-hint">👆 tap a blob to label it — leave a few blank for Anayo to guess</p>
      )}

      {!preds ? (
        <>
          <p className="taught">
            Examples taught: <b>💜 {loveCount}</b> · <b>🚫 {nopeCount}</b> · {unseen.length} left for Anayo
          </p>
          {hint && <p className="hint">{hint}</p>}
          <div className="toy-actions">
            <button className="btn primary" onClick={teach}>
              🧠 Teach Anayo
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="acc">
            <i style={{ width: `${accuracy}%` }} />
          </div>
          <p className="taught">
            Anayo guessed {correct}/{unseen.length} right ({accuracy}%)
          </p>
          <div className="toy-actions">
            {aced ? (
              <button className="btn primary" onClick={onComplete}>
                ✨ Anayo learned it! Continue →
              </button>
            ) : (
              <button className="btn ghost" onClick={reset}>
                {correct === 0
                  ? "↻ Anayo learned YOUR rule perfectly — but it wasn't the secret rule! Try again"
                  : "↻ Mixed-up examples — try again"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
