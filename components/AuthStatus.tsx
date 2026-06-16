"use client";

import { useLearningStore } from "@/providers/learning-store";

export function AuthStatus() {
  const { currentUsername, logout } = useLearningStore();

  if (!currentUsername) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-transparent bg-transparent px-1 py-1 text-sm text-white/78">
      <span>{currentUsername}</span>
      <button
        type="button"
        onClick={logout}
        className="soft-ring rounded-full border border-transparent bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-moss hover:text-ink"
      >
        Logout
      </button>
    </div>
  );
}
