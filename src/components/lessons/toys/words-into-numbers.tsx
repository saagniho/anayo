"use client";

import { useState } from "react";
import type { ToyProps } from "@/lib/lessons/types";

const PALETTE = [
  "#8b5cff","#27e0f0","#ff7a59","#34d399",
  "#ffb84d","#ff5db1","#60a5fa","#f59e0b",
];

function tokenize(text: string): { token: string; id: number }[] {
  // Unicode-aware: keeps emoji (incl. skin tones and ZWJ sequences like 👨‍👩‍👧)
  // as single tokens instead of splitting surrogate pairs into mojibake.
  const parts =
    text
      .trim()
      .match(
        /\p{Extended_Pictographic}[\p{Emoji_Modifier}\u{FE0F}]*(?:\u{200D}\p{Extended_Pictographic}[\p{Emoji_Modifier}\u{FE0F}]*)*|\w+|[^\w\s]/gu,
      ) ?? [];
  const vocab: Record<string, number> = {};
  let next = 1;
  return parts.map((t) => {
    const key = t.toLowerCase();
    if (!(key in vocab)) vocab[key] = next++;
    return { token: t, id: vocab[key] };
  });
}

export function WordsIntoNumbersToy({ mode, onComplete }: ToyProps) {
  const [text, setText] = useState("");
  const [showNums, setShowNums] = useState(false);
  const [fed, setFed] = useState(false);

  const tokens = tokenize(text);
  const hasTokens = tokens.length > 0;

  const guide = fed
    ? null
    : hasTokens && showNums
      ? "Step 3 — press 📨 Feed Anayo to send it your sentence!"
      : hasTokens
        ? "Step 2 — press 👁 Show Numbers to see what Anayo actually reads."
        : "Step 1 — type any sentence in the box below ↓ (try: Anayo loves to learn)";

  function handleChange(v: string) {
    setText(v);
    setShowNums(false);
    setFed(false);
  }

  function feed() {
    setFed(true);
  }

  return (
    <div className="toy">
      <div className="rule-card">
        🔢 <b>Computers can&apos;t read words</b> —{" "}
        {mode === "curious"
          ? "every token maps to an integer ID looked up in an embedding matrix. That's the bridge from language to linear algebra."
          : "but they're great with numbers! Every word gets its own number. Same word? Same colour, same number — always. 🎨"}
      </div>

      {guide && <div className="guide">{guide}</div>}

      {!hasTokens && <p className="tok-label">✏️ Your sentence goes here</p>}

      <textarea
        className={`tok-input${!hasTokens ? " empty" : ""}`}
        placeholder="e.g. Anayo loves to learn"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        rows={3}
        maxLength={120}
      />

      {hasTokens && (
        <div className="tok-field">
          {tokens.map((t, i) => (
            <div
              key={i}
              className="tok-chip"
              style={{ "--chip-c": PALETTE[(t.id - 1) % PALETTE.length] } as React.CSSProperties}
            >
              <span className="tok-word">{t.token}</span>
              {showNums && <span className="tok-id">#{t.id}</span>}
            </div>
          ))}
        </div>
      )}

      {hasTokens && !fed && (
        <div className="toy-actions">
          {!showNums ? (
            <button className="btn primary" onClick={() => setShowNums(true)}>
              👁 Show Numbers
            </button>
          ) : (
            <button className="btn primary" onClick={feed}>
              📨 Feed Anayo
            </button>
          )}
        </div>
      )}

      {fed && (
        <>
          <p className="taught">
            ✅ Anayo received <b>{tokens.length}</b> token{tokens.length !== 1 ? "s" : ""} — it&apos;s doing math with your words right now! 🧠
          </p>
          <div className="toy-actions">
            <button className="btn primary" onClick={onComplete}>
              ✨ Cool! Continue →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
