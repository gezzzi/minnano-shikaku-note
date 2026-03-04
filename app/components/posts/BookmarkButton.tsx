"use client";

import { useState, useOptimistic, useTransition } from "react";
import { Bookmark } from "lucide-react";

export function BookmarkButton({
  postId,
  initialBookmarked,
}: {
  postId: string;
  initialBookmarked: boolean;
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [optimisticBookmarked, setOptimisticBookmarked] =
    useOptimistic(bookmarked);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const newBookmarked = !bookmarked;

    startTransition(async () => {
      setOptimisticBookmarked(newBookmarked);

      try {
        const res = await fetch(`/api/bookmarks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        });

        if (res.ok) {
          setBookmarked(newBookmarked);
        }
      } catch {
        // Rollback happens automatically
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="cursor-pointer"
      aria-label={optimisticBookmarked ? "ブックマークを解除" : "ブックマーク"}
    >
      <Bookmark
        className={`w-6 h-6 transition-colors ${
          optimisticBookmarked
            ? "fill-black text-black"
            : "hover:text-gray-600"
        }`}
      />
    </button>
  );
}
