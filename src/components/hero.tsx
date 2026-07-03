"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useMode } from "@/lib/mode/mode-context";
import { allLessons, nextLesson } from "@/lib/lessons/registry";
import {
  createPlayer,
  resetPlayer,
  setName,
  switchPlayer,
  usePlayer,
  type Player,
} from "@/lib/progress";
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

const display = (p: Player) => p.name || "Explorer";

function NameForm({
  prompt,
  cta,
  onSubmit,
}: {
  prompt: string;
  cta: string;
  onSubmit: (name: string) => void;
}) {
  const [value, setValue] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  }
  return (
    <form className="namebox" onSubmit={submit}>
      <label>
        🤖 {prompt}
        <span className="namebox-row">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Your name"
            maxLength={20}
            autoComplete="off"
          />
          <button type="submit" className="btn primary sm" disabled={!value.trim()}>
            {cta}
          </button>
        </span>
      </label>
    </form>
  );
}

export function Hero() {
  const { mode } = useMode();
  const copy = COPY[mode];
  const router = useRouter();
  const { save, player, hydrated } = usePlayer();
  const [confirmReset, setConfirmReset] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [addingPlayer, setAddingPlayer] = useState(false);

  const done = player?.completed.length ?? 0;
  // A nameless player with no progress only exists mid-flow; treat as fresh.
  const returning = hydrated && !!player && (done > 0 || player.name !== "");

  // ----- fresh visitor: the original hero + a skippable name capture -----
  if (!returning) {
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
          <NameForm
            prompt="What should Anayo call you?"
            cta="✨ Let's go!"
            onSubmit={(name) => {
              createPlayer(name);
              router.push("/journey");
            }}
          />
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

  // ----- returning player -----
  const name = display(player);
  const next = nextLesson(player.completed);
  const allDone = done > 0 && !next;

  const h1 = allDone ? (
    <>
      You did it, <span className="grad">{name}</span>! 🎉
    </>
  ) : done > 0 ? (
    <>
      Welcome back, <span className="grad">{name}</span>! 👋
    </>
  ) : (
    <>
      Hi <span className="grad">{name}</span>! Ready for your <span className="grad">quest</span>?
    </>
  );

  const sub = allDone
    ? `All ${LIVE_COUNT} superpowers unlocked. Revisit any world — or show a friend how AI really works!`
    : done > 0
      ? `You've unlocked ${done} of ${LIVE_COUNT} superpowers. Anayo can't wait to learn the next one!`
      : copy.sub;

  const speech = allDone
    ? `${name}, you unlocked EVERYTHING! 🏆`
    : done > 0
      ? `Hi ${name}! Ready to keep going? 🚀`
      : `Hi ${name}! Ready for our quest? 🚀`;

  return (
    <section className="hero">
      <div>
        <span className="kicker">
          <span className="ping" /> A quest for curious humans, age 8 to 88
        </span>
        <h1 className="hero-h">{h1}</h1>
        <p className="sub">{sub}</p>

        <div className="cta-row">
          {next ? (
            done > 0 ? (
              <Link href={`/learn/${next.world.slug}/${next.lesson.slug}`} className="btn primary">
                ▶ Continue: {next.lesson.title}
              </Link>
            ) : (
              <Link href="/journey" className="btn primary">
                ⚡ Start the quest
              </Link>
            )
          ) : (
            <Link href="/journey" className="btn primary">
              🗺️ Revisit the journey
            </Link>
          )}
          {done > 0 && !confirmReset && (
            <button className="btn ghost" onClick={() => setConfirmReset(true)}>
              ↺ Start from scratch
            </button>
          )}
        </div>

        {confirmReset && (
          <div className="confirm-row">
            <span>Erase {name}&apos;s progress?</span>
            <button
              className="btn ghost sm danger"
              onClick={() => {
                resetPlayer(player.id);
                setConfirmReset(false);
              }}
            >
              Yes, erase
            </button>
            <button className="btn ghost sm" onClick={() => setConfirmReset(false)}>
              Keep it
            </button>
          </div>
        )}

        {player.name === "" && (
          <NameForm
            prompt="Tell Anayo your name!"
            cta="✨ Save"
            onSubmit={(n) => setName(player.id, n)}
          />
        )}

        <div className="hero-links">
          <button className="linkbtn" onClick={() => setShowPicker((v) => !v)}>
            Not {name}? Switch player
          </button>
        </div>

        {showPicker && save && (
          <div className="picker">
            {save.players.map((p) => (
              <button
                key={p.id}
                className={`picker-item${p.id === player.id ? " on" : ""}`}
                onClick={() => {
                  switchPlayer(p.id);
                  setShowPicker(false);
                  setAddingPlayer(false);
                  setConfirmReset(false);
                }}
              >
                {display(p)} — {p.completed.length}/{LIVE_COUNT} ⭐
              </button>
            ))}
            {addingPlayer ? (
              <NameForm
                prompt="New player's name?"
                cta="✨ Join!"
                onSubmit={(n) => {
                  createPlayer(n);
                  setShowPicker(false);
                  setAddingPlayer(false);
                  setConfirmReset(false);
                }}
              />
            ) : (
              <button className="picker-item add" onClick={() => setAddingPlayer(true)}>
                ＋ New player
              </button>
            )}
          </div>
        )}
      </div>
      <AnayoBuddy speech={speech} />
    </section>
  );
}
