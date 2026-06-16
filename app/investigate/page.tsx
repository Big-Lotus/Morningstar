"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ArticleVisual } from "@/components/ArticleVisual";
import { AuthPanel } from "@/components/AuthPanel";
import { categoryLabels } from "@/lib/data";
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
    feedArticles,
    isHydrated,
    addCustomArticleFromUrl,
    deleteCustomArticle,
    addComposedArticle,
    deleteComposedArticle,
    shareComposition
  } = useLearningStore();
  const allArticles = [...customArticles, ...feedArticles];
  const bookmarkedArticles = feedArticles.filter((article) =>
    bookmarkedSlugs.includes(article.slug)
  );
  const [stage, setStage] = useState<Stage>("compose");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [recommendationSeedSlug, setRecommendationSeedSlug] = useState<string | null>(
    null
  );
  const [resultId, setResultId] = useState<string | null>(null);
  const [customSourceUrl, setCustomSourceUrl] = useState("");
  const [customSourceError, setCustomSourceError] = useState("");
  const [title, setTitle] = useState("");
  const [requirements, setRequirements] = useState("");
  const [sharingCompositionId, setSharingCompositionId] = useState<string | null>(
    null
  );
  const [shareInsight, setShareInsight] = useState("");
  const addedArticles = customArticles;

  useEffect(() => {
    setSelectedSlugs((current) => {
      const availableSourceSlugs = new Set([
        ...bookmarkedSlugs,
        ...customArticles.map((article) => article.slug)
      ]);
      const next = current.filter((slug) => availableSourceSlugs.has(slug));

      return next.length === current.length &&
        next.every((slug, index) => slug === current[index])
        ? current
        : next;
    });
  }, [bookmarkedSlugs, customArticles]);

  const selectedArticles = allArticles.filter((article) =>
    selectedSlugs.includes(article.slug)
  );
  const recommendationSeedArticle =
    allArticles.find((article) => article.slug === recommendationSeedSlug) ?? null;
  const recommendationKeywords = getRecommendationKeywords(
    recommendationSeedArticle,
    requirements
  );
  const recommendedArticles = useMemo(
    () =>
      getRecommendedArticles({
        allArticles,
        bookmarkedSlugs,
        recommendationSeedArticle,
        keywords: recommendationKeywords
      }),
    [allArticles, bookmarkedSlugs, recommendationKeywords, recommendationSeedArticle]
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

  const openRecommendStage = () => {
    if (!title.trim() || !requirements.trim() || selectedArticles.length === 0) {
      return;
    }

    setRecommendationSeedSlug(selectedArticles[0].slug);
    setStage("recommend");
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
    <main className="mx-auto w-full space-y-8">
      <section className="rounded-[1.5rem] border border-line bg-paper/95 p-4 shadow-soft md:p-5">
        <StageIndicator currentStage={stage} />
      </section>

      {stage === "compose" ? (
        <section className="rounded-[1.75rem] border border-line bg-paper/95 p-5 shadow-soft md:p-7">
          <div>
            <p className="text-sm font-medium text-moss">
              Analysis request
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-[-0.05em] text-ink">
              What do you want to investigate?
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-clay">
                Title
              </span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-2 w-full rounded-[0.9rem] border border-line bg-white px-4 py-3 text-base text-ink outline-none soft-ring focus:border-moss"
                placeholder="A focused title for your analysis"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-clay">
                Requirements
              </span>
              <textarea
                value={requirements}
                onChange={(event) => setRequirements(event.target.value)}
                className="mt-2 min-h-[260px] w-full resize-y rounded-[0.9rem] border border-line bg-white px-4 py-3 text-base leading-7 text-ink outline-none soft-ring focus:border-moss"
                placeholder="Tell the analysis what to focus on. Example: Compare causes, stakeholders, and possible consequences."
              />
            </label>
          </div>

          <form
            onSubmit={handleCustomSourceSubmit}
            className="mt-6 rounded-[1.15rem] border border-line bg-accent p-4"
          >
            <p className="text-sm font-medium text-clay">
              Add your own source
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                value={customSourceUrl}
                onChange={(event) => {
                  setCustomSourceUrl(event.target.value);
                  setCustomSourceError("");
                }}
                className="min-w-0 flex-1 rounded-full border border-line bg-white px-4 py-3 text-sm text-ink outline-none soft-ring focus:border-moss"
                placeholder="https://example.com/news/article"
                type="url"
              />
              <button
                type="submit"
                className="soft-ring rounded-full border border-ink bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:-translate-y-0.5 hover:bg-moss"
              >
                Add
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

          <ArticlePicker
            title="Added sources"
            emptyMessage="No extra sources added yet."
            articles={addedArticles}
            selectedSlugs={selectedSlugs}
            onToggleSelected={toggleSelected}
            onDeleteArticle={(slug) => {
              deleteCustomArticle(slug);
              setSelectedSlugs((current) => current.filter((item) => item !== slug));
            }}
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openRecommendStage}
              disabled={!title.trim() || !requirements.trim() || selectedSlugs.length === 0}
              className="soft-ring rounded-full border border-ink bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:-translate-y-0.5 hover:bg-moss disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
            >
              Find more sources
            </button>
            <button
              type="button"
              onClick={createAnalysis}
              disabled={!title.trim() || !requirements.trim() || selectedSlugs.length === 0}
              className="soft-ring rounded-full border border-line bg-white px-6 py-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-moss"
            >
              Analyze with this
            </button>
          </div>
          <p className="mt-4 text-sm text-clay">
            {selectedSlugs.length} source{selectedSlugs.length === 1 ? "" : "s"} selected
          </p>
        </section>
      ) : null}

      {stage === "recommend" ? (
        <section className="rounded-[1.75rem] border border-line bg-paper/95 p-5 shadow-soft md:p-7">
          <p className="text-sm font-medium text-moss">
            Matching Sources
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-[-0.05em] text-ink">
            Choose related stories before analysis
          </h2>
          <p className="mt-3 text-sm leading-7 text-clay">
            Based on:{" "}
            {recommendationSeedArticle ? recommendationSeedArticle.title : "your first selected source"}
          </p>
          <p className="mt-1 text-sm leading-7 text-clay">
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
              className="soft-ring rounded-full border border-ink bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:-translate-y-0.5 hover:bg-moss disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
            >
              Analyze selected sources
            </button>
            <button
              type="button"
              onClick={() => setStage("compose")}
              className="soft-ring rounded-full border border-line bg-white px-6 py-3 text-sm font-medium text-ink transition hover:-translate-y-0.5 hover:border-moss"
            >
              Back to request
            </button>
          </div>
          <p className="mt-4 text-sm text-clay">
            {selectedSlugs.length} source{selectedSlugs.length === 1 ? "" : "s"} ready for analysis
          </p>
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
          <h2 className="font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-[-0.05em] text-white">
            Previous
          </h2>
        </div>

        {composedArticles.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {composedArticles.map((composition) => (
              <article
                key={composition.id}
                className="rounded-[1.15rem] border border-line bg-paper p-5 shadow-soft"
              >
                <button
                  type="button"
                  onClick={() => {
                    setResultId(composition.id);
                    setStage("result");
                  }}
                  className="block w-full text-left"
                >
                  <h3 className="font-[family-name:var(--font-heading)] text-2xl font-semibold leading-tight tracking-[-0.04em] text-ink">
                    {composition.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-clay">
                    {composition.requirements}
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteComposedArticle(composition.id);
                    if (resultId === composition.id) {
                      setResultId(null);
                      setStage("compose");
                    }
                  }}
                  className="soft-ring mt-4 rounded-full border border-line bg-white px-3 py-1 text-xs text-clay hover:border-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              </article>
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
  onDeleteArticle?: (slug: string) => void;
};

function ArticlePicker({
  title,
  emptyMessage,
  articles: pickerArticles,
  selectedSlugs,
  onToggleSelected,
  onDeleteArticle
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
                className={`soft-ring rounded-[1.15rem] border p-4 ${
                  selected
                    ? "border-moss bg-accent"
                    : "border-line bg-white hover:border-moss"
                }`}
              >
                <div className="grid gap-4 lg:grid-cols-[180px_1fr]">
                  <ArticleVisual article={article} compact />
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onToggleSelected(article.slug)}
                      className="mt-1 h-4 w-4 accent-[#5bbeb2]"
                      aria-label={`Select ${article.title}`}
                    />
                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => onToggleSelected(article.slug)}
                        className="block text-left"
                      >
                        <p className="text-xs font-medium text-clay">
                          {categoryLabels[article.category]} / {article.sourceName}
                        </p>
                        <h4 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold leading-tight tracking-[-0.04em] text-ink">
                          {article.title}
                        </h4>
                      </button>
                      <Link
                        href={article.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="soft-ring mt-3 inline-flex rounded-full border border-line bg-white px-3 py-1 text-xs text-clay hover:border-moss hover:text-ink"
                      >
                        Open source
                      </Link>
                      {onDeleteArticle ? (
                        <button
                          type="button"
                          onClick={() => onDeleteArticle(article.slug)}
                          className="soft-ring ml-2 mt-3 inline-flex rounded-full border border-line bg-white px-3 py-1 text-xs text-clay hover:border-red-400 hover:text-red-600"
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
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

function StageIndicator({ currentStage }: { currentStage: Stage }) {
  const stages: Array<{ key: Stage; label: string; caption: string }> = [
    { key: "compose", label: "1. Request", caption: "Write your question and pick sources" },
    { key: "recommend", label: "2. Sources", caption: "Review related articles before analysis" },
    { key: "result", label: "3. Result", caption: "Read, refine, and share your analysis" }
  ];
  const currentIndex = stages.findIndex((stage) => stage.key === currentStage);

  return (
    <div className="mt-6 grid gap-3 md:grid-cols-3">
      {stages.map((stage, index) => {
        const active = stage.key === currentStage;
        const complete = index < currentIndex;

        return (
          <div
            key={stage.key}
            className={`rounded-[1.25rem] border p-4 transition ${
              active
                ? "border-moss bg-accent"
                : complete
                  ? "border-moss/40 bg-paper"
                  : "border-line bg-white"
            }`}
          >
            <p className="text-xs font-medium text-clay">
              {complete ? "Completed" : active ? "Current step" : "Upcoming"}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-0.04em] text-ink">
              {stage.label}
            </h2>
            <p className="mt-2 text-sm leading-6 text-clay">{stage.caption}</p>
          </div>
        );
      })}
    </div>
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
    <section className="rounded-[1.5rem] border border-line bg-paper/95 p-5 shadow-soft md:p-7">
      <p className="text-sm font-medium text-moss">
        Analysis Result
      </p>
      <h2 className="mt-3 font-[family-name:var(--font-heading)] text-5xl font-semibold leading-tight tracking-[-0.06em] text-ink">
        {composition.title}
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1rem] border border-line bg-accent p-4">
          <p className="text-xs font-medium text-clay">
            Requirements
          </p>
          <p className="mt-2 whitespace-pre-line text-base leading-8 text-clay">
            {composition.requirements}
          </p>
        </div>
        <div className="rounded-[1rem] border border-line bg-white p-4">
          <p className="text-xs font-medium text-clay">
            Result
          </p>
          <p className="mt-2 whitespace-pre-line text-base leading-8 text-clay">
            {composition.analysis}
          </p>
        </div>
      </div>

      <section className="mt-5">
        <p className="text-xs font-medium text-clay">
          References
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {sources.map((source) => (
            <Link
              key={source.slug}
              href={source.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="soft-ring rounded-[1rem] border border-line bg-accent p-4 hover:border-moss hover:bg-paper"
            >
              <p className="text-xs font-medium text-clay">
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
          className="soft-ring rounded-full border border-ink bg-ink px-5 py-2 text-sm font-medium text-paper transition hover:-translate-y-0.5 hover:bg-moss"
        >
          Share
        </button>
        {communityPost ? (
          <Link
            href="/community"
            className="soft-ring rounded-full border border-line bg-white px-4 py-2 text-sm text-clay hover:border-moss hover:text-ink"
          >
            View in Community
          </Link>
        ) : null}
      </div>

      {isSharing ? (
        <form
          onSubmit={onShareSubmit}
          className="mt-4 rounded-[1rem] border border-line bg-accent p-4"
        >
          <label className="block">
            <span className="text-xs font-medium text-clay">
              Insight
            </span>
            <textarea
              value={shareInsight}
              onChange={(event) => onShareInsightChange(event.target.value)}
              className="mt-2 min-h-[120px] w-full resize-y rounded-[0.9rem] border border-line bg-white px-4 py-3 text-base leading-7 text-ink outline-none soft-ring focus:border-moss"
              placeholder="Share what you learned from this investigation."
            />
          </label>
          <button
            type="submit"
            disabled={!shareInsight.trim()}
            className="soft-ring mt-3 rounded-full border border-ink bg-ink px-5 py-2 text-sm font-medium text-paper transition hover:-translate-y-0.5 hover:bg-moss disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
          >
            Post to Community
          </button>
        </form>
      ) : null}
    </section>
  );
}

function getRecommendationKeywords(
  seedArticle: Article | null,
  requirements: string
) {
  if (!seedArticle) {
    return [];
  }

  const text = [
    requirements,
    `${seedArticle.title} ${seedArticle.keyword} ${seedArticle.intro}`
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

  return seedArticle.keyword
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length >= 4 && !stopWords.has(word));
}

function getRecommendedArticles({
  allArticles,
  bookmarkedSlugs,
  recommendationSeedArticle,
  keywords
}: {
  allArticles: Article[];
  bookmarkedSlugs: string[];
  recommendationSeedArticle: Article | null;
  keywords: string[];
}) {
  if (!recommendationSeedArticle) {
    return [];
  }

  const seedTitleWords = new Set(
    recommendationSeedArticle.title
      .toLowerCase()
      .match(/[a-z]{4,}/g)
      ?.filter((word) => !stopWords.has(word)) ?? []
  );

  const keywordMatches = allArticles
    .map((article) => {
      const titleText = article.title.toLowerCase();
      const haystack = `${article.title} ${article.keyword} ${article.intro}`.toLowerCase();
      const titleWords = new Set(
        article.title
          .toLowerCase()
          .match(/[a-z]{4,}/g)
          ?.filter((word) => !stopWords.has(word)) ?? []
      );
      const titleKeywordMatches = keywords.filter((keyword) =>
        titleText.includes(keyword)
      ).length;
      const sharedTitleWords = [...titleWords].filter((word) =>
        seedTitleWords.has(word)
      ).length;
      const score =
        titleKeywordMatches * 4 +
        sharedTitleWords * 3 +
        keywords.filter((keyword) => haystack.includes(keyword)).length +
        (article.category === recommendationSeedArticle.category ? 1 : 0) +
        (bookmarkedSlugs.includes(article.slug) ? 1 : 0);

      return { article, score };
    })
    .filter(
      (item) =>
        item.article.slug !== recommendationSeedArticle.slug && item.score > 0
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.article);

  return keywordMatches;
}
