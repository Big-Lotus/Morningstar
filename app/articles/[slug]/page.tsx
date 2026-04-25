import { notFound } from "next/navigation";

import { ArticleDetail } from "@/components/ArticleDetail";
import { articles, getArticleBySlug } from "@/lib/data";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticleDetail article={article} />;
}
