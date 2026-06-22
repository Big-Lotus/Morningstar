import { Article } from "@/lib/types";

type ArticleVisualProps = {
  article: Article;
  compact?: boolean;
};

const categoryVisuals: Record<
  Article["category"],
  { imageUrls: string[]; tint: string }
> = {
  National: {
    imageUrls: [
      "https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80"
    ],
    tint: "rgba(91, 190, 178, 0.14)"
  },
  Business: {
    imageUrls: [
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
    ],
    tint: "rgba(23, 23, 23, 0.1)"
  },
  "Life&Culture": {
    imageUrls: [
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80"
    ],
    tint: "rgba(91, 190, 178, 0.12)"
  },
  Sports: {
    imageUrls: [
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80"
    ],
    tint: "rgba(23, 23, 23, 0.08)"
  },
  World: {
    imageUrls: [
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80"
    ],
    tint: "rgba(91, 190, 178, 0.12)"
  },
  "K-pop": {
    imageUrls: [
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80"
    ],
    tint: "rgba(23, 23, 23, 0.1)"
  }
};

export function ArticleVisual({ article, compact = false }: ArticleVisualProps) {
  const visual = categoryVisuals[article.category];
  const imageUrl = visual.imageUrls[hashString(`${article.slug}-${article.title}`) % visual.imageUrls.length];

  return (
    <div
      className={`relative overflow-hidden rounded-[1.2rem] border border-line bg-accent ${
        compact ? "h-32" : "h-72"
      }`}
      style={{
        backgroundImage: `linear-gradient(180deg, transparent 0%, ${visual.tint} 100%), url("${imageUrl}")`,
        backgroundPosition: "center",
        backgroundSize: "cover"
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,252,0.06),rgba(23,23,23,0.18))]" />
    </div>
  );
}

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}
