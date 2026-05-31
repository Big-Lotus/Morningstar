import { Article } from "@/lib/types";

type ArticleVisualProps = {
  article: Article;
  compact?: boolean;
};

const categoryVisuals: Record<
  Article["category"],
  { gradient: string; accent: string; label: string }
> = {
  National: {
    gradient: "linear-gradient(135deg, rgba(198,101,53,0.95) 0%, rgba(126,55,35,0.8) 100%)",
    accent: "rgba(255,220,180,0.85)",
    label: "National desk"
  },
  Business: {
    gradient: "linear-gradient(135deg, rgba(210,127,72,0.95) 0%, rgba(91,72,58,0.82) 100%)",
    accent: "rgba(255,240,214,0.82)",
    label: "Market desk"
  },
  "Life&Culture": {
    gradient: "linear-gradient(135deg, rgba(181,109,66,0.94) 0%, rgba(122,77,51,0.8) 100%)",
    accent: "rgba(255,229,199,0.84)",
    label: "Culture desk"
  },
  Sports: {
    gradient: "linear-gradient(135deg, rgba(216,144,92,0.95) 0%, rgba(143,83,49,0.82) 100%)",
    accent: "rgba(255,239,212,0.84)",
    label: "Match notes"
  },
  World: {
    gradient: "linear-gradient(135deg, rgba(169,101,55,0.95) 0%, rgba(78,60,45,0.82) 100%)",
    accent: "rgba(252,235,206,0.82)",
    label: "World desk"
  },
  "K-pop": {
    gradient: "linear-gradient(135deg, rgba(201,122,69,0.95) 0%, rgba(101,67,48,0.8) 100%)",
    accent: "rgba(255,232,198,0.84)",
    label: "K-pop watch"
  }
};

export function ArticleVisual({ article, compact = false }: ArticleVisualProps) {
  const visual = categoryVisuals[article.category];

  return (
    <div
      className={`relative overflow-hidden rounded-[1.6rem] border border-white/35 ${
        compact ? "h-32" : "h-56"
      }`}
      style={{ backgroundImage: visual.gradient }}
    >
      <div
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl"
        style={{ backgroundColor: visual.accent }}
      />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-clay">
        {visual.label}
      </div>
      <div className="absolute right-4 top-4 rounded-full border border-paper/50 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-paper/90">
        {article.sourceName}
      </div>
      <div className="absolute inset-x-4 bottom-4">
        <p className="text-xs uppercase tracking-[0.16em] text-paper/80">
          {article.keyword}
        </p>
        <div className="mt-3 grid grid-cols-[1.6fr_0.9fr] gap-3">
          <div className="rounded-[1.1rem] border border-paper/25 bg-paper/14 px-4 py-3 backdrop-blur-[1.5px]">
            <div className="h-2 w-14 rounded-full bg-paper/65" />
            <div className="mt-3 h-2 w-24 rounded-full bg-paper/40" />
            <div className="mt-2 h-2 w-20 rounded-full bg-paper/30" />
          </div>
          <div className="rounded-[1.1rem] border border-paper/20 bg-black/10 p-3">
            <div className="grid h-full grid-cols-2 gap-2">
              <div className="rounded-[0.8rem] bg-paper/25" />
              <div className="rounded-[0.8rem] bg-paper/20" />
              <div className="rounded-[0.8rem] bg-paper/20" />
              <div className="rounded-[0.8rem] bg-paper/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
