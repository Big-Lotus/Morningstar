import { requireSupabase } from "@/lib/db/client";
import { SavedVocabulary } from "@/lib/types";

type SavedVocabularyRow = {
  id: string;
  source_type: VocabularySourceType;
  source_id: string;
  word: string;
  meaning: string | null;
  sentence: string;
  created_at: string;
};

type VocabularySourceType = "article" | "custom_source" | "manual";

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
  sourceType: VocabularySourceType
) {
  const db = requireSupabase();
  const sourceId = await getSourceId(userId, sourceType, entry.sourceSlug);
  const row = {
    id: entry.id,
    user_id: userId,
    source_type: sourceType,
    source_id: sourceId,
    word: entry.word,
    meaning: entry.meaning,
    sentence: entry.sentence
  };
  let { data, error } = await db
    .from("saved_vocabulary")
    .insert(row)
    .select("*")
    .single();

  if (isManualSourceConstraintError(error, sourceType)) {
    const retry = await db
      .from("saved_vocabulary")
      .insert({
        ...row,
        source_type: "article",
        source_id: sourceId || "manual"
      })
      .select("*")
      .single();

    data = retry.data;
    error = retry.error;
  }

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

export async function updateSavedVocabulary(
  userId: string,
  vocabularyId: string,
  entry: Omit<SavedVocabulary, "id">,
  sourceType: VocabularySourceType
) {
  const db = requireSupabase();
  const sourceId = await getSourceId(userId, sourceType, entry.sourceSlug);
  const row = {
    source_type: sourceType,
    source_id: sourceId,
    word: entry.word,
    meaning: entry.meaning,
    sentence: entry.sentence
  };
  let { error } = await db
    .from("saved_vocabulary")
    .update(row)
    .eq("user_id", userId)
    .eq("id", vocabularyId);

  if (isManualSourceConstraintError(error, sourceType)) {
    const retry = await db
      .from("saved_vocabulary")
      .update({
        ...row,
        source_type: "article",
        source_id: sourceId || "manual"
      })
      .eq("user_id", userId)
      .eq("id", vocabularyId);

    error = retry.error;
  }

  if (error) {
    throw error;
  }
}

async function getSourceId(
  userId: string,
  sourceType: VocabularySourceType,
  slug?: string
) {
  if (sourceType === "manual") {
    return slug || "manual";
  }

  if (sourceType === "article") {
    return slug || "manual";
  }

  const db = requireSupabase();
  const { data, error } = await db
    .from("custom_sources")
    .select("id")
    .eq("slug", slug)
    .eq("user_id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data.id as string;
}

async function getSourceSlug(
  sourceType: VocabularySourceType,
  sourceId: string
) {
  if (sourceType === "manual") {
    return sourceId === "manual" ? undefined : sourceId;
  }

  if (sourceType === "article") {
    return sourceId === "manual" ? undefined : sourceId;
  }

  const db = requireSupabase();
  const { data, error } = await db
    .from("custom_sources")
    .select("slug")
    .eq("id", sourceId)
    .single();

  if (error) {
    throw error;
  }

  return data.slug as string;
}

function isManualSourceConstraintError(
  error: { code?: string; message?: string } | null,
  sourceType: VocabularySourceType
) {
  return Boolean(
    error &&
      sourceType === "manual" &&
      error.code === "23514" &&
      error.message?.includes("saved_vocabulary_source_type_check")
  );
}
