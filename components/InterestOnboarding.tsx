"use client";

import { categories, categoryLabels } from "@/lib/data";
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
    <main className="mx-auto flex min-h-[72vh] max-w-[900px] items-center">
      <section className="w-full rounded-[2rem] border border-line bg-paper/85 px-7 py-9 shadow-soft md:px-10 md:py-12">
        <p className="text-sm uppercase tracking-[0.22em] text-clay">
          Start With Your Interests
        </p>
        <h1 className="mt-4 max-w-2xl font-[family-name:var(--font-heading)] text-5xl font-semibold leading-tight text-ink md:text-6xl">
          Pick the news areas you want to learn from.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-clay">
          Saetbyeol will begin with these interests and keep the first reading
          space focused before real data automation is connected.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((category) => {
            const active = selectedInterests.includes(category);

            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleInterest(category)}
                className={`soft-ring rounded-[1.25rem] border px-5 py-4 text-left transition ${
                  active
                    ? "border-moss/50 bg-moss/10 text-ink shadow-soft"
                    : "border-line bg-paper/80 text-clay hover:border-clay hover:bg-paper hover:text-ink"
                }`}
              >
                <span className="block font-[family-name:var(--font-heading)] text-2xl font-semibold">
                  {categoryLabels[category]}
                </span>
                <span className="mt-2 block text-xs uppercase tracking-[0.18em]">
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
          className="soft-ring mt-8 rounded-full border border-clay bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
        >
          Continue to news
        </button>
      </section>
    </main>
  );
}
