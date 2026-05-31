"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Daily News" },
  { href: "/vocabulary", label: "Vocabulary" },
  { href: "/investigate", label: "Investigate" },
  { href: "/community", label: "Community" }
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {navItems.map((item) => {
        const active =
          item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              active
                ? "border-moss bg-[#f7e2cf] text-ink shadow-soft"
                : "border-line bg-paper/92 text-clay hover:border-clay hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
