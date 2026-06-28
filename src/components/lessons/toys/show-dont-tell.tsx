"use client";

import { useState } from "react";
import type { ToyProps } from "@/lib/lessons/types";

const TASK_IN = '"I\'m starving!"';
const TASK_STYLE = "pirate speak 🏴‍☠️";

const EXAMPLES = [
  {
    in: '"Hello"',
    out: '"Ahoy, matey! 🏴‍☠️"',
    short: '"Hello" → Pirate',
  },
  {
    in: '"Let\'s go!"',
    out: '"Weigh anchor, scallywags! ⚓"',
    short: '"Let\'s go!" → Pirate',
  },
  {
    in: '"That\'s amazing!"',
    out: '"Shiver me timbers! 🌟"',
    short: '"Amazing!" → Pirate',
  },
];

const RESPONSES = [
  "I am very hungry.",                                                        // 0 examples
  "Ahoy! I be quite hungry right now!",                                       // 1 example
  "Shiver me timbers! Me belly be a-growlin', matey! 🏴‍☠️",                  // 2 examples
  "Blimey! Me belly growls like a sea kraken, arrr! Feed me, ye scallywag! 🏴‍☠️⚓", // 3 examples
];

export function ShowDontTellToy({ mode, onComplete }: ToyProps) {
  const [shown, setShown] = useState<number[]>([]);
  const [thinking, setThinking] = useState(false);

  function addExample(i: number) {
    if (shown.includes(i) || thinking) return;
    setThinking(true);
    setTimeout(() => {
      setShown((prev) => [...prev, i]);
      setThinking(false);
    }, 500);
  }

  const response = RESPONSES[shown.length];
  const canComplete = shown.length >= 2;

  const guide =
    shown.length === 0
      ? "👆 Not great, right? Add an example below to teach Anayo the style!"
      : canComplete
        ? "✨ Examples made all the difference! Keep adding or hit Continue."
        : "Getting better! Add one more example.";

  return (
    <div className="toy">
      <div className="rule-card">
        🗂️ <b>Show, don&apos;t just tell.</b>{" "}
        {mode === "curious"
          ? "Few-shot prompting provides in-context demonstrations that shift the model's conditional output distribution toward the target style — no fine-tuning or retraining required."
          : "Instead of describing what you want, show Anayo examples! Watch the response transform as you add each one."}
      </div>

      <div className="guide">{guide}</div>

      <div className="prompt-response">
        <div className="pr-box prompt-box">
          <div className="pr-label">📝 The prompt</div>
          <p className="pr-text shot-task">
            Translate {TASK_IN} to {TASK_STYLE}.
          </p>
          {shown.length > 0 && (
            <div className="shot-examples">
              <div className="shot-examples-label">Examples you gave:</div>
              {shown.map((idx) => (
                <div key={idx} className="shot-example">
                  <span className="shot-in">{EXAMPLES[idx].in}</span>
                  <span className="shot-arrow">→</span>
                  <span className="shot-out">{EXAMPLES[idx].out}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pr-box response-box">
          <div className="pr-label">🤖 Anayo says</div>
          {thinking ? (
            <div className="thinking"><span /><span /><span /></div>
          ) : (
            <>
              <p className={`pr-text${shown.length >= 2 ? " response-text" : ""}`}>
                &ldquo;{response}&rdquo;
              </p>
              {shown.length >= 2 && (
                <p className="shot-delta">
                  vs. &ldquo;{RESPONSES[0]}&rdquo; — same task, {shown.length} examples later!
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="ingr-grid">
        {EXAMPLES.map((ex, i) => {
          const isAdded = shown.includes(i);
          return (
            <button
              key={i}
              className={`ingr-card${isAdded ? " added" : ""}`}
              onClick={() => addExample(i)}
              disabled={isAdded || thinking}
            >
              <span className="ingr-icon">💡</span>
              <span className="ingr-label">Example {i + 1}</span>
              <span className="ingr-desc">{isAdded ? "✅ Added" : ex.short}</span>
            </button>
          );
        })}
      </div>

      <div className="toy-actions">
        {canComplete ? (
          <button className="btn primary" onClick={onComplete}>
            ✨ Got it! Continue →
          </button>
        ) : (
          <p className="field-hint">
            Add {2 - shown.length} more example{2 - shown.length !== 1 ? "s" : ""} to unlock Continue
          </p>
        )}
      </div>
    </div>
  );
}
