"use client";

import { useState, useEffect } from "react";
import type { ToyProps } from "@/lib/lessons/types";

const APPS = [
  {
    icon: "🎮",
    name: "Story Game",
    tagline: "A game where Anayo writes the story as you play!",
    blurb: "Every choice you make, Anayo invents the next scene. No two games are ever the same.",
  },
  {
    icon: "🌍",
    name: "Trip Planner",
    tagline: "Tell it where you want to go — it plans the whole trip!",
    blurb: "Flights, hotels, things to do, what to pack — sorted in seconds.",
  },
  {
    icon: "🎵",
    name: "Mood DJ",
    tagline: "It reads your mood and picks the perfect playlist!",
    blurb: "Feeling excited? Sad? Sleepy? Mood DJ always plays the right song.",
  },
  {
    icon: "🤖",
    name: "Personal Tutor",
    tagline: "Your own patient teacher that never gets tired!",
    blurb: "Ask anything, any time. It explains, checks your work, and cheers you on.",
  },
] as const;

const BUILD_STEPS = [
  { icon: "🧠", text: "Adding the brain..." },
  { icon: "🔧", text: "Connecting the tools..." },
  { icon: "🧩", text: "Building the plan..." },
  { icon: "💻", text: "Writing the code..." },
  { icon: "✅", text: "Done!" },
] as const;

type Phase = "pick" | "building" | "ready";

export function BuildSomethingRealToy({ onComplete }: ToyProps) {
  const [appIdx, setAppIdx] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("pick");
  const [buildStep, setBuildStep] = useState(0);

  const app = appIdx !== null ? APPS[appIdx] : null;

  function pickApp(i: number) {
    setAppIdx(i);
    setPhase("building");
    setBuildStep(0);
  }

  // Advance build steps
  useEffect(() => {
    if (phase !== "building") return;
    if (buildStep >= BUILD_STEPS.length) {
      const t = setTimeout(() => setPhase("ready"), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setBuildStep((n) => n + 1), 600);
    return () => clearTimeout(t);
  }, [phase, buildStep]);

  return (
    <div className="bsr-wrap">
      {/* Pick phase */}
      {phase === "pick" && (
        <>
          <div className="bsr-prompt">
            <span className="bsr-prompt-label">🎓 Graduation Challenge</span>
            <p className="bsr-prompt-q">
              You&apos;ve learned everything. What would YOU build with AI?
            </p>
          </div>
          <div className="bsr-apps">
            {APPS.map((a, i) => (
              <button key={i} className="bsr-app-btn" onClick={() => pickApp(i)}>
                <span className="bsr-app-icon">{a.icon}</span>
                <div className="bsr-app-info">
                  <span className="bsr-app-name">{a.name}</span>
                  <span className="bsr-app-tagline">{a.tagline}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Building phase */}
      {phase === "building" && app && (
        <div className="bsr-building">
          <div className="bsr-building-title">
            Building your {app.icon} {app.name}…
          </div>
          <div className="bsr-build-steps">
            {BUILD_STEPS.slice(0, buildStep).map((s, i) => (
              <div key={i} className={`bsr-build-step${i === buildStep - 1 ? " bsr-build-live" : " bsr-build-past"}`}>
                <span>{s.icon}</span>
                <span>{s.text}</span>
              </div>
            ))}
            {buildStep < BUILD_STEPS.length && (
              <div className="thinking"><span /><span /><span /></div>
            )}
          </div>
        </div>
      )}

      {/* Ready phase */}
      {phase === "ready" && app && (
        <div className="bsr-ready">
          <div className="bsr-app-card">
            <div className="bsr-card-icon">{app.icon}</div>
            <div className="bsr-card-name">{app.name}</div>
            <div className="bsr-card-blurb">{app.blurb}</div>
            <div className="bsr-card-badge">Built with Anayo 🤖</div>
          </div>

          <div className="bsr-abilities">
            <div className="bsr-abilities-label">Powers you used to build this:</div>
            <div className="bsr-abilities-row">
              {["👁️ SEE","📖 READ","🔮 GUESS","✨ IMAGINE","🎯 FOCUS","💬 ASK","🗂️ CONTEXT","🦾 ACT","🧩 PLAN","💻 CODE"].map((ab) => (
                <span key={ab} className="bsr-ab-chip">{ab}</span>
              ))}
            </div>
          </div>

          <button className="btn primary bsr-ship" onClick={onComplete}>
            🚀 Ship It!
          </button>
        </div>
      )}
    </div>
  );
}
