"use client";

import Link from "next/link";
import { useState } from "react";

import { ArticleVisual } from "@/components/ArticleVisual";
import { Article } from "@/lib/types";
import { categoryLabels } from "@/lib/data";
import { useLearningStore } from "@/providers/learning-store";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const { bookmarkedSlugs, currentUsername, toggleBookmark } = useLearningStore();
  const isBookmarked = bookmarkedSlugs.includes(article.slug);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <article className="group relative flex h-full min-w-[300px] snap-start flex-col rounded-[2.2rem] border border-line bg-paper/95 p-4 shadow-card soft-ring transition duration-300 hover:-translate-y-1 hover:border-clay hover:shadow-[0_24px_48px_rgba(83,63,47,0.12)] md:min-w-[360px] md:p-5">
      <button
        type="button"
        onClick={() => {
          setIsPressed(true);
          toggleBookmark(article.slug);
          window.setTimeout(() => setIsPressed(false), 220);
        }}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        className={`soft-ring absolute right-7 top-7 z-10 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] ${
          isBookmarked
            ? "border-moss/40 bg-moss/10 text-moss"
            : "border-line bg-paper/95 text-clay hover:border-clay hover:text-ink"
        } ${isPressed ? "scale-[0.98]" : ""}`}
      >
        {isBookmarked ? "Unsave" : "Save"}
      </button>

      <ArticleVisual article={article} />

      <div className="mt-5 flex flex-1 flex-col">
        <p className="text-xs uppercase tracking-[0.18em] text-clay">
          {categoryLabels[article.category]} / {article.sourceName}
        </p>
        <h3 className="mt-3 font-[family-name:var(--font-heading)] text-[2rem] font-semibold leading-tight text-ink transition-colors duration-300 group-hover:text-moss">
          {article.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-clay">
          {article.intro}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={article.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="soft-ring inline-flex rounded-full border border-line bg-paper/90 px-4 py-2 text-sm text-clay transition hover:border-clay hover:text-ink"
        >
          Open source article
        </Link>
        {isBookmarked ? (
          <Link
            href="/investigate"
            className="soft-ring inline-flex rounded-full border border-moss bg-moss px-4 py-2 text-sm text-paper transition hover:-translate-y-0.5"
          >
            Investigate
          </Link>
        ) : !currentUsername ? (
          <p className="mt-2 text-sm text-clay">Sign in to save this story.</p>
        ) : null}
      </div>
    </article>
  );
}
