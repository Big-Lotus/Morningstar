import { requireSupabase } from "@/lib/db/client";

export async function getBookmarkedArticleSlugs(userId: string): Promise<string[]> {
  const db = requireSupabase();
  const { error } = await db
    .from("bookmarks")
    .select("id")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return [];
}

export async function addBookmark(userId: string, articleSlug: string) {
  void userId;
  void articleSlug;
}

export async function removeBookmark(userId: string, articleSlug: string) {
  void userId;
  void articleSlug;
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
