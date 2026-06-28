"use client";

import Link from "next/link";
import { useMode } from "@/lib/mode/mode-context";
import { AnayoBuddy } from "./anayo-buddy";

const COPY = {
  explorer: {
    h: (
      <>
        Don&apos;t just <span className="grad">use</span> AI.
        <br />
        Build your own <span className="grad">AI buddy.</span>
      </>
    ),
    sub: "Every big AI idea — tokens, transformers, agents — becomes a real superpower you unlock for a little buddy you create. Learn by playing. Watch it come alive.",
    speech: "Hi, I'm Anayo! Teach me? 👋",
  },
  curious: {
    h: (
      <>
        Finally <span className="grad">understand</span> AI —
        <br />
        by <span className="grad">building one.</span>
      </>
    ),
    sub: "Tokens, transformers, agents, agentic workflows. Each concept is taught hands-on through a companion you assemble — with a 'go deeper' layer whenever you want the real mechanics.",
    speech: "Curious how I work? Let's dig in. 🧠",
  },
} as const;

export function Hero() {
  const { mode } = useMode();
  const copy = COPY[mode];

  return (
    <section className="hero">
      <div>
        <span className="kicker">
          <span className="ping" /> For curious humans, age 8 to 88
        </span>
        <h1 className="hero-h">{copy.h}</h1>
        <p className="sub">{copy.sub}</p>
        <div className="cta-row">
          <Link href="/journey" className="btn primary">
            ✨ Start building
          </Link>
          <Link href="/journey" className="btn ghost">
            See the journey →
          </Link>
        </div>
        <div className="miniproof">
          <div>
            <b>5</b> worlds to explore
          </div>
          <div>
            <b>11</b> hands-on lessons
          </div>
          <div>
            <b>1</b> buddy that&apos;s all yours
          </div>
        </div>
      </div>
      <AnayoBuddy speech={copy.speech} />
    </section>
  );
}
