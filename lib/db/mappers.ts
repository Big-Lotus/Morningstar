import { Article, Category, ComposedArticle } from "@/lib/types";

export type ArticleRow = {
  creator: string | null;
  title: string;
  link: string;
  pubDate: string | null;
  contentSnippet: string | null;
  categories: unknown;
};

export type CustomSourceRow = {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  source_name: string;
  source_url: string;
  category: string;
  published_at: string | null;
  keyword: string | null;
  intro: string;
  created_at: string;
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
  if ("link" in row) {
    const category = normalizeCategory(firstCategory(row.categories));

    return {
      slug: slugify(row.link),
      title: decodeHtmlEntities(row.title),
      sourceName: row.creator ?? "Unknown source",
      sourceUrl: row.link,
      category,
      publishedAt: row.pubDate ?? new Date().toISOString(),
      keyword: deriveKeyword(row.title),
      intro: decodeHtmlEntities(row.contentSnippet ?? row.title)
    };
  }

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

function firstCategory(categories: unknown) {
  if (Array.isArray(categories)) {
    return categories[0];
  }

  if (typeof categories === "string") {
    try {
      const parsed = JSON.parse(categories) as unknown;
      return Array.isArray(parsed) ? parsed[0] : categories;
    } catch {
      return categories;
    }
  }

  return null;
}

function normalizeCategory(value: unknown): Category {
  const category = String(value ?? "National");
  const allowed: Category[] = [
    "National",
    "Business",
    "Life&Culture",
    "Sports",
    "World",
    "K-pop"
  ];

  return allowed.includes(category as Category) ? (category as Category) : "National";
}

function deriveKeyword(title: string) {
  return decodeHtmlEntities(title)
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .join(" ");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, "\"")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
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
