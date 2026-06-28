"use client";

import { useState } from "react";
import type { ToyProps } from "@/lib/lessons/types";

const INGREDIENTS = [
  { id: "what",  icon: "🎯", label: "The task",     desc: "Tell Anayo WHAT to write" },
  { id: "who",   icon: "👤", label: "Who it's for", desc: "Give Anayo a target person" },
  { id: "style", icon: "🎨", label: "Style",        desc: "Set the tone and length" },
  { id: "extra", icon: "✨", label: "Details",      desc: "Add a specific fun fact" },
];

function buildPrompt(added: Set<string>): string {
  if (!added.has("what")) return "";
  let p = "Write a birthday message";
  if (added.has("who"))   p += " for my son Anay, who loves dragons";
  if (added.has("style")) p += ". Make it fun and short";
  if (added.has("extra")) p += ". He just turned 9";
  return p + ".";
}

function getResponse(added: Set<string>): string {
  if (!added.has("what"))
    return "🤔 I'm not sure what you'd like me to write…";
  if (!added.has("who"))
    return added.has("extra")
      ? "Happy 9th Birthday! Hope it's full of adventures! 🎉"
      : "Happy Birthday! Hope your day is really special! 🎉";
  if (!added.has("style") && !added.has("extra"))
    return "Happy Birthday, Anay! May your day be as epic as a dragon! 🐉";
  if (!added.has("extra"))
    return "Happy Birthday, Dragon Tamer Anay! 🐉 May your day blaze with fire and fun!";
  return "Happy 9th Birthday, Anay — Dragon Master in training! 🐉⚔️ Nine legendary years down. May your next quest be your greatest yet! ✨";
}

export function TheArtOfAskingToy({ mode, onComplete }: ToyProps) {
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [thinking, setThinking] = useState(false);

  function addIngredient(id: string) {
    if (added.has(id) || thinking) return;
    setThinking(true);
    setTimeout(() => {
      setAdded((prev) => new Set([...prev, id]));
      setThinking(false);
    }, 500);
  }

  const prompt = buildPrompt(added);
  const response = getResponse(added);
  const canComplete = added.size >= 3;

  const guide =
    added.size === 0
      ? "👆 Tap an ingredient below to start building your prompt"
      : canComplete
        ? "✨ Look how specific that got! Keep adding or hit Continue."
        : added.size === 1
          ? "Good start! Add more ingredients to improve the response."
          : `Getting better! Add ${3 - added.size} more ingredient${3 - added.size !== 1 ? "s" : ""}.`;

  return (
    <div className="toy">
      <div className="rule-card">
        💬 <b>Your prompt is the steering wheel.</b>{" "}
        {mode === "curious"
          ? "LLMs are distribution-matching machines — more context narrows the output distribution toward higher-quality samples. Specificity is everything."
          : "The more clearly you tell Anayo what you want, the better the answer. Build a prompt piece by piece and watch the magic!"}
      </div>

      <div className="guide">{guide}</div>

      <div className="prompt-response">
        <div className="pr-box prompt-box">
          <div className="pr-label">📝 Your prompt</div>
          <p className="pr-text">
            {prompt
              ? prompt
              : <span className="pr-empty">Nothing yet — add an ingredient!</span>}
          </p>
        </div>
        <div className="pr-box response-box">
          <div className="pr-label">🤖 Anayo says</div>
          {thinking ? (
            <div className="thinking"><span /><span /><span /></div>
          ) : (
            <p className="pr-text response-text">{response}</p>
          )}
        </div>
      </div>

      <div className="ingr-grid">
        {INGREDIENTS.map((ing) => {
          const isAdded = added.has(ing.id);
          return (
            <button
              key={ing.id}
              className={`ingr-card${isAdded ? " added" : ""}`}
              onClick={() => addIngredient(ing.id)}
              disabled={isAdded || thinking}
            >
              <span className="ingr-icon">{ing.icon}</span>
              <span className="ingr-label">{ing.label}</span>
              <span className="ingr-desc">{isAdded ? "✅ added" : ing.desc}</span>
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
            Add {Math.max(0, 3 - added.size)} more ingredient{3 - added.size !== 1 ? "s" : ""} to unlock Continue
          </p>
        )}
      </div>
    </div>
  );
}
