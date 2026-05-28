"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import { articles } from "@/lib/data";
import {
  Article,
  Category,
  CommunityPost,
  ComposedArticle,
  SavedVocabulary
} from "@/lib/types";

type UserScopedState = {
  savedWords: SavedVocabulary[];
  bookmarkedSlugs: string[];
  selectedInterests: Category[];
  hasCompletedOnboarding: boolean;
  composedArticles: Array<ComposedArticle & { body?: string }>;
  customArticles: Article[];
};

type StoredAccount = {
  username: string;
  password: string;
  state: UserScopedState;
};

type PersistedAuthState = {
  currentUsername: string | null;
  accounts: Record<string, StoredAccount>;
  communityPosts: Array<
    CommunityPost & { authorName?: string; sourceSnapshots?: Article[] }
  >;
};

type LearningStoreValue = {
  currentUsername: string | null;
  authError: string;
  isHydrated: boolean;
  savedWords: SavedVocabulary[];
  bookmarkedSlugs: string[];
  selectedInterests: Category[];
  hasCompletedOnboarding: boolean;
  composedArticles: ComposedArticle[];
  customArticles: Article[];
  communityPosts: CommunityPost[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  setSelectedInterests: (interests: Category[]) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  saveWord: (entry: Omit<SavedVocabulary, "id">) => void;
  hasSavedWord: (word: string, sentence: string) => boolean;
  removeWord: (id: string) => void;
  toggleBookmark: (slug: string) => void;
  addCustomArticleFromUrl: (sourceUrl: string) => string | null;
  addComposedArticle: (
    entry: Omit<ComposedArticle, "id" | "createdAt" | "analysis">
  ) => void;
  shareComposition: (compositionId: string, insight: string) => void;
  addCommunityComment: (postId: string, body: string) => void;
  deleteCommunityPost: (postId: string) => void;
  deleteCommunityComment: (postId: string, commentId: string) => void;
};

const STORAGE_KEY = "saetbyeol-auth-store";
const LEGACY_STORAGE_KEY = "saetbyeol-learning-store";

const emptyUserState: UserScopedState = {
  savedWords: [],
  bookmarkedSlugs: [],
  selectedInterests: [],
  hasCompletedOnboarding: false,
  composedArticles: [],
  customArticles: []
};

const LearningStoreContext = createContext<LearningStoreValue | null>(null);

export function LearningStoreProvider({ children }: PropsWithChildren) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [accounts, setAccounts] = useState<Record<string, StoredAccount>>({});
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [authError, setAuthError] = useState("");
  const [savedWords, setSavedWords] = useState<SavedVocabulary[]>([]);
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterestsState] = useState<Category[]>([]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [composedArticles, setComposedArticles] = useState<ComposedArticle[]>([]);
  const [customArticles, setCustomArticles] = useState<Article[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (raw) {
      const parsed = JSON.parse(raw) as PersistedAuthState;
      const username = parsed.currentUsername;
      const account = username
        ? parsed.accounts[accountKey(username)]
        : undefined;

      setAccounts(parsed.accounts ?? {});
      setCommunityPosts(normalizeCommunityPosts(parsed.communityPosts ?? []));
      setCurrentUsername(account?.username ?? null);

      if (account) {
        loadUserState(account.state);
      }

      setIsHydrated(true);
      return;
    }

    const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);

    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw) as Partial<UserScopedState> & {
        composedArticles?: Array<ComposedArticle & { body?: string }>;
        communityPosts?: CommunityPost[];
      };

      setCommunityPosts(normalizeCommunityPosts(legacy.communityPosts ?? []));
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const currentState = createCurrentUserState({
      savedWords,
      bookmarkedSlugs,
      selectedInterests,
      hasCompletedOnboarding,
      composedArticles,
      customArticles
    });
    const currentAccountKey = currentUsername
      ? accountKey(currentUsername)
      : null;
    const currentAccount = currentAccountKey
      ? accounts[currentAccountKey]
      : undefined;
    const shouldSyncAccount =
      Boolean(currentUsername && currentAccount) &&
      JSON.stringify(currentAccount?.state) !== JSON.stringify(currentState);
    const nextAccounts =
      currentUsername && currentAccountKey && currentAccount
        ? {
            ...accounts,
            [currentAccountKey]: {
              ...currentAccount,
              username: currentUsername,
              state: currentState
            }
          }
        : accounts;

    const payload: PersistedAuthState = {
      currentUsername,
      accounts: nextAccounts,
      communityPosts
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    if (shouldSyncAccount) {
      setAccounts(nextAccounts);
    }
  }, [
    accounts,
    bookmarkedSlugs,
    communityPosts,
    composedArticles,
    currentUsername,
    customArticles,
    hasCompletedOnboarding,
    isHydrated,
    savedWords,
    selectedInterests
  ]);

  const value = useMemo<LearningStoreValue>(
    () => ({
      currentUsername,
      authError,
      isHydrated,
      savedWords,
      bookmarkedSlugs,
      selectedInterests,
      hasCompletedOnboarding,
      composedArticles,
      customArticles,
      communityPosts,
      login: (username, password) => {
        const normalizedUsername = username.trim();
        const normalizedPassword = password.trim();

        if (!normalizedUsername || !normalizedPassword) {
          setAuthError("Username and password are required.");
          return false;
        }

        const key = accountKey(normalizedUsername);
        const existingAccount = accounts[key];

        if (existingAccount && existingAccount.password !== normalizedPassword) {
          setAuthError("Password does not match this username.");
          return false;
        }

        const account =
          existingAccount ??
          ({
            username: normalizedUsername,
            password: normalizedPassword,
            state: emptyUserState
          } satisfies StoredAccount);

        setAccounts((current) => ({
          ...current,
          [key]: account
        }));
        setCurrentUsername(account.username);
        loadUserState(account.state);
        setAuthError("");
        return true;
      },
      logout: () => {
        setCurrentUsername(null);
        setAuthError("");
        loadUserState(emptyUserState);
      },
      setSelectedInterests: setSelectedInterestsState,
      completeOnboarding: () => {
        setHasCompletedOnboarding(true);
      },
      resetOnboarding: () => {
        setHasCompletedOnboarding(false);
        setSelectedInterestsState([]);
      },
      saveWord: (entry) => {
        const normalizedWord = entry.word.trim();
        const normalizedSentence = entry.sentence.trim();

        if (!normalizedWord || !normalizedSentence || !currentUsername) {
          return;
        }

        setSavedWords((current) => {
          const alreadySaved = current.some(
            (item) =>
              item.word.toLowerCase() === normalizedWord.toLowerCase() &&
              item.sentence === normalizedSentence
          );

          if (alreadySaved) {
            return current;
          }

          return [
            {
              ...entry,
              word: normalizedWord,
              sentence: normalizedSentence,
              id: `${entry.topicSlug}-${normalizedWord}-${current.length + 1}`
            },
            ...current
          ];
        });
      },
      hasSavedWord: (word, sentence) => {
        const normalizedWord = word.trim().toLowerCase();
        const normalizedSentence = sentence.trim();

        if (!normalizedWord || !normalizedSentence) {
          return false;
        }

        return savedWords.some(
          (item) =>
            item.word.toLowerCase() === normalizedWord &&
            item.sentence === normalizedSentence
        );
      },
      removeWord: (id) => {
        setSavedWords((current) => current.filter((item) => item.id !== id));
      },
      toggleBookmark: (slug) => {
        if (!currentUsername) {
          return;
        }

        setBookmarkedSlugs((current) =>
          current.includes(slug)
            ? current.filter((item) => item !== slug)
            : [...current, slug]
        );
      },
      addCustomArticleFromUrl: (sourceUrl) => {
        if (!currentUsername) {
          return null;
        }

        const article = createCustomArticle(sourceUrl);

        if (!article) {
          return null;
        }

        const existingArticle = [...articles, ...customArticles].find(
          (item) => item.sourceUrl === article.sourceUrl
        );
        const slug = existingArticle?.slug ?? article.slug;

        if (!existingArticle) {
          setCustomArticles((current) => [article, ...current]);
        }

        setBookmarkedSlugs((current) =>
          current.includes(slug) ? current : [...current, slug]
        );

        return slug;
      },
      addComposedArticle: (entry) => {
        const title = entry.title.trim();
        const requirements = entry.requirements.trim();

        if (
          !title ||
          !requirements ||
          entry.sourceSlugs.length === 0 ||
          !currentUsername
        ) {
          return;
        }

        setComposedArticles((current) => [
          {
            ...entry,
            title,
            requirements,
            analysis:
              "AI analysis will appear here after the generation pipeline is connected.",
            id: `composition-${Date.now()}`,
            createdAt: new Date().toISOString()
          },
          ...current
        ]);
      },
      shareComposition: (compositionId, insight) => {
        const normalizedInsight = insight.trim();
        const composition = composedArticles.find(
          (entry) => entry.id === compositionId
        );

        if (!composition || !normalizedInsight || !currentUsername) {
          return;
        }

        const sourceSnapshots = [...customArticles, ...articles].filter(
          (article) => composition.sourceSlugs.includes(article.slug)
        );

        setCommunityPosts((current) => {
          const existingPost = current.find(
            (post) => post.compositionId === compositionId
          );

          if (existingPost) {
            return current.map((post) =>
              post.id === existingPost.id
                ? {
                    ...post,
                    authorName: currentUsername,
                    insight: normalizedInsight,
                    title: composition.title,
                    requirements: composition.requirements,
                    analysis: composition.analysis,
                    sourceSlugs: composition.sourceSlugs,
                    sourceSnapshots
                  }
                : post
            );
          }

          return [
            {
              id: `community-${Date.now()}`,
              compositionId,
              authorName: currentUsername,
              title: composition.title,
              insight: normalizedInsight,
              requirements: composition.requirements,
              analysis: composition.analysis,
              sourceSlugs: composition.sourceSlugs,
              sourceSnapshots,
              comments: [],
              createdAt: new Date().toISOString()
            },
            ...current
          ];
        });
      },
      addCommunityComment: (postId, body) => {
        const normalizedBody = body.trim();

        if (!normalizedBody || !currentUsername) {
          return;
        }

        setCommunityPosts((current) =>
          current.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [
                    ...post.comments,
                    {
                      id: `comment-${Date.now()}`,
                      authorName: currentUsername,
                      body: normalizedBody,
                      createdAt: new Date().toISOString()
                    }
                  ]
                }
              : post
          )
        );
      },
      deleteCommunityPost: (postId) => {
        if (!currentUsername) {
          return;
        }

        setCommunityPosts((current) =>
          current.filter(
            (post) =>
              post.id !== postId || post.authorName !== currentUsername
          )
        );
      },
      deleteCommunityComment: (postId, commentId) => {
        if (!currentUsername) {
          return;
        }

        setCommunityPosts((current) =>
          current.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: post.comments.filter(
                    (comment) =>
                      comment.id !== commentId ||
                      comment.authorName !== currentUsername
                  )
                }
              : post
          )
        );
      }
    }),
    [
      accounts,
      authError,
      bookmarkedSlugs,
      communityPosts,
      composedArticles,
      currentUsername,
      customArticles,
      hasCompletedOnboarding,
      isHydrated,
      savedWords,
      selectedInterests
    ]
  );

  function loadUserState(state: UserScopedState) {
    setSavedWords(state.savedWords ?? []);
    setBookmarkedSlugs(state.bookmarkedSlugs ?? []);
    setSelectedInterestsState(state.selectedInterests ?? []);
    setHasCompletedOnboarding(state.hasCompletedOnboarding ?? false);
    setCustomArticles(state.customArticles ?? []);
    setComposedArticles(
      (state.composedArticles ?? []).map((entry) => ({
        ...entry,
        requirements: entry.requirements ?? entry.body ?? "",
        analysis:
          entry.analysis ??
          "AI analysis will appear here after the generation pipeline is connected."
      }))
    );
  }

  return (
    <LearningStoreContext.Provider value={value}>
      {children}
    </LearningStoreContext.Provider>
  );
}

function createCurrentUserState(state: UserScopedState): UserScopedState {
  return {
    savedWords: state.savedWords,
    bookmarkedSlugs: state.bookmarkedSlugs,
    selectedInterests: state.selectedInterests,
    hasCompletedOnboarding: state.hasCompletedOnboarding,
    composedArticles: state.composedArticles,
    customArticles: state.customArticles
  };
}

function normalizeCommunityPosts(
  posts: Array<
    CommunityPost & { authorName?: string; sourceSnapshots?: Article[] }
  >
): CommunityPost[] {
  return posts.map((post) => ({
    ...post,
    authorName: post.authorName ?? "Unknown",
    sourceSnapshots: post.sourceSnapshots ?? []
  }));
}

function accountKey(username: string) {
  return username.trim().toLowerCase();
}

function createCustomArticle(sourceUrl: string): Article | null {
  try {
    const url = new URL(sourceUrl.trim());
    const readablePath = url.pathname
      .split("/")
      .filter(Boolean)
      .at(-1)
      ?.replace(/\.[a-z0-9]+$/i, "")
      .replace(/[-_]+/g, " ");
    const title = readablePath
      ? decodeURIComponent(readablePath)
      : `User source from ${url.hostname}`;

    return {
      slug: `custom-${slugify(`${url.hostname}-${url.pathname || "source"}`)}`,
      category: "Global",
      title,
      sourceName: url.hostname.replace(/^www\./, ""),
      sourceUrl: url.toString(),
      publishedAt: new Date().toISOString(),
      keyword: "custom source",
      intro: "A source article added directly by the user."
    };
  } catch {
    return null;
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function useLearningStore() {
  const context = useContext(LearningStoreContext);

  if (!context) {
    throw new Error("useLearningStore must be used within LearningStoreProvider");
  }

  return context;
}
