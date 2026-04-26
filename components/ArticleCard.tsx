"use client";

import Link from "next/link";
import { useState } from "react";

import { Article } from "@/lib/types";
import { useLearningStore } from "@/providers/learning-store";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const { bookmarkedSlugs, toggleBookmark } = useLearningStore();
  const isBookmarked = bookmarkedSlugs.includes(article.slug);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <article className="group relative h-[220px] min-w-[270px] snap-start rounded-[2rem] border border-line bg-paper/95 p-6 shadow-card soft-ring transition duration-300 hover:-translate-y-1 hover:border-clay hover:shadow-[0_24px_48px_rgba(83,63,47,0.12)] md:min-w-[320px] md:p-7">
      <button
        type="button"
        onClick={() => {
          setIsPressed(true);
          toggleBookmark(article.slug);
          window.setTimeout(() => setIsPressed(false), 220);
        }}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        className={`soft-ring absolute right-4 top-4 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] transition md:right-5 md:top-5 ${
          isBookmarked
            ? "border-moss/40 bg-moss/10 text-moss"
            : "border-line bg-paper/95 text-clay hover:border-clay hover:text-ink"
        } ${isPressed ? "scale-[0.98]" : ""}`}
      >
        {isBookmarked ? "Saved" : "Save"}
      </button>

      <Link
        href={article.sourceUrl}
        className="soft-ring flex h-full items-start pr-20 pt-8 text-left md:pt-10"
      >
        <h3 className="max-w-[14ch] font-[family-name:var(--font-heading)] text-[1.9rem] font-semibold leading-[1.08] text-ink transition-colors duration-300 group-hover:text-moss md:text-3xl">
          {article.title}
        </h3>
      </Link>
    </article>
  );
}
