import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FollowButton } from "@/app/components/follow/FollowButton";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", id)
    .single();

  if (!profile) return { title: "ユーザーが見つかりません" };
  return { title: profile.display_name || "ユーザー" };
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) notFound();

  // Get follower/following counts
  const [{ count: followersCount }, { count: followingCount }] =
    await Promise.all([
      supabase
        .from("follows")
        .select("id", { count: "exact", head: true })
        .eq("following_id", id),
      supabase
        .from("follows")
        .select("id", { count: "exact", head: true })
        .eq("follower_id", id),
    ]);

  // Check if current user is following this user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isFollowing = false;
  const isOwnProfile = user?.id === id;

  if (user && !isOwnProfile) {
    const { data: follow } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", id)
      .maybeSingle();
    isFollowing = !!follow;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/"
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </Link>
        <h1 className="text-xl font-bold">
          {profile.display_name || "ユーザー"}
        </h1>
      </div>

      {/* Profile info */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gray-200">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.display_name || ""}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-gray-500">
              {(profile.display_name || "U")[0]}
            </div>
          )}
        </div>

        <div className="flex gap-8 text-center">
          <div>
            <p className="font-bold">{followersCount ?? 0}</p>
            <p className="text-xs text-gray-500">フォロワー</p>
          </div>
          <div>
            <p className="font-bold">{followingCount ?? 0}</p>
            <p className="text-xs text-gray-500">フォロー中</p>
          </div>
        </div>
      </div>

      {/* Follow button */}
      {user && !isOwnProfile && (
        <div className="mb-6">
          <FollowButton userId={id} initialFollowing={isFollowing} />
        </div>
      )}

      {isOwnProfile && (
        <div className="mb-6">
          <Link
            href="/mypage/settings"
            className="block text-center px-4 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors"
          >
            プロフィールを編集
          </Link>
        </div>
      )}

      {!user && (
        <div className="mb-6">
          <Link
            href="/login"
            className="block text-center px-4 py-1.5 rounded-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            ログインしてフォロー
          </Link>
        </div>
      )}

      {/* Placeholder for future posts */}
      <div className="py-12 text-center text-gray-400">
        <p className="text-sm">まだ投稿はありません</p>
      </div>
    </div>
  );
}
