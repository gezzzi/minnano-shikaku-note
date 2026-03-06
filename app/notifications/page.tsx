import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { markNotificationsAsRead } from "@/app/actions/notifications";
import { formatRelativeDate } from "@/lib/utils/format";
import type { Profile, Post } from "@/lib/types";

export const metadata: Metadata = {
  title: "通知",
};

interface NotificationWithDetails {
  id: string;
  type: string;
  is_read: boolean;
  created_at: string;
  actor: Profile;
  post: Pick<Post, "id" | "title" | "slug"> | null;
}

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*, actor:profiles!notifications_actor_id_fkey(*), post:posts(id, title, slug)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  // Mark all as read
  await markNotificationsAsRead();

  const items = (notifications || []) as unknown as NotificationWithDetails[];

  return (
    <div className="max-w-md mx-auto">
      <div className="px-4 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold">通知</h1>
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <p className="text-sm">通知はまだありません</p>
        </div>
      ) : (
        <div>
          {items.map((item) => (
            <NotificationItem key={item.id} notification={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
}: {
  notification: NotificationWithDetails;
}) {
  const { actor, type, post, is_read, created_at } = notification;

  const icon =
    type === "like" ? (
      <Heart className="w-4 h-4 text-red-500" />
    ) : type === "comment" ? (
      <MessageCircle className="w-4 h-4 text-blue-500" />
    ) : (
      <UserPlus className="w-4 h-4 text-green-500" />
    );

  const message =
    type === "like"
      ? "があなたの投稿にいいねしました"
      : type === "comment"
        ? "があなたの投稿にコメントしました"
        : "があなたをフォローしました";

  const href =
    type === "follow"
      ? `/users/${actor.id}`
      : post
        ? `/posts/${post.slug}`
        : "/";

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
        !is_read ? "bg-blue-50/50" : ""
      }`}
    >
      <div className="relative shrink-0">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
          {actor.avatar_url ? (
            <Image
              src={actor.avatar_url}
              alt={actor.display_name || ""}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-500">
              {(actor.display_name || "U")[0]}
            </div>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold">
            {actor.display_name || "ユーザー"}
          </span>
          {message}
        </p>
        {post && (
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {post.title}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">
          {formatRelativeDate(created_at)}
        </p>
      </div>
    </Link>
  );
}
