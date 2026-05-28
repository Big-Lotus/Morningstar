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
    addCommunityComment,
    deleteCommunityPost,
    deleteCommunityComment
  } = useLearningStore();
  const allArticles = [...customArticles, ...articles];
  const [commentDrafts, setCommentDrafts] = useState<
    Record<string, string>
  >({});

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

                <div className="mt-5 rounded-[1.25rem] border border-line bg-accent/40 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-clay">
                    Insight
                  </p>
                  <p className="mt-2 whitespace-pre-line text-base leading-8 text-ink">
                    {post.insight}
                  </p>
                </div>

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
          Bookmarks to start the community.
        </div>
      )}
    </main>
  );
}
