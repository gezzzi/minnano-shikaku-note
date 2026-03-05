"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PostCard } from "@/app/components/posts/PostCard";
import { PostCardSkeleton } from "@/app/components/posts/PostCardSkeleton";
import { fetchPosts, type FeedFilter } from "@/app/actions/posts";
import type { PostCard as PostCardType } from "@/lib/types";

interface Props {
  initialPosts: PostCardType[];
  filter: FeedFilter;
  initialHasMore: boolean;
}

export function InfinitePostList({
  initialPosts,
  filter,
  initialHasMore,
}: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const result = await fetchPosts(filter, page);
      setPosts((prev) => [...prev, ...result.posts]);
      setHasMore(result.hasMore);
      setPage((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [filter, page, loading, hasMore]);

  useEffect(() => {
    const el = observerRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  if (posts.length === 0 && !loading) {
    return (
      <div className="py-16 text-center text-gray-500">
        <p className="text-lg font-medium">コンテンツが見つかりません</p>
        <p className="mt-1 text-sm">条件を変えて再度お試しください</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {loading && (
        <div>
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      )}

      {hasMore && !loading && <div ref={observerRef} className="h-10" />}

      {!hasMore && posts.length > 0 && (
        <p className="py-8 text-center text-sm text-gray-400">
          すべて表示しました
        </p>
      )}
    </div>
  );
}
