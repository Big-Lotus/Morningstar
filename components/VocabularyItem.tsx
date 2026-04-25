"use client";

import { SavedVocabulary } from "@/lib/types";
import { useLearningStore } from "@/providers/learning-store";

type VocabularyItemProps = {
  entry: SavedVocabulary;
};

export function VocabularyItem({ entry }: VocabularyItemProps) {
  const { removeWord } = useLearningStore();

  return (
    <article className="rounded-[1.75rem] border border-line bg-paper/95 p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-[family-name:var(--font-heading)] text-3xl font-semibold text-ink">
            {entry.word}
          </h3>
          <p className="mt-3 text-sm leading-7 text-clay">{entry.sentence}</p>
        </div>

        <button
          type="button"
          onClick={() => removeWord(entry.id)}
          className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-[0.18em] text-clay transition hover:border-clay hover:text-ink"
        >
          Remove
        </button>
      </div>
    </article>
  );
}
