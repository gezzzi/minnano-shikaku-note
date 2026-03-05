import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { InfinitePostList } from "@/app/components/posts/InfinitePostList";
import { MypageTabs } from "@/app/components/auth/MypageTabs";
import { fetchPosts, type FeedFilter } from "@/app/actions/posts";

export const metadata: Metadata = {
  title: "マイページ",
};

export default async function MypagePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab === "likes" ? "likes" : "bookmarks";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const filter: FeedFilter = { type: activeTab, userId: user.id };
  const { posts, hasMore } = await fetchPosts(filter, 0);

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Profile header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.display_name || ""}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-bold text-gray-500">
                {(profile?.display_name || "U")[0]}
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold">{profile?.display_name || "ユーザー"}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
        <Link
          href="/mypage/settings"
          className="rounded-full p-2 hover:bg-gray-100 transition-colors"
          aria-label="設定"
        >
          <Settings className="h-5 w-5 text-gray-500" />
        </Link>
      </div>

      {/* Tabs */}
      <MypageTabs activeTab={activeTab} />

      {/* Content */}
      <div className="mt-4">
        <InfinitePostList
          initialPosts={posts}
          filter={filter}
          initialHasMore={hasMore}
        />
      </div>
    </div>
  );
}
