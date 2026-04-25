import { ArticleCard } from "@/components/ArticleCard";
import { ArticleCarousel } from "@/components/ArticleCarousel";
import { CategoryTabs } from "@/components/CategoryTabs";
import { HomeHero } from "@/components/HomeHero";
import { articles, categories } from "@/lib/data";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[900px] space-y-8">
      <HomeHero />

      <CategoryTabs categories={categories} activeCategory="All" />

      <ArticleCarousel>
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </ArticleCarousel>
    </main>
  );
}
