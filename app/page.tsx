"use client";

import { useState } from "react";

import { ArticleCard } from "@/components/ArticleCard";
import { ArticleCarousel } from "@/components/ArticleCarousel";
import { AuthPanel } from "@/components/AuthPanel";
import { CategoryTabs } from "@/components/CategoryTabs";
import { HomeHero } from "@/components/HomeHero";
import { InterestOnboarding } from "@/components/InterestOnboarding";
import { categories } from "@/lib/data";
import { useLearningStore } from "@/providers/learning-store";
import { Category } from "@/lib/types";

export default function HomePage() {
  const {
    currentUsername,
    hasCompletedOnboarding,
    isHydrated,
    feedArticles,
    selectedInterests,
    resetOnboarding
  } = useLearningStore();
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

  if (!isHydrated) {
    return null;
  }

  if (!currentUsername) {
    return <AuthPanel />;
  }

  if (!hasCompletedOnboarding) {
    return <InterestOnboarding />;
  }

  const interestArticles = feedArticles.filter(
    (article) =>
      selectedInterests.includes(article.category) &&
      (activeCategory === "All" || article.category === activeCategory)
  );
  const discoveryArticles = feedArticles.filter(
    (article) =>
      !selectedInterests.includes(article.category) &&
      (activeCategory === "All" || article.category === activeCategory)
  );

  return (
    <main className="mx-auto w-full space-y-8">
      <HomeHero userId={currentUsername} />

      <div className="rounded-[1.5rem] border border-transparent bg-paper/86 p-4 shadow-soft backdrop-blur md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
        <button
          type="button"
          onClick={resetOnboarding}
          className="soft-ring w-fit rounded-full border border-transparent bg-transparent px-4 py-2 text-sm text-clay transition hover:bg-accent hover:text-ink"
        >
          Change interests
        </button>
        </div>
      </div>

      <ArticleCarousel
        eyebrow="For Your Interests"
        title={
          <>
            News <span className="text-moss">Collected</span>
          </>
        }
      >
        {interestArticles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </ArticleCarousel>
      {interestArticles.length === 0 ? (
        <div className="rounded-[1.25rem] border border-dashed border-line bg-paper/70 p-6 text-center text-clay">
          No saved-interest stories match this category yet.
        </div>
      ) : null}

      <ArticleCarousel
        eyebrow="Related Reading"
        title="More stories to connect later"
      >
        {(discoveryArticles.length > 0 ? discoveryArticles : feedArticles.filter(
          (article) => activeCategory === "All" || article.category === activeCategory
        )).map(
          (article) => (
            <ArticleCard key={article.slug} article={article} />
          )
        )}
      </ArticleCarousel>
    </main>
  );
}
