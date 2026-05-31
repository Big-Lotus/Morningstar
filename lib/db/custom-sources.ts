import { requireSupabase } from "@/lib/db/client";
import { CustomSourceRow, mapArticleRow } from "@/lib/db/mappers";
import { Article } from "@/lib/types";

export async function getCustomSources(userId: string) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("custom_sources")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as CustomSourceRow[]).map(mapArticleRow);
}

export async function getCustomSourceBySlug(userId: string, slug: string) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("custom_sources")
    .select("*")
    .eq("user_id", userId)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapArticleRow(data as CustomSourceRow) : null;
}

export async function addCustomSource(userId: string, article: Article) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("custom_sources")
    .upsert(
      {
        user_id: userId,
        slug: article.slug,
        title: article.title,
        source_name: article.sourceName,
        source_url: article.sourceUrl,
        category: article.category,
        keyword: article.keyword,
        intro: article.intro
      },
      { onConflict: "user_id,source_url" }
    )
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return mapArticleRow(data as CustomSourceRow);
}

export async function deleteCustomSource(userId: string, customSourceSlug: string) {
  const db = requireSupabase();
  const { error } = await db
    .from("custom_sources")
    .delete()
    .eq("user_id", userId)
    .eq("slug", customSourceSlug);

  if (error) {
    throw error;
  }
}
