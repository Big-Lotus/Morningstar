"use client";

import { TopicCard } from "@/components/TopicCard";
import { useLearningStore } from "@/providers/learning-store";
import { topics } from "@/lib/data";

export default function BookmarkPage() {
  const { bookmarkedSlugs } = useLearningStore();
  const bookmarkedTopics = topics.filter((topic) =>
    bookmarkedSlugs.includes(topic.slug)
  );

  return (
    <main className="mx-auto max-w-[900px]">
      <section className="rounded-[2rem] border border-line bg-paper/85 px-7 py-8 shadow-soft md:px-10">
        <p className="text-sm uppercase tracking-[0.22em] text-clay">Bookmarks</p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-5xl font-semibold text-ink">
          Saved for a slower second read
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-clay">
          Keep articles that deserve another quiet session without turning the
          app into a crowded archive.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {bookmarkedTopics.length > 0 ? (
          bookmarkedTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-line bg-paper/70 p-8 text-center text-clay md:col-span-2">
            No bookmarks yet. Save a topic from the home page when you want to
            return to that issue later.
          </div>
        )}
      </section>
    </main>
  );
}
