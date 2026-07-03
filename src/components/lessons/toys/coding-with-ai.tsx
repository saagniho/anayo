"use client";

import { useState, useEffect } from "react";
import type { ToyProps } from "@/lib/lessons/types";

const PROJECTS = [
  {
    icon: "🌡️",
    name: "Temperature Converter",
    desc: "Turn Celsius into Fahrenheit",
    plan: [
      "Formula: (C × 9 ÷ 5) + 32",
      "Wrap it in a function",
      "Test with 25°C",
    ],
    code: [
      "def to_fahrenheit(c):",
      "    return (c * 9/5) + 32",
      "",
      "temp = 25",
      "print(to_fahrenheit(temp))",
    ],
    output: ["77.0"],
    check: "25°C = 77°F  ✓",
  },
  {
    icon: "👋",
    name: "Greeting Card",
    desc: "Make a personalised hello",
    plan: [
      "Take a name as input",
      "Print a friendly greeting",
      "Add a kind message",
    ],
    code: [
      "def greet(name):",
      "    print('Hello, ' + name + '! 👋')",
      "    print('Have an amazing day!')",
      "",
      "greet('Anay')",
    ],
    output: ["Hello, Anay! 👋", "Have an amazing day!"],
    check: "Works perfectly  ✓",
  },
  {
    icon: "🎲",
    name: "Lucky Number",
    desc: "Pick a random number 1–10",
    plan: [
      "Import Python's random tool",
      "Pick a number between 1 and 10",
      "Show it with a fun message",
    ],
    code: [
      "import random",
      "",
      "n = random.randint(1, 10)",
      "print('Your lucky number:', n, '🎲')",
    ],
    output: ["Your lucky number: 7 🎲"],
    check: "Different every time  ✓",
  },
] as const;

type Phase = "choose" | "plan" | "code" | "run" | "done";

export function CodingWithAiToy({ onComplete }: ToyProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("choose");
  const [planShown, setPlanShown] = useState(0);
  const [codeShown, setCodeShown] = useState(0);

  const p = picked !== null ? PROJECTS[picked] : null;

  function pick(i: number) {
    setPicked(i);
    setPhase("plan");
    setPlanShown(0);
    setCodeShown(0);
  }

  // Reveal plan items one by one, then advance to code
  useEffect(() => {
    if (phase !== "plan" || !p) return;
    if (planShown >= p.plan.length) {
      const t = setTimeout(() => { setPhase("code"); setCodeShown(0); }, 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPlanShown((n) => n + 1), 650);
    return () => clearTimeout(t);
  }, [phase, planShown, p]);

  // Reveal code lines one by one, then advance to run
  useEffect(() => {
    if (phase !== "code" || !p) return;
    if (codeShown >= p.code.length) {
      const t = setTimeout(() => setPhase("run"), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCodeShown((n) => n + 1), 230);
    return () => clearTimeout(t);
  }, [phase, codeShown, p]);

  // Auto-advance run → done
  useEffect(() => {
    if (phase !== "run") return;
    const t = setTimeout(() => setPhase("done"), 1500);
    return () => clearTimeout(t);
  }, [phase]);

  const phaseOrder: Phase[] = ["plan", "code", "run", "done"];
  const phaseLabels = ["📋 Plan", "⌨️ Code", "▶ Run", "✅ Done"];

  return (
    <div className="cwa-wrap">
      {/* Choose screen */}
      {phase === "choose" && (
        <>
          <div className="cwa-intro">
            <span className="cwa-bot">🤖</span>
            <div className="cwa-intro-bubble">
              Pick a mini-project and watch me plan, write, and test the code!
            </div>
          </div>
          <div className="cwa-project-list">
            {PROJECTS.map((proj, i) => (
              <button key={i} className="cwa-project-btn" onClick={() => pick(i)}>
                <span className="cwa-proj-icon">{proj.icon}</span>
                <div className="cwa-proj-info">
                  <span className="cwa-proj-name">{proj.name}</span>
                  <span className="cwa-proj-desc">{proj.desc}</span>
                </div>
                <span className="cwa-proj-arrow">→</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Workspace */}
      {p && phase !== "choose" && (
        <div className="cwa-workspace">
          {/* Project header */}
          <div className="cwa-ws-head">
            <span className="cwa-ws-icon">{p.icon}</span>
            <span className="cwa-ws-name">{p.name}</span>
          </div>

          {/* Phase tracker */}
          <div className="cwa-phases">
            {phaseOrder.map((ph, i) => {
              const reached = phaseOrder.indexOf(phase) >= i;
              return (
                <div key={ph} className={`cwa-phase${reached ? " cwa-phase-on" : ""}`}>
                  {phaseLabels[i]}
                </div>
              );
            })}
          </div>

          {/* Plan section */}
          <div className="cwa-block">
            <div className="cwa-block-head">📋 Plan</div>
            <div className="cwa-plan">
              {p.plan.slice(0, phase === "plan" ? planShown : p.plan.length).map((item, i) => (
                <div key={i} className="cwa-plan-row">
                  <span className="cwa-plan-tick">✓</span>
                  <span>{item}</span>
                </div>
              ))}
              {phase === "plan" && planShown < p.plan.length && (
                <div className="thinking"><span /><span /><span /></div>
              )}
            </div>
          </div>

          {/* Code section */}
          {phaseOrder.indexOf(phase) >= 1 && (
            <div className="cwa-block">
              <div className="cwa-block-head">⌨️ Code</div>
              <div className="cwa-code">
                {p.code.slice(0, phase === "code" ? codeShown : p.code.length).map((line, i) => (
                  <div key={i} className="cwa-code-line">
                    {line || " "}
                  </div>
                ))}
                {phase === "code" && codeShown < p.code.length && (
                  <span className="cwa-cursor">▊</span>
                )}
              </div>
            </div>
          )}

          {/* Output section */}
          {phaseOrder.indexOf(phase) >= 2 && (
            <div className="cwa-block">
              <div className="cwa-block-head">▶ Output</div>
              <div className="cwa-terminal">
                {phase === "run" ? (
                  <div className="thinking"><span /><span /><span /></div>
                ) : (
                  <>
                    {p.output.map((line, i) => (
                      <div key={i} className="cwa-output-line">{line}</div>
                    ))}
                    <div className="cwa-output-check">{p.check}</div>
                  </>
                )}
              </div>
            </div>
          )}

          {phase === "done" && (
            <>
              <div className="cwa-success">
                Plan → write → test. That&apos;s exactly how coding agents work! 💻
              </div>
              <div className="toy-actions">
                <button className="btn primary" onClick={onComplete}>
                  💻 It works! Continue →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
