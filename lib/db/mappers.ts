import { Article, Category, ComposedArticle } from "@/lib/types";

export type ArticleRow = {
  id: string;
  external_id?: string | null;
  slug: string;
  title: string;
  source_name: string;
  source_url: string;
  category: string;
  published_at: string | null;
  keyword: string | null;
  intro: string;
  language?: string;
  status?: "published" | "hidden" | "archived";
  fetched_at?: string | null;
  created_at: string;
};

export type CustomSourceRow = ArticleRow & {
  user_id: string;
};

export type InvestigationRow = {
  id: string;
  user_id: string;
  title: string;
  requirements: string;
  analysis: string;
  status: "draft" | "generated" | "shared";
  created_at: string;
  updated_at: string;
};

export function mapArticleRow(row: ArticleRow | CustomSourceRow): Article {
  return {
    slug: row.slug,
    title: row.title,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    category: row.category as Category,
    publishedAt: row.published_at ?? row.created_at,
    keyword: row.keyword ?? "",
    intro: row.intro
  };
}

export function mapInvestigationRow(
  row: InvestigationRow,
  sourceSlugs: string[] = []
): ComposedArticle {
  return {
    id: row.id,
    title: row.title,
    requirements: row.requirements,
    analysis: row.analysis,
    sourceSlugs,
    createdAt: row.created_at
  };
}
