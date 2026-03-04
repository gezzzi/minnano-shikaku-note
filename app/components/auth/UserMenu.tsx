"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Settings, Bookmark } from "lucide-react";
import { signOut } from "@/app/actions/auth";

interface UserMenuProps {
  displayName: string;
  avatarUrl: string | null;
  email: string;
}

export function UserMenu({ displayName, avatarUrl, email }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-200 cursor-pointer"
        aria-label="ユーザーメニュー"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            fill
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-500">
            {displayName[0]}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
          </div>
          <div className="py-1">
            <Link
              href="/mypage"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
            >
              <Bookmark className="h-4 w-4 text-gray-500" />
              マイページ
            </Link>
            <Link
              href="/mypage/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-4 w-4 text-gray-500" />
              設定
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                ログアウト
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
