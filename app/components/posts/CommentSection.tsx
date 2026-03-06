"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { addComment, deleteComment } from "@/app/actions/comments";
import { formatRelativeDate } from "@/lib/utils/format";
import type { Profile } from "@/lib/types";

interface CommentWithUser {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: Profile;
}

interface Props {
  postId: string;
  postSlug: string;
  comments: CommentWithUser[];
  currentUserId?: string;
}

export function CommentSection({
  postId,
  postSlug,
  comments: initialComments,
  currentUserId,
}: Props) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    const result = await addComment(postId, content);

    if (result.success) {
      setContent("");
      // Reload to get fresh data with user info
      window.location.reload();
    }
    setSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    const result = await deleteComment(commentId, postSlug);
    if (result.success) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  return (
    <div className="px-4 py-4 border-t border-gray-100">
      {/* Comment count */}
      <p className="text-sm text-gray-500 mb-3">
        コメント {comments.length}件
      </p>

      {/* Comment list */}
      <div className="space-y-4 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Link href={`/users/${comment.user_id}`} className="shrink-0">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                {comment.user.avatar_url ? (
                  <Image
                    src={comment.user.avatar_url}
                    alt={comment.user.display_name || ""}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-500">
                    {(comment.user.display_name || "U")[0]}
                  </div>
                )}
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <Link
                  href={`/users/${comment.user_id}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {comment.user.display_name || "ユーザー"}
                </Link>
                <span className="text-xs text-gray-400">
                  {formatRelativeDate(comment.created_at)}
                </span>
                {currentUserId === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="ml-auto text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    aria-label="コメントを削除"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Comment form */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="コメントを追加..."
            className="flex-1 h-9 rounded-full border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-gray-400 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!content.trim() || submitting}
            className="text-sm font-semibold text-blue-500 disabled:text-gray-300 cursor-pointer"
          >
            投稿
          </button>
        </form>
      ) : (
        <Link href="/login" className="text-sm text-blue-500 hover:underline">
          ログインしてコメント
        </Link>
      )}
    </div>
  );
}
