import { requireSupabase } from "@/lib/db/client";
import { CommunityPost } from "@/lib/types";

type PollRow = {
  id: string;
  user_id: string;
  title: string;
  question: string;
  summary_insight: string | null;
  created_at: string;
  users?: { username: string } | { username: string }[] | null;
  community_poll_options?: Array<{
    id: string;
    label: string;
    sort_order: number;
  }>;
  community_poll_votes?: Array<{
    id: string;
    option_id: string;
    opinion: string;
    created_at: string;
    users?: { username: string } | { username: string }[] | null;
  }>;
  community_poll_comments?: Array<{
    id: string;
    body: string;
    created_at: string;
    users?: { username: string } | { username: string }[] | null;
  }>;
};

export async function getCommunityPolls() {
  const db = requireSupabase();
  const { data, error } = await db
    .from("community_polls")
    .select(
      "*, users(username), community_poll_options(*), community_poll_votes(*, users(username)), community_poll_comments(*, users(username))"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as PollRow[]).map(mapPollRow);
}

export async function getHotCommunityPolls(limit = 3) {
  const polls = await getCommunityPolls();

  return [...polls]
    .sort((a, b) => {
      const aVotes = a.pollVotes?.length ?? 0;
      const bVotes = b.pollVotes?.length ?? 0;
      return bVotes - aVotes;
    })
    .slice(0, limit);
}

export async function createCommunityPoll(
  userId: string,
  entry: {
    id?: string;
    title: string;
    question: string;
    options: Array<{ id?: string; label: string }>;
  }
) {
  const db = requireSupabase();
  const { data: poll, error } = await db
    .from("community_polls")
    .insert({
      id: entry.id,
      user_id: userId,
      title: entry.title,
      question: entry.question
    })
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  const optionRows = entry.options
    .map((option, index) => ({
      id: option.id,
      poll_id: poll.id,
      label: option.label,
      sort_order: index
    }))
    .filter((option) => option.label.trim());

  if (optionRows.length > 0) {
    const { error: optionsError } = await db
      .from("community_poll_options")
      .insert(optionRows);

    if (optionsError) {
      throw optionsError;
    }
  }

  return poll;
}

export async function upsertPollVote(
  userId: string,
  entry: {
    pollId: string;
    optionId: string;
    opinion: string;
  }
) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("community_poll_votes")
    .upsert(
      {
        poll_id: entry.pollId,
        option_id: entry.optionId,
        user_id: userId,
        opinion: entry.opinion
      },
      { onConflict: "poll_id,user_id" }
    )
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCommunityPollSummary(
  userId: string,
  pollId: string,
  summaryInsight: string
) {
  const db = requireSupabase();
  const { error } = await db
    .from("community_polls")
    .update({
      summary_insight: summaryInsight,
      updated_at: new Date().toISOString()
    })
    .eq("id", pollId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
}

export async function addCommunityPollComment(
  userId: string,
  pollId: string,
  body: string,
  commentId?: string
) {
  const db = requireSupabase();
  const { data, error } = await db
    .from("community_poll_comments")
    .insert({
      id: commentId,
      poll_id: pollId,
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

export async function deleteCommunityPollComment(
  userId: string,
  commentId: string
) {
  const db = requireSupabase();
  const { error } = await db
    .from("community_poll_comments")
    .delete()
    .eq("user_id", userId)
    .eq("id", commentId);

  if (error) {
    throw error;
  }
}

export async function deleteCommunityPoll(userId: string, pollId: string) {
  const db = requireSupabase();
  const { error } = await db
    .from("community_polls")
    .delete()
    .eq("user_id", userId)
    .eq("id", pollId);

  if (error) {
    throw error;
  }
}

function mapPollRow(row: PollRow): CommunityPost {
  const user = firstRecord(row.users);
  const options = [...(row.community_poll_options ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return {
    id: row.id,
    compositionId: row.id,
    authorName: user?.username ?? "Unknown",
    title: row.title,
    insight: "Community poll",
    requirements: row.question,
    analysis: "",
    sourceSlugs: [],
    sourceSnapshots: [],
    comments: (row.community_poll_comments ?? []).map((comment) => {
      const commentUser = firstRecord(comment.users);

      return {
        id: comment.id,
        authorName: commentUser?.username ?? "Unknown",
        body: comment.body,
        createdAt: comment.created_at
      };
    }),
    pollQuestion: row.question,
    pollOptions: options.map((option) => ({
      id: option.id,
      label: option.label
    })),
    pollVotes: (row.community_poll_votes ?? []).map((vote) => {
      const voteUser = firstRecord(vote.users);

      return {
        id: vote.id,
        authorName: voteUser?.username ?? "Unknown",
        optionId: vote.option_id,
        opinion: vote.opinion,
        createdAt: vote.created_at
      };
    }),
    summaryInsight: row.summary_insight ?? "",
    createdAt: row.created_at
  };
}

function firstRecord<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
