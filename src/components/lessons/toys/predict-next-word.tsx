"use client";

import { useState } from "react";
import type { ToyProps } from "@/lib/lessons/types";

type Choice = { word: string; emoji?: string; next?: string };

const OPENING = "Once upon a time, there was a little";

const CHOICES: Choice[][] = [
  // Round 0 — who is the character?
  [
    { word: "dragon",  emoji: "🐉", next: " who loved to" },
    { word: "robot",   emoji: "🤖", next: " whose secret talent was to" },
    { word: "wizard",  emoji: "🧙", next: " whose greatest spell could" },
    { word: "cloud",   emoji: "☁️", next: " that always wanted to" },
  ],
  // Round 1 — what did they do?
  [
    { word: "breathe fire",     emoji: "🔥", next: " while perched on a" },
    { word: "read books",       emoji: "📚", next: " while sitting inside a" },
    { word: "eat stars",        emoji: "⭐", next: " while floating above a" },
    { word: "count paperclips", emoji: "📎", next: " next to a very large" },
  ],
  // Round 2 — where?
  [
    { word: "mountain", emoji: "⛰️" },
    { word: "library",  emoji: "📚" },
    { word: "cloud",    emoji: "☁️" },
    { word: "pizza",    emoji: "🍕" },
  ],
];

function buildSentence(
  picks: string[],
  pending: string | null,
  round: number,
  done: boolean,
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [OPENING, " "];

  for (let i = 0; i < CHOICES.length; i++) {
    if (i < picks.length) {
      nodes.push(<span key={`p${i}`} className="pred-word">{picks[i]}</span>);
      if (done && i === picks.length - 1) {
        nodes.push(".");
        break;
      }
      const choice = CHOICES[i].find((c) => c.word === picks[i]);
      if (choice?.next) nodes.push(choice.next + " ");
    } else if (i === round) {
      nodes.push(
        <span key="blank" className={`pred-blank${pending ? " filling" : ""}`}>
          {pending ?? "___"}
        </span>,
      );
      break;
    } else {
      break;
    }
  }

  return nodes;
}

export function PredictNextWordToy({ mode, onComplete }: ToyProps) {
  const [round, setRound] = useState(0);
  const [picks, setPicks] = useState<string[]>([]);
  const [pending, setPending] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function pick(word: string) {
    if (pending !== null) return;
    setPending(word);
    setTimeout(() => {
      const next = [...picks, word];
      setPicks(next);
      setPending(null);
      if (round + 1 >= CHOICES.length) {
        setDone(true);
      } else {
        setRound((r) => r + 1);
      }
    }, 700);
  }

  return (
    <div className="toy">
      <div className="rule-card">
        🔮 <b>Think like an AI —</b>{" "}
        {mode === "curious"
          ? "pick one token at a time to complete the sequence. This is autoregressive generation."
          : "pick one word at a time to finish the story. That's literally how AI writes!"}
      </div>

      <div className="pred-story">
        <p className="pred-sentence">
          {buildSentence(picks, pending, round, done)}
        </p>
      </div>

      {!done ? (
        <>
          <div className="guide">Which word comes next? ↓</div>
          <div className="pred-choices">
            {CHOICES[round].map((c) => (
              <button
                key={c.word}
                className={`pred-chip${pending === c.word ? " picked" : ""}`}
                onClick={() => pick(c.word)}
                disabled={pending !== null}
              >
                {c.emoji && <span className="chip-em">{c.emoji}</span>}
                {c.word}
              </button>
            ))}
          </div>
          <p className="field-hint">
            Step {round + 1} of {CHOICES.length} — any choice works, just like AI!
          </p>
        </>
      ) : (
        <div className="pred-aha">
          <p>
            {mode === "curious"
              ? `You ran ${CHOICES.length} steps of autoregressive next-token prediction. The sentence emerged token by token — no global plan, just P(next | context) repeated.`
              : "That's exactly how I write! One word at a time, always asking 'what fits best here?' — over and over until the whole answer appears. 🤯"}
          </p>
          <button className="btn primary" onClick={onComplete}>
            ✨ I get it! Continue →
          </button>
        </div>
      )}
    </div>
  );
}
