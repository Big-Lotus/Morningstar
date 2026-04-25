"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import { SavedVocabulary } from "@/lib/types";

type LearningStoreValue = {
  savedWords: SavedVocabulary[];
  bookmarkedSlugs: string[];
  saveWord: (entry: Omit<SavedVocabulary, "id">) => void;
  removeWord: (id: string) => void;
  toggleBookmark: (slug: string) => void;
};

const STORAGE_KEY = "saetbyeol-learning-store";

const LearningStoreContext = createContext<LearningStoreValue | null>(null);

type PersistedState = {
  savedWords: SavedVocabulary[];
  bookmarkedSlugs: string[];
};

export function LearningStoreProvider({ children }: PropsWithChildren) {
  const [savedWords, setSavedWords] = useState<SavedVocabulary[]>([]);
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    const parsed = JSON.parse(raw) as PersistedState;
    setSavedWords(parsed.savedWords ?? []);
    setBookmarkedSlugs(parsed.bookmarkedSlugs ?? []);
  }, []);

  useEffect(() => {
    const payload: PersistedState = {
      savedWords,
      bookmarkedSlugs
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [bookmarkedSlugs, savedWords]);

  const value = useMemo<LearningStoreValue>(
    () => ({
      savedWords,
      bookmarkedSlugs,
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
              id: `${entry.articleSlug}-${normalizedWord}-${current.length + 1}`
            },
            ...current
          ];
        });
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
      }
    }),
    [bookmarkedSlugs, savedWords]
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
