"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, Heart, User, LogIn } from "lucide-react";

interface SidebarProps {
  user?: {
    displayName: string;
    avatarUrl: string | null;
  } | null;
  unreadCount?: number;
}

const navItems = [
  { key: "ホーム", href: "/", icon: Home },
  { key: "検索", href: "/search", icon: Search },
  { key: "投稿", href: "/posts/new", icon: PlusSquare },
  { key: "通知", href: "/notifications", icon: Heart },
  { key: "マイページ", href: "/mypage", icon: User },
];

export function Sidebar({ user, unreadCount = 0 }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-[220px] border-r border-gray-100 bg-white flex-col py-6 px-4 z-20">
      {/* Logo */}
      <Link href="/" className="mb-8 px-2">
        <Image
          src="/minnano-shikaku-note-logo.png"
          alt="みんなの資格ノート"
          width={40}
          height={40}
          className="rounded-lg"
        />
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ key, href, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href.split("?")[0]);

          return (
            <Link
              key={key}
              href={href}
              className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors ${
                isActive
                  ? "font-bold text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="relative">
                <Icon className={`w-6 h-6 ${isActive ? "text-black" : ""}`} />
                {key === "通知" && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </span>
              <span className="text-sm">{key}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        {user ? (
          <Link
            href="/mypage"
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.displayName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-500">
                  {user.displayName[0]}
                </div>
              )}
            </div>
            <span className="text-sm font-medium truncate">
              {user.displayName}
            </span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-4 px-3 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <LogIn className="w-6 h-6" />
            <span className="text-sm">ログイン</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
