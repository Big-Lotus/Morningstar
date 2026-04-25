"use client";

import Link from "next/link";

import { Article } from "@/lib/types";
import { useLearningStore } from "@/providers/learning-store";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const { bookmarkedSlugs, toggleBookmark } = useLearningStore();
  const isBookmarked = bookmarkedSlugs.includes(article.slug);

  return (
    <article className="group relative h-[220px] min-w-[270px] snap-start rounded-[2rem] border border-line bg-paper/95 p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:border-clay md:min-w-[320px]">
      <button
        type="button"
        onClick={() => toggleBookmark(article.slug)}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        className="absolute right-5 top-5 rounded-full border border-line bg-paper/95 px-3 py-1 text-xs uppercase tracking-[0.18em] text-clay transition hover:border-clay hover:text-ink"
      >
        {isBookmarked ? "Saved" : "Save"}
      </button>

      <Link href={`/articles/${article.slug}`} className="flex h-full items-start pr-20 text-left">
        <h3 className="font-[family-name:var(--font-heading)] text-3xl font-semibold leading-tight text-ink transition-colors group-hover:text-moss">
          {article.title}
        </h3>
      </Link>
    </article>
  );
}
