"use client";

import Link from "next/link";
import { useState } from "react";

import { Article } from "@/lib/types";
import { categoryLabels } from "@/lib/data";
import { useLearningStore } from "@/providers/learning-store";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const { bookmarkedSlugs, toggleBookmark } = useLearningStore();
  const isBookmarked = bookmarkedSlugs.includes(article.slug);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <article className="group relative h-full min-w-[270px] snap-start rounded-[2rem] border border-line bg-paper/95 p-6 shadow-card soft-ring transition duration-300 hover:-translate-y-1 hover:border-clay hover:shadow-[0_24px_48px_rgba(83,63,47,0.12)] md:min-w-[320px] md:p-7">
      <button
        type="button"
        onClick={() => {
          setIsPressed(true);
          toggleBookmark(article.slug);
          window.setTimeout(() => setIsPressed(false), 220);
        }}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        className={`soft-ring absolute right-4 top-4 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] md:right-5 md:top-5 ${
          isBookmarked
            ? "border-moss/40 bg-moss/10 text-moss"
            : "border-line bg-paper/95 text-clay hover:border-clay hover:text-ink"
        } ${isPressed ? "scale-[0.98]" : ""}`}
      >
        {isBookmarked ? "Saved" : "Save"}
      </button>

      <div className="pr-20">
        <p className="text-xs uppercase tracking-[0.18em] text-clay">
          {categoryLabels[article.category]} / {article.sourceName}
        </p>
        <h3 className="mt-5 font-[family-name:var(--font-heading)] text-3xl font-semibold leading-tight text-ink transition-colors duration-300 group-hover:text-moss">
          {article.title}
        </h3>
      </div>

      <Link
        href={article.sourceUrl}
        className="soft-ring mt-6 inline-flex rounded-full border border-line bg-paper/90 px-4 py-2 text-sm text-clay transition hover:border-clay hover:text-ink"
      >
        Open source article
      </Link>
    </article>
  );
}
