import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { WORLDS } from "@/lib/lessons/registry";

export const metadata = { title: "The Journey (Classic) — Anayo" };

export default function JourneyClassicPage() {
  let num = 0;
  const lessonNums = new Map<string, number>();
  for (const w of WORLDS) for (const l of w.lessons) lessonNums.set(l.id, ++num);

  return (
    <>
      <SiteHeader />
      <main className="wrap">
        <div className="map">
          <div className="maphead">
            <h2>🗺️ Your Journey (Classic)</h2>
            <p>
              Five worlds. Each one teaches Anayo a new superpower. World 1 opens
              first — the rest unlock as you go.
            </p>
          </div>

          <div className="path">
            {WORLDS.map((w, i) => (
              <div key={w.id} className={`node ${i === 0 ? "now" : "lock"}`}>
                {i > 0 && <span className="connector" />}
                <div className="orb" style={{ borderColor: w.color }}>
                  {w.emoji}
                </div>
                <div className="meta">
                  <h3>{w.title}</h3>
                  <p>{w.tagline}</p>
                  {i === 0 ? (
                    <Link href={`/learn/${w.slug}/${w.lessons[0].slug}`} className="start-badge">
                      ▶ Start here
                    </Link>
                  ) : (
                    <span className="badge">🔒 Locked</span>
                  )}
                  <div className="lesson-list">
                    {w.lessons.map((l) =>
                      l.live ? (
                        <Link key={l.id} href={`/learn/${w.slug}/${l.slug}`} className="lchip live">
                          ▶ {lessonNums.get(l.id)}. {l.ability.icon} {l.title}
                        </Link>
                      ) : (
                        <span key={l.id} className="lchip">
                          {lessonNums.get(l.id)}. {l.ability.icon} {l.title}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="footnote">
            🛠️ Lessons are being built right now — you&apos;re watching it happen live.
          </div>
        </div>
      </main>
    </>
  );
}
