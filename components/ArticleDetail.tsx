"use client";

import { useEffect, useRef, useState } from "react";

import { Article } from "@/lib/types";
import { useLearningStore } from "@/providers/learning-store";
import { VocabularyPanel } from "@/components/VocabularyPanel";

type SelectionState = {
  word: string;
  sentence: string;
} | null;

type ArticleDetailProps = {
  article: Article;
};

export function ArticleDetail({ article }: ArticleDetailProps) {
  const { bookmarkedSlugs, toggleBookmark } = useLearningStore();
  const [selection, setSelection] = useState<SelectionState>(null);
  const readingRef = useRef<HTMLDivElement>(null);

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
        word: selectedText,
        sentence
      });
    };

    document.addEventListener("selectionchange", handleSelection);
    return () => document.removeEventListener("selectionchange", handleSelection);
  }, []);

  const bookmarked = bookmarkedSlugs.includes(article.slug);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-start">
      <main ref={readingRef} className="mx-auto max-w-reading">
        <div className="mb-8 rounded-[2rem] border border-line bg-paper/90 p-8 shadow-card">
          <p className="text-xs uppercase tracking-[0.24em] text-clay">
            {article.category}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <h1 className="max-w-2xl font-[family-name:var(--font-heading)] text-5xl font-semibold leading-tight text-ink">
              {article.title}
            </h1>
            <button
              type="button"
              onClick={() => toggleBookmark(article.slug)}
              className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-clay transition hover:border-clay hover:text-ink"
            >
              {bookmarked ? "Bookmarked" : "Bookmark"}
            </button>
          </div>
        </div>

        <section className="mb-8 rounded-[2rem] border border-line bg-accent/70 p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.24em] text-clay">Summary</p>
          <div className="reading-prose mt-4 text-lg leading-8 text-ink">
            {article.summary.map((sentence) => (
              <p key={sentence} data-sentence={sentence}>
                {sentence}
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-line bg-paper/90 p-8 shadow-card">
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

      <div className="lg:sticky lg:top-6">
        <VocabularyPanel articleSlug={article.slug} selection={selection} />
      </div>
    </div>
  );
}
