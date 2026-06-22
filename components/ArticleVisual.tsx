import { Article } from "@/lib/types";

type ArticleVisualProps = {
  article: Article;
  compact?: boolean;
};

const categoryVisuals: Record<
  Article["category"],
  { imageUrl: string; tint: string }
> = {
  National: {
    imageUrl:
      "https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?auto=format&fit=crop&w=1200&q=80",
    tint: "rgba(91, 190, 178, 0.14)"
  },
  Business: {
    imageUrl:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    tint: "rgba(23, 23, 23, 0.1)"
  },
  "Life&Culture": {
    imageUrl:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
    tint: "rgba(91, 190, 178, 0.12)"
  },
  Sports: {
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    tint: "rgba(23, 23, 23, 0.08)"
  },
  World: {
    imageUrl:
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
    tint: "rgba(91, 190, 178, 0.12)"
  },
  "K-pop": {
    imageUrl:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
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
        backgroundImage: `linear-gradient(180deg, transparent 0%, ${visual.tint} 100%), url("${visual.imageUrl}")`,
        backgroundPosition: "center",
        backgroundSize: "cover"
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,252,0.06),rgba(23,23,23,0.18))]" />
    </div>
  );
}
