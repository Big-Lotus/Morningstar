import { ArticleCard } from "@/components/ArticleCard";
import { ArticleCarousel } from "@/components/ArticleCarousel";
import { CategoryTabs } from "@/components/CategoryTabs";
import { HomeHero } from "@/components/HomeHero";
import { TopicCard } from "@/components/TopicCard";
import { articles, categories, topics } from "@/lib/data";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[900px] space-y-8">
      <HomeHero />

      <CategoryTabs categories={categories} activeCategory="All" />

      <ArticleCarousel eyebrow="Daily Topics" title="Start from the issue, not the article">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </ArticleCarousel>

      <ArticleCarousel
        eyebrow="Source Articles"
        title="Reference cards collected from external reporting"
      >
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </ArticleCarousel>
    </main>
  );
}
