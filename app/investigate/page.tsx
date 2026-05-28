"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AuthPanel } from "@/components/AuthPanel";
import { articles, categoryLabels } from "@/lib/data";
import { Article } from "@/lib/types";
import { useLearningStore } from "@/providers/learning-store";

type Stage = "compose" | "recommend" | "result";

const stopWords = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "into",
  "your",
  "news",
  "article",
  "about",
  "through",
  "their",
  "have",
  "will",
  "what",
  "when",
  "where",
  "which",
  "while"
]);

export default function InvestigatePage() {
  const {
    currentUsername,
    bookmarkedSlugs,
    composedArticles,
    customArticles,
    communityPosts,
    isHydrated,
    addCustomArticleFromUrl,
    addComposedArticle,
    shareComposition
  } = useLearningStore();
  const allArticles = [...customArticles, ...articles];
  const bookmarkedArticles = articles.filter((article) =>
    bookmarkedSlugs.includes(article.slug)
  );
  const [stage, setStage] = useState<Stage>("compose");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [resultId, setResultId] = useState<string | null>(null);
  const [customSourceUrl, setCustomSourceUrl] = useState("");
  const [customSourceError, setCustomSourceError] = useState("");
  const [title, setTitle] = useState("");
  const [requirements, setRequirements] = useState("");
  const [sharingCompositionId, setSharingCompositionId] = useState<string | null>(
    null
  );
  const [shareInsight, setShareInsight] = useState("");

  useEffect(() => {
    setSelectedSlugs((current) =>
      current.filter((slug) => bookmarkedSlugs.includes(slug))
    );
  }, [bookmarkedSlugs]);

  const selectedArticles = allArticles.filter((article) =>
    selectedSlugs.includes(article.slug)
  );
  const recommendationKeywords = getRecommendationKeywords(
    selectedArticles,
    requirements
  );
  const recommendedArticles = useMemo(
    () =>
      getRecommendedArticles({
        allArticles,
        bookmarkedSlugs,
        selectedArticles,
        selectedSlugs,
        keywords: recommendationKeywords
      }),
    [allArticles, bookmarkedSlugs, recommendationKeywords, selectedArticles, selectedSlugs]
  );
  const resultArticle = composedArticles.find((entry) => entry.id === resultId);

  const toggleSelected = (slug: string) => {
    setSelectedSlugs((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug]
    );
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

  const createAnalysis = () => {
    const id = addComposedArticle({
      title,
      requirements,
      sourceSlugs: selectedSlugs
    });

    if (!id) {
      return;
    }

    setResultId(id);
    setStage("result");
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
    <main className="mx-auto max-w-[1040px] space-y-8">
      <section className="rounded-[1.5rem] border border-line bg-paper/90 px-7 py-8 shadow-soft md:px-10">
        <p className="text-sm uppercase tracking-[0.22em] text-moss">
          Investigate
        </p>
        <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-heading)] text-5xl font-semibold leading-tight text-ink md:text-6xl">
          Build an analysis from the stories you saved.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-clay">
          Write the question first, choose the source that started your
          curiosity, then decide whether to analyze now or collect matching
          sources.
        </p>
      </section>

      {stage === "compose" ? (
        <section className="rounded-[1.5rem] border border-line bg-paper/95 p-6 shadow-soft md:p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-moss">
              Analysis Request
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold text-ink">
              What do you want to investigate?
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-clay">
                Title
              </span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-2 w-full rounded-[1rem] border border-line bg-paper px-4 py-3 text-base text-ink outline-none soft-ring focus:border-moss"
                placeholder="A focused title for your analysis"
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-clay">
                Requirements
              </span>
              <textarea
                value={requirements}
                onChange={(event) => setRequirements(event.target.value)}
                className="mt-2 min-h-[260px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-base leading-7 text-ink outline-none soft-ring focus:border-moss"
                placeholder="Tell the analysis what to focus on. Example: Compare causes, stakeholders, and possible consequences."
              />
            </label>
          </div>

          <form
            onSubmit={handleCustomSourceSubmit}
            className="mt-6 rounded-[1.25rem] border border-line bg-accent/35 p-4"
          >
            <p className="text-sm uppercase tracking-[0.18em] text-clay">
              Add your own source
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                value={customSourceUrl}
                onChange={(event) => {
                  setCustomSourceUrl(event.target.value);
                  setCustomSourceError("");
                }}
                className="min-w-0 flex-1 rounded-full border border-line bg-paper px-4 py-3 text-sm text-ink outline-none soft-ring focus:border-moss"
                placeholder="https://example.com/news/article"
                type="url"
              />
              <button
                type="submit"
                className="soft-ring rounded-full border border-moss bg-moss px-5 py-3 text-sm font-medium uppercase tracking-[0.14em] text-paper transition hover:-translate-y-0.5"
              >
                ADD
              </button>
            </div>
            {customSourceError ? (
              <p className="mt-3 text-sm text-clay">{customSourceError}</p>
            ) : null}
          </form>

          <ArticlePicker
            title="Saved sources"
            emptyMessage="No saved news yet. Save news from the home page first."
            articles={bookmarkedArticles}
            selectedSlugs={selectedSlugs}
            onToggleSelected={toggleSelected}
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStage("recommend")}
              disabled={!title.trim() || !requirements.trim() || selectedSlugs.length === 0}
              className="soft-ring rounded-full border border-moss bg-moss px-6 py-3 text-sm font-medium text-paper transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
            >
              Find more sources
            </button>
            <button
              type="button"
              onClick={createAnalysis}
              disabled={!title.trim() || !requirements.trim() || selectedSlugs.length === 0}
              className="soft-ring rounded-full border border-line bg-paper px-6 py-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-moss"
            >
              Analyze with this
            </button>
          </div>
        </section>
      ) : null}

      {stage === "recommend" ? (
        <section className="rounded-[1.5rem] border border-line bg-paper/95 p-6 shadow-soft md:p-8">
          <p className="text-sm uppercase tracking-[0.22em] text-moss">
            Matching Sources
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold text-ink">
            Choose related stories before analysis
          </h2>
          <p className="mt-3 text-sm leading-7 text-clay">
            Matching keywords:{" "}
            {recommendationKeywords.length > 0
              ? recommendationKeywords.join(", ")
              : "source keyword fallback"}
          </p>

          <ArticlePicker
            title="Recommended sources"
            emptyMessage="No close recommendations found yet."
            articles={recommendedArticles}
            selectedSlugs={selectedSlugs}
            onToggleSelected={toggleSelected}
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={createAnalysis}
              disabled={!title.trim() || !requirements.trim() || selectedSlugs.length === 0}
              className="soft-ring rounded-full border border-moss bg-moss px-6 py-3 text-sm font-medium text-paper transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
            >
              Analyze selected sources
            </button>
            <button
              type="button"
              onClick={() => setStage("compose")}
              className="soft-ring rounded-full border border-line bg-paper px-6 py-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-moss"
            >
              Back to request
            </button>
          </div>
        </section>
      ) : null}

      {stage === "result" && resultArticle ? (
        <AnalysisResult
          composition={resultArticle}
          sources={allArticles.filter((article) =>
            resultArticle.sourceSlugs.includes(article.slug)
          )}
          communityPost={communityPosts.find(
            (post) => post.compositionId === resultArticle.id
          )}
          isSharing={sharingCompositionId === resultArticle.id}
          shareInsight={shareInsight}
          onShareOpen={() => {
            setSharingCompositionId(
              sharingCompositionId === resultArticle.id ? null : resultArticle.id
            );
            setShareInsight("");
          }}
          onShareInsightChange={setShareInsight}
          onShareSubmit={(event) => handleShareSubmit(event, resultArticle.id)}
        />
      ) : null}

      <section className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-moss">
            Your Archive
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-heading)] text-4xl font-semibold text-ink">
            Previous investigations
          </h2>
        </div>

        {composedArticles.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {composedArticles.map((composition) => (
              <button
                key={composition.id}
                type="button"
                onClick={() => {
                  setResultId(composition.id);
                  setStage("result");
                }}
                className="soft-ring rounded-[1.25rem] border border-line bg-paper/95 p-5 text-left shadow-soft hover:-translate-y-0.5 hover:border-moss"
              >
                <h3 className="font-[family-name:var(--font-heading)] text-2xl font-semibold leading-tight text-ink">
                  {composition.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-clay">
                  {composition.requirements}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-line bg-paper/70 p-8 text-center text-clay">
            No investigations yet. Create one from your saved sources.
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
};

function ArticlePicker({
  title,
  emptyMessage,
  articles: pickerArticles,
  selectedSlugs,
  onToggleSelected
}: ArticlePickerProps) {
  return (
    <section className="mt-6">
      <h3 className="font-[family-name:var(--font-heading)] text-3xl font-semibold text-ink">
        {title}
      </h3>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {pickerArticles.length > 0 ? (
          pickerArticles.map((article) => {
            const selected = selectedSlugs.includes(article.slug);

            return (
              <article
                key={article.slug}
                className={`soft-ring rounded-[1.25rem] border p-4 ${
                  selected
                    ? "border-moss bg-accent/60"
                    : "border-line bg-paper/90 hover:border-moss"
                }`}
              >
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleSelected(article.slug)}
                    className="mt-1 h-4 w-4 accent-[#e57945]"
                    aria-label={`Select ${article.title}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.16em] text-clay">
                      {categoryLabels[article.category]} / {article.sourceName}
                    </p>
                    <h4 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold leading-tight text-ink">
                      {article.title}
                    </h4>
                    <Link
                      href={article.sourceUrl}
                      className="soft-ring mt-3 inline-flex rounded-full border border-line bg-paper px-3 py-1 text-xs text-clay hover:border-moss hover:text-ink"
                    >
                      Open source
                    </Link>
                  </div>
                </label>
              </article>
            );
          })
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-line bg-paper/70 p-6 text-center text-clay md:col-span-2">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}

type AnalysisResultProps = {
  composition: {
    id: string;
    title: string;
    requirements: string;
    analysis: string;
  };
  sources: Article[];
  communityPost?: { insight: string };
  isSharing: boolean;
  shareInsight: string;
  onShareOpen: () => void;
  onShareInsightChange: (value: string) => void;
  onShareSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

function AnalysisResult({
  composition,
  sources,
  communityPost,
  isSharing,
  shareInsight,
  onShareOpen,
  onShareInsightChange,
  onShareSubmit
}: AnalysisResultProps) {
  return (
    <section className="rounded-[1.5rem] border border-line bg-paper/95 p-6 shadow-soft md:p-8">
      <p className="text-sm uppercase tracking-[0.22em] text-moss">
        Analysis Result
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-heading)] text-5xl font-semibold leading-tight text-ink">
        {composition.title}
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.25rem] border border-line bg-accent/35 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-clay">
            Requirements
          </p>
          <p className="mt-2 whitespace-pre-line text-base leading-8 text-clay">
            {composition.requirements}
          </p>
        </div>
        <div className="rounded-[1.25rem] border border-line bg-paper p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-clay">
            Result
          </p>
          <p className="mt-2 whitespace-pre-line text-base leading-8 text-clay">
            {composition.analysis}
          </p>
        </div>
      </div>

      <section className="mt-5">
        <p className="text-xs uppercase tracking-[0.18em] text-clay">
          References
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {sources.map((source) => (
            <Link
              key={source.slug}
              href={source.sourceUrl}
              className="soft-ring rounded-[1.25rem] border border-line bg-accent/45 p-4 hover:border-moss hover:bg-paper"
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

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onShareOpen}
          className="soft-ring rounded-full border border-moss bg-moss px-5 py-2 text-sm font-medium text-paper transition hover:-translate-y-0.5"
        >
          Share
        </button>
        {communityPost ? (
          <Link
            href="/community"
            className="soft-ring rounded-full border border-line bg-paper px-4 py-2 text-sm text-clay hover:border-moss hover:text-ink"
          >
            View in Community
          </Link>
        ) : null}
      </div>

      {isSharing ? (
        <form
          onSubmit={onShareSubmit}
          className="mt-4 rounded-[1.25rem] border border-line bg-accent/35 p-4"
        >
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-clay">
              Insight
            </span>
            <textarea
              value={shareInsight}
              onChange={(event) => onShareInsightChange(event.target.value)}
              className="mt-2 min-h-[120px] w-full resize-y rounded-[1rem] border border-line bg-paper px-4 py-3 text-base leading-7 text-ink outline-none soft-ring focus:border-moss"
              placeholder="Share what you learned from this investigation."
            />
          </label>
          <button
            type="submit"
            disabled={!shareInsight.trim()}
            className="soft-ring mt-3 rounded-full border border-moss bg-moss px-5 py-2 text-sm font-medium text-paper transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
          >
            Post to Community
          </button>
        </form>
      ) : null}
    </section>
  );
}

function getRecommendationKeywords(selectedArticles: Article[], requirements: string) {
  const text = [
    requirements,
    ...selectedArticles.map(
      (article) => `${article.title} ${article.keyword} ${article.intro}`
    )
  ].join(" ");
  const counts = text
    .toLowerCase()
    .match(/[a-z]{4,}/g)
    ?.filter((word) => !stopWords.has(word))
    .reduce<Record<string, number>>((acc, word) => {
      acc[word] = (acc[word] ?? 0) + 1;
      return acc;
    }, {});
  const frequentWords = Object.entries(counts ?? {})
    .filter(([, count]) => count >= 4)
    .map(([word]) => word);

  if (frequentWords.length > 0) {
    return frequentWords;
  }

  return selectedArticles
    .flatMap((article) => article.keyword.toLowerCase().split(/\s+/))
    .filter((word) => word.length >= 4 && !stopWords.has(word));
}

function getRecommendedArticles({
  allArticles,
  bookmarkedSlugs,
  selectedArticles,
  selectedSlugs,
  keywords
}: {
  allArticles: Article[];
  bookmarkedSlugs: string[];
  selectedArticles: Article[];
  selectedSlugs: string[];
  keywords: string[];
}) {
  const selectedCategories = new Set(
    selectedArticles.map((article) => article.category)
  );
  const keywordMatches = allArticles
    .filter((article) => !selectedSlugs.includes(article.slug))
    .map((article) => {
      const haystack = `${article.title} ${article.keyword} ${article.intro}`.toLowerCase();
      const score =
        keywords.filter((keyword) => haystack.includes(keyword)).length +
        (selectedCategories.has(article.category) ? 1 : 0) +
        (bookmarkedSlugs.includes(article.slug) ? 1 : 0);

      return { article, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.article);

  return keywordMatches;
}
