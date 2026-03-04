import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import type { PostCard as PostCardType } from "@/lib/types";
import { formatRelativeDate, formatCount } from "@/lib/utils/format";

export function PostCard({ post }: { post: PostCardType }) {
  return (
    <article className="mb-8 border-b border-gray-100 pb-4">
      {/* Post header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            <span className="text-xs font-bold text-gray-500">
              {post.category.name.slice(0, 1)}
            </span>
          </div>
          <span className="font-semibold text-sm">{post.category.name}</span>
        </div>
        <span className="text-xs text-gray-400">
          {formatRelativeDate(post.created_at)}
        </span>
      </div>

      {/* Image */}
      <Link href={`/posts/${post.slug}`}>
        <div className="relative aspect-square bg-gray-100">
          {post.thumbnail_url ? (
            <Image
              src={post.thumbnail_url}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, 512px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
      </Link>

      {/* Actions */}
      <div className="px-4 py-3">
        <div className="flex justify-between mb-3">
          <div className="flex gap-4">
            <Heart className="w-6 h-6 hover:text-red-500 cursor-pointer transition-colors" />
            <Send className="w-6 h-6 cursor-pointer" />
          </div>
          <Bookmark className="w-6 h-6 cursor-pointer" />
        </div>

        {/* Like count */}
        <div className="font-semibold text-sm mb-1">
          {formatCount(post.likes_count)} いいね
        </div>

        {/* Caption */}
        <div className="text-sm">
          <Link href={`/posts/${post.slug}`} className="hover:underline">
            <span className="font-semibold mr-2">{post.category.name}</span>
            {post.title}
          </Link>
        </div>
      </div>
    </article>
  );
}
