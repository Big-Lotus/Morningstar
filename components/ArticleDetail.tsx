"use client";

import { useEffect, useRef, useState } from "react";

import { Article } from "@/lib/types";
import { useLearningStore } from "@/providers/learning-store";

type SelectionState = {
  text: string;
  sentence: string;
} | null;

type ArticleDetailProps = {
  article: Article;
};

export function ArticleDetail({ article }: ArticleDetailProps) {
  const [selection, setSelection] = useState<SelectionState>(null);
  const readingRef = useRef<HTMLDivElement>(null);
  const { saveWord, hasSavedWord } = useLearningStore();

  useEffect(() => {
    const handleSelection = () => {
      const selectionObject = window.getSelection();
      const selectedText = selectionObject?.toString().replace(/\s+/g, " ").trim();

      if (!selectedText || !readingRef.current) {
        setSelection(null);
        return;
      }

      const range = selectionObject?.rangeCount
        ? selectionObject.getRangeAt(0)
        : null;
      const commonAncestor = range?.commonAncestorContainer;
      const element =
        commonAncestor?.nodeType === Node.TEXT_NODE
          ? commonAncestor.parentElement
          : (commonAncestor as HTMLElement | null);

      if (!element || !readingRef.current.contains(element)) {
        return;
      }

      const sentenceHost = element.closest("[data-sentence]");
      const sentence = sentenceHost?.getAttribute("data-sentence") ?? selectedText;

      setSelection({
        text: selectedText,
        sentence
      });
    };

    document.addEventListener("selectionchange", handleSelection);
    return () => document.removeEventListener("selectionchange", handleSelection);
  }, []);

  const isSaved = selection
    ? hasSavedWord(selection.text, selection.sentence)
    : false;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
      <main ref={readingRef} className="mx-auto max-w-reading">
        <section className="rounded-[2rem] border border-line bg-paper/90 p-8 shadow-card md:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-clay">
            {article.category}
          </p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-5xl font-semibold leading-tight text-ink md:text-6xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-clay">
            Read the summary first, then settle into the original article at a
            slower pace.
          </p>
        </section>

        <section className="mt-8 rounded-[2rem] border border-line bg-accent/70 p-8 shadow-soft md:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-clay">Summary</p>
          <div className="reading-prose mt-5 text-lg leading-8 text-ink">
            {article.summary.map((sentence) => (
              <p key={sentence} data-sentence={sentence}>
                {sentence}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-line bg-paper/90 p-8 shadow-card md:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-clay">
            Original Article
          </p>
          <div className="reading-prose mt-6 text-[1.05rem] leading-8 text-ink">
            {article.content.map((paragraph) => (
              <p key={paragraph} data-sentence={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      </main>

      <aside className="lg:sticky lg:top-6">
        <div className="rounded-[2rem] border border-line bg-paper/95 p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.22em] text-clay">
            Margin Notes
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-semibold text-ink">
            Select a word or sentence
          </h2>
          <p className="mt-3 text-sm leading-6 text-clay">
            This space is reserved for vocabulary interaction in the next step.
            For now, selected text appears here as a quiet reading cue.
          </p>

          <div className="mt-5 rounded-[1.5rem] bg-accent/60 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-clay">
              Selected Text
            </p>
            <p className="mt-2 min-h-12 font-[family-name:var(--font-heading)] text-2xl font-semibold text-ink">
              {selection?.text ?? "Nothing selected yet"}
            </p>
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-line bg-paper px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-clay">
              Sentence
            </p>
            <p className="mt-2 min-h-24 text-sm leading-7 text-ink">
              {selection?.sentence ??
                "Try selecting a word or sentence from the summary or the article."}
            </p>
          </div>

          {selection ? (
            <div className="mt-4">
              <button
                type="button"
                onClick={() =>
                  saveWord({
                    word: selection.text,
                    sentence: selection.sentence,
                    articleSlug: article.slug
                  })
                }
                disabled={isSaved}
                className="w-full rounded-full bg-moss px-4 py-3 text-sm font-medium text-paper transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-clay"
              >
                {isSaved ? "Saved" : "Save Word"}
              </button>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
