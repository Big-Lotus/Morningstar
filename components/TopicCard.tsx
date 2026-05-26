"use client";

import { useState } from "react";

import { Topic } from "@/lib/types";
import { useLearningStore } from "@/providers/learning-store";

type TopicCardProps = {
  topic: Topic;
};

export function TopicCard({ topic }: TopicCardProps) {
  const { bookmarkedSlugs, toggleBookmark } = useLearningStore();
  const isBookmarked = bookmarkedSlugs.includes(topic.slug);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <article className="group relative min-w-[320px] snap-start rounded-[2rem] border border-line bg-paper/95 p-6 shadow-card soft-ring transition duration-300 hover:-translate-y-1 hover:border-clay hover:shadow-[0_24px_48px_rgba(83,63,47,0.12)] md:min-w-[380px] md:p-7">
      <button
        type="button"
        onClick={() => {
          setIsPressed(true);
          toggleBookmark(topic.slug);
          window.setTimeout(() => setIsPressed(false), 220);
        }}
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        className={`soft-ring absolute right-4 top-4 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em] transition md:right-5 md:top-5 ${
          isBookmarked
            ? "border-moss/40 bg-moss/10 text-moss"
            : "border-line bg-paper/95 text-clay hover:border-clay hover:text-ink"
        } ${isPressed ? "scale-[0.98]" : ""}`}
      >
        {isBookmarked ? "Saved" : "Save"}
      </button>

      <div className="pr-20 pt-8 md:pt-10">
        <p className="text-xs uppercase tracking-[0.2em] text-clay">
          Topic-Based Learning
        </p>
        <h3 className="mt-3 max-w-[16ch] font-[family-name:var(--font-heading)] text-[1.9rem] font-semibold leading-[1.08] text-ink transition-colors duration-300 group-hover:text-moss md:text-3xl">
          {topic.title}
        </h3>
        <p className="mt-4 text-sm leading-7 text-clay">{topic.overview}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {topic.relatedKeywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-line bg-accent/50 px-3 py-1 text-xs uppercase tracking-[0.14em] text-clay"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
