"use client";

import { useState } from "react";
import type { ToyProps } from "@/lib/lessons/types";

const PALETTE = [
  "#8b5cff","#27e0f0","#ff7a59","#34d399",
  "#ffb84d","#ff5db1","#60a5fa","#f59e0b",
];

// Vocabulary persists for the whole session (committed on "Show Numbers"),
// so a word keeps its number across every sentence the kid tries — the
// lesson's core claim ("same word, same number, always") must hold in play.
type Vocab = { map: Record<string, number>; next: number };

function splitTokens(text: string): string[] {
  // Unicode-aware: keeps emoji (incl. skin tones and ZWJ sequences like 👨‍👩‍👧)
  // as single tokens instead of splitting surrogate pairs into mojibake.
  return (
    text
      .trim()
      .match(
        /\p{Extended_Pictographic}[\p{Emoji_Modifier}\u{FE0F}]*(?:\u{200D}\p{Extended_Pictographic}[\p{Emoji_Modifier}\u{FE0F}]*)*|\w+|[^\w\s]/gu,
      ) ?? []
  );
}

function assignIds(parts: string[], vocab: Vocab): { token: string; id: number }[] {
  const tentative: Record<string, number> = {};
  let next = vocab.next;
  return parts.map((t) => {
    const key = t.toLowerCase();
    let id = vocab.map[key] ?? tentative[key];
    if (id === undefined) {
      id = next++;
      tentative[key] = id;
    }
    return { token: t, id };
  });
}

export function WordsIntoNumbersToy({ mode, onComplete }: ToyProps) {
  const [text, setText] = useState("");
  const [showNums, setShowNums] = useState(false);
  const [fed, setFed] = useState(false);
  const [vocab, setVocab] = useState<Vocab>({ map: {}, next: 1 });

  const tokens = assignIds(splitTokens(text), vocab);
  const hasTokens = tokens.length > 0;

  const idCounts: Record<number, number> = {};
  for (const t of tokens) idCounts[t.id] = (idCounts[t.id] ?? 0) + 1;
  const hasTwins = tokens.some((t) => idCounts[t.id] > 1);

  const guide = fed
    ? null
    : hasTokens && showNums
      ? hasTwins
        ? "Step 3 — spot the twins! Same word = same number. Now press 📨 Feed Anayo!"
        : "Step 3 — press 📨 Feed Anayo to send it your sentence!"
      : hasTokens
        ? "Step 2 — press 👁 Show Numbers to see what Anayo actually reads."
        : "Step 1 — type any sentence in the box below ↓ (try: the cat and the dog)";

  function handleChange(v: string) {
    setText(v);
    setShowNums(false);
    setFed(false);
  }

  function revealNumbers() {
    setVocab((v) => {
      const map = { ...v.map };
      let next = v.next;
      for (const t of tokens) {
        const key = t.token.toLowerCase();
        if (!(key in map)) map[key] = next++;
      }
      return { map, next };
    });
    setShowNums(true);
  }

  const decoded = tokens.map((t) => t.token.toLowerCase()).join(" ");

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
        placeholder="e.g. the cat and the dog"
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
              className={`tok-chip${showNums && idCounts[t.id] > 1 ? " dup" : ""}`}
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
            <button className="btn primary" onClick={revealNumbers}>
              👁 Show Numbers
            </button>
          ) : (
            <button className="btn primary" onClick={() => setFed(true)}>
              📨 Feed Anayo
            </button>
          )}
        </div>
      )}

      {fed && (
        <>
          <div className="tok-decode">
            <p className="tok-decode-label">Anayo only received these numbers:</p>
            <div className="tok-stream">{tokens.map((t) => t.id).join(" · ")}</div>
            <p className="tok-decode-label">…and turned them right back into your words:</p>
            <div className="tok-decoded">&ldquo;{decoded}&rdquo;</div>
          </div>
          <p className="taught">
            ✅ The numbers carried your whole sentence — that&apos;s how Anayo reads! 🧠
            <br />
            🔁 Try another sentence with the same words — they keep their numbers, always!
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
