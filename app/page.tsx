import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { CategoryFilter } from "@/app/components/categories/CategoryFilter";
import { PostFeedSkeleton } from "@/app/components/posts/PostCardSkeleton";
import { InfinitePostList } from "@/app/components/posts/InfinitePostList";
import { fetchPosts, type FeedFilter } from "@/app/actions/posts";
import type { PostCard } from "@/lib/types";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

async function PostList({ categorySlug }: { categorySlug?: string }) {
  const filter: FeedFilter = { type: "home", categorySlug };
  const { posts, hasMore } = await fetchPosts(filter, 0);

  return (
    <InfinitePostList
      initialPosts={posts}
      filter={filter}
      initialHasMore={hasMore}
    />
  );
}

export default async function Home({ searchParams }: Props) {
  const { category } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <>
      <Suspense fallback={null}>
        <CategoryFilter categories={categories || []} />
      </Suspense>

      <Suspense fallback={<PostFeedSkeleton />}>
        <PostList categorySlug={category} />
      </Suspense>
    </>
  );
}
