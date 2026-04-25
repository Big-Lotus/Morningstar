"use client";

import { useRef, useState } from "react";

type CarouselProps = {
  children: React.ReactNode;
};

export function ArticleCarousel({ children }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startScrollLeft: number;
    moved: boolean;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getScrollAmount = () => {
    const container = containerRef.current;
    if (!container) {
      return 0;
    }

    const firstCard = container.firstElementChild as HTMLElement | null;
    if (firstCard) {
      const styles = window.getComputedStyle(container);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0");
      return firstCard.offsetWidth + gap;
    }

    return Math.round(container.clientWidth * 0.72);
  };

  const scrollByCard = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const amount = getScrollAmount();
    container.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth"
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container || event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: container.scrollLeft,
      moved: false
    };

    setIsDragging(true);
    container.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const dragState = dragStateRef.current;

    if (!container || !dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;

    if (Math.abs(deltaX) > 4 && !dragState.moved) {
      dragStateRef.current = {
        ...dragState,
        moved: true
      };
    }

    container.scrollLeft = dragState.startScrollLeft - deltaX;
  };

  const finishDrag = (pointerId: number) => {
    const container = containerRef.current;
    const dragState = dragStateRef.current;

    if (!container || !dragState || dragState.pointerId !== pointerId) {
      return;
    }

    if (container.hasPointerCapture(pointerId)) {
      container.releasePointerCapture(pointerId);
    }

    dragStateRef.current = null;
    setIsDragging(false);
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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => finishDrag(event.pointerId)}
        onPointerCancel={(event) => finishDrag(event.pointerId)}
        className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-2 scroll-smooth"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          WebkitOverflowScrolling: "touch"
        }}
      >
        {children}
      </div>
    </section>
  );
}
