import { SiteHeader } from "@/components/site-header";
import { JourneyMap } from "@/components/journey-map";
import { WORLDS } from "@/lib/lessons/registry";

export const metadata = { title: "Your Journey — Anayo" };

export default function JourneyPage() {
  return (
    <>
      <SiteHeader />
      <main className="wrap">
        <JourneyMap worlds={WORLDS} />
      </main>
    </>
  );
}
