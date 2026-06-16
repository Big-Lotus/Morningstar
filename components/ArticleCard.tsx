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
    <article className="group relative flex h-full min-w-[250px] snap-start flex-col overflow-hidden rounded-[1.2rem] border border-line bg-paper p-3 shadow-card soft-ring transition duration-300 hover:-translate-y-1 hover:border-moss sm:min-w-[290px] md:min-w-[330px] md:p-4">
      <button
        type="button"
        onClick={() => {
          setIsPressed(true);
          toggleBookmark(article.slug);
          window.setTimeout(() => setIsPressed(false), 220);
        }}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        className={`soft-ring absolute right-6 top-6 z-10 rounded-full border border-transparent px-3 py-1 text-xs font-medium backdrop-blur ${
          isBookmarked
            ? "bg-moss/14 text-moss"
            : "bg-paper/70 text-clay hover:bg-accent hover:text-ink"
        } ${isPressed ? "scale-[0.98]" : ""}`}
      >
        {isBookmarked ? "Unsave" : "Save"}
      </button>

      <ArticleVisual article={article} />

      <div className="mt-5 flex flex-1 flex-col">
        <p className="text-xs font-medium text-clay">
          {categoryLabels[article.category]} / {article.sourceName}
        </p>
        <h3 className="mt-3 font-[family-name:var(--font-heading)] text-[1.65rem] font-semibold leading-tight tracking-[-0.04em] text-ink transition-colors duration-300 group-hover:text-moss">
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
          className="soft-ring inline-flex rounded-full border border-transparent bg-transparent px-4 py-2 text-sm text-clay transition hover:bg-accent hover:text-ink"
        >
          Open source article
        </Link>
        {isBookmarked ? (
          <Link
            href="/investigate"
            className="soft-ring inline-flex rounded-full border border-transparent bg-ink px-4 py-2 text-sm text-paper transition hover:-translate-y-0.5 hover:bg-moss"
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
