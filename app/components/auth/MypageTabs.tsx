"use client";

import Link from "next/link";
import { Bookmark, Heart } from "lucide-react";

export function MypageTabs({ activeTab }: { activeTab: "bookmarks" | "likes" }) {
  return (
    <div className="flex border-b border-gray-200">
      <Link
        href="/mypage?tab=bookmarks"
        className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
          activeTab === "bookmarks"
            ? "border-b-2 border-gray-900 text-gray-900"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Bookmark className="h-4 w-4" />
        ブックマーク
      </Link>
      <Link
        href="/mypage?tab=likes"
        className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
          activeTab === "likes"
            ? "border-b-2 border-gray-900 text-gray-900"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Heart className="h-4 w-4" />
        いいね
      </Link>
    </div>
  );
}
