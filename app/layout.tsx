import type { Metadata } from "next";

import "@/app/globals.css";
import { Header } from "@/components/Header";
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
            <Header />
            {children}
          </div>
        </LearningStoreProvider>
      </body>
    </html>
  );
}
