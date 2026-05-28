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
