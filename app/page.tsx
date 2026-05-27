"use client";

import { ArticleCard } from "@/components/ArticleCard";
import { ArticleCarousel } from "@/components/ArticleCarousel";
import { CategoryTabs } from "@/components/CategoryTabs";
import { HomeHero } from "@/components/HomeHero";
import { InterestOnboarding } from "@/components/InterestOnboarding";
import { articles, categories } from "@/lib/data";
import { useLearningStore } from "@/providers/learning-store";

export default function HomePage() {
  const {
    hasCompletedOnboarding,
    selectedInterests,
    resetOnboarding
  } = useLearningStore();

  if (!hasCompletedOnboarding) {
    return <InterestOnboarding />;
  }

  const interestArticles = articles.filter((article) =>
    selectedInterests.includes(article.category)
  );
  const discoveryArticles = articles.filter(
    (article) => !selectedInterests.includes(article.category)
  );

  return (
    <main className="mx-auto max-w-[900px] space-y-8">
      <HomeHero />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CategoryTabs categories={categories} activeCategory="All" />
        <button
          type="button"
          onClick={resetOnboarding}
          className="soft-ring w-fit rounded-full border border-line bg-paper/90 px-4 py-2 text-sm text-clay transition hover:border-clay hover:text-ink"
        >
          Change interests
        </button>
      </div>

      <ArticleCarousel
        eyebrow="For Your Interests"
        title="News collected from the areas you picked"
      >
        {interestArticles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </ArticleCarousel>

      <ArticleCarousel
        eyebrow="Related Reading"
        title="More stories to connect later"
      >
        {(discoveryArticles.length > 0 ? discoveryArticles : articles).map(
          (article) => (
            <ArticleCard key={article.slug} article={article} />
          )
        )}
      </ArticleCarousel>
    </main>
  );
}
