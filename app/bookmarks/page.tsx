"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { articles, categoryLabels } from "@/lib/data";
import { Article } from "@/lib/types";
import { useLearningStore } from "@/providers/learning-store";

export default function BookmarkPage() {
  const {
    bookmarkedSlugs,
    toggleBookmark,
    composedArticles,
    addComposedArticle
  } = useLearningStore();
  const bookmarkedArticles = articles.filter((article) =>
    bookmarkedSlugs.includes(article.slug)
  );
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(bookmarkedSlugs);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    setSelectedSlugs((current) => {
      const kept = current.filter((slug) => bookmarkedSlugs.includes(slug));
      const added = bookmarkedSlugs.filter((slug) => !kept.includes(slug));

      return [...kept, ...added];
    });
  }, [bookmarkedSlugs]);

  const selectedArticles = articles.filter((article) =>
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
      body,
      sourceSlugs: selectedSlugs
    });
    setTitle("");
    setBody("");
  };

  return (
    <main className="mx-auto max-w-[980px] space-y-8">
      <section className="rounded-[2rem] border border-line bg-paper/85 px-7 py-8 shadow-soft md:px-10">
        <p className="text-sm uppercase tracking-[0.22em] text-clay">Bookmarks</p>
        <h1 className="mt-3 font-[family-name:var(--font-heading)] text-5xl font-semibold text-ink">
          Build a new article from saved news
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-clay">
          Choose related stories, add recommended sources when they fit, and
          write your own English piece from that collection.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6">
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
            Write the connection
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
                Body
              </span>
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                className="mt-2 min-h-[260px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-base leading-7 text-ink outline-none soft-ring focus:border-clay"
                placeholder="Write your own article by connecting the saved news."
              />
            </label>
          </div>

          <div className="mt-5 rounded-[1.25rem] border border-line bg-accent/40 p-4 text-sm leading-6 text-clay">
            Selected sources: {selectedArticles.length}
          </div>

          <button
            type="submit"
            disabled={!title.trim() || !body.trim() || selectedSlugs.length === 0}
            className="soft-ring mt-5 rounded-full border border-clay bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
          >
            Publish to this page
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-clay">
            Written Pieces
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-heading)] text-4xl font-semibold text-ink">
            Your new articles
          </h2>
        </div>

        {composedArticles.length > 0 ? (
          composedArticles.map((composition) => {
            const sources = articles.filter((article) =>
              composition.sourceSlugs.includes(article.slug)
            );

            return (
              <article
                key={composition.id}
                className="rounded-[2rem] border border-line bg-paper/95 p-6 shadow-soft"
              >
                <h3 className="font-[family-name:var(--font-heading)] text-4xl font-semibold text-ink">
                  {composition.title}
                </h3>
                <p className="mt-4 whitespace-pre-line text-base leading-8 text-clay">
                  {composition.body}
                </p>
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
