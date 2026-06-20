export type Category =
  | "National"
  | "Business"
  | "Life&Culture"
  | "Sports"
  | "World"
  | "K-pop";

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

export type SavedVocabulary = {
  id: string;
  word: string;
  meaning: string;
  sentence: string;
  sourceSlug?: string;
};

export type ComposedArticle = {
  id: string;
  title: string;
  requirements: string;
  analysis: string;
  sourceSlugs: string[];
  createdAt: string;
};

export type CommunityComment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type PollVote = {
  id: string;
  authorName: string;
  optionId: string;
  opinion: string;
  createdAt: string;
};

export type PollOption = {
  id: string;
  label: string;
};

export type CommunityPost = {
  id: string;
  compositionId: string;
  authorName: string;
  title: string;
  insight: string;
  requirements: string;
  analysis: string;
  sourceSlugs: string[];
  sourceSnapshots: Article[];
  comments: CommunityComment[];
  pollQuestion?: string;
  pollOptions?: PollOption[];
  pollVotes?: PollVote[];
  summaryInsight?: string;
  createdAt: string;
};
