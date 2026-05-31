"use client";

import { FormEvent, useState } from "react";

import { useLearningStore } from "@/providers/learning-store";

export function AuthPanel() {
  const { authError, login } = useLearningStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    await login(username, password);
    setIsSubmitting(false);
  };

  return (
    <main className="mx-auto flex min-h-[72vh] w-full max-w-[1180px] items-center">
      <section className="w-full rounded-[2rem] border border-line bg-paper/85 px-7 py-9 shadow-soft md:px-10 md:py-12">
        <p className="text-sm uppercase tracking-[0.22em] text-clay">
          Sign In
        </p>
        <h1 className="mt-4 max-w-2xl font-[family-name:var(--font-heading)] text-5xl font-semibold leading-tight text-ink md:text-6xl">
          Keep your study space tied to your account.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-clay">
          Use a username and password to continue. A new username creates a new
          study account, and your saved work will sync when Supabase is configured.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-clay">
              Username
            </span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 w-full rounded-[1rem] border border-line bg-paper px-4 py-3 text-base text-ink outline-none soft-ring focus:border-clay"
              autoComplete="username"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-clay">
              Password
            </span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-[1rem] border border-line bg-paper px-4 py-3 text-base text-ink outline-none soft-ring focus:border-clay"
              type="password"
              autoComplete="current-password"
            />
          </label>

          {authError ? <p className="text-sm text-clay">{authError}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="soft-ring rounded-full border border-clay bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
          >
            {isSubmitting ? "Continuing..." : "Continue"}
          </button>
        </form>
      </section>
    </main>
  );
}
