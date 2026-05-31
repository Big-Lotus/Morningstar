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
import { getArticles as getDbArticles } from "@/lib/db/articles";
import { toggleBookmark as toggleDbBookmark } from "@/lib/db/bookmarks";
import { isSupabaseConfigured } from "@/lib/db/client";
import {
  addCommunityAnalysisComment,
  createCommunityAnalysisPost,
  deleteCommunityAnalysisComment,
  deleteCommunityAnalysisPost,
  getCommunityAnalysisPosts
} from "@/lib/db/community-analysis";
import {
  addCommunityPollComment,
  createCommunityPoll as createDbCommunityPoll,
  deleteCommunityPoll,
  deleteCommunityPollComment,
  getCommunityPolls,
  updateCommunityPollSummary,
  upsertPollVote
} from "@/lib/db/community-polls";
import {
  addCustomSource,
  deleteCustomSource,
  getCustomSources
} from "@/lib/db/custom-sources";
import { replaceUserInterests } from "@/lib/db/interests";
import {
  createInvestigation,
  deleteInvestigation,
  getInvestigations,
  InvestigationSourceInput
} from "@/lib/db/investigations";
import { createUser, getUserByUsername } from "@/lib/db/users";
import {
  addSavedVocabulary,
  deleteSavedVocabulary,
  getSavedVocabulary
} from "@/lib/db/vocabulary";
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
  feedArticles: Article[];
  composedArticles: ComposedArticle[];
  customArticles: Article[];
  communityPosts: CommunityPost[];
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setSelectedInterests: (interests: Category[]) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  saveWord: (entry: Omit<SavedVocabulary, "id">) => void;
  hasSavedWord: (word: string, sentence: string) => boolean;
  removeWord: (id: string) => void;
  toggleBookmark: (slug: string) => void;
  addCustomArticleFromUrl: (sourceUrl: string) => string | null;
  deleteCustomArticle: (slug: string) => void;
  addComposedArticle: (
    entry: Omit<ComposedArticle, "id" | "createdAt" | "analysis">
  ) => string | null;
  deleteComposedArticle: (compositionId: string) => void;
  shareComposition: (compositionId: string, insight: string) => void;
  createCommunityPoll: (entry: {
    title: string;
    pollQuestion: string;
    options: string[];
  }) => void;
  voteCommunityPoll: (entry: {
    postId: string;
    optionId: string;
    opinion: string;
  }) => void;
  updatePollSummaryInsight: (postId: string, summaryInsight: string) => void;
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [feedArticles, setFeedArticles] = useState<Article[]>(articles);
  const [composedArticles, setComposedArticles] = useState<ComposedArticle[]>([]);
  const [customArticles, setCustomArticles] = useState<Article[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    if (isSupabaseConfigured) {
      getDbArticles()
        .then((dbArticles) => {
          if (dbArticles.length > 0) {
            setFeedArticles(dbArticles);
          }
        })
        .catch((error) => {
          console.error("Failed to load Supabase articles.", error);
        });
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (raw) {
      const parsed = JSON.parse(raw) as PersistedAuthState;
      const username = parsed.currentUsername;
      const account = username
        ? parsed.accounts[accountKey(username)]
        : undefined;

      setAccounts(parsed.accounts ?? {});
      setCommunityPosts(
        normalizeCommunityPosts(parsed.communityPosts ?? []).filter(
          (post) => post.title !== "good"
        )
      );

      if (username && isSupabaseConfigured) {
        setCurrentUsername(username);
        getUserByUsername(username)
          .then(async (user) => {
            if (!user) {
              setCurrentUsername(null);
              loadUserState(emptyUserState);
              return;
            }

            setCurrentUserId(user.id);
            setCurrentUsername(user.username);
            await loadRemoteUserState(user.id);
          })
          .catch((error) => {
            console.error("Failed to restore Supabase session.", error);
            setCurrentUsername(null);
            loadUserState(emptyUserState);
          })
          .finally(() => {
            setIsHydrated(true);
          });
        return;
      }

      setCurrentUsername(account?.username ?? null);

      if (account) {
        loadUserState(cleanUserState(account.state));
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

      setCommunityPosts(
        normalizeCommunityPosts(legacy.communityPosts ?? []).filter(
          (post) => post.title !== "good"
        )
      );
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
      feedArticles,
      composedArticles,
      customArticles,
      communityPosts,
      login: async (username, password) => {
        const normalizedUsername = username.trim();
        const normalizedPassword = password.trim();

        if (!normalizedUsername || !normalizedPassword) {
          setAuthError("Username and password are required.");
          return false;
        }

        if (isSupabaseConfigured) {
          try {
            const passwordHash = await hashPassword(normalizedPassword);
            const existingUser = await getUserByUsername(normalizedUsername);

            if (existingUser && existingUser.password_hash !== passwordHash) {
              setAuthError("Password does not match this username.");
              return false;
            }

            const user =
              existingUser ??
              (await createUser({
                username: normalizedUsername,
                passwordHash
              }));

            setCurrentUserId(user.id);
            setCurrentUsername(user.username);
            setAuthError("");
            await loadRemoteUserState(user.id);
            return true;
          } catch (error) {
            console.error("Supabase login failed. Falling back to local state.", error);
          }
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
        setCurrentUserId(null);
        loadUserState(account.state);
        setAuthError("");
        return true;
      },
      logout: () => {
        setCurrentUsername(null);
        setCurrentUserId(null);
        setAuthError("");
        loadUserState(emptyUserState);
      },
      setSelectedInterests: (interests) => {
        setSelectedInterestsState(interests);
        syncUserInterests(currentUserId, interests);
      },
      completeOnboarding: () => {
        setHasCompletedOnboarding(true);
      },
      resetOnboarding: () => {
        setHasCompletedOnboarding(false);
        setSelectedInterestsState([]);
        syncUserInterests(currentUserId, []);
      },
      saveWord: (entry) => {
        const normalizedWord = entry.word.trim();
        const normalizedMeaning = entry.meaning.trim();
        const normalizedSentence = entry.sentence.trim();

        if (
          !normalizedWord ||
          !normalizedMeaning ||
          !normalizedSentence ||
          !currentUsername
        ) {
          return;
        }

        const alreadySaved = savedWords.some(
          (item) =>
            item.word.toLowerCase() === normalizedWord.toLowerCase() &&
            item.sentence === normalizedSentence
        );

        if (alreadySaved) {
          return;
        }

        const savedEntry = {
          ...entry,
          word: normalizedWord,
          meaning: normalizedMeaning,
          sentence: normalizedSentence,
          id: crypto.randomUUID()
        };

        setSavedWords((current) => {
          return [savedEntry, ...current];
        });

        if (currentUserId && isSupabaseConfigured) {
          runDbTask(
            () =>
              addSavedVocabulary(
                currentUserId,
                savedEntry,
                getSourceType(entry.sourceSlug, [...feedArticles, ...customArticles])
              ),
            "save vocabulary"
          );
        }
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
        if (currentUserId && isSupabaseConfigured) {
          runDbTask(
            () => deleteSavedVocabulary(currentUserId, id),
            "delete vocabulary"
          );
        }
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
        if (currentUserId && isSupabaseConfigured) {
          runDbTask(() => toggleDbBookmark(currentUserId, slug), "toggle bookmark");
        }
      },
      addCustomArticleFromUrl: (sourceUrl) => {
        if (!currentUsername) {
          return null;
        }

        const article = createCustomArticle(sourceUrl);

        if (!article) {
          return null;
        }

        const existingArticle = [...feedArticles, ...customArticles].find(
          (item) => item.sourceUrl === article.sourceUrl
        );
        const slug = existingArticle?.slug ?? article.slug;

        if (!existingArticle) {
          setCustomArticles((current) => [article, ...current]);
          if (currentUserId && isSupabaseConfigured) {
            runDbTask(
              () => addCustomSource(currentUserId, article),
              "add custom source"
            );
          }
        }

        return slug;
      },
      deleteCustomArticle: (slug) => {
        if (!currentUsername) {
          return;
        }

        setCustomArticles((current) =>
          current.filter((article) => article.slug !== slug)
        );
        if (currentUserId && isSupabaseConfigured) {
          runDbTask(
            () => deleteCustomSource(currentUserId, slug),
            "delete custom source"
          );
        }
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
          return null;
        }

        const id = crypto.randomUUID();
        const analysis =
          "This prototype analysis is ready for review. The full AI pipeline will later turn the selected sources and requirements into a deeper report with evidence, comparisons, and visual summaries.";

        setComposedArticles((current) => [
          {
            ...entry,
            title,
            requirements,
            analysis,
            id,
            createdAt: new Date().toISOString()
          },
          ...current
        ]);

        if (currentUserId && isSupabaseConfigured) {
          const availableArticles = [...feedArticles, ...customArticles];

          runDbTask(
            async () => {
              await ensureCustomSources(
                currentUserId,
                entry.sourceSlugs,
                availableArticles
              );

              return createInvestigation(currentUserId, {
                id,
                title,
                requirements,
                analysis,
                sources: toInvestigationSources(entry.sourceSlugs, availableArticles)
              });
            },
            "create investigation"
          );
        }

        return id;
      },
      deleteComposedArticle: (compositionId) => {
        if (!currentUsername) {
          return;
        }

        setComposedArticles((current) =>
          current.filter((composition) => composition.id !== compositionId)
        );
        setCommunityPosts((current) =>
          current.filter((post) => post.compositionId !== compositionId)
        );

        if (currentUserId && isSupabaseConfigured) {
          runDbTask(
            () => deleteInvestigation(currentUserId, compositionId),
            "delete investigation"
          );
        }
      },
      shareComposition: (compositionId, insight) => {
        const normalizedInsight = insight.trim();
        const composition = composedArticles.find(
          (entry) => entry.id === compositionId
        );

        if (!composition || !normalizedInsight || !currentUsername) {
          return;
        }

        const sourceSnapshots = [...customArticles, ...feedArticles].filter(
          (article) => composition.sourceSlugs.includes(article.slug)
        );
        const existingSharedPost = communityPosts.find(
          (post) => post.compositionId === compositionId
        );
        const postId = existingSharedPost?.id ?? crypto.randomUUID();

        if (currentUserId && isSupabaseConfigured) {
          runDbTask(
            () =>
              createCommunityAnalysisPost(currentUserId, {
                id: postId,
                investigationId: compositionId,
                title: composition.title,
                insight: normalizedInsight
              }),
            "share composition"
          );
        }

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
              id: postId,
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
      createCommunityPoll: (entry) => {
        const title = entry.title.trim();
        const pollQuestion = entry.pollQuestion.trim();
        const options = entry.options
          .map((option) => option.trim())
          .filter(Boolean)
          .slice(0, 4);

        if (!title || !pollQuestion || options.length < 2 || !currentUsername) {
          return;
        }

        const createdAt = new Date().toISOString();
        const pollId = crypto.randomUUID();
        const pollOptions = options.map((option) => ({
          id: crypto.randomUUID(),
          label: option
        }));

        setCommunityPosts((current) => [
          {
            id: pollId,
            compositionId: pollId,
            authorName: currentUsername,
            title,
            insight: "Community poll",
            requirements: pollQuestion,
            analysis: "",
            sourceSlugs: [],
            sourceSnapshots: [],
            comments: [],
            pollQuestion,
            pollOptions,
            pollVotes: [],
            summaryInsight: "",
            createdAt
          },
          ...current
        ]);

        if (currentUserId && isSupabaseConfigured) {
          runDbTask(
            () =>
              createDbCommunityPoll(currentUserId, {
                id: pollId,
                title,
                question: pollQuestion,
                options: pollOptions
              }),
            "create community poll"
          );
        }
      },
      voteCommunityPoll: (entry) => {
        const opinion = entry.opinion.trim();

        if (!currentUsername || !entry.optionId) {
          return;
        }

        setCommunityPosts((current) =>
          current.map((post) => {
            if (post.id !== entry.postId || !post.pollOptions) {
              return post;
            }

            const vote = {
              id: `vote-${Date.now()}`,
              authorName: currentUsername,
              optionId: entry.optionId,
              opinion,
              createdAt: new Date().toISOString()
            };
            const existingVote = post.pollVotes?.some(
              (item) => item.authorName === currentUsername
            );

            return {
              ...post,
              pollVotes: existingVote
                ? (post.pollVotes ?? []).map((item) =>
                    item.authorName === currentUsername ? vote : item
                  )
                : [...(post.pollVotes ?? []), vote]
            };
          })
        );

        if (currentUserId && isSupabaseConfigured) {
          runDbTask(
            () =>
              upsertPollVote(currentUserId, {
                pollId: entry.postId,
                optionId: entry.optionId,
                opinion
              }),
            "vote community poll"
          );
        }
      },
      updatePollSummaryInsight: (postId, summaryInsight) => {
        if (!currentUsername) {
          return;
        }

        setCommunityPosts((current) =>
          current.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  summaryInsight
                }
              : post
          )
        );

        if (currentUserId && isSupabaseConfigured) {
          runDbTask(
            () =>
              updateCommunityPollSummary(
                currentUserId,
                postId,
                summaryInsight
              ),
            "update poll summary"
          );
        }
      },
      addCommunityComment: (postId, body) => {
        const normalizedBody = body.trim();

        if (!normalizedBody || !currentUsername) {
          return;
        }

        const commentId = crypto.randomUUID();

        setCommunityPosts((current) =>
          current.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [
                    ...post.comments,
                    {
                      id: commentId,
                      authorName: currentUsername,
                      body: normalizedBody,
                      createdAt: new Date().toISOString()
                    }
                  ]
                }
              : post
          )
        );

        const post = communityPosts.find((entry) => entry.id === postId);

        if (post && currentUserId && isSupabaseConfigured) {
          runDbTask(
            () =>
              post.pollOptions?.length
                ? addCommunityPollComment(
                    currentUserId,
                    postId,
                    normalizedBody,
                    commentId
                  )
                : addCommunityAnalysisComment(
                    currentUserId,
                    postId,
                    normalizedBody,
                    commentId
                  ),
            "add community comment"
          );
        }
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

        const post = communityPosts.find((entry) => entry.id === postId);

        if (post && currentUserId && isSupabaseConfigured) {
          runDbTask(
            () =>
              post.pollOptions?.length
                ? deleteCommunityPoll(currentUserId, postId)
                : deleteCommunityAnalysisPost(currentUserId, postId),
            "delete community post"
          );
        }
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

        const post = communityPosts.find((entry) => entry.id === postId);

        if (post && currentUserId && isSupabaseConfigured) {
          runDbTask(
            () =>
              post.pollOptions?.length
                ? deleteCommunityPollComment(currentUserId, commentId)
                : deleteCommunityAnalysisComment(currentUserId, commentId),
            "delete community comment"
          );
        }
      }
    }),
    [
      accounts,
      authError,
      bookmarkedSlugs,
      communityPosts,
      composedArticles,
      currentUsername,
      currentUserId,
      customArticles,
      feedArticles,
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
      (state.composedArticles ?? []).filter((entry) => entry.title !== "Test1").map((entry) => ({
        ...entry,
        requirements: entry.requirements ?? entry.body ?? "",
        analysis:
          entry.analysis ??
          "AI analysis will appear here after the generation pipeline is connected."
      }))
    );
  }

  async function loadRemoteUserState(userId: string) {
    try {
      const [
        { getUserInterests },
        { getBookmarkedArticleSlugs },
        { getCustomSources },
        { getInvestigations }
      ] = await Promise.all([
        import("@/lib/db/interests"),
        import("@/lib/db/bookmarks"),
        import("@/lib/db/custom-sources"),
        import("@/lib/db/investigations")
      ]);
      const [
        remoteInterests,
        remoteBookmarks,
        remoteCustomSources,
        remoteInvestigations,
        remoteSavedVocabulary,
        remoteCommunityPosts
      ] =
        await Promise.all([
          getUserInterests(userId),
          getBookmarkedArticleSlugs(userId),
          getCustomSources(userId),
          getInvestigations(userId),
          getSavedVocabulary(userId),
          loadRemoteCommunityPosts()
        ]);

      setSelectedInterestsState(remoteInterests);
      setHasCompletedOnboarding(remoteInterests.length > 0);
      setBookmarkedSlugs(remoteBookmarks);
      setCustomArticles(remoteCustomSources);
      setComposedArticles(remoteInvestigations);
      setCommunityPosts(remoteCommunityPosts);
      setSavedWords(remoteSavedVocabulary);
    } catch (error) {
      console.error("Failed to load Supabase user state.", error);
      loadUserState(emptyUserState);
    }
  }

  return (
    <LearningStoreContext.Provider value={value}>
      {children}
    </LearningStoreContext.Provider>
  );
}

function cleanUserState(state: UserScopedState): UserScopedState {
  return {
    ...state,
    composedArticles: (state.composedArticles ?? []).filter(
      (entry) => entry.title !== "Test1"
    )
  };
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

async function loadRemoteCommunityPosts() {
  if (!isSupabaseConfigured) {
    return [];
  }

  const [analysisPosts, pollPosts] = await Promise.all([
    getCommunityAnalysisPosts(),
    getCommunityPolls()
  ]);

  return [...analysisPosts, ...pollPosts].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function accountKey(username: string) {
  return username.trim().toLowerCase();
}

async function hashPassword(password: string) {
  const encoded = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest("SHA-256", encoded);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function syncUserInterests(userId: string | null, interests: Category[]) {
  if (!userId || !isSupabaseConfigured) {
    return;
  }

  runDbTask(() => replaceUserInterests(userId, interests), "sync interests");
}

function runDbTask(task: () => Promise<unknown>, label: string) {
  task().catch((error) => {
    console.error(`Failed to ${label}.`, error);
  });
}

function toInvestigationSources(
  sourceSlugs: string[],
  availableArticles: Article[]
): InvestigationSourceInput[] {
  return sourceSlugs.map((slug, index) => {
    return {
      slug,
      sourceType: getSourceType(slug, availableArticles),
      sortOrder: index,
      isSeed: index === 0
    };
  });
}

function getSourceType(
  slug: string,
  availableArticles: Article[]
): "article" | "custom_source" {
  const source = availableArticles.find((article) => article.slug === slug);

  return source?.slug.startsWith("custom-") ? "custom_source" : "article";
}

async function ensureCustomSources(
  userId: string,
  sourceSlugs: string[],
  availableArticles: Article[]
) {
  const customSources = availableArticles.filter(
    (article) =>
      sourceSlugs.includes(article.slug) &&
      getSourceType(article.slug, availableArticles) === "custom_source"
  );

  await Promise.all(
    customSources.map((article) => addCustomSource(userId, article))
  );
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
      category: "National",
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
