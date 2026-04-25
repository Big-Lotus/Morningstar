import clsx from "clsx";

import { Category } from "@/lib/types";

type CategoryTabsProps = {
  categories: Category[];
  activeCategory: Category | "All";
};

export function CategoryTabs({ categories, activeCategory }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {["All", ...categories].map((category) => {
        const active = activeCategory === category;

        return (
          <div
            key={category}
            className={clsx(
              "rounded-full border px-4 py-2 text-sm transition-all",
              active
                ? "border-clay bg-accent text-ink shadow-soft"
                : "border-line bg-paper/80 text-clay hover:border-clay hover:bg-paper"
            )}
          >
            {category}
          </div>
        );
      })}
    </div>
  );
}
