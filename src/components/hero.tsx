"use client";

import Link from "next/link";
import { useMode } from "@/lib/mode/mode-context";
import { allLessons } from "@/lib/lessons/registry";
import { AnayoBuddy } from "./anayo-buddy";

const LIVE_COUNT = allLessons().filter(({ lesson }) => lesson.live).length;

const COPY = {
  explorer: {
    h: (
      <>
        Your <span className="grad">quest</span>:
        <br />
        build your own <span className="grad">AI buddy!</span>
      </>
    ),
    sub: "Anayo the robot needs YOU. Travel through 5 worlds, crack the secrets of how AI really thinks, and teach your buddy to read, guess, focus and code — one superpower at a time.",
    speech: "Hi, I'm Anayo! Ready for our quest? 🚀",
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
          <span className="ping" /> A quest for curious humans, age 8 to 88
        </span>
        <h1 className="hero-h">{copy.h}</h1>
        <p className="sub">{copy.sub}</p>
        <div className="cta-row">
          <Link href="/journey" className="btn primary">
            ⚡ Start the quest
          </Link>
        </div>
        <div className="miniproof">
          <div>
            <b>5</b> worlds to explore
          </div>
          <div>
            <b>{LIVE_COUNT}</b> superpowers to unlock
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
