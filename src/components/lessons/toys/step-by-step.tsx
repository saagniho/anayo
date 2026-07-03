"use client";

import { useState, useEffect } from "react";
import type { ToyProps } from "@/lib/lessons/types";

const STEPS = [
  {
    icon: "📋",
    label: "Make a word list",
    doing: "Brainstorming good words...",
    result: "robot  planet  dream  beam  space  place  zoom  room",
  },
  {
    icon: "✏️",
    label: "Write the poem",
    doing: "Writing lines that rhyme...",
    result: "I am a robot, I live in space,\nI zoom around from place to place!",
  },
  {
    icon: "🔍",
    label: "Check it works",
    doing: "Reading it back carefully...",
    result: "✓ Makes sense   ✓ Rhymes   ✓ About robots!",
  },
  {
    icon: "🎨",
    label: "Add a title",
    doing: "Thinking of a great name...",
    result: "Title: The Space Robot 🚀",
  },
  {
    icon: "💾",
    label: "Save the poem",
    doing: "Saving to your notebook...",
    result: "Saved! Your poem is ready to share 🎉",
  },
] as const;

type Status = "pending" | "running" | "done";

export function StepByStepToy({ onComplete }: ToyProps) {
  const [statuses, setStatuses] = useState<Status[]>(STEPS.map(() => "pending"));
  const [running, setRunning] = useState<number | null>(null);

  const doneCount = statuses.filter((s) => s === "done").length;
  const allDone = doneCount === STEPS.length;
  // Index of the first pending step (only available when nothing is running)
  const nextIdx = running !== null ? -1 : statuses.findIndex((s) => s === "pending");

  function runStep(i: number) {
    setRunning(i);
    setStatuses((prev) => prev.map((s, idx) => (idx === i ? "running" : s)));
  }

  // Complete the running step after a short delay
  useEffect(() => {
    if (running === null) return;
    const t = setTimeout(() => {
      setStatuses((prev) => prev.map((s, idx) => (idx === running ? "done" : s)));
      setRunning(null);
    }, 1400);
    return () => clearTimeout(t);
  }, [running]);

  return (
    <div className="sbs-wrap">
      {/* Big goal */}
      <div className="sbs-goal">
        <span className="sbs-goal-tag">🎯 Big Goal</span>
        <span className="sbs-goal-text">Write and check a short poem about robots</span>
      </div>

      {/* Progress label */}
      <p className="sbs-progress">
        {allDone
          ? "✅ All done — poem complete!"
          : doneCount === 0
          ? "👇 Tap ▶ Run to start step 1"
          : `${doneCount} of ${STEPS.length} steps done — keep going!`}
      </p>

      {/* Step list */}
      <div className="sbs-steps">
        {STEPS.map((step, i) => {
          const status = statuses[i];
          const isRunning = status === "running";
          const isDone = status === "done";
          const isNext = i === nextIdx;
          const isLocked = !isDone && !isRunning && !isNext;

          return (
            <div
              key={i}
              className={`sbs-step${isDone ? " sbs-done" : isRunning ? " sbs-running" : isNext ? " sbs-next" : " sbs-locked"}`}
            >
              <div className="sbs-head">
                <span className="sbs-num">{isDone ? "✓" : i + 1}</span>
                <span className="sbs-icon">{step.icon}</span>
                <span className="sbs-label">{step.label}</span>
                {isNext && (
                  <button className="sbs-run" onClick={() => runStep(i)}>
                    ▶ Run
                  </button>
                )}
                {isRunning && <span className="sbs-spin">⟳</span>}
                {isLocked && <span className="sbs-lock">🔒</span>}
              </div>

              {isRunning && (
                <div className="sbs-body sbs-body-doing">
                  <div className="thinking">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span>{step.doing}</span>
                </div>
              )}

              {isDone && (
                <div className="sbs-body sbs-body-result">
                  {step.result.split("\n").map((line, li) => (
                    <span key={li}>
                      {li > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allDone && (
        <>
          <div className="sbs-aha">
            🧩 Big jobs feel impossible — until you break them into steps!
          </div>
          <div className="toy-actions">
            <button className="btn primary" onClick={onComplete}>
              🧩 I did it! Continue →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
