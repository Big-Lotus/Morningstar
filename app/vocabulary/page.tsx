"use client";

import { useLearningStore } from "@/providers/learning-store";

export default function VocabularyPage() {
  const { savedWords } = useLearningStore();

  return (
    <main className="mx-auto max-w-[900px]">
      <section className="rounded-[2rem] border border-line bg-paper/85 px-7 py-8 shadow-soft md:px-10">
        <p className="text-sm uppercase tracking-[0.22em] text-clay">
          Vocabulary Notebook
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-5xl font-semibold text-ink">
          Words worth returning to
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-clay">
          Each saved entry keeps the original sentence, so review feels closer to
          re-reading than memorizing from a list.
        </p>
      </section>

      <section className="mt-8 space-y-4">
        {savedWords.length > 0 ? (
          savedWords.map((entry) => (
            <article
              key={entry.id}
              className="rounded-[1.75rem] border border-line bg-paper/95 p-5 shadow-soft"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] text-3xl font-semibold text-ink">
                    {entry.word}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-clay">
                    From {entry.articleSlug.replaceAll("-", " ")}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-clay">{entry.sentence}</p>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-line bg-paper/70 p-8 text-center text-clay">
            No saved words yet. Select text while reading an article to start
            building your notebook.
          </div>
        )}
      </section>
    </main>
  );
}
