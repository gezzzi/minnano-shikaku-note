import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PostCardGrid } from "@/app/components/posts/PostCardGrid";
import { MypageTabs } from "@/app/components/auth/MypageTabs";
import type { PostCard } from "@/lib/types";

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

  const { data: interactions } = activeTab === "bookmarks"
    ? await supabase
        .from("bookmarks")
        .select("post_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : await supabase
        .from("likes")
        .select("post_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

  const postIds = (interactions ?? []).map((i) => i.post_id);

  let posts: PostCard[] = [];
  if (postIds.length > 0) {
    const { data } = await supabase
      .from("posts")
      .select("*, category:categories(name, slug)")
      .in("id", postIds)
      .eq("is_published", true);

    const postMap = new Map(
      ((data || []) as PostCard[]).map((post) => [post.id, post])
    );
    posts = postIds
      .map((id) => postMap.get(id))
      .filter((post): post is PostCard => !!post);
  }

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
        <PostCardGrid posts={posts} />
      </div>
    </div>
  );
}
