"use client";

import { useState, useEffect } from "react";
import type { ToyProps } from "@/lib/lessons/types";

type ToolId = "internet" | "notepad" | "weather";

const TOOLS: { id: ToolId; icon: string; name: string; what: string }[] = [
  { id: "internet", icon: "📡", name: "Internet",    what: "Search the web"    },
  { id: "notepad",  icon: "✏️",  name: "Notepad",    what: "Write things down" },
  { id: "weather",  icon: "🌤️", name: "Weather App", what: "Check the forecast" },
];

const STEPS = [
  { icon: "🔍", text: "Searching the internet for Mumbai weather..." },
  { icon: "⛈️", text: "Found it! Mumbai tomorrow: 31°C, 80% chance of rain" },
  { icon: "✏️", text: "Writing your weather report..." },
  { icon: "✅", text: "All done! Here's your report:" },
];

export function FromTalkingToDoingToy({ onComplete }: ToyProps) {
  const [phase, setPhase] = useState<"intro" | "tools" | "run" | "result">("intro");
  const [given, setGiven] = useState<Set<ToolId>>(new Set());
  const [shownSteps, setShownSteps] = useState(0);

  function giveTool(id: ToolId) {
    setGiven((prev) => new Set([...prev, id]));
  }

  function launch() {
    setPhase("run");
    setShownSteps(1);
  }

  // Reveal each step with a delay
  useEffect(() => {
    if (phase !== "run" || shownSteps >= STEPS.length) return;
    const t = setTimeout(() => setShownSteps((n) => n + 1), 1200);
    return () => clearTimeout(t);
  }, [phase, shownSteps]);

  // Switch to result once all steps shown
  useEffect(() => {
    if (phase !== "run" || shownSteps !== STEPS.length) return;
    const t = setTimeout(() => setPhase("result"), 700);
    return () => clearTimeout(t);
  }, [phase, shownSteps]);

  // Complete after result renders
  useEffect(() => {
    if (phase !== "result") return;
    const t = setTimeout(onComplete, 2400);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  const allGiven = given.size === TOOLS.length;

  return (
    <div className="at-wrap">

      {/* Task card — always visible */}
      <div className="at-task">
        <span className="at-task-from">👦 Anay asks:</span>
        <span className="at-task-q">
          &ldquo;Will it rain in Mumbai tomorrow? Can you write me a quick report?&rdquo;
        </span>
      </div>

      {/* INTRO — Anayo can't do it without tools */}
      {phase === "intro" && (
        <div className="at-intro">
          <div className="at-robot-row">
            <span className="at-robot">🤖</span>
            <div className="at-bubble">
              <p>I can think and talk... but I can&apos;t <strong>check the internet</strong> or <strong>write anything</strong>!</p>
              <p className="at-bubble-sub">A chatbot can only chat. I need tools to actually DO things.</p>
            </div>
          </div>
          <button className="btn primary at-cta" onClick={() => setPhase("tools")}>
            Give Anayo some tools →
          </button>
        </div>
      )}

      {/* TOOLS — tap to equip */}
      {phase === "tools" && (
        <div className="at-tools-phase">
          <p className="at-tools-label">
            {allGiven
              ? "Anayo is fully powered up! 🎉"
              : "👇 Tap each tool to give it to Anayo"}
          </p>
          <div className="at-tools-grid">
            {TOOLS.map((tool) => {
              const active = given.has(tool.id);
              return (
                <button
                  key={tool.id}
                  className={`at-tool${active ? " at-tool-on" : ""}`}
                  onClick={() => giveTool(tool.id)}
                  disabled={active}
                >
                  <span className="at-tool-icon">{tool.icon}</span>
                  <span className="at-tool-name">{tool.name}</span>
                  <span className="at-tool-what">{tool.what}</span>
                  {active && <span className="at-tool-check">✓</span>}
                </button>
              );
            })}
          </div>
          {allGiven && (
            <button className="btn primary at-go" onClick={launch}>
              Go Anayo! 🚀
            </button>
          )}
        </div>
      )}

      {/* RUN — animated steps */}
      {(phase === "run" || phase === "result") && (
        <div className="at-run">
          <div className="at-run-header">
            <span className={`at-run-dot${phase === "run" ? " pulsing" : ""}`} />
            <span>{phase === "run" ? "Anayo is on it…" : "Anayo finished!"}</span>
          </div>

          <div className="at-steps">
            {STEPS.slice(0, shownSteps).map((s, i) => (
              <div key={i} className={`at-step${i === shownSteps - 1 && phase === "run" ? " at-step-live" : ""}`}>
                <span className="at-step-icon">{s.icon}</span>
                <span className="at-step-text">{s.text}</span>
              </div>
            ))}
            {phase === "run" && shownSteps < STEPS.length && (
              <div className="thinking"><span /><span /><span /></div>
            )}
          </div>

          {phase === "result" && (
            <div className="at-result">
              <div className="at-result-title">📋 Weather Report</div>
              <div className="at-result-body">
                Mumbai tomorrow: ⛈️ <strong>31°C with 80% chance of rain.</strong>
                <br />Pack that umbrella! ☔
              </div>
              <div className="at-result-footer">
                A chatbot says &ldquo;I don&apos;t know.&rdquo; An <strong>agent</strong> finds the answer. 🦾
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
