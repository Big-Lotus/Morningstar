"use client";

import { FormEvent, useMemo, useState } from "react";

import { AuthPanel } from "@/components/AuthPanel";
import { useLearningStore } from "@/providers/learning-store";
import { Article, SavedVocabulary } from "@/lib/types";

export default function VocabularyPage() {
  const {
    bookmarkedSlugs,
    currentUsername,
    customArticles,
    feedArticles,
    isHydrated,
    removeWord,
    saveWord,
    savedWords,
    syncError,
    updateWord
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedSourceSlug = sourceSlug || undefined;

    const didSave = await saveWord({
      word,
      meaning,
      sentence,
      sourceSlug: selectedSourceSlug
    });

    if (!didSave) {
      return;
    }

    setWord("");
    setMeaning("");
    setSentence("");
    setSourceSlug(selectedSourceSlug ?? "");
  };

  if (!isHydrated) {
    return null;
  }

  if (!currentUsername) {
    return <AuthPanel />;
  }

  return (
    <main className="mx-auto w-full">
      <section className="rounded-[1.75rem] border border-line bg-paper/90 px-6 py-8 shadow-soft md:px-9">
        <p className="text-sm font-medium text-moss">
          Vocabulary notebook
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-5xl font-semibold tracking-[-0.06em] text-ink md:text-7xl">
          Words worth returning to
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-clay">
          Keep the word, meaning, example, and source together so review feels
          closer to re-reading than memorizing from a list.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-[1.75rem] border border-line bg-paper/95 p-5 shadow-soft md:p-7"
      >
        <p className="text-sm font-medium text-moss">
          Add vocabulary
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <label className="block">
            <span className="text-xs font-medium text-clay">
              Word
            </span>
            <input
              value={word}
              onChange={(event) => setWord(event.target.value)}
              className="mt-2 w-full rounded-[0.9rem] border border-line bg-white px-4 py-3 text-base text-ink outline-none soft-ring focus:border-moss"
              placeholder="resilience"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-clay">
              Meaning
            </span>
            <input
              value={meaning}
              onChange={(event) => setMeaning(event.target.value)}
              className="mt-2 w-full rounded-[0.9rem] border border-line bg-white px-4 py-3 text-base text-ink outline-none soft-ring focus:border-moss"
              placeholder="The ability to recover and keep going"
            />
          </label>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <label className="block">
            <span className="text-xs font-medium text-clay">
              Source
            </span>
            <select
              value={sourceSlug}
              onChange={(event) => setSourceSlug(event.target.value)}
              className="mt-2 w-full rounded-[0.9rem] border border-line bg-white px-4 py-3 text-base text-ink outline-none soft-ring focus:border-moss"
            >
              <option value="">No source attached</option>
              {sourceOptions.map((source) => (
                <option key={source.slug} value={source.slug}>
                  {source.title}
                </option>
              ))}
            </select>
          </label>
          <div className="rounded-[0.9rem] border border-line bg-accent px-4 py-3">
            <p className="text-xs font-medium text-clay">
              Saved fields
            </p>
            <p className="mt-2 text-sm leading-6 text-clay">
              Word, meaning, and example can be saved on their own. Choose a
              source only when it helps your review.
            </p>
          </div>
        </div>
        <label className="mt-4 block">
          <span className="text-xs font-medium text-clay">
            Example
          </span>
          <textarea
            value={sentence}
            onChange={(event) => setSentence(event.target.value)}
            className="mt-2 min-h-[120px] w-full resize-y rounded-[0.9rem] border border-line bg-white px-4 py-3 text-base leading-7 text-ink outline-none soft-ring focus:border-moss"
            placeholder="Write the example where you saw this word."
          />
        </label>
        <button
          type="submit"
          disabled={
            !word.trim() ||
            !meaning.trim() ||
            !sentence.trim()
          }
          className="soft-ring mt-4 rounded-full border border-ink bg-ink px-5 py-2 text-sm font-medium text-paper transition hover:-translate-y-0.5 hover:bg-moss disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
        >
          Save word
        </button>
        {syncError ? (
          <p className="mt-3 text-sm leading-6 text-red-700" role="alert">
            {syncError}
          </p>
        ) : null}
      </form>

      <section className="mt-8 space-y-4">
        {savedWords.length > 0 ? (
          savedWords.map((entry) => (
            <VocabularyCard
              key={entry.id}
              entry={entry}
              sourceOptions={sourceOptions}
              onDelete={() => removeWord(entry.id)}
              onUpdate={(nextEntry) => updateWord(entry.id, nextEntry)}
            />
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

function VocabularyCard({
  entry,
  sourceOptions,
  onDelete,
  onUpdate
}: {
  entry: SavedVocabulary;
  sourceOptions: Article[];
  onDelete: () => void;
  onUpdate: (entry: Omit<SavedVocabulary, "id">) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    word: entry.word,
    meaning: entry.meaning,
    sentence: entry.sentence,
    sourceSlug: entry.sourceSlug ?? ""
  });

  const resetDraft = () => {
    setDraft({
      word: entry.word,
      meaning: entry.meaning,
      sentence: entry.sentence,
      sourceSlug: entry.sourceSlug ?? ""
    });
  };

  const submitEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUpdate({
      word: draft.word,
      meaning: draft.meaning,
      sentence: draft.sentence,
      sourceSlug: draft.sourceSlug || undefined
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form
        onSubmit={submitEdit}
        className="rounded-[1.35rem] border border-line bg-paper p-5 shadow-soft"
      >
        <div className="flex flex-col justify-between gap-3 border-b border-line pb-4 md:flex-row md:items-start">
          <div>
            <p className="text-xs font-medium text-moss">Editing word</p>
            <h3 className="mt-2 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-[-0.05em] text-ink">
              {entry.word}
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                resetDraft();
                setIsEditing(false);
              }}
              className="soft-ring rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-clay hover:border-moss hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !draft.word.trim() ||
                !draft.meaning.trim() ||
                !draft.sentence.trim()
              }
              className="soft-ring rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:-translate-y-0.5 hover:bg-moss disabled:cursor-not-allowed disabled:bg-line disabled:text-clay"
            >
              Save changes
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <label className="block">
            <span className="text-xs font-medium text-clay">Word</span>
            <input
              value={draft.word}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  word: event.target.value
                }))
              }
              className="mt-2 w-full rounded-[0.9rem] border border-line bg-white px-4 py-3 text-base text-ink outline-none soft-ring focus:border-moss"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-clay">Meaning</span>
            <input
              value={draft.meaning}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  meaning: event.target.value
                }))
              }
              className="mt-2 w-full rounded-[0.9rem] border border-line bg-white px-4 py-3 text-base text-ink outline-none soft-ring focus:border-moss"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <label className="block">
            <span className="text-xs font-medium text-clay">Example</span>
            <textarea
              value={draft.sentence}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  sentence: event.target.value
                }))
              }
              className="mt-2 min-h-[120px] w-full resize-y rounded-[0.9rem] border border-line bg-white px-4 py-3 text-base leading-7 text-ink outline-none soft-ring focus:border-moss"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-clay">Source</span>
            <select
              value={draft.sourceSlug}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  sourceSlug: event.target.value
                }))
              }
              className="mt-2 w-full rounded-[0.9rem] border border-line bg-white px-4 py-3 text-base text-ink outline-none soft-ring focus:border-moss"
            >
              <option value="">No source attached</option>
              {sourceOptions.map((source) => (
                <option key={source.slug} value={source.slug}>
                  {source.title}
                </option>
              ))}
            </select>
          </label>
        </div>
      </form>
    );
  }

  return (
    <article className="rounded-[1.35rem] border border-line bg-paper p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-moss">Word</p>
          <h3 className="mt-2 break-words font-[family-name:var(--font-heading)] text-4xl font-semibold leading-tight tracking-[-0.05em] text-ink md:text-5xl">
            {entry.word}
          </h3>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              resetDraft();
              setIsEditing(true);
            }}
            className="soft-ring rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-clay hover:border-moss hover:text-ink"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="soft-ring rounded-full border border-line bg-white px-3 py-1 text-xs text-clay hover:border-red-400 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-[1rem] border border-line bg-accent p-4">
          <p className="text-xs font-medium text-clay">Meaning</p>
          <p className="mt-2 text-lg font-medium leading-7 text-ink">
            {entry.meaning || "No meaning saved yet."}
          </p>
        </section>
        <section className="rounded-[1rem] border border-line bg-white p-4">
          <p className="text-xs font-medium text-moss">Example</p>
          <p className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-medium leading-8 tracking-[-0.03em] text-ink">
            {entry.sentence}
          </p>
        </section>
      </div>

      <footer className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-clay">
          Source
        </span>
        <span className="text-sm font-medium text-moss">
          {entry.sourceSlug?.replaceAll("-", " ") || "manual vocabulary"}
        </span>
      </footer>
    </article>
  );
}
