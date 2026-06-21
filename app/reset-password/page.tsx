"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

import { isSupabaseConfigured, supabase } from "@/lib/db/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setError("Supabase Auth 설정이 필요합니다.");
      setIsReady(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setHasRecoverySession(Boolean(data.session));

      if (!data.session) {
        setError("재설정 링크가 만료되었거나 올바르지 않습니다.");
      }

      setIsReady(true);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasRecoverySession(true);
        setError("");
        setIsReady(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isSupabaseConfigured || !supabase) {
      setError("Supabase Auth 설정이 필요합니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      setMessage("");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 서로 일치하지 않습니다.");
      setMessage("");
      return;
    }

    setIsSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password
    });
    setIsSubmitting(false);

    if (updateError) {
      setError("비밀번호를 변경하지 못했습니다.");
      setMessage("");
      return;
    }

    setError("");
    setPassword("");
    setConfirmPassword("");
    setMessage("비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.");
    setHasRecoverySession(false);
    await supabase.auth.signOut();
  };

  const canUseForm = isReady && hasRecoverySession;

  return (
    <main className="mx-auto flex min-h-[72dvh] w-full max-w-2xl items-center px-4 py-10">
      <section className="w-full rounded-[1.5rem] border border-line bg-paper/92 px-6 py-8 shadow-soft md:px-8 md:py-9">
        <p className="text-sm font-medium text-moss">Reset password</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-ink md:text-5xl">
          Set a new password.
        </h1>
        <p className="mt-5 text-base leading-7 text-clay">
          Enter a new password for your MorningStar account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-xs font-medium text-clay">New password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-[0.9rem] border border-line bg-white/92 px-4 py-3 text-base text-ink outline-none soft-ring focus:border-moss"
              type="password"
              autoComplete="new-password"
              disabled={!canUseForm}
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium text-clay">
              Confirm new password
            </span>
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-2 w-full rounded-[0.9rem] border border-line bg-white/92 px-4 py-3 text-base text-ink outline-none soft-ring focus:border-moss"
              type="password"
              autoComplete="new-password"
              disabled={!canUseForm}
            />
          </label>

          {error ? <p className="text-sm text-clay">{error}</p> : null}
          {message ? <p className="text-sm text-moss">{message}</p> : null}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={!canUseForm || isSubmitting}
              className="soft-ring rounded-full border border-ink bg-ink px-7 py-3 text-sm font-semibold text-paper transition hover:-translate-y-0.5 hover:bg-moss disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
            >
              {isSubmitting ? "Updating..." : "Update password"}
            </button>
            <Link
              href="/"
              className="soft-ring rounded-full border border-line bg-transparent px-5 py-3 text-sm font-medium text-clay hover:bg-accent hover:text-ink"
            >
              Back to login
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
