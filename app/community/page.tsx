"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthPanel } from "@/components/AuthPanel";
import {
  getCommunityCardVisual,
  getCommunityPollResults,
  MARATHON_POST_ID
} from "@/lib/community-featured";
import { CommunityPost } from "@/lib/types";
import { useLearningStore } from "@/providers/learning-store";

const INITIAL_CARD_COUNT = 4;

export default function CommunityPage() {
  const {
    currentUsername,
    communityPosts,
    isHydrated,
    createCommunityPoll,
    addCommunityComment,
    deleteCommunityPost,
    deleteCommunityComment
  } = useLearningStore();
  const [visibleCount, setVisibleCount] = useState(INITIAL_CARD_COUNT);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [showComposer, setShowComposer] = useState(false);
  const [pollTitle, setPollTitle] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", "", "", ""]);

  if (!isHydrated) {
    return null;
  }

  if (!currentUsername) {
    return <AuthPanel />;
  }

  const visiblePosts = communityPosts.slice(0, visibleCount);
  const featuredPost = communityPosts[0];
  const hiddenCount = Math.max(communityPosts.length - visiblePosts.length, 0);

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
    updateCommentDraft(postId, "");
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
    setShowComposer(false);
    setVisibleCount((current) => Math.max(current, INITIAL_CARD_COUNT));
  };

  return (
    <main className="mx-auto w-full space-y-8">
      <section className="overflow-hidden rounded-[1.75rem] bg-paper shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
        <div className="grid min-h-[420px] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-between gap-10 px-5 py-8 md:px-8 lg:px-10">
            <div>
              <p className="text-sm font-semibold text-moss">Community cards</p>
              <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-5xl font-semibold leading-[0.96] tracking-[-0.06em] text-ink md:text-7xl">
                Debate rooms, saved as card news.
              </h1>
              <p className="mt-5 max-w-[42rem] text-base leading-7 text-clay md:text-lg">
                Stored community posts now open as compact cards first. Read the
                angle, scan the poll, then open the room when you want the full
                context.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <StatPill label="Cards" value={communityPosts.length} />
              <StatPill
                label="Poll rooms"
                value={
                  communityPosts.filter((post) => post.pollOptions?.length).length
                }
              />
              <button
                type="button"
                onClick={() => setShowComposer((current) => !current)}
                className="soft-ring rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper hover:-translate-y-0.5 hover:bg-moss"
              >
                {showComposer ? "Close form" : "Open a new issue"}
              </button>
            </div>
          </div>

          {featuredPost ? (
            <FeaturedCard post={featuredPost} />
          ) : (
            <div className="bg-accent" />
          )}
        </div>
      </section>

      {showComposer ? (
        <PollComposer
          title={pollTitle}
          question={pollQuestion}
          options={pollOptions}
          onTitleChange={setPollTitle}
          onQuestionChange={setPollQuestion}
          onOptionsChange={setPollOptions}
          onSubmit={submitPoll}
        />
      ) : null}

      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-moss">Saved discussions</p>
            <h2 className="mt-1 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
              Community news cards
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/58">
            Full text stays tucked away until a card is opened, so the board
            stays easy to scan.
          </p>
        </div>

        {visiblePosts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visiblePosts.map((post, index) => (
              <CommunityNewsCard
                key={post.id}
                post={post}
                index={index}
                currentUsername={currentUsername}
                isExpanded={expandedPostId === post.id}
                commentBody={commentDrafts[post.id] ?? ""}
                onToggle={() =>
                  setExpandedPostId((current) =>
                    current === post.id ? null : post.id
                  )
                }
                onCommentChange={(value) => updateCommentDraft(post.id, value)}
                onCommentSubmit={(event) => submitComment(event, post.id)}
                onDeletePost={() => deleteCommunityPost(post.id)}
                onDeleteComment={(commentId) =>
                  deleteCommunityComment(post.id, commentId)
                }
              />
            ))}
          </div>
        ) : (
          <EmptyPanel />
        )}

        {hiddenCount > 0 ? (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => setVisibleCount((current) => current + 3)}
              className="soft-ring rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink shadow-soft hover:-translate-y-0.5 hover:bg-accent"
            >
              더보기 {hiddenCount}
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function FeaturedCard({ post }: { post: CommunityPost }) {
  const visual = getCommunityCardVisual(post, 0);
  const results = getCommunityPollResults(post);
  const totalVotes = results.reduce((sum, result) => sum + result.votes, 0);

  return (
    <aside className="relative min-h-[360px] overflow-hidden bg-ink">
      <img
        src={visual.imageUrl}
        alt={visual.imageAlt}
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.72))]" />
      <div className="relative flex h-full min-h-[360px] flex-col justify-end p-5 text-white md:p-8">
        <p className="text-sm font-semibold text-white/76">{visual.eyebrow}</p>
        <h2 className="mt-3 max-w-lg font-[family-name:var(--font-heading)] text-4xl font-semibold leading-tight tracking-[-0.05em] md:text-5xl">
          {post.title}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/76">
          {visual.deck}
        </p>
        {results.length > 0 ? (
          <div className="mt-5 rounded-[1.1rem] bg-white/[0.14] p-4 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-white">Poll snapshot</p>
              <p className="text-sm text-white/72">{totalVotes} votes</p>
            </div>
            <div className="mt-3 grid gap-2">
              {results.slice(0, 2).map((result) => (
                <PollBar key={result.optionId} result={result} inverted />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function CommunityNewsCard({
  post,
  index,
  currentUsername,
  isExpanded,
  commentBody,
  onToggle,
  onCommentChange,
  onCommentSubmit,
  onDeletePost,
  onDeleteComment
}: {
  post: CommunityPost;
  index: number;
  currentUsername: string;
  isExpanded: boolean;
  commentBody: string;
  onToggle: () => void;
  onCommentChange: (value: string) => void;
  onCommentSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onDeletePost: () => void;
  onDeleteComment: (commentId: string) => void;
}) {
  const visual = getCommunityCardVisual(post, index);
  const pollResults = getCommunityPollResults(post);
  const totalVotes = pollResults.reduce((sum, result) => sum + result.votes, 0);
  const isPoll = Boolean(post.pollOptions?.length);
  const canDeletePost =
    post.authorName === currentUsername && post.id !== MARATHON_POST_ID;

  return (
    <article className="overflow-hidden rounded-[1.25rem] bg-paper shadow-[0_18px_52px_rgba(0,0,0,0.18)]">
      <div className="relative aspect-[1.32] overflow-hidden bg-accent">
        <img
          src={visual.imageUrl}
          alt={visual.imageAlt}
          className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
        />
        <div className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold text-ink shadow-soft">
          {visual.eyebrow}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-xs font-medium text-clay">
          <span>{post.authorName}</span>
          <time dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleDateString("en", {
              month: "short",
              day: "numeric"
            })}
          </time>
        </div>

        <h3 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-semibold leading-tight tracking-[-0.045em] text-ink">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-clay">
          {visual.deck}
        </p>

        {pollResults.length > 0 ? (
          <div className="mt-5 rounded-[1rem] bg-accent/70 p-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-semibold text-ink">Poll results</span>
              <span className="text-clay">{totalVotes} votes</span>
            </div>
            <div className="grid gap-2">
              {pollResults.slice(0, 3).map((result) => (
                <PollBar key={result.optionId} result={result} />
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {isPoll ? (
            <Link
              href={`/community/polls/${post.id}`}
              className="soft-ring rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:-translate-y-0.5 hover:bg-moss"
            >
              Open room
            </Link>
          ) : null}
          <button
            type="button"
            onClick={onToggle}
            className="soft-ring rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink hover:-translate-y-0.5 hover:bg-line"
          >
            {isExpanded ? "Close" : "Read card"}
          </button>
          {canDeletePost ? (
            <button
              type="button"
              onClick={onDeletePost}
              className="soft-ring rounded-full bg-white px-4 py-2 text-sm font-semibold text-clay hover:bg-line hover:text-ink"
            >
              Delete
            </button>
          ) : null}
        </div>

        {isExpanded ? (
          <ExpandedCard
            post={post}
            currentUsername={currentUsername}
            commentBody={commentBody}
            onCommentChange={onCommentChange}
            onCommentSubmit={onCommentSubmit}
            onDeleteComment={onDeleteComment}
          />
        ) : null}
      </div>
    </article>
  );
}

function ExpandedCard({
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
    <div className="mt-5 border-t border-line pt-5">
      <div className="grid gap-4">
        <section>
          <p className="text-xs font-semibold text-moss">Question</p>
          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-ink">
            {post.pollQuestion ?? post.requirements}
          </p>
        </section>
        <section>
          <p className="text-xs font-semibold text-moss">Community takeaway</p>
          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-clay">
            {post.summaryInsight || post.insight}
          </p>
        </section>
        {!post.pollOptions?.length && post.analysis ? (
          <section>
            <p className="text-xs font-semibold text-moss">Analysis</p>
            <p className="mt-2 line-clamp-6 whitespace-pre-line text-sm leading-7 text-clay">
              {post.analysis}
            </p>
          </section>
        ) : null}
      </div>
      <CommentsPanel
        post={post}
        currentUsername={currentUsername}
        commentBody={commentBody}
        onCommentChange={onCommentChange}
        onCommentSubmit={onCommentSubmit}
        onDeleteComment={onDeleteComment}
      />
    </div>
  );
}

function PollBar({
  result,
  inverted = false
}: {
  result: ReturnType<typeof getCommunityPollResults>[number];
  inverted?: boolean;
}) {
  return (
    <div>
      <div
        className={`flex items-center justify-between gap-3 text-xs ${
          inverted ? "text-white/80" : "text-clay"
        }`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${result.swatchClass}`} />
          <span className="truncate">{result.label}</span>
        </span>
        <span className="font-semibold tabular-nums">
          {result.percentage.toFixed(result.percentage % 1 ? 1 : 0)}%
        </span>
      </div>
      <div
        className={`mt-1.5 h-2 overflow-hidden rounded-full ${
          inverted ? "bg-white/20" : "bg-white"
        }`}
      >
        <div
          className={`h-full rounded-full ${result.barClass}`}
          style={{ width: `${result.percentage}%` }}
        />
      </div>
    </div>
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
      className="rounded-[1.25rem] bg-paper p-5 shadow-[0_18px_52px_rgba(0,0,0,0.18)] md:p-6"
    >
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold text-moss">New card</p>
          <h2 className="mt-2 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-[-0.05em] text-ink">
            Open an issue room
          </h2>
        </div>
        <div className="grid gap-4">
          <input
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            className="w-full rounded-[1rem] border border-line bg-paper px-4 py-3 text-base text-ink outline-none soft-ring focus:border-clay"
            placeholder="Title"
          />
          <textarea
            value={question}
            onChange={(event) => onQuestionChange(event.target.value)}
            className="min-h-[104px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-base leading-7 text-ink outline-none soft-ring focus:border-clay"
            placeholder="What should the community react to?"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {options.map((option, index) => (
              <input
                key={index}
                value={option}
                onChange={(event) =>
                  onOptionsChange(
                    options.map((item, itemIndex) =>
                      itemIndex === index ? event.target.value : item
                    )
                  )
                }
                className="w-full rounded-[1rem] border border-line bg-paper px-4 py-3 text-sm text-ink outline-none soft-ring focus:border-clay"
                placeholder={index < 2 ? `Option ${index + 1}` : "Optional"}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={
              !title.trim() ||
              !question.trim() ||
              options.filter((option) => option.trim()).length < 2
            }
            className="soft-ring w-fit rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper hover:-translate-y-0.5 hover:bg-moss disabled:cursor-not-allowed disabled:bg-line disabled:text-clay"
          >
            Save card
          </button>
        </div>
      </div>
    </form>
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
    <section className="mt-5 rounded-[1rem] bg-accent/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink">Comments</p>
        <span className="text-sm text-clay">{post.comments.length}</span>
      </div>
      <div className="mt-3 grid gap-2">
        {post.comments.slice(0, 3).map((comment) => (
          <article key={comment.id} className="rounded-[0.9rem] bg-paper p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-ink">{comment.authorName}</p>
              {comment.authorName === currentUsername ? (
                <button
                  type="button"
                  onClick={() => onDeleteComment(comment.id)}
                  className="soft-ring rounded-full px-2 py-1 text-xs text-clay hover:bg-line hover:text-ink"
                >
                  Delete
                </button>
              ) : null}
            </div>
            <p className="mt-1 text-sm leading-6 text-clay">{comment.body}</p>
          </article>
        ))}
        {post.comments.length === 0 ? (
          <p className="rounded-[0.9rem] border border-dashed border-line bg-paper/70 p-3 text-sm text-clay">
            No comments yet.
          </p>
        ) : null}
      </div>
      <form onSubmit={onCommentSubmit} className="mt-3">
        <textarea
          value={commentBody}
          onChange={(event) => onCommentChange(event.target.value)}
          className="min-h-[78px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-sm leading-6 text-ink outline-none soft-ring focus:border-clay"
          placeholder="Add a reaction or a question."
        />
        <button
          type="submit"
          disabled={!commentBody.trim()}
          className="soft-ring mt-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:-translate-y-0.5 hover:bg-moss disabled:cursor-not-allowed disabled:bg-line disabled:text-clay"
        >
          Add comment
        </button>
      </form>
    </section>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-full bg-accent px-5 py-3">
      <span className="text-sm font-semibold text-ink">{value}</span>
      <span className="ml-2 text-sm text-clay">{label}</span>
    </div>
  );
}

function EmptyPanel() {
  return (
    <div className="rounded-[1.25rem] border border-dashed border-white/20 bg-white/[0.08] p-8 text-center text-white/70">
      No community cards yet.
    </div>
  );
}
