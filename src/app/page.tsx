import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { WORLDS } from "@/lib/lessons/registry";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="wrap">
        <Hero />

        <div className="section-h">The 5 worlds · your buddy grows in each</div>
        <div className="worlds">
          {WORLDS.map((w) => (
            <Link key={w.id} href="/journey" className="wcard" style={{ borderTopColor: w.color }}>
              <span className="em">{w.emoji}</span>
              <h4>{w.title}</h4>
              <p>{w.tagline}</p>
              <div className="count">{w.lessons.length} lessons</div>
            </Link>
          ))}
        </div>

        <div className="footnote">
          Anayo means “let us see joy” 💜 · made for curious kids 8–15 and the grown-ups who love them
        </div>
      </main>
    </>
  );
}
