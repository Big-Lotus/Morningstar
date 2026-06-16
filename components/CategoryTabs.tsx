import clsx from "clsx";

import { categoryLabels } from "@/lib/data";
import { Category } from "@/lib/types";

type CategoryTabsProps = {
  categories: Category[];
  activeCategory: Category | "All";
  onSelectCategory: (category: Category | "All") => void;
};

export function CategoryTabs({
  categories,
  activeCategory,
  onSelectCategory
}: CategoryTabsProps) {
  const tabCategories: Array<Category | "All"> = ["All", ...categories];

  return (
    <div className="flex flex-wrap gap-3">
      {tabCategories.map((category) => {
        const active = activeCategory === category;
        const label = category === "All" ? "All" : categoryLabels[category];

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            className={clsx(
              "soft-ring rounded-full border border-transparent px-4 py-2 text-sm transition-all",
              active
                ? "bg-ink text-paper shadow-soft"
                : "bg-transparent text-clay hover:bg-accent hover:text-ink"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
