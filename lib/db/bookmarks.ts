import { requireSupabase } from "@/lib/db/client";

async function getArticleIdBySlug(articleSlug: string) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("articles")
    .select("id")
    .eq("slug", articleSlug)
    .single();

  if (error) {
    throw error;
  }

  return data.id as string;
}

export async function getBookmarkedArticleSlugs(userId: string) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("bookmarks")
    .select("articles(slug)")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return (data ?? [])
    .map((row) => {
      const article = Array.isArray(row.articles)
        ? row.articles[0]
        : row.articles;
      return article?.slug;
    })
    .filter((slug): slug is string => Boolean(slug));
}

export async function addBookmark(userId: string, articleSlug: string) {
  const db = requireSupabase();
  const articleId = await getArticleIdBySlug(articleSlug);
  const { error } = await db.from("bookmarks").upsert(
    {
      user_id: userId,
      article_id: articleId
    },
    { onConflict: "user_id,article_id" }
  );

  if (error) {
    throw error;
  }
}

export async function removeBookmark(userId: string, articleSlug: string) {
  const db = requireSupabase();
  const articleId = await getArticleIdBySlug(articleSlug);
  const { error } = await db
    .from("bookmarks")
    .delete()
    .eq("user_id", userId)
    .eq("article_id", articleId);

  if (error) {
    throw error;
  }
}

export async function toggleBookmark(userId: string, articleSlug: string) {
  const bookmarkedSlugs = await getBookmarkedArticleSlugs(userId);

  if (bookmarkedSlugs.includes(articleSlug)) {
    await removeBookmark(userId, articleSlug);
    return false;
  }

  await addBookmark(userId, articleSlug);
  return true;
}
