"use client";

import { useRef, useState } from "react";

type CarouselProps = {
  children: React.ReactNode;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
};

export function ArticleCarousel({
  children,
  eyebrow = "Collection",
  title
}: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startScrollLeft: number;
    moved: boolean;
  } | null>(null);
  const shouldSuppressClickRef = useRef(false);
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
    const target = event.target as HTMLElement | null;

    if (
      !container ||
      event.pointerType === "mouse" && event.button !== 0 ||
      target?.closest("button, a, input, textarea, label")
    ) {
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
      shouldSuppressClickRef.current = true;
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
          <p className="text-sm font-medium text-moss">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
            {title}
          </h2>
        </div>

        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            onClick={() => scrollByCard("left")}
            className="soft-ring rounded-full border border-transparent bg-transparent px-4 py-2 text-sm text-white/68 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
            aria-label="Scroll articles left"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => scrollByCard("right")}
            className="soft-ring rounded-full border border-transparent bg-transparent px-4 py-2 text-sm text-white/68 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
            aria-label="Scroll articles right"
          >
            Next
          </button>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-line/80 bg-paper/70 p-4 shadow-soft backdrop-blur md:p-6">
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={(event) => finishDrag(event.pointerId)}
          onPointerCancel={(event) => finishDrag(event.pointerId)}
          onClickCapture={(event) => {
            if (!shouldSuppressClickRef.current) {
              return;
            }

            event.preventDefault();
            event.stopPropagation();
            window.setTimeout(() => {
              shouldSuppressClickRef.current = false;
            }, 0);
          }}
          className="hide-scrollbar -mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-4 pt-2 scroll-smooth md:mx-0 md:gap-5 md:px-0"
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            WebkitOverflowScrolling: "touch",
            scrollPaddingLeft: "0.5rem"
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
