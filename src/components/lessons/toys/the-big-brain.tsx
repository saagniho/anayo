"use client";

import { useState } from "react";
import type { ToyProps } from "@/lib/lessons/types";

type Source = { id: string; emoji: string; label: string; fact: string };

const SOURCES: Source[] = [
  { id: "books",  emoji: "📚", label: "Books",         fact: "450,000 books — every genre, century, and language." },
  { id: "web",    emoji: "🌐", label: "Websites",      fact: "Hundreds of gigabytes of web pages — almost the whole internet." },
  { id: "code",   emoji: "💻", label: "Code",          fact: "Millions of GitHub repos across 100+ programming languages." },
  { id: "forums", emoji: "💬", label: "Conversations", fact: "Reddit, Quora, Stack Overflow — billions of human Q&As." },
  { id: "wiki",   emoji: "📖", label: "Wikipedia",     fact: "Every Wikipedia article ever written in 300+ languages." },
];

export function TheBigBrainToy({ mode, onComplete }: ToyProps) {
  const [fed, setFed] = useState<string[]>([]);
  const [lastFact, setLastFact] = useState<string | null>(null);

  const done = fed.length === SOURCES.length;
  const pct = Math.round((fed.length / SOURCES.length) * 100);

  function feed(src: Source) {
    if (fed.includes(src.id)) return;
    setFed((prev) => [...prev, src.id]);
    setLastFact(src.fact);
  }

  return (
    <div className="toy">
      <div className="rule-card">
        🧠 <b>LLM = Large Language Model.</b>{" "}
        {mode === "curious"
          ? "The 'large' refers to both the training corpus (trillions of tokens) and the parameter count (billions of weights). Feed the brain to feel the scale."
          : "The 'large' just means Anayo read an enormous amount of text before you met it! Tap each source to feed it in."}
      </div>

      <div className="brain-wrap">
        <div className={`brain-orb${done ? " full" : ""}`}>
          <div className="brain-fill" style={{ height: `${pct}%` }} />
          <span className="brain-pct">{pct}%</span>
        </div>
        <p className="brain-fact">
          {lastFact ?? (
            mode === "curious"
              ? "Modern LLMs train on trillions of tokens across diverse domains."
              : "Tap a source below to see what's inside! ↓"
          )}
        </p>
      </div>

      {!done ? (
        <>
          <div className="guide">Tap each data source to feed it to Anayo ↓</div>
          <div className="brain-sources">
            {SOURCES.map((s) => {
              const isFed = fed.includes(s.id);
              return (
                <button
                  key={s.id}
                  className={`brain-src${isFed ? " fed" : ""}`}
                  onClick={() => feed(s)}
                  disabled={isFed}
                >
                  <span className="src-em">{s.emoji}</span>
                  <span>{s.label}</span>
                  {isFed && <span className="src-check">✅</span>}
                </button>
              );
            })}
          </div>
          <p className="field-hint">{fed.length} / {SOURCES.length} sources fed</p>
        </>
      ) : (
        <div className="pred-aha">
          <p>
            {mode === "curious"
              ? "Modern LLMs process trillions of tokens during training — more text than any human could read in thousands of lifetimes. Billions of tunable weights compress and encode statistical patterns across all that data."
              : "More text than every human alive could read in their entire lifetimes — combined! That's why it's called a LARGE language model. Not magic, not a genius — just a LOT of reading. 🤯"}
          </p>
          <button className="btn primary" onClick={onComplete}>
            ✨ Mind blown! Continue →
          </button>
        </div>
      )}
    </div>
  );
}
