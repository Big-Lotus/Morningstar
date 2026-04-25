"use client";

import { useState } from "react";

import { ArticleCard } from "@/components/ArticleCard";
import { Carousel } from "@/components/Carousel";
import { CategoryTabs } from "@/components/CategoryTabs";
import { Article, Category } from "@/lib/types";

type HomeClientProps = {
  articles: Article[];
  categories: Category[];
};

export function HomeClient({ articles, categories }: HomeClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

  const filteredArticles =
    activeCategory === "All"
      ? articles
      : articles.filter((article) => article.category === activeCategory);

  return (
    <main className="mx-auto max-w-[900px] space-y-8">
      <section className="rounded-[2rem] border border-line bg-paper/80 px-7 py-8 shadow-soft md:px-10">
        <p className="text-sm uppercase tracking-[0.22em] text-clay">
          Today&apos;s Reading Space
        </p>
        <h1 className="mt-3 max-w-2xl font-[family-name:var(--font-heading)] text-5xl font-semibold leading-tight text-ink md:text-6xl">
          Daily news, softened into a reading habit you can actually keep.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-clay">
          Start with a single title, move at your own pace, and save words like
          margin notes in a favorite book.
        </p>
      </section>

      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />

      <Carousel>
        {filteredArticles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </Carousel>
    </main>
  );
}
