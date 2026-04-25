"use client";

import { useRef } from "react";

type CarouselProps = {
  children: React.ReactNode;
};

export function ArticleCarousel({ children }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const amount = Math.round(container.clientWidth * 0.72);
    container.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth"
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-clay">
            Daily News
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-heading)] text-4xl font-semibold text-ink">
            Read slowly. Return tomorrow.
          </h2>
        </div>

        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => scrollByCard("left")}
            className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-clay transition hover:border-clay hover:text-ink"
            aria-label="Scroll articles left"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => scrollByCard("right")}
            className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-clay transition hover:border-clay hover:text-ink"
            aria-label="Scroll articles right"
          >
            Next
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="hide-scrollbar flex gap-5 overflow-x-auto pb-4 pt-2"
      >
        {children}
      </div>
    </section>
  );
}
