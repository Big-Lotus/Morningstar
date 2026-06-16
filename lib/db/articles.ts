import { requireSupabase } from "@/lib/db/client";
import { mapArticleRow, ArticleRow } from "@/lib/db/mappers";
import { Category } from "@/lib/types";

export async function getArticles() {
  const db = requireSupabase();
  const { data, error } = await db
    .from("articles")
    .select("*")
    .order("pubDate", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ArticleRow[]).map(mapArticleRow);
}

export async function getArticlesByCategories(categories: Category[]) {
  const articles = await getArticles();

  if (categories.length === 0) {
    return articles;
  }

  return articles.filter((article) => categories.includes(article.category));
}

export async function getArticleBySlug(slug: string) {
  const articles = await getArticles();

  return articles.find((article) => article.slug === slug) ?? null;
}
