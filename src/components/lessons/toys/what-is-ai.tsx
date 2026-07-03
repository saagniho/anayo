"use client";

import { useEffect, useState } from "react";
import type { ToyProps } from "@/lib/lessons/types";
import { BigButton, GuideBar } from "../guide";

type Blob = { id: number; size: number; trueLove: boolean };
type Label = "love" | "nope";
type Step =
  | "secret"
  | "blindGuess"
  | "blindResult"
  | "teachLove"
  | "teachNope"
  | "learn"
  | "thinking"
  | "reveal"
  | "test";

const TRUE_THRESHOLD = 40; // the kid's secret: big (>= 40) = loved

function makeBlobs(): Blob[] {
  // clear gap between the "small" cluster and the "big" cluster
  const sizes = [16, 22, 28, 34, 46, 52, 58, 64];
  return sizes
    .map((size, i) => ({ id: i, size, trueLove: size >= TRUE_THRESHOLD }))
    .sort(() => Math.random() - 0.5);
}

// Anayo's zero-knowledge guess: deterministic and exactly 4/8 correct, and
// not size-shaped — the "before" score must always read as pure chance.
function blindGuess(b: Blob): boolean {
  return b.size <= 22 || (b.size >= 46 && b.size <= 52);
}

const DOTS: Partial<Record<Step, number>> = {
  blindGuess: 1,
  blindResult: 2,
  teachLove: 3,
  teachNope: 4,
  learn: 5,
  thinking: 5,
  reveal: 5,
  test: 6,
};
const DOTS_TOTAL = 6;

export function WhatIsAiToy({ mode, onComplete }: ToyProps) {
  const [blobs] = useState<Blob[]>(makeBlobs);
  const [step, setStep] = useState<Step>("secret");
  const [labels, setLabels] = useState<Record<number, Label>>({});
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    if (step !== "thinking") return;
    const t = setTimeout(() => setStep("reveal"), 1400);
    return () => clearTimeout(t);
  }, [step]);

  const curious = mode === "curious";
  const blindRight = blobs.filter((b) => blindGuess(b) === b.trueLove).length;
  const loveCount = Object.values(labels).filter((l) => l === "love").length;
  const nopeCount = Object.values(labels).filter((l) => l === "nope").length;

  function paint(b: Blob) {
    if (step !== "teachLove" && step !== "teachNope") return;
    if (labels[b.id]) return;
    if (step === "teachLove") {
      if (!b.trueLove) {
        setHint("Hmm — remember your secret: you love the BIG ones! 💜");
        return;
      }
      setHint(null);
      setLabels((prev) => ({ ...prev, [b.id]: "love" }));
      if (loveCount + 1 >= 2) setStep("teachNope");
    } else {
      if (b.trueLove) {
        setHint("Those are your favourites! Tap the SMALLEST ones 🚫");
        return;
      }
      setHint(null);
      setLabels((prev) => ({ ...prev, [b.id]: "nope" }));
      if (nopeCount + 1 >= 2) setStep("learn");
    }
  }

  const guide: Partial<Record<Step, string>> = {
    blindGuess: curious
      ? "Zero training data so far. First, a baseline: make Anayo guess with no examples."
      : "Anayo knows NOTHING about you yet. Can it guess which blobs you love?",
    blindResult: curious
      ? `${blindRight}/8 — chance level, exactly what no data gets you. Let's fix that with examples.`
      : "See? With no examples, Anayo can only guess! Time to teach it.",
    teachLove: curious
      ? "Give it 2 positive examples — tap 2 of the BIGGEST blobs 💜"
      : "Tap 2 of your favourite blobs — the BIGGEST ones 💜",
    teachNope: curious
      ? "Now 2 negative examples — tap 2 of the smallest 🚫"
      : "Now tap 2 blobs you DON'T like — the smallest 🚫",
    learn: curious
      ? "4 labelled examples. Let Anayo fit a rule to them."
      : "Anayo has 4 examples now. Press the button and watch it think!",
    thinking: curious ? "Fitting a rule to your examples…" : "Anayo is studying your examples…",
    reveal: curious
      ? "Anayo inferred a rule — nobody typed it in."
      : "Anayo found the pattern — all by itself!",
    test: curious
      ? "Generalisation time: the 4 blobs you never labelled are the test set."
      : "The REAL test — blobs you never told it about!",
  };

  const dotStep = DOTS[step];
  const showBlobs = step !== "secret";
  const showLabels = step !== "blindGuess" && step !== "blindResult";
  const unlabelled = blobs.filter((b) => !labels[b.id]);

  return (
    <div className="toy">
      {step === "secret" && (
        <>
          <div className="wai-secret">
            🤫 <b>Your secret:</b> you LOVE big blobs — small ones, no thanks.
            <br />
            {curious
              ? "The mission: get Anayo to discover that rule from examples alone. You never state it."
              : "But here's the twist — you can't TELL Anayo. AI doesn't learn from being told the rules. It learns from examples you SHOW it!"}
          </div>
          <BigButton onClick={() => setStep("blindGuess")}>Ready ▶</BigButton>
        </>
      )}

      {dotStep && (
        <GuideBar step={dotStep} total={DOTS_TOTAL}>
          {guide[step]}
        </GuideBar>
      )}

      {step === "reveal" && (
        <div className="wai-rule">
          🤖{" "}
          {curious
            ? "“Your 💜 sizes cluster high, your 🚫 sizes cluster low. My learned rule: big ⇒ loved. I found the boundary myself — from just 4 examples.”"
            : "“Both blobs you 💜 are BIG… and the 🚫 ones are small. I think you love BIG blobs!”"}
        </div>
      )}

      {showBlobs && (
        <div className="blob-field">
          {blobs.map((b) => {
            const d = Math.round(b.size * 1.5) + 24;
            const lab = showLabels ? labels[b.id] : undefined;
            const blind = step === "blindResult" ? blindGuess(b) : undefined;
            const tested = step === "test" && !labels[b.id];
            const testIndex = tested ? unlabelled.findIndex((u) => u.id === b.id) : 0;
            return (
              <button
                key={b.id}
                className="blobtile"
                onClick={() => paint(b)}
                aria-label={`blob, size ${b.size}`}
              >
                <span
                  className={`blobdot${step === "thinking" && labels[b.id] ? " think" : ""}`}
                  style={{
                    width: d,
                    height: d,
                    outline: lab
                      ? "3px solid rgba(255,255,255,.7)"
                      : tested || blind !== undefined
                        ? "3px dashed rgba(255,255,255,.4)"
                        : "none",
                  }}
                >
                  <span className="eye l" />
                  <span className="eye r" />
                </span>
                {lab && <span className="blobtag">{lab === "love" ? "💜" : "🚫"}</span>}
                {blind !== undefined && (
                  <span className="blobtag">
                    {blind ? "💜" : "🚫"} {blind === b.trueLove ? "✅" : "❌"}
                  </span>
                )}
                {tested && (
                  <span
                    className="blobtag pop"
                    style={{ animationDelay: `${testIndex * 0.4}s` }}
                  >
                    {b.trueLove ? "💜" : "🚫"} ✅
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {hint && <p className="hint">{hint}</p>}

      {step === "blindResult" && (
        <>
          <div className="acc">
            <i style={{ width: `${(blindRight / 8) * 100}%` }} />
          </div>
          <p className="taught">
            Anayo got <b>{blindRight}/8</b> — no better than flipping a coin! 😅
          </p>
        </>
      )}

      {step === "test" && (
        <>
          <div className="acc">
            <i style={{ width: "100%" }} />
          </div>
          <div className="wai-score">
            <span>Before: {blindRight}/8 😅</span>
            <span className="arrow">→</span>
            <span>After: 8/8 🎉</span>
          </div>
        </>
      )}

      {step === "blindGuess" && (
        <BigButton onClick={() => setStep("blindResult")}>🔮 Let Anayo guess</BigButton>
      )}
      {step === "blindResult" && (
        <BigButton onClick={() => setStep("teachLove")}>🧑‍🏫 Show it examples</BigButton>
      )}
      {step === "learn" && <BigButton onClick={() => setStep("thinking")}>🧠 Teach Anayo</BigButton>}
      {step === "reveal" && (
        <BigButton onClick={() => setStep("test")}>🔮 Test it! Guess the rest</BigButton>
      )}
      {step === "test" && (
        <BigButton onClick={onComplete}>✨ Anayo learned it! Continue →</BigButton>
      )}
    </div>
  );
}
