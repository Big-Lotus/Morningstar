"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { isSupabaseConfigured, supabase } from "@/lib/db/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("이메일 인증을 완료하는 중입니다.");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setMessage("Supabase Auth 설정이 필요합니다.");
      setHasError(true);
      return;
    }

    const authClient = supabase;
    let isCancelled = false;

    async function completeAuth() {
      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        const { error } = await authClient.auth.exchangeCodeForSession(code);

        if (error && !isCancelled) {
          setMessage("인증 링크가 만료되었거나 세션을 확인하지 못했습니다.");
          setHasError(true);
          return;
        }
      }

      const { data } = await authClient.auth.getSession();

      if (isCancelled) {
        return;
      }

      if (data.session) {
        setMessage("인증이 완료되었습니다. MorningStar로 이동합니다.");
        window.setTimeout(() => {
          router.replace("/");
        }, 700);
        return;
      }

      setMessage("인증 링크가 만료되었거나 세션을 확인하지 못했습니다.");
      setHasError(true);
    }

    const timer = window.setTimeout(() => {
      void completeAuth();
    }, 300);

    const {
      data: { subscription }
    } = authClient.auth.onAuthStateChange((_event, session) => {
      if (session && !isCancelled) {
        setMessage("인증이 완료되었습니다. MorningStar로 이동합니다.");
        window.setTimeout(() => {
          router.replace("/");
        }, 700);
      }
    });

    return () => {
      isCancelled = true;
      window.clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <main className="mx-auto flex min-h-[72dvh] w-full max-w-2xl items-center px-4 py-10">
      <section className="w-full rounded-[1.5rem] border border-line bg-paper/92 px-6 py-8 shadow-soft md:px-8 md:py-9">
        <p className="text-sm font-medium text-moss">Authentication</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-ink md:text-5xl">
          계정을 확인하고 있습니다.
        </h1>
        <p className="mt-5 text-base leading-7 text-clay">{message}</p>

        {hasError ? (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="soft-ring rounded-full border border-ink bg-ink px-7 py-3 text-sm font-semibold text-paper transition hover:-translate-y-0.5 hover:bg-moss"
            >
              Back to login
            </Link>
            <Link
              href="/verify-email"
              className="soft-ring rounded-full border border-line bg-transparent px-5 py-3 text-sm font-medium text-clay hover:bg-accent hover:text-ink"
            >
              Email verification
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}
