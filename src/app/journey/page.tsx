import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { WORLDS } from "@/lib/lessons/registry";

export const metadata = { title: "The Journey — Anayo" };

export default function JourneyPage() {
  return (
    <>
      <SiteHeader />
      <main className="wrap">
        <div className="map">
          <div className="maphead">
            <h2>🗺️ Your Journey</h2>
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
                  <div className="lesson-list">
                    {w.lessons.map((l) =>
                      l.live ? (
                        <Link
                          key={l.id}
                          href={`/learn/${w.slug}/${l.slug}`}
                          className="lchip live"
                        >
                          ▶ {l.ability.icon} {l.title}
                        </Link>
                      ) : (
                        <span key={l.id} className="lchip">
                          {l.ability.icon} {l.title}
                        </span>
                      ),
                    )}
                  </div>
                  <span className="badge">
                    {i === 0 ? "● Start here" : "🔒 Locked"}
                  </span>
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
