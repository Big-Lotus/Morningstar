"use client";

import Link from "next/link";

import { Article } from "@/lib/types";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group h-full min-w-[270px] snap-start rounded-[2rem] border border-line bg-paper/95 p-6 shadow-card soft-ring transition duration-300 hover:-translate-y-1 hover:border-clay hover:shadow-[0_24px_48px_rgba(83,63,47,0.12)] md:min-w-[320px] md:p-7">
      <p className="text-xs uppercase tracking-[0.18em] text-clay">
        {article.sourceName}
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-clay/80">
        {article.keyword}
      </p>

      <p className="mt-5 text-sm leading-7 text-clay">{article.intro}</p>

      <Link
        href={article.sourceUrl}
        className="soft-ring mt-6 inline-flex rounded-full border border-line bg-paper/90 px-4 py-2 text-sm text-clay transition hover:border-clay hover:text-ink"
      >
        Open source article
      </Link>
    </article>
  );
}
