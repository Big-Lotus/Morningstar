import clsx from "clsx";

import { Category } from "@/lib/types";
import { categoryLabels } from "@/lib/data";

type CategoryTabsProps = {
  categories: Category[];
  activeCategory: Category | "All";
};

export function CategoryTabs({ categories, activeCategory }: CategoryTabsProps) {
  const tabCategories: Array<Category | "All"> = ["All", ...categories];

  return (
    <div className="flex flex-wrap gap-3">
      {tabCategories.map((category) => {
        const active = activeCategory === category;
        const label = category === "All" ? "전체" : categoryLabels[category];

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
            {label}
          </div>
        );
      })}
    </div>
  );
}
