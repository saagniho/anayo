import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="wrap">
        <Hero />
        <div className="footnote">Anayo means &ldquo;let us see joy&rdquo; 💜</div>
      </main>
    </>
  );
}
