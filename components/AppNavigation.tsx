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
    <nav className="flex flex-wrap items-center gap-1 md:gap-2">
      {navItems.map((item) => {
        const active =
          item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full border border-transparent px-4 py-2 text-sm transition ${
              active
                ? "bg-white/12 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]"
                : "bg-transparent text-white hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
