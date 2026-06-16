import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";
import { AppNavigation } from "@/components/AppNavigation";
import { AuthStatus } from "@/components/AuthStatus";
import { LearningStoreProvider } from "@/providers/learning-store";

export const metadata: Metadata = {
  title: "MorningStar",
  description: "A clean news learning desk for collecting stories, vocabulary, and investigations."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-canvas font-[family-name:var(--font-body)] text-ink antialiased">
        <LearningStoreProvider>
          <div className="mx-auto min-h-screen w-full max-w-[1500px] px-0 pb-14 pt-0 md:px-0 lg:px-0">
            <header className="sticky top-0 z-30 mb-7 border-b border-white/12 bg-[rgba(6,6,7,0.88)] shadow-[0_10px_40px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
              <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-6 px-6 py-5 md:px-8 lg:px-10">
                <Link
                  href="/"
                  className="shrink-0 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-0.03em] text-white"
                >
                  MorningStar
                </Link>

                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  <AppNavigation />
                  <AuthStatus />
                </div>
              </div>
            </header>
            <div className="px-3 md:px-5 lg:px-7">
              {children}
            </div>
          </div>
        </LearningStoreProvider>
      </body>
    </html>
  );
}
