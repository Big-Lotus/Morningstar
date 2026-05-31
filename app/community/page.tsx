"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthPanel } from "@/components/AuthPanel";
import { Article, CommunityPost } from "@/lib/types";
import { useLearningStore } from "@/providers/learning-store";

type CommunityView = "insights" | "issues";

export default function CommunityPage() {
  const {
    currentUsername,
    communityPosts,
    customArticles,
    feedArticles,
    isHydrated,
    createCommunityPoll,
    voteCommunityPoll,
    updatePollSummaryInsight,
    addCommunityComment,
    deleteCommunityPost,
    deleteCommunityComment
  } = useLearningStore();
  const allArticles = [...customArticles, ...feedArticles];
  const insightPosts = communityPosts.filter((post) => !post.pollOptions?.length);
  const issuePosts = communityPosts.filter((post) => post.pollOptions?.length);
  const hotPolls = [...issuePosts]
    .sort((a, b) => (b.pollVotes?.length ?? 0) - (a.pollVotes?.length ?? 0))
    .slice(0, 3);
  const [activeView, setActiveView] = useState<CommunityView>("insights");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
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

    addCommunityComment(postId, commentDrafts[postId] ?? "");
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
    setActiveView("issues");
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
    <main className="mx-auto w-full space-y-7">
      <section className="grid gap-5 border-b border-line/80 pb-7 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-moss">
            Community
          </p>
          <h1 className="mt-3 max-w-4xl font-[family-name:var(--font-heading)] text-5xl font-semibold leading-tight text-ink md:text-6xl">
            Insight boards and live issue rooms.
          </h1>
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveView("insights")}
              className={`soft-ring rounded-full border px-5 py-3 text-sm font-medium ${
                activeView === "insights"
                  ? "border-moss bg-moss text-paper"
                  : "border-line bg-paper/90 text-clay hover:border-moss hover:text-ink"
              }`}
            >
              Shared Analysis
            </button>
            <button
              type="button"
              onClick={() => setActiveView("issues")}
              className={`soft-ring rounded-full border px-5 py-3 text-sm font-medium ${
                activeView === "issues"
                  ? "border-moss bg-moss text-paper"
                  : "border-line bg-paper/90 text-clay hover:border-moss hover:text-ink"
              }`}
            >
              Votes & Issues
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <MetricCard label="Analysis" value={insightPosts.length.toString()} />
          <MetricCard label="Issues" value={issuePosts.length.toString()} />
          <MetricCard
            label="Votes"
            value={issuePosts
              .reduce((total, post) => total + (post.pollVotes?.length ?? 0), 0)
              .toString()}
          />
        </div>
      </section>

      {hotPolls.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-moss">
                On Rage 🔥
              </p>
              <h2 className="mt-1 font-[family-name:var(--font-heading)] text-4xl font-semibold text-ink">
                Most active issue rooms
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveView("issues")}
              className="soft-ring hidden rounded-full border border-line bg-paper/90 px-4 py-2 text-sm text-clay hover:border-moss hover:text-ink md:inline-flex"
            >
              See all issues
            </button>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {hotPolls.map((post, index) => (
              <HotPollCard key={post.id} post={post} rank={index + 1} />
            ))}
          </div>
        </section>
      ) : null}

      {activeView === "insights" ? (
        <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
          {insightPosts.length > 0 ? (
            insightPosts.map((post) => {
              const sources = getSources(post, allArticles);

              return (
                <InsightCard
                  key={post.id}
                  post={post}
                  sources={sources}
                  currentUsername={currentUsername}
                  commentBody={commentDrafts[post.id] ?? ""}
                  onCommentChange={(value) => updateCommentDraft(post.id, value)}
                  onCommentSubmit={(event) => submitComment(event, post.id)}
                  onDeletePost={() => deleteCommunityPost(post.id)}
                  onDeleteComment={(commentId) =>
                    deleteCommunityComment(post.id, commentId)
                  }
                />
              );
            })
          ) : (
            <EmptyPanel text="No shared analysis yet. Share an investigation to open the board." />
          )}
        </section>
      ) : (
        <section className="grid gap-5 xl:grid-cols-[0.76fr_1.24fr]">
          <PollComposer
            title={pollTitle}
            question={pollQuestion}
            options={pollOptions}
            onTitleChange={setPollTitle}
            onQuestionChange={setPollQuestion}
            onOptionsChange={setPollOptions}
            onSubmit={submitPoll}
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {issuePosts.length > 0 ? (
              issuePosts.map((post) => {
                const canDeletePost = post.authorName === currentUsername;
                const selectedVote = post.pollVotes?.find(
                  (vote) => vote.authorName === currentUsername
                );
                const voteDraft = voteDrafts[post.id] ?? {
                  optionId: selectedVote?.optionId ?? "",
                  opinion: ""
                };
                const summaryDraft =
                  summaryDrafts[post.id] ?? post.summaryInsight ?? "";

                return (
                  <IssueCard
                    key={post.id}
                    post={post}
                    currentUsername={currentUsername}
                    voteDraft={voteDraft}
                    summaryDraft={summaryDraft}
                    canDeletePost={canDeletePost}
                    commentBody={commentDrafts[post.id] ?? ""}
                    onVoteDraftChange={(field, value) =>
                      updateVoteDraft(post.id, field, value)
                    }
                    onVoteSubmit={(event) => submitVote(event, post.id)}
                    onSummaryChange={(value) =>
                      setSummaryDrafts((current) => ({
                        ...current,
                        [post.id]: value
                      }))
                    }
                    onSummarySave={() =>
                      updatePollSummaryInsight(post.id, summaryDraft)
                    }
                    onCommentChange={(value) => updateCommentDraft(post.id, value)}
                    onCommentSubmit={(event) => submitComment(event, post.id)}
                    onDeletePost={() => deleteCommunityPost(post.id)}
                    onDeleteComment={(commentId) =>
                      deleteCommunityComment(post.id, commentId)
                    }
                  />
                );
              })
            ) : (
              <EmptyPanel text="No issue rooms yet. Create the first question." />
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-line bg-paper/92 px-5 py-4 shadow-soft">
      <p className="text-xs uppercase tracking-[0.18em] text-clay">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-heading)] text-4xl font-semibold text-ink">
        {value}
      </p>
    </div>
  );
}

function HotPollCard({ post, rank }: { post: CommunityPost; rank: number }) {
  const votes = post.pollVotes?.length ?? 0;
  const opinions = post.pollVotes?.filter((vote) => vote.opinion).slice(0, 2) ?? [];

  return (
    <article className="rounded-[1.35rem] border border-moss/35 bg-[linear-gradient(135deg,#fff7ed,#f7ddc6)] p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-moss px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-paper">
          #{rank} On Rage
        </span>
        <span className="text-sm font-medium text-moss">{votes} votes</span>
      </div>
      <h3 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-semibold leading-tight text-ink">
        {post.title}
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-clay">
        {post.pollQuestion}
      </p>
      <div className="mt-4 grid gap-2">
        {opinions.length > 0 ? (
          opinions.map((vote) => (
            <p
              key={vote.id}
              className="rounded-[1rem] bg-paper/80 px-3 py-2 text-sm leading-6 text-clay"
            >
              <span className="font-medium text-ink">{vote.authorName}</span>:{" "}
              {vote.opinion}
            </p>
          ))
        ) : (
          <p className="rounded-[1rem] bg-paper/70 px-3 py-2 text-sm text-clay">
            Be the first to leave a reason.
          </p>
        )}
      </div>
      <Link
        href={`/community/polls/${post.id}`}
        target="_blank"
        rel="noreferrer"
        className="soft-ring mt-4 inline-flex rounded-full border border-moss bg-moss px-4 py-2 text-sm font-medium text-paper hover:-translate-y-0.5"
      >
        Open room
      </Link>
    </article>
  );
}

function InsightCard({
  post,
  sources,
  currentUsername,
  commentBody,
  onCommentChange,
  onCommentSubmit,
  onDeletePost,
  onDeleteComment
}: {
  post: CommunityPost;
  sources: Article[];
  currentUsername: string;
  commentBody: string;
  onCommentChange: (value: string) => void;
  onCommentSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onDeletePost: () => void;
  onDeleteComment: (commentId: string) => void;
}) {
  const canDeletePost = post.authorName === currentUsername;

  return (
    <article className="rounded-[1.35rem] border border-line bg-paper/95 p-5 shadow-soft">
      <PostHeader post={post} canDeletePost={canDeletePost} onDeletePost={onDeletePost} />
      <div className="mt-4 rounded-[1.15rem] bg-accent/40 px-4 py-3">
        <p className="text-xs uppercase tracking-[0.18em] text-clay">Insight</p>
        <p className="mt-2 whitespace-pre-line text-base leading-7 text-ink">
          {post.insight}
        </p>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <MiniTextPanel label="Requirements" text={post.requirements} />
        <MiniTextPanel label="AI Result" text={post.analysis} />
      </div>
      {sources.length > 0 ? <ReferenceGrid sources={sources} /> : null}
      <CommentsPanel
        post={post}
        currentUsername={currentUsername}
        commentBody={commentBody}
        onCommentChange={onCommentChange}
        onCommentSubmit={onCommentSubmit}
        onDeleteComment={onDeleteComment}
      />
    </article>
  );
}

function IssueCard({
  post,
  currentUsername,
  voteDraft,
  summaryDraft,
  canDeletePost,
  commentBody,
  onVoteDraftChange,
  onVoteSubmit,
  onSummaryChange,
  onSummarySave,
  onCommentChange,
  onCommentSubmit,
  onDeletePost,
  onDeleteComment
}: {
  post: CommunityPost;
  currentUsername: string;
  voteDraft: { optionId: string; opinion: string };
  summaryDraft: string;
  canDeletePost: boolean;
  commentBody: string;
  onVoteDraftChange: (field: "optionId" | "opinion", value: string) => void;
  onVoteSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onSummaryChange: (value: string) => void;
  onSummarySave: () => void;
  onCommentChange: (value: string) => void;
  onCommentSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onDeletePost: () => void;
  onDeleteComment: (commentId: string) => void;
}) {
  const pollVotes = post.pollVotes ?? [];

  return (
    <article className="rounded-[1.35rem] border border-line bg-paper/95 p-5 shadow-soft">
      <PostHeader post={post} canDeletePost={canDeletePost} onDeletePost={onDeletePost} />
      <Link
        href={`/community/polls/${post.id}`}
        target="_blank"
        rel="noreferrer"
        className="soft-ring mt-4 inline-flex rounded-full border border-line bg-paper px-4 py-2 text-sm text-clay hover:border-moss hover:text-ink"
      >
        Open issue room
      </Link>
      <p className="mt-4 whitespace-pre-line text-base leading-7 text-ink">
        {post.pollQuestion}
      </p>

      <div className="mt-5 grid gap-3">
        {post.pollOptions?.map((option) => {
          const optionVotes = pollVotes.filter((vote) => vote.optionId === option.id);
          const percentage =
            pollVotes.length > 0
              ? Math.round((optionVotes.length / pollVotes.length) * 100)
              : 0;

          return (
            <div key={option.id} className="rounded-[1rem] border border-line bg-[#fff8ef] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-ink">{option.label}</p>
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
              <div className="mt-3 grid gap-2">
                {optionVotes
                  .filter((vote) => vote.opinion)
                  .map((vote) => (
                    <p
                      key={vote.id}
                      className="rounded-[0.9rem] bg-paper px-3 py-2 text-sm leading-6 text-clay"
                    >
                      <span className="font-medium text-ink">{vote.authorName}</span>:{" "}
                      {vote.opinion}
                    </p>
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={onVoteSubmit} className="mt-5 border-t border-line pt-4">
        <p className="text-sm text-clay">Voting as {currentUsername}</p>
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
                onChange={() => onVoteDraftChange("optionId", option.id)}
                className="accent-[#e57945]"
              />
              {option.label}
            </label>
          ))}
        </div>
        <textarea
          value={voteDraft.opinion}
          onChange={(event) => onVoteDraftChange("opinion", event.target.value)}
          className="mt-3 min-h-[88px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-sm leading-7 text-ink outline-none soft-ring focus:border-clay"
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

      <div className="mt-5 rounded-[1rem] border border-line bg-accent/30 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-clay">
          Summary Insight
        </p>
        {canDeletePost ? (
          <>
            <textarea
              value={summaryDraft}
              onChange={(event) => onSummaryChange(event.target.value)}
              className="mt-2 min-h-[88px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-sm leading-7 text-ink outline-none soft-ring focus:border-clay"
              placeholder="Summarize the strongest reactions here."
            />
            <button
              type="button"
              onClick={onSummarySave}
              className="soft-ring mt-3 rounded-full border border-line bg-paper px-4 py-2 text-sm text-clay hover:border-moss hover:text-ink"
            >
              Save summary
            </button>
          </>
        ) : (
          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-clay">
            {post.summaryInsight || "A summary insight can be added by the question author."}
          </p>
        )}
      </div>

      <CommentsPanel
        post={post}
        currentUsername={currentUsername}
        commentBody={commentBody}
        onCommentChange={onCommentChange}
        onCommentSubmit={onCommentSubmit}
        onDeleteComment={onDeleteComment}
      />
    </article>
  );
}

function PollComposer({
  title,
  question,
  options,
  onTitleChange,
  onQuestionChange,
  onOptionsChange,
  onSubmit
}: {
  title: string;
  question: string;
  options: string[];
  onTitleChange: (value: string) => void;
  onQuestionChange: (value: string) => void;
  onOptionsChange: (value: string[]) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="h-fit rounded-[1.35rem] border border-line bg-paper/95 p-5 shadow-soft"
    >
      <p className="text-sm uppercase tracking-[0.22em] text-moss">
        Ask the Community
      </p>
      <h2 className="mt-2 font-[family-name:var(--font-heading)] text-4xl font-semibold text-ink">
        Open an issue room
      </h2>
      <label className="mt-5 block">
        <span className="text-xs uppercase tracking-[0.18em] text-clay">Title</span>
        <input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          className="mt-2 w-full rounded-[1rem] border border-line bg-paper px-4 py-3 text-base text-ink outline-none soft-ring focus:border-clay"
          placeholder="A topic you want to discuss"
        />
      </label>
      <label className="mt-4 block">
        <span className="text-xs uppercase tracking-[0.18em] text-clay">
          Question
        </span>
        <textarea
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
          className="mt-2 min-h-[108px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-base leading-7 text-ink outline-none soft-ring focus:border-clay"
          placeholder="What should other learners react to?"
        />
      </label>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
        {options.map((option, index) => (
          <label key={index} className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-clay">
              Option {index + 1}
            </span>
            <input
              value={option}
              onChange={(event) =>
                onOptionsChange(
                  options.map((item, itemIndex) =>
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
          !title.trim() ||
          !question.trim() ||
          options.filter((option) => option.trim()).length < 2
        }
        className="soft-ring mt-5 rounded-full border border-moss bg-moss px-6 py-3 text-sm font-medium text-paper transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
      >
        Post question
      </button>
    </form>
  );
}

function PostHeader({
  post,
  canDeletePost,
  onDeletePost
}: {
  post: CommunityPost;
  canDeletePost: boolean;
  onDeletePost: () => void;
}) {
  return (
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
            onClick={onDeletePost}
            className="soft-ring rounded-full border border-line bg-paper px-3 py-1 text-xs uppercase tracking-[0.14em] text-clay hover:border-clay hover:text-ink"
          >
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
}

function MiniTextPanel({ label, text }: { label: string; text: string }) {
  return (
    <section className="rounded-[1rem] border border-line bg-[#fff8ef] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-clay">{label}</p>
      <p className="mt-2 line-clamp-5 whitespace-pre-line text-sm leading-7 text-clay">
        {text}
      </p>
    </section>
  );
}

function ReferenceGrid({ sources }: { sources: Article[] }) {
  return (
    <section className="mt-5">
      <p className="text-xs uppercase tracking-[0.18em] text-clay">References</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {sources.map((source) => (
          <Link
            key={source.slug}
            href={source.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="soft-ring rounded-[1rem] border border-line bg-accent/45 p-4 hover:border-clay hover:bg-paper"
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
  );
}

function CommentsPanel({
  post,
  currentUsername,
  commentBody,
  onCommentChange,
  onCommentSubmit,
  onDeleteComment
}: {
  post: CommunityPost;
  currentUsername: string;
  commentBody: string;
  onCommentChange: (value: string) => void;
  onCommentSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onDeleteComment: (commentId: string) => void;
}) {
  return (
    <section className="mt-6 border-t border-line pt-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm uppercase tracking-[0.2em] text-clay">Comments</p>
        <span className="text-sm text-clay">{post.comments.length}</span>
      </div>
      <div className="mt-4 grid gap-3">
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
                      onClick={() => onDeleteComment(comment.id)}
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
          <div className="rounded-[1rem] border border-dashed border-line bg-paper/70 p-4 text-center text-sm text-clay">
            No comments yet.
          </div>
        )}
      </div>
      <form onSubmit={onCommentSubmit} className="mt-4 rounded-[1rem] bg-accent/30 p-4">
        <p className="text-sm text-clay">Commenting as {currentUsername}</p>
        <textarea
          value={commentBody}
          onChange={(event) => onCommentChange(event.target.value)}
          className="mt-3 min-h-[88px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-sm leading-7 text-ink outline-none soft-ring focus:border-clay"
          placeholder="Write a comment, question, or related insight."
        />
        <button
          type="submit"
          disabled={!commentBody.trim()}
          className="soft-ring mt-3 rounded-full border border-moss bg-moss px-5 py-2 text-sm font-medium text-paper transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
        >
          Add comment
        </button>
      </form>
    </section>
  );
}

function EmptyPanel({ text }: { text: string }) {
  return (
    <div className="rounded-[1.35rem] border border-dashed border-line bg-paper/70 p-8 text-center text-clay">
      {text}
    </div>
  );
}

function getSources(post: CommunityPost, allArticles: Article[]) {
  return post.sourceSnapshots.length > 0
    ? post.sourceSnapshots
    : allArticles.filter((article) => post.sourceSlugs.includes(article.slug));
}
