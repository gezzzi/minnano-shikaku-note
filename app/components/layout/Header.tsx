"use client";

import Link from "next/link";
import { Heart, Send } from "lucide-react";
import { UserMenu } from "@/app/components/auth/UserMenu";

interface HeaderProps {
  user?: {
    displayName: string;
    avatarUrl: string | null;
    email: string;
  } | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
        みんなの資格ノート
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link href="/mypage?tab=likes" aria-label="いいね一覧">
              <Heart className="w-6 h-6 text-gray-800" />
            </Link>
            <UserMenu
              displayName={user.displayName}
              avatarUrl={user.avatarUrl}
              email={user.email}
            />
          </>
        ) : (
          <>
            <Link href="/mypage?tab=likes" aria-label="いいね一覧">
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
