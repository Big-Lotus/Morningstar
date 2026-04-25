"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Daily News" },
  { href: "/vocabulary", label: "Vocabulary" },
  { href: "/bookmarks", label: "Bookmarks" }
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="mb-10 flex flex-col gap-4 border-b border-line/80 pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        <Link
          href="/"
          className="font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-[0.02em] text-ink"
        >
          Saetbyeol
        </Link>
        <p className="mt-2 max-w-xl text-sm leading-6 text-clay">
          A calm editorial reading space for building English through one clear
          story at a time.
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                active
                  ? "border-moss bg-moss text-paper"
                  : "border-line bg-paper/90 text-clay hover:border-clay hover:text-ink"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
