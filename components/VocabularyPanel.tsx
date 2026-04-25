"use client";

import { useEffect, useState } from "react";

import { useLearningStore } from "@/providers/learning-store";

type VocabularyPanelProps = {
  articleSlug: string;
  selection: {
    word: string;
    sentence: string;
  } | null;
};

export function VocabularyPanel({
  articleSlug,
  selection
}: VocabularyPanelProps) {
  const { saveWord, savedWords } = useLearningStore();
  const [draftWord, setDraftWord] = useState("");

  useEffect(() => {
    setDraftWord(selection?.word ?? "");
  }, [selection]);

  const relatedWords = savedWords.filter((item) => item.articleSlug === articleSlug);

  return (
    <aside className="rounded-[2rem] border border-line bg-paper/95 p-5 shadow-card">
      <div className="border-b border-line/80 pb-4">
        <p className="text-xs uppercase tracking-[0.22em] text-clay">
          Margin Notes
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-semibold text-ink">
          Save vocabulary with context
        </h3>
        <p className="mt-2 text-sm leading-6 text-clay">
          Select a word or sentence from the summary or article. It will appear
          here like a quiet annotation beside the page.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <div className="rounded-[1.5rem] bg-accent/60 p-4">
          <label className="block text-xs uppercase tracking-[0.18em] text-clay">
            Word
          </label>
          <input
            value={draftWord}
            onChange={(event) => setDraftWord(event.target.value)}
            placeholder="Selected word"
            className="mt-2 w-full border-0 bg-transparent p-0 font-[family-name:var(--font-heading)] text-2xl font-semibold text-ink outline-none placeholder:text-clay/60"
          />
        </div>

        <div className="rounded-[1.5rem] border border-line bg-paper px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-clay">Sentence</p>
          <p className="mt-2 min-h-20 text-sm leading-7 text-ink">
            {selection?.sentence ?? "Select text from the article to capture the sentence context."}
          </p>
        </div>

        <button
          type="button"
          disabled={!draftWord.trim() || !selection?.sentence.trim()}
          onClick={() =>
            selection &&
            saveWord({
              word: draftWord,
              sentence: selection.sentence,
              articleSlug
            })
          }
          className="w-full rounded-full bg-moss px-4 py-3 text-sm font-medium text-paper transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-clay"
        >
          Save Word
        </button>
      </div>

      <div className="mt-6 border-t border-line/80 pt-5">
        <p className="text-xs uppercase tracking-[0.22em] text-clay">
          Saved from this article
        </p>
        <div className="mt-4 space-y-3">
          {relatedWords.length > 0 ? (
            relatedWords.map((item) => (
              <div key={item.id} className="rounded-[1.25rem] bg-accent/50 px-4 py-3">
                <p className="font-semibold text-ink">{item.word}</p>
                <p className="mt-1 text-sm leading-6 text-clay">{item.sentence}</p>
              </div>
            ))
          ) : (
            <p className="text-sm leading-6 text-clay">
              No words saved yet. Start with an unfamiliar expression or an
              important sentence.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
