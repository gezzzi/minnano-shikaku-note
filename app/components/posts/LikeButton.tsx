"use client";

import { useState, useOptimistic, useTransition } from "react";
import { Heart } from "lucide-react";
import { formatCount } from "@/lib/utils/format";

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
}: {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked);
  const [optimisticCount, setOptimisticCount] = useOptimistic(count);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const newLiked = !liked;
    const newCount = newLiked ? count + 1 : count - 1;

    startTransition(async () => {
      setOptimisticLiked(newLiked);
      setOptimisticCount(newCount);

      try {
        const res = await fetch(`/api/likes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        });

        if (res.ok) {
          setLiked(newLiked);
          setCount(newCount);
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
      className="flex items-center gap-1 cursor-pointer"
      aria-label={optimisticLiked ? "いいねを取り消す" : "いいね"}
    >
      <Heart
        className={`w-6 h-6 transition-colors ${
          optimisticLiked
            ? "fill-red-500 text-red-500"
            : "hover:text-red-500"
        }`}
      />
      {optimisticCount > 0 && (
        <span className="text-sm font-semibold">
          {formatCount(optimisticCount)}
        </span>
      )}
    </button>
  );
}
