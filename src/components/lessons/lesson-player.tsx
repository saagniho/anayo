"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import Link from "next/link";
import { useMode } from "@/lib/mode/mode-context";
import { AnayoBuddy } from "@/components/anayo-buddy";
import type { LessonMeta, ToyProps } from "@/lib/lessons/types";
import { WhatIsAiToy } from "./toys/what-is-ai";
import { WordsIntoNumbersToy } from "./toys/words-into-numbers";
import { PredictNextWordToy } from "./toys/predict-next-word";
import { TheBigBrainToy } from "./toys/the-big-brain";
import { PayingAttentionToy } from "./toys/paying-attention";
import { TheArtOfAskingToy } from "./toys/the-art-of-asking";

/** Slug → interactive toy. Adding a playable lesson = add one entry here. */
const TOYS: Record<string, ComponentType<ToyProps>> = {
  "what-is-ai": WhatIsAiToy,
  "words-into-numbers": WordsIntoNumbersToy,
  "predict-the-next-word": PredictNextWordToy,
  "the-big-brain": TheBigBrainToy,
  "paying-attention": PayingAttentionToy,
  "the-art-of-asking": TheArtOfAskingToy,
};

type Phase = "hook" | "play" | "aha" | "done";

function ConfettiBurst({ trigger }: { trigger: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!trigger) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const COL = ["#8b5cff", "#27e0f0", "#ff7a59", "#34d399", "#ffb84d", "#ff5db1"];
    let parts = Array.from({ length: 110 }, (_, i) => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2.6,
      vx: (Math.random() - 0.5) * 15,
      vy: Math.random() * -16 - 4,
      g: 0.42,
      s: Math.random() * 7 + 4,
      c: COL[i % COL.length],
      r: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.4,
      life: 100,
    }));
    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts = parts.filter((p) => p.life > 0);
      for (const p of parts) {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        p.life--;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.globalAlpha = Math.max(0, p.life / 100);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        ctx.restore();
      }
      if (parts.length) raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [trigger]);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 70, pointerEvents: "none" }} />;
}

export function LessonPlayer({ lesson }: { worldSlug: string; lesson: LessonMeta }) {
  const { mode } = useMode();
  const [phase, setPhase] = useState<Phase>("hook");
  const [burst, setBurst] = useState(0);
  const Toy = TOYS[lesson.slug];
  const aha = lesson.aha ? lesson.aha[mode] : lesson.concept;

  return (
    <div className="player">
      <ConfettiBurst trigger={burst} />
      <div className="player-head">
        <Link href="/journey" className="back">
          ← Journey
        </Link>
        <span className="crumb">
          {lesson.ability.icon} {lesson.title}
        </span>
        <span />
      </div>

      {phase === "hook" && (
        <div className="stage-card">
          <div className="big-emoji">{lesson.ability.icon}</div>
          <h1 className="lesson-title">{lesson.title}</h1>
          <p className="hook">{lesson.hook}</p>
          <button className="btn primary" onClick={() => setPhase("play")}>
            Let&apos;s play ▶
          </button>
        </div>
      )}

      {phase === "play" &&
        (Toy ? (
          <Toy
            mode={mode}
            onComplete={() => {
              setBurst((b) => b + 1);
              setPhase("aha");
            }}
          />
        ) : (
          <div className="stage-card">
            <div className="big-emoji">🛠️</div>
            <p className="hook">This lesson&apos;s game is coming soon.</p>
            <Link className="btn ghost" href="/journey">
              ← Back to the journey
            </Link>
          </div>
        ))}

      {phase === "aha" && (
        <div className="stage-card ahacard">
          <AnayoBuddy speech={`I learned to ${lesson.ability.label}! ${lesson.ability.icon}`} tray={[]} />
          <div className="aha-text">
            <div className="ability-pop">
              {lesson.ability.icon} <b>{lesson.ability.label}</b> unlocked
            </div>
            <p>{aha}</p>
            <button className="btn primary" onClick={() => setPhase("done")}>
              Got it! →
            </button>
          </div>
        </div>
      )}

      {phase === "done" && (
        <div className="stage-card">
          <div className="big-emoji">🎉</div>
          <h1 className="lesson-title">Anayo learned to {lesson.ability.label}!</h1>
          <p className="hook">One superpower down. More lessons are landing soon.</p>
          <Link href="/journey" className="btn primary">
            ← Back to the journey
          </Link>
        </div>
      )}
    </div>
  );
}
