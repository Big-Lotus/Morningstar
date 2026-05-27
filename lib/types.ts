export type Category =
  | "Culture"
  | "Tech"
  | "Economy"
  | "Global"
  | "Science"
  | "Society";

export type Article = {
  slug: string;
  category: Category;
  title: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  keyword: string;
  intro: string;
};

export type Topic = {
  id: string;
  slug: string;
  title: string;
  overview: string;
  relatedKeywords: string[];
  articleSlugs: string[];
  createdAt: string;
};

export type SavedVocabulary = {
  id: string;
  word: string;
  sentence: string;
  topicSlug: string;
};

export type ComposedArticle = {
  id: string;
  title: string;
  body: string;
  sourceSlugs: string[];
  createdAt: string;
};
