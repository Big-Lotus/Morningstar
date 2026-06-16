import { requireSupabase } from "@/lib/db/client";
import { CommunityPost } from "@/lib/types";

type AnalysisPostRow = {
  id: string;
  investigation_id: string;
  user_id: string;
  title: string;
  insight: string;
  created_at: string;
  users?: { username: string } | { username: string }[] | null;
  investigations?: {
    title: string;
    requirements: string;
    analysis: string;
    created_at: string;
  } | null;
  community_analysis_comments?: Array<{
    id: string;
    body: string;
    created_at: string;
    users?: { username: string } | { username: string }[] | null;
  }>;
};

export async function getCommunityAnalysisPosts() {
  const db = requireSupabase();
  const { data, error } = await db
    .from("community_analysis_posts")
    .select(
      "*, users(username), investigations(title, requirements, analysis, created_at), community_analysis_comments(*, users(username))"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return Promise.all(
    ((data ?? []) as AnalysisPostRow[]).map(async (row) =>
      mapAnalysisPostRow(row, await getInvestigationSourceSlugs(row.investigation_id))
    )
  );
}

export async function createCommunityAnalysisPost(
  userId: string,
  entry: {
    id?: string;
    investigationId: string;
    title: string;
    insight: string;
  }
) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("community_analysis_posts")
    .upsert(
      {
        id: entry.id,
        user_id: userId,
        investigation_id: entry.investigationId,
        title: entry.title,
        insight: entry.insight,
        updated_at: new Date().toISOString()
      },
      { onConflict: "investigation_id" }
    )
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function addCommunityAnalysisComment(
  userId: string,
  postId: string,
  body: string,
  commentId?: string
) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("community_analysis_comments")
    .insert({
      id: commentId,
      post_id: postId,
      user_id: userId,
      body
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteCommunityAnalysisComment(
  userId: string,
  commentId: string
) {
  const db = requireSupabase();
  const { error } = await db
    .from("community_analysis_comments")
    .delete()
    .eq("user_id", userId)
    .eq("id", commentId);

  if (error) {
    throw error;
  }
}

export async function deleteCommunityAnalysisPost(userId: string, postId: string) {
  const db = requireSupabase();
  const { error } = await db
    .from("community_analysis_posts")
    .delete()
    .eq("user_id", userId)
    .eq("id", postId);

  if (error) {
    throw error;
  }
}

function mapAnalysisPostRow(
  row: AnalysisPostRow,
  sourceSlugs: string[]
): CommunityPost {
  const user = firstRecord(row.users);
  const investigation = row.investigations;

  return {
    id: row.id,
    compositionId: row.investigation_id,
    authorName: user?.username ?? "Unknown",
    title: row.title,
    insight: row.insight,
    requirements: investigation?.requirements ?? "",
    analysis: investigation?.analysis ?? "",
    sourceSlugs,
    sourceSnapshots: [],
    comments: (row.community_analysis_comments ?? []).map((comment) => {
      const commentUser = firstRecord(comment.users);

      return {
        id: comment.id,
        authorName: commentUser?.username ?? "Unknown",
        body: comment.body,
        createdAt: comment.created_at
      };
    }),
    createdAt: row.created_at
  };
}

function firstRecord<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function getInvestigationSourceSlugs(investigationId: string) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("investigation_sources")
    .select("source_type, source_id, sort_order")
    .eq("investigation_id", investigationId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  return Promise.all(
    (data ?? []).map((source) =>
      getSourceSlug(
        source.source_type as "article" | "custom_source",
        source.source_id as string
      )
    )
  );
}

async function getSourceSlug(
  sourceType: "article" | "custom_source",
  sourceId: string
) {
  if (sourceType === "article") {
    return sourceId;
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
