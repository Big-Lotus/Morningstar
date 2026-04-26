export type Category = "World" | "Business" | "Tech" | "Culture";

export type Article = {
  slug: string;
  category: Category;
  title: string;
  sourceUrl: string;
};

export type Topic = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  createdAt: string;
};

export type SavedVocabulary = {
  id: string;
  word: string;
  sentence: string;
  articleSlug: string;
};
