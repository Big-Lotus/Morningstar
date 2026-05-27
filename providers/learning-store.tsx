"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import { Category, ComposedArticle, SavedVocabulary } from "@/lib/types";

type LearningStoreValue = {
  savedWords: SavedVocabulary[];
  bookmarkedSlugs: string[];
  selectedInterests: Category[];
  hasCompletedOnboarding: boolean;
  composedArticles: ComposedArticle[];
  setSelectedInterests: (interests: Category[]) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  saveWord: (entry: Omit<SavedVocabulary, "id">) => void;
  hasSavedWord: (word: string, sentence: string) => boolean;
  removeWord: (id: string) => void;
  toggleBookmark: (slug: string) => void;
  addComposedArticle: (entry: Omit<ComposedArticle, "id" | "createdAt">) => void;
};

const STORAGE_KEY = "saetbyeol-learning-store";

const LearningStoreContext = createContext<LearningStoreValue | null>(null);

type PersistedState = {
  savedWords: SavedVocabulary[];
  bookmarkedSlugs: string[];
  selectedInterests: Category[];
  hasCompletedOnboarding: boolean;
  composedArticles: ComposedArticle[];
};

export function LearningStoreProvider({ children }: PropsWithChildren) {
  const [savedWords, setSavedWords] = useState<SavedVocabulary[]>([]);
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterestsState] = useState<Category[]>([]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [composedArticles, setComposedArticles] = useState<ComposedArticle[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    const parsed = JSON.parse(raw) as PersistedState;
    setSavedWords(parsed.savedWords ?? []);
    setBookmarkedSlugs(parsed.bookmarkedSlugs ?? []);
    setSelectedInterestsState(parsed.selectedInterests ?? []);
    setHasCompletedOnboarding(parsed.hasCompletedOnboarding ?? false);
    setComposedArticles(parsed.composedArticles ?? []);
  }, []);

  useEffect(() => {
    const payload: PersistedState = {
      savedWords,
      bookmarkedSlugs,
      selectedInterests,
      hasCompletedOnboarding,
      composedArticles
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    bookmarkedSlugs,
    composedArticles,
    hasCompletedOnboarding,
    savedWords,
    selectedInterests
  ]);

  const value = useMemo<LearningStoreValue>(
    () => ({
      savedWords,
      bookmarkedSlugs,
      selectedInterests,
      hasCompletedOnboarding,
      composedArticles,
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

        if (!normalizedWord || !normalizedSentence) {
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
        setBookmarkedSlugs((current) =>
          current.includes(slug)
            ? current.filter((item) => item !== slug)
            : [...current, slug]
        );
      },
      addComposedArticle: (entry) => {
        const title = entry.title.trim();
        const body = entry.body.trim();

        if (!title || !body || entry.sourceSlugs.length === 0) {
          return;
        }

        setComposedArticles((current) => [
          {
            ...entry,
            title,
            body,
            id: `composition-${Date.now()}`,
            createdAt: new Date().toISOString()
          },
          ...current
        ]);
      }
    }),
    [
      bookmarkedSlugs,
      composedArticles,
      hasCompletedOnboarding,
      savedWords,
      selectedInterests
    ]
  );

  return (
    <LearningStoreContext.Provider value={value}>
      {children}
    </LearningStoreContext.Provider>
  );
}

export function useLearningStore() {
  const context = useContext(LearningStoreContext);

  if (!context) {
    throw new Error("useLearningStore must be used within LearningStoreProvider");
  }

  return context;
}
