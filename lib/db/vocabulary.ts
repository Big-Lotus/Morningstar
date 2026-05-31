import { requireSupabase } from "@/lib/db/client";
import { SavedVocabulary } from "@/lib/types";

type SavedVocabularyRow = {
  id: string;
  source_type: "article" | "custom_source";
  source_id: string;
  word: string;
  meaning: string | null;
  sentence: string;
  created_at: string;
};

export async function getSavedVocabulary(userId: string) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("saved_vocabulary")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return Promise.all(
    ((data ?? []) as SavedVocabularyRow[]).map(async (row) => ({
      id: row.id,
      word: row.word,
      meaning: row.meaning ?? "",
      sentence: row.sentence,
      sourceSlug: await getSourceSlug(row.source_type, row.source_id)
    }))
  );
}

export async function addSavedVocabulary(
  userId: string,
  entry: SavedVocabulary,
  sourceType: "article" | "custom_source"
) {
  const db = requireSupabase();
  const sourceId = await getSourceId(userId, sourceType, entry.sourceSlug);
  const { data, error } = await db
    .from("saved_vocabulary")
    .insert({
      id: entry.id,
      user_id: userId,
      source_type: sourceType,
      source_id: sourceId,
      word: entry.word,
      meaning: entry.meaning,
      sentence: entry.sentence
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteSavedVocabulary(userId: string, vocabularyId: string) {
  const db = requireSupabase();
  const { error } = await db
    .from("saved_vocabulary")
    .delete()
    .eq("user_id", userId)
    .eq("id", vocabularyId);

  if (error) {
    throw error;
  }
}

async function getSourceId(
  userId: string,
  sourceType: "article" | "custom_source",
  slug: string
) {
  const db = requireSupabase();
  const table = sourceType === "article" ? "articles" : "custom_sources";
  const query = db.from(table).select("id").eq("slug", slug);
  const { data, error } =
    sourceType === "custom_source"
      ? await query.eq("user_id", userId).single()
      : await query.single();

  if (error) {
    throw error;
  }

  return data.id as string;
}

async function getSourceSlug(
  sourceType: "article" | "custom_source",
  sourceId: string
) {
  const db = requireSupabase();
  const table = sourceType === "article" ? "articles" : "custom_sources";
  const { data, error } = await db
    .from(table)
    .select("slug")
    .eq("id", sourceId)
    .single();

  if (error) {
    throw error;
  }

  return data.slug as string;
}
