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
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [isSavePressed, setIsSavePressed] = useState(false);
  const [isBookmarkPressed, setIsBookmarkPressed] = useState(false);
  const [isSavePending, setIsSavePending] = useState(false);
  const readingRef = useRef<HTMLDivElement>(null);
  const { saveWord, hasSavedWord, bookmarkedSlugs, toggleBookmark } =
    useLearningStore();

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
  const isBookmarked = bookmarkedSlugs.includes(article.slug);

  useEffect(() => {
    if (!showSavedFeedback) {
      return;
    }

    const timeout = window.setTimeout(() => setShowSavedFeedback(false), 1400);
    return () => window.clearTimeout(timeout);
  }, [showSavedFeedback]);

  useEffect(() => {
    if (!isSavePending) {
      return;
    }

    const timeout = window.setTimeout(() => setIsSavePending(false), 320);
    return () => window.clearTimeout(timeout);
  }, [isSavePending]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
      <main ref={readingRef} className="mx-auto max-w-reading">
        <section className="rounded-[2rem] border border-line bg-paper/90 p-7 shadow-card md:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-clay">
            {article.category}
          </p>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <h1 className="max-w-3xl font-[family-name:var(--font-heading)] text-[2.7rem] font-semibold leading-[1.02] text-ink md:text-6xl">
              {article.title}
            </h1>
            <button
              type="button"
              onClick={() => {
                setIsBookmarkPressed(true);
                toggleBookmark(article.slug);
                window.setTimeout(() => setIsBookmarkPressed(false), 180);
              }}
              className={`soft-ring rounded-full border px-4 py-2 text-sm ${
                isBookmarked
                  ? "border-moss/40 bg-moss/10 text-moss"
                  : "border-line bg-paper text-clay hover:border-clay hover:text-ink"
              } ${isBookmarkPressed ? "scale-[0.98]" : "hover:-translate-y-0.5"}`}
            >
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </button>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-clay">
            Read the summary first, then settle into the original article at a
            slower pace.
          </p>
        </section>

        <section className="mt-8 rounded-[2rem] border border-line bg-accent/70 p-7 shadow-soft md:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-clay">Summary</p>
          <div className="reading-prose mt-5 text-[1.06rem] leading-8 text-ink md:text-lg">
            {article.summary.map((sentence) => (
              <p key={sentence} data-sentence={sentence}>
                {sentence}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-line bg-paper/90 p-7 shadow-card md:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-clay">
            Original Article
          </p>
          <div className="reading-prose mt-6 text-[1rem] leading-8 text-ink md:text-[1.05rem] md:leading-[2.1rem]">
            {article.content.map((paragraph) => (
              <p key={paragraph} data-sentence={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      </main>

      <aside className="lg:sticky lg:top-6">
        <div className="rounded-[2rem] border border-line bg-paper/95 p-5 shadow-soft md:p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-clay">
            Margin Notes
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-semibold text-ink">
            Select a word or sentence
          </h2>
          <p className="mt-3 text-sm leading-6 text-clay">
            Save words directly from what you read and keep the original
            sentence beside them, like a calm note in the margin.
          </p>

          <div className="mt-5 rounded-[1.5rem] bg-accent/60 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-clay">
              Selected Text
            </p>
            <p className="mt-2 min-h-12 font-[family-name:var(--font-heading)] text-2xl font-semibold leading-tight text-ink">
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
            <div className="mt-4 soft-fade-in">
              <button
                type="button"
                onClick={() => {
                  if (isSaved || isSavePending) {
                    return;
                  }

                  setIsSavePressed(true);
                  setIsSavePending(true);
                  saveWord({
                    word: selection.text,
                    sentence: selection.sentence,
                    articleSlug: article.slug
                  });
                  setShowSavedFeedback(true);
                  window.setTimeout(() => setIsSavePressed(false), 180);
                }}
                disabled={isSaved || isSavePending}
                className={`soft-ring w-full rounded-full px-4 py-3 text-sm font-medium text-paper ${
                  isSaved || isSavePending
                    ? "cursor-not-allowed bg-line text-clay"
                    : "bg-moss hover:-translate-y-0.5 hover:bg-ink"
                } ${isSavePressed ? "scale-[0.985]" : ""}`}
              >
                {isSaved ? "Saved" : "Save Word"}
              </button>

              <p
                className={`mt-3 text-center text-xs uppercase tracking-[0.18em] text-moss soft-ring ${
                  showSavedFeedback || isSaved ? "opacity-100" : "opacity-0"
                }`}
              >
                Saved to your notebook
              </p>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
