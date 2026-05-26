export type Category = "World" | "Business" | "Tech" | "Culture";

export type Article = {
  slug: string;
  category: Category;
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
