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
import { mergeFeaturedCommunityPosts } from "@/lib/community-featured";
import { getArticles as getDbArticles } from "@/lib/db/articles";
import { toggleBookmark as toggleDbBookmark } from "@/lib/db/bookmarks";
import { isSupabaseConfigured, supabase } from "@/lib/db/client";
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
import { ensureUserProfile, getUserById } from "@/lib/db/users";
import {
  addSavedVocabulary,
  deleteSavedVocabulary,
  getSavedVocabulary,
  updateSavedVocabulary
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
  authMessage: string;
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
  signup: (
    username: string,
    password: string,
    displayName: string
  ) => Promise<"signed-in" | "pending" | "failed">;
  sendPasswordReset: (username: string) => Promise<boolean>;
  logout: () => void;
  setSelectedInterests: (interests: Category[]) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  saveWord: (entry: Omit<SavedVocabulary, "id">) => void;
  hasSavedWord: (word: string, sentence: string) => boolean;
  updateWord: (id: string, entry: Omit<SavedVocabulary, "id">) => void;
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

type SupabaseErrorLike = {
  message?: unknown;
  code?: unknown;
  details?: unknown;
  hint?: unknown;
};

const LearningStoreContext = createContext<LearningStoreValue | null>(null);

export function LearningStoreProvider({ children }: PropsWithChildren) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [accounts, setAccounts] = useState<Record<string, StoredAccount>>({});
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
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
    if (!isSupabaseConfigured) {
      return;
    }

    let isCancelled = false;

    async function loadArticles() {
      try {
        const dbArticles = await getDbArticles();

        if (!isCancelled) {
          setFeedArticles(dbArticles);
        }
      } catch (error) {
        reportRecoverableError("Failed to load Supabase articles.", error);
      }
    }

    void loadArticles();

    const refreshInterval = window.setInterval(loadArticles, 30_000);
    const channel = supabase
      ?.channel("articles-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "articles" },
        () => {
          void loadArticles();
        }
      )
      .subscribe();

    return () => {
      isCancelled = true;
      window.clearInterval(refreshInterval);

      if (channel) {
        void supabase?.removeChannel(channel);
      }
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    let fallbackAccount: StoredAccount | undefined;

    if (raw) {
      const parsed = JSON.parse(raw) as PersistedAuthState;
      const username = parsed.currentUsername;
      fallbackAccount = username
        ? parsed.accounts[accountKey(username)]
        : undefined;

      setAccounts(parsed.accounts ?? {});
      setCommunityPosts(
        normalizeCommunityPosts(parsed.communityPosts ?? []).filter(
          (post) => post.title !== "good"
        )
      );
    } else {
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
    }

    if (isSupabaseConfigured && supabase) {
      supabase.auth
        .getUser()
        .then(async ({ data, error }) => {
          if (isCancelled) {
            return;
          }

          if (error || !data.user) {
            setCurrentUsername(null);
            setCurrentUserId(null);
            loadUserState(emptyUserState);
            return;
          }

          const user = await ensureAuthProfile(
            data.user.id,
            data.user.email ?? "",
            getAuthDisplayName(data.user)
          );

          if (isCancelled) {
            return;
          }

          setCurrentUserId(user.id);
          setCurrentUsername(user.username);
          await loadRemoteUserState(user.id);
        })
        .catch((error) => {
          reportRecoverableError("Failed to restore Supabase session.", error);
          setCurrentUsername(null);
          setCurrentUserId(null);
          loadUserState(emptyUserState);
        })
        .finally(() => {
          if (!isCancelled) {
            setIsHydrated(true);
          }
        });

      return () => {
        isCancelled = true;
      };
    }

    setCurrentUsername(fallbackAccount?.username ?? null);

    if (fallbackAccount) {
      loadUserState(cleanUserState(fallbackAccount.state));
    }

    setIsHydrated(true);

    return () => {
      isCancelled = true;
    };
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
      authMessage,
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
        const normalizedUsername = username.trim().toLowerCase();
        const normalizedPassword = password;

        if (!normalizedUsername || !normalizedPassword) {
          setAuthError("ID와 비밀번호를 입력해주세요.");
          setAuthMessage("");
          return false;
        }

        if (isSupabaseConfigured && supabase) {
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email: normalizedUsername,
              password: normalizedPassword
            });

            if (error || !data.user) {
              setAuthError(toLoginErrorMessage(error?.message));
              setAuthMessage("");
              return false;
            }

            const user = await ensureAuthProfile(
              data.user.id,
              data.user.email ?? normalizedUsername,
              getAuthDisplayName(data.user)
            );

            setCurrentUserId(user.id);
            setCurrentUsername(user.username);
            setAuthError("");
            setAuthMessage("");
            await loadRemoteUserState(user.id);
            return true;
          } catch (error) {
            reportRecoverableError(
              "Supabase login failed.",
              error
            );
            setAuthError("로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
            setAuthMessage("");
            return false;
          }
        }

        const key = accountKey(normalizedUsername);
        const existingAccount = accounts[key];

        if (!existingAccount || existingAccount.password !== normalizedPassword) {
          setAuthError("없는 ID 또는 비밀번호 입니다.");
          setAuthMessage("");
          return false;
        }

        setCurrentUsername(existingAccount.username);
        setCurrentUserId(null);
        loadUserState(existingAccount.state);
        setAuthError("");
        setAuthMessage("");
        return true;
      },
      signup: async (username, password, displayName) => {
        const normalizedUsername = username.trim().toLowerCase();
        const normalizedPassword = password;
        const normalizedDisplayName = displayName.trim();

        if (!normalizedUsername || !normalizedPassword || !normalizedDisplayName) {
          setAuthError("이메일, username, 비밀번호를 입력해주세요.");
          setAuthMessage("");
          return "failed";
        }

        if (isSupabaseConfigured && supabase) {
          try {
            const { data, error } = await supabase.auth.signUp({
              email: normalizedUsername,
              password: normalizedPassword,
              options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
                data: {
                  username: normalizedDisplayName
                }
              }
            });

            if (error || !data.user) {
              setAuthError(
                toAuthErrorMessage(error?.message, "회원가입을 완료하지 못했습니다.")
              );
              setAuthMessage("");
              return "failed";
            }

            setAuthError("");

            if (data.session) {
              const user = await ensureAuthProfile(
                data.user.id,
                data.user.email ?? normalizedUsername,
                normalizedDisplayName
              );

              setCurrentUserId(user.id);
              setCurrentUsername(user.username);
              setAuthMessage("회원가입이 완료되어 로그인되었습니다.");
              await loadRemoteUserState(user.id);
              return "signed-in";
            } else {
              setCurrentUserId(null);
              setCurrentUsername(null);
              loadUserState(emptyUserState);
              setAuthMessage("");
              window.localStorage.setItem(
                "saetbyeol-pending-signup",
                JSON.stringify({
                  email: normalizedUsername,
                  username: normalizedDisplayName
                })
              );
              return "pending";
            }
          } catch (error) {
            reportRecoverableError("Supabase signup failed.", error);
            setAuthError("회원가입을 완료하지 못했습니다.");
            setAuthMessage("");
            return "failed";
          }
        }

        const key = accountKey(normalizedUsername);

        if (accounts[key]) {
          setAuthError("이미 가입된 ID입니다.");
          setAuthMessage("");
          return "failed";
        }

        const account = {
          username: normalizedDisplayName,
          password: normalizedPassword,
          state: emptyUserState
        } satisfies StoredAccount;

        setAccounts((current) => ({
          ...current,
          [key]: account
        }));
        setCurrentUsername(account.username);
        setCurrentUserId(null);
        loadUserState(account.state);
        setAuthError("");
        setAuthMessage("회원가입이 완료되어 로그인되었습니다.");
        return "signed-in";
      },
      sendPasswordReset: async (username) => {
        const normalizedUsername = username.trim().toLowerCase();

        if (!normalizedUsername) {
          setAuthError("재설정 링크를 받을 이메일을 입력해주세요.");
          setAuthMessage("");
          return false;
        }

        if (!isSupabaseConfigured || !supabase) {
          setAuthError("Supabase Auth 설정이 필요합니다.");
          setAuthMessage("");
          return false;
        }

        try {
          const { error } = await supabase.auth.resetPasswordForEmail(
            normalizedUsername,
            {
              redirectTo: `${window.location.origin}/reset-password`
            }
          );

          if (error) {
            setAuthError(
              toAuthErrorMessage(
                error.message,
                "비밀번호 재설정 메일을 보내지 못했습니다."
              )
            );
            setAuthMessage("");
            return false;
          }

          setAuthError("");
          setAuthMessage(
            "가입된 이메일이면 비밀번호 재설정 링크가 전송됩니다."
          );
          return true;
        } catch (error) {
          reportRecoverableError("Failed to send password reset email.", error);
          setAuthError("비밀번호 재설정 메일을 보내지 못했습니다.");
          setAuthMessage("");
          return false;
        }
      },
      logout: () => {
        if (isSupabaseConfigured && supabase) {
          void supabase.auth.signOut();
        }

        setCurrentUsername(null);
        setCurrentUserId(null);
        setAuthError("");
        setAuthMessage("");
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
          sourceSlug: entry.sourceSlug?.trim() || undefined,
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
                savedEntry.sourceSlug
                  ? getSourceType(savedEntry.sourceSlug, [
                      ...feedArticles,
                      ...customArticles
                    ])
                  : "manual"
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
      updateWord: (id, entry) => {
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

        const updatedEntry: SavedVocabulary = {
          id,
          word: normalizedWord,
          meaning: normalizedMeaning,
          sentence: normalizedSentence,
          sourceSlug: entry.sourceSlug?.trim() || undefined
        };

        setSavedWords((current) =>
          current.map((item) => (item.id === id ? updatedEntry : item))
        );

        if (currentUserId && isSupabaseConfigured) {
          runDbTask(
            () =>
              updateSavedVocabulary(
                currentUserId,
                id,
                updatedEntry,
                updatedEntry.sourceSlug
                  ? getSourceType(updatedEntry.sourceSlug, [
                      ...feedArticles,
                      ...customArticles
                    ])
                  : "manual"
              ),
            "update vocabulary"
          );
        }
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
      authMessage,
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
      reportRecoverableError("Failed to load Supabase user state.", error);
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
  return mergeFeaturedCommunityPosts(
    posts.map((post) => ({
      ...post,
      authorName: post.authorName ?? "Unknown",
      sourceSnapshots: post.sourceSnapshots ?? []
    }))
  );
}

async function loadRemoteCommunityPosts() {
  if (!isSupabaseConfigured) {
    return [];
  }

  const [analysisPosts, pollPosts] = await Promise.all([
    getCommunityAnalysisPosts(),
    getCommunityPolls()
  ]);

  return mergeFeaturedCommunityPosts([...analysisPosts, ...pollPosts]);
}

function accountKey(username: string) {
  return username.trim().toLowerCase();
}

async function ensureAuthProfile(
  userId: string,
  email: string,
  displayName?: string
) {
  const existingUser = await getUserById(userId);

  if (existingUser) {
    return existingUser;
  }

  return ensureUserProfile({
    id: userId,
    email,
    username: displayName?.trim() || usernameFromEmail(email)
  });
}

function usernameFromEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  return normalizedEmail || `user-${crypto.randomUUID().slice(0, 8)}`;
}

function getAuthDisplayName(user: { user_metadata?: Record<string, unknown> }) {
  const username = user.user_metadata?.username;

  return typeof username === "string" ? username : undefined;
}

function toAuthErrorMessage(message: string | undefined, fallback: string) {
  if (!message) {
    return fallback;
  }

  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("rate limit")) {
    return "이메일 발송 제한에 걸렸습니다. 잠시 후 다시 시도하거나 Supabase SMTP 설정을 확인해주세요.";
  }

  return message;
}

function toLoginErrorMessage(message: string | undefined) {
  if (!message) {
    return "없는 ID 또는 비밀번호 입니다.";
  }

  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("email not confirmed")) {
    return "이메일 인증을 먼저 완료해주세요.";
  }

  if (normalizedMessage.includes("rate limit")) {
    return "로그인 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
  }

  if (
    normalizedMessage.includes("invalid login credentials") ||
    normalizedMessage.includes("invalid credentials")
  ) {
    return "없는 ID 또는 비밀번호 입니다.";
  }

  return message;
}

function syncUserInterests(userId: string | null, interests: Category[]) {
  if (!userId || !isSupabaseConfigured) {
    return;
  }

  runDbTask(() => replaceUserInterests(userId, interests), "sync interests");
}

function runDbTask(task: () => Promise<unknown>, label: string) {
  task().catch((error) => {
    reportRecoverableError(`Failed to ${label}.`, error);
  });
}

function reportRecoverableError(message: string, error: unknown) {
  console.warn(message, normalizeErrorForLog(error));
}

function normalizeErrorForLog(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message
    };
  }

  if (isSupabaseErrorLike(error)) {
    return {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    };
  }

  return error;
}

function isSupabaseErrorLike(error: unknown): error is SupabaseErrorLike {
  return Boolean(
    error &&
      typeof error === "object" &&
      ("message" in error || "code" in error || "details" in error || "hint" in error)
  );
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
