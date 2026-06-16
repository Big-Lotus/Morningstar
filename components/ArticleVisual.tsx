import { Article } from "@/lib/types";

type ArticleVisualProps = {
  article: Article;
  compact?: boolean;
};

const categoryVisuals: Record<
  Article["category"],
  { seed: string; tint: string }
> = {
  National: {
    seed: "seoul-civic-hall",
    tint: "rgba(91, 190, 178, 0.14)"
  },
  Business: {
    seed: "market-glass-office",
    tint: "rgba(23, 23, 23, 0.1)"
  },
  "Life&Culture": {
    seed: "museum-soft-gallery",
    tint: "rgba(91, 190, 178, 0.12)"
  },
  Sports: {
    seed: "baseball-field-day",
    tint: "rgba(23, 23, 23, 0.08)"
  },
  World: {
    seed: "global-summit-room",
    tint: "rgba(91, 190, 178, 0.12)"
  },
  "K-pop": {
    seed: "stage-lights-crowd",
    tint: "rgba(23, 23, 23, 0.1)"
  }
};

export function ArticleVisual({ article, compact = false }: ArticleVisualProps) {
  const visual = categoryVisuals[article.category];

  return (
    <div
      className={`relative overflow-hidden rounded-[1.2rem] border border-line bg-accent ${
        compact ? "h-32" : "h-72"
      }`}
      style={{
        backgroundImage: `linear-gradient(180deg, transparent 0%, ${visual.tint} 100%), url("https://picsum.photos/seed/${visual.seed}-${article.slug}/900/620")`,
        backgroundPosition: "center",
        backgroundSize: "cover"
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,252,0.06),rgba(23,23,23,0.18))]" />
    </div>
  );
}
