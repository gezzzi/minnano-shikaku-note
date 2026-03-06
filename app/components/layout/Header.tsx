"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { UserMenu } from "@/app/components/auth/UserMenu";

interface HeaderProps {
  user?: {
    displayName: string;
    avatarUrl: string | null;
    email: string;
  } | null;
  unreadCount?: number;
}

export function Header({ user, unreadCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
        みんなの資格ノート
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link href="/notifications" aria-label="通知" className="relative">
              <Heart className="w-6 h-6 text-gray-800" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
            <UserMenu
              displayName={user.displayName}
              avatarUrl={user.avatarUrl}
              email={user.email}
            />
          </>
        ) : (
          <>
            <Link href="/notifications" aria-label="通知">
              <Heart className="w-6 h-6 text-gray-800" />
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-800"
            >
              ログイン
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
