import { requireSupabase } from "@/lib/db/client";
import { mapArticleRow, ArticleRow } from "@/lib/db/mappers";
import { Category } from "@/lib/types";

export async function getArticles() {
  const db = requireSupabase();
  const { data, error } = await db
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ArticleRow[]).map(mapArticleRow);
}

export async function getArticlesByCategories(categories: Category[]) {
  const db = requireSupabase();
  let query = db
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", {
      ascending: false
    });

  if (categories.length > 0) {
    query = query.in("category", categories);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return ((data ?? []) as ArticleRow[]).map(mapArticleRow);
}

export async function getArticleBySlug(slug: string) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapArticleRow(data as ArticleRow) : null;
}
