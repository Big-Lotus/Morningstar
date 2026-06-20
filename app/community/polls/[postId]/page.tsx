"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthPanel } from "@/components/AuthPanel";
import {
  getCommunityCardVisual,
  getCommunityOpinionSummaries,
  getCommunityPollResults,
  getCommunityStoryBlocks,
  getCommunityUsefulExpressions,
  MARATHON_POST_ID
} from "@/lib/community-featured";
import { CommunityPost } from "@/lib/types";
import { useLearningStore } from "@/providers/learning-store";

export default function PollRoomPage() {
  const { postId } = useParams<{ postId: string }>();
  const {
    currentUsername,
    communityPosts,
    hasSavedWord,
    isHydrated,
    saveWord,
    voteCommunityPoll,
    updatePollSummaryInsight,
    addCommunityComment,
    deleteCommunityPost,
    deleteCommunityComment
  } = useLearningStore();
  const post = communityPosts.find((entry) => entry.id === postId);
  const selectedVote = post?.pollVotes?.find(
    (vote) => vote.authorName === currentUsername
  );
  const [voteDraft, setVoteDraft] = useState({
    optionId: selectedVote?.optionId ?? "",
    opinion: ""
  });
  const [summaryDraft, setSummaryDraft] = useState(post?.summaryInsight ?? "");
  const [summarySaved, setSummarySaved] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");

  useEffect(() => {
    setSummaryDraft(post?.summaryInsight ?? "");
    setSummarySaved(false);
  }, [post?.id, post?.summaryInsight]);

  useEffect(() => {
    setVoteDraft((current) => ({
      optionId: current.optionId || selectedVote?.optionId || "",
      opinion: current.opinion
    }));
  }, [selectedVote?.optionId]);

  if (!isHydrated) {
    return null;
  }

  if (!currentUsername) {
    return <AuthPanel />;
  }

  if (!post || !post.pollOptions?.length) {
    return (
      <main className="mx-auto w-full">
        <section className="rounded-[1.25rem] border border-dashed border-line bg-paper/90 p-8 text-center text-clay">
          This issue room is no longer available.
          <div className="mt-4">
            <Link
              href="/community"
              className="soft-ring inline-flex rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-moss"
            >
              Back to Community
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const pollResults = getCommunityPollResults(post);
  const opinionSummaries = getCommunityOpinionSummaries(post);
  const storyBlocks = getCommunityStoryBlocks(post);
  const usefulExpressions = getCommunityUsefulExpressions(post);
  const visual = getCommunityCardVisual(post, 0);
  const totalVotes = pollResults.reduce((sum, result) => sum + result.votes, 0);
  const canDeletePost =
    post.authorName === currentUsername && post.id !== MARATHON_POST_ID;

  const submitVote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    voteCommunityPoll({
      postId: post.id,
      optionId: voteDraft.optionId,
      opinion: voteDraft.opinion
    });
    setVoteDraft((current) => ({ ...current, opinion: "" }));
  };

  const submitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addCommunityComment(post.id, commentDraft);
    setCommentDraft("");
  };

  const saveSummary = () => {
    updatePollSummaryInsight(post.id, summaryDraft);
    setSummarySaved(true);
  };

  const saveExpression = (
    expression: ReturnType<typeof getCommunityUsefulExpressions>[number]
  ) => {
    saveWord({
      word: expression.phrase,
      meaning: expression.meaning,
      sentence: expression.example
    });
  };

  return (
    <main className="mx-auto w-full space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] bg-paper shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
        <div className="grid lg:grid-cols-[1.04fr_0.96fr]">
          <div className="px-5 py-7 md:px-8 lg:px-10">
            <Link
              href="/community"
              className="soft-ring inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink hover:-translate-y-0.5 hover:bg-line"
            >
              Back to cards
            </Link>
            <p className="mt-8 text-sm font-semibold text-moss">
              Community issue room
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-heading)] text-5xl font-semibold leading-[0.96] tracking-[-0.06em] text-ink md:text-7xl">
              {post.title}
            </h1>
            <p className="mt-5 max-w-4xl whitespace-pre-line text-lg leading-8 text-clay">
              {post.pollQuestion}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Metric label="Votes" value={totalVotes} />
              <Metric label="Comments" value={post.comments.length} />
              <Metric label="By" value={post.authorName} />
            </div>
            {canDeletePost ? (
              <button
                type="button"
                onClick={() => deleteCommunityPost(post.id)}
                className="soft-ring mt-5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-clay hover:bg-line hover:text-ink"
              >
                Delete room
              </button>
            ) : null}
          </div>

          <div className="relative min-h-[420px] overflow-hidden bg-ink">
            <img
              src={visual.imageUrl}
              alt={visual.imageAlt}
              className="absolute inset-0 h-full w-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.72))]" />
            <div className="relative flex h-full min-h-[420px] items-end p-5 md:p-8">
              <div className="rounded-[1.15rem] bg-white/[0.14] p-4 text-white backdrop-blur-md">
                <p className="text-sm font-semibold text-white">Card angle</p>
                <p className="mt-2 max-w-lg text-sm leading-6 text-white/74">
                  {visual.deck}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          {usefulExpressions.length > 0 ? (
            <section className="rounded-[1.25rem] bg-paper p-5 shadow-[0_18px_52px_rgba(0,0,0,0.18)] md:p-6">
              <p className="text-sm font-semibold text-moss">
                Useful Expressions
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-[-0.05em] text-ink">
                Key words from this debate
              </h2>
              <div className="mt-6 grid gap-3">
                {usefulExpressions.map((expression) => {
                  const isSaved = hasSavedWord(
                    expression.phrase,
                    expression.example
                  );

                  return (
                    <article
                      key={expression.id}
                      className="rounded-[1rem] border border-line bg-accent/60 p-4"
                    >
                      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                        <div>
                          <p className="font-[family-name:var(--font-heading)] text-2xl font-semibold leading-tight tracking-[-0.035em] text-ink">
                            {expression.phrase}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-clay">
                            {expression.meaning}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => saveExpression(expression)}
                          disabled={isSaved}
                          className="soft-ring w-fit shrink-0 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:-translate-y-0.5 hover:bg-moss disabled:cursor-default disabled:bg-line disabled:text-clay"
                        >
                          {isSaved ? "Saved" : "Save"}
                        </button>
                      </div>
                      <p className="mt-3 rounded-[0.85rem] bg-paper/82 px-3 py-2 text-sm leading-6 text-clay">
                        <span className="font-bold text-ink">Ex)</span>{" "}
                        {expression.example}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section className="rounded-[1.25rem] bg-paper p-5 shadow-[0_18px_52px_rgba(0,0,0,0.18)] md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-moss">Poll results</p>
                <h2 className="mt-1 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-[-0.05em] text-ink">
                  {totalVotes} people shared their opinions
                </h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {pollResults.map((result) => (
                <ResultCard key={result.optionId} result={result} />
              ))}
            </div>
          </section>

          {opinionSummaries.length > 0 ? (
            <section className="rounded-[1.25rem] bg-paper p-5 shadow-[0_18px_52px_rgba(0,0,0,0.18)] md:p-6">
              <p className="text-sm font-semibold text-moss">
                Opinion summaries by vote
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-[-0.05em] text-ink">
                What each side emphasized
              </h2>
              <div className="mt-6 grid gap-4">
                {opinionSummaries.map((summary) => (
                  <OpinionSummaryCard
                    key={summary.optionId}
                    summary={summary}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {storyBlocks.length > 0 ? (
            <section className="grid gap-4">
              {storyBlocks.map((block) => (
                <article
                  key={block.title}
                  className="rounded-[1.25rem] bg-paper p-5 shadow-[0_18px_52px_rgba(0,0,0,0.18)] md:p-6"
                >
                  <p className="text-sm font-semibold text-moss">{block.eyebrow}</p>
                  <h2 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-semibold leading-tight tracking-[-0.045em] text-ink md:text-4xl">
                    {block.title}
                  </h2>
                  <div className="mt-4 grid gap-3">
                    {block.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="max-w-3xl text-base leading-8 text-clay"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </section>
          ) : null}
        </div>

        <aside className="space-y-5">
          <form
            onSubmit={submitVote}
            className="rounded-[1.25rem] bg-paper p-5 shadow-[0_18px_52px_rgba(0,0,0,0.18)]"
          >
            <p className="text-sm font-semibold text-moss">Vote as {currentUsername}</p>
            <div className="mt-4 grid gap-2">
              {post.pollOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-3 rounded-[1rem] bg-accent px-4 py-3 text-sm font-medium text-ink"
                >
                  <input
                    type="radio"
                    name={`vote-${post.id}`}
                    checked={voteDraft.optionId === option.id}
                    onChange={() =>
                      setVoteDraft((current) => ({
                        ...current,
                        optionId: option.id
                      }))
                    }
                    className="accent-[#5bbeb2]"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            <textarea
              value={voteDraft.opinion}
              onChange={(event) =>
                setVoteDraft((current) => ({
                  ...current,
                  opinion: event.target.value
                }))
              }
              className="mt-3 min-h-[104px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-sm leading-7 text-ink outline-none soft-ring focus:border-clay"
              placeholder="Add your reason or reaction."
            />
            <button
              type="submit"
              disabled={!voteDraft.optionId}
              className="soft-ring mt-3 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:-translate-y-0.5 hover:bg-moss disabled:cursor-not-allowed disabled:bg-line disabled:text-clay"
            >
              Vote
            </button>
          </form>

          <section className="rounded-[1.25rem] bg-paper p-5 shadow-[0_18px_52px_rgba(0,0,0,0.18)]">
            <p className="text-sm font-semibold text-moss">Community takeaway</p>
            {canDeletePost ? (
              <>
                <textarea
                  value={summaryDraft}
                  onChange={(event) => setSummaryDraft(event.target.value)}
                  className="mt-3 min-h-[112px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-sm leading-7 text-ink outline-none soft-ring focus:border-clay"
                  placeholder="Summarize the strongest reactions here."
                />
                <button
                  type="button"
                  onClick={saveSummary}
                  className="soft-ring mt-3 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink hover:bg-line"
                >
                  Save summary
                </button>
                {summarySaved ? (
                  <p className="mt-2 text-sm text-moss">Summary saved.</p>
                ) : null}
              </>
            ) : (
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-clay">
                {post.summaryInsight ||
                  "A summary insight can be added by the question author."}
              </p>
            )}
          </section>

          <CommentsPanel
            post={post}
            currentUsername={currentUsername}
            commentDraft={commentDraft}
            onCommentDraftChange={setCommentDraft}
            onCommentSubmit={submitComment}
            onDeleteComment={(commentId) =>
              deleteCommunityComment(post.id, commentId)
            }
          />
        </aside>
      </section>
    </main>
  );
}

function ResultCard({
  result
}: {
  result: ReturnType<typeof getCommunityPollResults>[number];
}) {
  return (
    <article className="rounded-[1rem] bg-accent p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className={`block h-3 w-3 rounded-full ${result.swatchClass}`} />
          <h3 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-semibold leading-tight tracking-[-0.04em] text-ink">
            {result.label}
          </h3>
        </div>
        <p className="font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-[-0.05em] text-ink tabular-nums">
          {result.percentage.toFixed(result.percentage % 1 ? 1 : 0)}%
        </p>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-paper">
        <div
          className={`h-full rounded-full ${result.barClass}`}
          style={{ width: `${result.percentage}%` }}
        />
      </div>
      <p className="mt-3 text-sm font-medium text-clay">{result.votes} votes</p>
    </article>
  );
}

function OpinionSummaryCard({
  summary
}: {
  summary: ReturnType<typeof getCommunityOpinionSummaries>[number];
}) {
  return (
    <article
      className={`rounded-[1rem] border p-4 ${summary.borderClass} ${summary.surfaceClass}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${summary.swatchClass}`} />
            <p className="text-sm font-semibold text-ink">{summary.label}</p>
          </div>
          <p className="mt-2 text-xs font-semibold text-clay">{summary.tone}</p>
        </div>
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-clay">
        {summary.summary}
      </p>
      <div className="mt-4 grid gap-2">
        {summary.points.map((point) => (
          <p
            key={point}
            className="rounded-[0.85rem] bg-paper/72 px-3 py-2 text-sm leading-6 text-clay"
          >
            {point}
          </p>
        ))}
      </div>
      {summary.examples?.length ? (
        <div className="mt-5 border-t border-ink/10 pt-4">
          <p className="text-xs font-semibold text-clay">Opinion examples</p>
          <div className="mt-3 grid gap-3">
            {summary.examples.map((example, index) => (
              <article
                key={`${summary.optionId}-${example.name}-${index}`}
                className="rounded-[0.9rem] bg-paper/82 px-4 py-3"
              >
                <p className={`text-sm font-bold ${summary.textClass}`}>
                  {example.name}
                </p>
                <p className="mt-1 text-sm leading-7 text-clay">
                  {example.opinion}
                </p>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <blockquote className="mt-4 border-l-4 border-ink/12 pl-4 text-sm font-medium leading-7 text-ink">
          {summary.quote}
        </blockquote>
      )}
    </article>
  );
}

function CommentsPanel({
  post,
  currentUsername,
  commentDraft,
  onCommentDraftChange,
  onCommentSubmit,
  onDeleteComment
}: {
  post: CommunityPost;
  currentUsername: string;
  commentDraft: string;
  onCommentDraftChange: (value: string) => void;
  onCommentSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onDeleteComment: (commentId: string) => void;
}) {
  return (
    <section className="rounded-[1.25rem] bg-paper p-5 shadow-[0_18px_52px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-moss">Comments</p>
        <span className="text-sm text-clay">{post.comments.length}</span>
      </div>
      <div className="mt-4 grid gap-3">
        {post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <article key={comment.id} className="rounded-[1rem] bg-accent p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-ink">{comment.authorName}</p>
                {comment.authorName === currentUsername ? (
                  <button
                    type="button"
                    onClick={() => onDeleteComment(comment.id)}
                    className="soft-ring rounded-full bg-paper px-3 py-1 text-xs font-semibold text-clay hover:bg-line hover:text-ink"
                  >
                    Delete
                  </button>
                ) : null}
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-clay">
                {comment.body}
              </p>
            </article>
          ))
        ) : (
          <p className="rounded-[1rem] border border-dashed border-line bg-paper/70 p-4 text-center text-sm text-clay">
            No comments yet.
          </p>
        )}
      </div>
      <form onSubmit={onCommentSubmit} className="mt-4">
        <textarea
          value={commentDraft}
          onChange={(event) => onCommentDraftChange(event.target.value)}
          className="min-h-[88px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-sm leading-7 text-ink outline-none soft-ring focus:border-clay"
          placeholder="Write a comment, question, or related insight."
        />
        <button
          type="submit"
          disabled={!commentDraft.trim()}
          className="soft-ring mt-3 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:-translate-y-0.5 hover:bg-moss disabled:cursor-not-allowed disabled:bg-line disabled:text-clay"
        >
          Add comment
        </button>
      </form>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-full bg-accent px-5 py-3">
      <span className="text-sm font-semibold text-ink">{value}</span>
      <span className="ml-2 text-sm text-clay">{label}</span>
    </div>
  );
}
