"use client";

import { useState, useEffect } from "react";
import type { ToyProps } from "@/lib/lessons/types";

type CompId = "model" | "tools" | "goal";

const COMPONENTS: { id: CompId; icon: string; label: string; desc: string; slot: string }[] = [
  { id: "model", icon: "🧠", label: "Brain",     desc: "Reasons, plans & decides",        slot: "MODEL" },
  { id: "tools", icon: "🔧", label: "Tool Belt", desc: "Web Search 🌐 + File Writer ✍️",  slot: "TOOLS" },
  { id: "goal",  icon: "🎯", label: "Mission",   desc: "Research Paris weather → report",  slot: "GOAL"  },
];

const STEPS = [
  { icon: "🎯", cls: "goal",  text: "Reading mission: 'Research the weather in Paris and write a short report'" },
  { icon: "🧠", cls: "model", text: "Planning: 'I'll search the web for the weather, then write the report'" },
  { icon: "🌐", cls: "tool",  text: "Web Search: 'Paris weather today' -> ☀️ 18°C, clear skies" },
  { icon: "🧠", cls: "model", text: "Processing: '18°C is mild — light jacket weather. Writing now…'" },
  { icon: "✍️", cls: "tool",  text: "Writing report -> 'Paris is 18°C and sunny. Bring a light jacket.'" },
  { icon: "✅", cls: "done",  text: "Mission complete! Report saved." },
] as const;

export function FromTalkingToDoingToy({ onComplete }: ToyProps) {
  const [added, setAdded] = useState<Set<CompId>>(new Set());
  const [launched, setLaunched] = useState(false);
  const [step, setStep] = useState(-1);

  const allFilled = added.size === 3;

  function add(id: CompId) {
    setAdded((prev) => new Set([...prev, id]));
  }

  function launch() {
    setLaunched(true);
    setStep(0);
  }

  // Auto-advance through steps
  useEffect(() => {
    if (step < 0 || step >= STEPS.length - 1) return;
    const t = setTimeout(() => setStep((s) => s + 1), 950);
    return () => clearTimeout(t);
  }, [step]);

  // Trigger completion after final step
  useEffect(() => {
    if (step !== STEPS.length - 1) return;
    const t = setTimeout(onComplete, 1400);
    return () => clearTimeout(t);
  }, [step, onComplete]);

  return (
    <div className="agent-toy">
      {/* Mission banner */}
      <div className="agent-mission">
        <span className="agent-mission-tag">Mission</span>
        <span className="agent-mission-text">
          &ldquo;Research the weather in Paris and write a short report&rdquo;
        </span>
      </div>

      {/* Three slots */}
      <div className="agent-slots">
        {COMPONENTS.map((c) => {
          const filled = added.has(c.id);
          return (
            <div key={c.id} className={`agent-slot${filled ? " filled" : ""}`}>
              <span className="agent-slot-tag">{c.slot}</span>
              {filled ? (
                <>
                  <span className="agent-slot-icon">{c.icon}</span>
                  <span className="agent-slot-name">{c.label}</span>
                </>
              ) : (
                <span className="agent-slot-empty">empty</span>
              )}
            </div>
          );
        })}
      </div>

      {!launched ? (
        <>
          <p className="agent-hint">
            {added.size === 0
              ? "👇 Tap each part to wire up the agent"
              : added.size < 3
              ? `${3 - added.size} more piece${3 - added.size === 1 ? "" : "s"} to go…`
              : "All wired! Ready to launch 🚀"}
          </p>

          {/* Component tray */}
          <div className="agent-tray">
            {COMPONENTS.map((c) => {
              const placed = added.has(c.id);
              return (
                <button
                  key={c.id}
                  className={`agent-card${placed ? " placed" : ""}`}
                  onClick={() => add(c.id)}
                  disabled={placed}
                >
                  <span className="agent-card-icon">{c.icon}</span>
                  <span className="agent-card-name">{c.label}</span>
                  <span className="agent-card-desc">{c.desc}</span>
                  {placed && <span className="agent-placed-check">✓</span>}
                </button>
              );
            })}
          </div>

          {allFilled && (
            <button className="btn primary agent-launch" onClick={launch}>
              🚀 Launch Agent
            </button>
          )}
        </>
      ) : (
        /* Step trace */
        <div className="agent-trace">
          {STEPS.slice(0, step + 1).map((s, i) => (
            <div
              key={i}
              className={`trace-step${
                i === step && step < STEPS.length - 1 ? " ts-active" : ""
              }${s.cls === "done" ? " ts-done" : ""}`}
            >
              <span className="ts-icon">{s.icon}</span>
              <span className="ts-text">{s.text}</span>
            </div>
          ))}
          {step < STEPS.length - 1 && (
            <div className="thinking">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
