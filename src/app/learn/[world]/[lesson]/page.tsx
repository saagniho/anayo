import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { LessonPlayer } from "@/components/lessons/lesson-player";
import { getLesson, allLessons } from "@/lib/lessons/registry";

export function generateStaticParams() {
  return allLessons().map(({ world, lesson }) => ({
    world: world.slug,
    lesson: lesson.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ world: string; lesson: string }>;
}) {
  const { world, lesson } = await params;
  const found = getLesson(world, lesson);
  return { title: found ? `${found.lesson.title} — Anayo` : "Lesson — Anayo" };
}

export default async function LessonRoute({
  params,
}: {
  params: Promise<{ world: string; lesson: string }>;
}) {
  const { world, lesson } = await params;
  const found = getLesson(world, lesson);
  if (!found) notFound();

  return (
    <>
      <SiteHeader />
      <main className="wrap">
        <LessonPlayer worldSlug={found.world.slug} lesson={found.lesson} />
      </main>
    </>
  );
}
