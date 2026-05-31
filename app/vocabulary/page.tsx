"use client";

import { FormEvent, useMemo, useState } from "react";

import { AuthPanel } from "@/components/AuthPanel";
import { useLearningStore } from "@/providers/learning-store";

export default function VocabularyPage() {
  const {
    bookmarkedSlugs,
    currentUsername,
    customArticles,
    feedArticles,
    isHydrated,
    removeWord,
    saveWord,
    savedWords
  } = useLearningStore();
  const sourceOptions = useMemo(
    () => [
      ...customArticles,
      ...feedArticles.filter((article) => bookmarkedSlugs.includes(article.slug))
    ],
    [bookmarkedSlugs, customArticles, feedArticles]
  );
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [sentence, setSentence] = useState("");
  const [sourceSlug, setSourceSlug] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedSourceSlug = sourceSlug || sourceOptions[0]?.slug;

    if (!selectedSourceSlug) {
      return;
    }

    saveWord({
      word,
      meaning,
      sentence,
      sourceSlug: selectedSourceSlug
    });
    setWord("");
    setMeaning("");
    setSentence("");
    setSourceSlug(selectedSourceSlug);
  };

  if (!isHydrated) {
    return null;
  }

  if (!currentUsername) {
    return <AuthPanel />;
  }

  return (
    <main className="mx-auto w-full">
      <section className="rounded-[2rem] border border-line bg-paper/85 px-7 py-8 shadow-soft md:px-10">
        <p className="text-sm uppercase tracking-[0.22em] text-clay">
          Vocabulary Notebook
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-5xl font-semibold text-ink">
          Words worth returning to
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-clay">
          Keep the word, meaning, example, and source together so review feels
          closer to re-reading than memorizing from a list.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-[2rem] border border-line bg-paper/95 p-6 shadow-soft md:p-8"
      >
        <p className="text-sm uppercase tracking-[0.22em] text-moss">
          Add Vocabulary
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-clay">
              Word
            </span>
            <input
              value={word}
              onChange={(event) => setWord(event.target.value)}
              className="mt-2 w-full rounded-[1rem] border border-line bg-paper px-4 py-3 text-base text-ink outline-none soft-ring focus:border-moss"
              placeholder="resilience"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-clay">
              Meaning
            </span>
            <input
              value={meaning}
              onChange={(event) => setMeaning(event.target.value)}
              className="mt-2 w-full rounded-[1rem] border border-line bg-paper px-4 py-3 text-base text-ink outline-none soft-ring focus:border-moss"
              placeholder="The ability to recover and keep going"
            />
          </label>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-clay">
              Source
            </span>
            <select
              value={sourceSlug}
              onChange={(event) => setSourceSlug(event.target.value)}
              className="mt-2 w-full rounded-[1rem] border border-line bg-paper px-4 py-3 text-base text-ink outline-none soft-ring focus:border-moss"
            >
              <option value="">Choose a saved or added source</option>
              {sourceOptions.map((source) => (
                <option key={source.slug} value={source.slug}>
                  {source.title}
                </option>
              ))}
            </select>
          </label>
          <div className="rounded-[1rem] border border-line bg-accent/35 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-clay">
              Saved fields
            </p>
            <p className="mt-2 text-sm leading-6 text-clay">
              Word, meaning, example, and article source stay attached to your
              account.
            </p>
          </div>
        </div>
        <label className="mt-4 block">
          <span className="text-xs uppercase tracking-[0.18em] text-clay">
            Example
          </span>
          <textarea
            value={sentence}
            onChange={(event) => setSentence(event.target.value)}
            className="mt-2 min-h-[120px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-base leading-7 text-ink outline-none soft-ring focus:border-moss"
            placeholder="Write the example where you saw this word."
          />
        </label>
        <button
          type="submit"
          disabled={
            !word.trim() ||
            !meaning.trim() ||
            !sentence.trim() ||
            sourceOptions.length === 0
          }
          className="soft-ring mt-4 rounded-full border border-moss bg-moss px-5 py-2 text-sm font-medium text-paper transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
        >
          Save word
        </button>
      </form>

      <section className="mt-8 space-y-4">
        {savedWords.length > 0 ? (
          savedWords.map((entry) => (
            <article
              key={entry.id}
              className="rounded-[1.75rem] border border-line bg-paper/95 p-6 shadow-soft"
            >
              <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-moss">
                    Word
                  </p>
                  <h3 className="mt-2 break-words font-[family-name:var(--font-heading)] text-4xl font-semibold leading-tight text-ink md:text-5xl">
                    {entry.word}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => removeWord(entry.id)}
                  className="soft-ring shrink-0 rounded-full border border-line bg-paper px-3 py-1 text-xs text-clay hover:border-[#c96438] hover:text-[#c96438]"
                >
                  Delete
                </button>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
                <section className="rounded-[1.25rem] border border-line bg-accent/45 p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-clay">
                    Meaning
                  </p>
                  <p className="mt-2 text-lg font-medium leading-7 text-ink">
                    {entry.meaning || "No meaning saved yet."}
                  </p>
                </section>
                <section className="rounded-[1.25rem] border border-line bg-[#fff9f1] p-4">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#c96438]">
                    Example
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-heading)] text-2xl leading-8 text-ink">
                    {entry.sentence}
                  </p>
                </section>
              </div>

              <footer className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                <span className="rounded-full border border-line bg-paper px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-clay">
                  Source
                </span>
                <span className="text-sm font-medium uppercase tracking-[0.14em] text-moss">
                  {entry.sourceSlug.replaceAll("-", " ")}
                </span>
              </footer>
            </article>
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-line bg-paper/70 p-8 text-center text-clay">
            No saved words yet. Save vocabulary from a source once the reading
            tools are connected.
          </div>
        )}
      </section>
    </main>
  );
}
