"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AuthPanel } from "@/components/AuthPanel";
import { articles, categoryLabels } from "@/lib/data";
import { Article } from "@/lib/types";
import { useLearningStore } from "@/providers/learning-store";

export default function BookmarkPage() {
  const {
    currentUsername,
    bookmarkedSlugs,
    toggleBookmark,
    composedArticles,
    customArticles,
    communityPosts,
    isHydrated,
    addCustomArticleFromUrl,
    addComposedArticle,
    shareComposition
  } = useLearningStore();
  const allArticles = [...customArticles, ...articles];
  const bookmarkedArticles = allArticles.filter((article) =>
    bookmarkedSlugs.includes(article.slug)
  );
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(bookmarkedSlugs);
  const [customSourceUrl, setCustomSourceUrl] = useState("");
  const [customSourceError, setCustomSourceError] = useState("");
  const [title, setTitle] = useState("");
  const [requirements, setRequirements] = useState("");
  const [sharingCompositionId, setSharingCompositionId] = useState<string | null>(
    null
  );
  const [shareInsight, setShareInsight] = useState("");

  useEffect(() => {
    setSelectedSlugs((current) => {
      const kept = current.filter((slug) => bookmarkedSlugs.includes(slug));
      const added = bookmarkedSlugs.filter((slug) => !kept.includes(slug));

      return [...kept, ...added];
    });
  }, [bookmarkedSlugs]);

  const selectedArticles = allArticles.filter((article) =>
    selectedSlugs.includes(article.slug)
  );
  const selectedCategories = new Set(
    selectedArticles.map((article) => article.category)
  );

  const recommendedArticles = useMemo(() => {
    const related = articles.filter(
      (article) =>
        !bookmarkedSlugs.includes(article.slug) &&
        selectedCategories.has(article.category)
    );

    return related.length > 0
      ? related
      : articles.filter((article) => !bookmarkedSlugs.includes(article.slug));
  }, [bookmarkedSlugs, selectedCategories]);

  const toggleSelected = (slug: string) => {
    setSelectedSlugs((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug]
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addComposedArticle({
      title,
      requirements,
      sourceSlugs: selectedSlugs
    });
    setTitle("");
    setRequirements("");
  };

  const handleCustomSourceSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const addedSlug = addCustomArticleFromUrl(customSourceUrl);

    if (!addedSlug) {
      setCustomSourceError("Please enter a valid URL.");
      return;
    }

    setSelectedSlugs((current) =>
      current.includes(addedSlug) ? current : [...current, addedSlug]
    );
    setCustomSourceUrl("");
    setCustomSourceError("");
  };

  const handleShareSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    compositionId: string
  ) => {
    event.preventDefault();
    shareComposition(compositionId, shareInsight);
    setShareInsight("");
    setSharingCompositionId(null);
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
        <p className="text-sm uppercase tracking-[0.22em] text-clay">Bookmarks</p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-5xl font-semibold text-ink">
          Ask for analysis from saved news
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-clay">
          Choose related stories, add recommended sources when they fit, and
          prepare a focused request that AI can turn into an analysis later.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6">
          <form
            onSubmit={handleCustomSourceSubmit}
            className="rounded-[2rem] border border-line bg-paper/95 p-6 shadow-soft"
          >
            <p className="text-sm uppercase tracking-[0.22em] text-clay">
              Add Your Own Source
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                value={customSourceUrl}
                onChange={(event) => {
                  setCustomSourceUrl(event.target.value);
                  setCustomSourceError("");
                }}
                className="min-w-0 flex-1 rounded-full border border-line bg-paper px-4 py-3 text-sm text-ink outline-none soft-ring focus:border-clay"
                placeholder="https://example.com/news/article"
                type="url"
              />
              <button
                type="submit"
                className="soft-ring rounded-full border border-clay bg-ink px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-paper transition hover:-translate-y-0.5"
              >
                ADD
              </button>
            </div>
            {customSourceError ? (
              <p className="mt-3 text-sm text-clay">{customSourceError}</p>
            ) : null}
          </form>

          <ArticlePicker
            title="Saved news"
            emptyMessage="No bookmarks yet. Save news from the home page to begin composing."
            articles={bookmarkedArticles}
            selectedSlugs={selectedSlugs}
            onToggleSelected={toggleSelected}
          />

          <ArticlePicker
            title="Recommended news"
            emptyMessage="No extra recommendations are available from the current mock list."
            articles={recommendedArticles}
            selectedSlugs={selectedSlugs}
            onToggleSelected={toggleSelected}
            onAddBookmark={toggleBookmark}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-line bg-paper/95 p-6 shadow-soft"
        >
          <p className="text-sm uppercase tracking-[0.22em] text-clay">
            Your Composition
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold text-ink">
            Set the analysis brief
          </h2>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-clay">
                Title
              </span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-2 w-full rounded-[1rem] border border-line bg-paper px-4 py-3 text-base text-ink outline-none soft-ring focus:border-clay"
                placeholder="A shared idea across these stories"
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-clay">
                Requirements
              </span>
              <textarea
                value={requirements}
                onChange={(event) => setRequirements(event.target.value)}
                className="mt-2 min-h-[260px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-base leading-7 text-ink outline-none soft-ring focus:border-clay"
                placeholder="Example: Compare the economic impact, explain the shared cause, and include a table if helpful."
              />
            </label>
          </div>

          <div className="mt-5 rounded-[1.25rem] border border-line bg-accent/40 p-4 text-sm leading-6 text-clay">
            Selected sources: {selectedArticles.length}
            <br />
            Visual output can be added later as a table, chart, or diagram once
            we choose the format.
          </div>

          <button
            type="submit"
            disabled={
              !title.trim() || !requirements.trim() || selectedSlugs.length === 0
            }
            className="soft-ring mt-5 rounded-full border border-clay bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
          >
            Create analysis request
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-clay">
            Written Pieces
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-heading)] text-4xl font-semibold text-ink">
            Your analysis requests
          </h2>
        </div>

        {composedArticles.length > 0 ? (
          composedArticles.map((composition) => {
            const sources = allArticles.filter((article) =>
              composition.sourceSlugs.includes(article.slug)
            );
            const communityPost = communityPosts.find(
              (post) => post.compositionId === composition.id
            );
            const isSharing = sharingCompositionId === composition.id;

            return (
              <article
                key={composition.id}
                className="rounded-[2rem] border border-line bg-paper/95 p-6 shadow-soft"
              >
                <h3 className="font-[family-name:var(--font-heading)] text-4xl font-semibold text-ink">
                  {composition.title}
                </h3>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSharingCompositionId(isSharing ? null : composition.id);
                      setShareInsight(communityPost?.insight ?? "");
                    }}
                    className="soft-ring rounded-full border border-clay bg-ink px-5 py-2 text-sm font-medium text-paper transition hover:-translate-y-0.5"
                  >
                    Share
                  </button>
                  {communityPost ? (
                    <Link
                      href="/community"
                      className="soft-ring rounded-full border border-line bg-paper px-4 py-2 text-sm text-clay hover:border-clay hover:text-ink"
                    >
                      View in Community
                    </Link>
                  ) : null}
                </div>

                {isSharing ? (
                  <form
                    onSubmit={(event) =>
                      handleShareSubmit(event, composition.id)
                    }
                    className="mt-4 rounded-[1.25rem] border border-line bg-accent/35 p-4"
                  >
                    <label className="block">
                      <span className="text-xs uppercase tracking-[0.18em] text-clay">
                        Insight
                      </span>
                      <textarea
                        value={shareInsight}
                        onChange={(event) => setShareInsight(event.target.value)}
                        className="mt-2 min-h-[120px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-base leading-7 text-ink outline-none soft-ring focus:border-clay"
                        placeholder="Share what you noticed, questioned, or learned from this article set."
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={!shareInsight.trim()}
                      className="soft-ring mt-3 rounded-full border border-clay bg-ink px-5 py-2 text-sm font-medium text-paper transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
                    >
                      Post to Community
                    </button>
                  </form>
                ) : null}

                <div className="mt-4 rounded-[1.25rem] border border-line bg-accent/35 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-clay">
                    Requirements
                  </p>
                  <p className="mt-2 whitespace-pre-line text-base leading-8 text-clay">
                    {composition.requirements}
                  </p>
                </div>

                <div className="mt-4 rounded-[1.25rem] border border-line bg-paper p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-clay">
                    AI Result
                  </p>
                  <p className="mt-2 whitespace-pre-line text-base leading-8 text-clay">
                    {composition.analysis}
                  </p>
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
                        <h4 className="mt-2 font-[family-name:var(--font-heading)] text-xl font-semibold leading-tight text-ink">
                          {source.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </section>

                <div className="mt-5 flex flex-wrap gap-2">
                  {sources.map((source) => (
                    <span
                      key={source.slug}
                      className="rounded-full border border-line bg-accent/50 px-3 py-1 text-xs uppercase tracking-[0.14em] text-clay"
                    >
                      {source.sourceName}
                    </span>
                  ))}
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-[2rem] border border-dashed border-line bg-paper/70 p-8 text-center text-clay">
            No written pieces yet. Select a few related stories and write your
            first connection.
          </div>
        )}
      </section>
    </main>
  );
}

type ArticlePickerProps = {
  title: string;
  emptyMessage: string;
  articles: Article[];
  selectedSlugs: string[];
  onToggleSelected: (slug: string) => void;
  onAddBookmark?: (slug: string) => void;
};

function ArticlePicker({
  title,
  emptyMessage,
  articles: pickerArticles,
  selectedSlugs,
  onToggleSelected,
  onAddBookmark
}: ArticlePickerProps) {
  return (
    <section className="rounded-[2rem] border border-line bg-paper/95 p-6 shadow-soft">
      <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold text-ink">
        {title}
      </h2>

      <div className="mt-5 space-y-3">
        {pickerArticles.length > 0 ? (
          pickerArticles.map((article) => {
            const selected = selectedSlugs.includes(article.slug);

            return (
              <article
                key={article.slug}
                className="rounded-[1.5rem] border border-line bg-paper/90 p-4"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleSelected(article.slug)}
                    className="mt-1 h-4 w-4 accent-[#6f7f55]"
                    aria-label={`Select ${article.title}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.16em] text-clay">
                      {categoryLabels[article.category]} / {article.sourceName}
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold leading-tight text-ink">
                      {article.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href={article.sourceUrl}
                        className="soft-ring rounded-full border border-line bg-paper px-3 py-1 text-xs text-clay hover:border-clay hover:text-ink"
                      >
                        Open source
                      </Link>
                      {onAddBookmark ? (
                        <button
                          type="button"
                          onClick={() => onAddBookmark(article.slug)}
                          className="soft-ring rounded-full border border-line bg-paper px-3 py-1 text-xs text-clay hover:border-clay hover:text-ink"
                        >
                          Save
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-line bg-paper/70 p-6 text-center text-clay">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}
