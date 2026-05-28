"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthPanel } from "@/components/AuthPanel";
import { articles } from "@/lib/data";
import { useLearningStore } from "@/providers/learning-store";

export default function CommunityPage() {
  const {
    currentUsername,
    communityPosts,
    customArticles,
    isHydrated,
    createCommunityPoll,
    voteCommunityPoll,
    updatePollSummaryInsight,
    addCommunityComment,
    deleteCommunityPost,
    deleteCommunityComment
  } = useLearningStore();
  const allArticles = [...customArticles, ...articles];
  const [commentDrafts, setCommentDrafts] = useState<
    Record<string, string>
  >({});
  const [pollTitle, setPollTitle] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", "", "", ""]);
  const [voteDrafts, setVoteDrafts] = useState<
    Record<string, { optionId: string; opinion: string }>
  >({});
  const [summaryDrafts, setSummaryDrafts] = useState<Record<string, string>>({});

  const updateCommentDraft = (postId: string, value: string) => {
    setCommentDrafts((current) => ({
      ...current,
      [postId]: value
    }));
  };

  const submitComment = (
    event: React.FormEvent<HTMLFormElement>,
    postId: string
  ) => {
    event.preventDefault();

    const draft = commentDrafts[postId] ?? "";
    addCommunityComment(postId, draft);
    setCommentDrafts((current) => ({
      ...current,
      [postId]: ""
    }));
  };

  const submitPoll = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createCommunityPoll({
      title: pollTitle,
      pollQuestion,
      options: pollOptions
    });
    setPollTitle("");
    setPollQuestion("");
    setPollOptions(["", "", "", ""]);
  };

  const submitVote = (
    event: React.FormEvent<HTMLFormElement>,
    postId: string
  ) => {
    event.preventDefault();

    const draft = voteDrafts[postId] ?? { optionId: "", opinion: "" };
    voteCommunityPoll({
      postId,
      optionId: draft.optionId,
      opinion: draft.opinion
    });
    setVoteDrafts((current) => ({
      ...current,
      [postId]: { optionId: draft.optionId, opinion: "" }
    }));
  };

  const updateVoteDraft = (
    postId: string,
    field: "optionId" | "opinion",
    value: string
  ) => {
    setVoteDrafts((current) => ({
      ...current,
      [postId]: {
        optionId: current[postId]?.optionId ?? "",
        opinion: current[postId]?.opinion ?? "",
        [field]: value
      }
    }));
  };

  if (!isHydrated) {
    return null;
  }

  if (!currentUsername) {
    return <AuthPanel />;
  }

  return (
    <main className="mx-auto max-w-[980px] space-y-8">
      <section className="rounded-[2rem] border border-line bg-paper/85 px-7 py-8 shadow-soft md:px-10">
        <p className="text-sm uppercase tracking-[0.22em] text-clay">
          Community
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-5xl font-semibold text-ink">
          Shared insights from study sessions
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-clay">
          Read how others connect saved news, compare their insights, and leave
          comments that help the discussion move forward.
        </p>
      </section>

      <form
        onSubmit={submitPoll}
        className="rounded-[2rem] border border-line bg-paper/95 p-6 shadow-soft"
      >
        <p className="text-sm uppercase tracking-[0.22em] text-clay">
          Ask the Community
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold text-ink">
          Post a question with a vote
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="text-xs uppercase tracking-[0.18em] text-clay">
              Title
            </span>
            <input
              value={pollTitle}
              onChange={(event) => setPollTitle(event.target.value)}
              className="mt-2 w-full rounded-[1rem] border border-line bg-paper px-4 py-3 text-base text-ink outline-none soft-ring focus:border-clay"
              placeholder="A topic you want to discuss"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-xs uppercase tracking-[0.18em] text-clay">
              Question
            </span>
            <textarea
              value={pollQuestion}
              onChange={(event) => setPollQuestion(event.target.value)}
              className="mt-2 min-h-[108px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-base leading-7 text-ink outline-none soft-ring focus:border-clay"
              placeholder="What should other learners react to?"
            />
          </label>

          {pollOptions.map((option, index) => (
            <label key={index} className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-clay">
                Option {index + 1}
              </span>
              <input
                value={option}
                onChange={(event) =>
                  setPollOptions((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? event.target.value : item
                    )
                  )
                }
                className="mt-2 w-full rounded-[1rem] border border-line bg-paper px-4 py-3 text-base text-ink outline-none soft-ring focus:border-clay"
                placeholder={index < 2 ? "Required" : "Optional"}
              />
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={
            !pollTitle.trim() ||
            !pollQuestion.trim() ||
            pollOptions.filter((option) => option.trim()).length < 2
          }
          className="soft-ring mt-5 rounded-full border border-clay bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
        >
          Post question
        </button>
      </form>

      {communityPosts.length > 0 ? (
        <section className="space-y-6">
          {communityPosts.map((post) => {
            const sources =
              post.sourceSnapshots.length > 0
                ? post.sourceSnapshots
                : allArticles.filter((article) =>
                    post.sourceSlugs.includes(article.slug)
                  );
            const commentBody = commentDrafts[post.id] ?? "";
            const canDeletePost = post.authorName === currentUsername;
            const isPoll = Boolean(post.pollOptions?.length);
            const pollVotes = post.pollVotes ?? [];
            const selectedVote = pollVotes.find(
              (vote) => vote.authorName === currentUsername
            );
            const voteDraft = voteDrafts[post.id] ?? {
              optionId: selectedVote?.optionId ?? "",
              opinion: ""
            };
            const summaryDraft =
              summaryDrafts[post.id] ?? post.summaryInsight ?? "";

            return (
              <article
                key={post.id}
                className="rounded-[2rem] border border-line bg-paper/95 p-6 shadow-soft"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-clay">
                      Shared by {post.authorName}
                    </p>
                    <h2 className="mt-2 font-[family-name:var(--font-heading)] text-4xl font-semibold leading-tight text-ink">
                      {post.title}
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs uppercase tracking-[0.14em] text-clay">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    {canDeletePost ? (
                      <button
                        type="button"
                        onClick={() => deleteCommunityPost(post.id)}
                        className="soft-ring rounded-full border border-line bg-paper px-3 py-1 text-xs uppercase tracking-[0.14em] text-clay hover:border-clay hover:text-ink"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>

                {isPoll ? (
                  <section className="mt-5 rounded-[1.25rem] border border-line bg-accent/40 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-clay">
                      Question
                    </p>
                    <p className="mt-2 whitespace-pre-line text-base leading-8 text-ink">
                      {post.pollQuestion}
                    </p>

                    <div className="mt-5 space-y-3">
                      {post.pollOptions?.map((option) => {
                        const optionVotes = pollVotes.filter(
                          (vote) => vote.optionId === option.id
                        );
                        const percentage =
                          pollVotes.length > 0
                            ? Math.round(
                                (optionVotes.length / pollVotes.length) * 100
                              )
                            : 0;

                        return (
                          <div
                            key={option.id}
                            className="rounded-[1rem] border border-line bg-paper/80 p-4"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <p className="font-medium text-ink">
                                {option.label}
                              </p>
                              <p className="text-sm text-clay">
                                {percentage}% / {optionVotes.length}
                              </p>
                            </div>
                            <div className="mt-3 h-3 overflow-hidden rounded-full bg-line">
                              <div
                                className="h-full rounded-full bg-moss transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>

                            {optionVotes.some((vote) => vote.opinion) ? (
                              <div className="mt-3 space-y-2">
                                {optionVotes
                                  .filter((vote) => vote.opinion)
                                  .map((vote) => (
                                    <p
                                      key={vote.id}
                                      className="rounded-[0.85rem] bg-accent/45 px-3 py-2 text-sm leading-6 text-clay"
                                    >
                                      <span className="font-medium text-ink">
                                        {vote.authorName}
                                      </span>
                                      : {vote.opinion}
                                    </p>
                                  ))}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>

                    <form
                      onSubmit={(event) => submitVote(event, post.id)}
                      className="mt-5 rounded-[1rem] border border-line bg-paper/80 p-4"
                    >
                      <p className="text-sm text-clay">
                        Voting as {currentUsername}
                      </p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {post.pollOptions?.map((option) => (
                          <label
                            key={option.id}
                            className="flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 text-sm text-clay"
                          >
                            <input
                              type="radio"
                              name={`vote-${post.id}`}
                              checked={voteDraft.optionId === option.id}
                              onChange={() =>
                                updateVoteDraft(post.id, "optionId", option.id)
                              }
                              className="accent-[#6f7f55]"
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                      <textarea
                        value={voteDraft.opinion}
                        onChange={(event) =>
                          updateVoteDraft(post.id, "opinion", event.target.value)
                        }
                        className="mt-3 min-h-[88px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-sm leading-7 text-ink outline-none soft-ring focus:border-clay"
                        placeholder="Add your reason or reaction."
                      />
                      <button
                        type="submit"
                        disabled={!voteDraft.optionId}
                        className="soft-ring mt-3 rounded-full border border-clay bg-ink px-5 py-2 text-sm font-medium text-paper transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
                      >
                        Vote
                      </button>
                    </form>

                    <div className="mt-5 rounded-[1rem] border border-line bg-paper/80 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-clay">
                        Summary Insight
                      </p>
                      {canDeletePost ? (
                        <>
                          <textarea
                            value={summaryDraft}
                            onChange={(event) =>
                              setSummaryDrafts((current) => ({
                                ...current,
                                [post.id]: event.target.value
                              }))
                            }
                            className="mt-2 min-h-[96px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-sm leading-7 text-ink outline-none soft-ring focus:border-clay"
                            placeholder="Later, AI can summarize the vote and reactions here."
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updatePollSummaryInsight(post.id, summaryDraft)
                            }
                            className="soft-ring mt-3 rounded-full border border-line bg-paper px-4 py-2 text-sm text-clay hover:border-clay hover:text-ink"
                          >
                            Save summary
                          </button>
                        </>
                      ) : (
                        <p className="mt-2 whitespace-pre-line text-sm leading-7 text-clay">
                          {post.summaryInsight ||
                            "A summary insight can be added by the question author."}
                        </p>
                      )}
                    </div>
                  </section>
                ) : (
                  <div className="mt-5 rounded-[1.25rem] border border-line bg-accent/40 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-clay">
                      Insight
                    </p>
                    <p className="mt-2 whitespace-pre-line text-base leading-8 text-ink">
                      {post.insight}
                    </p>
                  </div>
                )}

                {!isPoll ? (
                  <>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <section className="rounded-[1.25rem] border border-line bg-paper p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-clay">
                          Requirements
                        </p>
                        <p className="mt-2 whitespace-pre-line text-sm leading-7 text-clay">
                          {post.requirements}
                        </p>
                      </section>

                      <section className="rounded-[1.25rem] border border-line bg-paper p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-clay">
                          AI Result
                        </p>
                        <p className="mt-2 whitespace-pre-line text-sm leading-7 text-clay">
                          {post.analysis}
                        </p>
                      </section>
                    </div>

                    <section className="mt-5">
                      <p className="text-xs uppercase tracking-[0.18em] text-clay">
                        References
                      </p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        {sources.map((source) => (
                          <Link
                            key={source.slug}
                            href={source.sourceUrl}
                            className="soft-ring rounded-[1.25rem] border border-line bg-accent/45 p-4 hover:border-clay hover:bg-paper"
                          >
                            <p className="text-xs uppercase tracking-[0.14em] text-clay">
                              {source.sourceName}
                            </p>
                            <h3 className="mt-2 font-[family-name:var(--font-heading)] text-xl font-semibold leading-tight text-ink">
                              {source.title}
                            </h3>
                          </Link>
                        ))}
                      </div>
                    </section>
                  </>
                ) : null}

                <section className="mt-6 border-t border-line pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-clay">
                      Comments
                    </p>
                    <span className="text-sm text-clay">
                      {post.comments.length}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {post.comments.length > 0 ? (
                      post.comments.map((comment) => (
                        <article
                          key={comment.id}
                          className="rounded-[1.25rem] border border-line bg-paper/80 p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-medium text-ink">
                              {comment.authorName}
                            </p>
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
                      <div className="rounded-[1.25rem] border border-dashed border-line bg-paper/70 p-4 text-center text-sm text-clay">
                        No comments yet. Start the exchange with a question or a
                        connection.
                      </div>
                    )}
                  </div>

                  <form
                    onSubmit={(event) => submitComment(event, post.id)}
                    className="mt-4 rounded-[1.25rem] border border-line bg-accent/30 p-4"
                  >
                    <p className="text-sm text-clay">
                      Commenting as {currentUsername}
                    </p>
                    <textarea
                      value={commentBody}
                      onChange={(event) =>
                        updateCommentDraft(post.id, event.target.value)
                      }
                      className="mt-3 min-h-[96px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-sm leading-7 text-ink outline-none soft-ring focus:border-clay"
                      placeholder="Write a comment, question, or related insight."
                    />
                    <button
                      type="submit"
                      disabled={!commentBody.trim()}
                      className="soft-ring mt-3 rounded-full border border-clay bg-ink px-5 py-2 text-sm font-medium text-paper transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
                    >
                      Add comment
                    </button>
                  </form>
                </section>
              </article>
            );
          })}
        </section>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-line bg-paper/70 p-8 text-center text-clay">
          No shared insights yet. Share one of your saved analysis requests from
          Investigate to start the community.
        </div>
      )}
    </main>
  );
}
