"use client";

import { useLearningStore } from "@/providers/learning-store";

export function AuthStatus() {
  const { currentUsername, logout } = useLearningStore();

  if (!currentUsername) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-line bg-paper/90 px-3 py-2 text-sm text-clay">
      <span>{currentUsername}</span>
      <button
        type="button"
        onClick={logout}
        className="soft-ring rounded-full border border-line bg-paper px-3 py-1 text-xs uppercase tracking-[0.14em] hover:border-clay hover:text-ink"
      >
        Logout
      </button>
    </div>
  );
}
