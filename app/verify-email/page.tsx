"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { isSupabaseConfigured, supabase } from "@/lib/db/client";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get("email") ?? "", [searchParams]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleResend = async () => {
    if (!email) {
      setError("재전송할 이메일 정보가 없습니다.");
      setMessage("");
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setError("Supabase Auth 설정이 필요합니다.");
      setMessage("");
      return;
    }

    setIsSending(true);
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    setIsSending(false);

    if (resendError) {
      setError(mapResendError(resendError.message));
      setMessage("");
      return;
    }

    setError("");
    setMessage("인증 메일을 다시 보냈습니다. 메일함을 확인해주세요.");
  };

  return (
    <main className="mx-auto flex min-h-[72dvh] w-full max-w-2xl items-center px-4 py-10">
      <section className="w-full rounded-[1.5rem] border border-white/70 bg-black/34 px-6 py-8 shadow-soft backdrop-blur md:px-8 md:py-9">
        <p className="text-sm font-medium text-moss">Email verification</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-white md:text-5xl">
          이메일 인증중입니다.
        </h1>
        <p className="mt-5 text-base leading-7 text-white/72">
          {email
            ? `${email} 주소로 보낸 인증 링크를 눌러 계정을 활성화해주세요.`
            : "가입할 때 입력한 이메일로 보낸 인증 링크를 눌러 계정을 활성화해주세요."}
        </p>

        <div className="mt-8 space-y-4">
          {error ? <p className="text-sm text-white/72">{error}</p> : null}
          {message ? <p className="text-sm text-moss">{message}</p> : null}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleResend}
              disabled={isSending || !email}
              className="soft-ring rounded-full border border-ink bg-ink px-7 py-3 text-sm font-semibold text-paper transition hover:-translate-y-0.5 hover:bg-moss disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-clay"
            >
              {isSending ? "Sending..." : "Resend email"}
            </button>
            <Link
              href="/"
              className="soft-ring rounded-full border border-white/18 bg-transparent px-5 py-3 text-sm font-medium text-white/68 hover:bg-white/10 hover:text-white"
            >
              Back to login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function mapResendError(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("rate limit")) {
    return "이메일 발송 제한에 걸렸습니다. 잠시 후 다시 시도해주세요.";
  }

  return "인증 메일을 다시 보내지 못했습니다.";
}
