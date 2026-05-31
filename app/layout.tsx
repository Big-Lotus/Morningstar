import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";
import { AppNavigation } from "@/components/AppNavigation";
import { AuthStatus } from "@/components/AuthStatus";
import { LearningStoreProvider } from "@/providers/learning-store";

export const metadata: Metadata = {
  title: "Saetbyeol",
  description: "A calm news learning space for building English through real issues."
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
          <div className="mx-auto min-h-screen w-full px-2 pb-12 pt-2 md:px-3 lg:px-4">
            <header className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-line/70 bg-paper/82 px-5 py-5 shadow-soft md:flex-row md:items-end md:justify-between md:px-7">
              <div>
                <Link
                  href="/"
                  className="font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-[0.02em] text-ink"
                >
                  Saetbyeol
                </Link>
                <p className="mt-2 max-w-xl text-sm leading-6 text-clay">
                  A calm news learning space that turns real issues into
                  steady English practice.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <AppNavigation />
                <AuthStatus />
              </div>
            </header>
            {children}
          </div>
        </LearningStoreProvider>
      </body>
    </html>
  );
}
