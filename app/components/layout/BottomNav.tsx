"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, Heart, User } from "lucide-react";

const navItems = [
  { key: "home", href: "/", icon: Home },
  { key: "search", href: "/search", icon: Search },
  { key: "create", href: "/", icon: PlusSquare },
  { key: "likes", href: "/mypage?tab=likes", icon: Heart },
  { key: "mypage", href: "/mypage", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-20 lg:hidden">
      {navItems.map(({ key, href, icon: Icon }) => {
        const isActive =
          href === "/"
            ? pathname === "/"
            : pathname.startsWith(href.split("?")[0]);

        return (
          <Link key={key} href={href} aria-label={key}>
            <Icon
              className={`w-6 h-6 ${isActive ? "text-black" : "text-gray-500"}`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
