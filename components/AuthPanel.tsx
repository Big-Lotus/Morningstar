"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { SplineComputer } from "@/components/SplineComputer";
import { useLearningStore } from "@/providers/learning-store";

type AuthMode = "signin" | "signup" | "reset";

export function AuthPanel() {
  const { authError, authMessage, login, sendPasswordReset, signup } =
    useLearningStore();
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "reset") {
      await handlePasswordReset();
      return;
    }

    setIsSubmitting(true);
    if (mode === "signin") {
      await login(username, password);
    } else {
      const result = await signup(username, password, displayName);

      if (result === "pending") {
        router.push(`/verify-email?email=${encodeURIComponent(username.trim())}`);
      }
    }
    setIsSubmitting(false);
  };

  const handlePasswordReset = async () => {
    setIsResettingPassword(true);
    await sendPasswordReset(username);
    setIsResettingPassword(false);
  };

  return (
    <main className="relative mx-auto min-h-[82dvh] w-full overflow-hidden rounded-[2rem] border border-line bg-paper shadow-soft">
      <SplineComputer
        variant="background"
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,252,0.96)_0%,rgba(255,255,252,0.82)_42%,rgba(255,255,252,0.36)_72%,rgba(238,248,246,0.2)_100%)]" />
      <div className="relative z-10 flex min-h-[82dvh] items-center px-5 py-8 md:px-10">
        <section className="w-full max-w-xl rounded-[1.5rem] border border-line/80 bg-paper/74 px-6 py-8 shadow-[0_24px_70px_rgba(23,23,23,0.12)] backdrop-blur-xl md:px-8 md:py-9">
          <p className="text-sm font-medium text-moss">
            {mode === "signin"
              ? "Sign in"
              : mode === "signup"
                ? "Create account"
                : "Reset password"}
          </p>
          <h1 className="mt-4 max-w-2xl font-[family-name:var(--font-heading)] text-5xl font-semibold leading-[1.02] tracking-[-0.06em] text-ink md:text-7xl">
            Your clean desk for daily news.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-clay">
            {mode === "signin"
              ? "Use your email ID and password to continue."
              : mode === "signup"
                ? "Create an account first, then keep saved work attached to your username."
                : "Enter your email ID and we will send a password reset link."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 max-w-xl space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-clay">
                Email ID
              </span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 w-full rounded-[0.9rem] border border-line bg-white/92 px-4 py-3 text-base text-ink outline-none soft-ring focus:border-moss"
                type="email"
                autoComplete="email"
              />
            </label>

            {mode === "signup" ? (
              <label className="block">
                <span className="text-xs font-medium text-clay">Username</span>
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className="mt-2 w-full rounded-[0.9rem] border border-line bg-white/92 px-4 py-3 text-base text-ink outline-none soft-ring focus:border-moss"
                  autoComplete="username"
                />
              </label>
            ) : null}

            {mode !== "reset" ? (
              <label className="block">
                <span className="text-xs font-medium text-clay">
                  Password
                </span>
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-[0.9rem] border border-line bg-white/92 px-4 py-3 text-base text-ink outline-none soft-ring focus:border-moss"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                />
              </label>
            ) : null}

            {authError ? <p className="text-sm text-clay">{authError}</p> : null}
            {authMessage ? <p className="text-sm text-moss">{authMessage}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting || isResettingPassword}
              className="soft-ring rounded-full border border-ink bg-ink px-7 py-3 text-sm font-semibold text-paper transition hover:-translate-y-0.5 hover:bg-moss disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
            >
              {isSubmitting
                ? "Continuing..."
                : mode === "signin"
                  ? "Login"
                  : mode === "signup"
                    ? "Sign up"
                    : isResettingPassword
                      ? "Sending reset link..."
                      : "Send reset link"}
            </button>
            <button
              type="button"
              onClick={() => setMode((current) => (current === "signup" ? "signin" : "signup"))}
              className="ml-3 text-sm font-medium text-clay transition hover:text-ink"
            >
              {mode === "signup"
                ? "Already have an account? Login"
                : "Need an account? Sign up"}
            </button>
            {mode === "signin" ? (
              <button
                type="button"
                onClick={() => setMode("reset")}
                disabled={isResettingPassword}
                className="block text-sm font-medium text-clay transition hover:text-ink disabled:cursor-not-allowed disabled:opacity-55"
              >
                Forgot password?
              </button>
            ) : null}
            {mode === "reset" ? (
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="block text-sm font-medium text-clay transition hover:text-ink"
              >
                Back to login
              </button>
            ) : null}
          </form>
        </section>
      </div>
    </main>
  );
}
