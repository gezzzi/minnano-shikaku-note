"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

interface HeaderProps {
  user?: {
    displayName: string;
    avatarUrl: string | null;
  } | null;
  unreadCount?: number;
}

export function Header({ user, unreadCount = 0 }: HeaderProps) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 10) {
        setVisible(true);
      } else if (currentY > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center lg:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Left - avatar link to settings */}
      <div className="flex-1 flex items-center">
        {user ? (
          <Link
            href="/mypage"
            className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-200"
          >
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.displayName}
                fill
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-500">
                {user.displayName[0]}
              </span>
            )}
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-sm font-semibold text-gray-800"
          >
            ログイン
          </Link>
        )}
      </div>

      {/* Center icon */}
      <Link href="/" className="absolute left-1/2 -translate-x-1/2">
        <Image
          src="/minnano-shikaku-note-logo.png"
          alt="みんなの資格ノート"
          width={32}
          height={32}
          className="rounded"
        />
      </Link>

      {/* Right - notifications */}
      <div className="flex-1 flex items-center justify-end">
        <Link href="/notifications" aria-label="通知" className="relative">
          <Heart className="w-6 h-6 text-gray-800" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
