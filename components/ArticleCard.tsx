import { Article } from "@/lib/types";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <button
      type="button"
      className="group flex h-[220px] min-w-[270px] snap-start rounded-[2rem] border border-line bg-paper/95 p-7 text-left shadow-card transition duration-300 hover:-translate-y-1 hover:border-clay md:min-w-[320px]"
    >
      <article className="flex h-full items-start">
        <h3 className="font-[family-name:var(--font-heading)] text-3xl font-semibold leading-tight text-ink transition-colors group-hover:text-moss">
          {article.title}
        </h3>
      </article>
    </button>
  );
}
