"use client";

import { categories, categoryLabels } from "@/lib/data";
import { SplineComputer } from "@/components/SplineComputer";
import { Category } from "@/lib/types";
import { useLearningStore } from "@/providers/learning-store";

export function InterestOnboarding() {
  const {
    selectedInterests,
    setSelectedInterests,
    completeOnboarding
  } = useLearningStore();

  const toggleInterest = (category: Category) => {
    setSelectedInterests(
      selectedInterests.includes(category)
        ? selectedInterests.filter((item) => item !== category)
        : [...selectedInterests, category]
    );
  };

  return (
    <main className="relative mx-auto min-h-[82dvh] w-full overflow-hidden rounded-[2rem] border border-line bg-paper shadow-soft">
      <SplineComputer
        variant="background"
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,252,0.96)_0%,rgba(255,255,252,0.8)_44%,rgba(255,255,252,0.32)_76%,rgba(238,248,246,0.14)_100%)]" />
      <div className="relative z-10 flex min-h-[82dvh] items-center px-5 py-8 md:px-10">
      <section className="w-full max-w-2xl rounded-[1.5rem] border border-line/80 bg-paper/74 px-6 py-8 shadow-[0_24px_70px_rgba(23,23,23,0.12)] backdrop-blur-xl md:px-8 md:py-9">
        <p className="text-sm font-medium text-moss">
          Start with your interests
        </p>
        <h1 className="mt-4 max-w-2xl font-[family-name:var(--font-heading)] text-5xl font-semibold leading-[1.02] tracking-[-0.06em] text-ink md:text-7xl">
          Pick the news areas you want to learn from.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-clay">
          Morningstar keeps the first reading space focused and filters the
          collected stories around the topics you choose.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {categories.map((category) => {
            const active = selectedInterests.includes(category);

            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleInterest(category)}
                className={`soft-ring rounded-[1rem] border px-5 py-4 text-left transition ${
                  active
                    ? "border-moss/60 bg-accent text-ink shadow-soft"
                    : "border-line bg-white text-clay hover:border-moss hover:text-ink"
                }`}
              >
                <span className="block font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-0.03em]">
                  {categoryLabels[category]}
                </span>
                <span className="mt-2 block text-xs font-medium text-clay">
                  {category}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={completeOnboarding}
          disabled={selectedInterests.length === 0}
          className="soft-ring mt-8 rounded-full border border-ink bg-ink px-7 py-3 text-sm font-semibold text-paper transition hover:-translate-y-0.5 hover:bg-moss disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
        >
          Continue to news
        </button>
      </section>
      </div>
    </main>
  );
}
