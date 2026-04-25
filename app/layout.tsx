import type { Metadata } from "next";
import Link from "next/link";

import "@/app/globals.css";
import { LearningStoreProvider } from "@/providers/learning-store";

export const metadata: Metadata = {
  title: "Saetbyeol",
  description: "A calm editorial reading space for learning English through daily news."
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
          <div className="mx-auto min-h-screen max-w-[1200px] px-5 pb-16 pt-6 md:px-8">
            <header className="mb-10 flex flex-col gap-4 border-b border-line/80 pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <Link
                  href="/"
                  className="font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-[0.02em] text-ink"
                >
                  Saetbyeol
                </Link>
                <p className="mt-2 max-w-xl text-sm leading-6 text-clay">
                  A calm editorial reading space for building English through one
                  clear story at a time.
                </p>
              </div>

              <nav className="flex flex-wrap gap-2">
                <Link
                  href="/"
                  className="rounded-full border border-line bg-paper/90 px-4 py-2 text-sm text-clay transition hover:border-clay hover:text-ink"
                >
                  Daily News
                </Link>
                <Link
                  href="/vocabulary"
                  className="rounded-full border border-line bg-paper/90 px-4 py-2 text-sm text-clay transition hover:border-clay hover:text-ink"
                >
                  Vocabulary
                </Link>
                <Link
                  href="/bookmarks"
                  className="rounded-full border border-line bg-paper/90 px-4 py-2 text-sm text-clay transition hover:border-clay hover:text-ink"
                >
                  Bookmarks
                </Link>
              </nav>
            </header>
            {children}
          </div>
        </LearningStoreProvider>
      </body>
    </html>
  );
}
