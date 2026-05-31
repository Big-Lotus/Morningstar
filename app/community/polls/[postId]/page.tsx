"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthPanel } from "@/components/AuthPanel";
import { useLearningStore } from "@/providers/learning-store";

export default function PollRoomPage() {
  const { postId } = useParams<{ postId: string }>();
  const {
    currentUsername,
    communityPosts,
    isHydrated,
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
        <section className="rounded-[1.35rem] border border-dashed border-line bg-paper/80 p-8 text-center text-clay">
          This issue room is no longer available.
          <div className="mt-4">
            <Link
              href="/community"
              className="soft-ring inline-flex rounded-full border border-line bg-paper px-4 py-2 text-sm text-clay hover:border-moss hover:text-ink"
            >
              Back to Community
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const pollVotes = post.pollVotes ?? [];
  const canDeletePost = post.authorName === currentUsername;

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

  return (
    <main className="mx-auto w-full space-y-6">
      <section className="grid gap-5 border-b border-line/80 pb-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div>
          <Link
            href="/community"
            className="soft-ring inline-flex rounded-full border border-line bg-paper/90 px-4 py-2 text-sm text-clay hover:border-moss hover:text-ink"
          >
            Back to Community
          </Link>
          <p className="mt-5 text-sm uppercase tracking-[0.22em] text-moss">
            Issue Room {"\uD83D\uDD25"}
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-heading)] text-5xl font-semibold leading-tight text-ink md:text-7xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-5xl whitespace-pre-line text-lg leading-8 text-clay">
            {post.pollQuestion}
          </p>
        </div>

        <aside className="rounded-[1.35rem] border border-moss/30 bg-[linear-gradient(135deg,#fff7ed,#f7ddc6)] p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.18em] text-clay">
            Shared by
          </p>
          <p className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-semibold text-ink">
            {post.authorName}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[1rem] bg-paper/80 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-clay">
                Votes
              </p>
              <p className="mt-2 font-[family-name:var(--font-heading)] text-4xl text-ink">
                {pollVotes.length}
              </p>
            </div>
            <div className="rounded-[1rem] bg-paper/80 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-clay">
                Comments
              </p>
              <p className="mt-2 font-[family-name:var(--font-heading)] text-4xl text-ink">
                {post.comments.length}
              </p>
            </div>
          </div>
          {canDeletePost ? (
            <button
              type="button"
              onClick={() => deleteCommunityPost(post.id)}
              className="soft-ring mt-5 rounded-full border border-line bg-paper px-4 py-2 text-sm text-clay hover:border-moss hover:text-ink"
            >
              Delete room
            </button>
          ) : null}
        </aside>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="grid gap-4 lg:grid-cols-2">
          {post.pollOptions.map((option) => {
            const optionVotes = pollVotes.filter(
              (vote) => vote.optionId === option.id
            );
            const percentage =
              pollVotes.length > 0
                ? Math.round((optionVotes.length / pollVotes.length) * 100)
                : 0;

            return (
              <article
                key={option.id}
                className="rounded-[1.35rem] border border-line bg-paper/95 p-5 shadow-soft"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold text-ink">
                    {option.label}
                  </h2>
                  <p className="text-sm font-medium text-moss">
                    {percentage}% / {optionVotes.length}
                  </p>
                </div>
                <div className="mt-4 h-4 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-moss transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="mt-4 grid gap-2">
                  {optionVotes.filter((vote) => vote.opinion).length > 0 ? (
                    optionVotes
                      .filter((vote) => vote.opinion)
                      .map((vote) => (
                        <p
                          key={vote.id}
                          className="rounded-[1rem] bg-accent/35 px-3 py-2 text-sm leading-6 text-clay"
                        >
                          <span className="font-medium text-ink">
                            {vote.authorName}
                          </span>
                          : {vote.opinion}
                        </p>
                      ))
                  ) : (
                    <p className="rounded-[1rem] bg-accent/25 px-3 py-2 text-sm text-clay">
                      No written reactions yet.
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <aside className="space-y-5">
          <form
            onSubmit={submitVote}
            className="rounded-[1.35rem] border border-line bg-paper/95 p-5 shadow-soft"
          >
            <p className="text-sm text-clay">Voting as {currentUsername}</p>
            <div className="mt-3 grid gap-2">
              {post.pollOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 text-sm text-clay"
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
                    className="accent-[#e57945]"
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
              className="mt-3 min-h-[96px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-sm leading-7 text-ink outline-none soft-ring focus:border-clay"
              placeholder="Add your reason or reaction."
            />
            <button
              type="submit"
              disabled={!voteDraft.optionId}
              className="soft-ring mt-3 rounded-full border border-moss bg-moss px-5 py-2 text-sm font-medium text-paper transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
            >
              Vote
            </button>
          </form>

          <section className="rounded-[1.35rem] border border-line bg-paper/95 p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.18em] text-clay">
              Summary Insight
            </p>
            {canDeletePost ? (
              <>
                <textarea
                  value={summaryDraft}
                  onChange={(event) => setSummaryDraft(event.target.value)}
                  className="mt-2 min-h-[112px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-sm leading-7 text-ink outline-none soft-ring focus:border-clay"
                  placeholder="Summarize the strongest reactions here."
                />
                <button
                  type="button"
                  onClick={saveSummary}
                  className="soft-ring mt-3 rounded-full border border-line bg-paper px-4 py-2 text-sm text-clay hover:border-moss hover:text-ink"
                >
                  Save summary
                </button>
                {summarySaved ? (
                  <p className="mt-2 text-sm text-moss">Summary saved.</p>
                ) : null}
              </>
            ) : (
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-clay">
                {post.summaryInsight ||
                  "A summary insight can be added by the question author."}
              </p>
            )}
          </section>
        </aside>
      </section>

      <section className="rounded-[1.35rem] border border-line bg-paper/95 p-5 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm uppercase tracking-[0.2em] text-clay">
            Comments
          </p>
          <span className="text-sm text-clay">{post.comments.length}</span>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-[1rem] border border-line bg-paper/80 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-ink">{comment.authorName}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs uppercase tracking-[0.14em] text-clay">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                    {comment.authorName === currentUsername ? (
                      <button
                        type="button"
                        onClick={() =>
                          deleteCommunityComment(post.id, comment.id)
                        }
                        className="soft-ring rounded-full border border-line bg-paper px-3 py-1 text-xs uppercase tracking-[0.14em] text-clay hover:border-clay hover:text-ink"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-clay">
                  {comment.body}
                </p>
              </article>
            ))
          ) : (
            <div className="rounded-[1rem] border border-dashed border-line bg-paper/70 p-4 text-center text-sm text-clay lg:col-span-2">
              No comments yet.
            </div>
          )}
        </div>
        <form onSubmit={submitComment} className="mt-4 rounded-[1rem] bg-accent/30 p-4">
          <p className="text-sm text-clay">Commenting as {currentUsername}</p>
          <textarea
            value={commentDraft}
            onChange={(event) => setCommentDraft(event.target.value)}
            className="mt-3 min-h-[88px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-sm leading-7 text-ink outline-none soft-ring focus:border-clay"
            placeholder="Write a comment, question, or related insight."
          />
          <button
            type="submit"
            disabled={!commentDraft.trim()}
            className="soft-ring mt-3 rounded-full border border-moss bg-moss px-5 py-2 text-sm font-medium text-paper transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
          >
            Add comment
          </button>
        </form>
      </section>
    </main>
  );
}
