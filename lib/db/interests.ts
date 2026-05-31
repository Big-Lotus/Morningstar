import { requireSupabase } from "@/lib/db/client";
import { Category } from "@/lib/types";

export async function getUserInterests(userId: string) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("user_interests")
    .select("category")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => row.category as Category);
}

export async function replaceUserInterests(userId: string, categories: Category[]) {
  const db = requireSupabase();
  const { error: deleteError } = await db
    .from("user_interests")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    throw deleteError;
  }

  if (categories.length === 0) {
    return;
  }

  const { error: insertError } = await db.from("user_interests").insert(
    categories.map((category) => ({
      user_id: userId,
      category
    }))
  );

  if (insertError) {
    throw insertError;
  }
}
